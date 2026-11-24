'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { CartDrawer } from '@/features/cart/CartDrawer';

type Tone = 'top' | 'solid' | 'dark';

const ring =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-2 focus-visible:ring-offset-shell group-data-[tone=dark]:focus-visible:ring-cream group-data-[tone=dark]:focus-visible:ring-offset-olive';
const accountLink = `inline-flex min-h-11 items-center rounded-sm px-0.5 font-sans text-[13px] font-normal leading-none tracking-[0.02em] text-cocoa transition-colors duration-200 hover:text-ember group-data-[tone=dark]:text-cream group-data-[tone=dark]:hover:text-ember ${ring}`;
const signUpLink = `${accountLink} underline decoration-ember decoration-[1.5px] underline-offset-[5px]`;
const layer =
  'pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 ease-lumi motion-reduce:transition-none';

/**
 * Fixed header. Transparent at the very top of the page, a solid cream bar with a hairline once the
 * page scrolls, and an olive bar with cream text while it sits over the dark footer.
 */
export function SiteHeader() {
  const ref = useRef<HTMLElement>(null);
  const [tone, setTone] = useState<Tone>('top');

  useEffect(() => {
    const header = ref.current;
    if (!header) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const footer = document.querySelector('[data-site-footer]');
      const overFooter = footer ? footer.getBoundingClientRect().top <= header.offsetHeight / 2 : false;
      setTone(overFooter ? 'dark' : window.scrollY > 8 ? 'solid' : 'top');
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header ref={ref} data-tone={tone} className="group fixed inset-x-0 top-0 z-40 pb-6 pl-[3.75rem] pr-[7.6rem] pt-6 text-center min-[400px]:px-6 lg:px-10">
      <span aria-hidden="true" className={`${layer} border-b border-cocoa/10 bg-shell group-data-[tone=solid]:opacity-100`} />
      <span aria-hidden="true" className={`${layer} border-b border-cream/15 bg-olive group-data-[tone=dark]:opacity-100`} />
      <Link
        href="/"
        aria-label="Lumi Lane, home"
        className={`font-serif text-[15px] font-medium tracking-[0.24em] text-cocoa transition-colors duration-200 hover:text-ember group-data-[tone=dark]:text-cream group-data-[tone=dark]:hover:text-ember min-[400px]:text-base min-[400px]:tracking-[0.34em] sm:text-lg ${ring.replace('ring-offset-2', 'ring-offset-4')}`}
      >
        LUMI LANE
      </Link>
      <CartDrawer />
      <nav
        aria-label="Account"
        className="absolute right-4 top-4 flex flex-row items-center gap-x-1.5 sm:gap-x-4 lg:right-9"
      >
        <Link href="/login/" className={accountLink}>
          Login
        </Link>
        <span aria-hidden="true" className="text-[13px] leading-none text-cocoa/40 group-data-[tone=dark]:text-cream/50 sm:hidden">
          ·
        </span>
        <Link href="/signup/" className={signUpLink}>
          Sign Up
        </Link>
      </nav>
    </header>
  );
}
