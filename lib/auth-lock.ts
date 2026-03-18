import { fetchQuery, fetchMutation } from "convex/nextjs"
import { api } from "@/convex/_generated/api"

function hasConvex(): boolean {
  return !!process.env.NEXT_PUBLIC_CONVEX_URL
}

export async function checkLoginLock(): Promise<{
  locked: boolean
  lockedUntil?: Date
  remainingMs?: number
}> {
  if (!hasConvex()) return { locked: false }
  const data = await fetchQuery(api.authLock.get)
  const now = Date.now()

  if (data?.lockedUntil) {
    const lockedUntil = new Date(data.lockedUntil).getTime()
    if (now < lockedUntil) {
      return {
        locked: true,
        lockedUntil: new Date(lockedUntil),
        remainingMs: lockedUntil - now,
      }
    }
    await fetchMutation(api.authLock.reset)
    return { locked: false }
  }

  return { locked: false }
}

export async function recordFailedAttempt(): Promise<void> {
  if (!hasConvex()) return
  await fetchMutation(api.authLock.recordFailed)
}

export async function resetFailedAttempts(): Promise<void> {
  if (!hasConvex()) return
  await fetchMutation(api.authLock.reset)
}

export async function getFailedAttempts(): Promise<number> {
  if (!hasConvex()) return 0
  const data = await fetchQuery(api.authLock.get)
  return data?.failedAttempts ?? 0
}
