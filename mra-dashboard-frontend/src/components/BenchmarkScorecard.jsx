import { segmentBenchmarks, kpiBenchmarks, brandBenchmarks, getTrafficLight, trafficLightClasses } from '../data/benchmarkData'
import { STATUS } from '../design/tokens'
import {
  TrendingUp, TrendingDown, DollarSign, Target, Users,
  Calendar, GraduationCap, Briefcase, Building2, CheckSquare,
  ShieldCheck, AlertTriangle, CheckCircle2, XCircle, Rocket, PieChart, LineChart, Award
} from 'lucide-react'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Cell, ReferenceLine, Tooltip as ReTooltip, CartesianGrid
} from 'recharts'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useApp } from '../context/AppContext'

const KPI_ICONS = {
  ebitdaMargin:     TrendingUp,
  netMargin:        DollarSign,
  budgetAchieve:    Target,
  revenueGrowth:    TrendingUp,
  turnover:         Users,
  attendance:       Calendar,
  training:         GraduationCap,
  empCost:          Briefcase,
  assetUtil:        Building2,
  vendorCompliance: CheckSquare,
  compliance:       ShieldCheck,
}

// ─── STATIC DATA (PERCENTAGE AND RATIOS - CURRENCY AGNOSTIC) ────────────────────
const kpiActuals = [
  { key: 'ebitdaMargin',     label: 'EBITDA Margin',   actual: 12.5, bench: kpiBenchmarks.ebitdaMargin,      unit: '%',     color: 'green' },
  { key: 'netMargin',        label: 'Net Margin',      actual:  8.4, bench: kpiBenchmarks.netMargin,         unit: '%',     color: 'amber' },
  { key: 'budgetAchieve',    label: 'vs Budget',       actual: 100.8,bench: kpiBenchmarks.budgetAchievement, unit: '%',     color: 'blue' },
  { key: 'revenueGrowth',    label: 'Revenue YoY',     actual: 14.2, bench: kpiBenchmarks.groupRevenue,      unit: '%',     color: 'sky' },
  { key: 'turnover',         label: 'Turnover Rate',   actual:  8.2, bench: kpiBenchmarks.turnoverRate,      unit: '%',     color: 'rose' },
  { key: 'attendance',       label: 'Attendance',      actual: 94.5, bench: kpiBenchmarks.attendanceRate,    unit: '%',     color: 'teal' },
  { key: 'training',         label: 'Training KPI',    actual: 87.5, bench: kpiBenchmarks.trainingCompletion,unit: '%',     color: 'teal' },
  { key: 'empCost',          label: 'Emp Cost Ratio',  actual: 16.4, bench: kpiBenchmarks.empCostRatio,     unit: '%',     color: 'rose' },
  { key: 'assetUtil',        label: 'Asset Util.',     actual: 87.0, bench: kpiBenchmarks.assetUtilization,  unit: '%',     color: 'cyan' },
  { key: 'vendorCompliance', label: 'Vendor Comply',   actual: 91.2, bench: kpiBenchmarks.vendorCompliance,  unit: '%',     color: 'teal' },
  { key: 'compliance',       label: 'Compliance',      actual: 90.1, bench: kpiBenchmarks.overallCompliance, unit: '%',     color: 'blue' },
]

const segmentActuals = {
  Retail: { grossMarginPct: 28.5, ebitdaMarginPct: 23.2, netMarginPct: 12.8, rentalRatio: 9.2, revPerSqm: 1270, sssg: 14.5 },
  FnB:    { grossMarginPct: 61.2, ebitdaMarginPct: 17.1, netMarginPct:  8.4, rentalRatio: 12.8,foodCostRatio: 28.5, laborCostRatio: 23.2 },
  Media:  { grossMarginPct: 38.5, ebitdaMarginPct: 13.2, netMarginPct:  6.8, utilizationRate: 73.0, revPerEmployee: 520, clientRetention: 72.0 },
}

// Radar data — normalize to % of target (100 = at target)
const radarData = [
  { metric: 'EBITDA%',    Retail: 116, FnB: 114, Media: 94  },
  { metric: 'Net Margin', Retail: 107, FnB: 105, Media: 97  },
  { metric: 'Gross Margin',Retail: 63, FnB: 102, Media: 96  },
  { metric: 'Rental',     Retail: 109, FnB: 96,  Media: 100 },
  { metric: 'Growth',     Retail: 145, FnB: 113, Media: 72  },
]

// ─── SUB COMPONENTS ───────────────────────────────────────────────────────────
const StatusIcon = ({ light, size = 14 }) => {
  if (light === 'green')  return <CheckCircle2  size={size} className="text-emerald-500 shrink-0" />
  if (light === 'yellow') return <AlertTriangle size={size} className="text-amber-500 shrink-0"  />
  return <XCircle size={size} className="text-rose-500 shrink-0" />
}

function KpiVisualCard({ item }) {
  const { key, label, actual, bench, unit, color } = item
  const light = getTrafficLight(actual, bench)
  const s     = STATUS[light] || STATUS.gray
  const target = bench.target || bench.min || 0
  const diff   = actual - target
  const isPos  = diff > 0
  const lowerIsBetter = bench.lowerIsBetter
  const Icon = KPI_ICONS[key] || CheckSquare

  // bar: how full relative to target
  const maxVal = lowerIsBetter ? Math.max(actual, target) * 1.4 : Math.max(actual, target) * 1.3
  const actualPct = Math.min(100, (actual / maxVal) * 100)
  const targetPct = Math.min(100, (target / maxVal) * 100)

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={`bg-white/90 backdrop-blur-sm rounded-2xl p-4 cursor-pointer border border-slate-100 hover:border-slate-200/80 hover:shadow-xl hover:-translate-y-1 transform duration-300 flex flex-col justify-between`}>
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className={`w-7 h-7 rounded-xl flex items-center justify-center bg-slate-50 border border-slate-100/30`}>
              <Icon size={13} className="text-slate-500" />
            </div>
            <StatusIcon light={light} size={14} />
          </div>

          {/* Value */}
          <div>
            <div className={`text-2xl font-black text-slate-800 tracking-tight mb-0.5`}>{actual}{unit}</div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-3">{label}</p>
          </div>

          {/* Mini gauge */}
          <div>
            <div className="relative w-full h-1.5 bg-slate-100 rounded-full mb-2.5">
              <div className="h-1.5 rounded-full transition-all duration-500" style={{ width: `${actualPct}%`, background: s.hex }} />
              <div className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-slate-400 border border-white rounded-full shadow"
                style={{ left: `${targetPct}%`, transform: 'translate(-50%, -50%)' }} />
            </div>

            {/* Diff */}
            <div className={`text-[9.5px] font-bold flex items-center gap-0.5 ${
              (isPos && !lowerIsBetter) || (!isPos && lowerIsBetter) ? 'text-emerald-600' : 'text-rose-500'
            }`}>
              {isPos ? <TrendingUp size={10}/> : <TrendingDown size={10}/>}
              {isPos ? '+' : ''}{diff.toFixed(1)}{unit} vs target {target}{unit}
            </div>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent side="top" className="text-xs max-w-xs text-center bg-slate-900 border-0 text-white rounded-xl p-3 shadow-lg">
        <p className="font-bold mb-1">{label}</p>
        <p className="text-slate-400 text-[10px] leading-relaxed">{bench.note}</p>
      </TooltipContent>
    </Tooltip>
  )
}

const tickAnimationStyle = `
  @keyframes float-icon {
    0%, 100% { 
      transform: translateY(0px) scale(1); 
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
    }
    50% { 
      transform: translateY(-6px) scale(1.05); 
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
    }
  }
  .animate-icon-float {
    animation: float-icon 3.5s ease-in-out infinite;
  }
  .icon-delay-0 { animation-delay: 0s; }
  .icon-delay-1 { animation-delay: 0.7s; }
  .icon-delay-2 { animation-delay: 1.4s; }
  .icon-delay-3 { animation-delay: 2.1s; }
  .icon-delay-4 { animation-delay: 2.8s; }
`;

const CustomAngleTick = (props) => {
  const { x, y, cx, cy, payload, index } = props;
  if (!payload) return null;

  const value = payload.value;
  
  // Calculate angle from center to coordinate to compute offset direction
  const angle = Math.atan2(y - cy, x - cx);
  const offsetRadius = 10; // Offset outward from radar boundary
  const targetX = x + Math.cos(angle) * offsetRadius;
  const targetY = y + Math.sin(angle) * offsetRadius;

  const config = {
    'EBITDA%': { icon: LineChart, color: 'text-blue-600', bg: 'bg-blue-50/90', border: 'border-blue-100/40' },
    'Net Margin': { icon: DollarSign, color: 'text-amber-600', bg: 'bg-amber-50/90', border: 'border-amber-100/40' },
    'Gross Margin': { icon: PieChart, color: 'text-emerald-600', bg: 'bg-emerald-50/90', border: 'border-emerald-100/40' },
    'Rental': { icon: Building2, color: 'text-rose-600', bg: 'bg-rose-50/90', border: 'border-rose-100/40' },
    'Growth': { icon: Rocket, color: 'text-sky-600', bg: 'bg-sky-50/90', border: 'border-sky-100/40' }
  }[value] || { icon: Target, color: 'text-slate-550', bg: 'bg-slate-50', border: 'border-slate-100' };

  const IconComponent = config.icon;
  const boxWidth = 90;
  const boxHeight = 65;
  const fx = targetX - boxWidth / 2;
  const fy = targetY - boxHeight / 2 - 8; // Centering correction

  return (
    <foreignObject x={fx} y={fy} width={boxWidth} height={boxHeight} className="overflow-visible">
      <div className="flex flex-col items-center justify-center space-y-1 select-none">
        {/* Bobbing floating animated circle icon */}
        <div className={`w-7 h-7 rounded-full flex items-center justify-center ${config.bg} ${config.border} border shadow-sm transition-all duration-350 hover:scale-115 hover:rotate-6 cursor-pointer group/angle-icon animate-icon-float icon-delay-${index}`}>
          <IconComponent className={`w-3.5 h-3.5 ${config.color} transition-transform duration-250 group-hover/angle-icon:scale-110`} />
        </div>
        {/* Label text */}
        <span className="text-[9.5px] font-black text-slate-700 tracking-tight leading-none bg-white/80 px-1 rounded shadow-[0_1px_3px_rgba(0,0,0,0.02)] border border-slate-50/30">
          {value}
        </span>
      </div>
    </foreignObject>
  );
};

const SEG_COLOR = { Retail: '#3b82f6', FnB: '#f97316', Media: '#10b981' }
const RADAR_COLOR = { Retail: '#3b82f6', FnB: '#f97316', Media: '#10b981' }

const CustomBarTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  const diff = d.actual - d.target
  return (
    <div className="bg-white/95 backdrop-blur-sm border border-slate-200/60 rounded-2xl px-3.5 py-3 shadow-xl text-xs">
      <p className="font-bold text-slate-800 mb-0.5">{d.full}</p>
      <p className="text-slate-400 font-medium text-[10px] uppercase tracking-wider mb-2">{d.segment}</p>
      <div className="space-y-1 border-t border-slate-100 pt-2">
        <div className="flex justify-between gap-4">
          <span className="text-slate-500 font-medium">EBITDA:</span>
          <span className="text-slate-800 font-bold">{d.actual}%</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-500 font-medium">Target:</span>
          <span className="text-slate-600 font-bold">{d.target}%</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-500 font-medium">Variance:</span>
          <span className={`font-bold ${diff >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
            {diff >= 0 ? '+' : ''}{diff.toFixed(1)}%
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-500 font-medium">YoY Growth:</span>
          <span className={`font-bold ${d.yoy >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
            {d.yoy > 0 ? '+' : ''}{d.yoy}%
          </span>
        </div>
      </div>
    </div>
  )
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function BenchmarkScorecard() {
  const { filteredBrandPerformance } = useApp()

  // Dynamically filter bar chart based on selected brands
  const brandBar = filteredBrandPerformance.map(b => ({
    name:   b.brand.split(' ')[0],
    full:   b.brand,
    actual: b.ebitdaPct,
    target: brandBenchmarks[b.brand]?.ebitdaMarginTarget || 18,
    segment: b.segment,
    yoy:    b.yoyPct,
  }))

  const greenCount  = kpiActuals.filter(k => getTrafficLight(k.actual, k.bench) === 'green').length
  const yellowCount = kpiActuals.filter(k => getTrafficLight(k.actual, k.bench) === 'yellow').length
  const redCount    = kpiActuals.filter(k => getTrafficLight(k.actual, k.bench) === 'red').length
  const totalKpi    = kpiActuals.length
  const overallPct  = Math.round((greenCount + yellowCount * 0.5) / totalKpi * 100)

  return (
    <TooltipProvider>
    <div className="space-y-6">
      <style dangerouslySetInnerHTML={{ __html: tickAnimationStyle }} />

      {/* ── Row 1: Overall Score + KPI visual grid ── */}
      <div className="grid grid-cols-4 gap-6">

        {/* Overall Score Card */}
        <div className="bg-slate-950 border border-slate-900 rounded-3xl p-5 flex flex-col justify-between text-white shadow-xl shadow-slate-950/40 relative overflow-hidden group">
          {/* Subtle multi-colored glow backgrounds */}
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl transition-opacity group-hover:opacity-80" />
          <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl transition-opacity group-hover:opacity-80" />
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-900/60 pb-3">
            <div>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Performance Index</p>
              <p className="text-slate-500 text-[9px] font-bold mt-0.5">Indonesia Benchmark</p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 shadow-inner shadow-black/40">
              <Award size={15} className="animate-pulse" />
            </div>
          </div>

          {/* Premium Radial Gauge Ring */}
          <div className="relative flex flex-col items-center justify-center py-5 my-1">
            {/* SVG Ring */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                {/* Background Ring Track */}
                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  className="stroke-slate-900"
                  strokeWidth="8"
                  fill="transparent"
                />
                {/* Progress Ring with Gradient & Shadow */}
                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  className="transition-all duration-1000 ease-out"
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 48}
                  strokeDashoffset={(2 * Math.PI * 48) - (overallPct / 100) * (2 * Math.PI * 48)}
                  strokeLinecap="round"
                  fill="transparent"
                  style={{
                    stroke: 'url(#overallScoreGrad)',
                    filter: 'drop-shadow(0 0 4px rgba(16, 185, 129, 0.35))'
                  }}
                />
                <defs>
                  <linearGradient id="overallScoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="50%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>
              {/* Central Text */}
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-black tracking-tight text-white leading-none">{overallPct}%</span>
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">Score YTD</span>
              </div>
            </div>

            {/* Performance Level Badge */}
            <div className={`mt-3 px-3 py-1 rounded-full text-[9px] font-black tracking-wider border shadow-sm ${
              overallPct >= 85 ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
              overallPct >= 70 ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' :
              'text-rose-400 bg-rose-500/10 border-rose-500/20'
            }`}>
              STATUS: {overallPct >= 85 ? 'OPTIMAL' : overallPct >= 70 ? 'STABLE' : 'ACTION REQUIRED'}
            </div>
          </div>

          {/* Traffic light glassmorphism summary */}
          <div className="grid grid-cols-3 gap-1.5 pt-3 border-t border-slate-900/60">
            {[
              { label: 'On Target', count: greenCount,  bg: 'bg-emerald-500/5', border: 'border-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-500' },
              { label: 'Warning',   count: yellowCount, bg: 'bg-amber-400/5', border: 'border-amber-400/10', text: 'text-amber-400', dot: 'bg-amber-400'   },
              { label: 'Below',     count: redCount,    bg: 'bg-rose-500/5', border: 'border-rose-500/10', text: 'text-rose-400', dot: 'bg-rose-500'     },
            ].map(s => (
              <div key={s.label} className={`border ${s.border} ${s.bg} rounded-xl py-2 px-1 text-center transition-all duration-300 hover:scale-[1.03] hover:bg-slate-900/40 cursor-default`}>
                <div className="flex items-center justify-center gap-1 mb-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${s.dot} shadow-[0_0_4px_currentColor] animate-pulse`} />
                  <span className="text-slate-500 text-[8px] font-bold uppercase tracking-wider">{s.label}</span>
                </div>
                <p className={`text-base font-black leading-none ${s.text}`}>{s.count}</p>
              </div>
            ))}
          </div>

          <p className="text-slate-600 text-[9px] font-semibold text-center mt-3">
            Hover individual cards to drill down metric details.
          </p>
        </div>

        {/* KPI visual cards — grid */}
        <div className="col-span-3 grid grid-cols-4 gap-4">
          {kpiActuals.map(item => (
            <KpiVisualCard key={item.key} item={item} />
          ))}
        </div>
      </div>

      {/* ── Row 2: Radar (segment health) + Brand EBITDA bar ── */}
      <div className="grid grid-cols-2 gap-6">

        {/* Radar Chart — segment vs target (Upgraded and Compact) */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-slate-100 p-5 shadow-xl shadow-slate-100/40 relative flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex justify-between items-start gap-4 mb-4">
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm leading-tight">Segment Health vs Target</h3>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5">Normalized index: 100 = target threshold</p>
              </div>
              <div className="flex gap-2 text-[9px] font-bold">
                {Object.entries(RADAR_COLOR).map(([seg, color]) => (
                  <span key={seg} className="flex items-center gap-1 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded-lg">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                    <span className="text-slate-500">{seg === 'FnB' ? 'F&B' : seg}</span>
                  </span>
                ))}
              </div>
            </div>



            {/* Radar Chart (Enlarged) */}
            <div className="flex justify-center h-[360px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius="68%" data={radarData.map(d => ({ ...d, Target: 100 }))} margin={{ top: 35, right: 35, bottom: 35, left: 35 }}>
                  <PolarGrid stroke="#cbd5e1" opacity={0.25} />
                  <PolarAngleAxis dataKey="metric" tick={<CustomAngleTick />} />
                  <Radar name="Retail" dataKey="Retail" stroke={RADAR_COLOR.Retail} fill={RADAR_COLOR.Retail} fillOpacity={0.06} strokeWidth={2} />
                  <Radar name="F&B"    dataKey="FnB"    stroke={RADAR_COLOR.FnB}    fill={RADAR_COLOR.FnB}    fillOpacity={0.06} strokeWidth={2} />
                  <Radar name="Media"  dataKey="Media"  stroke={RADAR_COLOR.Media}  fill={RADAR_COLOR.Media}  fillOpacity={0.06} strokeWidth={2} />
                  <Radar name="Target Threshold" dataKey="Target" stroke="#475569" fill="none" strokeWidth={1.5} strokeDasharray="4 4" />
                  <ReTooltip
                    formatter={(v, name) => [`${v}% of target`, name === 'FnB' ? 'F&B' : name]}
                    contentStyle={{
                      fontSize: 10,
                      borderRadius: 12,
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bottom Grid (5 Cards) */}
          <div className="grid grid-cols-5 gap-1.5 pt-3 border-t border-slate-100/80">
            {[
              { name: 'EBITDA%', sub: 'Strong performance', value: 108, status: 'Above', statusStyle: 'bg-emerald-50 text-emerald-600 border-emerald-100/50 font-semibold', icon: LineChart, iconStyle: 'bg-blue-50 text-blue-600 border border-blue-100/20' },
              { name: 'Net Margin', sub: 'On target', value: 96, status: 'Slightly', statusStyle: 'bg-amber-50 text-amber-600 border-amber-100/50 font-semibold', icon: DollarSign, iconStyle: 'bg-amber-50 text-amber-600 border border-amber-100/20' },
              { name: 'Gross Margin', sub: 'On target', value: 102, status: 'Above', statusStyle: 'bg-emerald-50 text-emerald-600 border-emerald-100/50 font-semibold', icon: PieChart, iconStyle: 'bg-emerald-50 text-emerald-600 border border-emerald-100/20' },
              { name: 'Rental', sub: 'Below target', value: 88, status: 'Below', statusStyle: 'bg-rose-50 text-rose-600 border-rose-100/50 font-semibold', icon: Building2, iconStyle: 'bg-rose-50 text-rose-600 border border-rose-100/20' },
              { name: 'Growth', sub: 'Outperforming', value: 128, status: 'Well Above', statusStyle: 'bg-emerald-50 text-emerald-600 border-emerald-100/50 font-semibold', icon: Rocket, iconStyle: 'bg-sky-50 text-sky-600 border border-sky-100/20' }
            ].map(item => {
              const Icon = item.icon
              return (
                <div key={item.name} className="bg-white border border-slate-50 rounded-xl p-2 flex flex-col justify-between hover:shadow-sm transition-all duration-300">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${item.iconStyle} shrink-0`}>
                      <Icon size={11} />
                    </div>
                    <div className="truncate">
                      <h4 className="font-extrabold text-slate-800 text-[9px] leading-tight truncate">{item.name}</h4>
                      <span className="text-[7.5px] text-slate-400 font-bold block leading-none truncate">{item.sub}</span>
                    </div>
                  </div>
                  <div className={`mt-2.5 flex items-center justify-between p-1 rounded-lg border ${item.statusStyle}`}>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-white/95 shadow-sm text-slate-800 leading-none">{item.value}</span>
                    <span className="text-[7px] font-extrabold uppercase tracking-wider truncate ml-0.5">{item.status}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Brand EBITDA vs Target bar chart */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-slate-100 p-5 shadow-xl shadow-slate-100/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">EBITDA Margin per Brand</h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Actual vs benchmark targets</p>
              </div>
              <div className="flex gap-2 text-[10px] font-bold">
                <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-150"><span className="w-4 h-px border-t border-dashed border-slate-450 inline-block"></span> Target</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={380}>
              <BarChart data={brandBar} margin={{ top: 8, right: 8, left: -22, bottom: 0 }} barSize={16}>
                <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 500 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 500 }} axisLine={false} tickLine={false} domain={[0, 32]} />
                <ReTooltip content={<CustomBarTooltip />} cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="actual" radius={[3,3,0,0]}>
                  {brandBar.map((b, i) => {
                    const light = getTrafficLight(b.actual, { target: b.target, min: b.target * 0.85 })
                    const color = light === 'green' ? '#10b981' : light === 'yellow' ? '#f59e0b' : '#ef4444'
                    return <Cell key={i} fill={color} />
                  })}
                </Bar>
                <ReferenceLine y={18} stroke="#94a3b8" strokeDasharray="4 4" strokeWidth={1}
                  label={{ value: 'Avg Target (18%)', position: 'right', fontSize: 9, fill: '#94a3b8', fontWeight: 'bold' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Row 3: Segment KPI visual strips ── */}
      <div className="grid grid-cols-3 gap-6">
        {Object.entries(segmentBenchmarks).map(([seg, bench]) => {
            const actuals = segmentActuals[seg] || {}
            const metrics = Object.entries(bench).filter(([k]) => k !== 'label')
            const total    = metrics.filter(([k]) => actuals[k] !== undefined).length
            const score    = metrics.reduce((acc, [k, b]) => {
              if (actuals[k] === undefined) return acc
              const l = getTrafficLight(actuals[k], b)
              return acc + (l === 'green' ? 1 : l === 'yellow' ? 0.5 : 0)
            }, 0)
            const passing  = Math.round(score / total * 100)

            return (
              <div key={seg} className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-xl shadow-slate-100/40 overflow-hidden hover:border-slate-200/80 transition-all duration-300 flex flex-col justify-between">
                {/* Segment header */}
                <div>
                  <div className="px-5 py-4 flex items-center justify-between"
                    style={{ borderBottom: `3px solid ${SEG_COLOR[seg]}` }}>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{bench.label}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{total} metrics</p>
                    </div>
                    <div className="text-2xl font-black" style={{ color: SEG_COLOR[seg] }}>
                      {passing}%
                    </div>
                  </div>

                  {/* Metric rows — visual only */}
                  <div className="p-5 space-y-3.5">
                    {metrics.map(([metricKey, metricBench]) => {
                      const actual = actuals[metricKey]
                      if (actual === undefined) return null
                      const light = getTrafficLight(actual, metricBench)
                      const s     = STATUS[light] || STATUS.gray
                      const target = metricBench.target
                      const maxVal = metricBench.lowerIsBetter
                        ? Math.max(actual, metricBench.max || target) * 1.3
                        : Math.max(actual, target) * 1.3
                      const pct       = Math.min(100, actual / maxVal * 100)
                      const targetPct = Math.min(100, target  / maxVal * 100)

                      const labelText = {
                        grossMarginPct: 'Gross Margin',
                        ebitdaMarginPct: 'EBITDA Margin',
                        netMarginPct: 'Net Margin',
                        rentalRatio: 'Rental Ratio',
                        revPerSqm: 'Rev / m²',
                        inventoryDays: 'Inventory Days',
                        sssg: 'SSSG',
                        foodCostRatio: 'Food Cost Ratio',
                        laborCostRatio: 'Labor Cost Ratio',
                        revPerSeat: 'Rev / Seat',
                        utilizationRate: 'Utilization Rate',
                        revPerEmployee: 'Rev / Employee',
                        clientRetention: 'Client Retention',
                        receivableDays: 'Receivable Days'
                      }[metricKey] || metricKey

                      return (
                        <Tooltip key={metricKey}>
                          <TooltipTrigger className="w-full text-left cursor-default">
                            <div>
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="text-xs text-slate-700 font-bold truncate">
                                  {labelText}
                                </span>
                                <div className="flex items-center gap-1.5">
                                  <StatusIcon light={light} size={11} />
                                  <span className={`text-xs font-black ${s.text}`}>{actual}{metricBench.unit}</span>
                                </div>
                              </div>
                              <div className="relative w-full h-1.5 bg-slate-100 rounded-full">
                                <div className="h-1.5 rounded-full transition-all duration-555" style={{ width: `${pct}%`, background: s.hex }} />
                                <div className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-slate-400 border border-white rounded-full shadow"
                                  style={{ left: `${targetPct}%`, transform: 'translate(-50%, -50%)' }} />
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="text-xs max-w-xs bg-slate-900 border-0 text-white rounded-xl p-3 shadow-lg">
                            <p className="font-bold mb-1">Target: {target}{metricBench.unit}</p>
                            <p className="text-slate-400 text-[10px] leading-relaxed">{metricBench.note}</p>
                          </TooltipContent>
                        </Tooltip>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </TooltipProvider>
  )
}
