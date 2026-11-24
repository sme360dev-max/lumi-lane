import type { Metadata } from 'next';
import { AboutView } from '@/features/about/AboutView';

export const metadata: Metadata = {
  title: 'About',
  description: 'A modern Australian coffee house and bar in Lightsview, cooking brunch with a Middle Eastern accent.',
  alternates: { canonical: '/about/' },
};

/** Same clearances as PageShell, without its side padding, so the shopfront photo can bleed to the edge. */
export default function AboutPage() {
  return (
    <main id="main" className="view-enter overflow-x-clip pb-[max(11rem,var(--nav-clearance))] pt-32 sm:pt-36">
      <AboutView />
    </main>
  );
}
