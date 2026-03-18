/**
 * Hibrit depolama: Vercel'de Redis (kalıcı), lokalde dosya sistemi.
 * Redis için: Vercel Dashboard → Storage → Upstash Redis ekleyin.
 * Env: KV_REST_API_URL, KV_REST_API_TOKEN veya UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN
 */

import { Redis } from "@upstash/redis"
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs"
import { join } from "path"

const REDIS_KEYS = {
  appointments: "fzt:appointments",
  blogs: "fzt:blogs",
  authLock: "fzt:auth-lock",
} as const

const DATA_DIR = process.env.VERCEL
  ? join("/tmp", "fzt-website-data")
  : join(process.cwd(), "data")

function getRedis(): Redis | null {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN
  if (url && token) {
    return new Redis({ url, token })
  }
  return null
}

const redis = getRedis()

export async function storageGet<T>(key: string, defaultValue: T): Promise<T> {
  if (redis) {
    try {
      const val = await redis.get(key)
      return (val as T) ?? defaultValue
    } catch {
      return defaultValue
    }
  }
  // Dosya fallback (":" Windows'ta geçersiz, "-" ile değiştir)
  const safeKey = key.replace(/:/g, "-")
  const filePath = join(DATA_DIR, `${safeKey}.json`)
  try {
    if (existsSync(filePath)) {
      const data = JSON.parse(readFileSync(filePath, "utf-8")) as T
      return data
    }
  } catch {
    // fall through
  }
  return defaultValue
}

export async function storageSet<T>(key: string, value: T): Promise<void> {
  if (redis) {
    try {
      await redis.set(key, value)
      return
    } catch {
      // Redis yazma başarısız
    }
  }
  // Dosya fallback
  try {
    if (!existsSync(DATA_DIR)) {
      mkdirSync(DATA_DIR, { recursive: true })
    }
    const safeKey = key.replace(/:/g, "-")
    const filePath = join(DATA_DIR, `${safeKey}.json`)
    writeFileSync(filePath, JSON.stringify(value, null, 2), "utf-8")
  } catch {
    // Yazma başarısız (örn. Vercel'de /tmp dışı)
  }
}

export { REDIS_KEYS }
