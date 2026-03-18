import Link from "next/link"
import Image from "next/image"
import { getBlogs } from "@/lib/db"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar, FileText } from "lucide-react"

export default async function BlogPage() {
  const blogs = await getBlogs(true)

  return (
    <main className="min-h-screen">
      <Header />
      <section className="pt-28 pb-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20">
              <FileText className="h-4 w-4" />
              Blog
            </div>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 tracking-tight">
              Fizyoterapi ve Sağlık
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Sağlık, egzersiz ve fizyoterapi hakkında güncel yazılar
            </p>
          </div>

          {blogs.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-2xl border border-border">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="font-semibold text-foreground text-xl mb-2">Henüz yazı yok</h2>
              <p className="text-muted-foreground">Yakında yeni içerikler eklenecek.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <Link key={blog.id} href={`/blog/${blog.slug}`}>
                  <Card className="h-full overflow-hidden border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group">
                    <div className="aspect-video relative bg-muted overflow-hidden">
                      {blog.coverImage ? (
                        <Image
                          src={blog.coverImage}
                          alt={blog.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          unoptimized
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <FileText className="h-16 w-16 text-muted-foreground/50" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <CardContent className="p-6">
                      <span className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(blog.createdAt).toLocaleDateString("tr-TR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                      <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {blog.title}
                      </h3>
                      {blog.excerpt && (
                        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                          {blog.excerpt}
                        </p>
                      )}
                      <span className="inline-flex items-center gap-1 text-primary text-sm font-medium group-hover:gap-2 transition-all">
                        Devamını Oku
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  )
}
