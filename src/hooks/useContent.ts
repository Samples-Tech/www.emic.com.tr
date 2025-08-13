import { useState, useEffect } from 'react';
import { contentStore } from '../lib/contentStore';

// Define types locally to avoid circular imports
interface ContentItem {
  id: string;
  type: 'hero' | 'service' | 'page' | 'news';
  title: string;
  titleEn: string;
  content: string;
  contentEn: string;
  slug: string;
  status: 'published' | 'draft';
  createdAt: string;
  updatedAt: string;
  image?: string;
  order?: number;
}

interface SiteSettings {
  siteName: string;
  siteNameEn: string;
  tagline: string;
  taglineEn: string;
  description: string;
  descriptionEn: string;
  logo: string;
  logoAlt: string;
  phone: string;
  email: string;
  address: string;
  addressEn: string;
  workingHours: string;
  workingHoursEn: string;
  socialMedia: {
    linkedin: string;
    twitter: string;
    facebook: string;
    instagram: string;
    youtube: string;
  };
  seo: {
    metaTitle: string;
    metaTitleEn: string;
    metaDescription: string;
    metaDescriptionEn: string;
    keywords: string;
    keywordsEn: string;
  };
  features: {
    multiLanguage: boolean;
    twoFactorAuth: boolean;
    emailNotifications: boolean;
    maintenanceMode: boolean;
  };
  documents: {
    privacyDeclarationUrl: string;
    privacyDeclarationVersion: string;
    privacyDeclarationDate: string;
  };
  references: Reference[];
}

interface Reference {
  id: string;
  name: string;
  nameEn: string;
  logo: string;
  website?: string;
  sector: string;
  sectorEn: string;
  description?: string;
  descriptionEn?: string;
  order: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

// Custom hook for content management
export const useContent = (type?: string, status: 'published' | 'draft' | 'all' = 'published') => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = () => {
      setLoading(true);
      const data = contentStore.getContent(type, status);
      setContent(data);
      setLoading(false);
    };

    // Initial load
    loadContent();

    // Subscribe to changes
    const unsubscribe = contentStore.subscribe(loadContent);

    return unsubscribe;
  }, [type, status]);

  return { content, loading };
};

// Custom hook for site settings
export const useSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>(contentStore.getSettings());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadSettings = () => {
      const data = contentStore.getSettings();
      setSettings(data);
    };

    // Subscribe to changes
    const unsubscribe = contentStore.subscribe(loadSettings);

    return unsubscribe;
  }, []);

  const updateSettings = async (updates: Partial<SiteSettings>) => {
    setLoading(true);
    try {
      const updatedSettings = contentStore.updateSettings(updates);
      setSettings(updatedSettings);
    } finally {
      setLoading(false);
    }
  };

  return { settings, loading, updateSettings };
};

// Custom hook for references management
export const useReferences = (status: 'active' | 'inactive' | 'all' = 'active') => {
  const [references, setReferences] = useState<Reference[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReferences = () => {
      setLoading(true);
      const settings = contentStore.getSettings();
      let refs = settings.references || [];
      
      if (status !== 'all') {
        refs = refs.filter(ref => ref.status === status);
      }
      
      // Sort by order
      refs = refs.sort((a, b) => (a.order || 0) - (b.order || 0));
      
      setReferences(refs);
      setLoading(false);
    };

    // Initial load
    loadReferences();

    // Subscribe to changes
    const unsubscribe = contentStore.subscribe(loadReferences);

    return unsubscribe;
  }, [status]);

  return { references, loading };
};