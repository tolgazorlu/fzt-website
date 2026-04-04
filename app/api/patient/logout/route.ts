import { NextResponse } from "next/server"
import { destroyPatientSession } from "@/lib/patient-auth"

export const runtime = "nodejs"

export async function POST() {
  await destroyPatientSession()
  return NextResponse.json({ success: true })
}
