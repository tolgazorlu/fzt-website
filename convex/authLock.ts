import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

const LOCK_DURATION_MS = 60 * 60 * 1000 // 1 saat

export const get = query({
  args: {},
  handler: async (ctx) => {
    const doc = await ctx.db.query("authLock").first()
    return doc ?? { failedAttempts: 0, lastAttemptAt: "", lockedUntil: null }
  },
})

export const recordFailed = mutation({
  args: {},
  handler: async (ctx) => {
    const doc = await ctx.db.query("authLock").first()
    const data = doc ?? { failedAttempts: 0, lastAttemptAt: "", lockedUntil: null }
    const now = new Date().toISOString()
    const newAttempts = data.failedAttempts + 1
    const lockedUntil = newAttempts >= 5
      ? new Date(Date.now() + LOCK_DURATION_MS).toISOString()
      : null

    if (doc) {
      await ctx.db.patch(doc._id, {
        failedAttempts: newAttempts,
        lastAttemptAt: now,
        lockedUntil,
      })
    } else {
      await ctx.db.insert("authLock", {
        failedAttempts: newAttempts,
        lastAttemptAt: now,
        lockedUntil,
      })
    }
  },
})

export const reset = mutation({
  args: {},
  handler: async (ctx) => {
    const doc = await ctx.db.query("authLock").first()
    if (doc) {
      await ctx.db.patch(doc._id, {
        failedAttempts: 0,
        lastAttemptAt: "",
        lockedUntil: null,
      })
    } else {
      await ctx.db.insert("authLock", {
        failedAttempts: 0,
        lastAttemptAt: "",
        lockedUntil: null,
      })
    }
  },
})
