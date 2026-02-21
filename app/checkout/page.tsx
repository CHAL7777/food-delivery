'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { formatPrice, generateTransactionRef } from '@/lib/utils'
import toast from 'react-hot-toast'
import { Address } from '@/types/order'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotal, clearCart } = useCartStore()
  const { user } = useAuthStore()
  
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'chapa' | 'cash'>('chapa')
  const [address, setAddress] = useState<Partial<Address>>({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    phone: user?.phone || '',
    instructions: ''
  })

  const subtotal = getTotal()
  const deliveryFee = subtotal > 500 ? 0 : 50
  const total = subtotal + deliveryFee

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast.error('Please login to checkout')
      router.push('/login?redirect=/checkout')
      return
    }

    if (items.length === 0) {
      toast.error('Your cart is empty')
      router.push('/menu')
      return
    }

    setLoading(true)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      const accessToken = session?.access_token

      if (!accessToken) {
        toast.error('Session expired. Please login again.')
        router.push('/login?redirect=/checkout')
        return
      }

      // Create order first
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          userId: user.id,
          items,
          subtotal,
          deliveryFee,
          total,
          deliveryAddress: address,
          paymentMethod
        })
      })

      if (!orderResponse.ok) throw new Error('Failed to create order')
      
      const order = await orderResponse.json()

      if (paymentMethod === 'chapa') {
        // Initialize Chapa payment
        const tx_ref = generateTransactionRef()
        
        const paymentResponse = await fetch('/api/pay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: total,
            currency: 'ETB',
            email: user.email,
            first_name: user.firstName,
            last_name: user.lastName,
            tx_ref
          })
        })

        const paymentData = await paymentResponse.json()

        if (paymentData.status === 'success') {
          // Redirect to Chapa checkout
          window.location.href = paymentData.data.checkout_url
        } else {
          throw new Error('Payment initialization failed')
        }
      } else {
        // Cash on delivery
        toast.success('Order placed successfully!')
        clearCart()
        router.push('/orders')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error('Failed to process checkout')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Button onClick={() => router.push('/menu')}>
          Browse Menu
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-8">
        {/* Delivery Information */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Delivery Address</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Street Address *
                </label>
                <Input
                  name="street"
                  value={address.street}
                  onChange={handleAddressChange}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    City *
                  </label>
                  <Input
                    name="city"
                    value={address.city}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    State *
                  </label>
                  <Input
                    name="state"
                    value={address.state}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    ZIP Code *
                  </label>
                  <Input
                    name="zipCode"
                    value={address.zipCode}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone Number *
                  </label>
                  <Input
                    name="phone"
                    type="tel"
                    value={address.phone}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Delivery Instructions (Optional)
                </label>
                <textarea
                  name="instructions"
                  value={address.instructions}
                  onChange={handleAddressChange}
                  rows={3}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="E.g., Gate code, landmark, etc."
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
            
            <div className="space-y-3">
              <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  value="chapa"
                  checked={paymentMethod === 'chapa'}
                  onChange={(e) => setPaymentMethod(e.target.value as 'chapa')}
                  className="w-4 h-4"
                />
                <div>
                  <span className="font-medium">Chapa</span>
                  <p className="text-sm text-gray-500">
                    Pay online using Chapa
                  </p>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  value="cash"
                  checked={paymentMethod === 'cash'}
                  onChange={(e) => setPaymentMethod(e.target.value as 'cash')}
                  className="w-4 h-4"
                />
                <div>
                  <span className="font-medium">Cash on Delivery</span>
                  <p className="text-sm text-gray-500">
                    Pay when you receive your order
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-white rounded-lg shadow p-6 sticky top-24">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
              
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>
                    {deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-3">
                  <span>Total</span>
                  <span className="text-orange-600">{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              {loading ? 'Processing...' : `Place Order • ${formatPrice(total)}`}
            </Button>

            <p className="text-xs text-gray-500 text-center mt-4">
              By placing your order, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}
