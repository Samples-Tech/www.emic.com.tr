import React, { useState, useRef } from 'react';
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  ListBulletIcon,
  NumberedListIcon,
  LinkIcon,
  PhotoIcon,
  CodeBracketIcon,
  PaintBrushIcon
} from '@heroicons/react/24/outline';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  value, 
  onChange, 
  placeholder = "İçeriğinizi yazın...",
  height = "200px"
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleImageInsert = () => {
    if (imageUrl.trim()) {
      execCommand('insertImage', imageUrl);
      setImageUrl('');
      setShowImageModal(false);
    }
  };

  const handleLinkInsert = () => {
    if (linkUrl.trim() && linkText.trim()) {
      const linkHtml = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">${linkText}</a>`;
      execCommand('insertHTML', linkHtml);
      setLinkUrl('');
      setLinkText('');
      setShowLinkModal(false);
    }
  };

  const handleContentChange = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const toolbarButtons = [
    { command: 'bold', icon: BoldIcon, title: 'Kalın' },
    { command: 'italic', icon: ItalicIcon, title: 'İtalik' },
    { command: 'underline', icon: UnderlineIcon, title: 'Altı Çizili' },
    { command: 'insertUnorderedList', icon: ListBulletIcon, title: 'Madde İşaretli Liste' },
    { command: 'insertOrderedList', icon: NumberedListIcon, title: 'Numaralı Liste' },
  ];

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex items-center space-x-1">
        {toolbarButtons.map((button) => {
          const IconComponent = button.icon;
          return (
            <button
              key={button.command}
              type="button"
              onClick={() => execCommand(button.command)}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
              title={button.title}
            >
              <IconComponent className="w-4 h-4" />
            </button>
          );
        })}
        
        <div className="w-px h-6 bg-gray-300 mx-2"></div>
        
        <button
          type="button"
          onClick={() => setShowLinkModal(true)}
          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
          title="Bağlantı Ekle"
        >
          <LinkIcon className="w-4 h-4" />
        </button>
        
        <button
          type="button"
          onClick={() => setShowImageModal(true)}
          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
          title="Görsel Ekle"
        >
          <PhotoIcon className="w-4 h-4" />
        </button>
        
        <div className="w-px h-6 bg-gray-300 mx-2"></div>
        
        <select
          onChange={(e) => execCommand('formatBlock', e.target.value)}
          className="text-sm border-none bg-transparent text-gray-600 focus:outline-none"
          defaultValue=""
        >
          <option value="">Format</option>
          <option value="h1">Başlık 1</option>
          <option value="h2">Başlık 2</option>
          <option value="h3">Başlık 3</option>
          <option value="p">Paragraf</option>
        </select>
        
        <select
          onChange={(e) => execCommand('foreColor', e.target.value)}
          className="text-sm border-none bg-transparent text-gray-600 focus:outline-none"
          defaultValue=""
        >
          <option value="">Renk</option>
          <option value="#000000">Siyah</option>
          <option value="#dc2626">Kırmızı</option>
          <option value="#2563eb">Mavi</option>
          <option value="#16a34a">Yeşil</option>
          <option value="#ca8a04">Sarı</option>
          <option value="#9333ea">Mor</option>
        </select>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleContentChange}
        dangerouslySetInnerHTML={{ __html: value }}
        className="p-4 focus:outline-none min-h-[200px] prose prose-sm max-w-none"
        style={{ height }}
        data-placeholder={placeholder}
      />

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Görsel Ekle</h3>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Görsel URL'si girin..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <div className="flex space-x-3">
              <button
                onClick={handleImageInsert}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Ekle
              </button>
              <button
                onClick={() => setShowImageModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Bağlantı Ekle</h3>
            <div className="space-y-3">
              <input
                type="text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="Bağlantı metni..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="URL adresi..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex space-x-3 mt-4">
              <button
                onClick={handleLinkInsert}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Ekle
              </button>
              <button
                onClick={() => setShowLinkModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;