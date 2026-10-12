import "server-only";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { PLACEHOLDER_IMAGE, imageSrc, type Thing } from "./thing";

export * from "./thing";

const THINGS_FILE = path.join(process.cwd(), "data", "things.json");
const PUBLIC_DIR = path.join(process.cwd(), "public");

function isThing(value: unknown): value is Thing {
  if (typeof value !== "object" || value === null) return false;
  const t = value as Record<string, unknown>;
  return (
    typeof t.name === "string" &&
    typeof t.description === "string" &&
    typeof t.image === "string" &&
    typeof t.liters === "number" &&
    Number.isFinite(t.liters) &&
    t.liters > 0
  );
}

/** Swap in the placeholder for images that haven't been added to /public yet. */
function withImageFallback(thing: Thing): Thing {
  const file = path.join(PUBLIC_DIR, imageSrc(thing));
  return existsSync(file) ? thing : { ...thing, image: PLACEHOLDER_IMAGE };
}

export async function getThings(): Promise<Thing[]> {
  const raw: unknown = JSON.parse(await readFile(THINGS_FILE, "utf8"));
  if (!Array.isArray(raw)) {
    throw new Error(`${THINGS_FILE} must contain a JSON array of things`);
  }
  raw.forEach((item, i) => {
    if (!isThing(item)) {
      throw new Error(
        `Invalid thing at index ${i} in ${THINGS_FILE}: expected { name: string, description: string, image: string, liters: number > 0 }`,
      );
    }
  });
  return (raw as Thing[]).map(withImageFallback);
}
