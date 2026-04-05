import { NextRequest, NextResponse } from 'next/server'
import { checkPaymentStatus } from '@/lib/phonepe/client'
import { updatePaymentStatus } from '@/lib/supabase/api'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { merchantTransactionId } = body

    if (!merchantTransactionId) {
      return NextResponse.json(
        { success: false, message: 'Transaction ID required' },
        { status: 400 }
      )
    }

    // Check status with PhonePe
    const statusResponse = await checkPaymentStatus(merchantTransactionId)

    // Extract order ID from transaction ID
    const orderIdMatch = merchantTransactionId.match(/TXN_([^_]+)_/)
    const orderId = orderIdMatch ? orderIdMatch[1] : null

    if (orderId && statusResponse.success) {
      // Update payment status in database
      let paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED' = 'PENDING'
      
      if (statusResponse.code === 'PAYMENT_SUCCESS') {
        paymentStatus = 'COMPLETED'
      } else if (statusResponse.code === 'PAYMENT_ERROR' || statusResponse.code === 'PAYMENT_DECLINED') {
        paymentStatus = 'FAILED'
      }

      await updatePaymentStatus(orderId, paymentStatus)
    }

    return NextResponse.json({
      success: statusResponse.success,
      code: statusResponse.code,
      message: statusResponse.message,
    })
  } catch (error) {
    console.error('Payment status check error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to check payment status' },
      { status: 500 }
    )
  }
}
