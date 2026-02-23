-- Phase 3 Migration: Advanced Management Features
-- Idempotent Script: Can be run multiple times safely.

-- 1. Create Activity Types Table (Catálogo de actividades)
create table if not exists public.activity_types (
  id uuid not null default uuid_generate_v4(),
  name text not null,
  description text null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint activity_types_pkey primary key (id)
);

-- Safely add unique constraint if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'activity_types_name_key') THEN 
        ALTER TABLE public.activity_types ADD CONSTRAINT activity_types_name_key UNIQUE (name); 
    END IF; 
END $$;

-- Enable RLS for activity_types
alter table public.activity_types enable row level security;

-- Policy: Drop first to avoid "policy already exists" error
drop policy if exists "Enable all access for all users" on public.activity_types;
create policy "Enable all access for all users" on public.activity_types for all using (true) with check (true);

-- Seed initial Activity Types (Do nothing if they exist)
insert into public.activity_types (name, description) values
('Musculación', 'Entrenamiento de fuerza con pesas y máquinas'),
('Funcional', 'Ejercicios con peso corporal y movimientos naturales'),
('Cardio', 'Entrenamiento cardiovascular'),
('Spinning', 'Ciclismo indoor'),
('Yoga/Pilates', 'Flexibilidad y control corporal'),
('CrossFit', 'Entrenamiento de alta intensidad')
on conflict (name) do nothing;


-- 2. Alter Gyms Table (Add Branding)
alter table public.gyms 
add column if not exists logo_url text null;


-- 3. Alter Students Table (Add Health & Details)
alter table public.students
add column if not exists birth_date date null,
add column if not exists injuries text null, -- "Lesiones"
add column if not exists conditions text null, -- "Enfermedades/Condiciones"
add column if not exists observations text null;


-- 4. Alter Exercises Table (Add Media)
alter table public.exercises
add column if not exists video_url text null, -- URL to GIF/Video (Youtube/Lottie/Storage)
add column if not exists is_custom boolean default false; -- To distinguish built-in vs user-created


-- 5. Alter Routines Table (Add Context)
alter table public.routines
add column if not exists day_label text null, -- "Lunes", "Día 1", etc.
add column if not exists activity_type_id uuid references public.activity_types(id);


-- 6. Create Classes Table (Agenda)
create table if not exists public.classes (
  id uuid not null default uuid_generate_v4(),
  gym_id uuid not null references public.gyms(id),
  name text not null, -- "Clase de las 10am"
  day_of_week integer null, -- 0=Sunday, 1=Monday... (For fixed classes)
  time_start time not null,
  is_sporadic boolean default false,
  specific_date date null, -- For sporadic classes
  routine_id uuid null references public.routines(id), -- Optional: Link a routine to the class
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint classes_pkey primary key (id)
);

-- Enable RLS for classes
alter table public.classes enable row level security;

-- Policy
drop policy if exists "Enable all access for all users" on public.classes;
create policy "Enable all access for all users" on public.classes for all using (true) with check (true);
