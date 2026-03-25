import { supabase } from '@/lib/supabase';
import type { Habit, HabitLog, CreateHabitInput, UpdateHabitInput } from '@/types';

export const habitService = {
  getHabits: async (userId: string): Promise<Habit[]> => {
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', userId)
      .eq('archived', false)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data;
  },

  getHabit: async (id: string): Promise<Habit> => {
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  createHabit: async (userId: string, input: CreateHabitInput): Promise<Habit> => {
    const { data, error } = await supabase
      .from('habits')
      .insert({ ...input, user_id: userId })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  updateHabit: async (input: UpdateHabitInput): Promise<Habit> => {
    const { id, ...updates } = input;
    const { data, error } = await supabase
      .from('habits')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  archiveHabit: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('habits')
      .update({ archived: true })
      .eq('id', id);
    if (error) throw error;
  },

  getLogs: async (userId: string, fromDate: string, toDate: string): Promise<HabitLog[]> => {
    const { data, error } = await supabase
      .from('habit_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('log_date', fromDate)
      .lte('log_date', toDate)
      .order('log_date', { ascending: false });
    if (error) throw error;
    return data;
  },

  getHabitLogs: async (habitId: string): Promise<HabitLog[]> => {
    const { data, error } = await supabase
      .from('habit_logs')
      .select('*')
      .eq('habit_id', habitId)
      .order('log_date', { ascending: false });
    if (error) throw error;
    return data;
  },

  logHabit: async (habitId: string, userId: string, logDate: string, count = 1): Promise<HabitLog> => {
    const { data, error } = await supabase
      .from('habit_logs')
      .upsert({ habit_id: habitId, user_id: userId, log_date: logDate, count }, {
        onConflict: 'habit_id,log_date',
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  unlogHabit: async (habitId: string, logDate: string): Promise<void> => {
    const { error } = await supabase
      .from('habit_logs')
      .delete()
      .eq('habit_id', habitId)
      .eq('log_date', logDate);
    if (error) throw error;
  },
};
