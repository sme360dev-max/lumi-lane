'use client';

import { gsap } from 'gsap';
import { useEffect, useRef, useState } from 'react';
import { HandStroke } from '@/components/brand/HandStroke';
import { LOYALTY } from '@/data/loyalty';
import { CoffeeMark, StampCardMark } from './StampArtwork';
import styles from './StampRitual.module.css';

const icons = {
  coffee: <CoffeeMark />,
  stamp: <StampCardMark />,
  reward: (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path
        d="M6 12h28v6a2.5 2.5 0 0 0 0 5v5H6v-5a2.5 2.5 0 0 0 0-5v-6Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M25 12v16" stroke="currentColor" strokeWidth="1.2" strokeDasharray="1.5 2" />
      <path
        d="m16 16 .9 2.7 2.8.1-2.2 1.7.8 2.7-2.3-1.6-2.3 1.6.8-2.7-2.2-1.7 2.8-.1.9-2.7Z"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

export function CoffeeClubSteps() {
  const sheet = useRef<HTMLOListElement>(null);
  const [inView, setInView] = useState(false);

  // Draw the connector once, the first time the sheet scrolls into view.
  useEffect(() => {
    const list = sheet.current;
    if (!list) return;
    if (typeof IntersectionObserver === 'undefined') {
      const draw = window.setTimeout(() => setInView(true), 0);
      return () => window.clearTimeout(draw);
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        setInView(true);
      },
      { threshold: 0.35 },
    );
    observer.observe(list);
    return () => observer.disconnect();
  }, []);

  // A quiet settle for the copy only, so the marks stay pinned to the stroke while it draws.
  useEffect(() => {
    const list = sheet.current;
    if (!list || !('IntersectionObserver' in window)) return;

    const motion = gsap.matchMedia(list);
    motion.add('(prefers-reduced-motion: no-preference)', (context) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return;
          observer.disconnect();
          context.add(() => {
            gsap.from(list.querySelectorAll('[data-club-step-copy]'), {
              y: 5,
              opacity: 0.7,
              duration: 0.42,
              ease: 'power2.out',
              stagger: 0.12,
              clearProps: 'transform,opacity',
            });
          });
        },
        { threshold: 0.2 },
      );
      observer.observe(list);
      return () => observer.disconnect();
    });
    return () => motion.revert();
  }, []);

  return (
    <section id="how-coffee-club-works" className={styles.howItWorks} aria-labelledby="club-steps-title" tabIndex={-1}>
      <div className={styles.stepsHeading}>
        <h2 id="club-steps-title">How Coffee Club Works</h2>
        <p className={styles.printLabel}>Proposed rules</p>
      </div>
      <HandStroke
        variant="connector"
        drawn={inView}
        className={`text-ember ${styles.stepsStroke} ${styles.stepsStrokeNarrow}`}
      />
      <div className={styles.stepFrame}>
        <HandStroke
          variant="connector"
          drawn={inView}
          className={`text-ember ${styles.stepsStroke} ${styles.stepsStrokeWide}`}
        />
        <ol ref={sheet} className={styles.stepSheet} role="list" aria-label="Three proposed Coffee Club steps">
          {LOYALTY.steps.map(({ icon, title, description }, index) => (
            <li key={title} className={styles.step}>
              <div className={styles.stepContent}>
                <div className={styles.stepMark} aria-hidden="true">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  {icons[icon]}
                </div>
                <div data-club-step-copy>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
