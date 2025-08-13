import { useState, useEffect } from 'react';
import { documentService, storageService, subscriptions, Document } from '../lib/supabase';
import { useAuth } from './useAuth';

export function useDocuments(filters?: {
  project_id?: string;
  customer_id?: string;
  organization_id?: string;
  document_type?: string;
  status?: string;
}) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const { data, error } = await documentService.getDocuments(filters);
        if (error) {
          setError(error.message);
        } else {
          setDocuments(data || []);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();

    // Subscribe to real-time changes
    const subscription = subscriptions.documents((payload) => {
      console.log('Documents change:', payload);
      fetchDocuments(); // Refetch data on changes
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [filters?.project_id, filters?.customer_id, filters?.organization_id, filters?.document_type, filters?.status]);

  const uploadDocument = async (
    file: File,
    documentData: Omit<Document, 'id' | 'file_path' | 'file_size' | 'mime_type' | 'created_at' | 'updated_at'>
  ) => {
    try {
      setLoading(true);
      setError(null);

      // Generate unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${documentData.project_id || 'general'}/${fileName}`;

      // Upload file to storage
      const { data: uploadData, error: uploadError } = await storageService.uploadFile(file, filePath);
      if (uploadError) {
        setError(uploadError.message);
        return { success: false, error: uploadError.message };
      }

      // Create document record
      const { data, error } = await documentService.createDocument({
        ...documentData,
        file_path: filePath,
        file_size: file.size,
        mime_type: file.type
      });

      if (error) {
        // Clean up uploaded file if document creation fails
        await storageService.deleteFile(filePath);
        setError(error.message);
        return { success: false, error: error.message };
      }

      // Refresh documents list
      const { data: updatedData } = await documentService.getDocuments(filters);
      setDocuments(updatedData || []);

      return { success: true, data };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateDocument = async (id: string, updates: Partial<Document>) => {
    try {
      const { data, error } = await documentService.updateDocument(id, updates);
      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }

      // Update local state
      setDocuments(prev => 
        prev.map(doc => doc.id === id ? { ...doc, ...updates } : doc)
      );

      return { success: true, data };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      const document = documents.find(doc => doc.id === id);
      if (!document) {
        return { success: false, error: 'Document not found' };
      }

      // Delete from database
      const { error: dbError } = await documentService.deleteDocument(id);
      if (dbError) {
        setError(dbError.message);
        return { success: false, error: dbError.message };
      }

      // Delete file from storage
      const { error: storageError } = await storageService.deleteFile(document.file_path);
      if (storageError) {
        console.warn('Failed to delete file from storage:', storageError);
      }

      // Update local state
      setDocuments(prev => prev.filter(doc => doc.id !== id));

      return { success: true };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const downloadDocument = async (document: Document) => {
    try {
      const { data, error } = await storageService.downloadFile(document.file_path);
      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }

      // Create download link
      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = document.name;
      link.click();
      URL.revokeObjectURL(url);

      return { success: true };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const getDocumentUrl = (document: Document) => {
    return storageService.getPublicUrl(document.file_path);
  };

  return {
    documents,
    loading,
    error,
    uploadDocument,
    updateDocument,
    deleteDocument,
    downloadDocument,
    getDocumentUrl,
    refetch: async () => {
      setLoading(true);
      const { data, error } = await documentService.getDocuments(filters);
      if (error) {
        setError(error.message);
      } else {
        setDocuments(data || []);
        setError(null);
      }
      setLoading(false);
    }
  };
}

export function useDocumentVersions(documentId: string) {
  const [versions, setVersions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVersions = async () => {
      if (!documentId) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await documentService.getDocumentVersions(documentId);
        if (error) {
          setError(error.message);
        } else {
          setVersions(data || []);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVersions();
  }, [documentId]);

  const createNewVersion = async (file: File) => {
    if (!documentId) return { success: false, error: 'No document ID provided' };

    try {
      setLoading(true);
      setError(null);

      const { user } = await supabase.auth.getUser();
      if (!user.data.user) {
        return { success: false, error: 'User not authenticated' };
      }

      // Generate unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `versions/${fileName}`;

      // Upload file to storage
      const { data: uploadData, error: uploadError } = await storageService.uploadFile(file, filePath);
      if (uploadError) {
        setError(uploadError.message);
        return { success: false, error: uploadError.message };
      }

      // Create new version
      const { data, error } = await documentService.createDocumentVersion(
        documentId,
        file.name,
        filePath,
        file.size,
        file.type,
        user.data.user.id
      );

      if (error) {
        // Clean up uploaded file if version creation fails
        await storageService.deleteFile(filePath);
        setError(error.message);
        return { success: false, error: error.message };
      }

      // Refresh versions list
      const { data: updatedVersions } = await documentService.getDocumentVersions(documentId);
      setVersions(updatedVersions || []);

      return { success: true, data };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    versions,
    loading,
    error,
    createNewVersion,
    refetch: async () => {
      if (!documentId) return;
      setLoading(true);
      const { data, error } = await documentService.getDocumentVersions(documentId);
      if (error) {
        setError(error.message);
      } else {
        setVersions(data || []);
        setError(null);
      }
      setLoading(false);
    }
  };
}