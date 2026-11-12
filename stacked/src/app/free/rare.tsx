import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GameHeader } from '../../components/chrome';
import { Bar, Button, Input, SectionHead } from '../../components/ui';
import { RARE, rarePts } from '../../lib/data';
import { useStore } from '../../lib/store';
import { C, R, t } from '../../lib/theme';
import { W } from '../../lib/util';

type Try = { word: string; said: number; pts: number };

function Game() {
  const { toast, finishFree, haptic } = useStore();
  const [tries, setTries] = useState<Try[]>([]);
  const [input, setInput] = useState('');
  const [over, setOver] = useState(false);
  const bestPts = tries.reduce((a, x) => Math.max(a, x.pts), 0);

  const lock = (ts: Try[]) => {
    if (!ts.length) return;
    const best = ts.reduce((a, x) => (x.pts > a.pts ? x : a));
    setOver(true);
    // Production: pct comes from real submissions for today's prompt.
    finishFree('rare', best.pts, `"${best.word}" was said by ${best.said}% of players`);
  };

  const submit = () => {
    if (over) return;
    const v = W(input);
    if (!v) return;
    if (!(v in RARE)) {
      setInput('');
      haptic('error');
      return toast('Not a word for happy');
    }
    if (tries.some((x) => x.word === v)) return toast('Already tried that');
    const next = [...tries, { word: v, said: RARE[v], pts: rarePts(RARE[v]) }];
    setTries(next);
    setInput('');
    haptic('success');
    if (next.length >= 3) lock(next);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={{ flex: 1, gap: 14, paddingVertical: 18, paddingHorizontal: 20 }}>
        <View style={{ backgroundColor: C.card, borderWidth: 1.5, borderColor: C.border, borderTopWidth: 3, borderTopColor: C.accent, borderRadius: R.md, padding: 18, gap: 8 }}>
          <Text style={t('ui600', 13, C.textSecondary)}>Say a word that means</Text>
          <Text style={t('display900i', 48, C.text, 0.95)}>HAPPY</Text>
          <Text style={t('body400', 14, C.textSecondary, 1.4)}>
            The fewer players who said it, the more it's worth. Three tries, best one counts.
          </Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-end' }}>
          <Input
            size="lg"
            placeholder="Type a word"
            value={input}
            onChangeText={setInput}
            onSubmitEditing={submit}
            submitBehavior="submit"
            disabled={over}
            autoCorrect={false}
            autoCapitalize="none"
            autoComplete="off"
            style={{ flex: 1 }}
          />
          <Button size="lg" disabled={over} onPress={submit}>Say it</Button>
        </View>
        <SectionHead left="YOUR TRIES" right={over ? 'Locked in' : `${3 - tries.length} left`} />
        <View style={{ gap: 8 }}>
          {[0, 1, 2].map((i) => {
            const x = tries[i];
            const top = !!x && x.pts === bestPts;
            return (
              <View
                key={i}
                style={{
                  gap: 8,
                  paddingVertical: 12,
                  paddingHorizontal: 14,
                  minHeight: 68,
                  justifyContent: 'center',
                  backgroundColor: C.card,
                  borderWidth: 1.5,
                  borderColor: top ? C.accent : C.border,
                  borderRadius: 8,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: 10 }}>
                  <Text style={t('display800i', 18, x ? C.text : C.textDisabled)}>{x ? x.word : 'Try ' + (i + 1)}</Text>
                  <Text style={t('display900i', 20, top ? C.accent : C.text)}>{x ? x.pts : ''}</Text>
                </View>
                {x && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <View style={{ flex: 1 }}>
                      <Bar pct={x.pts} height={6} radius={3} />
                    </View>
                    <Text style={t('ui500', 12, C.textMuted)}>{x.said}% said this</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
        <View style={{ marginTop: 'auto' }}>
          <Button size="lg" block cut disabled={!tries.length || over} onPress={() => lock(tries)}>
            {tries.length ? `Lock in ${bestPts} pts` : 'Lock in'}
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

export default function Rare() {
  const { s } = useStore();
  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: C.page }}>
      <GameHeader eyebrow="FREE PLAY" title="RARE WORDS" />
      <Game key={s.freeRun} />
    </SafeAreaView>
  );
}
