import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency } from '@/lib/utils'

const STAGE_LABELS: Record<string, string> = {
  draft: 'Draft',
  awaiting: 'Awaiting Approval',
  changes_requested: 'Changes Requested',
  approved: 'Approved',
}

const STAGE_COLORS: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  draft: 'secondary',
  awaiting: 'outline',
  changes_requested: 'destructive',
  approved: 'default',
}

export async function PipelineOverview() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const orgId = user?.user_metadata?.org_id

  const { data: quotes } = await supabase
    .from('quotes')
    .select('status, grand_total')
    .eq('org_id', orgId)
    .in('status', ['draft', 'awaiting', 'changes_requested', 'approved'])

  const pipeline = Object.entries(STAGE_LABELS).map(([status, label]) => {
    const stageQuotes = quotes?.filter(q => q.status === status) ?? []
    return {
      status,
      label,
      count: stageQuotes.length,
      value: stageQuotes.reduce((sum, q) => sum + (q.grand_total ?? 0), 0),
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quote Pipeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {pipeline.map(stage => (
            <div key={stage.status} className="space-y-2">
              <Badge variant={STAGE_COLORS[stage.status]}>{stage.label}</Badge>
              <div className="text-2xl font-bold">{stage.count}</div>
              <div className="text-sm text-muted-foreground">{formatCurrency(stage.value)}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
