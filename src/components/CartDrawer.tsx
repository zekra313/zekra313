import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowLeft,
  Truck,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { formatIQD } from '../utils/formatters';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout: () => void;
  onOpenChat: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onProceedToCheckout,
  onOpenChat
}) => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    cartTotal,
    deliverySettings,
    selectedDelivery,
    setSelectedDeliveryId,
    clearCart
  } = useStore();

  if (!isOpen) return null;

  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-950/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-r border-stone-200">
          
          {/* Header */}
          <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/60">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-stone-800" />
              <h2 className="text-base font-bold text-stone-900">سلة المشتريات</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-stone-200 text-stone-700">
                {totalItemsCount} عناصر
              </span>
            </div>

            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-stone-400 hover:text-rose-600 transition-colors px-2 py-1"
                >
                  تفريغ السلة
                </button>
              )}
              <button
                onClick={onClose}
                aria-label="إغلاق السلة"
                className="p-2 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-stone-800">سلة المشتريات فارغة</h3>
                  <p className="text-xs text-stone-500 max-w-xs">
                    لم تقم بإضافة أي هدايا أو منتجات بعد. استكشف تشكيلة ذكرى للطباعة الآن!
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl font-bold text-xs text-white shadow-xs transition-opacity hover:opacity-90"
                  style={{ backgroundColor: 'var(--btn-color, #1e3a2b)' }}
                >
                  ابدأ التسوق الآن
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80 flex gap-3 text-right"
                  >
                    {/* Thumbnail */}
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-white shrink-0 border border-stone-200">
                      <img
                        src={item.product.images[0] || '/src/assets/images/hero_printing_store_1790334111184.jpg'}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info & Quantity */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-1">
                          <h4 className="text-xs font-bold text-stone-900 leading-snug line-clamp-1">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-stone-400 hover:text-rose-600 p-1"
                            title="حذف من السلة"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {item.customNote && (
                          <div className="text-[11px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded mt-1 line-clamp-1">
                            طباعة: {item.customNote}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-stone-200/60">
                        {/* Stepper */}
                        <div className="flex items-center border border-stone-300 rounded-lg bg-white overflow-hidden">
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            className="p-1 text-stone-500 hover:bg-stone-100"
                            aria-label="تقليل"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 py-0.5 text-xs font-bold tabular-nums min-w-[1.75rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            className="p-1 text-stone-500 hover:bg-stone-100"
                            aria-label="زيادة"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price */}
                        <span className="text-xs font-bold text-stone-900 tabular-nums">
                          {formatIQD(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer & Delivery Fee Selection */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-stone-200 bg-stone-50/80 space-y-4">
              
              {/* Delivery Zone Selector (Configurable by admin) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-emerald-700" />
                    <span>اختر منطقة التوصيل:</span>
                  </span>
                  <span className="text-stone-400 font-normal">دفع عند الاستلام</span>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {deliverySettings
                    .filter(d => d.isActive)
                    .map((opt) => (
                      <label
                        key={opt.id}
                        className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                          selectedDelivery?.id === opt.id
                            ? 'bg-white border-stone-900 shadow-2xs font-semibold'
                            : 'bg-stone-100/70 border-stone-200 text-stone-600 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="delivery_zone"
                            value={opt.id}
                            checked={selectedDelivery?.id === opt.id}
                            onChange={() => setSelectedDeliveryId(opt.id)}
                            className="accent-stone-900"
                          />
                          <div>
                            <div className="text-stone-900">{opt.title}</div>
                            <div className="text-[10px] text-stone-400">{opt.estimatedDays}</div>
                          </div>
                        </div>
                        <span className="font-bold tabular-nums text-stone-900">
                          {formatIQD(opt.price)}
                        </span>
                      </label>
                    ))}
                </div>
              </div>

              {/* Price Calculation Summary */}
              <div className="space-y-1.5 pt-2 border-t border-stone-200 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>مجموع المنتجات:</span>
                  <span className="font-semibold tabular-nums">{formatIQD(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>أجور التوصيل ({selectedDelivery?.title || 'التوصيل'}):</span>
                  <span className="font-semibold tabular-nums">
                    {selectedDelivery ? formatIQD(selectedDelivery.price) : '0 د.ع'}
                  </span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-stone-900 pt-1 border-t border-stone-200">
                  <span>المبلغ الإجمالي النهائي:</span>
                  <span className="tabular-nums" style={{ color: 'var(--primary-color, #1e3a2b)' }}>
                    {formatIQD(cartTotal)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => {
                    onProceedToCheckout();
                    onClose();
                  }}
                  className="w-full py-3 rounded-xl font-bold text-sm text-white shadow-md transition-all flex items-center justify-center gap-2 hover:opacity-95 active:scale-98"
                  style={{ backgroundColor: 'var(--btn-color, #1e3a2b)' }}
                >
                  <span>متابعة إتمام الطلب</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    onOpenChat();
                    onClose();
                  }}
                  className="w-full py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors text-center"
                >
                  لديك استفسار قبل تثبيت الطلب؟ راسل المتجر
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
