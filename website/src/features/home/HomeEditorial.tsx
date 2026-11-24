import Link from 'next/link';
import { ExploreTrail } from './ExploreTrail';
import { HomeReveals } from './HomeReveals';

const focus =
  'rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember';

export function HomeEditorial() {
  return (
    <HomeReveals>
      <div className="mx-auto max-w-[1440px] px-6 pt-14 sm:px-10 sm:pt-16 lg:px-14 lg:pt-20 xl:px-20">
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
      </div>

      <ExploreTrail />
    </HomeReveals>
  );
}
