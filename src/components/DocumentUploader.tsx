import React, { useState, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useDocuments } from '../hooks/useDocuments';
import {
  CloudArrowUpIcon,
  DocumentIcon,
  PhotoIcon,
  FilmIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface DocumentUploaderProps {
  projectId?: string;
  customerId?: string;
  organizationId?: string;
  onUploadComplete?: (document: any) => void;
  acceptedTypes?: string;
  maxSize?: number; // in MB
  multiple?: boolean;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  projectId,
  customerId,
  organizationId,
  onUploadComplete,
  acceptedTypes = ".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.mp4,.mov",
  maxSize = 50,
  multiple = true
}) => {
  const { user } = useAuth();
  const { uploadDocument } = useDocuments();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [uploadStatus, setUploadStatus] = useState<Record<string, 'uploading' | 'success' | 'error'>>({});
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [documentMetadata, setDocumentMetadata] = useState<Record<string, {
    description: string;
    document_type: string;
    method: string;
    report_number: string;
    status: string;
  }>>({});

  const documentTypes = [
    { value: 'report', label: 'Rapor' },
    { value: 'certificate', label: 'Sertifika' },
    { value: 'image', label: 'Görsel' },
    { value: 'video', label: 'Video' },
    { value: 'other', label: 'Diğer' }
  ];

  const methods = ['UT', 'RT', 'PT', 'MT', 'VT', 'ET', 'LT'];

  const statusOptions = [
    { value: 'draft', label: 'Taslak' },
    { value: 'final', label: 'Final' },
    { value: 'archived', label: 'Arşivlenmiş' }
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFiles = (files: FileList) => {
    const validFiles: File[] = [];
    const maxSizeBytes = maxSize * 1024 * 1024;

    Array.from(files).forEach(file => {
      if (file.size <= maxSizeBytes) {
        validFiles.push(file);
        // Initialize metadata for each file
        setDocumentMetadata(prev => ({
          ...prev,
          [file.name]: {
            description: '',
            document_type: 'other',
            method: '',
            report_number: '',
            status: 'draft'
          }
        }));
      } else {
        alert(`${file.name} dosyası çok büyük. Maksimum ${maxSize}MB olmalıdır.`);
      }
    });

    if (validFiles.length > 0) {
      setUploadingFiles(prev => [...prev, ...validFiles]);
    }
  };

  const updateFileMetadata = (fileName: string, field: string, value: string) => {
    setDocumentMetadata(prev => ({
      ...prev,
      [fileName]: {
        ...prev[fileName],
        [field]: value
      }
    }));
  };

  const removeFile = (fileName: string) => {
    setUploadingFiles(prev => prev.filter(file => file.name !== fileName));
    setDocumentMetadata(prev => {
      const newMetadata = { ...prev };
      delete newMetadata[fileName];
      return newMetadata;
    });
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[fileName];
      return newProgress;
    });
    setUploadStatus(prev => {
      const newStatus = { ...prev };
      delete newStatus[fileName];
      return newStatus;
    });
  };

  const uploadFile = async (file: File) => {
    if (!user) {
      setUploadErrors(prev => ({
        ...prev,
        [file.name]: 'Kullanıcı oturumu bulunamadı'
      }));
      setUploadStatus(prev => ({ ...prev, [file.name]: 'error' }));
      return;
    }

    const metadata = documentMetadata[file.name];
    if (!metadata) {
      setUploadErrors(prev => ({
        ...prev,
        [file.name]: 'Dosya metadata\'sı bulunamadı'
      }));
      setUploadStatus(prev => ({ ...prev, [file.name]: 'error' }));
      return;
    }

    setUploadStatus(prev => ({ ...prev, [file.name]: 'uploading' }));
    setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const currentProgress = prev[file.name] || 0;
          if (currentProgress < 90) {
            return { ...prev, [file.name]: currentProgress + 10 };
          }
          return prev;
        });
      }, 200);

      const result = await uploadDocument(file, {
        name: file.name,
        description: metadata.description,
        project_id: projectId,
        customer_id: customerId,
        organization_id: organizationId,
        document_type: metadata.document_type as any,
        method: metadata.method || undefined,
        report_number: metadata.report_number || undefined,
        version: 1,
        status: metadata.status as any,
        uploaded_by: user.id
      });

      clearInterval(progressInterval);
      setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));

      if (result.success) {
        setUploadStatus(prev => ({ ...prev, [file.name]: 'success' }));
        onUploadComplete?.(result.data);
        
        // Remove file from uploading list after success
        setTimeout(() => {
          removeFile(file.name);
        }, 2000);
      } else {
        setUploadStatus(prev => ({ ...prev, [file.name]: 'error' }));
        setUploadErrors(prev => ({
          ...prev,
          [file.name]: result.error || 'Yükleme başarısız'
        }));
      }
    } catch (error: any) {
      setUploadStatus(prev => ({ ...prev, [file.name]: 'error' }));
      setUploadErrors(prev => ({
        ...prev,
        [file.name]: error.message || 'Yükleme başarısız'
      }));
    }
  };

  const uploadAllFiles = async () => {
    for (const file of uploadingFiles) {
      if (uploadStatus[file.name] !== 'success') {
        await uploadFile(file);
      }
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <PhotoIcon className="w-8 h-8 text-green-600" />;
    } else if (file.type.startsWith('video/')) {
      return <FilmIcon className="w-8 h-8 text-purple-600" />;
    } else {
      return <DocumentIcon className="w-8 h-8 text-blue-600" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
          isDragging 
            ? 'border-blue-500 bg-blue-50 scale-105' 
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        }`}
      >
        <CloudArrowUpIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Belge Yükle
        </h3>
        <p className="text-gray-600 mb-6">
          Dosyaları buraya sürükleyin veya seçmek için tıklayın
        </p>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Dosya Seç
        </button>
        <p className="text-sm text-gray-500 mt-3">
          Desteklenen formatlar: PDF, DOC, DOCX, JPG, PNG, GIF, MP4, MOV
          <br />
          Maksimum dosya boyutu: {maxSize}MB
        </p>
        
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          accept={acceptedTypes}
          multiple={multiple}
          className="hidden"
        />
      </div>

      {/* Uploading Files List */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-gray-900">Yüklenecek Dosyalar</h4>
            <button
              onClick={uploadAllFiles}
              disabled={uploadingFiles.every(file => uploadStatus[file.name] === 'success')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Tümünü Yükle
            </button>
          </div>

          {uploadingFiles.map((file) => {
            const metadata = documentMetadata[file.name] || {};
            const progress = uploadProgress[file.name] || 0;
            const status = uploadStatus[file.name];
            const error = uploadErrors[file.name];

            return (
              <div key={file.name} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    {getFileIcon(file)}
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900">{file.name}</h5>
                      <p className="text-sm text-gray-600">{formatFileSize(file.size)}</p>
                      
                      {/* Upload Progress */}
                      {status === 'uploading' && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                            <span>Yükleniyor...</span>
                            <span>{progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {/* Success Status */}
                      {status === 'success' && (
                        <div className="flex items-center space-x-2 mt-2 text-green-600">
                          <CheckCircleIcon className="w-4 h-4" />
                          <span className="text-sm">Başarıyla yüklendi</span>
                        </div>
                      )}

                      {/* Error Status */}
                      {status === 'error' && (
                        <div className="flex items-center space-x-2 mt-2 text-red-600">
                          <ExclamationTriangleIcon className="w-4 h-4" />
                          <span className="text-sm">{error}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => removeFile(file.name)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>

                {/* Document Metadata Form */}
                {status !== 'success' && (
                  <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Açıklama
                      </label>
                      <input
                        type="text"
                        value={metadata.description || ''}
                        onChange={(e) => updateFileMetadata(file.name, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="Belge açıklaması"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Belge Türü
                      </label>
                      <select
                        value={metadata.document_type || 'other'}
                        onChange={(e) => updateFileMetadata(file.name, 'document_type', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      >
                        {documentTypes.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Yöntem (İsteğe Bağlı)
                      </label>
                      <select
                        value={metadata.method || ''}
                        onChange={(e) => updateFileMetadata(file.name, 'method', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      >
                        <option value="">Yöntem seçin</option>
                        {methods.map(method => (
                          <option key={method} value={method}>{method}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rapor Numarası
                      </label>
                      <input
                        type="text"
                        value={metadata.report_number || ''}
                        onChange={(e) => updateFileMetadata(file.name, 'report_number', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="EMIC-UT-2024-001"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Durum
                      </label>
                      <select
                        value={metadata.status || 'draft'}
                        onChange={(e) => updateFileMetadata(file.name, 'status', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      >
                        {statusOptions.map(status => (
                          <option key={status.value} value={status.value}>{status.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2 pt-2">
                      <button
                        onClick={() => uploadFile(file)}
                        disabled={status === 'uploading' || status === 'success'}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                      >
                        {status === 'uploading' ? 'Yükleniyor...' : 
                         status === 'success' ? 'Yüklendi' : 'Bu Dosyayı Yükle'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DocumentUploader;