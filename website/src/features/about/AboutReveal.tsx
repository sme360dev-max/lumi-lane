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
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduce.matches) return;

    const blocks = Array.from(root.querySelectorAll<HTMLElement>(`.${styles.reveal}`)).filter(
      // Already on screen (first paint, or a reload mid-page): leave it rather than make it jump.
      (el) => el.getBoundingClientRect().top > window.innerHeight * 0.94,
    );

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

    const photos = Array.from(root.querySelectorAll<HTMLElement>('[data-about-drift]'));
    let frame = 0;
    const updateDrift = () => {
      frame = 0;
      const viewport = window.innerHeight;
      for (const photo of photos) {
        const rect = photo.parentElement?.getBoundingClientRect();
        if (!rect || rect.top > viewport || rect.bottom < 0) continue;
        const progress = (rect.top + rect.height / 2 - viewport / 2) / viewport;
        const limit = Math.min(Number(photo.dataset.aboutDrift), rect.height * 0.055);
        photo.style.setProperty('--story-drift', `${Math.max(-limit, Math.min(limit, progress * limit * 2))}px`);
      }
    };
    const queueDrift = () => {
      if (!frame && !reduce.matches) frame = window.requestAnimationFrame(updateDrift);
    };
    window.addEventListener('scroll', queueDrift, { passive: true });
    window.addEventListener('resize', queueDrift);
    reduce.addEventListener('change', queueDrift);
    queueDrift();
    return () => {
      io.disconnect();
      for (const el of blocks) delete el.dataset.state;
      window.removeEventListener('scroll', queueDrift);
      window.removeEventListener('resize', queueDrift);
      reduce.removeEventListener('change', queueDrift);
      window.cancelAnimationFrame(frame);
      for (const photo of photos) photo.style.removeProperty('--story-drift');
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
