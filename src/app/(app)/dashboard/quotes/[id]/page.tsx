import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Edit } from 'lucide-react'

export default function QuoteDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/quotes"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">Quote #{params.id}</h1>
        </div>
        <Button asChild>
          <Link href={`/dashboard/quotes/${params.id}/edit`}><Edit className="h-4 w-4 mr-2" />Edit</Link>
        </Button>
      </div>
      <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
        <p>Quote detail view coming soon.</p>
      </div>
    </div>
  )
}
