import { NextRequest, NextResponse } from "next/server"
import { getBlogBySlug } from "@/lib/db"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const blog = await getBlogBySlug(slug)
  if (!blog) {
    return NextResponse.json({ error: "Blog bulunamadı" }, { status: 404 })
  }
  return NextResponse.json(blog)
}
