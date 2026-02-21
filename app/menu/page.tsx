'use client'

import { useState } from 'react'
import FoodList from '@/components/food/FoodList'
import { Input } from '@/components/ui/Input'
import { Search, ChefHat, Utensils, Coffee, Pizza, Dessert, Sparkles } from 'lucide-react'

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
    <div className="space-y-9">
      {/* Header */}
      <div className="surface-warm p-6 text-center md:p-9">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-orange-200/70 bg-white/80 px-4 py-2 text-sm font-semibold text-gray-700">
          <Sparkles className="h-4 w-4 text-primary" />
          Freshly curated every day
        </div>
        <h1 className="mt-4 text-4xl font-black text-gray-900 md:text-5xl">Our Menu</h1>
        <p className="mx-auto mt-3 max-w-2xl text-gray-500">
          Explore bold flavors, chef specials, and comfort favorites made for quick delivery.
        </p>
      </div>

      {/* Search Bar */}
      <div className="mx-auto max-w-2xl">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search dishes, e.g. pizza, pasta, burger..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-14 rounded-2xl border-white bg-white/80 pl-12 text-base shadow-card"
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
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-primary text-white shadow-glow'
                  : 'bg-white/85 text-gray-600 shadow-card hover:-translate-y-0.5 hover:bg-orange-50 hover:text-primary'
              }`}
            >
              <Icon className="h-5 w-5" />
              {category.name}
            </button>
          )
        })}
      </div>

      {/* Food List */}
      <FoodList
        category={selectedCategory === 'all' ? undefined : selectedCategory}
        searchQuery={searchQuery}
      />
    </div>
  )
}
