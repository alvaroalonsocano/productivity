import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { TasksStackParamList } from './types';
import TasksHomeScreen from '@/screens/tasks/TasksHomeScreen';
import TaskDetailScreen from '@/screens/tasks/TaskDetailScreen';
import CreateTaskScreen from '@/screens/tasks/CreateTaskScreen';
import ProjectDetailScreen from '@/screens/tasks/ProjectDetailScreen';

const Stack = createNativeStackNavigator<TasksStackParamList>();

export default function TasksStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="TasksHome" component={TasksHomeScreen} />
      <Stack.Screen name="TaskDetail" component={TaskDetailScreen} />
      <Stack.Screen
        name="CreateTask"
        component={CreateTaskScreen}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen name="ProjectDetail" component={ProjectDetailScreen} />
    </Stack.Navigator>
  );
}
