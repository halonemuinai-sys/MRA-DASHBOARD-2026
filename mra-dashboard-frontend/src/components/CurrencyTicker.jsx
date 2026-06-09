import { useApp } from '../context/AppContext'
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react'

export default function CurrencyTicker() {
  const { rates, changes, ratesLoading, lastRatesUpdated } = useApp()

  const pairs = [
    { label: 'USD/IDR', value: rates.USD, change: changes.USD, decimals: 2 },
    { label: 'EUR/IDR', value: rates.EUR, change: changes.EUR, decimals: 2 },
    { label: 'SGD/IDR', value: rates.SGD, change: changes.SGD, decimals: 2 },
    { label: 'GBP/IDR', value: rates.GBP, change: changes.GBP, decimals: 2 },
    { label: 'JPY/IDR', value: rates.JPY, change: changes.JPY, decimals: 2 },
  ]

  const marqueeStyle = `
    @keyframes marquee {
      0% { transform: translateX(0%); }
      100% { transform: translateX(-50%); }
    }
    .animate-marquee-custom {
      display: inline-flex;
      white-space: nowrap;
      animation: marquee 45s linear infinite;
    }
    .animate-marquee-custom:hover {
      animation-play-state: paused;
    }
  `

  return (
    <div className="w-full bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/60 rounded-xl px-4 py-2 flex items-center justify-between gap-6 overflow-hidden mb-6 shadow-sm backdrop-blur-sm select-none">
      <style dangerouslySetInnerHTML={{ __html: marqueeStyle }} />
      
      {/* Live Status indicator */}
      <div className="flex items-center gap-2 shrink-0 border-r border-slate-200/80 dark:border-slate-800/80 pr-4">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">KURS LIVE</span>
      </div>

      {/* Scrolling/Running Ticker area */}
      <div className="flex-1 overflow-hidden relative">
        <div className="animate-marquee-custom flex gap-16 cursor-grab active:cursor-grabbing">
          {/* Double the array elements to ensure seamless loop */}
          {[...pairs, ...pairs].map((p, idx) => {
            const isUp = p.change >= 0
            const TrendIcon = isUp ? TrendingUp : TrendingDown
            const textColor = isUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
            const bgColor = isUp ? 'bg-emerald-500/5 dark:bg-emerald-500/10' : 'bg-rose-500/5 dark:bg-rose-500/10'
            const borderColor = isUp ? 'border-emerald-500/20 dark:border-emerald-500/10' : 'border-rose-500/20 dark:border-rose-500/10'
            
            return (
              <div key={`${p.label}-${idx}`} className="inline-flex items-center gap-2.5">
                <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 tracking-tight">{p.label}</span>
                <span className="text-xs font-black text-slate-850 dark:text-slate-200 font-mono">
                  {p.value.toLocaleString('id-ID', { minimumFractionDigits: p.decimals, maximumFractionDigits: p.decimals })}
                </span>
                <div className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded border ${bgColor} ${borderColor} ${textColor} text-[9px] font-black font-mono leading-none`}>
                  <TrendIcon size={9} />
                  <span>{isUp ? '+' : ''}{p.change.toFixed(2)}%</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Info indicator */}
      <div className="shrink-0 text-[9px] font-bold text-slate-400 dark:text-slate-500 border-l border-slate-200/80 dark:border-slate-800/80 pl-4 flex items-center gap-1.5">
        <RefreshCw size={9} className={`${ratesLoading ? 'animate-spin' : ''}`} />
        <span className="font-mono">Last Updated: {lastRatesUpdated || 'Fetching...'}</span>
      </div>
    </div>
  )
}
