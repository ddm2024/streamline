'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  Search,
  MoreHorizontal,
  User,
  MapPin,
  Phone,
  Mail,
  FileText,
  Briefcase,
  Tag,
} from 'lucide-react'

interface DemoClient {
  id: string
  firstName: string
  lastName: string
  companyName?: string
  email: string
  phone: string
  source: string
  tags: string[]
  properties: { address: string }[]
  openQuotes: number
  activeJobs: number
  totalRevenue: number
}

const demoClients: DemoClient[] = [
  {
    id: '1',
    firstName: 'Ricky',
    lastName: 'Ferris',
    email: 'ricky.ferris@email.com',
    phone: '(817) 555-1234',
    source: 'Angi',
    tags: ['VIP', 'Repeat'],
    properties: [{ address: '4521 Oak Valley Dr, Keller TX 76248' }],
    openQuotes: 2,
    activeJobs: 1,
    totalRevenue: 26900,
  },
  {
    id: '2',
    firstName: 'Lindon',
    lastName: 'Frazier',
    email: 'lindon.frazier@email.com',
    phone: '(817) 555-2345',
    source: 'Referral',
    tags: ['Repeat'],
    properties: [{ address: '1892 Saddle Ridge Blvd, Southlake TX 76092' }],
    openQuotes: 1,
    activeJobs: 0,
    totalRevenue: 3200,
  },
  {
    id: '3',
    firstName: 'Chris',
    lastName: 'Brady',
    email: 'chris.brady@email.com',
    phone: '(817) 555-3456',
    source: 'Google',
    tags: ['Commercial'],
    properties: [
      { address: '513 Saddle Ridge, Northlake TX 76247' },
      { address: '8901 Timber Creek, Roanoke TX 76262' },
    ],
    openQuotes: 1,
    activeJobs: 1,
    totalRevenue: 14800,
  },
  {
    id: '4',
    firstName: 'Matthew',
    lastName: 'Watkins',
    email: 'matt.watkins@email.com',
    phone: '(817) 555-4567',
    source: 'Website',
    tags: [],
    properties: [{ address: '2108 Elm Creek Ln, Flower Mound TX 75028' }],
    openQuotes: 1,
    activeJobs: 0,
    totalRevenue: 8900,
  },
  {
    id: '5',
    firstName: 'Harvest Ops',
    lastName: 'HQ',
    companyName: 'Harvest Operations LLC',
    email: 'ops@harvestoperations.com',
    phone: '(817) 555-0001',
    source: 'Direct',
    tags: ['Commercial', 'Managed'],
    properties: [
      { address: '100 Commerce Blvd, Fort Worth TX 76102' },
      { address: '441 Industrial Pkwy, Arlington TX 76014' },
    ],
    openQuotes: 3,
    activeJobs: 2,
    totalRevenue: 67400,
  },
]

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount)
}

export function ClientsList() {
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)

  const filtered = demoClients.filter(c =>
    `${c.firstName} ${c.lastName} ${c.companyName ?? ''} ${c.email}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Client Cards */}
      <div className="space-y-2">
        {filtered.map(client => (
          <div
            key={client.id}
            className="rounded-lg border bg-card overflow-hidden"
          >
            {/* Header Row */}
            <div
              className="flex items-center gap-4 p-4 cursor-pointer hover:bg-muted/30 transition-colors"
              onClick={() => setExpanded(expanded === client.id ? null : client.id)}
            >
              {/* Avatar */}
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-sm font-semibold text-primary">
                  {client.firstName[0]}{client.lastName[0]}
                </span>
              </div>

              {/* Name + company */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{client.firstName} {client.lastName}</span>
                  {client.companyName && (
                    <span className="text-xs text-muted-foreground">· {client.companyName}</span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Mail className="h-3 w-3" />{client.email}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Phone className="h-3 w-3" />{client.phone}
                  </span>
                </div>
              </div>

              {/* Tags */}
              <div className="hidden md:flex items-center gap-1">
                {client.tags.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-muted text-muted-foreground">
                    <Tag className="h-2.5 w-2.5" />{tag}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="hidden lg:flex items-center gap-6 text-sm">
                <div className="text-center">
                  <div className="font-semibold">{client.openQuotes}</div>
                  <div className="text-xs text-muted-foreground">Quotes</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">{client.activeJobs}</div>
                  <div className="text-xs text-muted-foreground">Jobs</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">{formatCurrency(client.totalRevenue)}</div>
                  <div className="text-xs text-muted-foreground">Revenue</div>
                </div>
              </div>

              <MoreHorizontal className="h-4 w-4 text-muted-foreground shrink-0" />
            </div>

            {/* Expanded Detail */}
            {expanded === client.id && (
              <div className="border-t px-4 pb-4 pt-3 bg-muted/20">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Properties */}
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Properties</h4>
                    <div className="space-y-1">
                      {client.properties.map((p, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-sm">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                          <span>{p.address}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Source */}
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Lead Source</h4>
                    <div className="flex items-center gap-1.5 text-sm">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{client.source}</span>
                    </div>
                  </div>
                  {/* Quick Actions */}
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Quick Actions</h4>
                    <div className="flex flex-wrap gap-2">
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs bg-background border hover:bg-muted transition-colors">
                        <FileText className="h-3 w-3" />New Quote
                      </button>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs bg-background border hover:bg-muted transition-colors">
                        <Briefcase className="h-3 w-3" />New Job
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <User className="h-8 w-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No clients found</p>
          </div>
        )}
      </div>
    </div>
  )
}
