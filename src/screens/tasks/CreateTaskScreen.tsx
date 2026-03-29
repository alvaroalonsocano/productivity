import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  SafeAreaView, Alert, ActivityIndicator, StyleSheet,
} from 'react-native';
import { z } from 'zod';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { TasksStackParamList } from '@/navigation/types';
import { useCreateTask, useProjects } from '@/hooks/useTasks';
import { PRIORITY_COLORS, PRIORITY_LABELS } from '@/lib/constants';
import type { Priority } from '@/types';
import { useTheme } from '@/lib/theme';

const CreateTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'El título no puede estar vacío')
    .max(255, 'El título no puede superar 255 caracteres'),
  dueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (usa YYYY-MM-DD)')
    .optional()
    .or(z.literal('')),
});

type FormErrors = {
  title?: string;
  dueDate?: string;
};

type Props = {
  navigation: NativeStackNavigationProp<TasksStackParamList, 'CreateTask'>;
  route: RouteProp<TasksStackParamList, 'CreateTask'>;
};

const PRIORITIES: Priority[] = ['none', 'low', 'medium', 'high', 'urgent'];

export default function CreateTaskScreen({ navigation, route }: Props) {
  const c = useTheme();
  const params = route.params;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('none');
  const [dueDate, setDueDate] = useState(params?.dueDate ?? '');
  const [projectId, setProjectId] = useState(params?.projectId ?? null);
  const [showDesc, setShowDesc] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const { data: projects = [] } = useProjects();
  const createTask = useCreateTask();

  const handleSave = async () => {
    const result = CreateTaskSchema.safeParse({ title, dueDate });
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        title: fieldErrors.title?.[0],
        dueDate: fieldErrors.dueDate?.[0],
      });
      return;
    }
    setErrors({});
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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.card,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: c.border,
    },
    cancelText: {
      color: c.textMuted,
      fontSize: 16,
    },
    headerTitle: {
      fontWeight: 'bold',
      color: c.text,
      fontSize: 16,
    },
    saveText: {
      color: c.primaryDark,
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
      color: c.text,
      marginTop: 20,
      marginBottom: 4,
    },
    errorText: {
      color: '#E53E3E',
      fontSize: 12,
      marginBottom: 8,
    },
    addDescRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingVertical: 8,
    },
    addDescText: {
      color: c.textPlaceholder,
      fontSize: 14,
    },
    descInput: {
      color: c.textMuted,
      fontSize: 16,
      paddingVertical: 8,
      minHeight: 64,
    },
    divider: {
      height: 1,
      backgroundColor: c.border,
      marginVertical: 16,
    },
    sectionLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: c.textMuted,
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
      backgroundColor: c.bg,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      color: c.text,
      fontSize: 16,
      marginBottom: 32,
    },
  });

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
            <ActivityIndicator color={c.primary} />
          ) : (
            <Text style={styles.saveText}>Guardar</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
        {/* Title */}
        <TextInput
          value={title}
          onChangeText={(t) => { setTitle(t); if (errors.title) setErrors((e) => ({ ...e, title: undefined })); }}
          placeholder="¿Qué hay que hacer?"
          placeholderTextColor={c.textPlaceholder}
          autoFocus
          multiline
          style={styles.titleInput}
        />
        {errors.title ? <Text style={styles.errorText}>{errors.title}</Text> : null}

        {/* Description toggle */}
        {!showDesc ? (
          <TouchableOpacity onPress={() => setShowDesc(true)} style={styles.addDescRow}>
            <Ionicons name="add-circle-outline" size={18} color={c.textPlaceholder} />
            <Text style={styles.addDescText}>Añadir descripción</Text>
          </TouchableOpacity>
        ) : (
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Descripción..."
            placeholderTextColor={c.textPlaceholder}
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
                  borderColor: priority === p ? PRIORITY_COLORS[p] : c.borderStrong,
                  backgroundColor: priority === p ? PRIORITY_COLORS[p] + '20' : 'transparent',
                },
              ]}
            >
              <Text style={[styles.chipText, { color: priority === p ? PRIORITY_COLORS[p] : c.textPlaceholder }]}>
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
                  { borderColor: !projectId ? c.primary : c.borderStrong, backgroundColor: !projectId ? c.primaryBg : 'transparent' },
                ]}
              >
                <Text style={[styles.chipText, { color: !projectId ? c.primary : c.textPlaceholder }]}>
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
                      borderColor: projectId === p.id ? p.color : c.borderStrong,
                      backgroundColor: projectId === p.id ? p.color + '20' : 'transparent',
                    },
                  ]}
                >
                  <View style={[styles.projectDot, { backgroundColor: p.color }]} />
                  <Text style={[styles.chipText, { color: projectId === p.id ? p.color : c.textPlaceholder }]}>
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
          onChangeText={(t) => { setDueDate(t); if (errors.dueDate) setErrors((e) => ({ ...e, dueDate: undefined })); }}
          placeholder="YYYY-MM-DD (ej: 2026-12-31)"
          placeholderTextColor={c.textPlaceholder}
          style={[styles.dateInput, errors.dueDate ? { borderWidth: 1, borderColor: '#E53E3E' } : undefined]}
        />
        {errors.dueDate ? <Text style={styles.errorText}>{errors.dueDate}</Text> : null}
      </ScrollView>
    </SafeAreaView>
  );
}
