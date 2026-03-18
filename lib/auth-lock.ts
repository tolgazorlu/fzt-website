import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs"
import { join } from "path"

// Vercel'de dosya sistemi salt okunur; /tmp yazılabilir
const DATA_DIR = process.env.VERCEL
  ? join("/tmp", "fzt-website-data")
  : join(process.cwd(), "data")
const LOCK_FILE = join(DATA_DIR, "auth-lock.json")

const MAX_ATTEMPTS = 5
const LOCK_DURATION_MS = 60 * 60 * 1000 // 1 saat

interface LockData {
  failedAttempts: number
  lastAttemptAt: string
  lockedUntil: string | null
}

function ensureDataDir() {
  try {
    if (!existsSync(DATA_DIR)) {
      mkdirSync(DATA_DIR, { recursive: true })
    }
  } catch {
    // Vercel'de mkdir başarısız olabilir
  }
}

function readLock(): LockData {
  try {
    if (existsSync(LOCK_FILE)) {
      const data = JSON.parse(readFileSync(LOCK_FILE, "utf-8")) as LockData
      return data
    }
  } catch {
    // fall through
  }
  return {
    failedAttempts: 0,
    lastAttemptAt: "",
    lockedUntil: null,
  }
}

function writeLock(data: LockData) {
  try {
    ensureDataDir()
    writeFileSync(LOCK_FILE, JSON.stringify(data, null, 2), "utf-8")
  } catch {
    // Vercel /tmp yazılamazsa sessizce geç (rate limit devre dışı kalır)
  }
}

export function checkLoginLock(): { locked: boolean; lockedUntil?: Date; remainingMs?: number } {
  const data = readLock()
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
    // Süre doldu, sıfırla
    writeLock({
      failedAttempts: 0,
      lastAttemptAt: "",
      lockedUntil: null,
    })
    return { locked: false }
  }

  return { locked: false }
}

export function recordFailedAttempt(): void {
  const data = readLock()
  const now = new Date().toISOString()
  const newAttempts = data.failedAttempts + 1

  if (newAttempts >= MAX_ATTEMPTS) {
    const lockedUntil = new Date(Date.now() + LOCK_DURATION_MS).toISOString()
    writeLock({
      failedAttempts: newAttempts,
      lastAttemptAt: now,
      lockedUntil,
    })
  } else {
    writeLock({
      failedAttempts: newAttempts,
      lastAttemptAt: now,
      lockedUntil: null,
    })
  }
}

export function resetFailedAttempts(): void {
  writeLock({
    failedAttempts: 0,
    lastAttemptAt: "",
    lockedUntil: null,
  })
}

export function getFailedAttempts(): number {
  return readLock().failedAttempts
}
