import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import type { AppTabParamList } from './types';
import TasksStack from './TasksStack';
import HabitsStack from './HabitsStack';
import JournalStack from './JournalStack';
import SettingsStack from './SettingsStack';

const Tab = createBottomTabNavigator<AppTabParamList>();

export default function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          borderTopColor: '#e2e8f0',
          paddingBottom: 4,
        },
        tabBarIcon: ({ color, size, focused }) => {
          const icons: Record<string, { active: string; inactive: string }> = {
            Tasks: { active: 'checkmark-circle', inactive: 'checkmark-circle-outline' },
            Habits: { active: 'flame', inactive: 'flame-outline' },
            Journal: { active: 'journal', inactive: 'journal-outline' },
            Settings: { active: 'settings', inactive: 'settings-outline' },
          };
          const icon = icons[route.name];
          return (
            <Ionicons
              name={(focused ? icon.active : icon.inactive) as any}
              size={size}
              color={color}
            />
          );
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
      })}
    >
      <Tab.Screen name="Tasks" component={TasksStack} options={{ title: 'Tareas' }} />
      <Tab.Screen name="Habits" component={HabitsStack} options={{ title: 'Hábitos' }} />
      <Tab.Screen name="Journal" component={JournalStack} options={{ title: 'Diario' }} />
      <Tab.Screen name="Settings" component={SettingsStack} options={{ title: 'Ajustes' }} />
    </Tab.Navigator>
  );
}
