'use client';

import { useEffect, useId, useLayoutEffect, useReducer, useRef, useState } from 'react';
import { buttonClass } from '@/components/ui/Button';
import { LOYALTY } from '@/data/loyalty';
import { InkStamp } from '@/components/brand/InkStamp';
import { CoffeeMark, RubberStamp } from './StampArtwork';
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
import styles from './StampRitual.module.css';

const slots = Array.from({ length: STAMP_TARGET }, (_, index) => index);

function bringToFocus(button: HTMLButtonElement | null, block: ScrollLogicalPosition = 'center') {
  if (!button) return;
  button.focus({ preventScroll: true });
  const { top, bottom } = button.getBoundingClientRect();
  if (top < 70 || bottom > window.innerHeight - 84) {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    button.scrollIntoView({ block, behavior: reduce ? 'instant' : 'smooth' });
  }
}

export function StampRitual() {
  const [state, dispatch] = useReducer(ritualReducer, initialRitual);
  const [confirmReset, setConfirmReset] = useState(false);
  const id = useId();
  const stage = useRef<HTMLDivElement>(null);
  const restingStamp = useRef<HTMLDivElement>(null);
  const flyingStamp = useRef<HTMLDivElement>(null);
  const purchase = useRef<HTMLButtonElement>(null);
  const reset = useRef<HTMLButtonElement>(null);
  const cancelReset = useRef<HTMLButtonElement>(null);
  const paper = useRef<HTMLDivElement>(null);
  const seal = useRef<HTMLDivElement>(null);
  const ticket = useRef<HTMLDivElement>(null);
  const flipButton = useRef<HTMLButtonElement>(null);
  const previousPhase = useRef(state.phase);

  const stamping = isPressing(state);
  const complete = state.phase === 'complete';
  const unlocking = state.phase === 'unlocking';
  const activeSlot = state.phase === 'settling' ? state.stamps - 1 : state.stamps;
  const showTicket = unlocking || rewardAvailable(state);
  const canUndoOrReset = canCancel(state);
  const visibleStamps = state.phase === 'settling' ? state.stamps - 1 : state.stamps;
  const remaining = STAMP_TARGET - visibleStamps;
  const stampConfirmed = state.phase === 'earned' || complete;
  const showFreshInk = state.phase === 'settling' || stampConfirmed;
  const loaded = state.phase !== 'loading';

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

  useRitualMotion(stamping, complete, unlocking, stage, restingStamp, flyingStamp, paper, seal, ticket, dispatch);

  useLayoutEffect(() => {
    const previous = previousPhase.current;
    previousPhase.current = state.phase;
    if (state.phase === 'earned' || state.phase === 'redeemed') {
      if (
        !confirmReset &&
        (document.activeElement === document.body ||
          document.activeElement === purchase.current ||
          state.phase === 'redeemed')
      ) {
        bringToFocus(purchase.current);
      }
    } else if (state.phase === 'unlocked' && previous === 'unlocking' && !confirmReset)
      bringToFocus(flipButton.current, 'nearest');
    else if (state.phase === 'idle' && previous !== 'loading' && document.activeElement === document.body) {
      bringToFocus(purchase.current);
    }
  }, [confirmReset, state.phase]);

  useLayoutEffect(() => {
    if (confirmReset) cancelReset.current?.focus();
  }, [confirmReset]);

  return (
    <div ref={stage} className={styles.experience}>
      <div className={styles.cardColumn}>
        <div className={styles.cardStock}>
          <div ref={paper} className={styles.paper} data-ritual-card>
            <div className={styles.paperHeading}>
              <div>
                <p className={styles.wordmark}>Lumi Lane</p>
                <h2>Coffee Club</h2>
              </div>
              {showTicket ? (
                <div ref={seal} className={styles.seal}>
                  Reward
                  <br />
                  unlocked
                </div>
              ) : (
                <div className={styles.cardEdition} aria-hidden="true">
                  <CoffeeMark />
                  Demo card
                </div>
              )}
            </div>

            <ol className={styles.ledger} aria-label="Eight demo stamp positions">
              {slots.map((index) => {
                const filled = index < state.stamps;
                const active = stamping && index === activeSlot;
                return (
                  <li
                    key={index}
                    data-stamp-slot
                    data-filled={filled}
                    data-active={active}
                    data-struck={showFreshInk && index === state.stamps - 1}
                    className={styles.slot}
                  >
                    <span className="sr-only">
                      Stamp {index + 1}, {filled ? 'filled' : active ? 'in progress' : 'empty'}
                    </span>
                    <span className={styles.position} aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className={styles.imprint} aria-hidden="true">
                      <InkStamp id={`${id}-ink-${index}`} seed={index + 1} />
                    </span>
                  </li>
                );
              })}
            </ol>

            <div className={styles.cardBottom}>
              <div className={styles.progressLine}>
                <p>
                  <strong key={visibleStamps} className={stampConfirmed ? styles.counterTick : undefined}>
                    {visibleStamps}
                  </strong>
                  <span> / {STAMP_TARGET} stamps</span>
                </p>
                <p>{remaining ? `${remaining} ${remaining === 1 ? 'stamp' : 'stamps'} to go` : 'Card complete'}</p>
              </div>
              <div
                className={styles.progress}
                role="progressbar"
                aria-label="Demo stamp progress"
                aria-valuemin={0}
                aria-valuemax={STAMP_TARGET}
                aria-valuenow={visibleStamps}
              >
                <span style={{ width: `${(visibleStamps / STAMP_TARGET) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

        {showTicket && (
          <RewardTicket
            ticket={ticket}
            flipButton={flipButton}
            preview={state.phase === 'preview'}
            unlocking={unlocking}
            dispatch={dispatch}
          />
        )}
      </div>

      <section className={styles.controls} aria-labelledby="stamp-controls">
        <div className={styles.controlsHeading}>
          <h2 id="stamp-controls">Try the Demo</h2>
          <div
            ref={restingStamp}
            className={styles.restingStamp}
            aria-hidden="true"
            data-stamp-rest
            data-tool-in-use={stamping}
          >
            <RubberStamp id={`${id}-rest`} />
          </div>
        </div>
        <p className={styles.demoGuide}>{LOYALTY.demoGuide}</p>
        <button
          ref={purchase}
          type="button"
          className={buttonClass({ size: 'sm', className: styles.purchase })}
          disabled={!stamping && !canPurchase(state)}
          aria-disabled={stamping || undefined}
          onClick={() => {
            if (!canPurchase(state)) return;
            setConfirmReset(false);
            dispatch({ type: 'purchase' });
          }}
        >
          {LOYALTY.demoAction}
        </button>
        <div className={styles.receipt}>
          <div className={styles.receiptHeading}>
            <span>Demo receipt</span>
            {stampConfirmed && (
              <span className={styles.plus} aria-hidden="true">
                +1 stamp
              </span>
            )}
          </div>
          <p role="status" aria-atomic="true">
            {state.notice}
          </p>
        </div>
        <div className={styles.demoControls}>
          <button
            type="button"
            className={styles.textButton}
            disabled={!canLoadExample(state)}
            onClick={() => {
              setConfirmReset(false);
              dispatch({ type: 'example' });
            }}
          >
            Load 7/8 example
          </button>
          <button
            type="button"
            className={styles.textButton}
            disabled={!canUndoOrReset}
            onClick={() => {
              setConfirmReset(false);
              dispatch({ type: 'undo' });
            }}
          >
            Undo last stamp
          </button>
          <button
            ref={reset}
            type="button"
            className={styles.textButton}
            aria-expanded={confirmReset}
            aria-controls="reset-demo-confirmation"
            disabled={!canUndoOrReset}
            onClick={() => setConfirmReset(!confirmReset)}
          >
            Reset progress
          </button>
        </div>
        <div id="reset-demo-confirmation" className={styles.resetConfirm} hidden={!confirmReset}>
          <p>Clear this demo stamp card?</p>
          <button
            ref={cancelReset}
            type="button"
            className={styles.textButton}
            onClick={() => {
              setConfirmReset(false);
              reset.current?.focus();
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            className={styles.textButton}
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
      </section>
      {stamping && (
        <div ref={flyingStamp} className={styles.flyingStamp} aria-hidden="true" data-stamp-flight>
          <span className={styles.flightShadow} data-stamp-shadow />
          <span className={styles.flightShadowCore} data-stamp-shadow-core />
          <RubberStamp id={`${id}-flight`} />
        </div>
      )}
    </div>
  );
}
