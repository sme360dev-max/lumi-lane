// Shape check for menu data coming from the Django API (GET /api/menu/), so a bad or partial
// response is ignored and the built-in menu stays on screen instead of breaking the page.
import type { MenuCategory } from '@/types/menu';

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v);
const isStr = (v: unknown): v is string => typeof v === 'string';
const isCents = (v: unknown) => v === null || (typeof v === 'number' && Number.isInteger(v));

function isItem(v: unknown): boolean {
  if (!isObj(v) || !isStr(v.id) || !isStr(v.name)) return false;
  if (v.kind === 'std') return isStr(v.price) && isCents(v.priceCents);
  if (v.kind === 'acai') return isStr(v.description);
  if (v.kind === 'wine') return isStr(v.glass) && isStr(v.bottle) && isStr(v.region);
  return false;
}

function isColumn(v: unknown): boolean {
  if (!isObj(v)) return false;
  if (v.kind === 'list') return isStr(v.title) && Array.isArray(v.items) && v.items.every(isItem);
  if (v.kind === 'notice') return isStr(v.title) && isStr(v.text);
  if (v.kind === 'pricing')
    return (
      Array.isArray(v.groups) &&
      v.groups.every(
        (g) =>
          isObj(g) &&
          isStr(g.title) &&
          Array.isArray(g.rows) &&
          g.rows.every((r) => isObj(r) && isStr(r.label) && isStr(r.price)),
      )
    );
  return false;
}

export function isMenu(v: unknown): v is MenuCategory[] {
  return (
    Array.isArray(v) &&
    v.length > 0 &&
    v.every((c) => isObj(c) && isStr(c.id) && isStr(c.label) && Array.isArray(c.columns) && c.columns.every(isColumn))
  );
}
