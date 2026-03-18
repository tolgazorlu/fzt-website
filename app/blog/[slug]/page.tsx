import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { getBlogBySlug } from "@/lib/db"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar } from "lucide-react"

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const blog = getBlogBySlug(slug)
  if (!blog) notFound()

  return (
    <main className="min-h-screen">
      <Header />
      <article className="pt-28 pb-24 bg-background">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Blog&apos;a dön
          </Link>

          <header className="mb-10">
            <span className="text-sm text-muted-foreground flex items-center gap-1 mb-4">
              <Calendar className="h-4 w-4" />
              {new Date(blog.createdAt).toLocaleDateString("tr-TR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground leading-tight">
              {blog.title}
            </h1>
            {blog.excerpt && (
              <p className="text-lg text-muted-foreground mt-4">{blog.excerpt}</p>
            )}
          </header>

          {blog.coverImage && (
            <div className="aspect-video relative rounded-2xl overflow-hidden mb-10 border border-border">
              <Image
                src={blog.coverImage}
                alt={blog.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 672px"
                unoptimized
              />
            </div>
          )}

          <div
            className="prose prose-lg dark:prose-invert max-w-none
              prose-headings:font-serif prose-headings:font-bold
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-xl prose-pre:bg-muted prose-pre:border prose-pre:border-border
              prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg
              prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
            "
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>
      </article>
      <Footer />
    </main>
  )
}
