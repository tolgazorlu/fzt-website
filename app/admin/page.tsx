"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Lock, LogIn, Loader2, ShieldAlert } from "lucide-react"

export default function AdminLoginPage() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [locked, setLocked] = useState(false)
  const [remainingMinutes, setRemainingMinutes] = useState<number | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetch("/api/admin/verify")
      .then((r) => r.json())
      .then((d) => {
        if (d.authenticated) router.replace("/admin/dashboard")
      })
      .catch(() => {})
  }, [router])

  useEffect(() => {
    fetch("/api/admin/login/status")
      .then((r) => r.json())
      .then((d) => {
        if (d.locked) {
          setLocked(true)
          setRemainingMinutes(d.remainingMinutes ?? 60)
        }
      })
      .catch(() => {})
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Giriş başarısız")
        if (data.locked) {
          setLocked(true)
          setRemainingMinutes(data.remainingMinutes ?? 60)
        }
        return
      }
      router.replace("/admin/dashboard")
    } catch {
      setError("Bağlantı hatası")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,oklch(0.98_0.005_250)_0%,oklch(0.96_0.008_250)_100%)]" />
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 100% 80% at 20% 0%, oklch(0.45 0.12 195 / 0.08) 0%, transparent 60%),
            radial-gradient(ellipse 80% 60% at 100% 100%, oklch(0.55 0.18 165 / 0.06) 0%, transparent 50%)
          `,
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-card rounded-2xl p-8 shadow-xl border border-border">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-2xl bg-primary/10">
              <Lock className="h-10 w-10 text-primary" />
            </div>
          </div>
          <h1 className="font-serif text-2xl font-bold text-center text-foreground mb-2">
            Admin Girişi
          </h1>
          <p className="text-muted-foreground text-center text-sm mb-6">
            Yönetim paneline erişmek için şifrenizi girin
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {locked ? (
              <div className="flex flex-col items-center gap-3 py-4 px-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <ShieldAlert className="h-10 w-10 text-destructive" />
                <p className="text-sm text-center text-foreground font-medium">
                  Çok fazla başarısız giriş denemesi.
                </p>
                <p className="text-sm text-muted-foreground text-center">
                  Lütfen {remainingMinutes ?? 60} dakika sonra tekrar deneyin.
                </p>
              </div>
            ) : (
              <>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1.5">
                    Şifre
                  </label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full"
                    autoComplete="off"
                  />
                </div>
                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}
                <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Giriş yapılıyor...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Giriş Yap
                </span>
              )}
            </Button>
              </>
            )}
          </form>
        </div>
      </motion.div>
    </main>
  )
}
