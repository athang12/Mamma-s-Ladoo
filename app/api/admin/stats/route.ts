import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // Get total products
    const { count: totalProducts } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })

    // Get total orders
    const { count: totalOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })

    // Get total revenue
    const { data: orders } = await supabase
      .from('orders')
      .select('total')
      .eq('payment_status', 'COMPLETED')

    const totalRevenue = orders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0

    // Get unique customers (by email)
    const { data: customers } = await supabase
      .from('orders')
      .select('customer_email')

    const uniqueCustomers = new Set(customers?.map(c => c.customer_email) || []).size

    return NextResponse.json({
      totalProducts: totalProducts || 0,
      totalOrders: totalOrders || 0,
      totalRevenue: totalRevenue,
      totalCustomers: uniqueCustomers,
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json(
      { error: 'Failed to load stats' },
      { status: 500 }
    )
  }
}
