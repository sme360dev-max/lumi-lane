'use client';

import { gsap } from 'gsap';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { ResponsivePicture } from '@/components/ui/ResponsivePicture';
import { HERO, MENU_PAGE } from '@/data/content';
import styles from './ExploreTrail.module.css';

/** Trail order: each new plate is the next dish in this cycle. */
const DISHES = ['coffee', 'burger', 'mezze', 'choco', 'food'] as const;
/** Pool size, a multiple of the dish count so pool node k always holds dish k % 5. */
const POOL = DISHES.length * 2;
const CUTOUT = { widths: [480, 800, 1254], width: 1254, height: 1254 } as const;

const TRAIL_QUERY = '(min-width: 768px) and (prefers-reduced-motion: no-preference)';
const SPAWN_DISTANCE = 72; // px of pointer travel between plates

const LINKS = [
  { id: 'home-explore-menu', title: 'Menu', href: '/menu/', line: MENU_PAGE.intro },
  {
    id: 'home-explore-book',
    title: 'Book a Table',
    href: '/book/',
    line: 'Plan breakfast, brunch or a drink at our Lightsview coffee house.',
  },
  {
    id: 'home-explore-club',
    title: 'Coffee Club',
    href: '/loyalty/',
    line: "Eight coffees, the next one's on us. A proposed programme.",
  },
] as const;

const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember';

export function ExploreTrail() {
  const stageRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  // Use the actual pointer event so a mouse also works when touch is the primary input.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const mm = gsap.matchMedia();
    mm.add(TRAIL_QUERY, () => {
      const drops = Array.from(stage.querySelectorAll<HTMLElement>('[data-trail-drop]'));
      if (!drops.length) return;
      gsap.set(drops, { xPercent: -50, yPercent: -50, opacity: 0 });

      let onScreen = false;
      let last: { x: number; y: number } | null = null;
      let count = 0;

      const spawn = (x: number, y: number) => {
        const node = drops[count % drops.length];
        if (!node) return;
        count += 1;
        const offsetX = last ? Math.max(-32, Math.min(32, (x - last.x) * 0.35)) : 0;
        const offsetY = last ? Math.max(-32, Math.min(32, (y - last.y) * 0.35)) : 0;
        gsap.killTweensOf(node);
        gsap.set(node, {
          x: x - offsetX,
          y: y - offsetY,
          zIndex: count,
          rotation: offsetX / 8,
          scale: 0.76,
          opacity: 0,
        });
        gsap
          .timeline()
          .to(node, { x, y, opacity: 1, scale: 1, rotation: 0, duration: 0.3, ease: 'power3.out' })
          .to(node, { opacity: 0, scale: 0.48, duration: 0.44, ease: 'power2.in' }, 0.39);
      };

      const onMove = (event: PointerEvent) => {
        if (!onScreen || event.pointerType !== 'mouse') return;
        const rect = stage.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        if (last && Math.hypot(x - last.x, y - last.y) < SPAWN_DISTANCE) return;
        if (!last) stage.setAttribute('data-pointer-trail', '');
        spawn(x, y);
        last = { x, y };
      };
      const onLeave = () => {
        last = null;
        stage.removeAttribute('data-pointer-trail');
      };

      const observer = new IntersectionObserver(([entry]) => {
        onScreen = Boolean(entry?.isIntersecting);
        if (!onScreen) onLeave();
      });
      observer.observe(stage);
      stage.addEventListener('pointermove', onMove);
      stage.addEventListener('pointerleave', onLeave);

      return () => {
        observer.disconnect();
        stage.removeEventListener('pointermove', onMove);
        stage.removeEventListener('pointerleave', onLeave);
        onLeave();
        gsap.killTweensOf(drops);
      };
    });

    return () => mm.revert();
  }, []);

  // Strip (touch / small screens): the CSS loop only runs while the strip is on screen.
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip || !('IntersectionObserver' in window)) return;
    strip.setAttribute('data-paused', '');
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) strip.removeAttribute('data-paused');
      else strip.setAttribute('data-paused', '');
    });
    observer.observe(strip);
    return () => {
      observer.disconnect();
      strip.removeAttribute('data-paused');
    };
  }, []);

  return (
    <section aria-labelledby="home-explore" data-home-reveal className={styles.section}>
      <div ref={stageRef} className={styles.stage}>
        <div aria-hidden="true" className={styles.trail}>
          {Array.from({ length: POOL }, (_, index) => (
            <div key={index} data-trail-drop className={styles.drop}>
              <ResponsivePicture
                name={DISHES[index % DISHES.length] ?? 'coffee'}
                alt=""
                sizes="(min-width: 1556px) 280px, (min-width: 1056px) 18vw, 190px"
                {...CUTOUT}
                className={styles.dish}
              />
            </div>
          ))}
        </div>

        <div data-home-intro-part className={styles.copy}>
          <h2 id="home-explore" className={`${styles.headline} font-serif`}>
            Explore <em>Lumi Lane</em>
          </h2>
          <p className={styles.line}>{HERO.eyebrow}</p>
          <p className={styles.pointerHint}>Move your mouse to explore the dishes.</p>
        </div>

        <div ref={stripRef} aria-hidden="true" className={styles.strip}>
          <div className={styles.track}>
            {[...DISHES, ...DISHES].map((dish, index) => (
              <div key={`${dish}-${index}`} className={styles.stripItem} data-dup={index >= DISHES.length || undefined}>
                <ResponsivePicture
                  name={dish}
                  alt=""
                  sizes="(min-width: 768px) 200px, 150px"
                  {...CUTOUT}
                  className={styles.dish}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-14 xl:px-20">
        <ul data-home-intro-part className={styles.links}>
          {LINKS.map((link) => (
            <li key={link.id} className={styles.item}>
              <Link
                href={link.href}
                aria-labelledby={link.id}
                aria-describedby={`${link.id}-line`}
                className={`${styles.link} ${focusRing}`}
              >
                <div className={styles.titleRow}>
                  <h3 id={link.id} className={`${styles.title} font-serif`}>
                    <span className={styles.titleText}>{link.title}</span>
                  </h3>
                  <svg aria-hidden="true" viewBox="0 0 24 24" className={styles.arrow}>
                    <path d="M4 12h15M13 6l6 6-6 6" />
                  </svg>
                </div>
                <span id={`${link.id}-line`} className={styles.linkLine}>
                  {link.line}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
