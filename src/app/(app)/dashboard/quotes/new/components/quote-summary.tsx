import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, DollarSign, Package, Tag } from 'lucide-react'

function fmt(v: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(v)
}

interface QuoteSummaryProps {
  subtotal: number
  taxRate: number
  taxAmount: number
  discountAmount: number
  grandTotal: number
  totalCost: number
  grossMargin: number
  itemCount: number
  optionalCount: number
}

export function QuoteSummary({
  subtotal,
  taxRate,
  taxAmount,
  discountAmount,
  grandTotal,
  totalCost,
  grossMargin,
  itemCount,
  optionalCount,
}: QuoteSummaryProps) {
  const profit = subtotal - totalCost

  return (
    <div className="space-y-4">
      {/* Financial Summary */}
      <div className="rounded-lg border bg-card p-4 space-y-3">
        <h3 className="font-semibold text-sm">Quote Summary</h3>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">{fmt(subtotal)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Discount</span>
              <span className="font-medium text-green-500">-{fmt(discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax ({taxRate}%)</span>
            <span className="font-medium">{fmt(taxAmount)}</span>
          </div>
          <div className="flex justify-between font-bold text-base border-t pt-2">
            <span>Grand Total</span>
            <span>{fmt(grandTotal)}</span>
          </div>
        </div>
      </div>

      {/* Margin Analysis */}
      <div className="rounded-lg border bg-card p-4 space-y-3">
        <h3 className="font-semibold text-sm">Margin Analysis</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Cost</span>
            <span>{fmt(totalCost)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Gross Profit</span>
            <span className={cn('font-medium', profit > 0 ? 'text-green-500' : 'text-red-500')}>{fmt(profit)}</span>
          </div>
          <div className="pt-2">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-muted-foreground">Gross Margin</span>
              <div className="flex items-center gap-1">
                {grossMargin >= 40 ? (
                  <TrendingUp className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5 text-yellow-500" />
                )}
                <span className={cn(
                  'text-sm font-bold',
                  grossMargin >= 40 ? 'text-green-500' : grossMargin >= 25 ? 'text-yellow-500' : 'text-red-500'
                )}>
                  {grossMargin.toFixed(1)}%
                </span>
              </div>
            </div>
            {/* Progress bar */}
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all',
                  grossMargin >= 40 ? 'bg-green-500' : grossMargin >= 25 ? 'bg-yellow-500' : 'bg-red-500'
                )}
                style={{ width: `${Math.min(grossMargin, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
              <span>0%</span><span>Target: 40%</span><span>100%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Item Count */}
      <div className="rounded-lg border bg-card p-4">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-lg font-bold">{itemCount}</div>
            <div className="text-xs text-muted-foreground">Line Items</div>
          </div>
          <div>
            <div className="text-lg font-bold">{optionalCount}</div>
            <div className="text-xs text-muted-foreground">Optional</div>
          </div>
          <div>
            <div className="text-lg font-bold">{itemCount + optionalCount}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
        </div>
      </div>
    </div>
  )
}
