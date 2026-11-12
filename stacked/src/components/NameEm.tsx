// Name 'Em board, used by the daily game and by party mode.
import { ScrollView, Text, View } from 'react-native';
import { CATS } from '../lib/data';
import { useNow, useStore } from '../lib/store';
import { C, R, t } from '../lib/theme';
import { Bar, Button, Input } from './ui';

export function NameEmBoard({ which }: { which: 'neDaily' | 'neParty' }) {
  const { s, set, neSubmit } = useStore();
  const ne = s[which];
  useNow(100, !!ne && !ne.over);
  if (!ne) return null;
  const left = Math.max(0, ne.endsAt - Date.now());
  const low = left < 10000 && !ne.over;
  const clockColor = ne.over ? C.textMuted : low ? C.danger : C.accent;
  const flashColor = ne.tone === 'ok' ? C.accent : ne.tone === 'bad' ? C.danger : C.textSecondary;
  const count = which === 'neDaily' ? `${ne.found.length} found · ${Math.min(100, ne.found.length * 10)} pts` : `${ne.found.length} found`;

  return (
    <View style={{ flex: 1, gap: 14, paddingVertical: 18, paddingHorizontal: 20, minHeight: 0 }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={t('ui600', 13, C.textSecondary)}>Name as many</Text>
          <Text style={[t('display900i', 32, C.text, 0.95), { textTransform: 'uppercase' }]}>{ne.cat}</Text>
          <Text style={t('ui600', 13, C.textSecondary)}>as you can.</Text>
        </View>
        <Text style={[t('display900i', 56, clockColor, 0.95), { fontVariant: ['tabular-nums'] }]}>{ne.over ? 0 : Math.ceil(left / 1000)}</Text>
      </View>
      <Bar pct={ne.over ? 0 : left / (ne.secs * 10)} color={clockColor} />
      <View style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-end' }}>
        <Input
          size="lg"
          placeholder="Type and hit enter"
          value={ne.input}
          onChangeText={(v) => set((st) => (st[which] ? ({ [which]: { ...st[which]!, input: v } } as never) : null))}
          onSubmitEditing={() => neSubmit(which)}
          submitBehavior="submit"
          returnKeyType="done"
          disabled={ne.over}
          autoFocus
          autoCorrect={false}
          autoCapitalize="none"
          autoComplete="off"
          style={{ flex: 1 }}
        />
        <Button size="lg" disabled={ne.over} onPress={() => neSubmit(which)}>Add</Button>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', minHeight: 18 }}>
        <Text style={t('ui700', 14, flashColor, undefined, 0.04)} accessibilityLiveRegion="polite">{ne.flash}</Text>
        <Text style={t('ui600', 13, C.textMuted)}>{count}</Text>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }} keyboardShouldPersistTaps="handled">
        {ne.found.map((word, i) => {
          const hot = i === 0 && !ne.over;
          return (
            <View key={word} style={{ paddingVertical: 7, paddingHorizontal: 12, borderRadius: R.pill, backgroundColor: hot ? C.accent : C.card, borderWidth: 1.5, borderColor: hot ? C.accent : C.border }}>
              <Text style={[t('ui600', 14, hot ? C.accentFg : C.text), { textTransform: 'capitalize' }]}>{word}</Text>
            </View>
          );
        })}
      </ScrollView>
      {ne.over && (
        <Text style={t('body400', 13, C.textMuted, 1.4)}>
          Some you missed: {CATS[ne.cat].filter((x) => !ne.found.includes(x)).slice(0, 6).join(', ')}.
        </Text>
      )}
    </View>
  );
}
