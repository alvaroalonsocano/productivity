import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService, projectService } from '@/services/task.service';
import { useAuthStore } from '@/store/authStore';
import type { CreateTaskInput, UpdateTaskInput, CreateProjectInput } from '@/types';

export function useTasks() {
  const userId = useAuthStore((s) => s.user?.id);
  return useQuery({
    queryKey: ['tasks', userId],
    queryFn: () => taskService.getTasks(userId!),
    enabled: !!userId,
  });
}

export function useTask(taskId: string) {
  return useQuery({
    queryKey: ['task', taskId],
    queryFn: () => taskService.getTask(taskId),
  });
}

export function useSubtasks(parentTaskId: string) {
  return useQuery({
    queryKey: ['subtasks', parentTaskId],
    queryFn: () => taskService.getSubtasks(parentTaskId),
  });
}

export function useProjects() {
  const userId = useAuthStore((s) => s.user?.id);
  return useQuery({
    queryKey: ['projects', userId],
    queryFn: () => projectService.getProjects(userId!),
    enabled: !!userId,
  });
}

export function useCreateTask() {
  const qc = useQueryClient();
  const userId = useAuthStore((s) => s.user?.id)!;
  return useMutation({
    mutationFn: (input: CreateTaskInput) => taskService.createTask(userId, input),
    onMutate: async (input) => {
      await qc.cancelQueries({ queryKey: ['tasks', userId] });
      const prev = qc.getQueryData(['tasks', userId]);
      qc.setQueryData(['tasks', userId], (old: any[] = []) => [
        {
          ...input,
          id: 'temp-' + Date.now(),
          user_id: userId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        ...old,
      ]);
      return { prev };
    },
    onError: (_, __, ctx) => qc.setQueryData(['tasks', userId], ctx?.prev),
    onSettled: () => qc.invalidateQueries({ queryKey: ['tasks', userId] }),
  });
}

export function useUpdateTask() {
  const qc = useQueryClient();
  const userId = useAuthStore((s) => s.user?.id)!;
  return useMutation({
    mutationFn: (input: UpdateTaskInput) => taskService.updateTask(input),
    onMutate: async (input) => {
      await qc.cancelQueries({ queryKey: ['tasks', userId] });
      const prev = qc.getQueryData(['tasks', userId]);
      qc.setQueryData(['tasks', userId], (old: any[] = []) =>
        old.map((t) => (t.id === input.id ? { ...t, ...input } : t))
      );
      return { prev };
    },
    onError: (_, __, ctx) => qc.setQueryData(['tasks', userId], ctx?.prev),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['tasks', userId] });
    },
  });
}

export function useToggleTask() {
  const qc = useQueryClient();
  const userId = useAuthStore((s) => s.user?.id)!;
  return useMutation({
    mutationFn: ({ id, done }: { id: string; done: boolean }) =>
      done ? taskService.completeTask(id) : taskService.uncompleteTask(id),
    onMutate: async ({ id, done }) => {
      await qc.cancelQueries({ queryKey: ['tasks', userId] });
      const prev = qc.getQueryData(['tasks', userId]);
      qc.setQueryData(['tasks', userId], (old: any[] = []) =>
        old.map((t) =>
          t.id === id
            ? { ...t, status: done ? 'done' : 'todo', completed_at: done ? new Date().toISOString() : null }
            : t
        )
      );
      return { prev };
    },
    onError: (_, __, ctx) => qc.setQueryData(['tasks', userId], ctx?.prev),
    onSettled: () => qc.invalidateQueries({ queryKey: ['tasks', userId] }),
  });
}

export function useDeleteTask() {
  const qc = useQueryClient();
  const userId = useAuthStore((s) => s.user?.id)!;
  return useMutation({
    mutationFn: (id: string) => taskService.deleteTask(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ['tasks', userId] });
      const prev = qc.getQueryData(['tasks', userId]);
      qc.setQueryData(['tasks', userId], (old: any[] = []) => old.filter((t) => t.id !== id));
      return { prev };
    },
    onError: (_, __, ctx) => qc.setQueryData(['tasks', userId], ctx?.prev),
    onSettled: () => qc.invalidateQueries({ queryKey: ['tasks', userId] }),
  });
}

export function useCreateProject() {
  const qc = useQueryClient();
  const userId = useAuthStore((s) => s.user?.id)!;
  return useMutation({
    mutationFn: (input: CreateProjectInput) => projectService.createProject(userId, input),
    onSettled: () => qc.invalidateQueries({ queryKey: ['projects', userId] }),
  });
}
