'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Category } from '@/types/food'
import toast from 'react-hot-toast'

type FoodFormState = {
  name: string
  description: string
  price: string
  category_id: string
  image: string
  ingredients: string[]
  preparation_time: string
  is_available: boolean
  is_featured: boolean
  is_popular: boolean
  is_spicy: boolean
}

const initialFormState: FoodFormState = {
  name: '',
  description: '',
  price: '',
  category_id: '',
  image: '',
  ingredients: [''],
  preparation_time: '',
  is_available: true,
  is_featured: false,
  is_popular: false,
  is_spicy: false
}

export default function EditFoodPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const foodId = useMemo(() => String(params.id || ''), [params.id])

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState<FoodFormState>(initialFormState)

  useEffect(() => {
    const fetchData = async () => {
      if (!foodId) return

      try {
        const [foodResponse, categoriesResponse] = await Promise.all([
          fetch(`/api/foods/${foodId}`),
          fetch('/api/categories')
        ])

        if (!foodResponse.ok) {
          throw new Error('Failed to load food details')
        }

        if (!categoriesResponse.ok) {
          throw new Error('Failed to load categories')
        }

        const food = await foodResponse.json()
        const categoriesData = await categoriesResponse.json()

        setCategories(Array.isArray(categoriesData) ? categoriesData : [])
        setFormData({
          name: food.name || '',
          description: food.description || '',
          price: food.price?.toString() || '',
          category_id: food.categoryId || '',
          image: food.image || '',
          ingredients:
            Array.isArray(food.ingredients) && food.ingredients.length > 0
              ? food.ingredients
              : [''],
          preparation_time: food.preparationTime?.toString() || '',
          is_available: Boolean(food.isAvailable),
          is_featured: Boolean(food.isFeatured),
          is_popular: Boolean(food.isPopular),
          is_spicy: Boolean(food.isSpicy)
        })
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to load food')
        router.push('/admin/foods')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [foodId, router])

  const handleIngredientChange = (index: number, value: string) => {
    const next = [...formData.ingredients]
    next[index] = value
    setFormData((prev) => ({ ...prev, ingredients: next }))
  }

  const addIngredient = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, '']
    }))
  }

  const removeIngredient = (index: number) => {
    const next = formData.ingredients.filter((_, i) => i !== index)
    setFormData((prev) => ({
      ...prev,
      ingredients: next.length > 0 ? next : ['']
    }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSaving(true)

    try {
      const { data } = await supabase.auth.getSession()
      const accessToken = data.session?.access_token

      const response = await fetch(`/api/foods/${foodId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          price: parseFloat(formData.price),
          category_id: formData.category_id || null,
          image: formData.image.trim() || null,
          ingredients: formData.ingredients.map((item) => item.trim()).filter(Boolean),
          preparation_time: formData.preparation_time
            ? parseInt(formData.preparation_time, 10)
            : null,
          is_available: formData.is_available,
          is_featured: formData.is_featured,
          is_popular: formData.is_popular,
          is_spicy: formData.is_spicy
        })
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        throw new Error(payload?.error || 'Failed to update food')
      }

      toast.success('Food updated successfully')
      router.push('/admin/foods')
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update food')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[55vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Food</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Name *</label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            rows={4}
            className="w-full rounded-md border border-input bg-background px-3 py-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Price (ETB) *</label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, price: e.target.value }))
              }
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category *</label>
            <select
              value={formData.category_id}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, category_id: e.target.value }))
              }
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Image URL</label>
          <Input
            type="url"
            value={formData.image}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, image: e.target.value }))
            }
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Preparation Time (minutes)
          </label>
          <Input
            type="number"
            min="1"
            value={formData.preparation_time}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, preparation_time: e.target.value }))
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Ingredients</label>
          {formData.ingredients.map((ingredient, index) => (
            <div key={`${index}-${ingredient}`} className="flex gap-2 mb-2">
              <Input
                value={ingredient}
                onChange={(e) => handleIngredientChange(index, e.target.value)}
                placeholder={`Ingredient ${index + 1}`}
              />
              {formData.ingredients.length > 1 && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeIngredient(index)}
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={addIngredient}>
            Add Ingredient
          </Button>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.is_available}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, is_available: e.target.checked }))
              }
            />
            <span>Available</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.is_featured}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, is_featured: e.target.checked }))
              }
            />
            <span>Featured</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.is_popular}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, is_popular: e.target.checked }))
              }
            />
            <span>Popular</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.is_spicy}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, is_spicy: e.target.checked }))
              }
            />
            <span>Spicy</span>
          </label>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
