'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  FileText,
  Briefcase,
  DollarSign,
  Package,
  Calendar,
  Clock,
  BarChart3,
  Settings,
  ChevronLeft,
  Zap,
} from 'lucide-react'
import { useAppStore } from '@/lib/store'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/clients', label: 'Clients', icon: Users },
  { href: '/dashboard/quotes', label: 'Quotes', icon: FileText },
  { href: '/dashboard/jobs', label: 'Jobs', icon: Briefcase },
  { href: '/dashboard/invoices', label: 'Invoices', icon: DollarSign },
  { href: '/dashboard/services', label: 'Services', icon: Package },
  { href: '/dashboard/calendar', label: 'Calendar', icon: Calendar },
  { href: '/dashboard/time', label: 'Time', icon: Clock },
  { href: '/dashboard/reports', label: 'Reports', icon: BarChart3 },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { sidebarOpen, toggleSidebar } = useAppStore()

  const isActive = (item: { href: string; exact?: boolean }) => {
    if (item.exact) return pathname === item.href
    return pathname.startsWith(item.href)
  }

  return (
    <aside
      className={cn(
        'flex flex-col border-r bg-sidebar transition-all duration-300 shrink-0',
        sidebarOpen ? 'w-56' : 'w-14'
      )}
    >
      {/* Logo */}
      <div className={cn(
        'flex items-center border-b h-14 shrink-0',
        sidebarOpen ? 'px-4 gap-3' : 'justify-center px-0'
      )}>
        <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <Zap className="h-4 w-4 text-primary-foreground" />
        </div>
        {sidebarOpen && (
          <span className="font-bold text-base tracking-tight">Streamline</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 space-y-0.5 px-2 overflow-y-auto">
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium transition-colors',
              isActive(item)
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {sidebarOpen && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t p-2 space-y-0.5">
        <Link
          href="/dashboard/settings"
          className={cn(
            'flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium transition-colors w-full',
            pathname.startsWith('/dashboard/settings')
              ? 'bg-sidebar-accent text-sidebar-accent-foreground'
              : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
          )}
        >
          <Settings className="h-4 w-4 shrink-0" />
          {sidebarOpen && <span>Settings</span>}
        </Link>
        <button
          onClick={toggleSidebar}
          className={cn(
            'flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium transition-colors w-full text-sidebar-foreground hover:bg-sidebar-accent/50',
            !sidebarOpen && 'justify-center'
          )}
        >
          <ChevronLeft className={cn('h-4 w-4 shrink-0 transition-transform', !sidebarOpen && 'rotate-180')} />
          {sidebarOpen && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  )
}
