import fs from "node:fs";
import path from "node:path";
import rawThings from "@/data/things.json";

export type Thing = {
  name: string;
  liters: number;
  image: string;
};

export type ThingEntry = Thing & {
  slug: string;
  imageSrc: string;
};

const IMAGES_DIR = path.join(process.cwd(), "public", "images", "things");

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function validate(entry: unknown, index: number): Thing {
  const e = entry as Partial<Thing>;
  const where = `data/things.json[${index}]`;
  if (!e || typeof e.name !== "string" || !e.name.trim()) {
    throw new Error(`${where}: "name" must be a non-empty string`);
  }
  if (typeof e.liters !== "number" || !Number.isFinite(e.liters) || e.liters < 0) {
    throw new Error(`${where} (${e.name}): "liters" must be a number >= 0`);
  }
  if (typeof e.image !== "string" || !e.image.toLowerCase().endsWith(".svg")) {
    throw new Error(`${where} (${e.name}): "image" must be an .svg file name`);
  }
  if (!fs.existsSync(path.join(IMAGES_DIR, e.image))) {
    throw new Error(`${where} (${e.name}): public/images/things/${e.image} does not exist`);
  }
  return { name: e.name.trim(), liters: e.liters, image: e.image };
}

export function getThings(): ThingEntry[] {
  if (!Array.isArray(rawThings)) {
    throw new Error("data/things.json must contain an array of things");
  }
  const seen = new Set<string>();
  return rawThings.map((raw, i) => {
    const thing = validate(raw, i);
    const slug = slugify(thing.name);
    if (seen.has(slug)) {
      throw new Error(`data/things.json: duplicate thing name "${thing.name}"`);
    }
    seen.add(slug);
    return { ...thing, slug, imageSrc: `/images/things/${encodeURIComponent(thing.image)}` };
  });
}

export function getThing(slug: string): ThingEntry | undefined {
  return getThings().find((t) => t.slug === slug);
}

export function formatLiters(liters: number): string {
  return `${liters.toLocaleString("en-US")} L`;
}
