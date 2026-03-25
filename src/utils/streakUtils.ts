import type { HabitLog, HabitStreak, Habit } from '@/types';
import { parseISO, differenceInCalendarDays, subDays, format, startOfDay } from 'date-fns';

/**
 * Returns the set of dates (YYYY-MM-DD) that a habit was scheduled to run.
 * target_days uses 0=Sun, 1=Mon, ... 6=Sat
 */
export function getScheduledDates(habit: Habit, from: Date, to: Date): Set<string> {
  const scheduled = new Set<string>();
  const current = new Date(from);
  while (current <= to) {
    const dayOfWeek = current.getDay(); // 0=Sun
    if (habit.target_days.includes(dayOfWeek)) {
      scheduled.add(format(current, 'yyyy-MM-dd'));
    }
    current.setDate(current.getDate() + 1);
  }
  return scheduled;
}

export function computeStreak(habit: Habit, logs: HabitLog[]): HabitStreak {
  const completedDates = new Set(logs.map((l) => l.log_date));
  const today = startOfDay(new Date());
  const startDate = parseISO(habit.start_date);

  // Current streak: count consecutive scheduled days ending today (or yesterday if today not scheduled yet)
  let currentStreak = 0;
  let checkDate = today;

  // Walk backwards day by day
  for (let i = 0; i <= differenceInCalendarDays(today, startDate); i++) {
    const dateStr = format(checkDate, 'yyyy-MM-dd');
    const dayOfWeek = checkDate.getDay();
    const isScheduled = habit.target_days.includes(dayOfWeek);

    if (isScheduled) {
      if (completedDates.has(dateStr)) {
        currentStreak++;
      } else {
        // Today not yet completed: skip only if it's today, break otherwise
        if (i === 0) {
          checkDate = subDays(checkDate, 1);
          continue;
        }
        break;
      }
    }
    checkDate = subDays(checkDate, 1);
    if (checkDate < startDate) break;
  }

  // Longest streak
  let longestStreak = 0;
  let tempStreak = 0;
  const sortedLogs = [...logs].sort((a, b) => a.log_date.localeCompare(b.log_date));
  let prevDate: Date | null = null;

  for (const log of sortedLogs) {
    const logDate = parseISO(log.log_date);
    if (prevDate === null) {
      tempStreak = 1;
    } else {
      const diff = differenceInCalendarDays(logDate, prevDate);
      if (diff === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    prevDate = logDate;
  }
  longestStreak = Math.max(longestStreak, tempStreak);

  // 30-day completion rate
  const thirtyDaysAgo = subDays(today, 29);
  const scheduled30 = getScheduledDates(habit, thirtyDaysAgo, today);
  const completed30 = [...scheduled30].filter((d) => completedDates.has(d)).length;
  const completionRate30d = scheduled30.size > 0 ? completed30 / scheduled30.size : 0;

  return {
    habit_id: habit.id,
    current_streak: Math.max(0, currentStreak),
    longest_streak: Math.max(0, longestStreak),
    total_completions: logs.length,
    completion_rate_30d: completionRate30d,
  };
}
