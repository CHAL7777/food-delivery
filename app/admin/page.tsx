'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ArrowUpRight,
  BadgeDollarSign,
  ChartNoAxesCombined,
  CircleDollarSign,
  ChefHat,
  PackageOpen,
  ShoppingBag,
  Users,
  RefreshCcw
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

type StatusRow = {
  status: string
  count: number
}

type RecentOrder = {
  id: string
  total: number
  status: string
  paymentStatus: string
  paymentMethod: string | null
  createdAt: string
  customerName: string
}

type PopularFood = {
  id: string
  name: string
  price: number
  totalReviews: number
  rating: number
  isAvailable: boolean
  categoryName: string
}

type DashboardData = {
  admin: {
    id: string
    name: string
  }
  metrics: {
    totalOrders: number
    openOrders: number
    todayOrders: number
    totalRevenue: number
    todayRevenue: number
    totalCustomers: number
    totalFoods: number
    availableFoods: number
  }
  statusBreakdown: StatusRow[]
  recentOrders: RecentOrder[]
  popularFoods: PopularFood[]
}

const statusColorMap: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700',
  confirmed: 'bg-blue-50 text-blue-700',
  preparing: 'bg-violet-50 text-violet-700',
  ready: 'bg-indigo-50 text-indigo-700',
  delivered: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-700'
}

const formatStatus = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<DashboardData | null>(null)

  const statusTotal = useMemo(
    () => (data?.statusBreakdown || []).reduce((acc, row) => acc + row.count, 0),
    [data?.statusBreakdown]
  )

  const fetchDashboard = async () => {
    setLoading(true)
    setError(null)

    try {
      const { data: sessionData } = await supabase.auth.getSession()
      const accessToken = sessionData.session?.access_token

      const response = await fetch('/api/admin/dashboard', {
        cache: 'no-store',
        headers: accessToken
          ? { Authorization: `Bearer ${accessToken}` }
          : undefined
      })

      if (response.status === 401) {
        setError('Please login as admin to view dashboard.')
        setData(null)
        return
      }

      if (response.status === 403) {
        setError('Your account is not authorized to access admin dashboard.')
        setData(null)
        return
      }

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        throw new Error(payload?.error || 'Failed to load dashboard')
      }

      const payload = (await response.json()) as DashboardData
      setData(payload)
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to load dashboard'
      setError(message)
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  if (loading) {
    return (
      <div className="surface-panel flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="surface-panel p-10 text-center">
        <h2 className="text-2xl font-black mb-2">Dashboard Unavailable</h2>
        <p className="text-gray-600 mb-6">{error || 'Unable to load admin dashboard.'}</p>
        <Button variant="outline" onClick={fetchDashboard}>
          <RefreshCcw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    )
  }

  const metricCards = [
    {
      label: 'Total Revenue',
      value: formatPrice(data.metrics.totalRevenue),
      hint: `Today: ${formatPrice(data.metrics.todayRevenue)}`,
      icon: CircleDollarSign,
      tone: 'from-green-100 to-emerald-100 text-emerald-700'
    },
    {
      label: 'Total Orders',
      value: data.metrics.totalOrders.toLocaleString(),
      hint: `Open: ${data.metrics.openOrders}`,
      icon: ShoppingBag,
      tone: 'from-blue-100 to-cyan-100 text-cyan-700'
    },
    {
      label: 'Customers',
      value: data.metrics.totalCustomers.toLocaleString(),
      hint: `Orders today: ${data.metrics.todayOrders}`,
      icon: Users,
      tone: 'from-violet-100 to-purple-100 text-violet-700'
    },
    {
      label: 'Food Catalog',
      value: data.metrics.totalFoods.toLocaleString(),
      hint: `${data.metrics.availableFoods} currently available`,
      icon: ChefHat,
      tone: 'from-orange-100 to-amber-100 text-orange-700'
    }
  ] as const

  return (
    <div className="space-y-6">
      <section className="surface-warm p-6 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Admin center</p>
            <h1 className="mt-2 text-3xl font-black text-gray-900 md:text-4xl">
              Welcome back, {data.admin.name}
            </h1>
            <p className="mt-2 text-gray-600 max-w-2xl">
              Monitor orders, track revenue, and keep your catalog healthy from one place.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/foods/add">
              <Button className="bg-gradient-primary text-white">
                <PackageOpen className="mr-2 h-4 w-4" />
                Add New Food
              </Button>
            </Link>
            <Button variant="outline" onClick={fetchDashboard}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.label} className="surface-panel p-5">
              <div className={`inline-flex rounded-2xl bg-gradient-to-br p-3 ${card.tone}`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-4 text-sm font-semibold text-gray-500">{card.label}</p>
              <p className="mt-1 text-2xl font-black text-gray-900">{card.value}</p>
              <p className="mt-1 text-xs text-gray-500">{card.hint}</p>
            </div>
          )
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-5">
        <div className="surface-panel xl:col-span-3 p-5 md:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-black text-gray-900">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm font-semibold text-primary hover:underline">
              View all
            </Link>
          </div>

          <div className="space-y-3">
            {data.recentOrders.length === 0 ? (
              <p className="text-sm text-gray-500">No orders yet.</p>
            ) : (
              data.recentOrders.map((order) => (
                <div key={order.id} className="rounded-2xl border border-black/5 bg-white/90 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold text-gray-900">#{order.id.slice(-8).toUpperCase()}</p>
                      <p className="text-xs text-gray-500">{order.customerName}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusColorMap[order.status] || 'bg-gray-100 text-gray-600'}`}>
                      {formatStatus(order.status)}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
                    <p className="font-semibold text-gray-900">{formatPrice(order.total)}</p>
                    <p className="text-gray-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="surface-panel xl:col-span-2 p-5 md:p-6">
          <h2 className="text-xl font-black text-gray-900">Order Status Mix</h2>
          <p className="mt-1 text-sm text-gray-500">Current order distribution by status.</p>

          <div className="mt-5 space-y-3">
            {data.statusBreakdown.length === 0 ? (
              <p className="text-sm text-gray-500">No order data yet.</p>
            ) : (
              data.statusBreakdown.map((row) => {
                const pct = statusTotal > 0 ? Math.round((row.count / statusTotal) * 100) : 0
                return (
                  <div key={row.status}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="font-semibold text-gray-600">{formatStatus(row.status)}</span>
                      <span className="text-gray-500">{row.count} ({pct}%)</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100">
                      <div
                        className="h-2 rounded-full bg-gradient-primary"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="surface-panel p-5 md:p-6">
          <div className="mb-4 flex items-center gap-2">
            <ChartNoAxesCombined className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-black text-gray-900">Popular Foods</h2>
          </div>
          <div className="space-y-3">
            {data.popularFoods.length === 0 ? (
              <p className="text-sm text-gray-500">No food insights yet.</p>
            ) : (
              data.popularFoods.map((food) => (
                <div key={food.id} className="flex items-center justify-between rounded-2xl border border-black/5 bg-white/90 p-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-gray-900">{food.name}</p>
                    <p className="text-xs text-gray-500">{food.categoryName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{formatPrice(food.price)}</p>
                    <p className="text-xs text-gray-500">{food.totalReviews} reviews</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="surface-panel p-5 md:p-6">
          <div className="mb-4 flex items-center gap-2">
            <BadgeDollarSign className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-black text-gray-900">Quick Actions</h2>
          </div>
          <div className="grid gap-3">
            <Link href="/admin/orders" className="flex items-center justify-between rounded-2xl border border-black/5 bg-white/90 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-orange-50 hover:text-primary transition-colors">
              Review incoming orders
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link href="/admin/foods" className="flex items-center justify-between rounded-2xl border border-black/5 bg-white/90 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-orange-50 hover:text-primary transition-colors">
              Manage menu inventory
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link href="/admin/foods/add" className="flex items-center justify-between rounded-2xl border border-black/5 bg-white/90 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-orange-50 hover:text-primary transition-colors">
              Publish a new dish
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
