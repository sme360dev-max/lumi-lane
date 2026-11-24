import Link from 'next/link';
import { BUSINESS } from '@/data/business';
import { PILL_NAV } from '@/data/navigation';
import { ShopfrontScene } from './ShopfrontScene';
import { SocialIcon } from './SocialIcon';

const DESCRIPTION = `${BUSINESS.tagline} in ${BUSINESS.address.locality}, ${BUSINESS.address.region}.`;

/** The footer names the loyalty programme by its club name; the pill keeps its short label. */
const EXPLORE = PILL_NAV.map((item) => (item.href === '/loyalty/' ? { ...item, label: 'Coffee Club' } : item));

const DIRECTIONS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${BUSINESS.address.street}, ${BUSINESS.address.line2}`,
)}`;

const focusRing =
  'rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-4 focus-visible:ring-offset-shell';
const heading = 'text-[11px] font-semibold uppercase tracking-[0.28em] text-cocoa/70';
const link = `${focusRing} inline-flex min-h-9 items-center text-cocoa/80 underline-offset-[6px] transition-colors duration-200 hover:text-cocoa hover:underline hover:decoration-ember`;

function Arrow({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 12"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 6h13.5M9.5 1l5 5-5 5" />
    </svg>
  );
}

/** Light, editorial footer: the house, where to go next, how to find us, the fine print, then the long table. */
export function SiteFooter() {
  return (
    <footer className="border-t border-cocoa/15 bg-shell text-cocoa">
      <div className="mx-auto max-w-6xl px-6 pt-16 sm:pt-20 lg:px-10">
        <div className="grid gap-x-12 gap-y-12 text-[15px] leading-relaxed md:grid-cols-2 lg:grid-cols-[1.35fr_0.75fr_1fr] lg:gap-x-16">
          <div className="md:col-span-2 lg:col-span-1">
            <p className="font-serif text-lg font-medium tracking-[0.34em] text-cocoa sm:text-xl">LUMI LANE</p>
            <p className="mt-4 max-w-xs text-cocoa/75">{DESCRIPTION}</p>
            <Link
              href="/book/"
              className={`${focusRing} group mt-6 inline-flex min-h-11 items-center gap-3 font-medium text-cocoa underline-offset-[6px] hover:underline hover:decoration-ember`}
            >
              Book a table
              <Arrow className="h-3 w-4 text-ember transition-transform duration-300 ease-lumi group-hover:translate-x-1 motion-reduce:transition-none" />
            </Link>
          </div>

          <nav aria-label="Footer">
            <h2 className={heading}>Explore</h2>
            <ul className="mt-4 flex flex-col">
              {EXPLORE.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={link}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <section aria-labelledby="footer-visit">
            <h2 id="footer-visit" className={heading}>
              Visit
            </h2>
            <address className="mt-5 not-italic text-cocoa/80">
              {BUSINESS.address.line1}
              <br />
              {BUSINESS.address.line2}
            </address>
            <ul aria-label="Opening hours" className="mt-4 text-cocoa/80">
              {BUSINESS.hours.map((h) => (
                <li key={h.label}>
                  {h.label}, {h.time}
                </li>
              ))}
            </ul>
            <ul className="mt-3 flex flex-col">
              <li>
                <a href={BUSINESS.phone.href} className={`${link} tabular-nums`}>
                  {BUSINESS.phone.display}
                </a>
              </li>
              <li>
                <a href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer" className={link}>
                  Get directions<span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            </ul>
            <ul aria-label="Social media" className="mt-5 flex gap-3">
              {BUSINESS.social.map((s) => (
                <li key={s.id}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="grid h-11 w-11 place-items-center rounded-full border border-cocoa/30 text-cocoa transition-colors duration-200 hover:border-cocoa hover:bg-cocoa hover:text-shell focus:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-2 focus-visible:ring-offset-shell [&_svg]:h-[18px] [&_svg]:w-[18px]"
                  >
                    <SocialIcon id={s.id} />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div
          data-footer-strip
          className="mt-14 flex flex-col gap-x-8 gap-y-3 border-t border-cocoa/15 py-6 text-[13px] text-cocoa/70 sm:mt-16 lg:flex-row lg:items-center"
        >
          <p className="shrink-0">
            &copy; {new Date().getFullYear()} {BUSINESS.name}
          </p>
          {/* No policy pages exist yet, so they are listed, not linked. */}
          <ul aria-label="Policies (pages coming soon)" className="flex flex-wrap gap-x-6 gap-y-1">
            {BUSINESS.policies.map((p) => (
              <li key={p} title="Coming soon">
                {p}
              </li>
            ))}
          </ul>
          <a
            href="#main"
            className={`${focusRing} -my-2 inline-flex min-h-11 items-center gap-2 self-start text-cocoa/80 underline-offset-[6px] hover:text-cocoa hover:underline hover:decoration-ember lg:ml-auto lg:self-auto`}
          >
            Back to top
            <Arrow className="h-3 w-4 -rotate-90 text-ember" />
          </a>
        </div>
      </div>

      <ShopfrontScene />
    </footer>
  );
}
