import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  SafeAreaView, Alert, ActivityIndicator, StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { TasksStackParamList } from '@/navigation/types';
import { useCreateTask, useProjects } from '@/hooks/useTasks';
import { PRIORITY_COLORS, PRIORITY_LABELS } from '@/lib/constants';
import type { Priority } from '@/types';

type Props = {
  navigation: NativeStackNavigationProp<TasksStackParamList, 'CreateTask'>;
  route: RouteProp<TasksStackParamList, 'CreateTask'>;
};

const PRIORITIES: Priority[] = ['none', 'low', 'medium', 'high', 'urgent'];

export default function CreateTaskScreen({ navigation, route }: Props) {
  const params = route.params;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('none');
  const [dueDate, setDueDate] = useState(params?.dueDate ?? '');
  const [projectId, setProjectId] = useState(params?.projectId ?? null);
  const [showDesc, setShowDesc] = useState(false);

  const { data: projects = [] } = useProjects();
  const createTask = useCreateTask();

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'El título no puede estar vacío');
      return;
    }
    try {
      await createTask.mutateAsync({
        title: title.trim(),
        description: description.trim() || null,
        priority,
        due_date: dueDate || null,
        project_id: projectId,
        parent_task_id: params?.parentTaskId ?? null,
        status: 'todo',
        completed_at: null,
        sort_order: 0,
        archived: false,
      });
      navigation.goBack();
    } catch {
      Alert.alert('Error', 'No se pudo crear la tarea. Inténtalo de nuevo.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nueva tarea</Text>
        <TouchableOpacity onPress={handleSave} disabled={createTask.isPending}>
          {createTask.isPending ? (
            <ActivityIndicator color="#3b82f6" />
          ) : (
            <Text style={styles.saveText}>Guardar</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
        {/* Title */}
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="¿Qué hay que hacer?"
          placeholderTextColor="#94a3b8"
          autoFocus
          multiline
          style={styles.titleInput}
        />

        {/* Description toggle */}
        {!showDesc ? (
          <TouchableOpacity onPress={() => setShowDesc(true)} style={styles.addDescRow}>
            <Ionicons name="add-circle-outline" size={18} color="#94a3b8" />
            <Text style={styles.addDescText}>Añadir descripción</Text>
          </TouchableOpacity>
        ) : (
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Descripción..."
            placeholderTextColor="#94a3b8"
            multiline
            style={styles.descInput}
          />
        )}

        <View style={styles.divider} />

        {/* Priority */}
        <Text style={styles.sectionLabel}>Prioridad</Text>
        <View style={styles.chipRow}>
          {PRIORITIES.map((p) => (
            <TouchableOpacity
              key={p}
              onPress={() => setPriority(p)}
              style={[
                styles.chip,
                {
                  borderColor: priority === p ? PRIORITY_COLORS[p] : '#e2e8f0',
                  backgroundColor: priority === p ? PRIORITY_COLORS[p] + '20' : 'transparent',
                },
              ]}
            >
              <Text style={[styles.chipText, { color: priority === p ? PRIORITY_COLORS[p] : '#94a3b8' }]}>
                {PRIORITY_LABELS[p]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Project */}
        {projects.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>Proyecto</Text>
            <View style={styles.chipRow}>
              <TouchableOpacity
                onPress={() => setProjectId(null)}
                style={[
                  styles.chip,
                  { borderColor: !projectId ? '#3b82f6' : '#e2e8f0', backgroundColor: !projectId ? '#eff6ff' : 'transparent' },
                ]}
              >
                <Text style={[styles.chipText, { color: !projectId ? '#3b82f6' : '#94a3b8' }]}>
                  Sin proyecto
                </Text>
              </TouchableOpacity>
              {projects.map((p) => (
                <TouchableOpacity
                  key={p.id}
                  onPress={() => setProjectId(p.id)}
                  style={[
                    styles.chip,
                    styles.chipRow,
                    {
                      borderColor: projectId === p.id ? p.color : '#e2e8f0',
                      backgroundColor: projectId === p.id ? p.color + '20' : 'transparent',
                    },
                  ]}
                >
                  <View style={[styles.projectDot, { backgroundColor: p.color }]} />
                  <Text style={[styles.chipText, { color: projectId === p.id ? p.color : '#94a3b8' }]}>
                    {p.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* Due date */}
        <Text style={styles.sectionLabel}>Fecha límite</Text>
        <TextInput
          value={dueDate}
          onChangeText={setDueDate}
          placeholder="YYYY-MM-DD (ej: 2025-12-31)"
          placeholderTextColor="#94a3b8"
          style={styles.dateInput}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  cancelText: {
    color: '#64748b',
    fontSize: 16,
  },
  headerTitle: {
    fontWeight: 'bold',
    color: '#0f172a',
    fontSize: 16,
  },
  saveText: {
    color: '#2563eb',
    fontWeight: 'bold',
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  titleInput: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0f172a',
    marginTop: 20,
    marginBottom: 8,
  },
  addDescRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  addDescText: {
    color: '#94a3b8',
    fontSize: 14,
  },
  descInput: {
    color: '#475569',
    fontSize: 16,
    paddingVertical: 8,
    minHeight: 64,
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 16,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 12,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  projectDot: {
    width: 8,
    height: 8,
    borderRadius: 9999,
  },
  dateInput: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#0f172a',
    fontSize: 16,
    marginBottom: 32,
  },
});
