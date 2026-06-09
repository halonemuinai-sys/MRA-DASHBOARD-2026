import { useMemo } from 'react'
import { PieChart, Pie, Cell } from 'recharts'
import { useApp } from '../../context/AppContext'
import { ArrowUpRight, HelpCircle } from 'lucide-react'
import { Tooltip as ShadcnTooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export default function GroupRevenueOverview({ isCompact = false }) {
  const { filteredBrandPerformance, filteredKpis, fmt, currency, hideValues } = useApp()

  const sortedBrands = useMemo(() => {
    return [...filteredBrandPerformance].sort((a, b) => b.revenue - a.revenue)
  }, [filteredBrandPerformance])

  const totalYtdRevenue = useMemo(() => {
    return filteredKpis.groupRevenue.value
  }, [filteredKpis])

  // Top 3 brands contribution calculations
  const top3Brands = useMemo(() => {
    return sortedBrands.slice(0, 3).map((b, i) => {
      const pct = totalYtdRevenue > 0 ? ((b.revenue / totalYtdRevenue) * 100).toFixed(1) : '0.0'
      return {
        rank: i + 1,
        brand: b.brand,
        revenue: b.revenue,
        pct: pct
      }
    })
  }, [sortedBrands, totalYtdRevenue])

  // Segment summary calculations
  const segmentStats = useMemo(() => {
    const stats = {
      Retail: { value: 0, color: '#3b82f6' },
      'F&B': { value: 0, color: '#f97316' },
      Media: { value: 0, color: '#10b981' }
    }

    filteredBrandPerformance.forEach(b => {
      const seg = b.segment === 'FnB' ? 'F&B' : b.segment
      if (stats[seg]) {
        stats[seg].value += b.revenue
      }
    })

    return Object.keys(stats).map(name => {
      const val = stats[name].value
      const pct = totalYtdRevenue > 0 ? ((val / totalYtdRevenue) * 100).toFixed(1) : '0.0'
      return {
        name,
        value: val,
        pct,
        color: stats[name].color
      }
    })
  }, [filteredBrandPerformance, totalYtdRevenue])

  const donutData = useMemo(() => {
    return segmentStats.filter(s => s.value > 0)
  }, [segmentStats])

  const formatRawBillion = (val) => {
    if (hideValues) return '••••'
    if (currency === 'USD') {
      return `$${val.toFixed(1)}M`
    }
    return `${val.toFixed(1)}B`
  }

  if (isCompact) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100 p-4 shadow-xl shadow-slate-100/40 space-y-4">
        {/* Row 1: Segment Donut + List */}
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 shrink-0 relative flex items-center justify-center bg-slate-50/50 rounded-xl border border-slate-100/50">
            <PieChart width={80} height={80}>
              <Pie
                data={donutData}
                cx="50%"
                cy="50%"
                innerRadius={24}
                outerRadius={36}
                dataKey="value"
                paddingAngle={2}
                startAngle={90}
                endAngle={-270}
              >
                {donutData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-1.5">
              <h4 className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Revenue by Segment</h4>
              <TooltipProvider delayDuration={100}>
                <ShadcnTooltip>
                  <TooltipTrigger asChild>
                    <button className="text-slate-405 hover:text-slate-650 transition-colors focus:outline-none">
                      <HelpCircle size={11} className="shrink-0 text-slate-400" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-slate-900 border-slate-800 text-white text-xs p-2.5 max-w-[245px] rounded-xl font-bold shadow-xl leading-normal">
                    Pembagian total pendapatan grup berdasarkan kontribusi dari masing-masing segmen bisnis utama (Retail, F&B, dan Media).
                  </TooltipContent>
                </ShadcnTooltip>
              </TooltipProvider>
            </div>
            <div className="space-y-1">
              {segmentStats.map(s => {
                if (s.value === 0) return null
                return (
                  <div key={s.name} className="flex justify-between items-center text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: s.color }}></span>
                      <span className="text-slate-600 font-bold">{s.name}</span>
                    </div>
                    <div className="flex items-center gap-2 font-bold">
                      <span className="text-slate-800">{formatRawBillion(s.value)}</span>
                      <span className="text-slate-400 text-[9px] w-8 text-right">{hideValues ? '•••%' : `${s.pct}%`}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Row 2: Grid of Top 3 Brands & Total YTD */}
        <div className="grid grid-cols-12 gap-3 items-stretch">
          {/* Top 3 Brands */}
          <div className="col-span-8 space-y-2">
            <div className="flex items-center gap-1.5">
              <h4 className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Top 3 Brands</h4>
              <TooltipProvider delayDuration={100}>
                <ShadcnTooltip>
                  <TooltipTrigger asChild>
                    <button className="text-slate-405 hover:text-slate-650 transition-colors focus:outline-none">
                      <HelpCircle size={11} className="shrink-0 text-slate-400" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-slate-900 border-slate-800 text-white text-xs p-2.5 max-w-[245px] rounded-xl font-bold shadow-xl leading-normal">
                    Tiga brand dengan kontribusi pendapatan nominal tertinggi terhadap total pendapatan grup MRA saat ini.
                  </TooltipContent>
                </ShadcnTooltip>
              </TooltipProvider>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {top3Brands.map(b => (
                <div key={b.brand} className="bg-slate-50/50 border border-slate-100 p-1.5 rounded-lg text-center shadow-[0_1px_4px_rgba(0,0,0,0.01)]">
                  <div className="flex justify-center mb-1">
                    <span className={`w-4 h-4 flex items-center justify-center text-white font-extrabold rounded-full text-[8px] ${
                      b.rank === 1 ? 'bg-blue-600' : b.rank === 2 ? 'bg-orange-500' : 'bg-emerald-600'
                    }`}>
                      {b.rank}
                    </span>
                  </div>
                  <p className="text-[9px] font-bold text-slate-800 truncate max-w-[60px] mx-auto leading-tight">{b.brand.split(' ')[0]}</p>
                  <p className="text-[8px] text-slate-400 font-bold leading-tight">{formatRawBillion(b.revenue)}</p>
                  <p className="text-[10px] font-black text-slate-700 leading-tight mt-0.5">{hideValues ? '•••%' : `${b.pct}%`}</p>
                </div>
              ))}
              {top3Brands.length === 0 && (
                <div className="col-span-3 text-center text-[9px] text-slate-400 py-2 font-bold">
                  Tidak ada data
                </div>
              )}
            </div>
          </div>

          {/* Total YTD Revenue */}
          <div className="col-span-4 flex">
            <div className="w-full bg-emerald-50/60 border border-emerald-100/70 rounded-xl p-2.5 flex flex-col justify-center items-center text-center">
              <div className="p-1 bg-emerald-100 text-emerald-600 rounded-lg mb-1 shrink-0">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
              <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Total YTD</p>
              <p className="text-xs font-black text-slate-800 tracking-tight leading-none mt-1">
                {hideValues ? '••••' : fmt(totalYtdRevenue, 'B')}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100 p-5 shadow-xl shadow-slate-100/40 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
      
      {/* Column 1: Revenue by Segment (Donut Chart + Info) */}
      <div className="lg:col-span-5 flex items-center gap-6">
        <div className="w-24 h-24 shrink-0 relative flex items-center justify-center bg-slate-50/50 rounded-xl border border-slate-100/50">
          <PieChart width={96} height={96}>
            <Pie
              data={donutData}
              cx="50%"
              cy="50%"
              innerRadius={30}
              outerRadius={45}
              dataKey="value"
              paddingAngle={2}
              startAngle={90}
              endAngle={-270}
            >
              {donutData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </div>
        
        <div className="flex-1 space-y-2.5">
          <div className="flex items-center gap-1.5">
            <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Revenue by Segment</h4>
            <TooltipProvider delayDuration={100}>
              <ShadcnTooltip>
                <TooltipTrigger asChild>
                  <button className="text-slate-405 hover:text-slate-650 transition-colors focus:outline-none">
                    <HelpCircle size={12} className="shrink-0 text-slate-400" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="bg-slate-900 border-slate-800 text-white text-xs p-2.5 max-w-[245px] rounded-xl font-bold shadow-xl leading-normal">
                  Pembagian total pendapatan grup berdasarkan kontribusi dari masing-masing segmen bisnis utama (Retail, F&B, dan Media).
                </TooltipContent>
              </ShadcnTooltip>
            </TooltipProvider>
          </div>
          <div className="space-y-1.5">
            {segmentStats.map(s => {
              if (s.value === 0) return null
              return (
                <div key={s.name} className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: s.color }}></span>
                    <span className="text-slate-600 font-bold">{s.name}</span>
                  </div>
                  <div className="flex items-center gap-3 font-bold">
                    <span className="text-slate-800">{formatRawBillion(s.value)}</span>
                    <span className="text-slate-400 text-[10px] w-10 text-right">{hideValues ? '•••%' : `${s.pct}%`}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="hidden lg:block lg:col-span-1 justify-self-center">
        <div className="w-[1px] h-16 bg-slate-200" />
      </div>

      {/* Column 2: Top 3 Brands Contribution */}
      <div className="lg:col-span-4 space-y-2.5">
        <div className="flex items-center gap-1.5">
          <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Top 3 Brands Contribution</h4>
          <TooltipProvider delayDuration={100}>
            <ShadcnTooltip>
              <ShadcnTooltip>
                <TooltipTrigger asChild>
                  <button className="text-slate-405 hover:text-slate-650 transition-colors focus:outline-none">
                    <HelpCircle size={12} className="shrink-0 text-slate-400" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="bg-slate-900 border-slate-800 text-white text-xs p-2.5 max-w-[245px] rounded-xl font-bold shadow-xl leading-normal">
                  Tiga brand dengan kontribusi pendapatan nominal tertinggi terhadap total pendapatan grup MRA saat ini.
                </TooltipContent>
              </ShadcnTooltip>
            </ShadcnTooltip>
          </TooltipProvider>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {top3Brands.map(b => (
            <div key={b.brand} className="bg-slate-50/50 border border-slate-100 p-2.5 rounded-xl text-center shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-md hover:border-slate-200 transition-all duration-300">
              <div className="flex justify-center mb-1.5">
                <span className={`w-5 h-5 flex items-center justify-center text-white font-extrabold rounded-full text-[9px] ${
                  b.rank === 1 ? 'bg-blue-600' : b.rank === 2 ? 'bg-orange-500' : 'bg-emerald-600'
                }`}>
                  {b.rank}
                </span>
              </div>
              <p className="text-[10px] font-bold text-slate-800 truncate max-w-[80px] mx-auto mb-1">{b.brand.split(' ')[0]}</p>
              <p className="text-[9px] text-slate-400 font-bold">{formatRawBillion(b.revenue)}</p>
              <p className="text-xs font-black text-slate-700 mt-0.5">{hideValues ? '•••%' : `${b.pct}%`}</p>
            </div>
          ))}
          {top3Brands.length === 0 && (
            <div className="col-span-3 text-center text-[10px] text-slate-400 py-4 font-bold">
              Tidak ada data brand
            </div>
          )}
        </div>
      </div>

      {/* Column 3: Total YTD Revenue Summary Card */}
      <div className="lg:col-span-2">
        <div className="bg-emerald-50/60 border border-emerald-100/70 rounded-2xl p-4.5 flex items-center gap-3.5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
          <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl">
            <ArrowUpRight className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Total YTD Revenue</p>
            <p className="text-lg font-black text-slate-800 tracking-tight leading-none mt-1">
              {fmt(totalYtdRevenue, 'B')}
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}
