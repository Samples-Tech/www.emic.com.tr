import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { contentStore } from '../../lib/contentStore';
import { 
  MapIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  EyeIcon,
  EyeSlashIcon,
  PhoneIcon,
  EnvelopeIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

interface ServiceRegion {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  cities: string[];
  citiesEn: string[];
  services: string[];
  servicesEn: string[];
  contactPhone?: string;
  contactEmail?: string;
  image?: string;
  order: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

const ServiceRegionsPage: React.FC = () => {
  const [regions, setRegions] = useState<ServiceRegion[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingRegion, setEditingRegion] = useState<Partial<ServiceRegion>>({});
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newRegion, setNewRegion] = useState<Partial<ServiceRegion>>({
    name: '',
    nameEn: '',
    description: '',
    descriptionEn: '',
    cities: [],
    citiesEn: [],
    services: [],
    servicesEn: [],
    contactPhone: '',
    contactEmail: '',
    image: '',
    order: 1,
    status: 'active'
  });

  useEffect(() => {
    const loadRegions = () => {
      const serviceRegions = contentStore.getServiceRegions('all');
      setRegions(serviceRegions);
    };

    loadRegions();
    const unsubscribe = contentStore.subscribe(loadRegions);
    return unsubscribe;
  }, []);

  const statusOptions = [
    { value: 'active', label: 'Aktif', color: 'bg-green-100 text-green-800' },
    { value: 'inactive', label: 'Pasif', color: 'bg-gray-100 text-gray-800' }
  ];

  const filteredRegions = regions.filter(region => {
    const matchesSearch = region.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         region.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         region.cities.some(city => city.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || region.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusInfo = (status: string) => {
    return statusOptions.find(s => s.value === status) || statusOptions[0];
  };

  const handleCreate = () => {
    if (!newRegion.name?.trim() || !newRegion.description?.trim()) return;

    contentStore.addServiceRegion({
      name: newRegion.name.trim(),
      nameEn: newRegion.nameEn?.trim() || newRegion.name.trim(),
      description: newRegion.description.trim(),
      descriptionEn: newRegion.descriptionEn?.trim() || newRegion.description.trim(),
      cities: newRegion.cities || [],
      citiesEn: newRegion.citiesEn || newRegion.cities || [],
      services: newRegion.services || [],
      servicesEn: newRegion.servicesEn || newRegion.services || [],
      contactPhone: newRegion.contactPhone?.trim(),
      contactEmail: newRegion.contactEmail?.trim(),
      image: newRegion.image?.trim(),
      order: parseInt(newRegion.order?.toString() || '1') || 1,
      status: newRegion.status || 'active'
    });

    setNewRegion({
      name: '',
      nameEn: '',
      description: '',
      descriptionEn: '',
      cities: [],
      citiesEn: [],
      services: [],
      servicesEn: [],
      contactPhone: '',
      contactEmail: '',
      image: '',
      order: 1,
      status: 'active'
    });
    setShowCreateForm(false);
  };

  const handleEdit = (region: ServiceRegion) => {
    setEditingId(region.id);
    setEditingRegion(region);
  };

  const handleSaveEdit = () => {
    if (!editingId || !editingRegion.name || !editingRegion.description) return;

    contentStore.updateServiceRegion(editingId, editingRegion);
    setEditingId(null);
    setEditingRegion({});
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingRegion({});
  };

  const handleDelete = (id: string) => {
    if (confirm('Bu hizmet bölgesini silmek istediğinizden emin misiniz?')) {
      contentStore.deleteServiceRegion(id);
    }
  };

  const handleStatusToggle = (id: string) => {
    const region = regions.find(r => r.id === id);
    if (region) {
      contentStore.updateServiceRegion(id, {
        status: region.status === 'active' ? 'inactive' : 'active'
      });
    }
  };

  const handleArrayInput = (field: string, value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item);
    if (editingId) {
      setEditingRegion(prev => ({ ...prev, [field]: items }));
    } else {
      setNewRegion(prev => ({ ...prev, [field]: items }));
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
          <MapIcon className="w-8 h-8 text-green-600" />
          <h1 className="text-2xl font-bold text-gray-900">Hizmet Bölgeleri</h1>
        </div>
        <button 
          onClick={() => setShowCreateForm(true)}
          className="btn bg-green-600 text-white hover:bg-green-700"
        >
          <PlusIcon className="w-4 h-4" />
          Yeni Bölge
        </button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Yeni Hizmet Bölgesi Ekle</h2>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bölge Adı (Türkçe) *
                </label>
                <input
                  type="text"
                  value={newRegion.name || ''}
                  onChange={(e) => setNewRegion(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Marmara Bölgesi"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bölge Adı (İngilizce)
                </label>
                <input
                  type="text"
                  value={newRegion.nameEn || ''}
                  onChange={(e) => setNewRegion(prev => ({ ...prev, nameEn: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Marmara Region"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Açıklama (Türkçe) *
                </label>
                <textarea
                  rows={3}
                  value={newRegion.description || ''}
                  onChange={(e) => setNewRegion(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  placeholder="Bu bölgede sunduğumuz hizmetler hakkında bilgi..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Açıklama (İngilizce)
                </label>
                <textarea
                  rows={3}
                  value={newRegion.descriptionEn || ''}
                  onChange={(e) => setNewRegion(prev => ({ ...prev, descriptionEn: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  placeholder="Information about services in this region..."
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Şehirler (Türkçe) - Virgülle ayırın
                </label>
                <input
                  type="text"
                  value={newRegion.cities?.join(', ') || ''}
                  onChange={(e) => setNewRegion(prev => ({ 
                    ...prev, 
                    cities: e.target.value.split(',').map(item => item.trim()).filter(item => item)
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="İstanbul, Ankara, İzmir"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Şehirler (İngilizce) - Virgülle ayırın
                </label>
                <input
                  type="text"
                  value={newRegion.citiesEn?.join(', ') || ''}
                  onChange={(e) => setNewRegion(prev => ({ 
                    ...prev, 
                    citiesEn: e.target.value.split(',').map(item => item.trim()).filter(item => item)
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Istanbul, Ankara, Izmir"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hizmetler (Türkçe) - Virgülle ayırın
                </label>
                <input
                  type="text"
                  value={newRegion.services?.join(', ') || ''}
                  onChange={(e) => setNewRegion(prev => ({ 
                    ...prev, 
                    services: e.target.value.split(',').map(item => item.trim()).filter(item => item)
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="NDT Muayene, Kaynak Kontrolü, Basınçlı Kap"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hizmetler (İngilizce) - Virgülle ayırın
                </label>
                <input
                  type="text"
                  value={newRegion.servicesEn?.join(', ') || ''}
                  onChange={(e) => setNewRegion(prev => ({ 
                    ...prev, 
                    servicesEn: e.target.value.split(',').map(item => item.trim()).filter(item => item)
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="NDT Inspection, Welding Control, Pressure Vessel"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  İletişim Telefonu
                </label>
                <input
                  type="tel"
                  value={newRegion.contactPhone || ''}
                  onChange={(e) => setNewRegion(prev => ({ ...prev, contactPhone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="+90 212 123 45 67"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  İletişim E-postası
                </label>
                <input
                  type="email"
                  value={newRegion.contactEmail || ''}
                  onChange={(e) => setNewRegion(prev => ({ ...prev, contactEmail: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="marmara@emic.com.tr"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bölge Görseli URL
                </label>
                <input
                  type="url"
                  value={newRegion.image || ''}
                  onChange={(e) => setNewRegion(prev => ({ ...prev, image: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="https://example.com/region.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sıralama
                </label>
                <input
                  type="number"
                  value={newRegion.order || 1}
                  onChange={(e) => setNewRegion(prev => ({ ...prev, order: parseInt(e.target.value) || 1 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Durum
                </label>
                <select
                  value={newRegion.status || 'active'}
                  onChange={(e) => setNewRegion(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                disabled={!newRegion.name?.trim() || !newRegion.description?.trim()}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
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
              placeholder="Bölge ara..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">Tüm Durumlar</option>
            {statusOptions.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
          
          <div className="text-sm text-gray-600 flex items-center">
            Toplam: {filteredRegions.length} bölge
          </div>
        </div>
      </div>

      {/* Regions List */}
      <div className="space-y-4">
        {filteredRegions.map((region) => (
          <div key={region.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            {editingId === region.id ? (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bölge Adı (Türkçe)
                    </label>
                    <input
                      type="text"
                      value={editingRegion.name || ''}
                      onChange={(e) => setEditingRegion(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bölge Adı (İngilizce)
                    </label>
                    <input
                      type="text"
                      value={editingRegion.nameEn || ''}
                      onChange={(e) => setEditingRegion(prev => ({ ...prev, nameEn: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Şehirler (Türkçe) - Virgülle ayırın
                    </label>
                    <input
                      type="text"
                      value={editingRegion.cities?.join(', ') || ''}
                      onChange={(e) => setEditingRegion(prev => ({ 
                        ...prev, 
                        cities: e.target.value.split(',').map(item => item.trim()).filter(item => item)
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hizmetler (Türkçe) - Virgülle ayırın
                    </label>
                    <input
                      type="text"
                      value={editingRegion.services?.join(', ') || ''}
                      onChange={(e) => setEditingRegion(prev => ({ 
                        ...prev, 
                        services: e.target.value.split(',').map(item => item.trim()).filter(item => item)
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleSaveEdit}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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
                  {region.image && (
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={region.image}
                        alt={region.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-gray-900">{region.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusInfo(region.status).color}`}>
                        {getStatusInfo(region.status).label}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>İngilizce: {region.nameEn}</div>
                      <div>Açıklama: {region.description}</div>
                      <div>Şehirler: {region.cities.join(', ')}</div>
                      <div>Hizmetler: {region.services.join(', ')}</div>
                      {region.contactPhone && (
                        <div className="flex items-center space-x-1">
                          <PhoneIcon className="w-4 h-4" />
                          <span>{region.contactPhone}</span>
                        </div>
                      )}
                      {region.contactEmail && (
                        <div className="flex items-center space-x-1">
                          <EnvelopeIcon className="w-4 h-4" />
                          <span>{region.contactEmail}</span>
                        </div>
                      )}
                      <div>Sıralama: {region.order}</div>
                      <div>Oluşturulma: {formatDate(region.createdAt)}</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleStatusToggle(region.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      region.status === 'active' 
                        ? 'text-green-600 hover:bg-green-50' 
                        : 'text-gray-400 hover:bg-gray-50'
                    }`}
                    title={region.status === 'active' ? 'Pasif Yap' : 'Aktif Yap'}
                  >
                    {region.status === 'active' ? (
                      <EyeIcon className="w-4 h-4" />
                    ) : (
                      <EyeSlashIcon className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleEdit(region)}
                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(region.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {filteredRegions.length === 0 && (
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
            <MapIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery || filterStatus !== 'all' 
                ? 'Bölge bulunamadı' 
                : 'Henüz hizmet bölgesi yok'
              }
            </h3>
            <p className="text-gray-600">
              {searchQuery || filterStatus !== 'all'
                ? 'Arama kriterlerinizi değiştirerek tekrar deneyin.'
                : 'Yeni hizmet bölgesi eklemek için yukarıdaki butonu kullanın.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceRegionsPage;