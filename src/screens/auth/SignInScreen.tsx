import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, KeyboardAvoidingView, Platform,
  ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '@/navigation/types';
import { authService } from '@/services/auth.service';
import { useTheme } from '@/lib/theme';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'SignIn'>;
};

export default function SignInScreen({ navigation }: Props) {
  const c = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Error', 'Por favor, introduce email y contraseña');
      return;
    }
    setLoading(true);
    try {
      await authService.signIn(email.trim().toLowerCase(), password);
    } catch (err: any) {
      Alert.alert('Error al iniciar sesión', err.message ?? 'Inténtalo de nuevo');
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: c.card },
    flex: { flex: 1 },
    scroll: { flexGrow: 1 },
    inner: { flex: 1, paddingHorizontal: 24, justifyContent: 'center', gap: 24, paddingVertical: 48 },
    title: { fontSize: 28, fontWeight: 'bold', color: c.text },
    subtitle: { color: c.textMuted, marginTop: 4 },
    fields: { gap: 16 },
    label: { fontSize: 14, fontWeight: '500', color: c.cardAlt, marginBottom: 6 },
    input: {
      backgroundColor: c.cardAlt, borderRadius: 12,
      paddingHorizontal: 16, paddingVertical: 14,
      color: c.text, fontSize: 16,
    },
    btnPrimary: {
      backgroundColor: c.primaryDark, borderRadius: 16,
      paddingVertical: 16, alignItems: 'center',
    },
    btnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 16 },
    row: { flexDirection: 'row', justifyContent: 'center' },
    mutedText: { color: c.textMuted },
    link: { color: c.primaryDark, fontWeight: '600' },
  });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.inner}>
            <View>
              <Text style={styles.title}>Bienvenido de vuelta</Text>
              <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
            </View>

            <View style={styles.fields}>
              <View>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  value={email} onChangeText={setEmail}
                  placeholder="tu@email.com" placeholderTextColor={c.textPlaceholder}
                  keyboardType="email-address" autoCapitalize="none" autoComplete="email"
                  style={styles.input}
                />
              </View>
              <View>
                <Text style={styles.label}>Contraseña</Text>
                <TextInput
                  value={password} onChangeText={setPassword}
                  placeholder="••••••••" placeholderTextColor={c.textPlaceholder}
                  secureTextEntry autoComplete="password"
                  style={styles.input}
                />
              </View>
            </View>

            <TouchableOpacity onPress={handleSignIn} disabled={loading} style={styles.btnPrimary}>
              {loading ? <ActivityIndicator color="white" /> : <Text style={styles.btnText}>Iniciar sesión</Text>}
            </TouchableOpacity>

            <View style={styles.row}>
              <Text style={styles.mutedText}>¿No tienes cuenta? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.link}>Regístrate</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
