import type { CSSProperties, ReactNode } from 'react';
import { ResponsivePicture } from '@/components/ui/ResponsivePicture';
import { ABOUT } from '@/data/content';
import styles from './About.module.css';
import { AboutReveal } from './AboutReveal';

const photoWidths = [480, 800, 1440] as const;

// Photographs from Lumi Lane's Instagram, cropped in CSS to suit each layout.
const photos = {
  burger: {
    name: 'about-breakfast-burger',
    widths: photoWidths,
    width: 1440,
    height: 1440,
    alt: 'Two hands holding a Lumi Lane breakfast burger',
  },
  pour: {
    name: 'about-drink-pour',
    widths: photoWidths,
    width: 1440,
    height: 1440,
    alt: 'A warm drink poured from a red jug into a ceramic cup',
  },
  scroll: {
    name: 'about-cinnamon-scroll',
    widths: photoWidths,
    width: 1440,
    height: 1440,
    alt: 'A cinnamon scroll served with freshly dispensed soft serve',
  },
  mezze: {
    name: 'about-mezze-share',
    widths: photoWidths,
    width: 1440,
    height: 1439,
    alt: 'A close-up of the Lumi Lane mezze platter with dips, olives and warm bread',
  },
  dessert: {
    name: 'about-chocolate-dessert',
    widths: photoWidths,
    width: 1440,
    height: 1439,
    alt: 'A chocolate cupcake topped with shards of dark chocolate',
  },
  table: {
    name: 'about-brunch-spread',
    widths: [...photoWidths, 1920, 2560, 3840],
    width: 1440,
    height: 1439,
    alt: 'An overhead view of mezze, brunch plates, coffee and pastries at Lumi Lane',
  },
  brunch: {
    name: 'about-brunch-plate',
    widths: [...photoWidths, 1920, 2560, 3840],
    width: 1440,
    height: 1440,
    alt: 'A Lumi Lane team member holding a dish topped with sliced avocado',
  },
} as const;

const gallery = [
  { photo: photos.scroll, label: 'From the kitchen', lines: ['Warm cinnamon scrolls.', 'Soft serve on the side.'] },
  { photo: photos.mezze, label: 'For the table', lines: ['A little of everything.', 'Plenty to share.'] },
  { photo: photos.dessert, label: 'Something sweet', lines: ['Chocolate cupcake.', 'Dark chocolate shards.'] },
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
                photo={photos.burger}
                sizes="(min-width: 1044px) 70vw, 100vw"
                className={styles.heroImage}
                priority
              />
            </figure>
            <div className={styles.heroSide}>
              <StoryPhoto
                photo={photos.pour}
                sizes="(min-width: 1044px) 395px, 40vw"
                className={styles.heroDetail}
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
          <StoryPhoto
            photo={photos.brunch}
            sizes="(min-width: 1440px) 1440px, 100vw"
            className={styles.brunch}
            drift={30}
          />
          <div className={`${styles.container} ${styles.chapterPhoto}`}>
            <ChapterHeading id="about-neighbourhood" title="A place to stay a little longer.">
              We’re on Fosters Road in Lightsview. Drop by for a coffee, meet someone for brunch or bring the whole
              table together for an occasion.
            </ChapterHeading>
          </div>
        </article>
      </section>
    </AboutReveal>
  );
}
