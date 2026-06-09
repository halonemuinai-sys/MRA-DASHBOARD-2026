import { useState } from 'react'
import Layout from '../components/layout/Layout'
import KpiCard from '../components/KpiCard'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import { Users, DollarSign, UserMinus, CalendarCheck, HelpCircle } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { recruitmentData, trainingKpi, headcountBySegment } from '../data/dummyData'
import { Tooltip as ShadcnTooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const SEG_COLORS = ['#3b82f6', '#f97316', '#10b981', '#8b5cf6']

function Section({ title, children }) {
  return (
    <div className="mb-8">
      <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3.5">{title}</h2>
      {children}
    </div>
  )
}

export default function HR() {
  const [searchTerm, setSearchTerm] = useState('')
  const { filteredHrKpis, fmt, currency, scaleRatio, segment, filteredPtHeadcount, filteredPersonnelExpenses } = useApp()
  const k = filteredHrKpis

  // Dynamic calculations
  const fmtB = v => fmt(v, 'B')

  // Dynamic headcount by segment
  const dynamicHeadcount = headcountBySegment.map((h, i) => {
    // If a specific segment is selected, focus on it or scaleHO
    let count = h.count
    if (segment !== 'All' && h.segment !== segment) {
      count = Math.round(h.count * scaleRatio) // Scale other segments down
    } else if (segment !== 'All' && h.segment === segment) {
      count = k.headcount.value // Use the actual dynamic headcount
    }
    return {
      ...h,
      count
    }
  })

  // Dynamic recruitment open roles scaled
  const dynamicRecruitment = recruitmentData.map(r => ({
    ...r,
    open: Math.max(1, Math.round(r.open * scaleRatio))
  }))

  const displayedPts = filteredPtHeadcount.filter(pt =>
    pt.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null
    return (
      <div className="bg-white/95 backdrop-blur-sm border border-slate-200/60 rounded-2xl px-3.5 py-3 shadow-xl text-xs font-bold text-slate-800">
        {payload[0].name}: {payload[0].value.toLocaleString('id-ID')} org
      </div>
    )
  }

  return (
    <Layout title="HR Dashboard">
      <Section title="HR KPI — YTD 2026">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <KpiCard 
            label="Total Headcount" 
            value={`${k.headcount.value.toLocaleString()} org`} 
            yoy={k.headcount.yoy} 
            color="blue" 
            icon={Users} 
            tooltip="Total jumlah karyawan aktif di seluruh holding pilar MRA Group. Disaring dinamis berdasarkan segmen/brand yang dipilih."
          />
          <KpiCard 
            label="Employee Cost" 
            value={fmtB(k.employeeCost.value)} 
            pctRev={k.employeeCost.pctRev} 
            yoy={k.employeeCost.yoy} 
            color="amber" 
            icon={DollarSign} 
            tooltip="Total beban biaya tenaga kerja (Personnel Expenses) YTD, dikalkulasi otomatis sebesar 5% dari pendapatan (revenue) aktif."
          />
          <KpiCard 
            label="Turnover Rate" 
            value={`${k.turnoverRate.value}%`} 
            sub="Target: < 8% / year" 
            yoy={k.turnoverRate.yoy} 
            color="rose" 
            icon={UserMinus} 
            tooltip="Persentase karyawan yang keluar (resign/termination) dibandingkan total headcount. Batas target toleransi: < 8% per tahun."
          />
          <KpiCard 
            label="Attendance Rate" 
            value={`${k.attendance.value}%`} 
            sub="Target: > 95%" 
            yoy={k.attendance.yoy} 
            color="green" 
            icon={CalendarCheck} 
            tooltip="Rata-rata persentase kehadiran kerja harian seluruh karyawan. Target performa holding: > 95%."
          />
        </div>
      </Section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        {/* Headcount Distribution */}
        <div className="lg:col-span-5 bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100 p-5 shadow-xl shadow-slate-100/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <h3 className="font-bold text-slate-800 text-sm">Headcount Distribution</h3>
              <TooltipProvider delayDuration={100}>
                <ShadcnTooltip>
                  <TooltipTrigger asChild>
                    <button className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none">
                      <HelpCircle size={13} className="shrink-0" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-slate-900 border-slate-800 text-white text-xs p-2.5 max-w-[245px] rounded-xl font-bold shadow-xl leading-normal">
                    Persentase pembagian total jumlah karyawan (headcount) berdasarkan pilar bisnis utama holding (Retail, F&B, Media, dan Head Office/HO).
                  </TooltipContent>
                </ShadcnTooltip>
              </TooltipProvider>
            </div>
            <p className="text-xs text-slate-400 font-medium mb-4">Total: {dynamicHeadcount.reduce((a,b)=>a+b.count,0).toLocaleString()} employees</p>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="50%" height={160}>
                <PieChart>
                  <Pie data={dynamicHeadcount} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="count" paddingAngle={4}>
                    {dynamicHeadcount.map((_, i) => <Cell key={i} fill={SEG_COLORS[i % SEG_COLORS.length]} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 flex-1 pr-2">
                {dynamicHeadcount.map((s, i) => {
                  const total = dynamicHeadcount.reduce((a,b)=>a+b.count, 0)
                  const pct = total > 0 ? (s.count / total * 100).toFixed(0) : '0'
                  const color = SEG_COLORS[i % SEG_COLORS.length]
                  return (
                    <div key={s.segment} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: color }}></span>
                        <span className="text-slate-600 font-semibold">{s.segment}</span>
                      </div>
                      <span className="font-bold text-slate-800">{s.count.toLocaleString()} <span className="text-[10px] text-slate-400">({pct}%)</span></span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Personnel Expenses Breakdown */}
        <div className="lg:col-span-7 bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100 p-5 shadow-xl shadow-slate-100/40">
          <div className="flex items-center gap-1.5 mb-0.5">
            <h3 className="font-bold text-slate-800 text-sm">Personnel Expenses Breakdown</h3>
            <TooltipProvider delayDuration={100}>
              <ShadcnTooltip>
                <TooltipTrigger asChild>
                  <button className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none">
                    <HelpCircle size={13} className="shrink-0" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="bg-slate-900 border-slate-800 text-white text-xs p-2.5 max-w-[245px] rounded-xl font-bold shadow-xl leading-normal">
                  Rincian detail alokasi beban biaya tenaga kerja yang terbagi ke dalam 11 komponen pengeluaran (gaji, tunjangan, jaminan BPJS, bonus/THR, asuransi, pajak, dll.).
                </TooltipContent>
              </ShadcnTooltip>
            </TooltipProvider>
          </div>
          <p className="text-xs text-slate-400 font-medium mb-4">Detailed allocation of total employee cost ({fmt(k.employeeCost.value, 'B')})</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[190px] overflow-y-auto pr-1">
            {filteredPersonnelExpenses?.map(p => (
              <div key={p.category} className="bg-slate-50/50 border border-slate-100 p-2.5 rounded-xl flex flex-col justify-between hover:bg-slate-50/80 transition-colors">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-700 font-semibold">{p.category}</span>
                  <span className="font-bold text-slate-800">{fmt(p.value, 'B')} <span className="text-[10px] text-slate-400 font-normal">({p.percentage}%)</span></span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-sky-400" style={{ width: `${p.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Training KPI */}
        <div className="lg:col-span-1 bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100 p-5 shadow-xl shadow-slate-100/40">
          <div className="flex items-center gap-1.5 mb-0.5">
            <h3 className="font-bold text-slate-800 text-sm">Training KPI Achievement</h3>
            <TooltipProvider delayDuration={100}>
              <ShadcnTooltip>
                <TooltipTrigger asChild>
                  <button className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none">
                    <HelpCircle size={13} className="shrink-0" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="bg-slate-900 border-slate-800 text-white text-xs p-2.5 max-w-[245px] rounded-xl font-bold shadow-xl leading-normal">
                  Persentase pencapaian pemenuhan program pelatihan/training wajib bagi karyawan di masing-masing departemen fungsional pilar bisnis.
                </TooltipContent>
              </ShadcnTooltip>
            </TooltipProvider>
          </div>
          <p className="text-xs text-slate-400 font-medium mb-4">% completion rate per department</p>
          <div className="space-y-4">
            {trainingKpi.map((t, i) => (
              <div key={t.dept}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-700 font-semibold">{t.dept}</span>
                  <span className={`font-bold ${t.achieved >= 90 ? 'text-emerald-600' : t.achieved >= 75 ? 'text-amber-600' : 'text-rose-500'}`}>
                    {t.achieved}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${t.achieved}%`,
                      background: t.achieved >= 90 ? '#10b981' : t.achieved >= 75 ? '#f59e0b' : '#ef4444'
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recruitment Status */}
        <div className="lg:col-span-2 bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100 p-5 shadow-xl shadow-slate-100/40">
          <div className="flex items-center gap-1.5 mb-0.5">
            <h3 className="font-bold text-slate-800 text-sm">Recruitment Status</h3>
            <TooltipProvider delayDuration={100}>
              <ShadcnTooltip>
                <TooltipTrigger asChild>
                  <button className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none">
                    <HelpCircle size={13} className="shrink-0" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="bg-slate-900 border-slate-800 text-white text-xs p-2.5 max-w-[245px] rounded-xl font-bold shadow-xl leading-normal">
                  Status proses rekrutmen karyawan baru yang sedang berjalan, memuat jumlah posisi lowong (open roles) dan persentase tahapan seleksi per departemen.
                </TooltipContent>
              </ShadcnTooltip>
            </TooltipProvider>
          </div>
          <p className="text-xs text-slate-400 font-medium mb-4">Current open roles and recruitment progress by department</p>
          <div className="overflow-x-auto mt-2">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500">
                  <th className="text-left px-4 py-2.5 font-bold uppercase tracking-wider text-[10px]">Department</th>
                  <th className="text-center px-4 py-2.5 font-bold uppercase tracking-wider text-[10px]">Open Positions</th>
                  <th className="px-4 py-2.5 font-bold uppercase tracking-wider text-[10px]">Progress</th>
                  <th className="text-center px-4 py-2.5 font-bold uppercase tracking-wider text-[10px]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                {dynamicRecruitment.map(r => (
                  <tr key={r.dept} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-800">{r.dept}</td>
                    <td className="px-4 py-3 text-center font-bold text-slate-900">{r.open}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full transition-all duration-500"
                            style={{
                              width: `${r.progress}%`,
                              background: r.progress >= 80 ? '#10b981' : r.progress >= 50 ? '#f59e0b' : '#ef4444'
                            }}
                          ></div>
                        </div>
                        <span className="font-bold text-slate-600 w-8 text-right">{r.progress}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black border ${
                        r.progress >= 80 ? 'bg-emerald-50 text-emerald-600 border-emerald-100/50' :
                        r.progress >= 50 ? 'bg-amber-50 text-amber-600 border-amber-100/50' :
                        'bg-rose-50 text-rose-600 border-rose-100/50'
                      }`}>
                        {r.progress >= 80 ? 'ON TRACK' : r.progress >= 50 ? 'IN PROGRESS' : 'DELAYED'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Headcount by Legal Entity Table */}
      <Section title="Headcount by Legal Entity (PT)">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-xl shadow-slate-100/40 overflow-hidden flex flex-col mb-6">
          <div className="px-5 py-4.5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white/50">
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <h3 className="font-bold text-slate-800 text-sm">PT Legal Entities</h3>
                <TooltipProvider delayDuration={100}>
                  <ShadcnTooltip>
                    <TooltipTrigger asChild>
                      <button className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none">
                        <HelpCircle size={13} className="shrink-0" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-slate-900 border-slate-800 text-white text-xs p-2.5 max-w-[245px] rounded-xl font-bold shadow-xl leading-normal">
                      Daftar entitas hukum resmi (PT) di bawah naungan MRA Group beserta rincian kontribusi jumlah karyawan aktif terhadap total segmen bisnis terpilih.
                    </TooltipContent>
                  </ShadcnTooltip>
                </TooltipProvider>
              </div>
              <p className="text-xs text-slate-400 font-medium">Headcount distribution and segment contribution percentage across group entities</p>
            </div>
            {/* Search Box */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Cari nama PT..."
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
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500">
                  <th className="text-left px-5 py-3 font-bold uppercase tracking-wider text-[10px]">Company Name</th>
                  <th className="text-center px-4 py-3 font-bold uppercase tracking-wider text-[10px]">Sector</th>
                  <th className="text-right px-4 py-3 font-bold uppercase tracking-wider text-[10px]">Headcount</th>
                  <th className="text-left px-5 py-3 font-bold uppercase tracking-wider text-[10px] w-64">Contribution to Segment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                {displayedPts.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-slate-400 font-medium bg-slate-50/10">
                      Tidak ada PT yang sesuai dengan kriteria pencarian
                    </td>
                  </tr>
                ) : (
                  displayedPts.map(pt => {
                    const segmentTotal = filteredPtHeadcount.reduce((sum, item) => sum + item.count, 0)
                    const contributionPct = segmentTotal > 0 ? ((pt.count / segmentTotal) * 100).toFixed(1) : 0
                    
                    return (
                      <tr key={pt.name} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-3.5 font-bold text-slate-800">{pt.name}</td>
                        <td className="px-4 py-3.5 text-center">
                          <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-black border ${
                            pt.sector === 'F&B' ? 'bg-orange-50 text-orange-600 border-orange-100/50' :
                            pt.sector === 'Retail' ? 'bg-blue-50 text-blue-600 border-blue-100/50' :
                            pt.sector === 'Media' ? 'bg-emerald-50 text-emerald-600 border-emerald-100/50' :
                            'bg-slate-100 text-slate-500 border-slate-200/50'
                          }`}>
                            {pt.sector}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right font-bold text-slate-900 tabular-nums">{pt.count} org</td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/20">
                              <div className={`h-full rounded-full ${
                                pt.sector === 'F&B' ? 'bg-gradient-to-r from-orange-500 to-amber-400' :
                                pt.sector === 'Retail' ? 'bg-gradient-to-r from-blue-500 to-sky-400' :
                                pt.sector === 'Media' ? 'bg-gradient-to-r from-emerald-500 to-teal-400' :
                                'bg-slate-400'
                              }`} style={{ width: `${contributionPct}%` }} />
                            </div>
                            <span className="font-extrabold text-slate-500 w-10 text-right">{contributionPct}%</span>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Section>
    </Layout>
  )
}
