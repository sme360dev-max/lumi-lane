import type { Metadata } from 'next';
import { ResponsivePicture } from '@/components/ui/ResponsivePicture';
import { Membership } from '@/features/loyalty/Membership';
import styles from '@/features/loyalty/Loyalty.module.css';

export const metadata: Metadata = {
  title: 'Coffee Club · Loyalty',
  description: 'Create a Coffee Club card on this device and view it on your phone.',
  alternates: { canonical: '/loyalty/' },
};

export default function LoyaltyPage() {
  return (
    <main id="main" className={styles.page}>
      <section className={`view-enter ${styles.hero}`} aria-labelledby="loyalty-title">
        <div className={styles.heroContent}>
          <h1 id="loyalty-title" className={styles.title}>
            Lumi Lane <span>Coffee Club</span>
          </h1>
          <p className={styles.heroIntro}>Create a digital Coffee Club card for this device.</p>
          <a href="#join-club" className={`${styles.primary} ${styles.heroJoin}`}>
            Sign up for Coffee Club
          </a>
        </div>
        <figure className={styles.heroPhoto}>
          <ResponsivePicture
            name="loyalty-cocoa"
            widths={[480, 800, 1440]}
            sizes="(min-width: 1340px) 720px, (min-width: 850px) 55vw, 100vw"
            width={1440}
            height={1440}
            alt="Cocoa being dusted over a ceramic cup at Lumi Lane"
            priority
          />
        </figure>
      </section>

      <Membership />
    </main>
  );
}
