import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id, email, firstName, lastName, phone } = body

    if (!id || !email) {
      return NextResponse.json({ error: 'Missing id or email' }, { status: 400 })
    }

    // Upsert profile using the provided id/email. This avoids relying on
    // the Supabase service role while keeping server-side control via Prisma.
    const profile = await prisma.profile.upsert({
      where: { id },
      update: {
        email,
        firstName: firstName ?? undefined,
        lastName: lastName ?? undefined,
        phone: phone ?? undefined
      },
      create: {
        id,
        email,
        firstName: firstName ?? undefined,
        lastName: lastName ?? undefined,
        phone: phone ?? undefined
      }
    })

    return NextResponse.json(profile)
  } catch (err: any) {
    console.error('Error creating profile:', err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}
