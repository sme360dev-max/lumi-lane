import type { Metadata } from 'next';
import { ButtonLink } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';
import { PageShell } from '@/components/layout/PageShell';
import { MENU_PAGE } from '@/data/content';
import { MENU } from '@/data/menu';
import { MenuTabs } from '@/features/menu/MenuTabs';

export const metadata: Metadata = {
  title: 'Menu',
  description: 'All-day brunch, açai bowls, coffee & drinks and the Lumi Lane bar list, with prices.',
  alternates: { canonical: '/menu/' },
};

export default function MenuPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-6xl">
        <PageHeader eyebrow={MENU_PAGE.eyebrow} title={MENU_PAGE.title}>
          <p className="mx-auto mt-6 max-w-[44ch] text-sm leading-relaxed text-cocoa/65">{MENU_PAGE.intro}</p>
        </PageHeader>

        <MenuTabs categories={MENU} />

        <section aria-labelledby="menu-cta" className="mt-28 border-t border-cocoa/10 pt-20 text-center">
          <h2
            id="menu-cta"
            className="font-serif text-[clamp(1.8rem,4.4vw,3.2rem)] font-black uppercase tracking-tight text-cocoa"
          >
            {MENU_PAGE.ctaTitle}
          </h2>
          <p className="mt-4 text-sm text-cocoa/65">{MENU_PAGE.ctaText}</p>
          <ButtonLink href="/book/" className="mt-9">
            {MENU_PAGE.ctaLabel}
          </ButtonLink>
        </section>
      </div>
    </PageShell>
  );
}
