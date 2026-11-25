import type { Metadata } from 'next';
import Link from 'next/link';
import { ResponsivePicture } from '@/components/ui/ResponsivePicture';
import { LOYALTY } from '@/data/loyalty';
import { Membership } from '@/features/loyalty/Membership';
import { ScrollStory } from '@/features/loyalty/ScrollStory';
import { StampDemo } from '@/features/loyalty/StampDemo';
import styles from '@/features/loyalty/Loyalty.module.css';

export const metadata: Metadata = {
  title: 'Coffee Club · Loyalty',
  description: 'Explore the proposed Lumi Lane Coffee Club and try the eight-stamp coffee reward demo.',
  alternates: { canonical: '/loyalty/' },
};

export default function LoyaltyPage() {
  return (
    // No entry transform on <main>: a transformed ancestor would break the scroll story's pin.
    <main id="main" className={styles.page}>
      <section className={`view-enter ${styles.hero}`} aria-labelledby="loyalty-title">
        <div className={styles.heroContent}>
          <h1 id="loyalty-title" className={styles.title}>
            Lumi Lane <span>Coffee Club</span>
          </h1>
          <p className={styles.heroIntro}>See how your digital member card and barcode will look.</p>
          <a href="#join-club" className={`${styles.primary} ${styles.heroJoin}`}>
            Preview the member card
          </a>
          <div className={styles.heroDemo}>
            <p className={styles.disclaimer}>{LOYALTY.disclaimer}</p>
            <a href="#try-it" className={styles.heroLink}>
              {LOYALTY.disclaimerLink}
              <span aria-hidden="true">↓</span>
            </a>
          </div>
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

      <ScrollStory />

      <Membership />

      <StampDemo />

      <section className={styles.faq} aria-labelledby="faq-title">
        <div>
          <h2 id="faq-title" className={styles.h2}>
            {LOYALTY.faqTitle}
          </h2>
          <p className={styles.closing}>{LOYALTY.closing}</p>
          <p className={styles.account}>
            Try the demo without an account, or{' '}
            <Link className={styles.inlineLink} href="/login/">
              Login
            </Link>{' '}
            <span aria-hidden="true">·</span>{' '}
            <Link className={styles.inlineLink} href="/signup/">
              Sign Up
            </Link>
            .
          </p>
        </div>
        <div className={styles.faqList}>
          {LOYALTY.faq.map(({ question, answer }) => (
            <details key={question} className={styles.faqItem}>
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
