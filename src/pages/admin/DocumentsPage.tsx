import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDocuments } from '../../hooks/useDocuments';
import { useProjects } from '../../hooks/useProjects';
import { useCustomers } from '../../hooks/useCustomers';
import { useOrganizations } from '../../hooks/useOrganizations';
import DocumentUploader from '../../components/DocumentUploader';
import DocumentVersionManager from '../../components/DocumentVersionManager';
import { 
  DocumentTextIcon,
  ChevronLeftIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  PencilIcon,
  TrashIcon,
  ClockIcon,
  TagIcon,
  FolderIcon,
  PhotoIcon,
  FilmIcon,
  DocumentIcon as DocumentIconOutline
} from '@heroicons/react/24/outline';

const DocumentsPage: React.FC = () => {
  const { projects } = useProjects();
  const { customers } = useCustomers();
  const { organizations } = useOrganizations();
  const { documents, loading, error, updateDocument, deleteDocument, downloadDocument, getDocumentUrl } = useDocuments();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterProject, setFilterProject] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showUploader, setShowUploader] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [showVersionManager, setShowVersionManager] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingDocument, setEditingDocument] = useState<any>({});

  const documentTypes = [
    { value: 'report', label: 'Rapor', icon: DocumentTextIcon, color: 'text-blue-600' },
    { value: 'certificate', label: 'Sertifika', icon: DocumentTextIcon, color: 'text-green-600' },
    { value: 'image', label: 'Görsel', icon: PhotoIcon, color: 'text-purple-600' },
    { value: 'video', label: 'Video', icon: FilmIcon, color: 'text-red-600' },
    { value: 'other', label: 'Diğer', icon: DocumentIconOutline, color: 'text-gray-600' }
  ];

  const statusOptions = [
    { value: 'draft', label: 'Taslak', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'final', label: 'Final', color: 'bg-green-100 text-green-800' },
    { value: 'archived', label: 'Arşivlenmiş', color: 'bg-gray-100 text-gray-800' }
  ];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         (doc.report_number && doc.report_number.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesProject = !filterProject || doc.project_id === filterProject;
    const matchesType = !filterType || doc.document_type === filterType;
    const matchesStatus = !filterStatus || doc.status === filterStatus;
    
    return matchesSearch && matchesProject && matchesType && matchesStatus;
  });

  const getTypeInfo = (type: string) => {
    return documentTypes.find(t => t.value === type) || documentTypes[4];
  };

  const getStatusInfo = (status: string) => {
    return statusOptions.find(s => s.value === status) || statusOptions[0];
  };

  const handleEdit = (document: any) => {
    setEditingId(document.id);
    setEditingDocument(document);
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;

    const result = await updateDocument(editingId, {
      name: editingDocument.name,
      description: editingDocument.description,
      document_type: editingDocument.document_type,
      method: editingDocument.method,
      report_number: editingDocument.report_number,
      status: editingDocument.status
    });

    if (result.success) {
      setEditingId(null);
      setEditingDocument({});
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingDocument({});
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bu belgeyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
      await deleteDocument(id);
    }
  };

  const handleDownload = async (document: any) => {
    await downloadDocument(document);
  };

  const handleViewVersions = (document: any) => {
    setSelectedDocument(document);
    setShowVersionManager(true);
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
          <DocumentTextIcon className="w-8 h-8 text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-900">Belge Yönetimi</h1>
        </div>
        <button 
          onClick={() => setShowUploader(!showUploader)}
          className="btn bg-indigo-600 text-white hover:bg-indigo-700"
        >
          <CloudArrowUpIcon className="w-4 h-4" />
          {showUploader ? 'Yükleyiciyi Kapat' : 'Belge Yükle'}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Document Uploader */}
      {showUploader && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Yeni Belge Yükle</h2>
          <DocumentUploader
            onUploadComplete={(document) => {
              console.log('Document uploaded:', document);
              setShowUploader(false);
            }}
            acceptedTypes=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.mp4,.mov"
            maxSize={50}
            multiple={true}
          />
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="grid md:grid-cols-5 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Belge ara..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Tüm Projeler</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.code} - {project.name}
              </option>
            ))}
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Tüm Türler</option>
            {documentTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Tüm Durumlar</option>
            {statusOptions.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
          
          <div className="text-sm text-gray-600 flex items-center">
            <FunnelIcon className="w-4 h-4 mr-2" />
            {filteredDocuments.length} belge
          </div>
        </div>
      </div>

      {/* Documents List */}
      <div className="space-y-4">
        {filteredDocuments.map((document) => {
          const typeInfo = getTypeInfo(document.document_type);
          const statusInfo = getStatusInfo(document.status);
          const IconComponent = typeInfo.icon;

          return (
            <div key={document.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              {editingId === document.id ? (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Belge Adı
                      </label>
                      <input
                        type="text"
                        value={editingDocument.name || ''}
                        onChange={(e) => setEditingDocument(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rapor Numarası
                      </label>
                      <input
                        type="text"
                        value={editingDocument.report_number || ''}
                        onChange={(e) => setEditingDocument(prev => ({ ...prev, report_number: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Belge Türü
                      </label>
                      <select
                        value={editingDocument.document_type || ''}
                        onChange={(e) => setEditingDocument(prev => ({ ...prev, document_type: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        {documentTypes.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Yöntem
                      </label>
                      <input
                        type="text"
                        value={editingDocument.method || ''}
                        onChange={(e) => setEditingDocument(prev => ({ ...prev, method: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Durum
                      </label>
                      <select
                        value={editingDocument.status || ''}
                        onChange={(e) => setEditingDocument(prev => ({ ...prev, status: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        {statusOptions.map(status => (
                          <option key={status.value} value={status.value}>{status.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Açıklama
                    </label>
                    <textarea
                      rows={3}
                      value={editingDocument.description || ''}
                      onChange={(e) => setEditingDocument(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    />
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
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconComponent className={`w-6 h-6 ${typeInfo.color}`} />
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-gray-900">{document.name}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {typeInfo.label}
                        </span>
                        {document.version > 1 && (
                          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full flex items-center space-x-1">
                            <TagIcon className="w-3 h-3" />
                            <span>v{document.version}</span>
                          </span>
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-600 space-y-1">
                        {document.description && <div>Açıklama: {document.description}</div>}
                        {document.report_number && <div>Rapor No: {document.report_number}</div>}
                        {document.method && <div>Yöntem: {document.method}</div>}
                        <div>Proje: {document.project?.code} - {document.project?.name}</div>
                        <div>Müşteri: {document.customer?.company_name}</div>
                        {document.organization && <div>Organizasyon: {document.organization.name}</div>}
                        <div className="flex items-center space-x-4">
                          <span>Boyut: {formatFileSize(document.file_size)}</span>
                          <span>Yükleme: {formatDate(document.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleViewVersions(document)}
                      className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      title="Versiyonları Görüntüle"
                    >
                      <ClockIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        const url = getDocumentUrl(document);
                        window.open(url, '_blank');
                      }}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Görüntüle"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDownload(document)}
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="İndir"
                    >
                      <ArrowDownTrayIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(document)}
                      className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Düzenle"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(document.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Sil"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredDocuments.length === 0 && (
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
            <FolderIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery || filterProject || filterType || filterStatus 
                ? 'Belge bulunamadı' 
                : 'Henüz belge yok'
              }
            </h3>
            <p className="text-gray-600">
              {searchQuery || filterProject || filterType || filterStatus
                ? 'Filtrelerinizi değiştirerek tekrar deneyin.'
                : 'Yeni belge yüklemek için yukarıdaki butonu kullanın.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Document Version Manager Modal */}
      {showVersionManager && selectedDocument && (
        <DocumentVersionManager
          documentId={selectedDocument.id}
          documentName={selectedDocument.name}
          onClose={() => {
            setShowVersionManager(false);
            setSelectedDocument(null);
          }}
        />
      )}
    </div>
  );
};

export default DocumentsPage;