import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin } from 'lucide-react'
import { format } from 'date-fns'

const STATUS_COLORS: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  scheduled: 'outline',
  in_progress: 'default',
  on_hold: 'secondary',
}

export async function UpcomingJobs() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const orgId = user?.user_metadata?.org_id

  const { data: jobs } = await supabase
    .from('jobs')
    .select('id, title, status, scheduled_start, clients(first_name, last_name), properties(address_line1, city)')
    .eq('org_id', orgId)
    .in('status', ['scheduled', 'in_progress'])
    .order('scheduled_start', { ascending: true })
    .limit(5)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Upcoming Jobs</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/jobs">View all</Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {!jobs?.length && (
          <p className="text-sm text-muted-foreground text-center py-4">No upcoming jobs</p>
        )}
        {jobs?.map(job => (
          <Link key={job.id} href={`/dashboard/jobs/${job.id}`} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm truncate">{job.title}</span>
                <Badge variant={STATUS_COLORS[job.status]} className="shrink-0 text-xs">
                  {job.status.replace('_', ' ')}
                </Badge>
              </div>
              {job.clients && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {(job.clients as { first_name: string; last_name: string }).first_name}{' '}
                  {(job.clients as { first_name: string; last_name: string }).last_name}
                </p>
              )}
              <div className="flex items-center gap-3 mt-1">
                {job.scheduled_start && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(job.scheduled_start), 'MMM d, h:mm a')}
                  </span>
                )}
                {job.properties && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground truncate">
                    <MapPin className="h-3 w-3" />
                    {(job.properties as { address_line1: string; city: string }).city}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
