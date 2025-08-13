import React, { useState, useEffect } from 'react';
import { useCustomerAuth } from '../hooks/useCustomers';
import { useProjects, useDocuments } from '../hooks/useCustomer';
import { 
  FolderIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  UserIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

const PortalPage: React.FC = () => {
  const { currentCustomer, logout } = useCustomerAuth();
  const { projects, loading: projectsLoading } = useProjects(currentCustomer?.id);
  const { documents, loading: documentsLoading } = useDocuments(currentCustomer?.id);

  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDocumentTypeIcon = (type: string) => {
    switch (type) {
      case 'report':
        return <DocumentTextIcon className="w-5 h-5 text-blue-600" />;
      case 'certificate':
        return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
      case 'image':
        return <EyeIcon className="w-5 h-5 text-purple-600" />;
      default:
        return <DocumentTextIcon className="w-5 h-5 text-gray-600" />;
    }
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

  const filteredDocuments = selectedProject 
    ? documents.filter(doc => doc.projectId === selectedProject)
    : documents;

  if (!currentCustomer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Oturum Bulunamadı</h2>
          <p className="text-gray-600 mb-6">Lütfen tekrar giriş yapın.</p>
          <a href="/login" className="text-blue-600 hover:text-blue-700">Giriş Sayfasına Dön</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Müşteri Portalı</h1>
                  <p className="text-sm text-gray-600">{currentCustomer.companyName}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Hoş geldiniz, {currentCustomer.contactPerson}
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
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Customer Info & Projects */}
          <div className="lg:col-span-1 space-y-6">
            {/* Customer Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Müşteri Bilgileri</h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <BuildingOfficeIcon className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{currentCustomer.companyName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <UserIcon className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{currentCustomer.contactPerson}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <EnvelopeIcon className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{currentCustomer.email}</span>
                </div>
                {currentCustomer.phone && (
                  <div className="flex items-center space-x-2">
                    <PhoneIcon className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{currentCustomer.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Projects Filter */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Projelerim</h2>
              {projectsLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedProject(null)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedProject === null 
                        ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Tüm Projeler
                  </button>
                  {projects.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => setSelectedProject(project.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedProject === project.id 
                          ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-medium">{project.code}</div>
                      <div className="text-xs text-gray-500 truncate">{project.name}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Projects Overview */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Proje Durumu</h2>
              {projectsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : projects.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {projects.map((project) => (
                    <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{project.code}</h3>
                          <p className="text-sm text-gray-600">{project.name}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(project.status)}`}>
                          {project.status === 'active' ? 'Aktif' : 
                           project.status === 'completed' ? 'Tamamlandı' : 
                           project.status === 'on-hold' ? 'Beklemede' : 'Diğer'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Oluşturulma: {formatDate(project.createdAt)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FolderIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Henüz projeniz bulunmuyor.</p>
                </div>
              )}
            </div>

            {/* Documents */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Belgelerim
                  {selectedProject && (
                    <span className="text-sm font-normal text-gray-600 ml-2">
                      - {projects.find(p => p.id === selectedProject)?.code}
                    </span>
                  )}
                </h2>
                <div className="text-sm text-gray-600">
                  {filteredDocuments.length} belge
                </div>
              </div>

              {documentsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : filteredDocuments.length > 0 ? (
                <div className="space-y-3">
                  {filteredDocuments.map((document) => (
                    <div key={document.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="mt-1">
                            {getDocumentTypeIcon(document.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 truncate">{document.name}</h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                              <span>{formatFileSize(document.fileSize)}</span>
                              <span>{formatDate(document.uploadedAt)}</span>
                              {document.method && (
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                  {document.method}
                                </span>
                              )}
                            </div>
                            {document.description && (
                              <p className="text-sm text-gray-600 mt-2">{document.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => window.open(document.fileUrl, '_blank')}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Görüntüle"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = document.fileUrl;
                              link.download = document.name;
                              link.click();
                            }}
                            className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                            title="İndir"
                          >
                            <ArrowDownTrayIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    {selectedProject 
                      ? 'Bu proje için henüz belge bulunmuyor.' 
                      : 'Henüz belgeniz bulunmuyor.'
                    }
                  </p>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{projects.length}</div>
                <div className="text-sm text-gray-600">Toplam Proje</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {projects.filter(p => p.status === 'active').length}
                </div>
                <div className="text-sm text-gray-600">Aktif Proje</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{documents.length}</div>
                <div className="text-sm text-gray-600">Toplam Belge</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortalPage;