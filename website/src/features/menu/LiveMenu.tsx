'use client';

import { useEffect } from 'react';
import { useCart } from '@/features/cart/CartProvider';
import { isMenu } from './menuData';
import { MenuTabs } from './MenuTabs';

/** Long enough for the free Render service to wake up. */
const TIMEOUT_MS = 60_000;

/**
 * Shows the menu baked into the static page at once, then swaps in the live menu from Django
 * when it arrives. If the API is asleep, down or returns something unexpected, the built-in menu stays.
 */
export function LiveMenu() {
  const { menu, replaceMenu } = useCart();

  useEffect(() => {
    const api = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '');
    if (!api) return;
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);
    fetch(`${api}/api/menu/`, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: unknown) => {
        const live = (data as { categories?: unknown } | null)?.categories;
        if (!controller.signal.aborted && isMenu(live)) replaceMenu(live);
      })
      .catch(() => {
        // Keep the built-in menu.
      })
      .finally(() => window.clearTimeout(timer));
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [replaceMenu]);

  return <MenuTabs categories={menu} />;
}
