import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  EyeIcon, 
  EyeSlashIcon,
  ShieldCheckIcon,
  UserIcon,
  LockClosedIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { signUp, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    companyName: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.fullName) {
      setError('Lütfen tüm zorunlu alanları doldurun');
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Geçerli bir e-posta adresi girin');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await signUp(formData.email, formData.password, {
        full_name: formData.fullName,
        phone: formData.phone,
        company_name: formData.companyName,
        role: 'customer'
      });

      if (result.success) {
        alert('Hesabınız başarıyla oluşturuldu! Giriş yapabilirsiniz.');
        navigate('/login');
      } else {
        setError(result.error || 'Kayıt işlemi başarısız');
      }
    } catch (error: any) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center mb-4">
            <UserIcon className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Hesap Oluştur</h2>
          <p className="text-gray-600">EMIC Müşteri Portalına katılın</p>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                Ad Soyad *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="ipt w-full pl-10"
                  placeholder="Ahmet Yılmaz"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                E-posta Adresi *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="ipt w-full pl-10"
                  placeholder="email@example.com"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Telefon
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <PhoneIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="ipt w-full pl-10"
                  placeholder="+90 5xx xxx xx xx"
                />
              </div>
            </div>

            {/* Company Name */}
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                Şirket Adı
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="companyName"
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  className="ipt w-full pl-10"
                  placeholder="ABC Sanayi A.Ş."
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Şifre *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="ipt w-full pl-10 pr-10"
                  placeholder="Güvenli şifre oluşturun"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Şifre Tekrarı *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="ipt w-full pl-10 pr-10"
                  placeholder="Şifrenizi tekrar girin"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="btn btn-primary w-full py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting || loading ? 'Hesap oluşturuluyor...' : 'Hesap Oluştur'}
            </button>
          </form>

          {/* Additional Links */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium">
                  ← Ana Sayfaya Dön
                </Link>
              </p>
              <p className="text-sm text-gray-600">
                Zaten hesabınız var mı?{' '}
                <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                  Giriş yapın
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <ShieldCheckIcon className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="text-green-800 font-medium mb-1">Güvenli Kayıt</p>
              <p className="text-green-700">
                Hesabınız oluşturulduktan sonra müşteri portalına erişebilir, 
                projelerinizi takip edebilir ve belgelerinizi görüntüleyebilirsiniz.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;