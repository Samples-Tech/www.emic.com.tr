interface ContentItem {
  id: string;
  type: 'hero' | 'service' | 'page' | 'news';
  title: string;
  titleEn: string;
  content: string;
  contentEn: string;
  slug: string;
  status: 'published' | 'draft';
  createdAt: string;
  updatedAt: string;
  image?: string;
  order?: number;
}

interface SiteSettings {
  siteName: string;
  siteNameEn: string;
  tagline: string;
  taglineEn: string;
  description: string;
  descriptionEn: string;
  logo: string;
  logoAlt: string;
  phone: string;
  email: string;
  address: string;
  addressEn: string;
  workingHours: string;
  workingHoursEn: string;
  socialMedia: {
    linkedin: string;
    twitter: string;
    facebook: string;
    instagram: string;
    youtube: string;
  };
  seo: {
    metaTitle: string;
    metaTitleEn: string;
    metaDescription: string;
    metaDescriptionEn: string;
    keywords: string;
    keywordsEn: string;
  };
  features: {
    multiLanguage: boolean;
    twoFactorAuth: boolean;
    emailNotifications: boolean;
    maintenanceMode: boolean;
  };
  documents: {
    privacyDeclarationUrl: string;
    privacyDeclarationVersion: string;
    privacyDeclarationDate: string;
  };
  stats: {
    experience: {
      value: string;
      labelTr: string;
      labelEn: string;
    };
    projects: {
      value: string;
      labelTr: string;
      labelEn: string;
    };
    customers: {
      value: string;
      labelTr: string;
      labelEn: string;
    };
  };
  references: Reference[];
  serviceRegions: ServiceRegion[];
  specialDays: SpecialDay[];
}

interface Reference {
  id: string;
  name: string;
  nameEn: string;
  logo: string;
  website?: string;
  sector: string;
  sectorEn: string;
  description?: string;
  descriptionEn?: string;
  order: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

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

interface SpecialDay {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  date: string; // MM-DD format (e.g., "01-01" for January 1st)
  type: 'celebration' | 'commemoration' | 'holiday' | 'announcement';
  image?: string;
  backgroundColor?: string;
  textColor?: string;
  isActive: boolean;
  showDuration: number; // seconds
  createdAt: string;
  updatedAt: string;
}

interface LaboratoryTest {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  method: string;
  methodEn: string;
  equipment: string;
  equipmentEn: string;
  standards: string;
  standardsEn: string;
  category: string;
  categoryEn: string;
  duration: string;
  durationEn: string;
  sampleRequirements: string;
  sampleRequirementsEn: string;
  reportFormat: string;
  reportFormatEn: string;
  order: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

// Default content
const defaultContent: ContentItem[] = [
  {
    id: '1',
    type: 'hero',
    title: 'Endüstriyel Muayene ve Test Hizmetlerinde Güvenilir Çözüm',
    titleEn: 'Reliable Solutions in Industrial Inspection and Testing Services',
    content: '25+ yıllık deneyimimiz ile tahribatsız muayene, kaynak kontrolü ve basınçlı kap muayenesi alanlarında profesyonel hizmet sunuyoruz.',
    contentEn: 'With 25+ years of experience, we provide professional services in non-destructive testing, welding inspection, and pressure vessel examination.',
    slug: 'hero-section',
    status: 'published',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
    order: 1
  },
  {
    id: '2',
    type: 'service',
    title: 'Tahribatsız Muayene (NDT)',
    titleEn: 'Non-Destructive Testing (NDT)',
    content: 'ASNT SNT-TC-1A ve EN ISO 9712 standartlarına uygun muayene hizmetleri sunuyoruz. Ultrasonik Test (UT), Radyografik Test (RT), Sıvı Penetrant Test (PT), Manyetik Parçacık Testi (MT), Görsel Muayene (VT), Eddy Current Test (ET) yöntemleri ile kapsamlı muayene hizmetleri.',
    contentEn: 'We provide inspection services in accordance with ASNT SNT-TC-1A and EN ISO 9712 standards. Comprehensive inspection services with Ultrasonic Testing (UT), Radiographic Testing (RT), Liquid Penetrant Testing (PT), Magnetic Particle Testing (MT), Visual Testing (VT), Eddy Current Testing (ET) methods.',
    slug: 'ndt-services',
    status: 'published',
    createdAt: '2024-01-02T11:00:00Z',
    updatedAt: '2024-01-10T16:20:00Z',
    order: 1
  },
  {
    id: '3',
    type: 'service',
    title: 'Kaynak Muayenesi',
    titleEn: 'Welding Inspection',
    content: 'EN ISO 3834 ve ASME standartlarına uygun kaynak kalite kontrolü. Kaynak Prosedürü Onayı (WPS/WPQR), Kaynakçı Yeterlilik Testleri, Kaynak Kontrolörü Sertifikasyonu, Üretim Muayenesi ve Kontrolü, Kaynak Hatası Analizi.',
    contentEn: 'Welding quality control in accordance with EN ISO 3834 and ASME standards. Welding Procedure Specification (WPS/WPQR), Welder Qualification Tests, Welding Inspector Certification, Production Inspection and Control, Welding Defect Analysis.',
    slug: 'welding-inspection',
    status: 'published',
    createdAt: '2024-01-03T12:00:00Z',
    updatedAt: '2024-01-11T17:30:00Z',
    order: 2
  },
  {
    id: '4',
    type: 'service',
    title: 'Basınçlı Kap Muayenesi',
    titleEn: 'Pressure Vessel Inspection',
    content: 'Basınçlı Ekipman Yönetmeliği kapsamında muayene hizmetleri. İlk Muayene ve Testler, Periyodik Muayene (1-3-6 yıl), Olağanüstü Muayene ve Onarım, Emniyet Raporu Hazırlama, Hidrostatik Basınç Testi.',
    contentEn: 'Inspection services under Pressure Equipment Directive. Initial Inspection and Tests, Periodic Inspection (1-3-6 years), Extraordinary Inspection and Repair, Safety Report Preparation, Hydrostatic Pressure Test.',
    slug: 'pressure-vessel-inspection',
    status: 'published',
    createdAt: '2024-01-04T13:00:00Z',
    updatedAt: '2024-01-12T18:40:00Z',
    order: 3
  },
  {
    id: '5',
    type: 'service',
    title: 'Kaldırma Araçları Muayenesi',
    titleEn: 'Lifting Equipment Inspection',
    content: 'İş Sağlığı ve Güvenliği mevzuatı kapsamında kaldırma araçları kontrolü. Vinç ve Kren Muayenesi, Forklift Muayenesi, Halat ve Zincir Kontrolü, Kaldırma Aksesuarları, Periyodik Kontrol Raporları.',
    contentEn: 'Lifting equipment control under Occupational Health and Safety legislation. Crane Inspection, Forklift Inspection, Rope and Chain Control, Lifting Accessories, Periodic Control Reports.',
    slug: 'lifting-equipment-inspection',
    status: 'published',
    createdAt: '2024-01-05T14:00:00Z',
    updatedAt: '2024-01-13T19:50:00Z',
    order: 4
  },
  {
    id: '6',
    type: 'service',
    title: 'Malzeme Testleri',
    titleEn: 'Material Testing',
    content: 'Mekanik ve kimyasal malzeme özelliklerinin belirlenmesi. Çekme Testi, Darbe Testi (Charpy/Izod), Sertlik Ölçümü, Kimyasal Analiz, Metalografi İncelemesi.',
    contentEn: 'Determination of mechanical and chemical material properties. Tensile Test, Impact Test (Charpy/Izod), Hardness Measurement, Chemical Analysis, Metallographic Examination.',
    slug: 'material-testing',
    status: 'published',
    createdAt: '2024-01-06T15:00:00Z',
    updatedAt: '2024-01-14T20:00:00Z',
    order: 5
  }
];

const defaultSettings: SiteSettings = {
  siteName: 'EMIC',
  siteNameEn: 'EMIC',
  tagline: 'Muayene ve Test Hizmetleri',
  taglineEn: 'Inspection and Testing Services',
  description: 'Endüstriyel muayene ve test hizmetlerinde 25+ yıllık deneyim ile güvenilir çözümler sunuyoruz.',
  descriptionEn: 'We provide reliable solutions with 25+ years of experience in industrial inspection and testing services.',
  logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=80&fit=crop&crop=center',
  logoAlt: 'EMIC Logo',
  phone: '+90 232 123 45 67',
  email: 'info@emic.com.tr',
  address: 'Atatürk Organize Sanayi Bölgesi 10003 Sokak No:5 35620 Çiğli / İzmir',
  addressEn: 'Atatürk Organized Industrial Zone 10003 Street No:5 35620 Çiğli / İzmir',
  workingHours: 'Pazartesi - Cuma: 08:00 - 18:00, Cumartesi: 08:00 - 13:00',
  workingHoursEn: 'Monday - Friday: 08:00 - 18:00, Saturday: 08:00 - 13:00',
  socialMedia: {
    linkedin: 'https://linkedin.com/company/emic',
    twitter: 'https://twitter.com/emic',
    facebook: 'https://facebook.com/emic',
    instagram: 'https://instagram.com/emic',
    youtube: 'https://youtube.com/@emic'
  },
  seo: {
    metaTitle: 'EMIC - Endüstriyel Muayene ve Test Hizmetleri',
    metaTitleEn: 'EMIC - Industrial Inspection and Testing Services',
    metaDescription: 'Tahribatsız muayene, kaynak kontrolü ve basınçlı kap muayenesi alanlarında profesyonel hizmet.',
    metaDescriptionEn: 'Professional services in non-destructive testing, welding inspection, and pressure vessel examination.',
    keywords: 'NDT, tahribatsız muayene, kaynak kontrolü, basınçlı kap, EMIC',
    keywordsEn: 'NDT, non-destructive testing, welding inspection, pressure vessel, EMIC'
  },
  features: {
    multiLanguage: true,
    twoFactorAuth: true,
    emailNotifications: true,
    maintenanceMode: false
  },
  documents: {
    privacyDeclarationUrl: '/documents/gizlilik-tarafsizlik-beyannamesi-imzali.pdf',
    privacyDeclarationVersion: '2.1',
    privacyDeclarationDate: 'Ocak 2024'
  },
  stats: {
    experience: {
      value: '25+',
      labelTr: 'Yıl Deneyim',
      labelEn: 'Years Experience'
    },
    projects: {
      value: '500+',
      labelTr: 'Proje',
      labelEn: 'Projects'
    },
    customers: {
      value: '100+',
      labelTr: 'Müşteri',
      labelEn: 'Customers'
    }
  },
  references: [
    {
      id: '1',
      name: 'TÜPRAŞ',
      nameEn: 'TUPRAS',
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=100&fit=crop&crop=center',
      website: 'https://tupras.com.tr',
      sector: 'Petrokimya',
      sectorEn: 'Petrochemical',
      description: 'Türkiye\'nin en büyük petrol rafinerisi',
      descriptionEn: 'Turkey\'s largest oil refinery',
      order: 1,
      status: 'active',
      createdAt: '2024-01-01T10:00:00Z',
      updatedAt: '2024-01-01T10:00:00Z'
    },
    {
      id: '2',
      name: 'BOTAŞ',
      nameEn: 'BOTAS',
      logo: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&h=100&fit=crop&crop=center',
      website: 'https://botas.gov.tr',
      sector: 'Enerji',
      sectorEn: 'Energy',
      description: 'Boru Hatları ile Petrol Taşıma A.Ş.',
      descriptionEn: 'Petroleum Pipeline Corporation',
      order: 2,
      status: 'active',
      createdAt: '2024-01-02T10:00:00Z',
      updatedAt: '2024-01-02T10:00:00Z'
    },
    {
      id: '3',
      name: 'EÜAŞ',
      nameEn: 'EUAS',
      logo: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=200&h=100&fit=crop&crop=center',
      website: 'https://euas.gov.tr',
      sector: 'Elektrik Üretimi',
      sectorEn: 'Power Generation',
      description: 'Elektrik Üretim A.Ş.',
      descriptionEn: 'Electricity Generation Corporation',
      order: 3,
      status: 'active',
      createdAt: '2024-01-03T10:00:00Z',
      updatedAt: '2024-01-03T10:00:00Z'
    },
    {
      id: '4',
      name: 'TSKB',
      nameEn: 'TSKB',
      logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&h=100&fit=crop&crop=center',
      website: 'https://tskb.com.tr',
      sector: 'Finans',
      sectorEn: 'Finance',
      description: 'Türkiye Sınai Kalkınma Bankası',
      descriptionEn: 'Industrial Development Bank of Turkey',
      order: 4,
      status: 'active',
      createdAt: '2024-01-04T10:00:00Z',
      updatedAt: '2024-01-04T10:00:00Z'
    },
    {
      id: '5',
      name: 'OYAK',
      nameEn: 'OYAK',
      logo: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=200&h=100&fit=crop&crop=center',
      website: 'https://oyak.com.tr',
      sector: 'Çelik',
      sectorEn: 'Steel',
      description: 'Ordu Yardımlaşma Kurumu',
      descriptionEn: 'Armed Forces Mutual Assistance Association',
      order: 5,
      status: 'active',
      createdAt: '2024-01-05T10:00:00Z',
      updatedAt: '2024-01-05T10:00:00Z'
    },
    {
      id: '6',
      name: 'TCDD',
      nameEn: 'TCDD',
      logo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=200&h=100&fit=crop&crop=center',
      website: 'https://tcdd.gov.tr',
      sector: 'Ulaştırma',
      sectorEn: 'Transportation',
      description: 'Türkiye Cumhuriyeti Devlet Demiryolları',
      descriptionEn: 'Turkish State Railways',
      order: 6,
      status: 'active',
      createdAt: '2024-01-06T10:00:00Z',
      updatedAt: '2024-01-06T10:00:00Z'
    }
  ],
  serviceRegions: [
    {
      id: '1',
      name: 'Marmara Bölgesi',
      nameEn: 'Marmara Region',
      description: 'İstanbul, Bursa, Kocaeli ve çevre illerde kapsamlı endüstriyel muayene hizmetleri sunuyoruz.',
      descriptionEn: 'We provide comprehensive industrial inspection services in Istanbul, Bursa, Kocaeli and surrounding provinces.',
      cities: ['İstanbul', 'Bursa', 'Kocaeli', 'Tekirdağ', 'Sakarya'],
      citiesEn: ['Istanbul', 'Bursa', 'Kocaeli', 'Tekirdag', 'Sakarya'],
      services: ['NDT Muayene', 'Kaynak Kontrolü', 'Basınçlı Kap Muayenesi', 'Kaldırma Araçları'],
      servicesEn: ['NDT Inspection', 'Welding Control', 'Pressure Vessel Inspection', 'Lifting Equipment'],
      contactPhone: '+90 212 123 45 67',
      contactEmail: 'marmara@emic.com.tr',
      image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=300&fit=crop&crop=center',
      order: 1,
      status: 'active',
      createdAt: '2024-01-01T10:00:00Z',
      updatedAt: '2024-01-01T10:00:00Z'
    },
    {
      id: '2',
      name: 'Ege Bölgesi',
      nameEn: 'Aegean Region',
      description: 'İzmir merkez olmak üzere Ege bölgesinin tamamında profesyonel muayene hizmetleri.',
      descriptionEn: 'Professional inspection services throughout the Aegean region, centered in Izmir.',
      cities: ['İzmir', 'Manisa', 'Aydın', 'Muğla', 'Denizli'],
      citiesEn: ['Izmir', 'Manisa', 'Aydin', 'Mugla', 'Denizli'],
      services: ['Tahribatsız Muayene', 'Malzeme Testleri', 'Kalibrasyon', 'Periyodik Kontroller'],
      servicesEn: ['Non-Destructive Testing', 'Material Testing', 'Calibration', 'Periodic Controls'],
      contactPhone: '+90 232 456 78 90',
      contactEmail: 'ege@emic.com.tr',
      image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop&crop=center',
      order: 2,
      status: 'active',
      createdAt: '2024-01-02T10:00:00Z',
      updatedAt: '2024-01-02T10:00:00Z'
    },
    {
      id: '3',
      name: 'Akdeniz Bölgesi',
      nameEn: 'Mediterranean Region',
      description: 'Antalya, Mersin ve Adana illerinde endüstriyel tesislere yönelik muayene hizmetleri.',
      descriptionEn: 'Inspection services for industrial facilities in Antalya, Mersin and Adana provinces.',
      cities: ['Antalya', 'Mersin', 'Adana', 'Hatay', 'Osmaniye'],
      citiesEn: ['Antalya', 'Mersin', 'Adana', 'Hatay', 'Osmaniye'],
      services: ['Petrokimya Muayenesi', 'Liman Ekipmanları', 'Turizm Tesisleri', 'Gıda Sanayi'],
      servicesEn: ['Petrochemical Inspection', 'Port Equipment', 'Tourism Facilities', 'Food Industry'],
      contactPhone: '+90 242 789 01 23',
      contactEmail: 'akdeniz@emic.com.tr',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center',
      order: 3,
      status: 'active',
      createdAt: '2024-01-03T10:00:00Z',
      updatedAt: '2024-01-03T10:00:00Z'
    }
  ],
  specialDays: [
    {
      id: '1',
      title: 'Yeni Yıl Kutlaması',
      titleEn: 'New Year Celebration',
      description: 'Yeni yılınız sağlık, mutluluk ve başarılarla dolu olsun!',
      descriptionEn: 'May your new year be filled with health, happiness and success!',
      date: '01-01',
      type: 'celebration',
      image: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=800&h=600&fit=crop&crop=center',
      backgroundColor: '#1e40af',
      textColor: '#ffffff',
      isActive: true,
      showDuration: 10,
      createdAt: '2024-01-01T10:00:00Z',
      updatedAt: '2024-01-01T10:00:00Z'
    },
    {
      id: '2',
      title: '23 Nisan Ulusal Egemenlik ve Çocuk Bayramı',
      titleEn: 'April 23 National Sovereignty and Children\'s Day',
      description: 'Cumhuriyetimizin kurucusu Mustafa Kemal Atatürk\'ü ve tüm çocukları kutluyoruz.',
      descriptionEn: 'We celebrate the founder of our Republic, Mustafa Kemal Atatürk, and all children.',
      date: '04-23',
      type: 'holiday',
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop&crop=center',
      backgroundColor: '#dc2626',
      textColor: '#ffffff',
      isActive: true,
      showDuration: 10,
      createdAt: '2024-01-01T10:00:00Z',
      updatedAt: '2024-01-01T10:00:00Z'
    },
    {
      id: '3',
      title: '19 Mayıs Atatürk\'ü Anma, Gençlik ve Spor Bayramı',
      titleEn: 'May 19 Commemoration of Atatürk, Youth and Sports Day',
      description: 'Gençlerimizin ve sporun önemini vurgulayan bu özel günü kutluyoruz.',
      descriptionEn: 'We celebrate this special day that emphasizes the importance of our youth and sports.',
      date: '05-19',
      type: 'commemoration',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&crop=center',
      backgroundColor: '#059669',
      textColor: '#ffffff',
      isActive: true,
      showDuration: 10,
      createdAt: '2024-01-01T10:00:00Z',
      updatedAt: '2024-01-01T10:00:00Z'
    },
    {
      id: '4',
      title: '29 Ekim Cumhuriyet Bayramı',
      titleEn: 'October 29 Republic Day',
      description: 'Cumhuriyetimizin kuruluşunun yıldönümünü gururla kutluyoruz.',
      descriptionEn: 'We proudly celebrate the anniversary of the establishment of our Republic.',
      date: '10-29',
      type: 'holiday',
      image: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&h=600&fit=crop&crop=center',
      backgroundColor: '#dc2626',
      textColor: '#ffffff',
      isActive: true,
      showDuration: 10,
      createdAt: '2024-01-01T10:00:00Z',
      updatedAt: '2024-01-01T10:00:00Z'
    }
  ]
};

const defaultLaboratoryTests: LaboratoryTest[] = [
  {
    id: '1',
    name: 'Çekme Testi',
    nameEn: 'Tensile Test',
    description: 'Malzemelerin çekme dayanımı ve elastisite özelliklerinin belirlenmesi',
    descriptionEn: 'Determination of tensile strength and elasticity properties of materials',
    method: 'Tek eksenli çekme testi',
    methodEn: 'Uniaxial tensile test',
    equipment: 'Universal Test Makinesi (100kN kapasiteli)',
    equipmentEn: 'Universal Testing Machine (100kN capacity)',
    standards: 'ASTM E8, EN ISO 6892-1, TS 138',
    standardsEn: 'ASTM E8, EN ISO 6892-1, TS 138',
    category: 'Mekanik Testler',
    categoryEn: 'Mechanical Tests',
    duration: '1-2 iş günü',
    durationEn: '1-2 business days',
    sampleRequirements: 'Standart çekme numunesi (6mm çap, 30mm ölçü boyu)',
    sampleRequirementsEn: 'Standard tensile specimen (6mm diameter, 30mm gauge length)',
    reportFormat: 'Detaylı test raporu, gerilme-şekil değiştirme eğrisi',
    reportFormatEn: 'Detailed test report, stress-strain curve',
    order: 1,
    status: 'active',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z'
  },
  {
    id: '2',
    name: 'Darbe Testi (Charpy)',
    nameEn: 'Impact Test (Charpy)',
    description: 'Malzemelerin darbe dayanımının belirlenmesi',
    descriptionEn: 'Determination of impact resistance of materials',
    method: 'Charpy V-çentik darbe testi',
    methodEn: 'Charpy V-notch impact test',
    equipment: 'Charpy Darbe Test Makinesi (300J kapasiteli)',
    equipmentEn: 'Charpy Impact Testing Machine (300J capacity)',
    standards: 'ASTM E23, EN ISO 148-1, TS 97',
    standardsEn: 'ASTM E23, EN ISO 148-1, TS 97',
    category: 'Mekanik Testler',
    categoryEn: 'Mechanical Tests',
    duration: '1 iş günü',
    durationEn: '1 business day',
    sampleRequirements: 'Standart Charpy numunesi (10x10x55mm, V-çentikli)',
    sampleRequirementsEn: 'Standard Charpy specimen (10x10x55mm, V-notched)',
    reportFormat: 'Darbe enerjisi değeri, kırık yüzey analizi',
    reportFormatEn: 'Impact energy value, fracture surface analysis',
    order: 2,
    status: 'active',
    createdAt: '2024-01-02T10:00:00Z',
    updatedAt: '2024-01-02T10:00:00Z'
  },
  {
    id: '3',
    name: 'Sertlik Ölçümü',
    nameEn: 'Hardness Measurement',
    description: 'Malzemelerin sertlik değerlerinin ölçülmesi',
    descriptionEn: 'Measurement of hardness values of materials',
    method: 'Brinell, Rockwell, Vickers sertlik ölçüm yöntemleri',
    methodEn: 'Brinell, Rockwell, Vickers hardness measurement methods',
    equipment: 'Dijital Sertlik Ölçüm Cihazları',
    equipmentEn: 'Digital Hardness Testing Devices',
    standards: 'ASTM E10, ASTM E18, ASTM E92, EN ISO 6506, EN ISO 6508, EN ISO 6507',
    standardsEn: 'ASTM E10, ASTM E18, ASTM E92, EN ISO 6506, EN ISO 6508, EN ISO 6507',
    category: 'Mekanik Testler',
    categoryEn: 'Mechanical Tests',
    duration: '1 iş günü',
    durationEn: '1 business day',
    sampleRequirements: 'Düz ve temiz yüzey (min. 10x10mm)',
    sampleRequirementsEn: 'Flat and clean surface (min. 10x10mm)',
    reportFormat: 'Sertlik değerleri tablosu, ölçüm noktaları haritası',
    reportFormatEn: 'Hardness values table, measurement points map',
    order: 3,
    status: 'active',
    createdAt: '2024-01-03T10:00:00Z',
    updatedAt: '2024-01-03T10:00:00Z'
  },
  {
    id: '4',
    name: 'Kimyasal Analiz',
    nameEn: 'Chemical Analysis',
    description: 'Malzemelerin kimyasal kompozisyonunun belirlenmesi',
    descriptionEn: 'Determination of chemical composition of materials',
    method: 'Optik Emisyon Spektrometresi (OES) analizi',
    methodEn: 'Optical Emission Spectrometry (OES) analysis',
    equipment: 'OES Spektrometresi, XRF Analiz Cihazı',
    equipmentEn: 'OES Spectrometer, XRF Analysis Device',
    standards: 'ASTM E415, EN 10204, TS 1127',
    standardsEn: 'ASTM E415, EN 10204, TS 1127',
    category: 'Kimyasal Testler',
    categoryEn: 'Chemical Tests',
    duration: '1-2 iş günü',
    durationEn: '1-2 business days',
    sampleRequirements: 'Temiz metal yüzey (min. 20x20mm)',
    sampleRequirementsEn: 'Clean metal surface (min. 20x20mm)',
    reportFormat: 'Element analiz tablosu, standart karşılaştırması',
    reportFormatEn: 'Element analysis table, standard comparison',
    order: 4,
    status: 'active',
    createdAt: '2024-01-04T10:00:00Z',
    updatedAt: '2024-01-04T10:00:00Z'
  },
  {
    id: '5',
    name: 'Metalografi İncelemesi',
    nameEn: 'Metallographic Examination',
    description: 'Malzemelerin mikroyapı incelemesi ve analizi',
    descriptionEn: 'Microstructure examination and analysis of materials',
    method: 'Optik mikroskop ile mikroyapı incelemesi',
    methodEn: 'Microstructure examination with optical microscope',
    equipment: 'Metalografi Mikroskobu, Numune Hazırlama Sistemi',
    equipmentEn: 'Metallographic Microscope, Sample Preparation System',
    standards: 'ASTM E3, ASTM E407, EN ISO 17639',
    standardsEn: 'ASTM E3, ASTM E407, EN ISO 17639',
    category: 'Mikroyapı Testleri',
    categoryEn: 'Microstructure Tests',
    duration: '2-3 iş günü',
    durationEn: '2-3 business days',
    sampleRequirements: 'Küçük numune parçası (10x10x5mm)',
    sampleRequirementsEn: 'Small specimen piece (10x10x5mm)',
    reportFormat: 'Mikroyapı fotoğrafları, tane boyutu analizi',
    reportFormatEn: 'Microstructure photographs, grain size analysis',
    order: 5,
    status: 'active',
    createdAt: '2024-01-05T10:00:00Z',
    updatedAt: '2024-01-05T10:00:00Z'
  }
];

// Content Store Class
class ContentStore {
  private content: ContentItem[] = [];
  private settings: SiteSettings = defaultSettings;
  private laboratoryTests: LaboratoryTest[] = [];
  private serviceRegions: ServiceRegion[] = [];
  private specialDays: SpecialDay[] = [];
  private listeners: (() => void)[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const storedContent = localStorage.getItem('emic_content');
      const storedSettings = localStorage.getItem('emic_settings');
      const storedTests = localStorage.getItem('emic_laboratory_tests');
      const storedRegions = localStorage.getItem('emic_service_regions');
      const storedSpecialDays = localStorage.getItem('emic_special_days');
      
      this.content = storedContent ? JSON.parse(storedContent) : defaultContent;
      this.settings = storedSettings ? JSON.parse(storedSettings) : defaultSettings;
      this.laboratoryTests = storedTests ? JSON.parse(storedTests) : defaultLaboratoryTests;
      this.serviceRegions = storedRegions ? JSON.parse(storedRegions) : (defaultSettings.serviceRegions || []);
      this.specialDays = storedSpecialDays ? JSON.parse(storedSpecialDays) : (defaultSettings.specialDays || []);
    } catch (error) {
      console.error('Error loading from storage:', error);
      this.content = defaultContent;
      this.settings = defaultSettings;
      this.laboratoryTests = defaultLaboratoryTests;
      this.serviceRegions = defaultSettings.serviceRegions || [];
      this.specialDays = defaultSettings.specialDays || [];
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('emic_content', JSON.stringify(this.content));
      localStorage.setItem('emic_settings', JSON.stringify(this.settings));
      localStorage.setItem('emic_laboratory_tests', JSON.stringify(this.laboratoryTests));
      localStorage.setItem('emic_service_regions', JSON.stringify(this.serviceRegions));
      localStorage.setItem('emic_special_days', JSON.stringify(this.specialDays));
      this.notifyListeners();
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  // Content methods
  getContent(type?: string, status: 'published' | 'draft' | 'all' = 'published'): ContentItem[] {
    let filtered = this.content;
    
    if (type && type !== 'all') {
      filtered = filtered.filter(item => item.type === type);
    }
    
    if (status !== 'all') {
      filtered = filtered.filter(item => item.status === status);
    }
    
    return filtered.sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  getContentById(id: string): ContentItem | undefined {
    return this.content.find(item => item.id === id);
  }

  getContentBySlug(slug: string): ContentItem | undefined {
    return this.content.find(item => item.slug === slug && item.status === 'published');
  }

  addContent(content: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>): ContentItem {
    const newContent: ContentItem = {
      ...content,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.content.push(newContent);
    this.saveToStorage();
    return newContent;
  }

  updateContent(id: string, updates: Partial<ContentItem>): ContentItem | null {
    const index = this.content.findIndex(item => item.id === id);
    if (index === -1) return null;
    
    this.content[index] = {
      ...this.content[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    this.saveToStorage();
    return this.content[index];
  }

  deleteContent(id: string): boolean {
    const index = this.content.findIndex(item => item.id === id);
    if (index === -1) return false;
    
    this.content.splice(index, 1);
    this.saveToStorage();
    return true;
  }

  // Settings methods
  getSettings(): SiteSettings {
    return { ...this.settings };
  }

  updateSettings(updates: Partial<SiteSettings>): SiteSettings {
    this.settings = { ...this.settings, ...updates };
    this.saveToStorage();
    return this.settings;
  }

  // Reference methods
  addReference(reference: Omit<Reference, 'id' | 'createdAt' | 'updatedAt'>): Reference {
    const newReference: Reference = {
      ...reference,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    if (!this.settings.references) {
      this.settings.references = [];
    }
    
    this.settings.references.push(newReference);
    this.saveToStorage();
    return newReference;
  }

  updateReference(id: string, updates: Partial<Reference>): Reference | null {
    if (!this.settings.references) return null;
    
    const index = this.settings.references.findIndex(ref => ref.id === id);
    if (index === -1) return null;
    
    this.settings.references[index] = {
      ...this.settings.references[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    this.saveToStorage();
    return this.settings.references[index];
  }

  deleteReference(id: string): boolean {
    if (!this.settings.references) return false;
    
    const index = this.settings.references.findIndex(ref => ref.id === id);
    if (index === -1) return false;
    
    this.settings.references.splice(index, 1);
    this.saveToStorage();
    return true;
  }

  // Laboratory Test methods
  getLaboratoryTests(status: 'active' | 'inactive' | 'all' = 'active'): LaboratoryTest[] {
    let filtered = this.laboratoryTests;
    
    if (status !== 'all') {
      filtered = filtered.filter(test => test.status === status);
    }
    
    return filtered.sort((a, b) => a.order - b.order);
  }

  getLaboratoryTestById(id: string): LaboratoryTest | undefined {
    return this.laboratoryTests.find(test => test.id === id);
  }

  addLaboratoryTest(test: Omit<LaboratoryTest, 'id' | 'createdAt' | 'updatedAt'>): LaboratoryTest {
    const newTest: LaboratoryTest = {
      ...test,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.laboratoryTests.push(newTest);
    this.saveToStorage();
    return newTest;
  }

  updateLaboratoryTest(id: string, updates: Partial<LaboratoryTest>): LaboratoryTest | null {
    const index = this.laboratoryTests.findIndex(test => test.id === id);
    if (index === -1) return null;
    
    this.laboratoryTests[index] = {
      ...this.laboratoryTests[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    this.saveToStorage();
    return this.laboratoryTests[index];
  }

  deleteLaboratoryTest(id: string): boolean {
    const index = this.laboratoryTests.findIndex(test => test.id === id);
    if (index === -1) return false;
    
    this.laboratoryTests.splice(index, 1);
    this.saveToStorage();
    return true;
  }

  // Service Region methods
  getServiceRegions(status: 'active' | 'inactive' | 'all' = 'active'): ServiceRegion[] {
    let filtered = this.settings.serviceRegions || [];
    
    if (status !== 'all') {
      filtered = filtered.filter(region => region.status === status);
    }
    
    return filtered.sort((a, b) => a.order - b.order);
  }

  getServiceRegionById(id: string): ServiceRegion | undefined {
    return (this.settings.serviceRegions || []).find(region => region.id === id);
  }

  addServiceRegion(region: Omit<ServiceRegion, 'id' | 'createdAt' | 'updatedAt'>): ServiceRegion {
    const newRegion: ServiceRegion = {
      ...region,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    if (!this.settings.serviceRegions) {
      this.settings.serviceRegions = [];
    }
    this.settings.serviceRegions.push(newRegion);
    this.saveToStorage();
    return newRegion;
  }

  updateServiceRegion(id: string, updates: Partial<ServiceRegion>): ServiceRegion | null {
    if (!this.settings.serviceRegions) return null;
    
    const index = this.settings.serviceRegions.findIndex(region => region.id === id);
    if (index === -1) return null;
    
    this.settings.serviceRegions[index] = {
      ...this.settings.serviceRegions[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    this.saveToStorage();
    return this.settings.serviceRegions[index];
  }

  deleteServiceRegion(id: string): boolean {
    if (!this.settings.serviceRegions) return false;
    
    const index = this.settings.serviceRegions.findIndex(region => region.id === id);
    if (index === -1) return false;
    
    this.settings.serviceRegions.splice(index, 1);
    this.saveToStorage();
    return true;
  }

  // Special Days methods
  getSpecialDays(status: 'active' | 'inactive' | 'all' = 'active'): SpecialDay[] {
    let filtered = this.specialDays;
    
    if (status !== 'all') {
      filtered = filtered.filter(day => status === 'active' ? day.isActive : !day.isActive);
    }
    
    return filtered.sort((a, b) => a.date.localeCompare(b.date));
  }

  getTodaysSpecialDay(): SpecialDay | null {
    const today = new Date();
    const todayString = String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
    
    const specialDay = this.specialDays.find(day => 
      day.date === todayString && day.isActive
    );
    
    return specialDay || null;
  }

  getSpecialDayById(id: string): SpecialDay | undefined {
    return this.specialDays.find(day => day.id === id);
  }

  addSpecialDay(day: Omit<SpecialDay, 'id' | 'createdAt' | 'updatedAt'>): SpecialDay {
    const newDay: SpecialDay = {
      ...day,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.specialDays.push(newDay);
    this.saveToStorage();
    return newDay;
  }

  updateSpecialDay(id: string, updates: Partial<SpecialDay>): SpecialDay | null {
    const index = this.specialDays.findIndex(day => day.id === id);
    if (index === -1) return null;
    
    this.specialDays[index] = {
      ...this.specialDays[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    this.saveToStorage();
    return this.specialDays[index];
  }

  deleteSpecialDay(id: string): boolean {
    const index = this.specialDays.findIndex(day => day.id === id);
    if (index === -1) return false;
    
    this.specialDays.splice(index, 1);
    this.saveToStorage();
    return true;
  }

  // Subscription methods
  subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Hero content helper
  getHeroContent(): ContentItem | null {
    const heroContent = this.content.find(item => item.type === 'hero' && item.status === 'published');
    return heroContent || null;
  }

  // Services helper
  getServices(): ContentItem[] {
    return this.content
      .filter(item => item.type === 'service' && item.status === 'published')
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }
}

// Create singleton instance
export const contentStore = new ContentStore();