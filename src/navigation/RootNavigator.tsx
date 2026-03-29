import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createNavigationContainerRef, NavigationContainer } from '@react-navigation/native';
import { useAuthStore } from '@/store/authStore';
import { useAuthListener } from '@/hooks/useAuth';
import AuthStack from './AuthStack';
import AppTabs from './AppTabs';
import { useTheme } from '@/lib/theme';
import type { AppTabParamList } from './types';

/**
 * navigationRef — use this to navigate from outside of React components,
 * e.g. from notification response listeners in App.tsx.
 */
export const navigationRef = createNavigationContainerRef<AppTabParamList>();

export default function RootNavigator() {
  useAuthListener();
  const c = useTheme();

  const { session, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: c.card }]}>
        <ActivityIndicator size="large" color={c.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      {session ? <AppTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
