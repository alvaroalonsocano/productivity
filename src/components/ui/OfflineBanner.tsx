import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { useOfflineStore } from '@/store/offlineStore';

export function OfflineBanner() {
  const isOnline = useOfflineStore((s) => s.isOnline);
  const queueLength = useOfflineStore((s) => s.queue.length);
  const translateY = useRef(new Animated.Value(-50)).current;

  const visible = !isOnline || queueLength > 0;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : -50,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const message = isOnline && queueLength > 0
    ? `Sincronizando ${queueLength} cambio${queueLength > 1 ? 's' : ''}…`
    : 'Sin conexión — los cambios se guardan localmente';

  return (
    <Animated.View style={[styles.banner, { transform: [{ translateY }] }]}>
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    backgroundColor: '#1a1a2e',
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
});
