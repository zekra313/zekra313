import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, Order } from '../types';
import {
  MessageCircle,
  X,
  Send,
  Image as ImageIcon,
  Sparkles,
  ShoppingBag,
  Paperclip,
  Check,
  CheckCheck
} from 'lucide-react';
import { formatIQD, formatArabicDate } from '../utils/formatters';

interface CustomerChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  attachedProduct?: Product | null;
  attachedOrder?: Order | null;
  onClearAttachment?: () => void;
}

export const CustomerChatWidget: React.FC<CustomerChatWidgetProps> = ({
  isOpen,
  onClose,
  attachedProduct,
  attachedOrder,
  onClearAttachment
}) => {
  const {
    conversations,
    customerConversationId,
    sendMessageAsCustomer,
    markConversationAsRead,
    storeSettings
  } = useStore();

  const [inputText, setInputText] = useState('');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversation = conversations.find(c => c.id === customerConversationId);
  const messages = conversation?.messages || [];

  useEffect(() => {
    if (isOpen) {
      markConversationAsRead(customerConversationId, 'customer');
    }
  }, [isOpen, customerConversationId, messages.length]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !imageUrlInput.trim() && !attachedProduct) return;

    sendMessageAsCustomer(
      inputText.trim() || (attachedProduct ? `استفسار عن: ${attachedProduct.name}` : 'مرحباً، أود الاستفسار'),
      attachedProduct || undefined,
      imageUrlInput.trim() || undefined
    );

    setInputText('');
    setImageUrlInput('');
    setShowImageInput(false);
    onClearAttachment?.();
  };

  return (
    <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:left-6 z-50 w-full sm:w-96 sm:max-w-md h-full sm:h-[550px] bg-white sm:rounded-3xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden text-right">
      
      {/* Header */}
      <div
        className="p-4 text-white flex items-center justify-between"
        style={{ backgroundColor: 'var(--primary-color, #1e3a2b)' }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm leading-tight">{storeSettings.storeName}</h3>
            <span className="text-[11px] text-amber-200 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>فريق خدمة العملاء متواجد للمساعدة</span>
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          aria-label="إغلاق المحادثة"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages List Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-stone-50">
        
        {/* Welcome message bubble */}
        <div className="flex justify-start">
          <div className="max-w-[85%] bg-white p-3 rounded-2xl rounded-tr-xs border border-stone-200 shadow-2xs space-y-1">
            <div className="text-xs font-bold text-emerald-800">مشرف ذكرى للطباعة</div>
            <p className="text-xs text-stone-700 leading-relaxed">
              أهلاً وسهلاً بك في متجر ذكرى! 👋
              يسعدنا الإجابة عن أي استفسار يخص الطباعة، الألوان، المقاسات، أو تأكيد تفاصيل طلبك قبل تثبيته.
            </p>
            <div className="text-[10px] text-stone-400 text-left">الآن</div>
          </div>
        </div>

        {/* Existing Messages */}
        {messages.map((msg) => {
          const isCustomer = msg.sender === 'customer';

          return (
            <div
              key={msg.id}
              className={`flex ${isCustomer ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-2xl shadow-2xs space-y-2 ${
                  isCustomer
                    ? 'bg-stone-900 text-white rounded-tl-xs'
                    : 'bg-white text-stone-900 rounded-tr-xs border border-stone-200'
                }`}
              >
                {/* Product Attachment Preview Card */}
                {msg.productAttachment && (
                  <div
                    className={`p-2 rounded-xl flex items-center gap-2 text-xs border ${
                      isCustomer ? 'bg-white/10 border-white/20' : 'bg-stone-50 border-stone-200'
                    }`}
                  >
                    <img
                      src={msg.productAttachment.image}
                      alt=""
                      className="w-10 h-10 object-cover rounded-lg shrink-0"
                    />
                    <div className="overflow-hidden text-right">
                      <div className="font-bold truncate text-[11px]">{msg.productAttachment.name}</div>
                      <div className="text-[10px] opacity-80">{formatIQD(msg.productAttachment.price)}</div>
                    </div>
                  </div>
                )}

                {/* Attached Image if any */}
                {msg.imageUrl && (
                  <div className="rounded-xl overflow-hidden max-h-48 border border-white/20">
                    <img src={msg.imageUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Message Text */}
                <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                {/* Timestamp & Status */}
                <div
                  className={`text-[10px] flex items-center justify-end gap-1 ${
                    isCustomer ? 'text-stone-400' : 'text-stone-400'
                  }`}
                >
                  <span>{formatArabicDate(msg.timestamp)}</span>
                  {isCustomer && <CheckCheck className="w-3.5 h-3.5 text-amber-300" />}
                </div>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* Active Attachment Banner before sending */}
      {attachedProduct && (
        <div className="px-4 py-2 bg-amber-50 border-t border-amber-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-amber-700" />
            <span className="font-semibold text-amber-900 truncate max-w-[200px]">
              استفسار عن: {attachedProduct.name}
            </span>
          </div>
          <button
            onClick={onClearAttachment}
            className="text-amber-800 hover:text-amber-950 font-bold"
          >
            إلغاء
          </button>
        </div>
      )}

      {/* Image URL input drawer if toggled */}
      {showImageInput && (
        <div className="p-2 bg-stone-100 border-t border-stone-200 flex gap-2">
          <input
            type="text"
            placeholder="أدخل رابط صورة التصميم أو الشعار (URL)..."
            value={imageUrlInput}
            onChange={(e) => setImageUrlInput(e.target.value)}
            className="flex-1 px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setShowImageInput(false)}
            className="text-xs px-2 text-stone-500 hover:text-stone-800"
          >
            إلغاء
          </button>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-stone-200 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowImageInput(!showImageInput)}
          className="p-2 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-xl transition-colors"
          title="إرفاق رابط صورة"
        >
          <ImageIcon className="w-4 h-4" />
        </button>

        <input
          type="text"
          placeholder="اكتب رسالتك أو استفسارك هنا..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 px-3.5 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:border-stone-500 focus:outline-none"
        />

        <button
          type="submit"
          disabled={!inputText.trim() && !imageUrlInput.trim() && !attachedProduct}
          className="p-2 rounded-xl text-white shadow-xs transition-opacity hover:opacity-90 disabled:opacity-40"
          style={{ backgroundColor: 'var(--btn-color, #1e3a2b)' }}
          aria-label="إرسال"
        >
          <Send className="w-4 h-4 rotate-180" />
        </button>
      </form>

    </div>
  );
};
