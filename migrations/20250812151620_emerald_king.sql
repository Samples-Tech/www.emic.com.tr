/*
  # Create customers table

  1. New Tables
    - `customers`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `password_hash` (text)
      - `company_name` (text)
      - `contact_person` (text)
      - `phone` (text)
      - `organization_id` (uuid, references organizations)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `customers` table
    - Add policies for admin access and customer self-access
    - Add trigger for updated_at

  3. Indexes
    - Index on email for fast lookups
    - Index on organization_id for filtering
    - Index on is_active for status filtering
</sql>

CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  company_name text NOT NULL,
  contact_person text NOT NULL,
  phone text,
  organization_id uuid REFERENCES organizations(id) ON DELETE SET NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Admins can manage all customers"
  ON customers
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Managers can view organization customers"
  ON customers
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role IN ('admin', 'manager')
      AND (
        user_profiles.organization_id = customers.organization_id 
        OR user_profiles.role = 'admin'
      )
    )
  );

CREATE POLICY "Customers can view their own data"
  ON customers
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.email = customers.email
    )
  );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_organization ON customers(organization_id);
CREATE INDEX IF NOT EXISTS idx_customers_active ON customers(is_active);

-- Trigger for updated_at
CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample customers
INSERT INTO customers (email, password_hash, company_name, contact_person, phone, organization_id) VALUES
('demo@abc.com', '$2a$10$dummy.hash.for.demo123', 'ABC Petrokimya A.Ş.', 'Ahmet Yılmaz', '+90 532 123 45 67', (SELECT id FROM organizations WHERE name = 'ABC Petrokimya A.Ş.' LIMIT 1)),
('test@xyz.com', '$2a$10$dummy.hash.for.test456', 'XYZ İnşaat Ltd. Şti.', 'Mehmet Demir', '+90 533 987 65 43', (SELECT id FROM organizations WHERE name = 'XYZ İnşaat Ltd. Şti.' LIMIT 1)),
('info@def.com', '$2a$10$dummy.hash.for.info789', 'DEF Enerji Sanayi A.Ş.', 'Ayşe Kaya', '+90 534 555 66 77', (SELECT id FROM organizations WHERE name = 'DEF Enerji Sanayi A.Ş.' LIMIT 1))
ON CONFLICT (email) DO NOTHING;