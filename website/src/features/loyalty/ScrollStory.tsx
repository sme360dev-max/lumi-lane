'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LOYALTY } from '@/data/loyalty';
import { ClubCard, TicketStub } from './ClubCard';
import { STAMP_TARGET } from './ritualState';
import styles from './Loyalty.module.css';

const MOTION = '(min-width: 1044px) and (min-height: 740px) and (prefers-reduced-motion: no-preference)';

/**
 * The page's one big motion moment. The card pins mid-screen while scrolling strikes a stamp into
 * slots 1 to 8 and one line of copy changes beside it; at eight the reward stub tears away.
 * Purely illustrative: it never touches the demo card's state.
 *
 * The server markup is the static version (all eight stamps, the three lines listed, the stub
 * already separated). That is what reduced motion and no-JS visitors keep. With motion allowed,
 * GSAP switches the stage to `data-mode="scroll"` and scrubs the sequence; reverting the
 * matchMedia context restores the static version exactly.
 */
export function ScrollStory() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = section.current;
    const pinned = stage.current;
    if (!root || !pinned) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add(MOTION, () => {
      root.dataset.mode = 'scroll';
      const inks = gsap.utils.toArray<HTMLElement>('[data-ink]', pinned);
      const rings = gsap.utils.toArray<HTMLElement>('[data-ring]', pinned);
      const lines = gsap.utils.toArray<HTMLElement>('[data-story-line]', pinned);
      const stub = pinned.querySelector('[data-story-stub]');
      const count = pinned.querySelector('[data-story-count]');
      const counter = { value: 0 };

      gsap.set(inks, { opacity: 0, scale: 1.15 });
      gsap.set(lines, { opacity: 0, y: 14 });
      gsap.set(lines[0] ?? [], { opacity: 1, y: 0 });
      gsap.set(stub, { y: 0, rotate: 0 });
      gsap.set(stub?.querySelector('[data-stub-copy]') ?? [], { opacity: 0 });

      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: pinned,
          start: 'top top',
          end: () => `+=${Math.round(window.innerHeight * 1.35)}`,
          pin: true,
          scrub: 0.4,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      const swapLine = (from: number, to: number, at: number) => {
        timeline
          .to(lines[from] ?? [], { opacity: 0, y: -14, duration: 0.3, ease: 'power1.in' }, at)
          .to(lines[to] ?? [], { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }, at + 0.25);
      };

      // 0 → 1: hold on "Order a coffee." Then strikes 1–8, one every 0.75 units.
      const firstStrike = 1;
      const gap = 0.75;
      swapLine(0, 1, firstStrike - 0.4);
      inks.forEach((ink, index) => {
        const at = firstStrike + index * gap;
        timeline
          .to(rings[index] ?? [], { scale: 0.9, duration: 0.12, ease: 'power2.in' }, at - 0.12)
          .to(ink, { opacity: 1, scale: 1, duration: 0.18, ease: 'power3.out' }, at)
          .to(rings[index] ?? [], { scale: 1, duration: 0.2, ease: 'power2.out' }, at)
          .to(
            counter,
            {
              value: index + 1,
              duration: 0.01,
              onUpdate: () => {
                if (count) count.textContent = String(Math.round(counter.value));
              },
            },
            at,
          );
      });
      const lastStrike = firstStrike + (STAMP_TARGET - 1) * gap;
      swapLine(1, 2, lastStrike - 0.55);
      // The stub tears off along the perforation once the eighth stamp has landed.
      timeline
        .to(stub, { y: 26, rotate: -1.6, duration: 0.7, ease: 'power2.out' }, lastStrike + 0.35)
        .to(stub?.querySelector('[data-stub-copy]') ?? [], { opacity: 1, duration: 0.4 }, lastStrike + 0.55)
        .to({}, { duration: 0.9 });

      return () => {
        delete root.dataset.mode;
        if (count) count.textContent = String(STAMP_TARGET);
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={section} className={styles.story} aria-labelledby="story-title">
      <div ref={stage} className={styles.storyStage}>
        <div className={styles.storyCopy}>
          <h2 id="story-title" className={styles.eyebrow}>
            {LOYALTY.story.title}
          </h2>
          <ol className={styles.storyLines}>
            {LOYALTY.story.lines.map((line) => (
              <li key={line} data-story-line>
                {line}
              </li>
            ))}
          </ol>
          <p className={styles.storyCount} aria-hidden="true">
            <span data-story-count>{STAMP_TARGET}</span> / {STAMP_TARGET}
          </p>
        </div>
        <div className={styles.storyArt}>
          <p className="sr-only">{LOYALTY.story.illustration}</p>
          <div aria-hidden="true">
            <ClubCard id="story-card" filled={STAMP_TARGET} tag="Example" />
            <TicketStub className={styles.storyStub} data-story-stub>
              <span data-stub-copy className={styles.stubCopy}>
                <span className={styles.stubLabel}>Reward</span>
                <span className={styles.stubTitle}>One standard coffee</span>
              </span>
            </TicketStub>
          </div>
        </div>
      </div>
    </section>
  );
}
