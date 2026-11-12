import { router } from 'expo-router';
import { ChevronRight, Users } from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Grid2 } from '../../components/chrome';
import { Bar, Button, Chamfer, Eyebrow, SectionHead, Wordmark } from '../../components/ui';
import { FREE, GAMES } from '../../lib/data';
import { XP_PER_LEVEL, levelOf, myInitials, useStore } from '../../lib/store';
import { C, R, glowOrangeSm, shadowCard, t } from '../../lib/theme';
import { dailyNumber, dateLabel } from '../../lib/util';

export default function Home() {
  const { s, openDaily, openFree, nextDaily } = useStore();
  const d = s.done;
  const allDone = GAMES.every((g) => d[g.key]);
  const level = levelOf(s.xp);
  const next = level * XP_PER_LEVEL;
  const cta = allDone ? 'See results' : Object.keys(s.starts).length ? 'Continue' : "Play today's stack";

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: C.page }}>
      <ScrollView contentContainerStyle={{ paddingTop: 8, paddingHorizontal: 20, paddingBottom: 20, gap: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Wordmark size={28} />
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            <View style={{ paddingVertical: 6, paddingHorizontal: 10, borderRadius: R.pill, backgroundColor: C.card, borderWidth: 1.5, borderColor: C.border }}>
              <Text style={t('ui700', 13, C.text, undefined, 0.04)}>LVL {level}</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Settings"
              onPress={() => router.push('/settings')}
              style={{ width: 44, height: 44, marginRight: -5, alignItems: 'center', justifyContent: 'center' }}
            >
              <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={t('display800i', 14, C.accentFg)}>{myInitials(s.user)}</Text>
              </View>
            </Pressable>
          </View>
        </View>

        <View style={{ boxShadow: shadowCard }}>
          <Chamfer stroke={C.border} topEdge={C.accent} style={{ paddingTop: 18, paddingHorizontal: 18, paddingBottom: 20, gap: 14 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <Eyebrow>DAILY #{dailyNumber()}</Eyebrow>
              <Text style={t('ui600', 12, C.textMuted)}>{dateLabel()}</Text>
            </View>
            <Text style={[t('display900i', 34, C.text, 0.95), { textTransform: 'uppercase' }]}>Today's stack</Text>
            <Text style={t('body400', 14, C.textSecondary, 1.4)}>Three quick games, same puzzles for everyone. New stack at midnight.</Text>
            <View style={{ gap: 8 }}>
              {GAMES.map((g, i) => {
                const dn = d[g.key];
                const st = s.starts[g.key];
                const status = dn ? dn.score + ' PTS' : st ? 'IN PROGRESS' : 'PLAY';
                const statusBg = dn ? C.accentWash : st ? C.elevated : C.accent;
                const statusColor = dn ? C.accentHover : st ? C.text : C.accentFg;
                return (
                  <Pressable
                    key={g.key}
                    accessibilityRole="button"
                    onPress={() => openDaily(g.key)}
                    style={({ pressed }) => ({
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 12,
                      padding: 12,
                      backgroundColor: C.input,
                      borderWidth: 1.5,
                      borderColor: pressed ? C.accentLine : C.border,
                      borderRadius: 8,
                    })}
                  >
                    <Text style={[t('display900i', 22, C.accent, 1), { width: 30 }]}>{'0' + (i + 1)}</Text>
                    <View style={{ flex: 1, gap: 3 }}>
                      <Text style={t('display800i', 15, C.text, 1.1, 0.02)}>{g.name}</Text>
                      <Text style={t('body400', 13, C.textMuted, 1.2)}>{g.sub}</Text>
                    </View>
                    <View style={{ paddingVertical: 5, paddingHorizontal: 9, borderRadius: R.pill, backgroundColor: statusBg }}>
                      <Text style={t('ui700', 11, statusColor, undefined, 0.06)}>{status}</Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
            <Button
              size="lg"
              block
              cut
              onPress={() => {
                if (allDone) router.push('/results');
                else openDaily(nextDaily()!);
              }}
            >
              {cta}
            </Button>
          </Chamfer>
        </View>

        <View style={{ gap: 8 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <Text style={t('display800i', 15)}>LEVEL {level}</Text>
            <Text style={t('ui600', 12, C.textMuted)}>
              {s.xp.toLocaleString()} / {next.toLocaleString()} XP
            </Text>
          </View>
          <Bar pct={((s.xp % XP_PER_LEVEL) / XP_PER_LEVEL) * 100} />
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => router.navigate('/party')}
          style={({ pressed }) => ({
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
            padding: 16,
            backgroundColor: pressed ? C.accentPress : C.accent,
            borderRadius: R.md,
            boxShadow: glowOrangeSm,
          })}
        >
          <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: C.page, alignItems: 'center', justifyContent: 'center' }}>
            <Users size={22} color={C.accent} strokeWidth={2} />
          </View>
          <View style={{ flex: 1, gap: 3 }}>
            <Text style={t('display900i', 18, C.accentFg, 1.1)}>PARTY MODE</Text>
            <Text style={t('ui500', 13, C.accentFg, 1.25)}>One phone, 2–6 players. Pass it around.</Text>
          </View>
          <ChevronRight size={20} color={C.accentFg} strokeWidth={2} />
        </Pressable>

        <View style={{ gap: 10 }}>
          <SectionHead left="FREE PLAY" right="Unlimited, unranked" />
          <Grid2>
            {FREE.map((f) => (
              <Pressable
                key={f.key}
                accessibilityRole="button"
                onPress={() => openFree(f.key)}
                style={({ pressed }) => ({
                  flex: 1,
                  gap: 6,
                  paddingVertical: 14,
                  paddingHorizontal: 12,
                  backgroundColor: C.card,
                  borderWidth: 1.5,
                  borderColor: pressed ? C.accentLine : C.border,
                  borderRadius: 8,
                })}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={[t('display800i', 15, C.text, 1.05), { flexShrink: 1 }]}>{f.name}</Text>
                  <Text style={t('ui700', 10, C.accent, undefined, 0.08)}>{s.best[f.key] != null ? 'BEST ' + s.best[f.key] : 'PLAY'}</Text>
                </View>
                <Text style={t('body400', 13, C.textMuted, 1.25)}>{f.sub}</Text>
              </Pressable>
            ))}
          </Grid2>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
