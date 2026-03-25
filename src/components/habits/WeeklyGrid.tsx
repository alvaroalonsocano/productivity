import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DAY_NAMES } from '@/lib/constants';
import { getWeekDates } from '@/utils/dateUtils';

interface WeeklyGridProps {
  completedDates: Set<string>;
  color?: string;
  selectedDate: string;
}

export default function WeeklyGrid({ completedDates, color = '#3b82f6', selectedDate }: WeeklyGridProps) {
  const dates = getWeekDates(selectedDate);

  return (
    <View style={styles.container}>
      {dates.map((date, i) => {
        const done = completedDates.has(date);
        const dayName = DAY_NAMES[new Date(date + 'T12:00:00').getDay()];
        const isSelected = date === selectedDate;
        return (
          <View key={date} style={styles.dayColumn}>
            <Text style={styles.dayName}>{dayName}</Text>
            <View
              style={[
                styles.dayCell,
                {
                  backgroundColor: done ? color : isSelected ? '#f1f5f9' : 'transparent',
                  borderWidth: isSelected && !done ? 1.5 : 0,
                  borderColor: isSelected ? color : 'transparent',
                },
              ]}
            >
              {done && <Text style={styles.checkmark}>✓</Text>}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayColumn: {
    alignItems: 'center',
    gap: 4,
  },
  dayName: {
    fontSize: 12,
    color: '#94a3b8',
  },
  dayCell: {
    width: 28,
    height: 28,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 12,
  },
});
