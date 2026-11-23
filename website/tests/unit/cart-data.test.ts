import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  cartLines,
  cartTotals,
  changeQuantity,
  menuOffers,
  readQuantities,
  removeQuantity,
} from '../../src/features/cart/cartData.ts';
import type { MenuCategory } from '../../src/types/menu.ts';

const { categories }: { categories: MenuCategory[] } = JSON.parse(
  readFileSync(new URL('../../src/data/menu-snapshot.json', import.meta.url), 'utf8'),
);
const catalog = menuOffers(categories);

test('counts units, calculates totals in cents and removes zero-quantity lines', () => {
  const [breakfast] = catalog.get('brunch-lumi-breakfast')!;
  const [espresso] = catalog.get('coffee-espresso')!;
  const empty = {};
  assert.equal(changeQuantity(empty, breakfast!.key, -1), empty);
  let cart = changeQuantity(empty, breakfast!.key, 1);
  cart = changeQuantity(cart, breakfast!.key, 1);
  cart = changeQuantity(cart, espresso!.key, 1);
  assert.deepEqual(cartTotals(cartLines(catalog, cart)), { count: 3, subtotal: 5560 });
  cart = changeQuantity(cart, espresso!.key, -1);
  assert.deepEqual(cartTotals(cartLines(catalog, cart)), { count: 2, subtotal: 5180 });
  assert.deepEqual(removeQuantity(cart, breakfast!.key), {});
});

test('uses the existing wine and açai options, excluding unavailable formats', () => {
  const variants = (id: string) => catalog.get(id)?.map(({ variant, priceCents }) => [variant, priceCents]);
  assert.deepEqual(variants('bar-pikes-traditional-riesling'), [
    ['Glass', 1300],
    ['Bottle', 4600],
  ]);
  assert.deepEqual(variants('bar-the-lane-lois-blanc-de-blancs-200ml'), [['Glass', 1200]]);
  assert.deepEqual(variants('bar-rockford-alicante-bouchet-rose'), [['Bottle', 6000]]);
  assert.deepEqual(variants('acai-lumi'), [
    ['Takeaway · Small', 1690],
    ['Takeaway · Large', 2040],
    ['Dine In · Bowl', 2040],
  ]);
});

test('uses the latest valid price and excludes offers removed from a refreshed menu', () => {
  const [breakfast] = catalog.get('brunch-lumi-breakfast')!;
  const [omelette] = catalog.get('brunch-omelette-lane')!;
  const cart = readQuantities(JSON.stringify({ [breakfast!.key]: 2, [omelette!.key]: 1 }));
  const updated = structuredClone(categories);
  const column = updated[0]?.columns[0];
  assert.equal(column?.kind, 'list');
  const [item] = column.items;
  assert.equal(item?.kind, 'std');
  item.price = '$26.9';
  item.priceCents = 2690;
  column.items.splice(1, 1);
  assert.deepEqual(cartTotals(cartLines(menuOffers(updated), cart)), { count: 2, subtotal: 5380 });
  item.price = 'POA';
  assert.deepEqual(cartLines(menuOffers(updated), cart), []);
});

test('ignores malformed stored data and accepts only whole positive quantities', () => {
  assert.deepEqual(readQuantities('{broken'), {});
  assert.deepEqual(readQuantities('[1,2]'), {});
  assert.deepEqual(readQuantities('{"valid":2,"zero":0,"negative":-1,"fraction":2.5,"text":"4"}'), { valid: 2 });
});
