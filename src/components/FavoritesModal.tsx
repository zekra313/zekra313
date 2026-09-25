import React from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { X, Heart, ShoppingBag, Trash2, ArrowLeft } from 'lucide-react';
import { formatIQD } from '../utils/formatters';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenProductDetail: (product: Product) => void;
}

export const FavoritesModal: React.FC<FavoritesModalProps> = ({
  isOpen,
  onClose,
  onOpenProductDetail
}) => {
  const { favorites, toggleFavorite, products, addToCart } = useStore();

  if (!isOpen) return null;

  const favoriteProducts = products.filter(p => favorites.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/60 backdrop-blur-xs overflow-y-auto">
      <div
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto border border-stone-200 text-right"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h2 className="text-base font-bold text-stone-900">المنتجات المفضلة</h2>
            <span className="text-xs text-stone-500">({favoriteProducts.length} منتجات)</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
          {favoriteProducts.length === 0 ? (
            <div className="p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
                <Heart className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-stone-800">قائمة المفضلة فارغة</p>
              <p className="text-xs text-stone-500">
                يمكنك الضغط على علامة القلب على أي منتج أثناء التصفح لحفظه هنا والرجوع إليه لاحقاً.
              </p>
            </div>
          ) : (
            favoriteProducts.map((prod) => (
              <div
                key={prod.id}
                className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between gap-3 text-xs"
              >
                <div
                  className="flex items-center gap-3 cursor-pointer flex-1"
                  onClick={() => {
                    onOpenProductDetail(prod);
                    onClose();
                  }}
                >
                  <img
                    src={prod.images[0] || '/src/assets/images/hero_printing_store_1790334111184.jpg'}
                    alt=""
                    className="w-14 h-14 object-cover rounded-xl border border-stone-200 shrink-0"
                  />
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm line-clamp-1">{prod.name}</h4>
                    <span className="text-xs font-bold text-emerald-800 tabular-nums">
                      {formatIQD(prod.price)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      addToCart(prod, 1);
                    }}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold text-white shadow-2xs hover:opacity-90 flex items-center gap-1"
                    style={{ backgroundColor: 'var(--btn-color, #1e3a2b)' }}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">أضف للسلة</span>
                  </button>
                  <button
                    onClick={() => toggleFavorite(prod.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg"
                    title="إزالة من المفضلة"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-100 bg-stone-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-stone-900 text-white"
          >
            متابعة التسوق
          </button>
        </div>
      </div>
    </div>
  );
};
