import { fetchQuery, fetchMutation } from "convex/nextjs"
import { api } from "@/convex/_generated/api"

function hasConvex(): boolean {
  return !!process.env.NEXT_PUBLIC_CONVEX_URL
}

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
  if (!hasConvex()) return []
  const list = await fetchQuery(api.appointments.list)
  return list ?? []
}

export async function addAppointment(
  appointment: Omit<Appointment, "id" | "createdAt">
): Promise<Appointment> {
  if (!hasConvex()) throw new Error("Convex yapılandırılmamış")
  const result = await fetchMutation(api.appointments.add, {
    name: appointment.name,
    phone: appointment.phone,
    email: appointment.email,
    message: appointment.message,
  })
  return result
}

export async function getBlogs(publishedOnly = false): Promise<Blog[]> {
  if (!hasConvex()) return []
  const list = await fetchQuery(api.blogs.list, { publishedOnly })
  return list ?? []
}

export async function getBlogBySlug(slug: string): Promise<Blog | undefined> {
  if (!hasConvex()) return undefined
  const blog = await fetchQuery(api.blogs.getBySlug, { slug })
  return blog ?? undefined
}

export async function getBlogById(id: string): Promise<Blog | undefined> {
  if (!hasConvex()) return undefined
  const blog = await fetchQuery(api.blogs.getById, { id })
  return blog ?? undefined
}

export async function createBlog(
  blog: Omit<Blog, "id" | "createdAt" | "updatedAt">
): Promise<Blog> {
  if (!hasConvex()) throw new Error("Convex yapılandırılmamış")
  const result = await fetchMutation(api.blogs.create, {
    slug: blog.slug,
    title: blog.title,
    excerpt: blog.excerpt,
    content: blog.content,
    coverImage: blog.coverImage,
    published: blog.published,
  })
  return result
}

export async function updateBlog(
  id: string,
  updates: Partial<Omit<Blog, "id" | "createdAt">>
): Promise<Blog | undefined> {
  if (!hasConvex()) return undefined
  const result = await fetchMutation(api.blogs.update, {
    id,
    ...updates,
  })
  return result
}

export async function deleteBlog(id: string): Promise<boolean> {
  if (!hasConvex()) return false
  await fetchMutation(api.blogs.remove, { id })
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
