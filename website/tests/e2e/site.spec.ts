import { expect, test, type Page } from '@playwright/test';
import { MENU } from '../../src/data/menu';

const ROUTES = [
  { path: '/', heading: /Espresso\. Milk\./ },
  { path: '/menu/', heading: 'Brunch, coffee & everything in between.' },
  { path: '/about/', heading: 'A coffee house with a long table.' },
  { path: '/visit/', heading: 'Come for the coffee, stay for the vibe.' },
  { path: '/book/', heading: 'Keep a seat for you.' },
];

/** Fails the test on any console error or uncaught page error. */
function watchConsole(page: Page) {
  const errors: string[] = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(e.message));
  return errors;
}

// The menu page loads the live menu from Django; answer with the built-in snapshot so these
// tests never depend on a running backend (or log a failed request as a console error).
test.beforeEach(async ({ page }) => {
  await page.route('**/api/menu/', (route) =>
    route.fulfill({ json: { categories: MENU }, headers: { 'access-control-allow-origin': '*' } }),
  );
});

const noHorizontalOverflow = async (page: Page) =>
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth),
  ).toBeLessThanOrEqual(0);

for (const r of ROUTES) {
  test(`direct load ${r.path}: heading, no overflow, no console errors`, async ({ page }) => {
    const errors = watchConsole(page);
    const res = await page.goto(r.path);
    expect(res?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1, name: r.heading })).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Primary' })).toBeVisible();
    await noHorizontalOverflow(page);
    await page.reload();
    await expect(page.getByRole('heading', { level: 1, name: r.heading })).toBeVisible();
    expect(errors).toEqual([]);
  });
}

test('primary navigation, active state, back/forward', async ({ page }) => {
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Primary' });
  await nav.getByRole('link', { name: 'About' }).click();
  await expect(page).toHaveURL(/\/about\/$/);
  await expect(nav.getByRole('link', { name: 'About' })).toHaveAttribute('aria-current', 'page');
  await nav.getByRole('link', { name: 'Visit Us' }).click();
  await expect(page).toHaveURL(/\/visit\/$/);
  await nav.getByRole('button', { name: 'Menu' }).click();
  await expect(page).toHaveURL(/\/menu\/$/);
  await nav.getByRole('link', { name: 'Book a Table' }).click();
  await expect(page).toHaveURL(/\/book\/$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/menu\/$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/visit\/$/);
  await page.goForward();
  await expect(page).toHaveURL(/\/menu\/$/);
  await page.getByRole('link', { name: 'Lumi Lane, home' }).click();
  await expect(page).toHaveURL(/\/$/);
});

test('every menu category renders all of its items and prices', async ({ page }) => {
  await page.goto('/menu/');
  for (const cat of MENU) {
    await page.getByRole('tab', { name: cat.label }).click();
    await expect(page.getByRole('tab', { name: cat.label })).toHaveAttribute('aria-selected', 'true');
    const panel = page.getByRole('tabpanel', { name: cat.label });
    await expect(panel).toBeVisible();
    const items = cat.columns.flatMap((c) => (c.kind === 'list' ? c.items : []));
    await expect(panel.locator('[data-item-id]')).toHaveCount(items.length);
    const names = await panel.locator('h4').allTextContents();
    expect(names).toEqual(items.map((i) => i.name));
    for (const it of items)
      if (it.kind === 'std') await expect(panel.locator(`[data-item-id="${it.id}"] [data-price]`)).toHaveText(it.price);
  }
  await expect(page).toHaveURL(/#bar$/);
});

test('menu tabs: keyboard, deep link, refresh, back', async ({ page }) => {
  await page.goto('/menu/#coffee');
  await expect(page.getByRole('tab', { name: 'Coffee & Drinks' })).toHaveAttribute('aria-selected', 'true');
  await page.reload();
  await expect(page.getByRole('tab', { name: 'Coffee & Drinks' })).toHaveAttribute('aria-selected', 'true');
  await page.getByRole('tab', { name: 'Coffee & Drinks' }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'Bar' })).toBeFocused();
  await expect(page.getByRole('tab', { name: 'Bar' })).toHaveAttribute('aria-selected', 'true');
  await page.goBack();
  await expect(page.getByRole('tab', { name: 'Coffee & Drinks' })).toHaveAttribute('aria-selected', 'true');
});

test('legacy hash links redirect to the real routes', async ({ page }) => {
  await page.goto('/#reserve');
  await expect(page).toHaveURL(/\/book\/$/);
  await page.goto('/#menu/acai');
  await expect(page).toHaveURL(/\/menu\/#acai$/);
  await expect(page.getByRole('tab', { name: 'Açai' })).toHaveAttribute('aria-selected', 'true');
});

test('mega menu opens on hover, links to a category, closes on Escape', async ({ page, isMobile }, info) => {
  test.skip(isMobile || info.project.name !== 'desktop-1440', 'hover interaction is desktop only');
  await page.goto('/about/');
  await page.getByRole('navigation', { name: 'Primary' }).getByRole('button', { name: 'Menu' }).hover();
  const mega = page.getByRole('dialog', { name: 'Menu overview' });
  await expect(mega).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(mega).toBeHidden();
  await page.mouse.move(10, 10);
  await page.getByRole('navigation', { name: 'Primary' }).getByRole('button', { name: 'Menu' }).hover();
  await mega.getByRole('link', { name: /Bar/ }).click();
  await expect(page).toHaveURL(/\/menu\/#bar$/);
  await expect(page.getByRole('tab', { name: 'Bar' })).toHaveAttribute('aria-selected', 'true');
});
