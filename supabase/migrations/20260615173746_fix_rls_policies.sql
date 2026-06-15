-- Drop overly permissive policies for vehicles
DROP POLICY IF EXISTS "vehicles_authenticated_insert" ON vehicles;
DROP POLICY IF EXISTS "vehicles_authenticated_update" ON vehicles;
DROP POLICY IF EXISTS "vehicles_authenticated_delete" ON vehicles;

-- Vehicles: only service role (which bypasses RLS) can modify content
-- No authenticated-user write policies needed; admin uses service role key
CREATE POLICY "vehicles_service_insert" ON vehicles FOR INSERT
  TO authenticated WITH CHECK (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "vehicles_service_update" ON vehicles FOR UPDATE
  TO authenticated USING (auth.jwt() ->> 'role' = 'service_role') WITH CHECK (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "vehicles_service_delete" ON vehicles FOR DELETE
  TO authenticated USING (auth.jwt() ->> 'role' = 'service_role');

-- Drop overly permissive policies for blog_posts
DROP POLICY IF EXISTS "blog_posts_authenticated_insert" ON blog_posts;
DROP POLICY IF EXISTS "blog_posts_authenticated_update" ON blog_posts;
DROP POLICY IF EXISTS "blog_posts_authenticated_delete" ON blog_posts;

-- Blog posts: only service role can modify content
CREATE POLICY "blog_posts_service_insert" ON blog_posts FOR INSERT
  TO authenticated WITH CHECK (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "blog_posts_service_update" ON blog_posts FOR UPDATE
  TO authenticated USING (auth.jwt() ->> 'role' = 'service_role') WITH CHECK (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "blog_posts_service_delete" ON blog_posts FOR DELETE
  TO authenticated USING (auth.jwt() ->> 'role' = 'service_role');

-- Drop overly permissive policies for consultations
DROP POLICY IF EXISTS "consultations_public_insert" ON consultations;
DROP POLICY IF EXISTS "consultations_authenticated_update" ON consultations;

-- Consultations: public can insert with required fields present
CREATE POLICY "consultations_public_insert" ON consultations FOR INSERT
  TO public WITH CHECK (
    name IS NOT NULL AND length(name) > 0
    AND email IS NOT NULL AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    AND package_type IS NOT NULL AND length(package_type) > 0
  );
-- Only service role can update consultations
CREATE POLICY "consultations_service_update" ON consultations FOR UPDATE
  TO authenticated USING (auth.jwt() ->> 'role' = 'service_role') WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Drop overly permissive policies for contacts
DROP POLICY IF EXISTS "contacts_public_insert" ON contacts;
DROP POLICY IF EXISTS "contacts_authenticated_update" ON contacts;

-- Contacts: public can insert with required fields present
CREATE POLICY "contacts_public_insert" ON contacts FOR INSERT
  TO public WITH CHECK (
    name IS NOT NULL AND length(name) > 0
    AND email IS NOT NULL AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    AND message IS NOT NULL AND length(message) > 0
  );
-- Only service role can update contacts
CREATE POLICY "contacts_service_update" ON contacts FOR UPDATE
  TO authenticated USING (auth.jwt() ->> 'role' = 'service_role') WITH CHECK (auth.jwt() ->> 'role' = 'service_role');
