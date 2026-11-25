import { expect, test, type Page } from '@playwright/test';
import { MENU } from '../../src/data/menu';

const bag = (page: Page) => page.getByRole('button', { name: /^Shopping bag,/ });
const drawer = (page: Page) => page.getByRole('dialog', { name: 'Shopping bag' });
const item = (page: Page, id: string) => page.locator(`[data-item-id="${id}"]`);
const subtotal = (page: Page) => drawer(page).getByLabel('Subtotal in Australian dollars');

test.beforeEach(async ({ page }) => {
  await page.route('**/api/menu/', (route) => route.fulfill({ json: { categories: MENU } }));
});

test('loyalty and header account access work without nav overlap', async ({ page }) => {
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Primary' });
  await nav.getByRole('link', { name: 'Loyalty' }).click();
  await expect(page).toHaveURL(/\/loyalty\/$/);
  await expect(page.getByRole('heading', { level: 1, name: "Eight coffees. The next one's on us." })).toBeVisible();
  await expect(page.getByText('A proposed programme, shown as a demo', { exact: false })).toBeVisible();
  for (const link of ['Login', 'Sign Up']) {
    await expect(page.getByRole('main').getByRole('link', { name: link })).toBeVisible();
  }
  const overlap = await page.evaluate(() => {
    const overlaps = (elements: Element[]) =>
      elements.some((element, index) => {
        const a = element.getBoundingClientRect();
        return (
          a.left < 0 ||
          a.right > innerWidth ||
          elements.slice(index + 1).some((other) => {
            const b = other.getBoundingClientRect();
            return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
          })
        );
      });
    return (
      overlaps([...document.querySelectorAll('[aria-label="Primary"] a, [aria-label="Primary"] button')]) ||
      overlaps([
        ...document.querySelectorAll(
          'body > header > a, header [aria-label^="Shopping bag,"], [aria-label="Account"] a',
        ),
      ]) ||
      document.documentElement.scrollWidth > innerWidth
    );
  });
  expect(overlap).toBe(false);
  const account = page.getByRole('navigation', { name: 'Account' });
  await account.getByRole('link', { name: 'Login' }).click();
  await expect(page).toHaveURL(/\/login\/$/);
  await account.getByRole('link', { name: 'Sign Up' }).click();
  await expect(page).toHaveURL(/\/signup\/$/);
});

test('login validates, toggles password visibility and remains offline', async ({ page }) => {
  await page.goto('/login/');
  const main = page.getByRole('main');
  const email = main.getByLabel('Email', { exact: true });
  const password = main.getByLabel('Password', { exact: true });
  const login = main.getByRole('button', { name: 'Login' });
  await login.click();
  await expect(email).toBeFocused();
  await expect(email).toHaveAccessibleDescription('Enter a valid email address.');
  await expect(password).toHaveAccessibleDescription('Enter a password.');
  await email.fill('sam@example.com');
  await password.fill('local-preview');
  await main.getByRole('button', { name: 'Show password', exact: true }).click();
  await expect(password).toHaveAttribute('type', 'text');
  await main.getByRole('button', { name: 'Hide password', exact: true }).click();
  await expect(password).toHaveAttribute('type', 'password');
  await login.click();
  await expect(main.getByRole('status')).toHaveText('Login is currently unavailable.');
  await expect(password).toHaveValue('');
  await main.getByRole('link', { name: 'Sign Up' }).click();
  await expect(page).toHaveURL(/\/signup\/$/);
});

test('sign up validates name and matching passwords without creating an account', async ({ page }) => {
  await page.goto('/signup/');
  const main = page.getByRole('main');
  const name = main.getByLabel('Full name', { exact: true });
  const confirmation = main.getByLabel('Confirm password', { exact: true });
  const create = main.getByRole('button', { name: 'Create Account' });
  await create.click();
  await expect(name).toBeFocused();
  await expect(name).toHaveAccessibleDescription('Enter your full name.');
  await name.fill('Sam Lee');
  await main.getByLabel('Email', { exact: true }).fill('sam@example.com');
  await main.getByLabel('Password', { exact: true }).fill('local-preview');
  await confirmation.fill('different');
  await create.click();
  await expect(confirmation).toBeFocused();
  await expect(confirmation).toHaveAccessibleDescription('The passwords must match.');
  await main.getByRole('button', { name: 'Show password confirmation' }).click();
  await expect(confirmation).toHaveAttribute('type', 'text');
  await confirmation.fill('local-preview');
  await create.click();
  await expect(main.getByRole('status')).toHaveText('Account creation is currently unavailable.');
  await expect(confirmation).toHaveValue('');
  await main.getByRole('link', { name: 'Login' }).click();
  await expect(page).toHaveURL(/\/login\/$/);
});

test('cart and menu synchronize and persist through navigation and reload', async ({ page }) => {
  await page.goto('/menu/');
  const breakfast = item(page, 'brunch-lumi-breakfast');
  await breakfast.getByRole('button', { name: 'Add Lumi Breakfast' }).click();
  await breakfast.getByRole('button', { name: 'Increase quantity of Lumi Breakfast' }).click();
  await page.getByRole('tab', { name: 'Coffee & Drinks' }).click();
  await expect(breakfast).toBeHidden();
  await page.getByRole('tab', { name: 'Brunch' }).click();
  await expect(breakfast.getByLabel('Lumi Breakfast quantity')).toHaveText('2');
  await bag(page).click();
  await expect(subtotal(page)).toHaveText('$51.80 AUD');
  await drawer(page).getByRole('button', { name: 'Decrease quantity of Lumi Breakfast' }).click();
  await expect(subtotal(page)).toHaveText('$25.90 AUD');
  await drawer(page).getByRole('button', { name: 'Checkout', exact: true }).click();
  const checkout = page.getByRole('dialog', { name: 'Checkout' });
  await expect(checkout.getByRole('heading', { name: 'Checkout' })).toBeFocused();
  await expect(checkout.getByRole('button', { name: /^Pay .* AUD$/ })).toBeDisabled();
  await expect(checkout.getByText('Online payment is currently unavailable.')).toBeVisible();
  await checkout.getByRole('button', { name: 'Back to bag' }).click();
  await drawer(page).getByRole('button', { name: 'Continue Shopping' }).click();
  await expect(breakfast.getByLabel('Lumi Breakfast quantity')).toHaveText('1');
  await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'About' }).click();
  await expect(page).toHaveURL(/\/about\/$/);
  await expect(bag(page)).toHaveAccessibleName('Shopping bag, 1 item');
  await page.reload();
  await expect(bag(page)).toHaveAccessibleName('Shopping bag, 1 item');
  await bag(page).click();
  await drawer(page).getByRole('button', { name: 'Remove Lumi Breakfast' }).click();
  await expect(drawer(page).getByText('Your bag is empty.')).toBeVisible();
  await drawer(page).getByRole('link', { name: 'Continue Shopping' }).click();
  await expect(page).toHaveURL(/\/menu\/$/);
  await expect(breakfast.getByRole('button', { name: 'Add Lumi Breakfast' })).toBeEnabled();
});

test('adds only selected menu variants at their published prices', async ({ page }) => {
  await page.goto('/menu/#acai');
  const acai = item(page, 'acai-lumi');
  const size = acai.getByRole('combobox');
  await expect(acai.getByRole('button', { name: 'Add Lumi', exact: true })).toBeDisabled();
  await size.selectOption({ label: 'Takeaway · Small · $16.90' });
  await acai.getByRole('button', { name: 'Add Lumi, Takeaway · Small' }).click();
  await size.selectOption({ label: 'Takeaway · Large · $20.40' });
  await acai.getByRole('button', { name: 'Add Lumi, Takeaway · Large' }).click();
  await page.getByRole('tab', { name: 'Bar' }).click();
  const wine = item(page, 'bar-pikes-traditional-riesling');
  await wine.getByRole('combobox').selectOption({ label: 'Bottle · $46.00' });
  await wine.getByRole('button', { name: /Add Pikes.*Bottle/ }).click();
  const glassOnly = item(page, 'bar-the-lane-lois-blanc-de-blancs-200ml');
  await expect(glassOnly.getByRole('option', { name: /Bottle/ })).toHaveCount(0);
  await bag(page).click();
  await expect(drawer(page).getByText('Takeaway · Small', { exact: true })).toBeVisible();
  await expect(drawer(page).getByText('Takeaway · Large', { exact: true })).toBeVisible();
  await expect(drawer(page).getByText('Bottle', { exact: true })).toBeVisible();
  await expect(subtotal(page)).toHaveText('$83.30 AUD');
});

test('left drawer traps and restores focus without changing route or page scroll', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/menu/');
  await page.evaluate(() => scrollTo(0, 400));
  await bag(page).click();
  const close = drawer(page).getByRole('button', { name: 'Close shopping bag' });
  const keepShopping = drawer(page).getByRole('button', { name: 'Continue Shopping' });
  await expect(close).toBeFocused();
  const bounds = await drawer(page).boundingBox();
  expect(bounds?.x).toBe(0);
  await page.keyboard.press('Shift+Tab');
  await expect(keepShopping).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(close).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(drawer(page)).toBeHidden();
  await expect(bag(page)).toBeFocused();
  await expect(page).toHaveURL(/\/menu\/$/);
  expect(await page.evaluate(() => scrollY)).toBe(400);
  if (bounds && bounds.width < page.viewportSize()!.width) {
    await bag(page).click();
    await page.mouse.click(bounds.width + 20, 20);
    await expect(drawer(page)).toBeHidden();
    await expect(bag(page)).toBeFocused();
  }
});

test('an existing live menu refresh updates cart prices and removes unavailable items', async ({ page }) => {
  test.skip(!process.env.NEXT_PUBLIC_API_BASE_URL, 'Requires the existing menu URL in the test export.');
  const updated = structuredClone(MENU);
  const column = updated[0]?.columns[0];
  if (column?.kind !== 'list' || column.items[0]?.kind !== 'std') throw new Error('Expected the brunch snapshot');
  column.items[0].price = '$26.9';
  column.items[0].priceCents = 2690;
  column.items.splice(1, 1);

  let release = () => {};
  const hold = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route('**/api/menu/', async (route) => {
    await hold;
    await route.fulfill({ json: { categories: updated } });
  });
  await page.goto('/menu/');
  await item(page, 'brunch-lumi-breakfast').getByRole('button', { name: 'Add Lumi Breakfast' }).click();
  await item(page, 'brunch-omelette-lane').getByRole('button', { name: 'Add Omelette Lane' }).click();
  await bag(page).click();
  await expect(subtotal(page)).toHaveText('$47.80 AUD');
  release();
  await expect(subtotal(page)).toHaveText('$26.90 AUD');
  await expect(drawer(page).getByText('Omelette Lane', { exact: true })).toHaveCount(0);
});

test('homepage hero continues to animate', async ({ page }) => {
  await page.goto('/');
  const dish = page.locator('.hero-dish').first();
  await expect.poll(() => dish.evaluate((image) => image.style.transform)).not.toBe('');
  const before = await dish.evaluate((image) => image.style.transform);
  await expect.poll(() => dish.evaluate((image) => image.style.transform)).not.toBe(before);
});
