// Screen chrome shared across routes: game top bar, result sheet, delete sheet, toast.
import { router } from 'expo-router';
import React from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FREE, GAMES } from '../lib/data';
import { useStore } from '../lib/store';
import { C, R, eyebrow as eyebrowStyle, shadowMd, t } from '../lib/theme';
import { BackButton, Button, Eyebrow } from './ui';

/** 52px game bar: back chevron, orange eyebrow, italic title, optional elapsed clock. */
export function GameHeader({ eyebrow, title, clock, onBack }: { eyebrow: string; title: string; clock?: string; onBack?: () => void }) {
  return (
    <View
      style={{
        height: 52,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingLeft: 6,
        paddingRight: 14,
        borderBottomWidth: 1,
        borderBottomColor: C.hairline,
      }}
    >
      <BackButton onPress={onBack ?? (() => (router.canGoBack() ? router.back() : router.replace('/')))} />
      <View style={{ flex: 1, gap: 2 }}>
        <Eyebrow size={10}>{eyebrow}</Eyebrow>
        <Text style={t('display900i', 18, C.text, 1)}>{title}</Text>
      </View>
      {clock != null && (
        <View
          style={{
            paddingVertical: 6,
            paddingHorizontal: 10,
            borderRadius: R.sm,
            backgroundColor: C.card,
            borderWidth: 1.5,
            borderColor: C.border,
            minWidth: 56,
            alignItems: 'center',
          }}
        >
          <Text style={[t('display700i', 16), { fontVariant: ['tabular-nums'] }]}>{clock}</Text>
        </View>
      )}
    </View>
  );
}

/** Bottom sheet: 3px top edge, 22px top radius, over a 72% black scrim. */
export function BottomSheet({
  visible,
  edge = C.accent,
  gap = 14,
  onDismiss,
  children,
}: {
  visible: boolean;
  edge?: string;
  gap?: number;
  onDismiss: () => void;
  children: React.ReactNode;
}) {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss} statusBarTranslucent>
      <View style={{ flex: 1, backgroundColor: C.scrim, justifyContent: 'flex-end' }}>
        <View
          style={{
            backgroundColor: C.card,
            borderTopWidth: 3,
            borderTopColor: edge,
            borderTopLeftRadius: R.xl,
            borderTopRightRadius: R.xl,
            paddingTop: 26,
            paddingHorizontal: 22,
            paddingBottom: 34 + insets.bottom,
            gap,
            alignItems: 'stretch',
          }}
        >
          {children}
        </View>
      </View>
    </Modal>
  );
}

const centered = { textAlign: 'center' as const };

/** Shown after each daily or free-play game. */
export function ResultSheet() {
  const { s, set, openDaily, openFree, nextDaily } = useStore();
  const sh = s.sheet;
  let eyebrow = '', score = 0, detail = '', nextLabel = '', onNext = () => {};
  if (sh?.kind === 'daily' && s.done[sh.key]) {
    const r = s.done[sh.key]!;
    const idx = GAMES.findIndex((g) => g.key === sh.key);
    const nk = nextDaily();
    eyebrow = `${GAMES[idx].name} · ${idx + 1} OF 3`;
    score = r.score;
    detail = r.detail;
    nextLabel = nk ? 'Next: ' + GAMES.find((g) => g.key === nk)!.name : 'See results';
    onNext = () => {
      if (nk) openDaily(nk, true);
      else {
        set({ sheet: null });
        router.replace('/results');
      }
    };
  } else if (sh?.kind === 'free') {
    const f = FREE.find((x) => x.key === sh.key)!;
    eyebrow = `FREE PLAY · BEST ${s.best[f.key] || 0}`;
    score = sh.score;
    detail = sh.detail;
    nextLabel = 'Play again';
    onNext = () => openFree(f.key, true);
  }
  const head = score >= 70 ? 'NICE ONE' : score > 0 ? 'NOT BAD' : 'TOUGH ONE';
  const close = () => set({ sheet: null });
  return (
    <BottomSheet visible={!!sh && !!eyebrow} onDismiss={close}>
      <Text style={[eyebrowStyle(), centered]}>{eyebrow}</Text>
      <Text style={[t('display900i', 40, C.text, 0.95), centered]}>{head}</Text>
      <Text style={[t('display900i', 64, C.accent, 0.95), centered]}>+{score}</Text>
      <Text style={[t('body400', 15, C.textSecondary, 1.4), centered]}>{detail}</Text>
      <Button size="lg" block cut onPress={onNext}>{nextLabel}</Button>
      <Button variant="ghost" block onPress={close}>Review board</Button>
    </BottomSheet>
  );
}

export function Toast() {
  const { s } = useStore();
  const insets = useSafeAreaInsets();
  if (!s.toast) return null;
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: insets.top + 64, alignItems: 'center', zIndex: 20 }}>
      <View style={{ paddingVertical: 10, paddingHorizontal: 16, borderRadius: R.pill, backgroundColor: C.white, boxShadow: shadowMd }}>
        <Text style={t('ui700', 14, C.accentFg)} accessibilityLiveRegion="polite">
          {s.toast}
        </Text>
      </View>
    </View>
  );
}

/** Option button used by the tune, zoom and trivia grids. */
export function OptionButton({
  label,
  onPress,
  bg,
  color,
  border,
  strike,
  height,
  minHeight,
  font = 'ui600',
  size = 15,
  align = 'left',
}: {
  label: string;
  onPress: () => void;
  bg: string;
  color: string;
  border: string;
  strike?: boolean;
  height?: number;
  minHeight?: number;
  font?: 'ui600' | 'display800i';
  size?: number;
  align?: 'left' | 'center';
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => ({
        flex: 1,
        height,
        minHeight,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: bg,
        borderWidth: 1.5,
        borderColor: border,
        justifyContent: 'center',
        alignItems: align === 'center' ? 'center' : 'flex-start',
        transform: pressed ? [{ scale: 0.985 }] : undefined,
      })}
    >
      <Text style={[t(font, size, color, 1.15), { textDecorationLine: strike ? 'line-through' : 'none', textAlign: align }]}>{label}</Text>
    </Pressable>
  );
}

/** Lays children out as a 2-column grid with 8px gaps. */
export function Grid2({ children }: { children: React.ReactNode[] }) {
  const rows: React.ReactNode[][] = [];
  children.forEach((c, i) => (i % 2 ? rows[rows.length - 1].push(c) : rows.push([c])));
  return (
    <View style={{ gap: 8 }}>
      {rows.map((r, i) => (
        <View key={i} style={{ flexDirection: 'row', gap: 8 }}>
          {r}
          {r.length === 1 && <View style={{ flex: 1 }} />}
        </View>
      ))}
    </View>
  );
}
