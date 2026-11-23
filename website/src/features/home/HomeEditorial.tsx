import Link from 'next/link';
import { ResponsivePicture } from '@/components/ui/ResponsivePicture';
import { MENU_PAGE, VISIT } from '@/data/content';
import { HomeReveals } from './HomeReveals';

const features = [
  {
    id: 'home-menu',
    title: 'Explore the Menu',
    href: '/menu/',
    description: MENU_PAGE.intro,
    image: 'mezze',
    alt: 'Lumi Lane mezze board with dips, olives and pita',
    surface: 'bg-cream/80',
    storefront: false,
  },
  {
    id: 'home-book',
    title: 'Book a Table',
    href: '/book/',
    description: 'Plan breakfast, brunch or a drink at our Lightsview coffee house.',
    image: 'storefront',
    alt: VISIT.storefrontAlt,
    surface: 'bg-cream',
    storefront: true,
  },
  {
    id: 'home-loyalty',
    title: 'Loyalty',
    href: '/loyalty/',
    description: 'See what’s planned for Lumi Lane’s regulars, from member access to rewards.',
    image: 'coffee',
    alt: 'A Lumi Lane latte with leaf art',
    surface: 'bg-ember/15',
    storefront: false,
  },
] as const;

const focus =
  'rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember';
const sizes = '(min-width: 1440px) 400px, (min-width: 768px) 30vw, calc(100vw - 48px)';

export function HomeEditorial() {
  return (
    <HomeReveals>
      <div className="mx-auto max-w-[1440px] px-6 pb-16 pt-14 sm:px-10 sm:pb-20 sm:pt-16 lg:px-14 lg:pb-24 lg:pt-20 xl:px-20">
        <section aria-labelledby="home-story" data-home-reveal>
          <h2
            id="home-story"
            data-home-intro-part
            className="font-serif text-[clamp(2.15rem,5.6vw,4.75rem)] font-medium leading-[1.04] tracking-[-0.045em]"
          >
            A coffee house
            <br />
            <em className="font-normal text-ember">with a long table.</em>
          </h2>
          <p
            data-home-intro-part
            className="mt-5 max-w-[42ch] text-[15px] leading-relaxed text-cocoa/80 sm:mt-6 sm:text-base"
          >
            In Lightsview, we serve specialty coffee and all-day Australian brunch with a Middle Eastern accent.
          </p>
          <div data-home-intro-part className="mt-4">
            <Link
              href="/about/"
              className={`inline-flex min-h-11 items-center text-sm font-semibold underline decoration-ember underline-offset-[6px] hover:text-ember ${focus}`}
            >
              Read our story
            </Link>
          </div>
        </section>

        <section aria-labelledby="home-explore" className="mt-12 sm:mt-16 lg:mt-[4.5rem]">
          <h2 id="home-explore" className="font-serif text-xl font-medium sm:text-2xl">
            Explore Lumi Lane
          </h2>
          <div className="mt-5 grid gap-x-6 gap-y-10 md:grid-cols-3 lg:mt-7 lg:gap-x-9">
            {features.map((feature, index) => (
              <article key={feature.id} data-home-reveal={index}>
                <Link href={feature.href} aria-labelledby={feature.id} className={`group block ${focus}`}>
                  <div className={`aspect-[4/3] overflow-hidden rounded-md ${feature.surface}`}>
                    <ResponsivePicture
                      name={feature.image}
                      alt={feature.alt}
                      widths={feature.storefront ? [480, 800, 1200] : [480, 800, 1254]}
                      sizes={sizes}
                      width={feature.storefront ? 1360 : 1254}
                      height={feature.storefront ? 972 : 1254}
                      className={`block h-full w-full motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-lumi motion-safe:group-hover:scale-[1.04] ${feature.storefront ? 'object-cover' : 'object-contain p-2 drop-shadow-[0_12px_16px_rgba(28,24,20,0.18)]'}`}
                    />
                  </div>
                  <h3
                    id={feature.id}
                    className="mt-4 font-serif text-[clamp(1.4rem,2.2vw,1.9rem)] font-medium leading-tight tracking-tight underline decoration-cocoa/30 decoration-1 underline-offset-[5px] transition-colors group-hover:text-ember group-hover:decoration-ember"
                  >
                    {feature.title}
                  </h3>
                </Link>
                <p className="mt-2 max-w-[35ch] text-[15px] leading-relaxed text-cocoa/75">{feature.description}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </HomeReveals>
  );
}
