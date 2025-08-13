import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Calendar, Heart, Star } from 'lucide-react';

interface SpecialDay {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  date: string;
  type: 'celebration' | 'commemoration' | 'holiday' | 'announcement';
  image?: string;
  backgroundColor?: string;
  textColor?: string;
  isActive: boolean;
  showDuration: number;
  createdAt: string;
  updatedAt: string;
}

interface SpecialDayModalProps {
  specialDay: SpecialDay;
  onClose: () => void;
}

const SpecialDayModal: React.FC<SpecialDayModalProps> = ({ specialDay, onClose }) => {
  const { i18n } = useTranslation();
  const [timeLeft, setTimeLeft] = useState(specialDay.showDuration);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onClose, specialDay.showDuration]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'celebration':
        return <Star className="w-8 h-8" />;
      case 'commemoration':
        return <Heart className="w-8 h-8" />;
      case 'holiday':
        return <Calendar className="w-8 h-8" />;
      default:
        return <Star className="w-8 h-8" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'celebration':
        return 'text-yellow-400';
      case 'commemoration':
        return 'text-red-400';
      case 'holiday':
        return 'text-green-400';
      default:
        return 'text-blue-400';
    }
  };

  const title = i18n.language === 'en' ? specialDay.titleEn : specialDay.title;
  const description = i18n.language === 'en' ? specialDay.descriptionEn : specialDay.description;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      
      {/* Modal */}
      <div 
        className="relative max-w-2xl w-full rounded-2xl shadow-2xl overflow-hidden"
        style={{ 
          backgroundColor: specialDay.backgroundColor || '#1e40af',
          color: specialDay.textColor || '#ffffff'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background Image */}
        {specialDay.image && (
          <div className="absolute inset-0">
            <img
              src={specialDay.image}
              alt={title}
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/30 to-black/60"></div>
          </div>
        )}

        {/* Content */}
        <div className="relative p-8 text-center">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Timer */}
          <div className="absolute top-4 left-4 bg-white/20 rounded-full px-3 py-1 text-sm font-medium">
            {timeLeft}s
          </div>

          {/* Icon */}
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-6 ${getTypeColor(specialDay.type)}`}>
            {getTypeIcon(specialDay.type)}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            {title}
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl mb-8 opacity-90 leading-relaxed max-w-lg mx-auto">
            {description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg font-semibold transition-colors backdrop-blur-sm"
            >
              {i18n.language === 'en' ? 'Continue to Site' : 'Siteye Devam Et'}
            </button>
            <a
              href="/about"
              className="px-6 py-3 bg-white text-gray-900 hover:bg-gray-100 rounded-lg font-semibold transition-colors"
            >
              {i18n.language === 'en' ? 'Learn More About Us' : 'Hakkımızda Daha Fazla'}
            </a>
          </div>

          {/* Progress Bar */}
          <div className="mt-8">
            <div className="w-full bg-white/20 rounded-full h-1">
              <div 
                className="bg-white h-1 rounded-full transition-all duration-1000 ease-linear"
                style={{ 
                  width: `${((specialDay.showDuration - timeLeft) / specialDay.showDuration) * 100}%` 
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialDayModal;