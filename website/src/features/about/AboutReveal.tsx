'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import styles from './About.module.css';

/**
 * Gentle one-time reveal for every `.reveal` block inside. Server HTML renders everything at
 * rest, so nothing is hidden without JS: blocks are only armed (lowered and transparent) by JS,
 * only while they are still below the fold, and never under reduced motion.
 */
export function AboutReveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const blocks = Array.from(root.querySelectorAll<HTMLElement>(`.${styles.reveal}`)).filter(
      // Already on screen (first paint, or a reload mid-page): leave it rather than make it jump.
      (el) => el.getBoundingClientRect().top > window.innerHeight * 0.94,
    );
    if (!blocks.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          (e.target as HTMLElement).dataset.state = 'shown';
          io.unobserve(e.target);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -6% 0px' },
    );
    for (const el of blocks) {
      el.dataset.state = 'armed';
      io.observe(el);
    }
    return () => {
      io.disconnect();
      for (const el of blocks) delete el.dataset.state;
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
