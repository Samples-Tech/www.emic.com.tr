import { useState, useEffect } from 'react';
import { organizationService, subscriptions, Organization } from '../lib/supabase';

export function useOrganizations() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const { data, error } = await organizationService.getOrganizations();
        if (error) {
          setError(error.message);
        } else {
          setOrganizations(data || []);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();

    // Subscribe to real-time changes
    const subscription = subscriptions.subscribeToOrganizations((payload) => {
      console.log('Organizations change:', payload);
      fetchOrganizations(); // Refetch data on changes
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const createOrganization = async (organization: Omit<Organization, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await organizationService.createOrganization(organization);
      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }
      
      // Refresh the list
      const { data: updatedData } = await organizationService.getOrganizations();
      setOrganizations(updatedData || []);
      
      return { success: true, data };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const updateOrganization = async (id: string, updates: Partial<Organization>) => {
    try {
      const { data, error } = await organizationService.updateOrganization(id, updates);
      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }
      
      // Update local state
      setOrganizations(prev => 
        prev.map(org => org.id === id ? { ...org, ...updates } : org)
      );
      
      return { success: true, data };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const deleteOrganization = async (id: string) => {
    try {
      const { error } = await organizationService.deleteOrganization(id);
      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }
      
      // Remove from local state
      setOrganizations(prev => prev.filter(org => org.id !== id));
      
      return { success: true };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  return {
    organizations,
    loading,
    error,
    createOrganization,
    updateOrganization,
    deleteOrganization,
    refetch: async () => {
      setLoading(true);
      const { data, error } = await organizationService.getOrganizations();
      if (error) {
        setError(error.message);
      } else {
        setOrganizations(data || []);
        setError(null);
      }
      setLoading(false);
    }
  };
}

export function useUserProfiles() {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const { data, error } = await userProfileService.getUserProfiles();
        if (error) {
          setError(error.message);
        } else {
          setProfiles(data || []);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();

    // Subscribe to real-time changes
    const subscription = subscriptions.subscribeToUserProfiles((payload) => {
      console.log('User profiles change:', payload);
      fetchProfiles(); // Refetch data on changes
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const updateProfile = async (id: string, updates: Partial<UserProfile>) => {
    try {
      const { data, error } = await userProfileService.updateUserProfile(id, updates);
      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }
      
      // Update local state
      setProfiles(prev => 
        prev.map(profile => profile.id === id ? { ...profile, ...updates } : profile)
      );
      
      return { success: true, data };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  return {
    profiles,
    loading,
    error,
    updateProfile,
    refetch: async () => {
      setLoading(true);
      const { data, error } = await userProfileService.getUserProfiles();
      if (error) {
        setError(error.message);
      } else {
        setProfiles(data || []);
        setError(null);
      }
      setLoading(false);
    }
  };
}