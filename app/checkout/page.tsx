'use client'

import { useCartStore } from '@/lib/store'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CreditCard, Lock, CheckCircle, Smartphone, AlertCircle } from 'lucide-react'
import { createOrder } from '@/lib/supabase/api'
import { uploadCustomImageFromDataURL } from '@/lib/supabase/client'
import { generateUniqueAmount } from '@/lib/upi/utils'
import OTPVerificationModal from '@/components/checkout/OTPVerificationModal'

export const dynamic = 'force-dynamic'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCartStore()
  const [processing, setProcessing] = useState(false)
  const [orderNumber, setOrderNumber] = useState<string | null>(null)
  const [showOTPModal, setShowOTPModal] = useState(false)
  const [emailVerified, setEmailVerified] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    paymentMethod: 'COD', // COD or UPI_PHONEPE
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Step 1: Validate form
    if (!formData.email || !formData.name || !formData.phone) {
      alert('Please fill in all required fields')
      return
    }

    // Check minimum amount for UPI payments (most banks require ₹50 minimum)
    const subtotal = getTotalPrice()
    const shipping = subtotal >= 50 ? 0 : 5.99
    const tax = subtotal * 0.1
    const total = subtotal + shipping + tax

    if (formData.paymentMethod === 'UPI_SMS' && total < 50) {
      alert(`⚠️ UPI Payment Minimum: ₹50\n\nYour order total is ₹${total.toFixed(2)}.\nMost banks require a minimum of ₹50 for UPI transactions.\n\nPlease add more items to your cart or choose Cash on Delivery.`)
      return
    }

    // Step 2: Send OTP if not verified yet
    if (!emailVerified) {
      setProcessing(true)
      try {
        const response = await fetch('/api/otp/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to send OTP')
        }

        console.log('✅ OTP sent to email:', formData.email)
        
        // Show OTP modal
        setShowOTPModal(true)
      } catch (error) {
        console.error('Error sending OTP:', error)
        const errorMessage = error instanceof Error ? error.message : 'Failed to send verification code'
        alert(errorMessage)
      } finally {
        setProcessing(false)
      }
      return
    }

    // Step 3: Process order (after email is verified)
    setProcessing(true)
    
    try {
      // Upload custom images to Supabase Storage if any
      const itemsWithUploadedImages = await Promise.all(
        items.map(async (item) => {
          if (item.customImageUrl && item.customImageUrl.startsWith('data:')) {
            try {
              // Generate unique filename
              const filename = `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.png`
              const uploadResult = await uploadCustomImageFromDataURL(item.customImageUrl, filename)
              
              return {
                ...item,
                customImageUrl: uploadResult.url,
              }
            } catch (error) {
              console.error('Error uploading custom image:', error)
              return item
            }
          }
          return item
        })
      )

      // Calculate order totals
      const subtotal = getTotalPrice()
      const shipping = subtotal >= 50 ? 0 : 5.99
      const tax = subtotal * 0.1
      let total = subtotal + shipping + tax

      // For UPI_SMS: Generate unique amount with random paise to avoid conflicts
      if (formData.paymentMethod === 'UPI_SMS') {
        total = generateUniqueAmount(total)
      }

      // Prepare order data and items separately
      const orderData = {
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        shipping_address: formData.address,
        city: formData.city,
        state: formData.state || null,
        postal_code: formData.postalCode,
        country: formData.country,
        subtotal,
        shipping_cost: shipping,
        tax,
        total,
        payment_method: formData.paymentMethod as 'UPI_PHONEPE' | 'COD',
        payment_status: 'PENDING' as const,
        order_status: 'PENDING' as const,
        payment_transaction_id: null,
        payment_completed_at: null,
        shipped_at: null,
        delivered_at: null,
      }

      const orderItems = itemsWithUploadedImages.map((item) => ({
        product_id: item.productId,
        product_name: item.product.name,
        product_price: item.product.basePrice,
        quantity: item.quantity,
        selected_color: item.selectedColor,
        selected_size: null, // Size not implemented yet
        is_custom: !!item.customImageUrl,
        custom_image_url: item.customImageUrl || null,
        custom_image_data: item.customImageData || null,
        item_total: item.totalPrice,
      }))

      // Create order in database
      const result = await createOrder(orderData, orderItems)

      // Handle different payment methods
      if (formData.paymentMethod === 'UPI_SMS') {
        // For UPI SMS payments, redirect to payment page
        // Navigate first, then clear cart after navigation starts
        router.push(`/payment/upi?orderNumber=${result.order.order_number}&amount=${total}`)
        setTimeout(() => clearCart(), 100)
        return
      }
      
      // If PhonePe UPI payment selected, initiate payment
      if (formData.paymentMethod === 'UPI_PHONEPE') {
        try {
          const paymentResponse = await fetch('/api/payment/initiate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: result.order.order_number,
              amount: total,
              customerName: formData.name,
              customerEmail: formData.email,
              customerPhone: formData.phone,
            }),
          })

          const paymentData = await paymentResponse.json()

          if (paymentData.success && paymentData.redirectUrl) {
            // Clear cart and redirect to PhonePe payment page
            clearCart()
            window.location.href = paymentData.redirectUrl
            return
          } else {
            throw new Error(paymentData.message || 'Payment initiation failed')
          }
        } catch (error) {
          console.error('Payment initiation error:', error)
          alert('Failed to initiate payment. Please try COD instead.')
          setProcessing(false)
          return
        }
      }

      // For COD orders, show success and redirect
      setOrderNumber(result.order.order_number)
      clearCart()
      
      // Show success message for a moment before redirect
      setTimeout(() => {
        router.push(`/order-confirmation?order=${result.order.order_number}`)
      }, 2000)
    } catch (error) {
      console.error('Error creating order:', error)
      alert('Failed to place order. Please try again.')
      setProcessing(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleOTPVerified = () => {
    setEmailVerified(true)
    setShowOTPModal(false)
    // Automatically submit the form after verification
    setTimeout(() => {
      const form = document.getElementById('checkout-form') as HTMLFormElement
      form?.requestSubmit()
    }, 100)
  }

  const handleCloseOTPModal = () => {
    setShowOTPModal(false)
    setProcessing(false)
  }

  if (items.length === 0 && !processing) {
    router.push('/cart')
    return null
  }

  const subtotal = getTotalPrice()
  const shipping = subtotal >= 50 ? 0 : 5.99
  const tax = subtotal * 0.1
  const total = subtotal + shipping + tax

  // Show success state
  if (orderNumber) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-green-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-2">Your order number is:</p>
          <p className="text-2xl font-bold text-pink-600 mb-6">{orderNumber}</p>
          <p className="text-sm text-gray-500">
            Redirecting to order confirmation...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-display font-bold mb-8">Checkout</h1>

      {/* OTP Verification Modal */}
      <OTPVerificationModal
        email={formData.email}
        isOpen={showOTPModal}
        onVerify={handleOTPVerified}
        onClose={handleCloseOTPModal}
      />

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Contact Information */}
            <div className="card p-6">
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block font-semibold mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="John Doe"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="card p-6">
              <h2 className="text-2xl font-bold mb-6">Shipping Address</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block font-semibold mb-2">Street Address *</label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="123 Main Street"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold mb-2">City *</label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Mumbai"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-2">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Maharashtra"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-2">Postal Code *</label>
                    <input
                      type="text"
                      name="postalCode"
                      required
                      value={formData.postalCode}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="400001"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-2">Country *</label>
                  <select
                    name="country"
                    required
                    value={formData.country}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option>India</option>
                    <option>United States</option>
                    <option>Canada</option>
                    <option>United Kingdom</option>
                    <option>Australia</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="card p-6">
              <h2 className="text-2xl font-bold mb-6">Payment Method</h2>
              
              <div className="space-y-3">
                {/* Cash on Delivery */}
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={formData.paymentMethod === 'COD'}
                    onChange={handleChange}
                    className="mr-3"
                  />
                  <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border-2 border-green-200">
                    <CreditCard className="w-6 h-6 text-green-600" />
                    <div>
                      <span className="font-semibold block">Cash on Delivery (COD)</span>
                      <span className="text-sm text-gray-600">Pay when you receive</span>
                    </div>
                  </div>
                </label>

                {/* UPI Payment (SMS-based) */}
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="UPI_SMS"
                    checked={formData.paymentMethod === 'UPI_SMS'}
                    onChange={handleChange}
                    className="mr-3"
                  />
                  <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border-2 border-blue-200">
                    <Smartphone className="w-6 h-6 text-blue-600" />
                    <div>
                      <span className="font-semibold block">UPI Payment</span>
                      <span className="text-sm text-gray-600">Pay via any UPI app (GPay, PhonePe, Paytm)</span>
                    </div>
                  </div>
                </label>
              </div>

              {/* UPI Minimum Warning */}
              {formData.paymentMethod === 'UPI_SMS' && total < 50 && (
                <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-yellow-800">UPI Minimum Amount: ₹50</p>
                      <p className="text-sm text-yellow-700 mt-1">
                        Your current total is ₹{total.toFixed(2)}. Most banks require a minimum of ₹50 for UPI transactions.
                        Please add ₹{(50 - total).toFixed(2)} more to your cart or choose Cash on Delivery.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <p className="text-sm text-gray-600 flex items-center mt-4">
                <Lock className="w-4 h-4 mr-2" />
                Your payment information is secure and encrypted
              </p>
            </div>

            <button 
              type="submit" 
              disabled={processing}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing 
                ? 'Processing...' 
                : emailVerified 
                  ? `Place Order - ₹${total.toFixed(2)}`
                  : 'Verify Email & Place Order'
              }
            </button>

            {!emailVerified && (
              <p className="text-xs text-gray-500 text-center mt-2">
                📧 We'll send a verification code to your email
              </p>
            )}
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <img
                    src={item.product.thumbnailUrl}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{item.product.name}</p>
                    <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-bold">₹{item.totalPrice.toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t pt-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold">{shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-semibold">₹{tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="text-xl font-bold">Total</span>
                <span className="text-xl font-bold text-pink-600">₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
