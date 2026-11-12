import { X } from 'lucide-react-native';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GameHeader } from '../../components/chrome';
import { NameEmBoard } from '../../components/NameEm';
import { Button, Carbon, Eyebrow, Input, ListCard } from '../../components/ui';
import { PARTY_SECONDS, newNE, useStore } from '../../lib/store';
import { C, R, t } from '../../lib/theme';

export default function Party() {
  const { s, set, beginParty } = useStore();
  const p = s.party;

  if (p.phase === 'play') {
    return (
      <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: C.page }}>
        <GameHeader
          eyebrow={`PARTY · ${p.players[p.turn]}`}
          title="NAME 'EM"
          onBack={() => set({ party: { ...p, phase: 'pass' }, neParty: null })}
        />
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <NameEmBoard which="neParty" />
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  if (p.phase === 'pass') {
    return (
      <View style={{ flex: 1, backgroundColor: C.page }}>
        <Carbon />
        <SafeAreaView style={{ flex: 1, padding: 20, gap: 18, justifyContent: 'center' }}>
          <Text style={[t('ui700', 12, C.textSecondary, undefined, 0.14), { textAlign: 'center' }]}>
            PLAYER {p.turn + 1} OF {p.players.length}
          </Text>
          <Text style={[t('display900i', 22), { textAlign: 'center' }]}>PASS THE PHONE TO</Text>
          <Text style={[t('display900i', 64, C.accent, 0.95), { textAlign: 'center', textTransform: 'uppercase' }]}>{p.players[p.turn]}</Text>
          <Text style={[t('body400', 15, C.textSecondary, 1.4), { textAlign: 'center' }]}>No peeking. Your category shows when you start.</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6, flexWrap: 'wrap' }}>
            {p.players.map((n, i) => (
              <View key={i} style={{ paddingVertical: 6, paddingHorizontal: 10, borderRadius: R.pill, backgroundColor: C.card, borderWidth: 1.5, borderColor: C.border }}>
                <Text style={t('ui600', 13, i === p.turn ? C.accent : p.scores[i] != null ? C.text : C.textMuted)}>
                  {p.scores[i] != null ? `${n} · ${p.scores[i]}` : n}
                </Text>
              </View>
            ))}
          </View>
          <View style={{ marginTop: 24 }}>
            <Button
              size="xl"
              block
              cut
              onPress={() => set({ neParty: newNE(p.cats[p.turn], PARTY_SECONDS), party: { ...p, phase: 'play' } })}
            >
              I'm ready
            </Button>
          </View>
          <Button variant="ghost" block onPress={() => set({ party: { ...p, phase: 'setup' } })}>
            End party
          </Button>
        </SafeAreaView>
      </View>
    );
  }

  if (p.phase === 'done') {
    const ranked = p.players.map((name, i) => ({ name, score: p.scores[i] || 0, cat: p.cats[i] })).sort((a, b) => b.score - a.score);
    const tie = ranked[1] && ranked[1].score === ranked[0].score;
    return (
      <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: C.page }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingTop: 8, paddingHorizontal: 20, paddingBottom: 20, gap: 18 }}>
          <View style={{ gap: 6, alignItems: 'center', paddingTop: 12 }}>
            <Eyebrow>WINNER</Eyebrow>
            <Text style={[t('display900i', 56, C.text, 0.95), { textAlign: 'center', textTransform: 'uppercase' }]}>{ranked[0].name}</Text>
            <Text style={t('ui500', 15, C.textSecondary)}>
              {tie ? `Tied at ${ranked[0].score}. Rematch to settle it.` : `${ranked[0].score} answers in ${PARTY_SECONDS} seconds`}
            </Text>
          </View>
          <ListCard>
            {ranked.map((r, i) => (
              <View
                key={i}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  paddingVertical: 13,
                  paddingHorizontal: 14,
                  borderBottomWidth: i < ranked.length - 1 ? 1 : 0,
                  borderBottomColor: C.hairline,
                  backgroundColor: i === 0 ? C.accentWash : 'transparent',
                }}
              >
                <Text style={[t('display900i', 20, i === 0 ? C.accent : C.textMuted), { width: 26 }]}>{i + 1}</Text>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={t('display800i', 15)}>{r.name}</Text>
                  <Text style={[t('body400', 12, C.textMuted), { textTransform: 'capitalize' }]}>{r.cat}</Text>
                </View>
                <Text style={t('display900i', 22)}>{r.score}</Text>
              </View>
            ))}
          </ListCard>
          <View style={{ marginTop: 'auto', gap: 8 }}>
            <Button size="lg" block cut onPress={() => beginParty(p.offset + p.players.length)}>Rematch</Button>
            <Button variant="ghost" block onPress={() => set({ party: { ...p, phase: 'setup' } })}>Change players</Button>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // setup
  const rename = (i: number, v: string) => {
    const players = p.players.slice();
    players[i] = v;
    set({ party: { ...p, players } });
  };
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: C.page }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingTop: 8, paddingHorizontal: 20, paddingBottom: 20, gap: 16 }} keyboardShouldPersistTaps="handled">
          <View style={{ gap: 6 }}>
            <Eyebrow>PASS THE PHONE</Eyebrow>
            <Text style={t('display900i', 34, C.text, 0.95)}>PARTY MODE</Text>
            <Text style={t('body400', 14, C.textSecondary, 1.4)}>
              Everyone gets {PARTY_SECONDS} seconds and their own category. Most answers wins.
            </Text>
          </View>
          <View style={{ gap: 8 }}>
            {p.players.map((name, i) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Text style={[t('display900i', 20, C.accent), { width: 28 }]}>{i + 1}</Text>
                <Input value={name} onChangeText={(v) => rename(i, v)} accessibilityLabel={`Player ${i + 1} name`} style={{ flex: 1 }} maxLength={14} />
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Remove ${name || 'player ' + (i + 1)}`}
                  disabled={p.players.length <= 2}
                  onPress={() => set({ party: { ...p, players: p.players.filter((_, j) => j !== i) } })}
                  style={({ pressed }) => ({
                    width: 44,
                    height: 42,
                    borderRadius: R.sm,
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: p.players.length <= 2 ? 0.45 : 1,
                    backgroundColor: pressed ? 'rgba(255,255,255,0.06)' : 'transparent',
                  })}
                >
                  <X size={18} color={C.textSecondary} strokeWidth={2} />
                </Pressable>
              </View>
            ))}
          </View>
          <Button
            variant="outline"
            block
            disabled={p.players.length >= 6}
            onPress={() => set({ party: { ...p, players: [...p.players, 'Player ' + (p.players.length + 1)] } })}
          >
            Add player
          </Button>
          <View style={{ marginTop: 'auto' }}>
            <Button size="lg" block cut onPress={() => beginParty(p.offset)}>Start party</Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
