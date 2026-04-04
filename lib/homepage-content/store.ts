import { promises as fs } from "fs";
import path from "path";
import { homepageContentSchema, type HomepageContent } from "./schema";
import { DEFAULT_HOMEPAGE_CONTENT } from "./defaults";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "homepage-content.json");

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

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

function deepMergeValues(base: unknown, patch: unknown): unknown {
  if (patch === undefined) return base;
  if (Array.isArray(base) && Array.isArray(patch)) return patch;
  if (isPlainObject(base) && isPlainObject(patch)) {
    const out: Record<string, unknown> = { ...base };
    for (const k of Object.keys(patch)) {
      if (!(k in base)) continue;
      out[k] = deepMergeValues(base[k], patch[k]);
    }
    return out;
  }
  return patch;
}

export async function getHomepageContent(): Promise<HomepageContent> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  let raw: string;
  try {
    raw = await fs.readFile(FILE, "utf-8");
  } catch {
    const initial = `${JSON.stringify(DEFAULT_HOMEPAGE_CONTENT, null, 2)}\n`;
    await fs.writeFile(FILE, initial, "utf-8");
    return DEFAULT_HOMEPAGE_CONTENT;
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return DEFAULT_HOMEPAGE_CONTENT;
  }
  const merged = deepMergeValues(
    structuredClone(DEFAULT_HOMEPAGE_CONTENT),
    parsed,
  ) as HomepageContent;
  const checked = homepageContentSchema.safeParse(merged);
  if (!checked.success) {
    return DEFAULT_HOMEPAGE_CONTENT;
  }
  return checked.data;
}

export async function saveHomepageContent(
  content: HomepageContent,
): Promise<void> {
  const parsed = homepageContentSchema.parse(content);
  return serializeWrites(async () => {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(FILE, `${JSON.stringify(parsed, null, 2)}\n`, "utf-8");
  });
}
