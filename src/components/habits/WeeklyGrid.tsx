import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DAY_NAMES } from '@/lib/constants';
import { getWeekDates } from '@/utils/dateUtils';
import { useTheme } from '@/lib/theme';

interface WeeklyGridProps {
  completedDates: Set<string>;
  color?: string;
  selectedDate: string;
}

export default function WeeklyGrid({ completedDates, color, selectedDate }: WeeklyGridProps) {
  const c = useTheme();
  const resolvedColor = color ?? c.primary;
  const dates = getWeekDates(selectedDate);

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
      color: c.textPlaceholder,
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
                  backgroundColor: done ? resolvedColor : isSelected ? c.cardAlt : 'transparent',
                  borderWidth: isSelected && !done ? 1.5 : 0,
                  borderColor: isSelected ? resolvedColor : 'transparent',
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
