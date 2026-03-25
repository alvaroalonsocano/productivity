import React from 'react';
import {
  View, Text, TouchableOpacity, SafeAreaView, ScrollView, Alert, StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { SettingsStackParamList } from '@/navigation/types';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/auth.service';

type Props = { navigation: NativeStackNavigationProp<SettingsStackParamList, 'Settings'> };

function SettingRow({
  icon, label, sublabel, onPress, danger = false,
}: { icon: string; label: string; sublabel?: string; onPress: () => void; danger?: boolean }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.settingRow}
      activeOpacity={0.7}
    >
      <View style={[styles.settingIcon, danger ? styles.settingIconDanger : styles.settingIconDefault]}>
        <Ionicons name={icon as any} size={20} color={danger ? '#ef4444' : '#64748b'} />
      </View>
      <View style={styles.settingTextContainer}>
        <Text style={[styles.settingLabel, danger ? styles.settingLabelDanger : styles.settingLabelDefault]}>
          {label}
        </Text>
        {sublabel && <Text style={styles.settingSublabel}>{sublabel}</Text>}
      </View>
      {!danger && <Ionicons name="chevron-forward" size={18} color="#cbd5e1" />}
    </TouchableOpacity>
  );
}

export default function SettingsScreen({ navigation }: Props) {
  const { profile, user } = useAuthStore();

  const handleSignOut = () => {
    Alert.alert('Cerrar sesión', '¿Seguro que quieres salir?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Cerrar sesión', style: 'destructive', onPress: () => authService.signOut() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ajustes</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Account */}
        <Text style={styles.sectionHeader}>
          Cuenta
        </Text>
        <View style={styles.card}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Profile')}
            style={styles.profileRow}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {(profile?.display_name ?? user?.email ?? '?')[0].toUpperCase()}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>
                {profile?.display_name ?? 'Tu nombre'}
              </Text>
              <Text style={styles.profileEmail}>{user?.email}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#cbd5e1" />
          </TouchableOpacity>
        </View>

        {/* App */}
        <Text style={styles.sectionHeader}>
          Aplicación
        </Text>
        <View style={styles.card}>
          <SettingRow
            icon="notifications-outline"
            label="Notificaciones"
            sublabel="Recordatorios de hábitos"
            onPress={() => {}}
          />
          <View style={styles.rowDivider} />
          <SettingRow
            icon="moon-outline"
            label="Tema"
            sublabel="Sistema"
            onPress={() => {}}
          />
        </View>

        {/* Data */}
        <Text style={styles.sectionHeader}>
          Datos
        </Text>
        <View style={styles.card}>
          <SettingRow icon="download-outline" label="Exportar datos" onPress={() => {}} />
        </View>

        {/* Sign out */}
        <View style={[styles.card, styles.cardMarginTop]}>
          <SettingRow icon="log-out-outline" label="Cerrar sesión" onPress={handleSignOut} danger />
        </View>

        <Text style={styles.versionText}>
          Productivity v1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  scrollView: {
    flex: 1,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 4,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  cardMarginTop: {
    marginTop: 24,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 9999,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontWeight: '600',
    color: '#0f172a',
    fontSize: 16,
  },
  profileEmail: {
    fontSize: 14,
    color: '#94a3b8',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingIconDefault: {
    backgroundColor: '#f1f5f9',
  },
  settingIconDanger: {
    backgroundColor: '#fef2f2',
  },
  settingTextContainer: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingLabelDefault: {
    color: '#0f172a',
  },
  settingLabelDanger: {
    color: '#ef4444',
  },
  settingSublabel: {
    fontSize: 14,
    color: '#94a3b8',
  },
  rowDivider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginLeft: 72,
  },
  versionText: {
    fontSize: 12,
    color: '#cbd5e1',
    textAlign: 'center',
    marginTop: 32,
    marginBottom: 16,
  },
});
