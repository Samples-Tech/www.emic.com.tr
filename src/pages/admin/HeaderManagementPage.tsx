import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../hooks/useContent';
import MediaUploader from '../../components/MediaUploader';
import { 
  CogIcon,
  ChevronLeftIcon,
  PhotoIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  GlobeAltIcon,
  ArrowUpTrayIcon
} from '@heroicons/react/24/outline';

const HeaderManagementPage: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const [localSettings, setLocalSettings] = useState(settings);
  const [saved, setSaved] = useState(false);
  const [showUploader, setShowUploader] = useState(false);

  React.useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSave = () => {
    updateSettings(localSettings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleInputChange = (path: string, value: any) => {
    setLocalSettings(prev => {
      const keys = path.split('.');
      const newSettings = { ...prev };
      let current: any = newSettings;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newSettings;
    });
  };

  const handleLogoUpload = (files: FileList) => {
    const file = files[0];
    if (file && file.type.startsWith('image/')) {
      // Create a data URL for the uploaded file
      const reader = new FileReader();
      reader.onload = (e) => {
        const logoUrl = e.target?.result as string;
        handleInputChange('logo', logoUrl);
        setShowUploader(false);
      };
      reader.readAsDataURL(file);
      
      console.log('Logo uploaded:', file.name);
    }
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
          <CogIcon className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Header Yönetimi</h1>
        </div>
        <button
          onClick={handleSave}
          className={`btn ${saved ? 'bg-green-600' : 'bg-blue-600'} text-white hover:${saved ? 'bg-green-700' : 'bg-blue-700'} transition-colors`}
        >
          {saved ? 'Kaydedildi!' : 'Kaydet'}
        </button>
      </div>

      {/* Logo Settings */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Logo Ayarları</h2>
        
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo URL
              </label>
              <div className="space-y-3">
                <input
                  type="url"
                  value={localSettings.logo}
                  onChange={(e) => handleInputChange('logo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/logo.png"
                />
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">veya</span>
                  <button
                    type="button"
                    onClick={() => setShowUploader(!showUploader)}
                    className="flex items-center space-x-2 px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <ArrowUpTrayIcon className="w-4 h-4" />
                    <span>Bilgisayardan Yükle</span>
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Önerilen boyut: 200x80px</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo Alt Metni
              </label>
              <input
                type="text"
                value={localSettings.logoAlt}
                onChange={(e) => handleInputChange('logoAlt', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Şirket logosu"
              />
            </div>
          </div>
          
          {/* Logo Upload Section */}
          {showUploader && (
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-md font-medium text-gray-900 mb-4">Logo Yükle</h4>
              <MediaUploader
                onUpload={handleLogoUpload}
                acceptedTypes="image/*"
                maxSize={2}
                multiple={false}
              />
              <p className="text-xs text-gray-500 mt-2">
                Desteklenen formatlar: JPG, PNG, SVG. Maksimum boyut: 2MB
              </p>
            </div>
          )}
          
          {/* Logo Preview */}
          {localSettings.logo && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo Önizleme
              </label>
              <div className="p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <img
                  src={localSettings.logo}
                  alt={localSettings.logoAlt}
                  className="h-20 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      const errorDiv = document.createElement('div');
                      errorDiv.className = 'text-red-500 text-sm';
                      errorDiv.textContent = 'Logo yüklenemedi. URL\'yi kontrol edin.';
                      parent.appendChild(errorDiv);
                    }
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Top Bar Settings */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Üst Bar Bilgileri</h2>
        
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <PhoneIcon className="w-4 h-4 inline mr-2" />
                Telefon
              </label>
              <input
                type="tel"
                value={localSettings.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <EnvelopeIcon className="w-4 h-4 inline mr-2" />
                E-posta
              </label>
              <input
                type="email"
                value={localSettings.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Çalışma Saatleri (Türkçe)
              </label>
              <input
                type="text"
                value={localSettings.workingHours}
                onChange={(e) => handleInputChange('workingHours', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Çalışma Saatleri (İngilizce)
              </label>
              <input
                type="text"
                value={localSettings.workingHoursEn}
                onChange={(e) => handleInputChange('workingHoursEn', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Social Media Settings */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Sosyal Medya Bağlantıları</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
            <input
              type="url"
              value={localSettings.socialMedia.linkedin}
              onChange={(e) => handleInputChange('socialMedia.linkedin', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
            <input
              type="url"
              value={localSettings.socialMedia.twitter}
              onChange={(e) => handleInputChange('socialMedia.twitter', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
            <input
              type="url"
              value={localSettings.socialMedia.facebook}
              onChange={(e) => handleInputChange('socialMedia.facebook', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
            <input
              type="url"
              value={localSettings.socialMedia.instagram}
              onChange={(e) => handleInputChange('socialMedia.instagram', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://instagram.com/emic"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">YouTube</label>
            <input
              type="url"
              value={localSettings.socialMedia.youtube}
              onChange={(e) => handleInputChange('socialMedia.youtube', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://youtube.com/@emic"
            />
          </div>
        </div>
      </div>

      {/* Company Info */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Şirket Bilgileri</h2>
        
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Şirket Adı (Türkçe)
              </label>
              <input
                type="text"
                value={localSettings.siteName}
                onChange={(e) => handleInputChange('siteName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Şirket Adı (İngilizce)
              </label>
              <input
                type="text"
                value={localSettings.siteNameEn}
                onChange={(e) => handleInputChange('siteNameEn', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slogan (Türkçe)
              </label>
              <input
                type="text"
                value={localSettings.tagline}
                onChange={(e) => handleInputChange('tagline', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slogan (İngilizce)
              </label>
              <input
                type="text"
                value={localSettings.taglineEn}
                onChange={(e) => handleInputChange('taglineEn', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderManagementPage;