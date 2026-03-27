import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  SafeAreaView, Alert, ActivityIndicator, StyleSheet, Switch, Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { HabitsStackParamList } from '@/navigation/types';
import { useCreateHabit } from '@/hooks/useHabits';
import { HABIT_CATEGORY_LABELS, HABIT_CATEGORY_ICONS, HABIT_COLORS, DAY_NAMES } from '@/lib/constants';
import { toDateString } from '@/utils/dateUtils';
import type { HabitCategory } from '@/types';
import { useTheme } from '@/lib/theme';
import { scheduleHabitReminder, requestNotificationPermissions } from '@/services/notifications.service';

type Props = { navigation: NativeStackNavigationProp<HabitsStackParamList, 'CreateHabit'> };

const EMOJIS = ['✨', '💪', '📚', '🧘', '🏃', '💧', '🥗', '😴', '🎯', '🎸', '✍️', '🌿', '🧹', '💊', '🌅'];
const CATEGORIES = Object.keys(HABIT_CATEGORY_LABELS) as HabitCategory[];

export default function CreateHabitScreen({ navigation }: Props) {
  const c = useTheme();
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('✨');
  const [color, setColor] = useState(HABIT_COLORS[0]);
  const [category, setCategory] = useState<HabitCategory>('other');
  const [targetDays, setTargetDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState(() => { const d = new Date(); d.setHours(9, 0, 0, 0); return d; });
  const [showTimePicker, setShowTimePicker] = useState(false);

  const createHabit = useCreateHabit();

  const toggleDay = (day: number) => {
    setTargetDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const reminderTimeString = `${String(reminderTime.getHours()).padStart(2, '0')}:${String(reminderTime.getMinutes()).padStart(2, '0')}`;

  const handleReminderToggle = async (value: boolean) => {
    if (value) {
      const granted = await requestNotificationPermissions();
      if (!granted) {
        Alert.alert('Permisos necesarios', 'Activa las notificaciones en Ajustes para recibir recordatorios.');
        return;
      }
    }
    setReminderEnabled(value);
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
      const habit = await createHabit.mutateAsync({
        name: name.trim(),
        icon,
        color,
        category,
        frequency: 'custom',
        target_days: targetDays.sort(),
        target_count: 1,
        description: null,
        reminder_time: reminderEnabled ? reminderTimeString : null,
        reminder_enabled: reminderEnabled,
        archived: false,
        start_date: toDateString(new Date()),
      });
      if (reminderEnabled && habit) {
        await scheduleHabitReminder({ ...habit, reminder_time: reminderTimeString, reminder_enabled: true, target_days: targetDays.sort() });
      }
      navigation.goBack();
    } catch {
      Alert.alert('Error', 'No se pudo crear el hábito.');
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
    cancelText: {
      color: c.textMuted,
      fontSize: 16,
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
      color: c.textMuted,
      marginBottom: 12,
    },
    nameInput: {
      backgroundColor: c.bg,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      color: c.text,
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
      marginBottom: 24,
    },
    reminderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 14,
      paddingHorizontal: 16,
      backgroundColor: c.bg,
      borderRadius: 12,
      marginBottom: 8,
    },
    reminderLabel: {
      fontSize: 16,
      color: c.text,
      fontWeight: '500',
    },
    reminderTimeButton: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      backgroundColor: c.primaryBg,
      borderRadius: 10,
      marginBottom: 24,
      alignSelf: 'flex-start',
    },
    reminderTimeText: {
      color: c.primary,
      fontSize: 16,
      fontWeight: '600',
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
            <ActivityIndicator color={c.primary} />
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
          placeholderTextColor={c.textPlaceholder}
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
                  backgroundColor: icon === e ? color + '30' : c.cardAlt,
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
          {HABIT_COLORS.map((col) => (
            <TouchableOpacity
              key={col}
              onPress={() => setColor(col)}
              style={[
                styles.colorButton,
                {
                  backgroundColor: col,
                  borderWidth: color === col ? 3 : 0,
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
                  borderColor: category === cat ? color : c.borderStrong,
                  backgroundColor: category === cat ? color + '20' : 'transparent',
                },
              ]}
            >
              <Text style={styles.categoryIcon}>{HABIT_CATEGORY_ICONS[cat]}</Text>
              <Text style={[styles.categoryLabel, { color: category === cat ? color : c.textPlaceholder }]}>
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
                { backgroundColor: targetDays.includes(i) ? color : c.cardAlt },
              ]}
            >
              <Text
                style={[
                  styles.dayLabel,
                  { color: targetDays.includes(i) ? 'white' : c.textPlaceholder },
                ]}
              >
                {day.charAt(0)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Reminder */}
        <Text style={styles.sectionLabel}>Recordatorio</Text>
        <View style={styles.reminderRow}>
          <Text style={styles.reminderLabel}>🔔 Activar recordatorio</Text>
          <Switch
            value={reminderEnabled}
            onValueChange={handleReminderToggle}
            trackColor={{ false: c.borderStrong, true: color }}
            thumbColor="white"
          />
        </View>
        {reminderEnabled && (
          <>
            <TouchableOpacity style={styles.reminderTimeButton} onPress={() => setShowTimePicker(true)}>
              <Text style={styles.reminderTimeText}>⏰ {reminderTimeString}</Text>
            </TouchableOpacity>
            {(showTimePicker || Platform.OS === 'ios') && (
              <DateTimePicker
                value={reminderTime}
                mode="time"
                is24Hour
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(_, date) => {
                  setShowTimePicker(false);
                  if (date) setReminderTime(date);
                }}
              />
            )}
          </>
        )}
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
