import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, SafeAreaView,
  Alert, ActivityIndicator, ScrollView, StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { SettingsStackParamList } from '@/navigation/types';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/auth.service';
import { useTheme } from '@/lib/theme';

type Props = { navigation: NativeStackNavigationProp<SettingsStackParamList, 'Profile'> };

export default function ProfileScreen({ navigation }: Props) {
  const c = useTheme();
  const { profile, user, setProfile } = useAuthStore();
  const [displayName, setDisplayName] = useState(profile?.display_name ?? '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const updated = await authService.updateProfile(user.id, {
        display_name: displayName.trim() || null,
      });
      setProfile(updated);
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Error', err.message ?? 'No se pudo actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.card,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: c.border,
    },
    headerTitle: {
      fontWeight: 'bold',
      color: c.text,
      fontSize: 16,
    },
    saveText: {
      color: c.primaryDark,
      fontWeight: 'bold',
      fontSize: 16,
    },
    scrollView: {
      flex: 1,
      paddingHorizontal: 20,
    },
    avatarContainer: {
      alignItems: 'center',
      marginTop: 32,
      marginBottom: 32,
    },
    avatar: {
      width: 96,
      height: 96,
      borderRadius: 9999,
      backgroundColor: c.primaryBg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: {
      fontSize: 36,
      fontWeight: 'bold',
      color: c.primaryDark,
    },
    fieldLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: c.textMuted,
      marginBottom: 8,
    },
    nameInput: {
      backgroundColor: c.cardAlt,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      color: c.text,
      fontSize: 16,
      marginBottom: 20,
    },
    emailContainer: {
      backgroundColor: c.cardAlt,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      marginBottom: 20,
    },
    emailText: {
      color: c.textPlaceholder,
      fontSize: 16,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={c.textMuted} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mi perfil</Text>
        <TouchableOpacity onPress={handleSave} disabled={loading}>
          {loading ? (
            <ActivityIndicator color={c.primary} />
          ) : (
            <Text style={styles.saveText}>Guardar</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(displayName || user?.email || '?')[0].toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Name */}
        <Text style={styles.fieldLabel}>
          Nombre visible
        </Text>
        <TextInput
          value={displayName}
          onChangeText={setDisplayName}
          placeholder="Tu nombre"
          placeholderTextColor={c.textPlaceholder}
          autoCapitalize="words"
          style={styles.nameInput}
        />

        {/* Email (read only) */}
        <Text style={styles.fieldLabel}>Email</Text>
        <View style={styles.emailContainer}>
          <Text style={styles.emailText}>{user?.email}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
