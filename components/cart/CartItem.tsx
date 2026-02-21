'use client'

import Image from 'next/image'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useCartStore } from '@/store/cartStore'
import { CartItem as CartItemType } from '@/types/food'
import { formatPrice } from '@/lib/utils'
import { useState } from 'react'

interface CartItemProps {
  item: CartItemType
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore()
  const [isRemoving, setIsRemoving] = useState(false)

  const handleRemove = () => {
    setIsRemoving(true)
    setTimeout(() => {
      removeItem(item.id)
    }, 300)
  }

  return (
    <div className={`flex items-center gap-4 p-4 bg-white rounded-2xl shadow-card transition-all duration-300 ${isRemoving ? 'opacity-0 scale-95' : 'hover:shadow-card-hover'}`}>
      {/* Image */}
      <div className="relative h-24 w-24 flex-shrink-0 rounded-xl overflow-hidden">
        <Image
          src={item.image || '/images/placeholder-food.jpg'}
          alt={item.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Details */}
      <div className="flex-grow min-w-0">
        <h3 className="font-bold text-lg truncate">{item.name}</h3>
        <p className="text-sm text-gray-500">{formatPrice(item.price)} each</p>
        
        {/* Quantity Controls */}
        <div className="flex items-center gap-2 mt-3">
          <div className="flex items-center bg-gray-100 rounded-xl">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-l-xl"
              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
            >
              <Minus className="h-4 w-4" />
            </Button>
            
            <span className="w-10 text-center font-semibold">{item.quantity}</span>
            
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-r-xl"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <Button
            size="icon"
            variant="ghost"
            className="ml-auto h-8 w-8 text-red-500 hover:bg-red-50"
            onClick={handleRemove}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Total */}
      <div className="text-right flex-shrink-0">
        <p className="text-xl font-bold text-gradient">
          {formatPrice(item.price * item.quantity)}
        </p>
      </div>
    </div>
  )
}
