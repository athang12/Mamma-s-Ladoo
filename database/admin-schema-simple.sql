-- Simplified Admin Panel Setup (No Storage Policies)
-- Use this if the main SQL file has storage policy conflicts

-- 1. Drop and recreate admin tables
DROP TABLE IF EXISTS public.admin_sessions CASCADE;
DROP TABLE IF EXISTS public.admin_users CASCADE;

-- 2. Create admin_users table
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ
);

-- 3. Create admin_sessions table
CREATE TABLE public.admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES public.admin_users(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Insert default admin user (password: admin123)
INSERT INTO public.admin_users (username, password_hash, email, full_name)
VALUES (
  'admin',
  'admin123', -- Using plain text for now, will be checked in API
  'admin@example.com',
  'System Administrator'
);

-- 5. Add indexes
CREATE INDEX idx_admin_users_username ON public.admin_users(username);
CREATE INDEX idx_admin_users_email ON public.admin_users(email);
CREATE INDEX idx_admin_sessions_token ON public.admin_sessions(session_token);
CREATE INDEX idx_admin_sessions_user ON public.admin_sessions(admin_user_id);

-- 6. Enable RLS (optional, can be disabled for admin tables)
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

-- 7. Allow all operations on admin tables (since these are admin-only)
CREATE POLICY "Allow all operations on admin_users" ON public.admin_users USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on admin_sessions" ON public.admin_sessions USING (true) WITH CHECK (true);

-- SUCCESS!
SELECT 'Admin tables created successfully!' as message;
SELECT 'Login at /admin/login with username: admin, password: admin123' as credentials;
