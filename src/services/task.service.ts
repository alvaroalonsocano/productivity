import { supabase } from '@/lib/supabase';
import type { Task, CreateTaskInput, UpdateTaskInput, Project, CreateProjectInput, UpdateProjectInput } from '@/types';

export const taskService = {
  getTasks: async (userId: string): Promise<Task[]> => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .eq('archived', false)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  getTask: async (id: string): Promise<Task> => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  getSubtasks: async (parentTaskId: string): Promise<Task[]> => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('parent_task_id', parentTaskId)
      .eq('archived', false)
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data;
  },

  createTask: async (userId: string, input: CreateTaskInput): Promise<Task> => {
    const { data, error } = await supabase
      .from('tasks')
      .insert({ ...input, user_id: userId })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  updateTask: async (input: UpdateTaskInput): Promise<Task> => {
    const { id, ...updates } = input;
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  completeTask: async (id: string): Promise<Task> => {
    const { data, error } = await supabase
      .from('tasks')
      .update({ status: 'done', completed_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  uncompleteTask: async (id: string): Promise<Task> => {
    const { data, error } = await supabase
      .from('tasks')
      .update({ status: 'todo', completed_at: null })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  archiveTask: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('tasks')
      .update({ archived: true })
      .eq('id', id);
    if (error) throw error;
  },

  deleteTask: async (id: string): Promise<void> => {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) throw error;
  },
};

export const projectService = {
  getProjects: async (userId: string): Promise<Project[]> => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .eq('archived', false)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  createProject: async (userId: string, input: CreateProjectInput): Promise<Project> => {
    const { data, error } = await supabase
      .from('projects')
      .insert({ ...input, user_id: userId })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  updateProject: async (input: UpdateProjectInput): Promise<Project> => {
    const { id, ...updates } = input;
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  archiveProject: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('projects')
      .update({ archived: true })
      .eq('id', id);
    if (error) throw error;
  },
};
