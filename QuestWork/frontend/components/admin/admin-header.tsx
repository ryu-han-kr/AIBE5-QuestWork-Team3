"use client"

import { Shield } from "lucide-react"
import Link from "next/link"

type AdminTab = "member" | "settlement-management" | "quest-management" | "statistics"

interface AdminHeaderProps {
  activeTab?: AdminTab
}

export function AdminHeader({ activeTab }: AdminHeaderProps) {
  const navItems: { label: string; href: string; tab: AdminTab }[] = [
    { label: "회원 관리", href: "/admin", tab: "member" },
    { label: "정산 관리", href: "/admin/settlement-management", tab: "settlement-management" },
    { label: "퀘스트 관리", href: "/admin/quest-management", tab: "quest-management" },
    { label: "통계", href: "/admin/statistics", tab: "statistics" },
  ]

  return (
      // bg-white를 사용하고, 뒤에 !를 붙여서(important) 강제로 불투명하게 만들었습니다.
      // 만약 다크모드라면 bg-slate-950 같은 어두운 색을 써보세요.
      <header className="sticky top-0 z-50 w-full border-b border-border bg-white shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
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
          <Link href="/">
            <span className="text-lg font-bold text-foreground">QuestWork</span>
          </Link>

        <nav className="flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.tab}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                activeTab === item.tab
                  ? "text-primary border-b-2 border-primary pb-0.5"
                  : "text-muted-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5">
          <Shield className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">관리자</span>
        </div>
      </div>
    </header>
  )
}
