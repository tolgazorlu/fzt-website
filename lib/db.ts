import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs"
import { join } from "path"

// Vercel'de dosya sistemi salt okunur; /tmp yazılabilir
const DATA_DIR = process.env.VERCEL
  ? join("/tmp", "fzt-website-data")
  : join(process.cwd(), "data")
const APPOINTMENTS_FILE = join(DATA_DIR, "appointments.json")
const BLOGS_FILE = join(DATA_DIR, "blogs.json")

export interface Appointment {
  id: string
  name: string
  phone: string
  email: string
  message: string
  createdAt: string
}

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

function ensureDataDir() {
  try {
    if (!existsSync(DATA_DIR)) {
      mkdirSync(DATA_DIR, { recursive: true })
    }
  } catch {
    // Vercel'de mkdir başarısız olabilir
  }
}

function readJson<T>(filePath: string, defaultValue: T): T {
  try {
    if (existsSync(filePath)) {
      const data = readFileSync(filePath, "utf-8")
      return JSON.parse(data) as T
    }
  } catch {
    // Fall through to default
  }
  return defaultValue
}

function writeJson<T>(filePath: string, data: T) {
  try {
    ensureDataDir()
    writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8")
  } catch {
    // Vercel'de yazma başarısız olursa sessizce geç
  }
}

export function getAppointments(): Appointment[] {
  return readJson<Appointment[]>(APPOINTMENTS_FILE, [])
}

export function addAppointment(appointment: Omit<Appointment, "id" | "createdAt">) {
  const appointments = getAppointments()
  const newAppointment: Appointment = {
    ...appointment,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }
  appointments.unshift(newAppointment)
  writeJson(APPOINTMENTS_FILE, appointments)
  return newAppointment
}

export function getBlogs(publishedOnly = false): Blog[] {
  const blogs = readJson<Blog[]>(BLOGS_FILE, [])
  if (publishedOnly) {
    return blogs.filter((b) => b.published).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }
  return blogs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function getBlogBySlug(slug: string): Blog | undefined {
  return getBlogs(false).find((b) => b.slug === slug && b.published)
}

export function getBlogById(id: string): Blog | undefined {
  return getBlogs(false).find((b) => b.id === id)
}

export function createBlog(blog: Omit<Blog, "id" | "createdAt" | "updatedAt">) {
  const blogs = getBlogs(false)
  const now = new Date().toISOString()
  const newBlog: Blog = {
    ...blog,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  }
  blogs.unshift(newBlog)
  writeJson(BLOGS_FILE, blogs)
  return newBlog
}

export function updateBlog(id: string, updates: Partial<Omit<Blog, "id" | "createdAt">>) {
  const blogs = getBlogs(false)
  const index = blogs.findIndex((b) => b.id === id)
  if (index === -1) return undefined
  const updated = {
    ...blogs[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  blogs[index] = updated
  writeJson(BLOGS_FILE, blogs)
  return updated
}

export function deleteBlog(id: string) {
  const blogs = getBlogs(false).filter((b) => b.id !== id)
  writeJson(BLOGS_FILE, blogs)
  return true
}

function slugify(text: string): string {
  const trMap: Record<string, string> = {
    ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u",
    Ç: "c", Ğ: "g", İ: "i", Ö: "o", Ş: "s", Ü: "u",
  }
  let slug = text.toLowerCase()
  for (const [tr, en] of Object.entries(trMap)) {
    slug = slug.replace(new RegExp(tr, "g"), en)
  }
  return slug
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

export function generateSlug(title: string): string {
  const base = slugify(title)
  const existing = getBlogs(false).map((b) => b.slug)
  let slug = base
  let i = 1
  while (existing.includes(slug)) {
    slug = `${base}-${i}`
    i++
  }
  return slug
}
