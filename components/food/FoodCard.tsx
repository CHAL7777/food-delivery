'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Heart, Flame, Star } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useCartStore } from '@/store/cartStore'
import { Food } from '@/types/food'
import { formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'
import { useState } from 'react'

interface FoodCardProps {
  food: Food
}

export default function FoodCard({ food }: FoodCardProps) {
  const addItem = useCartStore((state) => state.addItem)
  const [isLiked, setIsLiked] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(food)
    toast.success(`${food.name} added to cart!`)
  }

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsLiked(!isLiked)
    toast.success(isLiked ? 'Removed from favorites' : 'Added to favorites!')
  }

  return (
    <Link href={`/menu/${food.id}`}>
      <div className="group bg-white rounded-2xl shadow-card overflow-hidden hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
        {/* Image Container */}
        <div className="relative h-52 overflow-hidden">
          {/* Badges */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
            {food.isPopular && (
              <span className="px-3 py-1 bg-gradient-primary text-white text-xs font-semibold rounded-full flex items-center gap-1 shadow-lg">
                <Star className="w-3 h-3 fill-current" />
                Popular
              </span>
            )}
            {food.isSpicy && (
              <span className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full flex items-center gap-1 shadow-lg">
                <Flame className="w-3 h-3" />
                Spicy
              </span>
            )}
          </div>
          
          {/* Like Button */}
          <button
            onClick={handleLike}
            className="absolute top-3 right-3 z-10 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
          </button>
          
          {/* Image */}
          <div className="absolute inset-0 bg-gray-200">
            <Image
              src={!imageError && food.image ? food.image : '/images/placeholder-food.svg'}
              alt={food.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              onError={() => setImageError(true)}
            />
          </div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        {/* Content */}
        <div className="p-5">
          <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">
            {food.name}
          </h3>
          
          <p className="text-gray-500 text-sm mb-4 line-clamp-2">
            {food.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gradient">
                {formatPrice(food.price)}
              </span>
              {food.originalPrice && (
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(food.originalPrice)}
                </span>
              )}
            </div>
            
            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={!food.isAvailable}
              className={food.isAvailable ? 'bg-gradient-primary hover:shadow-glow' : ''}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {food.isAvailable ? 'Add' : 'Sold Out'}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  )
}
