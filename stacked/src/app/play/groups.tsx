import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GameHeader } from '../../components/chrome';
import { Button, Chamfer } from '../../components/ui';
import { GROUPS } from '../../lib/data';
import { useNow, useStore } from '../../lib/store';
import { C, TIER, t } from '../../lib/theme';
import { mmss, shuffled } from '../../lib/util';

function Tile({ word, on, shake, onPress }: { word: string; on: boolean; shake: Animated.Value; onPress: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.timing(scale, { toValue: on ? 0.96 : 1, duration: 140, easing: Easing.bezier(0.34, 1.56, 0.64, 1), useNativeDriver: true }).start();
  }, [on, scale]);
  return (
    <Animated.View style={{ flex: 1, transform: [{ scale }, { translateX: on ? shake : 0 }] }}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected: on }}
        onPress={onPress}
        style={{
          height: 72,
          borderRadius: 8,
          paddingHorizontal: 2,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: on ? C.white : C.input,
          borderWidth: 1.5,
          borderColor: on ? C.white : C.border,
        }}
      >
        <Text numberOfLines={1} adjustsFontSizeToFit style={t('display800i', word.length > 6 ? 12 : 14, on ? C.accentFg : C.text)}>
          {word}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

export default function Groups() {
  const { s, set, toast, haptic, finishDaily } = useStore();
  const g = s.gr;
  const now = useNow(1000, !s.done.groups);
  const shake = useRef(new Animated.Value(0)).current;

  const tap = (word: string) => {
    if (g.over) return;
    haptic('tap');
    const sel = g.sel.includes(word) ? g.sel.filter((w) => w !== word) : g.sel.length < 4 ? [...g.sel, word] : g.sel;
    set({ gr: { ...g, sel } });
  };

  const submit = () => {
    if (g.sel.length !== 4 || g.over) return;
    const gi = GROUPS.findIndex((G, i) => !g.solved.includes(i) && g.sel.every((w) => G.words.includes(w)));
    if (gi >= 0) {
      haptic('success');
      const solved = [...g.solved, gi];
      const order = g.order.filter((w) => !GROUPS[gi].words.includes(w));
      const over = solved.length === 4;
      set({ gr: { ...g, solved, order, sel: [], over } });
      if (over) finishDaily('groups', 100 - g.mistakes * 20, `All 4 groups, ${g.mistakes} mistake${g.mistakes === 1 ? '' : 's'}`);
      return;
    }
    haptic('error');
    const oneAway = GROUPS.some((G) => g.sel.filter((w) => G.words.includes(w)).length === 3);
    const mistakes = g.mistakes + 1;
    toast(oneAway ? 'One away' : 'Not a group');
    if (mistakes >= 4) {
      const n = g.solved.length;
      const solved = [...g.solved, ...[0, 1, 2, 3].filter((i) => !g.solved.includes(i))];
      set({ gr: { ...g, mistakes, solved, order: [], sel: [], over: true } });
      finishDaily('groups', n * 15, `${n} of 4 groups found`);
    } else {
      set({ gr: { ...g, mistakes } });
      // ±6px shake over 280ms
      Animated.sequence([6, -6, 6, -6, 0].map((v) => Animated.timing(shake, { toValue: v, duration: 56, useNativeDriver: true }))).start();
    }
  };

  const rows: string[][] = [];
  g.order.forEach((w, i) => (i % 4 ? rows[rows.length - 1].push(w) : rows.push([w])));
  const started = s.starts.groups;

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: C.page }}>
      <GameHeader eyebrow="TODAY · 2 OF 3" title="GROUP UP" clock={started ? mmss(now - started) : '0:00'} />
      <View style={{ flex: 1, gap: 14, paddingVertical: 18, paddingHorizontal: 16 }}>
        <Text style={[t('body400', 14, C.textSecondary, 1.4), { textAlign: 'center' }]}>
          Find four groups of four. Pick four tiles, then lock them in.
        </Text>
        <View style={{ gap: 8 }}>
          {g.solved.map((i) => (
            <Chamfer key={i} fill={TIER[i][0]} style={{ height: 72, alignItems: 'center', justifyContent: 'center', gap: 4 }}>
              <Text style={t('display900i', 16, TIER[i][1])}>{GROUPS[i].name}</Text>
              <Text style={t('ui600', 13, TIER[i][1], undefined, 0.04)}>{GROUPS[i].words.join(', ')}</Text>
            </Chamfer>
          ))}
          {rows.map((r, ri) => (
            <View key={ri} style={{ flexDirection: 'row', gap: 8 }}>
              {r.map((w) => (
                <Tile key={w} word={w} on={g.sel.includes(w)} shake={shake} onPress={() => tap(w)} />
              ))}
            </View>
          ))}
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <Text style={t('ui600', 13, C.textMuted)}>Mistakes left</Text>
          {[0, 1, 2, 3].map((i) => (
            <View key={i} style={{ width: 11, height: 11, borderRadius: 6, backgroundColor: i < 4 - g.mistakes ? C.accent : C.border }} />
          ))}
        </View>
        <View style={{ marginTop: 'auto', flexDirection: 'row', gap: 8 }}>
          <Button variant="secondary" block style={{ flex: 1 }} disabled={g.over} onPress={() => set({ gr: { ...g, order: shuffled(g.order) } })}>
            Shuffle
          </Button>
          <Button variant="secondary" block style={{ flex: 1 }} disabled={g.over} onPress={() => set({ gr: { ...g, sel: [] } })}>
            Clear
          </Button>
          <Button block style={{ flex: 1.4 }} disabled={g.sel.length !== 4 || g.over} onPress={submit}>
            Lock in
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
