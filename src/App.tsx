// React Imports
import { useState, useCallback } from 'react'

// Third-Party Imports
import { framer } from 'framer-plugin'

// Type Imports
import type { Product, Screen, InsertType, CheckoutType } from './types'

// Component Imports
import { fetchProducts } from './services/api'
import { SetupScreen } from './components/SetupScreen'
import { ProductsScreen } from './components/ProductsScreen'
import { InsertScreen } from './components/InsertScreen'
import { ProductDetailScreen } from './components/ProductDetailScreen'

// Plugin Configuration
const PLUGIN_CONFIG = {
  POSITION: 'top right' as const,
  WIDTH: 350,
  HEIGHT: 570
}

const STORAGE_KEYS = {
  API_KEY: 'creem_api_key'
}

// Initialize plugin UI
framer.showUI({
  position: PLUGIN_CONFIG.POSITION,
  width: PLUGIN_CONFIG.WIDTH,
  height: PLUGIN_CONFIG.HEIGHT
})

export function App() {
  // State Management
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(STORAGE_KEYS.API_KEY) ?? '')
  const isKeyStored = !!localStorage.getItem(STORAGE_KEYS.API_KEY)
  const [screen, setScreen] = useState<Screen>(() => (isKeyStored ? 'products' : 'home'))
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [testMode, setTestMode] = useState(false)
  const [insertType, setInsertType] = useState<InsertType>('button')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [checkoutType, setCheckoutType] = useState<CheckoutType>('new-tab')

  // API Key Management
  const saveKey = useCallback((key: string) => {
    localStorage.setItem(STORAGE_KEYS.API_KEY, key)
    setApiKey(key)
  }, [])

  const clearKey = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.API_KEY)
    setApiKey('')
    setScreen('home')
    setProducts([])
  }, [])

  // Screen Rendering
  if (screen === 'home' || !isKeyStored) {
    return (
      <SetupScreen
        apiKey={apiKey}
        setApiKey={setApiKey}
        onConnect={async key => {
          setLoading(true)
          setError('')
          const result = await fetchProducts(key, testMode)

          setLoading(false)

          if (result.error) {
            setError(result.error)
          } else {
            saveKey(key)
            setProducts(result.data ?? [])
            setScreen('products')
          }
        }}
        testMode={testMode}
        setTestMode={setTestMode}
        loading={loading}
        error={error}
      />
    )
  }

  if (screen === 'insert') {
    return (
      <InsertScreen
        insertType={insertType}
        setInsertType={setInsertType}
        products={products}
        testMode={testMode}
        checkoutType={checkoutType}
        setCheckoutType={setCheckoutType}
        onBack={() => setScreen('products')}
      />
    )
  }

  if (screen === 'productDetail' && selectedProduct) {
    return (
      <ProductDetailScreen
        product={selectedProduct}
        onBack={() => {
          setSelectedProduct(null)
          setScreen('products')
        }}
        onSelect={() => {
          setSelectedProduct(null)
          setScreen('insert')
        }}
      />
    )
  }

  return (
    <ProductsScreen
      products={products}
      testMode={testMode}
      apiKey={apiKey}
      onClearKey={clearKey}
      onInsert={type => {
        setInsertType(type)
        setScreen('insert')
      }}
      onProductClick={product => {
        setSelectedProduct(product)
        setScreen('productDetail')
      }}
      onRefresh={async () => {
        setLoading(true)
        const result = await fetchProducts(apiKey, testMode)

        setLoading(false)
        if (!result.error) setProducts(result.data ?? [])
      }}
      loading={loading}
    />
  )
}
