import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackButton, Button, Checkbox, Input } from '../components/ui';
import { useStore } from '../lib/store';
import { C, t } from '../lib/theme';

export default function Signup() {
  const { set, toast } = useStore();
  const [name, setName] = useState('');
  const [year, setYear] = useState('');
  const [school, setSchool] = useState('');
  const [agree, setAgree] = useState(false);

  const nameOk = /^[a-z0-9._]{3,16}$/i.test(name);
  const yearFull = /^\d{4}$/.test(year);
  const age = new Date().getFullYear() - parseInt(year, 10);
  const ageOk = yearFull && age >= 13 && age <= 100;

  const create = () => {
    // Production: create the Supabase auth user and profiles row. Store the birth year only.
    set({ user: { name, year, school: school.trim() } });
    router.replace('/');
    toast(`Welcome, ${name}`);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.page }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingBottom: 28, gap: 18 }} keyboardShouldPersistTaps="handled">
          <BackButton onPress={() => router.back()} style={{ marginLeft: -12 }} />
          <View style={{ gap: 6 }}>
            <Text style={t('display900i', 34, C.text, 0.95)}>CREATE YOUR PLAYER</Text>
            <Text style={t('body400', 15, C.textSecondary, 1.4)}>Takes ten seconds. Your username shows on leaderboards.</Text>
          </View>
          <Input
            label="Username"
            size="lg"
            value={name}
            onChangeText={(v) => setName(v.slice(0, 16))}
            error={name && !nameOk ? 'Use 3–16 letters, numbers, . or _' : ''}
            hint="3–16 characters: letters, numbers, . or _"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="off"
            textContentType="username"
          />
          <Input
            label="Birth year"
            size="lg"
            placeholder="YYYY"
            keyboardType="number-pad"
            value={year}
            onChangeText={(v) => setYear(v.replace(/\D/g, '').slice(0, 4))}
            error={yearFull && !ageOk ? (age < 13 ? 'You need to be 13 or older to play.' : 'Check your birth year.') : ''}
            hint="Never shown to anyone. You must be 13+."
          />
          <Input
            label="School (optional)"
            size="lg"
            value={school}
            onChangeText={setSchool}
            hint="Puts you on your school's leaderboard"
          />
          <Checkbox checked={agree} onChange={setAgree} label="I agree to the Terms of Service and Privacy Policy" />
          <View style={{ marginTop: 'auto' }}>
            <Button size="lg" block cut disabled={!(nameOk && ageOk && agree)} onPress={create}>
              Create account
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
