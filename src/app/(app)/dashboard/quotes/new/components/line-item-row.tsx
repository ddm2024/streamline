'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Trash2,
  ChevronDown,
  ChevronUp,
  GripVertical,
  Ruler,
} from 'lucide-react'
import type { LineItem } from './quote-builder'

interface LineItemRowProps {
  item: LineItem
  onUpdate: (id: string, updates: Partial<LineItem>) => void
  onDelete: (id: string) => void
}

const UNITS = ['each', 'sqft', 'lnft', 'hour', 'day', 'lb', 'ton', 'yard', 'bag']

function formatCurrency(v: number) {
  if (v === 0) return ''
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(v)
}

export function LineItemRow({ item, onUpdate, onDelete }: LineItemRowProps) {
  const [expanded, setExpanded] = useState(false)
  const [showMeasure, setShowMeasure] = useState(false)

  const marginPct = item.unit_cost > 0
    ? ((item.unit_price - item.unit_cost) / item.unit_price) * 100
    : null

  const handlePriceChange = (field: 'unit_cost' | 'unit_price', raw: string) => {
    const val = parseFloat(raw) || 0
    onUpdate(item.id, { [field]: val })
  }

  const handleMeasure = (length?: number, width?: number) => {
    const l = length ?? item.measurement_length ?? 0
    const w = width ?? item.measurement_width ?? 0
    const area = l * w
    onUpdate(item.id, {
      measurement_length: l,
      measurement_width: w,
      measurement_area: area,
      qty: area > 0 ? area : item.qty,
    })
  }

  return (
    <div className={cn('group', item.is_optional && 'bg-muted/20')}>
      {/* Main Row */}
      <div className="grid grid-cols-[1fr_80px_90px_90px_90px_32px] gap-2 px-4 py-3 items-start">
        {/* Name + Drag */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <GripVertical className="h-3.5 w-3.5 text-muted-foreground/40 cursor-grab shrink-0" />
            <Input
              value={item.name}
              onChange={e => onUpdate(item.id, { name: e.target.value })}
              placeholder="Item name"
              className="h-7 text-sm border-0 shadow-none p-0 focus-visible:ring-0 font-medium bg-transparent"
            />
          </div>
          {/* Description (shown when expanded) */}
          {expanded && (
            <Input
              value={item.description}
              onChange={e => onUpdate(item.id, { description: e.target.value })}
              placeholder="Description (optional)"
              className="h-6 text-xs border-0 shadow-none p-0 focus-visible:ring-0 text-muted-foreground bg-transparent ml-5"
            />
          )}
          {/* Tags */}
          <div className="flex items-center gap-2 ml-5">
            {item.is_optional && (
              <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">Optional</span>
            )}
            {item.measurement_area && (
              <span className="text-[10px] text-muted-foreground">
                {item.measurement_length}×{item.measurement_width} = {item.measurement_area} sqft
              </span>
            )}
          </div>
        </div>

        {/* Qty + Unit */}
        <div className="space-y-1">
          <Input
            type="number"
            value={item.qty}
            onChange={e => onUpdate(item.id, { qty: parseFloat(e.target.value) || 0 })}
            className="h-7 text-xs text-center border-transparent bg-muted/50 focus-visible:ring-1"
            min={0}
            step={0.1}
          />
          <Select
            value={item.unit}
            onValueChange={v => onUpdate(item.id, { unit: v })}
          >
            <SelectTrigger className="h-6 text-[10px] border-transparent bg-muted/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {UNITS.map(u => <SelectItem key={u} value={u} className="text-xs">{u}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Unit Cost */}
        <div className="space-y-1">
          <div className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span>
            <Input
              type="number"
              value={item.unit_cost || ''}
              onChange={e => handlePriceChange('unit_cost', e.target.value)}
              placeholder="0"
              className="h-7 pl-5 text-xs text-right border-transparent bg-muted/50 focus-visible:ring-1"
              min={0}
              step={0.01}
            />
          </div>
          {marginPct !== null && (
            <div className={cn(
              'text-[10px] text-center',
              marginPct >= 40 ? 'text-green-500' : marginPct >= 25 ? 'text-yellow-500' : 'text-red-500'
            )}>
              {marginPct.toFixed(0)}% margin
            </div>
          )}
        </div>

        {/* Unit Price */}
        <div className="relative">
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span>
          <Input
            type="number"
            value={item.unit_price || ''}
            onChange={e => handlePriceChange('unit_price', e.target.value)}
            placeholder="0"
            className="h-7 pl-5 text-xs text-right border-transparent bg-muted/50 focus-visible:ring-1"
            min={0}
            step={0.01}
          />
        </div>

        {/* Line Total */}
        <div className="h-7 flex items-center justify-end text-sm font-medium tabular-nums">
          {item.line_total > 0 ? formatCurrency(item.line_total) : <span className="text-muted-foreground text-xs">—</span>}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => setExpanded(!expanded)}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-muted"
          >
            {expanded ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />}
          </button>
        </div>
      </div>

      {/* Expanded Options */}
      {expanded && (
        <div className="px-4 pb-3 flex items-center gap-3 ml-6 flex-wrap">
          <button
            onClick={() => onUpdate(item.id, { is_optional: !item.is_optional })}
            className={cn(
              'text-xs px-2.5 py-1 rounded-md border transition-colors',
              item.is_optional
                ? 'bg-primary/10 border-primary/30 text-primary'
                : 'bg-background border-border text-muted-foreground hover:text-foreground'
            )}
          >
            {item.is_optional ? '✓ Optional' : 'Mark optional'}
          </button>

          <button
            onClick={() => setShowMeasure(!showMeasure)}
            className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md border bg-background text-muted-foreground hover:text-foreground transition-colors"
          >
            <Ruler className="h-3 w-3" />Measurement
          </button>

          <button
            onClick={() => onDelete(item.id)}
            className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md border bg-background text-destructive border-destructive/30 hover:bg-destructive/10 transition-colors ml-auto"
          >
            <Trash2 className="h-3 w-3" />Remove
          </button>
        </div>
      )}

      {/* Measurement panel */}
      {expanded && showMeasure && (
        <div className="px-4 pb-3 ml-6">
          <div className="flex items-center gap-3 bg-muted/40 rounded-lg p-3">
            <Ruler className="h-4 w-4 text-muted-foreground shrink-0" />
            <div className="flex items-center gap-2 text-sm">
              <Input
                type="number"
                placeholder="Length"
                value={item.measurement_length || ''}
                onChange={e => handleMeasure(parseFloat(e.target.value) || 0, undefined)}
                className="h-7 w-20 text-xs"
              />
              <span className="text-muted-foreground">×</span>
              <Input
                type="number"
                placeholder="Width"
                value={item.measurement_width || ''}
                onChange={e => handleMeasure(undefined, parseFloat(e.target.value) || 0)}
                className="h-7 w-20 text-xs"
              />
              <span className="text-muted-foreground">=</span>
              <span className="font-medium w-16">{item.measurement_area ?? 0} sqft</span>
              <span className="text-xs text-muted-foreground">→ sets qty</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
