import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  SafeAreaView, StyleSheet, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { AppTabParamList } from '@/navigation/types';
import { useTasks } from '@/hooks/useTasks';
import { useHabits, useTodayLogs, useToggleHabitLog } from '@/hooks/useHabits';
import { useJournalEntryByDate } from '@/hooks/useJournal';
import { useAuthStore } from '@/store/authStore';
import { MOOD_EMOJIS, MOOD_LABELS } from '@/lib/constants';
import { isDueToday, isOverdue } from '@/utils/dateUtils';

type Props = { navigation: BottomTabNavigationProp<AppTabParamList, 'Dashboard'> };

export default function DashboardScreen({ navigation }: Props) {
  const profile = useAuthStore((s) => s.profile);
  const today = format(new Date(), 'yyyy-MM-dd');
  const dayLabel = format(new Date(), "EEEE, d 'de' MMMM", { locale: es });

  const { data: tasks = [], isLoading: tasksLoading } = useTasks();
  const { data: habits = [], isLoading: habitsLoading } = useHabits();
  const { data: todayLogs = [] } = useTodayLogs();
  const { data: todayEntry } = useJournalEntryByDate(today);
  const toggleHabit = useToggleHabitLog();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Buenos días' : hour < 20 ? 'Buenas tardes' : 'Buenas noches';
  const name = profile?.display_name ?? profile?.full_name ?? '';

  // Task stats
  const pendingTasks = tasks.filter(
    (t) => t.status !== 'done' && t.status !== 'cancelled' && t.due_date && (isDueToday(t.due_date) || isOverdue(t.due_date))
  );
  const doneTodayTasks = tasks.filter(
    (t) => t.status === 'done' && t.completed_at && t.completed_at.startsWith(today)
  );
  const totalTodayTasks = pendingTasks.length + doneTodayTasks.length;

  // Habit stats
  const completedHabitIds = new Set(todayLogs.map((l: any) => l.habit_id));
  const completedHabits = habits.filter((h) => completedHabitIds.has(h.id));
  const pendingHabits = habits.filter((h) => !completedHabitIds.has(h.id)).slice(0, 4);

  const isLoading = tasksLoading || habitsLoading;

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingCenter}>
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.dayLabel}>{dayLabel}</Text>
          <Text style={styles.greeting}>{greeting}{name ? `, ${name}` : ''} 👋</Text>
        </View>

        {/* Summary cards */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: '#eff6ff' }]}>
            <Ionicons name="checkmark-circle" size={22} color="#3b82f6" />
            <Text style={[styles.summaryNumber, { color: '#3b82f6' }]}>
              {doneTodayTasks.length}/{totalTodayTasks || '—'}
            </Text>
            <Text style={styles.summaryLabel}>Tareas hoy</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: '#fef3c7' }]}>
            <Ionicons name="flame" size={22} color="#f59e0b" />
            <Text style={[styles.summaryNumber, { color: '#f59e0b' }]}>
              {completedHabits.length}/{habits.length || '—'}
            </Text>
            <Text style={styles.summaryLabel}>Hábitos hoy</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: todayEntry ? '#f0fdf4' : '#f8fafc' }]}>
            <Ionicons
              name="journal"
              size={22}
              color={todayEntry ? '#22c55e' : '#94a3b8'}
            />
            <Text style={[styles.summaryNumber, { color: todayEntry ? '#22c55e' : '#94a3b8' }]}>
              {todayEntry ? MOOD_EMOJIS[todayEntry.mood ?? 3] : '—'}
            </Text>
            <Text style={styles.summaryLabel}>Diario hoy</Text>
          </View>
        </View>

        {/* Today's tasks */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tareas pendientes</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Tasks', { screen: 'TasksHome' })}>
              <Text style={styles.sectionLink}>Ver todas</Text>
            </TouchableOpacity>
          </View>

          {pendingTasks.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>✅ Sin tareas urgentes para hoy</Text>
            </View>
          ) : (
            pendingTasks.slice(0, 5).map((task) => (
              <TouchableOpacity
                key={task.id}
                style={styles.taskRow}
                onPress={() => navigation.navigate('Tasks', { screen: 'TaskDetail', params: { taskId: task.id } })}
              >
                <View style={[styles.taskDot, isOverdue(task.due_date!) ? styles.taskDotOverdue : styles.taskDotToday]} />
                <Text style={styles.taskTitle} numberOfLines={1}>{task.title}</Text>
                {isOverdue(task.due_date!) && (
                  <Text style={styles.overdueLabel}>vencida</Text>
                )}
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Today's habits */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Hábitos pendientes</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Habits', { screen: 'HabitsHome' })}>
              <Text style={styles.sectionLink}>Ver todos</Text>
            </TouchableOpacity>
          </View>

          {pendingHabits.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>🔥 Todos los hábitos completados</Text>
            </View>
          ) : (
            <View style={styles.habitsGrid}>
              {pendingHabits.map((habit) => (
                <TouchableOpacity
                  key={habit.id}
                  style={styles.habitChip}
                  onPress={() =>
                    toggleHabit.mutate({ habitId: habit.id, date: today, checked: true })
                  }
                >
                  <Text style={styles.habitIcon}>{habit.icon}</Text>
                  <Text style={styles.habitName} numberOfLines={1}>{habit.name}</Text>
                  <Ionicons name="add-circle-outline" size={18} color="#3b82f6" />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Journal CTA */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Diario</Text>
          {todayEntry ? (
            <TouchableOpacity
              style={styles.journalCard}
              onPress={() => navigation.navigate('Journal', { screen: 'JournalEntry', params: { entryId: todayEntry.id } })}
            >
              <Text style={styles.journalMood}>
                {MOOD_EMOJIS[todayEntry.mood ?? 3]} {MOOD_LABELS[todayEntry.mood ?? 3]}
              </Text>
              {todayEntry.title ? (
                <Text style={styles.journalTitle} numberOfLines={1}>{todayEntry.title}</Text>
              ) : null}
              {todayEntry.content ? (
                <Text style={styles.journalPreview} numberOfLines={2}>{todayEntry.content}</Text>
              ) : null}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.journalCta}
              onPress={() => navigation.navigate('Journal', { screen: 'JournalEditor', params: { date: today } })}
            >
              <Ionicons name="pencil-outline" size={20} color="#3b82f6" />
              <Text style={styles.journalCtaText}>Escribir la entrada de hoy</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    marginBottom: 20,
  },
  dayLabel: {
    fontSize: 13,
    color: '#64748b',
    textTransform: 'capitalize',
    marginBottom: 2,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    gap: 4,
  },
  summaryNumber: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  summaryLabel: {
    fontSize: 11,
    color: '#64748b',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  sectionLink: {
    fontSize: 13,
    color: '#3b82f6',
    fontWeight: '500',
  },
  emptyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  emptyText: {
    color: '#64748b',
    fontSize: 14,
    textAlign: 'center',
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    gap: 10,
  },
  taskDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  taskDotToday: {
    backgroundColor: '#3b82f6',
  },
  taskDotOverdue: {
    backgroundColor: '#ef4444',
  },
  taskTitle: {
    flex: 1,
    fontSize: 14,
    color: '#1e293b',
  },
  overdueLabel: {
    fontSize: 11,
    color: '#ef4444',
    fontWeight: '500',
  },
  habitsGrid: {
    gap: 8,
  },
  habitChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    gap: 10,
  },
  habitIcon: {
    fontSize: 20,
  },
  habitName: {
    flex: 1,
    fontSize: 14,
    color: '#1e293b',
  },
  journalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    gap: 4,
  },
  journalMood: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
  },
  journalTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
  },
  journalPreview: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  journalCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  journalCtaText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3b82f6',
  },
});
