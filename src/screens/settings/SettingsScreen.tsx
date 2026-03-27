import React from 'react';
import {
  View, Text, TouchableOpacity, SafeAreaView, ScrollView, Alert, StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { SettingsStackParamList } from '@/navigation/types';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/auth.service';
import { useTheme } from '@/lib/theme';
import type { AppColors } from '@/lib/theme';
import { useUIStore } from '@/store/uiStore';

type Props = { navigation: NativeStackNavigationProp<SettingsStackParamList, 'Settings'> };

const THEME_LABELS: Record<string, string> = {
  system: 'Sistema',
  light: 'Claro',
  dark: 'Oscuro',
};

function SettingRow({
  icon, label, sublabel, onPress, danger = false, c, styles,
}: {
  icon: string;
  label: string;
  sublabel?: string;
  onPress: () => void;
  danger?: boolean;
  c: AppColors;
  styles: ReturnType<typeof makeStyles>;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.settingRow}
      activeOpacity={0.7}
    >
      <View style={[styles.settingIcon, danger ? styles.settingIconDanger : styles.settingIconDefault]}>
        <Ionicons name={icon as any} size={20} color={danger ? c.danger : c.textMuted} />
      </View>
      <View style={styles.settingTextContainer}>
        <Text style={[styles.settingLabel, danger ? styles.settingLabelDanger : styles.settingLabelDefault]}>
          {label}
        </Text>
        {sublabel && <Text style={styles.settingSublabel}>{sublabel}</Text>}
      </View>
      {!danger && <Ionicons name="chevron-forward" size={18} color={c.borderStrong} />}
    </TouchableOpacity>
  );
}

function makeStyles(c: AppColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.bg,
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 16,
      backgroundColor: c.card,
      borderBottomWidth: 1,
      borderBottomColor: c.border,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: c.text,
    },
    scrollView: {
      flex: 1,
    },
    sectionHeader: {
      fontSize: 12,
      fontWeight: '600',
      color: c.textPlaceholder,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      paddingHorizontal: 20,
      marginTop: 24,
      marginBottom: 4,
    },
    card: {
      backgroundColor: c.card,
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
      backgroundColor: c.primaryBg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: c.primaryDark,
    },
    profileInfo: {
      flex: 1,
    },
    profileName: {
      fontWeight: '600',
      color: c.text,
      fontSize: 16,
    },
    profileEmail: {
      fontSize: 14,
      color: c.textPlaceholder,
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
      backgroundColor: c.cardAlt,
    },
    settingIconDanger: {
      backgroundColor: c.dangerBg,
    },
    settingTextContainer: {
      flex: 1,
    },
    settingLabel: {
      fontSize: 16,
      fontWeight: '500',
    },
    settingLabelDefault: {
      color: c.text,
    },
    settingLabelDanger: {
      color: c.danger,
    },
    settingSublabel: {
      fontSize: 14,
      color: c.textPlaceholder,
    },
    rowDivider: {
      height: 1,
      backgroundColor: c.border,
      marginLeft: 72,
    },
    versionText: {
      fontSize: 12,
      color: c.borderStrong,
      textAlign: 'center',
      marginTop: 32,
      marginBottom: 16,
    },
  });
}

export default function SettingsScreen({ navigation }: Props) {
  const c = useTheme();
  const styles = makeStyles(c);
  const { profile, user } = useAuthStore();
  const { themePreference, setThemePreference } = useUIStore();

  const handleSignOut = () => {
    Alert.alert('Cerrar sesión', '¿Seguro que quieres salir?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Cerrar sesión', style: 'destructive', onPress: () => authService.signOut() },
    ]);
  };

  const handleThemePress = () => {
    Alert.alert('Tema', 'Elige el tema de la aplicación', [
      {
        text: 'Sistema',
        onPress: () => setThemePreference('system'),
      },
      {
        text: 'Claro',
        onPress: () => setThemePreference('light'),
      },
      {
        text: 'Oscuro',
        onPress: () => setThemePreference('dark'),
      },
      { text: 'Cancelar', style: 'cancel' },
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
            <Ionicons name="chevron-forward" size={18} color={c.borderStrong} />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <Text style={styles.sectionHeader}>
          Datos
        </Text>
        <View style={styles.card}>
          <SettingRow
            icon="bar-chart-outline"
            label="Estadísticas"
            sublabel="Tareas, hábitos y estado de ánimo"
            onPress={() => navigation.navigate('Stats')}
            c={c}
            styles={styles}
          />
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
            c={c}
            styles={styles}
          />
          <View style={styles.rowDivider} />
          <SettingRow
            icon="moon-outline"
            label="Tema"
            sublabel={THEME_LABELS[themePreference]}
            onPress={handleThemePress}
            c={c}
            styles={styles}
          />
        </View>

        {/* Data */}
        <Text style={styles.sectionHeader}>
          Datos
        </Text>
        <View style={styles.card}>
          <SettingRow icon="download-outline" label="Exportar datos" onPress={() => {}} c={c} styles={styles} />
        </View>

        {/* Sign out */}
        <View style={[styles.card, styles.cardMarginTop]}>
          <SettingRow icon="log-out-outline" label="Cerrar sesión" onPress={handleSignOut} danger c={c} styles={styles} />
        </View>

        <Text style={styles.versionText}>
          Productivity v1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
