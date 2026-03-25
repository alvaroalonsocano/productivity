# Productivity App — Contexto para Claude

## Qué es esto
App móvil de productividad personal hecha con Expo (React Native) + Supabase.
Permite gestionar tareas, hábitos y diario personal con cuenta de usuario.

## Stack técnico
- **Frontend**: Expo SDK 54, React Native 0.81, TypeScript
- **Navegación**: React Navigation v6 (tabs + stacks)
- **Backend**: Supabase (auth, PostgreSQL, RLS)
- **Estado**: Zustand (`src/store/`)
- **Data fetching**: TanStack Query (`src/hooks/`)
- **Estilos**: React Native StyleSheet (NativeWind fue descartado por incompatibilidad con SDK 54)

## Estructura de carpetas
```
src/
  screens/      # Pantallas por módulo (auth, tasks, habits, journal, settings)
  components/   # UI genérico (ui/) y por módulo (tasks/, habits/, journal/)
  navigation/   # Stacks y tabs de React Navigation
  hooks/        # Custom hooks con TanStack Query (useAuth, useTasks, useHabits, useJournal)
  services/     # Lógica Supabase (auth, task, habit, journal)
  store/        # Zustand stores (authStore, uiStore)
  types/        # TypeScript types por módulo
  lib/          # supabase client, queryClient, constants
  utils/        # dateUtils, streakUtils
supabase/
  schema.sql    # Schema completo de BD con RLS
```

## Base de datos Supabase
Proyecto: `iyudsziylawkrnmqazwb`
Tablas: `profiles`, `tasks`, `projects`, `subtasks`, `habits`, `habit_completions`, `journal_entries`
Row Level Security activo en todas las tablas.

## Variables de entorno
Fichero `.env.local` (NO subido a git):
```
EXPO_PUBLIC_SUPABASE_URL=https://iyudsziylawkrnmqazwb.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
```

## Cómo arrancar
```bash
cd ~/Documents/repos/productivity
npx expo start
```
Escanear QR con Expo Go (iOS/Android).

## Rama activa
`feature/productivity-app` — PR pendiente de mergear a `master`

## Estado actual (2026-03-26)
- Auth completo (registro, login, verificación email)
- CRUD completo de tareas y proyectos
- Hábitos con rachas y grid semanal
- Diario con selector de mood y etiquetas
- Pantallas de settings y perfil
- Estilos funcionando con StyleSheet nativo

## Próximas mejoras planificadas (en Notion)
- Dashboard home con resumen del día
- Notificaciones push (recordatorios de hábitos y tareas)
- Sincronización offline
- Estadísticas y gráficas de progreso
- Widget iOS/Android
