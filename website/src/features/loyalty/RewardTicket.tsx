import type { Dispatch, RefObject } from 'react';
import { LOYALTY } from '@/data/loyalty';
import { TicketStub } from './ClubCard';
import type { Action } from './ritualState';
import styles from './Loyalty.module.css';

/**
 * The demo reward stub that tears off a full card. Front: the proposed reward. "Flip reward ticket"
 * shows how redemption could work, and only from there can the demo reward be redeemed
 * (the reducer redeems from 'preview' only).
 */
export function RewardTicket({
  ticket,
  flipButton,
  redeemButton,
  preview,
  unlocking,
  dispatch,
}: {
  ticket: RefObject<HTMLDivElement | null>;
  flipButton: RefObject<HTMLButtonElement | null>;
  redeemButton: RefObject<HTMLButtonElement | null>;
  preview: boolean;
  unlocking: boolean;
  dispatch: Dispatch<Action>;
}) {
  const { reward } = LOYALTY;
  return (
    <section className={styles.ticketRegion} aria-label="Demo reward ticket" aria-busy={unlocking}>
      <div ref={ticket}>
        <TicketStub className={styles.demoStub}>
          {preview ? (
            <div className={styles.stubBody}>
              <p className={styles.stubLabel}>How it could work</p>
              <h3 className={styles.stubHeading}>{reward.backTitle}</h3>
              <p className={styles.stubText}>{reward.backCopy}</p>
              <p className={styles.stubNotice}>{reward.notice}</p>
            </div>
          ) : (
            <div className={styles.stubBody}>
              <p className={styles.stubLabel}>{reward.label}</p>
              <h3 className={styles.stubHeading}>{reward.title}</h3>
              <p className={styles.stubNotice}>{reward.notice}</p>
            </div>
          )}
        </TicketStub>
        <div className={styles.ticketActions}>
          {preview && (
            <button
              ref={redeemButton}
              type="button"
              className={styles.primary}
              onClick={() => dispatch({ type: 'redeem' })}
            >
              Redeem demo reward
            </button>
          )}
          <div className={styles.textLinks}>
            <button
              ref={flipButton}
              type="button"
              className={styles.textLink}
              aria-pressed={preview}
              aria-label="Flip reward ticket"
              disabled={unlocking}
              onClick={() => dispatch({ type: 'flip' })}
            >
              {preview ? 'Show ticket front' : 'Flip reward ticket'}
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              className={styles.textLink}
              disabled={unlocking}
              onClick={() => dispatch({ type: 'replay' })}
            >
              Replay unlock
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
