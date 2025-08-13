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
        yearsExperience: 'Yıl Deneyim',
        projects: 'Proje',
        customers: 'Müşteri'
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
      // Footer
      footer: {
        quickLinks: 'Hızlı Bağlantılar',
        privacy: 'Gizlilik Politikası',
        terms: 'Kullanım Şartları',
        rights: 'Tüm hakları saklıdır.'
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
        yearsExperience: 'Years Experience',
        projects: 'Projects',
        customers: 'Customers'
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
      // Footer
      footer: {
        quickLinks: 'Quick Links',
        privacy: 'Privacy Policy',
        terms: 'Terms of Service',
        rights: 'All rights reserved.'
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