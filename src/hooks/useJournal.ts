import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { journalService } from '@/services/journal.service';
import { useAuthStore } from '@/store/authStore';
import type { CreateJournalEntryInput } from '@/types';

export function useJournalEntries() {
  const userId = useAuthStore((s) => s.user?.id);
  return useQuery({
    queryKey: ['journal', userId],
    queryFn: () => journalService.getEntries(userId!),
    enabled: !!userId,
  });
}

export function useJournalEntry(entryId: string) {
  return useQuery({
    queryKey: ['journal-entry', entryId],
    queryFn: () => journalService.getEntry(entryId),
  });
}

export function useJournalEntryByDate(date: string) {
  const userId = useAuthStore((s) => s.user?.id);
  return useQuery({
    queryKey: ['journal-entry-date', userId, date],
    queryFn: () => journalService.getEntryByDate(userId!, date),
    enabled: !!userId && !!date,
  });
}

export function useUpsertJournalEntry() {
  const qc = useQueryClient();
  const userId = useAuthStore((s) => s.user?.id)!;
  return useMutation({
    mutationFn: (input: CreateJournalEntryInput) => journalService.upsertEntry(userId, input),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['journal', userId] });
      qc.setQueryData(['journal-entry', data.id], data);
      qc.setQueryData(['journal-entry-date', userId, data.entry_date], data);
    },
  });
}

export function useDeleteJournalEntry() {
  const qc = useQueryClient();
  const userId = useAuthStore((s) => s.user?.id)!;
  return useMutation({
    mutationFn: (id: string) => journalService.deleteEntry(id),
    onSettled: () => qc.invalidateQueries({ queryKey: ['journal', userId] }),
  });
}
