import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { StoreLogo } from './StoreLogo';
import {
  ShoppingBag,
  Heart,
  Search,
  MessageCircle,
  Truck,
  ShieldCheck,
  Menu,
  X,
  Sparkles,
  UserCheck
} from 'lucide-react';
import { formatIQD } from '../utils/formatters';

interface NavbarProps {
  onOpenCart: () => void;
  onOpenFavorites: () => void;
  onOpenTracker: () => void;
  onOpenChat: () => void;
  onOpenAdmin: () => void;
  onSelectCategory?: (catId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeView: 'store' | 'admin';
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCart,
  onOpenFavorites,
  onOpenTracker,
  onOpenChat,
  onOpenAdmin,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  activeView
}) => {
  const { cart, favorites, conversations, customerConversationId, storeSettings, isAdminLoggedIn, cartSubtotal } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Find customer unread messages
  const customerConv = conversations.find(c => c.id === customerConversationId);
  const customerUnreadCount = customerConv?.unreadCustomerCount || 0;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20 gap-2 md:gap-6">
          
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onSearchChange('');
                onSelectCategory?.('all');
              }}
              className="text-right group flex items-center gap-2.5 focus:outline-none"
            >
              <div className="w-11 h-11 rounded-2xl bg-white border border-stone-200 p-1 flex items-center justify-center shadow-xs transition-transform group-hover:scale-105 overflow-hidden">
                <StoreLogo customUrl={storeSettings.logoUrl} className="w-full h-full" />
              </div>
              <div>
                <span className="block text-xl md:text-2xl font-bold tracking-tight text-stone-900 group-hover:text-stone-700 transition-colors">
                  {storeSettings.storeName}
                </span>
                <span className="block text-[11px] text-stone-500 font-medium -mt-1 hidden sm:block">
                  {storeSettings.storeTagline}
                </span>
              </div>
            </button>
          </div>

          {/* Search bar (Desktop) */}
          <div className="hidden lg:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="ابحث عن منتج، كوب، إطار، وشاح، درع..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-4 pr-10 py-2 text-sm bg-stone-100 hover:bg-stone-50 focus:bg-white border border-stone-200 focus:border-stone-400 rounded-xl focus:outline-none transition-all placeholder:text-stone-400 text-stone-900"
              />
              <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs px-1"
                >
                  مسح
                </button>
              )}
            </div>
          </div>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-700">
            <button
              onClick={() => onSelectCategory?.('all')}
              className="hover:text-stone-950 transition-colors whitespace-nowrap"
            >
              جميع المنتجات
            </button>
            <button
              onClick={() => onSelectCategory?.('discounts')}
              className="text-amber-700 hover:text-amber-800 transition-colors whitespace-nowrap font-semibold flex items-center gap-1"
            >
              <span>العروض والخصومات</span>
            </button>
            <button
              onClick={onOpenTracker}
              className="hover:text-stone-950 transition-colors whitespace-nowrap flex items-center gap-1.5"
            >
              <Truck className="w-4 h-4 text-stone-500" />
              <span>تتبع الطلب</span>
            </button>
          </nav>

          {/* Zone 3: Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search toggle for mobile */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="البحث"
              className="lg:hidden p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Direct Chat with Store */}
            <button
              onClick={onOpenChat}
              aria-label="مراسلة المتجر"
              className="relative p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors"
              title="مراسلة المتجر والاستفسار"
            >
              <MessageCircle className="w-5 h-5" />
              {customerUnreadCount > 0 && (
                <span className="absolute 1 top-1 right-1 w-4 h-4 bg-emerald-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {customerUnreadCount}
                </span>
              )}
            </button>

            {/* Favorites Toggle */}
            <button
              onClick={onOpenFavorites}
              aria-label="المفضلة"
              className="relative p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors"
              title="المنتجات المفضلة"
            >
              <Heart className={`w-5 h-5 ${favorites.length > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
              {favorites.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-white font-medium text-sm transition-all hover:opacity-95 active:scale-95 shadow-xs"
              style={{ backgroundColor: 'var(--btn-color, #1e3a2b)' }}
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-amber-400 text-stone-950 text-[10px] font-bold rounded-full flex items-center justify-center">
                    {totalCartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-semibold">
                {totalCartCount > 0 ? formatIQD(cartSubtotal) : 'السلة'}
              </span>
            </button>

            {/* Admin Portal Toggle */}
            <button
              onClick={onOpenAdmin}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                activeView === 'admin'
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
              title={isAdminLoggedIn ? 'لوحة التحكم الإدارية' : 'تسجيل دخول الإدارة'}
            >
              {isAdminLoggedIn ? (
                <>
                  <UserCheck className="w-4 h-4 text-emerald-700" />
                  <span className="hidden xl:inline text-emerald-800">لوحة الإدارة</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-stone-500" />
                  <span className="hidden xl:inline">الإدارة</span>
                </>
              )}
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-600 hover:text-stone-900 rounded-xl"
              aria-label="القائمة الرئيسية"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search input bar if toggled */}
        {searchOpen && (
          <div className="lg:hidden pb-3 pt-1">
            <div className="relative">
              <input
                type="text"
                placeholder="ابحث عن منتج، كوب، إطار، وشاح..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                autoFocus
                className="w-full pl-4 pr-10 py-2 text-sm bg-stone-100 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-400 text-stone-900"
              />
              <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        )}

        {/* Mobile Dropdown Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-stone-100 flex flex-col gap-2">
            <button
              onClick={() => {
                onSelectCategory?.('all');
                setMobileMenuOpen(false);
              }}
              className="text-right px-3 py-2 rounded-lg text-stone-800 hover:bg-stone-100 font-medium text-sm"
            >
              جميع المنتجات
            </button>
            <button
              onClick={() => {
                onSelectCategory?.('discounts');
                setMobileMenuOpen(false);
              }}
              className="text-right px-3 py-2 rounded-lg text-amber-700 hover:bg-amber-50 font-semibold text-sm"
            >
              العروض والخصومات الخاصة
            </button>
            <button
              onClick={() => {
                onOpenTracker();
                setMobileMenuOpen(false);
              }}
              className="text-right px-3 py-2 rounded-lg text-stone-800 hover:bg-stone-100 font-medium text-sm flex items-center justify-between"
            >
              <span>تتبع حالة الطلب</span>
              <Truck className="w-4 h-4 text-stone-500" />
            </button>
            <button
              onClick={() => {
                onOpenChat();
                setMobileMenuOpen(false);
              }}
              className="text-right px-3 py-2 rounded-lg text-stone-800 hover:bg-stone-100 font-medium text-sm flex items-center justify-between"
            >
              <span>محادثة واستفسار المتجر</span>
              <MessageCircle className="w-4 h-4 text-stone-500" />
            </button>
            <button
              onClick={() => {
                onOpenAdmin();
                setMobileMenuOpen(false);
              }}
              className="text-right px-3 py-2 rounded-lg text-stone-800 hover:bg-stone-100 font-medium text-sm flex items-center justify-between"
            >
              <span>{isAdminLoggedIn ? 'لوحة تحكم المتجر' : 'دخول المشرف / الإدارة'}</span>
              <ShieldCheck className="w-4 h-4 text-stone-500" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
