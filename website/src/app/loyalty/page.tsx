import type { Metadata } from 'next';
import Link from 'next/link';
import { buttonClass } from '@/components/ui/Button';
import { LOYALTY } from '@/data/loyalty';
import { CoffeeClubSteps } from '@/features/loyalty/CoffeeClubSteps';
import { StampRitual } from '@/features/loyalty/StampRitual';
import styles from '@/features/loyalty/StampRitual.module.css';

export const metadata: Metadata = {
  title: 'Coffee Club · Loyalty',
  description: 'Explore the proposed Lumi Lane Coffee Club and try the eight-stamp coffee reward demo.',
  alternates: { canonical: '/loyalty/' },
};

export default function LoyaltyPage() {
  return (
    <main id="main" className="view-enter px-6 pb-44 pt-24 sm:pt-32 lg:px-10">
      <div className={styles.page}>
        <header className={styles.intro}>
          <p className={styles.printLabel}>Lumi Lane Loyalty</p>
          <h1>Lumi Lane Coffee Club</h1>
          <p className={styles.tagline}>{LOYALTY.tagline}</p>
          <p className={styles.introCopy}>{LOYALTY.intro}</p>
          <p className={styles.introNotice}>{LOYALTY.notice}</p>
          <a href="#how-coffee-club-works" className={buttonClass({ size: 'sm', className: styles.introAction })}>
            Explore Coffee Club
          </a>
        </header>

        <CoffeeClubSteps />
        <StampRitual />

        <section className={styles.rewardGuide} aria-labelledby="reward-guide-title">
          <div>
            <p className={styles.printLabel}>The proposed reward</p>
            <h2 id="reward-guide-title">One standard coffee</h2>
            <p className={styles.rewardCopy}>
              A full card reveals a demo ticket. Flip it to see how redemption could work, then redeem it in the demo to
              start a fresh card.
            </p>
          </div>
          <div className={styles.faq}>
            <h3>Coffee Club FAQ</h3>
            {LOYALTY.faq.map(({ question, answer }) => (
              <details key={question}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <nav className={styles.detailLinks} aria-label="Coffee Club links">
          <Link className={styles.textButton} href="/menu/">
            Explore the menu
          </Link>
          <Link className={styles.textButton} href="/login/">
            Login
          </Link>
          <Link className={styles.textButton} href="/signup/">
            Sign Up
          </Link>
        </nav>
      </div>
    </main>
  );
}
