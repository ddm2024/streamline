'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, MoreHorizontal, Edit, Trash2, ToggleLeft } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface ServiceItem {
  id: string
  name: string
  description?: string
  category: string
  unit: string
  unit_cost: number
  unit_price: number
  is_active: boolean
}

const DEMO_SERVICES: ServiceItem[] = [
  { id: '1', name: 'Lawn Mowing (per visit)', category: 'Maintenance', unit: 'each', unit_cost: 35, unit_price: 75, is_active: true, description: 'Standard mow, edge, blow' },
  { id: '2', name: 'Mulch Installation', category: 'Landscaping', unit: 'yard', unit_cost: 28, unit_price: 65, is_active: true, description: 'Premium hardwood mulch, installed' },
  { id: '3', name: 'Tree Trimming', category: 'Trees', unit: 'each', unit_cost: 80, unit_price: 180, is_active: true, description: 'Per tree, up to 20ft' },
  { id: '4', name: 'Sod Installation', category: 'Landscaping', unit: 'sqft', unit_cost: 0.85, unit_price: 2.25, is_active: true, description: 'Bermuda sod, graded bed prep included' },
  { id: '5', name: 'Irrigation Install', category: 'Irrigation', unit: 'zone', unit_cost: 350, unit_price: 850, is_active: true, description: 'Per zone, Hunter heads, controller' },
  { id: '6', name: 'Flagstone Patio', category: 'Hardscape', unit: 'sqft', unit_cost: 12, unit_price: 22, is_active: true, description: 'Compacted base, sand bed, flagstone + grouting' },
  { id: '7', name: 'Retaining Wall — Block', category: 'Hardscape', unit: 'lnft', unit_cost: 55, unit_price: 120, is_active: true, description: 'Allan Block, per linear foot including base' },
  { id: '8', name: 'Retaining Wall — Limestone', category: 'Hardscape', unit: 'lnft', unit_cost: 95, unit_price: 210, is_active: true, description: 'Natural dry-stack limestone' },
  { id: '9', name: 'Landscape Lighting', category: 'Electrical', unit: 'each', unit_cost: 85, unit_price: 185, is_active: true, description: 'Low-voltage fixture, installed + wired' },
  { id: '10', name: 'Grading & Drainage', category: 'Grading', unit: 'hour', unit_cost: 95, unit_price: 195, is_active: true, description: 'Equipment + operator' },
  { id: '11', name: 'Pressure Washing', category: 'Maintenance', unit: 'sqft', unit_cost: 0.08, unit_price: 0.22, is_active: false, description: 'Hot water pressure wash' },
]

const CATEGORIES = Array.from(new Set(DEMO_SERVICES.map(s => s.category)))

function fmt(v: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(v)
}

export default function ServicesPage() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filtered = DEMO_SERVICES.filter(s => {
    const matchSearch = `${s.name} ${s.category} ${s.description ?? ''}`.toLowerCase().includes(search.toLowerCase())
    const matchCategory = !activeCategory || s.category === activeCategory
    return matchSearch && matchCategory
  })

  const margin = (s: ServiceItem) =>
    s.unit_cost > 0 ? ((s.unit_price - s.unit_cost) / s.unit_price) * 100 : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Service Catalog</h1>
          <p className="text-muted-foreground">Reusable services for quote building.</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />Add Service
        </Button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search services..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              !activeCategory ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            All
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                activeCategory === cat ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 uppercase tracking-wide">Service</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 uppercase tracking-wide hidden md:table-cell">Category</th>
              <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3 uppercase tracking-wide">Cost</th>
              <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3 uppercase tracking-wide">Price</th>
              <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3 uppercase tracking-wide hidden lg:table-cell">Margin</th>
              <th className="text-center text-xs font-medium text-muted-foreground px-4 py-3 uppercase tracking-wide">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map(s => (
              <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="font-medium text-sm">{s.name}</div>
                  {s.description && <div className="text-xs text-muted-foreground mt-0.5">{s.description}</div>}
                  <div className="text-xs text-muted-foreground">per {s.unit}</div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <Badge variant="outline" className="text-xs">{s.category}</Badge>
                </td>
                <td className="px-4 py-3 text-right text-sm">{fmt(s.unit_cost)}</td>
                <td className="px-4 py-3 text-right text-sm font-semibold">{fmt(s.unit_price)}</td>
                <td className="px-4 py-3 text-right hidden lg:table-cell">
                  <span className={`text-sm font-medium ${
                    margin(s) >= 40 ? 'text-green-500' : margin(s) >= 25 ? 'text-yellow-500' : 'text-red-500'
                  }`}>
                    {margin(s).toFixed(0)}%
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <Badge variant={s.is_active ? 'default' : 'secondary'}>
                    {s.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem><Edit className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
                      <DropdownMenuItem><ToggleLeft className="h-4 w-4 mr-2" />Toggle Active</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive"><Trash2 className="h-4 w-4 mr-2" />Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
