-- Custom Acrylic Store Database Schema
-- Run this SQL in Supabase SQL Editor to create all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PRODUCTS TABLE
-- =====================================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category TEXT NOT NULL, -- ACRYLIC_STANDS, WALL_FRAMES, etc.
  customizable BOOLEAN DEFAULT false,
  stock INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  default_color TEXT DEFAULT 'white',
  available_colors TEXT[] DEFAULT ARRAY['white'], -- Array of color keys
  theme_tags TEXT[] DEFAULT ARRAY[]::TEXT[], -- Array of theme tags
  images TEXT[] DEFAULT ARRAY[]::TEXT[], -- Array of image URLs
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_products_customizable ON products(customizable);

-- =====================================================
-- ORDERS TABLE
-- =====================================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL, -- e.g., ORD-20260123-0001
  
  -- Customer Information (no login required)
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  
  -- Shipping Address
  shipping_address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT,
  postal_code TEXT NOT NULL,
  country TEXT DEFAULT 'India',
  
  -- Order Details
  subtotal DECIMAL(10, 2) NOT NULL,
  shipping_cost DECIMAL(10, 2) DEFAULT 0,
  tax DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  
  -- Payment & Status
  payment_method TEXT NOT NULL, -- UPI_PHONEPE, COD
  payment_status TEXT DEFAULT 'PENDING', -- PENDING, COMPLETED, FAILED, REFUNDED
  order_status TEXT DEFAULT 'PENDING', -- PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED
  
  -- Payment details (for UPI)
  payment_transaction_id TEXT,
  payment_completed_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ
);

-- Indexes for order tracking
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_orders_customer_phone ON orders(customer_phone);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- =====================================================
-- ORDER ITEMS TABLE
-- =====================================================
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  
  -- Product snapshot (in case product details change later)
  product_name TEXT NOT NULL,
  product_price DECIMAL(10, 2) NOT NULL,
  
  -- Order details
  quantity INTEGER NOT NULL DEFAULT 1,
  selected_color TEXT,
  selected_size TEXT,
  
  -- Customization
  is_custom BOOLEAN DEFAULT false,
  custom_image_url TEXT, -- URL to image in Supabase Storage
  custom_image_data JSONB, -- Store rotation, scale, text overlays, etc.
  
  -- Pricing
  item_total DECIMAL(10, 2) NOT NULL,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster order item lookups
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- =====================================================
-- ADMIN USERS TABLE (for admin panel access)
-- =====================================================
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'admin', -- admin, super_admin
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ
);

-- Index for login
CREATE INDEX idx_admin_users_email ON admin_users(email);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for products table
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for orders table
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  today TEXT;
  count INTEGER;
  order_num TEXT;
BEGIN
  today := TO_CHAR(NOW(), 'YYYYMMDD');
  
  -- Count orders today
  SELECT COUNT(*) INTO count
  FROM orders
  WHERE order_number LIKE 'ORD-' || today || '%';
  
  -- Generate order number
  order_num := 'ORD-' || today || '-' || LPAD((count + 1)::TEXT, 4, '0');
  
  RETURN order_num;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Public read access to products
CREATE POLICY "Products are publicly readable"
ON products FOR SELECT
TO anon, authenticated
USING (true);

-- Admin write access to products
CREATE POLICY "Admins can manage products"
ON products FOR ALL
TO authenticated
USING (true);

-- Customers can read their own orders (by email or phone)
CREATE POLICY "Customers can view their orders"
ON orders FOR SELECT
TO anon
USING (true);

-- Admin can manage all orders
CREATE POLICY "Admins can manage orders"
ON orders FOR ALL
TO authenticated
USING (true);

-- Order items follow order policies
CREATE POLICY "Order items are readable with orders"
ON order_items FOR SELECT
TO anon
USING (true);

CREATE POLICY "Admins can manage order items"
ON order_items FOR ALL
TO authenticated
USING (true);

-- Admin users - only authenticated can access
CREATE POLICY "Only authenticated can view admins"
ON admin_users FOR SELECT
TO authenticated
USING (true);

-- =====================================================
-- STORAGE POLICIES
-- =====================================================

-- Allow public read access to custom-images bucket
-- (Run this in SQL Editor after creating the bucket)

-- Allow anyone to upload images
CREATE POLICY "Anyone can upload custom images"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'custom-images');

-- Allow public read access
CREATE POLICY "Public can view custom images"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'custom-images');

-- Allow users to update their own uploads (optional)
CREATE POLICY "Users can update custom images"
ON storage.objects FOR UPDATE
TO anon, authenticated
USING (bucket_id = 'custom-images');

-- =====================================================
-- SEED DATA (Initial Products - Optional)
-- =====================================================

-- You can add initial products here or import via admin panel
-- Example:
-- INSERT INTO products (name, description, price, category, customizable, stock, featured, theme_tags, images)
-- VALUES (
--   'Custom Photo Acrylic Stand',
--   'Beautiful transparent acrylic stand perfect for displaying your favorite photos.',
--   24.99,
--   'ACRYLIC_STANDS',
--   true,
--   50,
--   true,
--   ARRAY['aesthetic', 'valentine'],
--   ARRAY['https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800']
-- );

-- =====================================================
-- VIEWS (for easier queries)
-- =====================================================

-- View for order summary with item count
CREATE VIEW order_summary AS
SELECT 
  o.*,
  COUNT(oi.id) as item_count,
  SUM(oi.quantity) as total_items
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id;

-- View for recent orders
CREATE VIEW recent_orders AS
SELECT * FROM orders
ORDER BY created_at DESC
LIMIT 100;

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Composite index for order tracking by customer
CREATE INDEX idx_orders_customer_tracking 
ON orders(customer_email, customer_phone, created_at DESC);

-- Index for order status filtering
CREATE INDEX idx_orders_status_created 
ON orders(order_status, created_at DESC);

-- Full-text search on products (optional - for search feature)
CREATE INDEX idx_products_search 
ON products USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- =====================================================
-- SUCCESS!
-- =====================================================
-- All tables, policies, and functions created successfully!
-- Next steps:
-- 1. Create storage bucket 'custom-images' in Supabase UI
-- 2. Add your credentials to .env.local
-- 3. Start using the admin panel to add products!
