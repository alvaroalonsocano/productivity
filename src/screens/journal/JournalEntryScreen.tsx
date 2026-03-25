import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, SafeAreaView,
  ActivityIndicator, Alert, StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { JournalStackParamList } from '@/navigation/types';
import { useJournalEntry, useDeleteJournalEntry } from '@/hooks/useJournal';
import { MOOD_EMOJIS, MOOD_LABELS } from '@/lib/constants';
import { formatFullDate } from '@/utils/dateUtils';

type Props = {
  navigation: NativeStackNavigationProp<JournalStackParamList, 'JournalEntry'>;
  route: RouteProp<JournalStackParamList, 'JournalEntry'>;
};

export default function JournalEntryScreen({ navigation, route }: Props) {
  const { entryId } = route.params;
  const { data: entry, isLoading } = useJournalEntry(entryId);
  const deleteEntry = useDeleteJournalEntry();

  const handleDelete = () => {
    Alert.alert('Eliminar entrada', '¿Seguro que quieres eliminar esta entrada?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          await deleteEntry.mutateAsync(entryId);
          navigation.goBack();
        },
      },
    ]);
  };

  if (isLoading || !entry) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator color="#3b82f6" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#64748b" />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={() => navigation.navigate('JournalEditor', { entryId, date: entry.entry_date })}
          >
            <Ionicons name="pencil-outline" size={22} color="#3b82f6" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete}>
            <Ionicons name="trash-outline" size={22} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Date */}
        <Text style={styles.dateText}>{formatFullDate(entry.entry_date)}</Text>

        {/* Mood */}
        {entry.mood && (
          <View style={styles.moodRow}>
            <Text style={styles.moodEmoji}>{MOOD_EMOJIS[entry.mood]}</Text>
            <Text style={styles.moodLabel}>{MOOD_LABELS[entry.mood]}</Text>
          </View>
        )}

        {/* Title */}
        {entry.title && (
          <Text style={styles.entryTitle}>
            {entry.title}
          </Text>
        )}

        {/* Content */}
        <Text style={styles.entryContent}>
          {entry.content || '(sin contenido)'}
        </Text>

        {/* Tags */}
        {entry.tags.length > 0 && (
          <View style={styles.tagsRow}>
            {entry.tags.map((tag) => (
              <View key={tag} style={styles.tagBadge}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        )}

        <Text style={styles.wordCount}>{entry.word_count} palabras</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  dateText: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 20,
    marginBottom: 8,
  },
  moodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  moodEmoji: {
    fontSize: 30,
  },
  moodLabel: {
    color: '#64748b',
  },
  entryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 16,
  },
  entryContent: {
    fontSize: 16,
    color: '#334155',
    lineHeight: 28,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 20,
  },
  tagBadge: {
    backgroundColor: '#eff6ff',
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#2563eb',
    fontWeight: '500',
  },
  wordCount: {
    fontSize: 12,
    color: '#cbd5e1',
    marginTop: 16,
  },
});
