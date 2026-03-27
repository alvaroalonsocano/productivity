import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from './Button';
import { useTheme } from '@/lib/theme';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  const c = useTheme();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 32,
      paddingVertical: 64,
    },
    iconText: {
      fontSize: 48,
      marginBottom: 16,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: c.text,
      textAlign: 'center',
      marginBottom: 8,
    },
    description: {
      color: c.textMuted,
      textAlign: 'center',
      fontSize: 16,
      lineHeight: 24,
    },
    actionContainer: {
      marginTop: 24,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.iconText}>{icon}</Text>
      <Text style={styles.title}>
        {title}
      </Text>
      <Text style={styles.description}>
        {description}
      </Text>
      {actionLabel && onAction && (
        <View style={styles.actionContainer}>
          <Button label={actionLabel} onPress={onAction} />
        </View>
      )}
    </View>
  );
}
