'use client';

import { gsap } from 'gsap';
import { useEffect, useRef, type ReactNode } from 'react';

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
            const featureIndex = Number(target.getAttribute('data-home-reveal'));
            context.add(() => {
              gsap.from(parts.length ? parts : target, {
                y: 12,
                opacity: 0.78,
                duration: 0.55,
                ease: 'power2.out',
                delay: parts.length ? 0 : featureIndex * 0.06,
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
