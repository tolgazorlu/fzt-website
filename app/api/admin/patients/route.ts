import { NextRequest, NextResponse } from "next/server"
import { randomInt } from "node:crypto"
import bcrypt from "bcryptjs"
import { isAuthenticated } from "@/lib/auth"
import { listPatientSummariesForAdmin, createPatient } from "@/lib/patient-exercises-store"

export const runtime = "nodejs"

const PW_CHARS = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789"

function generateInitialPassword(): string {
  let s = ""
  for (let i = 0; i < 12; i++) {
    s += PW_CHARS[randomInt(0, PW_CHARS.length)]
  }
  return s
}

export async function GET() {
  const auth = await isAuthenticated()
  if (!auth) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 })
  }
  const patients = await listPatientSummariesForAdmin()
  return NextResponse.json(patients)
}

export async function POST(request: NextRequest) {
  const auth = await isAuthenticated()
  if (!auth) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 })
  }
  try {
    const body = await request.json()
    const displayName = typeof body?.displayName === "string" ? body.displayName.trim() : ""
    let password = typeof body?.password === "string" ? body.password : ""
    if (!displayName) {
      return NextResponse.json({ error: "Hasta adı gerekli" }, { status: 400 })
    }
    let generated = false
    if (!password) {
      password = generateInitialPassword()
      generated = true
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Şifre en az 6 karakter olmalı" }, { status: 400 })
    }
    const passwordHash = await bcrypt.hash(password, 10)
    const { patient, code } = await createPatient(displayName, passwordHash)
    return NextResponse.json({
      id: patient.id,
      code,
      displayName: patient.displayName,
      ...(generated ? { initialPassword: password } : { passwordSet: true }),
    })
  } catch (err) {
    console.error("[admin/patients POST]", err)
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 })
  }
}
