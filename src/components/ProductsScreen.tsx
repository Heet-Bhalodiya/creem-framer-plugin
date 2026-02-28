// Third-Party Imports
import { RefreshCcw } from 'lucide-react'

// Type Imports
import type { Product, InsertType } from '../types'

// Util Imports
import { formatPrice } from '../utils/formatters'

type ProductsScreenProps = {
  products: Product[]
  testMode: boolean
  apiKey: string
  onClearKey: () => void
  onInsert: (type: InsertType) => void
  onProductClick: (product: Product) => void
  onRefresh: () => void
  loading: boolean
}

export function ProductsScreen({
  products,
  onClearKey,
  onInsert,
  onProductClick,
  onRefresh,
  loading
}: ProductsScreenProps) {
  return (
    <div className='bg-accent flex h-full w-full flex-col gap-3 overflow-x-hidden overflow-y-auto p-3'>
      <div className='flex shrink-0 items-center gap-2.5 rounded-xl border-2 border-black bg-white p-3 shadow-[3px_3px_0px_0px_#000]'>
        <img src='/creem.svg' alt='Creem Logo' className='block h-[18px]' />
        <button
          onClick={onClearKey}
          className='ml-auto flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border-none bg-black text-white transition-transform active:scale-90'
        >
          <svg
            width='18'
            height='18'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' />
            <polyline points='16 17 21 12 16 7' />
            <line x1='21' y1='12' x2='9' y2='12' />
          </svg>
        </button>
      </div>

      <div className='flex min-h-0 flex-1 flex-col gap-3'>
        <div className='flex min-h-0 flex-1 flex-col gap-3 rounded-2xl border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_#000]'>
          <div className='flex items-center justify-between'>
            <h3 className='m-0 text-lg font-black tracking-tight'>Products</h3>
            <div className='flex items-center gap-2'>
              <button
                onClick={onRefresh}
                disabled={loading}
                className='bg-accent size-[22px] rounded-md px-1.5 py-0.5 text-[11px] transition-colors hover:bg-purple-500 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500'
                style={{ border: `1px solid black`, color: 'black' }}
              >
                <RefreshCcw className={`${loading ? 'animate-spin' : ''}`} />
              </button>
              <div className='bg-accent rounded-md border border-black px-1.5 py-0.5 text-[11px] font-black'>
                {products.length}
              </div>
            </div>
          </div>

          <div className='-mx-1 flex flex-1 flex-col gap-2.5 overflow-x-hidden overflow-y-auto px-1 pt-1' role='list'>
            {products.length === 0 ? (
              <div className='py-8 text-center text-sm font-bold text-gray-500'>No products found.</div>
            ) : (
              products.map(product => (
                <div
                  key={product.id}
                  onClick={() => onProductClick(product)}
                  className='flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-black bg-white p-3 shadow-[3px_3px_0px_0px_#000] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_0px_#000]'
                >
                  <div className='flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 border-black bg-gray-100'>
                    {product.image_url ? (
                      <img src={product.image_url} className='h-full w-full object-cover' alt='' />
                    ) : (
                      <svg
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='#ccc'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      >
                        <rect x='3' y='3' width='18' height='18' rx='2' ry='2' />
                        <circle cx='8.5' cy='8.5' r='1.5' />
                        <polyline points='21 15 16 10 5 21' />
                      </svg>
                    )}
                  </div>

                  <div className='flex min-w-0 flex-1 flex-col gap-0.5'>
                    <div className='truncate text-sm leading-tight font-black'>{product.name}</div>
                    {product.price !== undefined && (
                      <div className='text-xs font-extrabold text-gray-600'>
                        {formatPrice(product.price, product.currency, product.type, product.billingPeriod)}
                      </div>
                    )}
                  </div>
                  <div className='font-black'>→</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className='flex shrink-0 gap-2'>
        <button
          onClick={() => onInsert('button')}
          className='flex-1 rounded-xl border-2 border-black bg-black px-3 py-3 text-sm font-black text-white shadow-[3px_3px_0px_0px_#A78BFA] transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#A78BFA] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_#A78BFA]'
        >
          Insert Button
        </button>
        <button
          onClick={() => onInsert('pricing')}
          className='flex-1 rounded-xl border-2 border-black bg-black px-3 py-3 text-sm font-black text-white shadow-[3px_3px_0px_0px_#A78BFA] transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#A78BFA] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_#A78BFA]'
        >
          Insert Pricing
        </button>
      </div>
    </div>
  )
}
