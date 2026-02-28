// Type Imports
import type { Product } from '../types'

// API Configuration
const API_CONFIG = {
  BASE_URL: {
    PRODUCTION: 'https://api.creem.io',
    TEST: 'https://test-api.creem.io',
    DEV_PROXY: {
      PRODUCTION: '/creem-api',
      TEST: '/creem-test-api'
    }
  },
  CHECKOUT_URL: {
    PRODUCTION: 'https://creem.io/payment',
    TEST: 'https://creem.io/test/payment'
  },
  ENDPOINTS: {
    PRODUCTS: '/v1/products/search?page_size=50'
  }
}

type FetchProductsResponse = {
  data?: Product[]
  error?: string
}

/**
 * Fetches products from Creem API
 * @param apiKey - Creem API key
 * @param testMode - Whether to use test API endpoint
 * @returns Promise with products data or error message
 */
export async function fetchProducts(apiKey: string, testMode: boolean): Promise<FetchProductsResponse> {
  try {
    // Use proxy in development to avoid CORS, direct URLs in production
    const base = import.meta.env.DEV
      ? testMode
        ? API_CONFIG.BASE_URL.DEV_PROXY.TEST
        : API_CONFIG.BASE_URL.DEV_PROXY.PRODUCTION
      : testMode
        ? API_CONFIG.BASE_URL.TEST
        : API_CONFIG.BASE_URL.PRODUCTION

    const url = `${base}${API_CONFIG.ENDPOINTS.PRODUCTS}`

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'x-api-key': apiKey
      }
    })

    // Handle authentication errors
    if (res.status === 401 || res.status === 403) {
      return { error: 'Invalid API key. Check your credentials.' }
    }

    // Handle other HTTP errors
    if (!res.ok) {
      return { error: `API error ${res.status}. Try again.` }
    }

    const json = await res.json()

    // Transform API response to internal Product type
    const items: Product[] = (json.items ?? []).map((p: Record<string, unknown>) => ({
      id: p.id as string,
      name: (p.name as string) ?? 'Unnamed',
      description: (p.description as string) ?? '',
      price: (p.price as number) ?? 0,
      currency: (p.currency as string) ?? 'USD',
      type: ((p.billing_type as string) === 'recurring' ? 'recurring' : 'one_time') as 'one_time' | 'recurring',
      billingPeriod: p.billing_period as string | undefined,
      image_url: (p.image_url || p.image || p.thumbnail || p.cover_image) as string | undefined
    }))

    return { data: items }
  } catch (err) {
    console.error('Fetch error:', err)

    return { error: 'Network error. Check your connection.' }
  }
}
