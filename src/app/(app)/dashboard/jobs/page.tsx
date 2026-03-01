import { Suspense } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { JobsList } from './components/jobs-list'

export default function JobsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Jobs</h1>
          <p className="text-muted-foreground">Schedule and manage your field jobs.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/jobs/new">
            <Plus className="h-4 w-4 mr-2" />
            New Job
          </Link>
        </Button>
      </div>
      <Suspense fallback={<div className="h-96 animate-pulse rounded-lg bg-muted" />}>
        <JobsList />
      </Suspense>
    </div>
  )
}
