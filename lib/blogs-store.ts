import { promises as fs } from "fs"
import path from "path"
import { randomUUID } from "node:crypto"

export interface Blog {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  coverImage?: string
  published: boolean
  createdAt: string
  updatedAt: string
}

const DATA_DIR = path.join(process.cwd(), "data")
const FILE = path.join(DATA_DIR, "blogs.json")

let writeChain: Promise<void> = Promise.resolve()

function serializeWrites<T>(fn: () => Promise<T>): Promise<T> {
  let result!: T
  const next = writeChain.then(async () => {
    result = await fn()
  })
  writeChain = next.then(() => undefined, () => undefined)
  return next.then(() => result)
}

async function ensureFile(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true })
  try {
    await fs.access(FILE)
  } catch {
    await fs.writeFile(FILE, "[]\n", "utf-8")
  }
}

function isBlog(row: unknown): row is Blog {
  if (row === null || typeof row !== "object") return false
  const o = row as Record<string, unknown>
  return (
    typeof o.id === "string" &&
    typeof o.slug === "string" &&
    typeof o.title === "string" &&
    typeof o.excerpt === "string" &&
    typeof o.content === "string" &&
    typeof o.published === "boolean" &&
    typeof o.createdAt === "string" &&
    typeof o.updatedAt === "string" &&
    (o.coverImage === undefined || typeof o.coverImage === "string")
  )
}

function parseBlogs(raw: string): Blog[] {
  try {
    const data = JSON.parse(raw) as unknown
    if (!Array.isArray(data)) return []
    return data.filter(isBlog)
  } catch {
    return []
  }
}

async function readAll(): Promise<Blog[]> {
  await ensureFile()
  const raw = await fs.readFile(FILE, "utf-8")
  return parseBlogs(raw)
}

export async function listBlogs(publishedOnly: boolean): Promise<Blog[]> {
  const list = await readAll()
  const filtered = publishedOnly ? list.filter((b) => b.published) : list
  return [...filtered].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}

export async function getPublishedBlogBySlug(slug: string): Promise<Blog | undefined> {
  const list = await readAll()
  return list.find((b) => b.slug === slug && b.published)
}

export async function getBlogById(id: string): Promise<Blog | undefined> {
  const list = await readAll()
  return list.find((b) => b.id === id)
}

export async function createBlog(
  input: Omit<Blog, "id" | "createdAt" | "updatedAt">,
): Promise<Blog> {
  return serializeWrites(async () => {
    await ensureFile()
    const raw = await fs.readFile(FILE, "utf-8")
    const existing = parseBlogs(raw)
    const now = new Date().toISOString()
    const blog: Blog = {
      id: randomUUID(),
      slug: input.slug,
      title: input.title,
      excerpt: input.excerpt,
      content: input.content,
      coverImage: input.coverImage,
      published: input.published,
      createdAt: now,
      updatedAt: now,
    }
    const next = [blog, ...existing]
    await fs.writeFile(FILE, `${JSON.stringify(next, null, 2)}\n`, "utf-8")
    return blog
  })
}

export async function updateBlog(
  id: string,
  updates: Partial<Omit<Blog, "id" | "createdAt">>,
): Promise<Blog | undefined> {
  return serializeWrites(async () => {
    await ensureFile()
    const raw = await fs.readFile(FILE, "utf-8")
    const list = parseBlogs(raw)
    const idx = list.findIndex((b) => b.id === id)
    if (idx === -1) return undefined
    const prev = list[idx]!
    const updatedAt = new Date().toISOString()
    const merged: Blog = {
      ...prev,
      ...(updates.title !== undefined && { title: updates.title }),
      ...(updates.excerpt !== undefined && { excerpt: updates.excerpt }),
      ...(updates.content !== undefined && { content: updates.content }),
      ...(updates.coverImage !== undefined && { coverImage: updates.coverImage }),
      ...(updates.published !== undefined && { published: updates.published }),
      ...(updates.slug !== undefined && { slug: updates.slug }),
      updatedAt,
    }
    const next = [...list]
    next[idx] = merged
    await fs.writeFile(FILE, `${JSON.stringify(next, null, 2)}\n`, "utf-8")
    return merged
  })
}

export async function deleteBlog(id: string): Promise<boolean> {
  return serializeWrites(async () => {
    await ensureFile()
    const raw = await fs.readFile(FILE, "utf-8")
    const list = parseBlogs(raw)
    const next = list.filter((b) => b.id !== id)
    if (next.length === list.length) return false
    await fs.writeFile(FILE, `${JSON.stringify(next, null, 2)}\n`, "utf-8")
    return true
  })
}
