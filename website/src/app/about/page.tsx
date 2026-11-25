import type { Metadata } from 'next';
import { AboutView } from '@/features/about/AboutView';

export const metadata: Metadata = {
  title: 'About',
  description: 'A modern Australian coffee house and bar in Lightsview, cooking brunch with a Middle Eastern accent.',
  alternates: { canonical: '/about/' },
};

export default function AboutPage() {
  return (
    <main id="main" className="view-enter overflow-x-clip pt-[5.5rem]">
      <AboutView />
    </main>
  );
}
