import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  SafeAreaView, Alert, ActivityIndicator, StyleSheet,
} from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { HabitsStackParamList } from '@/navigation/types';
import { useCreateHabit } from '@/hooks/useHabits';
import { HABIT_CATEGORY_LABELS, HABIT_CATEGORY_ICONS, HABIT_COLORS, DAY_NAMES } from '@/lib/constants';
import { toDateString } from '@/utils/dateUtils';
import type { HabitCategory } from '@/types';

type Props = { navigation: NativeStackNavigationProp<HabitsStackParamList, 'CreateHabit'> };

const EMOJIS = ['✨', '💪', '📚', '🧘', '🏃', '💧', '🥗', '😴', '🎯', '🎸', '✍️', '🌿', '🧹', '💊', '🌅'];
const CATEGORIES = Object.keys(HABIT_CATEGORY_LABELS) as HabitCategory[];

export default function CreateHabitScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('✨');
  const [color, setColor] = useState(HABIT_COLORS[0]);
  const [category, setCategory] = useState<HabitCategory>('other');
  const [targetDays, setTargetDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);

  const createHabit = useCreateHabit();

  const toggleDay = (day: number) => {
    setTargetDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'El nombre no puede estar vacío');
      return;
    }
    if (targetDays.length === 0) {
      Alert.alert('Error', 'Selecciona al menos un día');
      return;
    }
    try {
      await createHabit.mutateAsync({
        name: name.trim(),
        icon,
        color,
        category,
        frequency: 'custom',
        target_days: targetDays.sort(),
        target_count: 1,
        description: null,
        reminder_time: null,
        reminder_enabled: false,
        archived: false,
        start_date: toDateString(new Date()),
      });
      navigation.goBack();
    } catch {
      Alert.alert('Error', 'No se pudo crear el hábito.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nuevo hábito</Text>
        <TouchableOpacity onPress={handleSave} disabled={createHabit.isPending}>
          {createHabit.isPending ? (
            <ActivityIndicator color="#3b82f6" />
          ) : (
            <Text style={styles.saveText}>Guardar</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
        {/* Preview */}
        <View style={styles.previewContainer}>
          <View style={[styles.previewIcon, { backgroundColor: color + '20' }]}>
            <Text style={styles.previewEmoji}>{icon}</Text>
          </View>
        </View>

        {/* Name */}
        <Text style={styles.sectionLabel}>Nombre</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Ej: Meditación, Leer 30 min..."
          placeholderTextColor="#94a3b8"
          autoFocus
          style={styles.nameInput}
        />

        {/* Icon */}
        <Text style={styles.sectionLabel}>Icono</Text>
        <View style={styles.emojiGrid}>
          {EMOJIS.map((e) => (
            <TouchableOpacity
              key={e}
              onPress={() => setIcon(e)}
              style={[
                styles.emojiButton,
                {
                  backgroundColor: icon === e ? color + '30' : '#f1f5f9',
                  borderWidth: icon === e ? 2 : 0,
                  borderColor: color,
                },
              ]}
            >
              <Text style={styles.emojiText}>{e}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Color */}
        <Text style={styles.sectionLabel}>Color</Text>
        <View style={styles.colorGrid}>
          {HABIT_COLORS.map((c) => (
            <TouchableOpacity
              key={c}
              onPress={() => setColor(c)}
              style={[
                styles.colorButton,
                {
                  backgroundColor: c,
                  borderWidth: color === c ? 3 : 0,
                  borderColor: 'white',
                },
              ]}
            />
          ))}
        </View>

        {/* Category */}
        <Text style={styles.sectionLabel}>Categoría</Text>
        <View style={styles.chipGrid}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setCategory(cat)}
              style={[
                styles.categoryChip,
                {
                  borderColor: category === cat ? color : '#e2e8f0',
                  backgroundColor: category === cat ? color + '20' : 'transparent',
                },
              ]}
            >
              <Text style={styles.categoryIcon}>{HABIT_CATEGORY_ICONS[cat]}</Text>
              <Text style={[styles.categoryLabel, { color: category === cat ? color : '#94a3b8' }]}>
                {HABIT_CATEGORY_LABELS[cat]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Days */}
        <Text style={styles.sectionLabel}>Días</Text>
        <View style={styles.daysRow}>
          {DAY_NAMES.map((day, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => toggleDay(i)}
              style={[
                styles.dayButton,
                { backgroundColor: targetDays.includes(i) ? color : '#f1f5f9' },
              ]}
            >
              <Text
                style={[
                  styles.dayLabel,
                  { color: targetDays.includes(i) ? 'white' : '#94a3b8' },
                ]}
              >
                {day.charAt(0)}
              </Text>
            </TouchableOpacity>
          ))}
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
  cancelText: {
    color: '#64748b',
    fontSize: 16,
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
  previewContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  previewIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewEmoji: {
    fontSize: 36,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 12,
  },
  nameInput: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#0f172a',
    fontSize: 16,
    marginBottom: 20,
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  emojiButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiText: {
    fontSize: 24,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    borderWidth: 1,
  },
  categoryIcon: {
    fontSize: 14,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
});
