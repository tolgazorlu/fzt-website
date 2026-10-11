# fzt-website

Website for a physiotherapy practice, built with Next.js.

## About

A production marketing website for a physiotherapist: hero, services, about,
stats, video section, contact form. Built 2026-03 to 2026-05.

## Features

- Public site: hero, services, about, stats, video section, contact form
- Appointment requests stored via file or Redis (Vercel KV / Upstash),
  since Vercel's filesystem is read-only in production
- Light/dark theme support

## Tech stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS 4, Radix UI primitives, shadcn-style `components/ui`
- Storage: local JSON files in `data/` for dev, Upstash Redis / Vercel KV for
  appointments in production
- Forms: `react-hook-form` + `zod`

## Architecture

```
app/              Next.js App Router routes (public pages, /api)
components/       UI components (sections, components/ui)
lib/              data stores (appointments, homepage content)
data/             JSON data files used as the dev-time data store
```

- `lib/appointments-store.ts`: falls back from local JSON file to Redis
  (Vercel KV or Upstash) for serverless environments
- `lib/homepage-content/`: schema + store for editable homepage content

## Getting started

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and fill in the values you need:

- `KV_REST_API_URL` / `KV_REST_API_TOKEN` or `UPSTASH_REDIS_REST_URL` /
  `UPSTASH_REDIS_REST_TOKEN`: appointment storage in production

Other scripts: `npm run build`, `npm run start`, `npm run lint`.

## Status

Active / maintained.

## License

MIT, see [LICENSE](LICENSE).
