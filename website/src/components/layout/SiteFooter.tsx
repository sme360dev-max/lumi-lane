import Link from 'next/link';
import { InkStamp } from '@/components/brand/InkStamp';
import { BUSINESS } from '@/data/business';
import { FOOTER } from '@/data/content';
import { PILL_NAV } from '@/data/navigation';
import { SocialIcon } from './SocialIcon';

const focusRing =
  'rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-cream focus-visible:ring-offset-4 focus-visible:ring-offset-olive';
const heading = 'border-b border-cream/15 pb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-cream/70';
const link = `${focusRing} inline-block py-1 text-cream/80 transition-colors duration-300 ease-lumi hover:text-cream`;

const DIRECTIONS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${BUSINESS.address.street}, ${BUSINESS.address.line2}`,
)}`;

/** The back cover of the menu: ink stamp, tagline, then the house details set like menu lines. */
export function SiteFooter() {
  return (
    <footer className="bg-olive px-6 pb-[var(--nav-clearance)] pt-20 text-cream sm:pt-24 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center text-center">
          <InkStamp id="footer-stamp" seed={5} className="h-24 w-24 text-cream/80 sm:h-28 sm:w-28" />
          {/* One line on desktop; on narrow screens it breaks only between the two phrases. */}
          <p className="mt-7 font-serif text-2xl italic leading-snug text-cream sm:text-3xl">
            {FOOTER.tagline.map((part, i) => (
              <span key={part}>
                {i > 0 && ' '}
                <span className="whitespace-nowrap">
                  {part}
                  {i < FOOTER.tagline.length - 1 && ' ·'}
                </span>
              </span>
            ))}
          </p>
        </div>

        <div className="mt-16 grid gap-x-12 gap-y-12 border-t border-cream/15 pt-12 text-sm leading-relaxed sm:mt-20 md:grid-cols-2 md:gap-y-14 lg:grid-cols-[0.8fr_1.55fr_1.15fr_0.9fr] lg:gap-x-14">
          <nav aria-label="Footer">
            <h2 className={heading}>Explore</h2>
            <ul className="mt-4 flex flex-col">
              {PILL_NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={link}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <section aria-labelledby="footer-hours">
            <h2 id="footer-hours" className={heading}>
              Opening Hours
            </h2>
            <dl className="mt-5 space-y-3 text-cream/80">
              {BUSINESS.hours.map((h) => (
                <div key={h.label} className="flex flex-wrap items-baseline gap-x-3">
                  <dt>{h.label}</dt>
                  <span aria-hidden="true" className="min-w-6 flex-1 translate-y-[-0.2em] border-b-2 border-dotted border-cream/40" />
                  <dd className="ml-auto tabular-nums">{h.time}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="footer-visit">
            <h2 id="footer-visit" className={heading}>
              Where We Are
            </h2>
            <address className="mt-5 not-italic text-cream/80">
              {BUSINESS.address.line1}
              <br />
              {BUSINESS.address.line2}
            </address>
            <ul className="mt-3 flex flex-col">
              <li>
                <a href={BUSINESS.phone.href} className={link}>
                  {BUSINESS.phone.display}
                </a>
              </li>
              <li>
                <a
                  href={DIRECTIONS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${link} underline decoration-cream/30 underline-offset-[6px] hover:decoration-cream`}
                >
                  Get directions<span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            </ul>
          </section>

          <section aria-labelledby="footer-follow">
            <h2 id="footer-follow" className={heading}>
              Follow
            </h2>
            <ul className="mt-5 flex flex-wrap gap-3">
              {BUSINESS.social.map((s) => (
                <li key={s.id}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="grid h-12 w-12 place-items-center rounded-full border border-cream/50 text-cream transition-colors duration-300 ease-lumi hover:border-cream hover:bg-cream hover:text-olive focus:outline-none focus-visible:ring-2 focus-visible:ring-cream focus-visible:ring-offset-2 focus-visible:ring-offset-olive"
                  >
                    <SocialIcon id={s.id} />
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-cream/60">{BUSINESS.instagramHandle}</p>
          </section>
        </div>

        <div className="mt-16 flex flex-col gap-5 border-t border-cream/15 py-6 text-xs text-cream/60 sm:mt-20 lg:flex-row lg:items-center lg:justify-between">
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
          <a href="#main" className={`${focusRing} self-start py-1 uppercase tracking-[0.24em] text-cream/80 transition-colors duration-300 ease-lumi hover:text-cream lg:self-auto`}>
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
      </div>
    </footer>
  );
}
