import type { Metadata } from 'next';
import Link from 'next/link';
import { LOYALTY } from '@/data/loyalty';
import { CounterPreview } from '@/features/loyalty/CounterPreview';
import { HeroCard } from '@/features/loyalty/HeroCard';
import { ScrollStory } from '@/features/loyalty/ScrollStory';
import { StampDemo } from '@/features/loyalty/StampDemo';
import styles from '@/features/loyalty/Loyalty.module.css';

export const metadata: Metadata = {
  title: 'Coffee Club · Loyalty',
  description: 'Explore the proposed Lumi Lane Coffee Club and try the eight-stamp coffee reward demo.',
  alternates: { canonical: '/loyalty/' },
};

export default function LoyaltyPage() {
  const [firstLine, secondLine] = LOYALTY.titleLines;
  return (
    // No entry transform on <main>: a transformed ancestor would break the scroll story's pin.
    <main id="main" className={styles.page}>
      <section className={`view-enter ${styles.hero}`} aria-labelledby="loyalty-title">
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>{LOYALTY.eyebrow}</p>
          <h1 id="loyalty-title" className={styles.title}>
            <span>{firstLine}</span> <em>{secondLine}</em>
          </h1>
          <p className={styles.disclaimer}>
            {LOYALTY.disclaimer}{' '}
            <a href="#try-it" className={styles.inlineLink}>
              {LOYALTY.disclaimerLink}
            </a>
            .
          </p>
        </div>
        <HeroCard />
      </section>

      <ScrollStory />

      <StampDemo />

      <CounterPreview />

      <section className={styles.faq} aria-labelledby="faq-title">
        <h2 id="faq-title" className={styles.h2}>
          {LOYALTY.faqTitle}
        </h2>
        <div className={styles.faqList}>
          {LOYALTY.faq.map(({ question, answer }) => (
            <details key={question} className={styles.faqItem}>
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
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
      </section>
    </main>
  );
}
