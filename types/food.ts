export interface Food {
  id: string
  name: string
  description: string | null
  price: number
  categoryId: string | null
  category?: Category | null
  image: string | null
  images: string[]
  ingredients: string[]
  isAvailable: boolean
  isFeatured: boolean
  isPopular: boolean
  isSpicy: boolean
  preparationTime: number | null
  rating: number | null
  totalReviews: number | null
  originalPrice?: number
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  slug: string
  image: string | null
  description: string | null
  createdAt: Date
}

export interface CartItem extends Food {
  quantity: number
}