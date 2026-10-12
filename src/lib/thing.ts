export type Thing = {
  name: string;
  /** Short, playful line shown under the name */
  description: string;
  /** File name (or path) under /public/images/things/ */
  image: string;
  /** Water used to produce one unit, in liters */
  liters: number;
  /** Where the figure comes from (optional) */
  source?: { title: string; url?: string; basis?: string };
};

export type Units = "metric" | "gallons";

export const LITERS_PER_GALLON = 3.785411784;
/** How many liters one bottle icon stands for in the Tap List. */
export const LITERS_PER_BOTTLE = 100;

/** Shown when a thing's image file isn't in /public/images/things/ yet. */
export const PLACEHOLDER_IMAGE = "/images/thing-placeholder.svg";
/** Rows with more bottles than this show the rest as a "+N" count. */
export const MAX_BOTTLES = 200;

/** Public URL for a thing's image, e.g. "coffee.png" -> "/images/things/coffee.png". */
export function imageSrc(thing: Thing): string {
  if (thing.image.startsWith("/")) return thing.image;
  return `/images/things/${thing.image}`;
}

export function convert(liters: number, units: Units): number {
  return units === "metric" ? liters : liters / LITERS_PER_GALLON;
}

export function toLiters(amount: number, units: Units): number {
  return units === "metric" ? amount : amount * LITERS_PER_GALLON;
}

export function unitShort(units: Units): string {
  return units === "metric" ? "L" : "gal";
}

export function unitWord(units: Units): string {
  return units === "metric" ? "liters" : "gallons";
}

/** "8,000 L", "2.6 gal": one decimal below 10, whole numbers above. */
export function formatAmount(liters: number, units: Units): string {
  const v = convert(liters, units);
  const s = v < 10 ? (Math.round(v * 10) / 10).toString() : Math.round(v).toLocaleString("en-US");
  return `${s} ${unitShort(units)}`;
}

/** Amount one bottle stands for, in the current units. */
export function perBottle(units: Units): number {
  return units === "metric" ? LITERS_PER_BOTTLE : LITERS_PER_BOTTLE / 4;
}

/** How many bottles (including a part-filled last one) it takes to hold `liters`. */
export function bottleCount(liters: number, units: Units): number {
  const n = convert(liters, units) / perBottle(units);
  return Math.floor(n) + (n - Math.floor(n) > 0.001 ? 1 : 0);
}

/** Fill level (0–1) of each bottle needed to hold `liters`, capped at `limit` bottles. */
export function bottleFills(liters: number, units: Units, limit = MAX_BOTTLES): number[] {
  const n = convert(liters, units) / perBottle(units);
  const full = Math.floor(n);
  const frac = n - full;
  const fills: number[] = Array.from({ length: Math.min(full, limit) }, () => 1);
  if (full < limit && frac > 0.001) fills.push(Math.max(frac, 0.12));
  return fills;
}

export function shuffle<T>(items: T[]): T[] {
  const a = items.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
