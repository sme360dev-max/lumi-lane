'use client';

import { gsap } from 'gsap';
import Link from 'next/link';
import { useEffect, useRef, useState, type FocusEvent } from 'react';
import { HandStroke } from '@/components/brand/HandStroke';
import { ResponsivePicture } from '@/components/ui/ResponsivePicture';
import { MENU_PAGE, VISIT } from '@/data/content';
import { DESKTOP_MOTION, HeroHandoff } from './HeroHandoff';
import styles from './HomeIndex.module.css';

const ROWS = [
  {
    id: 'home-index-menu',
    title: 'Menu',
    href: '/menu/',
    description: MENU_PAGE.intro,
    image: 'mezze',
    alt: 'Lumi Lane mezze board with dips, olives and pita',
    print: false,
  },
  {
    id: 'home-index-book',
    title: 'Book a Table',
    href: '/book/',
    description: 'Plan breakfast, brunch or a drink at our Lightsview coffee house.',
    image: 'storefront',
    alt: VISIT.storefrontAlt,
    print: true,
  },
  {
    id: 'home-index-loyalty',
    title: 'Loyalty',
    href: '/loyalty/',
    description: 'Collect eight stamps in the Coffee Club demo to unlock a standard coffee.',
    image: 'coffee',
    alt: 'A Lumi Lane latte with leaf art',
    print: false,
  },
] as const;

const CUTOUT = { widths: [480, 800, 1254], width: 1254, height: 1254 } as const;
const PHOTO = { widths: [480, 800, 1200], width: 1360, height: 972 } as const;

const SLOT_SIZES = '(min-width: 1567px) 470px, (min-width: 1024px) 30vw, 1px';
const INLINE_SIZES = '(min-width: 1024px) 34vw, (min-width: 640px) 36vw, min(calc(100vw - 92px), 384px)';

const MAX_DRIFT = 60; // px from rest
const DRIFT_LERP = 0.085;

const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember';

export function HomeIndex() {
  const sectionRef = useRef<HTMLElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const driftRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const shownRef = useRef(0);

  const [hovered, setHovered] = useState<number | null>(null);
  const [focused, setFocused] = useState<number | null>(null);
  // Hover wins over focus; with neither, the Menu row is the active one.
  const active = hovered ?? focused ?? 0;

  // Image swap: outgoing slides up and fades, incoming rises from below. Instant under reduced motion.
  useEffect(() => {
    const prev = shownRef.current;
    if (prev === active) return;
    shownRef.current = active;
    const outgoing = layerRefs.current[prev];
    const incoming = layerRefs.current[active];
    if (!outgoing || !incoming) return;

    const animate = window.matchMedia(DESKTOP_MOTION).matches;
    gsap.killTweensOf(layerRefs.current);
    layerRefs.current.forEach((layer) => {
      if (!layer || layer === outgoing || layer === incoming) return;
      if (animate) gsap.to(layer, { opacity: 0, duration: 0.25, ease: 'power1.out', overwrite: true });
      else gsap.set(layer, { opacity: 0, yPercent: 0 });
    });
    if (!animate) {
      gsap.set(outgoing, { opacity: 0, yPercent: 0 });
      gsap.set(incoming, { opacity: 1, yPercent: 0 });
      return;
    }
    gsap.to(outgoing, { yPercent: -9, opacity: 0, duration: 0.45, ease: 'power2.out', overwrite: true });
    gsap.fromTo(
      incoming,
      { yPercent: 11, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.58, ease: 'power3.out', delay: 0.06, overwrite: true },
    );
  }, [active]);

  // Pointer drift: the slot image follows the cursor with inertia, then settles back to rest.
  useEffect(() => {
    const section = sectionRef.current;
    const slot = slotRef.current;
    const drift = driftRef.current;
    if (!section || !slot || !drift) return;

    const mm = gsap.matchMedia();
    mm.add(DESKTOP_MOTION, () => {
      const target = { x: 0, y: 0 };
      const pos = { x: 0, y: 0 };
      let raf = 0;

      const tick = () => {
        pos.x += (target.x - pos.x) * DRIFT_LERP;
        pos.y += (target.y - pos.y) * DRIFT_LERP;
        const settled = Math.abs(target.x - pos.x) < 0.05 && Math.abs(target.y - pos.y) < 0.05;
        if (settled) {
          pos.x = target.x;
          pos.y = target.y;
        }
        drift.style.transform = `translate3d(${pos.x.toFixed(2)}px,${pos.y.toFixed(2)}px,0)`;
        raf = settled ? 0 : requestAnimationFrame(tick);
      };
      const wake = () => {
        if (!raf) raf = requestAnimationFrame(tick);
      };

      const onMove = (event: PointerEvent) => {
        if (event.pointerType !== 'mouse') return;
        const r = slot.getBoundingClientRect();
        const dx = (event.clientX - (r.left + r.width / 2)) * 0.12;
        const dy = (event.clientY - (r.top + r.height / 2)) * 0.12;
        const length = Math.hypot(dx, dy);
        const k = length > MAX_DRIFT ? MAX_DRIFT / length : 1;
        target.x = dx * k;
        target.y = dy * k;
        wake();
      };
      const onLeave = () => {
        target.x = 0;
        target.y = 0;
        wake();
      };

      section.addEventListener('pointermove', onMove);
      section.addEventListener('pointerleave', onLeave);
      return () => {
        section.removeEventListener('pointermove', onMove);
        section.removeEventListener('pointerleave', onLeave);
        cancelAnimationFrame(raf);
        drift.style.transform = '';
      };
    });
    return () => mm.revert();
  }, []);

  // Stacked layout: each inline image is revealed once as it scrolls into view.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute('data-shown', '');
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -6% 0px' },
    );
    section.querySelectorAll('[data-index-media]').forEach((el) => observer.observe(el));
    section.setAttribute('data-reveal-armed', '');
    return () => {
      observer.disconnect();
      section.removeAttribute('data-reveal-armed');
    };
  }, []);

  const onListBlur = (event: FocusEvent<HTMLUListElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(null);
  };

  return (
    <section ref={sectionRef} aria-labelledby="home-explore" className={styles.section}>
      <div className={`${styles.layout} mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-14 xl:px-20`}>
        <div>
          <div className={styles.head}>
            <h2 id="home-explore" className="text-[11px] font-semibold uppercase tracking-[0.3em] text-ember">
              Explore Lumi Lane
            </h2>
            <p aria-hidden="true" className="font-serif text-sm italic text-cocoa/55">
              Index
            </p>
          </div>

          <ul className={styles.list} onPointerLeave={() => setHovered(null)} onBlur={onListBlur}>
            {ROWS.map((row, index) => {
              const isActive = index === active;
              return (
                <li key={row.id} className={styles.row} data-active={isActive}>
                  <Link
                    href={row.href}
                    aria-labelledby={row.id}
                    aria-describedby={`${row.id}-desc`}
                    className={`${styles.link} ${focusRing}`}
                    onPointerEnter={(event) => {
                      if (event.pointerType === 'mouse') setHovered(index);
                    }}
                    onFocus={() => setFocused(index)}
                  >
                    <span aria-hidden="true" className={styles.num}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className={styles.body}>
                      <h3 id={row.id} className={`${styles.title} font-serif font-medium`}>
                        <span className={styles.titleText}>
                          {row.title}
                          <HandStroke drawn={isActive} width={3} className={`${styles.stroke} text-ember`} />
                        </span>
                      </h3>
                      <span id={`${row.id}-desc`} className={`${styles.desc} block`}>
                        {row.description}
                      </span>
                    </div>
                    <div data-index-media className={`${styles.media} ${row.print ? styles.mediaPrint : ''}`}>
                      <div className={styles.mediaInner}>
                        <ResponsivePicture
                          name={row.image}
                          alt={row.alt}
                          sizes={INLINE_SIZES}
                          {...(row.print ? PHOTO : CUTOUT)}
                          className={row.print ? styles.print : styles.cutout}
                        />
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className={styles.slotCol} aria-hidden="true">
          <div ref={slotRef} className={styles.slot}>
            <div ref={revealRef} className={styles.reveal}>
              <div ref={driftRef} className={styles.drift}>
                {ROWS.map((row, index) => (
                  <div
                    key={row.id}
                    ref={(el) => {
                      layerRefs.current[index] = el;
                    }}
                    className={styles.layer}
                  >
                    <span className={row.print ? styles.layerPrint : undefined}>
                      <ResponsivePicture
                        name={row.image}
                        alt=""
                        sizes={SLOT_SIZES}
                        {...(row.print ? PHOTO : CUTOUT)}
                        className={row.print ? styles.print : styles.cutout}
                      />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <HeroHandoff slotRef={slotRef} revealRef={revealRef} sectionRef={sectionRef} />
    </section>
  );
}
