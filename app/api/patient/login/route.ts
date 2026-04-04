import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { getPatientByCode } from "@/lib/patient-exercises-store"
import { createPatientSession } from "@/lib/patient-auth"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const code = typeof body?.code === "string" ? body.code.trim() : ""
    const password = typeof body?.password === "string" ? body.password : ""
    if (!code || !password) {
      return NextResponse.json({ error: "Hasta kodu ve şifre gerekli" }, { status: 400 })
    }
    const patient = await getPatientByCode(code)
    if (!patient) {
      return NextResponse.json({ error: "Kod veya şifre hatalı" }, { status: 401 })
    }
    let ok = false
    try {
      ok = await bcrypt.compare(password, patient.passwordHash)
    } catch (err) {
      console.error("[patient/login] bcrypt", err)
      return NextResponse.json({ error: "Kod veya şifre hatalı" }, { status: 401 })
    }
    if (!ok) {
      return NextResponse.json({ error: "Kod veya şifre hatalı" }, { status: 401 })
    }
    await createPatientSession(patient.id)
    return NextResponse.json({
      success: true,
      displayName: patient.displayName,
      code: patient.code,
    })
  } catch (err) {
    console.error("[patient/login]", err)
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 })
  }
}
