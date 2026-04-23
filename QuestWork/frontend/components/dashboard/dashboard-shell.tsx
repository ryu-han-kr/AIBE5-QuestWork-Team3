import type { ReactNode } from 'react'
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar'

interface DashboardShellProps {
  children: ReactNode
  sidebar?: ReactNode
}

export function DashboardShell({
  children,
  sidebar,
}: DashboardShellProps) {
  return (
    <div className="mx-auto flex max-w-[1380px] items-start px-4 sm:px-6 lg:px-8">
      {sidebar ?? <DashboardSidebar />}

      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-[1080px] p-6 lg:p-8">{children}</div>
      </main>
    </div>
  )
}
