import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  SafeAreaView, Alert, ActivityIndicator, StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { TasksStackParamList } from '@/navigation/types';
import { useTask, useSubtasks, useUpdateTask, useToggleTask, useDeleteTask } from '@/hooks/useTasks';
import { PRIORITY_COLORS, PRIORITY_LABELS, STATUS_LABELS } from '@/lib/constants';
import TaskCard from '@/components/tasks/TaskCard';
import type { Priority, TaskStatus } from '@/types';

type Props = {
  navigation: NativeStackNavigationProp<TasksStackParamList, 'TaskDetail'>;
  route: RouteProp<TasksStackParamList, 'TaskDetail'>;
};

const STATUSES: TaskStatus[] = ['todo', 'in_progress', 'done'];
const PRIORITIES: Priority[] = ['none', 'low', 'medium', 'high', 'urgent'];

export default function TaskDetailScreen({ navigation, route }: Props) {
  const { taskId } = route.params;
  const { data: task, isLoading } = useTask(taskId);
  const { data: subtasks = [] } = useSubtasks(taskId);
  const updateTask = useUpdateTask();
  const toggleTask = useToggleTask();
  const deleteTask = useDeleteTask();
  const [title, setTitle] = useState('');
  const [editing, setEditing] = useState(false);

  if (isLoading || !task) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator color="#3b82f6" />
      </SafeAreaView>
    );
  }

  const handleDelete = () => {
    Alert.alert('Eliminar tarea', '¿Seguro que quieres eliminar esta tarea?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          await deleteTask.mutateAsync(taskId);
          navigation.goBack();
        },
      },
    ]);
  };

  const handleTitleSave = () => {
    if (title.trim() && title.trim() !== task.title) {
      updateTask.mutate({ id: taskId, title: title.trim() });
    }
    setEditing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#64748b" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDelete}>
          <Ionicons name="trash-outline" size={22} color="#ef4444" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
        {/* Title */}
        {editing ? (
          <TextInput
            value={title}
            onChangeText={setTitle}
            onBlur={handleTitleSave}
            autoFocus
            multiline
            style={styles.titleInput}
          />
        ) : (
          <TouchableOpacity onPress={() => { setTitle(task.title); setEditing(true); }}>
            <Text style={[styles.titleText, task.status === 'done' ? styles.titleDone : styles.titleActive]}>
              {task.title}
            </Text>
          </TouchableOpacity>
        )}

        {/* Status */}
        <Text style={styles.sectionLabel}>Estado</Text>
        <View style={styles.chipRow}>
          {STATUSES.map((s) => (
            <TouchableOpacity
              key={s}
              onPress={() => updateTask.mutate({ id: taskId, status: s })}
              style={[
                styles.chip,
                {
                  borderColor: task.status === s ? '#3b82f6' : '#e2e8f0',
                  backgroundColor: task.status === s ? '#eff6ff' : 'transparent',
                },
              ]}
            >
              <Text style={[styles.chipText, { color: task.status === s ? '#3b82f6' : '#94a3b8' }]}>
                {STATUS_LABELS[s]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Priority */}
        <Text style={styles.sectionLabel}>Prioridad</Text>
        <View style={styles.chipRow}>
          {PRIORITIES.map((p) => (
            <TouchableOpacity
              key={p}
              onPress={() => updateTask.mutate({ id: taskId, priority: p })}
              style={[
                styles.chip,
                {
                  borderColor: task.priority === p ? PRIORITY_COLORS[p] : '#e2e8f0',
                  backgroundColor: task.priority === p ? PRIORITY_COLORS[p] + '20' : 'transparent',
                },
              ]}
            >
              <Text style={[styles.chipText, { color: task.priority === p ? PRIORITY_COLORS[p] : '#94a3b8' }]}>
                {PRIORITY_LABELS[p]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Description */}
        {task.description && (
          <>
            <Text style={styles.sectionLabel}>Descripción</Text>
            <Text style={styles.descriptionText}>
              {task.description}
            </Text>
          </>
        )}

        {/* Subtasks */}
        {subtasks.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>
              Subtareas ({subtasks.filter((t) => t.status === 'done').length}/{subtasks.length})
            </Text>
            {subtasks.map((sub) => (
              <TaskCard
                key={sub.id}
                task={sub}
                onToggle={(id, done) => toggleTask.mutate({ id, done })}
                onPress={(id) => navigation.navigate('TaskDetail', { taskId: id })}
              />
            ))}
          </>
        )}

        {/* Add subtask */}
        <TouchableOpacity
          onPress={() => navigation.navigate('CreateTask', { parentTaskId: taskId })}
          style={styles.addSubtaskRow}
        >
          <Ionicons name="add-circle-outline" size={20} color="#3b82f6" />
          <Text style={styles.addSubtaskText}>Añadir subtarea</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginTop: 20,
    marginBottom: 12,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 12,
  },
  titleActive: {
    color: '#0f172a',
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: '#94a3b8',
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '500',
  },
  descriptionText: {
    fontSize: 16,
    color: '#334155',
    marginBottom: 20,
    lineHeight: 24,
  },
  addSubtaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    marginTop: 8,
  },
  addSubtaskText: {
    color: '#2563eb',
    fontSize: 16,
  },
});
