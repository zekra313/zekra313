import React, { useState, useMemo } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { TopAnnouncementBanner } from './components/TopAnnouncementBanner';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CategoryFilterBar } from './components/CategoryFilterBar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { DigitalInvoiceModal } from './components/DigitalInvoiceModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { CustomerChatWidget } from './components/CustomerChatWidget';
import { PromotionalVideoSection } from './components/PromotionalVideoSection';
import { SocialMediaSection } from './components/SocialMediaSection';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLoginModal } from './components/AdminLoginModal';
import { FavoritesModal } from './components/FavoritesModal';
import { Product, Order } from './types';
import {
  Sparkles,
  ShoppingBag,
  MessageCircle,
  Truck,
  Heart,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { formatIQD } from './utils/formatters';

const StorefrontApp: React.FC = () => {
  const {
    products,
    categories,
    cart,
    favorites,
    cartSubtotal,
    isAdminLoggedIn,
    storeSettings
  } = useStore();

  // Navigation & View States
  const [activeView, setActiveView] = useState<'store' | 'admin'>('store');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'price-asc' | 'price-desc'>('featured');

  // Modal States
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [trackerInitialOrderNum, setTrackerInitialOrderNum] = useState<string | undefined>(undefined);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatAttachedProduct, setChatAttachedProduct] = useState<Product | null>(null);
  const [chatAttachedOrder, setChatAttachedOrder] = useState<Order | null>(null);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Active status
        if (!p.isActive) return false;

        // Category filter
        if (selectedCategoryId === 'discounts') {
          if (!p.isDiscount) return false;
        } else if (selectedCategoryId !== 'all') {
          if (p.categoryId !== selectedCategoryId) return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchesName = p.name.toLowerCase().includes(q);
          const matchesDesc = p.description.toLowerCase().includes(q);
          const cat = categories.find(c => c.id === p.categoryId);
          const matchesCat = cat?.name.toLowerCase().includes(q);
          if (!matchesName && !matchesDesc && !matchesCat) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'featured') {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return 0;
        }
        if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'price-asc') {
          return a.price - b.price;
        }
        if (sortBy === 'price-desc') {
          return b.price - a.price;
        }
        return 0;
      });
  }, [products, selectedCategoryId, searchQuery, sortBy, categories]);

  // Open Product Chat Helper
  const handleOpenChatWithProduct = (product: Product) => {
    setChatAttachedProduct(product);
    setIsChatOpen(true);
  };

  // Open Order Chat Helper
  const handleOpenChatWithOrder = (order: Order) => {
    setChatAttachedOrder(order);
    setIsChatOpen(true);
  };

  // Order Success Callback
  const handleOrderSuccess = (order: Order) => {
    setInvoiceOrder(order);
  };

  // Admin access handler
  const handleOpenAdminPortal = () => {
    if (isAdminLoggedIn) {
      setActiveView(activeView === 'admin' ? 'store' : 'admin');
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  // If Admin View is active, render Admin Dashboard
  if (activeView === 'admin' && isAdminLoggedIn) {
    return (
      <>
        <AdminDashboard
          onExitDashboard={() => setActiveView('store')}
          onViewInvoice={(ord) => setInvoiceOrder(ord)}
        />
        <DigitalInvoiceModal
          order={invoiceOrder}
          onClose={() => setInvoiceOrder(null)}
        />
      </>
    );
  }

  const selectedCategoryObj = categories.find(c => c.id === selectedCategoryId);
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9] text-stone-900 selection:bg-amber-100 selection:text-amber-900">
      
      {/* Top Banner (Admin Controlled) */}
      <TopAnnouncementBanner
        onBannerActionClick={() => {
          setSelectedCategoryId('discounts');
          window.scrollTo({ top: 400, behavior: 'smooth' });
        }}
      />

      {/* Main Navbar */}
      <Navbar
        onOpenCart={() => setIsCartOpen(true)}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onOpenTracker={() => setIsTrackerOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
        onOpenAdmin={handleOpenAdminPortal}
        onSelectCategory={(catId) => {
          setSelectedCategoryId(catId);
          window.scrollTo({ top: 400, behavior: 'smooth' });
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeView={activeView}
      />

      {/* Hero Section (only when no deep search) */}
      {!searchQuery && selectedCategoryId === 'all' && (
        <HeroSection
          onBrowseClick={() => {
            const el = document.getElementById('catalog-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          onSpecialOffersClick={() => {
            setSelectedCategoryId('discounts');
            const el = document.getElementById('catalog-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenChat={() => setIsChatOpen(true)}
        />
      )}

      {/* Categories Filter Bar */}
      <div id="catalog-section">
        <CategoryFilterBar
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={(id) => setSelectedCategoryId(id)}
        />
      </div>

      {/* Main Catalog Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6">
        
        {/* Section Header & Sort Options */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-200 pb-4 text-right">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
              {searchQuery ? (
                <span>نتائج البحث عن: "{searchQuery}"</span>
              ) : selectedCategoryId === 'discounts' ? (
                <span className="flex items-center gap-2 text-amber-900">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  <span>عروض وتخفيضات ذكرى الخاصة</span>
                </span>
              ) : selectedCategoryId === 'all' ? (
                <span>تشكيلة المنتجات والهدايا المخصصة</span>
              ) : (
                <span>قسم {selectedCategoryObj?.name || ''}</span>
              )}
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              عرض {filteredProducts.length} منتج متاح للتخصيص والطباعة الفورية
            </p>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-stone-500 font-semibold flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-stone-400" />
              <span>ترتيب حسب:</span>
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 bg-white border border-stone-300 rounded-xl focus:outline-none text-stone-800 font-semibold cursor-pointer shadow-2xs"
            >
              <option value="featured">المقترحة والأكثر طلباً</option>
              <option value="newest">أحدث المنتجات المضافة</option>
              <option value="price-asc">السعر: من الأقل للأعلى</option>
              <option value="price-desc">السعر: من الأعلى للأقل</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-stone-200 p-8 space-y-3">
            <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-stone-800">لا توجد منتجات مطابقة للبحث</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              جرب البحث بكلمات أخرى أو تصفح باقي الأقسام، أو راسلنا لتنفيذ طلبك الخاص.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategoryId('all');
              }}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white shadow-xs"
              style={{ backgroundColor: 'var(--btn-color, #1e3a2b)' }}
            >
              عرض جميع المنتجات
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenDetail={(prod) => setSelectedProductForDetail(prod)}
              />
            ))}
          </div>
        )}

      </main>

      {/* Promotional Video Section (Controlled by Admin) */}
      <PromotionalVideoSection />

      {/* Social Media Showcase (Controlled by Admin) */}
      <SocialMediaSection />

      {/* Footer */}
      <Footer
        onOpenTracker={() => setIsTrackerOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
        onOpenAdmin={handleOpenAdminPortal}
      />

      {/* Floating Action Button for Chat on Mobile / Desktop */}
      <button
        onClick={() => setIsChatOpen(true)}
        aria-label="تواصل مع المتجر"
        className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full text-white shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group"
        style={{ backgroundColor: 'var(--btn-color, #1e3a2b)' }}
        title="تواصل مباشر مع المتجر"
      >
        <MessageCircle className="w-6 h-6 text-amber-300" />
        <span className="hidden sm:inline text-xs font-bold pl-1">
          مراسلة المتجر
        </span>
      </button>

      {/* Sticky Mobile Buy/Cart Bar (conforming to 15% mobile sticky cap) */}
      {totalCartCount > 0 && (
        <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 p-2.5 px-4 flex items-center justify-between shadow-lg">
          <div>
            <span className="text-[11px] text-stone-500 block">السلة ({totalCartCount} عناصر)</span>
            <span className="font-extrabold text-sm text-stone-900 tabular-nums">
              {formatIQD(cartSubtotal)}
            </span>
          </div>

          <button
            onClick={() => setIsCartOpen(true)}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white shadow-md flex items-center gap-1.5"
            style={{ backgroundColor: 'var(--btn-color, #1e3a2b)' }}
          >
            <ShoppingBag className="w-4 h-4 text-amber-300" />
            <span>معاينة السلة وإتمام الطلب</span>
          </button>
        </div>
      )}

      {/* MODALS */}
      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProductForDetail}
        onClose={() => setSelectedProductForDetail(null)}
        onOpenChatWithProduct={handleOpenChatWithProduct}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={handleOrderSuccess}
        onOpenChat={() => setIsChatOpen(true)}
      />

      {/* Digital Invoice Modal */}
      <DigitalInvoiceModal
        order={invoiceOrder}
        onClose={() => setInvoiceOrder(null)}
      />

      {/* Order Tracker Modal */}
      <OrderTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => {
          setIsTrackerOpen(false);
          setTrackerInitialOrderNum(undefined);
        }}
        onViewInvoice={(ord) => setInvoiceOrder(ord)}
        onOpenChatWithOrder={handleOpenChatWithOrder}
        initialOrderNumber={trackerInitialOrderNum}
      />

      {/* Customer Chat Widget */}
      <CustomerChatWidget
        isOpen={isChatOpen}
        onClose={() => {
          setIsChatOpen(false);
          setChatAttachedProduct(null);
          setChatAttachedOrder(null);
        }}
        attachedProduct={chatAttachedProduct}
        attachedOrder={chatAttachedOrder}
        onClearAttachment={() => {
          setChatAttachedProduct(null);
          setChatAttachedOrder(null);
        }}
      />

      {/* Favorites Modal */}
      <FavoritesModal
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        onOpenProductDetail={(prod) => setSelectedProductForDetail(prod)}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={() => setActiveView('admin')}
      />

    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <StorefrontApp />
    </StoreProvider>
  );
}
