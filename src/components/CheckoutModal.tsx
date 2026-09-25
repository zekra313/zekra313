import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Order } from '../types';
import {
  X,
  ShieldCheck,
  Truck,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  FileText,
  ArrowRight
} from 'lucide-react';
import { formatIQD } from '../utils/formatters';
import confetti from 'canvas-confetti';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
  onOpenChat: () => void;
}

const IRAQI_PROVINCES = [
  'بغداد - الكرخ',
  'بغداد - الرصافة',
  'البصرة',
  'أربيل',
  'النجف الأشرف',
  'كربلاء المقدسة',
  'نينوى (الموصل)',
  'السليمانية',
  'بابل (الحلة)',
  'كركوك',
  'ذي قار (الناصرية)',
  'الأنبار',
  'ميسان (العمارة)',
  'ديالى',
  'واسط (الكوت)',
  'صلاح الدين',
  'القادسية (الديوانية)',
  'المثنى (السماوة)',
  'دهوك'
];

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderSuccess,
  onOpenChat
}) => {
  const { cart, cartSubtotal, cartTotal, selectedDelivery, createOrder } = useStore();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('بغداد - الرصافة');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerName.trim()) {
      setErrorMsg('يرجى إدخال اسم المستلم بالكامل');
      return;
    }

    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      setErrorMsg('يرجى إدخال رقم هاتف عراقي صالح (11 رقم مثل: 0770XXXXXXX)');
      return;
    }

    if (!address.trim()) {
      setErrorMsg('يرجى إدخال العنوان التفصيلي وأقرب نقطة دالة لتسهيل وصول المندوب');
      return;
    }

    setIsSubmitting(true);

    try {
      const newOrder = createOrder({
        customerName: customerName.trim(),
        phone: phone.trim(),
        city,
        address: address.trim(),
        notes: notes.trim() || undefined
      });

      // Fire celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      onOrderSuccess(newOrder);
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMsg('حدث خطأ أثناء حفظ الطلب. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-stone-950/60 backdrop-blur-xs overflow-y-auto">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto border border-stone-200 text-right"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/60">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <h2 className="text-base font-bold text-stone-900">تأكيد الطلب والشحن</h2>
            <span className="text-xs text-stone-400">· الدفع عند الاستلام</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmitOrder} className="p-6 space-y-6">
          
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Customer Personal Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              معلومات المستلم وموقع التوصيل
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-stone-700">
                  الاسم الكامل <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: علي محمد حسن"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:border-stone-500 focus:outline-none"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-stone-700">
                  رقم الهاتف (واتساب) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  dir="ltr"
                  required
                  placeholder="0770 123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:border-stone-500 focus:outline-none text-right"
                />
              </div>
            </div>

            {/* City / Province */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-stone-700">
                  المحافظة / المدينة <span className="text-rose-500">*</span>
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:border-stone-500 focus:outline-none"
                >
                  {IRAQI_PROVINCES.map((prov) => (
                    <option key={prov} value={prov}>
                      {prov}
                    </option>
                  ))}
                </select>
              </div>

              {/* Delivery Zone Notice */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-stone-700">
                  رسوم التوصيل المحددة:
                </label>
                <div className="px-3.5 py-2 text-sm bg-stone-100 rounded-xl border border-stone-200 text-stone-800 font-bold flex justify-between items-center">
                  <span>{selectedDelivery?.title || 'توصيل اعتيادي'}</span>
                  <span className="tabular-nums">{formatIQD(selectedDelivery?.price || 5000)}</span>
                </div>
              </div>
            </div>

            {/* Detailed Address */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-stone-700">
                العنوان التفصيلي وأقرب نقطة دالة <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="المنطقة، الشارع، المحلة، أقرب مدرسة أو جامع أو مستشفى..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:border-stone-500 focus:outline-none"
              />
            </div>

            {/* Special Instructions / Printing Notes */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-stone-700">
                ملاحظات إضافية بخصوص الطباعة أو وقت التسليم (اختياري):
              </label>
              <textarea
                rows={2}
                placeholder="أي توضيحات تخص تصميم الهدية، أوقات تواجدك، أو طريقة التغليف..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:border-stone-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Ordered Products Itemized Mini-Preview */}
          <div className="space-y-3 pt-2 border-t border-stone-200">
            <div className="flex justify-between items-center text-xs font-bold text-stone-700">
              <span>ملخص المنتجات المطلوبة ({cart.length})</span>
              <button
                type="button"
                onClick={onOpenChat}
                className="text-emerald-700 hover:text-emerald-800 flex items-center gap-1 font-semibold"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>مراسلة المتجر للتعديل قبل الإرسال</span>
              </button>
            </div>

            <div className="max-h-36 overflow-y-auto space-y-2 pr-1">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs p-2 bg-stone-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <img
                      src={item.product.images[0] || '/src/assets/images/hero_printing_store_1790334111184.jpg'}
                      alt=""
                      className="w-10 h-10 object-cover rounded-lg border border-stone-200"
                    />
                    <div>
                      <div className="font-semibold text-stone-900">{item.product.name}</div>
                      <div className="text-[11px] text-stone-500">
                        الكمية: {item.quantity} {item.customNote ? `· (${item.customNote})` : ''}
                      </div>
                    </div>
                  </div>
                  <span className="font-bold tabular-nums text-stone-800">
                    {formatIQD(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Price breakdown & Cash on Delivery notice */}
          <div className="p-4 bg-stone-100 rounded-2xl space-y-2 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>مجموع المنتجات:</span>
              <span className="font-bold tabular-nums">{formatIQD(cartSubtotal)}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>رسوم الشحن والتوصيل ({selectedDelivery?.title || 'التوصيل'}):</span>
              <span className="font-bold tabular-nums">
                {selectedDelivery ? formatIQD(selectedDelivery.price) : '0 د.ع'}
              </span>
            </div>
            <div className="flex justify-between text-sm sm:text-base font-extrabold text-stone-900 pt-2 border-t border-stone-300">
              <span>المجموع الكلي المطلوب عند الاستلام:</span>
              <span className="tabular-nums" style={{ color: 'var(--primary-color, #1e3a2b)' }}>
                {formatIQD(cartTotal)}
              </span>
            </div>

            <div className="pt-2 flex items-center gap-2 text-[11px] text-stone-600 bg-white/70 p-2.5 rounded-xl border border-stone-200/80">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>الدفع عند الاستلام (COD):</strong> لن يتم خصم أي مبالغ الآن. يراجع مشرف المتجر الطلب ويؤكده معك عبر الواتساب أو الاتصال قبل إحالته للطباعة.
              </span>
            </div>
          </div>

          {/* Submit Order Buttons */}
          <div className="space-y-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
              style={{ backgroundColor: 'var(--btn-color, #1e3a2b)' }}
            >
              {isSubmitting ? (
                <span>جاري إرسال الطلب للمتجر...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 text-amber-300" />
                  <span>إرسال وتثبيت الطلب ({formatIQD(cartTotal)})</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors"
            >
              العودة إلى تعديل سلة التسوق
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
