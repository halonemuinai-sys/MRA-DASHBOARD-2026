import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Label, ZAxis
} from 'recharts'
import { useApp } from '../../context/AppContext'
import { HelpCircle } from 'lucide-react'
import { Tooltip as ShadcnTooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const SEG_COLOR = { Retail: '#3b82f6', 'F&B': '#f97316', Media: '#10b981', FnB: '#f97316' }

const CustomDot = (props) => {
  const { cx, cy, payload } = props
  // Circle size based on revenue
  const r = Math.max(12, Math.min(30, Math.sqrt(payload.revenue) * 1.5))
  const color = SEG_COLOR[payload.segment] || '#64748b'
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={color} fillOpacity={0.12} stroke={color} strokeWidth={1.8} className="transition-all duration-300 hover:fill-opacity-25" />
      <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle" fontSize={8} fill={color} fontWeight="700">
        {payload.brand.split(' ')[0]}
      </text>
    </g>
  )
}

export default function BrandScatter() {
  const { filteredBrandPerformance, fmt } = useApp()

  const data = filteredBrandPerformance.map(b => ({
    ...b,
    x: b.yoyPct,
    y: b.ebitdaPct,
  }))

  const segments = [...new Set(data.map(d => d.segment))]

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null
    const d = payload[0].payload
    return (
      <div className="bg-white/95 backdrop-blur-sm border border-slate-200/60 rounded-2xl px-4 py-3 shadow-xl text-xs space-y-2">
        <div>
          <p className="font-bold text-slate-800">{d.brand}</p>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">{d.segment}</p>
        </div>
        <div className="space-y-1 border-t border-slate-100 pt-2 text-[11px]">
          <div className="flex justify-between gap-4">
            <span className="text-slate-500 font-medium">Revenue YTD:</span>
            <span className="text-slate-800 font-bold">{fmt(d.revenue, 'B')}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-500 font-medium">EBITDA Margin:</span>
            <span className="text-emerald-600 font-bold">{d.ebitdaPct}%</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-500 font-medium">YoY Growth:</span>
            <span className={`font-bold ${d.yoyPct >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {d.yoyPct > 0 ? '+' : ''}{d.yoyPct}%
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100 p-5 shadow-xl shadow-slate-100/40">
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <h3 className="font-bold text-slate-800 text-sm">Brand Portfolio Matrix</h3>
            <TooltipProvider delayDuration={100}>
              <ShadcnTooltip>
                <TooltipTrigger asChild>
                  <button className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none">
                    <HelpCircle size={13} className="shrink-0" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="bg-slate-900 border-slate-800 text-white text-xs p-2.5 max-w-[245px] rounded-xl font-bold shadow-xl leading-normal">
                  Matriks portofolio yang memetakan kinerja pertumbuhan tahunan (YoY Growth%) terhadap profitabilitas (EBITDA Margin%) untuk seluruh brand grup.
                </TooltipContent>
              </ShadcnTooltip>
            </TooltipProvider>
          </div>
          <p className="text-xs text-slate-400 font-medium mt-0.5">YoY Growth% vs EBITDA Margin% · Circle size = Revenue</p>
        </div>
        <div className="flex gap-2.5 text-[10px] font-bold">
          {segments.map(s => (
            <span key={s} className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: SEG_COLOR[s] }}></span>
              <span className="text-slate-550 text-slate-500">{s === 'FnB' ? 'F&B' : s}</span>
            </span>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <ScatterChart margin={{ top: 8, right: 24, left: -12, bottom: 16 }}>
          <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" />
          <XAxis dataKey="x" type="number" name="YoY Growth" domain={[-15, 35]} tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 550 }} axisLine={false} tickLine={false}>
            <Label value="YoY Growth (%)" position="insideBottom" offset={-10} style={{ fontSize: 9, fill: '#94a3b8', fontWeight: 'bold' }} />
          </XAxis>
          <YAxis dataKey="y" type="number" name="EBITDA Margin" domain={[8, 30]} tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 550 }} axisLine={false} tickLine={false}>
            <Label value="EBITDA Margin (%)" angle={-90} position="insideLeft" offset={10} style={{ fontSize: 9, fill: '#94a3b8', fontWeight: 'bold' }} />
          </YAxis>
          <ZAxis range={[400, 400]} />
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '4 4', stroke: '#e2e8f0' }} />
          <Scatter data={data} shape={<CustomDot />} />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}
