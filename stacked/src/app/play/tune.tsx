import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';
import { Play } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GameHeader, Grid2, OptionButton } from '../../components/chrome';
import { Button, SectionHead } from '../../components/ui';
import { STAGES, TUNE_ANSWER, TUNE_PTS, TUNE_TITLES, TUNE_TOTAL, stageEnd } from '../../lib/data';
import { useNow, useStore } from '../../lib/store';
import { C, R, glowOrange, t } from '../../lib/theme';
import { mmss } from '../../lib/util';

// Production: a licensed preview clip per day (see README). This is a synthesized public-domain melody.
const CLIP = require('../../../assets/audio/tune.wav');

export default function Tune() {
  const { s, set, toast, finishDaily, haptic } = useStore();
  const tn = s.tune;
  const now = useNow(1000, !s.done.tune);
  const [pos, setPos] = useState(0); // playhead, 0..1 of the full clip
  const [playing, setPlaying] = useState(false);
  const player = useRef<AudioPlayer | null>(null);
  const raf = useRef<number>(0);
  const stopTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
    player.current = createAudioPlayer(CLIP);
    return () => {
      cancelAnimationFrame(raf.current);
      clearTimeout(stopTimer.current);
      player.current?.remove();
    };
  }, []);

  const stage = Math.min(tn.guesses.length, 5);

  const play = () => {
    if (playing) return;
    const dur = tn.over ? TUNE_TOTAL : stageEnd(stage);
    const p = player.current;
    if (s.settings.sound && p) {
      p.seekTo(0).then(() => p.play()).catch(() => {});
      stopTimer.current = setTimeout(() => p.pause(), dur * 1000);
    }
    const start = Date.now();
    setPlaying(true);
    const step = () => {
      const el = (Date.now() - start) / 1000;
      if (el >= dur) {
        setPlaying(false);
        setPos(0);
        return;
      }
      setPos(el / TUNE_TOTAL);
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  };

  const guess = (title: string) => {
    if (tn.over || (title !== 'SKIP' && tn.guesses.includes(title))) return;
    if (title === TUNE_ANSWER) {
      set({ tune: { ...tn, over: true, won: true } });
      finishDaily('tune', TUNE_PTS[tn.guesses.length], `${TUNE_ANSWER}, from ${stageEnd(tn.guesses.length).toFixed(1)}s of audio`);
      return;
    }
    const guesses = [...tn.guesses, title];
    if (title !== 'SKIP') {
      toast('Not that one');
      haptic('error');
    }
    if (guesses.length >= STAGES.length) {
      set({ tune: { ...tn, guesses, over: true } });
      finishDaily('tune', 0, `It was ${TUNE_ANSWER}`);
    } else set({ tune: { ...tn, guesses } });
  };

  const unlocked = ((tn.over ? TUNE_TOTAL : stageEnd(stage)) / TUNE_TOTAL) * 100;
  const playLabel = playing ? 'Playing…' : tn.over ? 'Play full clip' : `Play ${stageEnd(stage).toFixed(1)}s`;
  const skipLabel = tn.over ? 'Done' : stage >= 5 ? 'Give up' : `Skip (+${(stageEnd(stage + 1) - stageEnd(stage)).toFixed(1)}s)`;
  const started = s.starts.tune;

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: C.page }}>
      <GameHeader eyebrow="TODAY · 1 OF 3" title="NAME THAT TUNE" clock={started ? mmss(now - started) : '0:00'} />
      <View style={{ flex: 1, gap: 16, paddingVertical: 18, paddingHorizontal: 20 }}>
        <View style={{ backgroundColor: C.card, borderWidth: 1.5, borderColor: C.border, borderRadius: R.md, padding: 16, gap: 14 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={playLabel}
              onPress={play}
              style={({ pressed }) => ({
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: C.accent,
                boxShadow: glowOrange,
                alignItems: 'center',
                justifyContent: 'center',
                transform: pressed ? [{ scale: 0.95 }] : undefined,
              })}
            >
              <Play size={26} color={C.accentFg} fill={C.accentFg} strokeWidth={2} style={{ marginLeft: 3 }} />
            </Pressable>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={t('display800i', 18, C.text, 1.1)}>{playLabel}</Text>
              <Text style={t('body400', 13, C.textMuted, 1.3)}>Each skip or wrong guess unlocks more of the song.</Text>
            </View>
          </View>
          <View style={{ height: 14, borderRadius: R.xs, backgroundColor: C.input, overflow: 'hidden' }}>
            <View
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                width: `${unlocked}%`,
                backgroundColor: C.accentWash,
                borderRightWidth: 2,
                borderRightColor: C.accentLine,
              }}
            />
            <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: `${pos * 100}%`, backgroundColor: C.accent }} />
            {[0, 1, 2, 3, 4].map((k) => (
              <View key={k} style={{ position: 'absolute', top: 0, bottom: 0, left: `${(stageEnd(k) / TUNE_TOTAL) * 100}%`, width: 2, backgroundColor: C.card }} />
            ))}
          </View>
          <View style={{ flexDirection: 'row', gap: 5 }}>
            {STAGES.map((_, i) => {
              const gu = tn.guesses[i];
              let label = stageEnd(i).toFixed(1) + 's';
              let bg = 'transparent', color: string = C.textDisabled, border: string = C.border;
              if (gu) { label = gu === 'SKIP' ? 'SKIP' : 'MISS'; bg = C.input; color = C.textMuted; }
              else if (tn.won && i === tn.guesses.length) { label = 'GOT IT'; bg = C.accent; color = C.accentFg; border = C.accent; }
              else if (!tn.over && i === tn.guesses.length) { bg = C.accentWash; color = C.accentHover; border = C.accent; }
              return (
                <View key={i} style={{ flex: 1, height: 30, borderRadius: 4, alignItems: 'center', justifyContent: 'center', backgroundColor: bg, borderWidth: 1.5, borderColor: border }}>
                  <Text style={t('ui700', 11, color, undefined, 0.04)}>{label}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <SectionHead left="WHICH SONG IS IT?" right={tn.over ? (tn.won ? 'Solved' : 'Out of tries') : `${6 - tn.guesses.length} tries left`} />
        <Grid2>
          {TUNE_TITLES.map((title) => {
            const wrong = tn.guesses.includes(title);
            const right = tn.over && title === TUNE_ANSWER;
            return (
              <OptionButton
                key={title}
                label={title}
                onPress={() => guess(title)}
                minHeight={52}
                strike={wrong}
                bg={right ? C.accent : C.card}
                border={right ? C.accent : C.border}
                color={right ? C.accentFg : wrong || tn.over ? C.textDisabled : C.text}
              />
            );
          })}
        </Grid2>
        <View style={{ marginTop: 'auto' }}>
          <Button variant="secondary" size="lg" block disabled={tn.over} onPress={() => guess('SKIP')}>
            {skipLabel}
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
