'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, Play, Square, Plus } from 'lucide-react'
import { format, differenceInMinutes } from 'date-fns'

interface TimeEntry {
  id: string
  tech: string
  job: string
  clock_in: Date
  clock_out?: Date
  duration_minutes?: number
  notes?: string
}

const DEMO_ENTRIES: TimeEntry[] = [
  { id: '1', tech: 'Marcus R.', job: 'Patio Install — Brady', clock_in: new Date('2026-03-01T08:02:00'), clock_out: new Date('2026-03-01T16:45:00'), duration_minutes: 523, notes: 'Base compaction + flagstone started' },
  { id: '2', tech: 'Jake T.', job: 'Patio Install — Brady', clock_in: new Date('2026-03-01T07:58:00'), clock_out: new Date('2026-03-01T16:30:00'), duration_minutes: 512 },
  { id: '3', tech: 'Derek S.', job: 'Spring Cleanup — Ferris', clock_in: new Date('2026-03-01T07:30:00'), clock_out: new Date('2026-03-01T11:15:00'), duration_minutes: 225 },
  { id: '4', tech: 'Marcus R.', job: 'Irrigation Repair — Frazier', clock_in: new Date('2026-03-01T13:00:00'), duration_minutes: undefined }, // still clocked in
]

function formatDuration(mins?: number) {
  if (!mins) return '—'
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `${h}h ${m}m`
}

export default function TimePage() {
  const [clockedIn, setClockedIn] = useState(false)

  const activeEntry = DEMO_ENTRIES.find(e => !e.clock_out)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Time Tracking</h1>
          <p className="text-muted-foreground">Clock in/out for field work.</p>
        </div>
      </div>

      {/* Clock In/Out Card */}
      <div className="rounded-lg border bg-card p-6">
        {activeEntry ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
              <span className="font-semibold">Clocked in — {activeEntry.job}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Since {format(activeEntry.clock_in, 'h:mm a')} · {differenceInMinutes(new Date(), activeEntry.clock_in)}m elapsed
            </p>
            <Button variant="destructive" size="sm" onClick={() => setClockedIn(false)}>
              <Square className="h-4 w-4 mr-2" />Clock Out
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">You&apos;re not clocked in.</p>
            <Button size="sm" onClick={() => setClockedIn(true)}>
              <Play className="h-4 w-4 mr-2" />Clock In
            </Button>
          </div>
        )}
      </div>

      {/* Time Entries */}
      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Today&apos;s Entries</h2>
        {DEMO_ENTRIES.map(entry => (
          <div key={entry.id} className="rounded-lg border bg-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{entry.tech}</span>
                  {!entry.clock_out && <Badge variant="default" className="text-xs">Active</Badge>}
                </div>
                <div className="text-sm text-muted-foreground mt-0.5">{entry.job}</div>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {format(entry.clock_in, 'h:mm a')} – {entry.clock_out ? format(entry.clock_out, 'h:mm a') : 'ongoing'}
                  </span>
                  <span>{formatDuration(entry.duration_minutes)}</span>
                </div>
                {entry.notes && <p className="text-xs text-muted-foreground mt-1 italic">{entry.notes}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
