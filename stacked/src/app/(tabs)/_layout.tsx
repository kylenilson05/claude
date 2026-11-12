import { Redirect, Tabs } from 'expo-router';
import { Gamepad2, Trophy, Users } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from 'expo-router/tabs';
import { useStore } from '../../lib/store';
import { C, t } from '../../lib/theme';

const TABS = [
  { name: 'index', label: 'PLAY', Icon: Gamepad2 },
  { name: 'party', label: 'PARTY', Icon: Users },
  { name: 'ranks', label: 'RANKS', Icon: Trophy },
];

function TabBar({ state, navigateToTab }: BottomTabBarProps) {
  const { s } = useStore();
  const insets = useSafeAreaInsets();
  const current = state.routes[state.index].name;
  // Party pass and play screens are full-screen.
  if (current === 'party' && (s.party.phase === 'pass' || s.party.phase === 'play')) return null;
  return (
    <View
      style={{
        height: 64 + Math.max(insets.bottom, 14),
        paddingBottom: Math.max(insets.bottom, 14),
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: C.hairline,
        backgroundColor: C.surface,
      }}
    >
      {TABS.map(({ name, label, Icon }) => {
        const route = state.routes.find((r) => r.name === name);
        const on = current === name;
        const color = on ? C.accent : C.textMuted;
        return (
          <Pressable
            key={name}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            accessibilityLabel={label}
            onPress={() => route && navigateToTab(route.key)}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4 }}
          >
            <Icon size={24} color={color} strokeWidth={2} />
            <Text style={t('ui700', 11, color, undefined, 0.06)}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function TabsLayout() {
  const { s } = useStore();
  if (!s.user) return <Redirect href="/welcome" />;
  return (
    <Tabs
      tabBar={(p) => <TabBar {...p} />}
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: C.page }, animation: 'none' }}
    >
      {TABS.map((tab) => (
        <Tabs.Screen key={tab.name} name={tab.name} />
      ))}
    </Tabs>
  );
}
