import { NextResponse } from 'next/server'
import axios from 'axios'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { amount, currency, email, first_name, last_name, tx_ref } = body

    const response = await axios.post(
      'https://api.chapa.co/v1/transaction/initialize',
      {
        amount,
        currency,
        email,
        first_name,
        last_name,
        tx_ref,
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/verify`,
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.CHAPA_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    )

    return NextResponse.json(response.data)
  } catch (error) {
    console.error('Error initializing payment:', error)
    return NextResponse.json(
      { error: 'Failed to initialize payment' },
      { status: 500 }
    )
  }
}