import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { isAuthenticated } from "@/lib/auth"
import { homepageContentSchema } from "@/lib/homepage-content/schema"
import { getHomepageContent, saveHomepageContent } from "@/lib/homepage-content/store"

export const runtime = "nodejs"

export async function GET() {
  const auth = await isAuthenticated()
  if (!auth) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 })
  }
  const content = await getHomepageContent()
  return NextResponse.json(content)
}

export async function PUT(request: NextRequest) {
  const auth = await isAuthenticated()
  if (!auth) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 })
  }
  try {
    const body = await request.json()
    const parsed = homepageContentSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Geçersiz veri", details: parsed.error.flatten() },
        { status: 400 },
      )
    }
    await saveHomepageContent(parsed.data)
    revalidatePath("/")
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[admin/homepage PUT]", err)
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 })
  }
}
