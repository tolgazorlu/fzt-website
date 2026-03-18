import { NextRequest, NextResponse } from "next/server"
import { verifyPassword, createSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password } = body
    if (!password) {
      return NextResponse.json({ error: "Şifre gerekli" }, { status: 400 })
    }
    const valid = await verifyPassword(String(password))
    if (!valid) {
      return NextResponse.json({ error: "Geçersiz şifre" }, { status: 401 })
    }
    await createSession()
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 })
  }
}
