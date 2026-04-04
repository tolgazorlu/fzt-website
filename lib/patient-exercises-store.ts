import { promises as fs } from "fs"
import path from "path"
import { randomInt, randomUUID } from "node:crypto"

const DATA_DIR = path.join(process.cwd(), "data")
const FILE = path.join(DATA_DIR, "patient-programs.json")

export interface PatientExercise {
  id: string
  title: string
  note: string
  done: boolean
  createdAt: string
  updatedAt: string
  addedBy: "therapist" | "patient"
}

export interface PatientRecord {
  id: string
  code: string
  displayName: string
  passwordHash: string
  createdAt: string
  exercises: PatientExercise[]
}

interface StoreFile {
  patients: PatientRecord[]
}

let writeChain: Promise<void> = Promise.resolve()

function serializeWrites<T>(fn: () => Promise<T>): Promise<T> {
  let result: T
  const next = writeChain.then(async () => {
    result = await fn()
  })
  writeChain = next.then(() => undefined, () => undefined)
  return next.then(() => result!)
}

async function ensureFile(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true })
  try {
    await fs.access(FILE)
  } catch {
    const empty: StoreFile = { patients: [] }
    await fs.writeFile(FILE, `${JSON.stringify(empty, null, 2)}\n`, "utf-8")
  }
}

function parseStore(raw: string): StoreFile {
  try {
    const data = JSON.parse(raw) as unknown
    if (data === null || typeof data !== "object" || !("patients" in data)) {
      return { patients: [] }
    }
    const p = (data as StoreFile).patients
    if (!Array.isArray(p)) return { patients: [] }
    return { patients: p.filter(isPatientRecord) }
  } catch {
    return { patients: [] }
  }
}

function isPatientRecord(row: unknown): row is PatientRecord {
  if (row === null || typeof row !== "object") return false
  const o = row as Record<string, unknown>
  if (
    typeof o.id !== "string" ||
    typeof o.code !== "string" ||
    typeof o.displayName !== "string" ||
    typeof o.passwordHash !== "string" ||
    typeof o.createdAt !== "string" ||
    !Array.isArray(o.exercises)
  ) {
    return false
  }
  return o.exercises.every(isExercise)
}

function isExercise(row: unknown): row is PatientExercise {
  if (row === null || typeof row !== "object") return false
  const o = row as Record<string, unknown>
  return (
    typeof o.id === "string" &&
    typeof o.title === "string" &&
    typeof o.note === "string" &&
    typeof o.done === "boolean" &&
    typeof o.createdAt === "string" &&
    typeof o.updatedAt === "string" &&
    (o.addedBy === "therapist" || o.addedBy === "patient")
  )
}

async function readStore(): Promise<StoreFile> {
  await ensureFile()
  const raw = await fs.readFile(FILE, "utf-8")
  return parseStore(raw)
}

async function writeStore(store: StoreFile): Promise<void> {
  await fs.writeFile(FILE, `${JSON.stringify(store, null, 2)}\n`, "utf-8")
}

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"

export function generatePatientCode(): string {
  let code = ""
  for (let i = 0; i < 8; i++) {
    code += CODE_CHARS[randomInt(0, CODE_CHARS.length)]
  }
  return code
}

function normalizeCode(code: string): string {
  return code.trim().toUpperCase()
}

export async function listPatientSummariesForAdmin(): Promise<
  {
    id: string
    code: string
    displayName: string
    exerciseCount: number
    createdAt: string
  }[]
> {
  const { patients } = await readStore()
  return [...patients]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map((p) => ({
      id: p.id,
      code: p.code,
      displayName: p.displayName,
      exerciseCount: p.exercises.length,
      createdAt: p.createdAt,
    }))
}

export async function getPatientByCode(code: string): Promise<PatientRecord | undefined> {
  const c = normalizeCode(code)
  const { patients } = await readStore()
  return patients.find((p) => p.code === c)
}

export async function getPatientById(id: string): Promise<PatientRecord | undefined> {
  const { patients } = await readStore()
  return patients.find((p) => p.id === id)
}

export async function createPatient(
  displayName: string,
  passwordHash: string,
): Promise<{ patient: PatientRecord; code: string }> {
  return serializeWrites(async () => {
    const store = await readStore()
    let code = generatePatientCode()
    while (store.patients.some((p) => p.code === code)) {
      code = generatePatientCode()
    }
    const patient: PatientRecord = {
      id: randomUUID(),
      code,
      displayName: displayName.trim() || "Hasta",
      passwordHash,
      createdAt: new Date().toISOString(),
      exercises: [],
    }
    store.patients.push(patient)
    await writeStore(store)
    return { patient, code }
  })
}

export async function addExerciseForPatient(
  patientId: string,
  input: { title: string; note?: string; addedBy: "therapist" | "patient" },
): Promise<PatientExercise | undefined> {
  return serializeWrites(async () => {
    const store = await readStore()
    const patient = store.patients.find((p) => p.id === patientId)
    if (!patient) return undefined
    const now = new Date().toISOString()
    const exercise: PatientExercise = {
      id: randomUUID(),
      title: input.title.trim(),
      note: (input.note ?? "").trim(),
      done: false,
      createdAt: now,
      updatedAt: now,
      addedBy: input.addedBy,
    }
    if (!exercise.title) return undefined
    patient.exercises.unshift(exercise)
    await writeStore(store)
    return exercise
  })
}

export async function setExerciseDone(
  patientId: string,
  exerciseId: string,
  done: boolean,
): Promise<PatientExercise | undefined> {
  return serializeWrites(async () => {
    const store = await readStore()
    const patient = store.patients.find((p) => p.id === patientId)
    if (!patient) return undefined
    const ex = patient.exercises.find((e) => e.id === exerciseId)
    if (!ex) return undefined
    ex.done = done
    ex.updatedAt = new Date().toISOString()
    await writeStore(store)
    return ex
  })
}

export async function deleteExerciseForPatient(
  patientId: string,
  exerciseId: string,
): Promise<boolean> {
  return serializeWrites(async () => {
    const store = await readStore()
    const patient = store.patients.find((p) => p.id === patientId)
    if (!patient) return false
    const before = patient.exercises.length
    patient.exercises = patient.exercises.filter((e) => e.id !== exerciseId)
    if (patient.exercises.length === before) return false
    await writeStore(store)
    return true
  })
}
