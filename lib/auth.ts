import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import bcrypt from "bcryptjs"

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fzt-website-secret-change-in-production"
)
const COOKIE_NAME = "admin_session"
const SESSION_DURATION = 60 * 60 * 24 // 24 hours

// Varsayılan: Fzt#Admin2025!Guvenli (üretimde ADMIN_PASSWORD_HASH ile değiştirin)
const DEFAULT_PASSWORD_HASH = "$2b$12$JBUSEpSJ1z3gMjfGxBdyeuQteiMxQTmcPRnODhyJ8BCF/XgNEULbG"

export async function verifyPassword(password: string): Promise<boolean> {
  const hash = process.env.ADMIN_PASSWORD_HASH || DEFAULT_PASSWORD_HASH
  return bcrypt.compare(password, hash)
}

export async function createSession() {
  const token = await new SignJWT({ admin: true })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(JWT_SECRET)

  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION,
    path: "/",
  })
}

export async function destroySession() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return false
  try {
    await jwtVerify(token, JWT_SECRET)
    return true
  } catch {
    return false
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}
