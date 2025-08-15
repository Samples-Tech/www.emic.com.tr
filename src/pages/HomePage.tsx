import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useContent, useSettings } from '../hooks/useContent';
import { contentStore } from '../lib/contentStore';
import { Link } from 'react-router-dom';
import { 
  CheckCircle, 
  ArrowRight, 
  Shield, 
  Award, 
  Clock, 
  Users,
  Phone,
  Mail,
  ChevronRight,
  Star,
  Zap,
  Target
} from 'lucide-react';
import { Globe } from 'lucide-react';
import ReferencesSection from '../components/ReferencesSection';
import LiveChat from '../components/LiveChat';
import SpecialDayModal from '../components/SpecialDayModal';
import ServiceRegionsSection from '../components/ServiceRegionsSection';

const HomePage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { content: heroContent } = useContent('hero', 'published');
  const { content: services } = useContent('service', 'published');
  const { settings } = useSettings();
  const [todaysSpecialDay, setTodaysSpecialDay] = useState<any>(null);
  const [showSpecialDay, setShowSpecialDay] = useState(false);

  const hero = heroContent[0] || null;

  useEffect(() => {
    // Check for today's special day
    const specialDay = contentStore.getTodaysSpecialDay();
    if (specialDay) {
      setTodaysSpecialDay(specialDay);
      setShowSpecialDay(true);
    }
  }, []);

  const getText = (tr: string, en: string) => {
    return i18n.language === 'tr' ? tr : en;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  {hero ? (i18n.language === 'en' ? hero.titleEn : hero.title) : t('home.heroTitle')}
                </h1>
                <p className="text-xl md:text-2xl text-blue-100 leading-relaxed">
                  {hero ? (i18n.language === 'en' ? hero.contentEn : hero.content) : t('home.heroDescription')}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/services"
                  className="inline-flex items-center px-8 py-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold text-lg group"
                >
                  {t('home.discoverServices')}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-blue-900 rounded-lg transition-colors font-semibold text-lg"
                >
                  {t('home.portalLogin')}
                </Link>
              </div>
              
              <div className="flex items-center space-x-8 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold">{settings.stats?.experience?.value || '25+'}</div>
                  <div className="text-blue-200 text-sm">
                    {i18n.language === 'en' ? settings.stats?.experience?.labelEn : settings.stats?.experience?.labelTr}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{settings.stats?.projects?.value || '500+'}</div>
                  <div className="text-blue-200 text-sm">
                    {i18n.language === 'en' ? settings.stats?.projects?.labelEn : settings.stats?.projects?.labelTr}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{settings.stats?.customers?.value || '100+'}</div>
                  <div className="text-blue-200 text-sm">
                    {i18n.language === 'en' ? settings.stats?.customers?.labelEn : settings.stats?.customers?.labelTr}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold mb-6">{t('home.serviceAreas')}</h3>
                <div className="space-y-4">
                  {services.slice(0, 4).map((service, index) => (
                    <div key={service.id} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-orange-400 flex-shrink-0" />
                      <span className="text-blue-100">{i18n.language === 'en' ? service.titleEn : service.title}</span>
                    </div>
                  ))}
                </div>
                <Link
                  to="/services"
                  className="inline-flex items-center mt-6 text-orange-400 hover:text-orange-300 font-medium"
                >
                  {t('home.viewAllServices')}
                  <ChevronRight className="ml-1 w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t('home.servicesTitle')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('home.servicesSubtitle')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={service.id} className="service-card group">
                <div className="feature-icon">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {i18n.language === 'en' ? service.titleEn : service.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {(i18n.language === 'en' ? service.contentEn : service.content).replace(/<[^>]*>/g, '').substring(0, 120)}...
                </p>
                <Link
                  to={`/services/${service.slug}`}
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  {t('common.learnMore')}
                  <ChevronRight className="ml-1 w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

     {/* Service Regions Section */}
     <ServiceRegionsSection />

      {/* Live Chat Component */}
      <LiveChat />

      {/* Special Day Modal */}
      {showSpecialDay && todaysSpecialDay && (
        <SpecialDayModal
          specialDay={todaysSpecialDay}
          onClose={() => setShowSpecialDay(false)}
        />
      )}
    </div>
  );
};

export default HomePage;