import React from 'react';
import { Order } from '../types';
import { useStore } from '../context/StoreContext';
import { StoreLogo } from './StoreLogo';
import {
  X,
  Printer,
  Sparkles,
  Download,
  Calendar,
  MapPin,
  Phone,
  User,
  CheckCircle,
  Truck,
  QrCode
} from 'lucide-react';
import { formatIQD, formatArabicDate } from '../utils/formatters';

interface DigitalInvoiceModalProps {
  order: Order | null;
  onClose: () => void;
}

export const DigitalInvoiceModal: React.FC<DigitalInvoiceModalProps> = ({ order, onClose }) => {
  const { storeSettings } = useStore();

  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-stone-950/60 backdrop-blur-xs overflow-y-auto">
      <div
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto border border-stone-200 text-right flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Control Bar (Hidden on print) */}
        <div className="no-print px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-700">فاتورة إلكترونية معتمدة</span>
            <span className="text-stone-300">·</span>
            <span className="text-xs font-mono font-bold text-stone-900">{order.orderNumber}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-xl text-xs font-bold bg-stone-900 hover:bg-stone-800 text-white flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة الفاتورة</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div id="printable-invoice" className="p-6 sm:p-8 md:p-10 space-y-6 bg-white text-stone-900">
          
          {/* Invoice Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b-2 border-stone-900">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white border border-stone-200 p-1 flex items-center justify-center shadow-xs">
                  <StoreLogo customUrl={storeSettings.logoUrl} className="w-full h-full" />
                </div>
                <h1 className="text-2xl font-black tracking-tight text-stone-900">
                  {storeSettings.storeName}
                </h1>
              </div>
              <p className="text-xs text-stone-500 font-medium">
                {storeSettings.storeTagline} · متجر الطباعة والهدايا المخصصة
              </p>
              <div className="text-xs text-stone-600 space-y-0.5 pt-1">
                <div>الهاتف: {storeSettings.phone}</div>
                <div>العنوان: {storeSettings.address}</div>
              </div>
            </div>

            {/* Order Details & QR Simulation */}
            <div className="text-left sm:text-right space-y-1 bg-stone-50 p-4 rounded-2xl border border-stone-200">
              <div className="text-xs text-stone-400 font-semibold uppercase">فاتورة رقم / Invoice No</div>
              <div className="text-xl font-black font-mono text-stone-900 tracking-wider">
                {order.orderNumber}
              </div>
              <div className="text-xs text-stone-600">
                التاريخ: <strong>{formatArabicDate(order.createdAt)}</strong>
              </div>
              <div className="pt-1">
                <span className="inline-block text-xs font-bold px-2.5 py-1 rounded bg-stone-900 text-amber-300">
                  الحالة: {order.status}
                </span>
              </div>
            </div>
          </div>

          {/* Customer & Shipping Information Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs">
            <div className="space-y-1.5">
              <div className="font-bold text-stone-500 uppercase tracking-wider text-[11px]">بيانات العميل:</div>
              <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
                <User className="w-4 h-4 text-stone-400" />
                <span>{order.customerName}</span>
              </div>
              <div className="flex items-center gap-2 text-stone-700">
                <Phone className="w-4 h-4 text-stone-400" />
                <span dir="ltr">{order.phone}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="font-bold text-stone-500 uppercase tracking-wider text-[11px]">عنوان التوصيل:</div>
              <div className="flex items-center gap-2 font-bold text-stone-900">
                <MapPin className="w-4 h-4 text-stone-400" />
                <span>{order.city}</span>
              </div>
              <div className="text-stone-700 leading-relaxed pr-6">
                {order.address}
              </div>
              {order.notes && (
                <div className="text-amber-800 pr-6 italic pt-1">
                  ملاحظات: {order.notes}
                </div>
              )}
            </div>
          </div>

          {/* Itemized Table */}
          <div className="border border-stone-200 rounded-2xl overflow-hidden">
            <table className="w-full text-right text-xs">
              <thead className="bg-stone-100 text-stone-700 border-b border-stone-200 font-bold">
                <tr>
                  <th className="p-3">المنتج والتخصيص</th>
                  <th className="p-3 text-center">الكمية</th>
                  <th className="p-3 text-left">سعر المفرد</th>
                  <th className="p-3 text-left">المجموع</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-stone-50/50">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <img
                            src={item.image}
                            alt=""
                            className="w-12 h-12 object-cover rounded-lg border border-stone-200 shrink-0"
                          />
                        )}
                        <div>
                          <div className="font-bold text-stone-900 text-sm">{item.productName}</div>
                          {item.customNote && (
                            <div className="text-[11px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded inline-block mt-0.5">
                              ملاحظات الطباعة: {item.customNote}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-center font-bold tabular-nums text-sm">
                      {item.quantity}
                    </td>
                    <td className="p-3 text-left font-medium tabular-nums text-stone-600">
                      {formatIQD(item.price)}
                    </td>
                    <td className="p-3 text-left font-bold tabular-nums text-stone-900 text-sm">
                      {formatIQD(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals & Delivery breakdown */}
          <div className="flex justify-end pt-2">
            <div className="w-full sm:w-72 space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>المجموع الفرعي:</span>
                <span className="font-bold tabular-nums">{formatIQD(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>أجور التوصيل ({order.deliveryOptionTitle}):</span>
                <span className="font-bold tabular-nums">{formatIQD(order.deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-stone-900 pt-2 border-t-2 border-stone-900">
                <span>المبلغ الكلي المستحق:</span>
                <span className="tabular-nums" style={{ color: 'var(--primary-color, #1e3a2b)' }}>
                  {formatIQD(order.total)}
                </span>
              </div>
              <div className="text-[11px] text-stone-500 text-left pt-1">
                طريقة الدفع: <strong>الدفع نقداً عند الاستلام (COD)</strong>
              </div>
            </div>
          </div>

          {/* Invoice Footer Seal & Notes */}
          <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 text-center sm:text-right">
            <div>
              <p className="font-bold text-stone-800">شكراً لاختياركم "ذكرى للطباعة"!</p>
              <p>نحرص على مطابقة التصاميم وجودة الألوان بنسبة 100%. للتواصل والاستفسار: {storeSettings.phone}</p>
            </div>
            
            {/* Visual seal stamp */}
            <div className="border-2 border-dashed border-amber-600/40 text-amber-800 font-serif px-4 py-2 rounded-xl text-center rotate-[-2deg]">
              <div className="text-[10px] uppercase font-bold tracking-widest">ذكرى للطباعة</div>
              <div className="text-xs font-black">معتمد وموثق</div>
            </div>
          </div>

        </div>

        {/* Modal Bottom Action Bar (Hidden on print) */}
        <div className="no-print p-4 border-t border-stone-100 bg-stone-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-stone-600 hover:text-stone-900 transition-colors"
          >
            إغلاق
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-stone-900 hover:bg-stone-800 text-white flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة أو حفظ كملف PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
