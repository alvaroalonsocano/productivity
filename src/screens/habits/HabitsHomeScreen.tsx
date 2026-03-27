import React, { useState, useMemo } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, SafeAreaView,
  ScrollView, RefreshControl, StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { HabitsStackParamList } from '@/navigation/types';
import { useHabits, useRecentLogs, useToggleHabitLog } from '@/hooks/useHabits';
import HabitCard from '@/components/habits/HabitCard';
import EmptyState from '@/components/ui/EmptyState';
import { toDateString, formatDate, getWeekDates } from '@/utils/dateUtils';
import { DAY_NAMES } from '@/lib/constants';
import { useTheme } from '@/lib/theme';

type Props = { navigation: NativeStackNavigationProp<HabitsStackParamList, 'HabitsHome'> };

export default function HabitsHomeScreen({ navigation }: Props) {
  const c = useTheme();
  const today = toDateString(new Date());
  const [selectedDate, setSelectedDate] = useState(today);

  const { data: habits = [], isLoading, refetch, isFetching } = useHabits();
  const { data: logs = [] } = useRecentLogs(90);
  const toggleLog = useToggleHabitLog();

  const weekDates = useMemo(() => getWeekDates(), []);

  // Habits scheduled for selected date
  const dayOfWeek = new Date(selectedDate + 'T12:00:00').getDay();
  const todayHabits = habits.filter((h) => h.target_days.includes(dayOfWeek));

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.bg,
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 12,
      backgroundColor: c.card,
      borderBottomWidth: 1,
      borderBottomColor: c.border,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: c.text,
    },
    dateScroll: {
      marginTop: 12,
      marginHorizontal: -4,
    },
    datePill: {
      marginHorizontal: 4,
      width: 48,
      paddingVertical: 8,
      borderRadius: 16,
      alignItems: 'center',
    },
    datePillSelected: {
      backgroundColor: c.primaryDark,
    },
    datePillInactive: {
      backgroundColor: 'transparent',
    },
    dateDayName: {
      fontSize: 12,
    },
    dateDayNameSelected: {
      color: c.primaryBorder,
    },
    dateDayNameInactive: {
      color: c.textPlaceholder,
    },
    dateDayNum: {
      fontSize: 16,
      fontWeight: 'bold',
      marginTop: 2,
    },
    dateDayNumSelected: {
      color: '#ffffff',
    },
    dateDayNumToday: {
      color: c.primaryDark,
    },
    dateDayNumDefault: {
      color: c.cardAlt,
    },
    listHeader: {
      fontSize: 12,
      fontWeight: '600',
      color: c.textPlaceholder,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginTop: 16,
      marginBottom: 8,
    },
    emptyText: {
      color: c.textPlaceholder,
      textAlign: 'center',
      marginTop: 32,
    },
    separator: {
      height: 1,
      backgroundColor: c.border,
    },
    fab: {
      position: 'absolute',
      bottom: 24,
      right: 24,
      backgroundColor: c.primaryDark,
      width: 56,
      height: 56,
      borderRadius: 9999,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Hábitos</Text>

        {/* Date carousel */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScroll}>
          {weekDates.map((date) => {
            const isSelected = date === selectedDate;
            const isToday = date === today;
            const dow = new Date(date + 'T12:00:00').getDay();
            const dayNum = new Date(date + 'T12:00:00').getDate();
            return (
              <TouchableOpacity
                key={date}
                onPress={() => setSelectedDate(date)}
                style={[styles.datePill, isSelected ? styles.datePillSelected : styles.datePillInactive]}
              >
                <Text style={[styles.dateDayName, isSelected ? styles.dateDayNameSelected : styles.dateDayNameInactive]}>
                  {DAY_NAMES[dow]}
                </Text>
                <Text style={[
                  styles.dateDayNum,
                  isSelected ? styles.dateDayNumSelected : isToday ? styles.dateDayNumToday : styles.dateDayNumDefault,
                ]}>
                  {dayNum}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {habits.length === 0 && !isLoading ? (
        <EmptyState
          icon="🔥"
          title="Sin hábitos aún"
          description="Crea tu primer hábito y empieza a construir rachas"
          actionLabel="Nuevo hábito"
          onAction={() => navigation.navigate('CreateHabit')}
        />
      ) : (
        <FlatList
          data={todayHabits}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={isFetching && !isLoading} onRefresh={refetch} />}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
          ListHeaderComponent={
            <Text style={styles.listHeader}>
              {formatDate(selectedDate)} — {todayHabits.length} hábitos
            </Text>
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>No hay hábitos programados para este día</Text>
          }
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <HabitCard
              habit={item}
              logs={logs}
              selectedDate={selectedDate}
              onToggle={(habitId, date, checked) => toggleLog.mutate({ habitId, date, checked })}
              onPress={(id) => navigation.navigate('HabitDetail', { habitId: id })}
            />
          )}
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        onPress={() => navigation.navigate('CreateHabit')}
        style={styles.fab}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
