import React, { useEffect } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import RootNavigator from '@/navigation/RootNavigator';
import { requestNotificationPermissions } from '@/services/notifications.service';
import { useNetworkSync } from '@/hooks/useNetworkSync';
import { OfflineBanner } from '@/components/ui/OfflineBanner';

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
    requestNotificationPermissions();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
