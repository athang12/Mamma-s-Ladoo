import { NextRequest, NextResponse } from 'next/server'
import { initiatePayment } from '@/lib/phonepe/client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { orderId, amount, customerName, customerEmail, customerPhone } = body

    // Validate required fields
    if (!orderId || !amount || !customerPhone) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Initiate payment with PhonePe
    const paymentResponse = await initiatePayment({
      orderId,
      amount,
      customerName,
      customerEmail,
      customerPhone,
    })

    if (!paymentResponse.success) {
      return NextResponse.json(
        { success: false, message: paymentResponse.message },
        { status: 500 }
      )
    }

    // Return redirect URL
    return NextResponse.json({
      success: true,
      redirectUrl: paymentResponse.data?.instrumentResponse?.redirectInfo?.url,
      merchantTransactionId: paymentResponse.data?.merchantTransactionId,
    })
  } catch (error) {
    console.error('Payment initiation error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
