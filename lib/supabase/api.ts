// API functions for interacting with Supabase database
import { supabase } from './client'
import type { Product, Order, OrderItem, Database } from './types'
import { ladooFallbackProducts } from '@/lib/ladooCatalog'

const allowedStoreCategories = new Set([
  'LADOOS',
  'LADOOS_DRYFRUIT',
  'SNACKS',
  'DRY_SNACKS',
  'GIFT_BOXES',
  'LIGHT_SWEETS',
])

const fallbackImageByName: Record<string, string> = {
  'fresh ladoos': '/images/Gond.jpg',
  'indian snacks platter': '/images/Oats_Makhana.jpg',
}

const withSafeImages = (product: Product): Product => {
  const cleanedImages = Array.isArray(product.images)
    ? product.images.filter((img) => typeof img === 'string' && img.trim().length > 0)
    : []

  if (cleanedImages.length > 0) {
    return {
      ...product,
      images: cleanedImages,
    }
  }

  const nameKey = product.name.trim().toLowerCase()
  const fallback = fallbackImageByName[nameKey] || '/images/Dry_Fruit.jpg'

  return {
    ...product,
    images: [fallback],
  }
}

const normalizeStoreProducts = (products: Product[]): Product[] => {
  const filtered = products.filter((product) => allowedStoreCategories.has(product.category))
  return filtered.map(withSafeImages)
}

const getFallbackByCategory = (category: string) =>
  ladooFallbackProducts.filter((product) => product.category === category)

// =====================================================
// PRODUCTS API
// =====================================================

export const getProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.warn('Supabase unavailable in getProducts, using fallback catalog:', error.message)
    return ladooFallbackProducts
  }

  const products = normalizeStoreProducts((data as Product[]) || [])
  return products.length > 0 ? products : ladooFallbackProducts
}

export const getProductById = async (id: string) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    const fallbackProduct = ladooFallbackProducts.find((product) => product.id === id)
    if (fallbackProduct) return fallbackProduct
    throw error
  }

  const product = withSafeImages(data as Product)
  if (!allowedStoreCategories.has(product.category)) {
    const fallbackProduct = ladooFallbackProducts.find((item) => item.id === id)
    if (fallbackProduct) return fallbackProduct
  }

  return product
}

export const getProductsByCategory = async (category: string) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .order('name')

  if (error) {
    console.warn('Supabase unavailable in getProductsByCategory, using fallback catalog:', error.message)
    return getFallbackByCategory(category)
  }

  const products = normalizeStoreProducts((data as Product[]) || [])
  return products.length > 0 ? products : getFallbackByCategory(category)
}

export const getFeaturedProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('featured', true)
    .order('name')

  if (error) {
    console.warn('Supabase unavailable in getFeaturedProducts, using fallback catalog:', error.message)
    return ladooFallbackProducts.filter((product) => product.featured)
  }

  const products = normalizeStoreProducts((data as Product[]) || [])
  return products.length > 0
    ? products
    : ladooFallbackProducts.filter((product) => product.featured)
}

export const createProduct = async (product: Database['public']['Tables']['products']['Insert']) => {
  const { data, error } = await supabase
    .from('products')
    .insert(product)
    .select()
    .single()

  if (error) throw error
  return data as Product
}

export const updateProduct = async (id: string, updates: Database['public']['Tables']['products']['Update']) => {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Product
}

export const deleteProduct = async (id: string) => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)

  if (error) throw error
  return true
}

// =====================================================
// ORDERS API
// =====================================================

export const createOrder = async (
  orderData: Omit<Database['public']['Tables']['orders']['Insert'], 'order_number'>,
  items: Omit<Database['public']['Tables']['order_items']['Insert'], 'order_id'>[]
) => {
  // Generate order number using the database function
  const { data: orderNumberData, error: orderNumberError } = await supabase
    .rpc('generate_order_number')

  if (orderNumberError) throw orderNumberError

  // Create order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      ...orderData,
      order_number: orderNumberData,
    })
    .select()
    .single()

  if (orderError) throw orderError

  // Create order items
  const orderItems = items.map(item => ({
    ...item,
    order_id: order.id,
  }))

  const { data: createdItems, error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems)
    .select()

  if (itemsError) throw itemsError

  return {
    order: order as Order,
    items: createdItems as OrderItem[],
  }
}

export const getOrderByNumber = async (orderNumber: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .eq('order_number', orderNumber)
    .single()

  if (error) throw error
  return data
}

export const getOrdersByCustomer = async (email: string, phone: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .or(`customer_email.eq.${email},customer_phone.eq.${phone}`)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const getAllOrders = async () => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const updateOrderStatus = async (
  orderIdentifier: string,
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
) => {
  const updates: any = { order_status: status }

  if (status === 'SHIPPED') {
    updates.shipped_at = new Date().toISOString()
  } else if (status === 'DELIVERED') {
    updates.delivered_at = new Date().toISOString()
  }

  // Check if identifier is order_number (format: ORD-XXXXXXXX-XXXX) or UUID
  const isOrderNumber = orderIdentifier.startsWith('ORD-')

  const { data, error } = await supabase
    .from('orders')
    .update(updates)
    .eq(isOrderNumber ? 'order_number' : 'id', orderIdentifier)
    .select()
    .single()

  if (error) throw error
  return data as Order
}

export const updatePaymentStatus = async (
  orderIdentifier: string,
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED',
  transactionId?: string
) => {
  const updates: any = { payment_status: status }

  if (status === 'COMPLETED') {
    updates.payment_completed_at = new Date().toISOString()
    if (transactionId) {
      updates.payment_transaction_id = transactionId
    }
  }

  // Check if identifier is order_number (format: ORD-XXXXXXXX-XXXX) or UUID
  const isOrderNumber = orderIdentifier.startsWith('ORD-')

  const { data, error } = await supabase
    .from('orders')
    .update(updates)
    .eq(isOrderNumber ? 'order_number' : 'id', orderIdentifier)
    .select()
    .single()

  if (error) throw error
  return data as Order
}

// =====================================================
// STATISTICS API (for admin dashboard)
// =====================================================

export const getOrderStats = async () => {
  const { data: orders, error } = await supabase
    .from('orders')
    .select('total, order_status, created_at')

  if (error) throw error

  const stats = {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + Number(order.total), 0),
    pendingOrders: orders.filter(o => o.order_status === 'PENDING').length,
    processingOrders: orders.filter(o => o.order_status === 'PROCESSING').length,
    shippedOrders: orders.filter(o => o.order_status === 'SHIPPED').length,
    deliveredOrders: orders.filter(o => o.order_status === 'DELIVERED').length,
    recentOrders: orders.slice(0, 10),
  }

  return stats
}

export const getProductStats = async () => {
  const { data: products, error } = await supabase
    .from('products')
    .select('stock, customizable')

  if (error) throw error

  return {
    totalProducts: products.length,
    lowStockProducts: products.filter(p => p.stock < 10).length,
    outOfStockProducts: products.filter(p => p.stock === 0).length,
    customizableProducts: products.filter(p => p.customizable).length,
  }
}
