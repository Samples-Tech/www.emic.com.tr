import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BuildingOfficeIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon
} from '@heroicons/react/24/outline';

const OrganizationsPage: React.FC = () => {
  // Demo data
  const organizations = [];
  const loading = false;
  const error = null;
  
  const [newOrg, setNewOrg] = useState({
    name: '',
    description: '',
    contact_email: '',
    contact_phone: '',
    address: '',
    website: ''
  });
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrganizations = [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
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
          <BuildingOfficeIcon className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Organizasyonlar</h1>
        </div>
        <button 
          onClick={() => alert('Supabase bağlantısı gerekli')}
          className="btn bg-blue-600 text-white hover:bg-blue-700"
        >
          <PlusIcon className="w-4 h-4" />
          Yeni Organizasyon
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
          <BuildingOfficeIcon className="w-6 h-6 text-blue-600 mt-1" />
          <div className="space-y-2">
            <h3 className="font-semibold text-blue-900">Organizasyon Yönetimi - Supabase Gerekli</h3>
            <p className="text-sm text-blue-800">
              Organizasyon yönetimi için Supabase database bağlantısı gereklidir. 
              Supabase'i bağlamak için sağ üstteki "Connect to Supabase" butonunu kullanın.
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Organizasyon ara..."
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* No Organizations Message */}
      <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
        <BuildingOfficeIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Supabase Database Gerekli</h3>
        <p className="text-gray-600">
          Organizasyon yönetimi için Supabase database bağlantısı kurulmalıdır.
        </p>
      </div>
    </div>
  );
};

export default OrganizationsPage;