'use client';

import { useEffect, useState } from 'react';
import type { MenuCategory } from '@/types/menu';
import { isMenu } from './menuData';
import { MenuTabs } from './MenuTabs';

/** Long enough for the free Render service to wake up. */
const TIMEOUT_MS = 60_000;

/**
 * Shows the menu baked into the static page at once, then swaps in the live menu from Django
 * when it arrives. If the API is asleep, down or returns something unexpected, the built-in menu stays.
 */
export function LiveMenu({ initial }: { initial: MenuCategory[] }) {
  const [categories, setCategories] = useState(initial);

  useEffect(() => {
    const api = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '');
    if (!api) return;
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);
    fetch(`${api}/api/menu/`, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: unknown) => {
        const live = (data as { categories?: unknown } | null)?.categories;
        if (isMenu(live)) setCategories(live);
      })
      .catch(() => {
        // Keep the built-in menu.
      })
      .finally(() => window.clearTimeout(timer));
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, []);

  return <MenuTabs categories={categories} />;
}
