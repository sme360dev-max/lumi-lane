import type { ReactNode } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { ResponsivePicture } from '@/components/ui/ResponsivePicture';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { BUSINESS } from '@/data/business';
import { VISIT } from '@/data/content';

function InfoRow({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div className="flex items-baseline gap-4 border-t border-cocoa/10 py-4">
      <dt className="w-[9rem] shrink-0 text-[11px] uppercase tracking-[0.2em] text-cocoa/55">{term}</dt>
      <dd className="min-w-0 text-[15px] font-medium tabular-nums text-cocoa">{children}</dd>
    </div>
  );
}

export function VisitView() {
  const instagram = BUSINESS.social.find((s) => s.id === 'instagram');
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader eyebrow={VISIT.eyebrow} title={VISIT.title} />

      <div className="mt-16 grid gap-x-16 gap-y-12 md:grid-cols-2">
        <div>
          <SectionLabel>Where We Are</SectionLabel>
          <address className="mt-6 font-sans text-[clamp(1.25rem,2.4vw,1.8rem)] font-normal not-italic leading-[1.5] tracking-wide text-cocoa">
            {BUSINESS.address.line1}
            <br />
            {BUSINESS.address.line2}
          </address>

          <SectionLabel className="mt-14">Opening Hours</SectionLabel>
          <dl className="mt-6">
            {BUSINESS.hours.map((h) => (
              <InfoRow key={h.label} term={h.label}>
                {h.time}
              </InfoRow>
            ))}
          </dl>

          <SectionLabel className="mt-14">Contact</SectionLabel>
          <dl className="mt-6">
            <InfoRow term="Phone">
              <a href={BUSINESS.phone.href} className="transition-colors hover:text-ember">
                {BUSINESS.phone.display}
              </a>
            </InfoRow>
            <InfoRow term="Instagram">
              <a
                href={instagram?.href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-ember"
              >
                {BUSINESS.instagramHandle}
              </a>
            </InfoRow>
          </dl>
        </div>

        <div className="flex flex-col">
          <div className="relative overflow-hidden border border-cocoa/15">
            <ResponsivePicture
              name="storefront"
              widths={[480, 800, 1200]}
              sizes="(min-width: 1152px) 512px, (min-width: 768px) calc(50vw - 64px), calc(100vw - 48px)"
              width={1360}
              height={972}
              alt={VISIT.storefrontAlt}
              className="block aspect-[4/3] w-full object-cover"
            />
          </div>
          <div className="mt-7">
            <SectionLabel as="h2">{VISIT.gettingHereTitle}</SectionLabel>
            <p className="mt-4 max-w-[38ch] font-sans text-[14px] leading-relaxed text-cocoa/65">{VISIT.gettingHere}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
