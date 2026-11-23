import { expect, test } from '@playwright/test';

test('one purchase stamps automatically, guards rapid clicks and persists progress', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/loyalty/');
  const progress = page.getByRole('progressbar', { name: 'Demo stamp progress' });
  const purchase = page.getByRole('button', { name: 'Simulate Coffee Purchase' });
  await expect(progress).toHaveAttribute('aria-valuenow', '0');
  await expect(page.getByRole('button', { name: 'Press stamp' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Undo last stamp' })).toBeDisabled();

  await purchase.evaluate((button) => {
    for (let click = 0; click < 6; click++) (button as HTMLButtonElement).click();
  });
  await expect(purchase).toBeDisabled();
  await expect(progress).toHaveAttribute('aria-valuenow', '0');
  await expect(purchase).toBeEnabled();
  await expect(progress).toHaveAttribute('aria-valuenow', '1');
  await expect(page.locator('[data-stamp-slot][data-filled=true]')).toHaveCount(1);
  await expect(page.getByText('+1 stamp', { exact: true })).toBeVisible();

  await purchase.focus();
  await page.keyboard.press('Enter');
  await expect(progress).toHaveAttribute('aria-valuenow', '2');
  await expect(purchase).toBeFocused();
  const primary = page.getByRole('navigation', { name: 'Primary' });
  await primary.getByRole('link', { name: 'About' }).click();
  await expect(page).toHaveURL(/\/about\/$/);
  await primary.getByRole('link', { name: 'Loyalty' }).click();
  await expect(progress).toHaveAttribute('aria-valuenow', '2');
  await page.reload();
  await expect(progress).toHaveAttribute('aria-valuenow', '2');
  await page.getByRole('button', { name: 'Undo last stamp' }).click();
  await expect(progress).toHaveAttribute('aria-valuenow', '1');
  await page.getByRole('button', { name: 'Reset progress' }).click();
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(progress).toHaveAttribute('aria-valuenow', '1');
  await page.getByRole('button', { name: 'Reset progress' }).click();
  await page.getByRole('button', { name: 'Reset demo card' }).click();
  await expect(progress).toHaveAttribute('aria-valuenow', '0');
  expect(errors).toEqual([]);
});

test('loads 7/8, unlocks, flips, replays and redeems a repeatable demo with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/loyalty/');
  const progress = page.getByRole('progressbar');
  const purchase = page.getByRole('button', { name: 'Simulate Coffee Purchase' });
  const ticket = page.getByRole('region', { name: 'Demo reward ticket' });
  const flip = ticket.getByRole('button', { name: 'Flip reward ticket' });
  const redeem = ticket.getByRole('button', { name: 'Redeem demo reward' });

  await page.getByRole('button', { name: 'Load 7/8 example' }).click();
  await expect(progress).toHaveAttribute('aria-valuenow', '7');
  await expect(ticket).toHaveCount(0);
  await purchase.focus();
  await page.keyboard.press('Space');
  await expect(flip).toBeFocused();
  await expect(progress).toHaveAttribute('aria-valuenow', '8');
  await expect(purchase).toBeDisabled();
  await page.reload();
  await expect(flip).toBeEnabled();
  await expect(progress).toHaveAttribute('aria-valuenow', '8');
  await expect(redeem).toHaveCount(0);
  await flip.focus();
  await page.keyboard.press('Enter');
  await expect(flip).toHaveAttribute('aria-pressed', 'true');
  await expect(ticket.getByRole('heading', { name: 'The next coffee is the reward.' })).toBeVisible();
  await expect(redeem).toBeVisible();
  await ticket.getByRole('button', { name: 'Replay unlock' }).click();
  await expect(flip).toBeEnabled();
  await expect(flip).toHaveAttribute('aria-pressed', 'false');
  await expect(progress).toHaveAttribute('aria-valuenow', '8');
  await flip.click();
  await redeem.click();
  await expect(progress).toHaveAttribute('aria-valuenow', '0');
  await expect(ticket).toHaveCount(0);
  await expect(purchase).toBeFocused();
  await expect(page.getByRole('main').getByRole('status')).toContainText('Demo reward redeemed.');
  await purchase.click();
  await expect(progress).toHaveAttribute('aria-valuenow', '1');
});

test('undo and confirmed reset safely cancel a running stamp or unlock', async ({ page }) => {
  await page.goto('/loyalty/');
  const progress = page.getByRole('progressbar');
  const purchase = page.getByRole('button', { name: 'Simulate Coffee Purchase' });
  const undo = page.getByRole('button', { name: 'Undo last stamp' });
  const flight = page.locator('[data-stamp-flight]');
  const reward = page.getByRole('region', { name: 'Demo reward ticket' });

  await page.getByRole('button', { name: 'Load 7/8 example' }).click();
  await purchase.click();
  await expect(flight).toBeVisible();
  await undo.click();
  await expect(flight).toHaveCount(0);
  await expect(progress).toHaveAttribute('aria-valuenow', '7');

  await purchase.click();
  await expect(reward).toHaveAttribute('aria-busy', 'true');
  await page.getByRole('button', { name: 'Reset progress' }).click();
  await page.getByRole('button', { name: 'Reset demo card' }).click();
  await expect(progress).toHaveAttribute('aria-valuenow', '0');
  await expect(reward).toHaveCount(0);

  await purchase.click();
  await expect(progress).toHaveAttribute('aria-valuenow', '1');
  await expect(reward).toHaveCount(0);
});
