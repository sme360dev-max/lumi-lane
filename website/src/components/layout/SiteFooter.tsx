'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { InkStamp } from '@/components/brand/InkStamp';
import { BUSINESS } from '@/data/business';
import { PILL_NAV } from '@/data/navigation';
import slip from '@/features/booking/Booking.module.css';
import styles from './SiteFooter.module.css';
import { SocialIcon } from './SocialIcon';

const DIRECTIONS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${BUSINESS.address.street}, ${BUSINESS.address.line2}`,
)}`;

const inkLink =
  'rounded-sm underline decoration-cocoa/25 underline-offset-4 transition-colors duration-200 hover:text-ember hover:decoration-ember focus:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-2 focus-visible:ring-offset-[#fff6e7]';
const onPaperRing =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-2 focus-visible:ring-offset-[#fff6e7]';
const onOliveRing =
  'rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-cream focus-visible:ring-offset-4 focus-visible:ring-offset-olive';

/** "Monday to Saturday" → "Monday – Saturday" (display only; the data stays as published). */
const dash = (text: string) => text.replace(/ to /g, ' – ');

function Leader() {
  return <span aria-hidden="true" className={`${slip.leader} self-center`} />;
}

/**
 * The bill at the end of the meal: a printed receipt on the olive back cover, itemised with the
 * venue's hours, address and pages, stamped "See you soon" once it comes into view.
 */
export function SiteFooter() {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [stamped, setStamped] = useState(false);

  useEffect(() => {
    const receipt = receiptRef.current;
    if (!receipt) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) {
      // Static: already on the page and already stamped.
      receipt.setAttribute('data-in', '');
      const id = window.setTimeout(() => setStamped(true), 0);
      return () => window.clearTimeout(id);
    }
    receipt.setAttribute('data-armed', '');
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        receipt.setAttribute('data-in', '');
        setStamped(true); // mounting the stamp plays its one press (delayed until the receipt settles)
      },
      { threshold: 0.25 },
    );
    observer.observe(receipt);
    return () => observer.disconnect();
  }, []);

  return (
    <footer data-site-footer className="bg-olive px-3 pb-[var(--nav-clearance)] pt-20 text-cream sm:px-6 sm:pt-24 lg:px-10">
      <div ref={receiptRef} className={styles.receipt}>
        <div className={slip.lift}>
          <div className={`${slip.paper} px-5 pt-8 text-cocoa min-[400px]:px-7 sm:px-9 sm:pt-10`}>
            <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3 border-b border-cocoa/15 pb-5">
              <div className="whitespace-nowrap">
                <p className="font-serif text-[15px] font-medium leading-none tracking-[0.32em]">LUMI LANE</p>
                <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-cocoa/55">{BUSINESS.tagline}</p>
              </div>
              <p className="pt-px text-[10.5px] leading-snug text-cocoa/60 min-[400px]:text-right">
                {BUSINESS.address.line1}
                <br />
                {BUSINESS.address.line2}
              </p>
            </div>

            <div className="pb-8 pt-6">
              <section aria-labelledby="footer-hours" className={styles.section}>
                <h2 id="footer-hours" className={styles.sectionTitle}>
                  Opening Hours
                </h2>
                <dl>
                  {BUSINESS.hours.map((h) => (
                    <div key={h.label} className={styles.line}>
                      <dt>{dash(h.label)}</dt>
                      <Leader />
                      <dd className="tabular-nums">{dash(h.time)}</dd>
                    </div>
                  ))}
                </dl>
              </section>

              <section aria-labelledby="footer-visit" className={styles.section}>
                <h2 id="footer-visit" className={styles.sectionTitle}>
                  Visit
                </h2>
                <dl>
                  <div className={styles.line}>
                    <dt>Address</dt>
                    <Leader />
                    <dd>
                      <address className="not-italic">
                        {BUSINESS.address.line1}
                        <br />
                        {BUSINESS.address.line2}
                      </address>
                    </dd>
                  </div>
                  <div className={styles.line}>
                    <dt>Phone</dt>
                    <Leader />
                    <dd>
                      <a href={BUSINESS.phone.href} className={`${inkLink} tabular-nums`}>
                        {BUSINESS.phone.display}
                      </a>
                    </dd>
                  </div>
                  <div className={styles.line}>
                    <dt>Directions</dt>
                    <Leader />
                    <dd>
                      <a href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer" className={inkLink}>
                        Get directions<span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    </dd>
                  </div>
                </dl>
              </section>

              <nav aria-labelledby="footer-explore" className={styles.section}>
                <h2 id="footer-explore" className={styles.sectionTitle}>
                  Explore
                </h2>
                <ul>
                  {PILL_NAV.map((item, i) => (
                    <li key={item.href}>
                      <Link href={item.href} className={`${styles.line} ${styles.lineLink} rounded-sm ${onPaperRing}`}>
                        <span>{item.label}</span>
                        <Leader />
                        <span aria-hidden="true" className="tabular-nums text-cocoa/50">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <section aria-labelledby="footer-follow" className={styles.section}>
                <h2 id="footer-follow" className={styles.sectionTitle}>
                  Follow
                </h2>
                <div className={`${styles.line} pt-2`}>
                  <ul className="flex gap-2">
                    {BUSINESS.social.map((s) => (
                      <li key={s.id}>
                        <a
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={s.label}
                          className={`grid h-11 w-11 place-items-center rounded-full border border-cocoa/35 text-cocoa transition-colors duration-200 hover:border-ember hover:text-ember [&_svg]:h-5 [&_svg]:w-5 ${onPaperRing}`}
                        >
                          <SocialIcon id={s.id} />
                        </a>
                      </li>
                    ))}
                  </ul>
                  <Leader />
                  <span className="text-cocoa/70">{BUSINESS.instagramHandle}</span>
                </div>
              </section>
            </div>

            <div className={`${slip.stub} flex items-center justify-start border-t border-dashed border-cocoa/30 sm:justify-center`}>
              <p className="font-serif text-lg italic text-cocoa/80">Thank you for visiting.</p>
            </div>
          </div>
        </div>

        {stamped && (
          <div className={styles.stampSpot}>
            <InkStamp id="footer-stamp" word="See you soon" seed={5} className={`${slip.stamp} block w-full text-ember`} />
          </div>
        )}
      </div>

      <div className="mx-auto mt-14 flex max-w-6xl flex-col gap-5 border-t border-cream/15 px-3 py-6 text-xs text-cream/60 sm:mt-16 sm:px-0 lg:flex-row lg:items-center lg:justify-between">
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
          className={`${onOliveRing} self-start py-1 uppercase tracking-[0.24em] text-cream/80 transition-colors duration-300 ease-lumi hover:text-cream lg:self-auto`}
        >
          Back to top
          <svg
            viewBox="0 0 12 12"
            aria-hidden="true"
            className="ml-2 inline-block h-3 w-3 -translate-y-px"
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
    </footer>
  );
}
