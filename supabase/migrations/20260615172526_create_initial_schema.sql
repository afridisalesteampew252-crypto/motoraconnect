-- Vehicle listings table
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  body_type TEXT,
  engine_cc INTEGER,
  transmission TEXT,
  fuel_type TEXT,
  drive_type TEXT,
  mileage_km INTEGER,
  auction_grade TEXT,
  estimated_price_jpy NUMERIC,
  estimated_price_usd NUMERIC,
  image_url TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Blog posts table
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  category TEXT,
  image_url TEXT,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Consultation bookings table
CREATE TABLE consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  country TEXT,
  vehicle_interest TEXT,
  budget_range TEXT,
  message TEXT,
  package_type TEXT NOT NULL DEFAULT 'basic',
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Contact messages table
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Vehicles: public read, authenticated write
CREATE POLICY "vehicles_public_select" ON vehicles FOR SELECT TO public USING (true);
CREATE POLICY "vehicles_authenticated_insert" ON vehicles FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "vehicles_authenticated_update" ON vehicles FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "vehicles_authenticated_delete" ON vehicles FOR DELETE TO authenticated USING (true);

-- Blog posts: published posts public read, authenticated full access
CREATE POLICY "blog_posts_public_select" ON blog_posts FOR SELECT TO public USING (published = true);
CREATE POLICY "blog_posts_authenticated_insert" ON blog_posts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "blog_posts_authenticated_update" ON blog_posts FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "blog_posts_authenticated_delete" ON blog_posts FOR DELETE TO authenticated USING (true);

-- Consultations: anyone can insert, only authenticated can read
CREATE POLICY "consultations_public_insert" ON consultations FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "consultations_authenticated_select" ON consultations FOR SELECT TO authenticated USING (true);
CREATE POLICY "consultations_authenticated_update" ON consultations FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Contacts: anyone can insert, only authenticated can read
CREATE POLICY "contacts_public_insert" ON contacts FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "contacts_authenticated_select" ON contacts FOR SELECT TO authenticated USING (true);
CREATE POLICY "contacts_authenticated_update" ON contacts FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
