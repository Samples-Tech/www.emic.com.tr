import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Phone, Mail, MapPin, Clock, Linkedin, Twitter, Facebook, Instagram, Youtube, Search, Globe } from 'lucide-react';
import { useSettings } from '../hooks/useContent';
import LanguageSwitcher from './LanguageSwitcher';
import QuoteRequestModal from './QuoteRequestModal';
import ReferencesSection from './ReferencesSection';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const { settings } = useSettings();
  const location = useLocation();

  const navigation = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.services'), href: '/services' },
    { name: t('nav.about'), href: '/about' },
    { name: t('nav.laboratory'), href: '/laboratory' },
    { name: t('nav.documents'), href: '/documents' },
    { name: t('nav.contact'), href: '/contact' }
  ];

  const getText = (tr: string, en: string) => {
    return i18n.language === 'tr' ? tr : en;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        {/* Top Bar */}
        <div className="bg-blue-900 text-white py-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm space-y-2 sm:space-y-0">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-6">
                <div className="flex items-center space-x-2 text-xs sm:text-sm">
                  <Phone className="w-4 h-4" />
                  <span className="whitespace-nowrap">{settings.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-xs sm:text-sm">
                  <Mail className="w-4 h-4" />
                  <span className="whitespace-nowrap">{settings.email}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <LanguageSwitcher />
                <div className="hidden sm:flex items-center space-x-2">
                  {settings.socialMedia.linkedin && (
                    <a href={settings.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition-colors">
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {settings.socialMedia.twitter && (
                    <a href={settings.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition-colors">
                      <Twitter className="w-4 h-4" />
                    </a>
                  )}
                  {settings.socialMedia.facebook && (
                    <a href={settings.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition-colors">
                      <Facebook className="w-4 h-4" />
                    </a>
                  )}
                  {settings.socialMedia.instagram && (
                    <a href={settings.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition-colors">
                      <Instagram className="w-4 h-4" />
                    </a>
                  )}
                  {settings.socialMedia.youtube && (
                    <a href={settings.socialMedia.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition-colors">
                      <Youtube className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0">
              <Link to="/" className="flex items-center space-x-3">
                <img 
                  src={settings.logo} 
                  alt={settings.logoAlt}
                  className="h-10 sm:h-12 w-auto object-contain"
                />
              </Link>
              <div className="sm:ml-4">
                <p className="text-xs sm:text-sm text-gray-600">
                  {getText(settings.tagline || 'Muayene ve Test Hizmetleri', settings.taglineEn || 'Inspection and Testing Services')}
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 xl:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`text-gray-700 hover:text-blue-600 px-2 lg:px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                    location.pathname === item.href ? 'text-blue-600 bg-blue-50' : ''
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex items-center space-x-2 lg:space-x-4">
                <LanguageSwitcher />
                <div className="flex flex-col lg:flex-row space-y-1 lg:space-y-0 lg:space-x-2">
                  <button
                    onClick={() => setIsQuoteModalOpen(true)}
                    className="bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors text-xs font-medium whitespace-nowrap"
                  >
                    Teklif Al
                  </button>
                  <Link
                    to="/login"
                    className="bg-gray-600 text-white px-3 py-1.5 rounded-md hover:bg-gray-700 transition-colors text-xs font-medium whitespace-nowrap"
                  >
                    {t('nav.login')}
                  </Link>
                  <Link
                    to="/register"
                    className="bg-green-600 text-white px-3 py-1.5 rounded-md hover:bg-green-700 transition-colors text-xs font-medium whitespace-nowrap"
                  >
                    Kayıt Ol
                  </Link>
                </div>
              </div>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <LanguageSwitcher />
             <div className="flex items-center space-x-1">
               <button
                 onClick={() => setIsQuoteModalOpen(true)}
                 className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium hover:bg-blue-700 transition-colors whitespace-nowrap"
               >
                 Teklif Al
               </button>
               <Link
                 to="/login"
                 className="bg-gray-600 text-white px-2 py-1 rounded text-xs font-medium hover:bg-gray-700 transition-colors whitespace-nowrap"
               >
                 Giriş
               </Link>
               <Link
                 to="/register"
                 className="bg-green-600 text-white px-2 py-1 rounded text-xs font-medium hover:bg-green-700 transition-colors whitespace-nowrap"
               >
                 Kayıt
               </Link>
             </div>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-blue-600 p-2"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors whitespace-nowrap ${
                    location.pathname === item.href
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <button
                onClick={() => {
                  setIsQuoteModalOpen(true);
                  setIsMenuOpen(false);
                }}
                className="w-full text-left bg-blue-600 text-white px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 transition-colors"
              >
                Teklif Al
              </button>
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium bg-gray-600 text-white hover:bg-gray-700 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Giriş Yap
              </Link>
              <Link
                to="/register"
                className="block px-3 py-2 rounded-md text-base font-medium bg-green-600 text-white hover:bg-green-700 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Kayıt Ol
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src={settings.logo} 
                  alt={settings.logoAlt}
                  className="h-10 w-auto object-contain"
                />
                <div>
                  <h3 className="text-xl font-bold">
                    {getText(settings.siteName || '', settings.siteNameEn || '')}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {getText(settings.tagline || '', settings.taglineEn || '')}
                  </p>
                </div>
              </div>
              <p className="text-gray-300 mb-4 max-w-md">
                {getText(settings.description || '', settings.descriptionEn || '')}
              </p>
              <div className="flex items-center space-x-4">
                {settings.socialMedia.linkedin && (
                  <a href={settings.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
                {settings.socialMedia.twitter && (
                  <a href={settings.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                    <Twitter className="w-5 h-5" />
                  </a>
                )}
                {settings.socialMedia.facebook && (
                  <a href={settings.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                    <Facebook className="w-5 h-5" />
                  </a>
                )}
                {settings.socialMedia.instagram && (
                  <a href={settings.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                    <Instagram className="w-5 h-5" />
                  </a>
                )}
                {settings.socialMedia.youtube && (
                  <a href={settings.socialMedia.youtube} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                    <Youtube className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">{t('footer.quickLinks')}</h4>
              <ul className="space-y-2">
                {navigation.map((item) => (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4">{t('nav.contact')}</h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">
                    {getText(settings.address || '', settings.addressEn || '')}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-300">{settings.phone || ''}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-300">{settings.email || ''}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-300 text-sm">
                    {getText(settings.workingHours || '', settings.workingHoursEn || '')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2024 {getText(settings.siteName || '', settings.siteNameEn || '')}. {t('footer.rights')}
              </p>
              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <Link to="/documents" className="text-gray-400 hover:text-white text-sm transition-colors">
                  {t('footer.privacy')}
                </Link>
                <Link to="/documents" className="text-gray-400 hover:text-white text-sm transition-colors">
                  {t('footer.terms')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Quote Request Modal */}
      <QuoteRequestModal 
        isOpen={isQuoteModalOpen} 
        onClose={() => setIsQuoteModalOpen(false)} 
      />
    </div>
  );
};

export default Layout;