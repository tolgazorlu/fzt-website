"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Activity, Loader2, LogIn, Shield } from "lucide-react"

export default function HastaLoginPage() {
  const [code, setCode] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetch("/api/patient/session")
      .then((r) => r.json())
      .then((d) => {
        if (d.authenticated) router.replace("/hasta/panel")
      })
      .catch(() => {})
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/patient/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim(), password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Giriş başarısız")
        return
      }
      router.replace("/hasta/panel")
      router.refresh()
    } catch {
      setError("Bağlantı hatası")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-background px-4 py-10 sm:px-6 sm:py-14 lg:py-16">
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(165deg,oklch(0.99_0.01_250)_0%,oklch(0.96_0.015_250)_45%,oklch(0.94_0.02_200)_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 120% 70% at 0% -10%, oklch(0.52 0.14 195 / 0.09) 0%, transparent 55%),
            radial-gradient(ellipse 90% 50% at 100% 100%, oklch(0.58 0.16 165 / 0.07) 0%, transparent 50%)
          `,
        }}
        aria-hidden
      />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-[420px]"
      >
        <div className="rounded-2xl border border-border/80 bg-card/95 p-6 shadow-lg shadow-black/5 ring-1 ring-black/4 backdrop-blur-sm sm:p-8 dark:ring-white/6 dark:shadow-black/20">
          <div className="mb-7 flex flex-col items-center text-center">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
              <Activity className="h-7 w-7 text-primary" strokeWidth={1.75} />
            </div>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Egzersiz programı
            </p>
            <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground sm:text-[1.65rem]">
              Hasta girişi
            </h1>
            <p className="mt-2 max-w-[32ch] text-pretty text-sm leading-relaxed text-muted-foreground">
              Size iletilen hasta kodu ve şifre ile kişisel egzersiz listenize güvenli şekilde
              erişin.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="code" className="text-sm font-medium text-foreground">
                Hasta kodu
              </label>
              <Input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Örn: ABC12XY9"
                required
                className="h-11 font-mono text-base tracking-[0.12em] sm:text-sm"
                autoComplete="username"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Şifre
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="h-11 text-base sm:text-sm"
                autoComplete="current-password"
              />
            </div>

            {error ? (
              <div
                role="alert"
                className="rounded-lg border border-destructive/25 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
              >
                {error}
              </div>
            ) : null}

            <Button type="submit" className="h-11 w-full text-base font-medium sm:h-11" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Giriş yapılıyor…
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <LogIn className="h-4 w-4" aria-hidden />
                  Giriş yap
                </span>
              )}
            </Button>
          </form>

          <div className="mt-8 flex items-start gap-2.5 border-t border-border/70 pt-6 text-left">
            <Shield className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
            <p className="text-xs leading-relaxed text-muted-foreground">
              Oturumunuz tarayıcınızda güvenli çerez ile saklanır. Ortak bilgisayarlarda işiniz
              bitince çıkış yapmayı unutmayın.
            </p>
          </div>
        </div>
      </motion.div>
    </main>
  )
}
