import React from 'react';
import { useTranslation } from 'react-i18next';
import { useReferences } from '../hooks/useContent';
import { 
  BuildingOfficeIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

const ReferenceImage: React.FC<{ reference: any }> = ({ reference }) => {
  const [imageError, setImageError] = React.useState(false);
  const { i18n } = useTranslation();

  if (imageError) {
    return (
      <div className="text-center p-4">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
          <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"/>
          </svg>
        </div>
        <div className="text-xs font-medium text-gray-700">
          {i18n.language === 'en' ? reference.nameEn : reference.name}
        </div>
      </div>
    );
  }

  return (
    <img
      src={reference.logo}
      alt={i18n.language === 'en' ? reference.nameEn : reference.name}
      className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300 opacity-70 group-hover:opacity-100"
      onError={() => setImageError(true)}
    />
  );
};

const ReferencesSection: React.FC = () => {
  const { references, loading } = useReferences('active');
  const { t, i18n } = useTranslation();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Yükleniyor...</div>
      </div>
    );
  }

  if (references.length === 0) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t('references.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('references.subtitle')}
            </p>
          </div>
          <div className="text-center py-12">
            <BuildingOfficeIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">{t('references.noReferences')}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t('references.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('references.subtitle')}
          </p>
        </div>

        {/* Scrolling References Logos */}
        <div className="relative overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100 py-8">
          <div className="flex animate-scroll space-x-12">
            {/* First set of references */}
            {references.map((reference) => (
              <div
                key={reference.id}
                className="flex-shrink-0 w-40 h-24 flex items-center justify-center group"
              >
                {reference.website ? (
                  <a
                    href={reference.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full h-full flex items-center justify-center p-4"
                  >
                    <ReferenceImage reference={reference} />
                  </a>
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-4">
                    <ReferenceImage reference={reference} />
                  </div>
                )}
              </div>
            ))}
            {/* Duplicate set for seamless scrolling */}
            {references.map((reference) => (
              <div
                key={`duplicate-${reference.id}`}
                className="flex-shrink-0 w-40 h-24 flex items-center justify-center group"
              >
                {reference.website ? (
                  <a
                    href={reference.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full h-full flex items-center justify-center p-4"
                  >
                    <img
                      src={reference.logo}
                      alt={i18n.language === 'en' ? reference.nameEn : reference.name}
                      className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300 opacity-70 group-hover:opacity-100"
                    />
                    <ReferenceImage reference={reference} />
                  </a>
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-4">
                    <ReferenceImage reference={reference} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* References Stats */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{references.length}</div>
            <div className="text-gray-600">{t('references.companies')}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {Array.from(new Set(references.map(ref => i18n.language === 'en' ? ref.sectorEn : ref.sector))).length}
            </div>
            <div className="text-gray-600">{t('references.sectors')}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">25+</div>
            <div className="text-gray-600">{t('references.experience')}</div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-6">
            {t('references.ctaText')}
          </p>
          <a 
            href="/contact" 
            className="inline-flex items-center space-x-2 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            <span>{t('common.contactUs')}</span>
            <GlobeAltIcon className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default ReferencesSection;