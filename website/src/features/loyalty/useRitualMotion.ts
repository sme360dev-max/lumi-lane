import { useLayoutEffect, type Dispatch, type RefObject } from 'react';
import { gsap } from 'gsap';
import type { Action } from './ritualState';

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Run `step` on the next microtask unless the effect was cleaned up first. */
function soon(step: () => void) {
  let live = true;
  queueMicrotask(() => {
    if (live) step();
  });
  return () => {
    live = false;
  };
}

/**
 * Drives the demo card's timed phases. Each effect owns one phase window and dispatches the
 * reducer action that ends it, exactly once:
 *
 * - stamping ('pressing' → 'settling'): a ≤0.7s press on the active slot. One `impact` at contact
 *   (the stamp is counted there) and one `settle` when the timeline completes. The effect stays
 *   mounted across both phases, so it never restarts mid-press. Undo/reset end the phase, the
 *   cleanup kills the timeline, and neither call can fire afterwards. The reducer also ignores an
 *   `impact` outside 'pressing' and a `settle` outside 'settling', so a stray call cannot double count.
 * - complete: a short pause, then `reveal`.
 * - unlocking: the reward stub slides out from under the card, then `unlock`.
 *
 * Under reduced motion every step dispatches on the next microtask with no animation.
 */
export function useRitualMotion({
  stamping,
  complete,
  unlocking,
  card,
  ticket,
  dispatch,
}: {
  stamping: boolean;
  complete: boolean;
  unlocking: boolean;
  card: RefObject<HTMLElement | null>;
  ticket: RefObject<HTMLElement | null>;
  dispatch: Dispatch<Action>;
}) {
  useLayoutEffect(() => {
    if (!stamping) return;
    const impact = () => dispatch({ type: 'impact' });
    const settle = () => dispatch({ type: 'settle' });
    const slot = card.current?.querySelector<HTMLElement>('[data-stamp-slot][data-active="true"]');
    const ink = slot?.querySelector('[data-ink]');
    const ring = slot?.querySelector('[data-ring]');
    if (reducedMotion() || !slot || !ink || !ring) {
      return soon(() => {
        impact();
        settle();
      });
    }

    // On small screens the button can sit below the card: bring the slot into view, minimally.
    const box = slot.getBoundingClientRect();
    if (box.top < 88 || box.bottom > window.innerHeight - 100)
      slot.scrollIntoView({ block: 'nearest', behavior: 'smooth' });

    const context = gsap.context(() => {
      gsap
        .timeline({ onComplete: settle })
        .to(ring, { scale: 0.86, duration: 0.24, ease: 'power2.in' })
        .addLabel('contact')
        .call(impact, [], 'contact')
        .fromTo(
          ink,
          { opacity: 0, scale: 1.15 },
          { opacity: 1, scale: 1, duration: 0.2, ease: 'power3.out', immediateRender: false },
          'contact',
        )
        .to(ring, { scale: 1, duration: 0.26, ease: 'power2.out' }, 'contact')
        .to({}, { duration: 0.14 });
    });
    return () => context.revert();
  }, [card, dispatch, stamping]);

  useLayoutEffect(() => {
    if (!complete) return;
    if (reducedMotion()) return soon(() => dispatch({ type: 'reveal' }));
    const pause = gsap.delayedCall(0.45, () => dispatch({ type: 'reveal' }));
    return () => {
      pause.kill();
    };
  }, [complete, dispatch]);

  useLayoutEffect(() => {
    if (!unlocking) return;
    const finish = () => dispatch({ type: 'unlock' });
    const stub = ticket.current;
    if (reducedMotion() || !stub) return soon(finish);

    const context = gsap.context(() => {
      gsap.fromTo(
        stub,
        { y: -28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.62, ease: 'power3.out', onComplete: finish },
      );
    });
    return () => context.revert();
  }, [dispatch, ticket, unlocking]);
}
