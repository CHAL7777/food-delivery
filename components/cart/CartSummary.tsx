'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'
import { ShoppingBag, Truck, CreditCard } from 'lucide-react'

export default function CartSummary() {
  const router = useRouter()
  const { items, getTotal } = useCartStore()
  const { user } = useAuthStore()
  
  const subtotal = getTotal()
  const deliveryFee = subtotal > 500 ? 0 : 50
  const total = subtotal + deliveryFee

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please login to checkout')
      router.push('/login?redirect=/cart')
      return
    }
    
    router.push('/checkout')
  }

  return (
    <div className="bg-white rounded-2xl shadow-card p-6 sticky top-24">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <ShoppingBag className="w-5 h-5 text-primary" />
        Order Summary
      </h2>
      
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center py-3 border-b border-gray-100">
          <span className="text-gray-600">Subtotal ({items.length} items)</span>
          <span className="font-semibold">{formatPrice(subtotal)}</span>
        </div>
        
        <div className="flex justify-between items-center py-3 border-b border-gray-100">
          <div className="flex items-center gap-2 text-gray-600">
            <Truck className="w-4 h-4" />
            Delivery Fee
          </div>
          <span className={deliveryFee === 0 ? 'text-green-600 font-semibold' : ''}>
            {deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)}
          </span>
        </div>
        
        {subtotal < 500 && (
          <div className="bg-orange-50 rounded-xl p-4">
            <p className="text-sm text-orange-700">
              Add <span className="font-bold">{formatPrice(500 - subtotal)}</span> more for free delivery!
            </p>
            <div className="mt-2 h-2 bg-orange-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-primary rounded-full transition-all duration-500"
                style={{ width: `${Math.min((subtotal / 500) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
        
        <div className="pt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold">Total</span>
            <span className="text-2xl font-bold text-gradient">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      <Button
        className="w-full bg-gradient-primary hover:shadow-glow"
        size="lg"
        onClick={handleCheckout}
        disabled={items.length === 0}
      >
        <CreditCard className="w-5 h-5 mr-2" />
        Proceed to Checkout
      </Button>

      {/* Trust badges */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Truck className="w-4 h-4" />
            <span>Fast Delivery</span>
          </div>
          <div className="flex items-center gap-1">
            <CreditCard className="w-4 h-4" />
            <span>Secure Payment</span>
          </div>
        </div>
      </div>

      {!user && (
        <p className="text-sm text-gray-500 text-center mt-4">
          Please login to complete your order
        </p>
      )}
    </div>
  )
}
