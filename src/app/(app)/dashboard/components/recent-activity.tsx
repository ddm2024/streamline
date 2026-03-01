import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDistanceToNow } from 'date-fns'
import { FileText, Briefcase, DollarSign, Users, Clock } from 'lucide-react'

const ENTITY_ICONS: Record<string, typeof FileText> = {
  quote: FileText,
  job: Briefcase,
  invoice: DollarSign,
  client: Users,
  payment: DollarSign,
}

export async function RecentActivity() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const orgId = user?.user_metadata?.org_id

  const { data: activities } = await supabase
    .from('activity_log')
    .select('*')
    .eq('org_id', orgId)
    .order('created_at', { ascending: false })
    .limit(10)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {!activities?.length && (
          <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
        )}
        {activities?.map(activity => {
          const Icon = ENTITY_ICONS[activity.entity_type] ?? Clock
          return (
            <div key={activity.id} className="flex items-start gap-3">
              <div className="p-1.5 rounded-md bg-muted shrink-0">
                <Icon className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm">{activity.description}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
