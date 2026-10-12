import Image from "next/image";
import { Bottle } from "./icons";
import { bottleCount, bottleFills, formatAmount, imageSrc, perBottle, unitWord, type Thing, type Units } from "@/lib/thing";
import styles from "./ThirstyApp.module.css";

export default function TapList({ things, units }: { things: Thing[]; units: Units }) {
  const rows = things.slice().sort((a, b) => a.liters - b.liters);

  return (
    <>
      <div className={styles.tapIntro}>
        <div className={styles.tapIntroText}>
          <h1 className={styles.heroTitle}>Everything you own is secretly thirsty.</h1>
          <p className={styles.heroLead}>
            How much water it takes to make everyday stuff, counted in bottles. Spoiler: your jeans drank about 53
            bathtubs.
          </p>
        </div>
        <div className={styles.legend}>
          <Bottle width={16} height={28} />
          <span>
            = {perBottle(units)} {unitWord(units)}
          </span>
        </div>
      </div>

      <div className={styles.rows}>
        {rows.map((thing) => (
          <div key={thing.name} className={`${styles.card} ${styles.row}`}>
            <div className={styles.rowName}>
              <Image src={imageSrc(thing)} alt="" width={64} height={64} className={styles.rowImg} />
              <div className={styles.minw0}>
                <div className={styles.rowTitle}>{thing.name}</div>
                <div className={styles.rowDesc}>{thing.description}</div>
              </div>
            </div>
            <div className={styles.rowBottles} aria-label={`${formatAmount(thing.liters, units)} in bottles`}>
              {(() => {
                const fills = bottleFills(thing.liters, units);
                const extra = bottleCount(thing.liters, units) - fills.length;
                return (
                  <>
                    {fills.map((fill, i) => (
                      <Bottle key={i} fill={fill} />
                    ))}
                    {extra > 0 && <span className={styles.moreBottles}>+{extra.toLocaleString("en-US")} more</span>}
                  </>
                );
              })()}
            </div>
            <div className={styles.rowAmt}>{formatAmount(thing.liters, units)}</div>
          </div>
        ))}
      </div>

      <p className={styles.footnote}>
        Figures are approximate global averages, mostly from the Water Footprint Network. They count rain, irrigation
        and the water needed to dilute pollution along the way.
      </p>
    </>
  );
}
