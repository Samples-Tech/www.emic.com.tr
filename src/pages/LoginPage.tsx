import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCustomerAuth } from '../hooks/useCustomers';
import { 
  EyeIcon, 
  EyeSlashIcon,
  ShieldCheckIcon,
  UserIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, loading: authLoading } = useAuth();
  const { login: customerLogin, loading: customerLoading } = useCustomerAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loginType, setLoginType] = useState<'admin' | 'customer'>('admin');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (loginType === 'admin') {
        const result = await signIn(email, password);
        
        if (result.success && result.data?.user) {
          // Admin login successful
          navigate('/admin');
        } else {
          setError(result.error || 'Admin girişi başarısız');
        }
      } else {
        // Customer login
        const result = await customerLogin(email, password);
        
        if (result.success) {
          navigate('/portal');
        } else {
          setError(result.error || 'Müşteri girişi başarısız');
        }
      }
    } catch (error) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
            <ShieldCheckIcon className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Portal Girişi</h2>
          <p className="text-gray-600">EMIC Müşteri Portalına hoş geldiniz</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          {/* Login Type Selector */}
          <div className="mb-6">
            <div className="flex rounded-lg bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => setLoginType('admin')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  loginType === 'admin'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Admin Girişi
              </button>
              <button
                type="button"
                onClick={() => setLoginType('customer')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  loginType === 'customer'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Müşteri Girişi
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                E-posta Adresi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="ipt w-full pl-10"
                  placeholder="email@example.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Şifre
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="ipt w-full pl-10 pr-10"
                  placeholder="Şifrenizi girin"
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

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || authLoading || customerLoading}
              className="btn btn-primary w-full py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading || authLoading || customerLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
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
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-blue-900 mb-2">Demo Giriş Bilgileri</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p><strong>Admin:</strong> admin@emic.test / admin123</p>
                  <p><strong>Müşteri:</strong> demo@abc.com / demo123</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Hesabınız yok mu?{' '}
                <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                  Hesap oluşturun
                </Link>
              </p>
              <p className="text-sm text-gray-600">
                Şifrenizi mi unuttunuz?{' '}
                <Link to="/contact" className="text-blue-600 hover:text-blue-700 font-medium">
                  Destek alın
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <ShieldCheckIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="text-blue-800 font-medium mb-1">Güvenli Erişim</p>
              <p className="text-blue-700">
                {loginType === 'admin' 
                  ? 'Admin paneli Supabase Auth ile korunmaktadır.'
                  : 'Müşteri verileri Supabase database\'inde güvenle saklanmaktadır.'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;