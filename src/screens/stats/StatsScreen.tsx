import React, { useMemo } from 'react';
import { View, Text, ScrollView, SafeAreaView, StyleSheet, ActivityIndicator } from 'react-native';
import { format, subDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { useTheme } from '@/lib/theme';
import { useTasks } from '@/hooks/useTasks';
import { useHabits, useRecentLogs } from '@/hooks/useHabits';
import { useJournalEntries } from '@/hooks/useJournal';
import BarChart from '@/components/charts/BarChart';
import LineChart from '@/components/charts/LineChart';
import RingChart from '@/components/charts/RingChart';
import { computeStreak } from '@/utils/streakUtils';
import { MOOD_EMOJIS } from '@/lib/constants';
import { isOverdue } from '@/utils/dateUtils';

export default function StatsScreen() {
  const c = useTheme();

  const { data: tasks = [], isLoading: tLoading } = useTasks();
  const { data: habits = [], isLoading: hLoading } = useHabits();
  const { data: logs = [], isLoading: lLoading } = useRecentLogs(30);
  const { data: entries = [], isLoading: eLoading } = useJournalEntries();

  const isLoading = tLoading || hLoading || lLoading || eLoading;

  // --- Task stats ---
  const activeTasks = tasks.filter((t) => t.status !== 'cancelled');
  const doneTasks = activeTasks.filter((t) => t.status === 'done');
  const overdueTasks = activeTasks.filter((t) => t.status !== 'done' && t.due_date && isOverdue(t.due_date));

  // Tasks completed per day (last 7 days)
  const taskBarData = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const count = doneTasks.filter((t) => t.completed_at?.startsWith(dateStr)).length;
      return { label: format(date, 'EEE', { locale: es }).slice(0, 3), value: count };
    });
  }, [doneTasks]);

  // --- Habit stats ---
  const bestStreak = useMemo(() => {
    if (!habits.length) return { habit: null, streak: 0 };
    let best = { habit: habits[0], streak: 0 };
    for (const h of habits) {
      const s = computeStreak(h, logs.filter((l) => l.habit_id === h.id));
      if (s.current_streak > best.streak) best = { habit: h, streak: s.current_streak };
    }
    return best;
  }, [habits, logs]);

  // Habit completions per day (last 7 days)
  const habitBarData = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const count = logs.filter((l) => l.log_date === dateStr).length;
      return { label: format(date, 'EEE', { locale: es }).slice(0, 3), value: count, maxValue: habits.length };
    });
  }, [logs, habits]);

  // --- Journal stats ---
  const moodData = useMemo(() => {
    const sorted = [...entries].sort((a, b) => a.entry_date.localeCompare(b.entry_date));
    const last7 = sorted.slice(-7);
    return last7.map((e) => ({
      label: format(new Date(e.entry_date), 'd/M'),
      value: e.mood ?? 3,
    }));
  }, [entries]);

  const avgMood = useMemo(() => {
    if (!entries.length) return 0;
    const last14 = entries.slice(-14);
    return last14.reduce((s, e) => s + (e.mood ?? 3), 0) / last14.length;
  }, [entries]);

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: c.bg },
    header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16, backgroundColor: c.card, borderBottomWidth: 1, borderBottomColor: c.border },
    title: { fontSize: 24, fontWeight: 'bold', color: c.text },
    scroll: { padding: 20 },
    section: { marginBottom: 28 },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: c.text, marginBottom: 14 },
    card: { backgroundColor: c.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: c.border },
    statRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
    statItem: { alignItems: 'center', gap: 4 },
    statValue: { fontSize: 28, fontWeight: 'bold', color: c.text },
    statLabel: { fontSize: 12, color: c.textMuted },
    chartTitle: { fontSize: 13, fontWeight: '600', color: c.textMuted, marginBottom: 12 },
    chartWrapper: { alignItems: 'center' },
    bestStreak: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 },
    bestStreakIcon: { fontSize: 28 },
    bestStreakName: { fontSize: 15, fontWeight: '600', color: c.text },
    bestStreakDays: { fontSize: 13, color: '#f97316' },
    ringRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
    ringLabel: { fontSize: 12, color: c.textMuted, textAlign: 'center', marginTop: 6 },
    moodAvg: { fontSize: 32, textAlign: 'center', marginBottom: 4 },
    moodLabel: { fontSize: 13, color: c.textMuted, textAlign: 'center', marginBottom: 12 },
    loadingCenter: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  });

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingCenter}>
          <ActivityIndicator size="large" color={c.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Estadísticas</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Tasks */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tareas</Text>
          <View style={styles.card}>
            <View style={styles.ringRow}>
              <View style={{ alignItems: 'center' }}>
                <RingChart
                  value={doneTasks.length}
                  total={activeTasks.length}
                  color={c.primary}
                  label={`${activeTasks.length > 0 ? Math.round((doneTasks.length / activeTasks.length) * 100) : 0}%`}
                  sublabel="completadas"
                />
                <Text style={styles.ringLabel}>Completadas</Text>
              </View>
              <View>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: c.primary }]}>{doneTasks.length}</Text>
                  <Text style={styles.statLabel}>Hechas</Text>
                </View>
                <View style={[styles.statItem, { marginTop: 16 }]}>
                  <Text style={[styles.statValue, { color: c.danger }]}>{overdueTasks.length}</Text>
                  <Text style={styles.statLabel}>Vencidas</Text>
                </View>
                <View style={[styles.statItem, { marginTop: 16 }]}>
                  <Text style={[styles.statValue, { color: c.textMuted }]}>{activeTasks.length - doneTasks.length}</Text>
                  <Text style={styles.statLabel}>Pendientes</Text>
                </View>
              </View>
            </View>
            <Text style={styles.chartTitle}>Completadas por día (última semana)</Text>
            <View style={styles.chartWrapper}>
              <BarChart data={taskBarData} color={c.primary} />
            </View>
          </View>
        </View>

        {/* Habits */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hábitos</Text>
          <View style={styles.card}>
            {bestStreak.habit && (
              <>
                <Text style={styles.chartTitle}>Mejor racha activa</Text>
                <View style={styles.bestStreak}>
                  <Text style={styles.bestStreakIcon}>{bestStreak.habit.icon ?? '✨'}</Text>
                  <View>
                    <Text style={styles.bestStreakName}>{bestStreak.habit.name}</Text>
                    <Text style={styles.bestStreakDays}>🔥 {bestStreak.streak} días seguidos</Text>
                  </View>
                </View>
                <View style={{ height: 16 }} />
              </>
            )}
            <Text style={styles.chartTitle}>Check-ins por día (últimos 7 días)</Text>
            <View style={styles.chartWrapper}>
              <BarChart data={habitBarData} color="#f97316" />
            </View>
          </View>
        </View>

        {/* Journal / Mood */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estado de ánimo</Text>
          <View style={styles.card}>
            <Text style={styles.moodAvg}>{MOOD_EMOJIS[Math.round(avgMood)] ?? '😐'}</Text>
            <Text style={styles.moodLabel}>
              Media últimas 2 semanas: {avgMood > 0 ? avgMood.toFixed(1) : '—'}
            </Text>
            {moodData.length >= 2 ? (
              <>
                <Text style={styles.chartTitle}>Tendencia de ánimo</Text>
                <LineChart data={moodData} color={c.success} min={1} max={5} />
              </>
            ) : (
              <Text style={[styles.statLabel, { textAlign: 'center', marginTop: 8 }]}>
                Escribe más entradas para ver la tendencia
              </Text>
            )}
          </View>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
