/*
  # Create projects and jobs tables

  1. New Tables
    - `projects`
      - `id` (uuid, primary key)
      - `code` (text, unique)
      - `name` (text)
      - `description` (text)
      - `customer_id` (uuid, references customers)
      - `organization_id` (uuid, references organizations)
      - `status` (enum: active, completed, on_hold, cancelled)
      - `start_date` (date)
      - `end_date` (date)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `jobs`
      - `id` (uuid, primary key)
      - `project_id` (uuid, references projects)
      - `method` (text)
      - `status` (enum: open, in_progress, completed, cancelled)
      - `description` (text)
      - `assigned_to` (uuid, references user_profiles)
      - `scheduled_date` (date)
      - `completed_date` (date)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for role-based access
    - Organization-based data isolation

  3. Indexes
    - Performance optimization for queries
    - Foreign key indexes
*/

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  organization_id uuid REFERENCES organizations(id) ON DELETE SET NULL,
  status text CHECK (status IN ('active', 'completed', 'on_hold', 'cancelled')) DEFAULT 'active',
  start_date date,
  end_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  method text NOT NULL,
  status text CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')) DEFAULT 'open',
  description text,
  assigned_to uuid REFERENCES user_profiles(id) ON DELETE SET NULL,
  scheduled_date date,
  completed_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_customer ON projects(customer_id);
CREATE INDEX IF NOT EXISTS idx_projects_organization ON projects(organization_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_code ON projects(code);

CREATE INDEX IF NOT EXISTS idx_jobs_project ON jobs(project_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_method ON jobs(method);
CREATE INDEX IF NOT EXISTS idx_jobs_assigned ON jobs(assigned_to);

-- RLS Policies for projects
CREATE POLICY "Admins can manage all projects"
  ON projects
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Organization managers can view organization projects"
  ON projects
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid()
      AND up.role IN ('admin', 'manager')
      AND (up.organization_id = projects.organization_id OR up.role = 'admin')
    )
  );

CREATE POLICY "Customers can view their own projects"
  ON projects
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers c
      WHERE c.id = projects.customer_id
      AND c.email = (
        SELECT email FROM user_profiles 
        WHERE id = auth.uid()
      )
    )
  );

-- RLS Policies for jobs
CREATE POLICY "Admins can manage all jobs"
  ON jobs
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Organization members can view organization jobs"
  ON jobs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      JOIN projects p ON p.id = jobs.project_id
      WHERE up.id = auth.uid()
      AND up.role IN ('admin', 'manager', 'editor')
      AND (up.organization_id = p.organization_id OR up.role = 'admin')
    )
  );

CREATE POLICY "Assigned users can update their jobs"
  ON jobs
  FOR UPDATE
  TO authenticated
  USING (assigned_to = auth.uid());

-- Create triggers for updated_at
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO projects (code, name, description, customer_id, organization_id, status, start_date) VALUES
('PRJ-2024-001', 'Petrokimya Tesisi Ana Hat Muayenesi', 'Ana hat borularının tahribatsız muayenesi', 
 (SELECT id FROM customers WHERE email = 'demo@abc.com' LIMIT 1),
 (SELECT id FROM organizations WHERE name = 'ABC Petrokimya A.Ş.' LIMIT 1),
 'active', '2024-01-15'),
('PRJ-2024-002', 'Köprü Yapısı NDT Kontrolü', 'Köprü çelik yapısının detaylı muayenesi',
 (SELECT id FROM customers WHERE email = 'test@xyz.com' LIMIT 1),
 (SELECT id FROM organizations WHERE name = 'XYZ İnşaat Ltd. Şti.' LIMIT 1),
 'completed', '2024-01-10'),
('PRJ-2024-003', 'Reaktör Basınç Testi', 'Reaktör basınç dayanım testleri',
 (SELECT id FROM customers WHERE email = 'demo@abc.com' LIMIT 1),
 (SELECT id FROM organizations WHERE name = 'ABC Petrokimya A.Ş.' LIMIT 1),
 'on_hold', '2024-01-20');

-- Insert sample jobs
INSERT INTO jobs (project_id, method, status, description, scheduled_date) VALUES
((SELECT id FROM projects WHERE code = 'PRJ-2024-001' LIMIT 1), 'UT', 'completed', 'Ultrasonik test muayenesi', '2024-01-16'),
((SELECT id FROM projects WHERE code = 'PRJ-2024-001' LIMIT 1), 'RT', 'in_progress', 'Radyografik test muayenesi', '2024-01-17'),
((SELECT id FROM projects WHERE code = 'PRJ-2024-002' LIMIT 1), 'PT', 'completed', 'Penetrant test muayenesi', '2024-01-12'),
((SELECT id FROM projects WHERE code = 'PRJ-2024-002' LIMIT 1), 'MT', 'completed', 'Manyetik parçacık testi', '2024-01-13'),
((SELECT id FROM projects WHERE code = 'PRJ-2024-003' LIMIT 1), 'VT', 'open', 'Görsel muayene', '2024-01-22');