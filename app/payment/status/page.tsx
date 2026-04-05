'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { checkPaymentStatus } from '@/lib/phonepe/client'

function PaymentStatusContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<'checking' | 'success' | 'failed' | 'pending'>('checking')
  const [orderNumber, setOrderNumber] = useState<string>('')
  const [message, setMessage] = useState<string>('')

  useEffect(() => {
    const merchantTransactionId = searchParams.get('merchantTransactionId') || searchParams.get('transactionId')
    
    if (!merchantTransactionId) {
      setStatus('failed')
      setMessage('Invalid payment reference')
      return
    }

    // Extract order number from transaction ID (format: TXN_{orderId}_{timestamp})
    const orderIdMatch = merchantTransactionId.match(/TXN_([^_]+)_/)
    const orderId = orderIdMatch ? orderIdMatch[1] : ''
    setOrderNumber(orderId)

    // Check payment status with PhonePe
    const checkStatus = async () => {
      try {
        // Call our API endpoint to check status
        const response = await fetch('/api/payment/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ merchantTransactionId }),
        })

        const result = await response.json()

        if (result.success && result.code === 'PAYMENT_SUCCESS') {
          setStatus('success')
          setMessage('Payment completed successfully!')
        } else if (result.code === 'PAYMENT_PENDING') {
          setStatus('pending')
          setMessage('Payment is being processed. Please wait...')
        } else {
          setStatus('failed')
          setMessage(result.message || 'Payment failed. Please try again.')
        }
      } catch (error) {
        console.error('Error checking payment status:', error)
        setStatus('failed')
        setMessage('Unable to verify payment status')
      }
    }

    checkStatus()
  }, [searchParams])

  const renderStatusIcon = () => {
    switch (status) {
      case 'checking':
        return <Loader2 className="w-24 h-24 text-purple-600 animate-spin" />
      case 'success':
        return <CheckCircle className="w-24 h-24 text-green-600" />
      case 'failed':
        return <XCircle className="w-24 h-24 text-red-600" />
      case 'pending':
        return <Clock className="w-24 h-24 text-orange-600" />
    }
  }

  const renderStatusTitle = () => {
    switch (status) {
      case 'checking':
        return 'Checking Payment Status...'
      case 'success':
        return 'Payment Successful!'
      case 'failed':
        return 'Payment Failed'
      case 'pending':
        return 'Payment Pending'
    }
  }

  const renderStatusMessage = () => {
    switch (status) {
      case 'checking':
        return 'Please wait while we verify your payment...'
      case 'success':
        return `Your order ${orderNumber} has been confirmed. We've sent a confirmation email with order details.`
      case 'failed':
        return message || 'Your payment could not be processed. Please try again or contact support.'
      case 'pending':
        return 'Your payment is being processed. You will receive a confirmation once completed.'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
          {/* Status Icon */}
          <div className="flex justify-center mb-6">
            {renderStatusIcon()}
          </div>

          {/* Status Title */}
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {renderStatusTitle()}
          </h1>

          {/* Status Message */}
          <p className="text-gray-600 text-lg mb-8">
            {renderStatusMessage()}
          </p>

          {/* Order Number */}
          {orderNumber && status !== 'checking' && (
            <div className="bg-gray-50 rounded-lg p-4 mb-8">
              <p className="text-sm text-gray-600 mb-1">Order Number</p>
              <p className="text-2xl font-bold text-purple-600">{orderNumber}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {status === 'success' && orderNumber && (
              <>
                <Link
                  href={`/order-confirmation?orderNumber=${orderNumber}`}
                  className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  View Order Details
                </Link>
                <Link
                  href="/products"
                  className="px-8 py-3 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-medium"
                >
                  Continue Shopping
                </Link>
              </>
            )}

            {status === 'failed' && (
              <>
                <Link
                  href="/checkout"
                  className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  Try Again
                </Link>
                <Link
                  href="/products"
                  className="px-8 py-3 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-medium"
                >
                  Back to Shop
                </Link>
              </>
            )}

            {status === 'pending' && orderNumber && (
              <>
                <button
                  onClick={() => window.location.reload()}
                  className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  Refresh Status
                </button>
                <Link
                  href={`/order-confirmation?orderNumber=${orderNumber}`}
                  className="px-8 py-3 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-medium"
                >
                  View Order
                </Link>
              </>
            )}
          </div>

          {/* Help Section */}
          {status !== 'checking' && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Need Help?</h3>
              <div className="space-y-2 text-gray-600">
                <p>
                  <strong>Email:</strong>{' '}
                  <a href="mailto:hello@mammaladoo.com" className="text-purple-600 hover:underline">
                    hello@mammaladoo.com
                  </a>
                </p>
                <p>
                  <strong>Phone:</strong>{' '}
                  <a href="tel:+919876543210" className="text-purple-600 hover:underline">
                    +91 98765 43210
                  </a>
                </p>
                <p className="text-sm mt-4">
                  Available Monday to Saturday, 10 AM - 7 PM IST
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function PaymentStatusPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Checking payment status...</div>}>
      <PaymentStatusContent />
    </Suspense>
  )
}
