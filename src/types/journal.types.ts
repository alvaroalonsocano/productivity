export type Mood = 1 | 2 | 3 | 4 | 5;

export interface JournalEntry {
  id: string;
  user_id: string;
  entry_date: string;
  title: string | null;
  content: string;
  mood: Mood | null;
  tags: string[];
  word_count: number;
  created_at: string;
  updated_at: string;
}

export type CreateJournalEntryInput = Omit<
  JournalEntry,
  'id' | 'user_id' | 'created_at' | 'updated_at'
>;
export type UpdateJournalEntryInput = Partial<CreateJournalEntryInput> & { id: string };
