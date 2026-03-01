'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const MOCK_DATA = [
  { month: 'Aug', revenue: 18500, invoiced: 22000 },
  { month: 'Sep', revenue: 24300, invoiced: 19800 },
  { month: 'Oct', revenue: 31200, invoiced: 28500 },
  { month: 'Nov', revenue: 27800, invoiced: 31200 },
  { month: 'Dec', revenue: 22100, invoiced: 25600 },
  { month: 'Jan', revenue: 29400, invoiced: 27300 },
  { month: 'Feb', revenue: 34700, invoiced: 32100 },
]

export function RevenueChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue</CardTitle>
        <CardDescription>Collected vs invoiced over the last 7 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={MOCK_DATA} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(142.1 70.6% 45.3%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(142.1 70.6% 45.3%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorInvoiced" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(240 5% 64.9%)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="hsl(240 5% 64.9%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
            <YAxis
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
            />
            <Area type="monotone" dataKey="invoiced" stroke="hsl(240 5% 64.9%)" strokeWidth={1.5} fill="url(#colorInvoiced)" name="Invoiced" />
            <Area type="monotone" dataKey="revenue" stroke="hsl(142.1 70.6% 45.3%)" strokeWidth={2} fill="url(#colorRevenue)" name="Collected" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
