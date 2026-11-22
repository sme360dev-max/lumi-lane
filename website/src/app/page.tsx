import { HeroSection } from '@/features/home/HeroSection';
import { LegacyHashRedirect } from '@/features/home/LegacyHashRedirect';

export default function HomePage() {
  return (
    <main id="main">
      <LegacyHashRedirect />
      <HeroSection />
    </main>
  );
}
