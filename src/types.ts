export type OrderStatus =
  | 'طلب جديد'
  | 'قيد المراجعة'
  | 'تم قبول الطلب'
  | 'قيد التجهيز'
  | 'جاهز'
  | 'تم الشحن'
  | 'تم التسليم'
  | 'مكتمل'
  | 'مرفوض'
  | 'ملغي';

export interface Category {
  id: string;
  name: string;
  iconName?: string;
  displayOrder: number;
  isActive: boolean;
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  price: number; // In Iraqi Dinar (IQD)
  originalPrice?: number;
  isDiscount?: boolean;
  discountLabel?: string; // e.g. "خصم 20%" or "عرض خاص"
  description: string;
  images: string[];
  isFeatured?: boolean;
  isActive: boolean;
  inStock: boolean;
  createdAt: string;
  specifications?: { label: string; value: string }[];
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  customNote?: string; // e.g., name to be printed or special dedication
}

export interface DeliverySetting {
  id: string;
  title: string; // e.g., "توصيل بغداد"
  price: number; // e.g., 5000 IQD
  estimatedDays: string; // e.g., "خلال 24-48 ساعة"
  description?: string;
  isActive: boolean;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image: string;
  customNote?: string;
}

export interface OrderStatusHistoryItem {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. "ZKR-7429"
  customerName: string;
  phone: string;
  city: string;
  address: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  deliveryOptionTitle: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
  statusHistory: OrderStatusHistoryItem[];
  paymentMethod: 'الدفع عند الاستلام';
}

export interface ChatMessage {
  id: string;
  sender: 'customer' | 'admin';
  text: string;
  imageUrl?: string;
  productAttachment?: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
  orderId?: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  customerName: string;
  customerPhone?: string;
  lastMessage: string;
  unreadAdminCount: number;
  unreadCustomerCount: number;
  updatedAt: string;
  messages: ChatMessage[];
}

export interface Advertisement {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  linkUrl?: string;
  buttonText?: string;
  badgeText?: string;
  isActive: boolean;
  order: number;
}

export interface PromotionalVideo {
  id: string;
  title: string;
  description: string;
  videoUrl: string; // YouTube embed or MP4
  posterUrl?: string;
  isActive: boolean;
  order: number;
}

export interface SocialLink {
  id: string;
  platform: 'instagram' | 'tiktok' | 'facebook' | 'whatsapp' | 'telegram' | 'youtube';
  name: string;
  handle: string;
  url: string;
  iconBgColor?: string;
  isActive: boolean;
  order: number;
}

export interface ThemeSettings {
  primaryColor: string; // e.g. #1e3a2b
  secondaryColor: string; // e.g. #b4914c
  accentColor: string; // e.g. #d97706
  bgColor: string; // e.g. #fafaf9
  textColor: string; // e.g. #1c1917
  buttonColor: string; // e.g. #1e3a2b
  buttonTextColor: string; // e.g. #ffffff
}

export interface SiteProtectionSettings {
  enabled: boolean;
  password?: string;
  hint?: string;
}

export interface AdminUserRecord {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'editor';
  isActive: boolean;
  createdAt: string;
}

export interface StoreSettings {
  storeName: string;
  storeTagline: string;
  storeDescription: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  workingHours: string;
  currency: string;
  logoUrl?: string;
  siteProtection?: SiteProtectionSettings;
}

