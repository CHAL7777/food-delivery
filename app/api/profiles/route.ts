import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { createServerSupabaseClient } from '@/lib/supabase/server'

const profileInputSchema = z.object({
  firstName: z.string().max(80).optional(),
  lastName: z.string().max(80).optional(),
  phone: z.string().max(40).optional(),
  avatar: z.union([z.string().url(), z.literal('')]).optional()
})

const hasOwn = (obj: object, key: string) =>
  Object.prototype.hasOwnProperty.call(obj, key)

const normalizeText = (value: string | undefined): string | null | undefined => {
  if (value === undefined) return undefined
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

const normalizeAvatar = (value: string | undefined): string | null | undefined => {
  if (value === undefined) return undefined
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

const toProfileResponse = (profile: {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  phone: string | null
  role: string
  avatar: string | null
  createdAt: Date
  updatedAt: Date
}) => ({
  id: profile.id,
  email: profile.email,
  firstName: profile.firstName,
  lastName: profile.lastName,
  phone: profile.phone,
  role: profile.role,
  avatar: profile.avatar,
  createdAt: profile.createdAt.toISOString(),
  updatedAt: profile.updatedAt.toISOString()
})

async function getAuthenticatedUser(request: Request) {
  const authHeader = request.headers.get('authorization') || ''
  const token = authHeader.toLowerCase().startsWith('bearer ')
    ? authHeader.slice(7).trim()
    : null

  if (token) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return null
    }

    const authClient = createClient(supabaseUrl, supabaseAnonKey)
    const { data: authData, error: authError } = await authClient.auth.getUser(token)
    if (!authError && authData?.user) return authData.user
  }

  const authClient = await createServerSupabaseClient()
  const { data, error } = await authClient.auth.getUser()
  if (error || !data.user) return null

  return data.user
}

function buildPartialProfileUpdate(
  body: z.infer<typeof profileInputSchema>
): Record<string, string | null | undefined> {
  const updateData: Record<string, string | null | undefined> = {}

  if (hasOwn(body, 'firstName')) updateData.firstName = normalizeText(body.firstName)
  if (hasOwn(body, 'lastName')) updateData.lastName = normalizeText(body.lastName)
  if (hasOwn(body, 'phone')) updateData.phone = normalizeText(body.phone)
  if (hasOwn(body, 'avatar')) updateData.avatar = normalizeAvatar(body.avatar)

  return updateData
}

export async function GET(request: Request) {
  try {
    const authUser = await getAuthenticatedUser(request)

    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!authUser.email) {
      return NextResponse.json({ error: 'Authenticated user is missing email' }, { status: 400 })
    }

    const profile = await prisma.profile.upsert({
      where: { id: authUser.id },
      update: { email: authUser.email },
      create: {
        id: authUser.id,
        email: authUser.email
      }
    })

    return NextResponse.json(toProfileResponse(profile))
  } catch (err: any) {
    console.error('Error fetching profile:', err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const authUser = await getAuthenticatedUser(request)

    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!authUser.email) {
      return NextResponse.json({ error: 'Authenticated user is missing email' }, { status: 400 })
    }

    const body = profileInputSchema.parse(await request.json())
    const updateData = buildPartialProfileUpdate(body)

    const profile = await prisma.profile.upsert({
      where: { id: authUser.id },
      update: {
        email: authUser.email,
        ...updateData
      },
      create: {
        id: authUser.id,
        email: authUser.email,
        firstName: updateData.firstName ?? undefined,
        lastName: updateData.lastName ?? undefined,
        phone: updateData.phone ?? undefined,
        avatar: updateData.avatar ?? undefined
      }
    })

    return NextResponse.json(toProfileResponse(profile))
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: err.errors },
        { status: 400 }
      )
    }

    console.error('Error updating profile:', err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const authUser = await getAuthenticatedUser(request)
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = profileInputSchema.parse((await request.json()) ?? {})
    const updateData = buildPartialProfileUpdate(body)

    if (!authUser.email) {
      return NextResponse.json({ error: 'Authenticated user is missing email' }, { status: 400 })
    }

    // Upsert profile tied only to authenticated user identity.
    const profile = await prisma.profile.upsert({
      where: { id: authUser.id },
      update: {
        email: authUser.email,
        ...updateData
      },
      create: {
        id: authUser.id,
        email: authUser.email,
        firstName: updateData.firstName ?? undefined,
        lastName: updateData.lastName ?? undefined,
        phone: updateData.phone ?? undefined,
        avatar: updateData.avatar ?? undefined
      }
    })

    return NextResponse.json(toProfileResponse(profile))
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: err.errors },
        { status: 400 }
      )
    }

    console.error('Error creating profile:', err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}
