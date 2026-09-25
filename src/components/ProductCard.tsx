import React, { useState } from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { Heart, ShoppingBag, Eye, Check } from 'lucide-react';
import { formatIQD } from '../utils/formatters';

interface ProductCardProps {
  product: Product;
  onOpenDetail: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenDetail }) => {
  const { addToCart, toggleFavorite, isFavorite, categories } = useStore();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);

  const favorited = isFavorite(product.id);
  const category = categories.find(c => c.id === product.categoryId);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1400);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(product.id);
  };

  const images = product.images.length > 0
    ? product.images
    : ['/src/assets/images/hero_printing_store_1790334111184.jpg'];

  const currentImage = images[activeImageIndex] || images[0];

  return (
    <article
      onClick={() => onOpenDetail(product)}
      className="group relative bg-white rounded-2xl border border-stone-200/80 shadow-2xs hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Visual / Image Showcase */}
      <div className="relative aspect-4/3 sm:aspect-square bg-stone-100 overflow-hidden">
        <img
          src={currentImage}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = '/src/assets/images/hero_printing_store_1790334111184.jpg';
          }}
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 right-3 flex flex-col gap-1 items-end pointer-events-none">
          {product.isDiscount && (
            <span className="bg-amber-500 text-stone-950 text-xs font-bold px-2 py-0.5 rounded shadow-xs">
              {product.discountLabel || 'خصم'}
            </span>
          )}
          {product.isFeatured && (
            <span className="bg-stone-900 text-amber-300 text-[11px] font-semibold px-2 py-0.5 rounded shadow-xs">
              مميز
            </span>
          )}
        </div>

        {/* Favorite Button (Top Left in RTL) */}
        <button
          onClick={handleToggleFavorite}
          aria-label={favorited ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
          className={`absolute top-3 left-3 p-2 rounded-xl backdrop-blur-md transition-all shadow-xs ${
            favorited
              ? 'bg-rose-50 text-rose-600'
              : 'bg-white/80 text-stone-600 hover:text-stone-900 hover:bg-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${favorited ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Multiple image dots preview if available */}
        {images.length > 1 && (
          <div
            className="absolute bottom-2.5 inset-x-0 flex justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIndex(idx);
                }}
                className={`h-1.5 rounded-full transition-all ${
                  idx === activeImageIndex ? 'w-4 bg-white shadow-xs' : 'w-1.5 bg-white/60'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between text-right space-y-3">
        <div>
          {/* Category kicker */}
          <div className="text-[12px] font-medium text-stone-500 mb-1">
            {category?.name || 'طباعة مخصصة'}
          </div>

          {/* Product Name */}
          <h3 className="font-bold text-stone-900 text-base leading-snug line-clamp-2 group-hover:text-stone-700 transition-colors">
            {product.name}
          </h3>

          {/* Product Description */}
          <p className="text-stone-500 text-xs line-clamp-2 mt-1.5 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
          {/* Price with Tabular Numerals */}
          <div className="text-right">
            <div className="font-extrabold text-stone-900 text-base tracking-tight tabular-nums" style={{ color: 'var(--primary-color, #1e3a2b)' }}>
              {formatIQD(product.price)}
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-stone-400 line-through tabular-nums block -mt-0.5">
                {formatIQD(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : 'text-white hover:opacity-95 active:scale-95'
            }`}
            style={{ backgroundColor: isAdded ? undefined : 'var(--btn-color, #1e3a2b)' }}
            title="إضافة إلى سلة الشراء"
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>تمت الإضافة</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>أضف للسلة</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};
