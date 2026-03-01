import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function NewJobPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/jobs"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">New Job</h1>
          <p className="text-muted-foreground">Create a new field job.</p>
        </div>
      </div>
      <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
        <p>Job creation form coming soon.</p>
        <p className="text-sm mt-2">Jobs can be created from approved quotes.</p>
      </div>
    </div>
  )
}
