import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { contentStore } from '../lib/contentStore';
import { useContent } from '../hooks/useContent';
import { Microscope, FileText, Clock, Users, CheckCircle, ArrowRight } from 'lucide-react';

const LaboratoryPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { content: pageContent } = useContent('page', 'published');
  const [laboratoryTests, setLaboratoryTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const content = pageContent.find(item => item.slug === 'laboratory');

  useEffect(() => {
    const loadContent = () => {
      const tests = contentStore.getLaboratoryTests('active');
      setLaboratoryTests(tests);
      setLoading(false);
    };

    loadContent();
    const unsubscribe = contentStore.subscribe(loadContent);
    return unsubscribe;
  }, []);

  const groupTestsByCategory = (tests: any[]) => {
    return tests.reduce((groups: any, test: any) => {
      const category = test.category || 'Diğer';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(test);
      return groups;
    }, {});
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Mekanik Testler':
        return <Microscope className="w-6 h-6" />;
      case 'Kimyasal Analiz':
        return <FileText className="w-6 h-6" />;
      case 'Mikroyapı İncelemesi':
        return <Users className="w-6 h-6" />;
      default:
        return <CheckCircle className="w-6 h-6" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const groupedTests = groupTestsByCategory(laboratoryTests);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {content?.title || 'Laboratuvar Hizmetleri'}
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              {content?.content || 'Modern ekipmanlarımız ve uzman kadromuzla kapsamlı laboratuvar testleri sunuyoruz.'}
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-lg">
              <div className="flex items-center">
                <Microscope className="w-6 h-6 mr-2" />
                <span>Gelişmiş Ekipman</span>
              </div>
              <div className="flex items-center">
                <Users className="w-6 h-6 mr-2" />
                <span>Uzman Kadro</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 mr-2" />
                <span>Akredite Testler</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Laboratory Tests Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Laboratuvar Testlerimiz
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Endüstriyel ihtiyaçlarınıza yönelik kapsamlı test ve analiz hizmetleri
            </p>
          </div>

          {Object.keys(groupedTests).length > 0 ? (
            Object.entries(groupedTests).map(([category, tests]: [string, any]) => (
              <div key={category} className="mb-16">
                <div className="flex items-center mb-8">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    {getCategoryIcon(category)}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{category}</h3>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {tests.map((test: any) => (
                    <div key={test.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                      <div className="p-6">
                        <h4 className="text-xl font-bold text-gray-900 mb-3">
                          {test.name?.[i18n.language] || test.name?.tr || test.name}
                        </h4>
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {test.description?.[i18n.language] || test.description?.tr || test.description}
                        </p>
                        
                        <div className="space-y-3 mb-6">
                          {test.method && (
                            <div className="flex items-start">
                              <FileText className="w-4 h-4 text-blue-600 mr-2 mt-1 flex-shrink-0" />
                              <div>
                                <span className="font-medium text-gray-900">Yöntem: </span>
                                <span className="text-gray-600">{test.method}</span>
                              </div>
                            </div>
                          )}
                          
                          {test.duration && (
                            <div className="flex items-start">
                              <Clock className="w-4 h-4 text-blue-600 mr-2 mt-1 flex-shrink-0" />
                              <div>
                                <span className="font-medium text-gray-900">Süre: </span>
                                <span className="text-gray-600">{test.duration}</span>
                              </div>
                            </div>
                          )}
                          
                          {test.equipment && (
                            <div className="flex items-start">
                              <Microscope className="w-4 h-4 text-blue-600 mr-2 mt-1 flex-shrink-0" />
                              <div>
                                <span className="font-medium text-gray-900">Ekipman: </span>
                                <span className="text-gray-600">{test.equipment}</span>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {test.standards && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h5 className="font-medium text-gray-900 mb-2">Standartlar:</h5>
                            <p className="text-sm text-gray-600">{test.standards}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <Microscope className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                Henüz test eklenmemiş
              </h3>
              <p className="text-gray-600">
                Admin panelinden laboratuvar testleri ekleyebilirsiniz.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Laboratuvar Yeteneklerimiz
              </h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-600 mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Akredite Test Laboratuvarı
                    </h3>
                    <p className="text-gray-600">
                      Uluslararası standartlara uygun akredite laboratuvarımızda güvenilir sonuçlar alın.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-600 mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Modern Ekipman Parkı
                    </h3>
                    <p className="text-gray-600">
                      Son teknoloji test ekipmanları ile hassas ve doğru ölçümler gerçekleştiriyoruz.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-600 mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Hızlı Rapor Süreci
                    </h3>
                    <p className="text-gray-600">
                      Testlerinizin sonuçlarını en kısa sürede detaylı raporlar halinde sunuyoruz.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Test Talebi Oluşturun
              </h3>
              <p className="text-gray-600 mb-6">
                Laboratuvar testleriniz için hemen teklif alın. Uzman ekibimiz size en uygun çözümü sunar.
              </p>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center">
                Teklif İsteyin
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LaboratoryPage;