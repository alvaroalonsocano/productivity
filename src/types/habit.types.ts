export type HabitFrequency = 'daily' | 'weekly' | 'custom';
export type HabitCategory =
  | 'health'
  | 'mindfulness'
  | 'learning'
  | 'fitness'
  | 'productivity'
  | 'social'
  | 'other';

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  icon: string | null;
  color: string;
  category: HabitCategory;
  frequency: HabitFrequency;
  target_days: number[];
  target_count: number;
  reminder_time: string | null;
  reminder_enabled: boolean;
  archived: boolean;
  start_date: string;
  created_at: string;
  updated_at: string;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  user_id: string;
  log_date: string;
  count: number;
  note: string | null;
  created_at: string;
}

export interface HabitStreak {
  habit_id: string;
  current_streak: number;
  longest_streak: number;
  total_completions: number;
  completion_rate_30d: number;
}

export type CreateHabitInput = Omit<Habit, 'id' | 'user_id' | 'created_at' | 'updated_at'>;
export type UpdateHabitInput = Partial<CreateHabitInput> & { id: string };
