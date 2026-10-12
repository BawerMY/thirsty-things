"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { formatAmount, imageSrc, shuffle, toLiters, unitShort, unitWord, type Thing, type Units } from "@/lib/thing";
import styles from "./ThirstyApp.module.css";

function verdict(guessL: number, real: number) {
  const r = Math.max(guessL, 0.01) / real;
  const x = r < 1 ? 1 / r : r;
  const xs = x >= 10 ? Math.round(x).toLocaleString("en-US") : x.toFixed(1);
  if (x <= 1.25) return { title: "Hydro-psychic! Are you secretly a cloud?", sub: "That is basically spot on." };
  if (r < 1 && x <= 2) return { title: "Close, but a bit dry.", sub: `It drank more than that. About ${xs}× more.` };
  if (r > 1 && x <= 2) return { title: "Close, but a bit soggy.", sub: `It drank less than that. About ${xs}× less.` };
  if (r < 1) return { title: "Bone dry! Off by a whole river.", sub: `Reality is ${xs}× thirstier than your guess.` };
  return { title: "Flood warning! Way too wet.", sub: `You guessed ${xs}× more than it actually needs.` };
}

/** 100 points for a perfect guess, minus 100 per order of magnitude off. */
function score(guessL: number, real: number) {
  return Math.max(0, Math.round(100 - Math.abs(Math.log10(Math.max(guessL, 0.01) / real)) * 100));
}

export default function GuessTheGulp({ things, units }: { things: Thing[]; units: Units }) {
  const [order, setOrder] = useState(() => things.map((_, i) => i));
  const [round, setRound] = useState(0);
  const [input, setInput] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [guessL, setGuessL] = useState(0);
  const [points, setPoints] = useState(0);
  const [shownPoints, setShownPoints] = useState(0);
  const [lastPoints, setLastPoints] = useState(0);
  const raf = useRef(0);

  // Shuffle after mount so server and client render the same first item.
  useEffect(() => setOrder((o) => shuffle(o)), []);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  // A typed guess means nothing once the units change.
  useEffect(() => setInput(""), [units]);

  if (things.length === 0) return null;
  const item = things[order[round % order.length]];

  const submit = () => {
    const g = parseFloat(input);
    if (!(g >= 0)) return;
    const gL = toLiters(g, units);
    const pts = score(gL, item.liters);
    const from = points;
    const to = from + pts;
    setGuessL(gL);
    setLastPoints(pts);
    setPoints(to);
    setRevealed(true);

    cancelAnimationFrame(raf.current);
    const t0 = performance.now();
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / 900);
      const eased = 1 - Math.pow(1 - k, 3);
      setShownPoints(Math.round(from + (to - from) * eased));
      if (k < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  };

  const next = () => {
    if (round + 1 >= order.length) {
      setOrder((o) => shuffle(o));
      setRound(0);
    } else {
      setRound(round + 1);
    }
    setRevealed(false);
    setInput("");
  };

  const max = Math.max(guessL, item.liters) || 1;
  const v = verdict(guessL, item.liters);

  return (
    <>
      <div className={styles.gameHead}>
        <h1 className={styles.gameTitle}>Guess the Gulp</h1>
        <div className={styles.scoreboard}>
          <div className={styles.scoreMain}>
            <span className={styles.scoreLabel}>Splash points</span>
            <span className={styles.scoreValue}>{shownPoints}</span>
          </div>
          <div className={styles.scoreSide}>
            <span className={`${styles.scoreLabel} ${styles.muted}`}>Round</span>
            <span className={styles.scoreSideValue}>{round + 1}</span>
          </div>
        </div>
      </div>

      <div className={`${styles.card} ${styles.guessCard}`}>
        <div className={styles.guessImgWrap}>
          <Image src={imageSrc(item)} alt="" width={260} height={260} className={styles.guessImg} />
        </div>
        <div className={styles.guessBody}>
          <div className={styles.guessKicker}>How thirsty is</div>
          <div className={styles.guessQuestion}>{item.name}?</div>
          <div className={styles.guessHint}>Guess how many {unitWord(units)} it took to make it.</div>

          {!revealed ? (
            <div className={styles.guessForm}>
              <label className={styles.guessInputWrap}>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 500"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submit()}
                  className={styles.guessInput}
                  aria-label={`Your guess in ${unitWord(units)}`}
                />
                <span className={styles.guessUnit}>{unitShort(units)}</span>
              </label>
              <button type="button" onClick={submit} className={styles.splashBtn}>
                Splash it ↵
              </button>
            </div>
          ) : (
            <>
              <div className={styles.verdictTitle}>{v.title}</div>
              <div className={styles.verdictSub}>{v.sub}</div>
              <div className={styles.bars}>
                <span>You</span>
                <div className={styles.barTrack}>
                  <div className={styles.barGuess} style={{ width: `${(guessL / max) * 100}%` }} />
                </div>
                <span className={styles.tabular}>{formatAmount(guessL, units)}</span>
                <span>Reality</span>
                <div className={styles.barTrack}>
                  <div className={styles.barReal} style={{ width: `${(item.liters / max) * 100}%` }} />
                </div>
                <span className={`${styles.tabular} ${styles.bold}`}>{formatAmount(item.liters, units)}</span>
              </div>
              <div className={styles.nextRow}>
                <button type="button" onClick={next} className={styles.darkBtn}>
                  Next thirsty thing →
                </button>
                <span className={styles.lastPts}>+{lastPoints} splash points</span>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
