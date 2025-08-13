import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useReferences } from '../../hooks/useContent';
import { contentStore } from '../../lib/contentStore';
import { 
  BuildingOfficeIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  GlobeAltIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';

const ReferenceImageAdmin: React.FC<{ reference: any }> = ({ reference }) => {
  const [imageError, setImageError] = React.useState(false);

  if (imageError) {
    return (
      <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
        <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"/>
      </svg>
    );
  }

  return (
    <img
      src={reference.logo}
      alt={reference.name}
      className="max-w-full max-h-full object-contain"
      onError={() => setImageError(true)}
    />
  );
};

const ReferencesPage: React.FC = () => {
  const { references } = useReferences('all');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingReference, setEditingReference] = useState<any>({});
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newReference, setNewReference] = useState<any>({
    name: '',
    nameEn: '',
    logo: '',
    website: '',
    sector: '',
    sectorEn: '',
    description: '',
    descriptionEn: '',
    order: 1,
    status: 'active'
  });

  const statusOptions = [
    { value: 'active', label: 'Aktif', color: 'bg-green-100 text-green-800' },
    { value: 'inactive', label: 'Pasif', color: 'bg-gray-100 text-gray-800' }
  ];

  const filteredReferences = references.filter(reference => {
    const matchesSearch = reference.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         reference.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         reference.sector.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || reference.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusInfo = (status: string) => {
    return statusOptions.find(s => s.value === status) || statusOptions[0];
  };

  const handleCreate = () => {
    if (!newReference.name.trim() || !newReference.logo.trim()) return;

    contentStore.addReference({
      name: newReference.name.trim(),
      nameEn: newReference.nameEn.trim() || newReference.name.trim(),
      logo: newReference.logo.trim(),
      website: newReference.website.trim(),
      sector: newReference.sector.trim(),
      sectorEn: newReference.sectorEn.trim() || newReference.sector.trim(),
      description: newReference.description.trim(),
      descriptionEn: newReference.descriptionEn.trim(),
      order: parseInt(newReference.order) || 1,
      status: newReference.status
    });

    setNewReference({
      name: '',
      nameEn: '',
      logo: '',
      website: '',
      sector: '',
      sectorEn: '',
      description: '',
      descriptionEn: '',
      order: 1,
      status: 'active'
    });
    setShowCreateForm(false);
  };

  const handleEdit = (reference: any) => {
    setEditingId(reference.id);
    setEditingReference(reference);
  };

  const handleSaveEdit = () => {
    if (!editingId || !editingReference.name || !editingReference.logo) return;

    contentStore.updateReference(editingId, editingReference);
    setEditingId(null);
    setEditingReference({});
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingReference({});
  };

  const handleDelete = (id: string) => {
    if (confirm('Bu referansı silmek istediğinizden emin misiniz?')) {
      contentStore.deleteReference(id);
    }
  };

  const handleStatusToggle = (id: string) => {
    const reference = references.find(ref => ref.id === id);
    if (reference) {
      contentStore.updateReference(id, {
        status: reference.status === 'active' ? 'inactive' : 'active'
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Referans Yönetimi</h1>
        </div>
        <button 
          onClick={() => setShowCreateForm(true)}
          className="btn bg-blue-600 text-white hover:bg-blue-700"
        >
          <PlusIcon className="w-4 h-4" />
          Yeni Referans
        </button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Yeni Referans Ekle</h2>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Şirket Adı (Türkçe) *
                </label>
                <input
                  type="text"
                  value={newReference.name}
                  onChange={(e) => setNewReference(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Şirket Adı (İngilizce)
                </label>
                <input
                  type="text"
                  value={newReference.nameEn}
                  onChange={(e) => setNewReference(prev => ({ ...prev, nameEn: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo URL *
                </label>
                <input
                  type="url"
                  value={newReference.logo}
                  onChange={(e) => setNewReference(prev => ({ ...prev, logo: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/logo.png"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  value={newReference.website}
                  onChange={(e) => setNewReference(prev => ({ ...prev, website: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sektör (Türkçe)
                </label>
                <input
                  type="text"
                  value={newReference.sector}
                  onChange={(e) => setNewReference(prev => ({ ...prev, sector: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Petrokimya"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sektör (İngilizce)
                </label>
                <input
                  type="text"
                  value={newReference.sectorEn}
                  onChange={(e) => setNewReference(prev => ({ ...prev, sectorEn: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Petrochemical"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Açıklama (Türkçe)
                </label>
                <textarea
                  rows={3}
                  value={newReference.description}
                  onChange={(e) => setNewReference(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Açıklama (İngilizce)
                </label>
                <textarea
                  rows={3}
                  value={newReference.descriptionEn}
                  onChange={(e) => setNewReference(prev => ({ ...prev, descriptionEn: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sıralama
                </label>
                <input
                  type="number"
                  value={newReference.order}
                  onChange={(e) => setNewReference(prev => ({ ...prev, order: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Durum
                </label>
                <select
                  value={newReference.status}
                  onChange={(e) => setNewReference(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {statusOptions.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleCreate}
                disabled={!newReference.name.trim() || !newReference.logo.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
              >
                Ekle
              </button>
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Referans ara..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tüm Durumlar</option>
            {statusOptions.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
          
          <div className="text-sm text-gray-600 flex items-center">
            Toplam: {filteredReferences.length} referans
          </div>
        </div>
      </div>

      {/* References List */}
      <div className="space-y-4">
        {filteredReferences.map((reference) => (
          <div key={reference.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            {editingId === reference.id ? (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Şirket Adı (Türkçe)
                    </label>
                    <input
                      type="text"
                      value={editingReference.name || ''}
                      onChange={(e) => setEditingReference(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Şirket Adı (İngilizce)
                    </label>
                    <input
                      type="text"
                      value={editingReference.nameEn || ''}
                      onChange={(e) => setEditingReference(prev => ({ ...prev, nameEn: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Logo URL
                    </label>
                    <input
                      type="url"
                      value={editingReference.logo || ''}
                      onChange={(e) => setEditingReference(prev => ({ ...prev, logo: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      value={editingReference.website || ''}
                      onChange={(e) => setEditingReference(prev => ({ ...prev, website: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleSaveEdit}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Kaydet
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    İptal
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ReferenceImageAdmin reference={reference} />
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-gray-900">{reference.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusInfo(reference.status).color}`}>
                        {getStatusInfo(reference.status).label}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>İngilizce: {reference.nameEn}</div>
                      <div>Sektör: {reference.sector} / {reference.sectorEn}</div>
                      {reference.website && (
                        <div className="flex items-center space-x-1">
                          <GlobeAltIcon className="w-4 h-4" />
                          <a href={reference.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                            {reference.website}
                          </a>
                        </div>
                      )}
                      <div>Sıralama: {reference.order}</div>
                      <div>Oluşturulma: {formatDate(reference.createdAt)}</div>
                    </div>
                    
                    {reference.description && (
                      <p className="text-sm text-gray-600 mt-2">{reference.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleStatusToggle(reference.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      reference.status === 'active' 
                        ? 'text-green-600 hover:bg-green-50' 
                        : 'text-gray-400 hover:bg-gray-50'
                    }`}
                    title={reference.status === 'active' ? 'Pasif Yap' : 'Aktif Yap'}
                  >
                    {reference.status === 'active' ? (
                      <EyeIcon className="w-4 h-4" />
                    ) : (
                      <EyeSlashIcon className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleEdit(reference)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(reference.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {filteredReferences.length === 0 && (
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
            <BuildingOfficeIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery || filterStatus !== 'all' 
                ? 'Referans bulunamadı' 
                : 'Henüz referans yok'
              }
            </h3>
            <p className="text-gray-600">
              {searchQuery || filterStatus !== 'all'
                ? 'Arama kriterlerinizi değiştirerek tekrar deneyin.'
                : 'Yeni referans eklemek için yukarıdaki butonu kullanın.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReferencesPage;