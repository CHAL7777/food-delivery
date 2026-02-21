'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Heart, Flame, Star, Clock3 } from 'lucide-react'
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
  const rating = typeof food.rating === 'number' ? food.rating : null

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
      <article className="group hover-lift surface-panel overflow-hidden">
        {/* Image Container */}
        <div className="relative h-56 overflow-hidden">
          {/* Badges */}
          <div className="absolute left-3 top-3 z-10 flex flex-col gap-2">
            {food.isPopular && (
              <span className="flex items-center gap-1 rounded-full bg-gradient-primary px-3 py-1 text-xs font-semibold text-white shadow-lg">
                <Star className="h-3 w-3 fill-current" />
                Popular
              </span>
            )}
            {food.isSpicy && (
              <span className="flex items-center gap-1 rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white shadow-lg">
                <Flame className="h-3 w-3" />
                Spicy
              </span>
            )}
          </div>

          {/* Like Button */}
          <button
            onClick={handleLike}
            className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm transition-transform hover:scale-110"
          >
            <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
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

          {!food.isAvailable && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/45">
              <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-gray-900">Sold out</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="mb-2 flex items-start justify-between gap-3">
            <h3 className="line-clamp-1 text-lg font-black text-gray-900 transition-colors group-hover:text-primary">
              {food.name}
            </h3>
            {rating !== null && (
              <div className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-700">
                <Star className="h-3.5 w-3.5 fill-current" />
                {rating.toFixed(1)}
              </div>
            )}
          </div>

          <p className="mb-4 line-clamp-2 text-sm text-gray-500">
            {food.description || 'Freshly prepared with quality ingredients and bold flavor.'}
          </p>

          <div className="mb-4 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <Clock3 className="h-3.5 w-3.5 text-primary" />
              <span>{food.preparationTime ? `${food.preparationTime} min` : 'Fast prep'}</span>
            </div>
            <span>{(food.totalReviews || 0) > 0 ? `${food.totalReviews} reviews` : 'New item'}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-2xl font-black text-gradient">
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
              className={food.isAvailable ? 'rounded-full bg-gradient-primary px-4 text-white hover:shadow-glow' : 'rounded-full'}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              {food.isAvailable ? 'Add' : 'Sold out'}
            </Button>
          </div>
        </div>
      </article>
    </Link>
  )
}
