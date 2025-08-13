import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useOrganizations } from '../../hooks/useOrganizations';
import { useProjects } from '../../hooks/useProjects';
import { useDocuments } from '../../hooks/useDocuments';
import AdminChatPanel from '../../components/AdminChatPanel';
import { 
  CogIcon,
  UsersIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  FolderIcon,
  BriefcaseIcon,
  PhotoIcon,
  StarIcon,
  MapIcon,
  BeakerIcon,
  CalendarIcon,
  Bars3Icon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const AdminDashboard: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const { organizations } = useOrganizations();
  const { projects } = useProjects();
  const { documents } = useDocuments();

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/login';
  };

  const adminMenuItems = [
    {
      title: 'İçerik Yönetimi',
      items: [
        { name: 'Ana Sayfa Hero', href: '/admin/hero', icon: StarIcon, color: 'text-yellow-600' },
        { name: 'İçerik Yönetimi', href: '/admin/content', icon: DocumentTextIcon, color: 'text-indigo-600' },
        { name: 'Hizmet Bölgeleri', href: '/admin/regions', icon: MapIcon, color: 'text-green-600' },
        { name: 'Laboratuvar Testleri', href: '/admin/laboratory', icon: BeakerIcon, color: 'text-orange-600' },
        { name: 'Referanslar', href: '/admin/references', icon: BuildingOfficeIcon, color: 'text-blue-600' },
        { name: 'Özel Günler', href: '/admin/special-days', icon: CalendarIcon, color: 'text-purple-600' }
      ]
    },
    {
      title: 'Sistem Yönetimi',
      items: [
        { name: 'Organizasyonlar', href: '/admin/organizations', icon: BuildingOfficeIcon, color: 'text-blue-600' },
        { name: 'Kullanıcılar', href: '/admin/users', icon: UsersIcon, color: 'text-orange-600' },
        { name: 'Müşteriler', href: '/admin/customers', icon: UsersIcon, color: 'text-indigo-600' },
        { name: 'Projeler', href: '/admin/projects', icon: FolderIcon, color: 'text-green-600' },
        { name: 'İşler', href: '/admin/jobs', icon: BriefcaseIcon, color: 'text-purple-600' },
        { name: 'Belgeler', href: '/admin/documents', icon: DocumentTextIcon, color: 'text-indigo-600' }
      ]
    },
    {
      title: 'Site Ayarları',
      items: [
        { name: 'Genel Ayarlar', href: '/admin/settings', icon: CogIcon, color: 'text-gray-600' },
        { name: 'Header Yönetimi', href: '/admin/header', icon: Bars3Icon, color: 'text-blue-600' },
        { name: 'Footer Yönetimi', href: '/admin/footer', icon: CogIcon, color: 'text-gray-600' },
        { name: 'Navigasyon', href: '/admin/navigation', icon: Bars3Icon, color: 'text-green-600' },
        { name: 'Medya Yönetimi', href: '/admin/media', icon: PhotoIcon, color: 'text-pink-600' }
      ]
    }
  ];

  const stats = [
    { name: 'Toplam Organizasyon', value: organizations.length, icon: BuildingOfficeIcon, color: 'text-blue-600' },
    { name: 'Toplam Proje', value: projects.length, icon: FolderIcon, color: 'text-green-600' },
    { name: 'Toplam Belge', value: documents.length, icon: DocumentTextIcon, color: 'text-indigo-600' },
    { name: 'Aktif Projeler', value: projects.filter(p => p.status === 'active').length, icon: CheckCircleIcon, color: 'text-green-600' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <CogIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">EMIC Admin Panel</h1>
                  <p className="text-sm text-gray-600">Sistem Yönetimi</p>
                </div>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Hoş geldiniz, {profile?.email}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <div key={stat.name} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center ${stat.color}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Admin Menu */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {adminMenuItems.map((section) => (
              <div key={section.title} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">{section.title}</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {section.items.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 group"
                      >
                        <div className={`w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <span className="font-medium text-gray-900 group-hover:text-gray-700">
                          {item.name}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Live Chat Panel */}
            <AdminChatPanel />

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Hızlı İşlemler</h3>
              <div className="space-y-3">
                <Link
                  to="/admin/content"
                  className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <DocumentTextIcon className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-800 font-medium">Yeni İçerik Ekle</span>
                </Link>
                <Link
                  to="/admin/customers"
                  className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <UsersIcon className="w-5 h-5 text-green-600" />
                  <span className="text-green-800 font-medium">Yeni Müşteri Ekle</span>
                </Link>
                <Link
                  to="/admin/projects"
                  className="flex items-center space-x-3 p-3 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <FolderIcon className="w-5 h-5 text-purple-600" />
                  <span className="text-purple-800 font-medium">Yeni Proje Ekle</span>
                </Link>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sistem Durumu</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Supabase Bağlantısı</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600">Aktif</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Database</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600">Çalışıyor</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Storage</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600">Hazır</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;