-- ============================================================
-- EXTENSIONS
-- ============================================================
create extension if not exists "uuid-ossp";

-- ============================================================
-- USER PROFILES (extends auth.users)
-- ============================================================
create table public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        text not null,
  display_name text,
  avatar_url   text,
  timezone     text not null default 'UTC',
  theme        text not null default 'system' check (theme in ('light','dark','system')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Auto-create profile on sign-up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles(id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- PROJECTS
-- ============================================================
create table public.projects (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  name        text not null,
  color       text not null default '#6366f1',
  description text,
  archived    boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ============================================================
-- TASKS
-- ============================================================
create table public.tasks (
  id             uuid primary key default uuid_generate_v4(),
  user_id        uuid not null references public.profiles(id) on delete cascade,
  project_id     uuid references public.projects(id) on delete set null,
  parent_task_id uuid references public.tasks(id) on delete cascade,
  title          text not null,
  description    text,
  status         text not null default 'todo'
                   check (status in ('todo','in_progress','done','cancelled')),
  priority       text not null default 'none'
                   check (priority in ('none','low','medium','high','urgent')),
  due_date       date,
  completed_at   timestamptz,
  sort_order     integer not null default 0,
  archived       boolean not null default false,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index tasks_user_id_idx on public.tasks(user_id);
create index tasks_project_id_idx on public.tasks(project_id);
create index tasks_due_date_idx on public.tasks(due_date) where due_date is not null;
create index tasks_status_idx on public.tasks(status);

-- ============================================================
-- HABITS
-- ============================================================
create table public.habits (
  id               uuid primary key default uuid_generate_v4(),
  user_id          uuid not null references public.profiles(id) on delete cascade,
  name             text not null,
  description      text,
  icon             text,
  color            text not null default '#10b981',
  category         text not null default 'other'
                     check (category in ('health','mindfulness','learning','fitness','productivity','social','other')),
  frequency        text not null default 'daily'
                     check (frequency in ('daily','weekly','custom')),
  target_days      integer[] not null default '{0,1,2,3,4,5,6}',
  target_count     integer not null default 1,
  reminder_time    text,
  reminder_enabled boolean not null default false,
  archived         boolean not null default false,
  start_date       date not null default current_date,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index habits_user_id_idx on public.habits(user_id);

-- ============================================================
-- HABIT LOGS
-- ============================================================
create table public.habit_logs (
  id         uuid primary key default uuid_generate_v4(),
  habit_id   uuid not null references public.habits(id) on delete cascade,
  user_id    uuid not null references public.profiles(id) on delete cascade,
  log_date   date not null,
  count      integer not null default 1,
  note       text,
  created_at timestamptz not null default now(),
  unique(habit_id, log_date)
);

create index habit_logs_user_date_idx on public.habit_logs(user_id, log_date desc);
create index habit_logs_habit_date_idx on public.habit_logs(habit_id, log_date desc);

-- ============================================================
-- JOURNAL ENTRIES
-- ============================================================
create table public.journal_entries (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  entry_date date not null,
  title      text,
  content    text not null default '',
  mood       smallint check (mood between 1 and 5),
  tags       text[] not null default '{}',
  word_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, entry_date)
);

create index journal_user_date_idx on public.journal_entries(user_id, entry_date desc);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at    before update on public.profiles    for each row execute procedure public.set_updated_at();
create trigger set_projects_updated_at    before update on public.projects    for each row execute procedure public.set_updated_at();
create trigger set_tasks_updated_at       before update on public.tasks       for each row execute procedure public.set_updated_at();
create trigger set_habits_updated_at      before update on public.habits      for each row execute procedure public.set_updated_at();
create trigger set_journal_updated_at     before update on public.journal_entries for each row execute procedure public.set_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.profiles        enable row level security;
alter table public.projects        enable row level security;
alter table public.tasks           enable row level security;
alter table public.habits          enable row level security;
alter table public.habit_logs      enable row level security;
alter table public.journal_entries enable row level security;

create policy "profiles: own row only"        on public.profiles        for all using (auth.uid() = id)         with check (auth.uid() = id);
create policy "projects: own rows only"       on public.projects        for all using (auth.uid() = user_id)    with check (auth.uid() = user_id);
create policy "tasks: own rows only"          on public.tasks           for all using (auth.uid() = user_id)    with check (auth.uid() = user_id);
create policy "habits: own rows only"         on public.habits          for all using (auth.uid() = user_id)    with check (auth.uid() = user_id);
create policy "habit_logs: own rows only"     on public.habit_logs      for all using (auth.uid() = user_id)    with check (auth.uid() = user_id);
create policy "journal_entries: own rows only" on public.journal_entries for all using (auth.uid() = user_id)   with check (auth.uid() = user_id);
