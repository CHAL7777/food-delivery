import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { createServerSupabaseClient } from '@/lib/supabase/server'

type RouteContext = {
  params: Promise<{ id: string }>
}

const patchFoodSchema = z
  .object({
    name: z.string().min(1).max(100).optional(),
    description: z.string().nullable().optional(),
    price: z.number().positive().optional(),
    category_id: z.string().uuid().nullable().optional(),
    categoryId: z.string().uuid().nullable().optional(),
    image: z.string().url().nullable().optional(),
    images: z.array(z.string().url()).optional(),
    ingredients: z.array(z.string()).optional(),
    is_available: z.boolean().optional(),
    isAvailable: z.boolean().optional(),
    is_featured: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
    is_popular: z.boolean().optional(),
    isPopular: z.boolean().optional(),
    is_spicy: z.boolean().optional(),
    isSpicy: z.boolean().optional(),
    preparation_time: z.number().int().positive().nullable().optional(),
    preparationTime: z.number().int().positive().nullable().optional()
  })
  .refine((value) => Object.keys(value).length > 0, 'No updatable fields provided')

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

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params

    const food = await prisma.food.findUnique({
      where: { id },
      include: { category: true }
    })

    if (!food) {
      return NextResponse.json({ error: 'Food not found' }, { status: 404 })
    }

    return NextResponse.json({
      ...food,
      price: Number(food.price),
      rating: food.rating === null ? null : Number(food.rating)
    })
  } catch (error) {
    console.error('Error fetching food:', error)
    return NextResponse.json({ error: 'Failed to fetch food' }, { status: 500 })
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const auth = await ensureAdmin(request)
    if (!auth.ok) {
      const message = auth.status === 401 ? 'Unauthorized' : 'Forbidden'
      return NextResponse.json({ error: message }, { status: auth.status })
    }

    const { id } = await context.params
    const body = await request.json()
    const parsed = patchFoodSchema.parse(body)

    const data: Record<string, unknown> = {}

    if ('name' in parsed) data.name = parsed.name
    if ('description' in parsed) data.description = parsed.description
    if ('price' in parsed) data.price = parsed.price
    if ('category_id' in parsed) data.categoryId = parsed.category_id
    if ('categoryId' in parsed) data.categoryId = parsed.categoryId
    if ('image' in parsed) data.image = parsed.image
    if ('images' in parsed) data.images = parsed.images
    if ('ingredients' in parsed) data.ingredients = parsed.ingredients
    if ('is_available' in parsed) data.isAvailable = parsed.is_available
    if ('isAvailable' in parsed) data.isAvailable = parsed.isAvailable
    if ('is_featured' in parsed) data.isFeatured = parsed.is_featured
    if ('isFeatured' in parsed) data.isFeatured = parsed.isFeatured
    if ('is_popular' in parsed) data.isPopular = parsed.is_popular
    if ('isPopular' in parsed) data.isPopular = parsed.isPopular
    if ('is_spicy' in parsed) data.isSpicy = parsed.is_spicy
    if ('isSpicy' in parsed) data.isSpicy = parsed.isSpicy
    if ('preparation_time' in parsed) data.preparationTime = parsed.preparation_time
    if ('preparationTime' in parsed) data.preparationTime = parsed.preparationTime

    const updated = await prisma.food.update({
      where: { id },
      data,
      include: { category: true }
    })

    return NextResponse.json({
      ...updated,
      price: Number(updated.price),
      rating: updated.rating === null ? null : Number(updated.rating)
    })
  } catch (error) {
    if (typeof error === 'object' && error && 'code' in error && error.code === 'P2025') {
      return NextResponse.json({ error: 'Food not found' }, { status: 404 })
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating food:', error)
    return NextResponse.json({ error: 'Failed to update food' }, { status: 500 })
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const auth = await ensureAdmin(request)
    if (!auth.ok) {
      const message = auth.status === 401 ? 'Unauthorized' : 'Forbidden'
      return NextResponse.json({ error: message }, { status: auth.status })
    }

    const { id } = await context.params

    await prisma.food.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (typeof error === 'object' && error && 'code' in error && error.code === 'P2025') {
      return NextResponse.json({ error: 'Food not found' }, { status: 404 })
    }

    console.error('Error deleting food:', error)
    return NextResponse.json({ error: 'Failed to delete food' }, { status: 500 })
  }
}
