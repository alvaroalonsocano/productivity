export const PRIORITY_COLORS = {
  none: '#94a3b8',
  low: '#22c55e',
  medium: '#f59e0b',
  high: '#ef4444',
  urgent: '#7c3aed',
} as const;

export const PRIORITY_LABELS = {
  none: 'Sin prioridad',
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
  urgent: 'Urgente',
} as const;

export const STATUS_LABELS = {
  todo: 'Por hacer',
  in_progress: 'En progreso',
  done: 'Completada',
  cancelled: 'Cancelada',
} as const;

export const MOOD_EMOJIS: Record<number, string> = {
  1: '😔',
  2: '😕',
  3: '😐',
  4: '🙂',
  5: '😄',
};

export const MOOD_LABELS: Record<number, string> = {
  1: 'Muy mal',
  2: 'Mal',
  3: 'Regular',
  4: 'Bien',
  5: 'Muy bien',
};

export const HABIT_CATEGORY_LABELS = {
  health: 'Salud',
  mindfulness: 'Mindfulness',
  learning: 'Aprendizaje',
  fitness: 'Ejercicio',
  productivity: 'Productividad',
  social: 'Social',
  other: 'Otro',
} as const;

export const HABIT_CATEGORY_ICONS = {
  health: '🏥',
  mindfulness: '🧘',
  learning: '📚',
  fitness: '💪',
  productivity: '⚡',
  social: '👥',
  other: '✨',
} as const;

export const PROJECT_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#ef4444',
  '#f97316', '#eab308', '#22c55e', '#14b8a6',
  '#3b82f6', '#06b6d4',
];

export const HABIT_COLORS = [
  '#10b981', '#6366f1', '#f59e0b', '#ef4444',
  '#8b5cf6', '#ec4899', '#3b82f6', '#14b8a6',
  '#f97316', '#84cc16',
];

export const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
