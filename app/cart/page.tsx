'use client'

import { useCartStore } from '@/lib/store'
import Link from 'next/link'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotalPrice } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 sm:py-16 md:py-20 text-center">
        <ShoppingBag className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-4 sm:mb-6 text-gray-300" />
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-3 sm:mb-4">
          Your Cart is Empty
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
          Add your favorite ladoos and snacks to get started.
        </p>
        <Link href="/products" className="btn-primary inline-block tap-highlight-transparent">
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 md:py-12">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-4 sm:mb-6 md:mb-8">
        Shopping Cart
      </h1>

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-3 sm:space-y-4">
          {items.filter(item => item.product).map((item) => (
            <div key={item.id} className="card p-4 sm:p-5 md:p-6">
              <div className="flex items-start sm:items-center gap-3 sm:gap-4 md:gap-6">
                <img
                  src={item.product.thumbnailUrl}
                  alt={item.product.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg sm:rounded-xl flex-shrink-0"
                  loading="lazy"
                />
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm sm:text-base md:text-lg mb-1 truncate">
                    {item.product.name}
                  </h3>
                  <p className="text-pink-600 font-bold mb-2 text-sm sm:text-base">
                    ₹{item.product.basePrice.toFixed(2)}
                  </p>
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-9 h-9 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center tap-highlight-transparent"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                    <span className="font-semibold w-6 sm:w-8 text-center text-sm sm:text-base">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-9 h-9 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center tap-highlight-transparent"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <p className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-4">
                    ₹{item.totalPrice.toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700 p-1 tap-highlight-transparent"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card p-4 sm:p-5 md:p-6 lg:sticky lg:top-24">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6">
              Order Summary
            </h2>
            
            <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 text-sm sm:text-base">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">₹{getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold">
                  {getTotalPrice() >= 500 ? 'FREE' : '₹40.00'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-semibold">₹{(getTotalPrice() * 0.1).toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 sm:pt-3 flex justify-between">
                <span className="text-lg sm:text-xl font-bold">Total</span>
                <span className="text-lg sm:text-xl font-bold text-pink-600">
                  ₹{(getTotalPrice() * 1.1 + (getTotalPrice() >= 500 ? 0 : 40)).toFixed(2)}
                </span>
              </div>
            </div>

            {getTotalPrice() < 500 && (
              <div className="bg-pink-50 text-pink-700 p-3 sm:p-4 rounded-xl mb-4 sm:mb-6 text-xs sm:text-sm">
                Add ₹{(500 - getTotalPrice()).toFixed(2)} more to get free shipping!
              </div>
            )}

            <Link 
              href="/checkout" 
              className="btn-primary w-full block text-center mb-3 text-sm sm:text-base tap-highlight-transparent"
            >
              Proceed to Checkout
            </Link>
            <Link 
              href="/products" 
              className="btn-secondary w-full block text-center text-sm sm:text-base tap-highlight-transparent"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
