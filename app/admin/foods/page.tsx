'use client'

import { useEffect, useState, useMemo } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Food } from '@/types/food'
import { Plus, Edit, Trash2, Search, X, ImageIcon, ChevronUp, ChevronDown, Check, X as XIcon } from 'lucide-react'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'

type SortField = 'name' | 'category' | 'price' | 'isAvailable' | 'createdAt'
type SortOrder = 'asc' | 'desc'

const ITEMS_PER_PAGE = 10

export default function AdminFoodsPage() {
  const [foods, setFoods] = useState<Food[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedFoods, setSelectedFoods] = useState<Set<string>>(new Set())
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    fetchFoods()
  }, [])

  const fetchFoods = async () => {
    try {
      const response = await fetch('/api/foods?available=false')
      const data = await response.json()
      const foodsData = data.data || []
      setFoods(foodsData)
      
      // Extract unique categories
      const uniqueCategories = [...new Set(foodsData.map((f: Food) => f.category?.name).filter(Boolean))]
      setCategories(uniqueCategories as string[])
    } catch (error) {
      toast.error('Failed to fetch foods')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this food?')) return

    try {
      const response = await fetch(`/api/foods/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete')

      toast.success('Food deleted successfully')
      fetchFoods()
      setSelectedFoods(prev => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
    } catch (error) {
      toast.error('Failed to delete food')
    }
  }

  const handleToggleAvailability = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/foods/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: !currentStatus })
      })

      if (!response.ok) throw new Error('Failed to update availability')

      toast.success(`Food ${!currentStatus ? 'available' : 'unavailable'} successfully`)
      fetchFoods()
    } catch (error) {
      toast.error('Failed to update availability')
    }
  }

  const handleBulkDelete = async () => {
    if (selectedFoods.size === 0) return
    if (!confirm(`Are you sure you want to delete ${selectedFoods.size} food(s)?`)) return

    try {
      const deletePromises = Array.from(selectedFoods).map(id => 
        fetch(`/api/foods/${id}`, { method: 'DELETE' })
      )
      await Promise.all(deletePromises)
      
      toast.success(`${selectedFoods.size} foods deleted successfully`)
      setSelectedFoods(new Set())
      fetchFoods()
    } catch (error) {
      toast.error('Failed to delete foods')
    }
  }

  const handleSelectAll = () => {
    if (selectedFoods.size === filteredFoods.length) {
      setSelectedFoods(new Set())
    } else {
      setSelectedFoods(new Set(filteredFoods.map(f => f.id)))
    }
  }

  const handleSelectFood = (id: string) => {
    setSelectedFoods(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  const clearFilters = () => {
    setSearchQuery('')
    setCategoryFilter('all')
    setStatusFilter('all')
    setCurrentPage(1)
  }

  const filteredFoods = useMemo(() => {
    let result = [...foods]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(food => 
        food.name.toLowerCase().includes(query) ||
        food.description?.toLowerCase().includes(query) ||
        food.category?.name?.toLowerCase().includes(query)
      )
    }

    // Category filter
    if (categoryFilter !== 'all') {
      result = result.filter(food => food.category?.name === categoryFilter)
    }

    // Status filter
    if (statusFilter !== 'all') {
      const isAvailable = statusFilter === 'available'
      result = result.filter(food => food.isAvailable === isAvailable)
    }

    // Sorting
    result.sort((a, b) => {
      let comparison = 0
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'category':
          comparison = (a.category?.name || '').localeCompare(b.category?.name || '')
          break
        case 'price':
          comparison = a.price - b.price
          break
        case 'isAvailable':
          comparison = (a.isAvailable === b.isAvailable) ? 0 : a.isAvailable ? -1 : 1
          break
        case 'createdAt':
          comparison = new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
          break
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })

    return result
  }, [foods, searchQuery, categoryFilter, statusFilter, sortField, sortOrder])

  const totalPages = Math.ceil(filteredFoods.length / ITEMS_PER_PAGE)
  const paginatedFoods = filteredFoods.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const activeFiltersCount = [
    searchQuery,
    categoryFilter !== 'all',
    statusFilter !== 'all'
  ].filter(Boolean).length

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null
    return sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="text-gray-500">Loading...</div></div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Foods</h1>
        <Link href="/admin/foods/add">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add New Food
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by name, description..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-10"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <XIcon className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          </div>

          <div className="min-w-[150px]">
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="min-w-[150px]">
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>

          {activeFiltersCount > 0 && (
            <Button variant="outline" onClick={clearFilters}>
              <X className="w-4 h-4 mr-2" />
              Clear Filters ({activeFiltersCount})
            </Button>
          )}
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedFoods.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex items-center justify-between">
          <span className="text-sm text-blue-700">
            {selectedFoods.size} food(s) selected
          </span>
          <div className="flex gap-2">
            <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Selected
            </Button>
          </div>
        </div>
      )}

      {/* Results count */}
      <div className="text-sm text-gray-500 mb-4">
        Showing {paginatedFoods.length} of {filteredFoods.length} foods
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedFoods.size === filteredFoods.length && filteredFoods.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-1">
                    Name <SortIcon field="name" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('category')}>
                  <div className="flex items-center gap-1">
                    Category <SortIcon field="category" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('price')}>
                  <div className="flex items-center gap-1">
                    Price <SortIcon field="price" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('isAvailable')}>
                  <div className="flex items-center gap-1">
                    Status <SortIcon field="isAvailable" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedFoods.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <Search className="w-12 h-12 mb-4 text-gray-300" />
                      <p className="text-lg font-medium mb-1">No foods found</p>
                      <p className="text-sm">
                        {activeFiltersCount > 0 
                          ? "Try adjusting your search or filters"
                          : "Get started by adding your first food"}
                      </p>
                      {activeFiltersCount > 0 && (
                        <Button variant="outline" className="mt-4" onClick={clearFilters}>
                          Clear Filters
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedFoods.map((food) => (
                  <tr key={food.id} className={selectedFoods.has(food.id) ? 'bg-blue-50' : ''}>
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedFoods.has(food.id)}
                        onChange={() => handleSelectFood(food.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {food.name}
                      </div>
                      {food.description && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {food.description}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {food.category?.name || 'Uncategorized'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatPrice(food.price)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleAvailability(food.id, food.isAvailable)}
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer transition-colors ${
                          food.isAvailable 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {food.isAvailable ? (
                          <><Check className="w-3 h-3 mr-1" /> Available</>
                        ) : (
                          <><XIcon className="w-3 h-3 mr-1" /> Unavailable</>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {food.image ? (
                        <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100">
                          <img 
                            src={food.image} 
                            alt={food.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center">
                          <ImageIcon className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-1">
                        <Link href={`/admin/foods/edit/${food.id}`}>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDelete(food.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

