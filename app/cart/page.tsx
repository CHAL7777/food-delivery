'use client'

import { useCartStore } from '@/store/cartStore'
import CartItem from '@/components/cart/CartItem'
import CartSummary from '@/components/cart/CartSummary'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ShoppingBag, ArrowRight } from 'lucide-react'

export default function CartPage() {
  const { items } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
          <ShoppingBag className="w-12 h-12 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          Your cart is empty
        </h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Looks like you haven't added any items to your cart yet. Start exploring our delicious menu!
        </p>
        <Link href="/menu">
          <Button size="lg" className="bg-gradient-primary hover:shadow-glow">
            Browse Menu
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-primary" />
          Shopping Cart 
          <span className="text-gray-400 font-normal text-lg">({items.length} items)</span>
        </h1>
        
        <div className="space-y-4">
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* Summary */}
      <div>
        <CartSummary />
      </div>
    </div>
  )
}
