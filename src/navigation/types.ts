import type { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Welcome: undefined;
  SignIn: undefined;
  SignUp: undefined;
};

export type TasksStackParamList = {
  TasksHome: undefined;
  ProjectDetail: { projectId: string };
  TaskDetail: { taskId: string };
  CreateTask: { projectId?: string; parentTaskId?: string; dueDate?: string } | undefined;
};

export type HabitsStackParamList = {
  HabitsHome: undefined;
  HabitDetail: { habitId: string };
  CreateHabit: undefined;
};

export type JournalStackParamList = {
  JournalHome: undefined;
  JournalEntry: { entryId: string };
  JournalEditor: { entryId?: string; date?: string } | undefined;
};

export type SettingsStackParamList = {
  Settings: undefined;
  Profile: undefined;
};

export type DashboardStackParamList = {
  Dashboard: undefined;
};

export type AppTabParamList = {
  Dashboard: NavigatorScreenParams<DashboardStackParamList>;
  Tasks: NavigatorScreenParams<TasksStackParamList>;
  Habits: NavigatorScreenParams<HabitsStackParamList>;
  Journal: NavigatorScreenParams<JournalStackParamList>;
  Settings: NavigatorScreenParams<SettingsStackParamList>;
};
