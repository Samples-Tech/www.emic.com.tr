import React, { useState } from 'react';
import { ShieldCheckIcon, QrCodeIcon } from '@heroicons/react/24/outline';
import { setup2FA, enable2FA, disable2FA } from '../lib/api';

interface TwoFactorSetupProps {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

const TwoFactorSetup: React.FC<TwoFactorSetupProps> = ({ isEnabled, onToggle }) => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSetup = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await setup2FA();
      setQrCode(result.qr);
      setSecret(result.base32);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEnable = async () => {
    if (!token.trim()) {
      setError('Lütfen 2FA kodunu girin');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await enable2FA(token);
      onToggle(true);
      setQrCode(null);
      setSecret(null);
      setToken('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async () => {
    if (!confirm('2FA\'yı devre dışı bırakmak istediğinizden emin misiniz?')) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await disable2FA();
      onToggle(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex items-center space-x-3 mb-4">
        <ShieldCheckIcon className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">İki Faktörlü Kimlik Doğrulama</h3>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {!isEnabled ? (
        <div className="space-y-4">
          <p className="text-gray-600">
            Hesabınızın güvenliğini artırmak için 2FA'yı etkinleştirin.
          </p>

          {!qrCode ? (
            <button
              onClick={handleSetup}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
            >
              <QrCodeIcon className="w-4 h-4" />
              <span>{loading ? 'Hazırlanıyor...' : '2FA Kurulumunu Başlat'}</span>
            </button>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <img src={qrCode} alt="QR Code" className="mx-auto mb-4" />
                <p className="text-sm text-gray-600 mb-2">
                  Google Authenticator ile QR kodu tarayın veya manuel olarak girin:
                </p>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">{secret}</code>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="6 haneli doğrulama kodu"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength={6}
                />
                <button
                  onClick={handleEnable}
                  disabled={loading || !token.trim()}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                >
                  {loading ? 'Etkinleştiriliyor...' : '2FA\'yı Etkinleştir'}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-green-600">
            <ShieldCheckIcon className="w-5 h-5" />
            <span className="font-medium">2FA Etkin</span>
          </div>
          <p className="text-gray-600">
            Hesabınız iki faktörlü kimlik doğrulama ile korunuyor.
          </p>
          <button
            onClick={handleDisable}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400 transition-colors"
          >
            {loading ? 'Devre Dışı Bırakılıyor...' : '2FA\'yı Devre Dışı Bırak'}
          </button>
        </div>
      )}
    </div>
  );
};

export default TwoFactorSetup;