import { LOYALTY } from '@/data/loyalty';
import { STAMP_TARGET } from './ritualState';
import styles from './Loyalty.module.css';

const SAMPLE = 5; // illustrative stamp count for both previews
const dots = Array.from({ length: STAMP_TARGET }, (_, index) => index < SAMPLE);

function Dots({ className }: { className?: string }) {
  return (
    <span className={`${styles.miniDots} ${className ?? ''}`} aria-hidden="true">
      {dots.map((filled, index) => (
        <span key={index} data-filled={filled} />
      ))}
    </span>
  );
}

/**
 * "At the counter": two flat illustrations of how a card might be shown in the café. Drawn in
 * CSS only. Neither carries a code: the programme has no issued cards, barcodes or passes.
 */
export function CounterPreview() {
  const { counter } = LOYALTY;
  return (
    <section className={styles.counter} aria-labelledby="counter-title">
      <div className={styles.demoHead}>
        <h2 id="counter-title" className={styles.h2}>
          {counter.title}
        </h2>
        <p className={styles.lede}>{counter.intro}</p>
      </div>

      <div className={styles.counterGrid}>
        <figure className={styles.counterItem}>
          <div
            className={styles.phone}
            role="img"
            aria-label={`Illustration: a phone showing a sample Coffee Club card with ${SAMPLE} of ${STAMP_TARGET} stamps, to show the barista`}
          >
            <span className={styles.phoneSpeaker} />
            <span className={styles.phoneScreen}>
              <span className={styles.phoneWordmark}>Lumi Lane</span>
              <span className={styles.phoneLabel}>Coffee Club</span>
              <span className={styles.phoneCard}>
                <Dots />
                <span className={styles.phoneCount}>
                  {SAMPLE} of {STAMP_TARGET} stamps
                </span>
              </span>
              <span className={styles.phoneNext}>{STAMP_TARGET - SAMPLE} more for a free coffee</span>
              <span className={styles.phoneHint}>Show this to the barista</span>
            </span>
          </div>
          <figcaption>
            <span className={styles.previewLabel}>{counter.previewLabel}</span>
            {counter.phoneCaption}
          </figcaption>
        </figure>

        <figure className={styles.counterItem}>
          <div
            className={styles.pass}
            role="img"
            aria-label={`Illustration: a sample wallet pass with ${SAMPLE} of ${STAMP_TARGET} stamps and an empty code area, not issued`}
          >
            <span className={styles.passHead}>
              <span className={styles.phoneWordmark}>Lumi Lane</span>
              <span className={styles.phoneLabel}>Coffee Club</span>
            </span>
            <span className={styles.passFields}>
              <span>
                <span className={styles.passKey}>Stamps</span>
                <span className={styles.passValue}>
                  {SAMPLE} / {STAMP_TARGET}
                </span>
              </span>
              <span>
                <span className={styles.passKey}>Reward</span>
                <span className={styles.passValue}>One coffee</span>
              </span>
            </span>
            <Dots className={styles.passDots} />
            <span className={styles.codeArea}>{counter.codeArea}</span>
          </div>
          <figcaption>
            <span className={styles.previewLabel}>{counter.previewLabel}</span>
            {counter.passCaption}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
