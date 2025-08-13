import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useOrganizations } from '../../hooks/useOrganizations';
import { 
  BuildingOfficeIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon
} from '@heroicons/react/24/outline';

const OrganizationsPage: React.FC = () => {
  const { organizations, loading, error, createOrganization, updateOrganization, deleteOrganization } = useOrganizations();
  
  const [newOrg, setNewOrg] = useState({
    name: '',
    description: '',
    contact_email: '',
    contact_phone: '',
    address: '',
    website: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingOrg, setEditingOrg] = useState<any>({});
  const [showCreateForm, setShowCreateForm] = useState(false);

  const filteredOrganizations = organizations.filter(org =>
    org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (org.description && org.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCreate = async () => {
    if (!newOrg.name.trim()) return;
    
    const result = await createOrganization({
      name: newOrg.name.trim(),
      description: newOrg.description.trim() || null,
      contact_email: newOrg.contact_email.trim() || null,
      contact_phone: newOrg.contact_phone.trim() || null,
      address: newOrg.address.trim() || null,
      website: newOrg.website.trim() || null,
      is_active: true
    });
    
    if (result.success) {
      setNewOrg({
        name: '',
        description: '',
        contact_email: '',
        contact_phone: '',
        address: '',
        website: ''
      });
      setShowCreateForm(false);
    }
  };

  const handleEdit = (org: any) => {
    setEditingId(org.id);
    setEditingOrg(org);
  };

  const handleSaveEdit = async () => {
    if (!editingOrg.name?.trim() || !editingId) return;
    
    await updateOrganization(editingId, {
      name: editingOrg.name.trim(),
      description: editingOrg.description?.trim() || null,
      contact_email: editingOrg.contact_email?.trim() || null,
      contact_phone: editingOrg.contact_phone?.trim() || null,
      address: editingOrg.address?.trim() || null,
      website: editingOrg.website?.trim() || null
    });
    
    setEditingId(null);
    setEditingOrg({});
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingOrg({});
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bu organizasyonu silmek istediğinizden emin misiniz?')) {
      await deleteOrganization(id);
    }
  };

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
          onClick={() => setShowCreateForm(true)}
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

      {/* Create Form */}
      {showCreateForm && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Yeni Organizasyon Ekle</h2>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organizasyon Adı *
                </label>
                <input
                  type="text"
                  value={newOrg.name}
                  onChange={(e) => setNewOrg(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  İletişim E-postası
                </label>
                <input
                  type="email"
                  value={newOrg.contact_email}
                  onChange={(e) => setNewOrg(prev => ({ ...prev, contact_email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Açıklama
              </label>
              <textarea
                rows={3}
                value={newOrg.description}
                onChange={(e) => setNewOrg(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefon
                </label>
                <input
                  type="tel"
                  value={newOrg.contact_phone}
                  onChange={(e) => setNewOrg(prev => ({ ...prev, contact_phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  value={newOrg.website}
                  onChange={(e) => setNewOrg(prev => ({ ...prev, website: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adres
              </label>
              <textarea
                rows={2}
                value={newOrg.address}
                onChange={(e) => setNewOrg(prev => ({ ...prev, address: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleCreate}
                disabled={!newOrg.name.trim() || loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
              >
                {loading ? 'Ekleniyor...' : 'Ekle'}
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

      {/* Organizations List */}
      <div className="space-y-3">
        {filteredOrganizations.map((org) => (
          <div key={org.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1 space-y-2">
                {editingId === org.id ? (
                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={editingOrg.name || ''}
                      onChange={(e) => setEditingOrg(prev => ({ ...prev, name: e.target.value }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                      autoFocus
                    />
                    <button
                      onClick={handleSaveEdit}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Kaydet
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      İptal
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold text-gray-900">{org.name}</h3>
                    {org.description && (
                      <p className="text-gray-600 mt-1">{org.description}</p>
                    )}
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      {org.contact_email && <span>📧 {org.contact_email}</span>}
                      {org.contact_phone && <span>📞 {org.contact_phone}</span>}
                      <span>Oluşturulma: {formatDate(org.created_at)}</span>
                    </div>
                  </>
                )}
              </div>

              {editingId !== org.id && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(org)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(org.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredOrganizations.length === 0 && (
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
            <BuildingOfficeIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? 'Organizasyon bulunamadı' : 'Henüz organizasyon yok'}
            </h3>
            <p className="text-gray-600">
              {searchQuery 
                ? 'Arama kriterlerinizi değiştirerek tekrar deneyin.'
                : 'Yukarıdaki formu kullanarak yeni bir organizasyon ekleyin.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationsPage;