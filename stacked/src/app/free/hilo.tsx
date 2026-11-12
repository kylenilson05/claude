import { useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GameHeader } from '../../components/chrome';
import { Button, Shape, parallelogram } from '../../components/ui';
import { POP } from '../../lib/data';
import { useStore } from '../../lib/store';
import { C, R, t } from '../../lib/theme';
import { fmtPop, shuffled } from '../../lib/util';

function CountryCard({ name, value, valueColor, border }: { name: string; value: string; valueColor: string; border: string }) {
  return (
    <View style={{ height: 170, gap: 6, alignItems: 'center', justifyContent: 'center', backgroundColor: C.card, borderWidth: 1.5, borderColor: border, borderRadius: R.md }}>
      <Text style={[t('display900i', 32, C.text, 1.05), { textTransform: 'uppercase' }]}>{name}</Text>
      <Text style={t('display900i', 44, valueColor, 1.05)}>{value}</Text>
      <Text style={t('ui500', 13, C.textMuted)}>people</Text>
    </View>
  );
}

function Game() {
  const { finishFree, haptic } = useStore();
  const [h, setH] = useState(() => ({ seq: shuffled(POP.map((_, i) => i)), i: 0, streak: 0, revealed: false, right: null as boolean | null, over: false }));
  const A = POP[h.seq[h.i]];
  const B = POP[h.seq[h.i + 1]];

  const guess = (dir: 'hi' | 'lo') => {
    if (h.revealed || h.over) return;
    const ok = dir === 'hi' ? B[1] >= A[1] : B[1] <= A[1];
    haptic(ok ? 'success' : 'error');
    setH({ ...h, revealed: true, right: ok });
    setTimeout(() => {
      if (ok && h.i + 2 < h.seq.length) return setH({ ...h, i: h.i + 1, streak: h.streak + 1, revealed: false, right: null });
      const streak = h.streak + (ok ? 1 : 0);
      setH({ ...h, revealed: true, right: ok, streak, over: true });
      finishFree('hilo', Math.min(100, streak * 10), `${streak} in a row`);
    }, 1100);
  };

  const status = h.revealed ? (h.right ? C.success : C.danger) : null;
  return (
    <View style={{ flex: 1, gap: 10, paddingVertical: 18, paddingHorizontal: 20 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <Text style={t('ui600', 14, C.textSecondary)}>Which country has more people?</Text>
        <Text style={t('display800i', 16)}>
          STREAK <Text style={{ color: C.accent }}>{h.streak}</Text>
        </Text>
      </View>
      <CountryCard name={A[0]} value={fmtPop(A[1])} valueColor={C.accent} border={C.border} />
      <Shape points={parallelogram(8)} fill={C.white} style={{ alignSelf: 'center', marginVertical: -22, zIndex: 1, paddingVertical: 6, paddingHorizontal: 14 }}>
        <Text style={t('display900i', 16, C.accentFg)}>VS</Text>
      </Shape>
      <CountryCard name={B[0]} value={h.revealed ? fmtPop(B[1]) : '?'} valueColor={status ?? C.textMuted} border={status ?? C.border} />
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
        <Button size="lg" block style={{ flex: 1 }} disabled={h.revealed || h.over} onPress={() => guess('hi')}>Higher</Button>
        <Button size="lg" variant="secondary" block style={{ flex: 1 }} disabled={h.revealed || h.over} onPress={() => guess('lo')}>Lower</Button>
      </View>
      <Text style={[t('body400', 12, C.textMuted), { marginTop: 'auto', textAlign: 'center' }]}>Population estimates, 2024</Text>
    </View>
  );
}

export default function Hilo() {
  const { s } = useStore();
  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: C.page }}>
      <GameHeader eyebrow="FREE PLAY" title="HIGHER / LOWER" />
      <Game key={s.freeRun} />
    </SafeAreaView>
  );
}
