import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

export const list = query({
  args: {},
  handler: async (ctx) => {
    const appointments = await ctx.db
      .query("appointments")
      .order("desc")
      .collect()
    return appointments.map((a) => ({
      id: a._id,
      name: a.name,
      phone: a.phone,
      email: a.email,
      message: a.message,
      createdAt: a.createdAt,
    }))
  },
})

export const add = mutation({
  args: {
    name: v.string(),
    phone: v.string(),
    email: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString()
    const id = await ctx.db.insert("appointments", {
      name: args.name,
      phone: args.phone,
      email: args.email,
      message: args.message,
      createdAt: now,
    })
    return {
      id: id.toString(),
      name: args.name,
      phone: args.phone,
      email: args.email,
      message: args.message,
      createdAt: now,
    }
  },
})
