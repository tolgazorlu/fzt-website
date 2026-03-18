import Link from "next/link"
import { getBlogs } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Pencil, FileText, Eye, EyeOff } from "lucide-react"

export default async function AdminBlogsPage() {
  const blogs = await getBlogs(false)

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Blog Yazıları</h1>
          <p className="text-muted-foreground mt-1">Blog yazılarınızı yönetin</p>
        </div>
        <Button asChild>
          <Link href="/admin/dashboard/blogs/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Yeni Yazı
          </Link>
        </Button>
      </div>
      {blogs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">Henüz blog yazısı yok</p>
            <Button asChild>
              <Link href="/admin/dashboard/blogs/new" className="flex items-center gap-2 mx-auto">
                <Plus className="h-4 w-4" />
                İlk Yazıyı Oluştur
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-4 font-semibold text-foreground">Başlık</th>
                <th className="text-left py-4 px-4 font-semibold text-foreground">Durum</th>
                <th className="text-left py-4 px-4 font-semibold text-foreground">Tarih</th>
                <th className="text-right py-4 px-4 font-semibold text-foreground">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((b) => (
                <tr key={b.id} className="border-b border-border hover:bg-muted/50">
                  <td className="py-4 px-4">
                    <p className="font-medium text-foreground">{b.title}</p>
                    {b.excerpt && (
                      <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">{b.excerpt}</p>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        b.published ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {b.published ? (
                        <>
                          <Eye className="h-3.5 w-3.5" />
                          Yayında
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3.5 w-3.5" />
                          Taslak
                        </>
                      )}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-muted-foreground">
                    {new Date(b.updatedAt).toLocaleDateString("tr-TR")}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {b.published && (
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/blog/${b.slug}`} target="_blank">
                            Görüntüle
                          </Link>
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/dashboard/blogs/${b.id}/edit`} className="flex items-center gap-1">
                          <Pencil className="h-4 w-4" />
                          Düzenle
                        </Link>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  )
}

function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <table className="w-full">{children}</table>
    </div>
  )
}
