import React, { useMemo } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, SafeAreaView, Alert, StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { TasksStackParamList } from '@/navigation/types';
import { useTasks, useProjects, useToggleTask } from '@/hooks/useTasks';
import { projectService } from '@/services/task.service';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import TaskCard from '@/components/tasks/TaskCard';
import ProgressBar from '@/components/ui/ProgressBar';
import EmptyState from '@/components/ui/EmptyState';

type Props = {
  navigation: NativeStackNavigationProp<TasksStackParamList, 'ProjectDetail'>;
  route: RouteProp<TasksStackParamList, 'ProjectDetail'>;
};

export default function ProjectDetailScreen({ navigation, route }: Props) {
  const { projectId } = route.params;
  const userId = useAuthStore((s) => s.user?.id);
  const qc = useQueryClient();

  const { data: tasks = [] } = useTasks();
  const { data: projects = [] } = useProjects();
  const toggleTask = useToggleTask();

  const project = projects.find((p) => p.id === projectId);
  const projectTasks = useMemo(
    () => tasks.filter((t) => t.project_id === projectId && !t.parent_task_id),
    [tasks, projectId]
  );
  const done = projectTasks.filter((t) => t.status === 'done').length;
  const progress = projectTasks.length > 0 ? done / projectTasks.length : 0;

  const handleArchive = () => {
    Alert.alert('Archivar proyecto', '¿Seguro que quieres archivar este proyecto?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Archivar',
        style: 'destructive',
        onPress: async () => {
          await projectService.archiveProject(projectId);
          qc.invalidateQueries({ queryKey: ['projects', userId] });
          navigation.goBack();
        },
      },
    ]);
  };

  if (!project) return null;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#64748b" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleArchive}>
            <Ionicons name="archive-outline" size={22} color="#94a3b8" />
          </TouchableOpacity>
        </View>
        <View style={styles.projectTitleRow}>
          <View style={[styles.projectDot, { backgroundColor: project.color }]} />
          <Text style={styles.projectTitle}>{project.name}</Text>
        </View>
        <View style={styles.progressSection}>
          <View style={styles.progressLabelRow}>
            <Text style={styles.progressLabel}>{done}/{projectTasks.length} tareas</Text>
            <Text style={styles.progressPercent}>{Math.round(progress * 100)}%</Text>
          </View>
          <ProgressBar progress={progress} color={project.color} />
        </View>
      </View>

      {projectTasks.length === 0 ? (
        <EmptyState
          icon="📋"
          title="Sin tareas"
          description="Añade tareas a este proyecto"
          actionLabel="Nueva tarea"
          onAction={() => navigation.navigate('CreateTask', { projectId })}
        />
      ) : (
        <FlatList
          data={projectTasks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <TaskCard
              task={item}
              onToggle={(id, done) => toggleTask.mutate({ id, done })}
              onPress={(id) => navigation.navigate('TaskDetail', { taskId: id })}
              projectColor={project.color}
            />
          )}
        />
      )}

      <TouchableOpacity
        onPress={() => navigation.navigate('CreateTask', { projectId })}
        style={styles.fab}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  projectTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
  },
  projectDot: {
    width: 16,
    height: 16,
    borderRadius: 9999,
  },
  projectTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  progressSection: {
    marginTop: 12,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  progressPercent: {
    fontSize: 12,
    fontWeight: '500',
    color: '#2563eb',
  },
  separator: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginLeft: 36,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#2563eb',
    width: 56,
    height: 56,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
