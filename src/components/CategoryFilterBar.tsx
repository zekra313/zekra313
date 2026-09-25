import React, { useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { ChevronRight, ChevronLeft, Sparkles, Layers } from 'lucide-react';

interface CategoryFilterBarProps {
  selectedCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
}

export const CategoryFilterBar: React.FC<CategoryFilterBarProps> = ({
  selectedCategoryId,
  onSelectCategory
}) => {
  const { categories, products } = useStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const activeCategories = categories
    .filter(c => c.isActive)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  const discountCount = products.filter(p => p.isActive && p.isDiscount).length;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -250 : 250;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative py-4 bg-white/70 backdrop-blur-xs border-b border-stone-200 sticky top-16 md:top-20 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          
          {/* Scroll Right Button */}
          <button
            onClick={() => scroll('right')}
            aria-label="تمرير لليمين"
            className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors shrink-0"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Categories Horizontal Scrollable List */}
          <div
            ref={scrollContainerRef}
            className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 w-full"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* All Products Tab */}
            <button
              onClick={() => onSelectCategory('all')}
              className={`px-4 py-2 text-sm font-semibold rounded-xl whitespace-nowrap transition-all shrink-0 flex items-center gap-1.5 ${
                selectedCategoryId === 'all'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200/80 hover:text-stone-900'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>جميع الأقسام</span>
              <span className="text-xs opacity-70">({products.filter(p => p.isActive).length})</span>
            </button>

            {/* Discounts & Offers Tab */}
            <button
              onClick={() => onSelectCategory('discounts')}
              className={`px-4 py-2 text-sm font-semibold rounded-xl whitespace-nowrap transition-all shrink-0 flex items-center gap-1.5 ${
                selectedCategoryId === 'discounts'
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'bg-amber-50 text-amber-900 border border-amber-200/80 hover:bg-amber-100'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span>العروض والخصومات</span>
              {discountCount > 0 && (
                <span className="text-xs font-bold px-1.5 py-0.2 bg-amber-200 text-amber-900 rounded">
                  {discountCount}
                </span>
              )}
            </button>

            {/* Dynamic Categories */}
            {activeCategories.map((category) => {
              const catProductCount = products.filter(p => p.isActive && p.categoryId === category.id).length;
              const isSelected = selectedCategoryId === category.id;

              return (
                <button
                  key={category.id}
                  onClick={() => onSelectCategory(category.id)}
                  className={`px-4 py-2 text-sm font-medium rounded-xl whitespace-nowrap transition-all shrink-0 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-stone-900 text-white shadow-xs font-semibold'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200/80 hover:text-stone-900'
                  }`}
                >
                  <span>{category.name}</span>
                  <span className={`text-xs ${isSelected ? 'text-stone-300' : 'text-stone-400'}`}>
                    ({catProductCount})
                  </span>
                </button>
              );
            })}
          </div>

          {/* Scroll Left Button */}
          <button
            onClick={() => scroll('left')}
            aria-label="تمرير لليسار"
            className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors shrink-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

        </div>
      </div>
    </div>
  );
};
