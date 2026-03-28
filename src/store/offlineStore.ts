import { create } from 'zustand';

export type OfflineOperation =
  | { type: 'createTask'; payload: { userId: string; input: Record<string, unknown> } }
  | { type: 'updateTask'; payload: { input: Record<string, unknown> } }
  | { type: 'toggleTask'; payload: { id: string; done: boolean } }
  | { type: 'deleteTask'; payload: { id: string } }
  | { type: 'logHabit'; payload: { habitId: string; userId: string; date: string } }
  | { type: 'unlogHabit'; payload: { habitId: string; date: string } }
  | { type: 'saveJournal'; payload: { userId: string; input: Record<string, unknown> } };

export interface QueuedOperation {
  id: string;
  op: OfflineOperation;
  timestamp: number;
}

interface OfflineState {
  isOnline: boolean;
  queue: QueuedOperation[];
  setOnline: (online: boolean) => void;
  enqueue: (op: OfflineOperation) => string;
  dequeue: (id: string) => void;
  clearQueue: () => void;
}

export const useOfflineStore = create<OfflineState>((set, get) => ({
  isOnline: true,
  queue: [],

  setOnline: (online) => set({ isOnline: online }),

  enqueue: (op) => {
    const id = `offline-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    set((s) => ({ queue: [...s.queue, { id, op, timestamp: Date.now() }] }));
    return id;
  },

  dequeue: (id) => set((s) => ({ queue: s.queue.filter((item) => item.id !== id) })),

  clearQueue: () => set({ queue: [] }),
}));
