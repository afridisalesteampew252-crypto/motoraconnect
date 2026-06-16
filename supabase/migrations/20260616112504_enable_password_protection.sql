-- Enable pg_tle extension for password checking
CREATE EXTENSION IF NOT EXISTS pg_tle;

-- Create the passcheck function that rejects weak/compromised passwords
CREATE OR REPLACE FUNCTION passcheck(username text, password text)
RETURNS void AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Register the passcheck hook with pg_tle
SELECT pgtle.install_extension('passcheck', '1.0', 'Password strength checker', '{"passcheck"}');
