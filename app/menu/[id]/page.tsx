'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { Food } from '@/types/food'
import { formatPrice } from '@/lib/utils'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import toast from 'react-hot-toast'

export default function FoodDetailPage() {
  const { id } = useParams()
  const [food, setFood] = useState<Food | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const addItem = useCartStore((state) => state.addItem)

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const response = await fetch(`/api/foods/${id}`)
        if (!response.ok) throw new Error('Failed to fetch food')
        const data = await response.json()
        setFood(data)
      } catch (error) {
        console.error('Error fetching food:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFood()
  }, [id])

  const handleAddToCart = () => {
    if (!food) return
    addItem(food, quantity)
    toast.success(`${quantity} x ${food.name} added to cart!`)
  }

  if (loading) return <LoadingSpinner />
  
  if (!food) return (
    <div className="text-center py-12">
      <h2 className="text-2xl font-bold text-gray-800">Food not found</h2>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Image */}
        <div className="relative h-96 rounded-lg overflow-hidden">
          <Image
            src={food.image || '/images/placeholder-food.jpg'}
            alt={food.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Details */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{food.name}</h1>
          
          <p className="text-gray-600 text-lg mb-4">
            {food.description}
          </p>

          <div className="text-3xl font-bold text-orange-600 mb-6">
            {formatPrice(food.price)}
          </div>

          {food.ingredients && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Ingredients:</h3>
              <ul className="list-disc list-inside text-gray-600">
                {food.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>
          )}

          {food.preparationTime && (
            <p className="text-gray-600 mb-6">
              Preparation time: {food.preparationTime} minutes
            </p>
          )}

          {/* Quantity and Add to Cart */}
          <div className="flex items-center gap-4">
            <div className="flex items-center border rounded-lg">
              <button
                className="px-4 py-2 text-xl"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <span className="px-4 py-2 border-x">{quantity}</span>
              <button
                className="px-4 py-2 text-xl"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>

            <Button
              size="lg"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={!food.isAvailable}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {food.isAvailable ? 'Add to Cart' : 'Sold Out'}
            </Button>
          </div>

          {!food.isAvailable && (
            <p className="text-red-600 mt-4">
              This item is currently unavailable
            </p>
          )}
        </div>
      </div>
    </div>
  )
}