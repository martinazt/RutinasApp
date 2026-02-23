-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Table: Gyms
create table if not exists public.gyms (
  id uuid not null default uuid_generate_v4(),
  name text not null,
  location text null,
  logo_url text null,
  created_at timestamp with time zone not null default now(),
  constraint gyms_pkey primary key (id)
);

-- Table: Students
create table if not exists public.students (
  id uuid not null default uuid_generate_v4(),
  name text not null,
  age integer null,
  goal text null,
  gym_id uuid null,
  avatar_url text null,
  email text null,
  is_active boolean not null default true,
  created_at timestamp with time zone not null default now(),
  constraint students_pkey primary key (id),
  constraint students_gym_id_fkey foreign key (gym_id) references public.gyms (id)
);

-- Table: Exercises
create table if not exists public.exercises (
  id uuid not null default uuid_generate_v4(),
  name text not null,
  muscle_group text not null,
  description text null,
  video_url text null,
  thumbnail_url text null,
  created_at timestamp with time zone not null default now(),
  constraint exercises_pkey primary key (id)
);

-- Table: Routines
create table if not exists public.routines (
  id uuid not null default uuid_generate_v4(),
  name text not null,
  student_id uuid not null,
  tags text[] null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint routines_pkey primary key (id),
  constraint routines_student_id_fkey foreign key (student_id) references public.students (id)
);

-- Table: Routine Exercises (Join Table)
create table if not exists public.routine_exercises (
  id uuid not null default uuid_generate_v4(),
  routine_id uuid not null,
  exercise_id uuid not null,
  sets integer not null,
  reps text not null,
  rpe integer null,
  rest_seconds integer null,
  notes text null,
  "order" integer not null default 0,
  constraint routine_exercises_pkey primary key (id),
  constraint routine_exercises_routine_id_fkey foreign key (routine_id) references public.routines (id) on delete cascade,
  constraint routine_exercises_exercise_id_fkey foreign key (exercise_id) references public.exercises (id)
);

-- RLS Policies (Row Level Security) - Updated for Anonymous Access
alter table public.gyms enable row level security;
alter table public.students enable row level security;
alter table public.exercises enable row level security;
alter table public.routines enable row level security;
alter table public.routine_exercises enable row level security;

-- Policy: Allow full access to everyone (public/anon) since we don't have login yet
-- IMPORTANT: In a production app with real users, you must add Authentication.
create policy "Allow all access to public" on public.gyms for all using (true);
create policy "Allow all access to public" on public.students for all using (true);
create policy "Allow all access to public" on public.exercises for all using (true);
create policy "Allow all access to public" on public.routines for all using (true);
create policy "Allow all access to public" on public.routine_exercises for all using (true);

-- Also allow public read access for now if needed, or stick to authenticated.
-- For simple usage without login yet, we might need anon access, but let's encourage login.
