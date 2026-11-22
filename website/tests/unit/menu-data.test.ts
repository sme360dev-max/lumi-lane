// The menu now lives in Django admin; src/data/menu-snapshot.json is a copy of GET /api/menu/.
// Fidelity to the original printed menu is tested in the backend (backend/menu/tests.py).
// Here: the snapshot is valid for the website, and the shape check rejects bad API responses.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { isMenu } from '../../src/features/menu/menuData.ts';
import type { MenuCategory } from '../../src/types/menu.ts';

const snapshot = JSON.parse(readFileSync(new URL('../../src/data/menu-snapshot.json', import.meta.url), 'utf8'));
const MENU: MenuCategory[] = snapshot.categories;
const items = MENU.flatMap((c) => c.columns.flatMap((col) => (col.kind === 'list' ? col.items : [])));

test('snapshot passes the shape check', () => {
  assert.ok(isMenu(MENU));
});

test('category and item ids are unique', () => {
  assert.equal(new Set(MENU.map((c) => c.id)).size, MENU.length);
  assert.equal(new Set(items.map((i) => i.id)).size, items.length);
});

test('cents agree with the printed prices', () => {
  const toCents = (s: string) => Math.round(Number(s.replace('$', '')) * 100);
  for (const c of MENU)
    for (const col of c.columns) {
      if (col.kind === 'pricing')
        col.groups.forEach((g) => g.rows.forEach((r) => assert.equal(r.priceCents, toCents(r.price))));
      if (col.kind !== 'list') continue;
      for (const it of col.items) {
        if (it.kind === 'std') assert.equal(it.priceCents, toCents(it.price), it.id);
        if (it.kind === 'wine') {
          assert.equal(it.glassCents, it.glass === '-' ? null : toCents(it.glass), it.id);
          assert.equal(it.bottleCents, it.bottle === '-' ? null : toCents(it.bottle), it.id);
        }
      }
    }
});

test('shape check rejects bad responses', () => {
  const good = structuredClone(MENU);
  assert.ok(isMenu(good));
  for (const bad of [null, {}, [], [{ id: 'x' }], [{ id: 'x', label: 'X', columns: [{ kind: 'mystery' }] }]])
    assert.equal(isMenu(bad), false, JSON.stringify(bad));
  const brokenItem = structuredClone(MENU);
  const list = brokenItem[0]!.columns.find((c) => c.kind === 'list');
  if (list?.kind === 'list') (list.items[0] as unknown as Record<string, unknown>).price = 25.9;
  assert.equal(isMenu(brokenItem), false);
});
