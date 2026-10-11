# fzt-website

Website and patient portal for a physiotherapy practice, built with Next.js.

## About

A production website for a physiotherapist: a public marketing site (hero,
services, about, stats, contact, blog) plus two authenticated areas: an admin
dashboard for managing content, appointments and patients, and a patient
panel for viewing an assigned exercise plan. Built 2026-03 to 2026-05.

## Features

- Public site: hero, services, about, stats, video section, contact form, blog
- Admin dashboard (JWT-protected): homepage content editor, blog editor,
  appointment list, patient management
- Patient panel (separate JWT-protected session): view assigned exercise plan
- Appointment requests stored via file or Redis (Vercel KV / Upstash),
  since Vercel's filesystem is read-only in production
- Light/dark theme support

## Tech stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS 4, Radix UI primitives, shadcn-style `components/ui`
- Auth: `jose` (JWT), `bcryptjs` (password hashing)
- Storage: local JSON files in `data/` for dev, Upstash Redis / Vercel KV for
  appointments in production
- Forms: `react-hook-form` + `zod`

## Architecture

```
app/              Next.js App Router routes (public pages, /admin, /hasta, /api)
components/       UI components (sections, admin, patient, components/ui)
lib/              auth, data stores (blogs, appointments, patient exercises,
                  homepage content)
data/             JSON data files used as the dev-time data store
```

- `lib/auth.ts` / `lib/patient-auth.ts`: separate JWT sessions for admin and
  patient, signed with `jose`, stored in httpOnly cookies
- `lib/appointments-store.ts`: falls back from local JSON file to Redis
  (Vercel KV or Upstash) for serverless environments
- `lib/homepage-content/`: schema + store for editable homepage content

## Getting started

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and fill in the values you need:

- `JWT_SECRET` / `PATIENT_JWT_SECRET`: JWT signing secrets
- `ADMIN_PASSWORD_HASH`: bcrypt hash of the admin password
- `KV_REST_API_URL` / `KV_REST_API_TOKEN` or `UPSTASH_REDIS_REST_URL` /
  `UPSTASH_REDIS_REST_TOKEN`: appointment storage in production

Other scripts: `npm run build`, `npm run start`, `npm run lint`.

## Status

Active / maintained.

## License

MIT, see [LICENSE](LICENSE).
