import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { contentStore } from '../../lib/contentStore';
import { 
  FlaskRoundIcon as Flask,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  EyeIcon,
  EyeSlashIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';

interface LaboratoryTest {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  method: string;
  methodEn: string;
  equipment: string;
  equipmentEn: string;
  standards: string;
  standardsEn: string;
  category: string;
  categoryEn: string;
  duration: string;
  durationEn: string;
  sampleRequirements: string;
  sampleRequirementsEn: string;
  reportFormat: string;
  reportFormatEn: string;
  order: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

const LaboratoryTestsPage: React.FC = () => {
  const [tests, setTests] = useState<LaboratoryTest[]>(contentStore.getLaboratoryTests('all'));
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTest, setEditingTest] = useState<Partial<LaboratoryTest>>({});
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTest, setNewTest] = useState<Partial<LaboratoryTest>>({
    name: '',
    nameEn: '',
    description: '',
    descriptionEn: '',
    method: '',
    methodEn: '',
    equipment: '',
    equipmentEn: '',
    standards: '',
    standardsEn: '',
    category: '',
    categoryEn: '',
    duration: '',
    durationEn: '',
    sampleRequirements: '',
    sampleRequirementsEn: '',
    reportFormat: '',
    reportFormatEn: '',
    order: 1,
    status: 'active'
  });

  React.useEffect(() => {
    const unsubscribe = contentStore.subscribe(() => {
      setTests(contentStore.getLaboratoryTests('all'));
    });
    return unsubscribe;
  }, []);

  const statusOptions = [
    { value: 'active', label: 'Aktif', color: 'bg-green-100 text-green-800' },
    { value: 'inactive', label: 'Pasif', color: 'bg-gray-100 text-gray-800' }
  ];

  const categories = [
    'Mekanik Testler',
    'Kimyasal Testler',
    'Mikroyapı Testleri',
    'Korozyon Testleri',
    'Termal Testler'
  ];

  const filteredTests = tests.filter(test => {
    const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         test.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         test.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || test.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusInfo = (status: string) => {
    return statusOptions.find(s => s.value === status) || statusOptions[0];
  };

  const handleCreate = () => {
    if (!newTest.name?.trim() || !newTest.description?.trim()) return;

    contentStore.addLaboratoryTest({
      name: newTest.name.trim(),
      nameEn: newTest.nameEn?.trim() || newTest.name.trim(),
      description: newTest.description.trim(),
      descriptionEn: newTest.descriptionEn?.trim() || newTest.description.trim(),
      method: newTest.method?.trim() || '',
      methodEn: newTest.methodEn?.trim() || newTest.method?.trim() || '',
      equipment: newTest.equipment?.trim() || '',
      equipmentEn: newTest.equipmentEn?.trim() || newTest.equipment?.trim() || '',
      standards: newTest.standards?.trim() || '',
      standardsEn: newTest.standardsEn?.trim() || newTest.standards?.trim() || '',
      category: newTest.category?.trim() || 'Mekanik Testler',
      categoryEn: newTest.categoryEn?.trim() || 'Mechanical Tests',
      duration: newTest.duration?.trim() || '',
      durationEn: newTest.durationEn?.trim() || newTest.duration?.trim() || '',
      sampleRequirements: newTest.sampleRequirements?.trim() || '',
      sampleRequirementsEn: newTest.sampleRequirementsEn?.trim() || newTest.sampleRequirements?.trim() || '',
      reportFormat: newTest.reportFormat?.trim() || '',
      reportFormatEn: newTest.reportFormatEn?.trim() || newTest.reportFormat?.trim() || '',
      order: parseInt(newTest.order?.toString() || '1') || 1,
      status: newTest.status || 'active'
    });

    setNewTest({
      name: '',
      nameEn: '',
      description: '',
      descriptionEn: '',
      method: '',
      methodEn: '',
      equipment: '',
      equipmentEn: '',
      standards: '',
      standardsEn: '',
      category: '',
      categoryEn: '',
      duration: '',
      durationEn: '',
      sampleRequirements: '',
      sampleRequirementsEn: '',
      reportFormat: '',
      reportFormatEn: '',
      order: 1,
      status: 'active'
    });
    setShowCreateForm(false);
  };

  const handleEdit = (test: LaboratoryTest) => {
    setEditingId(test.id);
    setEditingTest(test);
  };

  const handleSaveEdit = () => {
    if (!editingId || !editingTest.name || !editingTest.description) return;

    contentStore.updateLaboratoryTest(editingId, editingTest);
    setEditingId(null);
    setEditingTest({});
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingTest({});
  };

  const handleDelete = (id: string) => {
    if (confirm('Bu testi silmek istediğinizden emin misiniz?')) {
      contentStore.deleteLaboratoryTest(id);
    }
  };

  const handleStatusToggle = (id: string) => {
    const test = tests.find(t => t.id === id);
    if (test) {
      contentStore.updateLaboratoryTest(id, {
        status: test.status === 'active' ? 'inactive' : 'active'
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
          <BeakerIcon className="w-8 h-8 text-orange-600" />
          <h1 className="text-2xl font-bold text-gray-900">Laboratuvar Testleri</h1>
        </div>
        <button 
          onClick={() => setShowCreateForm(true)}
          className="btn bg-orange-600 text-white hover:bg-orange-700"
        >
          <PlusIcon className="w-4 h-4" />
          Yeni Test
        </button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Yeni Test Ekle</h2>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Test Adı (Türkçe) *
                </label>
                <input
                  type="text"
                  value={newTest.name || ''}
                  onChange={(e) => setNewTest(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Test Adı (İngilizce)
                </label>
                <input
                  type="text"
                  value={newTest.nameEn || ''}
                  onChange={(e) => setNewTest(prev => ({ ...prev, nameEn: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                  value={newTest.description || ''}
                  onChange={(e) => setNewTest(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Açıklama (İngilizce)
                </label>
                <textarea
                  rows={3}
                  value={newTest.descriptionEn || ''}
                  onChange={(e) => setNewTest(prev => ({ ...prev, descriptionEn: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori
                </label>
                <select
                  value={newTest.category || ''}
                  onChange={(e) => setNewTest(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Kategori seçin</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Süre
                </label>
                <input
                  type="text"
                  value={newTest.duration || ''}
                  onChange={(e) => setNewTest(prev => ({ ...prev, duration: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="1-2 iş günü"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Yöntem
                </label>
                <textarea
                  rows={2}
                  value={newTest.method || ''}
                  onChange={(e) => setNewTest(prev => ({ ...prev, method: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ekipman
                </label>
                <textarea
                  rows={2}
                  value={newTest.equipment || ''}
                  onChange={(e) => setNewTest(prev => ({ ...prev, equipment: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Standartlar
                </label>
                <input
                  type="text"
                  value={newTest.standards || ''}
                  onChange={(e) => setNewTest(prev => ({ ...prev, standards: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="ASTM, EN, TS"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sıralama
                </label>
                <input
                  type="number"
                  value={newTest.order || 1}
                  onChange={(e) => setNewTest(prev => ({ ...prev, order: parseInt(e.target.value) || 1 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Durum
                </label>
                <select
                  value={newTest.status || 'active'}
                  onChange={(e) => setNewTest(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                disabled={!newTest.name?.trim() || !newTest.description?.trim()}
                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-400 transition-colors"
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
              placeholder="Test ara..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="all">Tüm Durumlar</option>
            {statusOptions.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
          
          <div className="text-sm text-gray-600 flex items-center">
            Toplam: {filteredTests.length} test
          </div>
        </div>
      </div>

      {/* Tests List */}
      <div className="space-y-4">
        {filteredTests.map((test) => (
          <div key={test.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            {editingId === test.id ? (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Test Adı (Türkçe)
                    </label>
                    <input
                      type="text"
                      value={editingTest.name || ''}
                      onChange={(e) => setEditingTest(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Test Adı (İngilizce)
                    </label>
                    <input
                      type="text"
                      value={editingTest.nameEn || ''}
                      onChange={(e) => setEditingTest(prev => ({ ...prev, nameEn: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                      value={editingTest.description || ''}
                      onChange={(e) => setEditingTest(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Açıklama (İngilizce)
                    </label>
                    <textarea
                      rows={3}
                      value={editingTest.descriptionEn || ''}
                      onChange={(e) => setEditingTest(prev => ({ ...prev, descriptionEn: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleSaveEdit}
                    className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
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
                    <h3 className="text-lg font-semibold text-gray-900">{test.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusInfo(test.status).color}`}>
                      {getStatusInfo(test.status).label}
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {test.category}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>İngilizce: {test.nameEn}</div>
                    <div>Açıklama: {test.description}</div>
                    {test.method && <div>Yöntem: {test.method}</div>}
                    {test.equipment && <div>Ekipman: {test.equipment}</div>}
                    {test.standards && <div>Standartlar: {test.standards}</div>}
                    {test.duration && <div>Süre: {test.duration}</div>}
                    <div>Sıralama: {test.order}</div>
                    <div>Oluşturulma: {formatDate(test.createdAt)}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleStatusToggle(test.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      test.status === 'active' 
                        ? 'text-green-600 hover:bg-green-50' 
                        : 'text-gray-400 hover:bg-gray-50'
                    }`}
                    title={test.status === 'active' ? 'Pasif Yap' : 'Aktif Yap'}
                  >
                    {test.status === 'active' ? (
                      <EyeIcon className="w-4 h-4" />
                    ) : (
                      <EyeSlashIcon className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleEdit(test)}
                    className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(test.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {filteredTests.length === 0 && (
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
            <BeakerIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery || filterStatus !== 'all' 
                ? 'Test bulunamadı' 
                : 'Henüz test yok'
              }
            </h3>
            <p className="text-gray-600">
              {searchQuery || filterStatus !== 'all'
                ? 'Arama kriterlerinizi değiştirerek tekrar deneyin.'
                : 'Yeni test eklemek için yukarıdaki butonu kullanın.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LaboratoryTestsPage;