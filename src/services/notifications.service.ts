import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import type { Habit } from '@/types';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  if (!Device.isDevice) return false;

  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return false;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('habits', {
      name: 'Recordatorios de hábitos',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
    });
  }

  return true;
}

// Each habit gets a notification identifier based on its ID
function notificationId(habitId: string) {
  return `habit-${habitId}`;
}

export async function scheduleHabitReminder(habit: Habit): Promise<void> {
  if (!habit.reminder_enabled || !habit.reminder_time) return;

  // Cancel any existing notification for this habit first
  await cancelHabitReminder(habit.id);

  const [hours, minutes] = habit.reminder_time.split(':').map(Number);

  // Schedule one notification per target day of the week
  const days = habit.target_days.length > 0 ? habit.target_days : [0, 1, 2, 3, 4, 5, 6];

  for (const weekday of days) {
    // expo-notifications weekday: 1=Sunday, 2=Monday ... 7=Saturday
    const expoWeekday = weekday + 1; // our 0=Sunday matches expo's 1=Sunday

    await Notifications.scheduleNotificationAsync({
      identifier: `${notificationId(habit.id)}-${weekday}`,
      content: {
        title: `${habit.icon ?? '✨'} ${habit.name}`,
        body: '¡Es hora de completar tu hábito!',
        data: { habitId: habit.id },
        sound: 'default',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday: expoWeekday,
        hour: hours,
        minute: minutes,
      },
    });
  }
}

export async function cancelHabitReminder(habitId: string): Promise<void> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  const prefix = notificationId(habitId);
  for (const n of scheduled) {
    if (n.identifier.startsWith(prefix)) {
      await Notifications.cancelScheduledNotificationAsync(n.identifier);
    }
  }
}

export async function rescheduleAllHabits(habits: Habit[]): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
  for (const habit of habits) {
    if (habit.reminder_enabled && habit.reminder_time) {
      await scheduleHabitReminder(habit);
    }
  }
}
