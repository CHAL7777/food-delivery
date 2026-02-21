import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { createServerSupabaseClient } from '@/lib/supabase/server'

const orderStatusSchema = z.enum([
  'pending',
  'confirmed',
  'preparing',
  'ready',
  'delivered',
  'cancelled'
])
const paymentStatusSchema = z.enum(['pending', 'paid', 'failed', 'refunded'])

const patchOrderSchema = z
  .object({
    id: z.string().uuid(),
    status: orderStatusSchema.optional(),
    paymentStatus: paymentStatusSchema.optional()
  })
  .refine((value) => value.status !== undefined || value.paymentStatus !== undefined, {
    message: 'No update fields provided'
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

async function ensureAdmin(request: Request) {
  const user = await getAuthenticatedUser(request)
  if (!user) return { ok: false as const, status: 401 }

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    select: { role: true }
  })

  if (profile?.role !== 'admin') return { ok: false as const, status: 403 }

  return { ok: true as const }
}

const mapOrder = (order: {
  id: string
  total: { toString(): string }
  status: string
  paymentStatus: string
  paymentMethod: string | null
  createdAt: Date
  updatedAt: Date
  deliveryAddress: unknown
  items: unknown
  user: {
    id: string
    firstName: string | null
    lastName: string | null
    email: string
  }
}) => ({
  id: order.id,
  total: Number(order.total),
  status: order.status,
  paymentStatus: order.paymentStatus,
  paymentMethod: order.paymentMethod,
  createdAt: order.createdAt.toISOString(),
  updatedAt: order.updatedAt.toISOString(),
  deliveryAddress: order.deliveryAddress,
  items: order.items,
  customer: {
    id: order.user.id,
    name:
      `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim() ||
      order.user.email,
    email: order.user.email
  }
})

export async function GET(request: Request) {
  try {
    const auth = await ensureAdmin(request)
    if (!auth.ok) {
      const message = auth.status === 401 ? 'Unauthorized' : 'Forbidden'
      return NextResponse.json({ error: message }, { status: auth.status })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const paymentStatus = searchParams.get('paymentStatus')
    const search = searchParams.get('search')?.trim()
    const page = Math.max(1, Number(searchParams.get('page') || 1))
    const pageSize = Math.min(100, Math.max(1, Number(searchParams.get('pageSize') || 20)))

    const where: {
      status?: z.infer<typeof orderStatusSchema>
      paymentStatus?: z.infer<typeof paymentStatusSchema>
      OR?: Array<{
        user?: {
          email?: { contains: string; mode: 'insensitive' }
          firstName?: { contains: string; mode: 'insensitive' }
          lastName?: { contains: string; mode: 'insensitive' }
        }
      }>
    } = {}

    if (status) {
      const parsed = orderStatusSchema.safeParse(status)
      if (parsed.success) where.status = parsed.data
    }

    if (paymentStatus) {
      const parsed = paymentStatusSchema.safeParse(paymentStatus)
      if (parsed.success) where.paymentStatus = parsed.data
    }

    if (search) {
      where.OR = [
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { user: { firstName: { contains: search, mode: 'insensitive' } } },
        { user: { lastName: { contains: search, mode: 'insensitive' } } }
      ]
    }

    const [total, orders] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      })
    ])

    return NextResponse.json({
      data: orders.map(mapOrder),
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    })
  } catch (error) {
    console.error('Error fetching admin orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch admin orders' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const auth = await ensureAdmin(request)
    if (!auth.ok) {
      const message = auth.status === 401 ? 'Unauthorized' : 'Forbidden'
      return NextResponse.json({ error: message }, { status: auth.status })
    }

    const body = await request.json()
    const parsed = patchOrderSchema.parse(body)

    const data: { status?: string; paymentStatus?: string } = {}
    if (parsed.status !== undefined) data.status = parsed.status
    if (parsed.paymentStatus !== undefined) data.paymentStatus = parsed.paymentStatus

    const updated = await prisma.order.update({
      where: { id: parsed.id },
      data,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(mapOrder(updated))
  } catch (error) {
    if (typeof error === 'object' && error && 'code' in error && error.code === 'P2025') {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating order:', error)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}
