-- Fix RLS Policies for Admin Tables
-- Run this to allow admin operations

-- Drop existing restrictive policies if any
DROP POLICY IF EXISTS "Admins can read all admin users" ON public.admin_users;

-- Create permissive policies for admin_users (all operations allowed)
CREATE POLICY "Allow all operations on admin_users" 
ON public.admin_users 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create permissive policies for admin_sessions (all operations allowed)
CREATE POLICY "Allow all operations on admin_sessions" 
ON public.admin_sessions 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Verify policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE tablename IN ('admin_users', 'admin_sessions');
