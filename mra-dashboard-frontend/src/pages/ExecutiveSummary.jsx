import { useState } from 'react'
import Layout from '../components/layout/Layout'
import KpiCard from '../components/KpiCard'
import BenchmarkScorecard from '../components/BenchmarkScorecard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import CurrencyTicker from '../components/CurrencyTicker'
import { ChartSkeleton, ListSkeleton } from '../components/ui/SkeletonLoader'
import { Badge } from '@/components/ui/badge'
import {
  AreaChart, Area, BarChart, Bar,
  PieChart, Pie, Cell, Line, ComposedChart,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import {
  DollarSign, TrendingUp, TrendingDown, Wallet, Package,
  BarChart2, Target, Banknote, ArrowUpRight, ArrowDownRight,
  HelpCircle
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Tooltip as ShadcnTooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import GroupRevenueOverview from '../components/charts/GroupRevenueOverview'
import RevenueRankedList from '../components/charts/RevenueRankedList'
import { storeBreakdowns } from '../data/dummyData'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'

const SEG_COLORS = ['#3b82f6', '#f97316', '#10b981']

export default function ExecutiveSummary() {
  const {
    currency,
    fmt,
    filteredKpis,
    filteredMonthlyRevenue,
    filteredSegmentRevenue,
    filteredBrandPerformance,
    hideValues,
    isTransitioning
  } = useApp()

  const [visibleSeries, setVisibleSeries] = useState({
    actual: true,
    budget: true,
    lastYear: true,
    forecast: true,
  })

  const [activePieIndex, setActivePieIndex] = useState(null)
  const [selectedBrand, setSelectedBrand] = useState(null)
  const onPieEnter = (_, index) => {
    setActivePieIndex(index)
  }
  const onPieLeave = () => {
    setActivePieIndex(null)
  }

  const toggleSeries = (key) => {
    setVisibleSeries(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const k = filteredKpis
  const fmtB = v => fmt(v, 'B')

  // Dynamic Tooltip inside the component to access 'fmt'
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
      <div className="bg-white/95 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-3.5 shadow-xl text-xs">
        <p className="text-slate-800 font-bold mb-2">{label}</p>
        <div className="space-y-1.5">
          {payload.map((p, i) => (
            <div key={i} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }}></span>
                <span className="text-slate-500 font-medium">{p.name}:</span>
              </div>
              <span className="text-slate-900 font-bold">{fmt(p.value, 'B')}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <Layout title="Executive Summary">

      {/* Running Exchange Rate Ticker */}
      <CurrencyTicker />

      {/* Navigation Tabs */}
      <Tabs defaultValue="dashboard" className="mb-0">
        <TabsList className="mb-6 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/30 dark:border-slate-700/50 p-0.5 rounded-lg inline-flex">
          <TabsTrigger value="dashboard" className="text-xs px-4 py-1.5 rounded-md text-slate-600 dark:text-slate-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-700 data-[state=active]:to-blue-500 dark:data-[state=active]:from-blue-600 dark:data-[state=active]:to-blue-400 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:shadow-blue-500/10 transition-all font-extrabold">Dashboard</TabsTrigger>
          <TabsTrigger value="benchmark" className="text-xs px-4 py-1.5 rounded-md text-slate-600 dark:text-slate-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-700 data-[state=active]:to-blue-500 dark:data-[state=active]:from-blue-600 dark:data-[state=active]:to-blue-400 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:shadow-blue-500/10 transition-all font-extrabold flex items-center gap-1.5 group">
            Benchmark Scorecard
            <Badge variant="secondary" className="text-[9px] bg-slate-200/80 hover:bg-slate-200/80 dark:bg-slate-700 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-350 px-1.5 h-4 border-0 font-extrabold group-data-[state=active]:bg-white/20 group-data-[state=active]:text-white group-data-[state=active]:hover:bg-white/20 transition-all">Industry</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="benchmark">
          <BenchmarkScorecard />
        </TabsContent>

        <TabsContent value="dashboard" className="outline-none">
          <div className="space-y-6">

            {/* KPI Row 1 — Primary */}
            <div className="grid grid-cols-4 gap-4">
              <KpiCard 
                label="Group Revenue YTD" 
                value={fmtB(k.groupRevenue.value)} 
                sub={`vs Budget ${k.groupRevenue.vs_budget}%`} 
                yoy={k.groupRevenue.yoy} 
                color="blue" 
                icon={DollarSign} 
                tooltip="Pendapatan bersih YTD konsolidasi seluruh grup usaha MRA Holding dibandingkan dengan target budget tahunan."
              />
              <KpiCard 
                label="EBITDA" 
                value={fmtB(k.ebitda.value)} 
                sub={`${k.ebitda.pctRevenue}% of Revenue`} 
                yoy={k.ebitda.yoy} 
                pctRev={k.ebitda.pctRevenue} 
                color="green" 
                icon={TrendingUp} 
                tooltip="Laba operasional sebelum bunga, pajak, depresiasi, dan amortisasi konsolidasian (dalam persentase terhadap total revenue)."
              />
              <KpiCard 
                label="Net Profit" 
                value={fmtB(k.netProfit.value)} 
                sub={`${k.netProfit.pctRevenue}% margin`} 
                yoy={k.netProfit.yoy} 
                pctRev={k.netProfit.pctRevenue} 
                color="amber" 
                icon={Banknote} 
                tooltip="Laba bersih akhir grup setelah dikurangi seluruh biaya operasional, beban finansial, penyusutan aset, dan pajak korporasi."
              />
              <KpiCard 
                label="Cash Position" 
                value={fmtB(k.cashPosition.value)} 
                sub={`Free Cash: ${fmtB(k.freeCashPos.value)}`} 
                yoy={k.cashPosition.yoy} 
                color="teal" 
                icon={Wallet} 
                tooltip="Posisi likuiditas kas dan setara kas yang tersedia (termasuk nilai Free Cash Flow untuk kebutuhan taktis grup)."
              />
            </div>

            {/* KPI Row 2 — Secondary */}
            <div className="grid grid-cols-4 gap-4">
              <KpiCard 
                label="Gross Profit" 
                value={fmtB(k.grossProfit.value)} 
                sub={`${k.grossProfit.pctRevenue}% margin`} 
                yoy={k.grossProfit.yoy} 
                color="cyan" 
                icon={BarChart2} 
                tooltip="Laba kotor konsolidasian setelah dikurangi Harga Pokok Penjualan (COGS) sebelum dipotong biaya operasional SG&A."
              />
              <KpiCard 
                label="OPEX" 
                value={fmtB(k.opex.value)} 
                sub={`${k.opex.pctRevenue}% of Revenue`} 
                yoy={k.opex.yoy} 
                color="rose" 
                icon={TrendingDown} 
                tooltip="Total biaya operasional harian yang dikeluarkan (Gaji staf, sewa lokasi butik/outlet, utilitas, pemasaran)."
              />
              <KpiCard 
                label="Inventory Position" 
                value={fmtB(k.inventoryPos.value)} 
                yoy={k.inventoryPos.yoy} 
                color="blue" 
                icon={Package} 
                tooltip="Total nilai valuasi persediaan barang (stok butik mewah retail & bahan baku F&B) yang tersimpan di gudang/toko."
              />
              <KpiCard 
                label="Budget Achievement" 
                value={`${k.groupRevenue.vs_budget}%`} 
                sub="vs Annual Target" 
                yoy={parseFloat((k.groupRevenue.vs_budget - 100).toFixed(1))} 
                color="teal" 
                icon={Target} 
                tooltip="Persentase tingkat pencapaian pendapatan aktual sepanjang tahun berjalan terhadap target budget tahunan yang ditetapkan."
              />
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-3 gap-6">
              {isTransitioning ? (
                <>
                  <div className="col-span-2">
                    <ChartSkeleton height={360} />
                  </div>
                  <div>
                    <ChartSkeleton height={360} />
                  </div>
                </>
              ) : (
                <>
                  {/* Revenue Trend — Area Chart */}
                  <div className="col-span-2 bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100 p-5 shadow-xl shadow-slate-100/40">
                    <div className="flex items-start justify-between mb-5">
                      <div>
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <h3 className="font-bold text-slate-800 text-sm">Revenue Trend 2026</h3>
                          <TooltipProvider delayDuration={100}>
                            <ShadcnTooltip>
                              <TooltipTrigger className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none inline-flex items-center">
                                <HelpCircle size={13} className="shrink-0" />
                              </TooltipTrigger>
                              <TooltipContent className="bg-slate-900 border-slate-800 text-white text-xs p-2.5 max-w-[245px] rounded-xl font-bold shadow-xl leading-normal">
                                Grafik tren perkembangan pendapatan bulanan yang membandingkan performa Aktual terhadap target Budget, historis Tahun Lalu (Last Year), dan proyeksi Forecast.
                              </TooltipContent>
                            </ShadcnTooltip>
                          </TooltipProvider>
                        </div>
                        <p className="text-xs text-slate-400 font-medium">Actual vs Budget vs Last Year vs Forecast</p>
                      </div>
                      <div className="flex flex-wrap gap-1.5 justify-end">
                        {[
                          ['Actual', '#3b82f6', 'actual'],
                          ['Budget', '#64748b', 'budget', true],
                          ['Last Year', '#cbd5e1', 'lastYear'],
                          ['Forecast', '#f59e0b', 'forecast', true]
                        ].map(([l, c, key, dashed]) => {
                          const isVisible = visibleSeries[key]
                          return (
                            <button
                              key={l}
                              onClick={() => toggleSeries(key)}
                              className={`flex items-center gap-1.5 text-[10px] font-bold px-2 py-1.5 rounded-lg border transition-all duration-300 ${
                                isVisible
                                  ? 'text-slate-700 bg-white border-slate-200 shadow-[0_1px_4px_rgba(0,0,0,0.02)] hover:bg-slate-50'
                                  : 'text-slate-350 bg-slate-50/50 border-slate-100/60 opacity-60 line-through'
                              }`}
                            >
                              <span
                                className={`w-3 h-0.5 inline-block rounded ${dashed ? 'border-t-2 border-dashed' : ''}`}
                                style={{
                                  background: dashed ? 'transparent' : (isVisible ? c : '#cbd5e1'),
                                  borderColor: isVisible ? c : '#cbd5e1'
                                }}
                              />
                              {l}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height="220">
                      <ComposedChart data={filteredMonthlyRevenue} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
                        <defs>
                          <linearGradient id="gradA" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#2563eb" stopOpacity={0.08} />
                            <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 500 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 500 }} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e2e8f0', strokeWidth: 1 }} />
                        <Area 
                          type="monotone" 
                          dataKey="actual" 
                          stroke="#2563eb" 
                          strokeWidth={3.5} 
                          fill="url(#gradA)" 
                          name="Actual"
                          hide={!visibleSeries.actual}
                          isAnimationActive={true}
                          animationDuration={1800}
                          animationBegin={0}
                          animationEasing="cubic-bezier(0.25, 0.8, 0.25, 1)"
                          dot={false}
                          activeDot={{ 
                            r: 6, 
                            stroke: '#2563eb', 
                            strokeWidth: 2, 
                            fill: '#fff',
                            className: 'shadow-lg animate-pulse'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="lastYear" 
                          stroke="#cbd5e1" 
                          strokeWidth={1.2} 
                          strokeDasharray="3 3"
                          opacity={0.5}
                          dot={false} 
                          name="Last Year"
                          hide={!visibleSeries.lastYear}
                          isAnimationActive={true}
                          animationDuration={1600}
                          animationBegin={150}
                          animationEasing="cubic-bezier(0.25, 0.8, 0.25, 1)"
                          activeDot={{ r: 4 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="budget" 
                          stroke="#64748b" 
                          strokeWidth={1.2} 
                          strokeDasharray="5 5" 
                          opacity={0.6}
                          dot={false} 
                          name="Budget"
                          hide={!visibleSeries.budget}
                          isAnimationActive={true}
                          animationDuration={1600}
                          animationBegin={300}
                          animationEasing="cubic-bezier(0.25, 0.8, 0.25, 1)"
                          activeDot={{ r: 4 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="forecast" 
                          stroke="#f59e0b" 
                          strokeWidth={1.2} 
                          strokeDasharray="4 4" 
                          opacity={0.7}
                          dot={false} 
                          name="Forecast"
                          hide={!visibleSeries.forecast}
                          isAnimationActive={true}
                          animationDuration={1600}
                          animationBegin={450}
                          animationEasing="cubic-bezier(0.25, 0.8, 0.25, 1)"
                          activeDot={{ r: 4 }}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Revenue by Segment Donut */}
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100 p-5 shadow-xl shadow-slate-100/40 flex flex-col">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <h3 className="font-bold text-slate-800 text-sm">Revenue Breakdown</h3>
                      <TooltipProvider delayDuration={100}>
                        <ShadcnTooltip>
                          <TooltipTrigger className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none inline-flex items-center">
                            <HelpCircle size={13} className="shrink-0" />
                          </TooltipTrigger>
                          <TooltipContent className="bg-slate-900 border-slate-800 text-white text-xs p-2.5 max-w-[245px] rounded-xl font-bold shadow-xl leading-normal">
                            Proporsi kontribusi pendapatan bersih tahun berjalan (YTD) untuk setiap segmen bisnis utama (Retail, F&B, Media) secara konsolidasian.
                          </TooltipContent>
                        </ShadcnTooltip>
                      </TooltipProvider>
                    </div>
                    <p className="text-xs text-slate-400 font-medium mb-4">YTD 2026 — Consolidated</p>
                    <div className="flex justify-center mb-2">
                      <div className="relative w-[180px] h-[140px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={filteredSegmentRevenue}
                              cx="50%"
                              cy="50%"
                              innerRadius={46}
                              outerRadius={62}
                              dataKey="value"
                              paddingAngle={3}
                              startAngle={90}
                              endAngle={-270}
                              stroke="#ffffff"
                              strokeWidth={2}
                              onMouseEnter={onPieEnter}
                              onMouseLeave={onPieLeave}
                              isAnimationActive={true}
                            >
                              {filteredSegmentRevenue.map((s, i) => (
                                <Cell 
                                  key={i} 
                                  fill={s.color || SEG_COLORS[i % SEG_COLORS.length]} 
                                  className="transition-all duration-300 cursor-pointer hover:opacity-90 outline-none"
                                  style={{
                                    filter: activePieIndex === i ? 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.15))' : 'none',
                                    transform: activePieIndex === i ? 'scale(1.03)' : 'scale(1)',
                                    transformOrigin: '50% 50%'
                                  }}
                                />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>

                        {/* Center label overlay */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
                          {activePieIndex !== null ? (
                            <>
                              <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">
                                {filteredSegmentRevenue[activePieIndex].name}
                              </span>
                              <span className="text-base font-black text-slate-800 tracking-tight leading-none mt-0.5">
                                {filteredSegmentRevenue.reduce((sum, item) => sum + item.value, 0) > 0 
                                  ? `${(filteredSegmentRevenue[activePieIndex].value / filteredSegmentRevenue.reduce((sum, item) => sum + item.value, 0) * 100).toFixed(0)}%` 
                                  : '0%'
                                }
                              </span>
                              <span className="text-[9px] text-slate-400 font-bold mt-0.5">
                                {hideValues ? '••••' : fmt(filteredSegmentRevenue[activePieIndex].value, 'B')}
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">
                                Total Revenue
                              </span>
                              <span className="text-base font-black text-slate-800 tracking-tight leading-none mt-0.5">
                                {hideValues ? 'IDR ••••' : fmt(filteredSegmentRevenue.reduce((sum, item) => sum + item.value, 0), 'B')}
                              </span>
                              <span className="text-[8px] text-slate-400 font-bold mt-0.5">YTD Y26</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3 mt-1 overflow-y-auto scrollbar-thin max-h-[120px] pr-1">
                      {filteredSegmentRevenue.map((s, i) => {
                        const total = filteredSegmentRevenue.reduce((a, b) => a + b.value, 0)
                        const pct = total > 0 ? (s.value / total * 100).toFixed(0) : '0'
                        const color = s.color || SEG_COLORS[i % SEG_COLORS.length]
                        return (
                          <div key={s.name}>
                            <div className="flex justify-between items-center mb-1">
                              <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: color }}></span>
                                <span className="text-xs text-slate-600 font-semibold truncate max-w-[110px]">{s.name}</span>
                              </div>
                              <div className="text-right shrink-0">
                                <span className="text-xs font-bold text-slate-800">{fmt(s.value, 'B')}</span>
                                <span className="text-[10px] text-slate-400 font-bold ml-1">({pct}%)</span>
                              </div>
                            </div>
                            <div className="w-full bg-slate-150/70 rounded-full h-1.5">
                              <div className="h-1.5 rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }}></div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-3 gap-6">
              {isTransitioning ? (
                <>
                  <div className="col-span-2">
                    <ListSkeleton count={6} />
                  </div>
                  <div>
                    <ListSkeleton count={6} />
                  </div>
                </>
              ) : (
                <>
                  {/* Brand Revenue Ranking */}
                  <div className="col-span-2 h-[390px]">
                    <RevenueRankedList />
                  </div>

                  {/* Budget vs Actual Achievement Card */}
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100 p-5 shadow-xl shadow-slate-100/40 flex flex-col h-[390px]">
                    <div className="shrink-0">
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-slate-800 text-sm">Budget vs Actual Achievement</h3>
                          <TooltipProvider delayDuration={100}>
                            <ShadcnTooltip>
                              <TooltipTrigger className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none inline-flex items-center">
                                <HelpCircle size={13} className="shrink-0" />
                              </TooltipTrigger>
                              <TooltipContent className="bg-slate-900 border-slate-800 text-white text-xs p-2.5 max-w-[245px] rounded-xl font-bold shadow-xl leading-normal">
                                Persentase tingkat pencapaian target anggaran tahun berjalan untuk setiap brand individu, diurutkan dari pencapaian tertinggi.
                              </TooltipContent>
                            </ShadcnTooltip>
                          </TooltipProvider>
                        </div>
                        <span className="bg-emerald-50 text-emerald-600 border border-emerald-100/60 px-2 py-0.5 rounded-full text-[9px] font-black tracking-wide shrink-0">
                          Avg: {k.groupRevenue.vs_budget}%
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-medium mb-4">Percentage of YTD targets achieved per brand (Sorted)</p>
                    </div>
                    
                    <div className="flex-1 space-y-4 overflow-y-auto pr-1 scrollbar-thin mt-2">
                      {[...filteredBrandPerformance]
                        .sort((a, b) => b.budgetPct - a.budgetPct)
                        .map(b => {
                          const isSuccess = b.budgetPct >= 100
                          const barWidth = Math.min(100, (b.budgetPct / 115) * 100)
                          const targetLinePos = (100 / 115) * 100

                          return (
                            <div key={b.brand} className="group/item">
                              <div className="flex justify-between items-center text-xs mb-1.5">
                                <div className="flex items-center gap-1.5 truncate">
                                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                    b.segment === 'F&B' ? 'bg-orange-500' :
                                    b.segment === 'Retail' ? 'bg-blue-500' :
                                    'bg-emerald-500'
                                  }`} />
                                  <span className="text-slate-700 font-bold truncate group-hover/item:text-slate-900 transition-colors">
                                    {b.brand}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0 font-bold font-sans">
                                  <span className={`text-[9px] uppercase font-extrabold tracking-wider ${
                                    isSuccess ? 'text-emerald-650' : 'text-slate-400'
                                  }`}>
                                    {isSuccess ? 'Achieved' : 'Pending'}
                                  </span>
                                  <span className={`font-black tracking-tight ${
                                    b.budgetPct >= 100 ? 'text-emerald-500' :
                                    b.budgetPct >= 95 ? 'text-amber-500' :
                                    'text-rose-500'
                                  }`}>
                                    {b.budgetPct}%
                                  </span>
                                </div>
                              </div>

                              {/* Outer Bar Container */}
                              <div className="relative w-full bg-slate-100 rounded-full h-2 border border-slate-200/20 p-[1px] overflow-visible">
                                {/* 100% Target vertical marker line */}
                                <div 
                                  className="absolute top-[-3px] w-[2px] h-[12px] bg-slate-400 z-10 rounded-full shadow-sm" 
                                  style={{ left: `${targetLinePos}%` }} 
                                  title="100% Target"
                                />
                                {/* Inner progress bar */}
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    b.budgetPct >= 100 
                                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_6px_rgba(16,185,129,0.3)]' 
                                      : b.budgetPct >= 95 
                                        ? 'bg-gradient-to-r from-amber-400 to-amber-500' 
                                        : 'bg-gradient-to-r from-rose-500 to-rose-400'
                                  }`}
                                  style={{ width: `${barWidth}%` }}
                                />
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Brand Scorecard YoY — compact chips */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100 p-5 shadow-xl shadow-slate-100/40">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <h3 className="font-bold text-slate-800 text-sm">Brand Scorecard — YoY Growth & EBITDA%</h3>
                    <TooltipProvider delayDuration={100}>
                      <ShadcnTooltip>
                        <TooltipTrigger className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none inline-flex items-center">
                          <HelpCircle size={13} className="shrink-0" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-slate-900 border-slate-800 text-white text-xs p-2.5 max-w-[245px] rounded-xl font-bold shadow-xl leading-normal">
                          Ikhtisar kartu skor brand yang membandingkan pertumbuhan pendapatan tahunan (YoY Growth%) dan margin profitabilitas EBITDA% dengan periode yang sama tahun lalu.
                        </TooltipContent>
                      </ShadcnTooltip>
                    </TooltipProvider>
                  </div>
                  <p className="text-xs text-slate-400 font-medium">Performance compared to the same period last year</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {filteredBrandPerformance.map(b => {
                  const isPositive = b.yoyPct >= 0
                  return (
                    <div 
                      key={b.brand} 
                      onClick={() => setSelectedBrand(b.brand)}
                      className={`flex items-center justify-between border rounded-xl px-4 py-3 shadow-sm cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] ${
                        isPositive 
                          ? 'bg-emerald-500/[0.02] border-emerald-500/10 hover:bg-emerald-500/[0.06] hover:border-emerald-500/20 hover:shadow-md hover:shadow-emerald-500/[0.03]'
                          : 'bg-rose-500/[0.02] border-rose-500/10 hover:bg-rose-500/[0.06] hover:border-rose-500/20 hover:shadow-md hover:shadow-rose-500/[0.03]'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-800">{b.brand}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                          <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${
                            b.segment === 'F&B' ? 'bg-orange-400' :
                            b.segment === 'Retail' ? 'bg-blue-400' :
                            'bg-emerald-400'
                          }`} />
                          {b.segment} · EBITDA {b.ebitdaPct}%
                        </p>
                      </div>
                      <div className={`flex items-center gap-0.5 text-xs font-black shrink-0 ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {isPositive ? <ArrowUpRight size={14} className="text-emerald-550 text-emerald-500" /> : <ArrowDownRight size={14} className="text-rose-500" />}
                        {b.yoyPct > 0 ? '+' : ''}{b.yoyPct}%
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

          </div>
        </TabsContent>
      </Tabs>

      {/* Brand Details Dialog Modal */}
      <Dialog open={selectedBrand !== null} onOpenChange={(open) => !open && setSelectedBrand(null)}>
        <DialogContent className="max-w-xl bg-white/95 backdrop-blur-md border border-slate-200/60 shadow-2xl p-6 rounded-2xl outline-none">
          {selectedBrand && (() => {
            const brandData = filteredBrandPerformance.find(b => b.brand === selectedBrand)
            if (!brandData) return null

            const isPositive = brandData.yoyPct >= 0
            const branches = storeBreakdowns[selectedBrand] || []

            return (
              <>
                <DialogHeader className="mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <DialogTitle className="text-xl font-black text-slate-900 tracking-tight">{brandData.brand}</DialogTitle>
                      <DialogDescription className="text-xs text-slate-400 font-semibold mt-1">
                        YTD Performance Scorecard & Branch Breakdown
                      </DialogDescription>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                      brandData.segment === 'F&B' ? 'bg-orange-50 text-orange-600 border-orange-100/60' :
                      brandData.segment === 'Retail' ? 'bg-blue-50 text-blue-600 border-blue-100/60' :
                      'bg-emerald-50 text-emerald-600 border-emerald-100/60'
                    }`}>
                      {brandData.segment}
                    </span>
                  </div>
                </DialogHeader>

                {/* Quick Metrics Grid */}
                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div className="bg-slate-50/50 border border-slate-200/30 p-3 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest leading-none">Revenue YTD</span>
                    <div className="text-lg font-black text-slate-800 mt-1 tabular-nums">
                      {hideValues ? 'IDR ••••' : fmt(brandData.revenue, 'B')}
                    </div>
                    <div className="text-[9px] text-slate-400 font-bold mt-0.5">
                      Target achieved: <span className={brandData.budgetPct >= 100 ? 'text-emerald-600' : 'text-amber-600'}>{brandData.budgetPct}%</span>
                    </div>
                  </div>

                  <div className="bg-slate-50/50 border border-slate-200/30 p-3 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest leading-none">EBITDA Margin</span>
                    <div className="text-lg font-black text-slate-800 mt-1 tabular-nums">
                      {brandData.ebitdaPct}%
                    </div>
                    <div className="text-[9px] text-slate-400 font-bold mt-0.5">
                      Value: <span className="text-slate-600">{hideValues ? '••••' : fmt(brandData.ebitda, 'B')}</span>
                    </div>
                  </div>

                  <div className="bg-slate-50/50 border border-slate-200/30 p-3 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest leading-none">YoY Growth</span>
                    <div className={`text-lg font-black mt-1 flex items-center gap-1 tabular-nums ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {isPositive ? <ArrowUpRight size={18} strokeWidth={3.5} /> : <ArrowDownRight size={18} strokeWidth={3.5} />}
                      {brandData.yoyPct > 0 ? '+' : ''}{brandData.yoyPct}%
                    </div>
                    <div className="text-[9px] text-slate-400 font-bold mt-0.5">VS Same Period LY</div>
                  </div>

                  <div className="bg-slate-50/50 border border-slate-200/30 p-3 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest leading-none">Target Status</span>
                    <div className={`text-[11px] font-black mt-2.5 inline-flex px-2 py-0.5 rounded-full border ${
                      brandData.budgetPct >= 100 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100/60' 
                        : brandData.budgetPct >= 95 
                          ? 'bg-amber-50 text-amber-600 border-amber-100/60' 
                          : 'bg-rose-50 text-rose-600 border-rose-100/60'
                    }`}>
                      {brandData.budgetPct >= 100 ? 'On Budget (Achieved)' : brandData.budgetPct >= 95 ? 'Within Target Range' : 'Under Performing'}
                    </div>
                  </div>
                </div>

                {/* Branch/Store list */}
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">Branch/Outlet Breakdown</h4>
                  {branches.length > 0 ? (
                    <div className="border border-slate-200/40 rounded-xl overflow-hidden max-h-[180px] overflow-y-auto pr-1 scrollbar-thin">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="bg-slate-50/60 border-b border-slate-200/50 text-slate-500">
                            <th className="text-left px-3 py-2 font-bold text-[9px] uppercase tracking-wider">Location / Outlet</th>
                            <th className="text-right px-3 py-2 font-bold text-[9px] uppercase tracking-wider">Revenue</th>
                            <th className="text-right px-3 py-2 font-bold text-[9px] uppercase tracking-wider">Area</th>
                            <th className="text-right px-3 py-2 font-bold text-[9px] uppercase tracking-wider">Rev/m²</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100/60">
                          {branches.map((br, index) => (
                            <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-3 py-2 font-semibold text-slate-700">{br.brand.split(' - ')[1] || br.brand}</td>
                              <td className="px-3 py-2 text-right font-bold text-slate-750">{hideValues ? '••••' : fmt(br.revenue, 'B')}</td>
                              <td className="px-3 py-2 text-right font-medium text-slate-500">{br.sqm} m²</td>
                              <td className="px-3 py-2 text-right font-extrabold text-slate-900">
                                {hideValues 
                                  ? '••••' 
                                  : (currency === 'USD' ? `$${Math.round(br.perSqm * 1_000_000 / 15800).toLocaleString()}/m²` : `IDR ${br.perSqm}jt/m²`)
                                }
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="bg-slate-50/30 border border-slate-150/60 rounded-xl p-4 text-center text-slate-400 font-semibold text-xs leading-relaxed">
                      ℹ️ Rincian outlet spesifik tidak dideklarasikan di ringkasan ini. Untuk informasi operasional lebih mendalam silakan tinjau <span className="font-extrabold text-slate-600">Operational Dashboard</span>.
                    </div>
                  )}
                </div>
              </>
            )
          })()}
        </DialogContent>
      </Dialog>
    </Layout>
  )
}
