import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, KeyboardAvoidingView, Platform,
  ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '@/navigation/types';
import { authService } from '@/services/auth.service';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'SignUp'>;
};

export default function SignUpScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!email.trim() || !password || !confirm) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }
    if (password !== confirm) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }
    setLoading(true);
    try {
      await authService.signUp(email.trim().toLowerCase(), password, name.trim() || undefined);
    } catch (err: any) {
      Alert.alert('Error al registrarse', err.message ?? 'Inténtalo de nuevo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.inner}>
            <View>
              <Text style={styles.title}>Crear cuenta</Text>
              <Text style={styles.subtitle}>Empieza tu camino hacia la productividad</Text>
            </View>

            <View style={styles.fields}>
              <View>
                <Text style={styles.label}>Nombre (opcional)</Text>
                <TextInput value={name} onChangeText={setName} placeholder="Tu nombre"
                  placeholderTextColor="#94a3b8" autoCapitalize="words" style={styles.input} />
              </View>
              <View>
                <Text style={styles.label}>Email</Text>
                <TextInput value={email} onChangeText={setEmail} placeholder="tu@email.com"
                  placeholderTextColor="#94a3b8" keyboardType="email-address"
                  autoCapitalize="none" autoComplete="email" style={styles.input} />
              </View>
              <View>
                <Text style={styles.label}>Contraseña</Text>
                <TextInput value={password} onChangeText={setPassword}
                  placeholder="Mínimo 6 caracteres" placeholderTextColor="#94a3b8"
                  secureTextEntry style={styles.input} />
              </View>
              <View>
                <Text style={styles.label}>Confirmar contraseña</Text>
                <TextInput value={confirm} onChangeText={setConfirm}
                  placeholder="Repite tu contraseña" placeholderTextColor="#94a3b8"
                  secureTextEntry style={styles.input} />
              </View>
            </View>

            <TouchableOpacity onPress={handleSignUp} disabled={loading} style={styles.btnPrimary}>
              {loading ? <ActivityIndicator color="white" /> : <Text style={styles.btnText}>Crear cuenta</Text>}
            </TouchableOpacity>

            <View style={styles.row}>
              <Text style={styles.mutedText}>¿Ya tienes cuenta? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                <Text style={styles.link}>Inicia sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  flex: { flex: 1 },
  scroll: { flexGrow: 1 },
  inner: { flex: 1, paddingHorizontal: 24, justifyContent: 'center', gap: 24, paddingVertical: 48 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#0f172a' },
  subtitle: { color: '#64748b', marginTop: 4 },
  fields: { gap: 16 },
  label: { fontSize: 14, fontWeight: '500', color: '#334155', marginBottom: 6 },
  input: {
    backgroundColor: '#f1f5f9', borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 14,
    color: '#0f172a', fontSize: 16,
  },
  btnPrimary: {
    backgroundColor: '#2563eb', borderRadius: 16,
    paddingVertical: 16, alignItems: 'center',
  },
  btnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 16 },
  row: { flexDirection: 'row', justifyContent: 'center' },
  mutedText: { color: '#64748b' },
  link: { color: '#2563eb', fontWeight: '600' },
});
