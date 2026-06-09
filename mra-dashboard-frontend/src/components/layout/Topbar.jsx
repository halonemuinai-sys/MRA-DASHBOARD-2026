import { Bell, RefreshCw, Eye, EyeOff, Sun, Moon } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { businessUnits } from '../../data/dummyData'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const PERIODS = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly']
const SEGMENTS = ['All', 'F&B', 'Retail', 'Media']

export default function Topbar({ title }) {
  const { 
    period, setPeriod, 
    segment, setSegment, 
    brand, setBrand, 
    currency, setCurrency,
    selectedMonth, setSelectedMonth,
    selectedYear, setSelectedYear,
    hideValues, setHideValues,
    theme, toggleTheme
  } = useApp()

  const brandOptions = segment === 'All'
    ? Object.values(businessUnits).flat()
    : businessUnits[segment === 'F&B' ? 'FnB' : segment] || []

  return (
    <TooltipProvider>
      <header className="sticky top-0 z-40 bg-white/75 dark:bg-slate-900/75 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/80 px-6 py-3.5 flex items-center gap-3 transition-colors duration-300">
        <h1 className="text-slate-900 dark:text-slate-100 font-bold text-sm mr-auto shrink-0 tracking-tight">{title}</h1>

        {/* Period — shadcn Tabs */}
        {/* Period — shadcn Tabs */}
        <Tabs value={period} onValueChange={setPeriod}>
          <TabsList className="h-8 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/40 dark:border-slate-700/50 p-0.5 rounded-lg">
            {PERIODS.map(p => (
              <TabsTrigger key={p} value={p} className="text-[11px] font-bold px-3 h-7 rounded-md text-slate-600 dark:text-slate-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-500 dark:data-[state=active]:from-blue-500 dark:data-[state=active]:to-blue-400 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:shadow-blue-500/10 transition-all">{p}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Month Selector — shadcn Select */}
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="h-8 w-22 text-[11px] font-bold bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 hover:border-blue-500/40 dark:hover:border-blue-500/30 text-slate-700 dark:text-slate-200 rounded-lg shadow-sm transition-all focus:ring-2 focus:ring-blue-500/10">
            <SelectValue placeholder="Bulan" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-lg">
            {['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'].map(m => (
              <SelectItem key={m} value={m} className="text-xs font-semibold focus:bg-slate-50 dark:focus:bg-slate-800 dark:text-slate-200">{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Year Selector — shadcn Select */}
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="h-8 w-20 text-[11px] font-bold bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 hover:border-blue-500/40 dark:hover:border-blue-500/30 text-slate-700 dark:text-slate-200 rounded-lg shadow-sm transition-all focus:ring-2 focus:ring-blue-500/10">
            <SelectValue placeholder="Tahun" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-lg">
            {['2025', '2026'].map(y => (
              <SelectItem key={y} value={y} className="text-xs font-semibold focus:bg-slate-50 dark:focus:bg-slate-800 dark:text-slate-200">{y}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Segment — shadcn Select */}
        <Select value={segment} onValueChange={v => { setSegment(v); setBrand('All') }}>
          <SelectTrigger className="h-8 w-32 text-[11px] font-bold bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 hover:border-blue-500/40 dark:hover:border-blue-500/30 text-slate-700 dark:text-slate-200 rounded-lg shadow-sm transition-all focus:ring-2 focus:ring-blue-500/10">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-lg">
            {SEGMENTS.map(s => (
              <SelectItem key={s} value={s} className="text-xs font-semibold focus:bg-slate-50 dark:focus:bg-slate-800 dark:text-slate-200">
                {s === 'All' ? 'All Segments' : s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Brand — shadcn Select */}
        <Select value={brand} onValueChange={setBrand}>
          <SelectTrigger className="h-8 w-36 text-[11px] font-bold bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 hover:border-blue-500/40 dark:hover:border-blue-500/30 text-slate-700 dark:text-slate-200 rounded-lg shadow-sm transition-all focus:ring-2 focus:ring-blue-500/10">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-lg">
            <SelectItem value="All" className="text-xs font-semibold focus:bg-slate-50 dark:focus:bg-slate-800 dark:text-slate-200">All Brands</SelectItem>
            {brandOptions.map(b => (
              <SelectItem key={b} value={b} className="text-xs font-semibold focus:bg-slate-50 dark:focus:bg-slate-800 dark:text-slate-200">{b}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Currency Toggle — shadcn Tabs */}
        <Tabs value={currency} onValueChange={setCurrency}>
          <TabsList className="h-8 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/40 dark:border-slate-700/50 p-0.5 rounded-lg">
            {['IDR', 'USD'].map(c => (
              <TabsTrigger key={c} value={c} className="text-[11px] font-bold px-3.5 h-7 rounded-md text-slate-600 dark:text-slate-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-500 dark:data-[state=active]:from-blue-500 dark:data-[state=active]:to-blue-400 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:shadow-blue-500/10 transition-all">{c}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Hide/Show Values Button */}
        <Tooltip>
          <TooltipTrigger
            className={`h-8 w-8 rounded-lg border flex items-center justify-center transition-all cursor-pointer border-slate-200/80 dark:border-slate-800 ${
              hideValues
                ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100 hover:text-rose-700 dark:bg-rose-950/20 dark:border-rose-900/30'
                : 'bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800'
            }`}
            onClick={() => setHideValues(!hideValues)}
          >
            {hideValues ? <EyeOff size={14} /> : <Eye size={14} />}
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-[10px] font-medium bg-slate-900 text-white rounded-md border-0 py-1.5 px-2.5 shadow-md">
            {hideValues ? 'Tampilkan Nilai' : 'Sembunyikan Nilai'}
          </TooltipContent>
        </Tooltip>

        {/* Light/Dark Theme Toggle Button */}
        <Tooltip>
          <TooltipTrigger
            className={`h-8 w-8 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
              theme === 'dark'
                ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700 hover:text-amber-300'
                : 'bg-white border-slate-200/80 text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800'
            }`}
            onClick={toggleTheme}
          >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-[10px] font-medium bg-slate-900 text-white rounded-md border-0 py-1.5 px-2.5 shadow-md">
            {theme === 'dark' ? 'Mode Terang' : 'Mode Gelap'}
          </TooltipContent>
        </Tooltip>

        <div className="h-4 w-px bg-slate-200/80 mx-1 shrink-0 dark:bg-slate-850" />

        {/* Notification */}
        <Tooltip>
          <TooltipTrigger
            className="relative h-8 w-8 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100/80 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors focus:outline-none"
          >
            <Bell size={14} />
            <Badge className="absolute -top-0.5 -right-0.5 h-4 w-4 p-0 flex items-center justify-center text-[8px] font-black bg-rose-500 hover:bg-rose-500 border-2 border-white dark:border-slate-900 shadow-sm">
              3
            </Badge>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-[10px] font-medium bg-slate-900 text-white rounded-md border-0 py-1.5 px-2.5 shadow-md">3 notifikasi baru</TooltipContent>
        </Tooltip>

        {/* Refresh */}
        <Tooltip>
          <TooltipTrigger
            className="h-8 w-8 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100/80 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors focus:outline-none"
          >
            <RefreshCw size={13} className="hover:rotate-45 transition-transform" />
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-[10px] font-medium bg-slate-900 text-white rounded-md border-0 py-1.5 px-2.5 shadow-md">Refresh data</TooltipContent>
        </Tooltip>
      </header>
    </TooltipProvider>
  )
}
