import React, { useEffect } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClientProvider } from '@tanstack/react-query';
import * as Notifications from 'expo-notifications';
import { queryClient } from '@/lib/queryClient';
import RootNavigator, { navigationRef } from '@/navigation/RootNavigator';
import { requestNotificationPermissions } from '@/services/notifications.service';
import { useNetworkSync } from '@/hooks/useNetworkSync';
import { OfflineBanner } from '@/components/ui/OfflineBanner';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

function AppContent() {
  useNetworkSync();
  return (
    <View style={{ flex: 1 }}>
      <OfflineBanner />
      <RootNavigator />
    </View>
  );
}

export default function App() {
  useEffect(() => {
    // Request push notification permissions on first launch
    requestNotificationPermissions();

    // Handle notification taps — navigate to the relevant habit
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const habitId = response.notification.request.content.data?.habitId as string | undefined;
      if (habitId && navigationRef.isReady()) {
        navigationRef.navigate('Habits', {
          screen: 'HabitDetail',
          params: { habitId },
        } as any);
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
          <AppContent />
        </ErrorBoundary>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
