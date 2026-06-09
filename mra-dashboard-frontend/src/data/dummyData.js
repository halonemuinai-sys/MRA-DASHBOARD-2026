// ─── BUSINESS UNITS ──────────────────────────────────────────────────────────
export const businessUnits = {
  FnB: ['Häagen-Dazs Indonesia', 'Hard Rock Cafe Bali', 'Jamba Juice', 'Bateel'],
  Retail: ['Bulgari', 'Omega', 'Atmos Indonesia', 'Lancôme Indonesia', 'Kiehl\'s Indonesia', 'Chronologie', 'Wiggle Wiggle', 'Bulgari Resort Bali'],
  Media: [
    'Harper\'s Bazaar', 'Her World', 'Cosmopolitan', 'Mother & Beyond', 
    'CASA Indonesia', 'Parentalk.id', 'Hard Rock FM', 'IRadio', 'Art Jakarta'
  ],
}

// ─── MONTHLY REVENUE DATA (IDR Billion) ──────────────────────────────────────
export const monthlyRevenue = [
  { month: 'Jan', actual: 142, budget: 135, lastYear: 128, forecast: 140 },
  { month: 'Feb', actual: 138, budget: 140, lastYear: 125, forecast: 138 },
  { month: 'Mar', actual: 165, budget: 155, lastYear: 148, forecast: 160 },
  { month: 'Apr', actual: 158, budget: 150, lastYear: 142, forecast: 155 },
  { month: 'Mei', actual: 172, budget: 165, lastYear: 155, forecast: 168 },
  { month: 'Jun', actual: 180, budget: 175, lastYear: 162, forecast: 178 },
  { month: 'Jul', actual: 185, budget: 178, lastYear: 168, forecast: 182 },
  { month: 'Agt', actual: 178, budget: 180, lastYear: 170, forecast: 180 },
  { month: 'Sep', actual: 190, budget: 185, lastYear: 175, forecast: 188 },
  { month: 'Okt', actual: 195, budget: 190, lastYear: 180, forecast: 193 },
  { month: 'Nov', actual: 210, budget: 200, lastYear: 192, forecast: 205 },
  { month: 'Des', actual: 225, budget: 215, lastYear: 205, forecast: 220 },
]

// ─── SEGMENT PERFORMANCE (IDR Billion) ───────────────────────────────────────
export const segmentRevenue = [
  { name: 'Retail', value: 845, color: '#3b82f6' },
  { name: 'F&B', value: 612, color: '#f59e0b' },
  { name: 'Media', value: 281, color: '#10b981' },
]

// ─── BRAND PERFORMANCE TABLE ──────────────────────────────────────────────────
export const brandPerformance = [
  { brand: 'Bulgari',              segment: 'Retail', revenue: 312, budgetPct: 103, yoyPct: 18, ebitda: 78, ebitdaPct: 25 },
  { brand: 'Omega',                segment: 'Retail', revenue: 245, budgetPct: 98,  yoyPct: 12, ebitda: 55, ebitdaPct: 22 },
  { brand: 'Atmos Indonesia',      segment: 'Retail', revenue: 110, budgetPct: 94,  yoyPct:  8, ebitda: 22, ebitdaPct: 20 },
  { brand: 'Lancôme Indonesia',    segment: 'Retail', revenue: 78,  budgetPct: 105, yoyPct: 22, ebitda: 19, ebitdaPct: 24 },
  { brand: 'Kiehl\'s Indonesia',   segment: 'Retail', revenue: 50,  budgetPct: 102, yoyPct: 15, ebitda: 11, ebitdaPct: 22 },
  { brand: 'Chronologie',          segment: 'Retail', revenue: 95,  budgetPct: 101, yoyPct: 14, ebitda: 21, ebitdaPct: 22 },
  { brand: 'Wiggle Wiggle',        segment: 'Retail', revenue: 20,  budgetPct: 98,  yoyPct: 10, ebitda: 3,  ebitdaPct: 15 },
  { brand: 'Bulgari Resort Bali',  segment: 'Retail', revenue: 30,  budgetPct: 100, yoyPct: 14, ebitda: 7,  ebitdaPct: 23 },
  { brand: 'Häagen-Dazs Indonesia',segment: 'F&B',    revenue: 285, budgetPct: 101, yoyPct: 15, ebitda: 57, ebitdaPct: 20 },
  { brand: 'Hard Rock Cafe Bali',  segment: 'F&B',    revenue: 198, budgetPct: 97,  yoyPct: 10, ebitda: 32, ebitdaPct: 16 },
  { brand: 'Jamba Juice',          segment: 'F&B',    revenue: 85,  budgetPct: 102, yoyPct: 20, ebitda: 15, ebitdaPct: 18 },
  { brand: 'Bateel',               segment: 'F&B',    revenue: 44,  budgetPct: 88,  yoyPct: -3, ebitda:  6, ebitdaPct: 14 },
  { brand: 'Harper\'s Bazaar',     segment: 'Media',  revenue: 80,  budgetPct: 105, yoyPct: 12, ebitda: 20, ebitdaPct: 25 },
  { brand: 'Her World',            segment: 'Media',  revenue: 55,  budgetPct: 98,  yoyPct:  5, ebitda:  8, ebitdaPct: 15 },
  { brand: 'Cosmopolitan',         segment: 'Media',  revenue: 45,  budgetPct: 100, yoyPct:  8, ebitda:  9, ebitdaPct: 20 },
  { brand: 'Mother & Beyond',      segment: 'Media',  revenue: 25,  budgetPct: 95,  yoyPct:  2, ebitda:  3, ebitdaPct: 12 },
  { brand: 'CASA Indonesia',       segment: 'Media',  revenue: 20,  budgetPct: 92,  yoyPct: -2, ebitda:  2, ebitdaPct: 10 },
  { brand: 'Parentalk.id',         segment: 'Media',  revenue: 15,  budgetPct: 110, yoyPct: 25, ebitda: 3.8,ebitdaPct: 25 },
  { brand: 'Hard Rock FM',         segment: 'Media',  revenue: 22,  budgetPct: 96,  yoyPct:  4, ebitda: 3.3,ebitdaPct: 15 },
  { brand: 'IRadio',               segment: 'Media',  revenue: 14,  budgetPct: 94,  yoyPct:  2, ebitda: 1.7,ebitdaPct: 12 },
  { brand: 'Art Jakarta',          segment: 'Media',  revenue: 5,   budgetPct: 90,  yoyPct: -5, ebitda: 0.2,ebitdaPct: 4 },
]

// ─── EXECUTIVE KPI ────────────────────────────────────────────────────────────
export const executiveKpis = {
  groupRevenue:    { value: 1738, unit: 'B', yoy: 14.2, vs_budget: 100.8 },
  opex:            { value: 235,  unit: 'B', yoy: 10.5, pctRevenue: 13.5 },
  ebitda:          { value: 218,  unit: 'B', yoy: 22.1, pctRevenue: 12.5 },
  grossProfit:     { value: 453,  unit: 'B', yoy: 18.4, pctRevenue: 26.1 },
  netProfit:       { value: 115.4,unit: 'B', yoy: 25.3, pctRevenue: 6.6 },
  cashPosition:    { value: 342,  unit: 'B', yoy:  8.7 },
  freeCashPos:     { value: 218,  unit: 'B', yoy:  5.2 },
  inventoryPos:    { value: 485,  unit: 'B', yoy: 12.1 },
}

// ─── FINANCIAL DASHBOARD ──────────────────────────────────────────────────────
export const plSummary = [
  { label: 'Revenue',       value: 1738, pctRev: 100,  bold: true },
  { label: 'COGS',          value: -1285, pctRev: -73.9 },
  { label: 'Gross Profit',  value: 453,  pctRev: 26.1, bold: true },
  { label: 'OPEX',          value: -235, pctRev: -13.5 },
  { label: 'EBITDA',        value: 218,  pctRev: 12.5, bold: true },
  { label: 'Depreciation',  value: -42,  pctRev: -2.4 },
  { label: 'EBIT',          value: 176,  pctRev: 10.1 },
  { label: 'Interest',      value: -28,  pctRev: -1.6 },
  { label: 'EBT',           value: 148,  pctRev:  8.5 },
  { label: 'Tax',           value: -44,  pctRev: -2.5 },
  { label: 'Net Profit',    value: 104,  pctRev:  6.0, bold: true },
]

export const apArAging = [
  { bucket: '0-30 hari',  ap: 85,  ar: 62  },
  { bucket: '31-60 hari', ap: 45,  ar: 38  },
  { bucket: '61-90 hari', ap: 22,  ar: 25  },
  { bucket: '>90 hari',   ap: 12,  ar: 18  },
]

export const cashFlow = [
  { month: 'Jan', operating: 28, investing: -15, financing: -8  },
  { month: 'Feb', operating: 25, investing: -12, financing: -6  },
  { month: 'Mar', operating: 35, investing: -20, financing: -10 },
  { month: 'Apr', operating: 30, investing: -18, financing: -8  },
  { month: 'Mei', operating: 38, investing: -22, financing: -12 },
  { month: 'Jun', operating: 42, investing: -15, financing: -9  },
]

export const capexData = [
  { category: 'General Affairs (GA)', budget: 90, actual: 80, pct: 89 },
  { category: 'Marketing',           budget: 65, actual: 58, pct: 89 },
  { category: 'Human Resources (HR)', budget: 35, actual: 30, pct: 86 },
  { category: 'Operations',          budget: 85, actual: 72, pct: 85 },
  { category: 'Others',              budget: 15, actual: 10, pct: 67 },
]

// ─── HR DASHBOARD ─────────────────────────────────────────────────────────────
export const hrKpis = {
  headcount:   { value: 693, yoy: 5.2,  unit: 'orang' },
  employeeCost:{ value: 285,  yoy: 8.1,  unit: 'B', pctRev: 16.4 },
  turnoverRate:{ value: 8.2,  yoy: -1.3, unit: '%' },
  attendance:  { value: 94.5, yoy: 0.8,  unit: '%' },
}

export const headcountBySegment = [
  { segment: 'F&B',    count: 542 },
  { segment: 'Retail', count: 425 },
  { segment: 'Media',  count: 198 },
  { segment: 'HO',     count: 83  },
]

export const recruitmentData = [
  { dept: 'Sales & Operations',      open: 18, progress: 72 },
  { dept: 'Editorial & Creative',     open: 12, progress: 85 },
  { dept: 'Marketing & PR',           open:  6, progress: 60 },
  { dept: 'Finance & Accounting',     open:  4, progress: 50 },
  { dept: 'Information & Technology', open:  6, progress: 67 },
  { dept: 'Human Resources',          open:  3, progress: 33 },
]

export const personnelExpenses = [
  { category: 'Salaries & Wages', share: 0.50 },
  { category: 'Employee Allowances', share: 0.14 },
  { category: 'Bonus & THR', share: 0.12 },
  { category: 'Employee Benefit', share: 0.08 },
  { category: 'BPJS Ketenagakerjaan', share: 0.035 },
  { category: 'Pension Fund', share: 0.03 },
  { category: 'BPJS Kesehatan', share: 0.03 },
  { category: 'Employee Insurance', share: 0.025 },
  { category: 'BPJS Jaminan Pensiun', share: 0.02 },
  { category: 'Payroll Tax', share: 0.015 },
  { category: 'Other', share: 0.005 }
]


export const trainingKpi = [
  { dept: 'Sales & Operations',      target: 100, achieved: 85 },
  { dept: 'Editorial & Creative',     target: 100, achieved: 78 },
  { dept: 'Marketing & PR',           target: 100, achieved: 92 },
  { dept: 'Finance & Accounting',     target: 100, achieved: 95 },
  { dept: 'Information & Technology', target: 100, achieved: 88 },
  { dept: 'Human Resources',          target: 100, achieved: 90 },
]

// ─── OPERATIONAL DASHBOARD ────────────────────────────────────────────────────
export const storeProductivity = [
  { brand: 'Bulgari',              revenue: 312, sqm: 250, perSqm: 1248, rentalPct: 8  },
  { brand: 'Omega',                revenue: 245, sqm: 180, perSqm: 1361, rentalPct: 9  },
  { brand: 'Atmos Indonesia',      revenue: 110, sqm: 95,  perSqm: 1157, rentalPct: 10 },
  { brand: 'Lancôme Indonesia',    revenue: 78,  sqm: 60,  perSqm: 1300, rentalPct: 10 },
  { brand: 'Kiehl\'s Indonesia',   revenue: 50,  sqm: 45,  perSqm: 1111, rentalPct: 11 },
  { brand: 'Chronologie',          revenue: 95,  sqm: 75,  perSqm: 1266, rentalPct: 10 },
  { brand: 'Häagen-Dazs Indonesia',revenue: 285, sqm: 380, perSqm: 750,  rentalPct: 12 },
  { brand: 'Hard Rock Cafe Bali',  revenue: 198, sqm: 520, perSqm: 381,  rentalPct: 15 },
  { brand: 'Jamba Juice',          revenue: 85,  sqm: 120, perSqm: 708,  rentalPct: 14 },
]

export const storeBreakdowns = {
  Bulgari: [
    { brand: 'Bvlgari - Plaza Indonesia', revenue: 156, sqm: 110, perSqm: 1418, rentalPct: 7.5 },
    { brand: 'Bvlgari - Plaza Senayan',    revenue: 98,  sqm: 80,  perSqm: 1225, rentalPct: 8.2 },
    { brand: 'Bvlgari - Grand Indonesia',  revenue: 58,  sqm: 60,  perSqm: 966,  rentalPct: 9.0 },
  ],
  Omega: [
    { brand: 'Omega - Plaza Senayan',    revenue: 110, sqm: 80,  perSqm: 1375, rentalPct: 8.5 },
    { brand: 'Omega - Pondok Indah Mall', revenue: 85,  sqm: 60,  perSqm: 1416, rentalPct: 9.0 },
    { brand: 'Omega - Grand Indonesia',  revenue: 50,  sqm: 40,  perSqm: 1250, rentalPct: 9.8 },
  ],
  'Atmos Indonesia': [
    { brand: 'Atmos - Plaza Indonesia',  revenue: 40,  sqm: 32,  perSqm: 1250, rentalPct: 9.5 },
    { brand: 'Atmos - Plaza Senayan',    revenue: 35,  sqm: 28,  perSqm: 1250, rentalPct: 9.8 },
    { brand: 'Atmos - Pondok Indah Mall', revenue: 20,  sqm: 20,  perSqm: 1000, rentalPct: 10.5 },
    { brand: 'Atmos Pink - Grand Indo',  revenue: 15,  sqm: 15,  perSqm: 1000, rentalPct: 11.2 }
  ],
  'Häagen-Dazs Indonesia': [
    { brand: 'Häagen-Dazs - Senayan City',    revenue: 95,  sqm: 120, perSqm: 791,  rentalPct: 11.5 },
    { brand: 'Häagen-Dazs - Grand Indonesia', revenue: 110, sqm: 140, perSqm: 785,  rentalPct: 12.0 },
    { brand: 'Häagen-Dazs - Pondok Indah',   revenue: 80,  sqm: 120, perSqm: 666,  rentalPct: 12.8 },
  ],
  'Hard Rock Cafe Bali': [
    { brand: 'Hard Rock Cafe - Kuta Beach', revenue: 198, sqm: 520, perSqm: 381,  rentalPct: 15.0 }
  ],
  'Lancôme Indonesia': [
    { brand: 'Lancôme - SOGO Plaza Senayan', revenue: 42,  sqm: 32,  perSqm: 1312, rentalPct: 9.8 },
    { brand: 'Lancôme - SEIBU Grand Indo',   revenue: 36,  sqm: 28,  perSqm: 1285, rentalPct: 10.2 }
  ],
  'Kiehl\'s Indonesia': [
    { brand: 'Kiehl\'s - Plaza Senayan',   revenue: 28,  sqm: 25,  perSqm: 1120, rentalPct: 10.8 },
    { brand: 'Kiehl\'s - Central Grand Indo', revenue: 22,  sqm: 20,  perSqm: 1100, rentalPct: 11.2 }
  ],
  Chronologie: [
    { brand: 'Chronologie - Plaza Senayan', revenue: 95, sqm: 75, perSqm: 1266, rentalPct: 10.0 }
  ],
  'Jamba Juice': [
    { brand: 'Jamba Juice - Central Park', revenue: 45,  sqm: 65,  perSqm: 692,  rentalPct: 13.8 },
    { brand: 'Jamba Juice - Kota Kasablanka', revenue: 40,  sqm: 55,  perSqm: 727,  rentalPct: 14.2 }
  ]
}

export const utilitiesCost = [
  { month: 'Jan', electricity: 12.0, water: 2.5, gas: 4.2, internet: 1.8, acSentral: 5.8, wasteCleaning: 1.2 },
  { month: 'Feb', electricity: 11.2, water: 2.2, gas: 4.0, internet: 1.8, acSentral: 5.5, wasteCleaning: 1.1 },
  { month: 'Mar', electricity: 13.5, water: 2.8, gas: 4.8, internet: 1.8, acSentral: 6.2, wasteCleaning: 1.3 },
  { month: 'Apr', electricity: 14.1, water: 2.6, gas: 4.5, internet: 1.9, acSentral: 6.0, wasteCleaning: 1.2 },
  { month: 'Mei', electricity: 15.0, water: 2.9, gas: 5.0, internet: 1.9, acSentral: 6.5, wasteCleaning: 1.4 },
  { month: 'Jun', electricity: 16.2, water: 3.1, gas: 5.5, internet: 2.0, acSentral: 6.8, wasteCleaning: 1.5 },
  { month: 'Jul', electricity: 15.8, water: 3.0, gas: 5.2, internet: 2.0, acSentral: 6.6, wasteCleaning: 1.4 },
  { month: 'Agt', electricity: 16.0, water: 3.2, gas: 5.4, internet: 2.1, acSentral: 6.7, wasteCleaning: 1.5 },
  { month: 'Sep', electricity: 16.5, water: 3.3, gas: 5.6, internet: 2.1, acSentral: 6.9, wasteCleaning: 1.6 },
  { month: 'Okt', electricity: 17.0, water: 3.4, gas: 5.8, internet: 2.2, acSentral: 7.1, wasteCleaning: 1.7 },
  { month: 'Nov', electricity: 17.5, water: 3.6, gas: 6.0, internet: 2.2, acSentral: 7.3, wasteCleaning: 1.8 },
  { month: 'Des', electricity: 18.0, water: 3.8, gas: 6.2, internet: 2.3, acSentral: 7.5, wasteCleaning: 1.9 },
]

// ─── GA DASHBOARD ─────────────────────────────────────────────────────────────
export const gaAssets = [
  { category: 'Gedung & Properti', value: 19.22, count: 8,  utilized: 92 },
  { category: 'Kendaraan',         value: 3.13,  count: 14, utilized: 88 },
  { category: 'IT Equipment',      value: 1.02,  count: 1506,utilized: 95 },
  { category: 'Furniture & FF&E',  value: 4.07,  count: 2792,utilized: 82 },
  { category: 'Mesin & Peralatan', value: 0.0,   count: 1173,utilized: 78 },
]

export const vendorData = [
  { category: 'Cleaning Service',    total: 8,  active: 7,  compliant: 6  },
  { category: 'Security',            total: 4,  active: 4,  compliant: 4  },
  { category: 'IT Maintenance',      total: 12, active: 10, compliant: 9  },
  { category: 'Building Maintenance',total: 6,  active: 5,  compliant: 5  },
  { category: 'Transportation',      total: 5,  active: 5,  compliant: 4  },
  { category: 'Catering',            total: 3,  active: 3,  compliant: 3  },
]

export const purchaseRequests = [
  { dept: 'Operations',  submitted: 48, approved: 42, completed: 38, pending: 10 },
  { dept: 'Marketing',   submitted: 22, approved: 20, completed: 18, pending:  4 },
  { dept: 'IT',          submitted: 35, approved: 32, completed: 30, pending:  5 },
  { dept: 'HR',          submitted: 15, approved: 14, completed: 14, pending:  1 },
  { dept: 'Finance',     submitted: 10, approved:  9, completed:  9, pending:  1 },
]

// ─── LEGAL DASHBOARD ──────────────────────────────────────────────────────────
export const contracts = [
  { id: 'CTR-001', name: 'Lease Agreement - Grand Indonesia',   type: 'Sewa',     entity: 'Bulgari',     status: 'Active',   expiry: '2027-03-31', value: 28.5 },
  { id: 'CTR-002', name: 'Lease Agreement - Bali Collection',   type: 'Sewa',     entity: 'Hard Rock Cafe Bali',status: 'Expiring', expiry: '2026-08-15', value: 12.0 },
  { id: 'CTR-003', name: 'Distribution Agreement - LVMH',       type: 'Distribusi',entity: 'Bulgari',   status: 'Active',   expiry: '2028-12-31', value: 450.0},
  { id: 'CTR-004', name: 'Service Agreement - SAP Indonesia',   type: 'Jasa',     entity: 'MRA HO',    status: 'Active',   expiry: '2026-12-31', value: 2.4 },
  { id: 'CTR-005', name: 'NDA - Potential Partner X',           type: 'NDA',      entity: 'MRA HO',    status: 'Active',   expiry: '2026-09-01', value: 0   },
  { id: 'CTR-006', name: 'Franchise Agreement - Häagen-Dazs',   type: 'Franchise',entity: 'Häagen-Dazs Indonesia',status: 'Active',   expiry: '2029-06-30', value: 85.0 },
  { id: 'CTR-007', name: 'Lease Agreement - Plaza Senayan',     type: 'Sewa',     entity: 'Omega',      status: 'Expiring', expiry: '2026-07-31', value: 18.2 },
  { id: 'CTR-008', name: 'Employment Agreement - Collective',   type: 'PKB',      entity: 'MRA Group',  status: 'Active',   expiry: '2027-01-01', value: 0   },
  { id: 'CTR-009', name: 'Digital Retainer - Client GoTo Group',type: 'Jasa',     entity: 'Harper\'s Bazaar',status: 'Active',   expiry: '2026-12-31', value: 24.5 },
  { id: 'CTR-010', name: 'Media Partnership - Client Unilever', type: 'Iklan',    entity: 'Cosmopolitan', status: 'Active',   expiry: '2026-10-31', value: 18.2 },
  { id: 'CTR-011', name: 'Event Management - Art Jakarta 2026', type: 'Event',    entity: 'Art Jakarta', status: 'Active',   expiry: '2026-07-15', value: 35.0 },
  { id: 'CTR-012', name: 'Content Distribution Agreement',      type: 'Lisensi',  entity: 'Hard Rock FM',status: 'Expiring', expiry: '2026-08-30', value: 12.8 },
]

export const litigation = [
  { case: 'Sengketa Tenaga Kerja - Surabaya', status: 'Ongoing',   risk: 'Medium', estimatedLiability: 2.5  },
  { case: 'Klaim Konsumen - Bali',            status: 'Settled',   risk: 'Low',    estimatedLiability: 0.1  },
  { case: 'Sengketa Kontrak Vendor',          status: 'Ongoing',   risk: 'Low',    estimatedLiability: 0.8  },
  { case: 'IP Dispute - Brand X',             status: 'Monitoring',risk: 'High',   estimatedLiability: 15.0 },
]

// ─── COMPLIANCE DASHBOARD ─────────────────────────────────────────────────────
export const complianceItems = [
  { module: 'Corporate Secretarial', items: 12, compliant: 11, risk: 'Low'    },
  { module: 'Trademark & IP',        items:  8, compliant:  7, risk: 'Medium' },
  { module: 'Vendor Compliance',     items: 45, compliant: 38, risk: 'Medium' },
  { module: 'Import Compliance',     items: 18, compliant: 16, risk: 'Low'    },
  { module: 'Halal & Product',       items: 24, compliant: 24, risk: 'Low'    },
  { module: 'Data Privacy (PDPA)',   items: 15, compliant: 12, risk: 'High'   },
  { module: 'DOA Monitoring',        items: 32, compliant: 30, risk: 'Low'    },
  { module: 'Regulatory',            items: 28, compliant: 25, risk: 'Medium' },
]

export const whistleblowing = [
  { month: 'Jan', received: 2, resolved: 2, pending: 0 },
  { month: 'Feb', received: 1, resolved: 1, pending: 0 },
  { month: 'Mar', received: 3, resolved: 2, pending: 1 },
  { month: 'Apr', received: 0, resolved: 1, pending: 0 },
  { month: 'Mei', received: 2, resolved: 1, pending: 1 },
  { month: 'Jun', received: 1, resolved: 0, pending: 1 },
]

export const riskRegister = [
  { risk: 'Kenaikan Sewa Lokasi Premium',  category: 'Operational', likelihood: 4, impact: 4, level: 'High'   },
  { risk: 'Fluktuasi Nilai Tukar IDR/USD', category: 'Financial',   likelihood: 3, impact: 5, level: 'High'   },
  { risk: 'Perubahan Regulasi Impor',      category: 'Compliance',  likelihood: 3, impact: 3, level: 'Medium' },
  { risk: 'Turnover Tenaga Ahli',          category: 'HR',          likelihood: 3, impact: 4, level: 'High'   },
  { risk: 'Serangan Siber / Data Breach',  category: 'IT',          likelihood: 2, impact: 5, level: 'High'   },
  { risk: 'Kerusakan Aset Fisik',          category: 'Operational', likelihood: 2, impact: 3, level: 'Medium' },
  { risk: 'Vendor Gagal Deliver',          category: 'Operational', likelihood: 2, impact: 2, level: 'Low'    },
]

// ─── OUTSTANDING CONTRACTS & RECEIVABLES DETAIL ────────────────────────────────
export const outstandingContracts = [
  { id: 'CTR-009', client: 'GoTo Group',   project: 'Digital Campaign & Tech Retainer',         segment: 'Media',  brand: 'Harper\'s Bazaar',    totalValue: 24.5, billedValue: 12.0, unbilledValue: 12.5, unpaidInvoices: 4.5, dueDate: '2026-06-30' },
  { id: 'CTR-010', client: 'Unilever TBK', project: 'Media Placement & Brand Activation',       segment: 'Media',  brand: 'Cosmopolitan',       totalValue: 18.2, billedValue: 10.0, unbilledValue: 8.2,  unpaidInvoices: 5.2, dueDate: '2026-07-15' },
  { id: 'CTR-011', client: 'Hyundai Ind',  project: 'Event Management - Art Jakarta 2026',      segment: 'Media',  brand: 'Art Jakarta',        totalValue: 35.0, billedValue: 20.0, unbilledValue: 15.0, unpaidInvoices: 8.0, dueDate: '2026-06-25' },
  { id: 'CTR-012', client: 'Gaikindo',     project: 'Content Licensing & Media Distribution',   segment: 'Media',  brand: 'Hard Rock FM',       totalValue: 12.8, billedValue: 6.0,  unbilledValue: 6.8,  unpaidInvoices: 2.8, dueDate: '2026-08-30' },
  { id: 'CTR-001', client: 'LVMH Group',   project: 'Consignment Boutique Setup - GI Mall',     segment: 'Retail', brand: 'Bulgari',            totalValue: 15.0, billedValue: 10.0, unbilledValue: 5.0,  unpaidInvoices: 1.2, dueDate: '2026-09-15' },
  { id: 'CTR-003', client: 'Omega Corp',   project: 'Authorized Retail Distribution Setup',     segment: 'Retail', brand: 'Omega',              totalValue: 22.0, billedValue: 18.0, unbilledValue: 4.0,  unpaidInvoices: 0.8, dueDate: '2026-10-10' },
  { id: 'CTR-006', client: 'HD Principal', project: 'B2B HHD Supplier Franchise Milestone',     segment: 'F&B',    brand: 'Häagen-Dazs Indonesia',totalValue: 8.5,  billedValue: 7.0,  unbilledValue: 1.5,  unpaidInvoices: 0.2, dueDate: '2026-07-20' },
]

// ─── LEGAL ENTITIES HEADCOUNT ───────────────────────────────────────────────
export const ptHeadcount = [
  { name: 'PT. Rahayu Arumdhani Distribusindo', count: 157, sector: 'F&B' },
  { name: 'PT. Rahayu Arumdhani International', count: 144, sector: 'F&B' },
  { name: 'PT. Media Insani Abadi', count: 76, sector: 'Media' },
  { name: 'PT Radio Suara Kedjajaan', count: 62, sector: 'Media' },
  { name: 'PT. Paramita Kreasi Abadi', count: 40, sector: 'F&B' },
  { name: 'PT Mugi Rekso Abadi', count: 32, sector: 'GENERAL' },
  { name: 'PT Hourlogy Indah Perkasa', count: 32, sector: 'Retail' },
  { name: 'PT Radio Antar Nusa Djaja', count: 27, sector: 'Media' },
  { name: 'PT Mogems Putri International', count: 24, sector: 'Retail' },
  { name: 'PT Hourlogy Inti Semesta', count: 16, sector: 'Retail' },
  { name: 'PT Jemma Putri International', count: 16, sector: 'Retail' },
  { name: 'PT. Artindo Jakarta Seni Kini', count: 12, sector: 'Media' },
  { name: 'PT Surya Swara Mediatama', count: 11, sector: 'Media' },
  { name: 'PT. Emera Digital Indonesia', count: 10, sector: 'Media' },
  { name: 'PT. Rupa Kreasi Anak Bangsa', count: 9, sector: 'Retail' },
  { name: 'PT Amanda Arundhani Aishwarya', count: 9, sector: 'F&B' },
  { name: 'PT Permata Landmarq Abadi', count: 7, sector: 'Media' },
  { name: 'PT Emera Boga Makmur', count: 6, sector: 'F&B' },
  { name: 'PT. Graha Emera Abadi', count: 2, sector: 'GENERAL' },
]

// ─── MARKETING DASHBOARD DATA ───────────────────────────────────────────────
export const marketingSpendData = [
  { channel: 'Digital Marketing', share: 0.40, color: '#3b82f6' },
  { channel: 'Events & Activations', share: 0.30, color: '#f97316' },
  { channel: 'KOLs & Influencers', share: 0.20, color: '#10b981' },
  { channel: 'PR & Traditional Media', share: 0.10, color: '#8b5cf6' }
]

export const marketingMonthlyTrend = [
  { month: 'Jan', spend: 8.5, roas: 4.2, cac: 120 },
  { month: 'Feb', spend: 7.8, roas: 4.5, cac: 115 },
  { month: 'Mar', spend: 9.2, roas: 4.1, cac: 125 },
  { month: 'Apr', spend: 10.0, roas: 4.8, cac: 110 },
  { month: 'Mei', spend: 11.5, roas: 5.2, cac: 105 },
  { month: 'Jun', spend: 12.0, roas: 5.5, cac: 100 }
]

export const sectorMarketingMetrics = {
  Retail: [
    { metric: 'VIC Customer Retention Rate', value: '78%', target: '75%', status: 'Good' },
    { metric: 'Full-Price Sell-Through %', value: '64%', target: '60%', status: 'Good' },
    { metric: 'Average Order Value (AOV)', value: '14.2 jt', target: '12.5 jt', status: 'Good' }
  ],
  FnB: [
    { metric: 'Promo Redemption Rate', value: '12.4%', target: '10.0%', status: 'Good' },
    { metric: 'Store Walk-in Growth', value: '+8.2%', target: '+5.0%', status: 'Good' },
    { metric: 'Repeat Visit Frequency', value: '2.8x / bln', target: '2.5x / bln', status: 'Good' }
  ],
  Media: [
    { metric: 'CPM (Cost Per Mille)', value: '45.0k IDR', target: '50.0k IDR', status: 'Good' },
    { metric: 'Audience Reach Growth', value: '+14.5%', target: '+10.0%', status: 'Good' },
    { metric: 'Ad-Click Conversion', value: '3.4%', target: '3.0%', status: 'Good' }
  ],
  All: [
    { metric: 'Holding Brand Equity Index', value: '82/100', target: '80/100', status: 'Good' },
    { metric: 'Cross-Pillar Referrals', value: '8.420 user', target: '7.500 user', status: 'Good' },
    { metric: 'Blended Cost Per Lead', value: '62k IDR', target: '70k IDR', status: 'Good' }
  ]
}

export const marketingExpensesBreakdown = [
  { category: 'Advertising & Promotion Event', share: 0.35 },
  { category: 'Cost Of Event', share: 0.15 },
  { category: 'Commision', share: 0.12 },
  { category: 'Internal / External Research', share: 0.06 },
  { category: 'Entertainment', share: 0.05 },
  { category: 'Homepage', share: 0.05 },
  { category: 'Selling Expenses', share: 0.05 },
  { category: 'Gathering', share: 0.04 },
  { category: 'Travelling Expenses', share: 0.04 },
  { category: 'Documentation', share: 0.03 },
  { category: 'Training', share: 0.03 },
  { category: 'Other Expenses', share: 0.02 },
  { category: 'Others', share: 0.01 }
]

export const marketingChannelDetails = {
  'Digital Marketing': {
    roi: '5.8x',
    subChannels: [
      { name: 'Meta Ads (FB/IG)', share: 0.45 },
      { name: 'Google Search/GDN', share: 0.30 },
      { name: 'TikTok Ads Campaign', share: 0.25 }
    ]
  },
  'Events & Activations': {
    roi: '3.5x',
    subChannels: [
      { name: 'VIP Trunk Shows', share: 0.40 },
      { name: 'Grand Opening Launch', share: 0.35 },
      { name: 'Art Jakarta & Exhibitions', share: 0.25 }
    ]
  },
  'KOLs & Influencers': {
    roi: '4.8x',
    subChannels: [
      { name: 'Mega KOL Retainers', share: 0.50 },
      { name: 'Micro-Influencer Seeding', share: 0.30 },
      { name: 'Affiliate Commissions', share: 0.20 }
    ]
  },
  'PR & Traditional Media': {
    roi: '2.2x',
    subChannels: [
      { name: 'Print Placements (Harper\'s)', share: 0.50 },
      { name: 'Out-of-Home (OOH) Billboards', share: 0.30 },
      { name: 'Press Conferences & Agency', share: 0.20 }
    ]
  }
}

export const gaOpexLedger = [
  { category: 'Bad Debts Expenses', actual: 1.5, budget: 2.0 },
  { category: 'Bank Charges', actual: 3.2, budget: 3.0 },
  { category: 'Courier, Postage & Stamp Duty', actual: 1.2, budget: 1.5 },
  { category: 'Credit Card Commission', actual: 12.4, budget: 12.0 },
  { category: 'Damage, Spoilage & Spillage', actual: 0.8, budget: 1.0 },
  { category: 'Electricity, Water & Plant', actual: 18.5, budget: 20.0 },
  { category: 'Entertainment', actual: 4.2, budget: 4.5 },
  { category: 'Fotocopy & Printing', actual: 0.9, budget: 1.2 },
  { category: 'Gathering', actual: 3.5, budget: 3.0 },
  { category: 'Insurance', actual: 8.5, budget: 8.0 },
  { category: 'License & Permit', actual: 2.4, budget: 2.5 },
  { category: 'Newspaper & Magazine', actual: 0.3, budget: 0.5 },
  { category: 'Operating Support', actual: 15.0, budget: 16.0 },
  { category: 'Professional Fee', actual: 9.8, budget: 10.0 },
  { category: 'Rental Expenses', actual: 45.0, budget: 48.0 },
  { category: 'Repair & Maintenance', actual: 14.5, budget: 15.0 },
  { category: 'Representation & Donation', actual: 1.8, budget: 2.0 },
  { category: 'Staff Uniform', actual: 2.2, budget: 2.5 },
  { category: 'Stationaries & Office Supplies', actual: 1.4, budget: 1.5 },
  { category: 'Telecommunication', actual: 3.8, budget: 4.0 },
  { category: 'Training & Recruitment Expense', actual: 5.5, budget: 6.0 },
  { category: 'Transportation', actual: 7.2, budget: 7.5 },
  { category: 'Travelling Expenses', actual: 6.8, budget: 7.0 },
  { category: 'Utilities', actual: 5.4, budget: 5.0 },
  { category: 'Sinking Fund', actual: 10.0, budget: 10.0 },
  { category: 'Service Charges', actual: 15.6, budget: 15.0 },
  { category: 'Other', actual: 2.1, budget: 2.5 }
]

export const gaSlaMonthlyTrend = [
  { month: 'Jan', slaDays: 4.2 },
  { month: 'Feb', slaDays: 3.9 },
  { month: 'Mar', slaDays: 4.5 },
  { month: 'Apr', slaDays: 3.6 },
  { month: 'Mei', slaDays: 3.2 },
  { month: 'Jun', slaDays: 2.8 }
]




