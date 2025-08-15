import React, { useState } from 'react';
import { 
  KeyIcon,
  ClipboardDocumentIcon,
  ArrowPathIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { generateSecurePassword, generateSimplePassword, validatePassword, getPasswordStrength } from '../utils/passwordGenerator';

interface PasswordGeneratorProps {
  onPasswordGenerated?: (password: string) => void;
  showCopyButton?: boolean;
  showValidation?: boolean;
  defaultLength?: number;
}

const PasswordGenerator: React.FC<PasswordGeneratorProps> = ({
  onPasswordGenerated,
  showCopyButton = true,
  showValidation = true,
  defaultLength = 12
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordLength, setPasswordLength] = useState(defaultLength);
  const [passwordType, setPasswordType] = useState<'secure' | 'simple'>('secure');
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    const newPassword = passwordType === 'secure' 
      ? generateSecurePassword(passwordLength)
      : generateSimplePassword(passwordLength);
    
    setPassword(newPassword);
    onPasswordGenerated?.(newPassword);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Kopyalama başarısız:', err);
    }
  };

  const validation = password ? validatePassword(password) : null;
  const strength = password ? getPasswordStrength(password) : null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
      <div className="flex items-center space-x-3">
        <KeyIcon className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Şifre Oluşturucu</h3>
      </div>

      {/* Password Type Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Şifre Türü</label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="secure"
              checked={passwordType === 'secure'}
              onChange={(e) => setPasswordType(e.target.value as 'secure' | 'simple')}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Güvenli (özel karakterler dahil)</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="simple"
              checked={passwordType === 'simple'}
              onChange={(e) => setPasswordType(e.target.value as 'secure' | 'simple')}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Basit (sadece harf ve rakam)</span>
          </label>
        </div>
      </div>

      {/* Password Length */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Şifre Uzunluğu: {passwordLength} karakter
        </label>
        <input
          type="range"
          min="8"
          max="32"
          value={passwordLength}
          onChange={(e) => setPasswordLength(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>8</span>
          <span>32</span>
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={generatePassword}
        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        <ArrowPathIcon className="w-5 h-5" />
        <span>Yeni Şifre Oluştur</span>
      </button>

      {/* Generated Password Display */}
      {password && (
        <div className="space-y-3">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Oluşturulan Şifre
            </label>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  readOnly
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
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
              
              {showCopyButton && (
                <button
                  onClick={copyToClipboard}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                    copied 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {copied ? (
                    <>
                      <CheckCircleIcon className="w-4 h-4" />
                      <span className="text-sm">Kopyalandı!</span>
                    </>
                  ) : (
                    <>
                      <ClipboardDocumentIcon className="w-4 h-4" />
                      <span className="text-sm">Kopyala</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Password Strength */}
          {strength && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Şifre Gücü:</span>
                <span className={`text-sm font-medium ${strength.color}`}>
                  {strength.label}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    strength.score <= 2 ? 'bg-red-500' :
                    strength.score <= 4 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${(strength.score / 6) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Password Validation */}
          {showValidation && validation && (
            <div className="space-y-2">
              {validation.isValid ? (
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircleIcon className="w-4 h-4" />
                  <span className="text-sm">Şifre geçerli</span>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-red-600">
                    <ExclamationTriangleIcon className="w-4 h-4" />
                    <span className="text-sm">Şifre gereksinimleri:</span>
                  </div>
                  <ul className="text-xs text-red-600 ml-6 space-y-1">
                    {validation.errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Usage Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">💡 Kullanım İpuçları:</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Güvenli şifreler özel karakterler içerir</li>
          <li>• Basit şifreler sadece harf ve rakam içerir</li>
          <li>• Minimum 8, önerilen 12+ karakter</li>
          <li>• Her hesap için farklı şifre kullanın</li>
        </ul>
      </div>
    </div>
  );
};

export default PasswordGenerator;