-- Fix for Supabase error: "Database error saving new user"
-- Run this in Supabase SQL Editor on existing projects.

BEGIN;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, phone, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', NEW.raw_user_meta_data->>'firstName'),
    COALESCE(NEW.raw_user_meta_data->>'last_name', NEW.raw_user_meta_data->>'lastName'),
    NEW.raw_user_meta_data->>'phone',
    CASE
      WHEN NEW.raw_user_meta_data->>'role' IN ('user', 'admin') THEN NEW.raw_user_meta_data->>'role'
      ELSE 'user'
    END
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    first_name = COALESCE(EXCLUDED.first_name, public.profiles.first_name),
    last_name = COALESCE(EXCLUDED.last_name, public.profiles.last_name),
    phone = COALESCE(EXCLUDED.phone, public.profiles.phone),
    role = COALESCE(EXCLUDED.role, public.profiles.role);

  RETURN NEW;
END;
$$;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO supabase_auth_admin;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Backfill users that were created in auth.users but missing in profiles.
INSERT INTO public.profiles (id, email, first_name, last_name, phone, role)
SELECT
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'first_name', u.raw_user_meta_data->>'firstName'),
  COALESCE(u.raw_user_meta_data->>'last_name', u.raw_user_meta_data->>'lastName'),
  u.raw_user_meta_data->>'phone',
  CASE
    WHEN u.raw_user_meta_data->>'role' IN ('user', 'admin') THEN u.raw_user_meta_data->>'role'
    ELSE 'user'
  END
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL;

COMMIT;
