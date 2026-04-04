import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "node:crypto";
import { Redis } from "@upstash/redis";

export interface Appointment {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  createdAt: string;
}

/** Vercel serverless has a read-only filesystem; use Upstash Redis / Vercel KV in production. */
export class AppointmentsStorageNotConfiguredError extends Error {
  constructor() {
    super(
      "Set KV_REST_API_URL + KV_REST_API_TOKEN (Vercel KV) or UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN.",
    );
    this.name = "AppointmentsStorageNotConfiguredError";
  }
}

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "appointments.json");
const REDIS_KEY = "fzt:appointments:v1";

function redisRestUrl(): string | undefined {
  return (
    process.env.KV_REST_API_URL?.trim() ||
    process.env.UPSTASH_REDIS_REST_URL?.trim()
  );
}

/** Read/write REST token — do not use KV_REST_API_READ_ONLY_TOKEN for POST / appointments. */
function redisRestToken(): string | undefined {
  return (
    process.env.KV_REST_API_TOKEN?.trim() ||
    process.env.UPSTASH_REDIS_REST_TOKEN?.trim()
  );
}

let redisClient: Redis | null = null;

function getRedis(): Redis {
  if (!redisClient) {
    const url = redisRestUrl();
    const token = redisRestToken();
    if (!url || !token) {
      throw new Error("Upstash Redis env vars are missing");
    }
    // Upstash defaults to JSON-deserializing GET; we store a string and parse ourselves.
    redisClient = new Redis({ url, token, automaticDeserialization: false });
  }
  return redisClient;
}

function useRedisStorage(): boolean {
  return Boolean(redisRestUrl() && redisRestToken());
}

/** Serialize writes so concurrent POSTs do not corrupt storage */
let writeChain: Promise<void> = Promise.resolve();

function serializeWrites<T>(fn: () => Promise<T>): Promise<T> {
  let result: T;
  const next = writeChain.then(async () => {
    result = await fn();
  });
  writeChain = next.then(
    () => undefined,
    () => undefined,
  );
  return next.then(() => result!);
}

async function ensureLocalFile(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(FILE);
  } catch {
    await fs.writeFile(FILE, "[]\n", "utf-8");
  }
}

function parseAppointments(raw: string): Appointment[] {
  try {
    const data = JSON.parse(raw) as unknown;
    if (!Array.isArray(data)) return [];
    return data.filter(isAppointmentRecord);
  } catch {
    return [];
  }
}

function isAppointmentRecord(row: unknown): row is Appointment {
  if (row === null || typeof row !== "object") return false;
  const o = row as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.name === "string" &&
    typeof o.phone === "string" &&
    typeof o.email === "string" &&
    typeof o.message === "string" &&
    typeof o.createdAt === "string"
  );
}

function sortNewestFirst(list: Appointment[]): Appointment[] {
  return [...list].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

async function readFromRedis(): Promise<Appointment[]> {
  const raw = await getRedis().get<string>(REDIS_KEY);
  if (raw == null || raw === "") return [];
  return sortNewestFirst(parseAppointments(raw));
}

async function readFromFile(): Promise<Appointment[]> {
  await ensureLocalFile();
  const raw = await fs.readFile(FILE, "utf-8");
  return sortNewestFirst(parseAppointments(raw));
}

async function addToRedis(
  input: Omit<Appointment, "id" | "createdAt">,
): Promise<Appointment> {
  return serializeWrites(async () => {
    const redis = getRedis();
    const raw = await redis.get<string>(REDIS_KEY);
    const existing =
      raw == null || raw === "" ? [] : parseAppointments(raw);
    const appointment: Appointment = {
      id: randomUUID(),
      name: input.name,
      phone: input.phone,
      email: input.email,
      message: input.message,
      createdAt: new Date().toISOString(),
    };
    const next = [appointment, ...existing];
    await redis.set(REDIS_KEY, JSON.stringify(next));
    return appointment;
  });
}

async function addToFile(
  input: Omit<Appointment, "id" | "createdAt">,
): Promise<Appointment> {
  return serializeWrites(async () => {
    await ensureLocalFile();
    const raw = await fs.readFile(FILE, "utf-8");
    const existing = parseAppointments(raw);
    const appointment: Appointment = {
      id: randomUUID(),
      name: input.name,
      phone: input.phone,
      email: input.email,
      message: input.message,
      createdAt: new Date().toISOString(),
    };
    const next = [appointment, ...existing];
    await fs.writeFile(FILE, `${JSON.stringify(next, null, 2)}\n`, "utf-8");
    return appointment;
  });
}

export async function readAppointmentsFromFile(): Promise<Appointment[]> {
  if (useRedisStorage()) {
    return readFromRedis();
  }
  return readFromFile();
}

export async function addAppointmentToFile(
  input: Omit<Appointment, "id" | "createdAt">,
): Promise<Appointment> {
  if (useRedisStorage()) {
    return addToRedis(input);
  }
  if (process.env.VERCEL) {
    throw new AppointmentsStorageNotConfiguredError();
  }
  return addToFile(input);
}
