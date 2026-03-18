import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

export const list = query({
  args: { publishedOnly: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    let blogs = await ctx.db.query("blogs").order("desc").collect()
    if (args.publishedOnly) {
      blogs = blogs.filter((b) => b.published)
    }
    return blogs.map((b) => ({
      id: b._id.toString(),
      slug: b.slug,
      title: b.title,
      excerpt: b.excerpt,
      content: b.content,
      coverImage: b.coverImage,
      published: b.published,
      createdAt: b.createdAt,
      updatedAt: b.updatedAt,
    }))
  },
})

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const blog = await ctx.db
      .query("blogs")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first()
    if (!blog || !blog.published) return null
    return {
      id: blog._id.toString(),
      slug: blog.slug,
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      coverImage: blog.coverImage,
      published: blog.published,
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt,
    }
  },
})

export const getById = query({
  args: { id: v.id("blogs") },
  handler: async (ctx, args) => {
    const blog = await ctx.db.get("blogs", args.id)
    if (!blog) return null
    return {
      id: blog._id.toString(),
      slug: blog.slug,
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      coverImage: blog.coverImage,
      published: blog.published,
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt,
    }
  },
})

export const create = mutation({
  args: {
    slug: v.string(),
    title: v.string(),
    excerpt: v.string(),
    content: v.string(),
    coverImage: v.optional(v.string()),
    published: v.boolean(),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString()
    const id = await ctx.db.insert("blogs", {
      slug: args.slug,
      title: args.title,
      excerpt: args.excerpt,
      content: args.content,
      coverImage: args.coverImage,
      published: args.published,
      createdAt: now,
      updatedAt: now,
    })
    const blog = await ctx.db.get("blogs", id)
    if (!blog) throw new Error("Failed to create blog")
    return {
      id: blog._id.toString(),
      slug: blog.slug,
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      coverImage: blog.coverImage,
      published: blog.published,
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt,
    }
  },
})

export const update = mutation({
  args: {
    id: v.id("blogs"),
    title: v.optional(v.string()),
    excerpt: v.optional(v.string()),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    published: v.optional(v.boolean()),
    slug: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args
    const doc = await ctx.db.get("blogs", id)
    if (!doc) return null
    const updatedAt = new Date().toISOString()
    const updates: Record<string, unknown> = { updatedAt }
    if (rest.title !== undefined) updates.title = rest.title
    if (rest.excerpt !== undefined) updates.excerpt = rest.excerpt
    if (rest.content !== undefined) updates.content = rest.content
    if (rest.coverImage !== undefined) updates.coverImage = rest.coverImage
    if (rest.published !== undefined) updates.published = rest.published
    if (rest.slug !== undefined) updates.slug = rest.slug
    await ctx.db.patch(id, updates as any)
    const patched = await ctx.db.get("blogs", id)
    if (!patched) return null
    return {
      id: patched._id.toString(),
      slug: patched.slug,
      title: patched.title,
      excerpt: patched.excerpt,
      content: patched.content,
      coverImage: patched.coverImage,
      published: patched.published,
      createdAt: patched.createdAt,
      updatedAt: patched.updatedAt,
    }
  },
})

export const remove = mutation({
  args: { id: v.id("blogs") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
    return true
  },
})
