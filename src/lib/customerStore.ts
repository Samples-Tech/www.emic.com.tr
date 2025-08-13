interface Customer {
  id: string;
  email: string;
  password: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  organizationId: string;
  createdAt: string;
  isActive: boolean;
}

interface Project {
  id: string;
  code: string;
  name: string;
  customerId: string;
  organizationId: string;
  status: 'active' | 'completed' | 'on-hold';
  createdAt: string;
  description?: string;
}

interface Document {
  id: string;
  name: string;
  type: 'report' | 'certificate' | 'image' | 'other';
  projectId: string;
  customerId: string;
  fileUrl: string;
  fileSize: number;
  uploadedAt: string;
  method?: string;
  reportNumber?: string;
  revision?: string;
  description?: string;
}

// Default data
const defaultCustomers: Customer[] = [
  {
    id: '1',
    email: 'demo@abc.com',
    password: 'demo123',
    companyName: 'ABC Petrokimya A.Ş.',
    contactPerson: 'Ahmet Yılmaz',
    phone: '+90 532 123 45 67',
    organizationId: '1',
    createdAt: '2024-01-01T10:00:00Z',
    isActive: true
  },
  {
    id: '2',
    email: 'test@xyz.com',
    password: 'test456',
    companyName: 'XYZ İnşaat Ltd. Şti.',
    contactPerson: 'Mehmet Demir',
    phone: '+90 533 987 65 43',
    organizationId: '2',
    createdAt: '2024-01-02T11:00:00Z',
    isActive: true
  }
];

const defaultProjects: Project[] = [
  {
    id: '1',
    code: 'PRJ-2024-001',
    name: 'Petrokimya Tesisi Ana Hat Muayenesi',
    customerId: '1',
    organizationId: '1',
    status: 'active',
    createdAt: '2024-01-15T10:30:00Z',
    description: 'Ana hat borularının tahribatsız muayenesi'
  },
  {
    id: '2',
    code: 'PRJ-2024-002',
    name: 'Köprü Yapısı NDT Kontrolü',
    customerId: '2',
    organizationId: '2',
    status: 'completed',
    createdAt: '2024-01-10T14:20:00Z',
    description: 'Köprü çelik yapısının detaylı muayenesi'
  },
  {
    id: '3',
    code: 'PRJ-2024-003',
    name: 'Reaktör Basınç Testi',
    customerId: '1',
    organizationId: '1',
    status: 'on-hold',
    createdAt: '2024-01-20T09:15:00Z',
    description: 'Reaktör basınç dayanım testleri'
  }
];

const defaultDocuments: Document[] = [
  {
    id: '1',
    name: 'UT Muayene Raporu - Ana Hat',
    type: 'report',
    projectId: '1',
    customerId: '1',
    fileUrl: '/documents/ut-report-001.pdf',
    fileSize: 2048576,
    uploadedAt: '2024-01-16T10:30:00Z',
    method: 'UT',
    reportNumber: 'EMIC-UT-2024-001',
    revision: 'Rev.0',
    description: 'Ana hat borularının ultrasonik muayene raporu'
  },
  {
    id: '2',
    name: 'RT Muayene Raporu - Kaynak Dikişleri',
    type: 'report',
    projectId: '1',
    customerId: '1',
    fileUrl: '/documents/rt-report-001.pdf',
    fileSize: 3145728,
    uploadedAt: '2024-01-17T14:20:00Z',
    method: 'RT',
    reportNumber: 'EMIC-RT-2024-001',
    revision: 'Rev.0',
    description: 'Kaynak dikişlerinin radyografik muayene raporu'
  },
  {
    id: '3',
    name: 'Muayene Sertifikası',
    type: 'certificate',
    projectId: '2',
    customerId: '2',
    fileUrl: '/documents/certificate-002.pdf',
    fileSize: 1048576,
    uploadedAt: '2024-01-12T16:45:00Z',
    reportNumber: 'EMIC-CERT-2024-002',
    description: 'Köprü yapısı muayene sertifikası'
  },
  {
    id: '4',
    name: 'Muayene Fotoğrafları',
    type: 'image',
    projectId: '1',
    customerId: '1',
    fileUrl: '/documents/inspection-photos-001.zip',
    fileSize: 5242880,
    uploadedAt: '2024-01-18T11:30:00Z',
    description: 'Muayene sırasında çekilen fotoğraflar'
  }
];

class CustomerStore {
  private customers: Customer[] = [];
  private projects: Project[] = [];
  private documents: Document[] = [];
  private listeners: (() => void)[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const storedCustomers = localStorage.getItem('emic_customers');
      const storedProjects = localStorage.getItem('emic_projects');
      const storedDocuments = localStorage.getItem('emic_documents');
      
      this.customers = storedCustomers ? JSON.parse(storedCustomers) : defaultCustomers;
      this.projects = storedProjects ? JSON.parse(storedProjects) : defaultProjects;
      this.documents = storedDocuments ? JSON.parse(storedDocuments) : defaultDocuments;
    } catch (error) {
      console.error('Error loading from storage:', error);
      this.customers = defaultCustomers;
      this.projects = defaultProjects;
      this.documents = defaultDocuments;
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('emic_customers', JSON.stringify(this.customers));
      localStorage.setItem('emic_projects', JSON.stringify(this.projects));
      localStorage.setItem('emic_documents', JSON.stringify(this.documents));
      this.notifyListeners();
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  // Customer methods
  getCustomers(): Customer[] {
    return [...this.customers];
  }

  getCustomerById(id: string): Customer | undefined {
    return this.customers.find(customer => customer.id === id);
  }

  authenticateCustomer(email: string, password: string): Customer | null {
    const customer = this.customers.find(c => c.email === email && c.password === password && c.isActive);
    return customer || null;
  }

  addCustomer(customer: Omit<Customer, 'id' | 'createdAt'>): Customer {
    const newCustomer: Customer = {
      ...customer,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    this.customers.push(newCustomer);
    this.saveToStorage();
    return newCustomer;
  }

  updateCustomer(id: string, updates: Partial<Customer>): Customer | null {
    const index = this.customers.findIndex(customer => customer.id === id);
    if (index === -1) return null;
    
    this.customers[index] = { ...this.customers[index], ...updates };
    this.saveToStorage();
    return this.customers[index];
  }

  deleteCustomer(id: string): boolean {
    const index = this.customers.findIndex(customer => customer.id === id);
    if (index === -1) return false;
    
    this.customers.splice(index, 1);
    this.saveToStorage();
    return true;
  }

  // Project methods
  getProjects(): Project[] {
    return [...this.projects];
  }

  getProjectsByCustomerId(customerId: string): Project[] {
    return this.projects.filter(project => project.customerId === customerId);
  }

  getProjectById(id: string): Project | undefined {
    return this.projects.find(project => project.id === id);
  }

  addProject(project: Omit<Project, 'id' | 'createdAt'>): Project {
    const newProject: Project = {
      ...project,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    this.projects.push(newProject);
    this.saveToStorage();
    return newProject;
  }

  updateProject(id: string, updates: Partial<Project>): Project | null {
    const index = this.projects.findIndex(project => project.id === id);
    if (index === -1) return null;
    
    this.projects[index] = { ...this.projects[index], ...updates };
    this.saveToStorage();
    return this.projects[index];
  }

  deleteProject(id: string): boolean {
    const index = this.projects.findIndex(project => project.id === id);
    if (index === -1) return false;
    
    this.projects.splice(index, 1);
    this.saveToStorage();
    return true;
  }

  // Document methods
  getDocuments(): Document[] {
    return [...this.documents];
  }

  getDocumentsByCustomerId(customerId: string): Document[] {
    return this.documents.filter(document => document.customerId === customerId);
  }

  getDocumentsByProjectId(projectId: string): Document[] {
    return this.documents.filter(document => document.projectId === projectId);
  }

  getDocumentById(id: string): Document | undefined {
    return this.documents.find(document => document.id === id);
  }

  addDocument(document: Omit<Document, 'id' | 'uploadedAt'>): Document {
    const newDocument: Document = {
      ...document,
      id: Date.now().toString(),
      uploadedAt: new Date().toISOString()
    };
    
    this.documents.push(newDocument);
    this.saveToStorage();
    return newDocument;
  }

  updateDocument(id: string, updates: Partial<Document>): Document | null {
    const index = this.documents.findIndex(document => document.id === id);
    if (index === -1) return null;
    
    this.documents[index] = { ...this.documents[index], ...updates };
    this.saveToStorage();
    return this.documents[index];
  }

  deleteDocument(id: string): boolean {
    const index = this.documents.findIndex(document => document.id === id);
    if (index === -1) return false;
    
    this.documents.splice(index, 1);
    this.saveToStorage();
    return true;
  }

  // Subscription methods
  subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }
}

// Create singleton instance
export const customerStore = new CustomerStore();
export type { Customer, Project, Document };