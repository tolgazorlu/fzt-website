import Link from "next/link"
import { getAppointments, getBlogs } from "@/lib/db"

export const dynamic = "force-dynamic"
import { listPatientSummariesForAdmin } from "@/lib/patient-exercises-store"
import { Calendar, FileText, ArrowRight, Users, LayoutTemplate } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function AdminDashboardPage() {
  const [appointments, blogs, patients] = await Promise.all([
    getAppointments(),
    getBlogs(false),
    listPatientSummariesForAdmin(),
  ])
  const recentAppointments = appointments.slice(0, 5)
  const recentBlogs = blogs.slice(0, 5)

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Hoş geldiniz, yönetim paneline genel bakış</p>
      </div>
      <div className="mb-8 flex flex-col gap-3 rounded-xl border border-border bg-muted/40 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <LayoutTemplate className="h-6 w-6 shrink-0 text-primary mt-0.5" />
          <div>
            <p className="font-semibold text-foreground">Ana sayfa içeriği</p>
            <p className="text-sm text-muted-foreground">
              Kahraman alanı, hizmet kartları, hakkımda, iletişim, üst bar ve alt bilgi metinleri
            </p>
          </div>
        </div>
        <Button asChild variant="default" size="sm" className="shrink-0 w-full sm:w-auto">
          <Link href="/admin/dashboard/homepage" className="gap-2">
            Düzenle <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Randevular
            </h2>
            <span className="text-2xl font-bold text-primary">{appointments.length}</span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Toplam randevu / bilgi talebi sayısı
          </p>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/dashboard/appointments">
              Tümünü Gör <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Hasta panelleri
            </h2>
            <span className="text-2xl font-bold text-primary">{patients.length}</span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Egzersiz planı olan hasta kayıtları
          </p>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/dashboard/patients">
              Yönet <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Blog Yazıları
            </h2>
            <span className="text-2xl font-bold text-primary">{blogs.length}</span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Yayınlanan: {blogs.filter((b) => b.published).length}
          </p>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/dashboard/blogs">
              Tümünü Gör <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-semibold text-foreground mb-4">Son Randevular</h3>
          {recentAppointments.length === 0 ? (
            <p className="text-sm text-muted-foreground">Henüz randevu yok</p>
          ) : (
            <ul className="space-y-3">
              {recentAppointments.map((a) => (
                <li
                  key={a.id}
                  className="flex justify-between items-start text-sm border-b border-border pb-3 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium text-foreground">{a.name}</p>
                    <p className="text-muted-foreground">{a.phone}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(a.createdAt).toLocaleDateString("tr-TR")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-semibold text-foreground mb-4">Son Blog Yazıları</h3>
          {recentBlogs.length === 0 ? (
            <p className="text-sm text-muted-foreground">Henüz blog yazısı yok</p>
          ) : (
            <ul className="space-y-3">
              {recentBlogs.map((b) => (
                <li
                  key={b.id}
                  className="flex justify-between items-center text-sm border-b border-border pb-3 last:border-0 last:pb-0"
                >
                  <p className="font-medium text-foreground truncate max-w-[200px]">{b.title}</p>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      b.published ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {b.published ? "Yayında" : "Taslak"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
