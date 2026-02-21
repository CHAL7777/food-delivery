export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  role: 'user' | 'admin'
  avatar?: string
  addresses?: UserAddress[]
  createdAt?: string
  updatedAt?: string
}

export interface UserAddress {
  id: string
  userId: string
  type: 'home' | 'work' | 'other'
  street: string
  city: string
  state: string
  zipCode: string
  isDefault: boolean
  instructions?: string
}