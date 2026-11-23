import type { MenuCategory, MenuItem, PricingColumn } from '@/types/menu';

export type CartQuantities = Readonly<Record<string, number>>;

export interface Offer {
  key: string;
  name: string;
  variant?: string;
  priceCents: number;
}

export interface CartLine extends Offer {
  quantity: number;
}

const currency = new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' });

export const formatAUD = (cents: number) => currency.format(cents / 100);

function priceCents(printed: string, cents: number | null | undefined): number | null {
  const match = printed.trim().match(/^\$?(\d+)(?:\.(\d{1,2}))?$/);
  if (!match) return null;
  const amount = Number(match[1]) * 100 + Number((match[2] ?? '').padEnd(2, '0'));
  if (!Number.isSafeInteger(amount) || amount <= 0) return null;
  return cents === undefined || cents === amount ? amount : null;
}

function getOffers(item: MenuItem, pricing: PricingColumn[]): Offer[] {
  const offers: Offer[] = [];
  const add = (id: string, printed: string, cents: number | null | undefined, variant?: string) => {
    const price = priceCents(printed, cents);
    if (price !== null)
      offers.push({ key: JSON.stringify([item.id, id]), name: item.name, variant, priceCents: price });
  };

  switch (item.kind) {
    case 'std':
      add('standard', item.price, item.priceCents);
      break;
    case 'wine':
      add('glass', item.glass, item.glassCents, 'Glass');
      add('bottle', item.bottle, item.bottleCents, 'Bottle');
      break;
    case 'acai':
      for (const column of pricing) {
        for (const group of column.groups) {
          for (const row of group.rows) {
            add(JSON.stringify([group.title, row.label]), row.price, row.priceCents, `${group.title} · ${row.label}`);
          }
        }
      }
      break;
  }

  return offers;
}

export function menuOffers(categories: MenuCategory[]): Map<string, Offer[]> {
  const catalog = new Map<string, Offer[]>();
  for (const category of categories) {
    const pricing = category.columns.filter((column) => column.kind === 'pricing');
    for (const column of category.columns) {
      if (column.kind !== 'list') continue;
      for (const item of column.items) catalog.set(item.id, getOffers(item, pricing));
    }
  }
  return catalog;
}

export function readQuantities(raw: string | null): CartQuantities {
  if (!raw) return {};
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
    return Object.fromEntries(Object.entries(value).filter(([, count]) => Number.isSafeInteger(count) && count > 0));
  } catch {
    return {};
  }
}

export function changeQuantity(cart: CartQuantities, key: string, delta: -1 | 1): CartQuantities {
  const quantity = (cart[key] ?? 0) + delta;
  if (quantity < 0 || !Number.isSafeInteger(quantity)) return cart;
  if (quantity === 0) return removeQuantity(cart, key);
  return { ...cart, [key]: quantity };
}

export function removeQuantity(cart: CartQuantities, key: string): CartQuantities {
  const next = { ...cart };
  delete next[key];
  return next;
}

export function cartLines(offers: Map<string, Offer[]>, quantities: CartQuantities): CartLine[] {
  const byKey = new Map([...offers.values()].flat().map((offer) => [offer.key, offer]));
  return Object.entries(quantities).flatMap(([key, quantity]) => {
    const offer = byKey.get(key);
    return offer ? [{ ...offer, quantity }] : [];
  });
}

export function cartTotals(lines: CartLine[]) {
  return lines.reduce(
    ({ count, subtotal }, line) => ({
      count: count + line.quantity,
      subtotal: subtotal + line.priceCents * line.quantity,
    }),
    { count: 0, subtotal: 0 },
  );
}
