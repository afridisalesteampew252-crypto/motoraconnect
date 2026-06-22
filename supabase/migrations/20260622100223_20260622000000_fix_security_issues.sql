-- Security fixes for is_admin and passcheck functions

-- ============================================================================
-- 1. Fix is_admin function: Add search_path and restrict execution
-- ============================================================================

-- Use CREATE OR REPLACE to update the function without dropping (preserves dependencies)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid());
$$;

-- Revoke execution from anon and public
REVOKE EXECUTE ON FUNCTION is_admin() FROM anon;
REVOKE EXECUTE ON FUNCTION is_admin() FROM public;

-- Grant execute only to authenticated role
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;

-- ============================================================================
-- 2. Fix passcheck function: Add search_path and restrict execution
-- ============================================================================

-- Update the function with secure search_path
CREATE OR REPLACE FUNCTION passcheck(username text, password text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Minimum length
  IF length(password) < 8 THEN
    RAISE EXCEPTION 'Password must be at least 8 characters long';
  END IF;

  -- Must contain at least one uppercase letter
  IF password !~ '[A-Z]' THEN
    RAISE EXCEPTION 'Password must contain at least one uppercase letter';
  END IF;

  -- Must contain at least one lowercase letter
  IF password !~ '[a-z]' THEN
    RAISE EXCEPTION 'Password must contain at least one lowercase letter';
  END IF;

  -- Must contain at least one digit
  IF password !~ '[0-9]' THEN
    RAISE EXCEPTION 'Password must contain at least one digit';
  END IF;

  -- Block very common compromised passwords
  IF lower(password) IN (
    'password1', 'password123', '123456789', '12345678',
    'qwerty123', 'iloveyou', 'sunshine1', 'football1',
    'password!', 'admin123', 'letmein1', 'welcome1',
    'monkey123', 'dragon1', 'master123', 'abc12345',
    'trustno1', 'princess1', 'passw0rd', 'shadow1'
  ) THEN
    RAISE EXCEPTION 'This password has been found in data breaches. Please choose a different password.';
  END IF;
END;
$$;

-- Revoke execution from anon - password checking should be internal only
REVOKE EXECUTE ON FUNCTION passcheck(text, text) FROM anon;
REVOKE EXECUTE ON FUNCTION passcheck(text, text) FROM public;
REVOKE EXECUTE ON FUNCTION passcheck(text, text) FROM authenticated;

-- ============================================================================
-- 3. Enable Supabase password protection
-- ============================================================================
-- Note: To fully enable leaked password protection, go to:
-- Supabase Dashboard > Authentication > Policies > Enable "Password strength confirmation"