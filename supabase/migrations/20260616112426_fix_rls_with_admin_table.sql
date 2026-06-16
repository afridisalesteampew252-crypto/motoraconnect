-- Admin users table: only users in this table can perform admin CRUD
CREATE TABLE admins (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Anyone can check if they are admin (needed for UI), but only admins can see other admins
CREATE POLICY "admins_self_select" ON admins FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid());
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Replace overly permissive policies with admin-gated policies

-- Vehicles
DROP POLICY IF EXISTS "vehicles_authenticated_insert" ON vehicles;
DROP POLICY IF EXISTS "vehicles_authenticated_update" ON vehicles;
DROP POLICY IF EXISTS "vehicles_authenticated_delete" ON vehicles;

CREATE POLICY "vehicles_admin_insert" ON vehicles FOR INSERT
  TO authenticated WITH CHECK (is_admin());
CREATE POLICY "vehicles_admin_update" ON vehicles FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "vehicles_admin_delete" ON vehicles FOR DELETE
  TO authenticated USING (is_admin());

-- Blog posts
DROP POLICY IF EXISTS "blog_posts_authenticated_insert" ON blog_posts;
DROP POLICY IF EXISTS "blog_posts_authenticated_update" ON blog_posts;
DROP POLICY IF EXISTS "blog_posts_authenticated_delete" ON blog_posts;
-- Also fix the authenticated select which was USING(true)
DROP POLICY IF EXISTS "blog_posts_authenticated_select" ON blog_posts;

CREATE POLICY "blog_posts_admin_select" ON blog_posts FOR SELECT
  TO authenticated USING (is_admin());
CREATE POLICY "blog_posts_admin_insert" ON blog_posts FOR INSERT
  TO authenticated WITH CHECK (is_admin());
CREATE POLICY "blog_posts_admin_update" ON blog_posts FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "blog_posts_admin_delete" ON blog_posts FOR DELETE
  TO authenticated USING (is_admin());

-- Consultations
DROP POLICY IF EXISTS "consultations_authenticated_update" ON consultations;
-- Also fix the authenticated select
DROP POLICY IF EXISTS "consultations_authenticated_select" ON consultations;

CREATE POLICY "consultations_admin_select" ON consultations FOR SELECT
  TO authenticated USING (is_admin());
CREATE POLICY "consultations_admin_update" ON consultations FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- Contacts
DROP POLICY IF EXISTS "contacts_authenticated_delete" ON contacts;
-- Also fix the authenticated select
DROP POLICY IF EXISTS "contacts_authenticated_select" ON contacts;

CREATE POLICY "contacts_admin_select" ON contacts FOR SELECT
  TO authenticated USING (is_admin());
CREATE POLICY "contacts_admin_delete" ON contacts FOR DELETE
  TO authenticated USING (is_admin());
