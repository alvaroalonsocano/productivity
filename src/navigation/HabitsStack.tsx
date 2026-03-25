import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { HabitsStackParamList } from './types';
import HabitsHomeScreen from '@/screens/habits/HabitsHomeScreen';
import HabitDetailScreen from '@/screens/habits/HabitDetailScreen';
import CreateHabitScreen from '@/screens/habits/CreateHabitScreen';

const Stack = createNativeStackNavigator<HabitsStackParamList>();

export default function HabitsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HabitsHome" component={HabitsHomeScreen} />
      <Stack.Screen name="HabitDetail" component={HabitDetailScreen} />
      <Stack.Screen
        name="CreateHabit"
        component={CreateHabitScreen}
        options={{ presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
}
