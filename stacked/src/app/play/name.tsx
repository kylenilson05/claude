import { KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GameHeader } from '../../components/chrome';
import { NameEmBoard } from '../../components/NameEm';
import { C } from '../../lib/theme';

export default function NameEm() {
  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: C.page }}>
      <GameHeader eyebrow="TODAY · 3 OF 3" title="NAME 'EM" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <NameEmBoard which="neDaily" />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
