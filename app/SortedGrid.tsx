"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { ThingEntry } from "@/lib/things";

type Sort = "most" | "least" | "name";

export default function SortedGrid({ things }: { things: ThingEntry[] }) {
  const [sort, setSort] = useState<Sort>("most");
  const max = Math.max(1, ...things.map((t) => t.liters));

  const sorted = useMemo(() => {
    const copy = [...things];
    if (sort === "most") copy.sort((a, b) => b.liters - a.liters);
    if (sort === "least") copy.sort((a, b) => a.liters - b.liters);
    if (sort === "name") copy.sort((a, b) => a.name.localeCompare(b.name));
    return copy;
  }, [things, sort]);

  return (
    <>
      <div className="toolbar">
        <span>{things.length} things</span>
        <label>
          Sort by{" "}
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
            <option value="most">Most water</option>
            <option value="least">Least water</option>
            <option value="name">Name</option>
          </select>
        </label>
      </div>
      <ul className="grid">
        {sorted.map((t) => (
          <li key={t.slug}>
            <Link href={`/things/${t.slug}`} className="card">
              <Image src={t.imageSrc} alt="" width={96} height={96} unoptimized />
              <h2>{t.name}</h2>
              <p className="liters">{t.liters.toLocaleString("en-US")} L</p>
              <div className="bar" aria-hidden="true">
                <span style={{ width: `${Math.max(2, (t.liters / max) * 100)}%` }} />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
