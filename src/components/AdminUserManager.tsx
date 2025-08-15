import React, { useState } from 'react';
import { 
  UserPlusIcon,
  UsersIcon,
  KeyIcon,
  ShieldCheckIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import PasswordGenerator from './PasswordGenerator';
import { generateSecurePassword, validatePassword } from '../utils/passwordGenerator';

interface AdminUser {
  id: string;
  email: string;
  password: string;
  fullName: string;
  role: 'admin' | 'manager' | 'editor';
  phone?: string;
  organizationId?: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

interface AdminUserManagerProps {
  organizations?: any[];
}

const AdminUserManager: React.FC<AdminUserManagerProps> = ({ organizations = [] }) => {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() => {
    const stored = localStorage.getItem('emic_admin_users');
    return stored ? JSON.parse(stored) : [];
  });

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showPasswordGenerator, setShowPasswordGenerator] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'editor' as 'admin' | 'manager' | 'editor',
    phone: '',
    organizationId: ''
  });

  const roleOptions = [
    { value: 'admin', label: 'Sistem Yöneticisi', description: 'Tüm yetkilere sahip', color: 'bg-red-100 text-red-800' },
    { value: 'manager', label: 'Yönetici', description: 'Organizasyon ve proje yönetimi', color: 'bg-purple-100 text-purple-800' },
    { value: 'editor', label: 'Editör', description: 'İçerik düzenleme yetkisi', color: 'bg-blue-100 text-blue-800' }
  ];

  const saveToStorage = (users: AdminUser[]) => {
    localStorage.setItem('emic_admin_users', JSON.stringify(users));
  };

  const handleCreateUser = () => {
    if (!newUser.email || !newUser.password || !newUser.fullName) {
      alert('Lütfen tüm zorunlu alanları doldurun');
      return;
    }

    const validation = validatePassword(newUser.password);
    if (!validation.isValid) {
      alert('Şifre gereksinimleri: ' + validation.errors.join(', '));
      return;
    }

    const user: AdminUser = {
      id: Date.now().toString(),
      email: newUser.email,
      password: newUser.password,
      fullName: newUser.fullName,
      role: newUser.role,
      phone: newUser.phone,
      organizationId: newUser.organizationId,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    const updatedUsers = [...adminUsers, user];
    setAdminUsers(updatedUsers);
    saveToStorage(updatedUsers);

    // Reset form
    setNewUser({
      email: '',
      password: '',
      fullName: '',
      role: 'editor',
      phone: '',
      organizationId: ''
    });
    setShowCreateForm(false);

    alert('Yönetici kullanıcı başarıyla oluşturuldu!');
  };

  const handleGeneratePassword = () => {
    const password = generateSecurePassword(12);
    setNewUser(prev => ({ ...prev, password }));
  };

  const handleDeleteUser = (id: string) => {
    if (confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
      const updatedUsers = adminUsers.filter(user => user.id !== id);
      setAdminUsers(updatedUsers);
      saveToStorage(updatedUsers);
    }
  };

  const handleToggleActive = (id: string) => {
    const updatedUsers = adminUsers.map(user =>
      user.id === id ? { ...user, isActive: !user.isActive } : user
    );
    setAdminUsers(updatedUsers);
    saveToStorage(updatedUsers);
  };

  const getRoleInfo = (role: string) => {
    return roleOptions.find(r => r.value === role) || roleOptions[2];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
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
          <ShieldCheckIcon className="w-8 h-8 text-red-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Yönetici Kullanıcıları</h2>
            <p className="text-gray-600">Admin paneli erişim yetkisi olan kullanıcılar</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowPasswordGenerator(!showPasswordGenerator)}
            className="btn bg-yellow-600 text-white hover:bg-yellow-700"
          >
            <KeyIcon className="w-4 h-4" />
            Şifre Oluşturucu
          </button>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="btn bg-red-600 text-white hover:bg-red-700"
          >
            <UserPlusIcon className="w-4 h-4" />
            Yeni Yönetici
          </button>
        </div>
      </div>

      {/* Password Generator */}
      {showPasswordGenerator && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <PasswordGenerator 
            onPasswordGenerated={(password) => {
              setNewUser(prev => ({ ...prev, password }));
              setShowPasswordGenerator(false);
            }}
            showCopyButton={true}
            showValidation={true}
          />
        </div>
      )}

      {/* Create Form */}
      {showCreateForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Yeni Yönetici Kullanıcı Oluştur</h3>
          
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-posta Adresi *
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="admin@emic.com.tr"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ad Soyad *
                </label>
                <input
                  type="text"
                  value={newUser.fullName}
                  onChange={(e) => setNewUser(prev => ({ ...prev, fullName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Yönetici Adı"
                  required
                />
              </div>
            </div>

            {/* Role and Organization */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Yetki Seviyesi *
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  {roleOptions.map(role => (
                    <option key={role.value} value={role.value}>
                      {role.label} - {role.description}
                    </option>
                  ))}
                </select>
              </div>
              {organizations.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organizasyon
                  </label>
                  <select
                    value={newUser.organizationId}
                    onChange={(e) => setNewUser(prev => ({ ...prev, organizationId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Organizasyon seçin (isteğe bağlı)</option>
                    {organizations.map(org => (
                      <option key={org.id} value={org.id}>{org.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Contact Info */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefon
              </label>
              <input
                type="tel"
                value={newUser.phone}
                onChange={(e) => setNewUser(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="+90 5xx xxx xx xx"
              />
            </div>

            {/* Password Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Şifre *
                </label>
                <button
                  type="button"
                  onClick={handleGeneratePassword}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Otomatik Oluştur
                </button>
              </div>
              <input
                type="text"
                value={newUser.password}
                onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent font-mono"
                placeholder="Güvenli şifre girin veya otomatik oluşturun"
                required
              />
              {newUser.password && (
                <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                  💡 Bu şifreyi güvenli bir yerde saklayın ve kullanıcıya iletin.
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4 pt-6 border-t border-gray-200">
              <button
                onClick={handleCreateUser}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Yönetici Oluştur
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

      {/* Users List */}
      <div className="space-y-4">
        {adminUsers.map((user) => {
          const roleInfo = getRoleInfo(user.role);
          
          return (
            <div key={user.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <ShieldCheckIcon className="w-6 h-6 text-red-600" />
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-gray-900">{user.fullName}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${roleInfo.color}`}>
                        {roleInfo.label}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive ? 'Aktif' : 'Pasif'}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>E-posta: {user.email}</div>
                      {user.phone && <div>Telefon: {user.phone}</div>}
                      {user.organizationId && organizations.length > 0 && (
                        <div>
                          Organizasyon: {organizations.find(org => org.id === user.organizationId)?.name || 'Bilinmiyor'}
                        </div>
                      )}
                      <div>Oluşturulma: {formatDate(user.createdAt)}</div>
                      {user.lastLogin && <div>Son Giriş: {formatDate(user.lastLogin)}</div>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleToggleActive(user.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      user.isActive 
                        ? 'text-green-600 hover:bg-green-50' 
                        : 'text-red-600 hover:bg-red-50'
                    }`}
                    title={user.isActive ? 'Pasif Yap' : 'Aktif Yap'}
                  >
                    {user.isActive ? (
                      <EyeIcon className="w-4 h-4" />
                    ) : (
                      <EyeSlashIcon className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => setEditingUser(user)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {adminUsers.length === 0 && (
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
            <UsersIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz yönetici kullanıcı yok</h3>
            <p className="text-gray-600">
              İlk yönetici kullanıcıyı oluşturmak için yukarıdaki butonu kullanın.
            </p>
          </div>
        )}
      </div>

      {/* Role Permissions Info */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Yetki Seviyeleri</h3>
        <div className="space-y-3">
          {roleOptions.map((role) => (
            <div key={role.value} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <span className={`text-xs px-2 py-1 rounded-full ${role.color} mt-1`}>
                {role.label}
              </span>
              <div className="flex-1">
                <p className="text-sm text-gray-900 font-medium">{role.description}</p>
                <div className="text-xs text-gray-600 mt-1">
                  {role.value === 'admin' && '• Tüm sistem ayarları • Kullanıcı yönetimi • Organizasyon yönetimi'}
                  {role.value === 'manager' && '• Proje yönetimi • Müşteri yönetimi • Belge yönetimi'}
                  {role.value === 'editor' && '• İçerik düzenleme • Sayfa yönetimi • Medya yönetimi'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminUserManager;