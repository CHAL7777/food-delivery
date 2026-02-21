import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'

// Validation schema
const foodSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  price: z.number().positive(),
  category_id: z.string().uuid(),
  image: z.string().url().optional(),
  images: z.array(z.string().url()).optional(),
  ingredients: z.array(z.string()).optional(),
  is_available: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  is_popular: z.boolean().default(false),
  is_spicy: z.boolean().default(false),
  preparation_time: z.number().positive().optional()
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

  const authClient = await createServerSupabaseClient()
  const { data, error } = await authClient.auth.getUser()
  if (error || !data.user) return null

  return data.user
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Build Prisma where clause from query params
    const where: any = {}
    const category = searchParams.get('category')
    if (category) where.category = { slug: category }

    const featured = searchParams.get('featured')
    if (featured !== null) where.isFeatured = featured === 'true'

    const available = searchParams.get('available')
    if (available !== null) where.isAvailable = available === 'true'

    const search = searchParams.get('search')
    if (search) where.name = { contains: search, mode: 'insensitive' }

    const minPrice = searchParams.get('minPrice')
    if (minPrice) where.price = { ...(where.price || {}), gte: parseFloat(minPrice) }

    const maxPrice = searchParams.get('maxPrice')
    if (maxPrice) where.price = { ...(where.price || {}), lte: parseFloat(maxPrice) }

    // Sorting
    const sortBy = (searchParams.get('sortBy') || 'createdAt') as string
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as string
    const orderBy: any = { [sortBy]: sortOrder === 'asc' ? 'asc' : 'desc' }

    // Pagination
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')
    const limit = searchParams.get('limit')
    const take = limit ? parseInt(limit) : pageSize
    const skip = limit ? 0 : (page - 1) * pageSize

    const [total, data] = await Promise.all([
      prisma.food.count({ where }),
      prisma.food.findMany({
        where,
        include: { category: true },
        orderBy,
        skip,
        take,
      }),
    ])

    return NextResponse.json({ data, pagination: { page, pageSize: take, total } })
  } catch (error) {
    console.error('Error fetching foods:', error)
    return NextResponse.json(
      { error: 'Failed to fetch foods' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check admin role via Prisma
    const profile = await prisma.profile.findUnique({ where: { id: user.id }, select: { role: true } })

    if (profile?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Validate input
    const body = await request.json()
    const validatedData = foodSchema.parse(body)

    // Map incoming snake_case -> Prisma camelCase fields
    const payload: any = {
      name: validatedData.name,
      description: validatedData.description,
      price: validatedData.price,
      categoryId: validatedData.category_id,
      image: validatedData.image,
      images: validatedData.images,
      ingredients: validatedData.ingredients,
      isAvailable: validatedData.is_available,
      isFeatured: validatedData.is_featured,
      isPopular: validatedData.is_popular,
      isSpicy: validatedData.is_spicy,
      preparationTime: validatedData.preparation_time,
    }

    const created = await prisma.food.create({
      data: payload,
      include: { category: true },
    })

    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Error creating food:', error)
    return NextResponse.json(
      { error: 'Failed to create food' },
      { status: 500 }
    )
  }
}
