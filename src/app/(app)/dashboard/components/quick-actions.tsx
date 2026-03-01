import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, FileText, Briefcase, Users } from 'lucide-react'

const actions = [
  { label: 'New Quote', href: '/dashboard/quotes/new', icon: FileText },
  { label: 'New Job', href: '/dashboard/jobs/new', icon: Briefcase },
  { label: 'New Client', href: '/dashboard/clients/new', icon: Users },
]

export function QuickActions() {
  return (
    <div className="flex flex-wrap gap-3">
      {actions.map(action => (
        <Button key={action.label} variant="outline" asChild className="gap-2">
          <Link href={action.href}>
            <Plus className="h-4 w-4" />
            <action.icon className="h-4 w-4" />
            {action.label}
          </Link>
        </Button>
      ))}
    </div>
  )
}
