// Order and cart type definitions
export interface CartItem {
  id: string
  productId: string
  product: {
    name: string
    thumbnailUrl: string
    basePrice: number
  }
  quantity: number
  selectedColor: string
  selectedSize?: string
  customImageUrl?: string
  customImageData?: CustomImageData
  totalPrice: number
}

export interface CustomImageData {
  rotation: number
  scale: number
  positionX: number
  positionY: number
  flipHorizontal: boolean
  flipVertical: boolean
  text?: TextOverlay[]
  designData?: string // JSON string of full design data from CanvasEditor
}

export interface TextOverlay {
  id: string
  content: string
  fontFamily: string
  fontSize: number
  color: string
  x: number
  y: number
  rotation: number
}

export interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: string
  city: string
  state?: string
  postalCode: string
  country: string
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  status: OrderStatus
  subtotal: number
  shippingCost: number
  tax: number
  total: number
  items: OrderItem[]
  createdAt: Date
  updatedAt: Date
}

export type PaymentMethod = 'UPI_PHONEPE' | 'COD' | 'CARD'
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'

export interface OrderItem {
  id: string
  productId: string
  productName: string
  quantity: number
  price: number
  selectedColor: string
  selectedSize?: string
  isCustom: boolean
  customImageUrl?: string
  customImageData?: CustomImageData
}
