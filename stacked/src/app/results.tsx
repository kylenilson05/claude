import { router } from 'expo-router';
import { ScrollView, Share, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackButton, Button, Eyebrow, ListCard, Shape } from '../components/ui';
import { boardFor, totalOf } from '../lib/boards';
import { GAMES } from '../lib/data';
import { useStore } from '../lib/store';
import { C, t } from '../lib/theme';
import { dailyNumber, ord } from '../lib/util';

const PODIUM_H = [120, 88, 62];

export default function Results() {
  const { s, toast } = useStore();
  const d = s.done;
  const total = totalOf(d);
  const fr = boardFor(0, total);
  const myRank = fr.findIndex((x) => x.you) + 1;
  const no = dailyNumber();

  const share = async () => {
    // Production: render an image card and share that.
    const msg = `STACKED #${no} — ${total}/300\n` + GAMES.map((g) => `${g.name}: ${d[g.key]?.score ?? 0}`).join('\n');
    try {
      await Share.share({ message: msg });
    } catch {
      toast('Could not open share sheet');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.page }}>
      <ScrollView contentContainerStyle={{ paddingTop: 8, paddingHorizontal: 20, paddingBottom: 20, gap: 18 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <BackButton onPress={() => router.dismissTo('/')} style={{ marginLeft: -12 }} />
          <Eyebrow>DAILY #{no} · DONE</Eyebrow>
        </View>
        <View style={{ gap: 6, alignItems: 'center' }}>
          <Text style={t('display900i', 72, C.text, 0.95)}>
            {total}
            <Text style={t('display900i', 22, C.textMuted)}> / 300</Text>
          </Text>
          <Text style={t('ui500', 15, C.textSecondary)}>
            {ord(myRank)} of {fr.length} friends · +{total} XP
          </Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 6, alignItems: 'flex-end', height: 190 }}>
          {[1, 0, 2].map((i) => {
            const r = fr[i];
            if (!r) return <View key={i} style={{ flex: 1 }} />;
            const bg = r.you ? C.accent : i === 0 ? C.white : C.elevated;
            const fg = r.you || i === 0 ? C.accentFg : C.text;
            return (
              <View key={i} style={{ flex: 1, alignItems: 'center', gap: 4 }}>
                <Text style={t('ui700', 13, r.you ? C.accent : C.text)}>{r.you ? 'You' : r.name}</Text>
                <Text style={t('ui500', 12, C.textMuted)}>{r.score}</Text>
                <Shape
                  points={(w, h) => `0,8 ${w},0 ${w},${h} 0,${h}`}
                  fill={bg}
                  style={{ alignSelf: 'stretch', height: PODIUM_H[i], alignItems: 'center', paddingTop: 12 }}
                >
                  <Text style={t('display900i', 30, fg, 1)}>{i + 1}</Text>
                </Shape>
              </View>
            );
          })}
        </View>

        <ListCard>
          {GAMES.map((g, i) => (
            <View
              key={g.key}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                paddingVertical: 13,
                paddingHorizontal: 14,
                borderBottomWidth: i < GAMES.length - 1 ? 1 : 0,
                borderBottomColor: C.hairline,
              }}
            >
              <Text style={[t('display900i', 18, C.accent), { width: 26 }]}>{'0' + (i + 1)}</Text>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={t('display800i', 14)}>{g.name}</Text>
                <Text style={t('body400', 12, C.textMuted)}>{d[g.key]?.detail ?? ''}</Text>
              </View>
              <Text style={t('display800i', 18)}>{d[g.key]?.score ?? '—'}</Text>
            </View>
          ))}
        </ListCard>

        <View style={{ gap: 8 }}>
          <Button size="lg" block cut onPress={share}>Share score</Button>
          <Button variant="ghost" block onPress={() => router.navigate('/ranks')}>See all rankings</Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
