import type { CSSProperties } from 'react';
import { ButtonLink } from '@/components/ui/Button';
import { ResponsivePicture } from '@/components/ui/ResponsivePicture';
import { ABOUT, VISIT } from '@/data/content';
import styles from './About.module.css';
import { AboutReveal } from './AboutReveal';

/** Split a headline into two lines by words, as evenly as the words allow. */
function twoLines(title: string): string[] {
  const words = title.split(' ');
  let best = 1;
  let bestDiff = Infinity;
  for (let i = 1; i < words.length; i++) {
    const diff = Math.abs(words.slice(0, i).join(' ').length - words.slice(i).join(' ').length);
    if (diff < bestDiff) {
      best = i;
      bestDiff = diff;
    }
  }
  return [words.slice(0, best).join(' '), words.slice(best).join(' ')].filter(Boolean);
}

export function AboutView() {
  const lines = twoLines(ABOUT.title);

  return (
    <div className="mx-auto max-w-5xl">
      {/* Same eyebrow and headline as PageHeader, with the title set line by line for the mask reveal. */}
      <header className="text-center">
        <p className="font-script text-3xl text-ember sm:text-4xl">{ABOUT.eyebrow}</p>
        <h1 className="mx-auto mt-6 max-w-[18ch] font-serif text-[clamp(2rem,5.2vw,4.2rem)] font-black leading-[1.02] tracking-tight text-cocoa">
          {lines.map((line, i) => (
            <span key={line}>
              {i > 0 && ' '}
              <span className={styles.line}>
                <span className={styles.lineInner} style={{ '--line': i } as CSSProperties}>
                  {line}
                </span>
              </span>
            </span>
          ))}
        </h1>
      </header>

      <div className="mt-16 grid gap-x-16 gap-y-10 border-t border-cocoa/10 pt-12 md:grid-cols-2">
        {ABOUT.columns.map((paras, i) => (
          <div key={i} className="space-y-6 text-[15px] leading-[1.75] text-cocoa/70">
            {paras.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        ))}
      </div>

      <figure className="mt-16 border-y border-cocoa/10 py-12 text-center sm:mt-20 sm:py-14">
        <blockquote className="mx-auto max-w-[26ch] font-serif text-[clamp(1.5rem,3.4vw,2.4rem)] font-medium italic leading-[1.25] text-cocoa">
          {ABOUT.quote}
        </blockquote>
      </figure>

      <dl className="mt-14 grid gap-x-12 gap-y-10 text-center sm:mt-16 sm:grid-cols-3">
        {ABOUT.facts.map((f) => (
          <div key={f.term}>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.3em] text-ember">{f.term}</dt>
            <dd className="mt-4 font-serif text-2xl text-cocoa">{f.title}</dd>
            <dd className="mt-2 text-[13px] leading-relaxed text-cocoa/60">{f.text}</dd>
          </div>
        ))}
      </dl>

      {/* One printed photograph laid on the page, settling into place as it scrolls in. */}
      <figure className="mx-auto mt-16 w-[88%] max-w-[560px] sm:mt-20">
        <AboutReveal>
          <ResponsivePicture
            name="storefront"
            widths={[480, 800, 1200]}
            width={1360}
            height={972}
            alt={VISIT.storefrontAlt}
            sizes="(min-width: 640px) 536px, calc(88vw - 20px)"
            className="block h-auto w-full"
          />
        </AboutReveal>
        <figcaption className="mt-7 text-center font-serif text-[17px] italic text-cocoa/70 sm:text-lg">
          {ABOUT.facts[0]?.text}
        </figcaption>
      </figure>

      <div className="mt-10 text-center sm:mt-12">
        <ButtonLink href="/menu/">{ABOUT.ctaLabel}</ButtonLink>
      </div>
    </div>
  );
}
