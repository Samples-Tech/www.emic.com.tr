import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, authService, UserProfile } from '../lib/supabase';

// Demo users for when Supabase is not configured
const demoUsers = [
  {
    id: 'demo-admin-1',
    email: 'admin@emic.test',
    password: 'admin123',
    profile: {
      id: 'demo-admin-1',
      email: 'admin@emic.test',
      role: 'admin' as const,
      organization_id: null,
      full_name: 'Admin User',
      phone: '+90 232 123 45 67',
      is_active: true,
      two_factor_enabled: false,
      last_login_at: new Date().toISOString(),
      created_at: '2024-01-01T10:00:00Z',
      updated_at: new Date().toISOString()
    }
  }
];

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        // Check if we have valid Supabase configuration
        const hasValidSupabase = import.meta.env.VITE_SUPABASE_URL && 
                                 import.meta.env.VITE_SUPABASE_ANON_KEY &&
                                 import.meta.env.VITE_SUPABASE_URL !== 'https://demo.supabase.co';

        if (hasValidSupabase) {
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
        } else {
          // Use demo mode
          setIsDemo(true);
          console.log('Using demo mode - Supabase not configured');
          
          // Check for demo login in localStorage
          const demoSession = localStorage.getItem('demo_session');
          if (demoSession) {
            const sessionData = JSON.parse(demoSession);
            const demoUser = demoUsers.find(u => u.email === sessionData.email);
            if (demoUser) {
              setUser({ id: demoUser.id, email: demoUser.email } as User);
              setProfile(demoUser.profile);
            }
          }
        }
      } catch (err: any) {
        console.error('Error getting session:', err);
        // Fallback to demo mode on error
        setIsDemo(true);
        console.log('Falling back to demo mode due to error:', err.message);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Only set up auth listener if not in demo mode
    if (!isDemo) {
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
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      if (isDemo) {
        // Demo authentication
        const demoUser = demoUsers.find(u => u.email === email && u.password === password);
        if (demoUser) {
          setUser({ id: demoUser.id, email: demoUser.email } as User);
          setProfile(demoUser.profile);
          localStorage.setItem('demo_session', JSON.stringify({ email, loginTime: new Date().toISOString() }));
          return { success: true, data: { user: { id: demoUser.id, email: demoUser.email } } };
        } else {
          setError('Geçersiz email veya şifre');
          return { success: false, error: 'Geçersiz email veya şifre' };
        }
      } else {
        const { data, error } = await authService.signIn(email, password);
        if (error) {
          setError(error.message);
          return { success: false, error: error.message };
        }
        return { success: true, data };
      }
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
      if (isDemo) {
        localStorage.removeItem('demo_session');
        setUser(null);
        setProfile(null);
        return { success: true };
      } else {
        const { error } = await authService.signOut();
        if (error) {
          setError(error.message);
          return { success: false, error: error.message };
        }
        return { success: true };
      }
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