'use client'

import { useState, useEffect } from 'react'
import { getAllOrders, updateOrderStatus, updatePaymentStatus } from '@/lib/supabase/api'
import type { Order } from '@/lib/supabase/types'
import { Package, Eye, Truck, CheckCircle, XCircle, Clock, DollarSign } from 'lucide-react'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    setLoading(true)
    try {
      const data = await getAllOrders()
      setOrders(data)
    } catch (error) {
      console.error('Error loading orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (orderId: string, status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED') => {
    try {
      await updateOrderStatus(orderId, status)
      await loadOrders()
      if (selectedOrder?.id === orderId) {
        const updated = orders.find(o => o.id === orderId)
        if (updated) setSelectedOrder(updated)
      }
    } catch (error) {
      console.error('Error updating order status:', error)
      alert('Failed to update order status')
    }
  }

  const handlePaymentUpdate = async (orderId: string, status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED') => {
    try {
      await updatePaymentStatus(orderId, status)
      await loadOrders()
      if (selectedOrder?.id === orderId) {
        const updated = orders.find(o => o.id === orderId)
        if (updated) setSelectedOrder(updated)
      }
    } catch (error) {
      console.error('Error updating payment status:', error)
      alert('Failed to update payment status')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock className="w-5 h-5 text-yellow-500" />
      case 'PROCESSING': return <Package className="w-5 h-5 text-blue-500" />
      case 'SHIPPED': return <Truck className="w-5 h-5 text-purple-500" />
      case 'DELIVERED': return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'CANCELLED': return <XCircle className="w-5 h-5 text-red-500" />
      default: return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'PROCESSING': return 'bg-blue-100 text-blue-800'
      case 'SHIPPED': return 'bg-purple-100 text-purple-800'
      case 'DELIVERED': return 'bg-green-100 text-green-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800'
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'FAILED': return 'bg-red-100 text-red-800'
      case 'REFUNDED': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(o => o.order_status === filterStatus)

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-8" />
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-100 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-display font-bold mb-2">Manage Orders</h1>
        <p className="text-gray-600">Track and manage customer orders</p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {['all', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              filterStatus === status
                ? 'bg-pink-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {status === 'all' ? 'All Orders' : status.charAt(0) + status.slice(1).toLowerCase()}
            {status !== 'all' && (
              <span className="ml-2 text-xs">
                ({orders.filter(o => o.order_status === status).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="grid gap-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No orders found</p>
            <p className="text-gray-400 text-sm">
              {filterStatus === 'all' 
                ? 'Orders will appear here once customers start ordering'
                : `No ${filterStatus.toLowerCase()} orders`}
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Order Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold">{order.order_number}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.order_status)}`}>
                      {order.order_status}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.payment_status)}`}>
                      {order.payment_status}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    <div><strong>Customer:</strong> {order.customer_name}</div>
                    <div><strong>Email:</strong> {order.customer_email}</div>
                    <div><strong>Phone:</strong> {order.customer_phone}</div>
                    <div><strong>Payment:</strong> {order.payment_method}</div>
                  </div>
                </div>

                {/* Order Stats */}
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-pink-600">
                      ${Number(order.total).toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">Total</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-700">
                      {new Date(order.created_at).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">Order Date</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 lg:w-64">
                  {/* Order Status */}
                  <select
                    value={order.order_status}
                    onChange={(e) => handleStatusUpdate(order.id, e.target.value as 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED')}
                    className="px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-pink-400 outline-none"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>

                  {/* Payment Status */}
                  <select
                    value={order.payment_status}
                    onChange={(e) => handlePaymentUpdate(order.id, e.target.value as 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED')}
                    className="px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-pink-400 outline-none"
                  >
                    <option value="PENDING">Payment Pending</option>
                    <option value="COMPLETED">Payment Completed</option>
                    <option value="FAILED">Payment Failed</option>
                    <option value="REFUNDED">Refunded</option>
                  </select>

                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="btn-primary flex items-center justify-center gap-2 py-2 text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-1">{selectedOrder.order_number}</h2>
                <p className="text-gray-600">Order placed on {new Date(selectedOrder.created_at).toLocaleString()}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Status */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold mb-3">Order Status</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Order Status</div>
                    <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.order_status)}`}>
                      {selectedOrder.order_status}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Payment Status</div>
                    <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(selectedOrder.payment_status)}`}>
                      {selectedOrder.payment_status}
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <h3 className="font-semibold mb-3">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Name</div>
                    <div className="font-medium">{selectedOrder.customer_name}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Email</div>
                    <div className="font-medium">{selectedOrder.customer_email}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Phone</div>
                    <div className="font-medium">{selectedOrder.customer_phone}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Payment Method</div>
                    <div className="font-medium">{selectedOrder.payment_method}</div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="font-semibold mb-3">Shipping Address</h3>
                <div className="text-sm">
                  <div>{selectedOrder.shipping_address}</div>
                  <div>{selectedOrder.city}, {selectedOrder.state} {selectedOrder.postal_code}</div>
                  <div>{selectedOrder.country}</div>
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h3 className="font-semibold mb-3">Order Summary</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium">${Number(selectedOrder.subtotal).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-medium">${Number(selectedOrder.shipping_cost).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span className="font-medium">${Number(selectedOrder.tax).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total</span>
                    <span className="text-pink-600">${Number(selectedOrder.total).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {selectedOrder.payment_transaction_id && (
                <div>
                  <h3 className="font-semibold mb-2">Transaction ID</h3>
                  <code className="text-sm bg-gray-100 px-3 py-1 rounded">
                    {selectedOrder.payment_transaction_id}
                  </code>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
