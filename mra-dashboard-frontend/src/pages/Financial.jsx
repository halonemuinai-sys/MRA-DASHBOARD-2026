import { useState, useMemo } from 'react'
import Layout from '../components/layout/Layout'
import KpiCard from '../components/KpiCard'
import WaterfallChart from '../components/charts/WaterfallChart'
import BrandScatter from '../components/charts/BrandScatter'
import EbitdaRankedList from '../components/charts/EbitdaRankedList'
import GroupRevenueOverview from '../components/charts/GroupRevenueOverview'
import RatioPanel from '../components/charts/RatioPanel'
import {
  BarChart, Bar, LineChart, Line, ComposedChart,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'
import { 
  DollarSign, TrendingUp, Layers, BarChart2, 
  FileText, Clock, AlertCircle, Calendar, ArrowUpRight, ArrowDownRight, Activity,
  HelpCircle, Sliders, RefreshCw, X, Settings2
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Tooltip as ShadcnTooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'

export default function Financial() {
  const [activeSubTab, setActiveSubTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  
  // Drill-down ledger modal state ('capex' | 'opex' | null)
  const [selectedLedger, setSelectedLedger] = useState(null)

  // Growth Simulator states
  const [simRevenueGrowth, setSimRevenueGrowth] = useState(0) // range -15 to 15
  const [simOpexEfficiency, setSimOpexEfficiency] = useState(0) // range -10 to 10
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false)

  const {
    filteredKpis,
    filteredApArAging,
    filteredCashFlow,
    filteredCapexData,
    filteredOutstandingContracts,
    filteredRatios,
    filteredOpexData,
    fmt,
    currency,
    scaleRatio,
    hideValues
  } = useApp()

  // Calculate simulated KPIs based on baseline filteredKpis and simulator sliders
  const simulatedK = useMemo(() => {
    const baseline = filteredKpis
    const revMultiplier = 1 + (simRevenueGrowth / 100)
    const opexMultiplier = 1 - (simOpexEfficiency / 100)
    
    // Scale baseline values
    const groupRevenueVal = baseline.groupRevenue.value * revMultiplier
    const grossProfitVal = baseline.grossProfit.value * revMultiplier
    const opexVal = baseline.opex.value * opexMultiplier
    
    // EBITDA = Gross Profit - OPEX (since GP is positive and OPEX is positive here)
    const ebitdaVal = grossProfitVal - opexVal
    
    // D&A, Interest
    const da = 42 * scaleRatio
    const ebitVal = ebitdaVal - da
    const interest = 28 * scaleRatio
    const ebtVal = ebitVal - interest
    const taxVal = ebtVal < 0 ? 0 : ebtVal * 0.22
    const netProfitVal = ebtVal - taxVal

    return {
      ...baseline,
      groupRevenue: {
        ...baseline.groupRevenue,
        value: groupRevenueVal,
        vs_budget: parseFloat((baseline.groupRevenue.vs_budget * revMultiplier).toFixed(1))
      },
      grossProfit: {
        ...baseline.grossProfit,
        value: grossProfitVal,
        pctRevenue: parseFloat(((grossProfitVal / (groupRevenueVal || 1)) * 100).toFixed(1))
      },
      opex: {
        ...baseline.opex,
        value: opexVal,
        pctRevenue: parseFloat(((opexVal / (groupRevenueVal || 1)) * 100).toFixed(1))
      },
      ebitda: {
        ...baseline.ebitda,
        value: ebitdaVal,
        pctRevenue: parseFloat(((ebitdaVal / (groupRevenueVal || 1)) * 100).toFixed(1))
      },
      netProfit: {
        ...baseline.netProfit,
        value: netProfitVal,
        pctRevenue: parseFloat(((netProfitVal / (groupRevenueVal || 1)) * 100).toFixed(1))
      }
    }
  }, [filteredKpis, simRevenueGrowth, simOpexEfficiency, scaleRatio])

  const k = simulatedK
  const fmtB = v => fmt(v, 'B')

  // Dynamic Tooltip inside component to access 'fmt'
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

  // Generate dynamic mathematically sound P&L table rows
  const rev = k.groupRevenue.value
  const gp = k.grossProfit.value
  const cogs = gp - rev
  const opex = -k.opex.value
  const ebitda = k.ebitda.value
  const da = -42 * scaleRatio
  const ebit = ebitda + da
  const interest = -28 * scaleRatio
  const ebt = ebit + interest
  const tax = ebt < 0 ? 0 : ebt * -0.22
  const netProfit = ebt + tax

  const plRows = [
    { label: 'Net Revenue',  value: rev,  pct: 100.0, bold: true },
    { label: 'COGS',         value: cogs, pct: rev > 0 ? (cogs / rev * 100) : 0 },
    { label: 'Gross Profit', value: gp,   pct: rev > 0 ? (gp / rev * 100) : 0, bold: true },
    { label: 'OPEX',         value: opex, pct: rev > 0 ? (opex / rev * 100) : 0 },
    { label: 'EBITDA',       value: ebitda, pct: rev > 0 ? (ebitda / rev * 100) : 0, bold: true },
    { label: 'D&A',          value: da,   pct: rev > 0 ? (da / rev * 100) : 0 },
    { label: 'EBIT',         value: ebit, pct: rev > 0 ? (ebit / rev * 100) : 0 },
    { label: 'Interest',     value: interest, pct: rev > 0 ? (interest / rev * 100) : 0 },
    { label: 'EBT',          value: ebt,  pct: rev > 0 ? (ebt / rev * 100) : 0 },
    { label: 'Tax (22%)',    value: tax,  pct: rev > 0 ? (tax / rev * 100) : 0 },
    { label: 'Net Profit',   value: netProfit, pct: rev > 0 ? (netProfit / rev * 100) : 0, bold: true },
  ]

  const unitStr = currency === 'USD' ? 'USD Million' : 'IDR Billion'

  const totalContractValue = filteredOutstandingContracts.reduce((acc, c) => acc + c.totalValue, 0)
  const totalBilledValue = filteredOutstandingContracts.reduce((acc, c) => acc + c.billedValue, 0)
  const totalUnbilledValue = filteredOutstandingContracts.reduce((acc, c) => acc + c.unbilledValue, 0)
  const totalUnpaidInvoices = filteredOutstandingContracts.reduce((acc, c) => acc + c.unpaidInvoices, 0)

  // CAPEX & OPEX calculations
  const totalCapexActual = filteredCapexData.reduce((sum, r) => sum + r.actual, 0)
  const totalCapexBudget = filteredCapexData.reduce((sum, r) => sum + r.budget, 0)
  const capexUtilization = totalCapexBudget > 0 ? Math.round((totalCapexActual / totalCapexBudget) * 100) : 0
  const totalOpexActual = filteredOpexData.reduce((sum, r) => sum + r.actual, 0) * (1 - simOpexEfficiency / 100)
  const totalOpexBudget = filteredOpexData.reduce((sum, r) => sum + r.budget, 0)
  const opexEfficiency = rev > 0 ? parseFloat(((totalOpexActual / rev) * 100).toFixed(1)) : 0

  const opexDonutData = filteredOpexData.map(o => ({
    name: o.category,
    value: o.actual * (1 - simOpexEfficiency / 100),
    color: o.color
  }))

  const capexBarData = filteredCapexData.map(c => ({
    name: c.category.split(' ')[0],
    full: c.category,
    Actual: c.actual,
    Budget: c.budget,
  }))

  const budgetLedger = [
    ...filteredCapexData.map(c => ({ name: c.category, type: 'CAPEX', actual: c.actual, budget: c.budget, pct: c.pct || Math.round(c.actual/c.budget*100) })),
    ...filteredOpexData.map(o => ({ name: o.category, type: 'OPEX', actual: o.actual, budget: o.budget, pct: o.pct || Math.round(o.actual/o.budget*100) }))
  ]

  const getDueStatus = (dueDateStr) => {
    const today = new Date('2026-06-06')
    const dueDate = new Date(dueDateStr)
    const diffTime = dueDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return { status: 'Overdue', label: `Overdue ${Math.abs(diffDays)}d`, style: 'bg-rose-50 text-rose-600 border border-rose-100/60 font-semibold' }
    } else if (diffDays <= 30) {
      return { status: 'Due Soon', label: `Due in ${diffDays}d`, style: 'bg-amber-50 text-amber-600 border border-amber-100/60 font-semibold' }
    } else {
      return { status: 'On Track', label: 'On Track', style: 'bg-emerald-50 text-emerald-600 border border-emerald-100/60 font-semibold' }
    }
  }

  // Pre-process contracts
  const processedContracts = useMemo(() => {
    return filteredOutstandingContracts.map(c => {
      const dueInfo = getDueStatus(c.dueDate)
      const billedPct = c.totalValue > 0 ? (c.billedValue / c.totalValue) * 100 : 0
      return {
        ...c,
        billedPct,
        dueStatus: dueInfo.status,
        dueLabel: dueInfo.label,
        dueStyle: dueInfo.style
      }
    })
  }, [filteredOutstandingContracts])

  // Filter based on search & status
  const displayedContracts = useMemo(() => {
    return processedContracts.filter(c => {
      const matchesSearch = c.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            c.project.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'All' || c.dueStatus === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [processedContracts, searchTerm, statusFilter])

  // Working Capital Gauge component helper
  const RatioGauge = ({ label, value, max, target, colorClass, warningThreshold, unit = 'hari' }) => {
    const isNegative = value < 0
    const percent = isNegative ? 100 : Math.min(100, (value / max) * 100)
    const targetPercent = (target / max) * 100
    const isWarning = warningThreshold ? (isNegative ? false : value > warningThreshold) : false

    return (
      <div className="space-y-2 bg-slate-50 border border-slate-100 rounded-xl p-3.5 hover:shadow-md transition-all duration-300">
        <div className="flex justify-between items-center text-xs">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{label}</span>
            <span className="text-[10px] text-slate-400 font-bold block mt-0.5">Target: {target} {unit}</span>
          </div>
          <div className="text-right">
            <span className={`text-sm font-black tabular-nums ${isWarning ? 'text-rose-500' : isNegative ? 'text-emerald-500' : colorClass}`}>
              {value} <span className="text-xs font-bold">{unit}</span>
            </span>
          </div>
        </div>
        
        <div className="relative w-full h-1.5 bg-slate-200 rounded-full">
          {/* Target marker line */}
          {!isNegative && target > 0 && (
            <div 
              className="absolute top-[-3px] w-[2px] h-[12px] bg-slate-400 z-10 rounded-full shadow-sm"
              style={{ left: `${targetPercent}%` }}
              title={`Target: ${target} ${unit}`}
            />
          )}
          {/* Active progress color */}
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              isWarning ? 'bg-rose-500' : isNegative ? 'bg-emerald-500' : 'bg-blue-500'
            }`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    )
  }

  return (
    <Layout title="Financial Dashboard">

      {/* Sub-Tab Navigation */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-4 mb-6">
        <div className="flex gap-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/40 p-1.5 rounded-xl backdrop-blur-sm shadow-inner shadow-slate-200/5">
          <button
            onClick={() => setActiveSubTab('overview')}
            className={`px-4 py-2 text-xs font-extrabold rounded-lg transition-all duration-300 ${
              activeSubTab === 'overview'
                ? 'bg-gradient-to-r from-blue-700 to-blue-500 dark:from-blue-600 dark:to-blue-400 text-white shadow-md shadow-blue-500/10'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Overview (P&L & CF)
          </button>
          <button
            onClick={() => setActiveSubTab('contracts')}
            className={`px-4 py-2 text-xs font-extrabold rounded-lg transition-all duration-300 ${
              activeSubTab === 'contracts'
                ? 'bg-gradient-to-r from-blue-700 to-blue-500 dark:from-blue-600 dark:to-blue-400 text-white shadow-md shadow-blue-500/10'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            AR/AP & Outstanding Contracts
          </button>
          <button
            onClick={() => setActiveSubTab('capex_opex')}
            className={`px-4 py-2 text-xs font-extrabold rounded-lg transition-all duration-300 ${
              activeSubTab === 'capex_opex'
                ? 'bg-gradient-to-r from-blue-700 to-blue-500 dark:from-blue-600 dark:to-blue-400 text-white shadow-md shadow-blue-500/10'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            CAPEX & OPEX Analysis
          </button>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Active View</p>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-0.5">
              {useApp().segment === 'All' ? 'Consolidated Group' : `Segment: ${useApp().segment}`}
            </p>
          </div>
          
          <button
            onClick={() => setIsSimulatorOpen(prev => !prev)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-black border transition-all duration-300 cursor-pointer ${
              simRevenueGrowth !== 0 || simOpexEfficiency !== 0
                ? 'bg-amber-500/10 text-amber-600 border-amber-300 dark:border-amber-700/50 dark:text-amber-400 shadow-sm shadow-amber-500/10'
                : isSimulatorOpen
                  ? 'bg-slate-100 dark:bg-slate-800 border-slate-350 dark:border-slate-700 text-slate-700 dark:text-slate-200'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <Sliders size={13} className={simRevenueGrowth !== 0 || simOpexEfficiency !== 0 ? "animate-pulse" : ""} />
            <span>Scenario Simulator</span>
            {(simRevenueGrowth !== 0 || simOpexEfficiency !== 0) && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
            )}
          </button>
        </div>
      </div>

      {/* Collapsible Growth Scenario Simulator Panel */}
      {isSimulatorOpen && (
        <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white rounded-2xl p-5 mb-6 shadow-2xl border border-blue-500/35 relative overflow-hidden transition-all duration-500">
          {/* Subtle background glow */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <h3 className="font-extrabold text-sm tracking-wide text-blue-200 flex items-center gap-1.5">
                <Settings2 size={15} className="text-blue-400" />
                <span>FINANCIAL GROWTH SCENARIO SIMULATOR</span>
              </h3>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                Interactive simulation of the impact of sales growth & expense efficiency on EBITDA and YTD net profit.
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              {(simRevenueGrowth !== 0 || simOpexEfficiency !== 0) && (
                <button
                  onClick={() => {
                    setSimRevenueGrowth(0)
                    setSimOpexEfficiency(0)
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
                >
                  <RefreshCw size={9} />
                  <span>Reset</span>
                </button>
              )}
              <button
                onClick={() => setIsSimulatorOpen(false)}
                className="p-1 hover:bg-white/10 rounded-md transition-colors text-slate-400 hover:text-white cursor-pointer"
              >
                <X size={13} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            {/* Slider 1: Revenue Growth */}
            <div className="bg-white/5 border border-white/5 p-4 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10.5px] font-extrabold text-blue-300 uppercase tracking-widest">Revenue Growth</span>
                <span className={`text-xs font-black tabular-nums ${simRevenueGrowth > 0 ? 'text-emerald-400' : simRevenueGrowth < 0 ? 'text-rose-400' : 'text-slate-300'}`}>
                  {simRevenueGrowth > 0 ? '+' : ''}{simRevenueGrowth}%
                </span>
              </div>
              <input
                type="range"
                min="-15"
                max="15"
                step="1"
                value={simRevenueGrowth}
                onChange={(e) => setSimRevenueGrowth(parseInt(e.target.value))}
                className="w-full accent-blue-500 h-1.5 bg-white/10 rounded-lg cursor-pointer transition-all focus:outline-none"
              />
              <div className="flex justify-between text-[8.5px] text-slate-500 font-extrabold mt-1">
                <span>-15% (Worst Case)</span>
                <span>0% (Base)</span>
                <span>+15% (Best Case)</span>
              </div>
            </div>

            {/* Slider 2: OPEX Efficiency */}
            <div className="bg-white/5 border border-white/5 p-4 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10.5px] font-extrabold text-blue-300 uppercase tracking-widest">OPEX Efficiency</span>
                <span className={`text-xs font-black tabular-nums ${simOpexEfficiency > 0 ? 'text-emerald-400' : simOpexEfficiency < 0 ? 'text-rose-400' : 'text-slate-300'}`}>
                  {simOpexEfficiency > 0 ? '+' : ''}{simOpexEfficiency}%
                </span>
              </div>
              <input
                type="range"
                min="-10"
                max="10"
                step="1"
                value={simOpexEfficiency}
                onChange={(e) => setSimOpexEfficiency(parseInt(e.target.value))}
                className="w-full accent-blue-500 h-1.5 bg-white/10 rounded-lg cursor-pointer transition-all focus:outline-none"
              />
              <div className="flex justify-between text-[8.5px] text-slate-500 font-extrabold mt-1">
                <span>-10% (Inefficient)</span>
                <span>0% (Base)</span>
                <span>+10% (Efficient)</span>
              </div>
            </div>

            {/* Simulated Impact Output */}
            <div className="bg-white/[0.07] border border-blue-500/25 p-4 rounded-xl flex flex-col justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block leading-none">Simulated Impact Summary</span>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <span className="text-[9px] text-slate-400 font-bold block uppercase font-sans">Est. EBITDA Margin</span>
                  <span className="text-sm font-black text-white tabular-nums">{k.ebitda.pctRevenue}%</span>
                  <span className="text-[9px] text-slate-500 font-semibold block leading-none mt-0.5">
                    Base: {filteredKpis.ebitda.pctRevenue}%
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 font-bold block uppercase font-sans">Net Profit Impact</span>
                  <span className="text-sm font-black text-white tabular-nums">
                    {hideValues ? '••••' : fmtB(k.netProfit.value)}
                  </span>
                  <span className="text-[9px] text-slate-500 font-semibold block leading-none mt-0.5">
                    Base: {hideValues ? '••••' : fmtB(filteredKpis.netProfit.value)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'overview' && (
        <>
          {/* Overview Diagnostic Message */}
          <div className="bg-gradient-to-r from-blue-500/5 to-blue-600/5 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 mb-6 shadow-sm flex items-start gap-3.5">
            <div className="p-2 bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 rounded-xl">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">Profitability & Cash Flow Diagnostic</h4>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-0.5">
                {useApp().segment === 'All' && "Konsolidasi EBITDA grup berjalan sehat pada margin 26.1% dengan pencapaian Net Revenue YTD mencapai 100.8% terhadap budget. Aliran kas operasional kuat dipimpin oleh penagihan kas POS cepat di segmen F&B, mengimbangi pengeluaran investasi store renovation Retail."}
                {useApp().segment === 'F&B' && "Margin EBITDA F&B stabil di kisaran 17.5%. Penjualan langsung lewat POS menghasilkan arus kas operasional harian yang sangat likuid untuk mendanai inventori bahan baku secara langsung."}
                {useApp().segment === 'Retail' && "Retail memimpin revenue share dengan margin kontribusi tinggi (EBITDA 24.0%). Aliran kas keluar terfokus pada CAPEX renovasi butik luxury di Plaza Senayan dan Grand Indonesia."}
                {useApp().segment === 'Media' && "Sektor Media membukukan pertumbuhan YTD sebesar 12.5% YoY. Namun, margin bersih tertekan oleh durasi proyek panjang, menuntut pengawasan ketat terhadap milestone penagihan termin iklan."}
              </p>
            </div>
          </div>

          {/* KPI Row */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <KpiCard 
              label="Net Revenue YTD"  
              value={fmtB(k.groupRevenue.value)} 
              sub={`vs Budget ${k.groupRevenue.vs_budget}%`} 
              yoy={k.groupRevenue.yoy} 
              color="blue"   
              icon={DollarSign} 
              tooltip="Pendapatan kotor akumulatif grup setelah diskon penjualan dan retur dari awal tahun berjalan (YTD) dibandingkan target Budget tahunan."
            />
            <KpiCard 
              label="Gross Profit"     
              value={fmtB(k.grossProfit.value)}  
              sub={`${k.grossProfit.pctRevenue}% margin`} 
              yoy={k.grossProfit.yoy} 
              color="green"  
              icon={TrendingUp}  
              tooltip="Selisih antara Net Revenue dan Cost of Goods Sold (COGS). Menunjukkan margin laba kotor awal sebelum dipotong biaya operasional."
            />
            <KpiCard 
              label="EBITDA"           
              value={fmtB(k.ebitda.value)}       
              sub={`${k.ebitda.pctRevenue}% of Revenue`} 
              yoy={k.ebitda.yoy} 
              pctRev={k.ebitda.pctRevenue} 
              color="teal" 
              icon={Layers} 
              tooltip="Earnings Before Interest, Taxes, Depreciation, and Amortization - Laba operasional inti sebelum beban finansial, penyusutan aset tetap, dan pajak."
            />
            <KpiCard 
              label="Net Profit"       
              value={fmtB(k.netProfit.value)}    
              sub={`${k.netProfit.pctRevenue}% margin`} 
              yoy={k.netProfit.yoy} 
              pctRev={k.netProfit.pctRevenue} 
              color="amber"  
              icon={BarChart2}   
              tooltip="Laba bersih akhir tahun berjalan (EAT/Earnings After Tax) setelah memperhitungkan seluruh beban operasional, bunga pinjaman, penyusutan, dan pajak korporasi."
            />
          </div>

          {/* Row 1: Waterfall + Cash Flow */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <WaterfallChart />

            {/* Cash Flow Monitoring */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100 p-5 shadow-xl shadow-slate-100/40">
              <div className="flex items-center gap-1.5 mb-0.5">
                <h3 className="font-bold text-slate-800 text-sm">Cash Flow Monitoring</h3>
                <TooltipProvider delayDuration={100}>
                  <ShadcnTooltip>
                    <TooltipTrigger asChild>
                      <button className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none">
                        <HelpCircle size={13} className="shrink-0" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-slate-900 border-slate-800 text-white text-xs p-2.5 max-w-[245px] rounded-xl font-bold shadow-xl leading-normal">
                      Memantau pergerakan arus kas masuk dan keluar dari tiga pilar aktivitas utama: Operasional (kegiatan inti), Investasi (pengeluaran CAPEX/aset), dan Pendanaan (fasilitas kredit/modal).
                    </TooltipContent>
                  </ShadcnTooltip>
                </TooltipProvider>
              </div>
              <p className="text-xs text-slate-400 font-medium mb-4">Operating / Investing / Financing — {unitStr}</p>
              <ResponsiveContainer width="100%" height={200}>
                <ComposedChart data={filteredCashFlow} margin={{ top: 4, right: 8, left: -22, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 500 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 500 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 10, color: '#64748b', fontWeight: 650, paddingTop: 10 }} />
                  <Bar dataKey="operating" name="Operating" fill="#3b82f6" radius={[3,3,0,0]} />
                  <Bar dataKey="investing" name="Investing" fill="#fca5a5" radius={[3,3,0,0]} />
                  <Bar dataKey="financing" name="Financing" fill="#c4b5fd" radius={[3,3,0,0]} />
                  <Line type="monotone" dataKey="operating" stroke="#2563eb" strokeWidth={2} dot={false} legendType="none" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Row 2: Ranked List + AP/AR */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="space-y-6">
              <EbitdaRankedList />
              <GroupRevenueOverview isCompact={true} />
            </div>

            <div className="space-y-6">
              {/* AP & AR Aging */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100 p-5 shadow-xl shadow-slate-100/40">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <h3 className="font-bold text-slate-800 text-sm">AP & AR Aging</h3>
                  <TooltipProvider delayDuration={100}>
                    <ShadcnTooltip>
                      <TooltipTrigger asChild>
                        <button className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none">
                          <HelpCircle size={13} className="shrink-0" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-slate-900 border-slate-800 text-white text-xs p-2.5 max-w-[245px] rounded-xl font-bold shadow-xl leading-normal">
                        Analisis umur piutang (AR) dari klien dan utang dagang (AP) ke supplier berdasarkan rentang hari jatuh tempo (1-30, 31-60, 61-90, dan lebih dari 90 hari).
                      </TooltipContent>
                    </ShadcnTooltip>
                  </TooltipProvider>
                </div>
                <p className="text-xs text-slate-400 font-medium mb-3">Outstanding balance per bucket — {unitStr}</p>
                <ResponsiveContainer width="100%" height={140}>
                  <BarChart data={filteredApArAging} margin={{ top: 4, right: 8, left: -22, bottom: 0 }} barSize={18}>
                    <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="bucket" tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 500 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 10, color: '#64748b', fontWeight: 650 }} />
                    <Bar dataKey="ap" name="Account Payable"    fill="#f97316" radius={[3,3,0,0]} />
                    <Bar dataKey="ar" name="Account Receivable" fill="#3b82f6" radius={[3,3,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* CAPEX */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100 p-5 shadow-xl shadow-slate-100/40">
                <div className="flex items-center gap-1.5 mb-3">
                  <h3 className="font-bold text-slate-800 text-sm">CAPEX Tracking</h3>
                  <TooltipProvider delayDuration={100}>
                    <ShadcnTooltip>
                      <TooltipTrigger asChild>
                        <button className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none">
                          <HelpCircle size={13} className="shrink-0" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-slate-900 border-slate-800 text-white text-xs p-2.5 max-w-[245px] rounded-xl font-bold shadow-xl leading-normal">
                        Pemantauan realisasi belanja modal (CAPEX) terhadap alokasi budget tahunan untuk masing-masing kategori pengeluaran investasi strategis.
                      </TooltipContent>
                    </ShadcnTooltip>
                  </TooltipProvider>
                </div>
                <div className="space-y-3">
                  {filteredCapexData.map(row => (
                    <div key={row.category}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-700 font-semibold">{row.category}</span>
                        <span className="text-slate-400 font-medium">{fmt(row.actual, 'B')} / {fmt(row.budget, 'B')}
                          <b className={`ml-2 ${row.pct >= 85 ? 'text-emerald-600' : row.pct >= 70 ? 'text-amber-600' : 'text-rose-500'}`}> {row.pct}%</b>
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full transition-all duration-500"
                          style={{
                            width: `${row.pct}%`,
                            background: row.pct >= 85 ? '#10b981' : row.pct >= 70 ? '#f59e0b' : '#ef4444'
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: Brand Portfolio Matrix */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <BrandScatter />

            {/* P&L Summary Table */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-xl shadow-slate-100/40 overflow-hidden">
              <div className="px-5 py-4.5 border-b border-slate-100">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <h3 className="font-bold text-slate-800 text-sm">P&L Summary Table</h3>
                  <TooltipProvider delayDuration={100}>
                    <ShadcnTooltip>
                      <TooltipTrigger asChild>
                        <button className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none">
                          <HelpCircle size={13} className="shrink-0" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-slate-900 border-slate-800 text-white text-xs p-2.5 max-w-[245px] rounded-xl font-bold shadow-xl leading-normal">
                        Ikhtisar laporan laba rugi konsolidasian terperinci yang menyajikan struktur pendapatan, harga pokok penjualan, biaya operasional, hingga laba bersih beserta margin persentasenya.
                      </TooltipContent>
                    </ShadcnTooltip>
                  </TooltipProvider>
                </div>
                <p className="text-xs text-slate-400 font-medium">Consolidated Statement of Profit or Loss — {unitStr}</p>
              </div>
              <div className="max-h-[300px] overflow-y-auto scrollbar-thin">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="text-left px-5 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Financial Item</th>
                      <th className="text-right px-5 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Amount ({currency})</th>
                      <th className="text-right px-5 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">% Rev</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {plRows.map(row => (
                      <tr key={row.label} className={`hover:bg-slate-50 transition-colors ${row.bold ? 'bg-slate-50/50 font-bold' : ''}`}>
                        <td className={`px-5 py-3 ${row.bold ? 'text-slate-900 font-extrabold' : 'text-slate-600 font-medium'}`}>{row.label}</td>
                        <td className={`px-5 py-3 text-right font-bold tabular-nums ${row.value < 0 ? 'text-rose-500' : row.bold ? 'text-slate-900' : 'text-slate-700'}`}>
                          {row.value < 0 ? `(${fmtB(Math.abs(row.value))})` : fmtB(row.value)}
                        </td>
                        <td className={`px-5 py-3 text-right font-bold text-slate-400 tabular-nums`}>{row.pct.toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Row 4: Ratio Panel — full width */}
          <RatioPanel />
        </>
      )}

      {activeSubTab === 'contracts' && (
        <>
          {/* Contracts Diagnostic Message */}
          <div className={`border rounded-2xl p-4 mb-6 shadow-sm flex items-start gap-3.5 transition-all duration-300 ${
            useApp().segment === 'Media' ? 'bg-amber-500/5 border-amber-200/50 shadow-amber-500/5' : 
            useApp().segment === 'Retail' ? 'bg-rose-500/5 border-rose-200/50 shadow-rose-500/5' : 
            'bg-blue-500/5 border-blue-200/50 shadow-blue-500/5'
          }`}>
            <div className={`p-2 rounded-xl ${
              useApp().segment === 'Media' ? 'bg-amber-50 text-amber-600' :
              useApp().segment === 'Retail' ? 'bg-rose-50 text-rose-600' :
              'bg-blue-50 text-blue-600'
            }`}>
              <AlertCircle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">Working Capital & Receivable Health Analysis</h4>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-0.5">
                {useApp().segment === 'Media' && `⚠️ DSO tinggi mencapai 72 hari dengan piutang tertunggak (AR Outstanding) sebesar ${fmtB(totalUnpaidInvoices)}. Sebagian besar terpusat pada kontrak proyek berdurasi panjang. Disarankan mengintensifkan penagihan milestone penagihan termin dan unbilled WIP sebesar ${fmtB(totalUnbilledValue)} agar segera di-invoice-kan.`}
                {useApp().segment === 'F&B' && `✅ Model bisnis ritel POS menghasilkan DSO minimal (3 hari). Siklus konversi kas (CCC) bernilai negatif (-15 hari), yang berarti operasional dibiayai oleh supplier sebelum tagihan jatuh tempo. Likuiditas optimal.`}
                {useApp().segment === 'Retail' && `⚠️ DIO mencapai 175 hari, mencerminkan perputaran lambat barang mewah (Bulgari, Omega). Rasio Lancar tinggi (2.45x) namun Rasio Cepat berada di 0.85x karena sebagian besar likuiditas tertahan dalam bentuk stok butik. Disarankan optimalisasi persediaan.`}
                {useApp().segment === 'All' && `Siklus modal kerja terkonsolidasi menunjukkan variasi sektoral yang kontras. Segmen Media membutuhkan perhatian pada penagihan piutang (>72 hari DSO), Retail membutuhkan optimalisasi persediaan barang mewah (175 hari DIO), sedangkan F&B menjadi motor likuiditas utama dengan siklus kas langsung.`}
              </p>
            </div>
          </div>

          {/* KPI Row for Contracts */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <KpiCard 
              label="Total Active Contracts" 
              value={fmtB(totalContractValue)} 
              sub={`${filteredOutstandingContracts.length} active client project${filteredOutstandingContracts.length !== 1 ? 's' : ''}`} 
              color="blue" 
              icon={FileText} 
              tooltip="Total nilai gabungan seluruh kontrak klien aktif yang sedang berjalan di bawah payung hukum portofolio segmen."
            />
            <KpiCard 
              label="Billed Value YTD" 
              value={fmtB(totalBilledValue)} 
              sub={`${totalContractValue > 0 ? ((totalBilledValue / totalContractValue) * 100).toFixed(0) : 0}% contract completion`} 
              color="green" 
              icon={Layers} 
              tooltip="Total nilai pekerjaan yang telah diselesaikan milestonenya dan sukses ditagihkan (di-invoice) ke klien sepanjang tahun berjalan."
            />
            <KpiCard 
              label="Unbilled WIP" 
              value={fmtB(totalUnbilledValue)} 
              sub="Earned milestones waiting for billing" 
              color="amber" 
              icon={Clock} 
              tooltip="Work-in-Progress - Nilai pekerjaan yang sudah dikerjakan namun belum mencapai milestone termin penagihan resmi atau masih menunggu proses administratif invoice."
            />
            <KpiCard 
              label="Unpaid Invoices (AR)" 
              value={fmtB(totalUnpaidInvoices)} 
              sub="Receivables waiting for client payment" 
              color="rose" 
              icon={AlertCircle} 
              tooltip="Accounts Receivable - Jumlah piutang outstanding yang sudah ditagihkan ke klien namun belum diterima pembayarannya, menunggu pelunasan."
            />
          </div>

          {/* Table & Side Panel Grid */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            
            {/* Outstanding Contracts Table & Search Box */}
            <div className="col-span-2 bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-xl shadow-slate-100/40 overflow-hidden flex flex-col">
              <div className="px-5 py-4.5 border-b border-slate-100 flex justify-between items-center bg-white/50">
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <h3 className="font-bold text-slate-800 text-sm">Client Outstanding Contracts</h3>
                    <TooltipProvider delayDuration={100}>
                      <ShadcnTooltip>
                        <TooltipTrigger asChild>
                          <button className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none">
                            <HelpCircle size={13} className="shrink-0" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-slate-900 border-slate-800 text-white text-xs p-2.5 max-w-[245px] rounded-xl font-bold shadow-xl leading-normal">
                          Daftar rincian kontrak aktif per klien yang memantau progres penagihan termin (Billed vs Unbilled) serta piutang yang jatuh tempo.
                        </TooltipContent>
                      </ShadcnTooltip>
                    </TooltipProvider>
                  </div>
                  <p className="text-xs text-slate-400 font-medium">Monitoring of milestones, billing progress, and outstanding invoice balances</p>
                </div>
                <span className="bg-slate-50 border border-slate-150 text-slate-500 px-3 py-1 rounded-full text-[10px] font-bold">
                  Target Currency: {unitStr}
                </span>
              </div>

              {/* SEARCH & FILTER CONTROLS */}
              <div className="flex flex-col md:flex-row gap-4 px-5 py-4 border-b border-slate-100 bg-slate-50/50 justify-between items-start md:items-center">
                <div className="relative w-full md:w-64">
                  <input
                    type="text"
                    placeholder="Cari klien atau proyek..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full text-xs bg-white border border-slate-200 rounded-xl pl-8 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium transition-all"
                  />
                  <svg className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm('')} 
                      className="absolute right-3 top-2 text-slate-400 hover:text-slate-600 text-[10px] font-bold"
                    >
                      Clear
                    </button>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-1.5 items-center">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mr-1.5">Status Filter:</span>
                  {['All', 'Overdue', 'Due Soon', 'On Track'].map(status => {
                    const count = status === 'All' 
                      ? processedContracts.length 
                      : processedContracts.filter(c => c.dueStatus === status).length
                    
                    return (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                          statusFilter === status
                            ? status === 'Overdue' ? 'bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-500/20' :
                              status === 'Due Soon' ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/20' :
                              status === 'On Track' ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/20' :
                              'bg-slate-800 text-white border-slate-800 shadow-md shadow-slate-800/25'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {status} ({count})
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-500">
                      <th className="text-left px-5 py-3 font-bold uppercase tracking-wider text-[10px]">Client & Project</th>
                      <th className="text-left px-4 py-3 font-bold uppercase tracking-wider text-[10px]">Brand</th>
                      <th className="text-right px-4 py-3 font-bold uppercase tracking-wider text-[10px]">Contract Value</th>
                      <th className="text-left px-4 py-3 font-bold uppercase tracking-wider text-[10px] w-48">Billing Progress</th>
                      <th className="text-right px-4 py-3 font-bold uppercase tracking-wider text-[10px]">AR Outstanding</th>
                      <th className="text-center px-4 py-3 font-bold uppercase tracking-wider text-[10px]">Status / Due</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {displayedContracts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-10 text-slate-400 font-medium bg-slate-50/10">
                          Tidak ada kontrak aktif yang sesuai dengan kriteria filter
                        </td>
                      </tr>
                    ) : (
                      displayedContracts.map(c => {
                        return (
                          <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-5 py-4">
                              <div className="font-bold text-slate-900">{c.client}</div>
                              <div className="text-[10px] text-slate-400 font-medium mt-0.5">{c.project}</div>
                            </td>
                            <td className="px-4 py-4">
                              <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                                c.segment === 'F&B' ? 'bg-orange-50 text-orange-600 border border-orange-100/50' :
                                c.segment === 'Retail' ? 'bg-blue-50 text-blue-600 border border-blue-100/50' :
                                'bg-emerald-50 text-emerald-600 border border-emerald-100/50'
                              }`}>
                                {c.brand}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-right font-bold text-slate-700 tabular-nums">
                              {fmtB(c.totalValue)}
                            </td>
                            <td className="px-4 py-4">
                              <div className="space-y-1">
                                <div className="flex justify-between text-[9px] font-bold text-slate-500">
                                  <span>Billed: {c.billedPct.toFixed(0)}%</span>
                                  <span>Unbilled: {(100 - c.billedPct).toFixed(0)}%</span>
                                </div>
                                <div className="w-full bg-slate-100/80 rounded-full h-2 overflow-hidden flex border border-slate-200/40 p-[1px]">
                                  <div className="bg-gradient-to-r from-blue-500 to-blue-650 h-full rounded-full transition-all duration-500" style={{ width: `${c.billedPct}%` }} />
                                  <div className="bg-gradient-to-r from-amber-400 to-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${100 - c.billedPct}%` }} />
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-right font-bold text-slate-900 tabular-nums">
                              {c.unpaidInvoices > 0 ? (
                                <span className="text-rose-500 font-extrabold">{fmtB(c.unpaidInvoices)}</span>
                              ) : (
                                <span className="text-slate-400 font-medium">-</span>
                              )}
                            </td>
                            <td className="px-4 py-4 text-center">
                              <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold ${c.dueStyle}`}>
                                {c.dueLabel}
                              </span>
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Column Panels */}
            <div className="space-y-6">
              
              {/* Detailed AR/AP Aging Table */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100 p-5 shadow-xl shadow-slate-100/40">
                <div className="mb-4">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <h3 className="font-bold text-slate-800 text-sm">Aging Breakdown Table</h3>
                    <TooltipProvider delayDuration={100}>
                      <ShadcnTooltip>
                        <TooltipTrigger asChild>
                          <button className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none">
                            <HelpCircle size={13} className="shrink-0" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-slate-900 border-slate-800 text-white text-xs p-2.5 max-w-[245px] rounded-xl font-bold shadow-xl leading-normal">
                          Detail nominal piutang usaha (AR) dan utang dagang (AP) yang dipecah per periode hari tunggakan untuk mengevaluasi risiko likuiditas harian.
                        </TooltipContent>
                      </ShadcnTooltip>
                    </TooltipProvider>
                  </div>
                  <p className="text-xs text-slate-400 font-medium">Invoice outstanding balance by aging bucket</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-500">
                        <th className="text-left pb-2 font-bold text-[10px] uppercase text-slate-400">Bucket</th>
                        <th className="text-right pb-2 font-bold text-[10px] uppercase text-slate-400">AR (Receivable)</th>
                        <th className="text-right pb-2 font-bold text-[10px] uppercase text-slate-400">AP (Payable)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 font-medium">
                      {filteredApArAging.map(row => (
                        <tr key={row.bucket} className="hover:bg-slate-50/50">
                          <td className="py-2.5 text-slate-700 font-semibold">{row.bucket}</td>
                          <td className="py-2.5 text-right font-bold text-blue-600 tabular-nums">{fmtB(row.ar)}</td>
                          <td className="py-2.5 text-right font-bold text-orange-600 tabular-nums">{fmtB(row.ap)}</td>
                        </tr>
                      ))}
                      {/* Total Aging Row */}
                      <tr className="border-t border-slate-200 font-bold bg-slate-50/30">
                        <td className="py-2.5 text-slate-800 font-bold">Total</td>
                        <td className="py-2.5 text-right font-bold text-blue-600 tabular-nums">
                          {fmtB(filteredApArAging.reduce((sum, r) => sum + r.ar, 0))}
                        </td>
                        <td className="py-2.5 text-right font-bold text-orange-600 tabular-nums">
                          {fmtB(filteredApArAging.reduce((sum, r) => sum + r.ap, 0))}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Working Capital Efficiency Card */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100 p-5 shadow-xl shadow-slate-100/40">
                <div className="mb-4">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <h3 className="font-bold text-slate-800 text-sm">Working Capital Efficiency</h3>
                    <TooltipProvider delayDuration={100}>
                      <ShadcnTooltip>
                        <TooltipTrigger asChild>
                          <button className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none">
                            <HelpCircle size={13} className="shrink-0" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-slate-900 border-slate-800 text-white text-xs p-2.5 max-w-[245px] rounded-xl font-bold shadow-xl leading-normal">
                          Rasio siklus perputaran kas operasional (DSO, DIO, DPO, dan Cash Conversion Cycle) untuk memantau seberapa efisien modal kerja diputar.
                        </TooltipContent>
                      </ShadcnTooltip>
                    </TooltipProvider>
                  </div>
                  <p className="text-xs text-slate-400 font-medium">Operational ratios & sector conversion metrics</p>
                </div>
                
                <div className="space-y-4">
                  <RatioGauge 
                    label="Days Sales Outstanding (DSO)" 
                    value={filteredRatios.dso} 
                    max={100} 
                    target={45} 
                    colorClass="text-blue-600" 
                    warningThreshold={45} 
                  />
                  <RatioGauge 
                    label="Days Inventory Outstanding (DIO)" 
                    value={filteredRatios.dio} 
                    max={200} 
                    target={90} 
                    colorClass="text-slate-800" 
                    warningThreshold={120} 
                  />
                  <RatioGauge 
                    label="Days Payable Outstanding (DPO)" 
                    value={filteredRatios.dpo} 
                    max={100} 
                    target={45} 
                    colorClass="text-orange-600" 
                  />
                  <RatioGauge 
                    label="Cash Conversion Cycle (CCC)" 
                    value={filteredRatios.ccc} 
                    max={150} 
                    target={60} 
                    colorClass="text-blue-600" 
                    warningThreshold={90} 
                  />

                  {/* Context Note */}
                  <p className="text-[10px] text-slate-400/90 font-medium leading-relaxed bg-slate-50/50 p-2.5 rounded-lg border border-slate-100/40">
                    {useApp().segment === 'Media' && "Sektor Media memiliki DSO tinggi (~72 hari) karena penagihan berbasis termin kontrak proyek / iklan luar ruang."}
                    {useApp().segment === 'F&B' && "Sektor F&B memiliki DSO minimal (~3 hari) karena pembayaran kas/POS di gerai, menghasilkan siklus konversi kas (CCC) negatif."}
                    {useApp().segment === 'Retail' && "Sektor Retail memiliki DIO tinggi (~175 hari) karena waktu perputaran stok barang mewah (Bulgari, Omega) yang lebih panjang."}
                    {useApp().segment === 'All' && "Sektor All memiliki DSO dan DIO bervariasi sesuai segmen, mengonsolidasikan retail mewah (persediaan lama), media iklan (termin piutang lama), dan F&B (tunai/cepat)."}
                  </p>

                </div>

              </div>

            </div>

          </div>
        </>
      )}

      {activeSubTab === 'capex_opex' && (
        <>
          {/* CAPEX & OPEX Diagnostic Insight Banner */}
          <div className="bg-gradient-to-r from-blue-500/5 to-sky-500/5 border border-slate-100 dark:border-slate-800 rounded-2xl p-4.5 mb-6 shadow-sm flex items-start gap-4">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">Capital & Operational Expenditure Analysis</h4>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-1">
                {useApp().segment === 'All' && "Pengeluaran modal (CAPEX) grup terfokus pada renovasi butik luxury Retail di mal premium Jakarta dan Bali. Biaya operasional (OPEX) terbesar didorong oleh gaji karyawan operasional F&B dan sewa outlet ritel. Secara keseluruhan, pemakaian anggaran berjalan efisien di bawah pagu target."}
                {useApp().segment === 'F&B' && "CAPEX F&B dialokasikan untuk peremajaan kitchen equipment gerai Häagen-Dazs dan outlet Hard Rock Cafe Bali. Biaya tenaga kerja (labor cost) dan utilitas adalah komponen OPEX terbesar."}
                {useApp().segment === 'Retail' && "Ritel fisik merupakan pengguna CAPEX terbesar untuk mendukung interior butik standar internasional Bulgari dan Omega. Rasio pemakaian anggaran CAPEX terjaga aman pada 85%."}
                {useApp().segment === 'Media' && "Media menuntut CAPEX minimal (fokus infrastruktur TI studio digital). Pengeluaran OPEX dialokasikan utama untuk talent fees eksternal dan biaya promosi kampanye iklan."}
              </p>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <KpiCard 
              label="Total CAPEX YTD" 
              value={fmtB(totalCapexActual)} 
              sub={`Budget: ${fmtB(totalCapexBudget)}`} 
              color="blue" 
              icon={Layers} 
              tooltip="Capital Expenditures YTD - Total realisasi dana belanja investasi untuk pembelian aset tetap fisik seperti renovasi outlet, peremajaan kitchen equipment, dan infrastruktur IT. Klik untuk melihat buku besar (ledger)."
              onClick={() => setSelectedLedger('capex')}
            />
            <KpiCard 
              label="CAPEX Utilization" 
              value={`${capexUtilization}%`} 
              sub="Realisasi vs budget tahunan" 
              color="green" 
              icon={TrendingUp} 
              tooltip="Persentase penyerapan realisasi belanja modal (CAPEX) aktual terhadap pagu anggaran yang telah disetujui untuk tahun berjalan."
            />
            <KpiCard 
              label="Total OPEX YTD" 
              value={fmtB(totalOpexActual)} 
              sub={`Budget: ${fmtB(totalOpexBudget)}`} 
              color="rose" 
              icon={DollarSign} 
              tooltip="Operational Expenditures YTD - Total pengeluaran biaya operasional harian seperti gaji staf (payroll), sewa lokasi outlet (rental), marketing, dan biaya utilitas harian. Klik untuk melihat buku besar (ledger)."
              onClick={() => setSelectedLedger('opex')}
            />
            <KpiCard 
              label="OPEX Efficiency Ratio" 
              value={`${opexEfficiency}%`} 
              sub="OPEX dari total Revenue" 
              color="amber" 
              icon={BarChart2} 
              tooltip="Rasio efisiensi biaya operasional, mengukur porsi pengeluaran operasional (OPEX) terhadap total pendapatan (Revenue) yang dihasilkan. Rasio lebih rendah menunjukkan efisiensi lebih baik."
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* CAPEX Budget vs Actual Grouped Bar Chart */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100 p-5 shadow-xl shadow-slate-100/40">
              <div className="flex items-center gap-1.5 mb-0.5">
                <h3 className="font-bold text-slate-800 text-sm">CAPEX Budget vs Actual</h3>
                <TooltipProvider delayDuration={100}>
                  <ShadcnTooltip>
                    <TooltipTrigger asChild>
                      <button className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none">
                        <HelpCircle size={13} className="shrink-0" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-slate-900 border-slate-800 text-white text-xs p-2.5 max-w-[245px] rounded-xl font-bold shadow-xl leading-normal">
                      Perbandingan visual antara pagu anggaran belanja modal (Budget CAPEX) dengan realisasi aktual (Actual CAPEX) yang dikeluarkan per kategori aset.
                    </TooltipContent>
                  </ShadcnTooltip>
                </TooltipProvider>
              </div>
              <p className="text-xs text-slate-400 font-medium mb-4">Comparison of YTD capital spending by category — {unitStr}</p>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={capexBarData} margin={{ top: 8, right: 8, left: -22, bottom: 0 }} barGap={2} barSize={12}>
                  <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 500 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 10, color: '#64748b', fontWeight: 650, paddingTop: 10 }} />
                  <Bar dataKey="Budget" fill="#cbd5e1" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Actual" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* OPEX Structure Donut Chart */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100 p-5 shadow-xl shadow-slate-100/40 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <h3 className="font-bold text-slate-800 text-sm">OPEX Structure Breakdown</h3>
                  <TooltipProvider delayDuration={100}>
                    <ShadcnTooltip>
                      <TooltipTrigger asChild>
                        <button className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none">
                          <HelpCircle size={13} className="shrink-0" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-slate-900 border-slate-800 text-white text-xs p-2.5 max-w-[245px] rounded-xl font-bold shadow-xl leading-normal">
                        Proporsi sebaran biaya operasional (OPEX) untuk memahami pos pengeluaran terbesar (misalnya gaji karyawan, sewa gerai, atau pemasaran).
                      </TooltipContent>
                    </ShadcnTooltip>
                  </TooltipProvider>
                </div>
                <p className="text-xs text-slate-400 font-medium mb-4">Share of major operational expense categories — {unitStr}</p>
                <div className="flex justify-center my-3">
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie
                        data={opexDonutData}
                        cx="50%"
                        cy="50%"
                        innerRadius={48}
                        outerRadius={70}
                        dataKey="value"
                        paddingAngle={3}
                      >
                        {opexDonutData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v) => [fmtB(v), '']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="grid grid-cols-5 gap-2 border-t border-slate-100 pt-4">
                {filteredOpexData.map(o => (
                  <div key={o.category} className="text-center">
                    <span className="inline-block w-2 h-2 rounded-full mb-1" style={{ background: o.color }} />
                    <p className="text-[9px] text-slate-400 font-bold uppercase truncate max-w-[80px] mx-auto">{o.category.split(' ')[0]}</p>
                    <p className="text-xs font-black text-slate-800 mt-0.5">{fmtB(o.actual)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Budget Control Ledger Table */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-xl shadow-slate-100/40 overflow-hidden mb-6">
            <div className="px-5 py-4.5 border-b border-slate-100 flex justify-between items-center bg-white/50">
              <div>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <h3 className="font-bold text-slate-800 text-sm">Budget Control Ledger</h3>
                  <TooltipProvider delayDuration={100}>
                    <ShadcnTooltip>
                      <TooltipTrigger asChild>
                        <button className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none">
                          <HelpCircle size={13} className="shrink-0" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-slate-900 border-slate-800 text-white text-xs p-2.5 max-w-[245px] rounded-xl font-bold shadow-xl leading-normal">
                        Tabel analisis varians (Variance Analysis) komprehensif yang membandingkan budget vs realisasi belanja untuk setiap jenis CAPEX dan OPEX guna mencegah terjadinya pembengkakan biaya (budget overrun).
                      </TooltipContent>
                    </ShadcnTooltip>
                  </TooltipProvider>
                </div>
                <p className="text-xs text-slate-400 font-medium">Variance analysis of actual spending vs allocated YTD budget</p>
              </div>
              <span className="bg-slate-50 border border-slate-150 text-slate-500 px-3 py-1 rounded-full text-[10px] font-bold">
                Target Currency: {unitStr}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-500">
                    <th className="text-left px-5 py-3 font-bold uppercase tracking-wider text-[10px]">Expense Item</th>
                    <th className="text-center px-4 py-3 font-bold uppercase tracking-wider text-[10px]">Type</th>
                    <th className="text-right px-4 py-3 font-bold uppercase tracking-wider text-[10px]">YTD Budget</th>
                    <th className="text-right px-4 py-3 font-bold uppercase tracking-wider text-[10px]">YTD Actual</th>
                    <th className="text-right px-4 py-3 font-bold uppercase tracking-wider text-[10px]">Variance</th>
                    <th className="text-center px-4 py-3 font-bold uppercase tracking-wider text-[10px] w-32">Budget %</th>
                    <th className="text-center px-4 py-3 font-bold uppercase tracking-wider text-[10px]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                  {budgetLedger.map(row => {
                    const variance = row.actual - row.budget
                    const isUnderBudget = variance <= 0
                    const percentUsed = row.pct
                    
                    return (
                      <tr key={row.name} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-3.5 font-bold text-slate-850 text-slate-800">{row.name}</td>
                        <td className="px-4 py-3.5 text-center">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black border ${
                            row.type === 'CAPEX' 
                              ? 'bg-blue-50 text-blue-600 border-blue-100/50' 
                              : 'bg-amber-50 text-amber-600 border-amber-100/50'
                          }`}>
                            {row.type}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right tabular-nums">{fmtB(row.budget)}</td>
                        <td className="px-4 py-3.5 text-right font-bold tabular-nums">{fmtB(row.actual)}</td>
                        <td className={`px-4 py-3.5 text-right font-extrabold tabular-nums ${isUnderBudget ? 'text-emerald-600' : 'text-rose-500'}`}>
                          {isUnderBudget ? '-' : '+'}{fmtB(Math.abs(variance))}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="space-y-1">
                            <div className="flex justify-between text-[8px] font-black text-slate-400">
                              <span>Used: {percentUsed}%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden">
                              <div className={`h-full rounded-full ${
                                percentUsed <= 90 ? 'bg-emerald-500' :
                                percentUsed <= 100 ? 'bg-amber-500' :
                                'bg-rose-500'
                              }`} style={{ width: `${Math.min(100, percentUsed)}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border ${
                            percentUsed <= 95 ? 'bg-emerald-50 text-emerald-600 border-emerald-100/60' :
                            percentUsed <= 100 ? 'bg-amber-50 text-amber-600 border-amber-100/60' :
                            'bg-rose-50 text-rose-600 border-rose-100/60'
                          }`}>
                            {percentUsed <= 95 ? 'Saving' : percentUsed <= 100 ? 'On Target' : 'Overrun'}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* CAPEX & OPEX Transaction Ledger Dialog Modal */}
      <Dialog open={selectedLedger !== null} onOpenChange={(open) => !open && setSelectedLedger(null)}>
        <DialogContent className="max-w-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-2xl p-6 rounded-2xl outline-none">
          {selectedLedger && (() => {
            const isCapex = selectedLedger === 'capex'
            const ledgerRows = isCapex 
              ? [
                  { date: '2026-06-02', desc: 'Bvlgari PI Store Expansion (Ph-1)', category: 'Operations', location: 'Plaza Indonesia', vendor: 'Jaya Konstruksi PT', amount: 12.5 * scaleRatio },
                  { date: '2026-05-24', desc: 'Häagen-Dazs Kitchen Equipment Upgrade', category: 'General Affairs (GA)', location: 'Senayan City', vendor: 'Resto Tech Solusindo', amount: 4.8 * scaleRatio },
                  { date: '2026-05-18', desc: 'MRA HO Server & Network Overhaul', category: 'General Affairs (GA)', location: 'Head Office MRA', vendor: 'Lintasarta', amount: 8.2 * scaleRatio },
                  { date: '2026-05-05', desc: 'Hard Rock Cafe Bali sound-system rebuild', category: 'Operations', location: 'Kuta Beach, Bali', vendor: 'Melodia Musik', amount: 5.5 * scaleRatio },
                  { date: '2026-04-12', desc: 'HRIS System & Training Center Renovation', category: 'Human Resources (HR)', location: 'Plaza Senayan', vendor: 'ArchiDesign Contractor', amount: 9.0 * scaleRatio },
                  { date: '2026-04-05', desc: 'New Brand Campaign Launch Media Asset', category: 'Marketing', location: 'Jakarta HO', vendor: 'MRA Creative Studio', amount: 6.2 * scaleRatio },
                ]
              : [
                  { date: '2026-06-01', desc: 'Payroll & Allowances Ritel & HO Staff', category: 'Salaries & Wages', location: 'MRA HO / Ritel', vendor: 'Karyawan Internal', amount: 48.2 * scaleRatio * (1 - simOpexEfficiency / 100) },
                  { date: '2026-05-28', desc: 'Bvlgari Outlet Rental Fee (GI)', category: 'Store Rental', location: 'Grand Indonesia', vendor: 'Grand Indonesia Mall', amount: 15.6 * scaleRatio * (1 - simOpexEfficiency / 100) },
                  { date: '2026-05-25', desc: 'Tagihan Listrik & Air Häagen-Dazs Outlet', category: 'Utilities', location: 'Senayan City', vendor: 'PLN & PAM Jaya', amount: 2.8 * scaleRatio * (1 - simOpexEfficiency / 100) },
                  { date: '2026-05-15', desc: 'Digital Retainer Kampanye Iklan Harper\'s Bazaar', category: 'Marketing & PR', location: 'HO Media', vendor: 'MRA Creative Studio', amount: 4.2 * scaleRatio * (1 - simOpexEfficiency / 100) },
                  { date: '2026-05-10', desc: 'Koneksi Internet Dedicated Fiber Optic', category: 'Utilities', location: 'HO / Outlet Group', vendor: 'Biznet Networks', amount: 1.8 * scaleRatio * (1 - simOpexEfficiency / 100) },
                ]

            return (
              <>
                <DialogHeader className="mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <DialogTitle className="text-xl font-black text-slate-950 dark:text-slate-50 tracking-tight flex items-center gap-2">
                        <Activity className="text-blue-500" style={{ color: isCapex ? '#3b82f6' : '#8b5cf6' }} />
                        <span>Buku Besar Transaksi: {isCapex ? 'CAPEX' : 'OPEX'} YTD</span>
                      </DialogTitle>
                      <DialogDescription className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-1">
                        Daftar rincian pengeluaran dana dan komitmen kontrak berjalan
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>

                {/* Ledger Table */}
                <div className="max-h-[360px] overflow-y-auto pr-1">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800/60">
                        <th className="text-left px-3 py-2.5 font-bold text-slate-500 uppercase tracking-wider text-[9px]">Tanggal</th>
                        <th className="text-left px-3 py-2.5 font-bold text-slate-500 uppercase tracking-wider text-[9px]">Deskripsi</th>
                        <th className="text-left px-3 py-2.5 font-bold text-slate-500 uppercase tracking-wider text-[9px]">Lokasi</th>
                        <th className="text-left px-3 py-2.5 font-bold text-slate-500 uppercase tracking-wider text-[9px]">Vendor</th>
                        <th className="text-right px-3 py-2.5 font-bold text-slate-500 uppercase tracking-wider text-[9px]">Nominal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/45">
                      {ledgerRows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                          <td className="px-3 py-2.5 text-slate-500 dark:text-slate-400 font-medium tabular-nums">{row.date}</td>
                          <td className="px-3 py-2.5">
                            <span className="text-slate-800 dark:text-slate-200 font-extrabold block">{row.desc}</span>
                            <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wide">{row.category}</span>
                          </td>
                          <td className="px-3 py-2.5 text-slate-655 dark:text-slate-350 font-bold">{row.location}</td>
                          <td className="px-3 py-2.5 text-slate-500 dark:text-slate-400 font-medium">{row.vendor}</td>
                          <td className="px-3 py-2.5 text-right font-black text-slate-850 dark:text-slate-100 tabular-nums">
                            {hideValues ? '••••' : fmtB(row.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )
          })()}
        </DialogContent>
      </Dialog>

      </Layout>
  )
}
