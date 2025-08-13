/*
  # Organizations Table Setup

  1. New Tables
    - `organizations`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `description` (text, optional)
      - `contact_email` (text, optional)
      - `contact_phone` (text, optional)
      - `address` (text, optional)
      - `website` (text, optional)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `organizations` table
    - Add policy for authenticated users to read organizations
    - Add policy for admins to manage organizations

  3. Indexes
    - Index on name for faster searches
    - Index on is_active for filtering
*/

-- Create organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  contact_email text,
  contact_phone text,
  address text,
  website text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Organizations are viewable by authenticated users"
  ON organizations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Organizations are manageable by admins"
  ON organizations
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_organizations_name ON organizations(name);
CREATE INDEX IF NOT EXISTS idx_organizations_active ON organizations(is_active);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default organizations
INSERT INTO organizations (name, description, contact_email, is_active) VALUES
  ('ABC Petrokimya A.Ş.', 'Petrokimya sektöründe faaliyet gösteren firma', 'info@abc.com', true),
  ('XYZ İnşaat Ltd. Şti.', 'İnşaat ve yapı sektöründe hizmet veren firma', 'info@xyz.com', true),
  ('DEF Enerji Sanayi A.Ş.', 'Enerji sektöründe faaliyet gösteren firma', 'info@def.com', true),
  ('GHI Makina İmalat', 'Makina imalat sektöründe hizmet veren firma', 'info@ghi.com', true)
ON CONFLICT (name) DO NOTHING;