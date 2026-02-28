// Type Imports
import type { Product, ProductPair, UnpairedProduct } from '../types'

export function getBaseName(name: string): string {
  return name
    .replace(/\(monthly\)/gi, '')
    .replace(/\(yearly\)/gi, '')
    .replace(/\(annual\)/gi, '')
    .replace(/- monthly/gi, '')
    .replace(/- yearly/gi, '')
    .replace(/- annual/gi, '')
    .replace(/monthly/gi, '')
    .replace(/yearly/gi, '')
    .replace(/annual/gi, '')
    .replace(/\/month/gi, '')
    .replace(/\/year/gi, '')
    .replace(/per month/gi, '')
    .replace(/per year/gi, '')
    .trim()
}

/**
 * Groups recurring products into monthly/yearly pairs
 * @param products - Array of all products
 * @param billingType - Filter by billing type
 * @returns Array of product pairs with both monthly and yearly variants
 */
export function getProductPairs(products: Product[], billingType?: 'one_time' | 'recurring'): ProductPair[] {
  if (billingType === 'one_time') return []
  const recurringProducts = products.filter(p => p.type === 'recurring')
  const pairMap = new Map<string, ProductPair>()

  recurringProducts.forEach(product => {
    const baseName = getBaseName(product.name)
    const isMonthly = product.billingPeriod === 'every-month'
    const isYearly = product.billingPeriod === 'every-year'

    if (!pairMap.has(baseName)) {
      pairMap.set(baseName, {
        baseName,
        monthly: null,
        yearly: null,
        hasMonthly: false,
        hasYearly: false
      })
    }

    const pair = pairMap.get(baseName)!

    if (isMonthly && !pair.monthly) {
      pair.monthly = product
      pair.hasMonthly = true
    } else if (isYearly && !pair.yearly) {
      pair.yearly = product
      pair.hasYearly = true
    } else if (!pair.monthly) {
      // If no interval indicator, treat as monthly by default
      pair.monthly = product
      pair.hasMonthly = true
    }
  })

  // Only return pairs that have BOTH monthly AND yearly
  return Array.from(pairMap.values()).filter(p => p.hasMonthly && p.hasYearly)
}

/**
 * Finds products that have only one billing variant (incomplete pairs)
 * @param products - Array of all products
 * @param billingType - Filter by billing type
 * @returns Array of unpaired products with missing variants
 */
export function getUnpairedProducts(products: Product[], billingType?: 'one_time' | 'recurring'): UnpairedProduct[] {
  if (billingType === 'one_time') return []
  const recurringProducts = products.filter(p => p.type === 'recurring')
  const pairMap = new Map<string, { baseName: string; monthly: Product | null; yearly: Product | null }>()

  recurringProducts.forEach(product => {
    const baseName = getBaseName(product.name)
    const isMonthly = product.billingPeriod === 'every-month'
    const isYearly = product.billingPeriod === 'every-year'

    if (!pairMap.has(baseName)) {
      pairMap.set(baseName, { baseName, monthly: null, yearly: null })
    }

    const pair = pairMap.get(baseName)!

    if (isMonthly && !pair.monthly) {
      pair.monthly = product
    } else if (isYearly && !pair.yearly) {
      pair.yearly = product
    } else if (!pair.monthly) {
      pair.monthly = product
    }
  })

  // Return products that have ONLY monthly or ONLY yearly (missing the pair)
  return Array.from(pairMap.values())
    .filter(p => (p.monthly && !p.yearly) || (!p.monthly && p.yearly))
    .map(p => ({
      baseName: p.baseName,
      hasMonthly: !!p.monthly,
      hasYearly: !!p.yearly,
      product: p.monthly || p.yearly!
    }))
}
