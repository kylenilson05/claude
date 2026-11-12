// App state: one React context. Persists the profile, settings, XP, best scores and
// today's stack progress to AsyncStorage. Production replaces the local parts with
// Supabase (profiles, daily_scores, free_play_best) — see README.md.
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { CATS, DAILY_CAT, GAMES, GROUP_ORDER, PARTY_CATS, type DailyKey, type FreeKey } from './data';
import { todayKey, W } from './util';

export const NAME_SECONDS = 45;
export const PARTY_SECONDS = 30;
export const TRIVIA_SECONDS = 10;
export const XP_PER_LEVEL = 500;

export type User = { name: string; year: string; school: string };
export type Settings = { sound: boolean; haptics: boolean; reminder: boolean };
export type Result = { score: number; detail: string };
export type NE = {
  cat: string;
  found: string[];
  input: string;
  endsAt: number;
  secs: number;
  over: boolean;
  flash: string;
  tone: 'ok' | 'bad' | 'meh';
};
export type Tune = { guesses: string[]; over: boolean; won: boolean };
export type Groups = { order: string[]; sel: string[]; solved: number[]; mistakes: number; over: boolean };
export type Party = {
  players: string[];
  scores: number[];
  cats: string[];
  turn: number;
  offset: number;
  phase: 'setup' | 'pass' | 'play' | 'done';
};
export type Sheet =
  | { kind: 'daily'; key: DailyKey }
  | { kind: 'free'; key: FreeKey; score: number; detail: string };

type State = {
  hydrated: boolean;
  user: User | null;
  settings: Settings;
  xp: number;
  best: Partial<Record<FreeKey, number>>;
  date: string;
  done: Partial<Record<DailyKey, Result>>;
  starts: Partial<Record<DailyKey, number>>;
  tune: Tune;
  gr: Groups;
  neDaily: NE | null;
  party: Party;
  neParty: NE | null;
  sheet: Sheet | null;
  freeRun: number;
  toast: string | null;
};

const freshDaily = () => ({
  date: todayKey(),
  done: {},
  starts: {},
  tune: { guesses: [], over: false, won: false },
  gr: { order: GROUP_ORDER.slice(), sel: [], solved: [], mistakes: 0, over: false },
  neDaily: null,
});

const initial = (): State => ({
  hydrated: false,
  user: null,
  settings: { sound: true, haptics: true, reminder: true },
  xp: 0,
  best: {},
  ...freshDaily(),
  party: { players: ['You', 'Maya', 'Jordan'], scores: [], cats: [], turn: 0, offset: 0, phase: 'setup' },
  neParty: null,
  sheet: null,
  freeRun: 0,
  toast: null,
});

const KEY = 'stacked:v1';
const PERSISTED = ['user', 'settings', 'xp', 'best', 'date', 'done', 'starts', 'tune', 'gr', 'neDaily'] as const;

export const newNE = (cat: string, secs: number): NE => ({
  cat, found: [], input: '', endsAt: Date.now() + secs * 1000, secs, over: false, flash: '', tone: 'ok',
});

type Patch = Partial<State> | ((s: State) => Partial<State> | null);
type Haptic = 'tap' | 'success' | 'error';

function useStoreValue() {
  const [s, setS] = useState<State>(initial);
  const ref = useRef(s);
  ref.current = s;
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const set = useCallback((p: Patch) => {
    setS((prev) => {
      const next = typeof p === 'function' ? p(prev) : p;
      return next ? { ...prev, ...next } : prev;
    });
  }, []);

  const later = useCallback((name: string, ms: number, fn: () => void) => {
    clearTimeout(timers.current[name]);
    timers.current[name] = setTimeout(fn, ms);
  }, []);

  // Load saved state once; reset the daily part when the date has changed.
  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        const saved = raw ? JSON.parse(raw) : {};
        const daily = saved.date === todayKey() ? {} : freshDaily();
        set({ ...saved, ...daily, hydrated: true });
      })
      .catch(() => set({ hydrated: true }));
  }, [set]);

  useEffect(() => {
    if (!s.hydrated) return;
    const out: Record<string, unknown> = {};
    for (const k of PERSISTED) out[k] = s[k];
    AsyncStorage.setItem(KEY, JSON.stringify(out)).catch(() => {});
  }, [s]);

  const actions = useMemo(() => {
    const toast = (msg: string) => {
      set({ toast: msg });
      later('toast', 1700, () => set({ toast: null }));
    };

    const haptic = (kind: Haptic) => {
      if (!ref.current.settings.haptics || Platform.OS === 'web') return;
      if (kind === 'tap') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      else Haptics.notificationAsync(kind === 'success' ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error).catch(() => {});
    };

    const nextDaily = (): DailyKey | undefined => GAMES.map((g) => g.key).find((k) => !ref.current.done[k]);

    const openDaily = (key: DailyKey, replace = false) => {
      set((st) => ({
        starts: st.starts[key] ? st.starts : { ...st.starts, [key]: Date.now() },
        neDaily: key === 'name' && !st.neDaily ? newNE(DAILY_CAT, NAME_SECONDS) : st.neDaily,
        sheet: null,
      }));
      (replace ? router.replace : router.push)(`/play/${key}`);
    };

    const finishDaily = (key: DailyKey, score: number, detail: string) => {
      haptic(score > 0 ? 'success' : 'error');
      set((st) => ({ done: { ...st.done, [key]: { score, detail } }, xp: st.xp + score }));
      later('sheet', 750, () => set({ sheet: { kind: 'daily', key } }));
    };

    const finishFree = (key: FreeKey, score: number, detail: string) => {
      set((st) => ({ xp: st.xp + Math.round(score / 2), best: { ...st.best, [key]: Math.max(score, st.best[key] || 0) } }));
      later('sheet', 750, () => set({ sheet: { kind: 'free', key, score, detail } }));
    };

    const openFree = (key: FreeKey, replace = false) => {
      set((st) => ({ freeRun: st.freeRun + 1, sheet: null }));
      if (replace) router.replace(`/free/${key}`);
      else router.push(`/free/${key}`);
    };

    // Name 'Em, shared by the daily game and party mode.
    const neSubmit = (which: 'neDaily' | 'neParty') => {
      const ne = ref.current[which];
      if (!ne || ne.over) return;
      const v = W(ne.input);
      if (!v) return;
      const cands = [v, v.replace(/ies$/, 'y'), v.replace(/es$/, ''), v.replace(/s$/, '')];
      const hit = CATS[ne.cat].find((x) => cands.includes(W(x)));
      let found = ne.found;
      let flash: string;
      let tone: NE['tone'];
      if (!hit) { flash = 'Not on the list'; tone = 'bad'; haptic('error'); }
      else if (found.some((f) => W(f) === W(hit))) { flash = 'Already got that'; tone = 'meh'; }
      else { found = [hit, ...found]; flash = ['Nice', 'Yes', 'Got it', 'Keep going'][found.length % 4]; tone = 'ok'; haptic('success'); }
      set({ [which]: { ...ne, found, input: '', flash, tone } } as Partial<State>);
      later('flash', 900, () => set((st) => (st[which] ? ({ [which]: { ...st[which]!, flash: '' } } as Partial<State>) : null)));
    };

    const endNE = (which: 'neDaily' | 'neParty') => {
      const cur = ref.current[which];
      if (!cur || cur.over) return;
      const ne: NE = { ...cur, over: true, flash: "Time's up", tone: 'bad' };
      set({ [which]: ne } as Partial<State>);
      if (which === 'neDaily') {
        finishDaily('name', Math.min(100, ne.found.length * 10), `${ne.found.length} ${ne.cat} named in ${ne.secs} seconds`);
      } else {
        later('party', 1600, () =>
          set((st) => {
            const p = st.party;
            const scores = p.scores.slice();
            scores[p.turn] = ne.found.length;
            const last = p.turn + 1 >= p.players.length;
            return { party: { ...p, scores, turn: last ? p.turn : p.turn + 1, phase: last ? 'done' : 'pass' }, neParty: null };
          }),
        );
      }
    };

    const beginParty = (offset: number) =>
      set((st) => {
        const players = st.party.players.map((n, i) => n.trim() || 'Player ' + (i + 1));
        return {
          party: { ...st.party, players, offset, scores: [], turn: 0, phase: 'pass', cats: players.map((_, i) => PARTY_CATS[(i + offset) % PARTY_CATS.length]) },
        };
      });

    const signOut = () => {
      set({ user: null, sheet: null });
      router.replace('/welcome');
    };

    const deleteAccount = () => {
      // Production: call a Supabase Edge Function that deletes the user's rows and auth record.
      AsyncStorage.removeItem(KEY).catch(() => {});
      set({ ...initial(), hydrated: true });
      router.replace('/welcome');
      toast('Account deleted');
    };

    return { set, toast, haptic, nextDaily, openDaily, finishDaily, finishFree, openFree, neSubmit, endNE, beginParty, signOut, deleteAccount };
  }, [set, later]);

  // Name 'Em clocks keep running while you're on another screen.
  useEffect(() => {
    const iv = setInterval(() => {
      const st = ref.current;
      for (const w of ['neDaily', 'neParty'] as const) {
        const ne = st[w];
        if (ne && !ne.over && Date.now() >= ne.endsAt) actions.endNE(w);
      }
    }, 200);
    return () => clearInterval(iv);
  }, [actions]);

  return { s, ...actions };
}

type Store = ReturnType<typeof useStoreValue>;
const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const value = useStoreValue();
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useStore outside StoreProvider');
  return v;
}

/** Re-render every `ms` while `on` is true; returns Date.now(). */
export function useNow(ms: number, on = true) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!on) return;
    const iv = setInterval(() => setNow(Date.now()), ms);
    return () => clearInterval(iv);
  }, [ms, on]);
  return on ? Date.now() : now;
}

export const levelOf = (xp: number) => Math.floor(xp / XP_PER_LEVEL) + 1;
export const myInitials = (u: User | null) => (u?.name ? u.name.replace(/[^a-z0-9]/gi, '').slice(0, 2) : '').toUpperCase() || 'ME';
