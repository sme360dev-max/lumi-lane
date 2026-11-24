'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import styles from './About.module.css';

/**
 * A printed photograph that settles onto the page the first time it scrolls into view.
 * Server HTML renders it at rest, so it is never hidden without JS; the lifted state is only
 * applied by JS while the print is still below the fold, and never under reduced motion.
 */
export function AboutReveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Already on screen (e.g. a reload mid-page): leave it where it is rather than make it jump.
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    el.dataset.state = 'lifted';
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.dataset.state = 'settled';
          io.disconnect();
        }
      },
      { threshold: 0.35, rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      delete el.dataset.state;
    };
  }, []);

  return (
    <div ref={ref} className={`${styles.print} ${className}`.trim()}>
      {children}
    </div>
  );
}
