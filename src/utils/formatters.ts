/**
 * Formatting Utilities
 * Functions for formatting prices, currencies, and display values
 */

/**
 * Formats a price with currency and optional billing period
 * @param price - Price in cents
 * @param currency - Currency code (default: USD)
 * @param type - Product type (one_time or recurring)
 * @param billingPeriod - Billing period for recurring products
 * @returns Formatted price string
 */
export function formatPrice(
  price: number,
  currency = 'USD',
  type?: 'one_time' | 'recurring',
  billingPeriod?: string
): string {
  const amount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(price / 100)

  if (type === 'recurring' && billingPeriod) {
    const period = billingPeriod === 'every-month' ? '/month' : billingPeriod === 'every-year' ? '/year' : ''

    return `${amount}${period}`
  }

  return amount
}

/**
 * Formats a currency amount without period suffix
 * @param amount - Amount in cents
 * @param currency - Currency code
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount / 100)
}
