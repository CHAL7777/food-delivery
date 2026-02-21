import { CartItem } from './food'

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  subtotal: number
  deliveryFee: number
  total: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentMethod: PaymentMethod
  deliveryAddress: Address
  createdAt: string
  updatedAt: string
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'delivered'
  | 'cancelled'

export type PaymentStatus = 
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded'

export type PaymentMethod = 
  | 'chapa'
  | 'cash'

export interface Address {
  street: string
  city: string
  state: string
  zipCode: string
  phone: string
  instructions?: string
}