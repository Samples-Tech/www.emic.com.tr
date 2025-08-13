import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  PhotoIcon,
  PlusIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  DocumentIcon,
  FilmIcon,
  ArrowUpTrayIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

interface MediaItem {
  id: string;
  name: string;
  type: 'image' | 'document' | 'video';
  url: string;
  size: number;
  uploadedAt: string;
  alt?: string;
  description?: string;
}

const MediaManagementPage: React.FC = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([
    {
      id: '1',
      name: 'hero-background.jpg',
      type: 'image',
      url: '/images/hero-bg.jpg',
      size: 2048576,
      uploadedAt: '2024-01-15T10:30:00Z',
      alt: 'EMIC Ana Sayfa Hero Görseli',
      description: 'Ana sayfa hero bölümü için arka plan görseli'
    },
    {
      id: '2',
      name: 'ndt-equipment.jpg',
      type: 'image',
      url: '/images/ndt-equipment.jpg',
      size: 1536000,
      uploadedAt: '2024-01-14T14:20:00Z',
      alt: 'NDT Ekipmanları',
      description: 'Tahribatsız muayene ekipmanları görseli'
    },
    {
      id: '3',
      name: 'company-brochure.pdf',
      type: 'document',
      url: '/documents/brochure.pdf',
      size: 5242880,
      uploadedAt: '2024-01-13T09:15:00Z',
      description: 'EMIC şirket broşürü'
    },
    {
      id: '4',
      name: 'laboratory-tour.mp4',
      type: 'video',
      url: '/videos/lab-tour.mp4',
      size: 52428800,
      uploadedAt: '2024-01-12T16:45:00Z',
      description: 'Laboratuvar tanıtım videosu'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const mediaTypes = [
    { value: 'image', label: 'Görseller', icon: PhotoIcon, color: 'text-green-600' },
    { value: 'document', label: 'Dökümanlar', icon: DocumentIcon, color: 'text-blue-600' },
    { value: 'video', label: 'Videolar', icon: FilmIcon, color: 'text-purple-600' }
  ];

  const filteredMedia = mediaItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = filterType === 'all' || item.type === filterType;
    
    return matchesSearch && matchesType;
  });

  const getTypeInfo = (type: string) => {
    return mediaTypes.find(t => t.value === type) || mediaTypes[0];
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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

  const handleDelete = (id: string) => {
    if (confirm('Bu medya dosyasını silmek istediğinizden emin misiniz?')) {
      setMediaItems(prev => prev.filter(item => item.id !== id));
      setSelectedItems(prev => prev.filter(itemId => itemId !== id));
    }
  };

  const handleBulkDelete = () => {
    if (selectedItems.length === 0) return;
    if (confirm(`Seçili ${selectedItems.length} dosyayı silmek istediğinizden emin misiniz?`)) {
      setMediaItems(prev => prev.filter(item => !selectedItems.includes(item.id)));
      setSelectedItems([]);
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedItems.length === filteredMedia.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredMedia.map(item => item.id));
    }
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
          <PhotoIcon className="w-8 h-8 text-pink-600" />
          <h1 className="text-2xl font-bold text-gray-900">Medya Yönetimi</h1>
        </div>
        <div className="flex items-center space-x-3">
          {selectedItems.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="btn bg-red-600 text-white hover:bg-red-700"
            >
              <TrashIcon className="w-4 h-4" />
              Seçilileri Sil ({selectedItems.length})
            </button>
          )}
          <button className="btn bg-pink-600 text-white hover:bg-pink-700">
            <ArrowUpTrayIcon className="w-4 h-4" />
            Dosya Yükle
          </button>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Medya ara..."
                className="w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="all">Tüm Türler</option>
              {mediaTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={selectAll}
              className="text-sm text-pink-600 hover:text-pink-700 font-medium"
            >
              {selectedItems.length === filteredMedia.length ? 'Hiçbirini Seçme' : 'Tümünü Seç'}
            </button>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-pink-100 text-pink-600' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-pink-100 text-pink-600' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <span className="text-sm text-gray-600">
              {filteredMedia.length} dosya
            </span>
          </div>
        </div>

        {/* Media Type Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{mediaItems.length}</div>
            <div className="text-sm text-gray-600">Toplam Dosya</div>
          </div>
          {mediaTypes.map(type => {
            const count = mediaItems.filter(item => item.type === type.value).length;
            return (
              <div key={type.value} className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{count}</div>
                <div className="text-sm text-gray-600">{type.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Media Grid/List */}
      <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
        {filteredMedia.map((item) => {
          const typeInfo = getTypeInfo(item.type);
          const IconComponent = typeInfo.icon;
          
          return viewMode === 'grid' ? (
            <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="aspect-square bg-gray-100 flex items-center justify-center relative">
                {item.type === 'image' ? (
                  <img 
                    src={`https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=300&fit=crop&crop=center`}
                    alt={item.alt || item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <IconComponent className={`w-16 h-16 ${typeInfo.color}`} />
                )}
                
                <div className="absolute top-2 left-2">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => toggleSelection(item.id)}
                    className="w-4 h-4 text-pink-600 bg-white border-gray-300 rounded focus:ring-pink-500"
                  />
                </div>
                
                <div className="absolute top-2 right-2 flex space-x-1">
                  <button className="p-1 bg-white/80 rounded-full hover:bg-white transition-colors">
                    <EyeIcon className="w-4 h-4 text-gray-600" />
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="p-1 bg-white/80 rounded-full hover:bg-white transition-colors"
                  >
                    <TrashIcon className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-medium text-gray-900 truncate mb-1">{item.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{formatFileSize(item.size)}</p>
                <p className="text-xs text-gray-400">{formatDate(item.uploadedAt)}</p>
                {item.description && (
                  <p className="text-xs text-gray-600 mt-2 line-clamp-2">{item.description}</p>
                )}
              </div>
            </div>
          ) : (
            <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => toggleSelection(item.id)}
                  className="w-4 h-4 text-pink-600 bg-white border-gray-300 rounded focus:ring-pink-500"
                />
                
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  {item.type === 'image' ? (
                    <img 
                      src={`https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=48&h=48&fit=crop&crop=center`}
                      alt={item.alt || item.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <IconComponent className={`w-6 h-6 ${typeInfo.color}`} />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{formatFileSize(item.size)}</span>
                    <span>{formatDate(item.uploadedAt)}</span>
                  </div>
                  {item.description && (
                    <p className="text-sm text-gray-600 mt-1 truncate">{item.description}</p>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <EyeIcon className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredMedia.length === 0 && (
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
          <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery || filterType !== 'all' ? 'Medya bulunamadı' : 'Henüz medya dosyası yok'}
          </h3>
          <p className="text-gray-600">
            {searchQuery || filterType !== 'all'
              ? 'Arama kriterlerinizi değiştirerek tekrar deneyin.'
              : 'Yeni medya dosyası yüklemek için yukarıdaki butonu kullanın.'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default MediaManagementPage;