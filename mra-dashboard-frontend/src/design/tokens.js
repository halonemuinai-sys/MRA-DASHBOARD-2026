/**
 * MRA Dashboard — Design Tokens
 * Single source of truth untuk semua visual decisions.
 * Semua komponen import dari sini, bukan hardcode.
 */

export const CHART = {
  retail:   '#3b82f6',   // Vibrant sapphire-indigo for Retail
  fnb:      '#f97316',   // Warm amber-orange for F&B
  media:    '#10b981',   // Emerald-mint for Media
  purple:   '#8b5cf6',   // Modern purple
  positive: '#10b981',   // Clean green for gains
  negative: '#ef4444',   // Vibrant red for losses
  neutral:  '#64748b',   // Professional slate for budget/neutral lines
  forecast: '#f59e0b',   // Forecast amber line
  actual:   '#3b82f6',   // Sapphire blue actual line
  gradFill: '#3b82f6',   // Area chart fill color
}

export const SEGMENT_COLORS = [CHART.retail, CHART.fnb, CHART.media]

// ─── STATUS / TRAFFIC LIGHT ───────────────────────────────────────────────────
// Premium colored background alerts with border glows and dark text
export const STATUS = {
  green: {
    bg:     'bg-emerald-50/70 backdrop-blur-sm',
    text:   'text-emerald-600 font-semibold',
    dot:    'bg-emerald-500 shadow-sm shadow-emerald-500/50',
    border: 'border-emerald-100',
    badge:  'bg-emerald-50 text-emerald-600 border border-emerald-150',
    bar:    '#10b981',
    hex:    '#10b981',
  },
  yellow: {
    bg:     'bg-amber-50/70 backdrop-blur-sm',
    text:   'text-amber-600 font-semibold',
    dot:    'bg-amber-500 shadow-sm shadow-amber-500/50',
    border: 'border-amber-100',
    badge:  'bg-amber-50 text-amber-600 border border-amber-150',
    bar:    '#d97706',
    hex:    '#d97706',
  },
  red: {
    bg:     'bg-rose-50/70 backdrop-blur-sm',
    text:   'text-rose-600 font-semibold',
    dot:    'bg-rose-500 shadow-sm shadow-rose-500/50',
    border: 'border-rose-100',
    badge:  'bg-rose-50 text-rose-600 border border-rose-150',
    bar:    '#ef4444',
    hex:    '#ef4444',
  },
  gray: {
    bg:     'bg-slate-50/70 backdrop-blur-sm',
    text:   'text-slate-400 font-semibold',
    dot:    'bg-slate-400 shadow-sm shadow-slate-400/50',
    border: 'border-slate-100',
    badge:  'bg-slate-50 text-slate-400 border border-slate-150',
    bar:    '#94a3b8',
    hex:    '#94a3b8',
  },
}

// ─── KPI CARD ACCENTS ─────────────────────────────────────────────────────────
// Clean, soft-glow backgrounds and border indicators
export const KPI_ACCENT = {
  blue:   { border: 'border-l-4 border-l-blue-500',    iconBg: 'bg-blue-50/80',    iconText: 'text-blue-500'    },
  green:  { border: 'border-l-4 border-l-emerald-500', iconBg: 'bg-emerald-50/80', iconText: 'text-emerald-500' },
  amber:  { border: 'border-l-4 border-l-amber-500',   iconBg: 'bg-amber-50/80',   iconText: 'text-amber-500'   },
  purple: { border: 'border-l-4 border-l-purple-500',  iconBg: 'bg-purple-50/80',  iconText: 'text-purple-500'  },
  rose:   { border: 'border-l-4 border-l-rose-500',    iconBg: 'bg-rose-50/80',    iconText: 'text-rose-500'    },
  cyan:   { border: 'border-l-4 border-l-cyan-500',    iconBg: 'bg-cyan-50/80',    iconText: 'text-cyan-500'    },
  indigo: { border: 'border-l-4 border-l-indigo-500',  iconBg: 'bg-indigo-50/80',  iconText: 'text-indigo-500'  },
  teal:   { border: 'border-l-4 border-l-teal-500',    iconBg: 'bg-teal-50/80',    iconText: 'text-teal-500'    },
}

// ─── LAYOUT TOKENS ────────────────────────────────────────────────────────────
export const LAYOUT = {
  cardRadius:    'rounded-2xl',        // 16px — premium rounded corners
  badgeRadius:   'rounded-lg',         // 8px  — badges
  chipRadius:    'rounded-full',       // 99px — chips/pills
  cardShadow:    'shadow-xl shadow-slate-100/50 border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 hover:border-slate-200 transition-all duration-300',
  cardBorder:    'border border-slate-100',
  sectionGap:    'mb-8',               // modern breathing room spacing
  cardGap:       'gap-6',              // grid spacing
  chartHeightSm: 160,                  // small charts
  chartHeightMd: 240,                  // medium charts
  chartHeightLg: 300,                  // large charts
}

// ─── TYPOGRAPHY SCALE ─────────────────────────────────────────────────────────
export const TYPE = {
  display: 'text-3xl font-black tracking-tight font-sans',     // large display numbers
  heading: 'text-sm font-bold text-slate-800 tracking-wide',    // titles
  subhead: 'text-xs text-slate-400 font-medium mt-0.5',         // subhead
  label:   'text-[10px] font-bold text-slate-400 uppercase tracking-widest', // section labels
  body:    'text-xs text-slate-600 font-normal leading-relaxed',// descriptions
  caption: 'text-[11px] text-slate-400 font-medium',            // chart axes
  micro:   'text-[10px] text-slate-500 font-semibold',          // badges, micro information
}

// ─── CHART AXIS STYLE ─────────────────────────────────────────────────────────
export const AXIS = {
  tick: { fontSize: 10, fill: '#94a3b8', fontWeight: 500 },
  grid: { strokeDasharray: '4 4', stroke: '#f1f5f9' },
}

// ─── TOOLTIP STYLE ────────────────────────────────────────────────────────────
export const TOOLTIP_STYLE = {
  contentStyle: {
    fontSize: 11,
    fontFamily: 'system-ui, sans-serif',
    borderRadius: 14,
    border: '1px solid #e2e8f0',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(8px)',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
    padding: '12px 14px',
  },
}

