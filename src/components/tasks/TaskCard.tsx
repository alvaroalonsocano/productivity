import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { Task } from '@/types';
import { PRIORITY_COLORS, PRIORITY_LABELS } from '@/lib/constants';
import { formatDate, isOverdue } from '@/utils/dateUtils';
import Checkbox from '@/components/ui/Checkbox';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string, done: boolean) => void;
  onPress: (id: string) => void;
  projectColor?: string;
}

export default memo(function TaskCard({ task, onToggle, onPress, projectColor }: TaskCardProps) {
  const done = task.status === 'done';
  const overdue = !done && !!task.due_date && isOverdue(task.due_date);

  return (
    <TouchableOpacity
      onPress={() => onPress(task.id)}
      style={styles.container}
      activeOpacity={0.7}
    >
      <Checkbox
        checked={done}
        onPress={() => onToggle(task.id, !done)}
        color={projectColor ?? PRIORITY_COLORS[task.priority]}
      />
      <View style={styles.content}>
        <Text
          style={[styles.title, done ? styles.titleDone : styles.titleActive]}
          numberOfLines={2}
        >
          {task.title}
        </Text>
        <View style={styles.metaRow}>
          {task.due_date && (
            <Text style={[styles.dueDate, overdue ? styles.dueDateOverdue : styles.dueDateNormal]}>
              {overdue ? '⚠ ' : ''}{formatDate(task.due_date)}
            </Text>
          )}
          {task.priority !== 'none' && (
            <Text style={[styles.priority, { color: PRIORITY_COLORS[task.priority] }]}>
              {PRIORITY_LABELS[task.priority]}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
  },
  titleActive: {
    color: '#0f172a',
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: '#94a3b8',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  dueDate: {
    fontSize: 12,
    fontWeight: '500',
  },
  dueDateOverdue: {
    color: '#ef4444',
  },
  dueDateNormal: {
    color: '#94a3b8',
  },
  priority: {
    fontSize: 12,
    fontWeight: '500',
  },
});
