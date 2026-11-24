'use client';

import { gsap } from 'gsap';
import { useEffect, useRef, type ReactNode } from 'react';

/**
 * Soft rise for the Home intro block only (`[data-home-reveal]` and its `[data-home-intro-part]`s).
 * The Explore index runs its own reveals and swaps, so nothing inside it is marked here.
 */
export function HomeReveals({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = root.current;
    if (!container || !('IntersectionObserver' in window)) return;

    const motion = gsap.matchMedia(container);
    motion.add('(prefers-reduced-motion: no-preference)', (context) => {
      const observer = new IntersectionObserver(
        (entries) => {
          for (const { isIntersecting, target } of entries) {
            if (!isIntersecting) continue;
            observer.unobserve(target);
            const parts = target.querySelectorAll('[data-home-intro-part]');
            context.add(() => {
              gsap.from(parts.length ? parts : target, {
                y: 12,
                opacity: 0.78,
                duration: 0.55,
                ease: 'power2.out',
                stagger: 0.07,
                clearProps: 'opacity,transform',
              });
            });
          }
        },
        { threshold: 0.15 },
      );

      container.querySelectorAll('[data-home-reveal]').forEach((element) => observer.observe(element));
      return () => observer.disconnect();
    });

    return () => motion.revert();
  }, []);

  return (
    <div ref={root} className="bg-cream/20">
      {children}
    </div>
  );
}
