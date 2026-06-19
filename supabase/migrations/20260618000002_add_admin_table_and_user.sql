-- Create admins table if not exists
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Admin policies
CREATE POLICY "Admins can view admins" ON admins FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())
);

-- Add is_admin column to profiles if not exists
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='is_admin') THEN
    ALTER TABLE profiles ADD COLUMN is_admin BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Instructions for the user:
-- To create an admin user, please use the Signup page on the website.
-- Once created, you can run the following SQL in the Supabase Dashboard SQL Editor:
-- 
-- INSERT INTO admins (user_id) 
-- SELECT id FROM auth.users WHERE email = 'your-email@example.com';
-- 
-- UPDATE profiles SET is_admin = true WHERE email = 'your-email@example.com';
