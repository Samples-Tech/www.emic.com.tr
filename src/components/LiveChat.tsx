import React, { useState, useEffect, useRef } from 'react';
import { 
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'admin';
  timestamp: Date;
  isRead: boolean;
}

interface ChatSession {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  isOnline: boolean;
  lastMessage?: Message;
  unreadCount: number;
  createdAt: Date;
}

const LiveChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentStep, setCurrentStep] = useState<'contact' | 'chat'>('contact');
  const [adminOnline, setAdminOnline] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    initialMessage: ''
  });
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Simulate admin online/offline status
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate random online/offline status (in real app, this would come from server)
      setAdminOnline(Math.random() > 0.3); // 70% chance of being online
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simulate admin responses
  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].sender === 'user' && adminOnline) {
      const timer = setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          const adminResponses = [
            'Merhaba! Size nasıl yardımcı olabilirim?',
            'Sorunuz için teşekkürler. Hemen size dönüş yapacağım.',
            'Bu konuda size detaylı bilgi verebilirim.',
            'Teklif hazırlayıp en kısa sürede size ileteceğim.',
            'Başka sorularınız var mı?'
          ];
          const randomResponse = adminResponses[Math.floor(Math.random() * adminResponses.length)];
          
          const adminMessage: Message = {
            id: Date.now().toString(),
            text: randomResponse,
            sender: 'admin',
            timestamp: new Date(),
            isRead: true
          };
          
          setMessages(prev => [...prev, adminMessage]);
        }, 2000);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [messages, adminOnline]);

  const handleStartChat = () => {
    if (!customerInfo.name || !customerInfo.email) return;

    // Add initial message if provided
    if (customerInfo.initialMessage.trim()) {
      const initialMessage: Message = {
        id: Date.now().toString(),
        text: customerInfo.initialMessage,
        sender: 'user',
        timestamp: new Date(),
        isRead: false
      };
      setMessages([initialMessage]);
    }

    setCurrentStep('chat');
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage.trim(),
      sender: 'user',
      timestamp: new Date(),
      isRead: false
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (currentStep === 'chat') {
        handleSendMessage();
      } else {
        handleStartChat();
      }
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('tr-TR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 group"
        >
          <ChatBubbleLeftRightIcon className="w-8 h-8 group-hover:scale-110 transition-transform" />
          {/* Online indicator */}
          <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
            adminOnline ? 'bg-green-500' : 'bg-gray-400'
          }`}></div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed bottom-6 right-6 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 transition-all duration-300 ${
          isMinimized ? 'h-16' : 'h-[600px]'
        }`}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-blue-600 text-white rounded-t-2xl">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <UserIcon className="w-5 h-5" />
                </div>
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border border-white ${
                  adminOnline ? 'bg-green-500' : 'bg-gray-400'
                }`}></div>
              </div>
              <div>
                <h3 className="font-semibold">EMIC Destek</h3>
                <p className="text-xs text-blue-100">
                  {adminOnline ? 'Çevrimiçi' : 'Çevrimdışı'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {currentStep === 'contact' ? (
                /* Contact Form */
                <div className="p-6 space-y-4">
                  <div className="text-center mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Canlı Destek
                    </h4>
                    <p className="text-sm text-gray-600">
                      Size nasıl yardımcı olabiliriz? Bilgilerinizi girin ve sohbeti başlatalım.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ad Soyad *
                      </label>
                      <input
                        type="text"
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="Adınızı girin"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        E-posta *
                      </label>
                      <input
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="email@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Telefon
                      </label>
                      <input
                        type="tel"
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="+90 5xx xxx xx xx"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mesajınız
                      </label>
                      <textarea
                        rows={3}
                        value={customerInfo.initialMessage}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, initialMessage: e.target.value }))}
                        onKeyPress={handleKeyPress}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                        placeholder="Size nasıl yardımcı olabiliriz?"
                      />
                    </div>

                    <button
                      onClick={handleStartChat}
                      disabled={!customerInfo.name || !customerInfo.email}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                      Sohbeti Başlat
                    </button>

                    {!adminOnline && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-sm text-yellow-800">
                          Şu anda çevrimdışıyız. Mesajınızı bırakın, en kısa sürede size dönüş yapalım.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Chat Interface */
                <>
                  {/* Messages Area */}
                  <div className="flex-1 p-4 space-y-4 max-h-96 overflow-y-auto">
                    {messages.length === 0 && (
                      <div className="text-center py-8">
                        <ChatBubbleLeftRightIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">
                          Merhaba {customerInfo.name}! Size nasıl yardımcı olabiliriz?
                        </p>
                      </div>
                    )}

                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs px-4 py-2 rounded-2xl ${
                            message.sender === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <p className={`text-xs mt-1 ${
                            message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}

                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 px-4 py-2 rounded-2xl">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={adminOnline ? "Mesajınızı yazın..." : "Mesajınızı bırakın..."}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        disabled={!adminOnline}
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || !adminOnline}
                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        <PaperAirplaneIcon className="w-4 h-4" />
                      </button>
                    </div>

                    {!adminOnline && (
                      <p className="text-xs text-gray-500 mt-2">
                        Şu anda çevrimdışıyız. Mesajınızı bırakın, size dönüş yapalım.
                      </p>
                    )}
                  </div>

                  {/* Customer Info */}
                  <div className="px-4 pb-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-600 space-y-1">
                        <div className="flex items-center space-x-2">
                          <UserIcon className="w-3 h-3" />
                          <span>{customerInfo.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <EnvelopeIcon className="w-3 h-3" />
                          <span>{customerInfo.email}</span>
                        </div>
                        {customerInfo.phone && (
                          <div className="flex items-center space-x-2">
                            <PhoneIcon className="w-3 h-3" />
                            <span>{customerInfo.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default LiveChat;