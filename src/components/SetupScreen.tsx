// React Imports
import { useEffect, useRef } from 'react'

type SetupScreenProps = {
  apiKey: string
  setApiKey: (k: string) => void
  onConnect: (k: string) => void
  testMode: boolean
  setTestMode: (v: boolean) => void
  loading: boolean
  error: string
}

export function SetupScreen({ apiKey, setApiKey, onConnect, testMode, setTestMode, loading, error }: SetupScreenProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <div className='bg-accent flex h-full w-full flex-col gap-3 overflow-x-hidden overflow-y-auto p-3'>
      <div className='flex shrink-0 items-center gap-2.5 rounded-xl border-2 border-black bg-white p-3 shadow-[3px_3px_0px_0px_#000]'>
        <img src='/creem.svg' alt='Creem Logo' className='block h-[18px]' />
      </div>

      <div className='flex flex-1 flex-col gap-3'>
        <div className='flex flex-col gap-3 rounded-2xl border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_#000]'>
          <div>
            <h2 className='m-0 text-xl leading-tight font-black tracking-tight'>Connect Account</h2>
            <p className='mt-1 text-xs font-semibold text-gray-600'>Enter your API key from the dashboard.</p>
          </div>

          <div className='flex flex-col gap-1.5'>
            <label className='text-xs font-black'>Creem API Key</label>
            <input
              ref={inputRef}
              type='password'
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && apiKey && onConnect(apiKey)}
              placeholder='creem_live_...'
              className='w-full rounded-lg border-2 border-black px-2.5 py-2 text-sm font-bold shadow-[inset_2px_2px_0px_rgba(0,0,0,0.05)] outline-none'
              aria-label='Creem API Key'
            />
          </div>

          <div className='flex cursor-pointer items-center gap-2.5' onClick={() => setTestMode(!testMode)}>
            <div
              className={`relative h-[22px] w-10 rounded-full border-2 border-black transition-colors ${testMode ? 'bg-black' : 'bg-white'}`}
            >
              <div
                className={`absolute top-[3px] h-3 w-3 rounded-full transition-all ${testMode ? 'left-[21px] bg-white' : 'left-[3px] bg-black'}`}
              />
            </div>
            <span className='text-xs font-extrabold'>Use Test Mode</span>
          </div>

          <button
            onClick={() => onConnect(apiKey)}
            disabled={loading || !apiKey}
            className={`mt-1 flex items-center justify-center gap-2 rounded-xl border-2 border-black px-4 py-3.5 text-sm font-black transition-all ${
              loading || !apiKey
                ? 'cursor-not-allowed bg-gray-300 text-gray-500'
                : 'bg-black text-white shadow-[3px_3px_0px_0px_#A78BFA] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#A78BFA]'
            }`}
          >
            {loading ? 'Fetching...' : 'Fetch Products'}
            {!loading && apiKey && <span className='text-base'>→</span>}
          </button>

          {error && (
            <div className='rounded-lg border-2 border-black bg-red-300 px-3 py-2.5 text-xs font-extrabold text-black shadow-[2px_2px_0px_0px_#000]'>
              ⚠️ ERROR: {error}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
