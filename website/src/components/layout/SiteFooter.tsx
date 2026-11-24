'use client';

import Link from 'next/link';
import type { CSSProperties } from 'react';
import { useEffect, useRef } from 'react';
import { InkStamp } from '@/components/brand/InkStamp';
import { ResponsivePicture } from '@/components/ui/ResponsivePicture';
import { BUSINESS } from '@/data/business';
import { PILL_NAV } from '@/data/navigation';
import styles from './SiteFooter.module.css';
import { SocialIcon } from './SocialIcon';

const DISHES = [
  { name: 'coffee', tilt: -4 },
  { name: 'burger', tilt: 3 },
  { name: 'mezze', tilt: -2 },
  { name: 'choco', tilt: 5 },
  { name: 'food', tilt: -3 },
] as const;

const DIRECTIONS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${BUSINESS.address.street}, ${BUSINESS.address.line2}`,
)}`;

const focusRing =
  'rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-cream focus-visible:ring-offset-4 focus-visible:ring-offset-olive';
const heading = 'border-b border-cream/15 pb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-cream/70';
const link = `${focusRing} inline-flex min-h-8 items-center text-cream/80 transition-colors duration-300 ease-lumi hover:text-cream`;

const delay = (ms: number) => ({ '--delay': `${ms}ms` }) as CSSProperties;

/** One run of the five cut-out dishes; rendered twice so the marquee loops without a seam. */
function DishRun() {
  return (
    <div className={styles.run}>
      {DISHES.map((d) => (
        <div key={d.name} className={styles.dish} style={{ '--tilt': `${d.tilt}deg` } as CSSProperties}>
          <ResponsivePicture name={d.name} widths={[480]} sizes="160px" width={1254} height={1254} alt="" />
        </div>
      ))}
    </div>
  );
}

/** "The long table": dishes gliding along the table edge, a sign-off, the house details and the fine print. */
export function SiteFooter() {
  const bandRef = useRef<HTMLDivElement>(null);
  const signRef = useRef<HTMLParagraphElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const band = bandRef.current;
    const reveals: HTMLElement[] = [];
    if (signRef.current) reveals.push(signRef.current);
    if (gridRef.current) reveals.push(gridRef.current);

    // The marquee only runs while it is on screen.
    const marquee = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) band?.setAttribute('data-running', '');
      else band?.removeAttribute('data-running');
    });
    if (band) marquee.observe(band);

    // One-time reveals; reduced motion keeps everything in place (the CSS drops the transitions).
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let reveal: IntersectionObserver | undefined;
    if (!reduce) {
      reveal = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            entry.target.setAttribute('data-in', '');
            reveal?.unobserve(entry.target);
          }
        },
        { threshold: 0.3 },
      );
      for (const el of reveals) {
        el.setAttribute('data-armed', '');
        reveal.observe(el);
      }
    }

    return () => {
      marquee.disconnect();
      reveal?.disconnect();
      for (const el of reveals) {
        el.removeAttribute('data-armed');
        el.removeAttribute('data-in');
      }
    };
  }, []);

  return (
    <footer data-site-footer className="bg-olive pb-[var(--nav-clearance)] pt-4 text-cream sm:pt-6">
      <div ref={bandRef} className={styles.band} aria-hidden="true">
        <div className={styles.track}>
          <DishRun />
          <DishRun />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <div className="mt-6 flex items-center gap-5 sm:mt-6 sm:gap-7">
          <InkStamp id="footer-stamp" seed={5} className="h-16 w-16 shrink-0 text-cream/75 sm:h-20 sm:w-20" />
          <p ref={signRef} className="font-serif text-[clamp(2.25rem,5vw,4.5rem)] italic leading-[1.02] text-cream">
            <span className={styles.line}>
              <span className={styles.lineInner}>See you at </span>
            </span>
            <span className={styles.line}>
              <span className={styles.lineInner} style={delay(110)}>
                the long table.
              </span>
            </span>
          </p>
        </div>

        <div
          ref={gridRef}
          className="mt-9 grid gap-x-12 gap-y-9 text-sm leading-relaxed sm:mt-10 md:grid-cols-2 lg:grid-cols-[0.8fr_1.5fr_1.15fr_0.9fr] lg:gap-x-12"
        >
          <nav aria-label="Footer" className={styles.col} style={delay(0)}>
            <h2 className={heading}>Explore</h2>
            <ul className="mt-2 flex flex-col">
              {PILL_NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={link}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <section aria-labelledby="footer-hours" className={styles.col} style={delay(90)}>
            <h2 id="footer-hours" className={heading}>
              Opening Hours
            </h2>
            <dl className="mt-4 space-y-3 text-cream/80">
              {BUSINESS.hours.map((h) => (
                <div key={h.label} className="flex flex-wrap items-baseline gap-x-3">
                  <dt>{h.label}</dt>
                  <span aria-hidden="true" className={styles.leader} />
                  <dd className="ml-auto tabular-nums">{h.time}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="footer-visit" className={styles.col} style={delay(180)}>
            <h2 id="footer-visit" className={heading}>
              Visit
            </h2>
            <address className="mt-4 not-italic text-cream/80">
              {BUSINESS.address.line1}
              <br />
              {BUSINESS.address.line2}
            </address>
            <ul className="mt-2 flex flex-col">
              <li>
                <a href={BUSINESS.phone.href} className={`${link} tabular-nums`}>
                  {BUSINESS.phone.display}
                </a>
              </li>
              <li>
                <a
                  href={DIRECTIONS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${link} underline decoration-ember underline-offset-[6px]`}
                >
                  Get directions<span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            </ul>
          </section>

          <section aria-labelledby="footer-follow" className={styles.col} style={delay(270)}>
            <h2 id="footer-follow" className={heading}>
              Follow
            </h2>
            <ul className="mt-4 flex flex-wrap gap-3">
              {BUSINESS.social.map((s) => (
                <li key={s.id}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="grid h-11 w-11 place-items-center rounded-full border border-cream/50 text-cream transition-colors duration-300 ease-lumi hover:border-cream hover:bg-cream hover:text-olive focus:outline-none focus-visible:ring-2 focus-visible:ring-cream focus-visible:ring-offset-2 focus-visible:ring-offset-olive [&_svg]:h-5 [&_svg]:w-5"
                  >
                    <SocialIcon id={s.id} />
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-cream/60">{BUSINESS.instagramHandle}</p>
          </section>
        </div>

        <div className="mt-9 flex flex-col gap-4 border-t border-cream/15 py-5 text-xs text-cream/60 sm:mt-8 lg:flex-row lg:items-center lg:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {BUSINESS.name}
          </p>
          {/* No policy pages exist yet, so they are listed, not linked. */}
          <ul aria-label="Policies (pages coming soon)" className="flex flex-wrap gap-x-6 gap-y-2">
            {BUSINESS.policies.map((p) => (
              <li key={p} title="Coming soon">
                {p}
              </li>
            ))}
          </ul>
          <a
            href="#main"
            className={`${focusRing} inline-flex min-h-9 items-center self-start uppercase tracking-[0.24em] text-cream/80 transition-colors duration-300 ease-lumi hover:text-cream lg:self-auto`}
          >
            Back to top
            <svg
              viewBox="0 0 12 12"
              aria-hidden="true"
              className="ml-2 inline-block h-3 w-3"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 10.5v-9M2 5.5l4-4 4 4" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
