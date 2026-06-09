import Layout from '../components/layout/Layout'
import Section from '../components/Section'
import { litigation } from '../data/dummyData'
import { FileText, AlertTriangle, Clock, CheckCircle2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger
} from '@/components/ui/tooltip'
import { Card, CardContent } from '@/components/ui/card'
import { useApp } from '../context/AppContext'

const statusVariant = {
  Active:   { icon: CheckCircle2,  cls: 'bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-50' },
  Expiring: { icon: AlertTriangle, cls: 'bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-50' },
  Expired:  { icon: Clock,         cls: 'bg-slate-50 text-slate-400 border border-slate-100 hover:bg-slate-50' },
}

const riskVariant = {
  Low:    'bg-emerald-50 text-emerald-600 border border-emerald-100',
  Medium: 'bg-amber-50 text-amber-600 border border-amber-100',
  High:   'bg-rose-50 text-rose-600 border border-rose-100',
}

export default function Legal() {
  const { filteredContracts, scaleRatio, fmt, currency } = useApp()

  const activeCount   = filteredContracts.filter(c => c.status === 'Active').length
  const expiringCount = filteredContracts.filter(c => c.status === 'Expiring').length
  const totalValue    = filteredContracts.reduce((a, b) => a + b.value, 0)

  // Dynamic litigation data scaled by the selected segment/brand
  const dynamicLitigation = litigation.map(l => ({
    ...l,
    estimatedLiability: parseFloat((l.estimatedLiability * scaleRatio).toFixed(1))
  }))

  const fmtB = v => fmt(v, 'B')

  return (
    <TooltipProvider>
    <Layout title="Legal Dashboard">

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Contracts',   value: filteredContracts.length, sub: 'All monitored entities',    cls: 'border-l-4 border-l-blue-500'   },
          { label: 'Active Contracts',   value: activeCount,      sub: 'In effect',     cls: 'border-l-4 border-l-emerald-500' },
          { label: 'Expiring Soon', value: expiringCount,    sub: '< 90 days remaining',        cls: 'border-l-4 border-l-rose-500'    },
          { label: 'Total Valuation',     value: fmtB(totalValue), sub: 'Contract portfolio value', cls: 'border-l-4 border-l-amber-500' },
        ].map(s => (
          <Card key={s.label} className={`shadow-xl shadow-slate-100/40 border border-slate-100 hover:-translate-y-1 transform duration-300 ${s.cls}`}>
            <CardContent className="pt-5 pb-5">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">{s.label}</p>
              <p className="text-2xl font-extrabold text-slate-800 leading-none">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-2 font-medium">{s.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contract Repository */}
      <Section title="Contract Repository">
        <Card className="shadow-xl shadow-slate-100/40 border border-slate-100 rounded-2xl overflow-hidden mb-6">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead className="text-[10px] font-bold text-slate-500 uppercase tracking-wider w-24 px-5">ID</TableHead>
                <TableHead className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Contract Title</TableHead>
                <TableHead className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Type</TableHead>
                <TableHead className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Entity</TableHead>
                <TableHead className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Value</TableHead>
                <TableHead className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Exp. Date</TableHead>
                <TableHead className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContracts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-slate-400 font-medium">No contracts found for this selection.</TableCell>
                </TableRow>
              ) : (
                filteredContracts.map(c => {
                  const sc = statusVariant[c.status] || statusVariant.Active
                  const Icon = sc.icon
                  return (
                    <TableRow key={c.id} className="text-xs hover:bg-slate-50 transition-colors">
                      <TableCell className="font-mono text-muted-foreground font-semibold px-5">{c.id}</TableCell>
                      <TableCell className="font-semibold text-slate-800">
                        <Tooltip>
                          <TooltipTrigger className="flex items-center gap-2 text-left cursor-default">
                            <FileText size={12} className="text-slate-400 shrink-0" />
                            <span className="truncate max-w-[240px]">{c.name}</span>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="text-xs max-w-xs bg-slate-900 border-0 text-white rounded-xl p-2.5 shadow-md">{c.name}</TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="text-slate-500 font-semibold">{c.type}</TableCell>
                      <TableCell className="text-slate-500 font-semibold">{c.entity}</TableCell>
                      <TableCell className="text-right font-extrabold text-slate-850">{c.value > 0 ? fmtB(c.value) : '—'}</TableCell>
                      <TableCell className="text-center text-slate-500 font-medium">{c.expiry}</TableCell>
                      <TableCell className="text-center">
                        <Badge className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full ${sc.cls}`}>
                          <Icon size={9} className="mr-1 shrink-0" />{c.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </Card>
      </Section>

      {/* Litigation */}
      <Section title="Litigation Tracking">
        <Card className="shadow-xl shadow-slate-100/40 border border-slate-100 rounded-2xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-5">Case Title</TableHead>
                <TableHead className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Status</TableHead>
                <TableHead className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Risk Level</TableHead>
                <TableHead className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Estimated Liability</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dynamicLitigation.map(l => (
                <TableRow key={l.case} className="text-xs hover:bg-slate-50 transition-colors">
                  <TableCell className="font-semibold text-slate-800 px-5">{l.case}</TableCell>
                  <TableCell className="text-center">
                    <Badge className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full ${
                      l.status === 'Settled'    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-50' :
                      l.status === 'Ongoing'    ? 'bg-amber-50 text-amber-600 border border-amber-100 hover:bg-amber-50' :
                      'bg-blue-50 text-blue-650 border border-blue-100 hover:bg-blue-50'
                    }`}>{l.status}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={`text-[9.5px] font-bold px-2.5 py-0.5 rounded-full ${riskVariant[l.risk]}`}>{l.risk}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-extrabold text-slate-900">{fmtB(l.estimatedLiability)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </Section>

    </Layout>
    </TooltipProvider>
  )
}
