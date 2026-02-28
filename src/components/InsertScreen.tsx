// React Imports
import { useState, useCallback } from 'react'

// Third-Party Imports
import { framer } from 'framer-plugin'
import { Check, Loader2, Info } from 'lucide-react'

// Type Imports
import type { Product, InsertType, CheckoutType, BillingType, PricingInterval } from '../types'

// Util Imports
import { formatPrice } from '../utils/formatters'
import { getProductPairs, getUnpairedProducts } from '../utils/productHelpers'
import { ensureCodeFileExists } from '../utils/codeFileHelpers'

// Component Imports
import BUTTON_COMPONENT_SOURCE from './CreemCheckoutButton.template.tsx?raw'
import PRICING_TABLE_COMPONENT_SOURCE from './CreemPricingTable.template.tsx?raw'

// Configuration Constants
const DEFAULTS = {
  ACCENT_COLOR: '#FF6B35',
  BUTTON_TEXT: 'Buy Now',
  BILLING_TYPE: 'recurring' as const,
  PRICING_INTERVAL: 'monthly' as const
}

const PRICING_LIMITS = {
  MIN_TIERS: 1,
  MAX_TIERS: 5
}

type InsertScreenProps = {
  insertType: InsertType
  setInsertType: React.Dispatch<React.SetStateAction<InsertType>>
  products: Product[]
  testMode: boolean
  checkoutType: CheckoutType
  setCheckoutType: React.Dispatch<React.SetStateAction<CheckoutType>>
  onBack: () => void
}

export function InsertScreen({
  insertType,
  setInsertType,
  products,
  testMode,
  checkoutType,
  setCheckoutType,
  onBack
}: InsertScreenProps) {
  // State management
  const [selectedId, setSelectedId] = useState<string>(() => products[0]?.id ?? '')
  const [buttonText, setButtonText] = useState<string>(DEFAULTS.BUTTON_TEXT)
  const [accentColor, setAccentColor] = useState<string>(DEFAULTS.ACCENT_COLOR)
  const [inserting, setInserting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [billingType, setBillingType] = useState<BillingType>(DEFAULTS.BILLING_TYPE)
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [pricingInterval, setPricingInterval] = useState<PricingInterval>(DEFAULTS.PRICING_INTERVAL)

  // Compute product pairs and unpaired products
  const productPairs = getProductPairs(products, billingType)
  const unpairedProducts = getUnpairedProducts(products, billingType)
  const showPairMode = billingType === 'recurring' && productPairs.length > 0
  const filteredProducts = products.filter(p => p.type === billingType)

  // Product selection handlers
  const toggleProduct = (id: string) => {
    setSelectedProducts(prev => (prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]))
  }

  const moveProduct = (fromIndex: number, toIndex: number) => {
    setSelectedProducts(prev => {
      const next = [...prev]
      const [moved] = next.splice(fromIndex, 1)

      next.splice(toIndex, 0, moved)

      return next
    })
  }

  // Insert handler
  const handleInsert = useCallback(async () => {
    // Validate product selection for button type
    if (insertType === 'button' && !selectedId) {
      framer.notify('Please select a product from the dropdown', { variant: 'error' })

      return
    }

    // Validate product selection for pricing table
    if (insertType === 'pricing' && selectedProducts.length < PRICING_LIMITS.MIN_TIERS) {
      framer.notify('Please select at least 1 product for the pricing table', { variant: 'error' })

      return
    }

    if (insertType === 'pricing' && selectedProducts.length > PRICING_LIMITS.MAX_TIERS) {
      framer.notify('Maximum 5 tiers allowed. Please deselect some products.', { variant: 'error' })

      return
    }

    setInserting(true)

    try {
      // Ensure code files exist (auto-create if needed)
      if (insertType === 'button') {
        const buttonFile = await ensureCodeFileExists('CreemCheckoutButton.tsx', BUTTON_COMPONENT_SOURCE)
        const componentExport = buttonFile.exports?.find(e => e.type === 'component')

        if (!componentExport?.insertURL) {
          framer.notify('Component export not found in CreemCheckoutButton.tsx', { variant: 'error' })
          setInserting(false)

          return
        }

        await framer.addComponentInstance({
          url: componentExport.insertURL,
          attributes: {
            controls: {
              productId: selectedId,
              buttonText,
              backgroundColor: accentColor,
              testMode,
              type: checkoutType === 'embed' ? 'Embed' : 'New Tab',
              linkTarget: '_blank'
            }
          }
        })
        framer.notify('Checkout button inserted!', { variant: 'success' })
      } else {
        const pricingFile = await ensureCodeFileExists('CreemPricingTable.tsx', PRICING_TABLE_COMPONENT_SOURCE)
        const componentExport = pricingFile.exports?.find(e => e.type === 'component')

        if (!componentExport?.insertURL) {
          framer.notify('Component export not found in CreemPricingTable.tsx', { variant: 'error' })
          setInserting(false)

          return
        }

        // Build tier data from selected products
        const tiers = showPairMode
          ? selectedProducts.map(baseName => {
              const pair = productPairs.find(p => p.baseName === baseName)!
              const monthlyProduct = pair.monthly
              const yearlyProduct = pair.yearly
              const baseProduct = monthlyProduct || yearlyProduct!

              return {
                name: baseName,
                monthlyPrice: (monthlyProduct?.price ?? yearlyProduct?.price ?? 0) / 100,
                yearlyPrice: (yearlyProduct?.price ?? monthlyProduct?.price ?? 0) / 100,
                description: baseProduct.description || `Perfect for ${baseName.toLowerCase()} users`,
                features: `- ${baseName} access\n- All features included\n- Priority support`,
                productId: baseProduct.id,
                monthlyProductId: monthlyProduct?.id || '',
                yearlyProductId: yearlyProduct?.id || '',
                ctaText: 'Get Started',
                highlighted: selectedProducts.indexOf(baseName) === Math.floor(selectedProducts.length / 2)
              }
            })
          : selectedProducts.map((productId, i) => {
              const p = products.find(prod => prod.id === productId)!

              return {
                name: p.name,
                monthlyPrice: p.price / 100,
                yearlyPrice: p.price / 100,
                description: p.description || `Perfect for ${p.name.toLowerCase()} users`,
                features: `- ${p.name} access\n- All features included\n- Priority support`,
                productId: p.id,
                monthlyProductId: '',
                yearlyProductId: '',
                ctaText: 'Get Started',
                highlighted: i === Math.floor(selectedProducts.length / 2),
                isOneTime: p.type === 'one_time'
              }
            })

        await framer.addComponentInstance({
          url: componentExport.insertURL,
          attributes: {
            controls: {
              tiers,
              type: checkoutType,
              accentColor,
              testMode,
              showYearlyToggle: showPairMode
            }
          }
        })
        framer.notify('Pricing table inserted with your products!', { variant: 'success' })
      }

      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        setInserting(false)
      }, 2000)
    } catch (err) {
      console.error('Failed to insert:', err)
      framer.notify(`Insert failed: ${(err as Error).message}`, { variant: 'error' })
      setInserting(false)
    }
  }, [
    insertType,
    selectedId,
    buttonText,
    accentColor,
    checkoutType,
    testMode,
    selectedProducts,
    products,
    productPairs,
    showPairMode
  ])

  const selectedProduct = products.find(p => p.id === selectedId)

  return (
    <div className='bg-accent flex h-full w-full flex-col gap-3 overflow-x-hidden overflow-y-auto p-3'>
      {/* Header */}
      <div className='relative flex shrink-0 items-center justify-center rounded-xl border-2 border-black bg-white p-3 shadow-[3px_3px_0px_0px_#000]'>
        <button
          onClick={onBack}
          className='absolute left-3 flex h-7 w-7 items-center justify-center rounded-lg border-2 border-black bg-black text-sm font-black text-white shadow-[2px_2px_0px_0px_#000] transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#000]'
        >
          ←
        </button>
        <span className='text-sm font-black tracking-tight'>
          {insertType === 'button' ? 'Checkout Button' : 'Pricing Table'}
        </span>
      </div>

      {/* Tab Switcher */}
      <div
        className='flex gap-2 rounded-xl border-2 border-black bg-white p-2 shadow-[3px_3px_0px_0px_#000]'
        role='tablist'
      >
        <button
          className={`flex-1 cursor-pointer rounded-lg border-2 border-black px-3 py-2.5 text-xs font-black transition-all ${insertType === 'button' ? 'bg-gray-800 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]' : 'bg-white text-black hover:bg-gray-50'}`}
          onClick={() => setInsertType('button')}
          role='tab'
          aria-selected={insertType === 'button'}
        >
          Button
        </button>
        <button
          className={`flex-1 cursor-pointer rounded-lg border-2 border-black px-3 py-2.5 text-xs font-black transition-all ${insertType === 'pricing' ? 'bg-gray-800 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]' : 'bg-white text-black hover:bg-gray-50'}`}
          onClick={() => setInsertType('pricing')}
          role='tab'
          aria-selected={insertType === 'pricing'}
        >
          Pricing Table
        </button>
      </div>

      {/* Content Area */}
      {insertType === 'button' ? (
        <ButtonConfiguration
          products={products}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          buttonText={buttonText}
          setButtonText={setButtonText}
          checkoutType={checkoutType}
          setCheckoutType={setCheckoutType}
          accentColor={accentColor}
          setAccentColor={setAccentColor}
          selectedProduct={selectedProduct}
        />
      ) : (
        <PricingConfiguration
          billingType={billingType}
          setBillingType={setBillingType}
          showPairMode={showPairMode}
          productPairs={productPairs}
          unpairedProducts={unpairedProducts}
          pricingInterval={pricingInterval}
          setPricingInterval={setPricingInterval}
          filteredProducts={filteredProducts}
          selectedProducts={selectedProducts}
          toggleProduct={toggleProduct}
          moveProduct={moveProduct}
          accentColor={accentColor}
          setAccentColor={setAccentColor}
        />
      )}

      {/* Insert Button */}
      <button
        className={`flex w-full shrink-0 items-center justify-center gap-2 rounded-xl border-2 border-black px-4 py-3.5 text-sm font-black tracking-tight transition-all ${
          inserting ||
          success ||
          (insertType === 'button' && !selectedId) ||
          (insertType === 'pricing' && selectedProducts.length < 1)
            ? 'cursor-not-allowed border-gray-300 bg-gray-200 text-gray-400'
            : 'bg-black text-white shadow-[3px_3px_0px_0px_#A78BFA] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#A78BFA] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_#A78BFA]'
        }`}
        onClick={handleInsert}
        disabled={
          inserting ||
          success ||
          (insertType === 'button' && !selectedId) ||
          (insertType === 'pricing' && selectedProducts.length < 1)
        }
        aria-busy={inserting}
      >
        {success ? (
          <>
            <Check size={16} /> Inserted!
          </>
        ) : inserting ? (
          <>
            <Loader2 size={16} className='animate-spin' /> Inserting…
          </>
        ) : (
          `Insert ${insertType === 'button' ? 'Button' : 'Pricing Table'}`
        )}
      </button>
    </div>
  )
}

// Sub-component: Button Configuration
type ButtonConfigurationProps = {
  products: Product[]
  selectedId: string
  setSelectedId: React.Dispatch<React.SetStateAction<string>>
  buttonText: string
  setButtonText: React.Dispatch<React.SetStateAction<string>>
  checkoutType: CheckoutType
  setCheckoutType: React.Dispatch<React.SetStateAction<CheckoutType>>
  accentColor: string
  setAccentColor: React.Dispatch<React.SetStateAction<string>>
  selectedProduct: Product | undefined
}

function ButtonConfiguration({
  products,
  selectedId,
  setSelectedId,
  buttonText,
  setButtonText,
  checkoutType,
  setCheckoutType,
  accentColor,
  setAccentColor,
  selectedProduct
}: ButtonConfigurationProps) {
  return (
    <div className='flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-1'>
      {/* Product Selector */}
      <div className='flex flex-col gap-2 rounded-xl border-2 border-black bg-white p-3 shadow-[3px_3px_0px_0px_#000]'>
        <label className='text-[10px] font-black tracking-wider text-gray-600 uppercase'>Product</label>
        <div className='relative'>
          <select
            className='w-full cursor-pointer appearance-none rounded-lg bg-white px-3 pr-10 text-sm font-bold text-black outline-none'
            style={{ border: '1px solid #000' }}
            value={selectedId}
            onChange={e => setSelectedId(e.target.value)}
            aria-label='Select product'
          >
            <option value=''>Select your product</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} - {formatPrice(p.price, p.currency, p.type, p.billingPeriod)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Button Text */}
      <div className='flex flex-col gap-2 rounded-xl border-2 border-black bg-white p-3 shadow-[3px_3px_0px_0px_#000]'>
        <label className='text-[10px] font-black tracking-wider text-gray-600 uppercase'>Button Text</label>
        <input
          className='w-full rounded-lg bg-white px-3 py-2.5 text-sm font-bold text-black outline-none placeholder:text-gray-400'
          value={buttonText}
          style={{ border: '1px solid #000' }}
          onChange={e => setButtonText(e.target.value)}
          placeholder='Buy Now'
        />
      </div>

      {/* Checkout Type */}
      <div className='flex flex-col gap-2 rounded-xl border-2 border-black bg-white p-3 shadow-[3px_3px_0px_0px_#000]'>
        <label className='text-[10px] font-black tracking-wider text-gray-600 uppercase'>Checkout Type</label>
        <div className='flex gap-2'>
          <button
            className={`flex-1 cursor-pointer rounded-lg border-2 border-black px-3 py-2 text-xs font-black transition-all ${checkoutType === 'embed' ? 'bg-gray-800 text-white' : 'bg-white text-black hover:bg-gray-50'}`}
            onClick={() => setCheckoutType('embed')}
          >
            Embed
          </button>
          <button
            className={`flex-1 cursor-pointer rounded-lg border-2 border-black px-3 py-2 text-xs font-black transition-all ${checkoutType === 'new-tab' ? 'bg-gray-800 text-white' : 'bg-white text-black hover:bg-gray-50'}`}
            onClick={() => setCheckoutType('new-tab')}
          >
            New Tab
          </button>
        </div>
      </div>

      {/* Accent Color */}
      <div className='flex flex-col gap-2 rounded-xl border-2 border-black bg-white p-3 shadow-[3px_3px_0px_0px_#000]'>
        <label className='text-[10px] font-black tracking-wider text-gray-600 uppercase'>Accent Color</label>
        <div className='flex min-w-0 items-center gap-2.5'>
          <input
            type='color'
            className='h-12 w-12 shrink-0 cursor-pointer rounded-lg border-2 border-gray-300 bg-white p-1'
            value={accentColor}
            onChange={e => setAccentColor(e.target.value)}
            aria-label='Accent color picker'
          />
          <input
            className='min-w-0 flex-1 rounded-lg border-2 border-gray-300 bg-gray-50 px-3 py-2.5 font-mono text-sm font-bold text-gray-800 outline-none focus:border-black focus:bg-white'
            value={accentColor}
            onChange={e => setAccentColor(e.target.value)}
            placeholder='#FF6B35'
          />
        </div>
      </div>

      {/* Preview */}
      {selectedProduct && (
        <div className='flex flex-col items-center gap-3 rounded-xl border-2 border-black bg-white p-4 shadow-[3px_3px_0px_0px_#000]'>
          <p className='self-start text-[10px] font-black tracking-wider text-gray-600 uppercase'>Preview</p>
          <button
            className='cursor-default rounded-lg border-none px-6 py-3 text-sm font-semibold tracking-tight text-white'
            style={{ backgroundColor: accentColor }}
          >
            {buttonText || 'Buy Now'}
          </button>
          <p className='text-center text-[10px] font-bold break-all text-gray-500'>
            Product ID: <code className='font-mono text-black'>{selectedId}</code>
          </p>
        </div>
      )}
    </div>
  )
}

// Sub-component: Pricing Configuration (continued in next part due to size)
type PricingConfigurationProps = {
  billingType: BillingType
  setBillingType: React.Dispatch<React.SetStateAction<BillingType>>
  showPairMode: boolean
  productPairs: ReturnType<typeof getProductPairs>
  unpairedProducts: ReturnType<typeof getUnpairedProducts>
  pricingInterval: PricingInterval
  setPricingInterval: React.Dispatch<React.SetStateAction<PricingInterval>>
  filteredProducts: Product[]
  selectedProducts: string[]
  toggleProduct: (id: string) => void
  moveProduct: (from: number, to: number) => void
  accentColor: string
  setAccentColor: React.Dispatch<React.SetStateAction<string>>
}

function PricingConfiguration({
  billingType,
  setBillingType,
  showPairMode,
  productPairs,
  unpairedProducts,
  pricingInterval,
  setPricingInterval,
  filteredProducts,
  selectedProducts,
  toggleProduct,
  moveProduct,
  accentColor,
  setAccentColor
}: PricingConfigurationProps) {
  return (
    <div className='flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-1'>
      {/* Billing Type Filter */}
      <div className='flex flex-col gap-2 rounded-xl border-2 border-black bg-white p-3 shadow-[3px_3px_0px_0px_#000]'>
        <label className='text-[10px] font-black tracking-wider text-gray-600 uppercase'>Product Type</label>
        <div className='flex gap-2'>
          <button
            className={`flex-1 cursor-pointer rounded-lg border-2 border-black px-3 py-2 text-xs font-black transition-all ${billingType === 'one_time' ? 'bg-gray-800 text-white' : 'bg-white text-black hover:bg-gray-50'}`}
            onClick={() => setBillingType('one_time')}
          >
            One-time
          </button>
          <button
            className={`flex-1 cursor-pointer rounded-lg border-2 border-black px-3 py-2 text-xs font-black transition-all ${billingType === 'recurring' ? 'bg-gray-800 text-white' : 'bg-white text-black hover:bg-gray-50'}`}
            onClick={() => setBillingType('recurring')}
          >
            Subscription
          </button>
        </div>
      </div>

      {/* Product Selection */}
      <div className='flex flex-col gap-2 rounded-xl border-2 border-black bg-white p-3 shadow-[3px_3px_0px_0px_#000]'>
        <label className='text-[10px] font-black tracking-wider text-gray-600 uppercase'>
          {showPairMode ? 'Select Pricing Tiers' : 'Select Products'} ({selectedProducts.length}/5)
        </label>

        {showPairMode && productPairs.length > 0 && (
          <div className='mb-1 flex items-center gap-2'>
            <button
              className={`flex-1 cursor-pointer rounded-lg border-2 border-black px-3 py-2 text-xs font-black transition-all ${pricingInterval === 'monthly' ? 'bg-gray-800 text-white' : 'bg-white text-black hover:bg-gray-50'}`}
              onClick={() => setPricingInterval('monthly')}
            >
              Monthly
            </button>
            <button
              className={`flex-1 cursor-pointer rounded-lg border-2 border-black px-3 py-2 text-xs font-black transition-all ${pricingInterval === 'yearly' ? 'bg-gray-800 text-white' : 'bg-white text-black hover:bg-gray-50'}`}
              onClick={() => setPricingInterval('yearly')}
            >
              Yearly
            </button>
          </div>
        )}

        {filteredProducts.length === 0 ? (
          <div className='flex items-center gap-2.5 rounded-lg border-2 border-yellow-500 bg-yellow-100 px-3 py-3 text-xs leading-relaxed font-bold text-yellow-900'>
            <Info size={16} className='shrink-0' />
            <p>No {billingType === 'one_time' ? 'one-time' : 'subscription'} products found. Try the other type.</p>
          </div>
        ) : showPairMode ? (
          <>
            {/* Unpaired Products Warning */}
            {unpairedProducts.length > 0 && (
              <div className='flex flex-col gap-2 rounded-lg border-2 border-amber-500 bg-amber-50 p-3'>
                <div className='flex items-start gap-2'>
                  <Info size={14} className='mt-0.5 shrink-0 text-amber-700' />
                  <div className='flex-1'>
                    <p className='text-[11px] leading-tight font-black text-amber-900 uppercase'>
                      Incomplete Product Pairs
                    </p>
                    <p className='mt-1 text-[10px] leading-relaxed font-semibold text-amber-800'>
                      These products are missing a variant. Create the missing monthly or yearly version to show them
                      here:
                    </p>
                  </div>
                </div>
                <div className='flex flex-col gap-1.5'>
                  {unpairedProducts.map(item => (
                    <div
                      key={item.baseName}
                      className='flex items-center gap-2 rounded-md border border-amber-300 bg-white px-2.5 py-2'
                    >
                      <span className='flex-1 truncate text-[11px] font-black text-gray-900'>{item.baseName}</span>
                      <span className='shrink-0 rounded bg-amber-200 px-2 py-0.5 text-[9px] font-black text-amber-900 uppercase'>
                        {item.hasMonthly ? 'Missing Yearly' : 'Missing Monthly'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Product Pairs List */}
            <div className='flex flex-col gap-2' role='list'>
              {productPairs.map(pair => {
                const isSelected = selectedProducts.includes(pair.baseName)
                const selectedIndex = selectedProducts.indexOf(pair.baseName)
                const displayProduct = pricingInterval === 'monthly' ? pair.monthly : pair.yearly
                const fallbackProduct = pair.monthly ?? pair.yearly
                const product = displayProduct ?? fallbackProduct!
                const hasInterval = pricingInterval === 'monthly' ? pair.hasMonthly : pair.hasYearly

                return (
                  <div
                    key={pair.baseName}
                    className={`flex cursor-pointer items-center gap-2.5 rounded-lg border-2 px-3 py-2.5 transition-all ${
                      isSelected ? 'border-accent bg-accent/20' : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}
                    onClick={() => (selectedProducts.length < 5 || isSelected ? toggleProduct(pair.baseName) : null)}
                    role='listitem'
                  >
                    <input
                      type='checkbox'
                      checked={isSelected}
                      onChange={() => {}}
                      className='h-4 w-4 cursor-pointer rounded border-2 border-gray-400'
                      style={{ accentColor }}
                    />
                    <div className='min-w-0 flex-1'>
                      <div className='flex items-center gap-2'>
                        <span className='truncate text-sm font-black text-black'>{pair.baseName}</span>
                        {isSelected && (
                          <span
                            className='rounded px-1.5 py-0.5 text-[10px] font-black'
                            style={{ background: accentColor, color: '#fff' }}
                          >
                            #{selectedIndex + 1}
                          </span>
                        )}
                      </div>
                      <div className='flex items-center gap-1.5'>
                        {!hasInterval && (
                          <span className='text-[9px] font-bold text-yellow-600'>
                            Only {pricingInterval === 'monthly' ? 'yearly' : 'monthly'}
                          </span>
                        )}
                        <span className='text-xs font-bold text-gray-600'>
                          {formatPrice(product.price, product.currency, product.type, product.billingPeriod)}
                        </span>
                        {pair.hasMonthly && pair.hasYearly && (
                          <span className='text-accent text-[9px] font-black'>Both</span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        ) : (
          <div className='flex flex-col gap-2' role='list'>
            {filteredProducts.map(p => {
              const isSelected = selectedProducts.includes(p.id)
              const selectedIndex = selectedProducts.indexOf(p.id)
              const priceDisplay = formatPrice(p.price, p.currency, p.type, p.billingPeriod)

              return (
                <div
                  key={p.id}
                  className={`flex cursor-pointer items-center gap-2.5 rounded-lg border-2 px-3 py-2.5 transition-all ${
                    isSelected ? 'border-accent bg-accent/20' : 'border-gray-300 bg-white hover:border-gray-400'
                  }`}
                  onClick={() => (selectedProducts.length < 5 || isSelected ? toggleProduct(p.id) : null)}
                  role='listitem'
                >
                  <input
                    type='checkbox'
                    checked={isSelected}
                    onChange={() => {}}
                    className='h-4 w-4 cursor-pointer rounded border-2 border-gray-400'
                    style={{ accentColor }}
                  />
                  <div className='min-w-0 flex-1'>
                    <div className='flex items-center gap-2'>
                      <span className='truncate text-sm font-black text-black'>{p.name}</span>
                      {isSelected && (
                        <span
                          className='rounded px-1.5 py-0.5 text-[10px] font-black'
                          style={{ background: accentColor, color: '#fff' }}
                        >
                          #{selectedIndex + 1}
                        </span>
                      )}
                    </div>
                    <span className='text-xs font-bold text-gray-600'>{priceDisplay}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Reorder Selected Products */}
      {selectedProducts.length > 1 && (
        <div className='flex flex-col gap-2 rounded-xl border-2 border-black bg-white p-3 shadow-[3px_3px_0px_0px_#000]'>
          <label className='text-[10px] font-black tracking-wider text-gray-600 uppercase'>Order (Left to Right)</label>
          <div className='flex flex-col gap-1.5'>
            {selectedProducts.map((id, i) => {
              // In pair mode, id is a baseName; otherwise it's a product ID
              const displayName = showPairMode ? id : filteredProducts.find(p => p.id === id)?.name || 'Unknown'

              return (
                <div
                  key={id}
                  className='flex items-center gap-2 rounded-lg border-2 border-gray-300 bg-white px-3 py-2'
                >
                  <span className='w-5 text-xs font-black text-gray-600'>#{i + 1}</span>
                  <span className='flex-1 truncate text-sm font-bold text-black'>{displayName}</span>
                  <div className='flex gap-1'>
                    <button
                      className='flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border-2 border-black bg-white text-sm font-black text-black transition-all hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-100 disabled:text-gray-400'
                      onClick={() => moveProduct(i, i - 1)}
                      disabled={i === 0}
                      aria-label='Move up'
                    >
                      ↑
                    </button>
                    <button
                      className='flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border-2 border-black bg-white text-sm font-black text-black transition-all hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-100 disabled:text-gray-400'
                      onClick={() => moveProduct(i, i + 1)}
                      disabled={i === selectedProducts.length - 1}
                      aria-label='Move down'
                    >
                      ↓
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Accent Color */}
      <div className='flex flex-col gap-2 rounded-xl border-2 border-black bg-white p-3 shadow-[3px_3px_0px_0px_#000]'>
        <label className='text-[10px] font-black tracking-wider text-gray-600 uppercase'>Accent Color</label>
        <div className='flex min-w-0 items-center gap-2.5'>
          <input
            type='color'
            className='h-12 w-12 shrink-0 cursor-pointer rounded-lg border-2 border-gray-300 bg-white p-1'
            value={accentColor}
            onChange={e => setAccentColor(e.target.value)}
            aria-label='Accent color picker'
          />
          <input
            className='min-w-0 flex-1 rounded-lg border-2 border-gray-300 bg-gray-50 px-3 py-2.5 font-mono text-sm font-bold text-gray-800 outline-none focus:border-black focus:bg-white'
            value={accentColor}
            onChange={e => setAccentColor(e.target.value)}
            placeholder='#FF6B35'
          />
        </div>
      </div>

      {/* Info */}
      {selectedProducts.length >= 1 && (
        <div className='border-accent bg-accent/20 flex items-start gap-2.5 rounded-xl border-2 px-3 py-3 text-xs leading-relaxed font-bold text-black shadow-[3px_3px_0px_0px_#000]'>
          <Info size={16} className='shrink-0' />
          <p>
            Ready to insert! {selectedProducts.length} {selectedProducts.length === 1 ? 'tier' : 'tiers'} will be
            created with your selected products.
          </p>
        </div>
      )}
    </div>
  )
}
