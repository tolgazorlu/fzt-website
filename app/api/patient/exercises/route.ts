import { NextRequest, NextResponse } from "next/server"
import { getPatientSession } from "@/lib/patient-auth"
import {
  getPatientById,
  addExerciseForPatient,
  setExerciseDone,
  deleteExerciseForPatient,
} from "@/lib/patient-exercises-store"

export const runtime = "nodejs"

export async function GET() {
  const session = await getPatientSession()
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 })
  }
  const patient = await getPatientById(session.patientId)
  if (!patient) {
    return NextResponse.json({ error: "Hasta bulunamadı" }, { status: 404 })
  }
  return NextResponse.json({
    exercises: patient.exercises,
    displayName: patient.displayName,
    code: patient.code,
  })
}

export async function POST(request: NextRequest) {
  const session = await getPatientSession()
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 })
  }
  try {
    const body = await request.json()
    const title = typeof body?.title === "string" ? body.title : ""
    const note = typeof body?.note === "string" ? body.note : ""
    const exercise = await addExerciseForPatient(session.patientId, {
      title,
      note,
      addedBy: "patient",
    })
    if (!exercise) {
      return NextResponse.json({ error: "Geçersiz egzersiz" }, { status: 400 })
    }
    return NextResponse.json({ success: true, exercise })
  } catch (err) {
    console.error("[patient/exercises POST]", err)
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  const session = await getPatientSession()
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 })
  }
  try {
    const body = await request.json()
    const exerciseId = typeof body?.exerciseId === "string" ? body.exerciseId : ""
    const done = typeof body?.done === "boolean" ? body.done : undefined
    if (!exerciseId || done === undefined) {
      return NextResponse.json({ error: "Eksik alan" }, { status: 400 })
    }
    const exercise = await setExerciseDone(session.patientId, exerciseId, done)
    if (!exercise) {
      return NextResponse.json({ error: "Bulunamadı" }, { status: 404 })
    }
    return NextResponse.json({ success: true, exercise })
  } catch (err) {
    console.error("[patient/exercises PATCH]", err)
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getPatientSession()
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 })
  }
  const id = request.nextUrl.searchParams.get("id")
  if (!id) {
    return NextResponse.json({ error: "id gerekli" }, { status: 400 })
  }
  const removed = await deleteExerciseForPatient(session.patientId, id)
  if (!removed) {
    return NextResponse.json({ error: "Bulunamadı" }, { status: 404 })
  }
  return NextResponse.json({ success: true })
}
