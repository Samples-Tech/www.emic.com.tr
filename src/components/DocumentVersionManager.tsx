import React, { useState } from 'react';
import { useDocumentVersions } from '../hooks/useDocuments';
import {
  DocumentIcon,
  CloudArrowUpIcon,
  ClockIcon,
  UserIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  TagIcon
} from '@heroicons/react/24/outline';

interface DocumentVersionManagerProps {
  documentId: string;
  documentName: string;
  onClose: () => void;
}

const DocumentVersionManager: React.FC<DocumentVersionManagerProps> = ({
  documentId,
  documentName,
  onClose
}) => {
  const { versions, loading, error, createNewVersion } = useDocumentVersions(documentId);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const result = await createNewVersion(file);
      if (!result.success) {
        setUploadError(result.error || 'Yeni versiyon oluşturulamadı');
      }
    } catch (error: any) {
      setUploadError(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <DocumentIcon className="w-8 h-8 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Belge Versiyonları</h2>
              <p className="text-gray-600">{documentName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Upload New Version */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Yeni Versiyon Yükle</h3>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
                <CloudArrowUpIcon className="w-5 h-5" />
                <span>{isUploading ? 'Yükleniyor...' : 'Dosya Seç'}</span>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>
              <span className="text-sm text-blue-700">
                Aynı belgenin yeni versiyonunu yükleyin
              </span>
            </div>
            {uploadError && (
              <div className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
                {uploadError}
              </div>
            )}
          </div>

          {/* Versions List */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">Mevcut Versiyonlar</h3>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Versiyonlar yükleniyor...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-600">{error}</p>
              </div>
            ) : versions.length > 0 ? (
              <div className="space-y-2">
                {versions.map((version, index) => (
                  <div key={version.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <TagIcon className="w-5 h-5 text-gray-400" />
                        <span className={`text-sm font-medium px-2 py-1 rounded ${
                          index === 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                          v{version.version} {index === 0 && '(Güncel)'}
                        </span>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900">{version.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>{formatFileSize(version.file_size)}</span>
                          <div className="flex items-center space-x-1">
                            <ClockIcon className="w-4 h-4" />
                            <span>{formatDate(version.created_at)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <UserIcon className="w-4 h-4" />
                            <span>Yükleyen: {version.uploaded_by}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          // In a real app, this would open the document
                          console.log('Viewing document version:', version.id);
                        }}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Görüntüle"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          // In a real app, this would download the document
                          console.log('Downloading document version:', version.id);
                        }}
                        className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                        title="İndir"
                      >
                        <ArrowDownTrayIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <DocumentIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Bu belge için henüz versiyon bulunmuyor.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentVersionManager;