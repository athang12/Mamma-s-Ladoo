-- Instructions to change admin username and password
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard -> SQL Editor)

-- Method 1: Update existing admin credentials
-- Replace 'your_new_username' and 'your_new_password' with your desired credentials

UPDATE public.admin_users 
SET 
  username = 'your_new_username',
  password_hash = 'your_new_password',  -- For demo, we use plain text (in production use proper hashing)
  email = 'your_email@example.com',
  full_name = 'Your Full Name'
WHERE username = 'admin';

-- Verify the change
SELECT id, username, email, full_name, is_active, created_at 
FROM public.admin_users;


-- Method 2: Create a new admin user (if you want to add another admin)
-- Uncomment the lines below and replace with your details

-- INSERT INTO public.admin_users (username, password_hash, email, full_name, is_active)
-- VALUES (
--   'newadmin',           -- New username
--   'securepassword123',  -- New password
--   'newadmin@example.com',
--   'New Admin Name',
--   true
-- );


-- Method 3: Delete the default admin and create a new one
-- Uncomment the lines below and replace with your details

-- DELETE FROM public.admin_users WHERE username = 'admin';
-- 
-- INSERT INTO public.admin_users (username, password_hash, email, full_name, is_active)
-- VALUES (
--   'myadmin',              -- Your username
--   'mySecurePass2026!',    -- Your password
--   'admin@mystore.com',
--   'Store Administrator',
--   true
-- );


-- Important Notes:
-- 1. This uses plain text passwords for demo purposes
-- 2. In production, you should use bcrypt or similar password hashing
-- 3. After making changes, you may need to logout and clear browser localStorage
-- 4. To logout: localStorage.removeItem('admin_session') in browser console
