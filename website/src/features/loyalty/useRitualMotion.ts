import { useLayoutEffect, type Dispatch, type RefObject } from 'react';
import { gsap } from 'gsap';
import type { Action } from './ritualState';

type ElementRef = RefObject<HTMLElement | null>;

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function useRitualMotion(
  stamping: boolean,
  complete: boolean,
  unlocking: boolean,
  stageRef: ElementRef,
  rest: ElementRef,
  tool: ElementRef,
  paper: ElementRef,
  seal: ElementRef,
  ticket: ElementRef,
  dispatch: Dispatch<Action>,
) {
  useLayoutEffect(() => {
    if (!stamping) return;

    const stageElement = stageRef.current;
    const restingStamp = rest.current;
    const art = tool.current;
    const card = paper.current;
    const slot = card?.querySelector('[data-stamp-slot][data-active=true]');
    const impact = () => dispatch({ type: 'impact' });
    const settle = () => dispatch({ type: 'settle' });
    if (reducedMotion() || !stageElement || !restingStamp || !art || !slot || !card) {
      const quick = gsap.delayedCall(0, () => {
        impact();
        settle();
      });
      return () => {
        quick.kill();
      };
    }

    const stage = gsap.context(() => {
      const frame = stageElement.getBoundingClientRect();
      const cradle = restingStamp.getBoundingClientRect();
      const target = slot.getBoundingClientRect();
      const width = restingStamp.offsetWidth;
      const startX = cradle.left + cradle.width / 2 - frame.left - width / 2;
      const startY = cradle.top + cradle.height / 2 - frame.top - width / 2;
      const targetX = target.left + target.width / 2 - frame.left - width / 2;
      // The rubber edge sits at 97% of the square SVG viewBox.
      const contactY = target.top + target.height / 2 - frame.top - width * 0.97;
      const hoverY = contactY - 24;
      const shadow = art.querySelector('[data-stamp-shadow]');
      const shadowCore = art.querySelector('[data-stamp-shadow-core]');

      if (target.top < 88 || target.bottom > window.innerHeight - 98) {
        slot.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }

      gsap.set(art, { width, x: startX, y: startY, rotate: 10, visibility: 'visible' });
      const timeline = gsap.timeline({ onComplete: settle });
      timeline
        .addLabel('lift')
        .to(art, { y: startY - 15, rotate: 4, duration: 0.2, ease: 'power2.out' })
        .to(art, { x: targetX, y: hoverY, rotate: -5, duration: 0.44, ease: 'power2.inOut' })
        .to(art, { y: contactY, rotate: 0, duration: 0.16, ease: 'power4.in' })
        .addLabel('contact')
        .call(impact, [], 'contact')
        .to(art, { y: contactY + 1.5, scaleY: 0.955, duration: 0.065, ease: 'power2.out' }, 'contact')
        .to(card, { x: 0.7, y: 1.9, scaleY: 0.994, duration: 0.055 }, 'contact')
        .to(card, { x: -0.45, y: -0.6, scaleY: 1.001, duration: 0.105, ease: 'power2.out' }, 'contact+=0.055')
        .to(card, { x: 0, y: 0, scaleY: 1, duration: 0.2, ease: 'power2.out' }, 'contact+=0.16')
        .to(art, { y: hoverY + 3, rotate: 2, scaleY: 1, duration: 0.22, ease: 'power3.out' }, 'contact+=0.08')
        .addLabel('return', 'contact+=0.3')
        .to(art, { x: startX, y: startY - 12, rotate: 9, duration: 0.43, ease: 'power2.inOut' }, 'return')
        .to(art, { y: startY, rotate: 10, duration: 0.22, ease: 'sine.out' });

      if (shadow) {
        // Visual only: a soft outer blur that widens as the rubber nears the paper, plus a sharp core
        // that only darkens at contact. Same positions/durations as before; nothing here dispatches.
        timeline
          .to(shadow, { opacity: 0.1, scaleX: 0.72, duration: 0.22 }, 'lift')
          .to(shadow, { opacity: 0.26, scaleX: 1.2, duration: 0.11 }, 'contact-=0.075')
          .to(shadow, { opacity: 0.14, scaleX: 0.8, duration: 0.19 }, 'contact+=0.09');
        if (shadowCore) {
          timeline
            .to(shadowCore, { opacity: 0.05, scaleX: 0.55, duration: 0.22 }, 'lift')
            .to(shadowCore, { opacity: 0.62, scaleX: 1, duration: 0.11 }, 'contact-=0.075')
            .to(shadowCore, { opacity: 0.06, scaleX: 0.6, duration: 0.19 }, 'contact+=0.09');
        }
      }
    });
    return () => stage.revert();
  }, [dispatch, paper, rest, stageRef, stamping, tool]);

  useLayoutEffect(() => {
    if (!complete) return;
    const pause = gsap.delayedCall(reducedMotion() ? 0 : 0.52, () => dispatch({ type: 'reveal' }));
    return () => {
      pause.kill();
    };
  }, [complete, dispatch]);

  useLayoutEffect(() => {
    if (!unlocking) return;

    const badge = seal.current;
    const reward = ticket.current;
    const finish = () => dispatch({ type: 'unlock' });
    if (reducedMotion() || !badge || !reward) {
      const quick = gsap.delayedCall(0, finish);
      return () => {
        quick.kill();
      };
    }

    const stage = gsap.context(() => {
      gsap
        .timeline({ onComplete: finish })
        .fromTo(
          badge,
          { opacity: 0, scale: 1.17, rotate: -6 },
          { opacity: 1, scale: 1, rotate: 0, duration: 0.47, ease: 'power3.out' },
        )
        .fromTo(
          reward,
          { yPercent: -102, opacity: 0.7 },
          { yPercent: 0, opacity: 1, duration: 0.82, ease: 'power3.out' },
          0.25,
        );
    });
    return () => stage.revert();
  }, [dispatch, seal, ticket, unlocking]);
}
