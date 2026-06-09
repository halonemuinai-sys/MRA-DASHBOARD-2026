import { useState, useMemo } from 'react'
import Layout from '../components/layout/Layout'
import KpiCard from '../components/KpiCard'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer,
  LineChart, Line, Tooltip
} from 'recharts'
import { useApp } from '../context/AppContext'
import { 
  Building2, Car, Monitor, Package, Hammer, HelpCircle, 
  DollarSign, TrendingUp, AlertCircle, FileText, CheckCircle, 
  Clock, Activity, Star, ClipboardList, Settings, ShieldAlert,
  Search, SlidersHorizontal
} from 'lucide-react'
import { Tooltip as ShadcnTooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  gaDetailedAssets,
  gaDetailedVehicles,
  gaDetailedRentals,
  gaDetailedInsurances
} from '../data/gaDetailedData'

export default function GA() {
  const [activeSubTab, setActiveSubTab] = useState('overview')
  const [vendorSearch, setVendorSearch] = useState('')
  const [expenseSearch, setExpenseSearch] = useState('')
  const [prSearch, setPrSearch] = useState('')
  const [activeDetailCategory, setActiveDetailCategory] = useState('assets')
  const [detailSearch, setDetailSearch] = useState('')

  const {
    filteredGaAssets,
    filteredGaOpexLedger,
    filteredGaSlaTrend,
    scaleRatio,
    fmt,
    currency,
    segment
  } = useApp()

  const fmtB = v => fmt(v, 'B')
  const unitStr = currency === 'USD' ? 'USD Million' : 'IDR Billion'

  // Dynamic calculations for Assets & Operations
  const totalAssetValueVal = filteredGaAssets.reduce((a, b) => a + b.value, 0)
  const totalAssetUnitCount = filteredGaAssets.reduce((a, b) => a + b.count, 0)
  const avgAssetUtilization = Math.round(filteredGaAssets.reduce((a, b) => a + b.utilized, 0) / filteredGaAssets.length)

  // Dynamic Vendor compliance calculation
  const baseVendors = [
    { category: 'Cleaning Service',    total: 8,  active: 7,  compliant: 6,  sla: 94.2, rating: 4.6 },
    { category: 'Security Services',   total: 4,  active: 4,  compliant: 4,  sla: 98.5, rating: 4.9 },
    { category: 'IT Maintenance',      total: 12, active: 10, compliant: 9,  sla: 92.0, rating: 4.4 },
    { category: 'Building Engineering',total: 6,  active: 5,  compliant: 5,  sla: 96.0, rating: 4.7 },
    { category: 'Corporate Fleet',     total: 5,  active: 5,  compliant: 4,  sla: 89.5, rating: 4.2 },
    { category: 'Catering Services',   total: 3,  active: 3,  compliant: 3,  sla: 95.0, rating: 4.8 },
  ]

  const dynamicVendor = useMemo(() => {
    return baseVendors.map(v => ({
      ...v,
      total: Math.max(1, Math.round(v.total * scaleRatio)),
      active: Math.max(1, Math.round(v.active * scaleRatio)),
      compliant: Math.max(0, Math.round(v.compliant * scaleRatio)),
    }))
  }, [scaleRatio])

  const filteredVendors = useMemo(() => {
    return dynamicVendor.filter(v => 
      v.category.toLowerCase().includes(vendorSearch.toLowerCase())
    )
  }, [dynamicVendor, vendorSearch])

  // Purchase Requests calculations
  const basePurchaseRequests = [
    { dept: 'Operations',  submitted: 48, completed: 38, avgSlaDays: 3.5 },
    { dept: 'Marketing',   submitted: 22, completed: 18, avgSlaDays: 4.2 },
    { dept: 'IT',          submitted: 35, completed: 30, avgSlaDays: 2.8 },
    { dept: 'HR',          submitted: 15, completed: 14, avgSlaDays: 3.0 },
    { dept: 'Finance',     submitted: 10, completed: 9,  avgSlaDays: 2.5 },
  ]

  const dynamicPurchase = useMemo(() => {
    return basePurchaseRequests.map(r => ({
      ...r,
      submitted: Math.max(1, Math.round(r.submitted * scaleRatio)),
      completed: Math.max(1, Math.round(r.completed * scaleRatio)),
    }))
  }, [scaleRatio])

  const filteredPrs = useMemo(() => {
    return dynamicPurchase.filter(p => 
      p.dept.toLowerCase().includes(prSearch.toLowerCase())
    )
  }, [dynamicPurchase, prSearch])

  // SLA calculation for PR/SR
  const totalPrSubmitted = filteredPrs.reduce((a, b) => a + b.submitted, 0)
  const totalPrCompleted = filteredPrs.reduce((a, b) => a + b.completed, 0)
  const overallPrCompletionRate = totalPrSubmitted > 0 ? Math.round((totalPrCompleted / totalPrSubmitted) * 100) : 0

  // G&A Expenses calculations
  const totalGaActual = filteredGaOpexLedger.reduce((sum, r) => sum + r.actual, 0)
  const totalGaBudget = filteredGaOpexLedger.reduce((sum, r) => sum + r.budget, 0)
  const gaUtilization = totalGaBudget > 0 ? Math.round((totalGaActual / totalGaBudget) * 100) : 0
  const gaVariance = totalGaActual - totalGaBudget
  const isGaUnderBudget = gaVariance <= 0

  // Sort and pick top categories for bar chart
  const topGaCategories = useMemo(() => {
    return [...filteredGaOpexLedger]
      .sort((a, b) => b.actual - a.actual)
      .slice(0, 7)
      .map(o => ({
        name: o.category.split(' ')[0],
        fullName: o.category,
        Actual: o.actual,
        Budget: o.budget
      }))
  }, [filteredGaOpexLedger])

  const filteredExpenses = useMemo(() => {
    return filteredGaOpexLedger.filter(e => 
      e.category.toLowerCase().includes(expenseSearch.toLowerCase())
    )
  }, [filteredGaOpexLedger, expenseSearch])

  const assetIcons = [Building2, Car, Monitor, Package, Hammer]

  // Recharts Custom Tooltip
  const CustomChartTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
      <div className="bg-white/95 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-3.5 shadow-xl text-xs font-bold text-slate-800 space-y-1.5">
        <p className="font-extrabold text-slate-500 uppercase tracking-wider text-[10px]">{label}</p>
        {payload.map((p, i) => (
          <div key={i} className="flex justify-between items-center gap-6">
            <span className="font-semibold" style={{ color: p.color }}>{p.name}:</span>
            <span>{fmt(p.value, 'B')}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <Layout title="General Affairs Dashboard">

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
            Assets & Operations
          </button>
          <button
            onClick={() => setActiveSubTab('ga_expenses')}
            className={`px-4 py-2 text-xs font-extrabold rounded-lg transition-all duration-300 ${
              activeSubTab === 'ga_expenses'
                ? 'bg-gradient-to-r from-blue-700 to-blue-500 dark:from-blue-600 dark:to-blue-400 text-white shadow-md shadow-blue-500/10'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            G&A Expenses Ledger ({filteredGaOpexLedger.length})
          </button>
          <button
            onClick={() => setActiveSubTab('ga_details')}
            className={`px-4 py-2 text-xs font-extrabold rounded-lg transition-all duration-300 ${
              activeSubTab === 'ga_details'
                ? 'bg-gradient-to-r from-blue-700 to-blue-500 dark:from-blue-600 dark:to-blue-400 text-white shadow-md shadow-blue-500/10'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Inventory & Fleet Ledger
          </button>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Segment</p>
          <p className="text-xs font-bold text-slate-700 mt-0.5">
            {segment === 'All' ? 'Consolidated Group' : `Segment: ${segment}`}
          </p>
        </div>
      </div>

      {activeSubTab === 'overview' && (
        <>
          {/* GA Operational Diagnostic Banner */}
          <div className="bg-gradient-to-r from-amber-500/5 to-blue-500/5 border border-slate-100 rounded-2xl p-4 mb-6 shadow-sm flex items-start gap-3.5">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">GA Asset & Operations Diagnostic</h4>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-0.5">
                {segment === 'All' && "Inventarisasi aset holding terpantau sehat pada tingkat utilisasi rata-rata 86.4%. SLA pengerjaan Purchase Request (PR) terbaik dipimpin oleh tim IT (2.8 hari), sementara pemeliharaan fasilitas gedung ritel menunjukkan tingkat kepatuhan vendor (Vendor Compliance) di level optimal 96.0%."}
                {segment === 'F&B' && "Fokus GA F&B berada pada peremajaan Mesin & Peralatan kitchen (utilisasi 78%). SLA tanggapan kerusakan alat saji gerai dipercepat untuk menjaga standar kepuasan pelanggan."}
                {segment === 'Retail' && "Ritel luxury menuntut utilisasi aset properti (butik) maksimal. Kepatuhan vendor keamanan (Security) mencapai 100% untuk menjaga integritas barang butik premium."}
                {segment === 'Media' && "Aset IT Equipment (utilisasi 95%) mendominasi kebutuhan GA Media untuk mendukung kelancaran studio digital dan server publikasi."}
              </p>
            </div>
          </div>

          {/* Asset Summary KPIs Row */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            {filteredGaAssets.map((a, i) => {
              const Icon = assetIcons[i % assetIcons.length]
              return (
                <div key={a.category} className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-100 p-5 shadow-xl shadow-slate-100/40 hover:-translate-y-1 transform duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8.5 h-8.5 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-100/40">
                      <Icon size={14} className="text-amber-600" />
                    </div>
                    <span className="text-[10px] font-extrabold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md">
                      {a.count.toLocaleString()} U
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide leading-tight">{a.category}</p>
                    <TooltipProvider delayDuration={100}>
                      <ShadcnTooltip>
                        <TooltipTrigger asChild>
                          <button className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none">
                            <HelpCircle size={10} className="shrink-0" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-slate-900 border-slate-800 text-white text-xs p-2.5 max-w-[200px] rounded-xl font-bold shadow-xl leading-normal">
                          {`Nilai buku valuasi aset holding terdaftar dan tingkat utilisasi operasional harian untuk kategori ${a.category}.`}
                        </TooltipContent>
                      </ShadcnTooltip>
                    </TooltipProvider>
                  </div>
                  <p className="text-xl font-extrabold text-slate-900 mt-1">{fmt(a.value, 'B')}</p>
                  
                  <div className="mt-3.5">
                    <div className="flex justify-between text-[10px] mb-1 font-bold">
                      <span className="text-slate-400">Utilisasi</span>
                      <span className={`${a.utilized >= 90 ? 'text-emerald-600' : a.utilized >= 75 ? 'text-amber-600' : 'text-rose-500'}`}>
                        {a.utilized}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1">
                      <div
                        className="h-1 rounded-full transition-all duration-500"
                        style={{
                          width: `${a.utilized}%`,
                          background: a.utilized >= 90 ? '#10b981' : a.utilized >= 75 ? '#f59e0b' : '#ef4444'
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Valuation Overview Panel */}
          <div className="bg-slate-950 border border-slate-900 text-white rounded-2xl p-5 grid grid-cols-3 gap-6 shadow-xl shadow-slate-950/20 relative overflow-hidden mb-6">
            <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/5 rounded-full blur-3xl" />
            <div>
              <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest">Total Assets Valuation</p>
              <p className="text-2xl font-black text-amber-400 leading-none mt-1.5">{fmt(totalAssetValueVal, 'B')}</p>
            </div>
            <div className="border-l border-slate-800 pl-6">
              <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest">Total Units Monitored</p>
              <p className="text-2xl font-black text-white leading-none mt-1.5">{totalAssetUnitCount.toLocaleString()}</p>
            </div>
            <div className="border-l border-slate-800 pl-6">
              <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest">Avg Utilization Rate</p>
              <p className="text-2xl font-black text-emerald-400 leading-none mt-1.5">{avgAssetUtilization}%</p>
            </div>
          </div>

          {/* Real-time Stock Opname Audit Session Panel */}
          <div className="bg-gradient-to-r from-blue-600/90 to-blue-800/90 text-white rounded-2xl p-5 shadow-xl shadow-blue-900/10 mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="bg-amber-400 text-slate-950 text-[9px] font-extrabold px-2 py-0.5 rounded-full tracking-wide">
                    SO AUDIT IN-PROGRESS
                  </span>
                  <span className="text-[10px] text-blue-200 font-bold">Live Sync from Supabase</span>
                </div>
                <h3 className="text-sm font-black tracking-tight mt-1">
                  SO Asset PT Rahayu Arumdhani International (Periode 18-21 Mei 2026)
                </h3>
                <p className="text-xs text-blue-100 font-medium">
                  Audit fisik aset digital menggunakan pemindaian QR/Barcode untuk penegakan Good Corporate Governance.
                </p>
              </div>

              {/* Progress Bar & Stats */}
              <div className="w-full md:w-72 space-y-1.5 bg-white/5 border border-white/10 p-3 rounded-xl backdrop-blur-sm">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-blue-200 text-[10px]">Progress Audit: 1 / 381 Aset</span>
                  <span className="text-amber-300">0.3%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="h-2 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300" style={{ width: '0.3%' }}></div>
                </div>
                <div className="flex justify-between text-[9px] text-blue-200 font-semibold pt-1">
                  <span>Ditemukan: 1</span>
                  <span>Menunggu Scan: 380</span>
                  <span>Hilang: 0</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Purchase & Service Requests (PR/SR) */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100 p-5 shadow-xl shadow-slate-100/40">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <h3 className="font-bold text-slate-800 text-sm">PR/SR Pipeline by Department</h3>
                    <TooltipProvider delayDuration={100}>
                      <ShadcnTooltip>
                        <TooltipTrigger asChild>
                          <button className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none">
                            <HelpCircle size={13} className="shrink-0" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-slate-900 border-slate-800 text-white text-xs p-2.5 max-w-[245px] rounded-xl font-bold shadow-xl leading-normal">
                          Mengukur jumlah permintaan belanja (Purchase) dan servis fasilitas (Service Requests) yang diajukan oleh masing-masing departemen serta volume penyelesaiannya.
                        </TooltipContent>
                      </ShadcnTooltip>
                    </TooltipProvider>
                  </div>
                  <p className="text-xs text-slate-400 font-medium">Monitoring request submission vs completion status</p>
                </div>
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 px-2.5 py-0.5 rounded-lg text-[10px] font-black shrink-0">
                  Rate: {overallPrCompletionRate}%
                </div>
              </div>

              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={filteredPrs} margin={{ top: 4, right: 8, left: -22, bottom: 0 }} barSize={10} barGap={3}>
                  <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="dept" tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 500 }} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(v) => [v, 'Requests']} />
                  <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 9, color: '#64748b', fontWeight: 650 }} />
                  <Bar dataKey="submitted" name="Submitted" fill="#cbd5e1" radius={[3,3,0,0]} />
                  <Bar dataKey="completed" name="Completed" fill="#10b981" radius={[3,3,0,0]} />
                </BarChart>
              </ResponsiveContainer>

              {/* PR/SR Search & Table */}
              <div className="mt-5 border-t border-slate-100 pt-4">
                <div className="relative mb-3">
                  <input
                    type="text"
                    placeholder="Cari departemen..."
                    value={prSearch}
                    onChange={(e) => setPrSearch(e.target.value)}
                    className="w-full text-[11px] bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-4 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium transition-all"
                  />
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2 text-slate-400" />
                </div>
                <div className="overflow-x-auto max-h-[140px] scrollbar-thin">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-slate-500">
                        <th className="text-left px-3 py-2 font-bold text-[9px] uppercase tracking-wider">Department</th>
                        <th className="text-center px-2 py-2 font-bold text-[9px] uppercase tracking-wider">Submitted</th>
                        <th className="text-center px-2 py-2 font-bold text-[9px] uppercase tracking-wider">Completed</th>
                        <th className="text-center px-2 py-2 font-bold text-[9px] uppercase tracking-wider">SLA Avg</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredPrs.map(p => (
                        <tr key={p.dept} className="hover:bg-slate-50 transition-colors">
                          <td className="px-3 py-2 font-bold text-slate-700">{p.dept}</td>
                          <td className="px-2 py-2 text-center text-slate-500 font-semibold">{p.submitted}</td>
                          <td className="px-2 py-2 text-center text-emerald-600 font-bold">{p.completed}</td>
                          <td className="px-2 py-2 text-center font-bold text-slate-700">{p.avgSlaDays} days</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Vendor Administration */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100 p-5 shadow-xl shadow-slate-100/40">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <h3 className="font-bold text-slate-800 text-sm">Vendor Administration</h3>
                    <TooltipProvider delayDuration={100}>
                      <ShadcnTooltip>
                        <TooltipTrigger asChild>
                          <button className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none">
                            <HelpCircle size={13} className="shrink-0" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-slate-900 border-slate-800 text-white text-xs p-2.5 max-w-[245px] rounded-xl font-bold shadow-xl leading-normal">
                          Daftar kepatuhan vendor jasa operasional harian perusahaan. Status Compliant diperoleh jika vendor memenuhi SLA dan kualifikasi legal berkala.
                        </TooltipContent>
                      </ShadcnTooltip>
                    </TooltipProvider>
                  </div>
                  <p className="text-xs text-slate-400 font-medium">Compliance matrix and service partner ratings</p>
                </div>
              </div>

              <div className="relative mb-3">
                <input
                  type="text"
                  placeholder="Cari kategori vendor..."
                  value={vendorSearch}
                  onChange={(e) => setVendorSearch(e.target.value)}
                  className="w-full text-[11px] bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-4 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium transition-all"
                />
                <Search className="w-3.5 h-3.5 absolute left-3 top-2 text-slate-400" />
              </div>

              <div className="overflow-x-auto max-h-[265px] scrollbar-thin">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-500">
                      <th className="text-left px-3 py-2 font-bold text-[9px] uppercase tracking-wider">Category</th>
                      <th className="text-center px-2 py-2 font-bold text-[9px] uppercase tracking-wider">Act / Tot</th>
                      <th className="text-center px-2 py-2 font-bold text-[9px] uppercase tracking-wider">Compliant</th>
                      <th className="text-center px-2 py-2 font-bold text-[9px] uppercase tracking-wider">SLA</th>
                      <th className="text-right px-3 py-2 font-bold text-[9px] uppercase tracking-wider">Rating</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredVendors.map(v => (
                      <tr key={v.category} className="hover:bg-slate-50 transition-colors">
                        <td className="px-3 py-2.5 font-bold text-slate-700">{v.category}</td>
                        <td className="px-2 py-2.5 text-center text-slate-500 font-semibold">{v.active}/{v.total}</td>
                        <td className="px-2 py-2.5 text-center">
                          <span className={`px-2 py-0.5 rounded text-[9.5px] font-black border ${
                            v.compliant === v.active 
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                              : 'bg-amber-50 text-amber-600 border-amber-100'
                          }`}>
                            {v.compliant}/{v.active}
                          </span>
                        </td>
                        <td className="px-2 py-2.5 text-center font-bold text-slate-700">{v.sla}%</td>
                        <td className="px-3 py-2.5 text-right font-bold text-amber-500">
                          <span className="flex items-center justify-end gap-1 font-black">
                            <Star size={10} fill="currentColor" /> {v.rating}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      {activeSubTab === 'ga_expenses' && (
        <>
          {/* GA Financial Diagnostic Banner */}
          <div className="bg-gradient-to-r from-blue-500/5 to-sky-500/5 border border-slate-100 rounded-2xl p-4.5 mb-6 shadow-sm flex items-start gap-4">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <ClipboardList className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">General & Administration Budget Monitoring</h4>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-1">
                {`Total anggaran pengeluaran administrasi (G&A OPEX) YTD terealisasi sebesar ${fmtB(totalGaActual)} dengan tingkat penyerapan anggaran ${gaUtilization}% terhadap target budget. Pos pengeluaran G&A terbesar dialokasikan untuk ${currency === 'USD' ? 'Rental Expenses' : 'Biaya Sewa Tempat'} butik ritel dan outlet F&B.`}
              </p>
            </div>
          </div>

          {/* G&A KPIs Row */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <KpiCard 
              label="Total G&A Actual YTD" 
              value={fmtB(totalGaActual)} 
              sub={`Target Budget: ${fmtB(totalGaBudget)}`} 
              color="blue" 
              icon={DollarSign} 
              tooltip="Total realisasi nominal pengeluaran umum & administrasi (G&A) sepanjang tahun berjalan YTD."
            />
            <KpiCard 
              label="Budget Utilization" 
              value={`${gaUtilization}%`} 
              sub="Penyerapan dari total pagu" 
              color="green" 
              icon={TrendingUp} 
              tooltip="Rasio persentase realisasi belanja G&A aktual terhadap alokasi anggaran belanja yang disetujui."
            />
            <KpiCard 
              label="Budget Variance" 
              value={fmtB(Math.abs(gaVariance))} 
              sub={isGaUnderBudget ? "Di bawah budget (Saving)" : "Melebihi budget (Overrun)"} 
              color={isGaUnderBudget ? "teal" : "rose"} 
              icon={AlertCircle} 
              tooltip="Selisih antara anggaran belanja (Budget) dan pengeluaran riil (Actual). Nilai minus/saving menunjukkan efisiensi anggaran."
            />
            <KpiCard 
              label="Overall SLA Resolution" 
              value="3.3 days" 
              sub="Avg turnaround time YTD" 
              color="blue" 
              icon={Clock} 
              tooltip="Rata-rata durasi waktu penyelesaian (SLA) dari pengajuan PR/SR hingga diselesaikan secara fisik oleh General Affairs."
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Top G&A Categories Chart */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100 p-5 shadow-xl shadow-slate-100/40">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <h3 className="font-bold text-slate-800 text-sm">Top G&A Expenses Breakdown</h3>
                    <TooltipProvider delayDuration={100}>
                      <ShadcnTooltip>
                        <TooltipTrigger asChild>
                          <button className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none">
                            <HelpCircle size={13} className="shrink-0" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-slate-900 border-slate-800 text-white text-xs p-2.5 max-w-[245px] rounded-xl font-bold shadow-xl leading-normal">
                          Perbandingan 7 pos biaya administrasi terbesar holding antara pagu anggaran (Budget) terhadap realisasi riil (Actual).
                        </TooltipContent>
                      </ShadcnTooltip>
                    </TooltipProvider>
                  </div>
                  <p className="text-xs text-slate-400 font-medium">Top 7 expense categories comparing Actual vs Budget — {unitStr}</p>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={210}>
                <BarChart data={topGaCategories} margin={{ top: 4, right: 8, left: -22, bottom: 0 }} barGap={2} barSize={10}>
                  <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 500 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 9, color: '#64748b', fontWeight: 650, paddingTop: 10 }} />
                  <Bar dataKey="Budget" fill="#cbd5e1" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Actual" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* SLA Response Time Trend Chart */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100 p-5 shadow-xl shadow-slate-100/40">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <h3 className="font-bold text-slate-800 text-sm">GA SLA Response Time Trend</h3>
                    <TooltipProvider delayDuration={100}>
                      <ShadcnTooltip>
                        <TooltipTrigger asChild>
                          <button className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none">
                            <HelpCircle size={13} className="shrink-0" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-slate-900 border-slate-800 text-white text-xs p-2.5 max-w-[245px] rounded-xl font-bold shadow-xl leading-normal">
                          Tren rata-rata penyelesaian permintaan layanan operasional dalam satuan hari kerja untuk memantau produktivitas kerja GA.
                        </TooltipContent>
                      </ShadcnTooltip>
                    </TooltipProvider>
                  </div>
                  <p className="text-xs text-slate-400 font-medium">Average turnaround time (SLA) in days per month</p>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={210}>
                <LineChart data={filteredGaSlaTrend} margin={{ top: 8, right: 12, left: -22, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 650 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 650 }} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(v) => [`${v} days`, 'Avg SLA']} />
                  <Line type="monotone" dataKey="slaDays" name="Avg SLA Days" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 3, strokeWidth: 1.5, fill: '#fff' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* G&A Ledger Detail Table */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-xl shadow-slate-100/40 overflow-hidden mb-6">
            <div className="px-5 py-4.5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white/50">
              <div>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <h3 className="font-bold text-slate-800 text-sm">G&A Expense Budget Control Ledger</h3>
                  <TooltipProvider delayDuration={100}>
                    <ShadcnTooltip>
                      <TooltipTrigger asChild>
                        <button className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none">
                          <HelpCircle size={13} className="shrink-0" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-slate-900 border-slate-800 text-white text-xs p-2.5 max-w-[245px] rounded-xl font-bold shadow-xl leading-normal">
                        Rincian varians alokasi budget dan realisasi biaya administrasi untuk seluruh 27 sub-kategori guna pengawasan menyeluruh.
                      </TooltipContent>
                    </ShadcnTooltip>
                  </TooltipProvider>
                </div>
                <p className="text-xs text-slate-400 font-medium">Variance analysis of actual spending vs allocated YTD budget</p>
              </div>
              
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Cari kategori biaya..."
                  value={expenseSearch}
                  onChange={(e) => setExpenseSearch(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-200 rounded-xl pl-8 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium transition-all"
                />
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              </div>
            </div>

            <div className="overflow-x-auto max-h-[350px] scrollbar-thin">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-500">
                    <th className="text-left px-5 py-3 font-bold uppercase tracking-wider text-[10px]">Expense Item</th>
                    <th className="text-right px-4 py-3 font-bold uppercase tracking-wider text-[10px]">YTD Budget</th>
                    <th className="text-right px-4 py-3 font-bold uppercase tracking-wider text-[10px]">YTD Actual</th>
                    <th className="text-right px-4 py-3 font-bold uppercase tracking-wider text-[10px]">Variance</th>
                    <th className="text-center px-4 py-3 font-bold uppercase tracking-wider text-[10px] w-32">Budget %</th>
                    <th className="text-center px-4 py-3 font-bold uppercase tracking-wider text-[10px]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                  {filteredExpenses.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-slate-400 font-bold bg-slate-50/10">
                        Tidak ada kategori biaya yang cocok
                      </td>
                    </tr>
                  ) : (
                    filteredExpenses.map(row => {
                      const variance = row.actual - row.budget
                      const isUnder = variance <= 0
                      const pctUsed = row.budget > 0 ? Math.round((row.actual / row.budget) * 100) : 0
                      
                      return (
                        <tr key={row.category} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-5 py-3.5 font-bold text-slate-800">{row.category}</td>
                          <td className="px-4 py-3.5 text-right tabular-nums">{fmtB(row.budget)}</td>
                          <td className="px-4 py-3.5 text-right font-bold tabular-nums">{fmtB(row.actual)}</td>
                          <td className={`px-4 py-3.5 text-right font-extrabold tabular-nums ${isUnder ? 'text-emerald-600' : 'text-rose-500'}`}>
                            {isUnder ? '-' : '+'}{fmtB(Math.abs(variance))}
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="space-y-1">
                              <div className="flex justify-between text-[8px] font-black text-slate-400">
                                <span>Used: {pctUsed}%</span>
                              </div>
                              <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden">
                                <div className={`h-full rounded-full ${
                                  pctUsed <= 90 ? 'bg-emerald-500' :
                                  pctUsed <= 100 ? 'bg-amber-500' :
                                  'bg-rose-500'
                                }`} style={{ width: `${Math.min(100, pctUsed)}%` }} />
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border ${
                              pctUsed <= 95 ? 'bg-emerald-50 text-emerald-600 border-emerald-100/60' :
                              pctUsed <= 100 ? 'bg-amber-50 text-amber-600 border-amber-100/60' :
                              'bg-rose-50 text-rose-600 border-rose-100/60'
                            }`}>
                              {pctUsed <= 95 ? 'Saving' : pctUsed <= 100 ? 'On Target' : 'Overrun'}
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
        </>
      )}

      {activeSubTab === 'ga_details' && (
        <div className="space-y-6">
          {/* Detail categories sub-navigation */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white/90 backdrop-blur-sm p-4 rounded-2xl border border-slate-100 shadow-xl shadow-slate-100/40 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex gap-2">
              {[
                { id: 'assets', label: 'Physical Assets', count: gaDetailedAssets.length },
                { id: 'vehicles', label: 'Fleet (Vehicles)', count: gaDetailedVehicles.length },
                { id: 'rentals', label: 'Device Rentals', count: gaDetailedRentals.length },
                { id: 'insurances', label: 'Insurances', count: gaDetailedInsurances.length },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveDetailCategory(cat.id)
                    setDetailSearch('')
                  }}
                  className={`px-3.5 py-2 text-xs font-extrabold rounded-xl transition-all duration-300 border ${
                    activeDetailCategory === cat.id
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 border-blue-600 scale-[1.02]'
                      : 'bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border-slate-200/60'
                  }`}
                >
                  {cat.label} <span className={`ml-1 text-[10px] font-bold ${activeDetailCategory === cat.id ? 'text-blue-100' : 'text-slate-400'}`}>({cat.count})</span>
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-72">
              <input
                type="text"
                placeholder={`Cari ${activeDetailCategory === 'assets' ? 'aset' : activeDetailCategory === 'vehicles' ? 'plat/merk' : activeDetailCategory === 'rentals' ? 'item sewa' : 'polis/asuransi'}...`}
                value={detailSearch}
                onChange={(e) => setDetailSearch(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium transition-all"
              />
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            </div>
          </div>

          {/* Detailed table view */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-xl shadow-slate-100/40 overflow-hidden animate-in fade-in duration-300">
            <div className="overflow-x-auto max-h-[500px] scrollbar-thin">
              {activeDetailCategory === 'assets' && (
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[9px]">
                      <th className="text-left px-5 py-3">Asset Code</th>
                      <th className="text-left px-4 py-3">Asset Name</th>
                      <th className="text-left px-4 py-3">Company</th>
                      <th className="text-left px-4 py-3">Category</th>
                      <th className="text-center px-4 py-3">Acquisition Date</th>
                      <th className="text-right px-4 py-3">Acquisition Cost</th>
                      <th className="text-center px-4 py-3">Condition</th>
                      <th className="text-center px-5 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                    {gaDetailedAssets
                      .filter(a => 
                        a.asset_name.toLowerCase().includes(detailSearch.toLowerCase()) ||
                        a.asset_code.toLowerCase().includes(detailSearch.toLowerCase()) ||
                        a.company.toLowerCase().includes(detailSearch.toLowerCase()) ||
                        (a.category && a.category.toLowerCase().includes(detailSearch.toLowerCase()))
                      )
                      .map(a => (
                        <tr key={a.asset_code} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-5 py-3 font-bold text-blue-600 font-mono text-[10px]">{a.asset_code}</td>
                          <td className="px-4 py-3 font-bold text-slate-800 truncate max-w-[200px]" title={a.asset_name}>{a.asset_name}</td>
                          <td className="px-4 py-3 text-slate-500 truncate max-w-[150px]">{a.company}</td>
                          <td className="px-4 py-3 text-slate-600">{a.category || '-'}</td>
                          <td className="px-4 py-3 text-center text-slate-400 font-semibold">{a.acquisition_date || '-'}</td>
                          <td className="px-4 py-3 text-right font-bold tabular-nums">
                            {a.acquisition_cost > 0 ? fmt(a.acquisition_cost / 1_000_000_000, 'B') : '-'}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border ${
                              a.condition === 'Good' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                              a.condition === 'Needs Maintenance' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                              'bg-rose-50 text-rose-600 border-rose-100'
                            }`}>
                              {a.condition || 'Good'}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                              a.status === 'Active' ? 'bg-blue-50 text-blue-600 border-blue-100/60' :
                              'bg-slate-50 text-slate-500 border-slate-100'
                            }`}>
                              {a.status || 'Active'}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}

              {activeDetailCategory === 'vehicles' && (
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[9px]">
                      <th className="text-left px-5 py-3">Plate Number</th>
                      <th className="text-left px-4 py-3">Brand / Model</th>
                      <th className="text-left px-4 py-3">Company</th>
                      <th className="text-left px-4 py-3">Driver Name</th>
                      <th className="text-left px-4 py-3">Department</th>
                      <th className="text-center px-4 py-3">Last Service Date</th>
                      <th className="text-center px-5 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                    {gaDetailedVehicles
                      .filter(v => 
                        v.plate_number.toLowerCase().includes(detailSearch.toLowerCase()) ||
                        v.brand_model.toLowerCase().includes(detailSearch.toLowerCase()) ||
                        v.company.toLowerCase().includes(detailSearch.toLowerCase()) ||
                        (v.driver_name && v.driver_name.toLowerCase().includes(detailSearch.toLowerCase()))
                      )
                      .map(v => (
                        <tr key={v.plate_number} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-5 py-3 font-bold text-slate-800 font-mono">{v.plate_number}</td>
                          <td className="px-4 py-3 font-bold text-slate-700">{v.brand_model || '-'}</td>
                          <td className="px-4 py-3 text-slate-500">{v.company}</td>
                          <td className="px-4 py-3 text-slate-650 font-semibold">{v.driver_name || 'No Driver'}</td>
                          <td className="px-4 py-3 text-slate-600">{v.department || '-'}</td>
                          <td className="px-4 py-3 text-center text-slate-400 font-semibold">{v.last_service_date || '-'}</td>
                          <td className="px-5 py-3 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                              v.status === 'Aktif' || v.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100/65' :
                              'bg-slate-50 text-slate-500 border-slate-100'
                            }`}>
                              {v.status || 'Active'}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}

              {activeDetailCategory === 'rentals' && (
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[9px]">
                      <th className="text-left px-5 py-3">Order ID</th>
                      <th className="text-left px-4 py-3">Item Name</th>
                      <th className="text-left px-4 py-3">Company</th>
                      <th className="text-right px-4 py-3">Price / Month</th>
                      <th className="text-center px-4 py-3">Start Rent</th>
                      <th className="text-center px-4 py-3">End Rent</th>
                      <th className="text-center px-5 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                    {gaDetailedRentals
                      .filter(r => 
                        r.order_id.toLowerCase().includes(detailSearch.toLowerCase()) ||
                        r.item_name.toLowerCase().includes(detailSearch.toLowerCase()) ||
                        r.company.toLowerCase().includes(detailSearch.toLowerCase())
                      )
                      .map((r, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-5 py-3 font-mono text-[10px] text-slate-500">{r.order_id}</td>
                          <td className="px-4 py-3 font-bold text-slate-800 truncate max-w-[200px]" title={r.item_name}>{r.item_name}</td>
                          <td className="px-4 py-3 text-slate-500 truncate max-w-[150px]">{r.company}</td>
                          <td className="px-4 py-3 text-right font-bold tabular-nums text-slate-700">
                            {r.price > 0 ? fmt(r.price) : '-'}
                          </td>
                          <td className="px-4 py-3 text-center text-slate-400 font-semibold">{r.start_rent || '-'}</td>
                          <td className="px-4 py-3 text-center text-slate-400 font-semibold">{r.end_rent || '-'}</td>
                          <td className="px-5 py-3 text-center">
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold border bg-blue-50 text-blue-600 border-blue-100/60">
                              {r.status || 'Active'}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}

              {activeDetailCategory === 'insurances' && (
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[9px]">
                      <th className="text-left px-5 py-3">Policy Number</th>
                      <th className="text-left px-4 py-3">Insurance Company</th>
                      <th className="text-left px-4 py-3">Type</th>
                      <th className="text-left px-4 py-3">Insured Company</th>
                      <th className="text-right px-4 py-3">Premium</th>
                      <th className="text-right px-4 py-3">Total Coverage</th>
                      <th className="text-center px-4 py-3">Expiry Date</th>
                      <th className="text-center px-5 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                    {gaDetailedInsurances
                      .filter(i => 
                        i.policy_number.toLowerCase().includes(detailSearch.toLowerCase()) ||
                        i.insurance_company.toLowerCase().includes(detailSearch.toLowerCase()) ||
                        i.company.toLowerCase().includes(detailSearch.toLowerCase()) ||
                        i.insurance_type.toLowerCase().includes(detailSearch.toLowerCase())
                      )
                      .map((i, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-5 py-3 font-mono text-[10px] text-slate-800">{i.policy_number}</td>
                          <td className="px-4 py-3 font-bold text-slate-750">{i.insurance_company}</td>
                          <td className="px-4 py-3 text-slate-650 font-semibold">{i.insurance_type}</td>
                          <td className="px-4 py-3 text-slate-500 truncate max-w-[150px]">{i.company}</td>
                          <td className="px-4 py-3 text-right font-bold tabular-nums text-slate-750">
                            {i.premium_idr > 0 ? fmt(i.premium_idr) : '-'}
                          </td>
                          <td className="px-4 py-3 text-right font-bold tabular-nums text-slate-700">
                            {i.coverage_idr > 0 ? fmt(i.coverage_idr / 1_000_000_000, 'B') : '-'}
                          </td>
                          <td className="px-4 py-3 text-center text-slate-400 font-semibold">{i.end_date || '-'}</td>
                          <td className="px-5 py-3 text-center">
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold border bg-emerald-50 text-emerald-600 border-emerald-100/60">
                              {i.status || 'Active'}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

    </Layout>
  )
}
