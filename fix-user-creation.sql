-- Fix user creation issue
-- Run this in your Supabase SQL Editor

-- 1. Create the trigger function to auto-create users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, username, full_name, plan, prompts_used, enhancements_used)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'free',
    0,
    0
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Fix the existing user manually
INSERT INTO public.users (id, email, username, full_name, plan, prompts_used, enhancements_used)
VALUES (
  '4e63de6c-cdba-49af-a196-ae80901f5fa6',
  (SELECT email FROM auth.users WHERE id = '4e63de6c-cdba-49af-a196-ae80901f5fa6'),
  'user_' || extract(epoch from now())::text,
  'User',
  'free',
  0,
  0
)
ON CONFLICT (id) DO NOTHING;

-- 4. Verify the user was created
SELECT * FROM public.users WHERE id = '4e63de6c-cdba-49af-a196-ae80901f5fa6';
