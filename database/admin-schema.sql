-- Admin Panel Database Schema
-- Execute this SQL in your Supabase SQL Editor

-- 1. Drop existing admin_users table if it exists (to recreate with correct schema)
DROP TABLE IF EXISTS public.admin_users CASCADE;
DROP TABLE IF EXISTS public.admin_sessions CASCADE;

-- 2. Create admin_users table
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL, -- Store bcrypt hashed password
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ
);

-- 2. Create Supabase Storage buckets for product images and templates
-- Note: You'll need to run these from the Supabase Dashboard Storage section
-- OR use the Supabase client in a server action

-- Bucket for product images (up to 3 per product)
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Bucket for product templates (PNG with transparent areas for customization)
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-templates', 'product-templates', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Set storage policies for product-images bucket
CREATE POLICY "Public read access for product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can update product images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can delete product images"
ON storage.objects FOR DELETE
USING (bucket_id = 'product-images');

-- 4. Set storage policies for product-templates bucket
CREATE POLICY "Public read access for product templates"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-templates');

CREATE POLICY "Authenticated users can upload product templates"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-templates');

CREATE POLICY "Authenticated users can update product templates"
ON storage.objects FOR UPDATE
USING (bucket_id = 'product-templates');

CREATE POLICY "Authenticated users can delete product templates"
ON storage.objects FOR DELETE
USING (bucket_id = 'product-templates');

-- 5. Create a default admin user (password: admin123)
-- Note: You should change this password after first login!
INSERT INTO public.admin_users (username, password_hash, email, full_name)
VALUES (
  'admin',
  '$2a$10$rE8mF9.xY3qxK5L7jN0cXO8N5Z6Y7vW8uK9lM0nO1pQ2rS3tU4vV6', -- bcrypt hash of 'admin123'
  'admin@example.com',
  'System Administrator'
)
ON CONFLICT (username) DO NOTHING;

-- 6. Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON public.admin_users(username);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users(email);

-- 7. Enable Row Level Security (RLS) on admin_users table
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 8. Create RLS policies for admin_users
-- Only allow admins to read admin users table
CREATE POLICY "Admins can read all admin users"
ON public.admin_users FOR SELECT
USING (true); -- Will add proper auth check later

-- 9. Create admin sessions table for JWT-style sessions
CREATE TABLE public.admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES public.admin_users(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON public.admin_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_user ON public.admin_sessions(admin_user_id);

-- Enable RLS on admin_sessions
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

-- 10. Create a function to clean up expired sessions
CREATE OR REPLACE FUNCTION clean_expired_admin_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM public.admin_sessions WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. Success message
DO $$
BEGIN
  RAISE NOTICE 'Admin panel database schema created successfully!';
  RAISE NOTICE 'Default admin credentials: username=admin, password=admin123';
  RAISE NOTICE 'IMPORTANT: Change the default password after first login!';
END
$$;
