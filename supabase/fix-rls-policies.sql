-- Fix RLS Policies to Allow Anonymous Product Management
-- Run this in Supabase SQL Editor to fix the migration issue

-- Drop the existing restrictive policy for products
DROP POLICY IF EXISTS "Admins can manage products" ON products;

-- Create a new policy that allows anonymous users to manage products
-- This is needed since there's no authentication system
CREATE POLICY "Anyone can manage products"
ON products FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Also update the orders policy to allow anonymous order creation
DROP POLICY IF EXISTS "Admins can manage orders" ON orders;

CREATE POLICY "Anyone can manage orders"
ON orders FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Update order items policy
DROP POLICY IF EXISTS "Admins can manage order items" ON order_items;

CREATE POLICY "Anyone can manage order items"
ON order_items FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Note: In production, you would want to add proper authentication
-- and restrict these policies. For development and guest checkout, 
-- this allows the admin panel and checkout to work without authentication.
