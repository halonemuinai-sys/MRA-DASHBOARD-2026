import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, TrendingUp, Users, Store,
  Building2, Scale, ShieldCheck, Settings,
  LogOut, User, ChevronUp, DollarSign, Activity,
  Megaphone, ChevronLeft, ChevronRight
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const NAV = [
  { to: '/',            icon: LayoutDashboard, label: 'Executive Summary', badge: null },
  { to: '/financial',   icon: TrendingUp,      label: 'Financial',         badge: null },
  { to: '/hr',          icon: Users,           label: 'HR',                badge: null },
  { to: '/operational', icon: Store,           label: 'Operational',       badge: null },
  { to: '/marketing',   icon: Megaphone,       label: 'Marketing',         badge: null },
  { to: '/ga',          icon: Building2,       label: 'General Affairs',   badge: null },
  { to: '/legal',       icon: Scale,           label: 'Legal',             badge: 2    },
  { to: '/compliance',  icon: ShieldCheck,     label: 'Compliance',        badge: 1    },
]

export default function Sidebar() {
  const { user, filteredKpis, filteredHrKpis, fmt, isSidebarCollapsed, setIsSidebarCollapsed, hideValues } = useApp()
  const navigate = useNavigate()

  // Calculate dynamic stats for sidebar
  const revValue = fmt(filteredKpis.groupRevenue.value, 'B')
  const ebitdaPct = hideValues ? '•••%' : `${filteredKpis.ebitda.pctRevenue}%`
  const headcountVal = hideValues ? '••••' : filteredHrKpis.headcount.value.toLocaleString('id-ID')

  const dynamicStats = [
    { label: 'Revenue YTD', value: revValue, icon: DollarSign, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
    { label: 'EBITDA%', value: ebitdaPct, icon: Activity, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    { label: 'Headcount', value: headcountVal, icon: Users, color: 'text-slate-400 bg-slate-500/10 border-slate-500/20' },
  ]

  return (
    <TooltipProvider delayDuration={0}>
      <aside className={`fixed left-0 top-0 h-screen bg-slate-900 flex flex-col z-50 border-r border-slate-800/60 shadow-xl transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'w-16' : 'w-60'}`}>
        
        {/* Toggle Button floating on right border */}
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute top-6 -right-3 w-6 h-6 rounded-full bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-400 hover:text-white flex items-center justify-center shadow-lg z-50 hover:bg-slate-700 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
          title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isSidebarCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>

        {/* Brand */}
        <div className={`pt-6 pb-5 transition-all duration-300 ${isSidebarCollapsed ? 'px-2' : 'px-5'}`}>
          <div className={`flex flex-col gap-2.5 group/brand cursor-pointer`}>
            {isSidebarCollapsed ? (
              <div className="relative w-10 h-10 flex items-center justify-center shrink-0 overflow-hidden transform group-hover/brand:scale-105 transition-all duration-300 mx-auto">
                <img 
                  src="/mra-logo.png" 
                  alt="MRA Logo" 
                  className="h-full w-full object-cover object-left"
                />
              </div>
            ) : (
              <div className="flex flex-col gap-2 transform group-hover/brand:scale-[1.02] transition-all duration-300">
                <div className="h-9 w-full flex items-center justify-start py-0.5">
                  <img 
                    src="/mra-logo.png" 
                    alt="MRA Group Logo" 
                    className="h-full w-auto object-contain"
                  />
                </div>
                <div className="flex items-center justify-between px-0.5">
                  <span className="text-slate-400 text-[10px] font-bold tracking-wide">MRA Group</span>
                  <span className="inline-block bg-slate-800 text-blue-400 border border-slate-700/60 text-[8px] font-extrabold uppercase tracking-widest px-1.5 py-0.5 rounded shadow-sm">
                    Executive
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Mini stats */}
          {!isSidebarCollapsed && (
            <div className="mt-5 space-y-2.5 transition-all duration-300 animate-in fade-in zoom-in-95">
              {dynamicStats.map(s => {
                const Icon = s.icon
                return (
                  <div 
                    key={s.label} 
                    className="flex items-center gap-3 px-3.5 py-2.5 bg-slate-950/35 border border-slate-800/60 rounded-xl transition-all duration-300 ease-out group/stat cursor-pointer hover:bg-slate-850/40 hover:border-slate-700/40 hover:shadow-lg hover:shadow-slate-950/30 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <div className={`p-2 rounded-lg shrink-0 border transition-all duration-300 group-hover/stat:scale-110 group-hover/stat:rotate-3 shadow-inner ${s.color}`}>
                      <Icon size={13} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] text-slate-500 font-extrabold uppercase tracking-widest leading-none mb-1 opacity-90 group-hover/stat:text-slate-400 transition-colors">{s.label}</p>
                      <p className="text-xs font-black text-slate-200 tracking-wide tabular-nums leading-none">{s.value}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <Separator className="bg-slate-800/40" />

        {/* Nav */}
        <nav className={`flex-1 py-4 space-y-1 overflow-y-auto scrollbar-thin ${isSidebarCollapsed ? 'px-2' : 'px-3'}`}>
          {!isSidebarCollapsed ? (
            <p className="text-slate-500 text-[9px] font-extrabold uppercase tracking-widest px-3 mb-3 transition-opacity duration-300">Core Modules</p>
          ) : (
            <div className="h-4" />
          )}
          {NAV.map(({ to, icon: Icon, label, badge }) => {
            const navLinkElement = (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex items-center rounded-xl text-xs font-bold transition-all relative group overflow-hidden ${
                    isSidebarCollapsed ? 'justify-center p-3' : 'gap-3 px-3 py-3.5'
                  } ${
                    isActive
                      ? 'bg-slate-800/80 text-blue-400 border border-slate-700/60 shadow-sm'
                      : 'text-slate-400 hover:bg-slate-850 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent hover:translate-x-1.5'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Clean executive blue active bar */}
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                    )}
                    {/* Icon with hover scale */}
                    <Icon size={14} className={`shrink-0 transition-all duration-300 group-hover:scale-115 ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-350'}`} />
                    {!isSidebarCollapsed && (
                      <span className="flex-1 transition-colors duration-300 truncate">{label}</span>
                    )}
                    {!isSidebarCollapsed && badge && (
                      <Badge className="h-[18px] min-w-[18px] px-1 text-[9px] font-black bg-rose-500 hover:bg-rose-500 text-white border-0 shadow-sm shadow-rose-500/20">
                        {badge}
                      </Badge>
                    )}
                    {isSidebarCollapsed && badge && (
                      <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-slate-900" />
                    )}
                  </>
                )}
              </NavLink>
            )

            if (isSidebarCollapsed) {
              return (
                <Tooltip key={to}>
                  <TooltipTrigger asChild>
                    {navLinkElement}
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-slate-950 text-white border border-slate-800 text-xs font-bold px-3 py-1.5 rounded-lg ml-2 shadow-xl z-50">
                    <div className="flex items-center gap-2">
                      <span>{label}</span>
                      {badge && (
                        <Badge className="h-[16px] px-1 text-[8px] font-black bg-rose-500 text-white border-0">
                          {badge}
                        </Badge>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              )
            }

            return navLinkElement
          })}
        </nav>

        <Separator className="bg-slate-800/40" />

        {/* User */}
        <div className={`p-3 bg-slate-900 border-t border-slate-800/40`}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className={`w-full flex items-center rounded-xl hover:bg-slate-800 border border-transparent hover:border-slate-700/40 transition-all duration-300 group cursor-pointer hover:scale-[1.01] ${isSidebarCollapsed ? 'justify-center p-1.5' : 'gap-2.5 px-2.5 py-2.5'}`}>
                <div className="relative shrink-0">
                  <Avatar className="w-8 h-8 border border-slate-700 transition-transform duration-300 group-hover:scale-105">
                    <AvatarFallback className="bg-slate-800 text-white text-xs font-black">
                      {user.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full shadow-sm shadow-emerald-500/40" />
                </div>
                {!isSidebarCollapsed && (
                  <>
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-white text-xs font-bold truncate leading-none mb-1 group-hover:text-blue-400 transition-colors">{user.name}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {user.role.split(' / ').map((r, idx) => {
                          const colors = [
                            'bg-blue-500/10 text-blue-400 border-blue-500/20',
                            'bg-sky-500/10 text-sky-400 border-sky-500/20',
                            'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          ]
                          const color = colors[idx % colors.length]
                          return (
                            <span key={r} className={`px-1 py-0.5 rounded text-[8px] font-black uppercase border tracking-wider leading-none shrink-0 ${color}`}>
                              {r}
                            </span>
                          )
                        })}
                      </div>
                    </div>
                    <ChevronUp size={13} className="text-slate-650 group-hover:text-slate-400 group-hover:-translate-y-0.5 transition-all shrink-0 mt-0.5" />
                  </>
                )}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent side={isSidebarCollapsed ? 'right' : 'top'} align={isSidebarCollapsed ? 'center' : 'start'} className="w-52 mb-2 ml-2 bg-slate-900 border-slate-850 text-slate-200 shadow-xl">
              <DropdownMenuLabel className="text-xs text-white p-3">
                <p className="font-extrabold">{user.name}</p>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {user.role.split(' / ').map((r, idx) => {
                    const colors = [
                      'bg-blue-500/10 text-blue-400 border-blue-500/20',
                      'bg-sky-500/10 text-sky-400 border-sky-500/20',
                      'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    ]
                    const color = colors[idx % colors.length]
                    return (
                      <span key={r} className={`px-1 py-0.5 rounded text-[8px] font-black uppercase border tracking-wider leading-none shrink-0 ${color}`}>
                        {r}
                      </span>
                    )
                  })}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-800" />
              <DropdownMenuItem className="text-xs cursor-pointer hover:bg-slate-800 focus:bg-slate-800 focus:text-white transition-colors duration-200">
                <User size={13} className="mr-2 text-slate-500" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="text-xs cursor-pointer hover:bg-slate-800 focus:bg-slate-800 focus:text-white transition-colors duration-200">
                <Settings size={13} className="mr-2 text-slate-500" /> Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-800" />
              <DropdownMenuItem
                className="text-xs cursor-pointer text-red-400 focus:text-red-400 hover:bg-red-950/20 focus:bg-red-950/20 transition-colors duration-200"
                onClick={() => navigate('/login')}
              >
                <LogOut size={13} className="mr-2" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
    </TooltipProvider>
  )
}
