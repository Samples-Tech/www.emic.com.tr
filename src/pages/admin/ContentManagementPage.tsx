import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../../hooks/useContent';
import { contentStore } from '../../lib/contentStore';
import RichTextEditor from '../../components/RichTextEditor';
import MediaUploader from '../../components/MediaUploader';
import { 
  DocumentTextIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  PhotoIcon,
  GlobeAltIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

interface ContentItem {
  id: string;
  type: 'hero' | 'service' | 'page' | 'news';
  title: string;
  titleEn: string;
  content: string;
  contentEn: string;
  slug: string;
  status: 'published' | 'draft';
  createdAt: string;
  updatedAt: string;
  image?: string;
  order?: number;
}

const ContentManagementPage: React.FC = () => {
  const { content: contents } = useContent('all', 'all');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState<Partial<ContentItem>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newContent, setNewContent] = useState<Partial<ContentItem>>({
    type: 'service',
    status: 'draft',
    title: '',
    titleEn: '',
    content: '',
    contentEn: '',
    slug: '',
    image: ''
  });
  const [showAdvancedEditor, setShowAdvancedEditor] = useState(false);

  const contentTypes = [
    { value: 'hero', label: 'Ana Sayfa Hero', color: 'bg-purple-100 text-purple-800' },
    { value: 'service', label: 'Hizmet', color: 'bg-blue-100 text-blue-800' },
    { value: 'page', label: 'Sayfa', color: 'bg-green-100 text-green-800' },
    { value: 'news', label: 'Haber', color: 'bg-orange-100 text-orange-800' }
  ];

  const statusOptions = [
    { value: 'published', label: 'Yayında', color: 'bg-green-100 text-green-800' },
    { value: 'draft', label: 'Taslak', color: 'bg-gray-100 text-gray-800' }
  ];

  const filteredContents = contents.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         content.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         content.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || content.type === filterType;
    const matchesStatus = filterStatus === 'all' || content.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeInfo = (type: string) => {
    return contentTypes.find(t => t.value === type) || contentTypes[0];
  };

  const getStatusInfo = (status: string) => {
    return statusOptions.find(s => s.value === status) || statusOptions[0];
  };

  const handleEdit = (content: ContentItem) => {
    setEditingId(content.id);
    setEditingContent(content);
  };

  const handleSaveEdit = () => {
    if (!editingId || !editingContent.title || !editingContent.content) return;

    contentStore.updateContent(editingId, editingContent);

    setEditingId(null);
    setEditingContent({});
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingContent({});
  };

  const handleDelete = (id: string) => {
    if (confirm('Bu içeriği silmek istediğinizden emin misiniz?')) {
      contentStore.deleteContent(id);
    }
  };

  const handleStatusToggle = (id: string) => {
    const content = contentStore.getContentById(id);
    if (content) {
      contentStore.updateContent(id, {
        status: content.status === 'published' ? 'draft' : 'published'
      });
    }
  };

  const handleCreateContent = () => {
    if (!newContent.title || !newContent.content || !newContent.type) return;

    contentStore.addContent({
      type: newContent.type as any,
      title: newContent.title,
      titleEn: newContent.titleEn || newContent.title,
      content: newContent.content,
      contentEn: newContent.contentEn || newContent.content,
      slug: newContent.slug || newContent.title.toLowerCase().replace(/\s+/g, '-'),
      status: newContent.status as any || 'draft'
    });

    setNewContent({
      type: 'service',
      status: 'draft',
      title: '',
      titleEn: '',
      content: '',
      contentEn: '',
      slug: '',
      image: ''
    });
    setShowCreateForm(false);
  };

  const handleMediaUpload = (files: FileList) => {
    // Simulate file upload - in real app, this would upload to server
    Array.from(files).forEach(file => {
      const url = URL.createObjectURL(file);
      console.log('Uploaded file:', file.name, 'URL:', url);
      // In real app, you would upload to server and get back URL
    });
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
          <h1 className="text-2xl font-bold text-gray-900">İçerik Yönetimi</h1>
        </div>
        <button 
          onClick={() => setShowCreateForm(true)}
          className="btn bg-indigo-600 text-white hover:bg-indigo-700"
        >
          <PlusIcon className="w-4 h-4" />
          Yeni İçerik
        </button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Yeni İçerik Oluştur</h2>
            <button
              type="button"
              onClick={() => setShowAdvancedEditor(!showAdvancedEditor)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              {showAdvancedEditor ? 'Basit Editör' : 'Gelişmiş Editör'}
            </button>
          </div>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Başlık (Türkçe) *
                </label>
                <input
                  type="text"
                  value={newContent.title || ''}
                  onChange={(e) => setNewContent(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Başlık (İngilizce)
                </label>
                <input
                  type="text"
                  value={newContent.titleEn || ''}
                  onChange={(e) => setNewContent(prev => ({ ...prev, titleEn: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            {showAdvancedEditor ? (
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    İçerik (Türkçe) *
                  </label>
                  <RichTextEditor
                    value={newContent.content || ''}
                    onChange={(value) => setNewContent(prev => ({ ...prev, content: value }))}
                    placeholder="İçeriğinizi yazın..."
                    height="300px"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    İçerik (İngilizce)
                  </label>
                  <RichTextEditor
                    value={newContent.contentEn || ''}
                    onChange={(value) => setNewContent(prev => ({ ...prev, contentEn: value }))}
                    placeholder="Write your content..."
                    height="300px"
                  />
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    İçerik (Türkçe) *
                  </label>
                  <textarea
                    rows={4}
                    value={newContent.content || ''}
                    onChange={(e) => setNewContent(prev => ({ ...prev, content: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    İçerik (İngilizce)
                  </label>
                  <textarea
                    rows={4}
                    value={newContent.contentEn || ''}
                    onChange={(e) => setNewContent(prev => ({ ...prev, contentEn: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tür *
                </label>
                <select
                  value={newContent.type || 'service'}
                  onChange={(e) => setNewContent(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {contentTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Durum
                </label>
                <select
                  value={newContent.status || 'draft'}
                  onChange={(e) => setNewContent(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {statusOptions.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug
                </label>
                <input
                  type="text"
                  value={newContent.slug || ''}
                  onChange={(e) => setNewContent(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="otomatik-olusturulacak"
                />
              </div>
            </div>

            {/* Image URL Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Görsel URL (İsteğe Bağlı)
              </label>
              <input
                type="url"
                value={newContent.image || ''}
                onChange={(e) => setNewContent(prev => ({ ...prev, image: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Media Uploader */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medya Dosyaları
              </label>
              <MediaUploader
                onUpload={handleMediaUpload}
                acceptedTypes="image/*,.pdf,.doc,.docx"
                maxSize={5}
                multiple={true}
              />
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleCreateContent}
                disabled={!newContent.title || !newContent.content}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-colors"
              >
                Oluştur
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
        <div className="grid md:grid-cols-4 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="İçerik ara..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">Tüm Türler</option>
            {contentTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">Tüm Durumlar</option>
            {statusOptions.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
          
          <div className="text-sm text-gray-600 flex items-center">
            Toplam: {filteredContents.length} içerik
          </div>
        </div>
      </div>

      {/* Content List */}
      <div className="space-y-4">
        {filteredContents.map((content) => (
          <div key={content.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            {editingId === content.id ? (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Başlık (Türkçe)
                    </label>
                    <input
                      type="text"
                      value={editingContent.title || ''}
                      onChange={(e) => setEditingContent(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Başlık (İngilizce)
                    </label>
                    <input
                      type="text"
                      value={editingContent.titleEn || ''}
                      onChange={(e) => setEditingContent(prev => ({ ...prev, titleEn: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      İçerik (Türkçe)
                    </label>
                    <RichTextEditor
                      value={editingContent.content || ''}
                      onChange={(value) => setEditingContent(prev => ({ ...prev, content: value }))}
                      placeholder="İçeriğinizi yazın..."
                      height="250px"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      İçerik (İngilizce)
                    </label>
                    <RichTextEditor
                      value={editingContent.contentEn || ''}
                      onChange={(value) => setEditingContent(prev => ({ ...prev, contentEn: value }))}
                      placeholder="Write your content..."
                      height="250px"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Görsel URL
                  </label>
                  <input
                    type="url"
                    value={editingContent.image || ''}
                    onChange={(e) => setEditingContent(prev => ({ ...prev, image: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tür
                    </label>
                    <select
                      value={editingContent.type || ''}
                      onChange={(e) => setEditingContent(prev => ({ ...prev, type: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      {contentTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Durum
                    </label>
                    <select
                      value={editingContent.status || ''}
                      onChange={(e) => setEditingContent(prev => ({ ...prev, status: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      {statusOptions.map(status => (
                        <option key={status.value} value={status.value}>{status.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Slug
                    </label>
                    <input
                      type="text"
                      value={editingContent.slug || ''}
                      onChange={(e) => setEditingContent(prev => ({ ...prev, slug: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleSaveEdit}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
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
                <div className="flex-1 space-y-3">
                  <div className="flex items-center space-x-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${getTypeInfo(content.type).color}`}>
                      {getTypeInfo(content.type).label}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusInfo(content.status).color}`}>
                      {getStatusInfo(content.status).label}
                    </span>
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <GlobeAltIcon className="w-3 h-3" />
                      <span>TR/EN</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{content.title}</h3>
                    <p className="text-sm text-gray-500 mb-2">{content.titleEn}</p>
                    <div 
                      className="text-gray-600 line-clamp-2 prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: content.content }}
                    />
                  </div>
                  
                  {content.image && (
                    <div className="mt-3">
                      <img
                        src={content.image}
                        alt={content.title}
                        className="w-full h-32 object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-6 text-xs text-gray-500">
                    <span>Oluşturulma: {formatDate(content.createdAt)}</span>
                    <span>Güncelleme: {formatDate(content.updatedAt)}</span>
                    <span>Slug: /{content.slug}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleStatusToggle(content.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      content.status === 'published' 
                        ? 'text-green-600 hover:bg-green-50' 
                        : 'text-gray-400 hover:bg-gray-50'
                    }`}
                    title={content.status === 'published' ? 'Yayından Kaldır' : 'Yayınla'}
                  >
                    <EyeIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(content)}
                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(content.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {filteredContents.length === 0 && (
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
            <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery || filterType !== 'all' || filterStatus !== 'all' 
                ? 'İçerik bulunamadı' 
                : 'Henüz içerik yok'
              }
            </h3>
            <p className="text-gray-600">
              {searchQuery || filterType !== 'all' || filterStatus !== 'all'
                ? 'Arama kriterlerinizi değiştirerek tekrar deneyin.'
                : 'Yeni içerik eklemek için yukarıdaki butonu kullanın.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentManagementPage;