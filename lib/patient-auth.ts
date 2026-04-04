import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

const PATIENT_JWT_SECRET = new TextEncoder().encode(
  process.env.PATIENT_JWT_SECRET ||
    `${process.env.JWT_SECRET || "fzt-website-secret-change-in-production"}:patient`,
)
const COOKIE_NAME = "patient_session"
const SESSION_DURATION = 60 * 60 * 24 * 14 // 14 days

export async function createPatientSession(patientId: string) {
  const token = await new SignJWT({ patientId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(PATIENT_JWT_SECRET)

  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION,
    path: "/",
  })
}

export async function destroyPatientSession() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

export async function getPatientSession(): Promise<{ patientId: string } | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, PATIENT_JWT_SECRET)
    const patientId = payload.patientId
    if (typeof patientId !== "string" || !patientId) return null
    return { patientId }
  } catch {
    return null
  }
}
