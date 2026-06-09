import { createContext, useContext, useState, useMemo, useEffect } from 'react'
import * as dummy from '../data/dummyData'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [period, setPeriod] = useState('Monthly')
  const [segment, setSegment] = useState('All')
  const [brand, setBrand] = useState('All')
  const [currency, setCurrency] = useState('IDR')
  const [selectedMonth, setSelectedMonth] = useState('Jun')
  const [selectedYear, setSelectedYear] = useState('2026')
  const [user] = useState({ name: 'Aris S.', role: 'CEO / COO / CFO', avatar: 'AS' })
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [hideValues, setHideValues] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Trigger loading state briefly when primary filters are changed
  useEffect(() => {
    setIsTransitioning(true)
    const timer = setTimeout(() => {
      setIsTransitioning(false)
    }, 350)
    return () => clearTimeout(timer)
  }, [period, segment, brand, selectedMonth, selectedYear])

  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light'
    }
    return 'light'
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }, [theme])

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', next)
    }
  }

  const [rates, setRates] = useState({
    USD: 16250,
    EUR: 17580,
    SGD: 12040,
    GBP: 20680,
    JPY: 103.8,
  })
  const [changes, setChanges] = useState({
    USD: 0.12,
    EUR: -0.05,
    SGD: 0.08,
    GBP: 0.15,
    JPY: -0.22,
  })
  const [ratesLoading, setRatesLoading] = useState(true)
  const [lastRatesUpdated, setLastRatesUpdated] = useState(null)

  useEffect(() => {
    let active = true
    async function fetchRates() {
      try {
        const res = await fetch('https://open.er-api.com/v6/latest/USD')
        const data = await res.json()
        if (active && data && data.rates && data.rates.IDR) {
          const idr = data.rates.IDR
          const newRates = {
            USD: idr,
            EUR: idr / data.rates.EUR,
            SGD: idr / data.rates.SGD,
            GBP: idr / data.rates.GBP,
            JPY: idr / data.rates.JPY,
          }
          setRates(newRates)
          setRatesLoading(false)
          setLastRatesUpdated(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
        }
      } catch (err) {
        console.error('Failed to fetch rates, using fallback: ', err)
        setRatesLoading(false)
        setLastRatesUpdated(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
      }
    }
    
    fetchRates()
    const interval = setInterval(fetchRates, 60000)

    return () => {
      active = false
      clearInterval(interval)
    }
  }, [])

  // Simulate real-time fluctuations to keep the running ticker visually active
  useEffect(() => {
    const timer = setInterval(() => {
      setRates(prev => {
        const next = { ...prev }
        const nextChanges = { ...changes }
        Object.keys(next).forEach(k => {
          const changePercent = (Math.random() - 0.5) * 0.01 // max 0.005% fluctuation
          const delta = next[k] * changePercent
          next[k] = parseFloat((next[k] + delta).toFixed(2))
          nextChanges[k] = parseFloat((nextChanges[k] + changePercent * 100).toFixed(2))
        })
        setChanges(nextChanges)
        return next
      })
    }, 4000)

    return () => clearInterval(timer)
  }, [changes])

  const usdRate = rates.USD

  // Standard conversion helper
  const convertVal = (idrBillion) => {
    if (currency === 'USD') {
      // IDR Billion to USD Million
      // IDR 1B = 1,000,000,000 IDR
      // In USD: 1,000,000,000 / USD_RATE = Returns value in USD Million
      return (idrBillion * 1_000) / (usdRate / 1000)
    }
    return idrBillion // Returns value in IDR Billion
  }

  const fmtCurrencySymbol = () => {
    return currency === 'USD' ? '$' : 'IDR'
  }

  const fmtCurrencyUnit = () => {
    return currency === 'USD' ? 'M' : 'B'
  }

  function fmt(value, unit = '') {
    if (value === undefined || value === null) return '-'
    if (hideValues) {
      if (unit === 'B') {
        return currency === 'USD' ? '$ •••• M' : 'IDR •••• B'
      }
      return currency === 'USD' ? '$ ••••' : 'IDR ••••'
    }
    if (currency === 'USD') {
      // If value is already in USD Million
      if (unit === 'B') {
        const usdVal = convertVal(value)
        return `$${usdVal.toFixed(1)}M`
      }
      return `$${value.toLocaleString('en-US')}`
    }
    if (unit === 'B') return `IDR ${value.toFixed(1)}B`
    return `IDR ${value.toLocaleString('id-ID')}`
  }

  // ─── LOGIC FILTERING ────────────────────────────────────────────────────────
  // Calculate selected brands
  const activeBrands = useMemo(() => {
    if (brand !== 'All') {
      return [brand]
    }
    if (segment !== 'All') {
      const segKey = segment === 'F&B' ? 'FnB' : segment
      return dummy.businessUnits[segKey] || []
    }
    return Object.values(dummy.businessUnits).flat()
  }, [segment, brand])

  // Scale ratio for metrics that do not have brand-level details
  const scaleRatio = useMemo(() => {
    const totalRevenue = dummy.brandPerformance.reduce((acc, b) => acc + b.revenue, 0)
    const filteredRevenue = dummy.brandPerformance
      .filter(b => activeBrands.includes(b.brand))
      .reduce((acc, b) => acc + b.revenue, 0)
    return totalRevenue > 0 ? filteredRevenue / totalRevenue : 0
  }, [activeBrands])

  // 1. Brand performance table
  const filteredBrandPerformance = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des']
    const monthIndex = months.indexOf(selectedMonth) + 1
    const ytdFactor = monthIndex / 6.0 // June is our base YTD data (Month 6)

    return dummy.brandPerformance
      .filter(b => activeBrands.includes(b.brand))
      .map(b => ({
        ...b,
        revenue: parseFloat((b.revenue * ytdFactor).toFixed(1)),
        ebitda: parseFloat((b.ebitda * ytdFactor).toFixed(1)),
      }))
  }, [activeBrands, selectedMonth])

  // 2. Dynamic KPI calculation
  const filteredKpis = useMemo(() => {
    const revenue = filteredBrandPerformance.reduce((acc, b) => acc + b.revenue, 0)
    const ebitda = filteredBrandPerformance.reduce((acc, b) => acc + b.ebitda, 0)
    
    // Scale other metrics by revenue ratio
    const grossProfitVal = dummy.executiveKpis.grossProfit.value * scaleRatio
    const opexVal = dummy.executiveKpis.opex.value * scaleRatio
    const netProfitVal = dummy.executiveKpis.netProfit.value * scaleRatio
    const cashVal = dummy.executiveKpis.cashPosition.value * scaleRatio
    const freeCashVal = dummy.executiveKpis.freeCashPos.value * scaleRatio
    const inventoryVal = dummy.executiveKpis.inventoryPos.value * scaleRatio

    const groupRevenueBase = dummy.brandPerformance.reduce((acc, b) => acc + b.revenue, 0)
    const vsBudget = scaleRatio > 0 
      ? parseFloat(((revenue / (groupRevenueBase * scaleRatio)) * 100.8).toFixed(1))
      : 0

    return {
      groupRevenue: { value: revenue, yoy: 14.2, vs_budget: vsBudget },
      ebitda: { value: ebitda, pctRevenue: revenue > 0 ? parseFloat((ebitda / revenue * 100).toFixed(1)) : 0, yoy: 22.1 },
      grossProfit: { value: grossProfitVal, pctRevenue: revenue > 0 ? parseFloat((grossProfitVal / revenue * 100).toFixed(1)) : 0, yoy: 18.4 },
      opex: { value: opexVal, pctRevenue: revenue > 0 ? parseFloat((opexVal / revenue * 100).toFixed(1)) : 0, yoy: 10.5 },
      netProfit: { value: netProfitVal, pctRevenue: revenue > 0 ? parseFloat((netProfitVal / revenue * 100).toFixed(1)) : 0, yoy: 25.3 },
      cashPosition: { value: cashVal, yoy: 8.7 },
      freeCashPos: { value: freeCashVal, yoy: 5.2 },
      inventoryPos: { value: inventoryVal, yoy: 12.1 },
    }
  }, [filteredBrandPerformance, scaleRatio])

  // 3. Dynamic monthly revenue
  const filteredMonthlyRevenue = useMemo(() => {
    return dummy.monthlyRevenue.map(m => ({
      ...m,
      actual: parseFloat((m.actual * scaleRatio).toFixed(1)),
      budget: parseFloat((m.budget * scaleRatio).toFixed(1)),
      lastYear: parseFloat((m.lastYear * scaleRatio).toFixed(1)),
      forecast: parseFloat((m.forecast * scaleRatio).toFixed(1)),
    }))
  }, [scaleRatio])

  // 4. Dynamic segment revenue
  const filteredSegmentRevenue = useMemo(() => {
    if (segment === 'All') {
      const stats = {
        Retail: { name: 'Retail', value: 0, color: '#3b82f6' },
        'F&B': { name: 'F&B', value: 0, color: '#f59e0b' },
        Media: { name: 'Media', value: 0, color: '#10b981' }
      }
      filteredBrandPerformance.forEach(b => {
        const seg = b.segment === 'FnB' ? 'F&B' : b.segment
        if (stats[seg]) {
          stats[seg].value += b.revenue
        }
      })
      return Object.values(stats).filter(s => s.value > 0)
    }
    // If specific segment, return its brands' revenues
    return filteredBrandPerformance.map(b => ({
      name: b.brand,
      value: b.revenue,
      color: segment === 'F&B' ? '#f59e0b' : segment === 'Retail' ? '#3b82f6' : '#10b981'
    }))
  }, [segment, filteredBrandPerformance])

  // 5. Dynamic AP/AR Aging based on sector profiles
  const filteredApArAging = useMemo(() => {
    const totalRev = filteredKpis.groupRevenue.value
    
    // Sector specific parameters
    let arShare = 0.05 // default: 5% of YTD revenue is outstanding
    let apShare = 0.08
    let arDistribution = [0.85, 0.10, 0.05, 0.00] // default: [0-30, 31-60, 61-90, >90]
    let apDistribution = [0.70, 0.20, 0.08, 0.02]

    if (segment === 'Media') {
      arShare = 0.35 // Media has high outstanding receivables due to longer billing/contract terms
      apShare = 0.12
      arDistribution = [0.35, 0.30, 0.20, 0.15]
      apDistribution = [0.55, 0.25, 0.15, 0.05]
    } else if (segment === 'F&B') {
      arShare = 0.02 // F&B is cash / POS based, almost no AR
      apShare = 0.06
      arDistribution = [0.95, 0.05, 0.00, 0.00]
      apDistribution = [0.80, 0.15, 0.04, 0.01]
    } else if (segment === 'Retail') {
      arShare = 0.04 // Retail has low AR (mostly credit cards)
      apShare = 0.15 // High AP to luxury watch/jewelry principals
      arDistribution = [0.90, 0.08, 0.02, 0.00]
      apDistribution = [0.60, 0.25, 0.10, 0.05]
    }

    const totalAr = totalRev * arShare
    const totalAp = (totalRev * 0.70) * apShare // COGS-based estimate

    const buckets = ['0-30 hari', '31-60 hari', '61-90 hari', '>90 hari']
    return buckets.map((bucket, i) => ({
      bucket,
      ar: parseFloat((totalAr * arDistribution[i]).toFixed(1)),
      ap: parseFloat((totalAp * apDistribution[i]).toFixed(1)),
    }))
  }, [segment, filteredKpis])

  // 5.5. Dynamic Operating Ratios based on segment profile
  const filteredRatios = useMemo(() => {
    let dso = 22
    let dio = 89
    let dpo = 38
    let currentRatio = 1.82
    let quickRatio = 1.24
    let cashRatio = 0.68
    let debtEquity = 0.42
    let icr = 7.8

    if (segment === 'Media') {
      dso = 72 // Media receivable collection is slower
      dio = 6  // Very low inventory (services)
      dpo = 48
      currentRatio = 1.55
      quickRatio = 1.48
      cashRatio = 0.55
    } else if (segment === 'F&B') {
      dso = 3  // Instantly cleared POS sales
      dio = 14 // Fresh food stock changes quickly
      dpo = 32
      currentRatio = 1.15
      quickRatio = 0.95
      cashRatio = 0.75
    } else if (segment === 'Retail') {
      dso = 8
      dio = 175 // Slow inventory rotation for high-end luxury items
      dpo = 75
      currentRatio = 2.45
      quickRatio = 0.85 // Low quick ratio because cash is tied up in stock
      cashRatio = 0.42
    }

    // Apply minor brand variance if specific brand is active
    if (brand !== 'All') {
      const charCodeSum = brand.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
      const variance = (charCodeSum % 10 - 5) / 100 // -5% to +4%
      dso = Math.round(dso * (1 + variance))
      dio = Math.round(dio * (1 + variance * 2))
      dpo = Math.round(dpo * (1 + variance * 1.5))
    }

    const ccc = dso + dio - dpo

    return {
      dso,
      dio,
      dpo,
      ccc,
      currentRatio,
      quickRatio,
      cashRatio,
      debtEquity,
      icr
    }
  }, [segment, brand])

  // 6. Dynamic Cash Flow
  const filteredCashFlow = useMemo(() => {
    return dummy.cashFlow.map(c => ({
      ...c,
      operating: parseFloat((c.operating * scaleRatio).toFixed(1)),
      investing: parseFloat((c.investing * scaleRatio).toFixed(1)),
      financing: parseFloat((c.financing * scaleRatio).toFixed(1)),
    }))
  }, [scaleRatio])

  // 7. Dynamic CAPEX Data
  const filteredCapexData = useMemo(() => {
    return dummy.capexData.map(c => ({
      ...c,
      budget: parseFloat((c.budget * scaleRatio).toFixed(1)),
      actual: parseFloat((c.actual * scaleRatio).toFixed(1)),
    }))
  }, [scaleRatio])

  // 7.5. Dynamic OPEX Data breakdown
  const filteredOpexData = useMemo(() => {
    const opexBase = [
      { category: 'Gaji & Tunjangan',   budget: 110.0, actual: 104.5, color: '#3b82f6' }, // Blue
      { category: 'Sewa Tempat & Butik', budget: 65.0,  actual: 62.0,  color: '#f97316' }, // Orange
      { category: 'Marketing & Promosi', budget: 35.0,  actual: 30.5,  color: '#10b981' }, // Emerald
      { category: 'Utilitas & IT',      budget: 20.0,  actual: 18.2,  color: '#0ea5e9' }, // Sky
      { category: 'Operasional Lainnya', budget: 15.0,  actual: 14.8,  color: '#14b8a6' }, // Teal
    ]
    return opexBase.map(o => ({
      ...o,
      budget: parseFloat((o.budget * scaleRatio).toFixed(1)),
      actual: parseFloat((o.actual * scaleRatio).toFixed(1)),
      pct: o.budget > 0 ? Math.round((o.actual / o.budget) * 100) : 0
    }))
  }, [scaleRatio])

  // 7.6. Dynamic PT Headcount
  const filteredPtHeadcount = useMemo(() => {
    let list = dummy.ptHeadcount
    if (segment !== 'All') {
      list = list.filter(pt => pt.sector === segment)
    }
    return list
  }, [segment])

  // Dynamic Marketing KPIs
  const filteredMarketingKpis = useMemo(() => {
    const totalRevenue = filteredKpis.groupRevenue.value
    const spendVal = parseFloat((totalRevenue * 0.015).toFixed(1))
    
    let roas = 5.5
    let cac = '100k'
    let engagement = '5.1%'
    
    if (segment === 'Retail') {
      roas = 5.8
      cac = currency === 'USD' ? '$22' : '350k'
      engagement = '4.2%'
    } else if (segment === 'F&B') {
      roas = 4.8
      cac = currency === 'USD' ? '$1.6' : '25k'
      engagement = '5.5%'
    } else if (segment === 'Media') {
      roas = 6.2
      cac = currency === 'USD' ? '$2.8' : '45k'
      engagement = '8.4%'
    } else {
      cac = currency === 'USD' ? '$6.3' : '100k'
    }

    return {
      spend: { value: spendVal, yoy: 12.5 },
      roas: { value: roas, target: '> 4.5x', yoy: 8.4 },
      cac: { value: cac, target: '< budget', yoy: -5.2 },
      engagement: { value: engagement, target: '> 4.0%', yoy: 10.2 }
    }
  }, [filteredKpis, segment, currency])

  // Dynamic Marketing Spend
  const filteredMarketingSpend = useMemo(() => {
    const totalSpend = filteredMarketingKpis.spend.value
    return dummy.marketingSpendData.map(c => ({
      ...c,
      value: parseFloat((totalSpend * c.share).toFixed(2)),
      percentage: Math.round(c.share * 100)
    }))
  }, [filteredMarketingKpis])

  // Dynamic Marketing Monthly Trend
  const filteredMarketingTrend = useMemo(() => {
    return dummy.marketingMonthlyTrend.map(t => {
      let segmentCacMultiplier = 1
      if (segment === 'Retail') segmentCacMultiplier = 3.5
      else if (segment === 'F&B') segmentCacMultiplier = 0.25
      else if (segment === 'Media') segmentCacMultiplier = 0.45
      
      const cacVal = t.cac * segmentCacMultiplier
      const finalCac = currency === 'USD' ? parseFloat((cacVal / (usdRate / 1000)).toFixed(1)) : Math.round(cacVal)

      return {
        ...t,
        spend: parseFloat((t.spend * scaleRatio).toFixed(1)),
        cac: finalCac,
        roas: parseFloat((t.roas * (segment === 'Retail' ? 1.05 : segment === 'F&B' ? 0.9 : 1.1)).toFixed(1))
      }
    })
  }, [scaleRatio, segment, currency])

  // Dynamic Marketing Metrics List
  const filteredMarketingMetrics = useMemo(() => {
    const key = segment === 'F&B' ? 'FnB' : segment
    return dummy.sectorMarketingMetrics[key] || dummy.sectorMarketingMetrics.All
  }, [segment])

  // Dynamic Marketing Expenses Breakdown
  const filteredMarketingExpensesBreakdown = useMemo(() => {
    const totalSpend = filteredMarketingKpis.spend.value
    return dummy.marketingExpensesBreakdown.map(p => ({
      ...p,
      value: parseFloat((totalSpend * p.share).toFixed(2)),
      percentage: Math.round(p.share * 100)
    }))
  }, [filteredMarketingKpis])

  // Dynamic Marketing Channel Sub-Details
  const filteredMarketingChannelDetails = useMemo(() => {
    const totalSpend = filteredMarketingKpis.spend.value
    const res = {}
    
    Object.keys(dummy.marketingChannelDetails).forEach(channel => {
      const detail = dummy.marketingChannelDetails[channel]
      const mainChannelSpend = totalSpend * (dummy.marketingSpendData.find(d => d.channel === channel)?.share || 0)
      
      let roi = detail.roi
      if (segment === 'Retail' && channel === 'Digital Marketing') roi = '6.4x'
      if (segment === 'F&B' && channel === 'Events & Activations') roi = '2.8x'
      if (segment === 'Media' && channel === 'PR & Traditional Media') roi = '3.8x'
      
      res[channel] = {
        roi,
        subChannels: detail.subChannels.map(sub => ({
          ...sub,
          value: parseFloat((mainChannelSpend * sub.share).toFixed(2)),
          percentage: Math.round(sub.share * 100)
        }))
      }
    })
    
    return res
  }, [filteredMarketingKpis, segment])




  // 8. Dynamic HR KPIs
  const filteredHrKpis = useMemo(() => {
    const baseHeadcount = filteredPtHeadcount.reduce((sum, pt) => sum + pt.count, 0)
    
    // Scale headcount to specific brand
    const headcountVal = brand !== 'All' 
      ? Math.round(baseHeadcount * scaleRatio * 3) // brand share within segment scaled up
      : baseHeadcount

    const employeeCostVal = parseFloat((filteredKpis.groupRevenue.value * 0.05).toFixed(1))

    return {
      headcount: { value: headcountVal, yoy: 5.2 },
      employeeCost: { value: employeeCostVal, pctRev: 5.0, yoy: 8.1 },
      turnoverRate: dummy.hrKpis.turnoverRate,
      attendance: dummy.hrKpis.attendance,
    }
  }, [filteredPtHeadcount, brand, scaleRatio, filteredKpis])

  // Dynamic Personnel Expenses
  const filteredPersonnelExpenses = useMemo(() => {
    const totalCost = filteredHrKpis.employeeCost.value
    return dummy.personnelExpenses.map(p => ({
      ...p,
      value: parseFloat((totalCost * p.share).toFixed(2)),
      percentage: Math.round(p.share * 100)
    }))
  }, [filteredHrKpis])


  // 9. Filtered store productivity
  const filteredStoreProductivity = useMemo(() => {
    if (brand !== 'All') {
      return dummy.storeBreakdowns[brand] || dummy.storeProductivity.filter(s => s.brand === brand || s.brand.startsWith(brand.split(' ')[0]))
    }
    if (segment !== 'All') {
      const segBrands = dummy.businessUnits[segment === 'F&B' ? 'FnB' : segment] || []
      return dummy.storeProductivity.filter(s => segBrands.some(sb => sb.startsWith(s.brand.split(' ')[0]) || s.brand.startsWith(sb.split(' ')[0])))
    }
    return dummy.storeProductivity
  }, [segment, brand])

  // 10. Filtered contracts
  const filteredContracts = useMemo(() => {
    if (brand !== 'All') {
      return dummy.contracts.filter(c => c.entity.toLowerCase().includes(brand.toLowerCase().split(' ')[0]))
    }
    if (segment !== 'All') {
      const segBrands = dummy.businessUnits[segment === 'F&B' ? 'FnB' : segment] || []
      return dummy.contracts.filter(c => segBrands.some(sb => c.entity.toLowerCase().includes(sb.toLowerCase().split(' ')[0])))
    }
    return dummy.contracts
  }, [segment, brand])

  // 11. Dynamic GA Assets
  const filteredGaAssets = useMemo(() => {
    return dummy.gaAssets.map(a => ({
      ...a,
      value: parseFloat((a.value * scaleRatio).toFixed(1)),
      count: Math.round(a.count * scaleRatio) || 1,
    }))
  }, [scaleRatio])

  // 11.5. Dynamic GA Opex Ledger
  const filteredGaOpexLedger = useMemo(() => {
    return dummy.gaOpexLedger.map(o => ({
      ...o,
      budget: parseFloat(convertVal(o.budget * scaleRatio).toFixed(1)),
      actual: parseFloat(convertVal(o.actual * scaleRatio).toFixed(1)),
    }))
  }, [scaleRatio, currency])

  // 11.6. GA SLA trend
  const filteredGaSlaTrend = useMemo(() => {
    return dummy.gaSlaMonthlyTrend
  }, [])

  // 12. Dynamic compliance items
  const filteredComplianceItems = useMemo(() => {
    if (segment !== 'All') {
      // Map compliance areas to segments roughly
      return dummy.complianceItems.filter((_, i) => {
        if (segment === 'F&B') return i % 2 === 0
        if (segment === 'Retail') return i % 3 === 0
        return i % 2 !== 0
      })
    }
    return dummy.complianceItems
  }, [segment])

  // 13. Dynamic Outstanding Contracts & Receivables Detail
  const filteredOutstandingContracts = useMemo(() => {
    let list = dummy.outstandingContracts || []
    if (brand !== 'All') {
      list = list.filter(c => c.brand === brand)
    } else if (segment !== 'All') {
      list = list.filter(c => c.segment === segment)
    }
    return list.map(c => ({
      ...c,
      totalValue: convertVal(c.totalValue),
      billedValue: convertVal(c.billedValue),
      unbilledValue: convertVal(c.unbilledValue),
      unpaidInvoices: convertVal(c.unpaidInvoices),
    }))
  }, [segment, brand, currency])

  return (
    <AppContext.Provider
      value={{
        period, setPeriod,
        segment, setSegment,
        brand, setBrand,
        currency, setCurrency,
        selectedMonth, setSelectedMonth,
        selectedYear, setSelectedYear,
        user,
        fmt,
        convertVal,
        fmtCurrencySymbol,
        fmtCurrencyUnit,
        scaleRatio,
        filteredBrandPerformance,
        filteredKpis,
        filteredMonthlyRevenue,
        filteredSegmentRevenue,
        filteredApArAging,
        filteredRatios,
        filteredCashFlow,
        filteredCapexData,
        filteredHrKpis,
        filteredStoreProductivity,
        filteredContracts,
        filteredGaAssets,
        filteredComplianceItems,
        filteredOutstandingContracts,
        filteredOpexData,
        filteredPtHeadcount,
        filteredPersonnelExpenses,
        filteredMarketingKpis,
        filteredMarketingSpend,
        filteredMarketingTrend,
        filteredMarketingMetrics,
        filteredMarketingExpensesBreakdown,
        filteredMarketingChannelDetails,
        filteredGaOpexLedger,
        filteredGaSlaTrend,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        hideValues,
        setHideValues,
        theme,
        toggleTheme,
        rates,
        changes,
        ratesLoading,
        lastRatesUpdated,
        isTransitioning,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
