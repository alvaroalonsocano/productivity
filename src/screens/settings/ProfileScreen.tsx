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

type Props = { navigation: NativeStackNavigationProp<SettingsStackParamList, 'Profile'> };

export default function ProfileScreen({ navigation }: Props) {
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

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#64748b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mi perfil</Text>
        <TouchableOpacity onPress={handleSave} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#3b82f6" />
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
          placeholderTextColor="#94a3b8"
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerTitle: {
    fontWeight: 'bold',
    color: '#0f172a',
    fontSize: 16,
  },
  saveText: {
    color: '#2563eb',
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
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  nameInput: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#0f172a',
    fontSize: 16,
    marginBottom: 20,
  },
  emailContainer: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 20,
  },
  emailText: {
    color: '#94a3b8',
    fontSize: 16,
  },
});
