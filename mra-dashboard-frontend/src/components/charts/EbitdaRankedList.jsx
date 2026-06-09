import { useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import { HelpCircle } from 'lucide-react'
import { Tooltip as ShadcnTooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export default function EbitdaRankedList() {
  const { filteredBrandPerformance, fmt, currency, hideValues } = useApp()

  const rankedData = useMemo(() => {
    // Sort by EBITDA % descending
    return [...filteredBrandPerformance].sort((a, b) => b.ebitdaPct - a.ebitdaPct)
  }, [filteredBrandPerformance])

  const maxEbitdaPct = useMemo(() => {
    return rankedData.length > 0 ? Math.max(...rankedData.map(b => b.ebitdaPct), 25) : 30
  }, [rankedData])

  const segmentColors = {
    Retail: 'bg-emerald-500',
    'F&B': 'bg-teal-500',
    FnB: 'bg-teal-500',
    Media: 'bg-cyan-500'
  }

  const segmentDotColors = {
    Retail: 'bg-blue-600',
    'F&B': 'bg-orange-500',
    FnB: 'bg-orange-500',
    Media: 'bg-emerald-500'
  }

  const unitStr = currency === 'USD' ? 'USD Million' : 'IDR Billion'

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100 p-5 shadow-xl shadow-slate-100/40 flex flex-col h-full">
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <h3 className="font-bold text-slate-800 text-sm">Brand EBITDA Margin Ranking</h3>
            <TooltipProvider delayDuration={100}>
              <ShadcnTooltip>
                <TooltipTrigger asChild>
                  <button className="text-slate-400 hover:text-slate-650 transition-colors focus:outline-none">
                    <HelpCircle size={13} className="shrink-0" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="bg-slate-900 border-slate-800 text-white text-xs p-2.5 max-w-[245px] rounded-xl font-bold shadow-xl leading-normal">
                  Peringkat efisiensi profitabilitas brand berdasarkan margin EBITDA (EBITDA%), nominal EBITDA YTD, serta nominal Revenue untuk masing-masing portofolio.
                </TooltipContent>
              </ShadcnTooltip>
            </TooltipProvider>
          </div>
          <p className="text-xs text-slate-400 font-medium">Ranked profitability efficiency of brands YTD</p>
        </div>
        <div className="flex gap-2 text-[10px] font-bold">
          {['Retail', 'F&B', 'Media'].map(seg => (
            <span key={seg} className="flex items-center gap-1 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-lg text-slate-500">
              <span className={`w-1.5 h-1.5 rounded-full ${segmentDotColors[seg]}`}></span>{seg}
            </span>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin pr-1">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-150/70 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              <th className="text-left pb-2 w-10">Rank</th>
              <th className="text-left pb-2 w-36">Brand</th>
              <th className="text-center pb-2 px-4">EBITDA Margin (%)</th>
              <th className="text-right pb-2 w-24">YTD EBITDA ({unitStr})</th>
              <th className="text-right pb-2 w-24">YTD Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {rankedData.map((b, index) => {
              const barWidth = `${Math.max(3, (b.ebitdaPct / maxEbitdaPct) * 100)}%`
              const segColorClass = segmentColors[b.segment] || 'bg-emerald-500'
              const dotColorClass = segmentDotColors[b.segment] || 'bg-slate-500'

              return (
                <tr key={b.brand} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-2.5">
                    <span className="w-5 h-5 flex items-center justify-center bg-slate-100 text-slate-600 font-bold rounded-full text-[10px]">
                      {index + 1}
                    </span>
                  </td>
                  <td className="py-2.5 font-bold text-slate-800">
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColorClass}`} />
                      <span className="truncate max-w-[120px]">{b.brand}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-4">
                    <div className="flex items-center gap-3 w-full">
                      <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${segColorClass} transition-all duration-500`} style={{ width: barWidth }} />
                      </div>
                      <span className={`w-10 text-right font-black ${
                        b.ebitdaPct >= 20 ? 'text-emerald-600' :
                        b.ebitdaPct >= 12 ? 'text-blue-600' :
                        'text-rose-500'
                      }`}>
                        {hideValues ? '•••' : `${b.ebitdaPct}%`}
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 text-right font-bold text-slate-600 tabular-nums">
                    {hideValues ? '••••' : b.ebitda.toFixed(1)}
                  </td>
                  <td className="py-2.5 text-right font-bold text-slate-450 text-slate-400 tabular-nums">
                    {hideValues ? '••••' : b.revenue.toFixed(1)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
