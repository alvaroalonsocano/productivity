import { useMemo } from 'react';
import type { Habit, HabitLog, HabitStreak } from '@/types';
import { computeStreak } from '@/utils/streakUtils';

export function useHabitStreak(habit: Habit | undefined, logs: HabitLog[] | undefined): HabitStreak | null {
  return useMemo(() => {
    if (!habit || !logs) return null;
    return computeStreak(habit, logs);
  }, [habit, logs]);
}
