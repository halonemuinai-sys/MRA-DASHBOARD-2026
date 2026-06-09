/**
 * Benchmark data untuk MRA Group Executive Dashboard
 * Sumber: Industry standards Indonesia (Retail Luxury, F&B Franchise, Media Agency)
 * + Financial ratio best practices (PSAK/IFRS context)
 * + alirezarezvani/claude-skills finance framework
 *
 * Kolom:
 *   min    = minimum acceptable (di bawah = merah)
 *   target = ideal target (hijau)
 *   unit   = satuan
 *   source = dasar benchmark
 *   context= catatan penting
 */

// ─── FINANCIAL RATIOS ─────────────────────────────────────────────────────────
export const ratioBenchmarks = {
  // Profitability
  grossMargin:   { min: 20,   target: 30,   unit: '%',    label: 'Gross Margin',      source: 'Blended — Retail 45%, F&B 60%, Media 38%', context: 'Weighted avg dari 3 segmen MRA' },
  ebitdaMargin:  { min: 10,   target: 18,   unit: '%',    label: 'EBITDA Margin',     source: 'Retail 20%, F&B 14%, Media 12% (weighted)', context: 'Excl. D&A, pre-interest' },
  netMargin:     { min: 5,    target: 10,   unit: '%',    label: 'Net Margin',        source: 'Indonesian holding company avg 6–12%',      context: 'After tax PPh Badan 22%' },
  roa:           { min: 5,    target: 12,   unit: '%',    label: 'ROA',               source: 'Retail & F&B sector Indonesia',             context: 'Net Profit / Total Assets' },

  // Liquidity
  currentRatio:  { min: 1.2,  target: 2.0,  unit: 'x',   label: 'Current Ratio',     source: 'Standard kreditur perbankan Indonesia',     context: 'Di bawah 1.0 = masalah likuiditas' },
  quickRatio:    { min: 0.8,  target: 1.2,  unit: 'x',   label: 'Quick Ratio',       source: 'Excl. inventory — F&B inventory perishable', context: 'Lebih konservatif dari Current Ratio' },
  cashRatio:     { min: 0.3,  target: 0.6,  unit: 'x',   label: 'Cash Ratio',        source: 'Operating buffer 30–60 hari',               context: 'Minimum untuk operational safety' },

  // Efficiency
  dso:           { min: 0,    target: 30,   unit: 'hari', label: 'DSO',               source: 'F&B & Retail: mostly cash/CC',              context: 'B2B Media bisa sampai 60 hari', lowerIsBetter: true },
  dio:           { min: 0,    target: 90,   unit: 'hari', label: 'DIO',               source: 'Retail Luxury 90–180hr, F&B < 30hr',        context: 'Blended karena mix bisnis MRA', lowerIsBetter: true },
  dpo:           { min: 30,   target: 45,   unit: 'hari', label: 'DPO',               source: 'Standard terms supplier Indonesia',          context: 'Makin tinggi = leverage ke supplier lebih baik' },
  ccc:           { min: 0,    target: 75,   unit: 'hari', label: 'CCC',               source: 'DSO + DIO - DPO industry blended',          context: 'Makin rendah = semakin efisien working capital', lowerIsBetter: true },

  // Leverage
  debtEquity:    { min: 0,    target: 0.5,  unit: 'x',   label: 'Debt / Equity',     source: 'Conservative holding company standard',      context: 'Di atas 1.0x mulai berisiko', lowerIsBetter: true },
  icr:           { min: 3.0,  target: 5.0,  unit: 'x',   label: 'Interest Coverage', source: 'Bank Indonesia / kreditur minimum 2.5x',    context: 'Di bawah 1.5x = red flag lender' },
}

// ─── P&L BENCHMARKS PER SEGMEN ────────────────────────────────────────────────
export const segmentBenchmarks = {
  Retail: {
    label: 'Retail Luxury',
    grossMarginPct:  { target: 50, min: 40, unit: '%', note: 'Setelah duties & landed cost dari principal' },
    ebitdaMarginPct: { target: 22, min: 16, unit: '%', note: 'Premium brand biasanya 18–28%' },
    netMarginPct:    { target: 12, min: 8,  unit: '%', note: 'Setelah store rental & depreciation' },
    rentalRatio:     { target: 8,  max: 10, unit: '%', note: 'Threshold 10% = warning, > 15% = exit review', lowerIsBetter: true },
    revPerSqm:       { target: 1200, min: 800, unit: 'IDR M/tahun', note: 'Premium mall Jakarta/Bali' },
    inventoryDays:   { target: 120, max: 180, unit: 'hari', note: 'Luxury item slow-moving by nature' },
    sssg:            { target: 10,  min: 5,  unit: '%', note: 'Same-Store Sales Growth vs LY' },
  },
  FnB: {
    label: 'F&B Franchise',
    grossMarginPct:  { target: 65, min: 55, unit: '%', note: 'Food cost ratio target < 35%' },
    ebitdaMarginPct: { target: 15, min: 10, unit: '%', note: 'Quick service 12–18%, full service 8–14%' },
    netMarginPct:    { target: 8,  min: 4,  unit: '%', note: 'Setelah royalty franchise dan rental' },
    rentalRatio:     { target: 12, max: 15, unit: '%', note: 'F&B punya buffer lebih dibanding luxury retail', lowerIsBetter: true },
    foodCostRatio:   { target: 28, max: 35, unit: '%', note: 'Target < 30%, alarm > 35%', lowerIsBetter: true },
    laborCostRatio:  { target: 22, max: 28, unit: '%', note: 'Termasuk BPJS, THR, training', lowerIsBetter: true },
    revPerSeat:      { target: 1500, min: 800, unit: 'IDR K/bulan', note: 'Per seat per bulan tergantung format' },
    inventoryDays:   { target: 14,  max: 30,  unit: 'hari', note: 'Bahan baku fresh — harus cepat berputar', lowerIsBetter: true },
  },
  Media: {
    label: 'Media & Events',
    grossMarginPct:  { target: 40, min: 30, unit: '%', note: 'Setelah direct project cost & talent fee' },
    ebitdaMarginPct: { target: 14, min: 8,  unit: '%', note: 'Digital agency lebih tinggi dari event organizer' },
    netMarginPct:    { target: 7,  min: 3,  unit: '%', note: 'Lebih volatile karena project-based' },
    utilizationRate: { target: 78, min: 65, unit: '%', note: 'Billable hours / available hours per FTE' },
    revPerEmployee:  { target: 600, min: 400, unit: 'IDR M/tahun', note: 'Benchmark digital agency Indonesia' },
    clientRetention: { target: 80, min: 65, unit: '%', note: 'Annual client retention rate' },
    receivableDays:  { target: 45, max: 60, unit: 'hari', note: 'Project-based billing biasanya 30–60 hari', lowerIsBetter: true },
  },
}

// ─── KPI BENCHMARK PER METRIK DASHBOARD ──────────────────────────────────────
export const kpiBenchmarks = {
  // Executive Summary
  groupRevenue:     { yoyGrowthTarget: 12, unit: '%', note: 'Target pertumbuhan revenue group per tahun' },
  ebitdaMargin:     { target: 18, min: 10, unit: '%', note: 'Blended target group' },
  netMargin:        { target: 10, min: 5,  unit: '%', note: 'Blended target group' },
  budgetAchievement:{ target: 100, min: 95, unit: '%', note: '>100% = over-achieve, <95% = review needed' },

  // HR
  turnoverRate:     { target: 6, max: 10, unit: '%/tahun', note: 'Voluntary turnover — benchmark retail Indonesia 8–12%', lowerIsBetter: true },
  attendanceRate:   { target: 97, min: 93, unit: '%', note: 'Excluding approved leave' },
  trainingCompletion:{ target: 90, min: 75, unit: '%', note: 'Per sertifikasi atau program wajib' },
  empCostRatio:     { target: 20, max: 28, unit: '% of Rev', note: 'F&B bisa sampai 28%, Retail ~18%', lowerIsBetter: true },

  // Operational
  rentalRatioRetail:{ target: 8,  max: 10, unit: '%', lowerIsBetter: true, note: 'Luxury retail' },
  rentalRatioFnB:   { target: 12, max: 15, unit: '%', lowerIsBetter: true, note: 'F&B' },
  sssg:             { target: 8,  min: 4,  unit: '%', note: 'Same-Store Sales Growth' },

  // GA
  assetUtilization: { target: 85, min: 75, unit: '%', note: 'Aset aktif / total aset' },
  vendorCompliance: { target: 95, min: 80, unit: '%', note: 'Vendor memenuhi standar MRA' },

  // Legal
  contractRenewal:  { target: 100, min: 90, unit: '%', note: '% kontrak diperbarui sebelum expired' },

  // Compliance
  overallCompliance:{ target: 95, min: 85, unit: '%', note: 'Overall compliance score group' },
}

// ─── BRAND-LEVEL BENCHMARKS ───────────────────────────────────────────────────
export const brandBenchmarks = {
  Bulgari:                 { ebitdaMarginTarget: 25, rentalRatioMax: 9,  revPerSqmTarget: 1400, segment: 'Retail' },
  Omega:                  { ebitdaMarginTarget: 22, rentalRatioMax: 9,  revPerSqmTarget: 1200, segment: 'Retail' },
  'Lancôme Indonesia':    { ebitdaMarginTarget: 24, rentalRatioMax: 10, revPerSqmTarget: 1100, segment: 'Retail' },
  'Atmos Indonesia':      { ebitdaMarginTarget: 20, rentalRatioMax: 10, revPerSqmTarget: 900,  segment: 'Retail' },
  'Häagen-Dazs Indonesia':{ ebitdaMarginTarget: 18, rentalRatioMax: 14, foodCostRatioMax: 32,  segment: 'FnB'    },
  'Hard Rock Cafe Bali':  { ebitdaMarginTarget: 14, rentalRatioMax: 15, foodCostRatioMax: 35,  segment: 'FnB'    },
  'Jamba Juice':          { ebitdaMarginTarget: 16, rentalRatioMax: 14, foodCostRatioMax: 30,  segment: 'FnB'    },
  Bateel:                 { ebitdaMarginTarget: 18, rentalRatioMax: 14, foodCostRatioMax: 38,  segment: 'FnB'    },
  'Harper\'s Bazaar':     { ebitdaMarginTarget: 22, revPerEmpTarget: 700, utilizationTarget: 80, segment: 'Media' },
  Cosmopolitan:           { ebitdaMarginTarget: 14, revPerEmpTarget: 500, utilizationTarget: 75, segment: 'Media' },
  'Art Jakarta':          { ebitdaMarginTarget: 10, revPerEmpTarget: 450, utilizationTarget: 70, segment: 'Media' },
  'Hard Rock FM':         { ebitdaMarginTarget: 12, revPerEmpTarget: 480, utilizationTarget: 72, segment: 'Media' },
}

// ─── HELPER FUNCTIONS ─────────────────────────────────────────────────────────

/**
 * Returns traffic light color class based on value vs benchmark
 * @param {number} actual - nilai aktual
 * @param {object} bench  - { target, min, max, lowerIsBetter }
 * @returns {'green'|'yellow'|'red'|'gray'}
 */
export function getTrafficLight(actual, bench) {
  if (actual === null || actual === undefined) return 'gray'
  const { target, min, max, lowerIsBetter } = bench

  if (lowerIsBetter) {
    const threshold = max || target
    if (actual <= target)              return 'green'
    if (actual <= threshold)           return 'yellow'
    return 'red'
  } else {
    if (actual >= target)              return 'green'
    if (actual >= (min || target*0.9)) return 'yellow'
    return 'red'
  }
}

// Re-export from design tokens — single source of truth (fixes H2)
export { STATUS as trafficLightClasses } from '../design/tokens'
