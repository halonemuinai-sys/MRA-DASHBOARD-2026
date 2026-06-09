import React from 'react'

export function KpiCardSkeleton() {
  return (
    <div className="bg-white/95 dark:bg-slate-900/95 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden select-none">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-150/10 dark:via-slate-800/10 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" style={{ backgroundImage: 'linear-gradient(90deg, transparent, rgba(148, 163, 184, 0.05) 50%, transparent)' }} />
      <div className="flex items-center justify-between mb-3.5">
        <div className="space-y-2 flex-1">
          {/* Label skeleton */}
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-full w-24 animate-pulse" />
          {/* Subtitle skeleton */}
          <div className="h-2 bg-slate-150 dark:bg-slate-800/60 rounded-full w-16 animate-pulse" />
        </div>
        {/* Icon square skeleton */}
        <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex-shrink-0 animate-pulse" />
      </div>
      <div className="flex items-end justify-between mt-3">
        {/* Value skeleton */}
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-full w-20 animate-pulse" />
        {/* Badge skeleton */}
        <div className="w-12 h-4 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse" />
      </div>
    </div>
  )
}

export function ChartSkeleton({ height = 300 }) {
  return (
    <div className="bg-white/95 dark:bg-slate-900/95 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-xl relative overflow-hidden flex flex-col justify-between" style={{ height }}>
      {/* Header skeleton */}
      <div className="flex justify-between items-start gap-4 mb-4">
        <div className="space-y-1.5 flex-1">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full w-40 animate-pulse" />
          <div className="h-2.5 bg-slate-150 dark:bg-slate-800/65 rounded-full w-28 animate-pulse" />
        </div>
        <div className="w-16 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />
      </div>

      {/* Grid line skeleton mimicking chart */}
      <div className="flex-1 flex flex-col justify-between py-6 relative">
        <div className="border-b border-dashed border-slate-100 dark:border-slate-800/80 w-full h-px" />
        <div className="border-b border-dashed border-slate-100 dark:border-slate-800/80 w-full h-px" />
        <div className="border-b border-dashed border-slate-100 dark:border-slate-800/80 w-full h-px" />
        <div className="border-b border-dashed border-slate-100 dark:border-slate-800/80 w-full h-px" />
        <div className="border-b border-dashed border-slate-100 dark:border-slate-800/80 w-full h-px" />
        
        {/* Bars/Areas simulation */}
        <div className="absolute inset-x-8 bottom-0 flex items-end justify-around h-full pt-12">
          <div className="w-12 bg-slate-100 dark:bg-slate-800/50 rounded-t-lg animate-pulse" style={{ height: '40%' }} />
          <div className="w-12 bg-slate-100 dark:bg-slate-800/50 rounded-t-lg animate-pulse" style={{ height: '75%' }} />
          <div className="w-12 bg-slate-100 dark:bg-slate-800/50 rounded-t-lg animate-pulse" style={{ height: '55%' }} />
          <div className="w-12 bg-slate-100 dark:bg-slate-800/50 rounded-t-lg animate-pulse" style={{ height: '90%' }} />
        </div>
      </div>

      {/* X-axis ticks simulation */}
      <div className="flex justify-around mt-4 pt-2 border-t border-slate-50 dark:border-slate-850">
        <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full w-8 animate-pulse" />
        <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full w-8 animate-pulse" />
        <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full w-8 animate-pulse" />
        <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full w-8 animate-pulse" />
      </div>
    </div>
  )
}

export function ListSkeleton({ count = 5 }) {
  return (
    <div className="bg-white/95 dark:bg-slate-900/95 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-5 pb-2 border-b border-slate-50 dark:border-slate-850">
        <div className="space-y-1.5 flex-1">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full w-36 animate-pulse" />
          <div className="h-2.5 bg-slate-150 dark:bg-slate-800/65 rounded-full w-24 animate-pulse" />
        </div>
        <div className="w-12 h-5 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
      </div>

      {/* Row simulation */}
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center justify-between gap-4 py-2 border-b border-slate-50/50 dark:border-slate-850/40 last:border-0">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-850 animate-pulse" />
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-full w-24 animate-pulse" />
          </div>
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-full w-16 animate-pulse" />
          <div className="h-3 bg-slate-150 dark:bg-slate-800 rounded-full w-10 animate-pulse" />
        </div>
      ))}
    </div>
  )
}
