import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { InkStamp } from '@/components/brand/InkStamp';
import { STAMP_TARGET } from './ritualState';
import styles from './Loyalty.module.css';

const SLOTS = Array.from({ length: STAMP_TARGET }, (_, index) => index);

interface ClubCardProps {
  /** Unique prefix for the InkStamp SVG ids on this card. */
  id: string;
  /** How many slots carry an ink stamp. */
  filled?: number;
  /** Slot currently being stamped (demo only), or -1. */
  active?: number;
  /** Announce each slot to assistive tech (demo card). Decorative cards stay silent. */
  describeSlots?: boolean;
  /** Small label in the top-right corner, e.g. "Demo". */
  tag?: string;
  className?: string;
  cardRef?: Ref<HTMLDivElement>;
}

/**
 * The flat cream Coffee Club card: wordmark, a small ink-stamp logo and eight thin circles.
 * Filled slots carry an ember InkStamp. Purely presentational; the demo and the scroll story drive it.
 */
export function ClubCard({
  id,
  filled = 0,
  active = -1,
  describeSlots = false,
  tag,
  className,
  cardRef,
}: ClubCardProps) {
  return (
    <div ref={cardRef} className={`${styles.card} ${className ?? ''}`} data-club-card>
      <div className={styles.cardTop}>
        <InkStamp id={`${id}-logo`} seed={3} className={styles.cardLogo} />
        <p className={styles.cardName}>
          Lumi Lane <span aria-hidden="true">·</span> Coffee Club
        </p>
        {tag && <p className={styles.cardTag}>{tag}</p>}
      </div>
      <ol className={styles.slots} aria-label={describeSlots ? `${STAMP_TARGET} demo stamp positions` : undefined}>
        {SLOTS.map((index) => {
          const isFilled = index < filled;
          const isActive = index === active;
          return (
            <li
              key={index}
              className={styles.slot}
              data-stamp-slot={describeSlots || undefined}
              data-filled={isFilled}
              data-active={isActive}
            >
              <span className={styles.ring} data-ring aria-hidden="true" />
              <span className={styles.ink} data-ink aria-hidden="true">
                <InkStamp id={`${id}-ink-${index}`} seed={index + 1} />
              </span>
              {describeSlots && (
                <span className="sr-only">
                  Stamp {index + 1}, {isFilled ? 'filled' : isActive ? 'in progress' : 'empty'}
                </span>
              )}
            </li>
          );
        })}
      </ol>
      <p className={styles.cardFoot}>
        <span>Eight stamps</span>
        <span>One coffee on us</span>
      </p>
    </div>
  );
}

/** The tear-off reward stub: same cream stock, perforated top edge. */
export function TicketStub({
  className,
  children,
  ...rest
}: { className?: string; children: ReactNode } & HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`${styles.stub} ${className ?? ''}`} {...rest}>
      {children}
    </div>
  );
}
