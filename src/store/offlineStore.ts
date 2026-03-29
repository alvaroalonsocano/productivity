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
  retryCount: number;
  lastError?: string;
}

interface OfflineState {
  isOnline: boolean;
  queue: QueuedOperation[];
  /** Number of operations that failed permanently (after MAX_RETRIES) */
  failedCount: number;
  setOnline: (online: boolean) => void;
  enqueue: (op: OfflineOperation) => string;
  dequeue: (id: string) => void;
  clearQueue: () => void;
  incrementRetry: (id: string, error: string) => void;
  clearFailed: () => void;
}

export const MAX_RETRIES = 3;

export const useOfflineStore = create<OfflineState>((set, get) => ({
  isOnline: true,
  queue: [],
  failedCount: 0,

  setOnline: (online) => set({ isOnline: online }),

  enqueue: (op) => {
    const id = `offline-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    set((s) => ({
      queue: [...s.queue, { id, op, timestamp: Date.now(), retryCount: 0 }],
    }));
    return id;
  },

  dequeue: (id) => set((s) => ({ queue: s.queue.filter((item) => item.id !== id) })),

  incrementRetry: (id, error) =>
    set((s) => ({
      queue: s.queue.map((item) =>
        item.id === id
          ? { ...item, retryCount: item.retryCount + 1, lastError: error }
          : item
      ),
    })),

  clearFailed: () => set({ failedCount: 0 }),

  clearQueue: () => set({ queue: [], failedCount: 0 }),
}));
