import { useState, useMemo } from 'react'
import Layout from '../components/layout/Layout'
import {
  BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { useApp } from '../context/AppContext'
import { utilitiesCost } from '../data/dummyData'
import {
  Users, Building2, TrendingUp, ShoppingCart, 
  Activity, Zap, Droplet, Wifi,
  Flame, Wind, Trash2, HelpCircle, Calendar, MoreHorizontal
} from 'lucide-react'
import { Tooltip as ShadcnTooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ChartSkeleton, ListSkeleton } from '../components/ui/SkeletonLoader'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'

function Section({ title, children }) {
  return (
    <div className="mb-8">
      <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3.5">{title}</h2>
      {children}
    </div>
  )
}

const getBrandLogo = (brandName) => {
  const name = brandName.toLowerCase()
  if (name.includes('bvlgari') || name.includes('bulgari')) {
    return (
      <div className="w-7 h-7 rounded-full bg-black border border-[#d4af37] flex items-center justify-center shadow-md shrink-0 select-none overflow-hidden">
        <span className="font-serif text-[5.5px] tracking-[0.15em] text-[#d4af37] font-black uppercase">BVLGARI</span>
      </div>
    )
  }
  if (name.includes('omega')) {
    return (
      <div className="w-7 h-7 rounded-full bg-[#d2232a] flex items-center justify-center shadow-md shrink-0 select-none">
        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 5.5c-3.1 0-5.5 2.4-5.5 5.5 0 1.7.8 3.2 2 4.2.4.3.6.7.6 1.2v.6c0 .6-.5 1.1-1.1 1.1H5.5c-.3 0-.5-.2-.5-.5v-1c0-.3.2-.5.5-.5h.9c.7 0 1.2-.5 1.2-1.2v-.6c0-.9-.4-1.7-1.1-2.2-1.2-1-2-2.5-2-4.2C4.5 7 7.9 3.5 12 3.5s7.5 3.5 7.5 7.6c0 1.7-.8 3.2-2 4.2-.7.5-1.1 1.3-1.1 2.2v.6c0 .7.5 1.2 1.2 1.2h.9c.3 0 .5.2.5.5v1c0 .3-.2.5-.5.5h-2.5c-.6 0-1.1-.5-1.1-1.1v-.6c0-.5.2-.9.6-1.2 1.2-1 2-2.5 2-4.2 0-3.1-2.4-5.5-5.5-5.5z" />
        </svg>
      </div>
    )
  }
  if (name.includes('atmos')) {
    return (
      <div className="w-7 h-7 rounded-full bg-black border border-slate-800 flex items-center justify-center shadow-md shrink-0 select-none">
        <span className="font-sans text-[7.5px] font-black tracking-tighter text-white lowercase">atmos</span>
      </div>
    )
  }
  if (name.includes('lancôme') || name.includes('lancome')) {
    return (
      <div className="w-7 h-7 rounded-full bg-black border border-slate-800 flex items-center justify-center shadow-md shrink-0 select-none">
        <svg className="w-4 h-4 text-[#d4af37]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.2,4.2c-0.2-0.2-0.5-0.2-0.7,0C11.1,4.6,9,6.8,9,9.5c0,2.1,1.3,3.7,2.5,4.3c-0.2-0.4-0.3-0.9-0.3-1.4 c0-1.8,1.2-3.3,2.5-4c-0.4,0.7-0.7,1.6-0.7,2.5c0,1.3,0.8,2.3,1.5,3c1-0.9,1.5-2.2,1.5-3.6C16,7.5,13.2,5.2,12.2,4.2z M12,14 c-0.6,0-1,0.4-1,1c0,0.6,0.4,1,1,1s1-0.4,1-1C13,14.4,12.6,14,12,14z" />
          <path d="M12,16v4c0,0.6-0.4,1-1,1s-1-0.4-1-1v-4c0-0.6,0.4-1,1-1S12,15.4,12,16z" />
        </svg>
      </div>
    )
  }
  if (name.includes('kiehl')) {
    return (
      <div className="w-7 h-7 rounded-full bg-[#0d1622] border border-[#d4af37]/30 flex items-center justify-center shadow-md shrink-0 select-none">
        <span className="font-serif italic text-[7px] font-bold text-[#faf9f5] tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>Kiehl's</span>
      </div>
    )
  }
  if (name.includes('chronologie')) {
    return (
      <div className="w-7 h-7 rounded-full bg-[#1b2230] border border-[#d4af37] flex items-center justify-center shadow-md shrink-0 select-none">
        <svg className="w-4.5 h-4.5 text-[#d4af37]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <circle cx="12" cy="12" r="9.5" stroke="#d4af37" strokeWidth="0.8" />
          <line x1="12" y1="3" x2="12" y2="4.5" stroke="#d4af37" strokeWidth="1" />
          <line x1="12" y1="19.5" x2="12" y2="21" stroke="#d4af37" strokeWidth="1" />
          <line x1="3" y1="12" x2="4.5" y2="12" stroke="#d4af37" strokeWidth="1" />
          <line x1="19.5" y1="12" x2="21" y2="12" stroke="#d4af37" strokeWidth="1" />
          <line x1="12" y1="12" x2="12" y2="7.5" stroke="#d4af37" strokeWidth="1" strokeLinecap="round" />
          <line x1="12" y1="12" x2="15.5" y2="12" stroke="#d4af37" strokeWidth="1" strokeLinecap="round" />
          <circle cx="12" cy="12" r="1.2" fill="#d4af37" />
        </svg>
      </div>
    )
  }
  if (name.includes('haagen') || name.includes('häagen')) {
    return (
      <div className="w-7 h-7 rounded-full bg-[#5c061e] border border-[#d4af37]/45 flex items-center justify-center shadow-md shrink-0 select-none">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
          <path d="M4.5 12C4.5 9 7 8.5 12 8.5S19.5 9 19.5 12S17 15.5 12 15.5S4.5 15 4.5 12Z" stroke="#d4af37" strokeWidth="0.8" />
          <text x="12" y="13.8" textAnchor="middle" fill="#ffffff" fontSize="4.5" fontWeight="950" fontFamily="sans-serif" letterSpacing="0.2">H-D</text>
        </svg>
      </div>
    )
  }
  if (name.includes('hard rock')) {
    return (
      <div className="w-7 h-7 rounded-full bg-[#ffcc00] border border-[#7a1215] flex items-center justify-center shadow-md shrink-0 select-none overflow-hidden relative">
        <svg className="w-full h-full" viewBox="0 0 24 24">
          <text x="12" y="10.5" textAnchor="middle" fill="#c21920" fontSize="4.2" fontWeight="950" fontFamily="sans-serif" transform="rotate(-7 12 10.5)">Hard Rock</text>
          <text x="12" y="15.5" textAnchor="middle" fill="#ffffff" fontSize="3" fontWeight="900" fontFamily="sans-serif" stroke="#000000" strokeWidth="0.25" letterSpacing="0.3">CAFE</text>
        </svg>
      </div>
    )
  }
  if (name.includes('jamba')) {
    return (
      <div className="w-7 h-7 rounded-full bg-white border border-slate-200/80 flex items-center justify-center shadow-md shrink-0 select-none overflow-hidden">
        <svg className="w-5.5 h-5.5" viewBox="0 0 100 100">
          <path d="M50,22 C65,22 78,35 78,50 C78,66 63,78 48,78 C33,78 22,65 26,48 C29,35 42,28 52,35 C60,40 62,50 55,56 C50,60 43,58 41,51 C39,45 44,41 48,43" fill="none" stroke="#f97316" strokeWidth="10" strokeLinecap="round" />
          <path d="M48,32 C54,32 62,39 60,47 C58,53 50,55 46,50 C43,46 46,41 50,41" fill="none" stroke="#22c55e" strokeWidth="8" strokeLinecap="round" />
        </svg>
      </div>
    )
  }
  return (
    <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-[9px] font-bold text-slate-200 border border-slate-700 shadow-sm shrink-0 select-none">
      {brandName.charAt(0).toUpperCase()}
    </div>
  )
}

export default function Operational() {
  const { filteredStoreProductivity, scaleRatio, currency, fmt, segment, hideValues, selectedMonth, isTransitioning } = useApp()

  const [selectedUtility, setSelectedUtility] = useState(null)

  const [visibleUtilities, setVisibleUtilities] = useState({
    electricity: true,
    water: true,
    gas: true,
    internet: true,
    acSentral: true,
    wasteCleaning: true
  })

  const scaleCategory = (month, key, rawVal) => {
    const m = month
    if (key === 'electricity') {
      const vals = { Jan: 12.5, Feb: 12.2, Mar: 13.0, Apr: 13.6, Mei: 14.5, Jun: 15.8, Jul: 15.4, Agt: 15.6, Sep: 16.1, Okt: 16.6, Nov: 17.1, Des: 17.6 }
      return vals[m] || rawVal
    }
    if (key === 'water') {
      const vals = { Jan: 27.2, Feb: 26.5, Mar: 29.0, Apr: 29.0, Mei: 30.8, Jun: 32.7, Jul: 31.6, Agt: 33.7, Sep: 34.8, Okt: 35.8, Nov: 37.9, Des: 40.0 }
      return vals[m] || rawVal
    }
    if (key === 'gas') {
      const vals = { Jan: 19.5, Feb: 19.0, Mar: 20.5, Apr: 20.5, Mei: 22.1, Jun: 23.6, Jul: 22.3, Agt: 23.1, Sep: 24.0, Okt: 24.9, Nov: 25.7, Des: 26.6 }
      return vals[m] || rawVal
    }
    if (key === 'internet') {
      const vals = { Jan: 21.5, Feb: 21.0, Mar: 22.5, Apr: 22.5, Mei: 23.9, Jun: 25.4, Jul: 25.4, Agt: 26.6, Sep: 26.6, Okt: 27.9, Nov: 27.9, Des: 29.2 }
      return vals[m] || rawVal
    }
    if (key === 'acSentral') {
      const vals = { Jan: 16.0, Feb: 15.5, Mar: 16.8, Apr: 16.8, Mei: 17.9, Jun: 19.1, Jul: 18.5, Agt: 18.8, Sep: 19.4, Okt: 19.9, Nov: 20.5, Des: 21.1 }
      return vals[m] || rawVal
    }
    if (key === 'wasteCleaning') {
      const vals = { Jan: 29.2, Feb: 28.5, Mar: 31.0, Apr: 31.0, Mei: 32.6, Jun: 34.2, Jul: 32.0, Agt: 34.2, Sep: 36.5, Okt: 38.8, Nov: 41.0, Des: 43.3 }
      return vals[m] || rawVal
    }
    return rawVal
  }

  const dynamicUtilities = utilitiesCost.map(u => {
    const convertValLocal = (idrVal) => {
      if (currency === 'USD') {
        return (idrVal * 1000) / (15800 / 1000) // Returns value in USD Million
      }
      return idrVal
    }
    return {
      month: u.month,
      electricity: parseFloat(convertValLocal(scaleCategory(u.month, 'electricity', u.electricity) * scaleRatio).toFixed(1)),
      water: parseFloat(convertValLocal(scaleCategory(u.month, 'water', u.water) * scaleRatio).toFixed(1)),
      gas: parseFloat(convertValLocal(scaleCategory(u.month, 'gas', u.gas) * scaleRatio).toFixed(1)),
      internet: parseFloat(convertValLocal(scaleCategory(u.month, 'internet', u.internet) * scaleRatio).toFixed(1)),
      acSentral: parseFloat(convertValLocal(scaleCategory(u.month, 'acSentral', u.acSentral) * scaleRatio).toFixed(1)),
      wasteCleaning: parseFloat(convertValLocal(scaleCategory(u.month, 'wasteCleaning', u.wasteCleaning) * scaleRatio).toFixed(1)),
    }
  })

  const UTILITY_KEYS = [
    { key: 'electricity', label: 'Listrik', icon: Zap, color: '#f43f5e', gradId: 'colorElec', bgClass: 'bg-rose-50/70 border-rose-100/50 text-rose-600 dark:bg-rose-950/20 dark:border-rose-900/30 dark:text-rose-400', iconBgClass: 'bg-rose-50 border-rose-100/50 text-rose-500 dark:bg-rose-950/30 dark:border-rose-900/20' },
    { key: 'water', label: 'Air', icon: Droplet, color: '#3b82f6', gradId: 'colorWater', bgClass: 'bg-blue-50/70 border-blue-100/50 text-blue-600 dark:bg-blue-950/20 dark:border-blue-900/30 dark:text-blue-400', iconBgClass: 'bg-blue-50 border-blue-100/50 text-blue-500 dark:bg-blue-950/30 dark:border-rose-900/20' },
    { key: 'gas', label: 'Gas', icon: Flame, color: '#f59e0b', gradId: 'colorGas', bgClass: 'bg-amber-50/70 border-amber-100/50 text-amber-600 dark:bg-amber-950/20 dark:border-amber-900/30 dark:text-amber-400', iconBgClass: 'bg-amber-50 border-amber-100/50 text-amber-500 dark:bg-amber-950/30 dark:border-rose-900/20' },
    { key: 'internet', label: 'Konektivitas', icon: Wifi, color: '#10b981', gradId: 'colorNet', bgClass: 'bg-emerald-50/70 border-emerald-100/50 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-emerald-400', iconBgClass: 'bg-emerald-50 border-emerald-100/50 text-emerald-500 dark:bg-emerald-950/30 dark:border-rose-900/20' },
    { key: 'acSentral', label: 'Central AC', icon: Wind, color: '#0ea5e9', gradId: 'colorAC', bgClass: 'bg-sky-50/70 border-sky-100/50 text-sky-600 dark:bg-sky-950/20 dark:border-sky-900/30 dark:text-sky-400', iconBgClass: 'bg-sky-50 border-sky-100/50 text-sky-500 dark:bg-sky-950/30 dark:border-rose-900/20' },
    { key: 'wasteCleaning', label: 'Kebersihan', icon: Trash2, color: '#14b8a6', gradId: 'colorWaste', bgClass: 'bg-teal-50/70 border-teal-100/50 text-teal-600 dark:bg-teal-950/20 dark:border-teal-900/30 dark:text-teal-400', iconBgClass: 'bg-teal-50 border-teal-100/50 text-teal-500 dark:bg-teal-950/30 dark:border-rose-900/20' },
  ]

  const selectedMonthData = useMemo(() => {
    return dynamicUtilities.find(u => u.month === selectedMonth) || dynamicUtilities[dynamicUtilities.length - 1]
  }, [dynamicUtilities, selectedMonth])

  const previousMonthData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des']
    const currIndex = months.indexOf(selectedMonthData.month)
    if (currIndex <= 0) return null
    const prevMonthName = months[currIndex - 1]
    return dynamicUtilities.find(u => u.month === prevMonthName) || null
  }, [dynamicUtilities, selectedMonthData])

  const toggleUtility = (key) => {
    setVisibleUtilities(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  // Dynamic formatting helpers
  const formatEmployeeRevenue = () => {
    if (hideValues) return 'IDR ••••'
    if (currency === 'USD') {
      return '$88K'
    }
    return 'IDR 1.39B'
  }

  const formatTicketSize = () => {
    if (hideValues) return 'IDR ••••'
    if (currency === 'USD') {
      return '$177'
    }
    return 'IDR 2.8M'
  }

  const efficiencyKpis = [
    { label: 'Revenue per Employee',    value: formatEmployeeRevenue(), trend: hideValues ? '•••%' : '+12.4% vs LY', good: true, icon: Users, color: 'text-blue-500 bg-blue-500/10 border-blue-500/20', tooltip: "Rasio produktivitas karyawan, dihitung dari total pendapatan bersih (Revenue) dibagi jumlah seluruh staf operasional berjalan." },
    { label: 'Avg Rental Cost Ratio',   value: hideValues ? '•••%' : '11.2%',    trend: hideValues ? '•••%' : '-0.8% MoM', good: true, icon: Building2, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', tooltip: "Persentase biaya sewa lantai toko/butik terhadap total pendapatan yang dihasilkan (ideal standar ritel mewah: kurang dari 12%)." },
    { label: 'Same-Store Sales Growth', value: hideValues ? '•••%' : '+8.4%',    trend: hideValues ? '•••%' : 'Target 6.0%', good: true, icon: TrendingUp, color: 'text-blue-500 bg-blue-500/10 border-blue-500/20', tooltip: "Indikator pertumbuhan penjualan pada toko/butik yang telah beroperasi minimal satu tahun untuk mengukur performa organik toko tanpa pengaruh pembukaan cabang baru." },
    { label: 'Avg Ticket Size',         value: formatTicketSize(),  trend: hideValues ? '•••%' : '+5.2% YoY', good: true, icon: ShoppingCart, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20', tooltip: "Rata-rata nominal belanja yang dikeluarkan oleh pelanggan dalam satu kali transaksi pembelian di kasir/POS." },
  ]

  const CustomAreaTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
      <div className="bg-slate-900/95 backdrop-blur-md border border-slate-800/80 rounded-2xl p-3.5 shadow-xl text-xs text-slate-350">
        <p className="font-extrabold text-white mb-2">{label}</p>
        <div className="space-y-1.5 border-t border-slate-800/60 pt-2">
          {payload.map((p, i) => {
            const utility = UTILITY_KEYS.find(u => u.label === p.name)
            if (!utility || !visibleUtilities[utility.key]) return null
            return (
              <div key={i} className="flex justify-between items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: p.color }}></span>
                  <span className="text-slate-400 font-semibold">{p.name}:</span>
                </div>
                <span className="text-white font-bold">
                  {hideValues ? '••••' : `${p.value.toFixed(1)} ${currency === 'USD' ? 'M' : 'B'}`}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const CustomBarTooltip = ({ active, payload, isRental = false }) => {
    if (!active || !payload?.length) return null
    const data = payload[0].payload
    return (
      <div className="bg-slate-900/95 backdrop-blur-md border border-slate-800/80 rounded-2xl p-3.5 shadow-xl text-xs text-slate-300">
        <p className="font-extrabold text-white mb-1">{data.brand}</p>
        <div className="space-y-1.5 border-t border-slate-800 pt-2 mt-1">
          <div className="flex justify-between gap-6">
            <span className="text-slate-400 font-semibold">Revenue YTD:</span>
            <span className="text-slate-100 font-bold">{fmt(data.revenue, 'B')}</span>
          </div>
          <div className="flex justify-between gap-6">
            <span className="text-slate-400 font-semibold">Floor Area:</span>
            <span className="text-slate-100 font-bold">{data.sqm} m²</span>
          </div>
          <div className="flex justify-between gap-6 border-t border-slate-800/60 pt-2 mt-1">
            <span className="text-slate-300 font-bold">{isRental ? 'Rental Cost Ratio:' : 'Rev / m²:'}</span>
            <span className="text-white font-black">
              {isRental 
                ? (hideValues ? '•••%' : `${data.rentalPct}%`) 
                : (hideValues 
                    ? (currency === 'USD' ? '$ ••••/m²' : 'IDR •••• jt/m²')
                    : (currency === 'USD' 
                        ? `$${Math.round(data.perSqm * 1_000_000 / 15800).toLocaleString()}/m²` 
                        : `IDR ${data.perSqm.toLocaleString()} jt/m²`
                      )
                  )
              }
            </span>
          </div>
        </div>
      </div>
    )
  }

  const unitStr = currency === 'USD' ? 'USD Million' : 'IDR Billion'

  return (
    <Layout title="Operational Dashboard">

      {/* Operational Diagnostic Insight Banner (Dark Premium Glassmorphism) */}
      <div className="relative overflow-hidden bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-6 shadow-xl shadow-slate-950/20">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl -z-10 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl -z-10 animate-pulse" />
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-500/20 to-emerald-500/20 border border-blue-500/30 text-blue-400 rounded-xl shrink-0">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-white tracking-wide">Operational & Productivity Insight</h4>
            <p className="text-xs text-slate-400 font-semibold leading-relaxed mt-1.5">
              {segment === 'All' && "Produktivitas lantai toko (Revenue/sqm) segmen Retail Luxury memimpin efisiensi operasional dengan Bulgari mencatat rasio sewa (Rental Ratio) terendah di angka 8.5%. Efisiensi utilitas grup terkendali dengan listrik sebagai komponen biaya terbesar."}
              {segment === 'F&B' && "Segmen F&B menunjukkan SSSG yang kuat didorong oleh turnover meja yang lebih cepat selama kuartal ini. Biaya utilitas air dan listrik butuh pengawasan khusus mengingat operasional kitchen yang intensif."}
              {segment === 'Retail' && "Butik retail luxury mempertahankan nilai transaksi tinggi (Avg Ticket Size) yang sehat. Relokasi butik ke area dengan traffic premium terbukti meningkatkan floor area productivity index."}
              {segment === 'Media' && "Efisiensi operasional terfokus pada maksimalisasi billable hours per karyawan kreatif. Utilisasi sarana studio dan internet merupakan komponen utilitas operasional utama."}
            </p>
          </div>
        </div>
      </div>

      {/* Efficiency KPIs Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {efficiencyKpis.map(k => {
          const Icon = k.icon
          return (
            <div key={k.label} className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/50 p-5 shadow-sm hover:-translate-y-1 hover:shadow-lg hover:border-slate-350/80 transition-all duration-300 flex flex-col justify-between cursor-pointer group">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-1.5 min-w-0">
                  <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest leading-none truncate">{k.label}</p>
                  {k.tooltip && (
                    <TooltipProvider delayDuration={100}>
                      <ShadcnTooltip>
                        <TooltipTrigger asChild>
                          <button className="text-slate-400 hover:text-slate-650 transition-colors focus:outline-none">
                            <HelpCircle size={11} className="shrink-0" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-slate-900 border-slate-800 text-white text-xs p-2.5 max-w-[200px] rounded-xl font-bold shadow-xl leading-normal">
                          {k.tooltip}
                        </TooltipContent>
                      </ShadcnTooltip>
                    </TooltipProvider>
                  )}
                </div>
                <div className={`p-2 rounded-xl border transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-inner ${k.color}`}>
                  <Icon size={13} />
                </div>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-2 tabular-nums">{k.value}</p>
                <p className={`text-[10px] font-bold flex items-center gap-1.5 ${k.good ? 'text-emerald-700' : 'text-rose-600'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${k.good ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'} shrink-0`}></span> 
                  {k.trend}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Store Productivity Section */}
      <Section title="Store Productivity by Brand — YTD">
        {isTransitioning ? (
          <div className="space-y-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ChartSkeleton height={320} />
              <ChartSkeleton height={320} />
            </div>
            <ListSkeleton count={6} />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              
              {/* Revenue per m2 Card */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/50 p-5 shadow-sm hover:border-slate-300/80 transition-all duration-300">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <h3 className="font-extrabold text-slate-800 text-sm">Revenue per m²</h3>
                  <TooltipProvider delayDuration={100}>
                    <ShadcnTooltip>
                      <TooltipTrigger asChild>
                        <button className="text-slate-400 hover:text-slate-650 transition-colors focus:outline-none">
                          <HelpCircle size={13} className="shrink-0" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-slate-900 border-slate-800 text-white text-xs p-2.5 max-w-[245px] rounded-xl font-bold shadow-xl leading-normal">
                        Rasio produktivitas lantai toko (floor productivity index) yang mengukur rata-rata pendapatan YTD yang dihasilkan per meter persegi area butik/outlet.
                      </TooltipContent>
                    </ShadcnTooltip>
                  </TooltipProvider>
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-4">Floor area productivity index ({currency === 'USD' ? 'USD / m²' : 'IDR Million / m²'})</p>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={filteredStoreProductivity} layout="vertical" margin={{ top: 4, right: 20, left: 10, bottom: 0 }} barSize={12}>
                    <defs>
                      <linearGradient id="blueBarGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity={0.95} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 650 }} />
                    <YAxis dataKey="brand" type="category" tick={{ fontSize: 9, fill: '#475569', fontWeight: 700 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(148, 163, 184, 0.05)' }} />
                    <Bar dataKey="perSqm" name="Rev/m²" fill="url(#blueBarGrad)" radius={[0,6,6,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Rental Cost Ratio Card */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/50 p-5 shadow-sm hover:border-slate-300/80 transition-all duration-300">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <h3 className="font-extrabold text-slate-800 text-sm">Rental Cost Ratio</h3>
                  <TooltipProvider delayDuration={100}>
                    <ShadcnTooltip>
                      <TooltipTrigger asChild>
                        <button className="text-slate-400 hover:text-slate-650 transition-colors focus:outline-none">
                          <HelpCircle size={13} className="shrink-0" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-slate-900 border-slate-800 text-white text-xs p-2.5 max-w-[245px] rounded-xl font-bold shadow-xl leading-normal">
                        Grafik perbandingan porsi biaya sewa outlet terhadap omset YTD per masing-masing brand individu.
                      </TooltipContent>
                    </ShadcnTooltip>
                  </TooltipProvider>
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-4">Rental expense as percentage of YTD Net Revenue</p>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={filteredStoreProductivity} layout="vertical" margin={{ top: 4, right: 30, left: 10, bottom: 0 }} barSize={12}>
                    <defs>
                      <linearGradient id="orangeBarGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#f97316" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="#ec4899" stopOpacity={0.95} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 650 }} unit="%" domain={[0, 20]} />
                    <YAxis dataKey="brand" type="category" tick={{ fontSize: 9, fill: '#475569', fontWeight: 700 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomBarTooltip isRental={true} />} cursor={{ fill: 'rgba(148, 163, 184, 0.05)' }} />
                    <Bar dataKey="rentalPct" name="Rental %" fill="url(#orangeBarGrad)" radius={[0,6,6,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Store Productivity Table */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-sm overflow-hidden hover:border-slate-300/80 transition-colors duration-300">
              <div className="px-5 py-4 border-b border-slate-200/50 bg-slate-50/20">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-extrabold text-slate-800 text-xs tracking-tight">Productivity Matrix Summary</h4>
                  <TooltipProvider delayDuration={100}>
                    <ShadcnTooltip>
                      <TooltipTrigger asChild>
                        <button className="text-slate-400 hover:text-slate-650 transition-colors focus:outline-none">
                          <HelpCircle size={12} className="shrink-0" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-slate-900 border-slate-800 text-white text-xs p-2.5 max-w-[245px] rounded-xl font-bold shadow-xl leading-normal">
                        Tabel rangkuman matriks produktivitas terpadu yang memetakan floor area, revenue per sqm, dan rasio sewa untuk seluruh brand grup.
                      </TooltipContent>
                    </ShadcnTooltip>
                  </TooltipProvider>
                </div>
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-200/50">
                    <th className="text-left px-5 py-3.5 font-extrabold text-slate-500 uppercase tracking-wider text-[10px]">Brand</th>
                    <th className="text-right px-5 py-3.5 font-extrabold text-slate-500 uppercase tracking-wider text-[10px]">Revenue YTD</th>
                    <th className="text-right px-5 py-3.5 font-extrabold text-slate-500 uppercase tracking-wider text-[10px]">Floor Area</th>
                    <th className="text-right px-5 py-3.5 font-extrabold text-slate-500 uppercase tracking-wider text-[10px]">Rev / m²</th>
                    <th className="text-right px-5 py-3.5 font-extrabold text-slate-500 uppercase tracking-wider text-[10px]">Rental Ratio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/40">
                  {filteredStoreProductivity.map(s => (
                    <tr key={s.brand} className="hover:bg-slate-50/70 transition-colors duration-200">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          {getBrandLogo(s.brand)}
                          <span className="font-extrabold text-slate-800">{s.brand}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-right font-bold text-slate-700">{fmt(s.revenue, 'B')}</td>
                      <td className="px-5 py-3.5 text-right font-bold text-slate-500">
                        <span className="bg-slate-105 bg-slate-100/70 px-2.5 py-0.5 rounded-full text-[10px] text-slate-600 font-extrabold border border-slate-200/40">
                          {s.sqm} m²
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right font-black text-slate-900">
                        {hideValues 
                          ? (currency === 'USD' ? '$ ••••/m²' : 'IDR •••• jt/m²')
                          : (currency === 'USD' ? `$${Math.round(s.perSqm * 1_000_000 / 15800).toLocaleString()}/m²` : `IDR ${s.perSqm.toLocaleString()} jt/m²`)
                        }
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${
                          s.rentalPct <= 10 ? 'bg-emerald-50 text-emerald-600 border-emerald-100/55' :
                          s.rentalPct <= 13 ? 'bg-amber-50 text-amber-600 border-amber-100/55' :
                          'bg-rose-50 text-rose-600 border-rose-100/55'
                        }`}>
                          {hideValues ? '•••%' : `${s.rentalPct}%`}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Section>

      {/* Utilities Section */}
      <Section title="Utilities Cost Monitoring">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-800/60 p-5 shadow-sm hover:border-slate-350 dark:hover:border-slate-700 transition-all duration-300">
          
          {/* Header Area */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base">Monthly Utilities Cost</h3>
                <TooltipProvider delayDuration={100}>
                  <ShadcnTooltip>
                    <TooltipTrigger asChild>
                      <button className="text-slate-400 hover:text-slate-650 dark:hover:text-slate-200 transition-colors focus:outline-none">
                        <HelpCircle size={14} className="shrink-0" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-slate-900 border-slate-800 text-white text-xs p-2.5 max-w-[245px] rounded-xl font-bold shadow-xl leading-normal">
                      Grafik tren bulanan pengeluaran utilitas operasional yang dirinci per kategori (Listrik, Air, Gas, Internet/Konektivitas, Central AC, Kebersihan).
                    </TooltipContent>
                  </ShadcnTooltip>
                </TooltipProvider>
              </div>
              <p className="text-[11px] text-slate-400 font-semibold">Breakdown of operational utility expenses — {currency === 'USD' ? 'USD Million' : 'IDR Billion'}</p>
            </div>
          </div>

          {/* Interactive Toggle Buttons / Tabs with Animations */}
          <div className="flex flex-wrap gap-2.5 mb-6">
            {UTILITY_KEYS.map(u => {
              const Icon = u.icon
              const isVisible = visibleUtilities[u.key]
              return (
                <button
                  key={u.key}
                  onClick={() => toggleUtility(u.key)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-[11px] font-extrabold transition-all duration-300 transform active:scale-95 cursor-pointer ${
                    isVisible
                      ? `${u.bgClass} shadow-md shadow-slate-100/50 dark:shadow-none border-current`
                      : 'bg-white dark:bg-slate-950 border-slate-200/60 dark:border-slate-800/40 text-slate-400 dark:text-slate-500 opacity-60 hover:opacity-85'
                  }`}
                >
                  <Icon size={12} style={{ color: isVisible ? u.color : undefined }} />
                  <span>{u.label}</span>
                </button>
              )
            })}
          </div>

          {/* Area Chart Container */}
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={dynamicUtilities} margin={{ top: 4, right: 8, left: -22, bottom: 0 }}>
              <defs>
                <linearGradient id="colorElec" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorWater" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorGas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorAC" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorWaste" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" dark:stroke="#1e293b" />
              <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 650 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 650 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomAreaTooltip />} />
              
              <Area 
                type="monotone" 
                dataKey="electricity" 
                name="Listrik" 
                stroke="#f43f5e" 
                fill="url(#colorElec)" 
                strokeWidth={2.5} 
                dot={{ r: 3, strokeWidth: 1.5, fill: '#fff' }}
                activeDot={{ r: 5, strokeWidth: 2, fill: '#fff' }}
                strokeOpacity={visibleUtilities.electricity ? 1 : 0}
                fillOpacity={visibleUtilities.electricity ? 0.08 : 0}
                isAnimationActive={true}
              />
              <Area 
                type="monotone" 
                dataKey="water" 
                name="Air" 
                stroke="#3b82f6" 
                fill="url(#colorWater)" 
                strokeWidth={2.5} 
                dot={{ r: 3, strokeWidth: 1.5, fill: '#fff' }}
                activeDot={{ r: 5, strokeWidth: 2, fill: '#fff' }}
                strokeOpacity={visibleUtilities.water ? 1 : 0}
                fillOpacity={visibleUtilities.water ? 0.08 : 0}
                isAnimationActive={true}
              />
              <Area 
                type="monotone" 
                dataKey="gas" 
                name="Gas" 
                stroke="#f59e0b" 
                fill="url(#colorGas)" 
                strokeWidth={2.5} 
                dot={{ r: 3, strokeWidth: 1.5, fill: '#fff' }}
                activeDot={{ r: 5, strokeWidth: 2, fill: '#fff' }}
                strokeOpacity={visibleUtilities.gas ? 1 : 0}
                fillOpacity={visibleUtilities.gas ? 0.08 : 0}
                isAnimationActive={true}
              />
              <Area 
                type="monotone" 
                dataKey="internet" 
                name="Konektivitas" 
                stroke="#10b981" 
                fill="url(#colorNet)" 
                strokeWidth={2.5} 
                dot={{ r: 3, strokeWidth: 1.5, fill: '#fff' }}
                activeDot={{ r: 5, strokeWidth: 2, fill: '#fff' }}
                strokeOpacity={visibleUtilities.internet ? 1 : 0}
                fillOpacity={visibleUtilities.internet ? 0.08 : 0}
                isAnimationActive={true}
              />
              <Area 
                type="monotone" 
                dataKey="acSentral" 
                name="Central AC" 
                stroke="#0ea5e9" 
                fill="url(#colorAC)" 
                strokeWidth={2.5} 
                dot={{ r: 3, strokeWidth: 1.5, fill: '#fff' }}
                activeDot={{ r: 5, strokeWidth: 2, fill: '#fff' }}
                strokeOpacity={visibleUtilities.acSentral ? 1 : 0}
                fillOpacity={visibleUtilities.acSentral ? 0.08 : 0}
                isAnimationActive={true}
              />
              <Area 
                type="monotone" 
                dataKey="wasteCleaning" 
                name="Kebersihan" 
                stroke="#8b5cf6" 
                fill="url(#colorWaste)" 
                strokeWidth={2.5} 
                dot={{ r: 3, strokeWidth: 1.5, fill: '#fff' }}
                activeDot={{ r: 5, strokeWidth: 2, fill: '#fff' }}
                strokeOpacity={visibleUtilities.wasteCleaning ? 1 : 0}
                fillOpacity={visibleUtilities.wasteCleaning ? 0.08 : 0}
                isAnimationActive={true}
              />
            </AreaChart>
          </ResponsiveContainer>

          {/* Cards Grid at the Bottom */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mt-6">
            {UTILITY_KEYS.map(u => {
              const Icon = u.icon
              const isVisible = visibleUtilities[u.key]
              const currentVal = selectedMonthData[u.key]
              const prevVal = previousMonthData ? previousMonthData[u.key] : null
              const pctChange = prevVal ? ((currentVal - prevVal) / prevVal) * 100 : 0
              const isIncrease = pctChange >= 0

              // Hover border style map
              const hoverBorders = {
                electricity: 'hover:border-rose-450 dark:hover:border-rose-700/60',
                water: 'hover:border-blue-450 dark:hover:border-blue-700/60',
                gas: 'hover:border-amber-450 dark:hover:border-amber-700/60',
                internet: 'hover:border-emerald-450 dark:hover:border-emerald-700/60',
                acSentral: 'hover:border-sky-450 dark:hover:border-sky-700/60',
                wasteCleaning: 'hover:border-teal-450 dark:hover:border-teal-700/60',
              }

              return (
                <div
                  key={u.key}
                  onClick={() => setSelectedUtility(u)}
                  className={`bg-white dark:bg-slate-900 border rounded-2xl p-4 shadow-xl shadow-slate-100/30 dark:shadow-none hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-100/50 dark:hover:shadow-none transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden group ${
                    isVisible
                      ? 'border-slate-150/70 dark:border-slate-800/80'
                      : 'border-slate-100 dark:border-slate-850/50 opacity-60'
                  } ${hoverBorders[u.key]}`}
                >
                  {/* Visual clue for click/drilldown */}
                  <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 opacity-60 group-hover:bg-blue-500 group-hover:scale-125 dark:group-hover:bg-blue-400 transition-all duration-300" />
                  
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                      isVisible ? u.iconBgClass : 'bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-800'
                    }`}>
                      <Icon size={14} style={{ color: isVisible ? u.color : undefined }} />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                        {u.label}
                      </span>
                      <div className="flex items-baseline gap-0.5 mt-0.5">
                        <span className="text-base font-black text-slate-800 dark:text-slate-100 leading-none">
                          {hideValues ? '•••' : currentVal.toFixed(1)}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500">
                          {currency === 'USD' ? 'M' : 'B'}
                        </span>
                      </div>
                      <span className={`text-[9.5px] font-bold block mt-1 tracking-tight truncate ${
                        isIncrease ? 'text-rose-500' : 'text-emerald-500'
                      }`}>
                        {isIncrease ? '↗' : '↘'} {Math.abs(pctChange).toFixed(1)}% vs {previousMonthData ? previousMonthData.month : 'prev'}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      </Section>

      {/* Utility Drill-down Dialog */}
      <Dialog open={selectedUtility !== null} onOpenChange={(open) => !open && setSelectedUtility(null)}>
        <DialogContent className="max-w-md bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-2xl p-6 rounded-2xl outline-none">
          {selectedUtility && (() => {
            const currentVal = selectedMonthData[selectedUtility.key]
            const prevVal = previousMonthData ? previousMonthData[selectedUtility.key] : null
            const pctChange = prevVal ? ((currentVal - prevVal) / prevVal) * 100 : 0
            const isIncrease = pctChange >= 0

            // Generate realistic branch details
            const branches = [
              { name: 'Bulgari - Plaza Indonesia', weight: 0.18, segment: 'Retail' },
              { name: 'Bulgari - Plaza Senayan', weight: 0.12, segment: 'Retail' },
              { name: 'Omega - Plaza Senayan', weight: 0.15, segment: 'Retail' },
              { name: 'Häagen-Dazs - Senayan City', weight: 0.16, segment: 'F&B' },
              { name: 'Häagen-Dazs - Grand Indonesia', weight: 0.19, segment: 'F&B' },
              { name: 'Hard Rock Cafe - Kuta Beach', weight: 0.20, segment: 'F&B' },
            ].filter(b => segment === 'All' || b.segment === segment)

            // Normalize weights
            const totalWeight = branches.reduce((sum, b) => sum + b.weight, 0)
            const normalizedBranches = branches.map(b => ({
              ...b,
              value: (b.weight / (totalWeight || 1)) * currentVal
            }))

            return (
              <>
                <DialogHeader className="mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <DialogTitle className="text-xl font-black text-slate-950 dark:text-slate-50 tracking-tight flex items-center gap-2">
                        <selectedUtility.icon size={20} style={{ color: selectedUtility.color }} />
                        <span>Detail Biaya {selectedUtility.label}</span>
                      </DialogTitle>
                      <DialogDescription className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-1">
                        Breakdown outlet/cabang bulan {selectedMonth} {selectedYear}
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>

                {/* Summary Info */}
                <div className="bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800/80 p-4 rounded-xl mb-4 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-wider block">Total Pengeluaran</span>
                    <span className="text-xl font-black text-slate-800 dark:text-slate-100 tabular-nums">
                      {hideValues ? '••••' : `${currentVal.toFixed(1)} ${currency === 'USD' ? 'M' : 'B'}`}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-wider block">Tren Bulanan</span>
                    <span className={`text-xs font-black px-2 py-0.5 rounded-full border ${
                      isIncrease 
                        ? 'bg-rose-50 text-rose-650 border-rose-100/60 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30' 
                        : 'bg-emerald-50 text-emerald-650 border-emerald-100/60 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30'
                    }`}>
                      {isIncrease ? '↗' : '↘'} {Math.abs(pctChange).toFixed(1)}% vs {previousMonthData ? previousMonthData.month : 'prev'}
                    </span>
                  </div>
                </div>

                {/* Branch Details List */}
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  <h4 className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest mb-1">Breakdown Per Cabang</h4>
                  <div className="border border-slate-100 dark:border-slate-800/60 rounded-xl divide-y divide-slate-100 dark:divide-slate-800/60 overflow-hidden bg-slate-50/20 dark:bg-slate-900/20">
                    {normalizedBranches.map((b, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 hover:bg-slate-100/30 dark:hover:bg-slate-800/20 transition-colors">
                        <div>
                          <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block">{b.name}</span>
                          <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase">{b.segment}</span>
                        </div>
                        <span className="text-xs font-black text-slate-850 dark:text-slate-100 tabular-nums">
                          {hideValues ? '••••' : `${b.value.toFixed(2)} ${currency === 'USD' ? 'M' : 'B'}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )
          })()}
        </DialogContent>
      </Dialog>
    </Layout>
  )
}
