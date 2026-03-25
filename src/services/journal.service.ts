import { supabase } from '@/lib/supabase';
import type { JournalEntry, CreateJournalEntryInput } from '@/types';

export const journalService = {
  getEntries: async (userId: string, limit = 50): Promise<JournalEntry[]> => {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .order('entry_date', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data;
  },

  getEntry: async (id: string): Promise<JournalEntry> => {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  getEntryByDate: async (userId: string, date: string): Promise<JournalEntry | null> => {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .eq('entry_date', date)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  upsertEntry: async (userId: string, input: CreateJournalEntryInput): Promise<JournalEntry> => {
    const wordCount = input.content.trim().split(/\s+/).filter(Boolean).length;
    const { data, error } = await supabase
      .from('journal_entries')
      .upsert(
        { ...input, user_id: userId, word_count: wordCount },
        { onConflict: 'user_id,entry_date' }
      )
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  deleteEntry: async (id: string): Promise<void> => {
    const { error } = await supabase.from('journal_entries').delete().eq('id', id);
    if (error) throw error;
  },
};
