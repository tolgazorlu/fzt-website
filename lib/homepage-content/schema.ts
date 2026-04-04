import { z } from "zod"

export const homepageIconSchema = z.enum([
  "Activity",
  "Hand",
  "Bone",
  "Dumbbell",
  "Brain",
  "Heart",
  "Users",
  "GraduationCap",
  "TrendingUp",
  "Award",
])

export type HomepageIconName = z.infer<typeof homepageIconSchema>

/** Select / admin UI — keep in sync with homepageIconSchema */
export const HOMEPAGE_ICON_OPTIONS: HomepageIconName[] = [
  "Activity",
  "Hand",
  "Bone",
  "Dumbbell",
  "Brain",
  "Heart",
  "Users",
  "GraduationCap",
  "TrendingUp",
  "Award",
]

const navLinkSchema = z.object({
  href: z.string(),
  label: z.string(),
})

const serviceItemSchema = z.object({
  icon: homepageIconSchema,
  title: z.string(),
  description: z.string(),
  details: z.array(z.string()),
})

const statItemSchema = z.object({
  icon: homepageIconSchema,
  label: z.string(),
  description: z.string(),
})

const footerServiceLinkSchema = z.object({
  href: z.string(),
  label: z.string(),
})

export const homepageContentSchema = z.object({
  header: z.object({
    brandTitle: z.string(),
    brandSubtitle: z.string(),
    phoneDisplay: z.string(),
    phoneHref: z.string(),
    ctaLabel: z.string(),
    ctaHref: z.string(),
    nav: z.array(navLinkSchema).min(1),
  }),
  hero: z.object({
    badge: z.string(),
    headlineLine1: z.string(),
    headlineAccent: z.string(),
    subtitle: z.string(),
    description: z.string(),
    primaryCtaLabel: z.string(),
    primaryCtaHref: z.string(),
    secondaryCtaLabel: z.string(),
    secondaryCtaHref: z.string(),
    phoneDisplay: z.string(),
    phoneHref: z.string(),
    locationLine: z.string(),
    hoursLine: z.string(),
    imageSrc: z.string(),
    imageAlt: z.string(),
    floatingCardLabel: z.string(),
    floatingCardText: z.string(),
    scrollHint: z.string(),
  }),
  stats: z.object({
    badge: z.string(),
    title: z.string(),
    items: z.array(statItemSchema).min(1),
  }),
  services: z.object({
    badge: z.string(),
    title: z.string(),
    subtitle: z.string(),
    items: z.array(serviceItemSchema).min(1),
  }),
  about: z.object({
    badge: z.string(),
    title: z.string(),
    paragraphs: z.array(z.string()).min(1),
    achievements: z.array(z.string()),
    interestTitle: z.string(),
    interestAreas: z.array(z.string()),
    imageSrc: z.string(),
    imageAlt: z.string(),
  }),
  contact: z.object({
    badge: z.string(),
    title: z.string(),
    intro: z.string(),
    phoneTitle: z.string(),
    phoneDisplay: z.string(),
    phoneHref: z.string(),
    appointmentTitle: z.string(),
    appointmentText: z.string(),
    addressTitle: z.string(),
    addressText: z.string(),
    hoursTitle: z.string(),
    hoursText: z.string(),
    socialTitle: z.string(),
    instagramHref: z.string(),
    whatsappHref: z.string(),
    formTitle: z.string(),
    formSubtitle: z.string(),
    formSuccessTitle: z.string(),
    formSuccessText: z.string(),
    privacyNote: z.string(),
    mapEmbedSrc: z.string(),
  }),
  footer: z.object({
    brandTitle: z.string(),
    brandSubtitle: z.string(),
    description: z.string(),
    phoneDisplay: z.string(),
    phoneHref: z.string(),
    addressBlock: z.string(),
    instagramHref: z.string(),
    whatsappHref: z.string(),
    quickLinks: z.array(navLinkSchema).min(1),
    serviceLinks: z.array(footerServiceLinkSchema).min(1),
    copyrightSuffix: z.string(),
    privacyLabel: z.string(),
    privacyHref: z.string(),
    kvkkLabel: z.string(),
    kvkkHref: z.string(),
  }),
})

export type HomepageContent = z.infer<typeof homepageContentSchema>
