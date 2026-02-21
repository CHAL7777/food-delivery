'use client'

import { useEffect, useMemo, useState } from 'react'
import { Eye, MapPin, PackageOpen, RefreshCcw, Search, ShoppingBag } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalTitle
} from '@/components/ui/Modal'
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

type OrderItem = {
  id: string
  name: string
  quantity: number
  price: number
}

type DeliveryAddress = {
  street?: string
  city?: string
  state?: string
  zipCode?: string
  phone?: string
  instructions?: string
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

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const toNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return fallback
}

const parseOrderItems = (value: unknown): OrderItem[] => {
  if (!Array.isArray(value)) return []

  return value
    .map((entry, index) => {
      if (!isRecord(entry)) return null

      const nameValue = entry.name
      const name = typeof nameValue === 'string' ? nameValue.trim() : ''
      if (!name) return null

      const id = typeof entry.id === 'string' ? entry.id : undefined
      const quantity = Math.max(1, Math.trunc(toNumber(entry.quantity, 1)))
      const price = Math.max(0, toNumber(entry.price, 0))

      return {
        id: id || `item-${index}`,
        name,
        quantity,
        price
      }
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
}

const parseDeliveryAddress = (value: unknown): DeliveryAddress => {
  if (!isRecord(value)) return {}

  const street = typeof value.street === 'string' ? value.street : undefined
  const city = typeof value.city === 'string' ? value.city : undefined
  const state = typeof value.state === 'string' ? value.state : undefined
  const zipCodeRaw =
    typeof value.zipCode === 'string'
      ? value.zipCode
      : typeof value.zip_code === 'string'
        ? value.zip_code
        : undefined
  const phone = typeof value.phone === 'string' ? value.phone : undefined
  const instructions =
    typeof value.instructions === 'string' ? value.instructions : undefined

  return {
    street,
    city,
    state,
    zipCode: zipCodeRaw,
    phone,
    instructions
  }
}

const formatAddressLine = (address: DeliveryAddress) => {
  const parts = [address.city, address.state, address.zipCode].filter(
    (part): part is string => Boolean(part && part.trim())
  )
  return parts.join(', ')
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [paymentFilter, setPaymentFilter] = useState<string>('all')
  const [total, setTotal] = useState(0)
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const detailItems = useMemo(
    () => (selectedOrder ? parseOrderItems(selectedOrder.items) : []),
    [selectedOrder]
  )
  const detailAddress = useMemo(
    () => parseDeliveryAddress(selectedOrder?.deliveryAddress),
    [selectedOrder]
  )
  const detailItemsTotal = useMemo(
    () =>
      detailItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [detailItems]
  )

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
      setSelectedOrder((prev) => (prev?.id === orderId ? updated : prev))
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
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedOrder(order)
                          setIsDetailsOpen(true)
                        }}
                      >
                        <Eye className="mr-1 h-4 w-4" />
                        Details
                      </Button>
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

      <Modal open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <ModalContent className="max-h-[85vh] w-[95vw] max-w-3xl overflow-hidden p-0 sm:rounded-2xl">
          <div className="max-h-[85vh] overflow-y-auto p-6 md:p-7 scrollbar-thin">
            {!selectedOrder ? null : (
              <div className="space-y-6">
                <ModalHeader>
                  <ModalTitle className="text-2xl font-black text-gray-900">
                    Order #{selectedOrder.id.slice(-8).toUpperCase()}
                  </ModalTitle>
                  <ModalDescription className="text-gray-600">
                    {selectedOrder.customer.name} • {selectedOrder.customer.email}
                  </ModalDescription>
                </ModalHeader>

                <div className="grid gap-4 rounded-2xl border border-black/5 bg-orange-50/40 p-4 sm:grid-cols-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Created
                    </p>
                    <p className="mt-1 text-sm font-medium text-gray-800">
                      {new Date(selectedOrder.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Status
                    </p>
                    <p className="mt-1 text-sm font-medium text-gray-800">
                      {formatEnumValue(selectedOrder.status)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Payment
                    </p>
                    <p className="mt-1 text-sm font-medium text-gray-800">
                      {formatEnumValue(selectedOrder.paymentStatus)} ({selectedOrder.paymentMethod || 'N/A'})
                    </p>
                  </div>
                </div>

                <section className="space-y-3">
                  <div className="flex items-center gap-2">
                    <PackageOpen className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-bold uppercase tracking-wide text-gray-700">
                      Items
                    </h3>
                  </div>

                  {detailItems.length === 0 ? (
                    <div className="rounded-xl border border-black/5 bg-gray-50 p-4 text-sm text-gray-500">
                      No item details found for this order.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {detailItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between rounded-xl border border-black/5 bg-white px-4 py-3"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-gray-900">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {item.quantity} x {formatPrice(item.price)}
                            </p>
                          </div>
                          <p className="text-sm font-semibold text-gray-900">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                <section className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-bold uppercase tracking-wide text-gray-700">
                      Delivery Address
                    </h3>
                  </div>

                  <div className="rounded-xl border border-black/5 bg-white p-4 text-sm text-gray-700">
                    {detailAddress.street ? (
                      <p>{detailAddress.street}</p>
                    ) : (
                      <p className="text-gray-500">Street not provided</p>
                    )}
                    {formatAddressLine(detailAddress) ? (
                      <p className="mt-1">{formatAddressLine(detailAddress)}</p>
                    ) : null}
                    {detailAddress.phone ? (
                      <p className="mt-2 text-gray-600">Phone: {detailAddress.phone}</p>
                    ) : null}
                    {detailAddress.instructions ? (
                      <p className="mt-2 text-gray-600">
                        Instructions: {detailAddress.instructions}
                      </p>
                    ) : null}
                  </div>
                </section>

                <section className="rounded-2xl border border-black/5 bg-gray-50 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-gray-600">Items Subtotal</span>
                    <span className="font-semibold text-gray-900">
                      {formatPrice(detailItemsTotal)}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-base">
                    <span className="font-bold text-gray-900">Order Total</span>
                    <span className="font-black text-gray-900">
                      {formatPrice(selectedOrder.total)}
                    </span>
                  </div>
                </section>
              </div>
            )}
          </div>
        </ModalContent>
      </Modal>
    </div>
  )
}
