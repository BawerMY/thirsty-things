"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { formatAmount, imageSrc, type Thing, type Units } from "@/lib/thing";
import styles from "./ThirstyApp.module.css";

const OVER_TITLES = [
  "You dried up like a raisin.",
  "Evaporated. Gone. Just steam now.",
  "Glug-no. You ran aground.",
  "Splat. That was the shallow end.",
];
const WIN_MSGS = ["Still swimming!", "Glug glug, correct!", "Making waves!", "Hydro-homie approved."];
const BEST_KEY = "tt_best";

function randomPair(n: number): [number, number] {
  const a = Math.floor(Math.random() * n);
  let b = a;
  while (b === a) b = Math.floor(Math.random() * n);
  return [a, b];
}

type Phase = "pick" | "reveal" | "over";

export default function SinkOrSwim({
  things,
  units,
  onScoreChange,
}: {
  things: Thing[];
  units: Units;
  onScoreChange: (score: number) => void;
}) {
  const [pair, setPair] = useState<[number, number]>([0, 1]);
  const [phase, setPhase] = useState<Phase>("pick");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (things.length >= 2) setPair(randomPair(things.length));
    try {
      setBest(Number(localStorage.getItem(BEST_KEY)) || 0);
    } catch {}
    return () => clearTimeout(timer.current);
  }, [things.length]);

  useEffect(() => onScoreChange(score), [score, onScoreChange]);

  if (things.length < 2) {
    return <p className={styles.heroLead}>Add at least two things to play Sink or Swim.</p>;
  }

  const [a, b] = pair;
  const winner = things[a].liters >= things[b].liters ? 0 : 1;
  const shown = phase !== "pick";

  const pick = (side: 0 | 1) => {
    if (phase !== "pick") return;
    const me = things[side === 0 ? a : b].liters;
    const other = things[side === 0 ? b : a].liters;
    if (me >= other) {
      setScore((s) => s + 1);
      setPhase("reveal");
      timer.current = setTimeout(() => {
        setPair(randomPair(things.length));
        setPhase("pick");
      }, 1500);
    } else {
      const newBest = Math.max(best, score);
      try {
        localStorage.setItem(BEST_KEY, String(newBest));
      } catch {}
      setBest(newBest);
      setPhase("over");
    }
  };

  const restart = () => {
    setPair(randomPair(things.length));
    setPhase("pick");
    setScore(0);
  };

  return (
    <>
      <div className={styles.gameHead} style={{ marginBottom: 8 }}>
        <h1 className={styles.gameTitle}>Sink or Swim</h1>
        <div className={styles.scoreboard}>
          <div className={styles.scoreMain}>
            <span className={styles.scoreLabel}>Survived</span>
            <span className={styles.scoreValue}>{score}</span>
          </div>
          <div className={styles.scoreSide}>
            <span className={`${styles.scoreLabel} ${styles.muted}`}>Best</span>
            <span className={styles.scoreSideValue}>{Math.max(best, score)}</span>
          </div>
        </div>
      </div>
      <p className={styles.survLead}>Which one drank more water? Pick right to stay afloat. Pick wrong and you dry up.</p>

      <div className={styles.survCards}>
        {([a, b] as const).map((idx, side) => {
          const thing = things[idx];
          const isWin = side === winner;
          return (
            <button
              key={side}
              type="button"
              onClick={() => pick(side as 0 | 1)}
              className={styles.survCard}
              style={{ background: shown ? (isWin ? "#3fd0e6" : "#dfe6ea") : "#fff" }}
            >
              <div className={styles.survTag}>
                {shown ? (isWin ? "Thirstier" : "Less thirsty") : side === 0 ? "This one?" : "Or this one?"}
              </div>
              <Image src={imageSrc(thing)} alt="" width={180} height={180} className={styles.survImg} />
              <div className={styles.survName}>{thing.name}</div>
              <div className={styles.survAmt}>{shown ? formatAmount(thing.liters, units) : "???"}</div>
            </button>
          );
        })}
      </div>

      {phase === "over" && (
        <div className={styles.overBox}>
          <div className={styles.overTitle}>{OVER_TITLES[score % OVER_TITLES.length]}</div>
          <div className={styles.overSub}>You survived {score} rounds.</div>
          <button type="button" onClick={restart} className={styles.darkBtn}>
            Jump back in
          </button>
        </div>
      )}
      {phase === "reveal" && <div className={styles.winMsg}>{WIN_MSGS[score % WIN_MSGS.length]}</div>}
    </>
  );
}
