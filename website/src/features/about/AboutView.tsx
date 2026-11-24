import type { CSSProperties } from 'react';
import { ButtonLink } from '@/components/ui/Button';
import { ResponsivePicture } from '@/components/ui/ResponsivePicture';
import { ABOUT, VISIT } from '@/data/content';
import styles from './About.module.css';
import { AboutReveal } from './AboutReveal';

const DISH_WIDTHS = [480, 800, 1254] as const;
const eyebrow = 'text-[11px] font-semibold uppercase tracking-[0.32em]';
const delay = (ms: number) => ({ '--delay': `${ms}ms` }) as CSSProperties;

export function AboutView() {
  return (
    <AboutReveal className="mx-auto max-w-[1320px] px-6 lg:px-10">
      {/* 1. Headline left, intro right, aligned to the headline's last line. */}
      <header className="grid gap-y-10 lg:grid-cols-12 lg:items-end lg:gap-x-10">
        <div className="lg:col-span-8">
          <p className={`${eyebrow} text-cocoa/60`}>{ABOUT.eyebrow}</p>
          <h1 className="mt-7 font-serif text-[clamp(2.6rem,11.8vw,5.6rem)] font-normal leading-[1.02] tracking-[-0.018em] text-cocoa sm:mt-9 lg:text-[clamp(4.5rem,7.6vw,7.5rem)]">
            {ABOUT.title.map((line, i) => (
              <span key={line}>
                {i > 0 && ' '}
                <span className={styles.line}>
                  <span
                    className={`${styles.lineInner} ${i > 0 ? 'italic text-ember' : ''}`}
                    style={{ '--line': i } as CSSProperties}
                  >
                    {line}
                  </span>
                </span>
              </span>
            ))}
          </h1>
        </div>
        <p
          className={`${styles.intro} max-w-[36ch] text-[17px] leading-[1.7] text-cocoa/75 md:ml-auto md:w-1/2 lg:col-span-4 lg:ml-0 lg:w-auto lg:pb-3 lg:text-lg`}
        >
          {ABOUT.intro}
        </p>
      </header>

      {/* 2. The shopfront bleeding off the left edge, a dish panel offset lower on the right. */}
      <div className="mt-20 sm:mt-24 lg:mt-36 lg:flex lg:items-start lg:gap-10">
        <figure
          className={`${styles.reveal} -mx-6 lg:mx-0 lg:ml-[calc(50%-50vw)] lg:w-[calc(58%+50vw-50%)] lg:shrink-0`}
        >
          <div className="relative aspect-[4/3] overflow-hidden bg-cream/40 lg:aspect-[3/2]">
            <ResponsivePicture
              name="storefront"
              widths={[480, 800, 1200]}
              width={1360}
              height={972}
              alt={VISIT.storefrontAlt}
              sizes="(min-width: 1024px) 62vw, 100vw"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <figcaption className="mt-4 px-6 text-[13px] text-cocoa/60 lg:px-0 lg:text-right">
            {ABOUT.storefrontCaption}
          </figcaption>
        </figure>

        <figure
          className={`${styles.reveal} mt-12 sm:ml-auto sm:w-[62%] lg:mt-40 lg:w-[30%]`}
          style={delay(140)}
        >
          <div className="relative aspect-square bg-cream/60 sm:aspect-[4/3] lg:aspect-[3/4]">
            <ResponsivePicture
              name={ABOUT.pairDish.image}
              widths={DISH_WIDTHS}
              width={1254}
              height={1254}
              alt={ABOUT.pairDish.alt}
              sizes="(min-width: 1320px) 330px, (min-width: 1024px) 25vw, (min-width: 640px) 52vw, 84vw"
              className={styles.dish}
            />
          </div>
        </figure>
      </div>

      {/* 3. Coffee, kitchen, bar. */}
      <section aria-labelledby="about-day" className="mt-28 sm:mt-32 lg:mt-44">
        <div className={`${styles.reveal} grid gap-y-5 lg:grid-cols-12 lg:items-end lg:gap-x-10`}>
          <h2
            id="about-day"
            className="font-serif text-[clamp(2.25rem,7.6vw,4.75rem)] font-normal leading-[1.04] tracking-[-0.015em] text-cocoa lg:col-span-7"
          >
            {ABOUT.dayTitle}
          </h2>
          <p className="font-serif text-xl italic text-cocoa/70 lg:col-span-5 lg:pb-3 lg:text-right lg:text-2xl">
            {ABOUT.daySubline}
          </p>
        </div>

        <ul className="mt-12 grid gap-y-16 border-t border-cocoa/15 pt-10 sm:mt-16 sm:grid-cols-3 sm:gap-x-6 lg:gap-x-10 lg:pt-12">
          {ABOUT.day.map((item, i) => (
            <li key={item.label} className={styles.reveal} style={delay(i * 120)}>
              <div className="relative aspect-[4/3] bg-cream/60 sm:aspect-[4/5]">
                <ResponsivePicture
                  name={item.image}
                  widths={DISH_WIDTHS}
                  width={1254}
                  height={1254}
                  alt={item.alt}
                  sizes="(min-width: 1320px) 320px, (min-width: 640px) 26vw, 64vw"
                  className={styles.dish}
                />
              </div>
              <p className={`${eyebrow} mt-6 text-ember`}>{item.label}</p>
              {/* Two lines on desktop; one flowing sentence where the column is too narrow to hold them. */}
              <p className="mt-3 text-pretty font-serif text-xl leading-[1.35] text-cocoa sm:text-lg lg:text-[22px]">
                {item.lines.map((line, j) => (
                  <span key={line} className="xl:block">
                    {j > 0 && ' '}
                    {line}
                  </span>
                ))}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* 4. Closing statement and the way to the menu. */}
      <section
        aria-labelledby="about-closing"
        className={`${styles.reveal} mt-28 border-t border-cocoa/15 pt-16 sm:mt-32 lg:mt-44 lg:pt-24`}
      >
        <h2
          id="about-closing"
          className="font-serif text-[clamp(2.4rem,8.4vw,6rem)] font-normal leading-[1.04] tracking-[-0.018em] text-cocoa"
        >
          {ABOUT.closing[0]} <em className="block text-balance italic text-ember">{ABOUT.closing[1]}</em>
        </h2>
        <div className="mt-10 grid gap-y-10 lg:mt-14 lg:grid-cols-12 lg:gap-x-10">
          <p className="max-w-[52ch] text-base leading-[1.75] text-cocoa/70 lg:col-span-6 lg:col-start-7">
            {ABOUT.kitchen}
          </p>
          <div className="lg:col-span-6 lg:col-start-7">
            <ButtonLink href="/menu/">{ABOUT.ctaLabel}</ButtonLink>
          </div>
        </div>
      </section>
    </AboutReveal>
  );
}
