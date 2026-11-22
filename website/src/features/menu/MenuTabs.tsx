'use client';

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import type { CategoryId, MenuCategory } from '@/types/menu';
import { MenuColumn } from './MenuColumn';

interface MenuTabsProps {
  categories: MenuCategory[];
}

const isCategory = (ids: CategoryId[], v: string): v is CategoryId => (ids as string[]).includes(v);

/**
 * Category tabs (WAI-ARIA tabs pattern). The selected tab is mirrored in the URL hash
 * (/menu/#bar) so categories can be linked, refreshed and navigated with back/forward.
 * All panels are rendered in the static HTML; inactive ones are `hidden`.
 */
export function MenuTabs({ categories }: MenuTabsProps) {
  const ids = categories.map((c) => c.id);
  const [active, setActive] = useState<CategoryId>(ids[0] ?? 'brunch');
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const fromHash = useCallback(() => {
    const h = decodeURIComponent(window.location.hash.slice(1));
    return isCategory(ids, h) ? h : (ids[0] ?? 'brunch');
    // eslint-disable-next-line react-hooks/exhaustive-deps -- ids is derived from static data
  }, []);

  useEffect(() => {
    const sync = () => setActive(fromHash());
    sync();
    window.addEventListener('hashchange', sync);
    window.addEventListener('popstate', sync);
    return () => {
      window.removeEventListener('hashchange', sync);
      window.removeEventListener('popstate', sync);
    };
  }, [fromHash]);

  const select = (id: CategoryId) => {
    setActive(id);
    const url = id === ids[0] ? window.location.pathname : `${window.location.pathname}#${id}`;
    if (url !== window.location.pathname + window.location.hash) window.history.pushState(null, '', url);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = ids.length - 1;
    const next =
      e.key === 'ArrowRight'
        ? (index + 1) % ids.length
        : e.key === 'ArrowLeft'
          ? (index - 1 + ids.length) % ids.length
          : e.key === 'Home'
            ? 0
            : e.key === 'End'
              ? last
              : -1;
    if (next < 0) return;
    e.preventDefault();
    const id = ids[next]!;
    tabRefs.current[id]?.focus();
    select(id);
  };

  return (
    <>
      <div className="no-scrollbar -mx-6 mt-16 overflow-x-auto px-6 sm:mx-0 sm:px-0">
        <div
          role="tablist"
          aria-label="Menu categories"
          className="mx-auto flex w-max gap-8 border-b border-cocoa/10 sm:w-full sm:justify-center sm:gap-14"
        >
          {categories.map((c, i) => {
            const on = c.id === active;
            return (
              <button
                key={c.id}
                ref={(el) => {
                  tabRefs.current[c.id] = el;
                }}
                role="tab"
                id={`tab-${c.id}`}
                type="button"
                aria-controls={`panel-${c.id}`}
                aria-selected={on}
                tabIndex={on ? 0 : -1}
                onClick={() => select(c.id)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className={`relative min-h-[44px] whitespace-nowrap px-1 pb-3 font-serif text-[15px] uppercase tracking-[0.24em] transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-4 focus-visible:ring-offset-shell sm:text-base ${on ? 'text-cocoa' : 'text-cocoa/45 hover:text-cocoa/70'}`}
              >
                {c.label}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 bottom-0 h-px origin-center bg-ember transition-transform duration-200 ${on ? 'scale-x-100' : 'scale-x-0'}`}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-16">
        {categories.map((c) => (
          <div
            key={c.id}
            role="tabpanel"
            id={`panel-${c.id}`}
            aria-labelledby={`tab-${c.id}`}
            hidden={c.id !== active}
            tabIndex={0}
            className="grid gap-x-16 gap-y-16 focus:outline-none md:grid-cols-2"
          >
            {c.columns.map((col, i) => (
              <MenuColumn key={i} column={col} />
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
