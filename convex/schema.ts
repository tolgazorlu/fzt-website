import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  appointments: defineTable({
    name: v.string(),
    phone: v.string(),
    email: v.string(),
    message: v.string(),
    createdAt: v.string(),
  }).index("by_created", ["createdAt"]),

  blogs: defineTable({
    slug: v.string(),
    title: v.string(),
    excerpt: v.string(),
    content: v.string(),
    coverImage: v.optional(v.string()),
    published: v.boolean(),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_slug", ["slug"])
    .index("by_published", ["published", "createdAt"]),

  authLock: defineTable({
    failedAttempts: v.number(),
    lastAttemptAt: v.string(),
    lockedUntil: v.union(v.string(), v.null()),
  }),
})
