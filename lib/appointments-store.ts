import { promises as fs } from "fs";
import path from "path";

export interface Appointment {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "appointments.json");

/** Serialize writes so concurrent POSTs do not corrupt the JSON file */
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

async function ensureFile(): Promise<void> {
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

export async function readAppointmentsFromFile(): Promise<Appointment[]> {
  await ensureFile();
  const raw = await fs.readFile(FILE, "utf-8");
  const list = parseAppointments(raw);
  return [...list].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function addAppointmentToFile(
  input: Omit<Appointment, "id" | "createdAt">,
): Promise<Appointment> {
  return serializeWrites(async () => {
    await ensureFile();
    const raw = await fs.readFile(FILE, "utf-8");
    const existing = parseAppointments(raw);
    const appointment: Appointment = {
      id: crypto.randomUUID(),
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
