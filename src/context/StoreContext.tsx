import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Product,
  Category,
  CartItem,
  DeliverySetting,
  Order,
  OrderStatus,
  Conversation,
  ChatMessage,
  Advertisement,
  PromotionalVideo,
  SocialLink,
  StoreSettings,
  ThemeSettings
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_DELIVERY_SETTINGS,
  INITIAL_ADVERTISEMENTS,
  INITIAL_PROMOTIONAL_VIDEOS,
  INITIAL_SOCIAL_LINKS,
  INITIAL_STORE_SETTINGS,
  INITIAL_THEME_SETTINGS,
  INITIAL_SAMPLE_ORDERS,
  INITIAL_CONVERSATIONS
} from '../data/initialData';

interface StoreContextType {
  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleProductActive: (id: string) => void;

  // Categories
  categories: Category[];
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  reorderCategories: (startIndex: number, endIndex: number) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, customNote?: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  selectedDelivery: DeliverySetting | null;
  setSelectedDeliveryId: (id: string) => void;
  cartTotal: number;

  // Favorites
  favorites: string[]; // product IDs
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;

  // Delivery Settings
  deliverySettings: DeliverySetting[];
  updateDeliverySetting: (id: string, updates: Partial<DeliverySetting>) => void;

  // Orders
  orders: Order[];
  createOrder: (orderData: {
    customerName: string;
    phone: string;
    city: string;
    address: string;
    notes?: string;
  }) => Order;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, note?: string) => void;
  getOrderById: (orderId: string) => Order | undefined;
  getOrderByNumber: (orderNumber: string) => Order | undefined;

  // Messaging (Customer <-> Store)
  conversations: Conversation[];
  customerConversationId: string;
  sendMessageAsCustomer: (text: string, productAttachment?: Product, imageUrl?: string) => void;
  sendMessageAsAdmin: (conversationId: string, text: string, imageUrl?: string) => void;
  markConversationAsRead: (conversationId: string, reader: 'admin' | 'customer') => void;

  // Advertisements
  advertisements: Advertisement[];
  addAdvertisement: (ad: Omit<Advertisement, 'id'>) => void;
  updateAdvertisement: (id: string, updates: Partial<Advertisement>) => void;
  deleteAdvertisement: (id: string) => void;
  reorderAdvertisements: (startIndex: number, endIndex: number) => void;

  // Promotional Videos
  promotionalVideos: PromotionalVideo[];
  addPromotionalVideo: (video: Omit<PromotionalVideo, 'id'>) => void;
  updatePromotionalVideo: (id: string, updates: Partial<PromotionalVideo>) => void;
  deletePromotionalVideo: (id: string) => void;

  // Social Links
  socialLinks: SocialLink[];
  addSocialLink: (link: Omit<SocialLink, 'id'>) => void;
  updateSocialLink: (id: string, updates: Partial<SocialLink>) => void;
  deleteSocialLink: (id: string) => void;

  // Store & Theme Settings
  storeSettings: StoreSettings;
  updateStoreSettings: (updates: Partial<StoreSettings>) => void;
  themeSettings: ThemeSettings;
  updateThemeSettings: (updates: Partial<ThemeSettings>) => void;
  resetThemeSettings: () => void;

  // Admin Auth
  isAdminLoggedIn: boolean;
  adminUser: { name: string; email: string; avatarUrl?: string } | null;
  loginAdmin: (method: 'google' | 'supabase' | 'demo', email?: string) => void;
  logoutAdmin: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const loadFromStorage = <T,>(key: string, fallback: T): T => {
  try {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error(`Error loading ${key} from localStorage:`, e);
  }
  return fallback;
};

const saveToStorage = <T,>(key: string, value: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage:`, e);
  }
};

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State initialization
  const [products, setProducts] = useState<Product[]>(() =>
    loadFromStorage('zekra_products', INITIAL_PRODUCTS)
  );
  const [categories, setCategories] = useState<Category[]>(() =>
    loadFromStorage('zekra_categories', INITIAL_CATEGORIES)
  );
  const [cart, setCart] = useState<CartItem[]>(() =>
    loadFromStorage('zekra_cart', [])
  );
  const [favorites, setFavorites] = useState<string[]>(() =>
    loadFromStorage('zekra_favorites', [])
  );
  const [deliverySettings, setDeliverySettings] = useState<DeliverySetting[]>(() =>
    loadFromStorage('zekra_delivery', INITIAL_DELIVERY_SETTINGS)
  );
  const [selectedDeliveryId, setSelectedDeliveryId] = useState<string>(() => {
    return deliverySettings[0]?.id || 'del-baghdad';
  });
  const [orders, setOrders] = useState<Order[]>(() =>
    loadFromStorage('zekra_orders', INITIAL_SAMPLE_ORDERS)
  );
  const [conversations, setConversations] = useState<Conversation[]>(() =>
    loadFromStorage('zekra_conversations', INITIAL_CONVERSATIONS)
  );
  const [customerConversationId, setCustomerConversationId] = useState<string>(() => {
    const existing = localStorage.getItem('zekra_customer_conv_id');
    if (existing) return existing;
    const newId = 'conv-' + Math.random().toString(36).substring(2, 9);
    localStorage.setItem('zekra_customer_conv_id', newId);
    return newId;
  });
  const [advertisements, setAdvertisements] = useState<Advertisement[]>(() =>
    loadFromStorage('zekra_advertisements', INITIAL_ADVERTISEMENTS)
  );
  const [promotionalVideos, setPromotionalVideos] = useState<PromotionalVideo[]>(() =>
    loadFromStorage('zekra_promotional_videos', INITIAL_PROMOTIONAL_VIDEOS)
  );
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(() =>
    loadFromStorage('zekra_social_links', INITIAL_SOCIAL_LINKS)
  );
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() =>
    loadFromStorage('zekra_store_settings', INITIAL_STORE_SETTINGS)
  );
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>(() =>
    loadFromStorage('zekra_theme_settings', INITIAL_THEME_SETTINGS)
  );

  // Admin Auth State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('zekra_admin_auth') === 'true';
  });
  const [adminUser, setAdminUser] = useState<{ name: string; email: string; avatarUrl?: string } | null>(() => {
    const saved = localStorage.getItem('zekra_admin_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Apply Theme CSS Variables dynamically whenever themeSettings change
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', themeSettings.primaryColor);
    root.style.setProperty('--secondary-color', themeSettings.secondaryColor);
    root.style.setProperty('--accent-color', themeSettings.accentColor);
    root.style.setProperty('--bg-color', themeSettings.bgColor);
    root.style.setProperty('--text-color', themeSettings.textColor);
    root.style.setProperty('--btn-color', themeSettings.buttonColor);
    root.style.setProperty('--btn-text', themeSettings.buttonTextColor);
    saveToStorage('zekra_theme_settings', themeSettings);
  }, [themeSettings]);

  // Sync to local storage
  useEffect(() => saveToStorage('zekra_products', products), [products]);
  useEffect(() => saveToStorage('zekra_categories', categories), [categories]);
  useEffect(() => saveToStorage('zekra_cart', cart), [cart]);
  useEffect(() => saveToStorage('zekra_favorites', favorites), [favorites]);
  useEffect(() => saveToStorage('zekra_delivery', deliverySettings), [deliverySettings]);
  useEffect(() => saveToStorage('zekra_orders', orders), [orders]);
  useEffect(() => saveToStorage('zekra_conversations', conversations), [conversations]);
  useEffect(() => saveToStorage('zekra_advertisements', advertisements), [advertisements]);
  useEffect(() => saveToStorage('zekra_promotional_videos', promotionalVideos), [promotionalVideos]);
  useEffect(() => saveToStorage('zekra_social_links', socialLinks), [socialLinks]);
  useEffect(() => saveToStorage('zekra_store_settings', storeSettings), [storeSettings]);

  // Product Operations
  const addProduct = (newProduct: Omit<Product, 'id' | 'createdAt'>) => {
    const product: Product = {
      ...newProduct,
      id: 'prod-' + Date.now(),
      createdAt: new Date().toISOString()
    };
    setProducts(prev => [product, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const toggleProductActive = (id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p));
  };

  // Category Operations
  const addCategory = (categoryData: Omit<Category, 'id'>) => {
    const category: Category = {
      ...categoryData,
      id: 'cat-' + Date.now()
    };
    setCategories(prev => [...prev, category]);
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const reorderCategories = (startIndex: number, endIndex: number) => {
    setCategories(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result.map((item, index) => ({ ...item, displayOrder: index + 1 }));
    });
  };

  // Cart Operations
  const addToCart = (product: Product, quantity = 1, customNote?: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id && item.customNote === (customNote || ''));
      if (existing) {
        return prev.map(item =>
          item.id === existing.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          id: 'cart-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
          product,
          quantity,
          customNote
        }
      ];
    });
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev => prev.map(item => item.id === itemId ? { ...item, quantity } : item));
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const selectedDelivery = deliverySettings.find(d => d.id === selectedDeliveryId) || deliverySettings[0] || null;
  const cartTotal = cartSubtotal + (selectedDelivery ? selectedDelivery.price : 0);

  // Favorites
  const toggleFavorite = (productId: string) => {
    setFavorites(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const isFavorite = (productId: string) => favorites.includes(productId);

  // Delivery Setting Operations
  const updateDeliverySetting = (id: string, updates: Partial<DeliverySetting>) => {
    setDeliverySettings(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
  };

  // Order Operations
  const createOrder = (orderData: {
    customerName: string;
    phone: string;
    city: string;
    address: string;
    notes?: string;
  }): Order => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `ZKR-${randomNum}`;
    const now = new Date().toISOString();

    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      orderNumber,
      customerName: orderData.customerName,
      phone: orderData.phone,
      city: orderData.city,
      address: orderData.address,
      notes: orderData.notes,
      items: cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.images[0] || '',
        customNote: item.customNote
      })),
      subtotal: cartSubtotal,
      deliveryFee: selectedDelivery ? selectedDelivery.price : 5000,
      deliveryOptionTitle: selectedDelivery ? selectedDelivery.title : 'توصيل اعتيادي',
      total: cartTotal,
      status: 'طلب جديد',
      createdAt: now,
      statusHistory: [
        {
          status: 'طلب جديد',
          timestamp: now,
          note: 'تم إرسال الطلب من قِبل العميل وهو بانتظار مراجعة المتجر'
        }
      ],
      paymentMethod: 'الدفع عند الاستلام'
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, note?: string) => {
    const now = new Date().toISOString();
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: newStatus,
          statusHistory: [
            ...o.statusHistory,
            { status: newStatus, timestamp: now, note: note || `تم تحديث حالة الطلب إلى "${newStatus}"` }
          ]
        };
      }
      return o;
    }));
  };

  const getOrderById = (orderId: string) => orders.find(o => o.id === orderId);
  const getOrderByNumber = (orderNumber: string) =>
    orders.find(o => o.orderNumber.trim().toUpperCase() === orderNumber.trim().toUpperCase());

  // Messaging System
  const sendMessageAsCustomer = (text: string, productAttachment?: Product, imageUrl?: string) => {
    const now = new Date().toISOString();
    const newMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'customer',
      text,
      imageUrl,
      productAttachment: productAttachment ? {
        id: productAttachment.id,
        name: productAttachment.name,
        price: productAttachment.price,
        image: productAttachment.images[0] || ''
      } : undefined,
      timestamp: now
    };

    setConversations(prev => {
      const existingConv = prev.find(c => c.id === customerConversationId);
      if (existingConv) {
        return prev.map(c =>
          c.id === customerConversationId
            ? {
                ...c,
                lastMessage: text,
                unreadAdminCount: c.unreadAdminCount + 1,
                updatedAt: now,
                messages: [...c.messages, newMsg]
              }
            : c
        );
      } else {
        const newConv: Conversation = {
          id: customerConversationId,
          customerName: 'عميل المتجر',
          lastMessage: text,
          unreadAdminCount: 1,
          unreadCustomerCount: 0,
          updatedAt: now,
          messages: [newMsg]
        };
        return [newConv, ...prev];
      }
    });
  };

  const sendMessageAsAdmin = (conversationId: string, text: string, imageUrl?: string) => {
    const now = new Date().toISOString();
    const newMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'admin',
      text,
      imageUrl,
      timestamp: now
    };

    setConversations(prev => prev.map(c => {
      if (c.id === conversationId) {
        return {
          ...c,
          lastMessage: text,
          unreadCustomerCount: c.unreadCustomerCount + 1,
          updatedAt: now,
          messages: [...c.messages, newMsg]
        };
      }
      return c;
    }));
  };

  const markConversationAsRead = (conversationId: string, reader: 'admin' | 'customer') => {
    setConversations(prev => prev.map(c => {
      if (c.id === conversationId) {
        return {
          ...c,
          ...(reader === 'admin' ? { unreadAdminCount: 0 } : { unreadCustomerCount: 0 })
        };
      }
      return c;
    }));
  };

  // Advertisements
  const addAdvertisement = (adData: Omit<Advertisement, 'id'>) => {
    const ad: Advertisement = {
      ...adData,
      id: 'ad-' + Date.now()
    };
    setAdvertisements(prev => [...prev, ad]);
  };

  const updateAdvertisement = (id: string, updates: Partial<Advertisement>) => {
    setAdvertisements(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const deleteAdvertisement = (id: string) => {
    setAdvertisements(prev => prev.filter(a => a.id !== id));
  };

  const reorderAdvertisements = (startIndex: number, endIndex: number) => {
    setAdvertisements(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result.map((item, index) => ({ ...item, order: index + 1 }));
    });
  };

  // Promotional Videos
  const addPromotionalVideo = (videoData: Omit<PromotionalVideo, 'id'>) => {
    const vid: PromotionalVideo = {
      ...videoData,
      id: 'vid-' + Date.now()
    };
    setPromotionalVideos(prev => [...prev, vid]);
  };

  const updatePromotionalVideo = (id: string, updates: Partial<PromotionalVideo>) => {
    setPromotionalVideos(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v));
  };

  const deletePromotionalVideo = (id: string) => {
    setPromotionalVideos(prev => prev.filter(v => v.id !== id));
  };

  // Social Links
  const addSocialLink = (linkData: Omit<SocialLink, 'id'>) => {
    const link: SocialLink = {
      ...linkData,
      id: 'soc-' + Date.now()
    };
    setSocialLinks(prev => [...prev, link]);
  };

  const updateSocialLink = (id: string, updates: Partial<SocialLink>) => {
    setSocialLinks(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteSocialLink = (id: string) => {
    setSocialLinks(prev => prev.filter(s => s.id !== id));
  };

  // Settings
  const updateStoreSettings = (updates: Partial<StoreSettings>) => {
    setStoreSettings(prev => ({ ...prev, ...updates }));
  };

  const updateThemeSettings = (updates: Partial<ThemeSettings>) => {
    setThemeSettings(prev => ({ ...prev, ...updates }));
  };

  const resetThemeSettings = () => {
    setThemeSettings(INITIAL_THEME_SETTINGS);
  };

  // Admin Auth
  const loginAdmin = (method: 'google' | 'supabase' | 'demo', email?: string) => {
    setIsAdminLoggedIn(true);
    const user = {
      name: method === 'google' ? 'مدير المتجر (Google)' : method === 'supabase' ? 'مشرف النظام (Supabase)' : 'مدير ذكرى للطباعة',
      email: email || (method === 'google' ? 'admin@zekraprint.iq' : 'admin@zekraprint.iq'),
      avatarUrl: ''
    };
    setAdminUser(user);
    localStorage.setItem('zekra_admin_auth', 'true');
    localStorage.setItem('zekra_admin_user', JSON.stringify(user));
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    setAdminUser(null);
    localStorage.removeItem('zekra_admin_auth');
    localStorage.removeItem('zekra_admin_user');
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductActive,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        reorderCategories,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartSubtotal,
        selectedDelivery,
        setSelectedDeliveryId,
        cartTotal,
        favorites,
        toggleFavorite,
        isFavorite,
        deliverySettings,
        updateDeliverySetting,
        orders,
        createOrder,
        updateOrderStatus,
        getOrderById,
        getOrderByNumber,
        conversations,
        customerConversationId,
        sendMessageAsCustomer,
        sendMessageAsAdmin,
        markConversationAsRead,
        advertisements,
        addAdvertisement,
        updateAdvertisement,
        deleteAdvertisement,
        reorderAdvertisements,
        promotionalVideos,
        addPromotionalVideo,
        updatePromotionalVideo,
        deletePromotionalVideo,
        socialLinks,
        addSocialLink,
        updateSocialLink,
        deleteSocialLink,
        storeSettings,
        updateStoreSettings,
        themeSettings,
        updateThemeSettings,
        resetThemeSettings,
        isAdminLoggedIn,
        adminUser,
        loginAdmin,
        logoutAdmin
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
