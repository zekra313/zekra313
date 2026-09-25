import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Product,
  Category,
  Order,
  OrderStatus,
  Advertisement,
  PromotionalVideo,
  SocialLink,
  DeliverySetting
} from '../types';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  MessageCircle,
  Megaphone,
  Video,
  Share2,
  Truck,
  Palette,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  FileText,
  Send,
  Eye,
  Search,
  Sparkles,
  ArrowRight,
  Database,
  Copy,
  ExternalLink,
  Store,
  RefreshCw,
  Phone,
  MapPin,
  Clock
} from 'lucide-react';
import { formatIQD, formatArabicDate } from '../utils/formatters';
import { SUPABASE_SQL_SCHEMA, saveSupabaseConfig, getStoredSupabaseConfig } from '../lib/supabase';

interface AdminDashboardProps {
  onExitDashboard: () => void;
  onViewInvoice: (order: Order) => void;
}

type AdminTab =
  | 'overview'
  | 'products'
  | 'categories'
  | 'orders'
  | 'messages'
  | 'ads'
  | 'videos'
  | 'social'
  | 'delivery'
  | 'theme'
  | 'security';

const ALL_ORDER_STATUSES: OrderStatus[] = [
  'طلب جديد',
  'قيد المراجعة',
  'تم قبول الطلب',
  'قيد التجهيز',
  'جاهز',
  'تم الشحن',
  'تم التسليم',
  'مكتمل',
  'مرفوض',
  'ملغي'
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onExitDashboard,
  onViewInvoice
}) => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductActive,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    orders,
    updateOrderStatus,
    conversations,
    sendMessageAsAdmin,
    markConversationAsRead,
    advertisements,
    addAdvertisement,
    updateAdvertisement,
    deleteAdvertisement,
    promotionalVideos,
    addPromotionalVideo,
    updatePromotionalVideo,
    deletePromotionalVideo,
    socialLinks,
    addSocialLink,
    updateSocialLink,
    deleteSocialLink,
    deliverySettings,
    updateDeliverySetting,
    themeSettings,
    updateThemeSettings,
    resetThemeSettings,
    storeSettings,
    updateStoreSettings,
    adminUser,
    logoutAdmin,
    adminUsers,
    addAdminUser,
    deleteAdminUser,
    toggleAdminUserActive
  } = useStore();

  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<'admin' | 'editor'>('admin');
  const [adminNotice, setAdminNotice] = useState('');

  const [sitePassEnabled, setSitePassEnabled] = useState(
    storeSettings.siteProtection?.enabled || false
  );
  const [sitePassValue, setSitePassValue] = useState(
    storeSettings.siteProtection?.password || ''
  );
  const [sitePassHint, setSitePassHint] = useState(
    storeSettings.siteProtection?.hint || ''
  );
  const [sitePassSavedNotice, setSitePassSavedNotice] = useState(false);

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Product Management Modal States
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [prodFormName, setProdFormName] = useState('');
  const [prodFormCategory, setProdFormCategory] = useState(categories[0]?.id || '');
  const [prodFormPrice, setProdFormPrice] = useState(15000);
  const [prodFormOriginalPrice, setProdFormOriginalPrice] = useState<number | undefined>(undefined);
  const [prodFormIsDiscount, setProdFormIsDiscount] = useState(false);
  const [prodFormDiscountLabel, setProdFormDiscountLabel] = useState('خصم 20%');
  const [prodFormDescription, setProdFormDescription] = useState('');
  const [prodFormImages, setProdFormImages] = useState<string[]>(['']);
  const [prodFormIsFeatured, setProdFormIsFeatured] = useState(false);
  const [prodFormInStock, setProdFormInStock] = useState(true);

  // Category Management Modal States
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [catFormName, setCatFormName] = useState('');
  const [catFormDesc, setCatFormDesc] = useState('');

  // Orders Filter & Details
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);
  const [newStatusSelection, setNewStatusSelection] = useState<OrderStatus>('تم قبول الطلب');
  const [statusUpdateNote, setStatusUpdateNote] = useState('');

  // Messages Inbox State
  const [selectedConversationId, setSelectedConversationId] = useState<string>(
    conversations[0]?.id || ''
  );
  const [adminReplyText, setAdminReplyText] = useState('');

  // Advertisements Modal States
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [adTitle, setAdTitle] = useState('');
  const [adSubtitle, setAdSubtitle] = useState('');
  const [adImage, setAdImage] = useState('');
  const [adBtnText, setAdBtnText] = useState('');
  const [adBadge, setAdBadge] = useState('');

  // Promotional Video State
  const [isVidModalOpen, setIsVidModalOpen] = useState(false);
  const [vidTitle, setVidTitle] = useState('');
  const [vidDesc, setVidDesc] = useState('');
  const [vidUrl, setVidUrl] = useState('');

  // Social Links Modal State
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [socPlatform, setSocPlatform] = useState<SocialLink['platform']>('instagram');
  const [socName, setSocName] = useState('');
  const [socHandle, setSocHandle] = useState('');
  const [socUrl, setSocUrl] = useState('');

  // Supabase Config State
  const [supabaseUrl, setSupabaseUrl] = useState(getStoredSupabaseConfig().url);
  const [supabaseKey, setSupabaseKey] = useState(getStoredSupabaseConfig().key);
  const [copiedSql, setCopiedSql] = useState(false);
  const [savedSupabaseNotice, setSavedSupabaseNotice] = useState(false);

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    const matchesSearch =
      orderSearchQuery === '' ||
      o.orderNumber.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.phone.includes(orderSearchQuery);
    return matchesStatus && matchesSearch;
  });

  // Selected conversation
  const activeConversation = conversations.find(c => c.id === selectedConversationId) || conversations[0];

  // Overview stats calculation
  const totalRevenue = orders
    .filter(o => o.status !== 'ملغي' && o.status !== 'مرفوض')
    .reduce((sum, o) => sum + o.total, 0);
  const newOrdersCount = orders.filter(o => o.status === 'طلب جديد').length;
  const underReviewOrdersCount = orders.filter(o => o.status === 'قيد المراجعة').length;
  const completedOrdersCount = orders.filter(o => o.status === 'تم التسليم' || o.status === 'مكتمل').length;
  const uniqueCustomersCount = new Set(orders.map(o => o.phone)).size;

  // Handlers for Products
  const openAddProductModal = () => {
    setEditingProduct(null);
    setProdFormName('');
    setProdFormCategory(categories[0]?.id || '');
    setProdFormPrice(15000);
    setProdFormOriginalPrice(undefined);
    setProdFormIsDiscount(false);
    setProdFormDiscountLabel('خصم 20%');
    setProdFormDescription('');
    setProdFormImages(['/src/assets/images/hero_printing_store_1790334111184.jpg']);
    setProdFormIsFeatured(false);
    setProdFormInStock(true);
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (product: Product) => {
    setEditingProduct(product);
    setProdFormName(product.name);
    setProdFormCategory(product.categoryId);
    setProdFormPrice(product.price);
    setProdFormOriginalPrice(product.originalPrice);
    setProdFormIsDiscount(!!product.isDiscount);
    setProdFormDiscountLabel(product.discountLabel || '');
    setProdFormDescription(product.description);
    setProdFormImages(product.images.length > 0 ? product.images : ['']);
    setProdFormIsFeatured(!!product.isFeatured);
    setProdFormInStock(product.inStock);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanImages = prodFormImages.filter(img => img.trim() !== '');

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: prodFormName.trim(),
        categoryId: prodFormCategory,
        price: Number(prodFormPrice),
        originalPrice: prodFormOriginalPrice ? Number(prodFormOriginalPrice) : undefined,
        isDiscount: prodFormIsDiscount,
        discountLabel: prodFormIsDiscount ? prodFormDiscountLabel : undefined,
        description: prodFormDescription.trim(),
        images: cleanImages.length > 0 ? cleanImages : ['/src/assets/images/hero_printing_store_1790334111184.jpg'],
        isFeatured: prodFormIsFeatured,
        inStock: prodFormInStock
      });
    } else {
      addProduct({
        name: prodFormName.trim(),
        categoryId: prodFormCategory,
        price: Number(prodFormPrice),
        originalPrice: prodFormOriginalPrice ? Number(prodFormOriginalPrice) : undefined,
        isDiscount: prodFormIsDiscount,
        discountLabel: prodFormIsDiscount ? prodFormDiscountLabel : undefined,
        description: prodFormDescription.trim(),
        images: cleanImages.length > 0 ? cleanImages : ['/src/assets/images/hero_printing_store_1790334111184.jpg'],
        isFeatured: prodFormIsFeatured,
        isActive: true,
        inStock: prodFormInStock
      });
    }
    setIsProductModalOpen(false);
  };

  // Handlers for Categories
  const openAddCategoryModal = () => {
    setEditingCategory(null);
    setCatFormName('');
    setCatFormDesc('');
    setIsCategoryModalOpen(true);
  };

  const openEditCategoryModal = (cat: Category) => {
    setEditingCategory(cat);
    setCatFormName(cat.name);
    setCatFormDesc(cat.description || '');
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catFormName.trim()) return;

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name: catFormName.trim(),
        description: catFormDesc.trim() || undefined
      });
    } else {
      addCategory({
        name: catFormName.trim(),
        description: catFormDesc.trim() || undefined,
        displayOrder: categories.length + 1,
        isActive: true
      });
    }
    setIsCategoryModalOpen(false);
  };

  // Handlers for Orders
  const handleUpdateStatusSubmit = () => {
    if (!selectedOrderDetails) return;
    updateOrderStatus(selectedOrderDetails.id, newStatusSelection, statusUpdateNote.trim() || undefined);
    setStatusUpdateNote('');
    // refresh selected order details from updated state
    const updated = orders.find(o => o.id === selectedOrderDetails.id);
    if (updated) setSelectedOrderDetails({ ...updated, status: newStatusSelection });
  };

  // Handlers for Messages
  const handleAdminSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminReplyText.trim() || !activeConversation) return;

    sendMessageAsAdmin(activeConversation.id, adminReplyText.trim());
    setAdminReplyText('');
  };

  // Handlers for Ads
  const openAddAdModal = () => {
    setEditingAd(null);
    setAdTitle('');
    setAdSubtitle('');
    setAdImage('/src/assets/images/hero_printing_store_1790334111184.jpg');
    setAdBtnText('تصفح العرض');
    setAdBadge('عرض جديد');
    setIsAdModalOpen(true);
  };

  const handleSaveAd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adTitle.trim()) return;

    if (editingAd) {
      updateAdvertisement(editingAd.id, {
        title: adTitle.trim(),
        subtitle: adSubtitle.trim() || undefined,
        image: adImage.trim(),
        buttonText: adBtnText.trim() || undefined,
        badgeText: adBadge.trim() || undefined
      });
    } else {
      addAdvertisement({
        title: adTitle.trim(),
        subtitle: adSubtitle.trim() || undefined,
        image: adImage.trim(),
        buttonText: adBtnText.trim() || undefined,
        badgeText: adBadge.trim() || undefined,
        isActive: true,
        order: advertisements.length + 1
      });
    }
    setIsAdModalOpen(false);
  };

  // Copy Supabase SQL
  const handleCopySql = () => {
    navigator.clipboard?.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleSaveSupabase = () => {
    saveSupabaseConfig(supabaseUrl, supabaseKey);
    setSavedSupabaseNotice(true);
    setTimeout(() => setSavedSupabaseNotice(false), 3000);
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col text-right">
      
      {/* Admin Top Navigation Bar */}
      <header className="bg-stone-900 text-white border-b border-stone-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
              style={{ backgroundColor: 'var(--primary-color, #1e3a2b)' }}
            >
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <span className="font-extrabold text-base block text-white">
                لوحة تحكم المشرف · {storeSettings.storeName}
              </span>
              <span className="text-[11px] text-stone-400">
                {adminUser?.name || 'مدير المتجر'} ({adminUser?.email || 'admin@zekraprint.iq'})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onExitDashboard}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-colors flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>معاينة واجهة المتجر للزبائن</span>
            </button>
            <button
              onClick={() => {
                logoutAdmin();
                onExitDashboard();
              }}
              className="p-2 text-stone-400 hover:text-rose-400 rounded-xl hover:bg-stone-800 transition-colors"
              title="تسجيل الخروج"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Layout with Sidebar + Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Sidebar Navigation */}
        <aside className="lg:col-span-3 bg-white rounded-2xl border border-stone-200 p-3 shadow-xs space-y-1">
          <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider px-3 py-2">
            القائمة الرئيسية
          </div>

          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'overview'
                ? 'bg-stone-900 text-white'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LayoutDashboard className="w-4 h-4" />
              <span>نظرة عامة وإحصائيات</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'products'
                ? 'bg-stone-900 text-white'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Package className="w-4 h-4" />
              <span>إدارة المنتجات</span>
            </div>
            <span className="text-[11px] opacity-70">({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'categories'
                ? 'bg-stone-900 text-white'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Layers className="w-4 h-4" />
              <span>إدارة الأقسام</span>
            </div>
            <span className="text-[11px] opacity-70">({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'orders'
                ? 'bg-stone-900 text-white'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-4 h-4" />
              <span>إدارة الطلبات</span>
            </div>
            {newOrdersCount > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-400 text-stone-950">
                {newOrdersCount} جديد
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'messages'
                ? 'bg-stone-900 text-white'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <MessageCircle className="w-4 h-4" />
              <span>محادثات الزبائن</span>
            </div>
            <span className="text-[11px] opacity-70">({conversations.length})</span>
          </button>

          <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider px-3 pt-4 pb-2 border-t border-stone-100 mt-2">
            التسويق والمحتوى
          </div>

          <button
            onClick={() => setActiveTab('ads')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'ads'
                ? 'bg-stone-900 text-white'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Megaphone className="w-4 h-4" />
              <span>البانر والإعلانات</span>
            </div>
            <span className="text-[11px] opacity-70">({advertisements.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('videos')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'videos'
                ? 'bg-stone-900 text-white'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Video className="w-4 h-4" />
              <span>الفيديوهات الترويجية</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('social')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'social'
                ? 'bg-stone-900 text-white'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Share2 className="w-4 h-4" />
              <span>حسابات التواصل</span>
            </div>
          </button>

          <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider px-3 pt-4 pb-2 border-t border-stone-100 mt-2">
            إعدادات المتجر والتوصيل
          </div>

          <button
            onClick={() => setActiveTab('delivery')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'delivery'
                ? 'bg-stone-900 text-white'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4" />
              <span>أسعار التوصيل المخصصة</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('theme')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'theme'
                ? 'bg-stone-900 text-white'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Palette className="w-4 h-4" />
              <span>المظهر، الألوان وSupabase</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'security'
                ? 'bg-stone-900 text-white'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              <span>أمان المشرفين وخصوصية الرابط</span>
            </div>
            <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded-md font-bold">
              admin_users
            </span>
          </button>
        </aside>

        {/* Content Panel */}
        <main className="lg:col-span-9 space-y-6">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Top Metrics Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-1">
                  <span className="text-[11px] text-stone-500 font-bold">إجمالي مبيعات الطلبات</span>
                  <div className="text-lg sm:text-xl font-extrabold text-stone-900 tabular-nums">
                    {formatIQD(totalRevenue)}
                  </div>
                  <span className="text-[10px] text-emerald-700">باستثناء الملغي والمرفوض</span>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-1">
                  <span className="text-[11px] text-stone-500 font-bold">طلبات جديدة</span>
                  <div className="text-xl sm:text-2xl font-black text-amber-600 tabular-nums">
                    {newOrdersCount}
                  </div>
                  <span className="text-[10px] text-stone-400">بانتظار تأكيد المشرف</span>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-1">
                  <span className="text-[11px] text-stone-500 font-bold">طلبات قيد المراجعة</span>
                  <div className="text-xl sm:text-2xl font-black text-stone-800 tabular-nums">
                    {underReviewOrdersCount}
                  </div>
                  <span className="text-[10px] text-stone-400">تدقيق التصميم والطباعة</span>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-1">
                  <span className="text-[11px] text-stone-500 font-bold">إجمالي الزبائن</span>
                  <div className="text-xl sm:text-2xl font-black text-indigo-700 tabular-nums">
                    {uniqueCustomersCount}
                  </div>
                  <span className="text-[10px] text-stone-400">من أرقام الهواتف الفريدة</span>
                </div>
              </div>

              {/* Secondary Stats Row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-2xl border border-stone-200 text-xs flex justify-between items-center">
                  <span className="text-stone-600">إجمالي المنتجات المعروضة:</span>
                  <strong className="text-stone-900 font-bold text-sm">{products.length}</strong>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-stone-200 text-xs flex justify-between items-center">
                  <span className="text-stone-600">الأقسام النشطة:</span>
                  <strong className="text-stone-900 font-bold text-sm">{categories.length}</strong>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-stone-200 text-xs flex justify-between items-center col-span-2 sm:col-span-1">
                  <span className="text-stone-600">الطلبات المسلمة والمكتملة:</span>
                  <strong className="text-emerald-700 font-bold text-sm">{completedOrdersCount}</strong>
                </div>
              </div>

              {/* Recent Orders Overview Table */}
              <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs">
                <div className="p-4 border-b border-stone-100 flex items-center justify-between">
                  <h3 className="font-bold text-sm text-stone-900">أحدث طلبات الزبائن الواردة</h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-bold text-stone-600 hover:text-stone-900"
                  >
                    عرض كل الطلبات ({orders.length}) ←
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-right">
                    <thead className="bg-stone-50 text-stone-500 border-b border-stone-200">
                      <tr>
                        <th className="p-3">رقم الطلب</th>
                        <th className="p-3">المستلم</th>
                        <th className="p-3">المحافظة</th>
                        <th className="p-3">المبلغ</th>
                        <th className="p-3">الحالة</th>
                        <th className="p-3">التاريخ</th>
                        <th className="p-3 text-left">إجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {orders.slice(0, 5).map((ord) => (
                        <tr key={ord.id} className="hover:bg-stone-50/50">
                          <td className="p-3 font-mono font-bold">{ord.orderNumber}</td>
                          <td className="p-3 font-semibold text-stone-900">{ord.customerName}</td>
                          <td className="p-3 text-stone-600">{ord.city}</td>
                          <td className="p-3 font-bold tabular-nums">{formatIQD(ord.total)}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900">
                              {ord.status}
                            </span>
                          </td>
                          <td className="p-3 text-stone-400">{formatArabicDate(ord.createdAt)}</td>
                          <td className="p-3 text-left">
                            <button
                              onClick={() => {
                                setSelectedOrderDetails(ord);
                                setActiveTab('orders');
                              }}
                              className="px-2.5 py-1 text-xs font-bold bg-stone-100 hover:bg-stone-200 rounded-lg text-stone-800"
                            >
                              معاينة
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: PRODUCTS MANAGEMENT */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg text-stone-900">إدارة المنتجات والهدايا المخصصة</h3>
                  <p className="text-xs text-stone-500">إضافة، تعديل، حذف، تحديد الأسعار بالدينار العراقي والخصومات</p>
                </div>
                <button
                  onClick={openAddProductModal}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-stone-900 hover:bg-stone-800 text-white flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة منتج جديد</span>
                </button>
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-right">
                    <thead className="bg-stone-50 text-stone-600 border-b border-stone-200 font-bold">
                      <tr>
                        <th className="p-3">المنتج</th>
                        <th className="p-3">القسم</th>
                        <th className="p-3">السعر (IQD)</th>
                        <th className="p-3">العرض / الخصم</th>
                        <th className="p-3">مميز</th>
                        <th className="p-3">الحالة</th>
                        <th className="p-3 text-left">التحكم</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {products.map((prod) => {
                        const cat = categories.find(c => c.id === prod.categoryId);
                        return (
                          <tr key={prod.id} className="hover:bg-stone-50/50">
                            <td className="p-3">
                              <div className="flex items-center gap-2.5">
                                <img
                                  src={prod.images[0] || '/src/assets/images/hero_printing_store_1790334111184.jpg'}
                                  alt=""
                                  className="w-10 h-10 object-cover rounded-lg border border-stone-200 shrink-0"
                                />
                                <div>
                                  <div className="font-bold text-stone-900 line-clamp-1">{prod.name}</div>
                                  <div className="text-[10px] text-stone-400 font-mono">
                                    {prod.images.length} صور
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="p-3 text-stone-600 font-medium">
                              {cat?.name || 'غير محدد'}
                            </td>
                            <td className="p-3 font-bold tabular-nums text-stone-900">
                              {formatIQD(prod.price)}
                              {prod.originalPrice && (
                                <span className="block text-[10px] text-stone-400 line-through">
                                  {formatIQD(prod.originalPrice)}
                                </span>
                              )}
                            </td>
                            <td className="p-3">
                              {prod.isDiscount ? (
                                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900">
                                  {prod.discountLabel || 'خصم'}
                                </span>
                              ) : (
                                <span className="text-stone-400 text-[11px]">—</span>
                              )}
                            </td>
                            <td className="p-3">
                              {prod.isFeatured ? (
                                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-stone-900 text-amber-300">
                                  مميز
                                </span>
                              ) : (
                                <span className="text-stone-400 text-[11px]">—</span>
                              )}
                            </td>
                            <td className="p-3">
                              <button
                                onClick={() => toggleProductActive(prod.id)}
                                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                  prod.isActive
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-stone-200 text-stone-500'
                                }`}
                              >
                                {prod.isActive ? 'مفعل' : 'معطل'}
                              </button>
                            </td>
                            <td className="p-3 text-left">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => openEditProductModal(prod)}
                                  className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg"
                                  title="تعديل المنتج"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`هل أنت متأكد من حذف المنتج: ${prod.name}؟`)) {
                                      deleteProduct(prod.id);
                                    }
                                  }}
                                  className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-stone-100 rounded-lg"
                                  title="حذف المنتج"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CATEGORIES MANAGEMENT */}
          {activeTab === 'categories' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg text-stone-900">إدارة أقسام المتجر</h3>
                  <p className="text-xs text-stone-500">إمكانية إضافة أقسام غير محدودة، تعديلها، وإعادة ترتيبها</p>
                </div>
                <button
                  onClick={openAddCategoryModal}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-stone-900 hover:bg-stone-800 text-white flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة قسم جديد</span>
                </button>
              </div>

              {/* Categories Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {categories.map((cat, idx) => {
                  const count = products.filter(p => p.categoryId === cat.id).length;
                  return (
                    <div
                      key={cat.id}
                      className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs flex flex-col justify-between space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-full bg-stone-100 text-stone-500 text-[10px] font-bold flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <h4 className="font-bold text-stone-900 text-sm">{cat.name}</h4>
                          </div>
                          {cat.description && (
                            <p className="text-xs text-stone-500 mt-1 line-clamp-2">{cat.description}</p>
                          )}
                        </div>

                        <span className="text-xs px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-semibold">
                          {count} منتجات
                        </span>
                      </div>

                      <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                        <span className="text-[11px] text-stone-400">ID: {cat.id}</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEditCategoryModal(cat)}
                            className="p-1.5 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-100"
                            title="تعديل"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`هل أنت متأكد من حذف القسم "${cat.name}"؟`)) {
                                deleteCategory(cat.id);
                              }
                            }}
                            className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-stone-100"
                            title="حذف"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div>
                  <h3 className="font-bold text-lg text-stone-900">إدارة ومعالجة الطلبات</h3>
                  <p className="text-xs text-stone-500">تحديث حالات الطلب، مراجعة تصاميم الزبائن، وإصدار الفواتير الرقمية</p>
                </div>

                {/* Status Filter Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-500 font-semibold">تصفية بالحالة:</span>
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="text-xs px-3 py-1.5 bg-white border border-stone-300 rounded-xl focus:outline-none"
                  >
                    <option value="all">كافة الحالات ({orders.length})</option>
                    {ALL_ORDER_STATUSES.map(st => (
                      <option key={st} value={st}>
                        {st} ({orders.filter(o => o.status === st).length})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Order Search Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="ابحث برقم الطلب (ZKR-XXXX)، اسم المستلم، أو رقم الهاتف..."
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-10 py-2.5 text-xs bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-stone-500"
                />
                <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>

              {/* Orders Table */}
              <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-right">
                    <thead className="bg-stone-50 text-stone-600 border-b border-stone-200 font-bold">
                      <tr>
                        <th className="p-3">رقم الطلب</th>
                        <th className="p-3">العميل</th>
                        <th className="p-3">الهاتف</th>
                        <th className="p-3">المدينة والعنوان</th>
                        <th className="p-3">المجموع</th>
                        <th className="p-3">الحالة</th>
                        <th className="p-3">تاريخ الطلب</th>
                        <th className="p-3 text-left">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="p-8 text-center text-stone-500">
                            لا توجد طلبات تطابق معايير البحث المحددة.
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((ord) => (
                          <tr key={ord.id} className="hover:bg-stone-50/50">
                            <td className="p-3 font-mono font-black text-stone-900">{ord.orderNumber}</td>
                            <td className="p-3 font-bold text-stone-900">{ord.customerName}</td>
                            <td className="p-3 text-stone-600 font-mono" dir="ltr">{ord.phone}</td>
                            <td className="p-3 text-stone-600 max-w-xs truncate">{ord.city} - {ord.address}</td>
                            <td className="p-3 font-bold tabular-nums text-stone-900">{formatIQD(ord.total)}</td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900">
                                {ord.status}
                              </span>
                            </td>
                            <td className="p-3 text-stone-400">{formatArabicDate(ord.createdAt)}</td>
                            <td className="p-3 text-left">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setSelectedOrderDetails(ord)}
                                  className="px-2.5 py-1 text-xs font-bold bg-stone-900 hover:bg-stone-800 text-white rounded-lg transition-colors"
                                >
                                  تفاصيل وتحديث
                                </button>
                                <button
                                  onClick={() => onViewInvoice(ord)}
                                  className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg"
                                  title="عرض الفاتورة الرسمية"
                                >
                                  <FileText className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Order Details & Status Changer Modal if opened */}
              {selectedOrderDetails && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/60 backdrop-blur-xs overflow-y-auto">
                  <div
                    className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 border border-stone-200 text-right space-y-6 my-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                      <div>
                        <span className="font-mono font-black text-lg text-stone-900">
                          تفاصيل الطلب: {selectedOrderDetails.orderNumber}
                        </span>
                        <span className="block text-xs text-stone-500">
                          تاريخ الإنشاء: {formatArabicDate(selectedOrderDetails.createdAt)}
                        </span>
                      </div>
                      <button
                        onClick={() => setSelectedOrderDetails(null)}
                        className="p-1 text-stone-400 hover:text-stone-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Customer Info Box */}
                    <div className="grid grid-cols-2 gap-3 p-3.5 bg-stone-50 rounded-2xl border border-stone-200 text-xs">
                      <div>
                        <div className="text-stone-400">اسم العميل:</div>
                        <div className="font-bold text-stone-900 text-sm">{selectedOrderDetails.customerName}</div>
                      </div>
                      <div>
                        <div className="text-stone-400">الهاتف:</div>
                        <div className="font-bold text-stone-900 font-mono" dir="ltr">{selectedOrderDetails.phone}</div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-stone-400">العنوان:</div>
                        <div className="font-bold text-stone-900">{selectedOrderDetails.city} - {selectedOrderDetails.address}</div>
                      </div>
                      {selectedOrderDetails.notes && (
                        <div className="col-span-2 bg-amber-50 p-2 rounded-lg text-amber-900">
                          <strong>ملاحظات العميل:</strong> {selectedOrderDetails.notes}
                        </div>
                      )}
                    </div>

                    {/* Order Items */}
                    <div className="space-y-2">
                      <div className="font-bold text-xs text-stone-700">المنتجات المطلوبة:</div>
                      <div className="max-h-40 overflow-y-auto space-y-2">
                        {selectedOrderDetails.items.map((it, i) => (
                          <div key={i} className="flex items-center justify-between p-2 bg-stone-50 rounded-xl text-xs">
                            <div className="flex items-center gap-2">
                              <img src={it.image} alt="" className="w-10 h-10 object-cover rounded-lg border border-stone-200" />
                              <div>
                                <div className="font-bold text-stone-900">{it.productName}</div>
                                {it.customNote && (
                                  <div className="text-[11px] text-amber-800">طباعة: {it.customNote}</div>
                                )}
                              </div>
                            </div>
                            <div className="text-left font-bold tabular-nums">
                              {it.quantity} × {formatIQD(it.price)} = {formatIQD(it.price * it.quantity)}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between text-xs pt-2 border-t border-stone-200 font-bold">
                        <span>المجموع مع التوصيل ({selectedOrderDetails.deliveryOptionTitle}):</span>
                        <span className="tabular-nums text-stone-900">{formatIQD(selectedOrderDetails.total)}</span>
                      </div>
                    </div>

                    {/* Status Changer Form */}
                    <div className="p-4 bg-stone-100 rounded-2xl space-y-3">
                      <div className="font-bold text-xs text-stone-800">تحديث حالة هذا الطلب:</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] text-stone-500 mb-1">الحالة الجديدة:</label>
                          <select
                            value={newStatusSelection}
                            onChange={(e) => setNewStatusSelection(e.target.value as OrderStatus)}
                            className="w-full p-2 text-xs bg-white border border-stone-300 rounded-xl focus:outline-none"
                          >
                            {ALL_ORDER_STATUSES.map(st => (
                              <option key={st} value={st}>{st}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] text-stone-500 mb-1">ملاحظة التحديث (تظهر للزبون):</label>
                          <input
                            type="text"
                            placeholder="مثال: تم إرسال الشحنة مع شركة التوصيل"
                            value={statusUpdateNote}
                            onChange={(e) => setStatusUpdateNote(e.target.value)}
                            className="w-full p-2 text-xs bg-white border border-stone-300 rounded-xl focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 justify-end pt-1">
                        <button
                          onClick={() => onViewInvoice(selectedOrderDetails)}
                          className="px-4 py-2 text-xs font-bold bg-white text-stone-800 border border-stone-300 rounded-xl hover:bg-stone-50"
                        >
                          عرض الفاتورة
                        </button>
                        <button
                          onClick={handleUpdateStatusSubmit}
                          className="px-4 py-2 text-xs font-bold bg-stone-900 text-white rounded-xl hover:bg-stone-800"
                        >
                          حفظ وتثبيت الحالة
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 5: MESSAGES INBOX */}
          {activeTab === 'messages' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-lg text-stone-900">رسائل ومحادثات الزبائن</h3>
                <p className="text-xs text-stone-500">التواصل المباشر مع الزبائن، مراجعة استفسارات المنتجات والتصاميم قبل التثبيت</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs h-[520px]">
                
                {/* Conversations List (Right) */}
                <div className="md:col-span-5 border-l border-stone-200 overflow-y-auto divide-y divide-stone-100">
                  {conversations.map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => {
                        setSelectedConversationId(conv.id);
                        markConversationAsRead(conv.id, 'admin');
                      }}
                      className={`p-3.5 cursor-pointer transition-colors ${
                        activeConversation?.id === conv.id ? 'bg-stone-100' : 'hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-xs text-stone-900">{conv.customerName}</h4>
                        <span className="text-[10px] text-stone-400">
                          {formatArabicDate(conv.updatedAt)}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 truncate mt-1">{conv.lastMessage}</p>
                      {conv.unreadAdminCount > 0 && (
                        <span className="inline-block mt-1 text-[10px] font-bold px-1.5 py-0.2 bg-amber-400 text-stone-950 rounded">
                          {conv.unreadAdminCount} غير مقروء
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Active Chat Conversation (Left) */}
                <div className="md:col-span-7 flex flex-col justify-between bg-stone-50">
                  {activeConversation ? (
                    <>
                      {/* Chat Header */}
                      <div className="p-3 bg-white border-b border-stone-200 flex justify-between items-center">
                        <div>
                          <h4 className="font-bold text-xs text-stone-900">{activeConversation.customerName}</h4>
                          <span className="text-[10px] text-stone-400 font-mono">ID: {activeConversation.id}</span>
                        </div>
                      </div>

                      {/* Messages Thread */}
                      <div className="flex-1 p-4 overflow-y-auto space-y-2.5">
                        {activeConversation.messages.map((m) => (
                          <div
                            key={m.id}
                            className={`flex ${m.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[85%] p-3 rounded-2xl text-xs space-y-1 ${
                                m.sender === 'admin'
                                  ? 'bg-stone-900 text-white rounded-tl-xs'
                                  : 'bg-white text-stone-900 border border-stone-200 rounded-tr-xs'
                              }`}
                            >
                              {m.productAttachment && (
                                <div className="p-1.5 bg-black/10 rounded-lg flex items-center gap-2 mb-1">
                                  <img src={m.productAttachment.image} alt="" className="w-8 h-8 rounded object-cover" />
                                  <div className="text-[11px] font-bold truncate">{m.productAttachment.name}</div>
                                </div>
                              )}
                              <p className="leading-relaxed">{m.text}</p>
                              <div className="text-[9px] opacity-60 text-left">{formatArabicDate(m.timestamp)}</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Reply Form */}
                      <form onSubmit={handleAdminSendMessage} className="p-3 bg-white border-t border-stone-200 flex gap-2">
                        <input
                          type="text"
                          placeholder="اكتب رد المتجر للزبون..."
                          value={adminReplyText}
                          onChange={(e) => setAdminReplyText(e.target.value)}
                          className="flex-1 px-3.5 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none"
                        />
                        <button
                          type="submit"
                          className="p-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl"
                        >
                          <Send className="w-4 h-4 rotate-180" />
                        </button>
                      </form>
                    </>
                  ) : (
                    <div className="h-full flex items-center justify-center text-xs text-stone-400">
                      اختر محادثة لعرض التفاصيل والرد
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* TAB 6: ADS & BANNER */}
          {activeTab === 'ads' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg text-stone-900">البانر العلوي والإعلانات المتحركة</h3>
                  <p className="text-xs text-stone-500">التحكم في الشرائح الإعلانية، النصوص، والشارات الترويجية في أعلى الموقع</p>
                </div>
                <button
                  onClick={openAddAdModal}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-stone-900 text-white flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة شريحة إعلان</span>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {advertisements.map((ad, i) => (
                  <div key={ad.id} className="p-4 bg-white rounded-2xl border border-stone-200 flex justify-between items-center text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900 text-sm">{ad.title}</span>
                        {ad.badgeText && (
                          <span className="px-2 py-0.5 rounded bg-amber-400 text-stone-950 font-bold text-[10px]">
                            {ad.badgeText}
                          </span>
                        )}
                      </div>
                      {ad.subtitle && <p className="text-stone-500">{ad.subtitle}</p>}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateAdvertisement(ad.id, { isActive: !ad.isActive })}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                          ad.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-500'
                        }`}
                      >
                        {ad.isActive ? 'نشط' : 'معطل'}
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('حذف هذا الإعلان؟')) deleteAdvertisement(ad.id);
                        }}
                        className="p-1.5 text-stone-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: VIDEOS */}
          {activeTab === 'videos' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg text-stone-900">الفيديوهات الترويجية</h3>
                  <p className="text-xs text-stone-500">إضافة وتعديل روابط فيديوهات الطباعة والحفر الليزري</p>
                </div>
              </div>

              <div className="space-y-3">
                {promotionalVideos.map((vid) => (
                  <div key={vid.id} className="p-4 bg-white rounded-2xl border border-stone-200 space-y-3 text-xs">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-stone-900 text-sm">{vid.title}</h4>
                        <p className="text-stone-500">{vid.description}</p>
                        <span className="text-stone-400 font-mono text-[11px] block mt-1">{vid.videoUrl}</span>
                      </div>
                      <button
                        onClick={() => updatePromotionalVideo(vid.id, { isActive: !vid.isActive })}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                          vid.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-500'
                        }`}
                      >
                        {vid.isActive ? 'مفعل' : 'معطل'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: SOCIAL MEDIA */}
          {activeTab === 'social' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-lg text-stone-900">حسابات التواصل الاجتماعي الرسمية</h3>
                <p className="text-xs text-stone-500">إدارة حسابات إنستغرام، تيك توك، واتساب، وتليغرام المربوطة بالمتجر</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {socialLinks.map((item) => (
                  <div key={item.id} className="p-4 bg-white rounded-2xl border border-stone-200 flex justify-between items-center text-xs">
                    <div>
                      <div className="font-bold text-stone-900">{item.name}</div>
                      <div className="text-stone-500 font-mono text-[11px]" dir="ltr">{item.handle}</div>
                      <a href={item.url} target="_blank" rel="noreferrer" className="text-emerald-700 underline text-[10px] mt-0.5 inline-block">
                        رابط الحساب
                      </a>
                    </div>
                    <button
                      onClick={() => updateSocialLink(item.id, { isActive: !item.isActive })}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                        item.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-500'
                      }`}
                    >
                      {item.isActive ? 'مفعل' : 'معطل'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: DELIVERY SETTINGS */}
          {activeTab === 'delivery' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-lg text-stone-900">أسعار وإعدادات التوصيل (غير ثابتة ومخصصة)</h3>
                <p className="text-xs text-stone-500">التحكم في خياري أسعار التوصيل (داخل بغداد والمحافظات) حسب متطلبات المتجر</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {deliverySettings.map((del) => (
                  <div key={del.id} className="p-5 bg-white rounded-2xl border border-stone-200 space-y-4 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                        <Truck className="w-4 h-4 text-emerald-700" />
                        <span>{del.title}</span>
                      </span>
                      <span className="font-bold tabular-nums text-stone-900 text-base">
                        {formatIQD(del.price)}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <label className="block text-[11px] text-stone-500 mb-1">اسم المنطقة / الخيار:</label>
                        <input
                          type="text"
                          value={del.title}
                          onChange={(e) => updateDeliverySetting(del.id, { title: e.target.value })}
                          className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-stone-500 mb-1">سعر التوصيل بالدينار العراقي (IQD):</label>
                        <input
                          type="number"
                          step={500}
                          value={del.price}
                          onChange={(e) => updateDeliverySetting(del.id, { price: Number(e.target.value) })}
                          className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl font-bold font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-stone-500 mb-1">المدة المتوقعة للتسليم:</label>
                        <input
                          type="text"
                          value={del.estimatedDays}
                          onChange={(e) => updateDeliverySetting(del.id, { estimatedDays: e.target.value })}
                          className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 10: THEME & SUPABASE SETTINGS */}
          {activeTab === 'theme' && (
            <div className="space-y-6">
              
              {/* Theme Customization Section */}
              <div className="p-6 bg-white rounded-2xl border border-stone-200 space-y-5">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-base text-stone-900">تخصيص ألوان وهوية الموقع (Live Theme)</h3>
                    <p className="text-xs text-stone-500">يتغير مظهر كامل الموقع فوراً وفقاً للألوان المحددة</p>
                  </div>
                  <button
                    onClick={resetThemeSettings}
                    className="text-xs font-bold text-stone-500 hover:text-stone-800 underline"
                  >
                    استعادة الألوان الافتراضية
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {/* Primary Color */}
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                    <label className="block text-xs font-bold text-stone-700">اللون الأساسي (Primary):</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={themeSettings.primaryColor}
                        onChange={(e) => updateThemeSettings({ primaryColor: e.target.value })}
                        className="w-10 h-10 rounded cursor-pointer border border-stone-300"
                      />
                      <span className="font-mono text-xs">{themeSettings.primaryColor}</span>
                    </div>
                  </div>

                  {/* Secondary Color */}
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                    <label className="block text-xs font-bold text-stone-700">اللون الثانوي (Secondary):</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={themeSettings.secondaryColor}
                        onChange={(e) => updateThemeSettings({ secondaryColor: e.target.value })}
                        className="w-10 h-10 rounded cursor-pointer border border-stone-300"
                      />
                      <span className="font-mono text-xs">{themeSettings.secondaryColor}</span>
                    </div>
                  </div>

                  {/* Button Color */}
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                    <label className="block text-xs font-bold text-stone-700">لون الأزرار (Buttons):</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={themeSettings.buttonColor}
                        onChange={(e) => updateThemeSettings({ buttonColor: e.target.value })}
                        className="w-10 h-10 rounded cursor-pointer border border-stone-300"
                      />
                      <span className="font-mono text-xs">{themeSettings.buttonColor}</span>
                    </div>
                  </div>

                  {/* Accent Color */}
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                    <label className="block text-xs font-bold text-stone-700">لون التمييز (Accent):</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={themeSettings.accentColor}
                        onChange={(e) => updateThemeSettings({ accentColor: e.target.value })}
                        className="w-10 h-10 rounded cursor-pointer border border-stone-300"
                      />
                      <span className="font-mono text-xs">{themeSettings.accentColor}</span>
                    </div>
                  </div>

                  {/* Background Color */}
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                    <label className="block text-xs font-bold text-stone-700">خلفية الموقع (Background):</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={themeSettings.bgColor}
                        onChange={(e) => updateThemeSettings({ bgColor: e.target.value })}
                        className="w-10 h-10 rounded cursor-pointer border border-stone-300"
                      />
                      <span className="font-mono text-xs">{themeSettings.bgColor}</span>
                    </div>
                  </div>

                  {/* Text Color */}
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                    <label className="block text-xs font-bold text-stone-700">لون النصوص (Text):</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={themeSettings.textColor}
                        onChange={(e) => updateThemeSettings({ textColor: e.target.value })}
                        className="w-10 h-10 rounded cursor-pointer border border-stone-300"
                      />
                      <span className="font-mono text-xs">{themeSettings.textColor}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Store Information Settings */}
              <div className="p-6 bg-white rounded-2xl border border-stone-200 space-y-4">
                <h3 className="font-bold text-base text-stone-900">بيانات ومعلومات المتجر الرسمية</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] text-stone-500 mb-1">اسم المتجر:</label>
                    <input
                      type="text"
                      value={storeSettings.storeName}
                      onChange={(e) => updateStoreSettings({ storeName: e.target.value })}
                      className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-stone-500 mb-1">الشعار والوصف القصير:</label>
                    <input
                      type="text"
                      value={storeSettings.storeTagline}
                      onChange={(e) => updateStoreSettings({ storeTagline: e.target.value })}
                      className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-stone-500 mb-1">رقم الهاتف / واتساب:</label>
                    <input
                      type="text"
                      value={storeSettings.phone}
                      onChange={(e) => updateStoreSettings({ phone: e.target.value })}
                      className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-stone-500 mb-1">عنوان الورشة والمحل:</label>
                    <input
                      type="text"
                      value={storeSettings.address}
                      onChange={(e) => updateStoreSettings({ address: e.target.value })}
                      className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Supabase Database & SQL Migration Section */}
              <div className="p-6 bg-white rounded-2xl border border-stone-200 space-y-4">
                <div className="flex items-center gap-2 text-stone-900">
                  <Database className="w-5 h-5 text-emerald-700" />
                  <h3 className="font-bold text-base">ربط قاعدة بيانات Supabase ونصوص الهجرة SQL</h3>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  تم تصميم النظام ليعمل بكفاءة فائقة ومزامنة كاملة عبر Supabase. يمكنك إدخال بيانات مشروعك في Supabase لربطها مباشرة، كما يمكنك نسخ كود إنشاء الجداول والصلاحيات (RLS Policies) لتشغيلها بنقرة واحدة داخل Supabase SQL Editor.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] text-stone-500 mb-1">Supabase Project URL:</label>
                    <input
                      type="text"
                      dir="ltr"
                      placeholder="https://your-project.supabase.co"
                      value={supabaseUrl}
                      onChange={(e) => setSupabaseUrl(e.target.value)}
                      className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-stone-500 mb-1">Supabase Anon Key:</label>
                    <input
                      type="password"
                      dir="ltr"
                      placeholder="eyJhbGciOi..."
                      value={supabaseKey}
                      onChange={(e) => setSupabaseKey(e.target.value)}
                      className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    onClick={handleSaveSupabase}
                    className="px-4 py-2 text-xs font-bold bg-stone-900 text-white rounded-xl hover:bg-stone-800 transition-colors"
                  >
                    حفظ إعدادات الربط مع Supabase
                  </button>
                  {savedSupabaseNotice && (
                    <span className="text-xs font-bold text-emerald-700">✓ تم حفظ إعدادات Supabase بنجاح!</span>
                  )}
                </div>

                <div className="pt-4 border-t border-stone-200 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-stone-800">مخطط جداول SQL الجاهز للنسخ (PostgreSQL / Supabase):</span>
                    <button
                      onClick={handleCopySql}
                      className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedSql ? 'تم النسخ!' : 'نسخ كود SQL بالكامل'}</span>
                    </button>
                  </div>

                  <pre
                    className="p-3 bg-stone-950 text-emerald-400 rounded-xl text-[11px] font-mono overflow-x-auto max-h-48 border border-stone-800 text-left"
                    dir="ltr"
                  >
                    {SUPABASE_SQL_SCHEMA}
                  </pre>
                </div>
              </div>

            </div>
          )}

          {/* TAB 11: SECURITY & PRIVACY SETTINGS */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              
              {/* Security Header Banner */}
              <div
                className="p-6 rounded-2xl text-white space-y-2 relative overflow-hidden"
                style={{ backgroundColor: 'var(--primary-color, #1e3a2b)' }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold shadow-md">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black">أمان لوحة التحكم وخصوصية الرابط المباشر</h3>
                    <p className="text-xs text-amber-200">
                      تسجيل دخول الأدمن حصرياً عبر Google مع التحقق من جدول admin_users
                    </p>
                  </div>
                </div>
              </div>

              {/* 1. Whitelist Management (admin_users) */}
              <div className="p-6 bg-white rounded-2xl border border-stone-200 space-y-5">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-stone-100 pb-3">
                  <div>
                    <h4 className="font-extrabold text-stone-900 text-sm flex items-center gap-2">
                      <span>المشرفون المصرح لهم بالدخول (جدول admin_users)</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                        {adminUsers.length} حسابات معتمدة
                      </span>
                    </h4>
                    <p className="text-xs text-stone-500 mt-0.5">
                      أي تسجيل دخول عبر Google Login لن يُسمح له بفتح لوحة التحكم إلا إذا كان بريده مُدرجاً ومفعلاً هنا.
                    </p>
                  </div>
                </div>

                {/* Add New Admin Form */}
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!newAdminEmail.trim()) return;
                    const ok = await addAdminUser(newAdminEmail.trim(), newAdminName.trim(), newAdminRole);
                    if (ok) {
                      setNewAdminEmail('');
                      setNewAdminName('');
                      setAdminNotice('تمت إضافة المشرف بنجاح إلى جدول admin_users');
                      setTimeout(() => setAdminNotice(''), 3000);
                    } else {
                      setAdminNotice('البريد الإلكتروني موجود بالفعل أو غير صالح');
                      setTimeout(() => setAdminNotice(''), 3000);
                    }
                  }}
                  className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3 text-xs"
                >
                  <span className="font-bold text-stone-800 block">إضافة بريد Google جديد لمشرف المتجر:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] text-stone-500 mb-1">البريد الإلكتروني (Google Email):</label>
                      <input
                        type="email"
                        dir="ltr"
                        required
                        placeholder="example@gmail.com"
                        value={newAdminEmail}
                        onChange={(e) => setNewAdminEmail(e.target.value)}
                        className="w-full p-2 bg-white border border-stone-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-stone-500 mb-1">اسم المشرف:</label>
                      <input
                        type="text"
                        placeholder="مثال: أحمد للمتابعة"
                        value={newAdminName}
                        onChange={(e) => setNewAdminName(e.target.value)}
                        className="w-full p-2 bg-white border border-stone-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-stone-500 mb-1">الدور والصلاحية:</label>
                      <select
                        value={newAdminRole}
                        onChange={(e) => setNewAdminRole(e.target.value as any)}
                        className="w-full p-2 bg-white border border-stone-300 rounded-xl"
                      >
                        <option value="admin">مشرف متجر (Admin)</option>
                        <option value="editor">معدل منتجات ومحتوى (Editor)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>إضافة المشرف لجدول admin_users</span>
                    </button>
                    {adminNotice && (
                      <span className="text-xs font-bold text-emerald-700">{adminNotice}</span>
                    )}
                  </div>
                </form>

                {/* Admins Table */}
                <div className="overflow-x-auto rounded-xl border border-stone-200">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-stone-100 text-stone-700 font-bold border-b border-stone-200">
                      <tr>
                        <th className="p-3">الاسم والصفة</th>
                        <th className="p-3">بريد Google المعتمد</th>
                        <th className="p-3">الصلاحية</th>
                        <th className="p-3">الحالة</th>
                        <th className="p-3 text-center">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200 font-medium">
                      {adminUsers.map((admin) => {
                        const isOwner = admin.email === 'aaa0750907766@gmail.com';
                        return (
                          <tr key={admin.id} className="hover:bg-stone-50">
                            <td className="p-3 font-bold text-stone-900">
                              <div className="flex items-center gap-2">
                                <span>{admin.name}</span>
                                {isOwner && (
                                  <span className="bg-amber-100 text-amber-900 text-[10px] px-2 py-0.5 rounded-full font-extrabold border border-amber-300">
                                    مالك المتجر (Super Admin)
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="p-3 font-mono dir-ltr text-stone-700">{admin.email}</td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[11px] font-semibold">
                                {admin.role === 'super_admin' ? 'مدير أعلى' : admin.role === 'admin' ? 'مشرف' : 'محرر'}
                              </span>
                            </td>
                            <td className="p-3">
                              {admin.isActive ? (
                                <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                  <span>مفعل ومصرح</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-stone-400 font-bold">
                                  <span className="w-2 h-2 rounded-full bg-stone-300"></span>
                                  <span>معطل مؤقتاً</span>
                                </span>
                              )}
                            </td>
                            <td className="p-3 text-center">
                              {!isOwner ? (
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    onClick={() => toggleAdminUserActive(admin.id)}
                                    className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg text-[11px] cursor-pointer"
                                    title={admin.isActive ? 'تعطيل الحساب' : 'تفعيل الحساب'}
                                  >
                                    {admin.isActive ? 'تعطيل' : 'تفعيل'}
                                  </button>
                                  <button
                                    onClick={() => deleteAdminUser(admin.id)}
                                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                                    title="حذف المشرف"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <span className="text-[11px] text-stone-400 font-semibold">حساب أساسي محمي</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 2. Privacy & Search Engine Indexing Protection */}
              <div className="p-6 bg-white rounded-2xl border border-stone-200 space-y-4">
                <div>
                  <h4 className="font-extrabold text-stone-900 text-sm">
                    إجراءات حماية الخصوصية ومنع الفهرسة بمحركات البحث
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    المتجر مصمم ليعمل كـ "رابط خاص" تشاركه مع زبائنك حصرياً (واتساب، انستغرام، إلخ) بدون فهرسة تلقائية.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-1.5">
                    <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                      <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>ملف robots.txt لمنع الزحف</span>
                    </div>
                    <p className="text-[11px] text-emerald-800 leading-relaxed font-mono">
                      User-agent: *<br />
                      Disallow: /
                    </p>
                    <span className="text-[10px] text-emerald-700 block font-semibold">✓ مفعل ونشط في مجلد الموقع</span>
                  </div>

                  <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-1.5">
                    <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                      <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>وسم Meta لمنع الأرشفة</span>
                    </div>
                    <p className="text-[11px] text-emerald-800 leading-relaxed font-mono">
                      &lt;meta name="robots" content="noindex, nofollow"&gt;
                    </p>
                    <span className="text-[10px] text-emerald-700 block font-semibold">✓ مضاف في ترويسة HTML</span>
                  </div>

                  <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-1.5">
                    <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                      <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>Google Search Console</span>
                    </div>
                    <p className="text-[11px] text-emerald-800 leading-relaxed">
                      عدم ربط الموقع بأدوات مشرفي المواقع لحمايته من أي فهرسة عامة تلقائية.
                    </p>
                    <span className="text-[10px] text-emerald-700 block font-semibold">✓ خاص بالرابط المباشر فقط</span>
                  </div>
                </div>
              </div>

              {/* 3. Site-Wide Password Protection (Optional) */}
              <div className="p-6 bg-white rounded-2xl border border-stone-200 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-extrabold text-stone-900 text-sm flex items-center gap-2">
                      <Lock className="w-4 h-4 text-amber-600" />
                      <span>حماية الموقع برمز مرور عام (Site-Wide Password)</span>
                    </h4>
                    <p className="text-xs text-stone-500 mt-0.5">
                      ميزة إضافية اختيارية (مطفأة افتراضياً): تمنع أي زائر من تصفح المتجر إلا بعد كتابة رمز المرور المحدد.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sitePassEnabled}
                      onChange={(e) => setSitePassEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                  </label>
                </div>

                {sitePassEnabled && (
                  <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200 space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">
                          رمز المرور للدخول إلى المتجر:
                        </label>
                        <input
                          type="text"
                          placeholder="مثال: zekra2026"
                          value={sitePassValue}
                          onChange={(e) => setSitePassValue(e.target.value)}
                          className="w-full p-2.5 bg-white border border-stone-300 rounded-xl font-mono text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">
                          تلميح للزبائن (اختياري):
                        </label>
                        <input
                          type="text"
                          placeholder="مثال: الرمز مرسل لكم عبر واتساب"
                          value={sitePassHint}
                          onChange={(e) => setSitePassHint(e.target.value)}
                          className="w-full p-2.5 bg-white border border-stone-300 rounded-xl"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      updateStoreSettings({
                        siteProtection: {
                          enabled: sitePassEnabled,
                          password: sitePassValue.trim(),
                          hint: sitePassHint.trim()
                        }
                      });
                      setSitePassSavedNotice(true);
                      setTimeout(() => setSitePassSavedNotice(false), 2500);
                    }}
                    className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    حفظ إعدادات حماية الموقع
                  </button>
                  {sitePassSavedNotice && (
                    <span className="text-xs font-bold text-emerald-700">✓ تم حفظ إعدادات الحماية بنجاح!</span>
                  )}
                </div>
              </div>

            </div>
          )}

        </main>
      </div>

      {/* Product Add / Edit Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/60 backdrop-blur-xs overflow-y-auto">
          <div
            className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl p-6 border border-stone-200 text-right space-y-4 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <h3 className="font-bold text-base text-stone-900">
                {editingProduct ? 'تعديل بيانات المنتج' : 'إضافة منتج جديد لمتجر ذكرى'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)}>
                <X className="w-5 h-5 text-stone-400" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">اسم المنتج:</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: كوب سحري مع خط عربي..."
                  value={prodFormName}
                  onChange={(e) => setProdFormName(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">القسم:</label>
                  <select
                    value={prodFormCategory}
                    onChange={(e) => setProdFormCategory(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">السعر بالدينار العراقي (IQD):</label>
                  <input
                    type="number"
                    step={500}
                    required
                    value={prodFormPrice}
                    onChange={(e) => setProdFormPrice(Number(e.target.value))}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl font-bold font-mono"
                  />
                </div>
              </div>

              {/* Discount Controls */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-800">
                  <input
                    type="checkbox"
                    checked={prodFormIsDiscount}
                    onChange={(e) => setProdFormIsDiscount(e.target.checked)}
                    className="rounded"
                  />
                  <span>تفعيل تخفيض / عرض خاص على هذا المنتج</span>
                </label>

                {prodFormIsDiscount && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <label className="block text-[11px] text-stone-500 mb-1">السعر الأصلي قبل الخصم:</label>
                      <input
                        type="number"
                        placeholder="مثال: 20000"
                        value={prodFormOriginalPrice || ''}
                        onChange={(e) => setProdFormOriginalPrice(e.target.value ? Number(e.target.value) : undefined)}
                        className="w-full p-2 bg-white border border-stone-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-stone-500 mb-1">نص الشارة:</label>
                      <input
                        type="text"
                        placeholder="خصم 20% أو عرض الأسبوع"
                        value={prodFormDiscountLabel}
                        onChange={(e) => setProdFormDiscountLabel(e.target.value)}
                        className="w-full p-2 bg-white border border-stone-300 rounded-lg"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">وصف المنتج وخيارات الطباعة:</label>
                <textarea
                  rows={3}
                  required
                  placeholder="وصف تفصيلي للخامة ونوع الطباعة والمقاسات..."
                  value={prodFormDescription}
                  onChange={(e) => setProdFormDescription(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              {/* Multiple Images List */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="font-semibold text-stone-700">صور المنتج (روابط الصور متعددة):</label>
                  <button
                    type="button"
                    onClick={() => setProdFormImages(prev => [...prev, ''])}
                    className="text-emerald-700 font-bold hover:underline"
                  >
                    + إضافة صورة أخرى
                  </button>
                </div>
                {prodFormImages.map((img, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      dir="ltr"
                      placeholder="رابط الصورة (URL أو مسار الصورة)"
                      value={img}
                      onChange={(e) => {
                        const newImgs = [...prodFormImages];
                        newImgs[idx] = e.target.value;
                        setProdFormImages(newImgs);
                      }}
                      className="flex-1 p-2 bg-stone-50 border border-stone-300 rounded-lg font-mono text-xs"
                    />
                    {prodFormImages.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setProdFormImages(prodFormImages.filter((_, i) => i !== idx))}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodFormIsFeatured}
                    onChange={(e) => setProdFormIsFeatured(e.target.checked)}
                  />
                  <span>تمييز المنتج في الواجهة (Featured)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodFormInStock}
                    onChange={(e) => setProdFormInStock(e.target.checked)}
                  />
                  <span>متوفر في المخزن</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold bg-stone-900 text-white hover:bg-stone-800"
                >
                  {editingProduct ? 'حفظ التعديلات' : 'إضافة المنتج فوراً'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Add / Edit Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-950/60 backdrop-blur-xs">
          <div
            className="w-full max-w-md bg-white rounded-3xl p-6 border border-stone-200 text-right space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <h3 className="font-bold text-base text-stone-900">
                {editingCategory ? 'تعديل القسم' : 'إضافة قسم جديد'}
              </h3>
              <button onClick={() => setIsCategoryModalOpen(false)}>
                <X className="w-5 h-5 text-stone-400" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">اسم القسم:</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: ساعات خشبية مخصصة"
                  value={catFormName}
                  onChange={(e) => setCatFormName(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">وصف مختصر للقسم:</label>
                <textarea
                  rows={2}
                  placeholder="وصف لما يقدمه هذا القسم من هدايا وطباعة..."
                  value={catFormDesc}
                  onChange={(e) => setCatFormDesc(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold bg-stone-900 text-white"
                >
                  {editingCategory ? 'حفظ التعديل' : 'إضافة القسم'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Advertisement Add Modal */}
      {isAdModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-950/60 backdrop-blur-xs">
          <div
            className="w-full max-w-md bg-white rounded-3xl p-6 border border-stone-200 text-right space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <h3 className="font-bold text-base text-stone-900">إضافة شريحة إعلان متحركة</h3>
              <button onClick={() => setIsAdModalOpen(false)}>
                <X className="w-5 h-5 text-stone-400" />
              </button>
            </div>

            <form onSubmit={handleSaveAd} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">عنوان الإعلان الرئيسي:</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: خصم 25% على وشاحات التخرج"
                  value={adTitle}
                  onChange={(e) => setAdTitle(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">النص التوضيحي الفرعي:</label>
                <input
                  type="text"
                  placeholder="مثال: متوفر بكافة المقاسات مع تطريز الاسم بالقصب الذهبي"
                  value={adSubtitle}
                  onChange={(e) => setAdSubtitle(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">نص الشارة:</label>
                  <input
                    type="text"
                    value={adBadge}
                    onChange={(e) => setAdBadge(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">نص زر التوجيه:</label>
                  <input
                    type="text"
                    value={adBtnText}
                    onChange={(e) => setAdBtnText(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold bg-stone-900 text-white"
                >
                  حفظ الإعلان
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
