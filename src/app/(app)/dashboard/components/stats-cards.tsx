import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, FileText, Briefcase, Users } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export async function StatsCards() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const orgId = user?.user_metadata?.org_id

  const [quotesRes, jobsRes, invoicesRes, clientsRes] = await Promise.all([
    supabase.from('quotes').select('grand_total, status').eq('org_id', orgId),
    supabase.from('jobs').select('status').eq('org_id', orgId),
    supabase.from('invoices').select('grand_total, amount_due, status').eq('org_id', orgId),
    supabase.from('clients').select('id').eq('org_id', orgId).eq('is_active', true),
  ])

  const openQuotes = quotesRes.data?.filter(q => ['draft', 'awaiting', 'changes_requested'].includes(q.status)) ?? []
  const quoteValue = openQuotes.reduce((sum, q) => sum + (q.grand_total ?? 0), 0)
  const activeJobs = jobsRes.data?.filter(j => ['scheduled', 'in_progress'].includes(j.status)).length ?? 0
  const overdueInvoices = invoicesRes.data?.filter(i => i.status === 'overdue') ?? []
  const overdueAmount = overdueInvoices.reduce((sum, i) => sum + (i.amount_due ?? 0), 0)
  const totalClients = clientsRes.data?.length ?? 0

  const stats = [
    { title: 'Open Quote Value', value: formatCurrency(quoteValue), icon: FileText, description: `${openQuotes.length} open quotes` },
    { title: 'Active Jobs', value: activeJobs.toString(), icon: Briefcase, description: 'Scheduled + in progress' },
    { title: 'Overdue Invoices', value: formatCurrency(overdueAmount), icon: DollarSign, description: `${overdueInvoices.length} overdue` },
    { title: 'Total Clients', value: totalClients.toString(), icon: Users, description: 'Active clients' },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map(stat => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
