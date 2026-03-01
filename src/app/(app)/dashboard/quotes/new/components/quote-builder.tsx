'use client'

import { useState, useCallback, useMemo } from 'react'
import { cn, formatCurrencyDollars } from '@/lib/utils'
import { LineItemRow } from './line-item-row'
import { ServicePicker } from './service-picker'
import { QuoteSummary } from './quote-summary'
import { ClientSelector } from './client-selector'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  Plus,
  Eye,
  Edit3,
  Send,
  Save,
  ChevronDown,
  FileText,
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export interface LineItem {
  id: string
  name: string
  description: string
  qty: number
  unit: string
  unit_cost: number
  unit_price: number
  line_total: number
  markup_percent: number
  is_optional: boolean
  measurement_length?: number
  measurement_width?: number
  measurement_area?: number
}

const INITIAL_ITEMS: LineItem[] = [
  {
    id: '1',
    name: 'Hardscape Design & Layout',
    description: 'Full site assessment, CAD design, material selection consultation',
    qty: 1,
    unit: 'each',
    unit_cost: 800,
    unit_price: 1800,
    line_total: 1800,
    markup_percent: 125,
    is_optional: false,
  },
  {
    id: '2',
    name: 'Flagstone Patio Installation',
    description: 'Compacted base, sand bed, flagstone layout + grouting. 380 sqft.',
    qty: 380,
    unit: 'sqft',
    unit_cost: 12,
    unit_price: 22,
    line_total: 8360,
    markup_percent: 83.3,
    is_optional: false,
    measurement_length: 20,
    measurement_width: 19,
    measurement_area: 380,
  },
  {
    id: '3',
    name: 'Retaining Wall — Dry-Stack Limestone',
    description: '42" tall dry-stack limestone retaining wall, 38 linear feet',
    qty: 38,
    unit: 'lnft',
    unit_cost: 95,
    unit_price: 210,
    line_total: 7980,
    markup_percent: 121,
    is_optional: false,
  },
  {
    id: '4',
    name: 'Outdoor Lighting Package',
    description: 'Low-voltage landscape lighting, 12 fixtures, transformer, install',
    qty: 1,
    unit: 'each',
    unit_cost: 1200,
    unit_price: 2400,
    line_total: 2400,
    markup_percent: 100,
    is_optional: true,
  },
]

export function QuoteBuilder() {
  const [tab, setTab] = useState<'edit' | 'preview'>('edit')
  const [items, setItems] = useState<LineItem[]>(INITIAL_ITEMS)
  const [showServicePicker, setShowServicePicker] = useState(false)
  const [quoteTitle, setQuoteTitle] = useState('Backyard Hardscape + Patio')
  const [clientMessage, setClientMessage] = useState(
    'Thank you for the opportunity to bid on your project. We look forward to transforming your outdoor space.'
  )
  const [taxRate, setTaxRate] = useState(8.25)
  const [discountAmount, setDiscountAmount] = useState(0)
  const [isSaving, setIsSaving] = useState(false)

  // ── Calculations ────────────────────────────────────────
  const subtotal = useMemo(
    () => items.filter(i => !i.is_optional).reduce((sum, i) => sum + i.line_total, 0),
    [items]
  )
  const taxAmount = useMemo(() => (subtotal - discountAmount) * (taxRate / 100), [subtotal, discountAmount, taxRate])
  const grandTotal = useMemo(() => subtotal - discountAmount + taxAmount, [subtotal, discountAmount, taxAmount])
  const totalCost = useMemo(() => items.filter(i => !i.is_optional).reduce((sum, i) => sum + i.unit_cost * i.qty, 0), [items])
  const grossMargin = useMemo(() => subtotal > 0 ? ((subtotal - totalCost) / subtotal) * 100 : 0, [subtotal, totalCost])

  // ── Item CRUD ────────────────────────────────────────────
  const addItem = useCallback(() => {
    const newItem: LineItem = {
      id: crypto.randomUUID(),
      name: '',
      description: '',
      qty: 1,
      unit: 'each',
      unit_cost: 0,
      unit_price: 0,
      line_total: 0,
      markup_percent: 0,
      is_optional: false,
    }
    setItems(prev => [...prev, newItem])
  }, [])

  const updateItem = useCallback((id: string, updates: Partial<LineItem>) => {
    setItems(prev => prev.map(item => {
      if (item.id !== id) return item
      const merged = { ...item, ...updates }
      // Auto-recalculate line_total
      merged.line_total = merged.qty * merged.unit_price
      // Auto-recalculate markup
      if (merged.unit_cost > 0) {
        merged.markup_percent = ((merged.unit_price - merged.unit_cost) / merged.unit_cost) * 100
      }
      return merged
    }))
  }, [])

  const deleteItem = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }, [])

  const addFromCatalog = useCallback((service: { name: string; description?: string; unit: string; unit_cost: number; unit_price: number }) => {
    const newItem: LineItem = {
      id: crypto.randomUUID(),
      name: service.name,
      description: service.description ?? '',
      qty: 1,
      unit: service.unit,
      unit_cost: service.unit_cost,
      unit_price: service.unit_price,
      line_total: service.unit_price,
      markup_percent: service.unit_cost > 0 ? ((service.unit_price - service.unit_cost) / service.unit_cost) * 100 : 0,
      is_optional: false,
    }
    setItems(prev => [...prev, newItem])
    setShowServicePicker(false)
    toast.success(`Added "${service.name}" to quote`)
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise(r => setTimeout(r, 600))
    toast.success('Quote saved')
    setIsSaving(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/quotes"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div className="flex-1 min-w-0">
          <Input
            value={quoteTitle}
            onChange={e => setQuoteTitle(e.target.value)}
            className="text-xl font-bold border-0 shadow-none p-0 h-auto focus-visible:ring-0 bg-transparent"
            placeholder="Quote title..."
          />
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary">Draft</Badge>
            <span className="text-xs text-muted-foreground">Q-0013</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />{isSaving ? 'Saving...' : 'Save'}
          </Button>
          <Button size="sm">
            <Send className="h-4 w-4 mr-2" />Send to Client
          </Button>
        </div>
      </div>

      {/* Tab Toggle */}
      <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit">
        {(['edit', 'preview'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-medium transition-colors',
              tab === t ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {t === 'edit' ? <Edit3 className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {t === 'edit' ? 'Edit' : 'Preview'}
          </button>
        ))}
      </div>

      {tab === 'edit' ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left — Main Editor */}
          <div className="xl:col-span-2 space-y-6">
            {/* Client & Property */}
            <ClientSelector />

            {/* Line Items */}
            <div className="rounded-lg border bg-card">
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <h3 className="font-semibold">Line Items</h3>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowServicePicker(true)}>
                    <FileText className="h-3.5 w-3.5 mr-1.5" />From Catalog
                  </Button>
                  <Button variant="outline" size="sm" onClick={addItem}>
                    <Plus className="h-3.5 w-3.5 mr-1.5" />Add Line
                  </Button>
                </div>
              </div>

              {/* Column Headers */}
              <div className="grid grid-cols-[1fr_80px_90px_90px_90px_32px] gap-2 px-4 py-2 bg-muted/30 border-b text-xs text-muted-foreground font-medium">
                <span>Item</span>
                <span className="text-center">Qty / Unit</span>
                <span className="text-right">Cost</span>
                <span className="text-right">Price</span>
                <span className="text-right">Total</span>
                <span></span>
              </div>

              {/* Items */}
              <div className="divide-y">
                {items.map(item => (
                  <LineItemRow
                    key={item.id}
                    item={item}
                    onUpdate={updateItem}
                    onDelete={deleteItem}
                  />
                ))}
              </div>

              {/* Add Line */}
              <div className="px-4 py-3 border-t">
                <button
                  onClick={addItem}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Plus className="h-4 w-4" />Add line item
                </button>
              </div>
            </div>

            {/* Client Message */}
            <div className="space-y-2">
              <Label>Message to Client</Label>
              <Textarea
                value={clientMessage}
                onChange={e => setClientMessage(e.target.value)}
                rows={3}
                placeholder="Optional personal message..."
                className="resize-none"
              />
            </div>

            {/* Tax & Discount */}
            <div className="rounded-lg border bg-card p-4 space-y-4">
              <h3 className="font-semibold text-sm">Tax & Discount</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">Tax Rate (%)</Label>
                  <Input
                    type="number"
                    value={taxRate}
                    onChange={e => setTaxRate(parseFloat(e.target.value) || 0)}
                    step={0.01}
                    min={0}
                    max={30}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Discount ($)</Label>
                  <Input
                    type="number"
                    value={discountAmount}
                    onChange={e => setDiscountAmount(parseFloat(e.target.value) || 0)}
                    min={0}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right — Summary */}
          <div className="space-y-4">
            <QuoteSummary
              subtotal={subtotal}
              taxRate={taxRate}
              taxAmount={taxAmount}
              discountAmount={discountAmount}
              grandTotal={grandTotal}
              totalCost={totalCost}
              grossMargin={grossMargin}
              itemCount={items.filter(i => !i.is_optional).length}
              optionalCount={items.filter(i => i.is_optional).length}
            />
          </div>
        </div>
      ) : (
        // Preview Mode
        <div className="max-w-3xl mx-auto">
          <div className="rounded-xl border bg-card p-8 space-y-8 shadow-sm">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold">{quoteTitle}</h2>
                <p className="text-muted-foreground text-sm mt-1">Quote Q-0013 · Valid until Mar 28, 2026</p>
              </div>
              <Badge variant="outline" className="text-sm">Draft</Badge>
            </div>

            {/* Message */}
            {clientMessage && (
              <p className="text-sm text-muted-foreground border-l-4 border-primary pl-4 py-1">{clientMessage}</p>
            )}

            {/* Line Items */}
            <div className="space-y-2">
              <div className="grid grid-cols-[1fr_60px_80px_80px] gap-2 pb-2 border-b text-xs font-medium text-muted-foreground uppercase tracking-wide">
                <span>Item</span><span className="text-right">Qty</span><span className="text-right">Unit Price</span><span className="text-right">Total</span>
              </div>
              {items.map(item => (
                <div key={item.id} className={cn('grid grid-cols-[1fr_60px_80px_80px] gap-2 py-2', item.is_optional && 'opacity-60')}>
                  <div>
                    <div className="font-medium text-sm">{item.name || 'Unnamed item'}</div>
                    {item.description && <div className="text-xs text-muted-foreground mt-0.5">{item.description}</div>}
                    {item.is_optional && <span className="text-xs text-muted-foreground italic">Optional</span>}
                  </div>
                  <div className="text-right text-sm">{item.qty} {item.unit}</div>
                  <div className="text-right text-sm">{formatCurrencyDollars(item.unit_price)}</div>
                  <div className="text-right text-sm font-medium">{formatCurrencyDollars(item.line_total)}</div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-1.5 pt-4 border-t max-w-xs ml-auto">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrencyDollars(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Discount</span>
                  <span className="text-green-500">-{formatCurrencyDollars(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax ({taxRate}%)</span>
                <span>{formatCurrencyDollars(taxAmount)}</span>
              </div>
              <div className="flex justify-between font-bold text-base border-t pt-2 mt-2">
                <span>Grand Total</span>
                <span>{formatCurrencyDollars(grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Service Picker Modal */}
      {showServicePicker && (
        <ServicePicker
          onSelect={addFromCatalog}
          onClose={() => setShowServicePicker(false)}
        />
      )}
    </div>
  )
}
