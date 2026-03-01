'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Plus,
  Search,
  MoreHorizontal,
  DollarSign,
  ArrowUpRight,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { format } from 'date-fns'

type InvoiceStatus = 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue' | 'void'

interface DemoInvoice {
  id: string
  invoice_number: string
  title: string
  status: InvoiceStatus
  client: string
  grand_total: number
  amount_due: number
  issue_date: string
  due_date: string
}

const STATUS_COLORS: Record<InvoiceStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  draft: 'secondary',
  sent: 'outline',
  viewed: 'outline',
  paid: 'default',
  overdue: 'destructive',
  void: 'secondary',
}

const demoInvoices: DemoInvoice[] = [
  { id: '1', invoice_number: 'INV-0009', title: 'Patio + Retaining Wall', status: 'sent', client: 'Chris Brady', grand_total: 22800, amount_due: 22800, issue_date: '2026-02-20', due_date: '2026-03-05' },
  { id: '2', invoice_number: 'INV-0008', title: 'Spring Cleanup', status: 'paid', client: 'Ricky Ferris', grand_total: 450, amount_due: 0, issue_date: '2026-02-15', due_date: '2026-02-22' },
  { id: '3', invoice_number: 'INV-0007', title: 'Monthly Mowing — Jan', status: 'overdue', client: 'Harvest Ops HQ', grand_total: 1200, amount_due: 1200, issue_date: '2026-01-31', due_date: '2026-02-14' },
  { id: '4', invoice_number: 'INV-0006', title: 'Irrigation Repairs', status: 'viewed', client: 'Lindon Frazier', grand_total: 680, amount_due: 680, issue_date: '2026-02-10', due_date: '2026-02-24' },
  { id: '5', invoice_number: 'INV-0005', title: 'Tree Trimming + Mulch', status: 'paid', client: 'Matthew Watkins', grand_total: 1850, amount_due: 0, issue_date: '2026-02-01', due_date: '2026-02-15' },
]

function fmt(v: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(v)
}

export default function InvoicesPage() {
  const [search, setSearch] = useState('')

  const filtered = demoInvoices.filter(i =>
    `${i.invoice_number} ${i.title} ${i.client}`.toLowerCase().includes(search.toLowerCase())
  )

  const totalOutstanding = demoInvoices.filter(i => i.status !== 'paid' && i.status !== 'void').reduce((s, i) => s + i.amount_due, 0)
  const totalOverdue = demoInvoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.amount_due, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Invoices</h1>
          <p className="text-muted-foreground">Track and collect payments.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/invoices/new">
            <Plus className="h-4 w-4 mr-2" />
            New Invoice
          </Link>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border bg-card p-4">
          <div className="text-sm text-muted-foreground">Outstanding</div>
          <div className="text-2xl font-bold mt-1">{fmt(totalOutstanding)}</div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-sm text-muted-foreground text-red-500">Overdue</div>
          <div className="text-2xl font-bold text-red-500 mt-1">{fmt(totalOverdue)}</div>
        </div>
      </div>

      {/* Table */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search invoices..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="rounded-lg border overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 uppercase tracking-wide">Invoice</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 uppercase tracking-wide hidden md:table-cell">Client</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 uppercase tracking-wide hidden lg:table-cell">Status</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3 uppercase tracking-wide">Amount</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3 uppercase tracking-wide hidden lg:table-cell">Due</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map(inv => (
                <tr key={inv.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-mono text-xs text-muted-foreground">{inv.invoice_number}</div>
                      <div className="font-medium text-sm mt-0.5">{inv.title}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm hidden md:table-cell">{inv.client}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <Badge variant={STATUS_COLORS[inv.status]}>{inv.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="font-semibold text-sm">{fmt(inv.grand_total)}</div>
                    {inv.amount_due > 0 && inv.status !== 'draft' && (
                      <div className={`text-xs ${inv.status === 'overdue' ? 'text-red-500' : 'text-muted-foreground'}`}>
                        {fmt(inv.amount_due)} due
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-muted-foreground hidden lg:table-cell">
                    {format(new Date(inv.due_date), 'MMM d, yyyy')}
                  </td>
                  <td className="px-4 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <ArrowUpRight className="h-4 w-4 mr-2" />Send Invoice
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <DollarSign className="h-4 w-4 mr-2" />Record Payment
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
