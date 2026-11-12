import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ListCard } from '../../components/ui';
import { boardFor, totalOf } from '../../lib/boards';
import { BOARD_NAMES, GAMES } from '../../lib/data';
import { myInitials, useStore } from '../../lib/store';
import { C, R, t } from '../../lib/theme';
import { dailyNumber, initialsOf } from '../../lib/util';

export default function Ranks() {
  const { s } = useStore();
  const [tab, setTab] = useState(0);
  const allDone = GAMES.every((g) => s.done[g.key]);
  const board = boardFor(tab, allDone ? totalOf(s.done) : null);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: C.page }}>
      <ScrollView contentContainerStyle={{ paddingTop: 8, paddingHorizontal: 20, paddingBottom: 20, gap: 14 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <Text style={t('display900i', 32, C.text, 1.05)}>RANKINGS</Text>
          <Text style={t('ui600', 12, C.textMuted)}>Daily #{dailyNumber()}</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 6 }} accessibilityRole="tablist">
          {BOARD_NAMES.map((label, i) => {
            const on = i === tab;
            return (
              <Pressable
                key={label}
                accessibilityRole="tab"
                accessibilityState={{ selected: on }}
                onPress={() => setTab(i)}
                hitSlop={6}
                style={{
                  paddingVertical: 9,
                  paddingHorizontal: 14,
                  borderRadius: R.pill,
                  backgroundColor: on ? C.white : 'transparent',
                  borderWidth: 1.5,
                  borderColor: on ? C.white : C.border,
                }}
              >
                <Text style={t('ui700', 12, on ? C.accentFg : C.textSecondary, undefined, 0.06)}>{label}</Text>
              </Pressable>
            );
          })}
        </View>
        <ListCard>
          {board.map((b, i) => (
            <View
              key={b.name}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                paddingVertical: 11,
                paddingHorizontal: 14,
                borderBottomWidth: i < board.length - 1 ? 1 : 0,
                borderBottomColor: C.hairline,
                backgroundColor: b.you ? C.accentWash : 'transparent',
              }}
            >
              <Text style={[t('display900i', 18, i < 3 ? C.accent : C.textMuted), { width: 28 }]}>{i + 1}</Text>
              <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: C.elevated, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={t('ui700', 12)}>{b.you ? myInitials(s.user) : initialsOf(b.name.replace(/[^a-z]/gi, ''))}</Text>
              </View>
              <Text style={[t('ui600', 15), { flex: 1 }]}>{b.you ? 'You' : b.name}</Text>
              <Text style={[t('display800i', 17), { fontVariant: ['tabular-nums'] }]}>{b.score}</Text>
            </View>
          ))}
        </ListCard>
        <Text style={[t('body400', 13, C.textMuted, 1.4), { textAlign: 'center' }]}>
          {allDone ? "Rankings reset with tomorrow's stack." : "Finish today's stack to get ranked."}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
