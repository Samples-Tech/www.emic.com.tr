import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../hooks/useContent';
import { 
  CogIcon,
  ChevronLeftIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  BellIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  UserIcon,
  KeyIcon,
  ArrowUpTrayIcon
} from '@heroicons/react/24/outline';

const SettingsPage: React.FC = () => {
  const { settings, updateSettings: updateSettingsStore } = useSettings();

  const [activeTab, setActiveTab] = useState<'general' | 'contact' | 'seo' | 'features'>('general');
  const [saved, setSaved] = useState(false);
  const [localSettings, setLocalSettings] = useState(settings);

  React.useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSave = () => {
    updateSettingsStore(localSettings);
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

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('Logo dosyası 2MB\'dan küçük olmalıdır.');
        return;
      }

      // Create a data URL for the uploaded file
      const reader = new FileReader();
      reader.onload = (event) => {
        const logoUrl = event.target?.result as string;
        handleInputChange('logo', logoUrl);
      };
      reader.readAsDataURL(file);
      
      console.log('Logo uploaded:', file.name, 'Size:', (file.size / 1024).toFixed(2) + 'KB');
    } else {
      alert('Lütfen geçerli bir görsel dosyası seçin (JPG, PNG, SVG).');
    }
  };

  const tabs = [
    { id: 'general', label: 'Genel', icon: CogIcon },
    { id: 'contact', label: 'İletişim', icon: PhoneIcon },
    { id: 'seo', label: 'SEO', icon: GlobeAltIcon },
    { id: 'features', label: 'Özellikler', icon: ShieldCheckIcon }
  ];

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
          <CogIcon className="w-8 h-8 text-gray-600" />
          <h1 className="text-2xl font-bold text-gray-900">Site Ayarları</h1>
        </div>
        <button
          onClick={handleSave}
          className={`btn ${saved ? 'bg-green-600' : 'bg-blue-600'} text-white hover:${saved ? 'bg-green-700' : 'bg-blue-700'} transition-colors`}
        >
          {saved ? 'Kaydedildi!' : 'Kaydet'}
        </button>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="md:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Genel Ayarlar</h2>
              
              {/* Stats Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Ana Sayfa İstatistikleri</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-700">Deneyim</h4>
                    <input
                      type="text"
                      value={localSettings.stats?.experience?.value || '25+'}
                      onChange={(e) => handleInputChange('stats.experience.value', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="25+"
                    />
                    <input
                      type="text"
                      value={localSettings.stats?.experience?.labelTr || 'Yıl Deneyim'}
                      onChange={(e) => handleInputChange('stats.experience.labelTr', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="Yıl Deneyim"
                    />
                    <input
                      type="text"
                      value={localSettings.stats?.experience?.labelEn || 'Years Experience'}
                      onChange={(e) => handleInputChange('stats.experience.labelEn', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="Years Experience"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-700">Projeler</h4>
                    <input
                      type="text"
                      value={localSettings.stats?.projects?.value || '500+'}
                      onChange={(e) => handleInputChange('stats.projects.value', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="500+"
                    />
                    <input
                      type="text"
                      value={localSettings.stats?.projects?.labelTr || 'Proje'}
                      onChange={(e) => handleInputChange('stats.projects.labelTr', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="Proje"
                    />
                    <input
                      type="text"
                      value={localSettings.stats?.projects?.labelEn || 'Projects'}
                      onChange={(e) => handleInputChange('stats.projects.labelEn', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="Projects"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-700">Müşteriler</h4>
                    <input
                      type="text"
                      value={localSettings.stats?.customers?.value || '100+'}
                      onChange={(e) => handleInputChange('stats.customers.value', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="100+"
                    />
                    <input
                      type="text"
                      value={localSettings.stats?.customers?.labelTr || 'Müşteri'}
                      onChange={(e) => handleInputChange('stats.customers.labelTr', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="Müşteri"
                    />
                    <input
                      type="text"
                      value={localSettings.stats?.customers?.labelEn || 'Customers'}
                      onChange={(e) => handleInputChange('stats.customers.labelEn', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="Customers"
                    />
                  </div>
                </div>
                
                {/* Stats Preview */}
                <div className="bg-blue-900 text-white p-6 rounded-lg">
                  <h4 className="text-sm font-medium mb-4">Önizleme:</h4>
                  <div className="flex items-center space-x-8">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{localSettings.stats?.experience?.value || '25+'}</div>
                      <div className="text-blue-200 text-xs">
                        {i18n.language === 'en' ? localSettings.stats?.experience?.labelEn : localSettings.stats?.experience?.labelTr}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{localSettings.stats?.projects?.value || '500+'}</div>
                      <div className="text-blue-200 text-xs">
                        {i18n.language === 'en' ? localSettings.stats?.projects?.labelEn : localSettings.stats?.projects?.labelTr}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{localSettings.stats?.customers?.value || '100+'}</div>
                      <div className="text-blue-200 text-xs">
                        {i18n.language === 'en' ? localSettings.stats?.customers?.labelEn : localSettings.stats?.customers?.labelTr}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site Adı (Türkçe)
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
                    Site Adı (İngilizce)
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

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Açıklama (Türkçe)
                  </label>
                  <textarea
                    rows={4}
                    value={localSettings.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Açıklama (İngilizce)
                  </label>
                  <textarea
                    rows={4}
                    value={localSettings.descriptionEn}
                    onChange={(e) => handleInputChange('descriptionEn', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Logo Ayarları</h3>
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
                        <label className="flex items-center space-x-2 px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer">
                          <ArrowUpTrayIcon className="w-4 h-4" />
                          <span>Bilgisayardan Yükle</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">Önerilen boyut: 200x80px, Maksimum: 2MB</p>
                    </div>
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
                          if (parent && !parent.querySelector('.error-message')) {
                            const errorDiv = document.createElement('div');
                            errorDiv.className = 'text-red-500 text-sm error-message';
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
          )}

          {activeTab === 'contact' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">İletişim Bilgileri</h2>
              
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
                    <MapPinIcon className="w-4 h-4 inline mr-2" />
                    Adres (Türkçe)
                  </label>
                  <textarea
                    rows={3}
                    value={localSettings.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPinIcon className="w-4 h-4 inline mr-2" />
                    Adres (İngilizce)
                  </label>
                  <textarea
                    rows={3}
                    value={localSettings.addressEn}
                    onChange={(e) => handleInputChange('addressEn', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
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

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Sosyal Medya</h3>
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
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">SEO Ayarları</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Başlık (Türkçe)
                  </label>
                  <input
                    type="text"
                    value={localSettings.seo.metaTitle}
                    onChange={(e) => handleInputChange('seo.metaTitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Önerilen: 50-60 karakter</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Başlık (İngilizce)
                  </label>
                  <input
                    type="text"
                    value={localSettings.seo.metaTitleEn}
                    onChange={(e) => handleInputChange('seo.metaTitleEn', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Recommended: 50-60 characters</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Açıklama (Türkçe)
                  </label>
                  <textarea
                    rows={3}
                    value={localSettings.seo.metaDescription}
                    onChange={(e) => handleInputChange('seo.metaDescription', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">Önerilen: 150-160 karakter</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Açıklama (İngilizce)
                  </label>
                  <textarea
                    rows={3}
                    value={localSettings.seo.metaDescriptionEn}
                    onChange={(e) => handleInputChange('seo.metaDescriptionEn', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">Recommended: 150-160 characters</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Anahtar Kelimeler (Türkçe)
                  </label>
                  <input
                    type="text"
                    value={localSettings.seo.keywords}
                    onChange={(e) => handleInputChange('seo.keywords', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Virgülle ayırın</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Anahtar Kelimeler (İngilizce)
                  </label>
                  <input
                    type="text"
                    value={localSettings.seo.keywordsEn}
                    onChange={(e) => handleInputChange('seo.keywordsEn', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate with commas</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Site Özellikleri</h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <GlobeAltIcon className="w-6 h-6 text-blue-600" />
                    <div>
                      <h3 className="font-medium text-gray-900">Çoklu Dil Desteği</h3>
                      <p className="text-sm text-gray-600">Türkçe ve İngilizce dil seçenekleri</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localSettings.features.multiLanguage}
                      onChange={(e) => handleInputChange('features.multiLanguage', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <ShieldCheckIcon className="w-6 h-6 text-green-600" />
                    <div>
                      <h3 className="font-medium text-gray-900">İki Faktörlü Kimlik Doğrulama</h3>
                      <p className="text-sm text-gray-600">Kullanıcılar için 2FA desteği</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localSettings.features.twoFactorAuth}
                      onChange={(e) => handleInputChange('features.twoFactorAuth', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <BellIcon className="w-6 h-6 text-yellow-600" />
                    <div>
                      <h3 className="font-medium text-gray-900">E-posta Bildirimleri</h3>
                      <p className="text-sm text-gray-600">Otomatik e-posta bildirimleri</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localSettings.features.emailNotifications}
                      onChange={(e) => handleInputChange('features.emailNotifications', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center space-x-3">
                    <CogIcon className="w-6 h-6 text-red-600" />
                    <div>
                      <h3 className="font-medium text-gray-900">Bakım Modu</h3>
                      <p className="text-sm text-gray-600">Site geçici olarak kapatılır</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localSettings.features.maintenanceMode}
                      onChange={(e) => handleInputChange('features.maintenanceMode', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>
                
                {/* Document Settings */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Döküman Ayarları</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gizlilik Beyannamesi URL
                      </label>
                      <input
                        type="url"
                        value={localSettings.documents?.privacyDeclarationUrl || ''}
                        onChange={(e) => handleInputChange('documents.privacyDeclarationUrl', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="/documents/gizlilik-beyannamesi.pdf"
                      />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Beyanname Versiyonu
                        </label>
                        <input
                          type="text"
                          value={localSettings.documents?.privacyDeclarationVersion || ''}
                          onChange={(e) => handleInputChange('documents.privacyDeclarationVersion', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="2.1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Güncelleme Tarihi
                        </label>
                        <input
                          type="text"
                          value={localSettings.documents?.privacyDeclarationDate || ''}
                          onChange={(e) => handleInputChange('documents.privacyDeclarationDate', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Ocak 2024"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;