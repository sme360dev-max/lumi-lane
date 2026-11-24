'use client';

import { useEffect, useLayoutEffect, useReducer, useRef, useState } from 'react';
import { LOYALTY } from '@/data/loyalty';
import { ClubCard } from './ClubCard';
import { RewardTicket } from './RewardTicket';
import {
  canCancel,
  canLoadExample,
  canPurchase,
  initialRitual,
  isPressing,
  rewardAvailable,
  ritualReducer,
  STAMP_TARGET,
  STORAGE_KEY,
} from './ritualState';
import { useRitualMotion } from './useRitualMotion';
import styles from './Loyalty.module.css';

function bringToFocus(element: HTMLElement | null, block: ScrollLogicalPosition = 'center') {
  if (!element) return;
  element.focus({ preventScroll: true });
  const { top, bottom } = element.getBoundingClientRect();
  if (top < 80 || bottom > window.innerHeight - 140) {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    element.scrollIntoView({ block, behavior: reduce ? 'instant' : 'smooth' });
  }
}

/**
 * "Try it yourself": the demo card bound to `ritualReducer`. One demo purchase is exactly one
 * stamp (see useRitualMotion); progress is kept in localStorage under STORAGE_KEY.
 */
export function StampDemo() {
  const [state, dispatch] = useReducer(ritualReducer, initialRitual);
  const [confirmReset, setConfirmReset] = useState(false);
  const card = useRef<HTMLDivElement>(null);
  const purchase = useRef<HTMLButtonElement>(null);
  const reset = useRef<HTMLButtonElement>(null);
  const cancelReset = useRef<HTMLButtonElement>(null);
  const ticket = useRef<HTMLDivElement>(null);
  const flipButton = useRef<HTMLButtonElement>(null);
  const redeemButton = useRef<HTMLButtonElement>(null);
  const previousPhase = useRef(state.phase);

  const stamping = isPressing(state);
  const complete = state.phase === 'complete';
  const unlocking = state.phase === 'unlocking';
  const showTicket = unlocking || rewardAvailable(state);
  const canUndoOrReset = canCancel(state);
  // During 'settling' the ink is on the card but the count only ticks over when the press settles.
  const visibleStamps = state.phase === 'settling' ? state.stamps - 1 : state.stamps;
  const activeSlot = stamping ? visibleStamps : -1;
  const stampConfirmed = state.phase === 'earned' || complete;
  const loaded = state.phase !== 'loading';
  const notice = state.notice === initialRitual.notice ? LOYALTY.demo.empty : state.notice;

  useEffect(() => {
    const load = window.setTimeout(() => {
      let stored = null;
      try {
        stored = window.localStorage.getItem(STORAGE_KEY);
      } catch {
        /* Storage is optional. */
      }
      dispatch({ type: 'restore', stored });
    }, 0);
    return () => window.clearTimeout(load);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, String(state.stamps));
    } catch {
      /* Storage is optional. */
    }
  }, [loaded, state.stamps]);

  useRitualMotion({ stamping, complete, unlocking, card, ticket, dispatch });

  useLayoutEffect(() => {
    const previous = previousPhase.current;
    previousPhase.current = state.phase;
    if (confirmReset) return;
    if (state.phase === 'earned' || state.phase === 'redeemed') {
      if (
        state.phase === 'redeemed' ||
        document.activeElement === document.body ||
        document.activeElement === purchase.current
      ) {
        bringToFocus(purchase.current);
      }
    } else if (state.phase === 'unlocked' && previous === 'unlocking') {
      bringToFocus(flipButton.current, 'nearest');
    } else if (state.phase === 'preview' && previous === 'unlocked' && document.activeElement === document.body) {
      bringToFocus(redeemButton.current, 'nearest');
    } else if (state.phase === 'idle' && previous !== 'loading' && document.activeElement === document.body) {
      bringToFocus(purchase.current);
    }
  }, [confirmReset, state.phase]);

  useLayoutEffect(() => {
    if (confirmReset) cancelReset.current?.focus();
  }, [confirmReset]);

  return (
    <section id="try-it" tabIndex={-1} className={styles.demo} aria-labelledby="demo-title">
      <div className={styles.demoHead}>
        <h2 id="demo-title" className={styles.h2}>
          {LOYALTY.demo.title}
        </h2>
        <p className={styles.lede}>{LOYALTY.demo.intro}</p>
      </div>

      <div className={styles.demoGrid}>
        <div className={styles.demoCard}>
          <ClubCard
            id="demo-card"
            cardRef={card}
            filled={state.stamps}
            active={activeSlot}
            describeSlots
            tag="Demo"
            className={styles.demoClubCard}
          />
          {showTicket && (
            <RewardTicket
              ticket={ticket}
              flipButton={flipButton}
              redeemButton={redeemButton}
              preview={state.phase === 'preview'}
              unlocking={unlocking}
              dispatch={dispatch}
            />
          )}
        </div>

        <div className={styles.demoControls}>
          <div className={styles.count}>
            <p>
              <span className={styles.countValue}>{visibleStamps}</span>
              <span className={styles.countOf}> / {STAMP_TARGET} stamps</span>
              {stampConfirmed && (
                <span key={visibleStamps} className={styles.plusOne} aria-hidden="true">
                  +1 stamp
                </span>
              )}
            </p>
            <div
              className={styles.progress}
              role="progressbar"
              aria-label="Demo stamp progress"
              aria-valuemin={0}
              aria-valuemax={STAMP_TARGET}
              aria-valuenow={visibleStamps}
            >
              <span style={{ transform: `scaleX(${visibleStamps / STAMP_TARGET})` }} />
            </div>
          </div>

          <button
            ref={purchase}
            type="button"
            className={styles.primary}
            disabled={!stamping && !canPurchase(state)}
            aria-disabled={stamping || undefined}
            onClick={() => {
              if (!canPurchase(state)) return;
              setConfirmReset(false);
              dispatch({ type: 'purchase' });
            }}
          >
            {LOYALTY.demo.action}
          </button>

          <p className={styles.status} role="status" aria-atomic="true">
            {notice}
          </p>

          <div className={styles.textLinks}>
            <button
              type="button"
              className={styles.textLink}
              disabled={!canLoadExample(state)}
              onClick={() => {
                setConfirmReset(false);
                dispatch({ type: 'example' });
              }}
            >
              Load 7/8 example
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              className={styles.textLink}
              disabled={!canUndoOrReset}
              onClick={() => {
                setConfirmReset(false);
                dispatch({ type: 'undo' });
              }}
            >
              Undo last stamp
            </button>
            <span aria-hidden="true">·</span>
            <button
              ref={reset}
              type="button"
              className={styles.textLink}
              aria-expanded={confirmReset}
              aria-controls="reset-demo-confirmation"
              disabled={!canUndoOrReset}
              onClick={() => setConfirmReset(!confirmReset)}
            >
              Reset
            </button>
          </div>

          <div id="reset-demo-confirmation" className={styles.resetConfirm} hidden={!confirmReset}>
            <p>Clear this demo card?</p>
            <div className={styles.textLinks}>
              <button
                ref={cancelReset}
                type="button"
                className={styles.textLink}
                onClick={() => {
                  setConfirmReset(false);
                  reset.current?.focus();
                }}
              >
                Cancel
              </button>
              <span aria-hidden="true">·</span>
              <button
                type="button"
                className={`${styles.textLink} ${styles.danger}`}
                disabled={!canUndoOrReset}
                onClick={() => {
                  setConfirmReset(false);
                  dispatch({ type: 'reset' });
                  bringToFocus(purchase.current);
                }}
              >
                Reset demo card
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
