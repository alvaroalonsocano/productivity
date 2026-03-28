import { useEffect, useRef } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { useQueryClient } from '@tanstack/react-query';
import { useOfflineStore } from '@/store/offlineStore';
import { taskService } from '@/services/task.service';
import { habitService } from '@/services/habit.service';
import { journalService } from '@/services/journal.service';
import { useAuthStore } from '@/store/authStore';

export function useNetworkSync() {
  const { setOnline } = useOfflineStore();
  const qc = useQueryClient();
  const userId = useAuthStore((s) => s.user?.id);
  const processingRef = useRef(false);

  // Watch connectivity
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const online = !!state.isConnected && state.isInternetReachable !== false;
      setOnline(online);

      if (online) {
        flushQueue();
      }
    });
    return () => unsubscribe();
  }, [userId]);

  async function flushQueue() {
    if (processingRef.current || !userId) return;
    const { queue, dequeue } = useOfflineStore.getState();
    if (queue.length === 0) return;

    processingRef.current = true;
    const pending = [...queue];

    for (const item of pending) {
      try {
        const { op } = item;
        switch (op.type) {
          case 'createTask':
            await taskService.createTask(op.payload.userId, op.payload.input as any);
            break;
          case 'updateTask':
            await taskService.updateTask(op.payload.input as any);
            break;
          case 'toggleTask':
            if (op.payload.done) {
              await taskService.completeTask(op.payload.id);
            } else {
              await taskService.uncompleteTask(op.payload.id);
            }
            break;
          case 'deleteTask':
            await taskService.deleteTask(op.payload.id);
            break;
          case 'logHabit':
            await habitService.logHabit(op.payload.habitId, op.payload.userId, op.payload.date);
            break;
          case 'unlogHabit':
            await habitService.unlogHabit(op.payload.habitId, op.payload.date);
            break;
          case 'saveJournal':
            await journalService.upsertEntry(op.payload.userId, op.payload.input as any);
            break;
        }
        dequeue(item.id);
      } catch {
        // Leave in queue — will retry on next reconnect
      }
    }

    await qc.invalidateQueries();
    processingRef.current = false;
  }
}
