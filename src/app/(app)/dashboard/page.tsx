import { Suspense } from 'react'
import { StatsCards } from './components/stats-cards'
import { QuickActions } from './components/quick-actions'
import { RevenueChart } from './components/revenue-chart'
import { PipelineOverview } from './components/pipeline-overview'
import { UpcomingJobs } from './components/upcoming-jobs'
import { RecentActivity } from './components/recent-activity'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back. Here&apos;s what&apos;s happening today.</p>
      </div>
      <QuickActions />
      <Suspense fallback={<div className="h-24 animate-pulse rounded-lg bg-muted" />}>
        <StatsCards />
      </Suspense>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <RevenueChart />
          <PipelineOverview />
        </div>
        <div className="space-y-6">
          <UpcomingJobs />
          <RecentActivity />
        </div>
      </div>
    </div>
  )
}
