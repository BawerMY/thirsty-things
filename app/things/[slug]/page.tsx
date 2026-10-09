import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatLiters, getThing, getThings } from "@/lib/things";

const BATHTUB_LITERS = 150;
const DAILY_DRINKING_LITERS = 2;

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getThings().map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const thing = getThing((await params).slug);
  return { title: thing ? `${thing.name} · Thirsty Things` : "Thirsty Things" };
}

function round(n: number): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: n < 10 ? 1 : 0 });
}

export default async function ThingPage({ params }: Props) {
  const thing = getThing((await params).slug);
  if (!thing) notFound();

  return (
    <article className="detail">
      <Link href="/" className="back">← All things</Link>
      <Image src={thing.imageSrc} alt={thing.name} width={200} height={200} unoptimized />
      <h1>{thing.name}</h1>
      <p className="liters big">{formatLiters(thing.liters)}</p>
      <p className="muted">of water to produce</p>
      <ul className="facts">
        <li>
          <strong>{round(thing.liters / BATHTUB_LITERS)}</strong> full bathtubs
        </li>
        <li>
          <strong>{round(thing.liters / DAILY_DRINKING_LITERS)}</strong> days of drinking water
        </li>
      </ul>
    </article>
  );
}
