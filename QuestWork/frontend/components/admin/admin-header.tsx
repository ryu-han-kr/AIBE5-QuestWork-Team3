"use client"

import { Shield } from "lucide-react"
import Link from "next/link"

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">Q</span>
          </div>
          <span className="text-lg font-bold text-foreground">QuestWork</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/admin"
            className="text-sm font-medium text-foreground transition-colors hover:text-primary"
          >
            회원 관리
          </Link>
          <Link
            href="/admin/settlement-management"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            정산 관리
          </Link>
          <Link
            href="#"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            퀘스트 관리
          </Link>
          <Link
            href="/admin/statistics"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            통계
          </Link>
        </nav>

        <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5">
          <Shield className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">관리자</span>
        </div>
      </div>
    </header>
  )
}
