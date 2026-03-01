'use client'

import { useState } from 'react'
import { Search, X, Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Service {
  id: string
  name: string
  description?: string
  category: string
  unit: string
  unit_cost: number
  unit_price: number
}

const DEMO_SERVICES: Service[] = [
  { id: '1', name: 'Lawn Mowing (per visit)', category: 'Maintenance', unit: 'each', unit_cost: 35, unit_price: 75, description: 'Standard mow, edge, blow' },
  { id: '2', name: 'Mulch Installation', category: 'Landscaping', unit: 'yard', unit_cost: 28, unit_price: 65, description: 'Premium hardwood mulch, installed' },
  { id: '3', name: 'Tree Trimming', category: 'Trees', unit: 'each', unit_cost: 80, unit_price: 180, description: 'Per tree, up to 20ft' },
  { id: '4', name: 'Sod Installation', category: 'Landscaping', unit: 'sqft', unit_cost: 0.85, unit_price: 2.25, description: 'Bermuda sod, graded bed prep included' },
  { id: '5', name: 'Irrigation Install', category: 'Irrigation', unit: 'zone', unit_cost: 350, unit_price: 850, description: 'Per zone, Hunter heads, controller' },
  { id: '6', name: 'Flagstone Patio', category: 'Hardscape', unit: 'sqft', unit_cost: 12, unit_price: 22, description: 'Compacted base, sand bed, flagstone + grouting' },
  { id: '7', name: 'Retaining Wall — Block', category: 'Hardscape', unit: 'lnft', unit_cost: 55, unit_price: 120, description: 'Allan Block, per linear foot including base' },
  { id: '8', name: 'Retaining Wall — Limestone', category: 'Hardscape', unit: 'lnft', unit_cost: 95, unit_price: 210, description: 'Natural dry-stack limestone' },
  { id: '9', name: 'Landscape Lighting', category: 'Electrical', unit: 'each', unit_cost: 85, unit_price: 185, description: 'Low-voltage fixture, installed + wired' },
  { id: '10', name: 'Grading & Drainage', category: 'Grading', unit: 'hour', unit_cost: 95, unit_price: 195, description: 'Equipment + operator' },
  { id: '11', name: 'Concrete Sidewalk', category: 'Concrete', unit: 'sqft', unit_cost: 6, unit_price: 14, description: '4" reinforced concrete' },
  { id: '12', name: 'Pressure Washing', category: 'Maintenance', unit: 'sqft', unit_cost: 0.08, unit_price: 0.22, description: 'Hot water pressure wash, any surface' },
]

const CATEGORIES = Array.from(new Set(DEMO_SERVICES.map(s => s.category)))

interface ServicePickerProps {
  onSelect: (service: Service) => void
  onClose: () => void
}

function formatCurrency(v: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(v)
}

export function ServicePicker({ onSelect, onClose }: ServicePickerProps) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filtered = DEMO_SERVICES.filter(s => {
    const matchSearch = `${s.name} ${s.category} ${s.description ?? ''}`.toLowerCase().includes(search.toLowerCase())
    const matchCategory = !activeCategory || s.category === activeCategory
    return matchSearch && matchCategory
  })

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-card rounded-xl border shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="font-semibold">Service Catalog</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="px-4 py-3 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search services..."
              className="pl-9"
              autoFocus
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 px-4 py-2 border-b overflow-x-auto">
          <button
            onClick={() => setActiveCategory(null)}
            className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
              !activeCategory ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            All
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                activeCategory === cat ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Services List */}
        <div className="flex-1 overflow-y-auto divide-y">
          {filtered.map(service => (
            <button
              key={service.id}
              onClick={() => onSelect(service)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{service.name}</span>
                  <Badge variant="outline" className="text-[10px]">{service.category}</Badge>
                </div>
                {service.description && (
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{service.description}</p>
                )}
              </div>
              <div className="text-right shrink-0">
                <div className="font-semibold text-sm">{formatCurrency(service.unit_price)}</div>
                <div className="text-xs text-muted-foreground">per {service.unit}</div>
              </div>
              <Plus className="h-4 w-4 text-muted-foreground shrink-0" />
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">No services found</div>
          )}
        </div>
      </div>
    </div>
  )
}
