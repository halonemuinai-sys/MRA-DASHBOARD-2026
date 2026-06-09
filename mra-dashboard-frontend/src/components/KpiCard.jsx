import { TrendingUp, TrendingDown, Minus, HelpCircle } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useApp } from '../context/AppContext'
import { KpiCardSkeleton } from './ui/SkeletonLoader'

const colorStyles = {
  blue: {
    border: 'border-blue-100/60 dark:border-blue-950/50 focus-within:border-blue-300 dark:focus-within:border-blue-700',
    iconBg: 'bg-gradient-to-br from-blue-500/10 to-blue-500/5 dark:from-blue-500/20 dark:to-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20 dark:border-blue-500/30',
    glow: 'from-blue-500/[0.03] to-blue-500/0 dark:from-blue-500/[0.05] dark:to-blue-500/0',
    marker: 'bg-blue-500 shadow-sm shadow-blue-500/40',
    badge: 'bg-blue-50 dark:bg-blue-950/35 text-blue-600 dark:text-blue-400 border-blue-100/60 dark:border-blue-900/30'
  },
  green: {
    border: 'border-emerald-100/60 dark:border-emerald-950/50 focus-within:border-emerald-300 dark:focus-within:border-emerald-700',
    iconBg: 'bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 dark:from-emerald-500/20 dark:to-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 dark:border-emerald-500/30',
    glow: 'from-emerald-500/[0.03] to-emerald-500/0 dark:from-emerald-500/[0.05] dark:to-emerald-500/0',
    marker: 'bg-emerald-500 shadow-sm shadow-emerald-500/40',
    badge: 'bg-emerald-50 dark:bg-emerald-950/35 text-emerald-600 dark:text-emerald-450 border-emerald-100/60 dark:border-emerald-900/30'
  },
  amber: {
    border: 'border-amber-100/60 dark:border-amber-950/50 focus-within:border-amber-300 dark:focus-within:border-amber-700',
    iconBg: 'bg-gradient-to-br from-amber-500/10 to-amber-500/5 dark:from-amber-500/20 dark:to-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 dark:border-amber-500/30',
    glow: 'from-amber-500/[0.03] to-amber-500/0 dark:from-amber-500/[0.05] dark:to-amber-500/0',
    marker: 'bg-amber-500 shadow-sm shadow-amber-500/40',
    badge: 'bg-amber-50 dark:bg-amber-950/35 text-amber-600 dark:text-amber-400 border-amber-100/60 dark:border-amber-900/30'
  },
  purple: {
    border: 'border-purple-100/60 dark:border-purple-950/50 focus-within:border-purple-300 dark:focus-within:border-purple-700',
    iconBg: 'bg-gradient-to-br from-purple-500/10 to-purple-500/5 dark:from-purple-500/20 dark:to-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 dark:border-purple-500/30',
    glow: 'from-purple-500/[0.03] to-purple-500/0 dark:from-purple-500/[0.05] dark:to-purple-500/0',
    marker: 'bg-purple-500 shadow-sm shadow-purple-500/40',
    badge: 'bg-purple-50 dark:bg-purple-950/35 text-purple-600 dark:text-purple-400 border-purple-100/60 dark:border-purple-900/30'
  },
  rose: {
    border: 'border-rose-100/60 dark:border-rose-950/50 focus-within:border-rose-300 dark:focus-within:border-rose-700',
    iconBg: 'bg-gradient-to-br from-rose-500/10 to-rose-500/5 dark:from-rose-500/20 dark:to-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 dark:border-rose-500/30',
    glow: 'from-rose-500/[0.03] to-rose-500/0 dark:from-rose-500/[0.05] dark:to-rose-500/0',
    marker: 'bg-rose-500 shadow-sm shadow-rose-500/40',
    badge: 'bg-rose-50 dark:bg-rose-950/35 text-rose-600 dark:text-rose-450 border-rose-100/60 dark:border-rose-900/30'
  },
  cyan: {
    border: 'border-cyan-100/60 dark:border-cyan-950/50 focus-within:border-cyan-300 dark:focus-within:border-cyan-700',
    iconBg: 'bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 dark:from-cyan-500/20 dark:to-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 dark:border-cyan-500/30',
    glow: 'from-cyan-500/[0.03] to-cyan-500/0 dark:from-cyan-500/[0.05] dark:to-cyan-500/0',
    marker: 'bg-cyan-500 shadow-sm shadow-cyan-500/40',
    badge: 'bg-cyan-50 dark:bg-cyan-950/35 text-cyan-600 dark:text-cyan-455 border-cyan-100/60 dark:border-cyan-900/30'
  },
  indigo: {
    border: 'border-indigo-100/60 dark:border-indigo-950/50 focus-within:border-indigo-300 dark:focus-within:border-indigo-700',
    iconBg: 'bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 dark:from-indigo-500/20 dark:to-indigo-500/10 text-indigo-650 dark:text-indigo-400 border border-indigo-500/20 dark:border-indigo-500/30',
    glow: 'from-indigo-500/[0.03] to-indigo-500/0 dark:from-indigo-500/[0.05] dark:to-indigo-500/0',
    marker: 'bg-indigo-500 shadow-sm shadow-indigo-500/40',
    badge: 'bg-indigo-50 dark:bg-indigo-950/35 text-indigo-600 dark:text-indigo-400 border-indigo-100/60 dark:border-indigo-900/30'
  },
  teal: {
    border: 'border-teal-100/60 dark:border-teal-950/50 focus-within:border-teal-300 dark:focus-within:border-teal-700',
    iconBg: 'bg-gradient-to-br from-teal-500/10 to-teal-500/5 dark:from-teal-500/20 dark:to-teal-500/10 text-teal-650 dark:text-teal-400 border border-teal-500/20 dark:border-teal-500/30',
    glow: 'from-teal-500/[0.03] to-teal-500/0 dark:from-teal-500/[0.05] dark:to-teal-500/0',
    marker: 'bg-teal-500 shadow-sm shadow-teal-500/40',
    badge: 'bg-teal-50 dark:bg-teal-950/35 text-teal-600 dark:text-teal-450 border-teal-100/60 dark:border-teal-900/30'
  }
}

export default function KpiCard({ label, value, sub, yoy, pctRev, color = 'blue', icon: Icon, tooltip, onClick }) {
  const { hideValues, isTransitioning } = useApp()
  if (isTransitioning) return <KpiCardSkeleton />
  const styles = colorStyles[color] || colorStyles.blue
  const isPos = yoy > 0
  const isNeg = yoy < 0

  const displaySub = (sub && hideValues)
    ? sub.replace(/\d+(\.\d+)?%/g, '•••%').replace(/\d+(\.\d+)?/g, '•••')
    : sub

  return (
    <div 
      onClick={onClick}
      className={`relative overflow-hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-2xl border ${styles.border} p-5 shadow-sm hover:shadow-lg dark:hover:shadow-black/30 hover:-translate-y-1 transition-all duration-300 group cursor-pointer`}
    >
      
      {/* Subtle background gradient glow */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${styles.glow} rounded-full blur-2xl -z-10 transition-opacity duration-300 group-hover:opacity-100`} />
      
      {/* Sleek left indicator bar that animates on hover */}
      <div className={`absolute left-0 top-[25%] bottom-[25%] w-1 rounded-r-md ${styles.marker} transition-all duration-300 group-hover:top-[12%] group-hover:bottom-[12%]`} />

      <div className="flex items-start justify-between mb-3.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-widest leading-none truncate">
            {label}
          </p>
          {tooltip && (
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger className="text-slate-400 hover:text-slate-650 dark:hover:text-slate-350 transition-colors focus:outline-none shrink-0 inline-flex items-center">
                  <HelpCircle size={11.5} />
                </TooltipTrigger>
                <TooltipContent className="bg-slate-900 border-slate-800 text-white text-xs p-2.5 max-w-[220px] rounded-xl font-bold shadow-xl leading-normal">
                  {tooltip}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        
        {Icon && (
          <div className={`w-8 h-8 rounded-xl ${styles.iconBg} flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
            <Icon size={14} />
          </div>
        )}
      </div>

      <div className="mb-1">
        <span className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-none tabular-nums transition-colors group-hover:text-slate-950 dark:group-hover:text-white">
          {value}
        </span>
      </div>

      {displaySub && (
        <p className="text-[10.5px] text-slate-400 dark:text-slate-500 font-semibold tracking-wide mb-1 leading-snug">
          {displaySub}
        </p>
      )}

      {(yoy !== undefined || pctRev !== undefined) && (
        <div className="flex items-center gap-2 pt-3.5 border-t border-slate-100/70 dark:border-slate-800/80 mt-3 flex-wrap">
          {yoy !== undefined && (
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
              isNeg 
                ? 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-450 border-rose-100/60 dark:border-rose-900/30' 
                : isPos 
                  ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 border-emerald-100/60 dark:border-emerald-900/30' 
                  : 'bg-slate-50 dark:bg-slate-800/30 text-slate-500 dark:text-slate-400 border-slate-100/60 dark:border-slate-750/30'
            }`}>
              {isPos ? <TrendingUp size={10.5} strokeWidth={3} /> : isNeg ? <TrendingDown size={10.5} strokeWidth={3} /> : <Minus size={10.5} strokeWidth={3} />}
              {hideValues ? '•••' : `${isPos ? '+' : ''}${yoy}`}% YoY
            </span>
          )}
          
          {pctRev !== undefined && (
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black border ${styles.badge}`}>
              {hideValues ? '•••' : pctRev}% of Rev
            </span>
          )}
        </div>
      )}
    </div>
  )
}
