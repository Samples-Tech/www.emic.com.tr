import React, { useState } from 'react';
import { 
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';

interface QuoteRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface QuoteFormData {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  services: string[];
  projectDescription: string;
  urgency: string;
  preferredContactMethod: string;
  additionalNotes: string;
}

const QuoteRequestModal: React.FC<QuoteRequestModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<QuoteFormData>({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    services: [],
    projectDescription: '',
    urgency: 'normal',
    preferredContactMethod: 'email',
    additionalNotes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const serviceOptions = [
    { id: 'ndt', name: 'Tahribatsız Muayene (NDT)', description: 'UT, RT, PT, MT, VT, ET yöntemleri' },
    { id: 'welding', name: 'Kaynak Muayenesi', description: 'WPS/WPQR onayları, kaynakçı testleri' },
    { id: 'pressure', name: 'Basınçlı Kap Muayenesi', description: 'Periyodik muayene, hidrostatik test' },
    { id: 'lifting', name: 'Kaldırma Araçları', description: 'Vinç, kren, forklift muayenesi' },
    { id: 'material', name: 'Malzeme Testleri', description: 'Çekme, darbe, sertlik testleri' },
    { id: 'calibration', name: 'Kalibrasyon Hizmetleri', description: 'Ölçüm cihazları kalibrasyonu' }
  ];

  const urgencyOptions = [
    { value: 'urgent', label: 'Acil (1-2 gün)', color: 'text-red-600' },
    { value: 'normal', label: 'Normal (1 hafta)', color: 'text-blue-600' },
    { value: 'flexible', label: 'Esnek (2+ hafta)', color: 'text-green-600' }
  ];

  const handleServiceChange = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter(id => id !== serviceId)
        : [...prev.services, serviceId]
    }));
  };

  const handleInputChange = (field: keyof QuoteFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call - in real app, this would send to backend
      const selectedServices = serviceOptions
        .filter(service => formData.services.includes(service.id))
        .map(service => service.name);

      const emailData = {
        to: 'info@emic.com.tr',
        subject: `Yeni Teklif Talebi - ${formData.companyName}`,
        body: `
Yeni Teklif Talebi Detayları:

Şirket: ${formData.companyName}
İletişim Kişisi: ${formData.contactPerson}
E-posta: ${formData.email}
Telefon: ${formData.phone}

Talep Edilen Hizmetler:
${selectedServices.map(service => `• ${service}`).join('\n')}

Proje Açıklaması:
${formData.projectDescription}

Aciliyet: ${urgencyOptions.find(u => u.value === formData.urgency)?.label}
Tercih Edilen İletişim: ${formData.preferredContactMethod === 'email' ? 'E-posta' : 'Telefon'}

Ek Notlar:
${formData.additionalNotes || 'Yok'}

Gönderim Tarihi: ${new Date().toLocaleString('tr-TR')}
        `
      };

      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Quote request sent:', emailData);
      setSubmitStatus('success');
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
        setFormData({
          companyName: '',
          contactPerson: '',
          email: '',
          phone: '',
          services: [],
          projectDescription: '',
          urgency: 'normal',
          preferredContactMethod: 'email',
          additionalNotes: ''
        });
        onClose();
      }, 3000);

    } catch (error) {
      console.error('Error sending quote request:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Teklif Talebi</h2>
            <p className="text-gray-600 mt-1">Hizmetlerimiz için detaylı teklif alın</p>
          </div>
          <div className="flex items-center space-x-2">
            <a
              href="/"
              className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              Ana Sayfaya Dön
            </a>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Success/Error Messages */}
        {submitStatus === 'success' && (
          <div className="m-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-800">Talebiniz Gönderildi!</h3>
                <p className="text-green-700 text-sm">En kısa sürede size dönüş yapacağız.</p>
              </div>
            </div>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="m-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
              <div>
                <h3 className="font-semibold text-red-800">Gönderim Hatası</h3>
                <p className="text-red-700 text-sm">Lütfen tekrar deneyin veya doğrudan iletişime geçin.</p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Company Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Şirket Bilgileri</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Şirket Adı *
                </label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="ABC Sanayi A.Ş."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  İletişim Kişisi *
                </label>
                <input
                  type="text"
                  required
                  value={formData.contactPerson}
                  onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ahmet Yılmaz"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-posta *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="ahmet@abc.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefon *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+90 5xx xxx xx xx"
                />
              </div>
            </div>
          </div>

          {/* Service Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Hizmet Alanları *</h3>
            <p className="text-sm text-gray-600">İhtiyacınız olan hizmetleri seçin:</p>
            <div className="grid md:grid-cols-2 gap-3">
              {serviceOptions.map((service) => (
                <label
                  key={service.id}
                  className={`flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.services.includes(service.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.services.includes(service.id)}
                    onChange={() => handleServiceChange(service.id)}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{service.name}</div>
                    <div className="text-sm text-gray-600">{service.description}</div>
                  </div>
                </label>
              ))}
            </div>
            {formData.services.length === 0 && (
              <p className="text-sm text-red-600">En az bir hizmet seçmelisiniz.</p>
            )}
          </div>

          {/* Project Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Proje Detayları</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Proje Açıklaması *
              </label>
              <textarea
                required
                rows={4}
                value={formData.projectDescription}
                onChange={(e) => handleInputChange('projectDescription', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Projenizin detaylarını, muayene edilecek ekipmanları ve özel gereksinimlerinizi açıklayın..."
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aciliyet Durumu
                </label>
                <select
                  value={formData.urgency}
                  onChange={(e) => handleInputChange('urgency', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {urgencyOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tercih Edilen İletişim
                </label>
                <select
                  value={formData.preferredContactMethod}
                  onChange={(e) => handleInputChange('preferredContactMethod', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="email">E-posta</option>
                  <option value="phone">Telefon</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ek Notlar
              </label>
              <textarea
                rows={3}
                value={formData.additionalNotes}
                onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Özel istekleriniz, zaman kısıtlarınız veya diğer önemli bilgiler..."
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={isSubmitting}
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isSubmitting || formData.services.length === 0}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Gönderiliyor...</span>
                </>
              ) : (
                <>
                  <PaperAirplaneIcon className="w-4 h-4" />
                  <span>Teklif Talebi Gönder</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuoteRequestModal;