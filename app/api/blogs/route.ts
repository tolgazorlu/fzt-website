import { NextRequest, NextResponse } from "next/server"
import { getBlogs, createBlog, generateSlug } from "@/lib/db"
import { isAuthenticated } from "@/lib/auth"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const publishedOnly = searchParams.get("published") === "true"
  const blogs = getBlogs(publishedOnly)
  return NextResponse.json(blogs)
}

export async function POST(request: NextRequest) {
  const auth = await isAuthenticated()
  if (!auth) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 })
  }
  try {
    const body = await request.json()
    const { title, excerpt, content, coverImage, published } = body
    if (!title || !content) {
      return NextResponse.json(
        { error: "Başlık ve içerik zorunludur" },
        { status: 400 }
      )
    }
    const slug = body.slug?.trim() || generateSlug(title)
    const blog = createBlog({
      title: String(title).trim(),
      excerpt: String(excerpt || "").trim(),
      content: String(content),
      coverImage: coverImage || undefined,
      published: Boolean(published),
      slug,
    })
    return NextResponse.json(blog)
  } catch {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 })
  }
}
