import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import { useContent, useSettings } from '../hooks/useContent';

const ContactPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { content: contactContents, loading } = useContent('page', 'published');
  const { settings } = useSettings();
  
  // Find contact page content by slug
  const content = contactContents.find(item => item.slug === 'contact') || null;
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  const isEnglish = i18n.language === 'en';
  const title = content ? (isEnglish ? content.titleEn : content.title) : (isEnglish ? 'Contact Us' : 'İletişim');
  const description = content ? (isEnglish ? content.contentEn : content.content) : (isEnglish ? 'Get in touch with our team for your inspection and testing needs.' : 'Muayene ve test ihtiyaçlarınız için ekibimizle iletişime geçin.');

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              {isEnglish ? 'Contact Information' : 'İletişim Bilgileri'}
            </h2>
            
            <div className="space-y-6">
              {settings?.phone && (
                <div className="flex items-start">
                  <Phone className="h-6 w-6 text-blue-600 mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {isEnglish ? 'Phone' : 'Telefon'}
                    </h3>
                    <p className="text-gray-600">{settings.phone}</p>
                  </div>
                </div>
              )}

              {settings?.email && (
                <div className="flex items-start">
                  <Mail className="h-6 w-6 text-blue-600 mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {isEnglish ? 'Email' : 'E-posta'}
                    </h3>
                    <p className="text-gray-600">{settings.email}</p>
                  </div>
                </div>
              )}

              {settings?.address && (
                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-blue-600 mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {isEnglish ? 'Address' : 'Adres'}
                    </h3>
                    <p className="text-gray-600">
                      {isEnglish ? settings.addressEn : settings.address}
                    </p>
                  </div>
                </div>
              )}

              {settings?.workingHours && (
                <div className="flex items-start">
                  <Clock className="h-6 w-6 text-blue-600 mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {isEnglish ? 'Working Hours' : 'Çalışma Saatleri'}
                    </h3>
                    <p className="text-gray-600">
                      {isEnglish ? settings.workingHoursEn : settings.workingHours}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              {isEnglish ? 'Send us a Message' : 'Bize Mesaj Gönderin'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    {isEnglish ? 'Name' : 'Ad Soyad'}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    {isEnglish ? 'Email' : 'E-posta'}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    {isEnglish ? 'Phone' : 'Telefon'}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    {isEnglish ? 'Subject' : 'Konu'}
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  {isEnglish ? 'Message' : 'Mesaj'}
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <Send className="h-5 w-5 mr-2" />
                {isEnglish ? 'Send Message' : 'Mesaj Gönder'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {isEnglish ? 'Our Location' : 'Konumumuz'}
            </h2>
            <p className="text-gray-600">
              {isEnglish 
                ? 'Visit our office or contact us for on-site services.'
                : 'Ofisimizi ziyaret edin veya saha hizmetleri için bizimle iletişime geçin.'
              }
            </p>
          </div>
          
          <div className="bg-gray-100 rounded-2xl overflow-hidden shadow-lg">
            <div className="aspect-video relative">
              {/* Google Maps Embed */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3124.123456789!2d27.0123456!3d38.4123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sAtat%C3%BCrk%20Organize%20Sanayi%20B%C3%B6lgesi%2C%20%C3%87i%C4%9Fli%2F%C4%B0zmir!5e0!3m2!1str!2str!4v1234567890123!5m2!1str!2str"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
                title={isEnglish ? 'EMIC Location Map' : 'EMIC Konum Haritası'}
              ></iframe>
              
              {/* Map Overlay with Address */}
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg max-w-sm">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">EMIC Ofisi</h4>
                    <p className="text-sm text-gray-600">
                      {isEnglish ? settings.addressEn : settings.address}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Phone className="w-3 h-3" />
                        <span>{settings.phone}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{isEnglish ? settings.workingHoursEn : settings.workingHours}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Directions and Additional Info */}
          <div className="mt-8 grid md:grid-cols-2 gap-8">
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                {isEnglish ? 'Getting Here' : 'Ulaşım Bilgileri'}
              </h3>
              <div className="space-y-2 text-sm text-blue-800">
                <p>• {isEnglish ? 'By car: 15 minutes from Izmir city center' : 'Araçla: İzmir şehir merkezinden 15 dakika'}</p>
                <p>• {isEnglish ? 'Public transport: ESHOT bus lines available' : 'Toplu taşıma: ESHOT otobüs hatları mevcut'}</p>
                <p>• {isEnglish ? 'Parking: Free parking available on-site' : 'Park: Ücretsiz otopark mevcut'}</p>
              </div>
            </div>
            
            <div className="bg-green-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-3">
                {isEnglish ? 'On-Site Services' : 'Saha Hizmetleri'}
              </h3>
              <div className="space-y-2 text-sm text-green-800">
                <p>• {isEnglish ? 'Mobile inspection units available' : 'Mobil muayene üniteleri mevcut'}</p>
                <p>• {isEnglish ? 'Turkey-wide service coverage' : 'Türkiye geneli hizmet kapsamı'}</p>
                <p>• {isEnglish ? '24/7 emergency inspection services' : '7/24 acil durum muayene hizmetleri'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;