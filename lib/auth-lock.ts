import { storageGet, storageSet, REDIS_KEYS } from "./storage"

const MAX_ATTEMPTS = 5
const LOCK_DURATION_MS = 60 * 60 * 1000 // 1 saat

interface LockData {
  failedAttempts: number
  lastAttemptAt: string
  lockedUntil: string | null
}

async function readLock(): Promise<LockData> {
  const data = await storageGet<LockData>(REDIS_KEYS.authLock, {
    failedAttempts: 0,
    lastAttemptAt: "",
    lockedUntil: null,
  })
  return data
}

async function writeLock(data: LockData): Promise<void> {
  await storageSet(REDIS_KEYS.authLock, data)
}

export async function checkLoginLock(): Promise<{
  locked: boolean
  lockedUntil?: Date
  remainingMs?: number
}> {
  const data = await readLock()
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
    await writeLock({
      failedAttempts: 0,
      lastAttemptAt: "",
      lockedUntil: null,
    })
    return { locked: false }
  }

  return { locked: false }
}

export async function recordFailedAttempt(): Promise<void> {
  const data = await readLock()
  const now = new Date().toISOString()
  const newAttempts = data.failedAttempts + 1

  if (newAttempts >= MAX_ATTEMPTS) {
    await writeLock({
      failedAttempts: newAttempts,
      lastAttemptAt: now,
      lockedUntil: new Date(Date.now() + LOCK_DURATION_MS).toISOString(),
    })
  } else {
    await writeLock({
      failedAttempts: newAttempts,
      lastAttemptAt: now,
      lockedUntil: null,
    })
  }
}

export async function resetFailedAttempts(): Promise<void> {
  await writeLock({
    failedAttempts: 0,
    lastAttemptAt: "",
    lockedUntil: null,
  })
}

export async function getFailedAttempts(): Promise<number> {
  const data = await readLock()
  return data.failedAttempts
}
