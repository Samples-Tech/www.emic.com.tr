import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, FileText, Shield, Eye, X, ExternalLink } from 'lucide-react';
import { contentStore } from '../lib/contentStore';

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

interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'certificate' | 'report';
  url: string;
  thumbnail?: string;
  description: string;
  descriptionEn: string;
  size: string;
  uploadDate: string;
  category: string;
  categoryEn: string;
}

const DocumentsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [content, setContent] = useState<ContentItem | null>(null);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Sample documents data
  const [documents] = useState<Document[]>([
    {
      id: '1',
      name: 'Gizlilik ve Tarafsızlık Beyannamesi',
      type: 'pdf',
      url: '/documents/gizlilik-tarafsizlik-beyannamesi.pdf',
      thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=400&fit=crop&crop=center',
      description: 'EMIC gizlilik ve tarafsızlık beyanname dokümanı',
      descriptionEn: 'EMIC privacy and impartiality declaration document',
      size: '2.1 MB',
      uploadDate: '2024-01-15',
      category: 'Yasal Dökümanlar',
      categoryEn: 'Legal Documents'
    },
    {
      id: '2',
      name: 'ISO 9001 Kalite Sertifikası',
      type: 'certificate',
      url: '/documents/iso-9001-certificate.pdf',
      thumbnail: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=400&fit=crop&crop=center',
      description: 'ISO 9001:2015 Kalite Yönetim Sistemi Sertifikası',
      descriptionEn: 'ISO 9001:2015 Quality Management System Certificate',
      size: '1.8 MB',
      uploadDate: '2024-01-10',
      category: 'Sertifikalar',
      categoryEn: 'Certificates'
    },
    {
      id: '3',
      name: 'TÜRKAK Akreditasyon Belgesi',
      type: 'certificate',
      url: '/documents/turkak-accreditation.pdf',
      thumbnail: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=300&h=400&fit=crop&crop=center',
      description: 'TÜRKAK Akreditasyon Kuruluşu tarafından verilen akreditasyon belgesi',
      descriptionEn: 'Accreditation certificate issued by TURKAK',
      size: '3.2 MB',
      uploadDate: '2024-01-08',
      category: 'Sertifikalar',
      categoryEn: 'Certificates'
    },
    {
      id: '4',
      name: 'NDT Prosedür Dokümanı',
      type: 'report',
      url: '/documents/ndt-procedure.pdf',
      thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&crop=center',
      description: 'Tahribatsız muayene prosedürleri ve standartları',
      descriptionEn: 'Non-destructive testing procedures and standards',
      size: '4.5 MB',
      uploadDate: '2024-01-05',
      category: 'Teknik Dökümanlar',
      categoryEn: 'Technical Documents'
    },
    {
      id: '5',
      name: 'Kaynak Muayene Rehberi',
      type: 'report',
      url: '/documents/welding-inspection-guide.pdf',
      thumbnail: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=300&h=400&fit=crop&crop=center',
      description: 'Kaynak muayenesi için detaylı rehber dokümanı',
      descriptionEn: 'Detailed guide document for welding inspection',
      size: '6.1 MB',
      uploadDate: '2024-01-03',
      category: 'Teknik Dökümanlar',
      categoryEn: 'Technical Documents'
    },
    {
      id: '6',
      name: 'Laboratuvar Ekipmanları',
      type: 'image',
      url: '/images/laboratory-equipment.jpg',
      thumbnail: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=300&h=400&fit=crop&crop=center',
      description: 'Laboratuvarımızda bulunan test ekipmanları',
      descriptionEn: 'Testing equipment in our laboratory',
      size: '2.8 MB',
      uploadDate: '2024-01-01',
      category: 'Görseller',
      categoryEn: 'Images'
    },
    {
      id: '7',
      name: 'Şirket Broşürü',
      type: 'pdf',
      url: '/documents/company-brochure.pdf',
      thumbnail: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=400&fit=crop&crop=center',
      description: 'EMIC şirket tanıtım broşürü',
      descriptionEn: 'EMIC company brochure',
      size: '5.3 MB',
      uploadDate: '2023-12-28',
      category: 'Tanıtım',
      categoryEn: 'Promotional'
    },
    {
      id: '8',
      name: 'Kalite Politikası',
      type: 'pdf',
      url: '/documents/quality-policy.pdf',
      thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=400&fit=crop&crop=center',
      description: 'EMIC kalite politikası ve hedefleri',
      descriptionEn: 'EMIC quality policy and objectives',
      size: '1.2 MB',
      uploadDate: '2023-12-25',
      category: 'Yasal Dökümanlar',
      categoryEn: 'Legal Documents'
    }
  ]);

  useEffect(() => {
    const loadContent = () => {
      const documentsContent = contentStore.getContentBySlug('documents');
      const siteSettings = contentStore.getSettings();
      setContent(documentsContent);
      setSettings(siteSettings);
      setLoading(false);
    };

    loadContent();

    // Subscribe to content changes
    const unsubscribe = contentStore.subscribe(() => {
      loadContent();
    });

    return unsubscribe;
  }, []);

  const categories = Array.from(new Set(documents.map(doc => doc.category)));
  
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'certificate':
        return <Shield className="w-6 h-6 text-green-600" />;
      case 'report':
        return <FileText className="w-6 h-6 text-blue-600" />;
      case 'image':
        return <Eye className="w-6 h-6 text-purple-600" />;
      default:
        return <FileText className="w-6 h-6 text-gray-600" />;
    }
  };

  const handleDocumentClick = (document: Document) => {
    setSelectedDocument(document);
    setIsModalOpen(true);
  };

  const handleDownload = (document: Document) => {
    // Simulate download
    const link = document.createElement('a');
    link.href = document.url;
    link.download = document.name;
    link.click();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDocument(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  const isEnglish = i18n.language === 'en';
  const title = content ? (isEnglish ? content.titleEn : content.title) : (isEnglish ? 'Documents' : 'Dökümanlar');
  const description = content ? (isEnglish ? content.contentEn : content.content) : (isEnglish ? 'Access important documents and certificates.' : 'Önemli dokümanlara ve sertifikalara erişin.');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {title}
            </h1>
            <div className="text-lg text-gray-600 max-w-3xl mx-auto">
              <div dangerouslySetInnerHTML={{ __html: description }} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isEnglish ? "Search documents..." : "Döküman ara..."}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">{isEnglish ? 'All Categories' : 'Tüm Kategoriler'}</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            <div className="text-sm text-gray-600 flex items-center">
              {isEnglish ? 'Total' : 'Toplam'}: {filteredDocuments.length} {isEnglish ? 'documents' : 'döküman'}
            </div>
          </div>
        </div>

        {/* Documents Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDocuments.map((document) => (
            <div key={document.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-200 group">
              {/* Thumbnail */}
              <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
                <img
                  src={document.thumbnail}
                  alt={document.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200"></div>
                
                {/* Document Type Icon */}
                <div className="absolute top-3 left-3">
                  <div className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                    {getDocumentIcon(document.type)}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => handleDocumentClick(document)}
                    className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                    title={isEnglish ? 'Preview' : 'Önizleme'}
                  >
                    <Eye className="w-4 h-4 text-gray-700" />
                  </button>
                  <button
                    onClick={() => handleDownload(document)}
                    className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                    title={isEnglish ? 'Download' : 'İndir'}
                  >
                    <Download className="w-4 h-4 text-gray-700" />
                  </button>
                </div>

                {/* Overlay on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => handleDocumentClick(document)}
                    className="px-4 py-2 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                  >
                    {isEnglish ? 'View' : 'Görüntüle'}
                  </button>
                </div>
              </div>
              
              {/* Document Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{document.name}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {isEnglish ? document.descriptionEn : document.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    {isEnglish ? document.categoryEn : document.category}
                  </span>
                  <span>{document.size}</span>
                </div>
                
                <div className="mt-3 text-xs text-gray-400">
                  {new Date(document.uploadDate).toLocaleDateString(isEnglish ? 'en-US' : 'tr-TR')}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredDocuments.length === 0 && (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {isEnglish ? 'No documents found' : 'Döküman bulunamadı'}
            </h3>
            <p className="text-gray-600">
              {searchQuery || selectedCategory !== 'all'
                ? (isEnglish ? 'Try changing your search criteria.' : 'Arama kriterlerinizi değiştirerek tekrar deneyin.')
                : (isEnglish ? 'Documents will be added soon.' : 'Yakında dökümanlar eklenecek.')
              }
            </p>
          </div>
        )}

        {/* Portal Access */}
        <div className="mt-16 bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {isEnglish ? 'Customer Portal' : 'Müşteri Portalı'}
            </h2>
            <p className="text-gray-600 mb-6">
              {isEnglish 
                ? 'Access your test reports, certificates, and project documents through our secure customer portal.'
                : 'Güvenli müşteri portalımız üzerinden test raporlarınıza, sertifikalarınıza ve proje dokümanlarınıza erişin.'
              }
            </p>
            <a
              href="/portal"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-lg font-medium"
            >
              {isEnglish ? 'Access Portal' : 'Portala Erişim'}
            </a>
          </div>
        </div>
      </div>

      {/* Document Preview Modal */}
      {isModalOpen && selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                {getDocumentIcon(selectedDocument.type)}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{selectedDocument.name}</h3>
                  <p className="text-sm text-gray-600">
                    {isEnglish ? selectedDocument.categoryEn : selectedDocument.category} • {selectedDocument.size}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleDownload(selectedDocument)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>{isEnglish ? 'Download' : 'İndir'}</span>
                </button>
                <button
                  onClick={closeModal}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Document Preview */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">
                    {isEnglish ? 'Document Preview' : 'Döküman Önizlemesi'}
                  </h4>
                  <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={selectedDocument.thumbnail}
                      alt={selectedDocument.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {selectedDocument.type === 'pdf' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 text-blue-800">
                        <FileText className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {isEnglish ? 'PDF Document' : 'PDF Dökümanı'}
                        </span>
                      </div>
                      <p className="text-sm text-blue-700 mt-1">
                        {isEnglish 
                          ? 'Click download to view the full document.'
                          : 'Tam dökümanı görüntülemek için indirin.'
                        }
                      </p>
                    </div>
                  )}
                </div>

                {/* Document Details */}
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      {isEnglish ? 'Document Details' : 'Döküman Detayları'}
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">{isEnglish ? 'Name:' : 'Ad:'}</span>
                        <span className="font-medium text-gray-900">{selectedDocument.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{isEnglish ? 'Category:' : 'Kategori:'}</span>
                        <span className="font-medium text-gray-900">
                          {isEnglish ? selectedDocument.categoryEn : selectedDocument.category}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{isEnglish ? 'Size:' : 'Boyut:'}</span>
                        <span className="font-medium text-gray-900">{selectedDocument.size}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{isEnglish ? 'Upload Date:' : 'Yükleme Tarihi:'}</span>
                        <span className="font-medium text-gray-900">
                          {new Date(selectedDocument.uploadDate).toLocaleDateString(isEnglish ? 'en-US' : 'tr-TR')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      {isEnglish ? 'Description' : 'Açıklama'}
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      {isEnglish ? selectedDocument.descriptionEn : selectedDocument.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleDownload(selectedDocument)}
                      className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      <Download className="w-5 h-5" />
                      <span>{isEnglish ? 'Download Document' : 'Dökümanı İndir'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsPage;