import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Mail, ArrowRight, Building2 } from 'lucide-react';
import { contentStore } from '../lib/contentStore';

interface ServiceRegion {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  cities: string[];
  citiesEn: string[];
  services: string[];
  servicesEn: string[];
  contactPhone?: string;
  contactEmail?: string;
  image?: string;
  order: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

const ServiceRegionsSection: React.FC = () => {
  const [regions, setRegions] = useState<ServiceRegion[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const loadRegions = () => {
      const serviceRegions = contentStore.getServiceRegions('active');
      setRegions(serviceRegions);
      setLoading(false);
    };

    loadRegions();
    const unsubscribe = contentStore.subscribe(loadRegions);
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Yükleniyor...</div>
      </div>
    );
  }

  if (regions.length === 0) {
    return null; // Don't show section if no regions
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t('regions.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('regions.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regions.map((region) => (
            <div key={region.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
              {/* Region Image */}
              {region.image && (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={region.image}
                    alt={i18n.language === 'en' ? region.nameEn : region.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">
                      {i18n.language === 'en' ? region.nameEn : region.name}
                    </h3>
                  </div>
                </div>
              )}

              <div className="p-6">
                {!region.image && (
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {i18n.language === 'en' ? region.nameEn : region.name}
                    </h3>
                  </div>
                )}

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {i18n.language === 'en' ? region.descriptionEn : region.description}
                </p>

                {/* Cities */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">{t('regions.cities')}:</h4>
                  <div className="flex flex-wrap gap-2">
                    {(i18n.language === 'en' ? region.citiesEn : region.cities).slice(0, 4).map((city, index) => (
                      <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {city}
                      </span>
                    ))}
                    {region.cities.length > 4 && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        +{region.cities.length - 4} {t('regions.more')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Services */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">{t('regions.services')}:</h4>
                  <div className="space-y-1">
                    {(i18n.language === 'en' ? region.servicesEn : region.services).slice(0, 3).map((service, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">{service}</span>
                      </div>
                    ))}
                    {region.services.length > 3 && (
                      <div className="text-xs text-gray-500">
                        +{region.services.length - 3} {t('regions.moreServices')}
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 mb-6">
                  {region.contactPhone && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4 text-blue-600" />
                      <a href={`tel:${region.contactPhone}`} className="hover:text-blue-600 transition-colors">
                        {region.contactPhone}
                      </a>
                    </div>
                  )}
                  {region.contactEmail && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4 text-blue-600" />
                      <a href={`mailto:${region.contactEmail}`} className="hover:text-blue-600 transition-colors">
                        {region.contactEmail}
                      </a>
                    </div>
                  )}
                </div>

                {/* CTA Button */}
                <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  <span>{t('regions.details')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {t('regions.ctaTitle')}
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              {t('regions.ctaDescription')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                <Phone className="w-5 h-5" />
                <span>{t('regions.contactNow')}</span>
              </a>
              <a
                href="/services"
                className="inline-flex items-center space-x-2 px-6 py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-colors font-semibold"
              >
                <Building2 className="w-5 h-5" />
                <span>{t('regions.viewAllServices')}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceRegionsSection;