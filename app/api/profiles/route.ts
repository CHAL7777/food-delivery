import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization') || ''
    const token = authHeader.toLowerCase().startsWith('bearer ')
      ? authHeader.slice(7).trim()
      : null

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ error: 'Server auth is not configured' }, { status: 500 })
    }

    const authClient = createClient(supabaseUrl, supabaseAnonKey)
    const { data: authData, error: authError } = await authClient.auth.getUser(token)
    const authUser = authData?.user

    if (authError || !authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { firstName, lastName, phone } = body ?? {}

    if (!authUser.email) {
      return NextResponse.json({ error: 'Authenticated user is missing email' }, { status: 400 })
    }

    const safeFirstName = typeof firstName === 'string' ? firstName.trim() : undefined
    const safeLastName = typeof lastName === 'string' ? lastName.trim() : undefined
    const safePhone = typeof phone === 'string' ? phone.trim() : undefined

    // Upsert profile tied only to authenticated user identity.
    const profile = await prisma.profile.upsert({
      where: { id: authUser.id },
      update: {
        email: authUser.email,
        firstName: safeFirstName || undefined,
        lastName: safeLastName || undefined,
        phone: safePhone || undefined
      },
      create: {
        id: authUser.id,
        email: authUser.email,
        firstName: safeFirstName || undefined,
        lastName: safeLastName || undefined,
        phone: safePhone || undefined
      }
    })

    return NextResponse.json(profile)
  } catch (err: any) {
    console.error('Error creating profile:', err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}
