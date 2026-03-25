import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { JournalStackParamList } from './types';
import JournalHomeScreen from '@/screens/journal/JournalHomeScreen';
import JournalEntryScreen from '@/screens/journal/JournalEntryScreen';
import JournalEditorScreen from '@/screens/journal/JournalEditorScreen';

const Stack = createNativeStackNavigator<JournalStackParamList>();

export default function JournalStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="JournalHome" component={JournalHomeScreen} />
      <Stack.Screen name="JournalEntry" component={JournalEntryScreen} />
      <Stack.Screen
        name="JournalEditor"
        component={JournalEditorScreen}
        options={{ presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
}
