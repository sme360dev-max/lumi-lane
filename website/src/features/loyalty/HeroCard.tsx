'use client';

import { useEffect, useRef } from 'react';
import { ClubCard } from './ClubCard';
import styles from './Loyalty.module.css';

const MAX_TILT = 4; // degrees
const FINE_POINTER = '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';

/**
 * The hero Coffee Club card. On a desktop pointer it leans up to 4° towards the cursor
 * (rAF lerp, transform only) and eases back flat when the pointer leaves the hero.
 * Touch devices and reduced motion get a still card.
 */
export function HeroCard() {
  const tilt = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = tilt.current;
    const area = element?.closest('section');
    if (!element || !area) return;
    const query = window.matchMedia(FINE_POINTER);
    let frame = 0;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };

    const render = () => {
      current.x += (target.x - current.x) * 0.1;
      current.y += (target.y - current.y) * 0.1;
      element.style.transform = `perspective(1400px) rotateX(${current.x.toFixed(3)}deg) rotateY(${current.y.toFixed(3)}deg)`;
      const settled = Math.abs(target.x - current.x) < 0.01 && Math.abs(target.y - current.y) < 0.01;
      frame = settled ? 0 : window.requestAnimationFrame(render);
      if (settled && target.x === 0 && target.y === 0) element.style.transform = '';
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(render);
    };
    const move = (event: PointerEvent) => {
      if (!query.matches || event.pointerType !== 'mouse') return;
      const box = element.getBoundingClientRect();
      const dx = (event.clientX - (box.left + box.width / 2)) / (window.innerWidth / 2);
      const dy = (event.clientY - (box.top + box.height / 2)) / (window.innerHeight / 2);
      const clamp = (value: number) => Math.max(-1, Math.min(1, value));
      target.y = clamp(dx) * MAX_TILT;
      target.x = -clamp(dy) * MAX_TILT;
      schedule();
    };
    const leave = () => {
      target.x = 0;
      target.y = 0;
      schedule();
    };
    const change = () => {
      if (query.matches) return;
      window.cancelAnimationFrame(frame);
      frame = 0;
      target.x = target.y = current.x = current.y = 0;
      element.style.transform = '';
    };

    area.addEventListener('pointermove', move);
    area.addEventListener('pointerleave', leave);
    query.addEventListener('change', change);
    return () => {
      area.removeEventListener('pointermove', move);
      area.removeEventListener('pointerleave', leave);
      query.removeEventListener('change', change);
      window.cancelAnimationFrame(frame);
      element.style.transform = '';
    };
  }, []);

  return (
    <div className={styles.heroCard}>
      <p className="sr-only">Illustration: the proposed Lumi Lane Coffee Club card with eight empty stamp circles.</p>
      <div ref={tilt} className={styles.tilt} aria-hidden="true">
        <ClubCard id="hero-card" tag="Proposed" />
      </div>
    </div>
  );
}
