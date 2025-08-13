import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-key';

// Only throw error in production if environment variables are missing
if (import.meta.env.PROD && (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY)) {
  console.warn('Supabase environment variables not configured. Using demo values.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface UserProfile {
  id: string;
  email: string;
  role: 'admin' | 'manager' | 'editor' | 'customer';
  organization_id?: string;
  full_name?: string;
  phone?: string;
  is_active: boolean;
  two_factor_enabled: boolean;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Organization {
  id: string;
  name: string;
  description?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  website?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  email: string;
  password_hash: string;
  company_name: string;
  contact_person: string;
  phone: string;
  organization_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  organization?: Organization;
}

export interface Project {
  id: string;
  code: string;
  name: string;
  description?: string;
  customer_id: string;
  organization_id?: string;
  status: 'active' | 'completed' | 'on_hold' | 'cancelled';
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
  customer?: Customer;
  organization?: Organization;
}

export interface Job {
  id: string;
  project_id: string;
  method: string;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  description?: string;
  assigned_to?: string;
  started_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  project?: Project;
}

export interface Document {
  id: string;
  name: string;
  description?: string;
  project_id?: string;
  customer_id?: string;
  organization_id?: string;
  document_type: 'report' | 'certificate' | 'image' | 'video' | 'other';
  file_path: string;
  file_size: number;
  mime_type: string;
  method?: string;
  report_number?: string;
  version: number;
  status: 'draft' | 'final' | 'archived';
  uploaded_by: string;
  created_at: string;
  updated_at: string;
  project?: Project;
  customer?: Customer;
  organization?: Organization;
}

export interface DocumentVersion {
  id: string;
  document_id: string;
  version: number;
  name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  uploaded_by: string;
  created_at: string;
}

// Auth Service
export const authService = {
  async signIn(email: string, password: string) {
    return await supabase.auth.signInWithPassword({ email, password });
  },

  async signUp(email: string, password: string, userData?: any) {
    return await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: userData
      }
    });
  },

  async signOut() {
    return await supabase.auth.signOut();
  },

  async getCurrentUserProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { profile: null, error: null };

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    return { profile: data, error };
  }
};

// Organization Service
export const organizationService = {
  async getOrganizations() {
    return await supabase
      .from('organizations')
      .select('*')
      .order('name');
  },

  async createOrganization(organization: Omit<Organization, 'id' | 'created_at' | 'updated_at'>) {
    return await supabase
      .from('organizations')
      .insert([organization])
      .select()
      .single();
  },

  async updateOrganization(id: string, updates: Partial<Organization>) {
    return await supabase
      .from('organizations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
  },

  async deleteOrganization(id: string) {
    return await supabase
      .from('organizations')
      .delete()
      .eq('id', id);
  }
};

// Customer Service
export const customerService = {
  async getCustomers() {
    return await supabase
      .from('customers')
      .select(`
        *,
        organization:organizations(*)
      `)
      .order('company_name');
  },

  async getCustomerById(id: string) {
    return await supabase
      .from('customers')
      .select(`
        *,
        organization:organizations(*)
      `)
      .eq('id', id)
      .single();
  },

  async getCustomerByEmail(email: string) {
    return await supabase
      .from('customers')
      .select(`
        *,
        organization:organizations(*)
      `)
      .eq('email', email)
      .single();
  },

  async createCustomer(customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) {
    return await supabase
      .from('customers')
      .insert([customer])
      .select()
      .single();
  },

  async updateCustomer(id: string, updates: Partial<Customer>) {
    return await supabase
      .from('customers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
  },

  async deleteCustomer(id: string) {
    return await supabase
      .from('customers')
      .delete()
      .eq('id', id);
  }
};

// Project Service
export const projectService = {
  async getProjects() {
    return await supabase
      .from('projects')
      .select(`
        *,
        customer:customers(*),
        organization:organizations(*)
      `)
      .order('created_at', { ascending: false });
  },

  async createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) {
    return await supabase
      .from('projects')
      .insert([project])
      .select()
      .single();
  },

  async updateProject(id: string, updates: Partial<Project>) {
    return await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
  },

  async deleteProject(id: string) {
    return await supabase
      .from('projects')
      .delete()
      .eq('id', id);
  }
};

// Job Service
export const jobService = {
  async getJobs() {
    return await supabase
      .from('jobs')
      .select(`
        *,
        project:projects(*)
      `)
      .order('created_at', { ascending: false });
  },

  async getJobsByProject(projectId: string) {
    return await supabase
      .from('jobs')
      .select(`
        *,
        project:projects(*)
      `)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
  },

  async createJob(job: Omit<Job, 'id' | 'created_at' | 'updated_at'>) {
    return await supabase
      .from('jobs')
      .insert([job])
      .select()
      .single();
  },

  async updateJob(id: string, updates: Partial<Job>) {
    return await supabase
      .from('jobs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
  },

  async deleteJob(id: string) {
    return await supabase
      .from('jobs')
      .delete()
      .eq('id', id);
  }
};

// Document Service
export const documentService = {
  async getDocuments(filters?: {
    project_id?: string;
    customer_id?: string;
    organization_id?: string;
    document_type?: string;
    status?: string;
  }) {
    let query = supabase
      .from('documents')
      .select(`
        *,
        project:projects(*),
        customer:customers(*),
        organization:organizations(*)
      `);

    if (filters?.project_id) {
      query = query.eq('project_id', filters.project_id);
    }
    if (filters?.customer_id) {
      query = query.eq('customer_id', filters.customer_id);
    }
    if (filters?.organization_id) {
      query = query.eq('organization_id', filters.organization_id);
    }
    if (filters?.document_type) {
      query = query.eq('document_type', filters.document_type);
    }
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    return await query.order('created_at', { ascending: false });
  },

  async createDocument(document: Omit<Document, 'id' | 'created_at' | 'updated_at'>) {
    return await supabase
      .from('documents')
      .insert([document])
      .select()
      .single();
  },

  async updateDocument(id: string, updates: Partial<Document>) {
    return await supabase
      .from('documents')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
  },

  async deleteDocument(id: string) {
    return await supabase
      .from('documents')
      .delete()
      .eq('id', id);
  },

  async getDocumentVersions(documentId: string) {
    return await supabase
      .from('document_versions')
      .select('*')
      .eq('document_id', documentId)
      .order('version', { ascending: false });
  },

  async createDocumentVersion(
    documentId: string,
    name: string,
    filePath: string,
    fileSize: number,
    mimeType: string,
    uploadedBy: string
  ) {
    // Get current max version
    const { data: versions } = await supabase
      .from('document_versions')
      .select('version')
      .eq('document_id', documentId)
      .order('version', { ascending: false })
      .limit(1);

    const nextVersion = versions && versions.length > 0 ? versions[0].version + 1 : 1;

    return await supabase
      .from('document_versions')
      .insert([{
        document_id: documentId,
        version: nextVersion,
        name,
        file_path: filePath,
        file_size: fileSize,
        mime_type: mimeType,
        uploaded_by: uploadedBy
      }])
      .select()
      .single();
  }
};

// Storage Service
export const storageService = {
  async uploadFile(file: File, path: string) {
    return await supabase.storage
      .from('documents')
      .upload(path, file);
  },

  async downloadFile(path: string) {
    return await supabase.storage
      .from('documents')
      .download(path);
  },

  async deleteFile(path: string) {
    return await supabase.storage
      .from('documents')
      .remove([path]);
  },

  getPublicUrl(path: string) {
    const { data } = supabase.storage
      .from('documents')
      .getPublicUrl(path);
    return data.publicUrl;
  }
};

// User Profile Service
export const userProfileService = {
  async getUserProfiles() {
    return await supabase
      .from('user_profiles')
      .select(`
        *,
        organization:organizations(*)
      `)
      .order('created_at', { ascending: false });
  },

  async updateUserProfile(id: string, updates: Partial<UserProfile>) {
    return await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
  }
};

// Real-time subscriptions
export const subscriptions = {
  subscribeToOrganizations(callback: (payload: any) => void) {
    return supabase
      .channel('organizations')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'organizations' }, callback)
      .subscribe();
  },

  subscribeToUserProfiles(callback: (payload: any) => void) {
    return supabase
      .channel('user_profiles')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_profiles' }, callback)
      .subscribe();
  },

  subscribeToCustomers(callback: (payload: any) => void) {
    return supabase
      .channel('customers')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'customers' }, callback)
      .subscribe();
  },

  subscribeToProjects(callback: (payload: any) => void) {
    return supabase
      .channel('projects')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, callback)
      .subscribe();
  },

  subscribeToJobs(callback: (payload: any) => void) {
    return supabase
      .channel('jobs')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'jobs' }, callback)
      .subscribe();
  },

  documents(callback: (payload: any) => void) {
    return supabase
      .channel('documents')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'documents' }, callback)
      .subscribe();
  }
};