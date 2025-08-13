/*
  # Phase 4: Documents System Implementation

  1. New Tables
    - `documents`
      - `id` (uuid, primary key)
      - `name` (text, document name)
      - `description` (text, optional description)
      - `file_path` (text, Supabase Storage path)
      - `file_size` (bigint, file size in bytes)
      - `mime_type` (text, file MIME type)
      - `project_id` (uuid, foreign key to projects)
      - `customer_id` (uuid, foreign key to customers)
      - `organization_id` (uuid, foreign key to organizations)
      - `document_type` (text, report/certificate/image/other)
      - `method` (text, NDT method if applicable)
      - `report_number` (text, unique report identifier)
      - `version` (integer, document version)
      - `parent_document_id` (uuid, for versioning)
      - `status` (text, draft/final/archived)
      - `uploaded_by` (uuid, user who uploaded)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Storage
    - Create storage bucket for documents
    - Set up RLS policies for secure file access

  3. Security
    - Enable RLS on `documents` table
    - Add policies for customers to access their own documents
    - Add policies for admins to manage all documents
    - Add policies for organization managers to access organization documents

  4. Indexes
    - Add indexes for efficient querying by project, customer, organization
    - Add index for document versioning queries
*/

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  file_path text NOT NULL,
  file_size bigint NOT NULL DEFAULT 0,
  mime_type text NOT NULL,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  organization_id uuid REFERENCES organizations(id) ON DELETE SET NULL,
  document_type text NOT NULL DEFAULT 'other',
  method text,
  report_number text,
  version integer NOT NULL DEFAULT 1,
  parent_document_id uuid REFERENCES documents(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'draft',
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add constraints
ALTER TABLE documents ADD CONSTRAINT documents_document_type_check 
  CHECK (document_type IN ('report', 'certificate', 'image', 'video', 'other'));

ALTER TABLE documents ADD CONSTRAINT documents_status_check 
  CHECK (status IN ('draft', 'final', 'archived'));

ALTER TABLE documents ADD CONSTRAINT documents_version_check 
  CHECK (version > 0);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_documents_project_id ON documents(project_id);
CREATE INDEX IF NOT EXISTS idx_documents_customer_id ON documents(customer_id);
CREATE INDEX IF NOT EXISTS idx_documents_organization_id ON documents(organization_id);
CREATE INDEX IF NOT EXISTS idx_documents_document_type ON documents(document_type);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_documents_report_number ON documents(report_number);
CREATE INDEX IF NOT EXISTS idx_documents_parent_document ON documents(parent_document_id);
CREATE INDEX IF NOT EXISTS idx_documents_version ON documents(parent_document_id, version);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at);

-- Enable RLS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for documents
CREATE POLICY "Customers can view their own documents"
  ON documents
  FOR SELECT
  TO authenticated
  USING (
    customer_id IN (
      SELECT c.id FROM customers c 
      WHERE c.email = auth.jwt() ->> 'email'
    )
  );

CREATE POLICY "Organization managers can view organization documents"
  ON documents
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid()
      AND up.role IN ('admin', 'manager')
      AND (
        up.role = 'admin' OR 
        up.organization_id = documents.organization_id
      )
    )
  );

CREATE POLICY "Admins can manage all documents"
  ON documents
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid()
      AND up.role = 'admin'
    )
  );

CREATE POLICY "Managers can manage organization documents"
  ON documents
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid()
      AND up.role IN ('admin', 'manager')
      AND (
        up.role = 'admin' OR 
        up.organization_id = documents.organization_id
      )
    )
  );

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Authenticated users can upload documents"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Users can view documents they have access to"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'documents' AND (
      -- Admins can access all
      EXISTS (
        SELECT 1 FROM user_profiles up
        WHERE up.id = auth.uid() AND up.role = 'admin'
      ) OR
      -- Users can access documents from their organization
      EXISTS (
        SELECT 1 FROM documents d
        JOIN user_profiles up ON up.id = auth.uid()
        WHERE d.file_path = name
        AND (
          up.role = 'admin' OR
          d.organization_id = up.organization_id OR
          d.customer_id IN (
            SELECT c.id FROM customers c 
            WHERE c.email = auth.jwt() ->> 'email'
          )
        )
      )
    )
  );

CREATE POLICY "Users can update documents they uploaded"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'documents' AND (
      -- Admins can update all
      EXISTS (
        SELECT 1 FROM user_profiles up
        WHERE up.id = auth.uid() AND up.role = 'admin'
      ) OR
      -- Users can update documents they uploaded
      EXISTS (
        SELECT 1 FROM documents d
        WHERE d.file_path = name AND d.uploaded_by = auth.uid()
      )
    )
  );

CREATE POLICY "Users can delete documents they uploaded"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'documents' AND (
      -- Admins can delete all
      EXISTS (
        SELECT 1 FROM user_profiles up
        WHERE up.id = auth.uid() AND up.role = 'admin'
      ) OR
      -- Users can delete documents they uploaded
      EXISTS (
        SELECT 1 FROM documents d
        WHERE d.file_path = name AND d.uploaded_by = auth.uid()
      )
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to get document versions
CREATE OR REPLACE FUNCTION get_document_versions(doc_id uuid)
RETURNS TABLE (
  id uuid,
  version integer,
  name text,
  file_path text,
  file_size bigint,
  created_at timestamptz,
  uploaded_by uuid
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    d.id,
    d.version,
    d.name,
    d.file_path,
    d.file_size,
    d.created_at,
    d.uploaded_by
  FROM documents d
  WHERE d.id = doc_id OR d.parent_document_id = doc_id
  ORDER BY d.version DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to create new document version
CREATE OR REPLACE FUNCTION create_document_version(
  parent_id uuid,
  new_name text,
  new_file_path text,
  new_file_size bigint,
  new_mime_type text,
  uploader_id uuid
)
RETURNS uuid AS $$
DECLARE
  next_version integer;
  new_doc_id uuid;
BEGIN
  -- Get the next version number
  SELECT COALESCE(MAX(version), 0) + 1 INTO next_version
  FROM documents
  WHERE id = parent_id OR parent_document_id = parent_id;

  -- Create new document version
  INSERT INTO documents (
    name,
    file_path,
    file_size,
    mime_type,
    project_id,
    customer_id,
    organization_id,
    document_type,
    method,
    report_number,
    version,
    parent_document_id,
    status,
    uploaded_by
  )
  SELECT 
    new_name,
    new_file_path,
    new_file_size,
    new_mime_type,
    project_id,
    customer_id,
    organization_id,
    document_type,
    method,
    report_number,
    next_version,
    CASE 
      WHEN parent_document_id IS NULL THEN parent_id
      ELSE parent_document_id
    END,
    'draft',
    uploader_id
  FROM documents
  WHERE id = parent_id
  RETURNING id INTO new_doc_id;

  RETURN new_doc_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;