import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useOrganizations } from '../../hooks/useOrganizations';
import AdminUserManager from '../../components/AdminUserManager';
import { 
  UsersIcon,
  ChevronLeftIcon,
  UserIcon,
  BuildingOfficeIcon,
  ShieldCheckIcon,
  PlusIcon,
  KeyIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

const UsersPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const { organizations } = useOrganizations();
  
  const [users, setUsers] = useState<any[]>(() => {
    const storedUsers = localStorage.getItem('emic_admin_users');
    return storedUsers ? JSON.parse(storedUsers) : [];
  });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showPasswordGenerator, setShowPasswordGenerator] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const roleOptions = [
    { value: 'admin', label: 'Admin', color: 'bg-red-100 text-red-800' },
    { value: 'manager', label: 'Yönetici', color: 'bg-purple-100 text-purple-800' },
    { value: 'editor', label: 'Editör', color: 'bg-blue-100 text-blue-800' },
    { value: 'customer', label: 'Müşteri', color: 'bg-green-100 text-green-800' }
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
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
            className="btn bg-orange-600 text-white hover:bg-orange-700"
          >
            <PlusIcon className="w-4 h-4" />
            Yeni Kullanıcı
          </button>
        </div>
      </div>

      {/* Admin User Manager Component */}
      <AdminUserManager organizations={organizations} />
    </div>
  );
};

export default UsersPage;