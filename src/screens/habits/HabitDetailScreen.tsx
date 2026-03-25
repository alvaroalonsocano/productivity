import React, { useMemo } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, SafeAreaView,
  ActivityIndicator, Alert, StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { HabitsStackParamList } from '@/navigation/types';
import { useHabit, useHabitLogs } from '@/hooks/useHabits';
import { useHabitStreak } from '@/hooks/useHabitStreak';
import WeeklyGrid from '@/components/habits/WeeklyGrid';
import { HABIT_CATEGORY_LABELS } from '@/lib/constants';
import { toDateString } from '@/utils/dateUtils';
import { subDays, format } from 'date-fns';
import { habitService } from '@/services/habit.service';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';

type Props = {
  navigation: NativeStackNavigationProp<HabitsStackParamList, 'HabitDetail'>;
  route: RouteProp<HabitsStackParamList, 'HabitDetail'>;
};

export default function HabitDetailScreen({ navigation, route }: Props) {
  const { habitId } = route.params;
  const userId = useAuthStore((s) => s.user?.id);
  const qc = useQueryClient();

  const { data: habit, isLoading } = useHabit(habitId);
  const { data: logs = [] } = useHabitLogs(habitId);
  const streak = useHabitStreak(habit, logs);

  const completedDates = useMemo(() => new Set(logs.map((l) => l.log_date)), [logs]);

  // Last 12 weeks for heat map
  const heatMapDates = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 84 }, (_, i) =>
      format(subDays(today, 83 - i), 'yyyy-MM-dd')
    );
  }, []);

  const handleArchive = () => {
    Alert.alert('Archivar hábito', '¿Seguro que quieres archivar este hábito?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Archivar',
        style: 'destructive',
        onPress: async () => {
          await habitService.archiveHabit(habitId);
          qc.invalidateQueries({ queryKey: ['habits', userId] });
          navigation.goBack();
        },
      },
    ]);
  };

  if (isLoading || !habit) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator color="#3b82f6" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#64748b" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleArchive}>
          <Ionicons name="archive-outline" size={22} color="#94a3b8" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Habit info */}
        <View style={styles.habitInfoCenter}>
          <View
            style={[styles.habitIconContainer, { backgroundColor: habit.color + '20' }]}
          >
            <Text style={styles.habitIcon}>{habit.icon ?? '✨'}</Text>
          </View>
          <Text style={styles.habitName}>{habit.name}</Text>
          <Text style={styles.habitCategory}>{HABIT_CATEGORY_LABELS[habit.category]}</Text>
        </View>

        {/* Stats */}
        {streak && (
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: habit.color }]}>
                {streak.current_streak}
              </Text>
              <Text style={styles.statLabel}>Racha actual</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValueDark}>
                {streak.longest_streak}
              </Text>
              <Text style={styles.statLabel}>Mejor racha</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValueDark}>
                {streak.total_completions}
              </Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValueDark}>
                {Math.round(streak.completion_rate_30d * 100)}%
              </Text>
              <Text style={styles.statLabel}>Últimos 30d</Text>
            </View>
          </View>
        )}

        {/* Weekly grid */}
        <Text style={styles.sectionLabel}>Última semana</Text>
        <WeeklyGrid completedDates={completedDates} color={habit.color} selectedDate={toDateString(new Date())} />

        {/* Heat map (12 weeks) */}
        <Text style={[styles.sectionLabel, styles.sectionLabelTop]}>Últimas 12 semanas</Text>
        <View style={styles.heatMap}>
          {heatMapDates.map((date) => (
            <View
              key={date}
              style={[styles.heatMapCell, { backgroundColor: completedDates.has(date) ? habit.color : '#f1f5f9' }]}
            />
          ))}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
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
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  habitInfoCenter: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 24,
  },
  habitIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  habitIcon: {
    fontSize: 36,
  },
  habitName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  habitCategory: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    paddingVertical: 20,
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statValueDark: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  statLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e2e8f0',
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 12,
  },
  sectionLabelTop: {
    marginTop: 24,
  },
  heatMap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  heatMapCell: {
    width: 28,
    height: 28,
    borderRadius: 4,
  },
  bottomSpacer: {
    height: 32,
  },
});
