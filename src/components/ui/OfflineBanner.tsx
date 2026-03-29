import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useOfflineStore } from '@/store/offlineStore';

export function OfflineBanner() {
  const isOnline = useOfflineStore((s) => s.isOnline);
  const queueLength = useOfflineStore((s) => s.queue.length);
  const failedCount = useOfflineStore((s) => s.failedCount);
  const clearFailed = useOfflineStore((s) => s.clearFailed);

  const translateY = useRef(new Animated.Value(-56)).current;

  const visible = !isOnline || queueLength > 0 || failedCount > 0;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : -56,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const isError = failedCount > 0;

  const message = isError
    ? `No se pudo sincronizar ${failedCount} cambio${failedCount > 1 ? 's' : ''}`
    : isOnline && queueLength > 0
    ? `Sincronizando ${queueLength} cambio${queueLength > 1 ? 's' : ''}…`
    : 'Sin conexión — los cambios se guardan localmente';

  return (
    <Animated.View
      style={[
        styles.banner,
        isError ? styles.bannerError : styles.bannerDefault,
        { transform: [{ translateY }] },
      ]}
    >
      <Text style={styles.text}>{message}</Text>
      {isError && (
        <TouchableOpacity onPress={clearFailed} style={styles.dismiss}>
          <Text style={styles.dismissText}>Descartar</Text>
        </TouchableOpacity>
      )}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  bannerDefault: {
    backgroundColor: '#1a1a2e',
  },
  bannerError: {
    backgroundColor: '#C0392B',
  },
  text: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
    textAlign: 'center',
  },
  dismiss: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  dismissText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
