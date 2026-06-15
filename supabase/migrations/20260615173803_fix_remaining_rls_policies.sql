-- Fix consultations_authenticated_select: only service role can read
DROP POLICY IF EXISTS "consultations_authenticated_select" ON consultations;
CREATE POLICY "consultations_service_select" ON consultations FOR SELECT
  TO authenticated USING (auth.jwt() ->> 'role' = 'service_role');

-- Fix contacts_authenticated_select: only service role can read
DROP POLICY IF EXISTS "contacts_authenticated_select" ON contacts;
CREATE POLICY "contacts_service_select" ON contacts FOR SELECT
  TO authenticated USING (auth.jwt() ->> 'role' = 'service_role');

-- Also fix vehicles_public_select: this is intentional (public read), 
-- but let's ensure it only returns published data if needed.
-- Vehicles are intentionally public-readable (that's the business model), so this stays.
