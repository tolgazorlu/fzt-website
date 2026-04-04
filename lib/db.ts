import {
  listBlogs,
  getPublishedBlogBySlug,
  getBlogById as getBlogByIdFromStore,
  createBlog as createBlogInStore,
  updateBlog as updateBlogInStore,
  deleteBlog as deleteBlogInStore,
  type Blog,
} from "@/lib/blogs-store"
import {
  readAppointmentsFromFile,
  addAppointmentToFile,
  type Appointment,
} from "@/lib/appointments-store"

export type { Appointment, Blog }

export async function getAppointments(): Promise<Appointment[]> {
  return readAppointmentsFromFile()
}

export async function addAppointment(
  appointment: Omit<Appointment, "id" | "createdAt">,
): Promise<Appointment> {
  return addAppointmentToFile(appointment)
}

export async function getBlogs(publishedOnly = false): Promise<Blog[]> {
  return listBlogs(publishedOnly)
}

export async function getBlogBySlug(slug: string): Promise<Blog | undefined> {
  return getPublishedBlogBySlug(slug)
}

export async function getBlogById(id: string): Promise<Blog | undefined> {
  return getBlogByIdFromStore(id)
}

export async function createBlog(
  blog: Omit<Blog, "id" | "createdAt" | "updatedAt">,
): Promise<Blog> {
  return createBlogInStore(blog)
}

export async function updateBlog(
  id: string,
  updates: Partial<Omit<Blog, "id" | "createdAt">>,
): Promise<Blog | undefined> {
  return updateBlogInStore(id, updates)
}

export async function deleteBlog(id: string): Promise<boolean> {
  return deleteBlogInStore(id)
}

function slugify(text: string): string {
  const trMap: Record<string, string> = {
    ç: "c",
    ğ: "g",
    ı: "i",
    ö: "o",
    ş: "s",
    ü: "u",
    Ç: "c",
    Ğ: "g",
    İ: "i",
    Ö: "o",
    Ş: "s",
    Ü: "u",
  }
  let slug = text.toLowerCase()
  for (const [tr, en] of Object.entries(trMap)) {
    slug = slug.replace(new RegExp(tr, "g"), en)
  }
  return slug.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

export async function generateSlug(title: string): Promise<string> {
  const base = slugify(title)
  const blogs = await listBlogs(false)
  const existing = blogs.map((b) => b.slug)
  let slug = base
  let i = 1
  while (existing.includes(slug)) {
    slug = `${base}-${i}`
    i++
  }
  return slug
}
