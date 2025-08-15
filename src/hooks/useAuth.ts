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
  const [isDemo, setIsDemo] = useState(true); // Always use demo mode for now

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        // Always use demo mode for now
        setIsDemo(true);
        console.log('Using demo mode');
        
        // Check for demo login in localStorage
        const demoSession = localStorage.getItem('demo_session');
        if (demoSession) {
          const sessionData = JSON.parse(demoSession);
          
          // Check admin users first
          const adminUsers = JSON.parse(localStorage.getItem('emic_admin_users') || '[]');
          const adminUser = adminUsers.find((u: any) => u.email === sessionData.email && u.isActive);
          
          if (adminUser) {
            setUser({ id: adminUser.id, email: adminUser.email } as User);
            setProfile({
              id: adminUser.id,
              email: adminUser.email,
              role: adminUser.role,
              organization_id: adminUser.organizationId || null,
              full_name: adminUser.fullName,
              phone: adminUser.phone,
              is_active: adminUser.isActive,
              two_factor_enabled: false,
              last_login_at: new Date().toISOString(),
              created_at: adminUser.createdAt,
              updated_at: new Date().toISOString()
            });
            return;
          }
          
          // Check default demo users
          const demoUser = demoUsers.find(u => u.email === sessionData.email);
          if (demoUser) {
            setUser({ id: demoUser.id, email: demoUser.email } as User);
            setProfile(demoUser.profile);
            return;
          }
          
          // Check registered users
          const registeredUsers = JSON.parse(localStorage.getItem('demo_registered_users') || '[]');
          const registeredUser = registeredUsers.find((u: any) => u.email === sessionData.email && u.isActive);
          
          if (registeredUser) {
            setUser({ id: registeredUser.id, email: registeredUser.email } as User);
            setProfile({
              id: registeredUser.id,
              email: registeredUser.email,
              role: 'customer',
              organization_id: null,
              full_name: registeredUser.full_name,
              phone: registeredUser.phone,
              is_active: true,
              two_factor_enabled: false,
              last_login_at: new Date().toISOString(),
              created_at: registeredUser.createdAt,
              updated_at: new Date().toISOString()
            });
          }
        }
      } catch (err: any) {
        console.error('Error getting session:', err);
        setIsDemo(true);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();
  }, [isDemo]);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Always use demo authentication
      
      // Check admin users first
      const adminUsers = JSON.parse(localStorage.getItem('emic_admin_users') || '[]');
      const adminUser = adminUsers.find((u: any) => u.email === email && u.password === password && u.isActive);
      
      if (adminUser) {
        setUser({ id: adminUser.id, email: adminUser.email } as User);
        setProfile({
          id: adminUser.id,
          email: adminUser.email,
          role: adminUser.role,
          organization_id: adminUser.organizationId || null,
          full_name: adminUser.fullName,
          phone: adminUser.phone,
          is_active: adminUser.isActive,
          two_factor_enabled: false,
          last_login_at: new Date().toISOString(),
          created_at: adminUser.createdAt,
          updated_at: new Date().toISOString()
        });
        localStorage.setItem('demo_session', JSON.stringify({ email, loginTime: new Date().toISOString() }));
        return { success: true, data: { user: { id: adminUser.id, email: adminUser.email } } };
      }
      
      // Check default demo users
      const demoUser = demoUsers.find(u => u.email === email && u.password === password);
      if (demoUser) {
        setUser({ id: demoUser.id, email: demoUser.email } as User);
        setProfile(demoUser.profile);
        localStorage.setItem('demo_session', JSON.stringify({ email, loginTime: new Date().toISOString() }));
        return { success: true, data: { user: { id: demoUser.id, email: demoUser.email } } };
      }
      
      // Check registered users
      const registeredUsers = JSON.parse(localStorage.getItem('demo_registered_users') || '[]');
      const registeredUser = registeredUsers.find((u: any) => u.email === email && u.password === password && u.isActive);
      
      if (registeredUser) {
        setUser({ id: registeredUser.id, email: registeredUser.email } as User);
        setProfile({
          id: registeredUser.id,
          email: registeredUser.email,
          role: 'customer',
          organization_id: null,
          full_name: registeredUser.full_name,
          phone: registeredUser.phone,
          is_active: true,
          two_factor_enabled: false,
          last_login_at: new Date().toISOString(),
          created_at: registeredUser.createdAt,
          updated_at: new Date().toISOString()
        });
        localStorage.setItem('demo_session', JSON.stringify({ email, loginTime: new Date().toISOString() }));
        return { success: true, data: { user: { id: registeredUser.id, email: registeredUser.email } } };
      }
      
      setError('Geçersiz email veya şifre');
      return { success: false, error: 'Geçersiz email veya şifre' };
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
      // Demo mode - simulate user creation
      if (isDemo) {
        // Check if user already exists
        const existingUsers = JSON.parse(localStorage.getItem('demo_registered_users') || '[]');
        if (existingUsers.find((u: any) => u.email === email)) {
          setError('Bu e-posta adresi zaten kullanılıyor');
          return { success: false, error: 'Bu e-posta adresi zaten kullanılıyor' };
        }

        // Create new user
        const newUser = {
          id: Date.now().toString(),
          email,
          password, // In real app, this would be hashed
          ...userData,
          createdAt: new Date().toISOString(),
          isActive: true
        };

        existingUsers.push(newUser);
        localStorage.setItem('demo_registered_users', JSON.stringify(existingUsers));
        
        return { success: true, data: { user: newUser } };
      } else {
        const { data, error } = await authService.signUp(email, password, userData);
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

  const signOut = async () => {
    setLoading(true);
    try {
      localStorage.removeItem('demo_session');
      localStorage.removeItem('demo_customer_session');
      setUser(null);
      setProfile(null);
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