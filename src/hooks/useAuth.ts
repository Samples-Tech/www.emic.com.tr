import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, authService, UserProfile } from '../lib/supabase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const { profile, error: profileError } = await authService.getCurrentUserProfile();
          if (profileError) {
            console.error('Error fetching profile:', profileError);
            setError(profileError.message);
          } else {
            setProfile(profile);
          }
        }
      } catch (err: any) {
        console.error('Error getting session:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const { profile, error: profileError } = await authService.getCurrentUserProfile();
          if (profileError) {
            console.error('Error fetching profile:', profileError);
            setError(profileError.message);
          } else {
            setProfile(profile);
            setError(null);
          }
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await authService.signIn(email, password);
      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }
      return { success: true, data };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData?: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await authService.signUp(email, password, userData);
      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }
      return { success: true, data };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await authService.signOut();
      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = profile?.role === 'admin';
  const isManager = profile?.role === 'manager';
  const isEditor = profile?.role === 'editor';
  const isCustomer = profile?.role === 'customer';

  return {
    user,
    profile,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    isAdmin,
    isManager,
    isEditor,
    isCustomer,
    isAuthenticated: !!user
  };
}