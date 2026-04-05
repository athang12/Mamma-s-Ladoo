import { NextRequest, NextResponse } from 'next/server'
import { verifyChecksum } from '@/lib/phonepe/client'
import { updatePaymentStatus } from '@/lib/supabase/api'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const xVerify = request.headers.get('X-VERIFY') || ''
    
    // Verify checksum
    const isValid = verifyChecksum(xVerify, JSON.stringify(body))
    
    if (!isValid) {
      console.error('Invalid checksum from PhonePe callback')
      return NextResponse.json(
        { success: false, message: 'Invalid checksum' },
        { status: 401 }
      )
    }

    const { response } = body
    
    if (!response) {
      return NextResponse.json(
        { success: false, message: 'Invalid callback data' },
        { status: 400 }
      )
    }

    // Decode base64 response
    const decodedResponse = JSON.parse(Buffer.from(response, 'base64').toString())
    
    const { 
      success, 
      code, 
      data 
    } = decodedResponse

    // Extract order ID from merchant transaction ID (format: TXN_{orderId}_{timestamp})
    const merchantTransactionId = data?.merchantTransactionId || ''
    const orderIdMatch = merchantTransactionId.match(/TXN_([^_]+)_/)
    const orderId = orderIdMatch ? orderIdMatch[1] : null

    if (!orderId) {
      console.error('Could not extract order ID from transaction:', merchantTransactionId)
      return NextResponse.json(
        { success: false, message: 'Invalid transaction ID' },
        { status: 400 }
      )
    }

    // Update payment status in database
    let paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED' = 'PENDING'
    
    if (success && code === 'PAYMENT_SUCCESS') {
      paymentStatus = 'COMPLETED'
    } else if (code === 'PAYMENT_ERROR' || code === 'PAYMENT_DECLINED') {
      paymentStatus = 'FAILED'
    }

    await updatePaymentStatus(orderId, paymentStatus)

    console.log(`Payment callback for order ${orderId}: ${paymentStatus}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Payment callback error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
