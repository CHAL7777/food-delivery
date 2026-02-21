'use client'

import { useState } from 'react'
import FoodList from '@/components/food/FoodList'
import { Input } from '@/components/ui/Input'
import { Search, ChefHat, Utensils, Coffee, Pizza, Dessert } from 'lucide-react'

const categories = [
  { id: 'all', name: 'All', icon: ChefHat },
  { id: 'main', name: 'Main Course', icon: Utensils },
  { id: 'breakfast', name: 'Breakfast', icon: Coffee },
  { id: 'pizza', name: 'Pizza', icon: Pizza },
  { id: 'dessert', name: 'Desserts', icon: Dessert },
]

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Our Menu</h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          Explore our delicious selection of dishes crafted by our expert chefs
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search for dishes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 text-lg"
          />
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-3">
        {categories.map((category) => {
          const Icon = category.icon
          const isActive = selectedCategory === category.id
          
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-primary text-white shadow-glow'
                  : 'bg-white text-gray-600 hover:bg-gray-50 shadow-card hover:shadow-card-hover'
              }`}
            >
              <Icon className="w-5 h-5" />
              {category.name}
            </button>
          )
        })}
      </div>

      {/* Food List */}
      <FoodList category={selectedCategory === 'all' ? undefined : selectedCategory} />
    </div>
  )
}

