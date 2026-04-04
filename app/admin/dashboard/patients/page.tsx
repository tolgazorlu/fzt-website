import Link from "next/link"
import { listPatientSummariesForAdmin } from "@/lib/patient-exercises-store"
import { CreatePatientSection } from "./create-patient-section"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { User, ChevronRight, ClipboardList } from "lucide-react"

export default async function AdminPatientsPage() {
  const patients = await listPatientSummariesForAdmin()

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-col gap-6 border-b border-border/70 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Hasta panelleri
          </p>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Hastalar
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]">
            Her kayıt için benzersiz kod ve şifre oluşturulur. Hastalar <span className="font-mono text-foreground/80">/hasta</span>{" "}
            üzerinden panele girer; egzersizleri siz de bu listeden yönetirsiniz.
          </p>
        </div>
        <div className="shrink-0">
          <CreatePatientSection />
        </div>
      </div>

      {patients.length === 0 ? (
        <Card className="border-dashed border-border/80 shadow-sm">
          <CardContent className="px-6 py-14 text-center sm:px-8 sm:py-16">
            <ClipboardList className="mx-auto mb-4 h-12 w-12 text-muted-foreground/80" aria-hidden />
            <p className="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground">
              Henüz hasta kaydı yok. «Yeni hasta» ile ilk kaydı oluşturun; kod ve şifreyi hastanıza
              güvenli bir kanaldan iletin.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="border-border/70 hover:bg-transparent">
                <TableHead className="h-12 font-semibold text-foreground">İsim</TableHead>
                <TableHead className="font-semibold text-foreground">Hasta kodu</TableHead>
                <TableHead className="text-right font-semibold text-foreground">Egzersiz</TableHead>
                <TableHead className="font-semibold text-foreground">Oluşturulma</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((p) => (
                <TableRow key={p.id} className="border-border/60">
                  <TableCell className="py-3.5">
                    <div className="flex items-center gap-2.5">
                      <User className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                      <span className="font-medium text-foreground">{p.displayName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3.5">
                    <span className="font-mono text-sm font-medium tracking-wide text-foreground">
                      {p.code}
                    </span>
                  </TableCell>
                  <TableCell className="py-3.5 text-right tabular-nums text-muted-foreground">
                    {p.exerciseCount}
                  </TableCell>
                  <TableCell className="py-3.5 text-sm text-muted-foreground">
                    {new Date(p.createdAt).toLocaleDateString("tr-TR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="py-3.5">
                    <Link
                      href={`/admin/dashboard/patients/${p.code}`}
                      className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      aria-label="Egzersizleri aç"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
