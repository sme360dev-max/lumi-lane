import Link from 'next/link';
import { CartDrawer } from '@/features/cart/CartDrawer';

const accountLink =
  'inline-flex min-h-6 items-center justify-end rounded-sm px-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-cocoa transition-colors hover:text-ember focus:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-2 focus-visible:ring-offset-shell sm:min-h-11 sm:tracking-[0.2em]';

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 bg-gradient-to-b from-shell via-shell/90 to-transparent px-6 pb-6 pt-6 text-center lg:px-10">
      <Link
        href="/"
        aria-label="Lumi Lane, home"
        className="font-serif text-base font-medium tracking-[0.34em] text-cocoa transition-colors duration-200 hover:text-ember focus:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-4 focus-visible:ring-offset-shell sm:text-lg"
      >
        LUMI LANE
      </Link>
      <CartDrawer />
      <nav
        aria-label="Account"
        className="absolute right-4 top-3 flex flex-col items-end sm:top-4 sm:flex-row sm:gap-3 lg:right-9"
      >
        <Link href="/login/" className={accountLink}>
          Login
        </Link>
        <Link href="/signup/" className={accountLink}>
          Sign Up
        </Link>
      </nav>
    </header>
  );
}
