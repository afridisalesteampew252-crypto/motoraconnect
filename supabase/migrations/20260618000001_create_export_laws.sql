-- Export laws and regulations table
CREATE TABLE export_laws (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code TEXT NOT NULL UNIQUE,
  country_name TEXT NOT NULL,
  age_restriction TEXT,
  steering_side TEXT, -- 'LHD', 'RHD', 'Both'
  inspection_required TEXT,
  import_duties_description TEXT,
  other_regulations TEXT,
  last_updated TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE export_laws ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public can view export laws" ON export_laws
  FOR SELECT TO public USING (true);

CREATE POLICY "Admins can manage export laws" ON export_laws
  FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Seed some initial data
INSERT INTO export_laws (country_code, country_name, age_restriction, steering_side, inspection_required, import_duties_description)
VALUES 
('KEN', 'Kenya', 'Max 8 years from year of manufacture', 'RHD', 'QISJ / EAA Inspection', 'Approx 25% Import Duty + 25% Excise Duty + 16% VAT'),
('ZAM', 'Zambia', 'No age limit (higher taxes for older cars)', 'RHD', 'JEVIC Inspection', 'Based on engine capacity and vehicle type'),
('UGA', 'Uganda', 'Max 15 years from year of manufacture', 'RHD', 'JEVIC / EAA Inspection', 'Environmental levy applies to older vehicles'),
('NZL', 'New Zealand', 'Must meet ESC and emissions standards', 'RHD', 'Compliance inspection', '15% GST only for most passenger vehicles'),
('CYP', 'Cyprus', 'Max 5 years for passenger vehicles', 'RHD', 'DoRT Inspection', 'Based on CO2 emissions');
