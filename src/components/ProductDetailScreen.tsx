// Type Imports
import type { Product } from '../types'

// Util Imports
import { formatPrice } from '../utils/formatters'

type ProductDetailScreenProps = {
  product: Product
  onBack: () => void
  onSelect: () => void
}

export function ProductDetailScreen({ product, onBack, onSelect }: ProductDetailScreenProps) {
  return (
    <div className='bg-accent flex h-full w-full flex-col gap-3 overflow-x-hidden overflow-y-auto p-3'>
      <button
        onClick={onBack}
        className='flex w-fit items-center gap-1.5 rounded-lg border-2 border-black bg-black px-2.5 py-1.5 text-xs font-black text-white shadow-[2px_2px_0px_0px_#000] transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#000]'
      >
        ← BACK
      </button>

      <div className='flex flex-1 flex-col gap-4 rounded-2xl border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_#000]'>
        <div className='flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl border-2 border-black bg-gray-50'>
          {product.image_url ? (
            <img src={product.image_url} className='h-full w-full object-cover' alt={product.name} />
          ) : (
            <svg
              width='64'
              height='64'
              viewBox='0 0 24 24'
              fill='none'
              stroke='#ddd'
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

        <div>
          <div className='flex items-start justify-between gap-2.5'>
            <h2 className='m-0 text-xl leading-tight font-black'>{product.name}</h2>
            <div className='rounded-lg border-2 border-black bg-black px-2 py-1 text-sm font-black whitespace-nowrap text-white'>
              {formatPrice(product.price ?? 0, product.currency, product.type, product.billingPeriod)}
            </div>
          </div>
          {product.description && (
            <p className='mt-3 text-sm leading-relaxed font-semibold text-gray-600'>{product.description}</p>
          )}
        </div>

        <div className='mt-auto flex flex-col gap-2.5'>
          <button
            onClick={onSelect}
            className='rounded-xl border-2 border-black bg-black px-4 py-4 text-base font-black text-white shadow-[4px_4px_0px_0px_#A78BFA] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#A78BFA] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[3px_3px_0px_0px_#A78BFA]'
          >
            Add Buy Button
          </button>
          <div className='text-center text-[10px] font-bold text-gray-500'>PRODUCT ID: {product.id}</div>
        </div>
      </div>
    </div>
  )
}
