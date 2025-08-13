import React, { useState, useEffect } from 'react';
import { 
  ChatBubbleLeftRightIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  PaperAirplaneIcon,
  XMarkIcon,
  CheckIcon,
  ClockIcon
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
  messages: Message[];
}

const AdminChatPanel: React.FC = () => {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: '1',
      customerName: 'Ahmet Yılmaz',
      customerEmail: 'ahmet@abc.com',
      customerPhone: '+90 532 123 45 67',
      isOnline: true,
      unreadCount: 2,
      createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      messages: [
        {
          id: '1',
          text: 'Merhaba, NDT muayenesi hakkında bilgi almak istiyorum.',
          sender: 'user',
          timestamp: new Date(Date.now() - 1000 * 60 * 25),
          isRead: false
        },
        {
          id: '2',
          text: 'Özellikle ultrasonik test için teklif alabilir miyim?',
          sender: 'user',
          timestamp: new Date(Date.now() - 1000 * 60 * 20),
          isRead: false
        }
      ]
    },
    {
      id: '2',
      customerName: 'Mehmet Demir',
      customerEmail: 'mehmet@xyz.com',
      isOnline: false,
      unreadCount: 0,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      messages: [
        {
          id: '3',
          text: 'Kaynak muayenesi için randevu almak istiyorum.',
          sender: 'user',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
          isRead: true
        },
        {
          id: '4',
          text: 'Tabii, size uygun bir tarih ayarlayalım. Hangi tarihler sizin için uygun?',
          sender: 'admin',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5),
          isRead: true
        }
      ]
    }
  ]);

  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const currentSession = chatSessions.find(session => session.id === selectedSession);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedSession) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage.trim(),
      sender: 'admin',
      timestamp: new Date(),
      isRead: true
    };

    setChatSessions(prev =>
      prev.map(session =>
        session.id === selectedSession
          ? {
              ...session,
              messages: [...session.messages, message],
              lastMessage: message
            }
          : session
      )
    );

    setNewMessage('');
  };

  const handleMarkAsRead = (sessionId: string) => {
    setChatSessions(prev =>
      prev.map(session =>
        session.id === sessionId
          ? {
              ...session,
              unreadCount: 0,
              messages: session.messages.map(msg => ({ ...msg, isRead: true }))
            }
          : session
      )
    );
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Şimdi';
    if (diffInMinutes < 60) return `${diffInMinutes} dk önce`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} sa önce`;
    return date.toLocaleDateString('tr-TR');
  };

  const totalUnreadCount = chatSessions.reduce((total, session) => total + session.unreadCount, 0);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <ChatBubbleLeftRightIcon className="w-8 h-8 text-blue-600" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Canlı Destek</h2>
            <p className="text-sm text-gray-600">
              {totalUnreadCount > 0 ? `${totalUnreadCount} okunmamış mesaj` : 'Tüm mesajlar okundu'}
            </p>
          </div>
        </div>
        {totalUnreadCount > 0 && (
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {totalUnreadCount}
          </span>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 h-96">
        {/* Chat Sessions List */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <h3 className="font-medium text-gray-900">Aktif Sohbetler</h3>
          </div>
          <div className="divide-y divide-gray-200 max-h-80 overflow-y-auto">
            {chatSessions.map((session) => (
              <button
                key={session.id}
                onClick={() => {
                  setSelectedSession(session.id);
                  handleMarkAsRead(session.id);
                }}
                className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                  selectedSession === session.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                        session.isOnline ? 'bg-green-500' : 'bg-gray-400'
                      }`}></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{session.customerName}</h4>
                      <p className="text-sm text-gray-600 truncate">{session.customerEmail}</p>
                      {session.lastMessage && (
                        <p className="text-xs text-gray-500 truncate mt-1">
                          {session.lastMessage.text}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <span className="text-xs text-gray-500">
                      {formatTime(session.createdAt)}
                    </span>
                    {session.unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {session.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="border border-gray-200 rounded-lg flex flex-col">
          {selectedSession && currentSession ? (
            <>
              {/* Chat Header */}
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <UserIcon className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border border-white ${
                      currentSession.isOnline ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{currentSession.customerName}</h4>
                    <p className="text-xs text-gray-600">
                      {currentSession.isOnline ? 'Çevrimiçi' : 'Çevrimdışı'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <a
                    href={`tel:${currentSession.customerPhone}`}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Ara"
                  >
                    <PhoneIcon className="w-4 h-4" />
                  </a>
                  <a
                    href={`mailto:${currentSession.customerEmail}`}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="E-posta Gönder"
                  >
                    <EnvelopeIcon className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-64">
                {currentSession.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-3 py-2 rounded-lg ${
                        message.sender === 'admin'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className={`text-xs ${
                          message.sender === 'admin' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {formatTime(message.timestamp)}
                        </span>
                        {message.sender === 'admin' && (
                          <CheckIcon className="w-3 h-3 text-blue-200" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Yanıtınızı yazın..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    <PaperAirplaneIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ChatBubbleLeftRightIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Bir sohbet seçin</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600">{chatSessions.length}</div>
          <div className="text-sm text-blue-800">Toplam Sohbet</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600">
            {chatSessions.filter(s => s.isOnline).length}
          </div>
          <div className="text-sm text-green-800">Çevrimiçi</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-red-600">{totalUnreadCount}</div>
          <div className="text-sm text-red-800">Okunmamış</div>
        </div>
      </div>
    </div>
  );
};

export default AdminChatPanel;