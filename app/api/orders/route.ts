import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import prisma from '@/lib/prisma'
import { createServerSupabaseClient } from '@/lib/supabase/server'

async function getAuthenticatedUser(request: Request) {
  const authHeader = request.headers.get('authorization') || ''
  const token = authHeader.toLowerCase().startsWith('bearer ')
    ? authHeader.slice(7).trim()
    : null

  if (token) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) return null

    const authClient = createClient(supabaseUrl, supabaseAnonKey)
    const { data, error } = await authClient.auth.getUser(token)
    if (!error && data.user) return data.user
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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser(request)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      items,
      subtotal,
      deliveryFee,
      total,
      paymentMethod,
      deliveryAddress,
      transactionRef
    } = body

    const created = await prisma.order.create({
      data: {
        userId: user.id,
        items: items,
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        total: total,
        paymentMethod: paymentMethod,
        deliveryAddress: deliveryAddress,
        transactionRef: transactionRef
      }
    })

    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
