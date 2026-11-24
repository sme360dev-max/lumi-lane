'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef, type RefObject } from 'react';
import styles from './HomeIndex.module.css';

/** Desktop pointer layout with motion allowed: the only place the hero → index flight runs. */
export const DESKTOP_MOTION =
  '(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';

const LAND = 0.84; // progress at which the clone sits on the slot
const FADE = 0.13; // cross-fade length after landing

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeFlight = gsap.parseEase('power2.inOut');

/**
 * Read-only lookup of the hero's front dish: the most opaque plate with the highest stacking order.
 * The hero wheel itself is never touched.
 */
function findFrontDish(): HTMLImageElement | null {
  let best: HTMLImageElement | null = null;
  let bestScore = -Infinity;
  document.querySelectorAll<HTMLImageElement>('.hero-dish').forEach((dish) => {
    const style = getComputedStyle(dish);
    const opacity = Number.parseFloat(style.opacity) || 0;
    if (opacity < 0.5 || !dish.currentSrc) return;
    const score = (Number.parseInt(style.zIndex, 10) || 0) * 10 + opacity;
    if (score > bestScore) {
      bestScore = score;
      best = dish;
    }
  });
  return best;
}

interface HeroHandoffProps {
  /** The index image slot (measured, never moved). */
  slotRef: RefObject<HTMLElement | null>;
  /** Wrapper around the real index images; faded in as the clone fades out. */
  revealRef: RefObject<HTMLElement | null>;
  /** The index section; the flight lands when its top reaches the top of the viewport. */
  sectionRef: RefObject<HTMLElement | null>;
}

/**
 * As the hero scrolls away, a clone of its front dish flies (FLIP-style, scrubbed by scroll)
 * from the dish's rect into the index slot, then hands off to the real index image.
 * Desktop pointer + motion only; owns a fixed, click-through layer and cleans everything up.
 */
export function HeroHandoff({ slotRef, revealRef, sectionRef }: HeroHandoffProps) {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    const slot = slotRef.current;
    const reveal = revealRef.current;
    const section = sectionRef.current;
    const hero = document.getElementById('hero-headline')?.closest('section');
    if (!layer || !slot || !reveal || !section || !hero) return;

    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add(DESKTOP_MOTION, () => {
      const clone = document.createElement('img');
      clone.alt = '';
      clone.setAttribute('aria-hidden', 'true');
      clone.draggable = false;
      clone.decoding = 'sync';
      clone.className = styles.clone ?? '';
      // Appended only once it has a source, so the page never holds an empty <img>.

      // Document-space rect of the dish, captured once per flight (the dish scrolls with the page).
      let from: { x: number; y: number; w: number } | null = null;
      let size = 0;
      const state = { p: 0 };

      const apply = () => {
        const p = state.p;
        if (p <= 0.001) {
          // Back at the top: drop the capture so the next flight picks the then-front dish.
          from = null;
          clone.style.visibility = 'hidden';
          reveal.style.opacity = '0';
          return;
        }
        if (!from) {
          const dish = findFrontDish();
          if (dish) {
            const r = dish.getBoundingClientRect();
            from = { x: r.left + window.scrollX, y: r.top + window.scrollY, w: r.width };
            if (clone.src !== dish.currentSrc) clone.src = dish.currentSrc;
            if (!clone.isConnected) layer.appendChild(clone);
          }
        }

        // Real image comes up first, then the clone lets go, so the slot never reads half-empty.
        reveal.style.opacity = String(clamp01((p - LAND) / (FADE * 0.6)));
        if (!from || p >= 0.999) {
          clone.style.visibility = 'hidden';
          return;
        }

        const to = slot.getBoundingClientRect();
        if (Math.abs(to.width - size) > 0.5) {
          size = to.width;
          clone.style.width = `${size}px`;
          clone.style.height = `${size}px`;
        }
        const t = easeFlight(clamp01(p / LAND));
        const x = lerp(from.x - window.scrollX, to.left, t);
        const y = lerp(from.y - window.scrollY, to.top, t);
        const scale = lerp(from.w / size, 1, t);
        clone.style.transform = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) scale(${scale.toFixed(4)})`;
        clone.style.opacity = String(1 - clamp01((p - LAND - FADE * 0.4) / (FADE * 0.6)));
        clone.style.visibility = 'visible';
      };

      gsap.to(state, {
        p: 1,
        ease: 'none',
        onUpdate: apply,
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          endTrigger: section,
          end: 'top top',
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
      apply();

      return () => {
        clone.remove();
        reveal.style.opacity = '';
      };
    });

    return () => mm.revert();
  }, [slotRef, revealRef, sectionRef]);

  return <div ref={layerRef} aria-hidden="true" className={styles.flight} />;
}
