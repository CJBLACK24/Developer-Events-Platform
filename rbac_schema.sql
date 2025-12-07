-- Create a "profiles" table to store extra user data like roles
-- This references the auth.users table which Supabase manages automatically

-- 1. Create Enum for Roles
CREATE TYPE user_role AS ENUM ('admin', 'organizer', 'attendee');

-- 2. Create Profiles Table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  role user_role DEFAULT 'attendee',
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable RLS on Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies for Profiles
-- Users can read their own profile
CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- 5. Auto-create Profile on Signup (Trigger)
-- This function runs every time a new user signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', 'attendee');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 6. Update Events Table for RBAC
-- Add organizer_id to link event to a specific user
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS organizer_id UUID REFERENCES auth.users(id);
-- Add is_approved for Admin approval workflow
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT FALSE;

-- 7. Update Event Policies
-- Only Approved events are visible to public (or if you are the organizer/admin)
DROP POLICY "Public events are viewable by everyone" ON public.events;

CREATE POLICY "Public Approved Events" 
  ON public.events FOR SELECT 
  USING (is_approved = true OR auth.uid() = organizer_id);

-- Only Organizers can Insert Events
CREATE POLICY "Organizers can create events" 
  ON public.events FOR INSERT 
  WITH CHECK (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and (profiles.role = 'organizer' OR profiles.role = 'admin')
    )
  );

-- Only Organizers (owner) or Admin can Update Events
CREATE POLICY "Organizers can update own events" 
  ON public.events FOR UPDATE
  USING (auth.uid() = organizer_id OR exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
  ));
