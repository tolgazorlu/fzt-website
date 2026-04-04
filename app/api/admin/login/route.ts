import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
import { verifyPassword, createSession } from "@/lib/auth"
import {
  checkLoginLock,
  recordFailedAttempt,
  resetFailedAttempts,
  getFailedAttempts,
} from "@/lib/auth-lock"

export async function POST(request: NextRequest) {
  try {
    const lock = await checkLoginLock()
    if (lock.locked && lock.remainingMs) {
      const minutes = Math.ceil(lock.remainingMs / 60000)
      return NextResponse.json(
        {
          error: "Çok fazla başarısız deneme. Lütfen " + minutes + " dakika sonra tekrar deneyin.",
          locked: true,
          remainingMinutes: minutes,
        },
        { status: 429 }
      )
    }

    const body = await request.json()
    const password = typeof body?.password === "string" ? body.password : ""
    if (!password) {
      return NextResponse.json({ error: "Şifre gerekli" }, { status: 400 })
    }

    const valid = await verifyPassword(password)
    if (!valid) {
      await recordFailedAttempt()
      const newLock = await checkLoginLock()
      const attemptsLeft = newLock.locked ? 0 : 5 - (await getFailedAttempts())
      return NextResponse.json(
        {
          error: attemptsLeft > 0
            ? `Geçersiz şifre. Kalan deneme: ${attemptsLeft}`
            : "Çok fazla başarısız deneme. 1 saat sonra tekrar deneyin.",
          locked: newLock.locked,
          remainingMinutes: newLock.locked && newLock.remainingMs
            ? Math.ceil(newLock.remainingMs / 60000)
            : undefined,
        },
        { status: 401 }
      )
    }

    try {
      await resetFailedAttempts()
    } catch {
      // Rate limit sıfırlama başarısız olsa da girişe izin ver
    }
    await createSession()
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[admin/login]", err)
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 })
  }
}
