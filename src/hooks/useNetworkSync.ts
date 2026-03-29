import { useEffect, useRef } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { useQueryClient } from '@tanstack/react-query';
import { useOfflineStore, MAX_RETRIES } from '@/store/offlineStore';
import { taskService } from '@/services/task.service';
import { habitService } from '@/services/habit.service';
import { journalService } from '@/services/journal.service';
import { useAuthStore } from '@/store/authStore';

export function useNetworkSync() {
  const { setOnline } = useOfflineStore();
  const qc = useQueryClient();
  const userId = useAuthStore((s) => s.user?.id);
  const processingRef = useRef(false);

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

    const { queue, dequeue, incrementRetry } = useOfflineStore.getState();
    if (queue.length === 0) return;

    processingRef.current = true;
    const pending = [...queue];
    const affectedTypes = new Set<string>();

    for (const item of pending) {
      try {
        const { op } = item;

        switch (op.type) {
          case 'createTask':
            await taskService.createTask(op.payload.userId, op.payload.input as any);
            affectedTypes.add('tasks');
            break;
          case 'updateTask':
            await taskService.updateTask(op.payload.input as any);
            affectedTypes.add('tasks');
            break;
          case 'toggleTask':
            if (op.payload.done) {
              await taskService.completeTask(op.payload.id);
            } else {
              await taskService.uncompleteTask(op.payload.id);
            }
            affectedTypes.add('tasks');
            break;
          case 'deleteTask':
            await taskService.deleteTask(op.payload.id);
            affectedTypes.add('tasks');
            break;
          case 'logHabit':
            await habitService.logHabit(op.payload.habitId, op.payload.userId, op.payload.date);
            affectedTypes.add('habits');
            break;
          case 'unlogHabit':
            await habitService.unlogHabit(op.payload.habitId, op.payload.date);
            affectedTypes.add('habits');
            break;
          case 'saveJournal':
            await journalService.upsertEntry(op.payload.userId, op.payload.input as any);
            affectedTypes.add('journal');
            break;
        }

        dequeue(item.id);
      } catch (error) {
        const errMsg = error instanceof Error ? error.message : 'Error desconocido';
        const nextRetry = item.retryCount + 1;

        if (nextRetry >= MAX_RETRIES) {
          // Give up after MAX_RETRIES — remove from queue and bump the failed counter
          console.warn(
            `[OfflineSync] Descartando operación ${item.op.type} tras ${MAX_RETRIES} intentos: ${errMsg}`
          );
          dequeue(item.id);
          useOfflineStore.setState((s) => ({ failedCount: s.failedCount + 1 }));
        } else {
          // Keep in queue, will retry on next reconnect
          incrementRetry(item.id, errMsg);
          console.warn(
            `[OfflineSync] Fallo intento ${nextRetry}/${MAX_RETRIES} para ${item.op.type}: ${errMsg}`
          );
        }
      }
    }

    // Invalidate only the query keys that were actually affected
    for (const key of affectedTypes) {
      await qc.invalidateQueries({ queryKey: [key] });
    }

    processingRef.current = false;
  }
}
