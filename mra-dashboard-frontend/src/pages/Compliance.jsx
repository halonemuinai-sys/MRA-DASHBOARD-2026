import Layout from '../components/layout/Layout'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer
} from 'recharts'
import { useApp } from '../context/AppContext'
import { whistleblowing, riskRegister } from '../data/dummyData'
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

function Section({ title, children }) {
  return (
    <div className="mb-8">
      <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3.5">{title}</h2>
      {children}
    </div>
  )
}

const riskLevelColor = {
  Low:    'bg-emerald-50 text-emerald-600 border border-emerald-100',
  Medium: 'bg-amber-50 text-amber-600 border border-amber-100',
  High:   'bg-rose-50 text-rose-600 border border-rose-100',
}

export default function Compliance() {
  const { filteredComplianceItems, scaleRatio } = useApp()

  const totalItems = filteredComplianceItems.reduce((a,b) => a+b.items, 0)
  const totalCompliant = filteredComplianceItems.reduce((a,b) => a+b.compliant, 0)
  const overallPct = totalItems > 0 ? Math.round(totalCompliant / totalItems * 100) : 0

  // Dynamic whistleblowing case statistics scaled by scaleRatio
  const dynamicWhistleblowing = whistleblowing.map(w => ({
    ...w,
    received: Math.max(0, Math.round(w.received * scaleRatio)),
    resolved: Math.max(0, Math.round(w.resolved * scaleRatio)),
    pending: Math.max(0, Math.round(w.pending * scaleRatio)),
  }))

  // Dynamic risk registry scaled likelihood & impact if needed (or keep original text)
  const dynamicRisk = riskRegister.map(r => ({
    ...r,
    likelihood: Math.max(1, Math.min(5, Math.round(r.likelihood * (scaleRatio > 0 ? 1 : 0.5)))),
  }))

  const CustomChartTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null
    return (
      <div className="bg-white/95 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-3.5 shadow-xl text-xs font-bold space-y-1">
        <p className="text-slate-800 font-bold mb-1.5">{payload[0].payload.month}</p>
        {payload.map((p, i) => (
          <div key={i} className="flex justify-between items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: p.color }}></span>
              <span className="text-slate-500 font-semibold">{p.name}:</span>
            </div>
            <span className="text-slate-850 text-slate-800 font-extrabold">{p.value} kasus</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <Layout title="Compliance Dashboard">

      {/* Overall Score */}
      <div className="bg-slate-950 border border-slate-900 text-white rounded-2xl p-5 mb-6 flex items-center justify-between shadow-xl shadow-slate-950/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/5 rounded-full blur-3xl" />
        <div>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1.5">Overall Compliance Score</p>
          <p className="text-4xl font-black text-white">{overallPct}<span className="text-2xl text-amber-400 font-bold">%</span></p>
          <p className="text-slate-400 text-xs mt-2 font-medium">{totalCompliant} out of {totalItems} checklists compliant</p>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center shrink-0">
          {[
            { label: 'Low Risk',    count: filteredComplianceItems.filter(c=>c.risk==='Low').length,    color: 'text-emerald-450 text-emerald-400' },
            { label: 'Medium Risk', count: filteredComplianceItems.filter(c=>c.risk==='Medium').length, color: 'text-amber-450 text-amber-400'   },
            { label: 'High Risk',   count: filteredComplianceItems.filter(c=>c.risk==='High').length,   color: 'text-rose-450 text-rose-400'     },
          ].map(s => (
            <div key={s.label} className="bg-slate-900 border border-slate-800/80 rounded-xl p-3.5 text-center min-w-24">
              <p className={`text-2xl font-black ${s.color} leading-none mb-1.5`}>{s.count}</p>
              <p className="text-slate-500 text-[9px] font-bold uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance Items Grid */}
      <Section title="Compliance Module Status">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {filteredComplianceItems.length === 0 ? (
            <div className="col-span-4 text-center py-8 text-slate-400 font-medium bg-white/90 backdrop-blur border border-slate-100 rounded-2xl shadow">No compliance modules found.</div>
          ) : (
            filteredComplianceItems.map(c => {
              const pct = Math.round(c.compliant / c.items * 100)
              const nonCompliant = c.items - c.compliant
              return (
                <div key={c.module} className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100 p-5 shadow-xl shadow-slate-100/40 hover:-translate-y-1 transform duration-300 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-3.5 gap-2">
                      <p className="text-xs font-bold text-slate-800 leading-snug flex-1">{c.module}</p>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold shrink-0 ${riskLevelColor[c.risk]}`}>{c.risk}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-550 text-slate-500 font-semibold mb-2">
                      <CheckCircle size={13} className="text-emerald-500 shrink-0" />
                      <span>{c.compliant}/{c.items} compliant</span>
                    </div>
                    {nonCompliant > 0 && (
                      <div className="flex items-center gap-1.5 text-xs text-rose-500 font-bold mb-2">
                        <XCircle size={13} className="shrink-0" />
                        <span>{nonCompliant} action items required</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full transition-all duration-500"
                        style={{
                          width: `${pct}%`,
                          background: pct === 100 ? '#10b981' : pct >= 80 ? '#f59e0b' : '#ef4444'
                        }}
                      ></div>
                    </div>
                    <p className={`text-right text-[11px] font-black mt-2 ${pct === 100 ? 'text-emerald-650' : pct >= 80 ? 'text-amber-650' : 'text-rose-500'}`}>
                      {pct}%
                    </p>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </Section>

      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Whistleblowing */}
        <div>
          <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3.5">Whistleblowing Case Tracking</h2>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100 p-5 shadow-xl shadow-slate-100/40">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={dynamicWhistleblowing} margin={{ top: 4, right: 8, left: -22, bottom: 0 }} barSize={10}>
                <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 500 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 500 }} allowDecimals={false} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomChartTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 10, color: '#64748b', fontWeight: 650 }} />
                <Bar dataKey="received" name="Received" fill="#3b82f6" radius={[3,3,0,0]} />
                <Bar dataKey="resolved" name="Resolved" fill="#10b981" radius={[3,3,0,0]} />
                <Bar dataKey="pending"  name="Pending"  fill="#ef4444" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Register */}
        <div>
          <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3.5">Key Risk Register</h2>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-xl shadow-slate-100/40 overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-5 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Identified Risk</th>
                  <th className="text-center px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Category</th>
                  <th className="text-center px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Risk Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {dynamicRisk.map(r => (
                  <tr key={r.risk} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5 font-semibold text-slate-800">{r.risk}</td>
                    <td className="px-4 py-3 text-center text-slate-500 font-semibold">{r.category}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9.5px] font-bold border ${riskLevelColor[r.level]}`}>
                        {r.level}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  )
}
