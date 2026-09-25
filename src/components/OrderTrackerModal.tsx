import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Order, OrderStatus } from '../types';
import {
  X,
  Search,
  Truck,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  ChevronLeft,
  PackageCheck
} from 'lucide-react';
import { formatIQD, formatArabicDate } from '../utils/formatters';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewInvoice: (order: Order) => void;
  onOpenChatWithOrder: (order: Order) => void;
  initialOrderNumber?: string;
}

const ORDER_STEPS: OrderStatus[] = [
  'طلب جديد',
  'قيد المراجعة',
  'تم قبول الطلب',
  'قيد التجهيز',
  'جاهز',
  'تم الشحن',
  'تم التسليم',
  'مكتمل'
];

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  isOpen,
  onClose,
  onViewInvoice,
  onOpenChatWithOrder,
  initialOrderNumber
}) => {
  const { orders } = useStore();
  const [searchQuery, setSearchQuery] = useState(initialOrderNumber || '');
  const [foundOrder, setFoundOrder] = useState<Order | null>(() => {
    if (initialOrderNumber) {
      return orders.find(o => o.orderNumber.toUpperCase() === initialOrderNumber.toUpperCase()) || null;
    }
    return null;
  });
  const [hasSearched, setHasSearched] = useState(!!initialOrderNumber);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const trimmed = searchQuery.trim().toUpperCase();
    const order = orders.find(
      o => o.orderNumber.toUpperCase() === trimmed || o.phone.includes(trimmed)
    );

    setFoundOrder(order || null);
    setHasSearched(true);
  };

  const getStepStatus = (step: OrderStatus, currentStatus: OrderStatus) => {
    if (currentStatus === 'ملغي' || currentStatus === 'مرفوض') {
      return 'neutral';
    }
    const currentIndex = ORDER_STEPS.indexOf(currentStatus);
    const stepIndex = ORDER_STEPS.indexOf(step);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-stone-950/60 backdrop-blur-xs overflow-y-auto">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto border border-stone-200 text-right"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-stone-800" />
            <h2 className="text-base font-bold text-stone-900">تتبع حالة الطلب والشحنة</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Search Box */}
          <form onSubmit={handleSearch} className="space-y-2">
            <label className="block text-xs font-semibold text-stone-700">
              أدخل رقم الطلب (مثال: ZKR-9041) أو رقم هاتف المستلم:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="رقم الطلب (ZKR-XXXX) أو رقم الهاتف..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:border-stone-500 focus:outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl font-bold text-xs text-white shadow-xs transition-opacity hover:opacity-90 flex items-center gap-1.5 shrink-0"
                style={{ backgroundColor: 'var(--btn-color, #1e3a2b)' }}
              >
                <Search className="w-4 h-4" />
                <span>بحث</span>
              </button>
            </div>
          </form>

          {/* Search Result */}
          {hasSearched && (
            <div>
              {foundOrder ? (
                <div className="space-y-6 animate-in fade-in duration-200">
                  
                  {/* Order Overview Banner */}
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-lg text-stone-900">
                          {foundOrder.orderNumber}
                        </span>
                        <span className="text-xs px-2.5 py-0.5 rounded-md font-bold bg-amber-500 text-stone-950">
                          {foundOrder.status}
                        </span>
                      </div>
                      <div className="text-xs text-stone-500 mt-1">
                        العميل: <strong>{foundOrder.customerName}</strong> · تاريخ الطلب: {formatArabicDate(foundOrder.createdAt)}
                      </div>
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => onViewInvoice(foundOrder)}
                        className="flex-1 sm:flex-initial px-3.5 py-2 text-xs font-bold bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 rounded-xl flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
                      >
                        <FileText className="w-4 h-4 text-stone-600" />
                        <span>عرض الفاتورة</span>
                      </button>
                      <button
                        onClick={() => onOpenChatWithOrder(foundOrder)}
                        className="flex-1 sm:flex-initial px-3.5 py-2 text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
                      >
                        <MessageCircle className="w-4 h-4 text-emerald-700" />
                        <span>مراسلة المتجر</span>
                      </button>
                    </div>
                  </div>

                  {/* Status Pipeline Visualizer */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                      مراحل تجهيز وشحن الطلب
                    </h3>

                    {/* Step Bar */}
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 py-2">
                      {ORDER_STEPS.map((step, idx) => {
                        const state = getStepStatus(step, foundOrder.status);
                        return (
                          <div
                            key={idx}
                            className={`p-2 rounded-xl text-center transition-all ${
                              state === 'completed'
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-semibold'
                                : state === 'current'
                                ? 'bg-amber-400 text-stone-950 font-bold ring-2 ring-amber-300 shadow-xs'
                                : 'bg-stone-100 text-stone-400'
                            }`}
                          >
                            <div className="text-[10px] sm:text-xs leading-tight">{step}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Status Timeline History */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                      سجل التحديثات الزمني
                    </h3>

                    <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                      {foundOrder.statusHistory.map((hist, i) => (
                        <div key={i} className="flex gap-3 text-xs p-2.5 bg-stone-50 rounded-xl border border-stone-100">
                          <div className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-stone-900">{hist.status}</span>
                              <span className="text-stone-400 text-[11px]">{formatArabicDate(hist.timestamp)}</span>
                            </div>
                            {hist.note && (
                              <p className="text-stone-600 text-xs mt-0.5">{hist.note}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Ordered Items Preview */}
                  <div className="space-y-2 pt-2 border-t border-stone-200">
                    <div className="flex justify-between items-center text-xs font-bold text-stone-700">
                      <span>المنتجات المشمولة في هذا الطلب:</span>
                      <span className="text-stone-900 tabular-nums">
                        المجموع الكلي: {formatIQD(foundOrder.total)}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {foundOrder.items.map((it, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs p-2 bg-stone-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <img src={it.image} alt="" className="w-8 h-8 rounded object-cover" />
                            <span>{it.productName} (×{it.quantity})</span>
                          </div>
                          <span className="font-bold tabular-nums">{formatIQD(it.price * it.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              ) : (
                <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                  <AlertCircle className="w-8 h-8 text-amber-600 mx-auto" />
                  <h4 className="font-bold text-stone-800 text-sm">لم يتم العثور على طلب مطابق</h4>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    يرجى التأكد من كتابة رقم الطلب بصيغة (ZKR-XXXX) أو رقم الهاتف المستخدم عند تثبيت الطلب.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Quick links to recent orders from this device */}
          {!hasSearched && orders.length > 0 && (
            <div className="space-y-2 pt-2">
              <span className="text-xs font-semibold text-stone-500">آخر طلبات تم تسجيلها:</span>
              <div className="space-y-1.5">
                {orders.slice(0, 3).map((ord) => (
                  <button
                    key={ord.id}
                    onClick={() => {
                      setSearchQuery(ord.orderNumber);
                      setFoundOrder(ord);
                      setHasSearched(true);
                    }}
                    className="w-full p-2.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 flex items-center justify-between text-xs transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold">{ord.orderNumber}</span>
                      <span className="text-stone-500">{ord.customerName}</span>
                    </div>
                    <span className="font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                      {ord.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
