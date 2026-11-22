import Link from 'next/link';
import { BUSINESS } from '@/data/business';
import { FOOTER } from '@/data/content';
import { PRIMARY_NAV } from '@/data/navigation';
import { SocialIcon } from './SocialIcon';

export function SiteFooter() {
  return (
    <footer className="bg-olive px-6 pb-40 pt-32 text-cream lg:px-10">
      <div className="mx-auto max-w-6xl">
        <p className="text-center font-serif text-2xl italic text-cream sm:text-3xl">
          {FOOTER.tagline[0]}{' '}
          <span className="not-italic text-cream" aria-hidden="true">
            &#10038;
          </span>{' '}
          {FOOTER.tagline[1]}
        </p>

        <div className="mt-20 grid grid-cols-2 gap-x-8 gap-y-14 text-center sm:gap-y-16 md:grid-cols-4 md:text-left">
          <div>
            <nav aria-label="Footer" className="flex flex-col gap-3">
              {PRIMARY_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-xs uppercase tracking-[0.2em] text-cream/70 transition-colors hover:text-cream"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <ul className="mt-8 flex flex-wrap items-center justify-center gap-3 md:justify-start">
              {BUSINESS.social.map((s) => (
                <li key={s.id}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="grid aspect-square h-12 w-12 shrink-0 place-items-center rounded-full border-2 border-cream text-cream transition-all duration-200 hover:scale-110 hover:bg-cream hover:text-olive focus:outline-none focus-visible:ring-2 focus-visible:ring-cream focus-visible:ring-offset-2 focus-visible:ring-offset-olive motion-reduce:hover:scale-100"
                  >
                    <SocialIcon id={s.id} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.24em] text-cream">Opening Hours</h2>
            <div className="mt-5 space-y-2 text-sm leading-relaxed text-cream/70">
              {BUSINESS.hours.map((h) => (
                <p key={h.label}>
                  {h.label}
                  <br />
                  {h.time}
                </p>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.24em] text-cream">Where We Are</h2>
            <div className="mt-5 space-y-2 text-sm leading-relaxed text-cream/70">
              <address className="not-italic">
                {BUSINESS.address.line1}
                <br />
                {BUSINESS.address.line2}
              </address>
              <p>
                <a href={BUSINESS.phone.href} className="transition-colors hover:text-cream">
                  {BUSINESS.phone.display}
                </a>
              </p>
            </div>
          </div>

          {/* The original links these to "#": no policy pages exist yet, so they are listed, not linked. */}
          <div>
            <h2 className="sr-only">Policies</h2>
            <ul className="flex flex-col gap-3" aria-label="Policies (pages coming soon)">
              {BUSINESS.policies.map((p) => (
                <li key={p} className="text-xs text-cream/70" title="Coming soon">
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
