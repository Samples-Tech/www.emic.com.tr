import { useState, useEffect } from 'react';
import { customerService, subscriptions, Customer } from '../lib/supabase';

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const { data, error } = await customerService.getCustomers();
        if (error) {
          setError(error.message);
        } else {
          setCustomers(data || []);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();

    // Subscribe to real-time changes
    const subscription = subscriptions.subscribeToCustomers((payload) => {
      console.log('Customers change:', payload);
      fetchCustomers(); // Refetch data on changes
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const createCustomer = async (customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await customerService.createCustomer(customer);
      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }
      
      // Refresh the list
      const { data: updatedData } = await customerService.getCustomers();
      setCustomers(updatedData || []);
      
      return { success: true, data };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const updateCustomer = async (id: string, updates: Partial<Customer>) => {
    try {
      const { data, error } = await customerService.updateCustomer(id, updates);
      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }
      
      // Update local state
      setCustomers(prev => 
        prev.map(customer => customer.id === id ? { ...customer, ...updates } : customer)
      );
      
      return { success: true, data };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const deleteCustomer = async (id: string) => {
    try {
      const { error } = await customerService.deleteCustomer(id);
      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }
      
      // Remove from local state
      setCustomers(prev => prev.filter(customer => customer.id !== id));
      
      return { success: true };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  return {
    customers,
    loading,
    error,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    refetch: async () => {
      setLoading(true);
      const { data, error } = await customerService.getCustomers();
      if (error) {
        setError(error.message);
      } else {
        setCustomers(data || []);
        setError(null);
      }
      setLoading(false);
    }
  };
}

export function useCustomerAuth() {
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const customerId = localStorage.getItem('currentCustomerId');
    if (customerId) {
      const fetchCustomer = async () => {
        try {
          const { data, error } = await customerService.getCustomerById(customerId);
          if (error) {
            setError(error.message);
            localStorage.removeItem('currentCustomerId');
          } else {
            setCurrentCustomer(data);
          }
        } catch (err: any) {
          setError(err.message);
          localStorage.removeItem('currentCustomerId');
        } finally {
          setLoading(false);
        }
      };
      fetchCustomer();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      setError(null);

      // Get customer by email
      const { data: customer, error } = await customerService.getCustomerByEmail(email);
      
      if (error || !customer) {
        setError('Geçersiz email veya şifre');
        return { success: false, error: 'Geçersiz email veya şifre' };
      }

      // In a real app, you would verify the password hash here
      // For demo purposes, we'll use simple password comparison
      const isPasswordValid = customer.password_hash.includes(password);
      
      if (!isPasswordValid) {
        setError('Geçersiz email veya şifre');
        return { success: false, error: 'Geçersiz email veya şifre' };
      }

      localStorage.setItem('currentCustomerId', customer.id);
      setCurrentCustomer(customer);
      return { success: true };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('currentCustomerId');
    setCurrentCustomer(null);
    setError(null);
  };

  return { 
    currentCustomer, 
    login, 
    logout, 
    loading, 
    error,
    isAuthenticated: !!currentCustomer 
  };
}