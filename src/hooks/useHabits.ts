import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { habitService } from '@/services/habit.service';
import { useAuthStore } from '@/store/authStore';
import { subDays, format } from 'date-fns';
import type { CreateHabitInput, UpdateHabitInput } from '@/types';

export function useHabits() {
  const userId = useAuthStore((s) => s.user?.id);
  return useQuery({
    queryKey: ['habits', userId],
    queryFn: () => habitService.getHabits(userId!),
    enabled: !!userId,
  });
}

export function useHabit(habitId: string) {
  return useQuery({
    queryKey: ['habit', habitId],
    queryFn: () => habitService.getHabit(habitId),
  });
}

export function useHabitLogs(habitId: string) {
  return useQuery({
    queryKey: ['habit-logs', habitId],
    queryFn: () => habitService.getHabitLogs(habitId),
  });
}

export function useTodayLogs() {
  const userId = useAuthStore((s) => s.user?.id);
  const today = format(new Date(), 'yyyy-MM-dd');
  return useQuery({
    queryKey: ['habit-logs-today', userId, today],
    queryFn: () => habitService.getLogs(userId!, today, today),
    enabled: !!userId,
  });
}

export function useRecentLogs(days = 90) {
  const userId = useAuthStore((s) => s.user?.id);
  const today = format(new Date(), 'yyyy-MM-dd');
  const from = format(subDays(new Date(), days), 'yyyy-MM-dd');
  return useQuery({
    queryKey: ['habit-logs-range', userId, from, today],
    queryFn: () => habitService.getLogs(userId!, from, today),
    enabled: !!userId,
  });
}

export function useCreateHabit() {
  const qc = useQueryClient();
  const userId = useAuthStore((s) => s.user?.id)!;
  return useMutation({
    mutationFn: (input: CreateHabitInput) => habitService.createHabit(userId, input),
    onSettled: () => qc.invalidateQueries({ queryKey: ['habits', userId] }),
  });
}

export function useUpdateHabit() {
  const qc = useQueryClient();
  const userId = useAuthStore((s) => s.user?.id)!;
  return useMutation({
    mutationFn: (input: UpdateHabitInput) => habitService.updateHabit(input),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['habits', userId] });
    },
  });
}

export function useToggleHabitLog() {
  const qc = useQueryClient();
  const userId = useAuthStore((s) => s.user?.id)!;
  const today = format(new Date(), 'yyyy-MM-dd');

  return useMutation({
    mutationFn: ({ habitId, date, checked }: { habitId: string; date: string; checked: boolean }) =>
      checked
        ? habitService.logHabit(habitId, userId, date)
        : habitService.unlogHabit(habitId, date),
    onMutate: async ({ habitId, date, checked }) => {
      const key = ['habit-logs-today', userId, today];
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData(key);
      if (checked) {
        qc.setQueryData(key, (old: any[] = []) => [
          ...old,
          { id: 'temp-' + Date.now(), habit_id: habitId, user_id: userId, log_date: date, count: 1 },
        ]);
      } else {
        qc.setQueryData(key, (old: any[] = []) =>
          old.filter((l) => !(l.habit_id === habitId && l.log_date === date))
        );
      }
      return { prev };
    },
    onError: (_, vars, ctx) => {
      qc.setQueryData(['habit-logs-today', userId, today], ctx?.prev);
    },
    onSettled: (_, __, { habitId }) => {
      qc.invalidateQueries({ queryKey: ['habit-logs-today', userId, today] });
      qc.invalidateQueries({ queryKey: ['habit-logs', habitId] });
    },
  });
}
