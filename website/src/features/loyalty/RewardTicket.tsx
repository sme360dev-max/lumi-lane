import type { Dispatch, RefObject } from 'react';
import { LOYALTY } from '@/data/loyalty';
import { buttonClass } from '@/components/ui/Button';
import { CoffeeMark } from './StampArtwork';
import type { Action } from './ritualState';
import styles from './StampRitual.module.css';

export function RewardTicket({
  ticket,
  flipButton,
  preview,
  unlocking,
  dispatch,
}: {
  ticket: RefObject<HTMLDivElement | null>;
  flipButton: RefObject<HTMLButtonElement | null>;
  preview: boolean;
  unlocking: boolean;
  dispatch: Dispatch<Action>;
}) {
  return (
    <section className={styles.ticketSlot} aria-label="Demo reward ticket" aria-busy={unlocking}>
      <div ref={ticket} className={styles.ticketAssembly}>
        <div className={styles.ticketScene} data-flipped={preview} data-unlocking={unlocking}>
          <div className={styles.ticketCard}>
            <div className={styles.ticketFace} aria-hidden={preview}>
              <div>
                <p className={styles.printLabel}>Lumi Lane · Coffee Club</p>
                <h3>One standard coffee.</h3>
                <p className={styles.rewardNotice}>{LOYALTY.rewardNotice}</p>
              </div>
              <CoffeeMark className={styles.ticketMark} />
            </div>
            <div className={`${styles.ticketFace} ${styles.ticketBack}`} aria-hidden={!preview}>
              <div>
                <p className={styles.printLabel}>Proposed reward</p>
                <h3>The next coffee is the reward.</h3>
                <p>Demo redemption clears these eight stamps and starts a fresh card on this device.</p>
                <p className={styles.rewardNotice}>{LOYALTY.rewardNotice}</p>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.ticketActions}>
          <button
            ref={flipButton}
            type="button"
            className={styles.textButton}
            aria-pressed={preview}
            aria-label="Flip reward ticket"
            disabled={unlocking}
            onClick={() => dispatch({ type: 'flip' })}
          >
            {preview ? 'Show ticket front' : 'Flip reward ticket'}
          </button>
          <button
            type="button"
            className={styles.textButton}
            disabled={unlocking}
            onClick={() => dispatch({ type: 'replay' })}
          >
            Replay unlock
          </button>
          {preview && (
            <button type="button" className={buttonClass({ size: 'sm' })} onClick={() => dispatch({ type: 'redeem' })}>
              Redeem demo reward
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
