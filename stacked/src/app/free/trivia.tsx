import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GameHeader, OptionButton } from '../../components/chrome';
import { Bar, Eyebrow } from '../../components/ui';
import { TRIVIA } from '../../lib/data';
import { TRIVIA_SECONDS, useNow, useStore } from '../../lib/store';
import { C, R, t } from '../../lib/theme';

type TV = { i: number; streak: number; picked: number | null; over: boolean; frozenLeft: number | null; deadline: number };

function Game() {
  const { finishFree, haptic } = useStore();
  const [tv, setTv] = useState<TV>(() => ({ i: 0, streak: 0, picked: null, over: false, frozenLeft: null, deadline: Date.now() + TRIVIA_SECONDS * 1000 }));
  useNow(100, !tv.over && tv.picked == null);
  const Q = TRIVIA[tv.i];
  const left = Math.max(0, tv.frozenLeft ?? tv.deadline - Date.now());

  const pick = (idx: number) => {
    if (tv.over || tv.picked != null) return;
    const ok = idx === Q[2];
    haptic(ok ? 'success' : 'error');
    setTv({ ...tv, picked: idx, frozenLeft: Math.max(0, tv.deadline - Date.now()) });
    setTimeout(() => {
      if (ok && tv.i + 1 < TRIVIA.length) {
        return setTv({ ...tv, i: tv.i + 1, streak: tv.streak + 1, picked: null, frozenLeft: null, deadline: Date.now() + TRIVIA_SECONDS * 1000 });
      }
      const streak = tv.streak + (ok ? 1 : 0);
      setTv((x) => ({ ...x, streak, over: true }));
      finishFree(
        'trivia',
        Math.min(100, streak * 10),
        ok ? `Perfect run: ${streak} in a row` : idx < 0 ? `Out of time after ${streak} in a row` : `${streak} in a row. The answer was ${Q[1][Q[2]]}.`,
      );
    }, idx < 0 ? 300 : 900);
  };

  useEffect(() => {
    if (!tv.over && tv.picked == null && left <= 0) pick(-1);
  });

  const barColor = left < 3000 ? C.danger : C.accent;
  return (
    <View style={{ flex: 1, gap: 14, paddingVertical: 18, paddingHorizontal: 20 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <View style={{ gap: 2 }}>
          <Eyebrow color={C.textSecondary}>STREAK</Eyebrow>
          <Text style={t('display900i', 56, C.accent, 0.95)}>{tv.streak}</Text>
        </View>
        <Text style={[t('display900i', 32, barColor, 1), { fontVariant: ['tabular-nums'] }]}>{Math.ceil(left / 1000)}</Text>
      </View>
      <Bar pct={Math.min(100, left / (TRIVIA_SECONDS * 10))} color={barColor} />
      <View style={{ backgroundColor: C.card, borderWidth: 1.5, borderColor: C.border, borderRadius: R.md, paddingVertical: 20, paddingHorizontal: 18, minHeight: 150, gap: 10, justifyContent: 'center' }}>
        <Eyebrow>QUESTION {tv.i + 1}</Eyebrow>
        <Text style={t('display800i', 24, C.text, 1.15)}>{Q[0]}</Text>
      </View>
      <View style={{ gap: 8 }}>
        {Q[1].map((o, i) => {
          const done = tv.picked != null;
          const right = done && i === Q[2];
          const wrongPick = done && i === tv.picked && !right;
          return (
            <View key={o} style={{ flexDirection: 'row' }}>
              <OptionButton
                label={o}
                onPress={() => pick(i)}
                minHeight={54}
                size={16}
                bg={right ? C.success : wrongPick ? C.danger : C.card}
                border={right ? C.success : wrongPick ? C.danger : C.border}
                color={right ? C.successInk : wrongPick ? C.white : done ? C.textDisabled : C.text}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
}

export default function Trivia() {
  const { s } = useStore();
  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: C.page }}>
      <GameHeader eyebrow="FREE PLAY" title="TRIVIA STREAK" />
      <Game key={s.freeRun} />
    </SafeAreaView>
  );
}
