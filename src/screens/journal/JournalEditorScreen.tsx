import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  SafeAreaView, ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { JournalStackParamList } from '@/navigation/types';
import { useJournalEntryByDate, useUpsertJournalEntry } from '@/hooks/useJournal';
import MoodPicker from '@/components/journal/MoodPicker';
import { toDateString, formatFullDate } from '@/utils/dateUtils';
import type { Mood } from '@/types';

type Props = {
  navigation: NativeStackNavigationProp<JournalStackParamList, 'JournalEditor'>;
  route: RouteProp<JournalStackParamList, 'JournalEditor'>;
};

export default function JournalEditorScreen({ navigation, route }: Props) {
  const params = route.params;
  const date = params?.date ?? toDateString(new Date());

  const { data: existing, isLoading } = useJournalEntryByDate(date);
  const upsert = useUpsertJournalEntry();
  const autoSaveTimer = useRef<NodeJS.Timeout | null>(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<Mood | null>(null);
  const [tags, setTags] = useState('');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Initialize from existing entry
  useEffect(() => {
    if (existing && !initialized) {
      setTitle(existing.title ?? '');
      setContent(existing.content);
      setMood(existing.mood);
      setTags(existing.tags.join(', '));
      setInitialized(true);
    } else if (!isLoading && !initialized) {
      setInitialized(true);
    }
  }, [existing, isLoading]);

  const save = async () => {
    if (!initialized) return;
    try {
      await upsert.mutateAsync({
        entry_date: date,
        title: title.trim() || null,
        content,
        mood,
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        word_count: 0,
      });
      setLastSaved(new Date());
    } catch {}
  };

  // Auto-save on content change
  useEffect(() => {
    if (!initialized) return;
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(save, 2000);
    return () => { if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current); };
  }, [content, title, mood, tags, initialized]);

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  const handleClose = async () => {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    await save();
    navigation.goBack();
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator color="#3b82f6" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex1}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose}>
            <Ionicons name="close" size={24} color="#64748b" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerDate}>
              {formatFullDate(date)}
            </Text>
            {lastSaved && (
              <Text style={styles.savedText}>Guardado</Text>
            )}
          </View>
          <TouchableOpacity onPress={save} disabled={upsert.isPending}>
            {upsert.isPending ? (
              <ActivityIndicator size="small" color="#3b82f6" />
            ) : (
              <Text style={styles.saveText}>Guardar</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
          {/* Mood */}
          <View style={styles.moodSection}>
            <Text style={styles.sectionLabel}>¿Cómo te sientes?</Text>
            <MoodPicker selected={mood} onSelect={setMood} />
          </View>

          {/* Title */}
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Título (opcional)"
            placeholderTextColor="#cbd5e1"
            style={styles.titleInput}
          />

          {/* Content */}
          <TextInput
            value={content}
            onChangeText={setContent}
            placeholder="¿Qué ha pasado hoy? ¿Cómo te has sentido?..."
            placeholderTextColor="#94a3b8"
            multiline
            textAlignVertical="top"
            style={styles.contentInput}
            autoFocus={!existing}
          />

          {/* Tags */}
          <View style={styles.tagsSection}>
            <Text style={styles.sectionLabel}>Etiquetas</Text>
            <TextInput
              value={tags}
              onChangeText={setTags}
              placeholder="trabajo, familia, ejercicio..."
              placeholderTextColor="#94a3b8"
              style={styles.tagsInput}
            />
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.wordCount}>{wordCount} palabras</Text>
        </View>
      </KeyboardAvoidingView>
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
  flex1: {
    flex: 1,
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
  headerCenter: {
    alignItems: 'center',
  },
  headerDate: {
    fontWeight: '600',
    color: '#0f172a',
    fontSize: 14,
  },
  savedText: {
    fontSize: 12,
    color: '#94a3b8',
  },
  saveText: {
    color: '#2563eb',
    fontWeight: '600',
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  moodSection: {
    marginTop: 16,
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 12,
  },
  titleInput: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  contentInput: {
    fontSize: 16,
    color: '#334155',
    lineHeight: 28,
    minHeight: 192,
  },
  tagsSection: {
    marginTop: 16,
    marginBottom: 8,
  },
  tagsInput: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#334155',
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  wordCount: {
    fontSize: 12,
    color: '#94a3b8',
  },
});
