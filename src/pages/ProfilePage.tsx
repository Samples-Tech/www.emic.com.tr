import React, { useState, useEffect } from 'react';
import { UserIcon } from '@heroicons/react/24/outline';
import TwoFactorSetup from '../components/TwoFactorSetup';

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  useEffect(() => {
    // In a real app, fetch user data from API
    setUser({
      email: 'admin@emic.test',
      role: 'ADMIN',
      organizationId: null,
      twoFactorEnabled: false
    });
    setTwoFactorEnabled(false);
  }, []);

  const handleTwoFactorToggle = (enabled: boolean) => {
    setTwoFactorEnabled(enabled);
    if (user) {
      setUser({ ...user, twoFactorEnabled: enabled });
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-gray-500">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <UserIcon className="w-8 h-8 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">Profil Ayarları</h1>
      </div>

      {/* User Info */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hesap Bilgileri</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
            <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-600">
              {user.email}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
            <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-600">
              {user.role}
            </div>
          </div>
        </div>
      </div>

      {/* 2FA Setup */}
      <TwoFactorSetup 
        isEnabled={twoFactorEnabled} 
        onToggle={handleTwoFactorToggle} 
      />

      {/* API Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">API Endpoints</h3>
        <div className="space-y-2 text-sm text-blue-800">
          <div><code className="bg-blue-100 px-2 py-1 rounded">POST /auth/2fa/setup</code> - 2FA kurulumu (QR kod döner)</div>
          <div><code className="bg-blue-100 px-2 py-1 rounded">POST /auth/2fa/enable</code> - 2FA etkinleştirme</div>
          <div><code className="bg-blue-100 px-2 py-1 rounded">POST /auth/2fa/disable</code> - 2FA devre dışı bırakma</div>
          <div><code className="bg-blue-100 px-2 py-1 rounded">GET /documents</code> - Belge listesi (sayfalama + filtreler)</div>
          <div><code className="bg-blue-100 px-2 py-1 rounded">GET /documents/bulk-download</code> - Toplu ZIP indirme</div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;