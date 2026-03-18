import { NextRequest, NextResponse } from "next/server"
import { getBlogById, updateBlog, deleteBlog, generateSlug } from "@/lib/db"
import { isAuthenticated } from "@/lib/auth"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const blog = getBlogById(id)
  if (!blog) {
    return NextResponse.json({ error: "Blog bulunamadı" }, { status: 404 })
  }
  return NextResponse.json(blog)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await isAuthenticated()
  if (!auth) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 })
  }
  const { id } = await params
  const existing = getBlogById(id)
  if (!existing) {
    return NextResponse.json({ error: "Blog bulunamadı" }, { status: 404 })
  }
  try {
    const body = await request.json()
    const updates: Record<string, unknown> = {}
    if (body.title !== undefined) updates.title = String(body.title).trim()
    if (body.excerpt !== undefined) updates.excerpt = String(body.excerpt).trim()
    if (body.content !== undefined) updates.content = String(body.content)
    if (body.coverImage !== undefined) updates.coverImage = body.coverImage || undefined
    if (body.published !== undefined) updates.published = Boolean(body.published)
    if (body.slug !== undefined) updates.slug = String(body.slug).trim() || generateSlug(updates.title as string || existing.title)
    const blog = updateBlog(id, updates)
    return NextResponse.json(blog)
  } catch {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await isAuthenticated()
  if (!auth) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 })
  }
  const { id } = await params
  deleteBlog(id)
  return NextResponse.json({ success: true })
}
