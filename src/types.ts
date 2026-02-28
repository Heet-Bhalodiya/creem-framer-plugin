/**
 * Type Definitions
 * All TypeScript types for the application
 */

// Product Types
export type Product = {
  id: string
  name: string
  description: string
  price: number
  currency: string
  type: 'one_time' | 'recurring'
  billingPeriod?: string
  image_url?: string
}

export type ProductPair = {
  baseName: string
  monthly: Product | null
  yearly: Product | null
  hasMonthly: boolean
  hasYearly: boolean
}

export type UnpairedProduct = {
  baseName: string
  hasMonthly: boolean
  hasYearly: boolean
  product: Product
}

// Application Types
export type Screen = 'home' | 'products' | 'insert' | 'productDetail'

export type InsertType = 'button' | 'pricing'

export type CheckoutType = 'new-tab' | 'embed'

export type BillingType = 'one_time' | 'recurring'

export type PricingInterval = 'monthly' | 'yearly'
