import React, { useState, useEffect } from 'react';
import { useContent } from '../hooks/useContent';
import { CheckCircle, ArrowRight, Shield, Award, Clock, Users, X, FileText, Settings, Zap, IterationCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ServiceDetailModalProps {
  service: any;
  isOpen: boolean;
  onClose: () => void;
}

const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({ service, isOpen, onClose }) => {
  const { i18n } = useTranslation();
  
  if (!isOpen || !service) return null;

  const title = i18n.language === 'en' ? service.titleEn : service.title;
  const content = i18n.language === 'en' ? service.contentEn : service.content;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
              <p className="text-gray-600">{i18n.language === 'en' ? service.title : service.titleEn}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Service Description */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-600" />
                  Hizmet Açıklaması
                </h3>
                <div 
                  className="text-gray-600 leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </div>

              {/* Service Features */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-orange-600" />
                  Hizmet Özellikleri
                </h3>
                <div className="space-y-3">
                  {getServiceFeatures(service.slug).map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Service Details */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-purple-600" />
                  Teknik Detaylar
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  {getServiceDetails(service.slug).map((detail, index) => (
                    <div key={index} className="flex justify-between items-start">
                      <span className="font-medium text-gray-700">{detail.label}:</span>
                      <span className="text-gray-600 text-right flex-1 ml-3">{detail.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Standards */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-green-600" />
                  Standartlar ve Sertifikalar
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {getServiceStandards(service.slug).map((standard, index) => (
                    <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                      <div className="font-semibold text-blue-900 text-sm">{standard}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
                <h4 className="font-semibold mb-2">Bu Hizmet İçin Teklif Alın</h4>
                <p className="text-blue-100 text-sm mb-4">
                  Uzman ekibimiz size özel çözüm sunar
                </p>
                <div className="flex space-x-3">
                  <button className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium">
                    Teklif İste
                  </button>
                  <button className="border border-white text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-colors">
                    İletişime Geç
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions for service details
const getServiceFeatures = (slug: string) => {
  const features: Record<string, string[]> = {
    'ndt-services': [
      'ASNT SNT-TC-1A ve EN ISO 9712 standartlarına uygun muayene',
      'Deneyimli ve sertifikalı muayene personeli',
      'Modern ve kalibre edilmiş ekipmanlar',
      'Hızlı rapor hazırlama süreci',
      'Saha ve laboratuvar hizmetleri',
      '7/24 acil durum desteği'
    ],
    'welding-inspection': [
      'EN ISO 3834 ve ASME standartlarına uygun kontrol',
      'WPS/WPQR prosedür onayları',
      'Kaynakçı yeterlilik testleri',
      'Üretim sürecinde kalite kontrolü',
      'Kaynak hatası analizi ve çözüm önerileri',
      'Detaylı raporlama ve dokümantasyon'
    ],
    'pressure-vessel-inspection': [
      'Basınçlı Ekipman Yönetmeliği kapsamında muayene',
      'İlk muayene ve periyodik kontroller',
      'Hidrostatik basınç testleri',
      'Emniyet raporu hazırlama',
      'Olağanüstü muayene hizmetleri',
      'Yasal uyumluluk sağlama'
    ],
    'lifting-equipment-inspection': [
      'İSG mevzuatına uygun kontroller',
      'Vinç, kren ve forklift muayeneleri',
      'Halat ve zincir kontrolleri',
      'Kaldırma aksesuarları muayenesi',
      'Periyodik kontrol raporları',
      'Güvenlik sertifikasyonu'
    ],
    'material-testing': [
      'Mekanik ve kimyasal özellik testleri',
      'Çekme, darbe ve sertlik testleri',
      'Kimyasal analiz ve kompozisyon',
      'Metalografi incelemeleri',
      'Malzeme karakterizasyonu',
      'Kalite kontrol testleri'
    ]
  };
  
  return features[slug] || [
    'Profesyonel hizmet anlayışı',
    'Deneyimli teknik kadro',
    'Modern ekipman parkı',
    'Hızlı ve güvenilir sonuçlar'
  ];
};

const getServiceDetails = (slug: string) => {
  const details: Record<string, Array<{label: string, value: string}>> = {
    'ndt-services': [
      { label: 'Muayene Yöntemleri', value: 'UT, RT, PT, MT, VT, ET' },
      { label: 'Uygulama Alanları', value: 'Petrokimya, Enerji, İnşaat' },
      { label: 'Rapor Süresi', value: '1-3 iş günü' },
      { label: 'Sertifikasyon', value: 'ASNT SNT-TC-1A, EN ISO 9712' },
      { label: 'Hizmet Türü', value: 'Saha ve Laboratuvar' }
    ],
    'welding-inspection': [
      { label: 'Kontrol Türleri', value: 'Üretim öncesi, sırası ve sonrası' },
      { label: 'Prosedür Onayı', value: 'WPS/WPQR hazırlama ve onay' },
      { label: 'Test Türleri', value: 'Kaynakçı yeterlilik testleri' },
      { label: 'Standartlar', value: 'EN ISO 3834, ASME' },
      { label: 'Rapor Süresi', value: '2-5 iş günü' }
    ],
    'pressure-vessel-inspection': [
      { label: 'Muayene Türleri', value: 'İlk, Periyodik, Olağanüstü' },
      { label: 'Test Yöntemleri', value: 'Hidrostatik, Pnömatik' },
      { label: 'Periyot', value: '1, 3, 6 yıllık kontroller' },
      { label: 'Mevzuat', value: 'Basınçlı Ekipman Yönetmeliği' },
      { label: 'Belgelendirme', value: 'Emniyet raporu ve sertifika' }
    ],
    'lifting-equipment-inspection': [
      { label: 'Ekipman Türleri', value: 'Vinç, Kren, Forklift, Halat' },
      { label: 'Kontrol Periyodu', value: 'Yıllık periyodik kontroller' },
      { label: 'Test Yöntemleri', value: 'Yük testi, Görsel muayene' },
      { label: 'Mevzuat', value: 'İSG Kanunu ve Yönetmelikleri' },
      { label: 'Belgelendirme', value: 'Periyodik kontrol raporu' }
    ],
    'material-testing': [
      { label: 'Test Türleri', value: 'Çekme, Darbe, Sertlik' },
      { label: 'Analiz Yöntemleri', value: 'Kimyasal, Metalografi' },
      { label: 'Ekipmanlar', value: 'Universal test, Spektrometre' },
      { label: 'Standartlar', value: 'ASTM, EN, TS' },
      { label: 'Rapor Süresi', value: '1-2 iş günü' }
    ]
  };
  
  return details[slug] || [
    { label: 'Hizmet Türü', value: 'Profesyonel muayene' },
    { label: 'Süre', value: '1-5 iş günü' },
    { label: 'Standart', value: 'Uluslararası standartlar' },
    { label: 'Rapor', value: 'Detaylı analiz raporu' }
  ];
};

const getServiceStandards = (slug: string) => {
  const standards: Record<string, string[]> = {
    'ndt-services': ['ASNT SNT-TC-1A', 'EN ISO 9712', 'ASTM E165', 'ASTM E709', 'EN 571-1', 'ASTM E1444'],
    'welding-inspection': ['EN ISO 3834', 'ASME IX', 'AWS D1.1', 'EN ISO 15614', 'ASTM A370', 'EN 287-1'],
    'pressure-vessel-inspection': ['PED 2014/68/EU', 'ASME VIII', 'EN 13445', 'AD 2000', 'ASTM A262', 'EN 10204'],
    'lifting-equipment-inspection': ['EN 14492-2', 'LOLER 1998', 'BS 7121', 'FEM 1.001', 'DIN 15018', 'ISO 4301'],
    'material-testing': ['ASTM E8', 'EN ISO 6892', 'ASTM E23', 'EN ISO 148', 'ASTM E18', 'EN ISO 6508']
  };
  
  return standards[slug] || ['ISO 9001', 'EN Standards', 'ASTM Standards', 'TS Standards'];
};

const ServicesPage: React.FC = () => {
  const { i18n } = useTranslation();
  const { content: services } = useContent('service', 'published');
  const [selectedService, setSelectedService] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleServiceClick = (service: any) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Hizmetlerimiz
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-4xl mx-auto">
              Endüstriyel muayene ve test alanında kapsamlı hizmet yelpazesi ile profesyonel çözümler sunuyoruz.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {services.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-12">
              {services.map((service, index) => (
                <div key={service.id} className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow duration-200">
                  <div className="flex items-start mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <CheckCircle className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {i18n.language === 'en' ? service.titleEn : service.title}
                      </h2>
                      <div className="w-16 h-1 bg-orange-500 mb-4"></div>
                    </div>
                  </div>
                  
                  <div 
                    className="text-gray-600 mb-6 leading-relaxed"
                    dangerouslySetInnerHTML={{ 
                      __html: (i18n.language === 'en' ? service.contentEn : service.content).substring(0, 200) + '...' 
                    }}
                  />
                  
                  <button 
                    onClick={() => handleServiceClick(service)}
                    className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-2 transition-colors duration-200"
                  >
                    {i18n.language === 'en' ? 'Detailed Information' : 'Detaylı Bilgi'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">
                {i18n.language === 'en' ? 'No services added yet.' : 'Henüz hizmet eklenmemiş.'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {i18n.language === 'en' ? 'Our Service Advantages' : 'Hizmet Avantajlarımız'}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {i18n.language === 'en' 
                ? 'We make a difference with our 25+ years of experience in the sector and our service approach in accordance with international standards.'
                : 'Sektörde 25+ yıllık deneyimimiz ve uluslararası standartlara uygun hizmet anlayışımızla fark yaratıyoruz.'
              }
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {i18n.language === 'en' ? 'Reliable' : 'Güvenilir'}
              </h3>
              <p className="text-gray-600">
                {i18n.language === 'en' 
                  ? 'Reliable service with 25+ years of industry experience'
                  : '25+ yıllık sektör deneyimi ile güvenilir hizmet'
                }
              </p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {i18n.language === 'en' ? 'Certified' : 'Sertifikalı'}
              </h3>
              <p className="text-gray-600">
                {i18n.language === 'en' 
                  ? 'ASNT SNT-TC-1A and EN ISO 9712 standards'
                  : 'ASNT SNT-TC-1A ve EN ISO 9712 standartları'
                }
              </p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {i18n.language === 'en' ? 'Expert Team' : 'Uzman Ekip'}
              </h3>
              <p className="text-gray-600">
                {i18n.language === 'en' 
                  ? 'Expert and experienced technical staff'
                  : 'Alanında uzman ve deneyimli teknik personel'
                }
              </p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {i18n.language === 'en' ? 'Fast Service' : 'Hızlı Hizmet'}
              </h3>
              <p className="text-gray-600">
                {i18n.language === 'en' 
                  ? 'Timely and quality service approach'
                  : 'Zamanında ve kaliteli hizmet anlayışı'
                }
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {i18n.language === 'en' ? 'Get Information About Our Services' : 'Hizmetlerimiz Hakkında Bilgi Alın'}
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto">
            {i18n.language === 'en' 
              ? 'Our expert team evaluates your project needs and offers customized solutions.'
              : 'Uzman ekibimiz projenizin ihtiyaçlarını değerlendirerek size özel çözümler sunar.'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200">
              {i18n.language === 'en' ? 'Request Quote' : 'Teklif İsteyin'}
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200">
              {i18n.language === 'en' ? 'Contact Us' : 'İletişime Geçin'}
            </button>
          </div>
        </div>
      </section>

      {/* Service Detail Modal */}
      <ServiceDetailModal 
        service={selectedService}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
};

export default ServicesPage;