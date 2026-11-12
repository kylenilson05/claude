import { router } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomSheet } from '../components/chrome';
import { BackButton, Button, ListCard, SectionHead, Switch } from '../components/ui';
import { levelOf, myInitials, useStore, type Settings as S } from '../lib/store';
import { C, R, t } from '../lib/theme';

const TOGGLES: [keyof S, string, string][] = [
  ['sound', 'Sound', 'Song clips and effects'],
  ['haptics', 'Haptics', 'Buzz on right and wrong answers'],
  ['reminder', 'Daily reminder', '8:00 PM, when a new stack drops'],
];
const LINKS = ['Edit profile', 'How to play', 'Privacy policy', 'Terms of service', 'Contact support'];

export default function Settings() {
  const { s, set, toast, signOut, deleteAccount } = useStore();
  const [confirm, setConfirm] = useState(false);
  const u = s.user;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.page }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 28, gap: 18 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <BackButton onPress={() => router.back()} style={{ marginLeft: -12 }} />
          <Text style={t('display900i', 26, C.text, 1)}>SETTINGS</Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
            padding: 16,
            backgroundColor: C.card,
            borderWidth: 1.5,
            borderColor: C.border,
            borderTopWidth: 3,
            borderTopColor: C.accent,
            borderRadius: R.md,
          }}
        >
          <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={t('display800i', 20, C.accentFg)}>{myInitials(u)}</Text>
          </View>
          <View style={{ gap: 4 }}>
            <Text style={t('display800i', 19, C.text, 1.1)}>{u?.name || 'jk'}</Text>
            <Text style={t('ui500', 13, C.textMuted)}>
              Level {levelOf(s.xp)} · {u?.school || 'No school added'}
            </Text>
          </View>
        </View>

        <View style={{ gap: 8 }}>
          <SectionHead left="GAME" />
          <ListCard>
            {TOGGLES.map(([k, label, sub], i) => (
              <View
                key={k}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  paddingVertical: 12,
                  paddingHorizontal: 14,
                  minHeight: 60,
                  borderBottomWidth: i < TOGGLES.length - 1 ? 1 : 0,
                  borderBottomColor: C.hairline,
                }}
              >
                <View style={{ flex: 1, gap: 3 }}>
                  <Text style={t('ui600', 15)}>{label}</Text>
                  <Text style={t('body400', 13, C.textMuted)}>{sub}</Text>
                </View>
                <Switch label={label} value={s.settings[k]} onChange={(on) => set((x) => ({ settings: { ...x.settings, [k]: on } }))} />
              </View>
            ))}
          </ListCard>
        </View>

        <View style={{ gap: 8 }}>
          <SectionHead left="ACCOUNT & HELP" />
          <ListCard>
            {LINKS.map((label, i) => (
              <Pressable
                key={label}
                accessibilityRole="button"
                onPress={() => toast(label + ' opens here')}
                style={({ pressed }) => ({
                  flexDirection: 'row',
                  alignItems: 'center',
                  height: 52,
                  paddingHorizontal: 14,
                  backgroundColor: pressed ? 'rgba(255,255,255,0.04)' : 'transparent',
                  borderBottomWidth: i < LINKS.length - 1 ? 1 : 0,
                  borderBottomColor: C.hairline,
                })}
              >
                <Text style={[t('ui600', 15), { flex: 1 }]}>{label}</Text>
                <ChevronRight size={18} color={C.textMuted} strokeWidth={2} />
              </Pressable>
            ))}
          </ListCard>
        </View>

        <Button variant="secondary" block onPress={signOut}>Sign out</Button>
        <Pressable accessibilityRole="button" onPress={() => setConfirm(true)} style={{ height: 44, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={t('ui600', 15, C.dangerText)}>Delete account</Text>
        </Pressable>
        <Text style={[t('ui500', 12, C.textMuted), { textAlign: 'center' }]}>Version 1.0.0</Text>
      </ScrollView>

      <BottomSheet visible={confirm} edge={C.danger} gap={12} onDismiss={() => setConfirm(false)}>
        <Text style={[t('display900i', 28, C.text, 1), { textAlign: 'center' }]}>DELETE ACCOUNT?</Text>
        <Text style={[t('body400', 15, C.textSecondary, 1.4), { textAlign: 'center' }]}>
          This permanently removes your profile, scores and rankings. It can't be undone.
        </Text>
        <Button
          variant="danger"
          size="lg"
          block
          onPress={() => {
            setConfirm(false);
            deleteAccount();
          }}
        >
          Delete forever
        </Button>
        <Button variant="ghost" block onPress={() => setConfirm(false)}>Keep my account</Button>
      </BottomSheet>
    </SafeAreaView>
  );
}
