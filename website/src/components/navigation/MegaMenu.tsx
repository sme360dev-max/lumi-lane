'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BUSINESS } from '@/data/business';
import { MEGA } from '@/data/content';
import { MEGA_COLUMNS } from '@/data/navigation';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { buttonClass } from '@/components/ui/Button';
import { EASE_OUT } from '@/styles/tokens';

interface MegaMenuProps {
  open: boolean;
  onClose: () => void;
  onPanelEnter: () => void;
  onPanelLeave: () => void;
}

/** Slide-down overview of the four menu categories (ported from the prototype's #mega overlay). */
export function MegaMenu({ open, onClose, onPanelEnter, onPanelLeave }: MegaMenuProps) {
  const reduce = usePrefersReducedMotion();
  // `mounted` keeps the overlay in the DOM during the exit transition; `shown` drives the transition.
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(
      () => {
        if (open) {
          setMounted(true);
          window.requestAnimationFrame(() => setShown(true));
        } else {
          setMounted(false);
        }
      },
      open ? 0 : reduce ? 0 : 640,
    );
    if (!open) window.requestAnimationFrame(() => setShown(false));
    return () => window.clearTimeout(t);
  }, [open, reduce]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const visible = shown && open;

  return (
    <div
      id="mega"
      hidden={!mounted}
      role="dialog"
      aria-modal="false"
      aria-label="Menu overview"
      className="fixed inset-0 z-[45]"
    >
      <div
        onClick={onClose}
        aria-hidden="true"
        className="absolute inset-0 bg-cocoa/40 backdrop-blur-[2px] transition-opacity duration-500"
        style={{ opacity: visible ? 1 : 0 }}
      />
      <div
        onMouseEnter={onPanelEnter}
        onMouseLeave={onPanelLeave}
        className="absolute inset-x-0 top-0 max-h-[88svh] overflow-y-auto overscroll-contain bg-shell shadow-[0_40px_120px_-40px_rgba(28,24,20,0.55)]"
        style={{
          transform: visible ? 'translateY(0)' : 'translateY(-101%)',
          transition: reduce ? 'none' : `transform 620ms ${EASE_OUT}`,
        }}
      >
        <div className="relative px-6 pb-10 pt-10 sm:px-10 lg:px-16">
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="absolute right-6 top-8 grid h-11 w-11 place-items-center rounded-full border border-cocoa/20 text-lg text-cocoa transition-colors duration-200 hover:border-cocoa hover:bg-cocoa hover:text-shell focus:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-2 focus-visible:ring-offset-shell sm:right-10 lg:right-16"
          >
            <span aria-hidden="true">&#10005;</span>
          </button>

          <header className="text-center">
            <p className="font-script text-2xl text-ember sm:text-3xl">{MEGA.eyebrow}</p>
            <h2 className="mx-auto mt-4 max-w-[20ch] font-serif text-[clamp(1.6rem,3.4vw,2.6rem)] font-black leading-[1.06] tracking-tight text-cocoa">
              {MEGA.title}
            </h2>
          </header>

          <ul className="mt-12 grid gap-x-12 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {MEGA_COLUMNS.map((c, i) => (
              <li
                key={c.n}
                className="border-t border-cocoa/15 pt-7"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'none' : 'translateY(16px)',
                  transition: reduce ? 'none' : `opacity 520ms ease, transform 620ms ${EASE_OUT}`,
                  transitionDelay: visible && !reduce ? `${170 + i * 80}ms` : '0ms',
                }}
              >
                <Link
                  href={`/menu/#${c.tab}`}
                  onClick={onClose}
                  className="group block rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-4 focus-visible:ring-offset-shell"
                >
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.3em] text-ember">{c.n}</span>
                  <span className="mt-6 block font-serif text-[clamp(1.4rem,2.2vw,1.95rem)] font-medium leading-[1.12] tracking-tight text-cocoa transition-colors group-hover:text-ember">
                    {c.lines[0]}
                    <br />
                    {c.lines[1]}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-14 flex flex-wrap items-center justify-between gap-5 border-t border-cocoa/10 pt-8">
            <p className="text-[11px] uppercase tracking-[0.24em] text-cocoa/40">{MEGA.hoursLine}</p>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href={BUSINESS.phone.href}
                className="text-[11px] uppercase tracking-[0.2em] text-cocoa/55 transition-colors hover:text-ember"
              >
                {BUSINESS.phone.display}
              </a>
              <Link href="/menu/" onClick={onClose} className={buttonClass({ size: 'sm', className: 'px-8 py-3.5' })}>
                {MEGA.fullMenuLabel}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
