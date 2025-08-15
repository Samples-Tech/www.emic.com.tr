import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  DocumentTextIcon,
  ChevronLeftIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  PencilIcon,
  TrashIcon,
  ClockIcon,
  TagIcon,
  FolderIcon,
  PhotoIcon,
  FilmIcon,
  DocumentIcon as DocumentIconOutline
} from '@heroicons/react/24/outline';

const DocumentsPage: React.FC = () => {
  // Demo data
  const projects = [];
  const customers = [];
  const organizations = [];
  const documents = [];
  const loading = false;
  const error = null;

  const [searchQuery, setSearchQuery] = useState('');
  const [filterProject, setFilterProject] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const documentTypes = [
    { value: 'report', label: 'Rapor', icon: DocumentTextIcon, color: 'text-blue-600' },
    { value: 'certificate', label: 'Sertifika', icon: DocumentTextIcon, color: 'text-green-600' },
    { value: 'image', label: 'Görsel', icon: PhotoIcon, color: 'text-purple-600' },
    { value: 'video', label: 'Video', icon: FilmIcon, color: 'text-red-600' },
    { value: 'other', label: 'Diğer', icon: DocumentIconOutline, color: 'text-gray-600' }
  ];

  const statusOptions = [
    { value: 'draft', label: 'Taslak', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'final', label: 'Final', color: 'bg-green-100 text-green-800' },
    { value: 'archived', label: 'Arşivlenmiş', color: 'bg-gray-100 text-gray-800' }
  ];

  const filteredDocuments = [];

  const getTypeInfo = (type: string) => {
    return documentTypes.find(t => t.value === type) || documentTypes[4];
  };

  const getStatusInfo = (status: string) => {
    return statusOptions.find(s => s.value === status) || statusOptions[0];
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-gray-500">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link
            to="/admin"
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </Link>
          <DocumentTextIcon className="w-8 h-8 text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-900">Belge Yönetimi</h1>
        </div>
        <button 
          onClick={() => alert('Supabase bağlantısı gerekli')}
          className="btn bg-indigo-600 text-white hover:bg-indigo-700"
        >
          <DocumentTextIcon className="w-4 h-4" />
          Belge Yükle
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <div className="flex items-start space-x-3">
          <DocumentTextIcon className="w-6 h-6 text-blue-600 mt-1" />
          <div className="space-y-2">
            <h3 className="font-semibold text-blue-900">Belge Yönetimi - Supabase Gerekli</h3>
            <p className="text-sm text-blue-800">
              Belge yönetimi için Supabase database bağlantısı gereklidir. 
              Supabase'i bağlamak için sağ üstteki "Connect to Supabase" butonunu kullanın.
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="grid md:grid-cols-5 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Belge ara..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Tüm Projeler</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.code} - {project.name}
              </option>
            ))}
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Tüm Türler</option>
            {documentTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Tüm Durumlar</option>
            {statusOptions.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
          
          <div className="text-sm text-gray-600 flex items-center">
            <FunnelIcon className="w-4 h-4 mr-2" />
            {filteredDocuments.length} belge
          </div>
        </div>
      </div>

      {/* No Documents Message */}
      <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
        <FolderIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Supabase Database Gerekli
        </h3>
        <p className="text-gray-600">
          Belge yönetimi için Supabase database bağlantısı kurulmalıdır.
        </p>
      </div>
    </div>
  );
};

export default DocumentsPage;