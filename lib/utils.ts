import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-ET', {
    style: 'currency',
    currency: 'ETB',
    minimumFractionDigits: 2
  }).format(price)
}

export const generateTransactionRef = () => {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1000000)
  return `TX-${timestamp}-${random}`
}

export const calculateDeliveryFee = (distance: number) => {
  const baseFee = 50
  const perKmRate = 10
  return baseFee + (distance * perKmRate)
}