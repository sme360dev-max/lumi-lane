import type { CSSProperties, ReactNode } from 'react';
import Link from 'next/link';
import { ResponsivePicture } from '@/components/ui/ResponsivePicture';
import { ABOUT } from '@/data/content';
import styles from './About.module.css';
import { AboutReveal } from './AboutReveal';

// Stills from Lumi Lane's Instagram, cropped in CSS to suit each layout.
const photos = {
  evening: {
    name: 'about-evening',
    widths: [480, 720],
    width: 720,
    height: 1280,
    alt: 'Lumi Lane lit up at night, with diners outside',
  },
  falafel: {
    name: 'about-falafel',
    widths: [480, 800],
    width: 1080,
    height: 1440,
    alt: 'Falafel, tomatoes and grilled bread at a table inside Lumi Lane',
  },
  kitchen: {
    name: 'about-kitchen',
    widths: [480, 800, 1080],
    width: 1080,
    height: 1080,
    alt: 'A Lumi Lane team member holding a plated kitchen special',
  },
  skewers: {
    name: 'about-skewers',
    widths: [480, 800],
    width: 1080,
    height: 1440,
    alt: 'Grilled skewers with chips, salad and a dip',
  },
  counter: {
    name: 'about-counter',
    widths: [480, 640],
    width: 640,
    height: 1136,
    alt: 'Hands working at the marble counter inside Lumi Lane',
  },
  table: {
    name: 'about-table',
    widths: [480, 800, 1080],
    width: 1080,
    height: 1440,
    alt: 'A Lumi Lane table set with falafel, skewers and baked pasta',
  },
  brunch: {
    name: 'about-brunch',
    widths: [480, 800, 1080],
    width: 1080,
    height: 1080,
    alt: 'A Lumi Lane team member holding a dish topped with sliced avocado',
  },
} as const;

const gallery = [
  { photo: photos.kitchen, label: 'From the kitchen', lines: ['Made for long brunches.', 'Served all day.'] },
  { photo: photos.skewers, label: 'For the table', lines: ['A little of everything.', 'Plenty to share.'] },
  { photo: photos.counter, label: 'At the counter', lines: ['A coffee to start.', 'A seat to stay.'] },
] as const;

const visitLinks = [
  { href: '/menu/', title: ABOUT.ctaLabel, detail: 'Specialty coffee, all-day brunch and evening pours.' },
  { href: '/book/', title: 'Book a table', detail: 'Make time for brunch, a drink or a long catch-up.' },
  { href: '/visit/', title: 'Visit us', detail: 'Find Lumi Lane on Fosters Road in Lightsview.' },
] as const;

const delay = (ms: number) => ({ '--delay': `${ms}ms` }) as CSSProperties;

function StoryPhoto({
  photo,
  sizes,
  className = '',
  drift,
  priority,
  horizontal,
  wait = 0,
}: {
  photo: (typeof photos)[keyof typeof photos];
  sizes: string;
  className?: string;
  drift?: number;
  priority?: boolean;
  horizontal?: boolean;
  wait?: number;
}) {
  return (
    <div
      className={`${styles.photo} ${styles.reveal} ${className}`}
      data-photo={horizontal ? 'horizontal' : 'vertical'}
      style={delay(wait)}
    >
      <div className={styles.photoImage} data-about-drift={drift}>
        <ResponsivePicture {...photo} sizes={sizes} priority={priority} />
      </div>
    </div>
  );
}

function ChapterHeading({ id, title, children }: { id: string; title: ReactNode; children: ReactNode }) {
  return (
    <div className={styles.grid}>
      <h3 id={id} className={`${styles.chapterTitle} ${styles.reveal}`}>
        {title}
      </h3>
      <p className={`${styles.bodyCopy} ${styles.chapterCopy} ${styles.reveal}`} style={delay(120)}>
        {children}
      </p>
    </div>
  );
}

export function AboutView() {
  return (
    <AboutReveal className={styles.story}>
      <header className={styles.hero}>
        <div className={styles.container}>
          <p className={styles.eyebrow}>{ABOUT.eyebrow}</p>
          <div className={`${styles.grid} ${styles.heroHeading}`}>
            <h1 className={styles.heroTitle}>
              {ABOUT.title.map((line, index) => (
                <span key={line} className={styles.line}>
                  {index > 0 && ' '}
                  <span className={styles.lineInner} style={delay(100 + index * 120)}>
                    {line}
                  </span>
                </span>
              ))}
            </h1>
            <p className={`${styles.bodyCopy} ${styles.intro}`}>{ABOUT.intro}</p>
          </div>

          <div className={`${styles.grid} ${styles.heroPhotos}`}>
            <figure className={styles.heroMain}>
              <StoryPhoto
                photo={photos.evening}
                sizes="(min-width: 1044px) 70vw, 100vw"
                className={styles.evening}
                priority
              />
            </figure>
            <div className={styles.heroSide}>
              <StoryPhoto
                photo={photos.falafel}
                sizes="(min-width: 1044px) 395px, 40vw"
                className={styles.falafel}
                drift={22}
                wait={170}
              />
              <div className={styles.reveal} style={delay(240)}>
                <p className={`${styles.eyebrow} ${styles.accent}`}>Our story</p>
                <p className={styles.heroNote}>Good coffee. Long lunches. Always room for one more.</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section aria-labelledby="about-chapters">
        <div className={styles.container}>
          <h2 id="about-chapters" className={`${styles.eyebrow} ${styles.accent}`}>
            Life at Lumi Lane
          </h2>
          <article className={styles.firstChapter} aria-labelledby="about-day">
            <ChapterHeading id="about-day" title={ABOUT.dayTitle}>
              Start with an espresso, settle in for brunch or stay for a glass of South Australian wine and a few plates
              to share.
            </ChapterHeading>
            <div className={styles.gallery}>
              {gallery.map(({ photo, label, lines }, index) => (
                <figure key={label} className={styles.galleryItem}>
                  <StoryPhoto
                    photo={photo}
                    sizes="(min-width: 1044px) 40vw, 100vw"
                    className={styles.galleryPhoto}
                    drift={index === 1 ? 26 : undefined}
                    wait={index * 140}
                  />
                  <figcaption className={`${styles.caption} ${styles.reveal}`} style={delay(150 + index * 140)}>
                    <p className={styles.eyebrow}>{label}</p>
                    <p>
                      {lines[0]}
                      <br />
                      {lines[1]}
                    </p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </article>

          <article className={styles.chapter} aria-labelledby="about-kitchen">
            <ChapterHeading id="about-kitchen" title={ABOUT.kitchenTitle}>
              {ABOUT.kitchen}
            </ChapterHeading>
            <figure className={styles.chapterPhoto}>
              <StoryPhoto
                photo={photos.table}
                sizes="(min-width: 1320px) 1240px, 100vw"
                className={styles.table}
                horizontal
              />
            </figure>
            <ul className={styles.details}>
              {ABOUT.day.map((item, index) => (
                <li key={item.label} className={styles.reveal} style={delay(index * 120)}>
                  <h4>{item.label}</h4>
                  <p>{item.lines.join(' ')}</p>
                </li>
              ))}
            </ul>
          </article>
        </div>

        <article className={`${styles.chapter} ${styles.neighbourhood}`} aria-labelledby="about-neighbourhood">
          <StoryPhoto photo={photos.brunch} sizes="100vw" className={styles.brunch} drift={30} />
          <div className={`${styles.container} ${styles.chapterPhoto}`}>
            <ChapterHeading id="about-neighbourhood" title="A place to stay a little longer.">
              We’re on Fosters Road in Lightsview. Drop by for a coffee, meet someone for brunch or bring the whole
              table together for an occasion.
            </ChapterHeading>
          </div>
        </article>
      </section>

      <section className={styles.visit} aria-labelledby="about-visit">
        <div className={styles.container}>
          <div className={styles.visitIntro}>
            <h2 id="about-visit" className={styles.reveal}>
              Come for the coffee.
              <br />
              <span>Stay for the company.</span>
            </h2>
            <p className={styles.reveal} style={delay(120)}>
              Make Lumi Lane part of your day, from the first flat white to the last plate on the table.
            </p>
          </div>
          <ul className={styles.visitLinks}>
            {visitLinks.map(({ href, title, detail }, index) => (
              <li key={href} className={styles.reveal} style={delay(index * 110)}>
                <Link href={href}>
                  <span aria-hidden="true" className={styles.visitArrow}>
                    ↗
                  </span>
                  <span className={styles.visitLinkTitle}>{title}</span>
                  <span>{detail}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </AboutReveal>
  );
}
