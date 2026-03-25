import React, { useState, useMemo } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, RefreshControl,
  SafeAreaView, ScrollView, StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { TasksStackParamList } from '@/navigation/types';
import { useTasks, useProjects, useToggleTask } from '@/hooks/useTasks';
import { useAuthStore } from '@/store/authStore';
import TaskCard from '@/components/tasks/TaskCard';
import EmptyState from '@/components/ui/EmptyState';
import { isOverdue, isDueToday } from '@/utils/dateUtils';
import type { Task } from '@/types';

type Props = { navigation: NativeStackNavigationProp<TasksStackParamList, 'TasksHome'> };

type Filter = 'all' | 'today' | 'overdue' | 'no_project';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'Todas' },
  { key: 'today', label: 'Hoy' },
  { key: 'overdue', label: 'Vencidas' },
  { key: 'no_project', label: 'Sin proyecto' },
];

export default function TasksHomeScreen({ navigation }: Props) {
  const profile = useAuthStore((s) => s.profile);
  const [filter, setFilter] = useState<Filter>('all');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const { data: tasks = [], isLoading, refetch, isFetching } = useTasks();
  const { data: projects = [] } = useProjects();
  const toggleTask = useToggleTask();

  const filtered = useMemo(() => {
    let result = tasks.filter((t) => t.status !== 'cancelled');
    if (selectedProject) result = result.filter((t) => t.project_id === selectedProject);
    switch (filter) {
      case 'today': result = result.filter((t) => t.due_date && isDueToday(t.due_date)); break;
      case 'overdue': result = result.filter((t) => t.due_date && isOverdue(t.due_date) && t.status !== 'done'); break;
      case 'no_project': result = result.filter((t) => !t.project_id); break;
    }
    return result.sort((a, b) => {
      if (a.status === 'done' && b.status !== 'done') return 1;
      if (a.status !== 'done' && b.status === 'done') return -1;
      return 0;
    });
  }, [tasks, filter, selectedProject]);

  const getProjectColor = (projectId: string | null) =>
    projects.find((p) => p.id === projectId)?.color;

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 20) return 'Buenas tardes';
    return 'Buenas noches';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.flex1}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greetingText}>{greeting()}</Text>
          <Text style={styles.titleText}>
            {profile?.display_name ? `Hola, ${profile.display_name}` : 'Mis Tareas'}
          </Text>

          {/* Filters */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            {FILTERS.map((f) => (
              <TouchableOpacity
                key={f.key}
                onPress={() => setFilter(f.key)}
                style={[styles.filterChip, filter === f.key ? styles.filterChipActive : styles.filterChipInactive]}
              >
                <Text style={[styles.filterChipText, filter === f.key ? styles.filterChipTextActive : styles.filterChipTextInactive]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Projects */}
          {projects.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.projectScroll}>
              <TouchableOpacity
                onPress={() => setSelectedProject(null)}
                style={[styles.projectChip, !selectedProject ? styles.projectChipActive : styles.projectChipInactive]}
              >
                <Text style={[styles.projectChipText, !selectedProject ? styles.projectChipTextActive : styles.projectChipTextInactive]}>
                  Todos
                </Text>
              </TouchableOpacity>
              {projects.map((p) => (
                <TouchableOpacity
                  key={p.id}
                  onPress={() => setSelectedProject(p.id === selectedProject ? null : p.id)}
                  onLongPress={() => navigation.navigate('ProjectDetail', { projectId: p.id })}
                  style={[styles.projectChip, selectedProject === p.id ? styles.projectChipActive : styles.projectChipInactive]}
                >
                  <View style={styles.projectChipRow}>
                    <View style={[styles.projectDot, { backgroundColor: p.color }]} />
                    <Text style={[styles.projectChipText, selectedProject === p.id ? styles.projectChipTextActive : styles.projectChipTextInactive]}>
                      {p.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Task list */}
        {filtered.length === 0 && !isLoading ? (
          <EmptyState
            icon="✅"
            title="Sin tareas pendientes"
            description="Crea tu primera tarea para empezar a organizarte"
            actionLabel="Nueva tarea"
            onAction={() => navigation.navigate('CreateTask', undefined)}
          />
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            refreshControl={<RefreshControl refreshing={isFetching && !isLoading} onRefresh={refetch} />}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
            ItemSeparatorComponent={() => (
              <View style={styles.separator} />
            )}
            renderItem={({ item }) => (
              <TaskCard
                task={item}
                onToggle={(id, done) => toggleTask.mutate({ id, done })}
                onPress={(id) => navigation.navigate('TaskDetail', { taskId: id })}
                projectColor={getProjectColor(item.project_id)}
              />
            )}
          />
        )}
      </View>

      {/* FAB */}
      <TouchableOpacity
        onPress={() => navigation.navigate('CreateTask', undefined)}
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
  flex1: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  greetingText: {
    color: '#64748b',
    fontSize: 14,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  filterScroll: {
    marginTop: 12,
    marginHorizontal: -4,
  },
  filterChip: {
    marginHorizontal: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
  },
  filterChipActive: {
    backgroundColor: '#2563eb',
  },
  filterChipInactive: {
    backgroundColor: '#f1f5f9',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#ffffff',
  },
  filterChipTextInactive: {
    color: '#475569',
  },
  projectScroll: {
    marginTop: 8,
    marginHorizontal: -4,
  },
  projectChip: {
    marginHorizontal: 4,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
    borderWidth: 1,
  },
  projectChipActive: {
    borderColor: '#2563eb',
  },
  projectChipInactive: {
    borderColor: '#e2e8f0',
  },
  projectChipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  projectDot: {
    width: 8,
    height: 8,
    borderRadius: 9999,
  },
  projectChipText: {
    fontSize: 12,
    fontWeight: '500',
  },
  projectChipTextActive: {
    color: '#2563eb',
  },
  projectChipTextInactive: {
    color: '#64748b',
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
