import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useJobs } from '../../hooks/useProjects';
import { useProjects } from '../../hooks/useProjects';
import { 
  BriefcaseIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';

const JobsPage: React.FC = () => {
  const { projects } = useProjects();
  const { jobs, loading, error, createJob, updateJob, deleteJob } = useJobs();

  const [newJob, setNewJob] = useState({
    method: 'UT',
    status: 'open',
    project_id: '',
    description: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingJob, setEditingJob] = useState({
    method: '',
    status: '',
    project_id: '',
    description: ''
  });

  const statusOptions = [
    { value: 'open', label: 'Açık', color: 'bg-blue-100 text-blue-800' },
    { value: 'in_progress', label: 'Devam Ediyor', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'completed', label: 'Tamamlandı', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'İptal Edildi', color: 'bg-red-100 text-red-800' }
  ];

  const methodOptions = ['UT', 'RT', 'PT', 'MT', 'VT', 'ET', 'LT'];

  const filteredJobs = jobs.filter(job =>
    job.method.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (job.project?.code || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (job.project?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedJobs = filteredJobs.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filteredJobs.length / pageSize);

  const getStatusInfo = (status: string) => {
    return statusOptions.find(opt => opt.value === status) || statusOptions[0];
  };

  const handleCreate = async () => {
    if (!newJob.method.trim() || !newJob.status || !newJob.project_id) return;
    
    const project = projects.find(p => p.id === newJob.project_id);
    if (!project) return;

    const result = await createJob({
      project_id: newJob.project_id,
      method: newJob.method.trim(),
      status: newJob.status,
      description: newJob.description.trim() || undefined
    });
    
    if (result.success) {
      setNewJob({ method: 'UT', status: 'open', project_id: '', description: '' });
    }
  };

  const handleEdit = (job: any) => {
    setEditingId(job.id);
    setEditingJob({
      method: job.method,
      status: job.status,
      project_id: job.project_id,
      description: job.description || ''
    });
  };

  const handleSaveEdit = async () => {
    if (!editingJob.method.trim() || !editingJob.status || !editingJob.project_id || !editingId) return;
    
    const project = projects.find(p => p.id === editingJob.project_id);
    if (!project) return;

    await updateJob(editingId, {
      method: editingJob.method.trim(),
      status: editingJob.status,
      project_id: editingJob.project_id,
      description: editingJob.description.trim() || undefined
    });
    
    setEditingId(null);
    setEditingJob({ method: '', status: '', project_id: '', description: '' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingJob({ method: '', status: '', project_id: '', description: '' });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bu işi silmek istediğinizden emin misiniz?')) {
      await deleteJob(id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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
            to="/admin"
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
      <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6">
        <div className="flex items-start space-x-3">
          <BriefcaseIcon className="w-6 h-6 text-purple-600 mt-1" />
          <div className="space-y-2">
            <h3 className="font-semibold text-purple-900">İş Yönetimi - Supabase Entegrasyonu</h3>
            <p className="text-sm text-purple-800">
              İşler artık Supabase database'inde saklanıyor. Proje ilişkileri kuruldu.
              Real-time güncellemeler aktif.
            </p>
          </div>
        </div>
      </div>

      {/* Create New Job */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Yeni İş</h2>
        <div className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <select
              value={newJob.method}
              onChange={(e) => setNewJob(prev => ({ ...prev, method: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {methodOptions.map(method => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>
            <select
              value={newJob.status}
              onChange={(e) => setNewJob(prev => ({ ...prev, status: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {statusOptions.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
            <select
              value={newJob.project_id}
              onChange={(e) => setNewJob(prev => ({ ...prev, project_id: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Proje seçin *</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.code} - {project.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <textarea
              value={newJob.description}
              onChange={(e) => setNewJob(prev => ({ ...prev, description: e.target.value }))}
              placeholder="İş açıklaması (isteğe bağlı)"
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>
          
          <button
            onClick={handleCreate}
            disabled={!newJob.method.trim() || !newJob.status || !newJob.project_id || loading}
            className="flex items-center justify-center space-x-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            <span>{loading ? 'Ekleniyor...' : 'İş Ekle'}</span>
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
        {paginatedJobs.map((job) => (
          <div key={job.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            {editingId === job.id ? (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <select
                    value={editingJob.method}
                    onChange={(e) => setEditingJob(prev => ({ ...prev, method: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {methodOptions.map(method => (
                      <option key={method} value={method}>{method}</option>
                    ))}
                  </select>
                  <select
                    value={editingJob.status}
                    onChange={(e) => setEditingJob(prev => ({ ...prev, status: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {statusOptions.map(status => (
                      <option key={status.value} value={status.value}>{status.label}</option>
                    ))}
                  </select>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <select
                    value={editingJob.project_id}
                    onChange={(e) => setEditingJob(prev => ({ ...prev, project_id: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Proje seçin</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.code} - {project.name}
                      </option>
                    ))}
                  </select>
                  <textarea
                    value={editingJob.description}
                    onChange={(e) => setEditingJob(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="İş açıklaması"
                    rows={2}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
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
                  </div>
                  {job.description && (
                    <p className="text-sm text-gray-600">{job.description}</p>
                  )}
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <ClipboardDocumentListIcon className="w-4 h-4" />
                      <span>{job.project?.code}</span>
                    </div>
                    <span>{job.project?.name}</span>
                    <span>Oluşturulma: {formatDate(job.created_at)}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(job)}
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
        ))}

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