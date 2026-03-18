import { storageGet, storageSet, REDIS_KEYS } from "./storage"

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

export async function getAppointments(): Promise<Appointment[]> {
  return storageGet<Appointment[]>(REDIS_KEYS.appointments, [])
}

export async function addAppointment(
  appointment: Omit<Appointment, "id" | "createdAt">
): Promise<Appointment> {
  const appointments = await getAppointments()
  const newAppointment: Appointment = {
    ...appointment,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }
  appointments.unshift(newAppointment)
  await storageSet(REDIS_KEYS.appointments, appointments)
  return newAppointment
}

export async function getBlogs(publishedOnly = false): Promise<Blog[]> {
  const blogs = await storageGet<Blog[]>(REDIS_KEYS.blogs, [])
  if (publishedOnly) {
    return blogs
      .filter((b) => b.published)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }
  return blogs.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export async function getBlogBySlug(slug: string): Promise<Blog | undefined> {
  const blogs = await getBlogs(false)
  return blogs.find((b) => b.slug === slug && b.published)
}

export async function getBlogById(id: string): Promise<Blog | undefined> {
  const blogs = await getBlogs(false)
  return blogs.find((b) => b.id === id)
}

export async function createBlog(
  blog: Omit<Blog, "id" | "createdAt" | "updatedAt">
): Promise<Blog> {
  const blogs = await getBlogs(false)
  const now = new Date().toISOString()
  const newBlog: Blog = {
    ...blog,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  }
  blogs.unshift(newBlog)
  await storageSet(REDIS_KEYS.blogs, blogs)
  return newBlog
}

export async function updateBlog(
  id: string,
  updates: Partial<Omit<Blog, "id" | "createdAt">>
): Promise<Blog | undefined> {
  const blogs = await getBlogs(false)
  const index = blogs.findIndex((b) => b.id === id)
  if (index === -1) return undefined
  const updated = {
    ...blogs[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  blogs[index] = updated
  await storageSet(REDIS_KEYS.blogs, blogs)
  return updated
}

export async function deleteBlog(id: string): Promise<boolean> {
  const blogs = (await getBlogs(false)).filter((b) => b.id !== id)
  await storageSet(REDIS_KEYS.blogs, blogs)
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
  return slug.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

export async function generateSlug(title: string): Promise<string> {
  const base = slugify(title)
  const blogs = await getBlogs(false)
  const existing = blogs.map((b) => b.slug)
  let slug = base
  let i = 1
  while (existing.includes(slug)) {
    slug = `${base}-${i}`
    i++
  }
  return slug
}
