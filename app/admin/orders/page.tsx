'use client'

import { useEffect, useState } from 'react'
import { RefreshCcw, Search, ShoppingBag } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'

type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'delivered'
  | 'cancelled'

type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

type AdminOrder = {
  id: string
  total: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentMethod: string | null
  createdAt: string
  updatedAt: string
  items: unknown
  deliveryAddress: unknown
  customer: {
    id: string
    name: string
    email: string
  }
}

const orderStatusOptions: OrderStatus[] = [
  'pending',
  'confirmed',
  'preparing',
  'ready',
  'delivered',
  'cancelled'
]

const paymentStatusOptions: PaymentStatus[] = [
  'pending',
  'paid',
  'failed',
  'refunded'
]

const formatEnumValue = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [paymentFilter, setPaymentFilter] = useState<string>('all')
  const [total, setTotal] = useState(0)

  const getAuthHeaders = async () => {
    const { data } = await supabase.auth.getSession()
    const accessToken = data.session?.access_token
    const headers: Record<string, string> = {}
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`
    }
    return headers
  }

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.set('status', statusFilter)
      if (paymentFilter !== 'all') params.set('paymentStatus', paymentFilter)
      if (search.trim()) params.set('search', search.trim())

      const headers = await getAuthHeaders()
      const response = await fetch(`/api/admin/orders?${params.toString()}`, {
        headers,
        cache: 'no-store'
      })

      if (response.status === 401) {
        throw new Error('Please sign in again to continue.')
      }

      if (response.status === 403) {
        throw new Error('Your account is not allowed to manage orders.')
      }

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        throw new Error(payload?.error || 'Failed to load orders')
      }

      const payload = await response.json()
      setOrders(payload?.data || [])
      setTotal(payload?.pagination?.total || 0)
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to load orders'
      setError(message)
      setOrders([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }

  const updateOrder = async (
    orderId: string,
    patch: Partial<Pick<AdminOrder, 'status' | 'paymentStatus'>>
  ) => {
    try {
      setUpdatingId(orderId)
      const headers = await getAuthHeaders()
      const response = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify({
          id: orderId,
          ...patch
        })
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        throw new Error(payload?.error || 'Failed to update order')
      }

      const updated = (await response.json()) as AdminOrder
      setOrders((prev) => prev.map((order) => (order.id === orderId ? updated : order)))
      toast.success('Order updated')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to update order')
    } finally {
      setUpdatingId(null)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  if (loading) {
    return (
      <div className="surface-panel flex min-h-[55vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <section className="surface-warm p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Order Management</h1>
            <p className="mt-2 text-gray-600">
              Track, confirm, and fulfill customer orders.
            </p>
          </div>
          <Button variant="outline" onClick={fetchOrders}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </section>

      <section className="surface-panel p-5 md:p-6">
        <div className="grid gap-3 md:grid-cols-[1fr_auto_auto_auto] md:items-end">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by customer name or email"
                className="pl-9"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="all">All</option>
              {orderStatusOptions.map((status) => (
                <option key={status} value={status}>
                  {formatEnumValue(status)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Payment
            </label>
            <select
              value={paymentFilter}
              onChange={(event) => setPaymentFilter(event.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="all">All</option>
              {paymentStatusOptions.map((status) => (
                <option key={status} value={status}>
                  {formatEnumValue(status)}
                </option>
              ))}
            </select>
          </div>

          <Button onClick={fetchOrders}>Apply</Button>
        </div>
      </section>

      <section className="surface-panel p-5 md:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-black text-gray-900">Orders</h2>
          <p className="text-sm text-gray-500">{total} total</p>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-2xl border border-black/5 bg-white/80 p-10 text-center">
            <ShoppingBag className="mx-auto h-10 w-10 text-gray-300" />
            <p className="mt-3 text-sm text-gray-500">No orders found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => {
              const itemsCount = Array.isArray(order.items) ? order.items.length : 0
              const isUpdating = updatingId === order.id

              return (
                <div
                  key={order.id}
                  className="rounded-2xl border border-black/5 bg-white/90 p-4"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        #{order.id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-sm text-gray-500">{order.customer.name}</p>
                      <p className="text-xs text-gray-400">{order.customer.email}</p>
                      <p className="mt-2 text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleString()} • {itemsCount} item
                        {itemsCount === 1 ? '' : 's'}
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 md:items-end">
                      <p className="text-lg font-bold text-gray-900">
                        {formatPrice(order.total)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Payment method: {order.paymentMethod || 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Order Status
                      </label>
                      <select
                        value={order.status}
                        onChange={(event) =>
                          updateOrder(order.id, {
                            status: event.target.value as OrderStatus
                          })
                        }
                        disabled={isUpdating}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:opacity-60"
                      >
                        {orderStatusOptions.map((status) => (
                          <option key={status} value={status}>
                            {formatEnumValue(status)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Payment Status
                      </label>
                      <select
                        value={order.paymentStatus}
                        onChange={(event) =>
                          updateOrder(order.id, {
                            paymentStatus: event.target.value as PaymentStatus
                          })
                        }
                        disabled={isUpdating}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:opacity-60"
                      >
                        {paymentStatusOptions.map((status) => (
                          <option key={status} value={status}>
                            {formatEnumValue(status)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
