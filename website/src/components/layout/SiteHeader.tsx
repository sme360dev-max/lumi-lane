import Link from 'next/link';

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
    </header>
  );
}
