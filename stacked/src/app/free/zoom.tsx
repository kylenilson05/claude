import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GameHeader, Grid2, OptionButton } from '../../components/chrome';
import { Chamfer, Eyebrow } from '../../components/ui';
import { ZOOM, ZPTS, ZSCALE } from '../../lib/data';
import { useStore } from '../../lib/store';
import { C, R, t } from '../../lib/theme';

// Production can swap the giant word for photo close-ups.
function Game() {
  const { toast, finishFree, haptic } = useStore();
  const [z, setZ] = useState({ round: 0, level: 0, wrong: [] as string[], score: 0, reveal: false, hit: false, over: false });
  const R0 = ZOOM[Math.min(z.round, ZOOM.length - 1)];
  const scale = useRef(new Animated.Value(ZSCALE[0])).current;
  const target = z.reveal ? 1 : ZSCALE[z.level];

  useEffect(() => {
    Animated.timing(scale, { toValue: target, duration: 600, easing: Easing.bezier(0.22, 1, 0.36, 1), useNativeDriver: true }).start();
  }, [target, scale]);

  const next = (st: typeof z) => {
    if (st.round + 1 >= ZOOM.length) {
      setZ({ ...st, over: true });
      finishFree('zoom', st.score, `${st.score} of 100 points across ${ZOOM.length} words`);
    } else {
      scale.setValue(ZSCALE[0]);
      setZ({ ...st, round: st.round + 1, level: 0, wrong: [], reveal: false, hit: false });
    }
  };

  const pick = (opt: string) => {
    if (z.reveal || z.over || z.wrong.includes(opt)) return;
    if (opt === R0.word) {
      haptic('success');
      const st = { ...z, reveal: true, hit: true, score: z.score + ZPTS[z.level] };
      setZ(st);
      setTimeout(() => next(st), 1100);
    } else if (z.level >= 3) {
      haptic('error');
      const st = { ...z, wrong: [...z.wrong, opt], reveal: true, hit: false };
      setZ(st);
      setTimeout(() => next(st), 1400);
    } else {
      haptic('error');
      toast('Zooming out');
      setZ({ ...z, wrong: [...z.wrong, opt], level: z.level + 1 });
    }
  };

  const levelLabel = z.reveal ? (z.hit ? `+${ZPTS[z.level]} PTS` : 'MISSED') : `${ZSCALE[z.level]}× ZOOM · ${ZPTS[z.level]} PTS`;

  return (
    <View style={{ flex: 1, gap: 14, paddingVertical: 18, paddingHorizontal: 20 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <Eyebrow>{`WORD ${Math.min(z.round + 1, ZOOM.length)} OF ${ZOOM.length}`}</Eyebrow>
        <Text style={t('display800i', 16)}>{z.score} PTS</Text>
      </View>
      <Chamfer fill={C.white} style={{ height: 300, overflow: 'hidden', borderRadius: R.md }}>
        <Animated.View
          style={{
            ...absolute,
            alignItems: 'center',
            justifyContent: 'center',
            transformOrigin: `${R0.o[0] * 100}% ${R0.o[1] * 100}%`,
            transform: [{ scale }],
          }}
        >
          <Text style={t('display900i', 60, C.accentFg, 1)}>{R0.word}</Text>
        </Animated.View>
        <View style={{ position: 'absolute', left: 10, top: 10, paddingVertical: 6, paddingHorizontal: 10, borderRadius: R.pill, backgroundColor: C.page }}>
          <Text style={t('ui700', 11, C.white, undefined, 0.06)}>{levelLabel}</Text>
        </View>
      </Chamfer>
      <View style={{ flexDirection: 'row', gap: 5 }}>
        {ZSCALE.map((_, i) => (
          <View key={i} style={{ flex: 1, height: 5, borderRadius: 3, backgroundColor: i < z.level ? C.border : i === z.level ? C.accent : C.elevated }} />
        ))}
      </View>
      <Text style={t('body400', 14, C.textSecondary, 1.4)}>What's the word? Each wrong pick zooms out and lowers the points.</Text>
      <Grid2>
        {R0.opts.map((o) => {
          const wrong = z.wrong.includes(o);
          const right = z.reveal && o === R0.word;
          return (
            <OptionButton
              key={o}
              label={o}
              onPress={() => pick(o)}
              height={56}
              font="display800i"
              size={17}
              align="center"
              strike={wrong}
              bg={right ? C.accent : C.card}
              border={right ? C.accent : C.border}
              color={right ? C.accentFg : wrong ? C.textDisabled : C.text}
            />
          );
        })}
      </Grid2>
    </View>
  );
}

const absolute = { position: 'absolute' as const, top: 0, left: 0, right: 0, bottom: 0 };

export default function Zoom() {
  const { s } = useStore();
  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: C.page }}>
      <GameHeader eyebrow="FREE PLAY" title="ZOOM OUT" />
      <Game key={s.freeRun} />
    </SafeAreaView>
  );
}
