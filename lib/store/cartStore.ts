import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem, CustomImageData } from '@/types/order'

interface CartStore {
  items: CartItem[]
  
  addItem: (item: Omit<CartItem, 'id' | 'totalPrice'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  updateCustomization: (id: string, customImageUrl: string, customImageData: CustomImageData) => void
  clearCart: () => void
  
  getTotalItems: () => number
  getSubtotal: () => number
  getTotalPrice: () => number // Backward compatibility
  getItemById: (id: string) => CartItem | undefined
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const items = get().items
        const totalPrice = item.product.basePrice * item.quantity
        
        // Check if same product with same config exists
        const existingItemIndex = items.findIndex(
          i => i.productId === item.productId && 
               i.selectedColor === item.selectedColor &&
               i.selectedSize === item.selectedSize &&
               !i.customImageUrl // Don't merge custom items
        )
        
        if (existingItemIndex > -1 && !item.customImageUrl) {
          // Update quantity of existing item
          const updatedItems = [...items]
          updatedItems[existingItemIndex].quantity += item.quantity
          updatedItems[existingItemIndex].totalPrice = 
            updatedItems[existingItemIndex].product.basePrice * 
            updatedItems[existingItemIndex].quantity
          set({ items: updatedItems })
        } else {
          // Add as new item
          const newItem: CartItem = {
            ...item,
            id: `${item.productId}-${Date.now()}-${Math.random()}`,
            totalPrice,
          }
          set({ items: [...items, newItem] })
        }
      },
      
      removeItem: (id) => {
        set({ items: get().items.filter(item => item.id !== id) })
      },
      
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        
        const items = get().items.map(item => {
          if (item.id === id) {
            return {
              ...item,
              quantity,
              totalPrice: item.product.basePrice * quantity,
            }
          }
          return item
        })
        set({ items })
      },
      
      updateCustomization: (id, customImageUrl, customImageData) => {
        const items = get().items.map(item => {
          if (item.id === id) {
            return {
              ...item,
              customImageUrl,
              customImageData,
            }
          }
          return item
        })
        set({ items })
      },
      
      clearCart: () => set({ items: [] }),
      
      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },
      
      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.totalPrice, 0)
      },
      
      getTotalPrice: () => {
        // Backward compatibility - same as getSubtotal
        return get().getSubtotal()
      },
      
      getItemById: (id) => {
        return get().items.find(item => item.id === id)
      },
    }),
    {
      name: 'cart-storage',
    }
  )
)
