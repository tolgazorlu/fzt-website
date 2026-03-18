"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Loader2 } from "lucide-react"
import { BlogEditor } from "@/components/admin/blog-editor"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function EditBlogPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [title, setTitle] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [coverImage, setCoverImage] = useState("")
  const [published, setPublished] = useState(false)
  const [slug, setSlug] = useState("")
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch(`/api/blogs/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError("Blog bulunamadı")
          return
        }
        setTitle(data.title)
        setExcerpt(data.excerpt || "")
        setContent(data.content || "")
        setCoverImage(data.coverImage || "")
        setPublished(data.published)
        setSlug(data.slug || "")
      })
      .catch(() => setError("Yükleme hatası"))
      .finally(() => setFetching(false))
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          excerpt,
          content,
          coverImage: coverImage || undefined,
          published,
          slug: slug || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Güncelleme başarısız")
        return
      }
      router.push("/admin/dashboard/blogs")
      router.refresh()
    } catch {
      setError("Bağlantı hatası")
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl">
      <Link
        href="/admin/dashboard/blogs"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Blog listesine dön
      </Link>
      <h1 className="font-serif text-3xl font-bold text-foreground mb-6">Blog Yazısını Düzenle</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="title">Başlık *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Yazı başlığı"
            required
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="slug">URL Slug (opsiyonel)</Label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="url-friendly-slug"
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="excerpt">Özet (opsiyonel)</Label>
          <textarea
            id="excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Kısa özet"
            rows={2}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1.5 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <div>
          <Label htmlFor="coverImage">Kapak Görseli URL (opsiyonel)</Label>
          <Input
            id="coverImage"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="https://..."
            type="url"
            className="mt-1.5"
          />
        </div>
        <div>
          <Label>İçerik *</Label>
          <div className="mt-1.5">
            <BlogEditor value={content} onChange={setContent} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Switch id="published" checked={published} onCheckedChange={setPublished} />
          <Label htmlFor="published">Yayınla</Label>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="flex gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Güncelleniyor...
              </span>
            ) : (
              "Güncelle"
            )}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/dashboard/blogs">İptal</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
