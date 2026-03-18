import { NextResponse } from "next/server"
import { checkLoginLock } from "@/lib/auth-lock"

export async function GET() {
  const lock = await checkLoginLock()
  if (lock.locked && lock.remainingMs !== undefined) {
    return NextResponse.json({
      locked: true,
      remainingMinutes: Math.ceil(lock.remainingMs / 60000),
    })
  }
  return NextResponse.json({ locked: false })
}
