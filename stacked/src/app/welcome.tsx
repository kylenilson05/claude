import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Carbon, Shape, Wordmark, parallelogram } from '../components/ui';
import { FREE, GAMES } from '../lib/data';
import { useStore } from '../lib/store';
import { C, t } from '../lib/theme';

const INDENT = [0, 34, 12, 52, 4, 28, 60];

export default function Welcome() {
  const { s, set, toast } = useStore();
  const names = [...GAMES, ...FREE].map((g) => g.name);
  return (
    <View style={{ flex: 1, backgroundColor: C.page }}>
      <Carbon />
      <SafeAreaView style={{ flex: 1, paddingTop: 8, paddingHorizontal: 24, paddingBottom: 34, gap: 22, overflow: 'hidden' }}>
        <View style={{ flex: 1, justifyContent: 'center', gap: 7, marginHorizontal: -10, transform: [{ rotate: '-5deg' }] }}>
          {names.map((name, i) => {
            const orange = i === 2 || i === 5;
            const bg = orange ? C.accent : i % 2 ? C.elevated : C.white;
            const fg = i % 2 && !orange ? C.text : C.accentFg;
            return (
              <Shape
                key={name}
                points={parallelogram(10)}
                fill={bg}
                style={{ alignSelf: 'flex-start', marginLeft: INDENT[i], paddingVertical: 9, paddingHorizontal: 18 }}
              >
                <Text numberOfLines={1} style={t('display900i', 22, fg, 1)}>{name}</Text>
              </Shape>
            );
          })}
        </View>
        <View style={{ gap: 8 }}>
          <Wordmark size={64} />
          <Text style={t('body400', 17, C.textSecondary, 1.4)}>
            Seven quick games. A new stack of three every day. Play solo or pass the phone.
          </Text>
        </View>
        <View style={{ gap: 8 }}>
          <Button size="lg" block cut onPress={() => router.push('/signup')}>Get started</Button>
          <Button
            variant="ghost"
            block
            onPress={() => {
              // Production: Sign in with Apple / email magic link via Supabase Auth.
              set({ user: s.user ?? { name: 'jk', year: '', school: '' } });
              router.replace('/');
              toast('Signed in');
            }}
          >
            I already have an account
          </Button>
        </View>
      </SafeAreaView>
    </View>
  );
}
