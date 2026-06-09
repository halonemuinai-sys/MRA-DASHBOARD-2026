import { Treemap, ResponsiveContainer, Tooltip } from 'recharts'
import { useApp } from '../../context/AppContext'
import { HelpCircle } from 'lucide-react'
import { Tooltip as ShadcnTooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const SEG_PALETTE = {
  Retail: { bg: '#3b82f6', light: '#eff6ff', text: '#1e40af', border: '#bfdbfe' },
  'F&B':  { bg: '#f97316', light: '#fff7ed', text: '#c2410c', border: '#ffedd5' },
  Media:  { bg: '#10b981', light: '#ecfdf5', text: '#047857', border: '#a7f3d0' },
  FnB:    { bg: '#f97316', light: '#fff7ed', text: '#c2410c', border: '#ffedd5' },
}

export default function RevenueTreemap() {
  const { filteredBrandPerformance, fmt, currency } = useApp()

  // Flat list of brands for clean, non-overlapping rendering
  const data = filteredBrandPerformance.map(b => ({
    name: b.brand,
    size: b.revenue,
    ebitda: b.ebitdaPct,
    yoy: b.yoyPct,
    segment: b.segment,
  }))

  const CustomContent = (props) => {
    const { x, y, width, height, name, value, payload, index } = props
    if (width < 34 || height < 24) return null

    const item = payload || {}
    const segment = item.segment || ''
    const size = value || item.size || 0
    const ebitda = item.ebitda || 0

    // Accent line color by segment
    const segmentColor = 
      segment === 'Retail' ? '#2563eb' : // Sapphire Blue
      (segment === 'F&B' || segment === 'FnB') ? '#ea580c' : // Coral Orange
      '#10b981' // Mint Green

    // Soft colored text for YTD Revenue to link values to their segment
    const textValColor = 
      segment === 'Retail' ? '#1d4ed8' :
      (segment === 'F&B' || segment === 'FnB') ? '#c2410c' :
      '#047857'

    return (
      <g className="cursor-pointer group">
        {/* Render definitions once */}
        {index === 0 && (
          <defs>
            <linearGradient id="cardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#f8fafc" />
            </linearGradient>
          </defs>
        )}

        {/* Card base with soft gray gradient */}
        <rect 
          x={x + 1} 
          y={y + 1} 
          width={width - 2} 
          height={height - 2} 
          fill="url(#cardGrad)" 
          stroke="#e2e8f0" 
          strokeWidth={1} 
          rx={8} 
          className="transition-all duration-300 group-hover:fill-slate-50/70"
        />

        {/* Colored left accent border (4px width) */}
        {width > 8 && (
          <rect 
            x={x + 1} 
            y={y + 1} 
            width={4} 
            height={height - 2} 
            fill={segmentColor} 
            rx={1.5}
          />
        )}

        {/* Text details inside rectangle */}
        {width > 45 && height > 35 ? (
          <>
            {/* Brand Name (Top-Left, offset by 12px) */}
            <text 
              x={x + 12} 
              y={y + 20} 
              fill="#1e293b" 
              fontSize={Math.max(9, Math.min(11, width / 7.5))} 
              fontWeight="800"
              className="font-sans"
            >
              {name}
            </text>

            {/* Revenue value (Bottom-Left, offset by 12px) */}
            <text 
              x={x + 12} 
              y={y + height - 10} 
              fill={textValColor} 
              fontSize={10} 
              fontWeight="700"
              className="font-sans font-bold tabular-nums"
            >
              {fmt(size, 'B')}
            </text>

            {/* EBITDA (Top-Right, if space allows) */}
            {width > 95 && height > 55 && (
              <text 
                x={x + width - 10} 
                y={y + 20} 
                textAnchor="end" 
                fill="#64748b" 
                fontSize={8.5} 
                fontWeight="700"
              >
                EBITDA {ebitda}%
              </text>
            )}
          </>
        ) : (
          /* Small rectangles only show first letter */
          width > 20 && height > 15 && (
            <text 
              x={x + (width/2) + 2} 
              y={y + height/2 + 4} 
              textAnchor="middle" 
              fill={segmentColor} 
              fontSize={9} 
              fontWeight="900"
            >
              {name[0]}
            </text>
          )
        )}
      </g>
    )
  }

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null
    const d = payload[0].payload
    const size = d.value || d.size || 0
    const name = d.name
    const segment = d.segment
    const ebitda = d.ebitda
    const yoy = d.yoy

    return (
      <div className="bg-white/95 backdrop-blur-sm border border-slate-200/60 rounded-2xl px-3.5 py-3 shadow-xl text-xs space-y-2">
        <div>
          <p className="font-bold text-slate-800">{name}</p>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">{segment === 'FnB' ? 'F&B' : segment}</p>
        </div>
        <div className="space-y-1 border-t border-slate-100 pt-2 text-[11px]">
          <div className="flex justify-between gap-4">
            <span className="text-slate-500 font-medium">Revenue YTD:</span>
            <span className="text-slate-800 font-bold">{fmt(size, 'B')}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-500 font-medium">EBITDA Margin:</span>
            <span className="text-emerald-600 font-bold">{ebitda}%</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-500 font-medium">YoY Growth:</span>
            <span className={`font-bold ${yoy >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {yoy > 0 ? '+' : ''}{yoy}%
            </span>
          </div>
        </div>
      </div>
    )
  }

  const unitStr = currency === 'USD' ? 'USD Million' : 'IDR Billion'

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100 p-5 shadow-xl shadow-slate-100/40">
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <h3 className="font-bold text-slate-800 text-sm">Revenue Breakdown — Treemap</h3>
            <TooltipProvider delayDuration={100}>
              <ShadcnTooltip>
                <TooltipTrigger asChild>
                  <button className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none">
                    <HelpCircle size={13} className="shrink-0" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="bg-slate-900 border-slate-800 text-white text-xs p-2.5 max-w-[245px] rounded-xl font-bold shadow-xl leading-normal">
                  Visualisasi kontribusi pendapatan bersih YTD per brand individu. Ukuran kotak sebanding dengan nominal pendapatan, dikelompokkan berdasarkan pilar bisnis segmen.
                </TooltipContent>
              </ShadcnTooltip>
            </TooltipProvider>
          </div>
          <p className="text-xs text-slate-400 font-medium mt-0.5">Area size proportional to YTD Revenue · {unitStr}</p>
        </div>
        <div className="flex gap-2.5 text-[10px] font-bold">
          {['Retail', 'F&B', 'Media'].map(seg => {
            const pal = SEG_PALETTE[seg === 'F&B' ? 'FnB' : seg]
            return (
              <span key={seg} className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ background: pal.bg }}></span>
                <span className="text-slate-500">{seg}</span>
              </span>
            )
          })}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <Treemap
          data={data}
          dataKey="size"
          aspectRatio={4/3}
          content={<CustomContent />}
        >
          <Tooltip content={<CustomTooltip />} />
        </Treemap>
      </ResponsiveContainer>
    </div>
  )
}
