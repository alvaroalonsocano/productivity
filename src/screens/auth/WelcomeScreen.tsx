import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '@/navigation/types';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Welcome'>;
};

const features = [
  { icon: '✅', title: 'Tareas', desc: 'Organiza tu día con proyectos y prioridades' },
  { icon: '🔥', title: 'Hábitos', desc: 'Construye rutinas y mantén tu racha' },
  { icon: '📓', title: 'Diario', desc: 'Refleja y rastrea tu estado de ánimo' },
];

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.inner}>
        <View style={styles.header}>
          <Text style={styles.emoji}>⚡</Text>
          <Text style={styles.title}>Productivity</Text>
          <Text style={styles.subtitle}>
            Tu espacio personal para ser más productivo cada día
          </Text>
        </View>

        <View style={styles.features}>
          {features.map((f) => (
            <View key={f.title} style={styles.featureCard}>
              <Text style={styles.featureIcon}>{f.icon}</Text>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureDesc}>{f.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => navigation.navigate('SignUp')}
          >
            <Text style={styles.btnPrimaryText}>Crear cuenta</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnSecondary}
            onPress={() => navigation.navigate('SignIn')}
          >
            <Text style={styles.btnSecondaryText}>Ya tengo cuenta</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  inner: { flex: 1, paddingHorizontal: 24, justifyContent: 'space-between', paddingVertical: 48 },
  header: { alignItems: 'center', marginTop: 32 },
  emoji: { fontSize: 48, marginBottom: 16 },
  title: { fontSize: 36, fontWeight: 'bold', color: '#0f172a', textAlign: 'center' },
  subtitle: { color: '#64748b', textAlign: 'center', marginTop: 12, fontSize: 16 },
  features: { gap: 12 },
  featureCard: {
    flexDirection: 'row', alignItems: 'center', gap: 16,
    backgroundColor: '#f8fafc', borderRadius: 16, padding: 16,
  },
  featureIcon: { fontSize: 28 },
  featureText: { flex: 1 },
  featureTitle: { fontWeight: '600', color: '#0f172a', fontSize: 16 },
  featureDesc: { color: '#64748b', fontSize: 14, marginTop: 2 },
  buttons: { gap: 12 },
  btnPrimary: {
    backgroundColor: '#2563eb', borderRadius: 16,
    paddingVertical: 16, alignItems: 'center',
  },
  btnPrimaryText: { color: '#ffffff', fontWeight: 'bold', fontSize: 16 },
  btnSecondary: {
    borderRadius: 16, paddingVertical: 16,
    alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0',
  },
  btnSecondaryText: { color: '#334155', fontWeight: '600', fontSize: 16 },
});
