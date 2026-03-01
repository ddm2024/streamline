import { Suspense } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { ClientsList } from './components/clients-list'

export default function ClientsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">Manage your client relationships and properties.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/clients/new">
            <Plus className="h-4 w-4 mr-2" />
            New Client
          </Link>
        </Button>
      </div>
      <Suspense fallback={<div className="h-96 animate-pulse rounded-lg bg-muted" />}>
        <ClientsList />
      </Suspense>
    </div>
  )
}
