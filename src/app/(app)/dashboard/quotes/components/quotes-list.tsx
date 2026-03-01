'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Search,
  MoreHorizontal,
  FileText,
  Eye,
  Copy,
  Trash2,
  ArrowUpRight,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { format } from 'date-fns'

type QuoteStatus = 'draft' | 'awaiting' | 'changes_requested' | 'approved' | 'declined' | 'converted'

interface DemoQuote {
  id: string
  quote_number: string
  title: string
  status: QuoteStatus
  client: string
  grand_total: number
  created_at: string
  valid_until: string
}

const STATUS_LABELS: Record<QuoteStatus, string> = {
  draft: 'Draft',
  awaiting: 'Awaiting',
  changes_requested: 'Changes',
  approved: 'Approved',
  declined: 'Declined',
  converted: 'Converted',
}

const STATUS_COLORS: Record<QuoteStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  draft: 'secondary',
  awaiting: 'outline',
  changes_requested: 'destructive',
  approved: 'default',
  declined: 'destructive',
  converted: 'default',
}

const demoQuotes: DemoQuote[] = [
  { id: '1', quote_number: 'Q-0012', title: 'Full Yard Makeover — Ferris Residence', status: 'awaiting', client: 'Ricky Ferris', grand_total: 8450, created_at: '2026-02-20', valid_until: '2026-03-20' },
  { id: '2', quote_number: 'Q-0011', title: 'Patio + Retaining Wall — Brady Commercial', status: 'approved', client: 'Chris Brady', grand_total: 22800, created_at: '2026-02-18', valid_until: '2026-03-18' },
  { id: '3', quote_number: 'Q-0010', title: 'Spring Cleanup Package', status: 'draft', client: 'Matthew Watkins', grand_total: 1200, created_at: '2026-02-16', valid_until: '2026-03-16' },
  { id: '4', quote_number: 'Q-0009', title: 'Irrigation Install — Frazier', status: 'changes_requested', client: 'Lindon Frazier', grand_total: 4800, created_at: '2026-02-14', valid_until: '2026-03-14' },
  { id: '5', quote_number: 'Q-0008', title: 'Commercial Mowing — Harvest Ops Q1', status: 'converted', client: 'Harvest Ops HQ', grand_total: 3600, created_at: '2026-01-30', valid_until: '2026-02-28' },
]

function formatCurrency(v: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(v)
}

export function QuotesList() {
  const [search, setSearch] = useState('')

  const filtered = demoQuotes.filter(q =>
    `${q.quote_number} ${q.title} ${q.client}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search quotes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 uppercase tracking-wide">Quote</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 uppercase tracking-wide hidden md:table-cell">Client</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 uppercase tracking-wide hidden lg:table-cell">Status</th>
              <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3 uppercase tracking-wide">Total</th>
              <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3 uppercase tracking-wide hidden lg:table-cell">Valid Until</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map(quote => (
              <tr key={quote.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">{quote.quote_number}</span>
                      <Badge variant={STATUS_COLORS[quote.status]} className="text-xs md:hidden">{STATUS_LABELS[quote.status]}</Badge>
                    </div>
                    <div className="font-medium text-sm mt-0.5">{quote.title}</div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm hidden md:table-cell">{quote.client}</td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <Badge variant={STATUS_COLORS[quote.status]}>{STATUS_LABELS[quote.status]}</Badge>
                </td>
                <td className="px-4 py-3 text-right font-semibold text-sm">{formatCurrency(quote.grand_total)}</td>
                <td className="px-4 py-3 text-right text-sm text-muted-foreground hidden lg:table-cell">
                  {format(new Date(quote.valid_until), 'MMM d, yyyy')}
                </td>
                <td className="px-4 py-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/quotes/${quote.id}`}>
                          <Eye className="h-4 w-4 mr-2" />View
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <ArrowUpRight className="h-4 w-4 mr-2" />Send to Client
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="h-4 w-4 mr-2" />Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="h-8 w-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No quotes found</p>
          </div>
        )}
      </div>
    </div>
  )
}
