import { NextRequest, NextResponse } from "next/server"
import { isAuthenticated } from "@/lib/auth"
import {
  getPatientByCode,
  addExerciseForPatient,
  setExerciseDone,
  deleteExerciseForPatient,
} from "@/lib/patient-exercises-store"

export const runtime = "nodejs"

function normalizeRouteParam(code: string): string {
  return decodeURIComponent(code).trim().toUpperCase()
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ code: string }> },
) {
  const auth = await isAuthenticated()
  if (!auth) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 })
  }
  const { code: raw } = await context.params
  const patient = await getPatientByCode(normalizeRouteParam(raw))
  if (!patient) {
    return NextResponse.json({ error: "Hasta bulunamadı" }, { status: 404 })
  }
  return NextResponse.json({
    id: patient.id,
    code: patient.code,
    displayName: patient.displayName,
    exercises: patient.exercises,
  })
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ code: string }> },
) {
  const auth = await isAuthenticated()
  if (!auth) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 })
  }
  const { code: raw } = await context.params
  const patient = await getPatientByCode(normalizeRouteParam(raw))
  if (!patient) {
    return NextResponse.json({ error: "Hasta bulunamadı" }, { status: 404 })
  }
  try {
    const body = await request.json()
    const title = typeof body?.title === "string" ? body.title : ""
    const note = typeof body?.note === "string" ? body.note : ""
    const exercise = await addExerciseForPatient(patient.id, {
      title,
      note,
      addedBy: "therapist",
    })
    if (!exercise) {
      return NextResponse.json({ error: "Geçersiz egzersiz" }, { status: 400 })
    }
    return NextResponse.json({ success: true, exercise })
  } catch (err) {
    console.error("[admin/patients/.../exercises POST]", err)
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ code: string }> },
) {
  const auth = await isAuthenticated()
  if (!auth) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 })
  }
  const { code: raw } = await context.params
  const patient = await getPatientByCode(normalizeRouteParam(raw))
  if (!patient) {
    return NextResponse.json({ error: "Hasta bulunamadı" }, { status: 404 })
  }
  try {
    const body = await request.json()
    const exerciseId = typeof body?.exerciseId === "string" ? body.exerciseId : ""
    const done = typeof body?.done === "boolean" ? body.done : undefined
    if (!exerciseId || done === undefined) {
      return NextResponse.json({ error: "Eksik alan" }, { status: 400 })
    }
    const exercise = await setExerciseDone(patient.id, exerciseId, done)
    if (!exercise) {
      return NextResponse.json({ error: "Bulunamadı" }, { status: 404 })
    }
    return NextResponse.json({ success: true, exercise })
  } catch (err) {
    console.error("[admin/patients/.../exercises PATCH]", err)
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ code: string }> },
) {
  const auth = await isAuthenticated()
  if (!auth) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 })
  }
  const { code: raw } = await context.params
  const patient = await getPatientByCode(normalizeRouteParam(raw))
  if (!patient) {
    return NextResponse.json({ error: "Hasta bulunamadı" }, { status: 404 })
  }
  const id = request.nextUrl.searchParams.get("id")
  if (!id) {
    return NextResponse.json({ error: "id gerekli" }, { status: 400 })
  }
  const removed = await deleteExerciseForPatient(patient.id, id)
  if (!removed) {
    return NextResponse.json({ error: "Bulunamadı" }, { status: 404 })
  }
  return NextResponse.json({ success: true })
}
