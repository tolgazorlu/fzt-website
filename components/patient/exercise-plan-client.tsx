"use client"

import { useMemo, useState } from "react"
import type { PatientExercise } from "@/lib/patient-exercises-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Plus, Trash2, Stethoscope, User, ListChecks } from "lucide-react"
import { cn } from "@/lib/utils"

type ExercisePlanClientProps =
  | {
      variant: "patient"
      displayName: string
      initialExercises: PatientExercise[]
    }
  | {
      variant: "therapist"
      displayName: string
      patientCode: string
      initialExercises: PatientExercise[]
    }

export function ExercisePlanClient(props: ExercisePlanClientProps) {
  const { variant, displayName, initialExercises } = props
  const [items, setItems] = useState<PatientExercise[]>(initialExercises)
  const [title, setTitle] = useState("")
  const [note, setNote] = useState("")
  const [loading, setLoading] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)

  const apiBase =
    props.variant === "patient"
      ? "/api/patient/exercises"
      : `/api/admin/patients/${encodeURIComponent(props.patientCode)}/exercises`

  const { doneCount, total } = useMemo(() => {
    const done = items.filter((i) => i.done).length
    return { doneCount: done, total: items.length }
  }, [items])

  const progressPct = total > 0 ? Math.round((doneCount / total) * 100) : 0

  const addExercise = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || loading) return
    setLoading(true)
    try {
      const res = await fetch(apiBase, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), note: note.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        console.error(data.error)
        return
      }
      if (data.exercise) {
        setItems((prev) => [data.exercise as PatientExercise, ...prev])
      }
      setTitle("")
      setNote("")
    } finally {
      setLoading(false)
    }
  }

  const toggleDone = async (exerciseId: string, done: boolean) => {
    setBusyId(exerciseId)
    try {
      const res = await fetch(apiBase, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exerciseId, done }),
      })
      const data = await res.json()
      if (!res.ok) return
      if (data.exercise) {
        setItems((prev) =>
          prev.map((x) => (x.id === exerciseId ? (data.exercise as PatientExercise) : x)),
        )
      }
    } finally {
      setBusyId(null)
    }
  }

  const remove = async (exerciseId: string) => {
    setBusyId(exerciseId)
    try {
      const res = await fetch(`${apiBase}?id=${encodeURIComponent(exerciseId)}`, {
        method: "DELETE",
      })
      if (!res.ok) return
      setItems((prev) => prev.filter((x) => x.id !== exerciseId))
    } finally {
      setBusyId(null)
    }
  }

  const roleLabel = (by: PatientExercise["addedBy"]) =>
    by === "therapist" ? "Fizyoterapist" : "Hasta"

  return (
    <div className="w-full space-y-8 sm:space-y-10 lg:space-y-12 pb-4 sm:pb-6">
      <header className="space-y-4 border-b border-border/70 pb-6 sm:pb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <ListChecks className="h-4 w-4 shrink-0" aria-hidden />
              <span className="text-xs font-medium uppercase tracking-wider">
                {variant === "patient" ? "Kişisel plan" : "Hasta planı"}
              </span>
            </div>
            <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {variant === "patient" ? "Egzersiz planım" : `${displayName}`}
            </h1>
            <p className="max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]">
              {variant === "patient"
                ? "Fizyoterapistinizin önerdiği görevler burada listelenir. Siz de notlarınızı ekleyebilir, tamamladıklarınızı işaretleyebilirsiniz."
                : "Hastanın panelinde gördüğü liste ile eşleşir. Egzersiz ekleyebilir veya tamamlanma durumunu güncelleyebilirsiniz."}
            </p>
          </div>
        </div>

        {variant === "patient" && total > 0 ? (
          <div className="max-w-md space-y-2 pt-1">
            <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
              <span>İlerleme</span>
              <span className="tabular-nums">
                {doneCount} / {total} tamamlandı ({progressPct}%)
              </span>
            </div>
            <div
              className="h-2 overflow-hidden rounded-full bg-muted"
              role="progressbar"
              aria-valuenow={progressPct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Tamamlanan egzersiz yüzdesi"
            >
              <div
                className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        ) : null}
      </header>

      <Card className="gap-0 overflow-hidden border-border/80 py-0 shadow-md ring-1 ring-black/3 dark:ring-white/5">
        <CardHeader className="space-y-1 border-b border-border/70 bg-muted/40 px-4 py-4 sm:px-6 sm:py-5">
          <CardTitle className="text-base font-semibold sm:text-lg">Yeni egzersiz veya görev</CardTitle>
          <CardDescription className="text-sm leading-relaxed">
            Kısa ve net bir başlık yazın; detayları not alanına bırakabilirsiniz.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 py-5 sm:px-6 sm:py-6">
          <form onSubmit={addExercise} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="ex-title" className="text-sm font-medium text-foreground">
                Başlık <span className="font-normal text-muted-foreground">(zorunlu)</span>
              </label>
              <Input
                id="ex-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Örn: Germe seti — 3 × 12 tekrar"
                disabled={loading}
                className="h-11 text-base sm:text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="ex-note" className="text-sm font-medium text-muted-foreground">
                Not <span className="font-normal">(isteğe bağlı)</span>
              </label>
              <Textarea
                id="ex-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Video linki, süre, set/tekrar, uyarılar…"
                disabled={loading}
                rows={3}
                className="min-h-[88px] resize-y text-base sm:text-sm"
              />
            </div>
            <Button
              type="submit"
              disabled={loading || !title.trim()}
              className="h-10 w-full sm:w-auto"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                <>
                  <Plus className="h-4 w-4" aria-hidden />
                  Listeye ekle
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <section className="space-y-4 sm:space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border/60 pb-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Program listesi
          </h2>
          <span className="text-xs tabular-nums text-muted-foreground sm:text-sm">
            {total === 0 ? "Henüz kayıt yok" : `${total} öğe`}
          </span>
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/80 bg-muted/30 px-6 py-12 text-center sm:px-10 sm:py-14">
            <p className="mx-auto max-w-sm text-muted-foreground text-sm leading-relaxed">
              Listeniz boş. Yukarıdan ilk egzersizi ekleyebilir veya fizyoterapistinizin atadığı
              öğelerin burada görünmesini bekleyebilirsiniz.
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-3 sm:gap-4">
            {items.map((ex) => (
              <li key={ex.id}>
                <Card
                  className={cn(
                    "gap-0 overflow-hidden rounded-xl border py-0 shadow-sm transition-[box-shadow,opacity] duration-200",
                    "border-border/70 hover:shadow-md",
                    ex.done && "border-border/50 bg-muted/25 opacity-[0.92]",
                  )}
                >
                  <CardContent className="flex gap-3 p-4 sm:gap-4 sm:p-5">
                    <div className="pt-0.5 sm:pt-1">
                      <Checkbox
                        checked={ex.done}
                        disabled={busyId === ex.id}
                        onCheckedChange={(v) => toggleDone(ex.id, v === true)}
                        aria-label="Tamamlandı olarak işaretle"
                        className="size-[18px]"
                      />
                    </div>
                    <div className="min-w-0 flex-1 space-y-2">
                      <p
                        className={cn(
                          "text-[0.9375rem] font-medium leading-snug text-foreground sm:text-base",
                          ex.done && "text-muted-foreground line-through decoration-border",
                        )}
                      >
                        {ex.title}
                      </p>
                      {ex.note ? (
                        <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                          {ex.note}
                        </p>
                      ) : null}
                      <div className="flex flex-wrap items-center gap-2 pt-0.5">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                            ex.addedBy === "therapist"
                              ? "bg-primary/12 text-primary"
                              : "bg-secondary text-secondary-foreground",
                          )}
                        >
                          {ex.addedBy === "therapist" ? (
                            <Stethoscope className="h-3 w-3" aria-hidden />
                          ) : (
                            <User className="h-3 w-3" aria-hidden />
                          )}
                          {roleLabel(ex.addedBy)}
                        </span>
                        <span className="text-[11px] text-muted-foreground tabular-nums sm:text-xs">
                          {new Date(ex.createdAt).toLocaleString("tr-TR", {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </span>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-9 shrink-0 text-muted-foreground hover:bg-muted hover:text-foreground"
                      disabled={busyId === ex.id}
                      onClick={() => remove(ex.id)}
                      aria-label="Öğeyi sil"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
