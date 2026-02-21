import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import prisma from '@/lib/prisma'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const noStoreJson = (payload: unknown, status = 200) =>
  NextResponse.json(payload, {
    status,
    headers: {
      'Cache-Control': 'no-store'
    }
  })

async function getAuthenticatedUser(request: Request) {
  const authHeader = request.headers.get('authorization') || ''
  const token = authHeader.toLowerCase().startsWith('bearer ')
    ? authHeader.slice(7).trim()
    : null

  if (token) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (supabaseUrl && supabaseAnonKey) {
      const authClient = createClient(supabaseUrl, supabaseAnonKey)
      const { data, error } = await authClient.auth.getUser(token)
      if (!error && data.user) return data.user
    }
  }

  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) return null

  return data.user
}

export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return noStoreJson({ error: 'Unauthorized' }, 401)
    }

    const profile = await prisma.profile.findUnique({
      where: { id: user.id },
      select: { role: true, firstName: true, email: true }
    })

    if (profile?.role !== 'admin') {
      return noStoreJson({ error: 'Forbidden' }, 403)
    }

    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const [
      totalOrders,
      openOrders,
      todayOrders,
      paidRevenue,
      todayPaidRevenue,
      totalCustomers,
      totalFoods,
      availableFoods,
      statusBreakdown,
      recentOrders,
      popularFoods
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({
        where: {
          status: {
            in: ['pending', 'confirmed', 'preparing', 'ready']
          }
        }
      }),
      prisma.order.count({
        where: {
          createdAt: { gte: todayStart }
        }
      }),
      prisma.order.aggregate({
        where: { paymentStatus: 'paid' },
        _sum: { total: true }
      }),
      prisma.order.aggregate({
        where: {
          paymentStatus: 'paid',
          createdAt: { gte: todayStart }
        },
        _sum: { total: true }
      }),
      prisma.profile.count({
        where: { role: 'user' }
      }),
      prisma.food.count(),
      prisma.food.count({
        where: { isAvailable: true }
      }),
      prisma.order.groupBy({
        by: ['status'],
        _count: { status: true }
      }),
      prisma.order.findMany({
        take: 8,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      }),
      prisma.food.findMany({
        take: 5,
        orderBy: { totalReviews: 'desc' },
        select: {
          id: true,
          name: true,
          price: true,
          totalReviews: true,
          rating: true,
          isAvailable: true,
          category: {
            select: {
              name: true
            }
          }
        }
      })
    ])

    return noStoreJson({
      admin: {
        id: user.id,
        name: profile.firstName || user.email
      },
      metrics: {
        totalOrders,
        openOrders,
        todayOrders,
        totalRevenue: Number(paidRevenue._sum.total || 0),
        todayRevenue: Number(todayPaidRevenue._sum.total || 0),
        totalCustomers,
        totalFoods,
        availableFoods
      },
      statusBreakdown: statusBreakdown.map((row) => ({
        status: row.status,
        count: row._count.status
      })),
      recentOrders: recentOrders.map((order) => ({
        id: order.id,
        total: Number(order.total),
        status: order.status,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        createdAt: order.createdAt.toISOString(),
        customerName: `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim() || order.user.email
      })),
      popularFoods: popularFoods.map((food) => ({
        id: food.id,
        name: food.name,
        price: Number(food.price),
        totalReviews: food.totalReviews || 0,
        rating: Number(food.rating || 0),
        isAvailable: food.isAvailable,
        categoryName: food.category?.name || 'Uncategorized'
      }))
    })
  } catch (error) {
    console.error('Error loading admin dashboard:', error)
    return noStoreJson({ error: 'Failed to load dashboard' }, 500)
  }
}
