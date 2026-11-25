import { expect, test } from '@playwright/test';

test('creates a device card, retains its barcode after reload, and omits the stamp demos', async ({ page }) => {
  await page.goto('/loyalty/');
  const main = page.getByRole('main');
  await expect(main.getByRole('heading', { level: 1, name: 'Lumi Lane Coffee Club' })).toBeVisible();
  await main.getByRole('link', { name: 'Sign up for Coffee Club' }).click();
  await expect(page).toHaveURL(/#join-club$/);
  const form = main.locator('#join-club');
  await expect(form).toBeFocused();
  await expect(form.getByRole('button', { name: 'Create my card' })).toBeDisabled();
  await form.getByLabel('Full name').fill('Sample Member');
  await form.getByRole('button', { name: 'Create my card' }).click();
  const code = form.getByText(/^LL[0-9A-F]{10}$/);
  await expect(code).toBeVisible();
  const memberCode = await code.innerText();
  await expect(form.getByRole('img', { name: 'Device card barcode' }).locator('rect').first()).toBeVisible();
  await page.reload();
  await expect(form.getByText(memberCode, { exact: true })).toBeVisible();
  await expect(form.getByText('Sample Member', { exact: true })).toBeVisible();
  await expect(main.getByRole('heading', { name: 'Try it yourself' })).toHaveCount(0);
  await expect(main.getByRole('region', { name: 'How it would work' })).toHaveCount(0);
});
