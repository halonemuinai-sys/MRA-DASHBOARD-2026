import { useState } from 'react'
import Layout from '../components/layout/Layout'
import KpiCard from '../components/KpiCard'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell, ComposedChart, Line
} from 'recharts'
import { Megaphone, DollarSign, TrendingUp, Target, Percent, HelpCircle } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Tooltip as ShadcnTooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const COLORS = ['#3b82f6', '#f97316', '#10b981', '#8b5cf6']

function Section({ title, children }) {
  return (
    <div className="mb-8">
      <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3.5">{title}</h2>
      {children}
    </div>
  )
}

export default function Marketing() {
  const [selectedChannel, setSelectedChannel] = useState('Digital Marketing')
  const {
    filteredMarketingKpis,
    filteredMarketingSpend,
    filteredMarketingTrend,
    filteredMarketingMetrics,
    filteredMarketingExpensesBreakdown,
    filteredMarketingChannelDetails,
    fmt,
    currency
  } = useApp()

  const k = filteredMarketingKpis

  // Spend value formatter (e.g. IDR 12.5B / $0.8M)
  const fmtB = v => fmt(v, 'B')

  // Tooltip content helper for Pie Chart
  const CustomPieTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null
    return (
      <div className="bg-white/95 backdrop-blur-sm border border-slate-200/60 rounded-2xl px-3.5 py-3 shadow-xl text-xs font-bold text-slate-800">
        {payload[0].name}: {fmt(payload[0].value, 'B')} ({payload[0].payload.percentage}%)
      </div>
    )
  }

  // Tooltip content helper for Composed Chart
  const CustomComposedTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
      <div className="bg-white/95 backdrop-blur-sm border border-slate-200/60 rounded-2xl px-3.5 py-3 shadow-xl text-xs font-bold text-slate-800 space-y-1.5">
        <p className="font-extrabold text-slate-500 uppercase tracking-wider text-[10px]">{label}</p>
        <div className="flex justify-between items-center gap-6">
          <span className="text-blue-500 font-semibold">Spend:</span>
          <span>{fmt(payload[0].value, 'B')}</span>
        </div>
        <div className="flex justify-between items-center gap-6">
          <span className="text-amber-500 font-semibold">ROAS:</span>
          <span>{payload[1].value}x</span>
        </div>
        <div className="flex justify-between items-center gap-6">
          <span className="text-sky-500 font-semibold">CAC:</span>
          <span>{payload[2].value} {currency === 'USD' ? 'USD' : 'k IDR'}</span>
        </div>
      </div>
    )
  }

  return (
    <Layout title="Marketing Dashboard">
      {/* ─── MARKETING KPI CARD ROW ─── */}
      <Section title="Marketing performance — YTD 2026">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <KpiCard
            label="Total Marketing Spend"
            value={fmtB(k.spend.value)}
            sub="1.5% of Revenue"
            yoy={k.spend.yoy}
            color="blue"
            icon={DollarSign}
            tooltip="Total anggaran pemasaran yang dialokasikan (sekitar 1.5% dari Pendapatan kotor). Mencakup biaya iklan digital, aktivasi event, kemitraan KOL, dan hubungan masyarakat (PR)."
          />
          <KpiCard
            label="Blended ROAS"
            value={`${k.roas.value}x`}
            sub={`Target: ${k.roas.target}`}
            yoy={k.roas.yoy}
            color="amber"
            icon={TrendingUp}
            tooltip="Return on Ad Spend - Rasio pendapatan kotor yang diperoleh per nominal biaya belanja iklan digital yang dikeluarkan. Target optimal holding: > 4.5x."
          />
          <KpiCard
            label="Cost Per Acquisition (CAC)"
            value={k.cac.value}
            sub={`Target: ${k.cac.target}`}
            yoy={k.cac.yoy}
            color="green"
            icon={Target}
            tooltip="Customer Acquisition Cost - Biaya pemasaran rata-rata yang dikeluarkan untuk memperoleh satu pelanggan baru yang bertransaksi."
          />
          <KpiCard
            label="Digital Engagement Rate"
            value={k.engagement.value}
            sub={`Target: ${k.engagement.target}`}
            yoy={k.engagement.yoy}
            color="blue"
            icon={Percent}
            tooltip="Rata-rata interaksi audiens (like, comment, share, save) di media sosial dan platform digital dibandingkan total impresi konten."
          />
        </div>
      </Section>

      {/* ─── GRAPH GRID ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        
        {/* Spend Allocation Pie Card */}
        <div className="lg:col-span-6 bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100 p-5 shadow-xl shadow-slate-100/40 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-1">
              <div>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <h3 className="font-bold text-slate-800 text-sm">Spend Allocation & Sub-Channels</h3>
                  <TooltipProvider delayDuration={100}>
                    <ShadcnTooltip>
                      <TooltipTrigger asChild>
                        <button className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none">
                          <HelpCircle size={13} className="shrink-0" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-slate-900 border-slate-800 text-white text-xs p-2.5 max-w-[245px] rounded-xl font-bold shadow-xl leading-normal">
                        Pembagian anggaran pemasaran berdasarkan channel utama (Digital, Event, KOL, PR). Klik pada irisan diagram atau daftar channel untuk membedah rincian sub-kategori pengeluaran iklan dan target ROI pilar masing-masing.
                      </TooltipContent>
                    </ShadcnTooltip>
                  </TooltipProvider>
                </div>
                <p className="text-xs text-slate-400 font-medium">Interactive channel analysis & ROI tracking</p>
              </div>
              <div className="bg-slate-100/60 border border-slate-200/40 text-[10px] font-black text-slate-500 px-2 py-0.5 rounded-lg">
                Total: {fmtB(k.spend.value)}
              </div>
            </div>

            <div className="flex items-center gap-4 border-b border-slate-100/50 pb-4 mb-4 mt-2">
              <ResponsiveContainer width="40%" height={120}>
                <PieChart>
                  <Pie
                    data={filteredMarketingSpend}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={50}
                    dataKey="value"
                    paddingAngle={4}
                  >
                    {filteredMarketingSpend.map((entry, i) => (
                      <Cell 
                        key={i} 
                        fill={entry.color} 
                        stroke={selectedChannel === entry.channel ? '#1e293b' : 'none'}
                        strokeWidth={selectedChannel === entry.channel ? 2 : 0}
                        className="cursor-pointer focus:outline-none"
                        onClick={() => setSelectedChannel(entry.channel)}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 flex-1 pr-2">
                {filteredMarketingSpend.map((item, i) => {
                  const isSelected = selectedChannel === item.channel
                  return (
                    <button 
                      key={item.channel} 
                      onClick={() => setSelectedChannel(item.channel)}
                      className={`w-full flex items-center justify-between text-left text-xs p-1.5 rounded-xl border transition-all ${
                        isSelected 
                          ? 'bg-blue-50/40 border-blue-200/50 shadow-sm text-blue-900' 
                          : 'bg-transparent border-transparent hover:bg-slate-100/30 text-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: item.color }}></span>
                        <span className="font-bold truncate">{item.channel}</span>
                      </div>
                      <span className="font-black text-slate-800 ml-2">
                        {item.percentage}%
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Drilldown details */}
            {selectedChannel && filteredMarketingChannelDetails[selectedChannel] && (
              <div className="bg-slate-50/40 border border-slate-100 p-3 rounded-xl">
                <div className="flex justify-between items-center text-xs mb-2.5 border-b border-slate-200/30 pb-2">
                  <span className="font-black text-slate-850 text-[10px] uppercase tracking-wider">{selectedChannel} Sub-Channels</span>
                  <span className="px-2 py-0.5 rounded-lg text-[9px] font-black bg-emerald-50 text-emerald-600 border border-emerald-100/30">
                    Est. ROI: {filteredMarketingChannelDetails[selectedChannel].roi}
                  </span>
                </div>
                <div className="space-y-2.5">
                  {filteredMarketingChannelDetails[selectedChannel].subChannels.map(sub => (
                    <div key={sub.name} className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-600 font-semibold">{sub.name}</span>
                        <span className="font-bold text-slate-850">
                          {fmt(sub.value, 'B')} <span className="text-[9px] text-slate-400 font-normal">({sub.percentage}%)</span>
                        </span>
                      </div>
                      <div className="w-full bg-slate-200/50 rounded-full h-1 overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-sky-400" style={{ width: `${sub.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ROAS & CAC Composed Trend Card */}
        <div className="lg:col-span-6 bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100 p-5 shadow-xl shadow-slate-100/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <h3 className="font-bold text-slate-800 text-sm">Monthly Spend, ROAS & CAC Trends</h3>
              <TooltipProvider delayDuration={100}>
                <ShadcnTooltip>
                  <TooltipTrigger asChild>
                    <button className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none">
                      <HelpCircle size={13} className="shrink-0" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-slate-900 border-slate-800 text-white text-xs p-2.5 max-w-[245px] rounded-xl font-bold shadow-xl leading-normal">
                    Menampilkan korelasi historis bulanan antara biaya belanja pemasaran (Bar Biru) dengan efektivitas iklan/ROAS (Line Oranye) dan rata-rata biaya akuisisi konsumen/CAC (Line Putus-putus Ungu).
                  </TooltipContent>
                </ShadcnTooltip>
              </TooltipProvider>
            </div>
            <p className="text-xs text-slate-400 font-medium mb-4">Correlation of media spend with campaign efficiency</p>
            <div className="h-[210px] w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={filteredMarketingTrend}
                  margin={{ top: 10, right: -5, left: -22, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} />
                  <YAxis yAxisId="left" tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} />
                  <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} />
                  <Tooltip content={<CustomComposedTooltip />} />
                  <Bar yAxisId="left" dataKey="spend" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={18} />
                  <Line yAxisId="left" type="monotone" dataKey="roas" stroke="#f97316" strokeWidth={2.5} dot={{ r: 3.5, strokeWidth: 1.5, fill: '#fff' }} />
                  <Line yAxisId="right" type="monotone" dataKey="cac" stroke="#0ea5e9" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3, strokeWidth: 1, fill: '#fff' }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-5 text-[10px] font-bold text-slate-500 mt-3.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-blue-500 shrink-0"></span>
                <span>Marketing Spend</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 bg-orange-500 shrink-0 inline-block"></span>
                <span>ROAS (x)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 bg-sky-500 border-t border-dashed shrink-0 inline-block"></span>
                <span>CAC ({currency === 'USD' ? 'USD' : 'k IDR'})</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ─── MARKETING EXPENSES BREAKDOWN & TACTICAL METRICS GRID ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        
        {/* Marketing Expenses Breakdown */}
        <div className="lg:col-span-7 bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100 p-5 shadow-xl shadow-slate-100/40">
          <div className="flex items-center gap-1.5 mb-0.5">
            <h3 className="font-bold text-slate-800 text-sm">Marketing Expenses Breakdown</h3>
            <TooltipProvider delayDuration={100}>
              <ShadcnTooltip>
                <TooltipTrigger asChild>
                  <button className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none">
                    <HelpCircle size={13} className="shrink-0" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="bg-slate-900 border-slate-800 text-white text-xs p-2.5 max-w-[245px] rounded-xl font-bold shadow-xl leading-normal">
                  Rincian alokasi biaya pengeluaran pemasaran (Opex) yang terbagi ke dalam 13 pos pengeluaran detail (seperti iklan event, komisi penjualan, dokumentasi, entertainment, dll.) yang disaring dinamis.
                </TooltipContent>
              </ShadcnTooltip>
            </TooltipProvider>
          </div>
          <p className="text-xs text-slate-400 font-medium mb-4">Detailed allocation of total marketing spend ({fmtB(k.spend.value)})</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[200px] overflow-y-auto pr-1">
            {filteredMarketingExpensesBreakdown?.map(p => (
              <div key={p.category} className="bg-slate-50/50 border border-slate-100 p-2.5 rounded-xl flex flex-col justify-between hover:bg-slate-50/80 transition-colors">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-700 font-semibold truncate pr-1" title={p.category}>{p.category}</span>
                  <span className="font-bold text-slate-800">{fmt(p.value, 'B')} <span className="text-[10px] text-slate-400 font-normal">({p.percentage}%)</span></span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-sky-400" style={{ width: `${p.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tactical Metrics & Goals */}
        <div className="lg:col-span-5 bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100 p-5 shadow-xl shadow-slate-100/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <h3 className="font-bold text-slate-800 text-sm">Tactical Metrics & Goals</h3>
              <TooltipProvider delayDuration={100}>
                <ShadcnTooltip>
                  <TooltipTrigger asChild>
                    <button className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none">
                      <HelpCircle size={13} className="shrink-0" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-slate-900 border-slate-800 text-white text-xs p-2.5 max-w-[245px] rounded-xl font-bold shadow-xl leading-normal">
                    Indikator kinerja pemasaran taktis spesifik pilar bisnis (seperti tingkat retensi VIC untuk Retail, redemption rate promo untuk F&B, dan CPM untuk Media) lengkap dengan realisasi aktual vs target yang ditentukan.
                  </TooltipContent>
                </ShadcnTooltip>
              </TooltipProvider>
            </div>
            <p className="text-xs text-slate-400 font-medium mb-3">Key performance indicator targets by sector</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-500">
                    <th className="text-left py-2 px-3 font-bold uppercase tracking-wider text-[9px]">Indicator</th>
                    <th className="text-center py-2 px-2 font-bold uppercase tracking-wider text-[9px]">Actual</th>
                    <th className="text-center py-2 px-2 font-bold uppercase tracking-wider text-[9px]">Target</th>
                    <th className="text-center py-2 px-2 font-bold uppercase tracking-wider text-[9px]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                  {filteredMarketingMetrics.map(item => (
                    <tr key={item.metric} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-2 px-3 font-bold text-slate-800 leading-tight">{item.metric}</td>
                      <td className="py-2 px-2 text-center font-black text-slate-900">{item.value}</td>
                      <td className="py-2 px-2 text-center font-semibold text-slate-400">{item.target}</td>
                      <td className="py-2 px-2 text-center">
                        <span className="px-1.5 py-0.5 rounded text-[8px] font-black border bg-emerald-50 text-emerald-600 border-emerald-100/30">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
