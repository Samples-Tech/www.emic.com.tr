import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../../hooks/useContent';
import { contentStore } from '../../lib/contentStore';
import RichTextEditor from '../../components/RichTextEditor';
import MediaUploader from '../../components/MediaUploader';
import { 
  StarIcon,
  ChevronLeftIcon,
  PhotoIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

const HeroManagementPage: React.FC = () => {
  const { content: heroContents } = useContent('hero', 'all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingHero, setEditingHero] = useState<any>({});
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newHero, setNewHero] = useState<any>({
    title: '',
    titleEn: '',
    content: '',
    contentEn: '',
    image: '',
    status: 'published'
  });

  const currentHero = heroContents.find(hero => hero.status === 'published') || heroContents[0] || null;

  const handleCreate = () => {
    if (!newHero.title || !newHero.content) return;

    contentStore.addContent({
      type: 'hero',
      title: newHero.title,
      titleEn: newHero.titleEn || newHero.title,
      content: newHero.content,
      contentEn: newHero.contentEn || newHero.content,
      slug: 'hero-section',
      status: newHero.status,
      image: newHero.image
    });

    setNewHero({
      title: '',
      titleEn: '',
      content: '',
      contentEn: '',
      image: '',
      status: 'published'
    });
    setShowCreateForm(false);
  };

  const handleEdit = (hero: any) => {
    setEditingId(hero.id);
    setEditingHero(hero);
  };

  const handleSaveEdit = () => {
    if (!editingId || !editingHero.title || !editingHero.content) return;

    contentStore.updateContent(editingId, editingHero);
    setEditingId(null);
    setEditingHero({});
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingHero({});
  };

  const handleDelete = (id: string) => {
    if (confirm('Bu hero içeriğini silmek istediğinizden emin misiniz?')) {
      contentStore.deleteContent(id);
    }
  };

  const handleStatusToggle = (id: string) => {
    const hero = heroContents.find(h => h.id === id);
    if (hero) {
      contentStore.updateContent(id, {
        status: hero.status === 'published' ? 'draft' : 'published'
      });
    }
  };

  const handleMediaUpload = (files: FileList) => {
    // Simulate file upload - in real app, this would upload to server
    Array.from(files).forEach(file => {
      const url = URL.createObjectURL(file);
      console.log('Uploaded file:', file.name, 'URL:', url);
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
          <StarIcon className="w-8 h-8 text-yellow-600" />
          <h1 className="text-2xl font-bold text-gray-900">Ana Sayfa Hero Yönetimi</h1>
        </div>
        <button 
          onClick={() => setShowCreateForm(true)}
          className="btn bg-yellow-600 text-white hover:bg-yellow-700"
        >
          <StarIcon className="w-4 h-4" />
          Yeni Hero İçeriği
        </button>
      </div>

      {/* Current Hero Preview */}
      {currentHero && (
        <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white rounded-2xl p-8">
          <div className="mb-4">
            <span className="bg-yellow-500 text-yellow-900 px-3 py-1 rounded-full text-sm font-medium">
              Aktif Hero İçeriği
            </span>
          </div>
          <h2 className="text-3xl font-bold mb-4">{currentHero.title}</h2>
          <p className="text-xl text-blue-100 mb-6">{currentHero.content}</p>
          <div className="text-sm text-blue-200">
            Son güncelleme: {formatDate(currentHero.updatedAt)}
          </div>
        </div>
      )}

      {/* Create Form */}
      {showCreateForm && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Yeni Hero İçeriği Oluştur</h2>
          </div>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ana Başlık (Türkçe) *
                </label>
                <input
                  type="text"
                  value={newHero.title}
                  onChange={(e) => setNewHero(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Endüstriyel Muayene ve Test Hizmetlerinde..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ana Başlık (İngilizce)
                </label>
                <input
                  type="text"
                  value={newHero.titleEn}
                  onChange={(e) => setNewHero(prev => ({ ...prev, titleEn: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Industrial Inspection and Testing Services..."
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Açıklama (Türkçe) *
                </label>
                <RichTextEditor
                  value={newHero.content}
                  onChange={(value) => setNewHero(prev => ({ ...prev, content: value }))}
                  placeholder="25+ yıllık deneyimimiz ile..."
                  height="200px"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Açıklama (İngilizce)
                </label>
                <RichTextEditor
                  value={newHero.contentEn}
                  onChange={(value) => setNewHero(prev => ({ ...prev, contentEn: value }))}
                  placeholder="With 25+ years of experience..."
                  height="200px"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Arka Plan Görseli URL
                </label>
                <input
                  type="url"
                  value={newHero.image}
                  onChange={(e) => setNewHero(prev => ({ ...prev, image: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="https://example.com/hero-bg.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Durum
                </label>
                <select
                  value={newHero.status}
                  onChange={(e) => setNewHero(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="published">Yayında</option>
                  <option value="draft">Taslak</option>
                </select>
              </div>
            </div>

            {/* Media Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medya Dosyaları
              </label>
              <MediaUploader
                onUpload={handleMediaUpload}
                acceptedTypes="image/*"
                maxSize={5}
                multiple={false}
              />
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleCreate}
                disabled={!newHero.title || !newHero.content}
                className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:bg-gray-400 transition-colors"
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

      {/* Hero Contents List */}
      <div className="space-y-4">
        {heroContents.map((hero) => (
          <div key={hero.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            {editingId === hero.id ? (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ana Başlık (Türkçe)
                    </label>
                    <input
                      type="text"
                      value={editingHero.title || ''}
                      onChange={(e) => setEditingHero(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ana Başlık (İngilizce)
                    </label>
                    <input
                      type="text"
                      value={editingHero.titleEn || ''}
                      onChange={(e) => setEditingHero(prev => ({ ...prev, titleEn: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Açıklama (Türkçe)
                    </label>
                    <RichTextEditor
                      value={editingHero.content || ''}
                      onChange={(value) => setEditingHero(prev => ({ ...prev, content: value }))}
                      placeholder="İçeriğinizi yazın..."
                      height="250px"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Açıklama (İngilizce)
                    </label>
                    <RichTextEditor
                      value={editingHero.contentEn || ''}
                      onChange={(value) => setEditingHero(prev => ({ ...prev, contentEn: value }))}
                      placeholder="Write your content..."
                      height="250px"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleSaveEdit}
                    className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
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
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      hero.status === 'published' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {hero.status === 'published' ? 'Yayında' : 'Taslak'}
                    </span>
                    {hero.status === 'published' && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                        Aktif Hero
                      </span>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{hero.title}</h3>
                    <p className="text-sm text-gray-500 mb-2">{hero.titleEn}</p>
                    <div 
                      className="text-gray-600 line-clamp-2 prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: hero.content }}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-6 text-xs text-gray-500">
                    <span>Oluşturulma: {formatDate(hero.createdAt)}</span>
                    <span>Güncelleme: {formatDate(hero.updatedAt)}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleStatusToggle(hero.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      hero.status === 'published' 
                        ? 'text-green-600 hover:bg-green-50' 
                        : 'text-gray-400 hover:bg-gray-50'
                    }`}
                    title={hero.status === 'published' ? 'Yayından Kaldır' : 'Yayınla'}
                  >
                    <EyeIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(hero)}
                    className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(hero.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {heroContents.length === 0 && (
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
            <StarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz hero içeriği yok</h3>
            <p className="text-gray-600">
              Yeni hero içeriği eklemek için yukarıdaki butonu kullanın.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroManagementPage;