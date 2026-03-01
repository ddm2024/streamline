'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Search,
  MoreHorizontal,
  Calendar,
  MapPin,
  User,
  Clock,
} from 'lucide-react'
import { format } from 'date-fns'

type JobStatus = 'scheduled' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled'
type JobPriority = 'low' | 'medium' | 'high' | 'urgent'

interface DemoJob {
  id: string
  job_number: string
  title: string
  status: JobStatus
  priority: JobPriority
  client: string
  address: string
  scheduled_start: string
  estimated_hours: number
  assigned_to: string[]
}

const STATUS_COLORS: Record<JobStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  scheduled: 'outline',
  in_progress: 'default',
  on_hold: 'secondary',
  completed: 'secondary',
  cancelled: 'destructive',
}

const PRIORITY_COLORS: Record<JobPriority, string> = {
  low: 'text-muted-foreground',
  medium: 'text-blue-500',
  high: 'text-orange-500',
  urgent: 'text-red-500',
}

const demoJobs: DemoJob[] = [
  {
    id: '1',
    job_number: 'J-0008',
    title: 'Patio Install — Brady Commercial',
    status: 'in_progress',
    priority: 'high',
    client: 'Chris Brady',
    address: '513 Saddle Ridge, Northlake TX 76247',
    scheduled_start: '2026-03-01T08:00:00',
    estimated_hours: 16,
    assigned_to: ['Marcus R.', 'Jake T.'],
  },
  {
    id: '2',
    job_number: 'J-0007',
    title: 'Spring Cleanup — Ferris Residence',
    status: 'scheduled',
    priority: 'medium',
    client: 'Ricky Ferris',
    address: '4521 Oak Valley Dr, Keller TX 76248',
    scheduled_start: '2026-03-04T07:30:00',
    estimated_hours: 4,
    assigned_to: ['Derek S.'],
  },
  {
    id: '3',
    job_number: 'J-0006',
    title: 'Irrigation Repair — Frazier',
    status: 'scheduled',
    priority: 'urgent',
    client: 'Lindon Frazier',
    address: '1892 Saddle Ridge Blvd, Southlake TX',
    scheduled_start: '2026-03-02T09:00:00',
    estimated_hours: 2,
    assigned_to: ['Marcus R.'],
  },
  {
    id: '4',
    job_number: 'J-0005',
    title: 'Monthly Mowing — Harvest Ops',
    status: 'completed',
    priority: 'low',
    client: 'Harvest Ops HQ',
    address: '100 Commerce Blvd, Fort Worth TX',
    scheduled_start: '2026-02-28T06:00:00',
    estimated_hours: 6,
    assigned_to: ['Jake T.', 'Derek S.'],
  },
]

export function JobsList() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<JobStatus | 'all'>('all')

  const filtered = demoJobs.filter(j => {
    const matchSearch = `${j.job_number} ${j.title} ${j.client}`.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || j.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search jobs..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex gap-1">
          {(['all', 'scheduled', 'in_progress', 'on_hold', 'completed'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === s
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {s === 'all' ? 'All' : s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {filtered.map(job => (
          <div key={job.id} className="rounded-lg border bg-card p-4 hover:bg-muted/30 transition-colors cursor-pointer">
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs text-muted-foreground">{job.job_number}</span>
                  <span className="font-semibold text-sm">{job.title}</span>
                  <Badge variant={STATUS_COLORS[job.status]} className="text-xs">
                    {job.status.replace('_', ' ')}
                  </Badge>
                  <span className={`text-xs font-medium ${PRIORITY_COLORS[job.priority]}`}>
                    {job.priority === 'urgent' ? '🔴' : job.priority === 'high' ? '🟠' : ''} {job.priority}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-2 flex-wrap">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <User className="h-3 w-3" />{job.client}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />{job.address}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />{format(new Date(job.scheduled_start), 'MMM d, h:mm a')}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />{job.estimated_hours}h est.
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  {job.assigned_to.map(tech => (
                    <span key={tech} className="text-[11px] bg-muted px-2 py-0.5 rounded-full">{tech}</span>
                  ))}
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">No jobs found</div>
        )}
      </div>
    </div>
  )
}
