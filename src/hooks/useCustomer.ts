import { useState, useEffect } from 'react';
import { customerStore, Customer, Project, Document } from '../lib/customerStore';

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const updateCustomers = () => {
      setCustomers(customerStore.getCustomers());
      setLoading(false);
    };

    updateCustomers();
    const unsubscribe = customerStore.subscribe(updateCustomers);

    return unsubscribe;
  }, []);

  return { customers, loading };
}

export function useProjects(customerId?: string) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const updateProjects = () => {
      const allProjects = customerId 
        ? customerStore.getProjectsByCustomerId(customerId)
        : customerStore.getProjects();
      setProjects(allProjects);
      setLoading(false);
    };

    updateProjects();
    const unsubscribe = customerStore.subscribe(updateProjects);

    return unsubscribe;
  }, [customerId]);

  return { projects, loading };
}

export function useDocuments(customerId?: string, projectId?: string) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const updateDocuments = () => {
      let allDocuments: Document[];
      
      if (projectId) {
        allDocuments = customerStore.getDocumentsByProjectId(projectId);
      } else if (customerId) {
        allDocuments = customerStore.getDocumentsByCustomerId(customerId);
      } else {
        allDocuments = customerStore.getDocuments();
      }
      
      setDocuments(allDocuments);
      setLoading(false);
    };

    updateDocuments();
    const unsubscribe = customerStore.subscribe(updateDocuments);

    return unsubscribe;
  }, [customerId, projectId]);

  return { documents, loading };
}

export function useCustomerAuth() {
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const customerId = localStorage.getItem('currentCustomerId');
    if (customerId) {
      const customer = customerStore.getCustomerById(customerId);
      setCurrentCustomer(customer || null);
    }
    setLoading(false);
  }, []);

  const login = (email: string, password: string): boolean => {
    const customer = customerStore.authenticateCustomer(email, password);
    if (customer) {
      localStorage.setItem('currentCustomerId', customer.id);
      setCurrentCustomer(customer);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('currentCustomerId');
    setCurrentCustomer(null);
  };

  return { currentCustomer, login, logout, loading };
}