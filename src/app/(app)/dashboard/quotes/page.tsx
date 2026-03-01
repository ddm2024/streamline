import { Suspense } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { QuotesList } from './components/quotes-list'

export default function QuotesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quotes</h1>
          <p className="text-muted-foreground">Create and manage your quotes.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/quotes/new">
            <Plus className="h-4 w-4 mr-2" />
            New Quote
          </Link>
        </Button>
      </div>
      <Suspense fallback={<div className="h-96 animate-pulse rounded-lg bg-muted" />}>
        <QuotesList />
      </Suspense>
    </div>
  )
}
