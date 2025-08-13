import React, { useState, useEffect } from 'react';
import { useContent, useSettings } from '../hooks/useContent';

const AboutPage: React.FC = () => {
  const { content: aboutContents, loading } = useContent('page', 'published');
  const { settings } = useSettings();
  
  // Find about page content by slug
  const content = aboutContents.find(item => item.slug === 'about') || null;

  useEffect(() => {
    // Create default about content if it doesn't exist
    if (!loading && aboutContents.length === 0) {
      const { contentStore } = require('../lib/contentStore');
      contentStore.addContent({
        type: 'page',
        title: 'Hakkımızda',
        titleEn: 'About Us',
        content: `
          <div class="space-y-6">
            <p class="text-lg text-gray-700 leading-relaxed">
              EMIC olarak, endüstriyel muayene ve test hizmetlerinde 25+ yıllık deneyimimiz ile 
              müşterilerimize güvenilir ve profesyonel çözümler sunmaktayız.
            </p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 class="text-xl font-semibold text-gray-800 mb-4">Misyonumuz</h3>
                <p class="text-gray-600">
                  Endüstriyel güvenlik ve kalite standartlarını en üst seviyede tutarak, 
                  müşterilerimizin operasyonel verimliliğini artırmak ve güvenli çalışma 
                  ortamları oluşturmalarına katkıda bulunmak.
                </p>
              </div>
              
              <div>
                <h3 class="text-xl font-semibold text-gray-800 mb-4">Vizyonumuz</h3>
                <p class="text-gray-600">
                  Türkiye'nin önde gelen endüstriyel muayene ve test hizmetleri şirketi 
                  olarak, teknolojik yenilikleri takip eden, sürekli gelişen ve 
                  müşteri memnuniyetini ön planda tutan bir organizasyon olmak.
                </p>
              </div>
            </div>
            
            <div>
              <h3 class="text-xl font-semibold text-gray-800 mb-4">Değerlerimiz</h3>
              <ul class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <li class="flex items-start space-x-3">
                  <div class="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <span class="text-gray-600">Güvenilirlik ve Dürüstlük</span>
                </li>
                <li class="flex items-start space-x-3">
                  <div class="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <span class="text-gray-600">Teknik Mükemmellik</span>
                </li>
                <li class="flex items-start space-x-3">
                  <div class="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <span class="text-gray-600">Müşteri Odaklılık</span>
                </li>
                <li class="flex items-start space-x-3">
                  <div class="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <span class="text-gray-600">Sürekli Gelişim</span>
                </li>
              </ul>
            </div>
          </div>
        `,
        contentEn: `
          <div class="space-y-6">
            <p class="text-lg text-gray-700 leading-relaxed">
              As EMIC, we provide reliable and professional solutions to our customers 
              with our 25+ years of experience in industrial inspection and testing services.
            </p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 class="text-xl font-semibold text-gray-800 mb-4">Our Mission</h3>
                <p class="text-gray-600">
                  To maintain industrial safety and quality standards at the highest level, 
                  increase our customers' operational efficiency and contribute to creating 
                  safe working environments.
                </p>
              </div>
              
              <div>
                <h3 class="text-xl font-semibold text-gray-800 mb-4">Our Vision</h3>
                <p class="text-gray-600">
                  To be Turkey's leading industrial inspection and testing services company, 
                  following technological innovations, continuously developing and prioritizing 
                  customer satisfaction.
                </p>
              </div>
            </div>
            
            <div>
              <h3 class="text-xl font-semibold text-gray-800 mb-4">Our Values</h3>
              <ul class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <li class="flex items-start space-x-3">
                  <div class="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <span class="text-gray-600">Reliability and Honesty</span>
                </li>
                <li class="flex items-start space-x-3">
                  <div class="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <span class="text-gray-600">Technical Excellence</span>
                </li>
                <li class="flex items-start space-x-3">
                  <div class="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <span class="text-gray-600">Customer Focus</span>
                </li>
                <li class="flex items-start space-x-3">
                  <div class="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <span class="text-gray-600">Continuous Improvement</span>
                </li>
              </ul>
            </div>
          </div>
        `,
        slug: 'about',
        status: 'published',
        order: 1
      });
    }
  }, [loading, aboutContents]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">İçerik bulunamadı.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {content.title}
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              {settings.description}
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: content.content }}
          />
        </div>
      </div>

      {/* Company Stats */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">25+</div>
              <div className="text-gray-600">Yıllık Deneyim</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Tamamlanan Proje</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">100+</div>
              <div className="text-gray-600">Mutlu Müşteri</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-gray-600">Teknik Destek</div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Projeleriniz için bizimle iletişime geçin
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Uzman ekibimiz size en uygun çözümü sunmak için hazır
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              İletişime Geç
            </a>
            <a
              href={`tel:${settings.phone}`}
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              {settings.phone}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;