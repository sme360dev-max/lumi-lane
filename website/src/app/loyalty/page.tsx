import type { Metadata } from 'next';
import Link from 'next/link';
import { LOYALTY } from '@/data/loyalty';
import { STAMP_TARGET } from '@/features/loyalty/ritualState';
import { StampRitual } from '@/features/loyalty/StampRitual';
import styles from '@/features/loyalty/StampRitual.module.css';

export const metadata: Metadata = {
  title: 'The Stamp Ritual · Loyalty',
  description: 'Try a proposed Lumi Lane Coffee Club stamp card in an interactive, demo-only experience.',
  alternates: { canonical: '/loyalty/' },
};

export default function LoyaltyPage() {
  return (
    <main id="main" className="view-enter px-6 pb-44 pt-24 sm:pt-32 lg:px-10">
      <div className={styles.page}>
        <header className={styles.intro}>
          <p className={styles.printLabel}>Lumi Lane Loyalty</p>
          <h1>The Stamp Ritual</h1>
          <p className={styles.tagline}>{LOYALTY.tagline}</p>
          <p>{LOYALTY.notice}</p>
        </header>

        <StampRitual />

        <section className={styles.details} aria-labelledby="proposed-club">
          <div>
            <h2 id="proposed-club">The proposed Coffee Club</h2>
            <p>
              One stamp per eligible coffee. Collect {STAMP_TARGET} for one standard coffee, then start a fresh card
              after demo redemption. The proposed rules are awaiting approval.
            </p>
          </div>
          <div className={styles.detailLinks}>
            <Link className={styles.textButton} href="/menu/">
              Explore the menu
            </Link>
            <Link className={styles.textButton} href="/login/">
              Login
            </Link>
            <Link className={styles.textButton} href="/signup/">
              Sign Up
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
