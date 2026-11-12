import { Barlow_400Regular, Barlow_500Medium } from '@expo-google-fonts/barlow';
import {
  BarlowSemiCondensed_500Medium,
  BarlowSemiCondensed_600SemiBold,
  BarlowSemiCondensed_700Bold,
} from '@expo-google-fonts/barlow-semi-condensed';
import { Saira_700Bold_Italic, Saira_800ExtraBold_Italic, Saira_900Black_Italic } from '@expo-google-fonts/saira';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { ResultSheet, Toast } from '../components/chrome';
import { StoreProvider, useStore } from '../lib/store';
import { C } from '../lib/theme';

function Root() {
  const { s } = useStore();
  if (!s.hydrated) return <View style={{ flex: 1, backgroundColor: C.page }} />;
  return (
    <View style={{ flex: 1, backgroundColor: C.page }}>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: C.page }, animation: 'slide_from_right' }}>
        <Stack.Screen name="welcome" options={{ animation: 'fade' }} />
        <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
      </Stack>
      <ResultSheet />
      <Toast />
    </View>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    Saira_700Bold_Italic,
    Saira_800ExtraBold_Italic,
    Saira_900Black_Italic,
    Barlow_400Regular,
    Barlow_500Medium,
    BarlowSemiCondensed_500Medium,
    BarlowSemiCondensed_600SemiBold,
    BarlowSemiCondensed_700Bold,
  });
  return (
    <StoreProvider>
      <StatusBar style="light" />
      {loaded ? <Root /> : <View style={{ flex: 1, backgroundColor: C.page }} />}
    </StoreProvider>
  );
}
