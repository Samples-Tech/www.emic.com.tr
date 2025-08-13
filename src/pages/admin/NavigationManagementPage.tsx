import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bars3Icon,
  ChevronLeftIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';

interface NavigationItem {
  id: string;
  name: string;
  nameEn: string;
  href: string;
  order: number;
  isActive: boolean;
}

const NavigationManagementPage: React.FC = () => {
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>([
    { id: '1', name: 'Ana Sayfa', nameEn: 'Home', href: '/', order: 1, isActive: true },
    { id: '2', name: 'Hizmetlerimiz', nameEn: 'Services', href: '/services', order: 2, isActive: true },
    { id: '3', name: 'Hakkımızda', nameEn: 'About', href: '/about', order: 3, isActive: true },
    { id: '4', name: 'Laboratuvar', nameEn: 'Laboratory', href: '/laboratory', order: 4, isActive: true },
    { id: '5', name: 'Dökümanlar', nameEn: 'Documents', href: '/documents', order: 5, isActive: true },
    { id: '6', name: 'İletişim', nameEn: 'Contact', href: '/contact', order: 6, isActive: true }
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<Partial<NavigationItem>>({});
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newItem, setNewItem] = useState<Partial<NavigationItem>>({
    name: '',
    nameEn: '',
    href: '',
    order: navigationItems.length + 1,
    isActive: true
  });

  const handleCreate = () => {
    if (!newItem.name || !newItem.href) return;

    const item: NavigationItem = {
      id: Date.now().toString(),
      name: newItem.name,
      nameEn: newItem.nameEn || newItem.name,
      href: newItem.href,
      order: newItem.order || navigationItems.length + 1,
      isActive: newItem.isActive ?? true
    };

    setNavigationItems(prev => [...prev, item].sort((a, b) => a.order - b.order));
    setNewItem({
      name: '',
      nameEn: '',
      href: '',
      order: navigationItems.length + 2,
      isActive: true
    });
    setShowCreateForm(false);
  };

  const handleEdit = (item: NavigationItem) => {
    setEditingId(item.id);
    setEditingItem(item);
  };

  const handleSaveEdit = () => {
    if (!editingId || !editingItem.name || !editingItem.href) return;

    setNavigationItems(prev =>
      prev.map(item =>
        item.id === editingId
          ? { ...item, ...editingItem }
          : item
      ).sort((a, b) => a.order - b.order)
    );

    setEditingId(null);
    setEditingItem({});
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingItem({});
  };

  const handleDelete = (id: string) => {
    if (confirm('Bu menü öğesini silmek istediğinizden emin misiniz?')) {
      setNavigationItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleToggleActive = (id: string) => {
    setNavigationItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, isActive: !item.isActive }
          : item
      )
    );
  };

  const handleMoveUp = (id: string) => {
    setNavigationItems(prev => {
      const items = [...prev];
      const index = items.findIndex(item => item.id === id);
      if (index > 0) {
        const temp = items[index].order;
        items[index].order = items[index - 1].order;
        items[index - 1].order = temp;
      }
      return items.sort((a, b) => a.order - b.order);
    });
  };

  const handleMoveDown = (id: string) => {
    setNavigationItems(prev => {
      const items = [...prev];
      const index = items.findIndex(item => item.id === id);
      if (index < items.length - 1) {
        const temp = items[index].order;
        items[index].order = items[index + 1].order;
        items[index + 1].order = temp;
      }
      return items.sort((a, b) => a.order - b.order);
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
          <Bars3Icon className="w-8 h-8 text-green-600" />
          <h1 className="text-2xl font-bold text-gray-900">Navigasyon Menüsü</h1>
        </div>
        <button 
          onClick={() => setShowCreateForm(true)}
          className="btn bg-green-600 text-white hover:bg-green-700"
        >
          <PlusIcon className="w-4 h-4" />
          Yeni Menü Öğesi
        </button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Yeni Menü Öğesi Ekle</h2>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Menü Adı (Türkçe) *
                </label>
                <input
                  type="text"
                  value={newItem.name || ''}
                  onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Menü Adı (İngilizce)
                </label>
                <input
                  type="text"
                  value={newItem.nameEn || ''}
                  onChange={(e) => setNewItem(prev => ({ ...prev, nameEn: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL *
                </label>
                <input
                  type="text"
                  value={newItem.href || ''}
                  onChange={(e) => setNewItem(prev => ({ ...prev, href: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="/sayfa-adi"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sıralama
                </label>
                <input
                  type="number"
                  value={newItem.order || navigationItems.length + 1}
                  onChange={(e) => setNewItem(prev => ({ ...prev, order: parseInt(e.target.value) || 1 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  min="1"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={newItem.isActive ?? true}
                onChange={(e) => setNewItem(prev => ({ ...prev, isActive: e.target.checked }))}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <label htmlFor="isActive" className="text-sm text-gray-700">
                Aktif menü öğesi
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleCreate}
                disabled={!newItem.name || !newItem.href}
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

      {/* Navigation Items List */}
      <div className="space-y-4">
        {navigationItems.map((item, index) => (
          <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            {editingId === item.id ? (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Menü Adı (Türkçe)
                    </label>
                    <input
                      type="text"
                      value={editingItem.name || ''}
                      onChange={(e) => setEditingItem(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Menü Adı (İngilizce)
                    </label>
                    <input
                      type="text"
                      value={editingItem.nameEn || ''}
                      onChange={(e) => setEditingItem(prev => ({ ...prev, nameEn: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL
                    </label>
                    <input
                      type="text"
                      value={editingItem.href || ''}
                      onChange={(e) => setEditingItem(prev => ({ ...prev, href: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sıralama
                    </label>
                    <input
                      type="number"
                      value={editingItem.order || 1}
                      onChange={(e) => setEditingItem(prev => ({ ...prev, order: parseInt(e.target.value) || 1 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      min="1"
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
              <div className="flex items-center justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-semibold text-gray-900">{item.name}</span>
                    <span className="text-sm text-gray-500">({item.nameEn})</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      item.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item.isActive ? 'Aktif' : 'Pasif'}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      Sıra: {item.order}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    URL: <code className="bg-gray-100 px-1 rounded">{item.href}</code>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleMoveUp(item.id)}
                    disabled={index === 0}
                    className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Yukarı taşı"
                  >
                    <ArrowUpIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleMoveDown(item.id)}
                    disabled={index === navigationItems.length - 1}
                    className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Aşağı taşı"
                  >
                    <ArrowDownIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleToggleActive(item.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      item.isActive 
                        ? 'text-green-600 hover:bg-green-50' 
                        : 'text-red-600 hover:bg-red-50'
                    }`}
                    title={item.isActive ? 'Pasif Yap' : 'Aktif Yap'}
                  >
                    {item.isActive ? 'Gizle' : 'Göster'}
                  </button>
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {navigationItems.length === 0 && (
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
            <Bars3Icon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz menü öğesi yok</h3>
            <p className="text-gray-600">
              Yeni menü öğesi eklemek için yukarıdaki butonu kullanın.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavigationManagementPage;