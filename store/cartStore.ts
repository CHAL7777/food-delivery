import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem, Food } from '@/types/food'

interface CartStore {
  items: CartItem[]
  addItem: (item: Food, quantity?: number) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(i => i.id === item.id)
          
          if (existingItem) {
            return {
              items: state.items.map(i =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              )
            }
          }
          
          return {
            items: [...state.items, { ...item, quantity }]
          }
        })
      },
      
      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter(i => i.id !== itemId)
        }))
      },
      
      updateQuantity: (itemId, quantity) => {
        if (quantity < 1) {
          get().removeItem(itemId)
          return
        }
        
        set((state) => ({
          items: state.items.map(i =>
            i.id === itemId ? { ...i, quantity } : i
          )
        }))
      },
      
      clearCart: () => set({ items: [] }),
      
      getTotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity, 
          0
        )
      },
      
      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      }
    }),
    {
      name: 'cart-storage'
    }
  )
)
