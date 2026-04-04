"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LogOut, Home } from "lucide-react"
import Link from "next/link"

export function PatientPanelShell({
  displayName,
  code,
  children,
}: {
  displayName: string
  code: string
  children: React.ReactNode
}) {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch("/api/patient/logout", { method: "POST" })
    router.push("/hasta")
    router.refresh()
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/25">
      <header className="sticky top-0 z-50 border-b border-border/80 bg-card/85 shadow-sm backdrop-blur-md supports-backdrop-filter:bg-card/70">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5 lg:px-8">
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Hasta paneli
              </span>
              <Badge variant="secondary" className="font-mono text-[11px] tracking-wide">
                {code}
              </Badge>
            </div>
            <p className="truncate text-lg font-semibold leading-tight tracking-tight text-foreground sm:text-xl">
              {displayName}
            </p>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Egzersiz listenizi buradan görüntüleyip güncelleyebilirsiniz.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
            <Button asChild variant="outline" size="sm" className="min-h-9">
              <Link href="/">
                <Home className="h-4 w-4" />
                Ana sayfa
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="min-h-9 text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Çıkış
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        {children}
      </main>
    </div>
  )
}
