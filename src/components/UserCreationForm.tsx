import React, { useState } from 'react';
import { 
  UserPlusIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClipboardDocumentIcon
} from '@heroicons/react/24/outline';
import PasswordGenerator from './PasswordGenerator';
import { validatePassword } from '../utils/passwordGenerator';

interface UserCreationFormProps {
  onUserCreated?: (userData: any) => void;
  userType: 'admin' | 'customer';
  organizations?: any[];
}

const UserCreationForm: React.FC<UserCreationFormProps> = ({ onUserCreated, userType, organizations = [] }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    role: userType === 'admin' ? 'editor' : 'customer',
    companyName: '',
    organizationId: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordGenerator, setShowPasswordGenerator] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roleOptions = [
    { value: 'admin', label: 'Admin', description: 'Tüm yetkilere sahip' },
    { value: 'manager', label: 'Yönetici', description: 'Organizasyon ve proje yönetimi' },
    { value: 'editor', label: 'Editör', description: 'İçerik düzenleme yetkisi' },
    { value: 'customer', label: 'Müşteri', description: 'Sadece kendi belgelerini görüntüleme' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors([]);
  };

  const handlePasswordGenerated = (generatedPassword: string) => {
    setFormData(prev => ({ 
      ...prev, 
      password: generatedPassword,
      confirmPassword: generatedPassword 
    }));
    setShowPasswordGenerator(false);
  };

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (!formData.email) {
      newErrors.push('E-posta adresi gereklidir');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.push('Geçerli bir e-posta adresi girin');
    }

    if (!formData.password) {
      newErrors.push('Şifre gereklidir');
    } else {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        newErrors.push(...passwordValidation.errors);
      }
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.push('Şifreler eşleşmiyor');
    }

    if (!formData.fullName) {
      newErrors.push('Ad soyad gereklidir');
    }

    if (userType === 'customer' && !formData.companyName) {
      newErrors.push('Şirket adı gereklidir');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simulate user creation
      const userData = {
        id: Date.now().toString(),
        email: formData.email,
        password: formData.password, // In real app, this would be hashed
        fullName: formData.fullName,
        phone: formData.phone,
        role: formData.role,
        companyName: formData.companyName,
        organizationId: formData.organizationId,
        isActive: true,
        createdAt: new Date().toISOString()
      };

      // Store in localStorage for demo
      const storageKey = userType === 'admin' ? 'emic_admin_users' : 'emic_customers';
      const existingUsers = JSON.parse(localStorage.getItem(storageKey) || '[]');
      existingUsers.push(userData);
      localStorage.setItem(storageKey, JSON.stringify(existingUsers));

      onUserCreated?.(userData);

      // Reset form
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        phone: '',
        role: userType === 'admin' ? 'editor' : 'customer',
        companyName: '',
        organizationId: ''
      });

      alert(`${userType === 'admin' ? 'Admin kullanıcı' : 'Müşteri'} başarıyla oluşturuldu!`);

    } catch (error) {
      setErrors(['Kullanıcı oluşturulurken bir hata oluştu']);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <UserPlusIcon className="w-8 h-8 text-blue-600" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {userType === 'admin' ? 'Yeni Admin Kullanıcı' : 'Yeni Müşteri'} Oluştur
            </h2>
            <p className="text-sm text-gray-600">
              {userType === 'admin' 
                ? 'Sistem yöneticisi veya editör hesabı oluşturun'
                : 'Yeni müşteri hesabı oluşturun'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {errors.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-red-800">Lütfen aşağıdaki hataları düzeltin:</h4>
              <ul className="text-sm text-red-700 mt-1 space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Temel Bilgiler</h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-posta Adresi *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="kullanici@example.com"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ad Soyad *
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ahmet Yılmaz"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefon
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+90 5xx xxx xx xx"
              />
            </div>

            {userType === 'admin' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rol *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {roleOptions.filter(role => role.value !== 'customer').map(role => (
                    <option key={role.value} value={role.value}>
                      {role.label} - {role.description}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {userType === 'customer' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Şirket Adı *
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="ABC Sanayi A.Ş."
                  required
                />
              </div>
            )}

            {userType === 'admin' && organizations.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organizasyon
                </label>
                <select
                  value={formData.organizationId}
                  onChange={(e) => handleInputChange('organizationId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Organizasyon seçin (isteğe bağlı)</option>
                  {organizations.map(org => (
                    <option key={org.id} value={org.id}>{org.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Password Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Şifre Ayarları</h3>
            <button
              type="button"
              onClick={() => setShowPasswordGenerator(!showPasswordGenerator)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              {showPasswordGenerator ? 'Manuel Giriş' : 'Otomatik Oluştur'}
            </button>
          </div>

          {showPasswordGenerator ? (
            <PasswordGenerator 
              onPasswordGenerated={handlePasswordGenerated}
              showCopyButton={true}
              showValidation={true}
            />
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Şifre *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Güvenli şifre girin"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-4 h-4" />
                    ) : (
                      <EyeIcon className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Şifre Tekrarı *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Şifreyi tekrar girin"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="w-4 h-4" />
                    ) : (
                      <EyeIcon className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => {
              setFormData({
                email: '',
                password: '',
                confirmPassword: '',
                fullName: '',
                phone: '',
                role: userType === 'admin' ? 'editor' : 'customer',
                companyName: '',
                organizationId: ''
              });
              setErrors([]);
            }}
            className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Temizle
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Oluşturuluyor...</span>
              </>
            ) : (
              <>
                <UserPlusIcon className="w-4 h-4" />
                <span>{userType === 'admin' ? 'Admin Kullanıcı' : 'Müşteri'} Oluştur</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Generated Credentials Display */}
      {formData.email && formData.password && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-green-900 mb-3">
            📋 Oluşturulan Giriş Bilgileri:
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-green-800">E-posta:</span>
              <code className="bg-green-100 px-2 py-1 rounded text-green-900">{formData.email}</code>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-green-800">Şifre:</span>
              <div className="flex items-center space-x-2">
                <code className="bg-green-100 px-2 py-1 rounded text-green-900">
                  {showPassword ? formData.password : '••••••••'}
                </code>
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(formData.password)}
                  className="p-1 text-green-600 hover:text-green-700"
                  title="Şifreyi kopyala"
                >
                  <ClipboardDocumentIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          <p className="text-xs text-green-700 mt-3">
            ⚠️ Bu bilgileri güvenli bir yerde saklayın ve kullanıcıya iletin.
          </p>
        </div>
      )}
    </div>
  );
};

export default UserCreationForm;