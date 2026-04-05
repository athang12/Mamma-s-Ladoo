import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

/**
 * Poll for payment confirmation
 * Checks if a payment has been received for the given order amount
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderNumber, amount } = body

    if (!orderNumber || !amount) {
      return NextResponse.json(
        { success: false, message: 'Order number and amount required' },
        { status: 400 }
      )
    }

    // Check if there's a payment log with this exact amount in the last 30 minutes
    const { data: paymentLogs, error: logsError } = await supabase
      .from('payment_logs')
      .select('*')
      .eq('amount', amount)
      .gte('created_at', new Date(Date.now() - 30 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false })
      .limit(1)

    if (logsError) {
      console.error('Error checking payment logs:', logsError)
      return NextResponse.json(
        { success: false, message: 'Error checking payment status' },
        { status: 500 }
      )
    }

    // If no payment found
    if (!paymentLogs || paymentLogs.length === 0) {
      return NextResponse.json({
        success: false,
        status: 'waiting',
        message: 'Payment not yet received',
      })
    }

    const paymentLog = paymentLogs[0]

    // Check if this payment is already matched to our order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('order_number', orderNumber)
      .single()

    if (orderError) {
      console.error('Error fetching order:', orderError)
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      )
    }

    // If payment is already completed
    if (order.payment_status === 'COMPLETED') {
      return NextResponse.json({
        success: true,
        status: 'completed',
        message: 'Payment confirmed',
        data: {
          utr: order.payment_transaction_id,
          paidAt: order.payment_completed_at,
        },
      })
    }

    // If payment log exists but not yet matched, try to match it
    if (paymentLog && !paymentLog.processed) {
      // Update order payment status
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          payment_status: 'COMPLETED',
          payment_completed_at: new Date().toISOString(),
          payment_transaction_id: paymentLog.utr_number,
          updated_at: new Date().toISOString(),
        })
        .eq('id', order.id)

      if (updateError) {
        console.error('Error updating order:', updateError)
        return NextResponse.json(
          { success: false, message: 'Error updating order status' },
          { status: 500 }
        )
      }

      // Mark payment log as processed
      await supabase
        .from('payment_logs')
        .update({
          processed: true,
          matched_order_id: order.id,
          processed_at: new Date().toISOString(),
        })
        .eq('id', paymentLog.id)

      return NextResponse.json({
        success: true,
        status: 'completed',
        message: 'Payment confirmed',
        data: {
          utr: paymentLog.utr_number,
          paidAt: paymentLog.created_at,
        },
      })
    }

    // Payment exists but already processed for different order
    if (paymentLog && paymentLog.processed && paymentLog.matched_order_id !== order.id) {
      return NextResponse.json({
        success: false,
        status: 'conflict',
        message: 'Payment already used for another order. Please contact support.',
      })
    }

    // Fallback: waiting
    return NextResponse.json({
      success: false,
      status: 'waiting',
      message: 'Payment processing...',
    })
  } catch (error) {
    console.error('Payment poll error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
