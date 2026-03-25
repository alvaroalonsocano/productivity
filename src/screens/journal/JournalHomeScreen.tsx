import React, { useMemo } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, SafeAreaView, RefreshControl, StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { JournalStackParamList } from '@/navigation/types';
import { useJournalEntries } from '@/hooks/useJournal';
import EmptyState from '@/components/ui/EmptyState';
import { MOOD_EMOJIS } from '@/lib/constants';
import { formatDate, formatFullDate, toDateString } from '@/utils/dateUtils';
import type { JournalEntry } from '@/types';

type Props = { navigation: NativeStackNavigationProp<JournalStackParamList, 'JournalHome'> };

function EntryCard({ entry, onPress }: { entry: JournalEntry; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.entryCard}
      activeOpacity={0.7}
    >
      <View style={styles.entryCardInner}>
        <View style={styles.entryCardContent}>
          <View style={styles.entryMeta}>
            <Text style={styles.entryDate}>{formatDate(entry.entry_date)}</Text>
            {entry.mood && <Text style={styles.entryMoodEmoji}>{MOOD_EMOJIS[entry.mood]}</Text>}
          </View>
          {entry.title && (
            <Text style={styles.entryTitle}>
              {entry.title}
            </Text>
          )}
          <Text style={styles.entryContent} numberOfLines={3}>
            {entry.content || '(sin contenido)'}
          </Text>
        </View>
      </View>
      <View style={styles.entryFooter}>
        <Text style={styles.entryWordCount}>{entry.word_count} palabras</Text>
        {entry.tags.slice(0, 3).map((tag) => (
          <View key={tag} style={styles.tagBadge}>
            <Text style={styles.tagText}>#{tag}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
}

export default function JournalHomeScreen({ navigation }: Props) {
  const today = toDateString(new Date());
  const { data: entries = [], isLoading, refetch, isFetching } = useJournalEntries();

  const hasTodayEntry = useMemo(() => entries.some((e) => e.entry_date === today), [entries, today]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Diario</Text>
        <Text style={styles.entryCount}>
          {entries.length} {entries.length === 1 ? 'entrada' : 'entradas'}
        </Text>
      </View>

      {entries.length === 0 && !isLoading ? (
        <EmptyState
          icon="📓"
          title="Empieza tu diario"
          description="Escribe tu primera entrada y lleva el registro de tu día a día"
          actionLabel="Escribir hoy"
          onAction={() => navigation.navigate('JournalEditor', { date: today })}
        />
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={isFetching && !isLoading} onRefresh={refetch} />}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          renderItem={({ item }) => (
            <EntryCard
              entry={item}
              onPress={() => navigation.navigate('JournalEntry', { entryId: item.id })}
            />
          )}
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        onPress={() => navigation.navigate('JournalEditor', { date: today })}
        style={styles.fab}
      >
        <Ionicons name={hasTodayEntry ? 'pencil' : 'add'} size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  entryCount: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 2,
  },
  entryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  entryCardInner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  entryCardContent: {
    flex: 1,
  },
  entryMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  entryDate: {
    fontSize: 12,
    fontWeight: '500',
    color: '#94a3b8',
  },
  entryMoodEmoji: {
    fontSize: 16,
  },
  entryTitle: {
    fontWeight: 'bold',
    color: '#0f172a',
    fontSize: 16,
    marginBottom: 4,
  },
  entryContent: {
    color: '#64748b',
    fontSize: 14,
    lineHeight: 20,
  },
  entryFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
  },
  entryWordCount: {
    fontSize: 12,
    color: '#cbd5e1',
  },
  tagBadge: {
    backgroundColor: '#f1f5f9',
    borderRadius: 9999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  tagText: {
    fontSize: 12,
    color: '#64748b',
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
