import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useJobs } from '../../hooks/useProjects';
import { useProjects } from '../../hooks/useProjects';
import { useCustomers } from '../../hooks/useCustomers';
import { useOrganizations } from '../../hooks/useOrganizations';
import { 
  BriefcaseIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClipboardDocumentListIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

interface Project {
  id: string;
  code: string;
  name: string;
  description?: string;
  customer_id: string;
  organization_id?: string;
  status: string;
  start_date?: string;
  created_at: string;
  customer?: {
    company_name: string;
    contact_person: string;
  };
  organization?: {
    name: string;
  };
  job_count?: number;
}

interface Job {
  id: string;
  method: string;
  status: string;
  projectId: string;
  projectCode: string;
  projectName: string;
  createdAt: string;
  documentCount: number;
}

const JobsPage: React.FC = () => {
  const [projects] = useState<Project[]>([
    { id: '1', code: 'PRJ-2024-001', name: 'Petrokimya Tesisi Ana Hat Muayenesi', description: '', customer_id: '1', status: 'active', created_at: '2024-01-15T10:30:00Z' },
    { id: '2', code: 'PRJ-2024-002', name: 'Köprü Yapısı NDT Kontrolü', description: '', customer_id: '2', status: 'active', created_at: '2024-01-16T10:30:00Z' },
    { id: '3', code: 'PRJ-2024-003', name: 'Rüzgar Türbini Kanat Muayenesi', description: '', customer_id: '3', status: 'active', created_at: '2024-01-17T10:30:00Z' }
  ]);

  const [jobs, setJobs] = useState<Job[]>([
    {
      id: '1',
      method: 'UT',
      status: 'OPEN',
      projectId: '1',
      projectCode: 'PRJ-2024-001',
      projectName: 'Petrokimya Tesisi Ana Hat Muayenesi',
      createdAt: '2024-01-15T10:30:00Z',
      documentCount: 5
    },
    {
      id: '2',
      method: 'RT',
      status: 'IN_PROGRESS',
      projectId: '2',
      projectCode: 'PRJ-2024-002',
      projectName: 'Köprü Yapısı NDT Kontrolü',
      createdAt: '2024-01-16T10:30:00Z',
      documentCount: 3
    }
  ]);

  const { projects: dbProjects, loading, error, createProject, updateProject, deleteProject } = useProjects();
  const { customers } = useCustomers();
  const { organizations } = useOrganizations();

  const [newProject, setNewProject] = useState({
    code: '',
    name: '',
    description: '',
    customer_id: '',
    organization_id: '',
    status: 'active',
    start_date: ''
  });

  const [newJob, setNewJob] = useState({
    method: '',
    status: '',
    projectId: ''
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingJob, setEditingJob] = useState({
    method: '',
    status: '',
    projectId: ''
  });

  const [editingProject, setEditingProject] = useState({
    code: '',
    name: '',
    description: '',
    customer_id: '',
    organization_id: '',
    status: 'active'
  });

  const statusOptions = [
    { value: 'OPEN', label: 'Açık', color: 'bg-blue-100 text-blue-800' },
    { value: 'IN_PROGRESS', label: 'Devam Ediyor', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'COMPLETED', label: 'Tamamlandı', color: 'bg-green-100 text-green-800' },
    { value: 'CANCELLED', label: 'İptal Edildi', color: 'bg-red-100 text-red-800' },
    { value: 'on_hold', label: 'Beklemede', color: 'bg-yellow-100 text-yellow-800' }
  ];

  const methodOptions = ['UT', 'RT', 'PT', 'MT', 'VT', 'ET', 'LT'];
  
  const filteredJobs = jobs.filter(job => {
    const project = projects.find(p => p.id === job.projectId);
    return job.method.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.projectCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (project?.code || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (project?.customer?.company_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (project?.organization?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
  });

  const paginatedJobs = filteredJobs.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filteredJobs.length / pageSize);

  const getStatusInfo = (status: string) => {
    return statusOptions.find(opt => opt.value === status) || statusOptions[0];
  };

  const handleCreate = async () => {
    if (!newProject.code.trim() || !newProject.name.trim() || !newProject.customer_id) return;
    
    const customer = customers.find(c => c.id === newProject.customer_id);
    if (!customer) return;

    const result = await createProject({
      code: newProject.code.trim(),
      name: newProject.name.trim(),
      description: newProject.description.trim() || undefined,
      customer_id: newProject.customer_id,
      organization_id: newProject.organization_id || undefined,
      status: newProject.status,
      start_date: newProject.start_date || undefined
    });

    if (result.success) {
      setNewProject({ 
        code: '', 
        name: '', 
        description: '',
        customer_id: '', 
        organization_id: '',
        status: 'active',
        start_date: ''
      });
    }
  };

  const handleEdit = (project: any) => {
    setEditingId(project.id);
    setEditingProject({
      code: project.code,
      name: project.name,
      description: project.description || '',
      customer_id: project.customer_id,
      organization_id: project.organization_id || '',
      status: project.status
    });
  };

  const handleSaveEdit = async () => {
    if (!editingProject.code.trim() || !editingProject.name.trim() || !editingProject.customer_id || !editingId) return;
    
    await updateProject(editingId, {
      code: editingProject.code.trim(),
      name: editingProject.name.trim(),
      description: editingProject.description.trim() || undefined,
      customer_id: editingProject.customer_id,
      organization_id: editingProject.organization_id || undefined,
      status: editingProject.status
    });
    
    setEditingId(null);
    setEditingProject({
      code: '',
      name: '',
      description: '',
      customer_id: '', 
      organization_id: '',
      status: 'active'
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingProject({
      code: '',
      name: '',
      description: '',
      customer_id: '', 
      organization_id: '',
      status: 'active'
    });
  };

  const handleDelete = async (id: string) => {
    await deleteProject(id);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      day: 'numeric',
      month: 'short'
    });
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
            to="/dashboard"
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </Link>
          <BriefcaseIcon className="w-8 h-8 text-purple-600" />
          <h1 className="text-2xl font-bold text-gray-900">İşler</h1>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Info Card */}
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
        <div className="flex items-start space-x-3">
          <ClipboardDocumentListIcon className="w-6 h-6 text-green-600 mt-1" />
          <div className="space-y-2">
            <h3 className="font-semibold text-green-900">Proje Yönetimi - Supabase Entegrasyonu</h3>
            <p className="text-sm text-green-800">
              Projeler artık Supabase database'inde saklanıyor. Müşteri ve organizasyon ilişkileri kuruldu.
              Real-time güncellemeler aktif.
            </p>
          </div>
        </div>
      </div>

      {/* Create New Job */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Yeni Proje</h2>
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              value={newProject.code}
              onChange={(e) => setNewProject(prev => ({ ...prev, code: e.target.value }))}
              placeholder="Proje kodu (PRJ-2024-001)"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <input
              type="text"
              value={newProject.name}
              onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Proje adı"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <textarea
              value={newProject.description}
              onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Proje açıklaması (isteğe bağlı)"
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            />
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            <select
              value={newProject.customer_id}
              onChange={(e) => setNewProject(prev => ({ ...prev, customer_id: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Müşteri seçin *</option>
              {customers.map(customer => (
                <option key={customer.id} value={customer.id}>
                  {customer.company_name} - {customer.contact_person}
                </option>
              ))}
            </select>
            
            <select
              value={newProject.organization_id}
              onChange={(e) => setNewProject(prev => ({ ...prev, organization_id: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Organizasyon seçin</option>
              {organizations.map(org => (
                <option key={org.id} value={org.id}>{org.name}</option>
              ))}
            </select>
            
            <input
              type="date"
              value={newProject.start_date}
              onChange={(e) => setNewProject(prev => ({ ...prev, start_date: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          
          <button
            onClick={handleCreate}
            disabled={!newProject.code.trim() || !newProject.name.trim() || !newProject.customer_id || loading}
            className="flex items-center justify-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            <span>{loading ? 'Ekleniyor...' : 'Proje Ekle'}</span>
          </button>
        </div>
      </div>

      {/* Search and Pagination */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="İş ara..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Toplam {filteredJobs.length} kayıt
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-600">
                Sayfa {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-3">
        {paginatedJobs.map((job) => {
          const project = projects.find(p => p.id === job.projectId);
          return (
          <div key={job.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            {editingId === job.id ? (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={editingProject.code}
                    onChange={(e) => setEditingProject(prev => ({ ...prev, code: e.target.value }))}
                    placeholder="Proje kodu"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    value={editingProject.name}
                    onChange={(e) => setEditingProject(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Proje adı"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                 </div>
                 
                 <textarea
                   value={editingProject.description}
                   onChange={(e) => setEditingProject(prev => ({ ...prev, description: e.target.value }))}
                   placeholder="Proje açıklaması"
                   rows={2}
                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                 />
                 
                 <div className="grid md:grid-cols-2 gap-4">
                   <select
                     value={editingProject.customer_id}
                     onChange={(e) => setEditingProject(prev => ({ ...prev, customer_id: e.target.value }))}
                     className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                   >
                     <option value="">Müşteri seçin</option>
                     {customers.map(customer => (
                       <option key={customer.id} value={customer.id}>
                         {customer.company_name}
                       </option>
                     ))}
                   </select>
                   <select
                     value={editingProject.organization_id}
                     onChange={(e) => setEditingProject(prev => ({ ...prev, organization_id: e.target.value }))}
                     className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                   >
                     <option value="">Organizasyon seçin</option>
                     {organizations.map(org => (
                       <option key={org.id} value={org.id}>{org.name}</option>
                     ))}
                   </select>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleSaveEdit}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Kaydet
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    İptal
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-semibold text-gray-900">{job.method}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusInfo(job.status).color}`}>
                      {getStatusInfo(job.status).label}
                    </span>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {project?.job_count || 0} iş
                    </span>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {job.documentCount} belge
                    </span>
                  </div>
                  {project?.description && (
                    <p className="text-sm text-gray-600">{project.description}</p>
                  )}
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <ClipboardDocumentListIcon className="w-4 h-4" />
                      <span>{project?.customer?.company_name}</span>
                    </div>
                    {project?.organization && (
                      <div className="flex items-center space-x-1">
                        <BuildingOfficeIcon className="w-4 h-4" />
                        <span>{project.organization.name}</span>
                      </div>
                    )}
                    <span>Başlangıç: {project?.start_date ? formatDate(project.start_date) : 'Belirlenmemiş'}</span>
                    <span>Oluşturulma: {formatDate(project?.created_at || job.createdAt)}</span>
                  </div>
                  {project?.start_date && (
                    <div className="text-xs text-gray-500">
                      Başlangıç tarihi: {formatDate(project.start_date)}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(project)}
                    className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(job.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        );})}

        {paginatedJobs.length === 0 && (
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
            <BriefcaseIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? 'İş bulunamadı' : 'Henüz iş yok'}
            </h3>
            <p className="text-gray-600">
              {searchQuery 
                ? 'Arama kriterlerinizi değiştirerek tekrar deneyin.'
                : 'Yukarıdaki formu kullanarak yeni bir iş ekleyin.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsPage;