'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { getOrderByNumber } from '@/lib/supabase/api'
import type { Order } from '@/lib/supabase/types'
import { CheckCircle, Package, Truck, Mail, Phone, MapPin } from 'lucide-react'
import Link from 'next/link'

function OrderConfirmationContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderNumber = searchParams.get('order')
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orderNumber) {
      router.push('/')
      return
    }

    const loadOrder = async () => {
      try {
        const data = await getOrderByNumber(orderNumber)
        if (data) {
          setOrder(data)
        } else {
          alert('Order not found')
          router.push('/')
        }
      } catch (error) {
        console.error('Error loading order:', error)
        alert('Failed to load order details')
        router.push('/')
      } finally {
        setLoading(false)
      }
    }

    loadOrder()
  }, [orderNumber, router])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse max-w-3xl mx-auto">
          <div className="h-12 bg-gray-200 rounded w-3/4 mx-auto mb-8" />
          <div className="space-y-4">
            <div className="h-32 bg-gray-100 rounded-lg" />
            <div className="h-32 bg-gray-100 rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-display font-bold mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 text-lg">Thank you for your order</p>
        </div>

        {/* Order Number */}
        <div className="card p-6 mb-6 text-center bg-gradient-to-r from-pink-50 to-purple-50">
          <p className="text-sm text-gray-600 mb-1">Your Order Number</p>
          <p className="text-3xl font-bold text-pink-600 mb-3">{order.order_number}</p>
          <p className="text-sm text-gray-600">
            Save this number to track your order
          </p>
        </div>

        {/* Order Status */}
        <div className="card p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Package className="w-6 h-6 text-pink-600" />
            Order Status
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Status</span>
              <span className="px-4 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                {order.order_status}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Payment</span>
              <span className={`px-4 py-1 rounded-full text-sm font-medium ${
                order.payment_status === 'COMPLETED' 
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {order.payment_status}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Payment Method</span>
              <span className="font-medium">{order.payment_method}</span>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="card p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">What's Next?</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="bg-pink-100 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Order Confirmation Email</h3>
                <p className="text-sm text-gray-600">
                  We've sent an order confirmation to <strong>{order.customer_email}</strong>
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-purple-100 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Order Processing</h3>
                <p className="text-sm text-gray-600">
                  We'll start processing your order and send updates via email and SMS
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                <Truck className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Shipping Updates</h3>
                <p className="text-sm text-gray-600">
                  You'll receive tracking information once your order ships
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Information */}
        <div className="card p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-pink-600" />
            Delivery Information
          </h2>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-600">Delivering to:</span>
              <p className="font-medium">{order.customer_name}</p>
            </div>
            <div>
              <span className="text-gray-600">Address:</span>
              <p className="font-medium">{order.shipping_address}</p>
              <p className="font-medium">{order.city}, {order.state} {order.postal_code}</p>
              <p className="font-medium">{order.country}</p>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Phone className="w-4 h-4" />
              <span>{order.customer_phone}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Mail className="w-4 h-4" />
              <span>{order.customer_email}</span>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="card p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">₹{Number(order.subtotal).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">₹{Number(order.shipping_cost).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span className="font-medium">₹{Number(order.tax).toFixed(2)}</span>
            </div>
            <div className="border-t pt-3 flex justify-between text-lg">
              <span className="font-bold">Total</span>
              <span className="font-bold text-pink-600">₹{Number(order.total).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Need Help */}
        <div className="card p-6 mb-6 bg-gray-50">
          <h3 className="font-semibold mb-2">Need Help?</h3>
          <p className="text-sm text-gray-600 mb-4">
            If you have any questions about your order, please contact us with your order number.
          </p>
          <div className="flex gap-3">
            <Link href="/products" className="btn-primary flex-1 text-center">
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Number Reminder */}
        <div className="text-center text-sm text-gray-500">
          <p>Keep your order number <strong className="text-gray-700">{order.order_number}</strong> handy to track your order</p>
        </div>
      </div>
    </div>
  )
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <OrderConfirmationContent />
    </Suspense>
  )
}
