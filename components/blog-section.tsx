"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useInView } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar, FileText } from "lucide-react"

interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  coverImage?: string
  createdAt: string
}

export function BlogSection() {
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  useEffect(() => {
    fetch("/api/blogs?published=true")
      .then((r) => r.json())
      .then(setBlogs)
      .catch(() => {})
  }, [])

  const displayBlogs = blogs.slice(0, 3)
  const hasBlogs = displayBlogs.length > 0

  return (
    <section id="blog" className="py-24 bg-muted/30" ref={ref}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20">
            <FileText className="h-4 w-4" />
            Blog
          </div>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Son Yazılar
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Fizyoterapi, sağlık ve egzersiz hakkında güncel içerikler
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {hasBlogs ? displayBlogs.map((blog, index) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
            >
              <Link href={`/blog/${blog.slug}`}>
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
            </motion.div>
          )) : (
            <div className="col-span-full flex flex-col items-center justify-center py-16 px-6 bg-card rounded-2xl border border-border">
              <FileText className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <h3 className="font-semibold text-foreground text-xl mb-2">Yakında</h3>
              <p className="text-muted-foreground text-center max-w-md">
                Fizyoterapi ve sağlık hakkında yazılarımız çok yakında burada olacak.
              </p>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Button asChild size="lg" variant="outline" className="rounded-xl">
            <Link href="/blog" className="flex items-center gap-2">
              Tüm Yazıları Gör
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
