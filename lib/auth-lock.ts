import { promises as fs } from "fs"
import path from "path"
import { tmpdir } from "os"

const LOCK_FILENAME = "admin-auth-lock.json"

/** Serverless ortamlarda proje klasörü genelde salt okunur; kilit dosyası /tmp altında tutulur */
function lockPaths(): { dir: string; file: string } {
  const ephemeral = Boolean(
    process.env.VERCEL ||
      process.env.AWS_LAMBDA_FUNCTION_NAME ||
      process.env.NETLIFY ||
      process.env.CF_PAGES,
  )
  const dir = ephemeral
    ? path.join(tmpdir(), "fzt-website")
    : path.join(process.cwd(), "data")
  return { dir, file: path.join(dir, LOCK_FILENAME) }
}

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
  const { dir, file } = lockPaths()
  await fs.mkdir(dir, { recursive: true })
  try {
    const raw = await fs.readFile(file, "utf-8")
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
  const { dir, file } = lockPaths()
  await fs.mkdir(dir, { recursive: true })
  await fs.writeFile(file, `${JSON.stringify(state, null, 2)}\n`, "utf-8")
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
