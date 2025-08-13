import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  tr: {
    translation: {
      // Navigation
      nav: {
        home: 'Ana Sayfa',
        services: 'Hizmetlerimiz',
        about: 'Hakkımızda',
        laboratory: 'Laboratuvar',
        documents: 'Döküman',
        contact: 'İletişim',
        portal: 'Portal',
        login: 'Giriş Yap',
        admin: 'Yönetim'
      },
      // Common
      common: {
        phone: 'Telefon',
        email: 'E-posta',
        address: 'Adres',
        readMore: 'Devamını Oku',
        contactUs: 'İletişime Geçin',
        getQuote: 'Teklif Al',
        callNow: 'Hemen Ara',
        learnMore: 'Daha Fazla Bilgi',
        ourServices: 'Hizmetlerimiz',
        whyChooseUs: 'Neden Bizi Seçin',
        experience: 'Deneyim',
        projects: 'Proje',
        experts: 'Uzman',
        support: 'Destek',
        loading: 'Yükleniyor...'
      },
      // Home Page
      home: {
        heroTitle: 'Endüstriyel Muayene ve Test Hizmetlerinde',
        heroSubtitle: 'Güvenilir Çözüm',
        heroDescription: '25+ yıllık deneyimimiz ile tahribatsız muayene, kaynak kontrolü ve basınçlı kap muayenesi alanlarında profesyonel hizmet sunuyoruz.',
        discoverServices: 'Hizmetlerimizi Keşfedin',
        portalLogin: 'Portal Girişi',
        serviceAreas: 'Hizmet Alanlarımız',
        viewAllServices: 'Tüm Hizmetleri Gör',
        servicesTitle: 'Hizmetlerimiz',
        servicesSubtitle: 'TSE, TÜRKAK akrediteli laboratuvarımızda sunduğumuz profesyonel hizmetler',
        whyEmicTitle: 'Neden EMIC?',
        whyEmicDescription: 'Endüstriyel muayene alanında uzun yıllara dayanan deneyimimiz ve teknolojik altyapımız ile güvenilir hizmet sunuyoruz.',
        accreditedLab: 'Akrediteli Laboratuvar',
        accreditedLabDesc: 'TÜRKAK akreditasyonlu laboratuvarımız ile güvenilir sonuçlar',
        expertTeam: 'Uzman Kadro',
        expertTeamDesc: 'Sertifikalı ve deneyimli mühendis kadromuz',
        modernEquipment: 'Modern Ekipman',
        modernEquipmentDesc: 'Son teknoloji muayene ve test ekipmanları',
        fastService: 'Hızlı Hizmet',
        fastServiceDesc: 'Kısa sürede güvenilir sonuçlar',
        ctaTitle: 'Projeleriniz İçin Hemen İletişime Geçin',
        ctaDescription: 'Endüstriyel muayene ve test hizmetleriniz için uzman ekibimizden ücretsiz teklif alın.',
        yearsExperience: 'Yıl Deneyim',
        projects: 'Proje',
        customers: 'Müşteri',
        languageTitle: 'Dil Seçimi',
        languageSubtitle: 'Size en uygun dilde hizmet almak için tercih ettiğiniz dili seçin',
        languageNote: 'Tüm içeriklerimiz profesyonel çeviri ile hazırlanmıştır',
        multiLanguageSupport: 'Çoklu Dil Desteği',
        professionalTranslation: 'Profesyonel Çeviri'
      },
      // Regions
      regions: {
        title: 'Hizmet Bölgelerimiz',
        subtitle: 'Türkiye genelinde geniş hizmet ağımız ile endüstriyel muayene ve test hizmetlerinizi en yakın bölgeden profesyonel ekibimizle sunuyoruz.',
        cities: 'Hizmet Verilen Şehirler',
        services: 'Sunulan Hizmetler',
        more: 'daha',
        moreServices: 'hizmet daha',
        details: 'Bölge Detayları',
        ctaTitle: 'Bölgenizde Hizmet Alın',
        ctaDescription: 'Hangi bölgede olursanız olun, uzman ekibimiz size en yakın noktadan hızlı ve güvenilir hizmet sunmaya hazır.',
        contactNow: 'Hemen İletişime Geçin',
        viewAllServices: 'Tüm Hizmetleri Görün'
      },
      // Regions
      regions: {
        title: 'Hizmet Bölgelerimiz',
        subtitle: 'Türkiye genelinde geniş hizmet ağımız ile endüstriyel muayene ve test hizmetlerinizi en yakın bölgeden profesyonel ekibimizle sunuyoruz.',
        cities: 'Hizmet Verilen Şehirler',
        services: 'Sunulan Hizmetler',
        more: 'daha',
        moreServices: 'hizmet daha',
        details: 'Bölge Detayları',
        ctaTitle: 'Bölgenizde Hizmet Alın',
        ctaDescription: 'Hangi bölgede olursanız olun, uzman ekibimiz size en yakın noktadan hızlı ve güvenilir hizmet sunmaya hazır.',
        contactNow: 'Hemen İletişime Geçin',
        viewAllServices: 'Tüm Hizmetleri Görün'
      },
      // References
      references: {
        title: 'Referanslarımız',
        subtitle: 'Güvenilir hizmetlerimizle birçok değerli kurumla çalışma fırsatı bulduk.',
        noReferences: 'Henüz referans eklenmemiş.',
        companies: 'Referans Firma',
        sectors: 'Farklı Sektör',
        experience: 'Yıllık Deneyim',
        ctaText: 'Siz de güvenilir hizmetlerimizden yararlanmak ister misiniz?'
      },
      // Services
      services: {
        title: 'Hizmetlerimiz',
        subtitle: 'TSE ve TÜRKAK akrediteli laboratuvarımızda, endüstriyel muayene ve test alanında 25+ yıllık deneyimimizle profesyonel hizmet sunuyoruz.',
        ndt: {
          title: 'Tahribatsız Muayene (NDT)',
          description: 'ASNT SNT-TC-1A ve EN ISO 9712 standartlarına uygun muayene hizmetleri',
          ut: 'Ultrasonik Test (UT)',
          rt: 'Radyografik Test (RT)',
          pt: 'Sıvı Penetrant Test (PT)',
          mt: 'Manyetik Parçacık Testi (MT)',
          vt: 'Görsel Muayene (VT)',
          et: 'Eddy Current Test (ET)'
        },
        welding: {
          title: 'Kaynak Muayenesi',
          description: 'EN ISO 3834 ve ASME standartlarına uygun kaynak kalite kontrolü',
          wps: 'Kaynak Prosedürü Onayı (WPS/WPQR)',
          welder: 'Kaynakçı Yeterlilik Testleri',
          inspector: 'Kaynak Kontrolörü Sertifikasyonu',
          production: 'Üretim Muayenesi ve Kontrolü',
          analysis: 'Kaynak Hatası Analizi'
        },
        pressure: {
          title: 'Basınçlı Kap Muayenesi',
          description: 'Basınçlı Ekipman Yönetmeliği kapsamında muayene hizmetleri',
          initial: 'İlk Muayene ve Testler',
          periodic: 'Periyodik Muayene (1-3-6 yıl)',
          extraordinary: 'Olağanüstü Muayene ve Onarım',
          safety: 'Emniyet Raporu Hazırlama',
          hydrostatic: 'Hidrostatik Basınç Testi'
        },
        lifting: {
          title: 'Kaldırma Araçları Muayenesi',
          description: 'İş Sağlığı ve Güvenliği mevzuatı kapsamında kaldırma araçları kontrolü',
          crane: 'Vinç ve Kren Muayenesi',
          forklift: 'Forklift Muayenesi',
          rope: 'Halat ve Zincir Kontrolü',
          accessories: 'Kaldırma Aksesuarları',
          reports: 'Periyodik Kontrol Raporları'
        },
        material: {
          title: 'Malzeme Testleri',
          description: 'Mekanik ve kimyasal malzeme özelliklerinin belirlenmesi',
          tensile: 'Çekme Testi',
          impact: 'Darbe Testi (Charpy/Izod)',
          hardness: 'Sertlik Ölçümü',
          chemical: 'Kimyasal Analiz',
          metallography: 'Metalografi İncelemesi'
        }
      },
      // Footer
      footer: {
        quickLinks: 'Hızlı Bağlantılar',
        privacy: 'Gizlilik Politikası',
        terms: 'Kullanım Şartları',
        rights: 'Tüm hakları saklıdır.',
        description: 'Endüstriyel muayene ve test hizmetlerinde 25+ yıllık deneyim ile güvenilir çözümler sunuyoruz.',
        services: 'Hizmetlerimiz',
        corporate: 'Kurumsal',
        aboutUs: 'Hakkımızda',
        certificates: 'Sertifikalarımız',
        quality: 'Kalite Politikası',
        careers: 'Kariyer',
        contact: 'İletişim',
        address: 'Atatürk Organize Sanayi Bölgesi 10003 Sokak No:5 İzmir',
        rights: 'EMIC Muayene ve Test Hizmetleri. Tüm hakları saklıdır.'
      }
    }
  },
  en: {
    translation: {
      // Navigation
      nav: {
        home: 'Home',
        services: 'Services',
        about: 'About Us',
        laboratory: 'Laboratory',
        documents: 'Documents',
        contact: 'Contact',
        portal: 'Portal',
        login: 'Login',
        admin: 'Admin'
      },
      // Common
      common: {
        phone: 'Phone',
        email: 'Email',
        address: 'Address',
        readMore: 'Read More',
        contactUs: 'Contact Us',
        getQuote: 'Get Quote',
        callNow: 'Call Now',
        learnMore: 'Learn More',
        ourServices: 'Our Services',
        whyChooseUs: 'Why Choose Us',
        experience: 'Experience',
        projects: 'Projects',
        experts: 'Experts',
        support: 'Support',
        loading: 'Loading...'
      },
      // Home Page
      home: {
        heroTitle: 'Reliable Solutions in Industrial',
        heroSubtitle: 'Inspection and Testing Services',
        heroDescription: 'With 25+ years of experience, we provide professional services in non-destructive testing, welding inspection, and pressure vessel examination.',
        discoverServices: 'Discover Our Services',
        portalLogin: 'Portal Login',
        serviceAreas: 'Our Service Areas',
        viewAllServices: 'View All Services',
        servicesTitle: 'Our Services',
        servicesSubtitle: 'Professional services offered in our TSE and TÜRKAK accredited laboratory',
        whyEmicTitle: 'Why EMIC?',
        whyEmicDescription: 'We provide reliable services with our years of experience in industrial inspection and technological infrastructure.',
        accreditedLab: 'Accredited Laboratory',
        accreditedLabDesc: 'Reliable results with our TÜRKAK accredited laboratory',
        expertTeam: 'Expert Team',
        expertTeamDesc: 'Our certified and experienced engineering staff',
        modernEquipment: 'Modern Equipment',
        modernEquipmentDesc: 'State-of-the-art inspection and testing equipment',
        fastService: 'Fast Service',
        fastServiceDesc: 'Reliable results in a short time',
        ctaTitle: 'Contact Us Immediately for Your Projects',
        ctaDescription: 'Get a free quote from our expert team for your industrial inspection and testing services.',
        yearsExperience: 'Years Experience',
        projects: 'Projects',
        customers: 'Customers',
        languageTitle: 'Language Selection',
        languageSubtitle: 'Choose your preferred language to receive service in the most suitable language for you',
        languageNote: 'All our content is prepared with professional translation',
        multiLanguageSupport: 'Multi-Language Support',
        professionalTranslation: 'Professional Translation'
      },
      // Regions
      regions: {
        title: 'Our Service Regions',
        subtitle: 'We provide your industrial inspection and testing services from the nearest region with our professional team through our wide service network throughout Turkey.',
        cities: 'Cities Served',
        services: 'Services Offered',
        more: 'more',
        moreServices: 'more services',
        details: 'Region Details',
        ctaTitle: 'Get Service in Your Region',
        ctaDescription: 'Wherever you are, our expert team is ready to provide fast and reliable service from the nearest point.',
        contactNow: 'Contact Now',
        viewAllServices: 'View All Services'
      },
      // Regions
      regions: {
        title: 'Our Service Regions',
        subtitle: 'We provide your industrial inspection and testing services from the nearest region with our professional team through our wide service network throughout Turkey.',
        cities: 'Cities Served',
        services: 'Services Offered',
        more: 'more',
        moreServices: 'more services',
        details: 'Region Details',
        ctaTitle: 'Get Service in Your Region',
        ctaDescription: 'Wherever you are, our expert team is ready to provide fast and reliable service from the nearest point.',
        contactNow: 'Contact Now',
        viewAllServices: 'View All Services'
      },
      // References
      references: {
        title: 'Our References',
        subtitle: 'We have had the opportunity to work with many valuable institutions with our reliable services.',
        noReferences: 'No references added yet.',
        companies: 'Reference Companies',
        sectors: 'Different Sectors',
        experience: 'Years Experience',
        ctaText: 'Would you like to benefit from our reliable services too?'
      },
      // Services
      services: {
        title: 'Our Services',
        subtitle: 'We provide professional services with 25+ years of experience in industrial inspection and testing in our TSE and TÜRKAK accredited laboratory.',
        ndt: {
          title: 'Non-Destructive Testing (NDT)',
          description: 'Inspection services in accordance with ASNT SNT-TC-1A and EN ISO 9712 standards',
          ut: 'Ultrasonic Testing (UT)',
          rt: 'Radiographic Testing (RT)',
          pt: 'Liquid Penetrant Testing (PT)',
          mt: 'Magnetic Particle Testing (MT)',
          vt: 'Visual Testing (VT)',
          et: 'Eddy Current Testing (ET)'
        },
        welding: {
          title: 'Welding Inspection',
          description: 'Welding quality control in accordance with EN ISO 3834 and ASME standards',
          wps: 'Welding Procedure Specification (WPS/WPQR)',
          welder: 'Welder Qualification Tests',
          inspector: 'Welding Inspector Certification',
          production: 'Production Inspection and Control',
          analysis: 'Welding Defect Analysis'
        },
        pressure: {
          title: 'Pressure Vessel Inspection',
          description: 'Inspection services under Pressure Equipment Directive',
          initial: 'Initial Inspection and Tests',
          periodic: 'Periodic Inspection (1-3-6 years)',
          extraordinary: 'Extraordinary Inspection and Repair',
          safety: 'Safety Report Preparation',
          hydrostatic: 'Hydrostatic Pressure Test'
        },
        lifting: {
          title: 'Lifting Equipment Inspection',
          description: 'Lifting equipment control under Occupational Health and Safety legislation',
          crane: 'Crane Inspection',
          forklift: 'Forklift Inspection',
          rope: 'Rope and Chain Control',
          accessories: 'Lifting Accessories',
          reports: 'Periodic Control Reports'
        },
        material: {
          title: 'Material Testing',
          description: 'Determination of mechanical and chemical material properties',
          tensile: 'Tensile Test',
          impact: 'Impact Test (Charpy/Izod)',
          hardness: 'Hardness Measurement',
          chemical: 'Chemical Analysis',
          metallography: 'Metallographic Examination'
        }
      },
      // Footer
      footer: {
        quickLinks: 'Quick Links',
        privacy: 'Privacy Policy',
        terms: 'Terms of Service',
        rights: 'All rights reserved.',
        description: 'We provide reliable solutions with 25+ years of experience in industrial inspection and testing services.',
        services: 'Services',
        corporate: 'Corporate',
        aboutUs: 'About Us',
        certificates: 'Certificates',
        quality: 'Quality Policy',
        careers: 'Careers',
        contact: 'Contact',
        address: 'Atatürk Organized Industrial Zone 10003 Street No:5 Izmir',
        rights: 'EMIC Inspection and Testing Services. All rights reserved.'
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'tr',
    debug: false,
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    }
  });

export default i18n;