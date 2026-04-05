// TypeScript types for Supabase database tables

export interface Database {
  public: {
    Tables: {
      products: {
        Row: Product
        Insert: Omit<Product, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>
      }
      orders: {
        Row: Order
        Insert: Omit<Order, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Order, 'id' | 'created_at' | 'updated_at'>>
      }
      order_items: {
        Row: OrderItem
        Insert: Omit<OrderItem, 'id' | 'created_at'>
        Update: Partial<Omit<OrderItem, 'id' | 'created_at'>>
      }
      admin_users: {
        Row: AdminUser
        Insert: Omit<AdminUser, 'id' | 'created_at'>
        Update: Partial<Omit<AdminUser, 'id' | 'created_at'>>
      }
    }
  }
}

export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  category: string
  customizable: boolean
  stock: number
  featured: boolean
  default_color: string
  available_colors: string[]
  theme_tags: string[]
  images: string[]
  max_images?: number // Number of images allowed for customization (default: 1)
  template_image?: string // Product template with transparent design area
  mask_image?: string // Optional: Frame overlay for boundary clipping
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_email: string
  customer_phone: string
  shipping_address: string
  city: string
  state: string | null
  postal_code: string
  country: string
  subtotal: number
  shipping_cost: number
  tax: number
  total: number
  payment_method: 'UPI_PHONEPE' | 'COD'
  payment_status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
  order_status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  payment_transaction_id: string | null
  payment_completed_at: string | null
  created_at: string
  updated_at: string
  shipped_at: string | null
  delivered_at: string | null
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  product_price: number
  quantity: number
  selected_color: string | null
  selected_size: string | null
  is_custom: boolean
  custom_image_url: string | null
  custom_image_data: CustomImageData | null
  item_total: number
  created_at: string
}

export interface CustomImageData {
  rotation: number
  scale: number
  positionX: number
  positionY: number
  flipHorizontal: boolean
  flipVertical: boolean
  textOverlays?: TextOverlay[]
  designData?: string // JSON string of full design data from CanvasEditor
}

export interface TextOverlay {
  id: string
  text: string
  x: number
  y: number
  fontSize: number
  fontFamily: string
  color: string
  bold: boolean
  italic: boolean
  underline: boolean
}

export interface AdminUser {
  id: string
  username: string
  email: string
  password_hash: string
  full_name: string | null
  is_active: boolean
  created_at: string
  last_login_at: string | null
}

export interface AdminSession {
  id: string
  admin_user_id: string
  session_token: string
  expires_at: string
  created_at: string
}

// View types
export interface OrderSummary extends Order {
  item_count: number
  total_items: number
}

// Order with items (for detailed views)
export interface OrderWithItems extends Order {
  items: OrderItem[]
}
