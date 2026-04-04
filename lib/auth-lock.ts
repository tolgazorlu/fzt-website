import { promises as fs } from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")
const FILE = path.join(DATA_DIR, "admin-auth-lock.json")

const LOCK_DURATION_MS = 60 * 60 * 1000 // 1 saat
const MAX_FAILED = 5

let writeChain: Promise<void> = Promise.resolve()

function serializeWrites<T>(fn: () => Promise<T>): Promise<T> {
  let result!: T
  const next = writeChain.then(async () => {
    result = await fn()
  })
  writeChain = next.then(() => undefined, () => undefined)
  return next.then(() => result)
}

interface LockState {
  failedAttempts: number
  lockedUntil: string | null
}

const emptyState = (): LockState => ({
  failedAttempts: 0,
  lockedUntil: null,
})

async function readState(): Promise<LockState> {
  await fs.mkdir(DATA_DIR, { recursive: true })
  try {
    const raw = await fs.readFile(FILE, "utf-8")
    const data = JSON.parse(raw) as unknown
    if (data === null || typeof data !== "object") return emptyState()
    const o = data as Record<string, unknown>
    const failed =
      typeof o.failedAttempts === "number" ? o.failedAttempts : 0
    const locked =
      o.lockedUntil === null || typeof o.lockedUntil === "string"
        ? o.lockedUntil
        : null
    return { failedAttempts: failed, lockedUntil: locked }
  } catch {
    return emptyState()
  }
}

async function writeState(state: LockState): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true })
  await fs.writeFile(FILE, `${JSON.stringify(state, null, 2)}\n`, "utf-8")
}

export async function checkLoginLock(): Promise<{
  locked: boolean
  lockedUntil?: Date
  remainingMs?: number
}> {
  let data = await readState()
  const now = Date.now()

  if (data.lockedUntil) {
    const lockedUntil = new Date(data.lockedUntil).getTime()
    if (now < lockedUntil) {
      return {
        locked: true,
        lockedUntil: new Date(lockedUntil),
        remainingMs: lockedUntil - now,
      }
    }
    await serializeWrites(async () => {
      const latest = await readState()
      if (!latest.lockedUntil) return
      const until = new Date(latest.lockedUntil).getTime()
      if (Date.now() < until) return
      await writeState(emptyState())
    })
  }

  return { locked: false }
}

export async function recordFailedAttempt(): Promise<void> {
  await serializeWrites(async () => {
    const data = await readState()
    const newAttempts = data.failedAttempts + 1
    const lockedUntil =
      newAttempts >= MAX_FAILED
        ? new Date(Date.now() + LOCK_DURATION_MS).toISOString()
        : null
    await writeState({
      failedAttempts: newAttempts,
      lockedUntil,
    })
  })
}

export async function resetFailedAttempts(): Promise<void> {
  await serializeWrites(async () => {
    await writeState(emptyState())
  })
}

export async function getFailedAttempts(): Promise<number> {
  const data = await readState()
  return data.failedAttempts
}
