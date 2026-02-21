import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { CheckCircle } from 'lucide-react'

export default function SuccessPage() {
  return (
    <div className="text-center py-12">
      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
      <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
      <p className="text-gray-600 mb-8">
        Your order has been placed successfully. We'll start preparing your food right away.
      </p>
      <div className="space-x-4">
        <Link href="/orders">
          <Button>View My Orders</Button>
        </Link>
        <Link href="/menu">
          <Button variant="outline">Order More Food</Button>
        </Link>
      </div>
    </div>
  )
}