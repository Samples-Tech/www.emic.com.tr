import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BriefcaseIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';

const JobsPage: React.FC = () => {
  // Demo data
  const projects = [];
  const jobs = [];
  const loading = false;
  const error = null;

  const [searchQuery, setSearchQuery] = useState('');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
          <BriefcaseIcon className="w-8 h-8 text-purple-600" />
          <h1 className="text-2xl font-bold text-gray-900">İşler</h1>
        </div>
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
          <BriefcaseIcon className="w-6 h-6 text-blue-600 mt-1" />
          <div className="space-y-2">
            <h3 className="font-semibold text-blue-900">İş Yönetimi - Supabase Gerekli</h3>
            <p className="text-sm text-blue-800">
              İş yönetimi için Supabase database bağlantısı gereklidir. 
              Supabase'i bağlamak için sağ üstteki "Connect to Supabase" butonunu kullanın.
            </p>
          </div>
        </div>
      </div>

      {/* No Jobs Message */}
      <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
        <BriefcaseIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Supabase Database Gerekli</h3>
        <p className="text-gray-600">
          İş yönetimi için Supabase database bağlantısı kurulmalıdır.
        </p>
      </div>
    </div>
  );
};

export default JobsPage;