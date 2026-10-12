"use client";

import { useCallback, useEffect, useState } from "react";
import type { Thing, Units } from "@/lib/thing";
import GuessTheGulp from "./GuessTheGulp";
import { DropLogo, GitHubIcon, HeaderWave, Surf, tabIcons } from "./icons";
import SinkOrSwim from "./SinkOrSwim";
import TapList from "./TapList";
import styles from "./ThirstyApp.module.css";

type Page = "tap" | "guess" | "surv";

const TABS: { id: Page; label: string; short: string }[] = [
  { id: "tap", label: "The Tap List", short: "Tap List" },
  { id: "guess", label: "Guess the Gulp", short: "Guess" },
  { id: "surv", label: "Sink or Swim", short: "Sink/Swim" },
];
const PAGE_KEY = "tt_page";

export default function ThirstyApp({ things }: { things: Thing[] }) {
  const [page, setPage] = useState<Page>("tap");
  const [units, setUnits] = useState<Units>("metric");
  const [survScore, setSurvScore] = useState(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(PAGE_KEY);
      if (saved === "tap" || saved === "guess" || saved === "surv") setPage(saved);
    } catch {}
  }, []);

  const go = (p: Page) => {
    try {
      localStorage.setItem(PAGE_KEY, p);
    } catch {}
    setPage(p);
  };
  const onSurvScore = useCallback((s: number) => setSurvScore(s), []);

  const inSurv = page === "surv";

  return (
    <div className={styles.shell}>
      {/* Water rises as you survive in Sink or Swim */}
      <div className={styles.water} style={{ height: inSurv ? `${Math.min(75, 6 + survScore * 7)}%` : "0%" }}>
        <div className={styles.surf} style={{ opacity: inSurv && survScore > 0 ? 1 : 0 }}>
          <Surf />
        </div>
      </div>

      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logo}>
            <DropLogo />
            <div className={styles.logoText}>Thirsty Things</div>
          </div>
          <nav className={styles.nav}>
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => go(t.id)}
                className={`${styles.tab} ${page === t.id ? styles.tabActive : ""}`}
                aria-current={page === t.id ? "page" : undefined}
              >
                {t.label}
              </button>
            ))}
          </nav>
          <div className={styles.controls}>
            <a href="https://github.com/BawerMY/" target="_blank" rel="noopener" className={styles.ghLink}>
              <GitHubIcon />
              <span className={styles.ghText}>BawerMY</span>
            </a>
            <div className={styles.units} role="group" aria-label="Units">
              {(
                [
                  ["metric", "Liters", "L"],
                  ["gallons", "Gallons", "gal"],
                ] as const
              ).map(([u, long, short]) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setUnits(u)}
                  className={`${styles.unit} ${units === u ? styles.unitActive : ""}`}
                  aria-pressed={units === u}
                >
                  <span className={styles.longLabel}>{long}</span>
                  <span className={styles.shortLabel}>{short}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.headerWave}>
          <HeaderWave />
        </div>
      </header>

      <main className={styles.main}>
        <section hidden={page !== "tap"}>
          <TapList things={things} units={units} />
        </section>
        <section hidden={page !== "guess"}>
          <GuessTheGulp things={things} units={units} />
        </section>
        <section hidden={page !== "surv"}>
          <SinkOrSwim things={things} units={units} onScoreChange={onSurvScore} />
        </section>
      </main>

      <nav className={styles.bottomNav}>
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => go(t.id)}
            className={`${styles.bottomTab} ${page === t.id ? styles.tabActive : ""}`}
            aria-current={page === t.id ? "page" : undefined}
          >
            {tabIcons[t.id](page === t.id)}
            <span>{t.short}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
