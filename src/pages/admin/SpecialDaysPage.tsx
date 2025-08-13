import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { contentStore } from '../../lib/contentStore';
import { 
  CalendarIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  EyeIcon,
  EyeSlashIcon,
  StarIcon,
  HeartIcon,
  GiftIcon
} from '@heroicons/react/24/outline';

interface SpecialDay {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  date: string;
  type: 'celebration' | 'commemoration' | 'holiday' | 'announcement';
  image?: string;
  backgroundColor?: string;
  textColor?: string;
  isActive: boolean;
  showDuration: number;
  createdAt: string;
  updatedAt: string;
}

const SpecialDaysPage: React.FC = () => {
  const [specialDays, setSpecialDays] = useState<SpecialDay[]>(contentStore.getSpecialDays('all'));
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingDay, setEditingDay] = useState<Partial<SpecialDay>>({});
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newDay, setNewDay] = useState<Partial<SpecialDay>>({
    title: '',
    titleEn: '',
    description: '',
    descriptionEn: '',
    date: '',
    type: 'celebration',
    image: '',
    backgroundColor: '#1e40af',
    textColor: '#ffffff',
    isActive: true,
    showDuration: 10
  });

  React.useEffect(() => {
    const unsubscribe = contentStore.subscribe(() => {
      setSpecialDays(contentStore.getSpecialDays('all'));
    });
    return unsubscribe;
  }, []);

  const statusOptions = [
    { value: 'active', label: 'Aktif', color: 'bg-green-100 text-green-800' },
    { value: 'inactive', label: 'Pasif', color: 'bg-gray-100 text-gray-800' }
  ];

  const typeOptions = [
    { value: 'celebration', label: 'Kutlama', icon: StarIcon, color: 'bg-yellow-100 text-yellow-800' },
    { value: 'commemoration', label: 'Anma', icon: HeartIcon, color: 'bg-red-100 text-red-800' },
    { value: 'holiday', label: 'Bayram', icon: GiftIcon, color: 'bg-green-100 text-green-800' },
    { value: 'announcement', label: 'Duyuru', icon: CalendarIcon, color: 'bg-blue-100 text-blue-800' }
  ];

  const filteredDays = specialDays.filter(day => {
    const matchesSearch = day.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         day.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         day.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' ? day.isActive : !day.isActive);
    
    return matchesSearch && matchesStatus;
  });

  const getStatusInfo = (isActive: boolean) => {
    return isActive ? statusOptions[0] : statusOptions[1];
  };

  const getTypeInfo = (type: string) => {
    return typeOptions.find(t => t.value === type) || typeOptions[0];
  };

  const handleCreate = () => {
    if (!newDay.title?.trim() || !newDay.description?.trim() || !newDay.date?.trim()) return;

    contentStore.addSpecialDay({
      title: newDay.title.trim(),
      titleEn: newDay.titleEn?.trim() || newDay.title.trim(),
      description: newDay.description.trim(),
      descriptionEn: newDay.descriptionEn?.trim() || newDay.description.trim(),
      date: newDay.date.trim(),
      type: newDay.type || 'celebration',
      image: newDay.image?.trim(),
      backgroundColor: newDay.backgroundColor || '#1e40af',
      textColor: newDay.textColor || '#ffffff',
      isActive: newDay.isActive ?? true,
      showDuration: newDay.showDuration || 10
    });

    setNewDay({
      title: '',
      titleEn: '',
      description: '',
      descriptionEn: '',
      date: '',
      type: 'celebration',
      image: '',
      backgroundColor: '#1e40af',
      textColor: '#ffffff',
      isActive: true,
      showDuration: 10
    });
    setShowCreateForm(false);
  };

  const handleEdit = (day: SpecialDay) => {
    setEditingId(day.id);
    setEditingDay(day);
  };

  const handleSaveEdit = () => {
    if (!editingId || !editingDay.title || !editingDay.description) return;

    contentStore.updateSpecialDay(editingId, editingDay);
    setEditingId(null);
    setEditingDay({});
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingDay({});
  };

  const handleDelete = (id: string) => {
    if (confirm('Bu özel günü silmek istediğinizden emin misiniz?')) {
      contentStore.deleteSpecialDay(id);
    }
  };

  const handleStatusToggle = (id: string) => {
    const day = specialDays.find(d => d.id === id);
    if (day) {
      contentStore.updateSpecialDay(id, {
        isActive: !day.isActive
      });
    }
  };

  const formatDate = (dateString: string) => {
    const [month, day] = dateString.split('-');
    const date = new Date(2024, parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long'
    });
  };

  const formatCreatedDate = (dateString: string) => {
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
          <CalendarIcon className="w-8 h-8 text-purple-600" />
          <h1 className="text-2xl font-bold text-gray-900">Özel Günler</h1>
        </div>
        <button 
          onClick={() => setShowCreateForm(true)}
          className="btn bg-purple-600 text-white hover:bg-purple-700"
        >
          <PlusIcon className="w-4 h-4" />
          Yeni Özel Gün
        </button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Yeni Özel Gün Ekle</h2>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Başlık (Türkçe) *
                </label>
                <input
                  type="text"
                  value={newDay.title || ''}
                  onChange={(e) => setNewDay(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Yeni Yıl Kutlaması"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Başlık (İngilizce)
                </label>
                <input
                  type="text"
                  value={newDay.titleEn || ''}
                  onChange={(e) => setNewDay(prev => ({ ...prev, titleEn: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="New Year Celebration"
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
                  value={newDay.description || ''}
                  onChange={(e) => setNewDay(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  placeholder="Kutlama mesajınızı yazın..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Açıklama (İngilizce)
                </label>
                <textarea
                  rows={3}
                  value={newDay.descriptionEn || ''}
                  onChange={(e) => setNewDay(prev => ({ ...prev, descriptionEn: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  placeholder="Write your celebration message..."
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tarih (AA-GG) *
                </label>
                <input
                  type="text"
                  value={newDay.date || ''}
                  onChange={(e) => setNewDay(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="01-01"
                  pattern="[0-9]{2}-[0-9]{2}"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Örnek: 01-01 (1 Ocak)</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tür
                </label>
                <select
                  value={newDay.type || 'celebration'}
                  onChange={(e) => setNewDay(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {typeOptions.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gösterim Süresi (saniye)
                </label>
                <input
                  type="number"
                  value={newDay.showDuration || 10}
                  onChange={(e) => setNewDay(prev => ({ ...prev, showDuration: parseInt(e.target.value) || 10 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  min="5"
                  max="60"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Arka Plan Görseli URL
                </label>
                <input
                  type="url"
                  value={newDay.image || ''}
                  onChange={(e) => setNewDay(prev => ({ ...prev, image: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Arka Plan Rengi
                </label>
                <input
                  type="color"
                  value={newDay.backgroundColor || '#1e40af'}
                  onChange={(e) => setNewDay(prev => ({ ...prev, backgroundColor: e.target.value }))}
                  className="w-full h-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Metin Rengi
                </label>
                <input
                  type="color"
                  value={newDay.textColor || '#ffffff'}
                  onChange={(e) => setNewDay(prev => ({ ...prev, textColor: e.target.value }))}
                  className="w-full h-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={newDay.isActive ?? true}
                onChange={(e) => setNewDay(prev => ({ ...prev, isActive: e.target.checked }))}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <label htmlFor="isActive" className="text-sm text-gray-700">
                Aktif özel gün
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleCreate}
                disabled={!newDay.title?.trim() || !newDay.description?.trim() || !newDay.date?.trim()}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition-colors"
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
              placeholder="Özel gün ara..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">Tüm Durumlar</option>
            <option value="active">Aktif</option>
            <option value="inactive">Pasif</option>
          </select>
          
          <div className="text-sm text-gray-600 flex items-center">
            Toplam: {filteredDays.length} özel gün
          </div>
        </div>
      </div>

      {/* Special Days List */}
      <div className="space-y-4">
        {filteredDays.map((day) => {
          const typeInfo = getTypeInfo(day.type);
          const IconComponent = typeInfo.icon;
          
          return (
            <div key={day.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              {editingId === day.id ? (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Başlık (Türkçe)
                      </label>
                      <input
                        type="text"
                        value={editingDay.title || ''}
                        onChange={(e) => setEditingDay(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Başlık (İngilizce)
                      </label>
                      <input
                        type="text"
                        value={editingDay.titleEn || ''}
                        onChange={(e) => setEditingDay(prev => ({ ...prev, titleEn: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                        value={editingDay.description || ''}
                        onChange={(e) => setEditingDay(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Açıklama (İngilizce)
                      </label>
                      <textarea
                        rows={3}
                        value={editingDay.descriptionEn || ''}
                        onChange={(e) => setEditingDay(prev => ({ ...prev, descriptionEn: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleSaveEdit}
                      className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
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
                    <div className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0"
                         style={{ backgroundColor: day.backgroundColor || '#1e40af' }}>
                      <IconComponent className="w-8 h-8" style={{ color: day.textColor || '#ffffff' }} />
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-gray-900">{day.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusInfo(day.isActive).color}`}>
                          {getStatusInfo(day.isActive).label}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${typeInfo.color}`}>
                          {typeInfo.label}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>İngilizce: {day.titleEn}</div>
                        <div>Açıklama: {day.description}</div>
                        <div>Tarih: {formatDate(day.date)}</div>
                        <div>Gösterim Süresi: {day.showDuration} saniye</div>
                        <div>Oluşturulma: {formatCreatedDate(day.createdAt)}</div>
                      </div>
                      
                      {day.image && (
                        <div className="mt-3">
                          <img
                            src={day.image}
                            alt={day.title}
                            className="w-full h-32 object-cover rounded-lg"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleStatusToggle(day.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        day.isActive 
                          ? 'text-green-600 hover:bg-green-50' 
                          : 'text-gray-400 hover:bg-gray-50'
                      }`}
                      title={day.isActive ? 'Pasif Yap' : 'Aktif Yap'}
                    >
                      {day.isActive ? (
                        <EyeIcon className="w-4 h-4" />
                      ) : (
                        <EyeSlashIcon className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => handleEdit(day)}
                      className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(day.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredDays.length === 0 && (
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
            <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery || filterStatus !== 'all' 
                ? 'Özel gün bulunamadı' 
                : 'Henüz özel gün yok'
              }
            </h3>
            <p className="text-gray-600">
              {searchQuery || filterStatus !== 'all'
                ? 'Arama kriterlerinizi değiştirerek tekrar deneyin.'
                : 'Yeni özel gün eklemek için yukarıdaki butonu kullanın.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpecialDaysPage;