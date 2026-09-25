import React, { useState } from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import {
  X,
  Heart,
  ShoppingBag,
  MessageCircle,
  Truck,
  ShieldCheck,
  Check,
  Plus,
  Minus,
  Share2,
  Sparkles
} from 'lucide-react';
import { formatIQD } from '../utils/formatters';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onOpenChatWithProduct: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onOpenChatWithProduct
}) => {
  const { addToCart, toggleFavorite, isFavorite, categories } = useStore();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [customNote, setCustomNote] = useState('');
  const [isAdded, setIsAdded] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!product) return null;

  const favorited = isFavorite(product.id);
  const category = categories.find(c => c.id === product.categoryId);

  const images = product.images.length > 0
    ? product.images
    : ['/src/assets/images/hero_printing_store_1790334111184.jpg'];

  const currentImage = images[selectedImageIndex] || images[0];

  const handleAddToCart = () => {
    addToCart(product, quantity, customNote.trim() || undefined);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `شاهد هذا المنتج المميز من ذكرى للطباعة: ${product.name}`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-stone-950/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50/50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-stone-500">
              {category?.name || 'تفاصيل المنتج'}
            </span>
            <span className="text-stone-300">·</span>
            <span className="text-xs text-stone-500 font-mono">ID: {product.id}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              aria-label="مشاركة المنتج"
              className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 rounded-xl transition-colors text-xs flex items-center gap-1"
              title="مشاركة الرابط"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">{copiedLink ? 'تم النسخ!' : 'مشاركة'}</span>
            </button>
            <button
              onClick={onClose}
              aria-label="إغلاق النافذة"
              className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Right Column in RTL: Multi-Image Gallery */}
          <div className="md:col-span-6 space-y-4">
            {/* Main Featured Image Container */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-stone-100 border border-stone-200/70 shadow-xs">
              <img
                src={currentImage}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-300"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = '/src/assets/images/hero_printing_store_1790334111184.jpg';
                }}
              />

              {/* Badges */}
              <div className="absolute top-4 right-4 flex flex-col gap-1.5 items-end">
                {product.isDiscount && (
                  <span className="bg-amber-500 text-stone-950 text-xs font-bold px-2.5 py-1 rounded shadow-xs">
                    {product.discountLabel || 'خصم خاص'}
                  </span>
                )}
                {product.isFeatured && (
                  <span className="bg-stone-900 text-amber-300 text-xs font-semibold px-2.5 py-1 rounded shadow-xs">
                    منتج مميز
                  </span>
                )}
              </div>

              {/* Favorite Button */}
              <button
                onClick={() => toggleFavorite(product.id)}
                className={`absolute top-4 left-4 p-2.5 rounded-xl backdrop-blur-md transition-all shadow-xs ${
                  favorited
                    ? 'bg-rose-50 text-rose-600'
                    : 'bg-white/80 text-stone-700 hover:bg-white'
                }`}
                title="إضافة إلى المفضلة"
              >
                <Heart className={`w-5 h-5 ${favorited ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </div>

            {/* Thumbnail selector */}
            {images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      idx === selectedImageIndex
                        ? 'border-amber-500 ring-2 ring-amber-200'
                        : 'border-stone-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Description below image section */}
            <div className="pt-2 text-right">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                تفاصيل ومواصفات الطباعة
              </h4>
              <p className="text-stone-600 text-sm leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

          </div>

          {/* Left Column in RTL: Purchase & Customization Controls */}
          <div className="md:col-span-6 space-y-6 text-right">
            
            {/* Title & Price */}
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 leading-snug">
                {product.name}
              </h2>

              <div className="mt-3 flex items-baseline gap-3">
                <span
                  className="text-2xl sm:text-3xl font-extrabold tabular-nums tracking-tight"
                  style={{ color: 'var(--primary-color, #1e3a2b)' }}
                >
                  {formatIQD(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-base text-stone-400 line-through tabular-nums">
                    {formatIQD(product.originalPrice)}
                  </span>
                )}
                <span className="text-xs text-stone-500 font-medium">
                  (شامل ضريبة الإنتاج + الطباعة الحرارية)
                </span>
              </div>
            </div>

            {/* Specifications List */}
            {product.specifications && product.specifications.length > 0 && (
              <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200/80 space-y-1.5 text-xs">
                {product.specifications.map((spec, i) => (
                  <div key={i} className="flex justify-between items-center py-1 border-b border-stone-200/50 last:border-0">
                    <span className="text-stone-500">{spec.label}:</span>
                    <span className="font-semibold text-stone-800">{spec.value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Personalization Note Input */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-700">
                طلب تخصيص (الاسم، العبارة، أو ملاحظات التصميم المراد طباعته):
              </label>
              <textarea
                rows={2}
                placeholder="مثال: يرجى كتابة اسم (أحمد الكعبي) بخط الثلث مع تاريخ 2026..."
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                className="w-full p-3 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:border-stone-500 focus:outline-none transition-colors"
              />
              <p className="text-[11px] text-stone-500">
                * يمكنك أيضاً إرسال صورك أو المخطوطة مباشرة عبر دردشة المتجر مع المشرف.
              </p>
            </div>

            {/* Quantity Selector & Add to Cart */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-stone-700">الكمية:</span>
                <div className="flex items-center border border-stone-300 rounded-xl overflow-hidden bg-stone-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-stone-600 hover:bg-stone-200 transition-colors"
                    aria-label="تقليل الكمية"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-1 text-sm font-bold tabular-nums min-w-[2.5rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 text-stone-600 hover:bg-stone-200 transition-colors"
                    aria-label="زيادة الكمية"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-xs text-stone-500 mr-auto font-medium">
                  الإجمالي: <strong className="text-stone-900">{formatIQD(product.price * quantity)}</strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`flex-1 py-3 px-6 rounded-xl font-bold text-sm text-white shadow-md transition-all flex items-center justify-center gap-2 ${
                    isAdded ? 'bg-emerald-600' : 'hover:opacity-95 active:scale-98'
                  }`}
                  style={{ backgroundColor: isAdded ? undefined : 'var(--btn-color, #1e3a2b)' }}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>تمت الإضافة إلى سلة الشراء!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>إضافة إلى سلة الشراء ({formatIQD(product.price * quantity)})</span>
                    </>
                  )}
                </button>

                {/* Direct Chat regarding this product */}
                <button
                  onClick={() => {
                    onOpenChatWithProduct(product);
                    onClose();
                  }}
                  className="py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors flex items-center justify-center gap-2 border border-stone-200"
                  title="استفسر عن المنتج وأرسل تصميمك"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-700" />
                  <span>مراسلة المتجر حول هذا المنتج</span>
                </button>
              </div>
            </div>

            {/* Delivery & Payment Guarantee Box */}
            <div className="pt-4 border-t border-stone-100 grid grid-cols-2 gap-3 text-right">
              <div className="flex items-start gap-2 text-xs text-stone-600">
                <Truck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-stone-800">توصيل سريع</strong>
                  <span>بغداد 24-48 ساعة، المحافظات 2-4 أيام</span>
                </div>
              </div>
              <div className="flex items-start gap-2 text-xs text-stone-600">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-stone-800">الدفع عند الاستلام</strong>
                  <span>عاين وفحص الطلب قبل الدفع للمندوب</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
