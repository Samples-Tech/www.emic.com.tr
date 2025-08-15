import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import UserCreationForm from '../../components/UserCreationForm';
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
  const [customers, setCustomers] = useState<any[]>(() => {
    const storedCustomers = localStorage.getItem('emic_customers');
    return storedCustomers ? JSON.parse(storedCustomers) : [];
  });
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCustomers = customers.filter(customer =>
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCustomerCreated = (customerData: any) => {
    setCustomers(prev => {
      const newCustomers = [...prev, customerData];
      localStorage.setItem('emic_customers', JSON.stringify(newCustomers));
      return newCustomers;
    });
    setShowCreateForm(false);
  };

  const handleDeleteCustomer = (id: string) => {
    if (confirm('Bu müşteriyi silmek istediğinizden emin misiniz?')) {
      setCustomers(prev => {
        const newCustomers = prev.filter(customer => customer.id !== id);
        localStorage.setItem('emic_customers', JSON.stringify(newCustomers));
        return newCustomers;
      });
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
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="btn bg-indigo-600 text-white hover:bg-indigo-700"
        >
          <PlusIcon className="w-4 h-4" />
          Yeni Müşteri
        </button>
      </div>

      {/* Customer Creation Form */}
      {showCreateForm && (
        <UserCreationForm 
          userType="customer"
          onUserCreated={handleCustomerCreated}
          organizations={[]}
        />
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
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <BuildingOfficeIcon className="w-6 h-6 text-indigo-600" />
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold text-gray-900">{customer.fullName}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      customer.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {customer.isActive ? 'Aktif' : 'Pasif'}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>E-posta: {customer.email}</div>
                    <div>Şirket: {customer.companyName}</div>
                    {customer.phone && <div>Telefon: {customer.phone}</div>}
                    <div>Oluşturulma: {formatDate(customer.createdAt)}</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => setEditingCustomer(customer)}
                  className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteCustomer(customer.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
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