"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Calendar, FileText, LogOut, Home, Users, LayoutTemplate } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/dashboard/homepage", label: "Ana sayfa", icon: LayoutTemplate },
  { href: "/admin/dashboard/appointments", label: "Randevular", icon: Calendar },
  { href: "/admin/dashboard/patients", label: "Hastalar", icon: Users },
  { href: "/admin/dashboard/blogs", label: "Blog Yazıları", icon: FileText },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" })
    router.push("/admin")
    router.refresh()
  }

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col">
      <div className="p-6 border-b border-border">
        <h2 className="font-semibold text-foreground">Admin Panel</h2>
        <p className="text-xs text-muted-foreground mt-0.5">FZT Website</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
              pathname === item.href
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-border space-y-2">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <Home className="h-5 w-5 shrink-0" />
          Siteye Dön
        </Link>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:bg-muted hover:text-foreground"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          Çıkış Yap
        </Button>
      </div>
    </aside>
  )
}
