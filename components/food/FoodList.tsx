'use client'

import { useEffect, useState } from 'react'
import FoodCard from './FoodCard'
import { Food } from '@/types/food'
import { LoadingCard } from '@/components/ui/LoadingSpinner'

interface FoodListProps {
  limit?: number
  category?: string
  featured?: boolean
  searchQuery?: string
}

export default function FoodList({ limit, category, featured, searchQuery }: FoodListProps) {
  const [foods, setFoods] = useState<Food[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        setLoading(true)
        let url = '/api/foods'
        const params = new URLSearchParams()
        
        if (limit) params.append('limit', limit.toString())
        if (category) params.append('category', category)
        if (featured) params.append('featured', 'true')
        if (searchQuery?.trim()) params.append('search', searchQuery.trim())
        
        if (params.toString()) {
          url += `?${params.toString()}`
        }

        const response = await fetch(url)
        if (!response.ok) throw new Error('Failed to fetch foods')
        
        const data = await response.json()
        // API may return { data, pagination } or an array directly
        setFoods(Array.isArray(data) ? data : data?.data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load foods')
      } finally {
        setLoading(false)
      }
    }

    fetchFoods()
  }, [limit, category, featured, searchQuery])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(limit || 6)].map((_, i) => (
          <LoadingCard key={i} />
        ))}
      </div>
    )
  }
  
  if (error) return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
        <span className="text-3xl">⚠️</span>
      </div>
      <p className="text-red-600 font-medium">Error: {error}</p>
    </div>
  )

  if (foods.length === 0) return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
        <span className="text-4xl">🍽️</span>
      </div>
      <p className="text-gray-600 font-medium text-lg">No foods found</p>
      <p className="text-gray-400 text-sm mt-1">
        {searchQuery?.trim() ? `No results for "${searchQuery.trim()}".` : 'Check back later for new dishes!'}
      </p>
    </div>
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {foods.map((food, index) => (
        <div 
          key={food.id} 
          className="animate-fade-in-up"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <FoodCard food={food} />
        </div>
      ))}
    </div>
  )
}
