import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../hooks/useContent';
import { 
  CogIcon,
  ChevronLeftIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  LinkIcon
} from '@heroicons/react/24/outline';

const FooterManagementPage: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const [localSettings, setLocalSettings] = useState(settings);
  const [saved, setSaved] = useState(false);

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
          <h1 className="text-2xl font-bold text-gray-900">Footer Yönetimi</h1>
        </div>
        <button
          onClick={handleSave}
          className={`btn ${saved ? 'bg-green-600' : 'bg-blue-600'} text-white hover:${saved ? 'bg-green-700' : 'bg-blue-700'} transition-colors`}
        >
          {saved ? 'Kaydedildi!' : 'Kaydet'}
        </button>
      </div>

      {/* Company Description */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Şirket Açıklaması</h2>
        
        <div className="space-y-6">
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
                placeholder="Şirket hakkında kısa açıklama..."
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
                placeholder="Brief description about the company..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">İletişim Bilgileri</h2>
        
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
                <ClockIcon className="w-4 h-4 inline mr-2" />
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
                <ClockIcon className="w-4 h-4 inline mr-2" />
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

      {/* Social Media Links */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Sosyal Medya Bağlantıları</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <LinkIcon className="w-4 h-4 inline mr-2" />
              LinkedIn
            </label>
            <input
              type="url"
              value={localSettings.socialMedia.linkedin}
              onChange={(e) => handleInputChange('socialMedia.linkedin', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://linkedin.com/company/emic"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <LinkIcon className="w-4 h-4 inline mr-2" />
              Twitter
            </label>
            <input
              type="url"
              value={localSettings.socialMedia.twitter}
              onChange={(e) => handleInputChange('socialMedia.twitter', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://twitter.com/emic"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <LinkIcon className="w-4 h-4 inline mr-2" />
              Facebook
            </label>
            <input
              type="url"
              value={localSettings.socialMedia.facebook}
              onChange={(e) => handleInputChange('socialMedia.facebook', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://facebook.com/emic"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <LinkIcon className="w-4 h-4 inline mr-2" />
              Instagram
            </label>
            <input
              type="url"
              value={localSettings.socialMedia.instagram}
              onChange={(e) => handleInputChange('socialMedia.instagram', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://instagram.com/emic"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <LinkIcon className="w-4 h-4 inline mr-2" />
              YouTube
            </label>
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

      {/* Copyright Information */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Telif Hakkı Bilgileri</h2>
        
        <div className="space-y-4">
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
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Önizleme:</h4>
            <p className="text-sm text-gray-600">
              © 2024 {localSettings.siteName}. Tüm hakları saklıdır.
            </p>
            <p className="text-sm text-gray-600 mt-1">
              © 2024 {localSettings.siteNameEn}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterManagementPage;