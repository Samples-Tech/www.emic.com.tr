import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCustomers } from '../../hooks/useCustomers';
import { useOrganizations } from '../../hooks/useOrganizations';
import { Customer } from '../../lib/supabase';
import { 
  UsersIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  UserIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  FolderIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';

const CustomersPage: React.FC = () => {
  const { customers, loading, error, createCustomer, updateCustomer, deleteCustomer } = useCustomers();
  const { organizations } = useOrganizations();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Partial<Customer>>({});
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({
    email: '',
    password_hash: '',
    company_name: '',
    contact_person: '',
    phone: '',
    organization_id: '',
    is_active: true
  });
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  const filteredCustomers = customers.filter(customer =>
    customer.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.contact_person.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = async () => {
    if (!newCustomer.email || !newCustomer.password_hash || !newCustomer.company_name || !newCustomer.contact_person) return;

    // Simple password hashing for demo (in production, use proper bcrypt)
    const hashedPassword = `$2a$10$dummy.hash.for.${newCustomer.password_hash}`;

    const result = await createCustomer({
      email: newCustomer.email,
      password_hash: hashedPassword,
      company_name: newCustomer.company_name,
      contact_person: newCustomer.contact_person,
      phone: newCustomer.phone || '',
      organization_id: newCustomer.organization_id || null,
      is_active: newCustomer.is_active ?? true
    });

    if (result.success) {
      setNewCustomer({
        email: '',
        password_hash: '',
        company_name: '',
        contact_person: '',
        phone: '',
        organization_id: '',
        is_active: true
      });
      setShowCreateForm(false);
    }
  };

  const handleEdit = (customer: Customer) => {
    setEditingId(customer.id);
    setEditingCustomer(customer);
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editingCustomer.email || !editingCustomer.company_name) return;

    await updateCustomer(editingId, editingCustomer);
    setEditingId(null);
    setEditingCustomer({});
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingCustomer({});
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bu müşteriyi silmek istediğinizden emin misiniz?')) {
      await deleteCustomer(id);
    }
  };

  const togglePasswordVisibility = (customerId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [customerId]: !prev[customerId]
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
          <UsersIcon className="w-8 h-8 text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-900">Müşteri Yönetimi</h1>
        </div>
        <button 
          onClick={() => setShowCreateForm(true)}
          className="btn bg-indigo-600 text-white hover:bg-indigo-700"
        >
          <PlusIcon className="w-4 h-4" />
          Yeni Müşteri
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
          <UserIcon className="w-6 h-6 text-blue-600 mt-1" />
          <div className="space-y-2">
            <h3 className="font-semibold text-blue-900">Müşteri Yönetimi - Supabase Entegrasyonu</h3>
            <p className="text-sm text-blue-800">
              Müşteriler artık Supabase database'inde saklanıyor. Organizasyon atamaları yapabilir, 
              müşteri bilgilerini güncelleyebilir ve güvenli şifre yönetimi kullanabilirsiniz.
            </p>
          </div>
        </div>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Yeni Müşteri Ekle</h2>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-posta (Giriş) *
                </label>
                <input
                  type="email"
                  value={newCustomer.email || ''}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Şifre *
                </label>
                <input
                  type="text"
                  value={newCustomer.password_hash || ''}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, password_hash: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Müşteri şifresi"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Şirket Adı *
                </label>
                <input
                  type="text"
                  value={newCustomer.company_name || ''}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, company_name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  İletişim Kişisi *
                </label>
                <input
                  type="text"
                  value={newCustomer.contact_person || ''}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, contact_person: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefon
                </label>
                <input
                  type="tel"
                  value={newCustomer.phone || ''}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organizasyon
                </label>
                <select
                  value={newCustomer.organization_id || ''}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, organization_id: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Organizasyon seçin</option>
                  {organizations.map(org => (
                    <option key={org.id} value={org.id}>{org.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={newCustomer.is_active ?? true}
                onChange={(e) => setNewCustomer(prev => ({ ...prev, is_active: e.target.checked }))}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label htmlFor="isActive" className="text-sm text-gray-700">
                Aktif müşteri
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleCreate}
                disabled={!newCustomer.email || !newCustomer.password_hash || !newCustomer.company_name || !newCustomer.contact_person}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-colors"
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

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Müşteri ara..."
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Customers List */}
      <div className="space-y-4">
        {filteredCustomers.map((customer) => (
          <div key={customer.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            {editingId === customer.id ? (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-posta
                    </label>
                    <input
                      type="email"
                      value={editingCustomer.email || ''}
                      onChange={(e) => setEditingCustomer(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Şifre
                    </label>
                    <input
                      type="text"
                      value={editingCustomer.password_hash || ''}
                      onChange={(e) => setEditingCustomer(prev => ({ ...prev, password_hash: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Şirket Adı
                    </label>
                    <input
                      type="text"
                      value={editingCustomer.company_name || ''}
                      onChange={(e) => setEditingCustomer(prev => ({ ...prev, company_name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      İletişim Kişisi
                    </label>
                    <input
                      type="text"
                      value={editingCustomer.contact_person || ''}
                      onChange={(e) => setEditingCustomer(prev => ({ ...prev, contact_person: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`isActive-${customer.id}`}
                    checked={editingCustomer.is_active ?? true}
                    onChange={(e) => setEditingCustomer(prev => ({ ...prev, is_active: e.target.checked }))}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor={`isActive-${customer.id}`} className="text-sm text-gray-700">
                    Aktif müşteri
                  </label>
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
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                      <UserIcon className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{customer.company_name}</h3>
                      <p className="text-gray-600">{customer.contact_person}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      customer.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {customer.is_active ? 'Aktif' : 'Pasif'}
                    </span>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <EnvelopeIcon className="w-4 h-4" />
                      <span>{customer.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Şifre:</span>
                      <span className="font-mono">
                        {showPasswords[customer.id] ? customer.password_hash.split('.').pop() : '••••••••'}
                      </span>
                      <button
                        onClick={() => togglePasswordVisibility(customer.id)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords[customer.id] ? (
                          <EyeSlashIcon className="w-4 h-4" />
                        ) : (
                          <EyeIcon className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {customer.phone && (
                      <div className="flex items-center space-x-2">
                        <PhoneIcon className="w-4 h-4" />
                        <span>{customer.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <BuildingOfficeIcon className="w-4 h-4" />
                      <span>{customer.organization?.name || 'Atanmamış'}</span>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Kayıt tarihi: {formatDate(customer.created_at)}
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleEdit(customer)}
                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(customer.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {filteredCustomers.length === 0 && (
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
            <UsersIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? 'Müşteri bulunamadı' : 'Henüz müşteri yok'}
            </h3>
            <p className="text-gray-600">
              {searchQuery 
                ? 'Arama kriterlerinizi değiştirerek tekrar deneyin.'
                : 'Yeni müşteri eklemek için yukarıdaki butonu kullanın.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomersPage;