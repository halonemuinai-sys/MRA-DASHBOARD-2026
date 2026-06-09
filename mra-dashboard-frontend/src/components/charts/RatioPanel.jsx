import { ratioBenchmarks, getTrafficLight } from '../../data/benchmarkData'
import { STATUS, TYPE, LAYOUT } from '../../design/tokens'
import { TrendingUp, TrendingDown, Info } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const RATIO_DEFINITIONS = {
  grossMargin: 'Mengukur persentase laba kotor yang dihasilkan dari penjualan bersih setelah dikurangi harga pokok penjualan (COGS). Rumus: Laba Kotor / Pendapatan.',
  ebitdaMargin: 'Mengukur profitabilitas operasional inti sebelum bunga, pajak, depresiasi, dan amortisasi. Rumus: EBITDA / Pendapatan.',
  netMargin: 'Mengukur persentase laba bersih setelah dikurangi semua biaya operasional, bunga, pajak, dan beban lainnya. Rumus: Laba Bersih / Pendapatan.',
  roa: 'Return on Assets - Mengukur kemampuan perusahaan menghasilkan laba dari pemanfaatan total asetnya. Rumus: Laba Bersih / Total Aset.',
  currentRatio: 'Mengukur kemampuan perusahaan melunasi kewajiban jangka pendek menggunakan aset lancar. Rumus: Aset Lancar / Liabilitas Jangka Pendek.',
  quickRatio: 'Mengukur kemampuan melunasi kewajiban jangka pendek dengan aset paling likuid (tanpa persediaan/inventory). Rumus: (Aset Lancar - Persediaan) / Liabilitas Jangka Pendek.',
  cashRatio: 'Rasio likuiditas paling konservatif, mengukur kas dan setara kas yang tersedia untuk melunasi utang lancar. Rumus: Kas & Setara Kas / Liabilitas Jangka Pendek.',
  dso: 'Days Sales Outstanding - Rata-rata waktu (dalam hari) yang dibutuhkan perusahaan untuk menagih piutang dari pelanggan setelah penjualan selesai.',
  dio: 'Days Inventory Outstanding - Rata-rata waktu (dalam hari) persediaan barang tersimpan di gudang sebelum akhirnya terjual ke pelanggan.',
  dpo: 'Days Payable Outstanding - Rata-rata waktu (dalam hari) yang diambil perusahaan untuk melunasi kewajiban/utang dagang kepada supplier.',
  ccc: 'Cash Conversion Cycle - Siklus Konversi Kas. Mengukur berapa lama kas tertahan di persediaan dan piutang sebelum cair kembali. Rumus: DSO + DIO - DPO.',
  debtEquity: 'Debt-to-Equity Ratio - Mengukur proporsi pendanaan utang dibandingkan ekuitas pemegang saham. Rumus: Total Utang / Total Ekuitas.',
  icr: 'Interest Coverage Ratio - Mengukur kapasitas perusahaan dalam membayar bunga atas utang berjalan menggunakan laba operasionalnya. Rumus: EBIT / Beban Bunga.',
}

const baseActuals = {
  grossMargin:  26.1, ebitdaMargin: 12.5, netMargin: 8.4,  roa: 9.2,
  currentRatio: 1.82, quickRatio:  1.24,  cashRatio: 0.68,
  dso: 22, dio: 89, dpo: 38, ccc: 73,
  debtEquity:   0.42, icr: 7.8,
}

const baseTrends = {
  grossMargin: +2.1, ebitdaMargin: +1.8, netMargin: +1.3, roa: +0.8,
  currentRatio:+0.12,quickRatio: +0.05, cashRatio: -0.04,
  dso: -3, dio: +5, dpo: +2, ccc: 0,
  debtEquity: -0.05, icr: +0.6,
}

const groups = [
  { title: 'Profitability', keys: ['grossMargin','ebitdaMargin','netMargin','roa'] },
  { title: 'Liquidity',     keys: ['currentRatio','quickRatio','cashRatio'] },
  { title: 'Efficiency',    keys: ['dso','dio','dpo','ccc'] },
  { title: 'Leverage',      keys: ['debtEquity','icr'] },
]

function GaugeBar({ actual, bench, light }) {
  const { target, lowerIsBetter } = bench
  const maxVal = lowerIsBetter ? (bench.max || target * 2) : (target * 1.4)
  const pct       = Math.min(100, Math.max(0, (actual  / maxVal) * 100))
  const targetPct = Math.min(100,             (target  / maxVal) * 100)
  const s = STATUS[light] || STATUS.gray

  return (
    <div className="mt-1.5">
      <div className="w-full bg-slate-100/80 border border-slate-200/20 rounded-full h-1.5 relative">
        <div className="h-1.5 rounded-full transition-all duration-550" style={{ width: `${pct}%`, background: s.hex }} />
        <div className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-slate-400 border border-white rounded-full shadow"
          style={{ left: `${targetPct}%`, transform: 'translate(-50%, -50%)' }} title={`Target: ${target}${bench.unit}`} />
      </div>
      <p className={`${TYPE.micro} text-slate-400 font-bold mt-1 text-right`}>target {target}{bench.unit}</p>
    </div>
  )
}

function RatioRow({ ratioKey, dynamicActual }) {
  const bench  = ratioBenchmarks[ratioKey]
  const actual = dynamicActual
  const trend  = baseTrends[ratioKey]
  const light  = getTrafficLight(actual, bench)
  const s      = STATUS[light] || STATUS.gray
  const isPos  = trend > 0
  const trendGood = bench.lowerIsBetter ? !isPos : isPos

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={`p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:-translate-y-0.5 transform transition-all duration-300 cursor-pointer ${s.bg}`}>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full shrink-0 ${s.dot}`} />
              <p className={`${TYPE.body} font-bold text-slate-700`}>{bench.label}</p>
            </div>
            <div className="flex items-center gap-1.5">
              {trend !== 0 && (
                <span className={`${TYPE.micro} font-bold flex items-center gap-0.5 ${trendGood ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {isPos ? <TrendingUp size={9}/> : <TrendingDown size={9}/>}
                  {isPos ? '+' : ''}{Math.abs(trend)}{bench.unit}
                </span>
              )}
              <span className={`text-xs font-black ${s.text}`}>{actual}{bench.unit}</span>
            </div>
          </div>
          <GaugeBar actual={actual} bench={bench} light={light} />
          <p className={`${TYPE.micro} text-slate-400 font-medium mt-1 leading-normal`}>{bench.context}</p>
        </div>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs text-xs p-3 bg-slate-900 border-0 text-white rounded-xl shadow-lg leading-relaxed">
        <p className="font-bold mb-1">{bench.label}</p>
        <p className="text-slate-300 text-[10.5px] font-medium leading-relaxed">{RATIO_DEFINITIONS[ratioKey]}</p>
      </TooltipContent>
    </Tooltip>
  )
}

export default function RatioPanel() {
  const { filteredKpis, filteredRatios } = useApp()
  const k = filteredKpis

  // Calculate dynamic actual values for ratios based on app context
  const dynamicActuals = {
    ...baseActuals,
    ...filteredRatios,
    grossMargin: k.grossProfit.pctRevenue || baseActuals.grossMargin,
    ebitdaMargin: k.ebitda.pctRevenue || baseActuals.ebitdaMargin,
    netMargin: k.netProfit.pctRevenue || baseActuals.netMargin,
  }

  const counts = { green: 0, yellow: 0, red: 0 }
  Object.keys(dynamicActuals).forEach(ratioKey => {
    const l = getTrafficLight(dynamicActuals[ratioKey], ratioBenchmarks[ratioKey])
    if (counts[l] !== undefined) counts[l]++
  })

  return (
    <TooltipProvider>
      <div className={`bg-white/90 backdrop-blur-sm ${LAYOUT.cardRadius} ${LAYOUT.cardBorder} ${LAYOUT.cardShadow} overflow-hidden`}>
        <div className="px-5 py-4.5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className={`${TYPE.heading} text-sm font-extrabold text-slate-800`}>Financial Ratio Analysis vs Benchmark</h3>
            <p className={`${TYPE.subhead} font-medium`}>Vertical bar = target benchmark · Arrow = vs previous period</p>
          </div>
          <div className="flex items-center gap-2">
            {[
              ['green','On Target',counts.green],
              ['yellow','Warning',counts.yellow],
              ['red','Below',counts.red]
            ].map(([l,lbl,n]) => (
              <span key={l} className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border ${STATUS[l].badge}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${STATUS[l].dot}`}/>{n} {lbl}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6 p-6 bg-slate-50/40">
          {groups.map(g => (
            <div key={g.title} className="bg-white border border-slate-100/80 rounded-2xl p-4.5 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col">
              <p className={`${TYPE.label} mb-4 font-bold text-slate-400 uppercase tracking-widest text-[9.5px] border-b border-slate-100 pb-2`}>{g.title}</p>
              <div className="space-y-4 flex-1">
                {g.keys.map(k => <RatioRow key={k} ratioKey={k} dynamicActual={dynamicActuals[k]} />)}
              </div>
            </div>
          ))}
        </div>

        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
          <Info size={13} className="text-slate-400 shrink-0" />
          <p className={`${TYPE.micro} text-slate-450 font-medium text-slate-500`}>
            Benchmark Reference: Indonesian Retail Luxury & F&B standards, bank creditor requirements (ICR min 2.5x), financial ratio guidelines.
          </p>
        </div>
      </div>
    </TooltipProvider>
  )
}
