'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { PILL_NAV } from '@/data/navigation';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { MegaMenu } from './MegaMenu';
import { isActive, navLinkClass } from './navStyles';

/** Floating gradient pill at the bottom of every page; "Menu" also opens the mega menu on hover/focus. */
export function PrimaryNav() {
  const pathname = usePathname() ?? '/';
  const router = useRouter();
  const [megaOpen, setMegaOpen] = useState(false);
  const canHover = useMediaQuery('(hover: hover) and (pointer: fine)');
  const timers = useRef<{ in?: number; out?: number }>({});

  const cancel = useCallback(() => {
    window.clearTimeout(timers.current.in);
    window.clearTimeout(timers.current.out);
  }, []);
  const openSoon = useCallback(() => {
    cancel();
    timers.current.in = window.setTimeout(() => setMegaOpen(true), 110);
  }, [cancel]);
  const closeSoon = useCallback(
    (delay: number) => {
      cancel();
      timers.current.out = window.setTimeout(() => setMegaOpen(false), delay);
    },
    [cancel],
  );
  const close = useCallback(() => {
    cancel();
    setMegaOpen(false);
  }, [cancel]);

  useEffect(() => cancel, [cancel]);

  // Close the overlay whenever the route changes (adjusting state during render, per React docs).
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMegaOpen(false);
  }

  return (
    <>
      <nav
        aria-label="Primary"
        className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))] left-1/2 z-50 max-w-[calc(100vw-1.5rem)] -translate-x-1/2 rounded-full border-none bg-gradient-to-r from-red-500 via-orange-400 to-purple-400 px-3 py-1 max-[360px]:px-2.5 sm:bottom-[calc(2.5rem+env(safe-area-inset-bottom,0px))] sm:px-6"
      >
        <ul className="flex items-center gap-2 max-[360px]:gap-1.5 min-[375px]:gap-3 sm:gap-8">
          {PILL_NAV.map((item) => {
            const active = isActive(pathname, item.href);
            if (item.href === '/menu/') {
              return (
                <li key={item.href}>
                  <button
                    type="button"
                    aria-haspopup="dialog"
                    aria-expanded={megaOpen}
                    aria-controls="mega"
                    aria-current={active ? 'page' : undefined}
                    className={navLinkClass(active || megaOpen)}
                    onMouseEnter={canHover ? openSoon : undefined}
                    onMouseLeave={canHover ? () => closeSoon(520) : undefined}
                    onFocus={canHover ? () => setMegaOpen(true) : undefined}
                    onBlur={canHover ? () => closeSoon(220) : undefined}
                    onClick={() => {
                      close();
                      router.push('/menu/');
                    }}
                  >
                    {item.label}
                  </button>
                </li>
              );
            }
            return (
              <li key={item.href}>
                <Link href={item.href} aria-current={active ? 'page' : undefined} className={navLinkClass(active)}>
                  {item.label.replace(/ /g, ' ')}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <MegaMenu open={megaOpen} onClose={close} onPanelEnter={cancel} onPanelLeave={() => closeSoon(220)} />
    </>
  );
}
