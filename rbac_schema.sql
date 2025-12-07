-- =====================================================
-- RBAC Schema for DevEvent Platform
-- Run this in Supabase SQL Editor
-- This script is IDEMPOTENT (safe to run multiple times)
-- =====================================================

-- 1. Create Enum for Roles (only if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('admin', 'organizer', 'attendee');
  END IF;
END $$;

-- 2. Create Profiles Table (only if not exists)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  role user_role DEFAULT 'attendee',
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable RLS on Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. Drop existing policies and recreate
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

-- Users can read their own profile
CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" 
  ON public.profiles FOR SELECT 
  USING (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- Users can update their own profile
CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Admins can update any profile
CREATE POLICY "Admins can update all profiles" 
  ON public.profiles FOR UPDATE 
  USING (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- 5. Auto-create Profile on Signup (Trigger)
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', 'attendee')
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- =====================================================
-- Events Table Updates for RBAC
-- =====================================================

-- 6. Add RBAC columns to Events Table
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS organizer_id UUID REFERENCES auth.users(id);
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT FALSE;

-- 7. Drop existing event policies and recreate
DROP POLICY IF EXISTS "Public events are viewable by everyone" ON public.events;
DROP POLICY IF EXISTS "Public Approved Events" ON public.events;
DROP POLICY IF EXISTS "Organizers can view own events" ON public.events;
DROP POLICY IF EXISTS "Admins can view all events" ON public.events;
DROP POLICY IF EXISTS "Organizers can create events" ON public.events;
DROP POLICY IF EXISTS "Organizers can update own events" ON public.events;
DROP POLICY IF EXISTS "Admins can update all events" ON public.events;

-- Public can view approved events
CREATE POLICY "Public Approved Events" 
  ON public.events FOR SELECT 
  USING (is_approved = true);

-- Organizers can view their own events (approved or not)
CREATE POLICY "Organizers can view own events" 
  ON public.events FOR SELECT 
  USING (auth.uid() = organizer_id);

-- Admins can view all events
CREATE POLICY "Admins can view all events" 
  ON public.events FOR SELECT 
  USING (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- Only Organizers/Admins can Insert Events
CREATE POLICY "Organizers can create events" 
  ON public.events FOR INSERT 
  WITH CHECK (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and (profiles.role = 'organizer' OR profiles.role = 'admin')
    )
  );

-- Organizers can update their own events
CREATE POLICY "Organizers can update own events" 
  ON public.events FOR UPDATE
  USING (auth.uid() = organizer_id);

-- Admins can update any event
CREATE POLICY "Admins can update all events" 
  ON public.events FOR UPDATE
  USING (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- =====================================================
-- Migration: Add avatar_url column if missing
-- =====================================================
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- =====================================================
-- DONE! Now make yourself an admin:
-- =====================================================
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'your-email@example.com';
