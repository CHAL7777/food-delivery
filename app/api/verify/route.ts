import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const tx_ref = searchParams.get('tx_ref')
    const status = searchParams.get('status')

    if (!tx_ref) {
      return NextResponse.redirect(new URL('/?error=payment_failed', request.url))
    }

    // Update order payment status
    if (status === 'success') {
      await prisma.order.updateMany({
        where: { transactionRef: tx_ref },
        data: { paymentStatus: 'paid' }
      })
    }

    return NextResponse.redirect(new URL('/success', request.url))
  } catch (error) {
    console.error('Error verifying payment:', error)
    return NextResponse.redirect(new URL('/?error=payment_failed', request.url))
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { tx_ref, status } = body

    // Update order payment status
    if (status === 'success') {
      await prisma.order.updateMany({
        where: { transactionRef: tx_ref },
        data: { paymentStatus: 'paid' }
      })
    }

    return NextResponse.json({ message: 'Payment verified' })
  } catch (error) {
    console.error('Error verifying payment:', error)
    return NextResponse.json({ error: 'Failed to verify payment' }, { status: 500 })
  }
}