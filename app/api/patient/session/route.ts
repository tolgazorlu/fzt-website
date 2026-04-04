import { NextResponse } from "next/server"
import { getPatientSession } from "@/lib/patient-auth"
import { getPatientById } from "@/lib/patient-exercises-store"

export const runtime = "nodejs"

export async function GET() {
  const session = await getPatientSession()
  if (!session) {
    return NextResponse.json({ authenticated: false })
  }
  const patient = await getPatientById(session.patientId)
  if (!patient) {
    return NextResponse.json({ authenticated: false })
  }
  return NextResponse.json({
    authenticated: true,
    displayName: patient.displayName,
    code: patient.code,
  })
}
