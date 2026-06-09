import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts'
import { useApp } from '../../context/AppContext'
import { HelpCircle } from 'lucide-react'
import { Tooltip as ShadcnTooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

// Builds cumulative waterfall from P&L items
function buildWaterfall(items) {
  let running = 0
  return items.map(item => {
    const isTotal = item.isTotal
    const value = item.value
    if (isTotal) {
      running = value // reset running to the subtotal/total value
      return { ...item, start: 0, end: value, bar: Math.abs(value), running: value }
    }
    const start = value < 0 ? running + value : running
    const bar = Math.abs(value)
    running += value
    return { ...item, start, bar, running }
  })
}

const BASE_WATERFALL_ITEMS = [
  { name: 'Net Rev',      value: 1738, isTotal: true },
  { name: 'COGS',         value: -1285 },
  { name: 'Gross Profit', value: 453,  isTotal: true },
  { name: 'Payroll',      value: -118 },
  { name: 'Rental',       value: -52  },
  { name: 'Marketing',    value: -28  },
  { name: 'G&A',          value: -22  },
  { name: 'D&A',          value: -15  },
  { name: 'EBITDA',       value: 218,  isTotal: true },
  { name: 'Interest',     value: -28  },
  { name: 'Tax',          value: -44  },
  { name: 'Net Profit',   value: 146,  isTotal: true },
]

export default function WaterfallChart() {
  const { scaleRatio, fmt, currency } = useApp()

  // Dynamic items scaled by the selected segment/brand
  const scaledItems = BASE_WATERFALL_ITEMS.map(item => ({
    ...item,
    value: parseFloat((item.value * scaleRatio).toFixed(1))
  }))

  const data = buildWaterfall(scaledItems)

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null
    const d = payload[0]?.payload
    return (
      <div className="bg-white/95 backdrop-blur-sm border border-slate-200/60 rounded-2xl px-3.5 py-3 shadow-xl text-xs">
        <p className="font-bold text-slate-800 mb-1.5">{d?.name}</p>
        <p className={`font-black text-sm mb-1 ${d?.value >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
          {d?.value >= 0 ? '+' : ''}{fmt(d?.value, 'B')}
        </p>
        {!d?.isTotal && <p className="text-slate-400 font-medium">Accumulated: {fmt(d?.running, 'B')}</p>}
      </div>
    )
  }

  const unitStr = currency === 'USD' ? 'USD Million' : 'IDR Billion'

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100 p-5 shadow-xl shadow-slate-100/40">
      <div className="mb-4">
        <div className="flex items-center gap-1.5 mb-0.5">
          <h3 className="font-bold text-slate-800 text-sm">P&L Bridge — Revenue to Net Profit</h3>
          <TooltipProvider delayDuration={100}>
            <ShadcnTooltip>
              <TooltipTrigger asChild>
                <button className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none">
                  <HelpCircle size={13} className="shrink-0" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="bg-slate-900 border-slate-800 text-white text-xs p-2.5 max-w-[245px] rounded-xl font-bold shadow-xl leading-normal">
                Visualisasi jembatan air terjun (Waterfall) dari pendapatan bersih menuju laba bersih setelah dikurangi harga pokok penjualan dan seluruh komponen biaya.
              </TooltipContent>
            </ShadcnTooltip>
          </TooltipProvider>
        </div>
        <p className="text-xs text-slate-400 font-medium mt-0.5">Waterfall breakdown YTD 2026 · {unitStr}</p>
      </div>
      <div className="flex gap-4 mb-4 text-[10px] font-bold">
        <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100"><span className="w-2.5 h-2.5 rounded bg-blue-500/80 inline-block"></span>Total / Subtotal</span>
        <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100"><span className="w-2.5 h-2.5 rounded bg-emerald-500/80 inline-block"></span>Gains</span>
        <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100"><span className="w-2.5 h-2.5 rounded bg-rose-500/80 inline-block"></span>Expenses</span>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 8, right: 8, left: -22, bottom: 0 }} barCategoryGap="16%">
          <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 550 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
          {/* Invisible base bar to float the visible bar */}
          <Bar dataKey="start" stackId="a" fill="transparent" />
          <Bar dataKey="bar" stackId="a" radius={[3, 3, 0, 0]}>
            {data.map((d, i) => (
              <Cell
                key={i}
                fill={d.isTotal ? '#3b82f6' : d.value < 0 ? '#fca5a5' : '#bbf7d0'}
                stroke={d.isTotal ? '#2563eb' : d.value < 0 ? '#ef4444' : '#10b981'}
                strokeWidth={1}
                fillOpacity={0.8}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
