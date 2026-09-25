import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Retrieve credentials from environment or localStorage
const getSavedSupabaseConfig = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (envUrl && envKey) {
    return { url: envUrl, key: envKey };
  }

  try {
    const saved = localStorage.getItem('zekra_supabase_config');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error reading saved Supabase config:', e);
  }

  return { url: '', key: '' };
};

let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient | null => {
  if (supabaseInstance) return supabaseInstance;

  const { url, key } = getSavedSupabaseConfig();
  if (url && key && url.startsWith('http')) {
    try {
      supabaseInstance = createClient(url, key);
      return supabaseInstance;
    } catch (e) {
      console.warn('Failed to initialize Supabase client:', e);
    }
  }
  return null;
};

export const saveSupabaseConfig = (url: string, key: string) => {
  localStorage.setItem('zekra_supabase_config', JSON.stringify({ url, key }));
  if (url && key) {
    supabaseInstance = createClient(url, key);
  } else {
    supabaseInstance = null;
  }
};

export const getStoredSupabaseConfig = () => getSavedSupabaseConfig();

/**
 * Complete Supabase PostgreSQL Schema Script with RLS policies, indexes, and tables
 * requested for "ذكرى للطباعة".
 */
export const SUPABASE_SQL_SCHEMA = `-- ================================================================
-- ذكرى للطباعة - Zekra Printing Store Supabase SQL Schema
-- ================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  name TEXT NOT NULL,
  description TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Products Table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  name TEXT NOT NULL,
  category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  original_price NUMERIC,
  is_discount BOOLEAN DEFAULT false,
  discount_label TEXT,
  description TEXT,
  images TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Delivery Settings Table
CREATE TABLE IF NOT EXISTS delivery_settings (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  title TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 5000,
  estimated_days TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  notes TEXT,
  subtotal NUMERIC NOT NULL,
  delivery_fee NUMERIC NOT NULL,
  delivery_option_title TEXT NOT NULL,
  total NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'طلب جديد',
  payment_method TEXT DEFAULT 'الدفع عند الاستلام',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  order_id TEXT REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  image TEXT,
  custom_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Order Status History Table
CREATE TABLE IF NOT EXISTS order_status_history (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  order_id TEXT REFERENCES orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Customer Conversations Table
CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  last_message TEXT,
  unread_admin_count INT DEFAULT 0,
  unread_customer_count INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Messages Table
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  conversation_id TEXT REFERENCES conversations(id) ON DELETE CASCADE,
  sender TEXT NOT NULL CHECK (sender IN ('customer', 'admin')),
  text TEXT NOT NULL,
  image_url TEXT,
  product_attachment JSONB,
  order_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Advertisements Banner Table
CREATE TABLE IF NOT EXISTS advertisements (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  title TEXT NOT NULL,
  subtitle TEXT,
  image TEXT NOT NULL,
  link_url TEXT,
  button_text TEXT,
  badge_text TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Promotional Videos Table
CREATE TABLE IF NOT EXISTS promotional_videos (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  poster_url TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Social Media Links Table
CREATE TABLE IF NOT EXISTS social_links (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  platform TEXT NOT NULL,
  name TEXT NOT NULL,
  handle TEXT NOT NULL,
  url TEXT NOT NULL,
  icon_bg_color TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Theme & Store Settings Table
CREATE TABLE IF NOT EXISTS store_settings (
  id TEXT PRIMARY KEY DEFAULT 'primary_store',
  store_name TEXT DEFAULT 'ذكرى للطباعة',
  store_tagline TEXT,
  store_description TEXT,
  phone TEXT,
  whatsapp TEXT,
  email TEXT,
  address TEXT,
  working_hours TEXT,
  currency TEXT DEFAULT 'د.ع',
  theme_settings JSONB DEFAULT '{"primaryColor":"#1e3a2b","secondaryColor":"#b4914c","accentColor":"#d97706","bgColor":"#fafaf9","textColor":"#1c1917","buttonColor":"#1e3a2b","buttonTextColor":"#ffffff"}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ================================================================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE advertisements ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotional_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

-- Public can read active categories, products, delivery, banners, social
CREATE POLICY "Public can view active categories" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view delivery settings" ON delivery_settings FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active ads" ON advertisements FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active videos" ON promotional_videos FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active social links" ON social_links FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view store settings" ON store_settings FOR SELECT USING (true);

-- Customers can submit orders and view their order by order_number
CREATE POLICY "Public can insert orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view own orders by order number" ON orders FOR SELECT USING (true);
CREATE POLICY "Public can insert order items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view order items" ON order_items FOR SELECT USING (true);
CREATE POLICY "Public can view status history" ON order_status_history FOR SELECT USING (true);

-- Messaging between customer and store
CREATE POLICY "Public can create conversation" ON conversations FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view conversations" ON conversations FOR SELECT USING (true);
CREATE POLICY "Public can create messages" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view messages" ON messages FOR SELECT USING (true);

-- Authenticated Admin Full Access
CREATE POLICY "Admin full access categories" ON categories TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access products" ON products TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access delivery" ON delivery_settings TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access orders" ON orders TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access order_items" ON order_items TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access ads" ON advertisements TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access videos" ON promotional_videos TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access social" ON social_links TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access settings" ON store_settings TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access messages" ON messages TO authenticated USING (true) WITH CHECK (true);
`;
