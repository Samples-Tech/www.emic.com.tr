import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUserProfiles, useOrganizations } from '../../hooks/useOrganizations';
import { useAuth } from '../../hooks/useAuth';
import { 
  UsersIcon,
  ChevronLeftIcon,
  UserIcon,
  BuildingOfficeIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const UsersPage: React.FC = () => {
  const { organizations } = useOrganizations();
  const { profiles, loading, error, updateProfile } = useUserProfiles();
  const { isAdmin } = useAuth();

  const roleOptions = [
    { value: 'admin', label: 'Admin', color: 'bg-red-100 text-red-800' },
    { value: 'manager', label: 'Yönetici', color: 'bg-purple-100 text-purple-800' },
    { value: 'editor', label: 'Editör', color: 'bg-blue-100 text-blue-800' },
    { value: 'customer', label: 'Müşteri', color: 'bg-green-100 text-green-800' }
  ];

  const getRoleInfo = (role: string) => {
    return roleOptions.find(opt => opt.value === role) || roleOptions[3];
  };

  const handleOrganizationChange = async (userId: string, organizationId: string) => {
    await updateProfile(userId, {
      organization_id: organizationId || null
    });
  };

  const handleRoleChange = async (userId: string, role: string) => {
    await updateProfile(userId, {
      role: role as any
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-red-600">Bu sayfaya erişim yetkiniz yok.</div>
      </div>
    );
  }

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
          <UsersIcon className="w-8 h-8 text-orange-600" />
          <h1 className="text-2xl font-bold text-gray-900">Kullanıcılar</h1>
        </div>
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
          <ShieldCheckIcon className="w-6 h-6 text-blue-600 mt-1" />
          <div className="space-y-2">
            <h3 className="font-semibold text-blue-900">Kullanıcı Yönetimi</h3>
            <p className="text-sm text-blue-800">
              Bu sayfada Supabase Auth ile kayıtlı kullanıcıları görüntüleyebilir ve organizasyon atamalarını yönetebilirsiniz.
            </p>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="space-y-3">
        {profiles.map((user) => (
          <div key={user.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1 space-y-3">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-gray-900">{user.email}</h3>
                      {user.full_name && (
                        <span className="text-gray-600">({user.full_name})</span>
                      )}
                      <span className={`text-xs px-2 py-1 rounded-full ${getRoleInfo(user.role).color}`}>
                        {getRoleInfo(user.role).label}
                      </span>
                      {user.two_factor_enabled && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center space-x-1">
                          <ShieldCheckIcon className="w-3 h-3" />
                          <span>2FA</span>
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      Kayıt tarihi: {formatDate(user.created_at)}
                      {user.last_login_at && (
                        <span className="ml-4">Son giriş: {formatDate(user.last_login_at)}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">Rol:</span>
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {roleOptions.map(role => (
                        <option key={role.value} value={role.value}>{role.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">Organizasyon:</span>
                    <select
                      value={user.organization_id || ''}
                      onChange={(e) => handleOrganizationChange(user.id, e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">— Organizasyon atanmamış —</option>
                      {organizations.map(org => (
                        <option key={org.id} value={org.id}>{org.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {profiles.length === 0 && (
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
            <UsersIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz kullanıcı yok</h3>
            <p className="text-gray-600">
              Sistem henüz kullanıcı içermiyor. Kullanıcılar Supabase Auth ile kayıt olabilir.
            </p>
          </div>
        )}
      </div>

      {/* Role Legend */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Rol Açıklamaları</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {roleOptions.map((role) => (
            <div key={role.value} className="flex items-center space-x-3">
              <span className={`text-xs px-2 py-1 rounded-full ${role.color}`}>
                {role.label}
              </span>
              <span className="text-sm text-gray-600">
                {role.value === 'admin' && 'Sistem yöneticisi - Tüm yetkilere sahip'}
                {role.value === 'manager' && 'Yönetici - Organizasyon ve proje yönetimi'}
                {role.value === 'editor' && 'Editör - Belge düzenleme ve yönetim'}
                {role.value === 'customer' && 'Müşteri - Sadece kendi belgelerini görüntüleme'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UsersPage;