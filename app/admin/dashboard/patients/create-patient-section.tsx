"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { UserPlus, Loader2, Copy, Check } from "lucide-react"

export function CreatePatientSection() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [displayName, setDisplayName] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [created, setCreated] = useState<{
    code: string
    displayName: string
    initialPassword?: string
  } | null>(null)
  const [copied, setCopied] = useState<"code" | "pw" | null>(null)

  const resetForm = () => {
    setDisplayName("")
    setPassword("")
    setError("")
    setCreated(null)
    setCopied(null)
  }

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (!next) resetForm()
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/admin/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: displayName.trim(),
          ...(password.trim() ? { password: password.trim() } : {}),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Kayıt başarısız")
        return
      }
      setCreated({
        code: data.code,
        displayName: data.displayName,
        initialPassword: data.initialPassword,
      })
      router.refresh()
    } catch {
      setError("Bağlantı hatası")
    } finally {
      setLoading(false)
    }
  }

  const copyText = async (_label: "code" | "pw", text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(_label)
      setTimeout(() => setCopied(null), 2000)
    } catch {
      /* ignore */
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="h-10 gap-2 px-4 font-medium shadow-sm">
          <UserPlus className="h-4 w-4" aria-hidden />
          Yeni hasta
        </Button>
      </DialogTrigger>
      <DialogContent className="gap-0 border-border/80 p-0 sm:max-w-md">
        {created ? (
          <div className="flex flex-col">
            <DialogHeader className="space-y-2 px-6 pt-6 text-left sm:px-6">
              <DialogTitle className="text-lg font-semibold">Hasta oluşturuldu</DialogTitle>
              <DialogDescription className="text-sm leading-relaxed">
                Aşağıdaki bilgileri hastanızla paylaşın. Şifre yalnızca bu ekranda gösterilir; güvenli
                kanaldan iletin.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 px-6 pb-2 pt-4 text-sm">
              <div className="rounded-lg border border-border/80 bg-muted/25 px-3 py-2.5">
                <p className="mb-0.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  İsim
                </p>
                <p className="font-medium text-foreground">{created.displayName}</p>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-lg border border-border/80 bg-card px-3 py-3 shadow-sm">
                <div className="min-w-0">
                  <p className="mb-0.5 text-xs font-medium text-muted-foreground">Hasta kodu</p>
                  <p className="font-mono text-base font-semibold tracking-wide text-foreground">
                    {created.code}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                  onClick={() => copyText("code", created.code)}
                  aria-label="Kodu kopyala"
                >
                  {copied === "code" ? (
                    <Check className="h-4 w-4 text-primary" aria-hidden />
                  ) : (
                    <Copy className="h-4 w-4" aria-hidden />
                  )}
                </Button>
              </div>
              {created.initialPassword ? (
                <div className="flex items-center justify-between gap-3 rounded-lg border border-border/80 bg-muted/35 px-3 py-3">
                  <div className="min-w-0">
                    <p className="mb-0.5 text-xs font-medium text-muted-foreground">İlk şifre</p>
                    <p className="break-all font-mono text-sm text-foreground">{created.initialPassword}</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="shrink-0"
                    onClick={() => copyText("pw", created.initialPassword!)}
                    aria-label="Şifreyi kopyala"
                  >
                    {copied === "pw" ? (
                      <Check className="h-4 w-4 text-primary" aria-hidden />
                    ) : (
                      <Copy className="h-4 w-4" aria-hidden />
                    )}
                  </Button>
                </div>
              ) : (
                <p className="rounded-lg border border-dashed border-border/70 bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
                  Şifreyi siz belirlediniz; hastaya ayrıca iletmeyi unutmayın.
                </p>
              )}
              <p className="text-xs leading-relaxed text-muted-foreground">
                Giriş adresi:{" "}
                <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">/hasta</span>
              </p>
            </div>
            <DialogFooter className="border-t border-border/60 px-6 py-4 sm:justify-end">
              <Button type="button" className="min-w-[100px]" onClick={() => handleOpenChange(false)}>
                Kapat
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col">
            <DialogHeader className="space-y-2 px-6 pt-6 text-left">
              <DialogTitle className="text-lg font-semibold">Yeni hasta</DialogTitle>
              <DialogDescription className="text-sm leading-relaxed">
                Hastaya özel kod ve şifre oluşturulur. Şifre alanını boş bırakırsanız güvenli rastgele
                bir şifre üretilir.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 px-6 py-5">
              <div className="space-y-1.5">
                <label htmlFor="pt-name" className="text-sm font-medium text-foreground">
                  Ad / görünen isim
                </label>
                <Input
                  id="pt-name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Örn: Ayşe Yılmaz"
                  required
                  disabled={loading}
                  className="h-11"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="pt-pw" className="text-sm font-medium text-muted-foreground">
                  Şifre <span className="font-normal">(isteğe bağlı, en az 6 karakter)</span>
                </label>
                <Input
                  id="pt-pw"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Boş bırakırsanız otomatik üretilir"
                  disabled={loading}
                  autoComplete="new-password"
                  className="h-11"
                />
              </div>
              {error ? (
                <p className="rounded-md border border-destructive/25 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </p>
              ) : null}
            </div>
            <DialogFooter className="gap-2 border-t border-border/60 px-6 py-4 sm:justify-end">
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                İptal
              </Button>
              <Button type="submit" disabled={loading} className="min-w-[100px]">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : "Oluştur"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
