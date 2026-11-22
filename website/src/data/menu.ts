// The menu is managed in Django admin (Menu → Items & prices) and served by GET /api/menu/.
// menu-snapshot.json is a copy of that response: `npm run build` refreshes it (scripts/fetch-menu.mjs)
// and the static /menu/ HTML is built from it. In the browser the page then loads the live menu,
// so a price change shows up within a minute without rebuilding the website.
import { isMenu } from '@/features/menu/menuData';
import type { MenuCategory } from '@/types/menu';
import snapshot from './menu-snapshot.json';

const categories: unknown = snapshot.categories;
if (!isMenu(categories)) throw new Error('src/data/menu-snapshot.json is not a valid menu');

export const MENU: MenuCategory[] = categories;
