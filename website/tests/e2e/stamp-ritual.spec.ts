import { expect, test } from '@playwright/test';

test('introduces the proposed programme before the demo and answers customer questions', async ({ page }) => {
  await page.goto('/loyalty/');
  const main = page.getByRole('main');
  await expect(main.getByRole('heading', { level: 1, name: 'Lumi Lane Coffee Club' })).toBeVisible();
  await main.getByRole('link', { name: 'Preview the member card' }).click();
  await expect(page).toHaveURL(/#join-club$/);
  await expect(main.getByText(/A proposed programme, shown as a demo/)).toBeVisible();
  const tryIt = main.getByRole('link', { name: 'Try the demo' });
  await tryIt.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#try-it$/);
  const demo = main.getByRole('region', { name: 'Try it yourself' });
  await expect(demo).toBeFocused();
  const story = main.getByRole('region', { name: 'How it would work' });
  await expect(story.getByRole('listitem')).toHaveText([
    'Order a coffee.',
    'Collect a stamp each time.',
    'Your eighth unlocks a free coffee.',
  ]);
  const ordered = await main.evaluate((element) => {
    const sections = [
      element.querySelector('section[aria-labelledby="loyalty-title"]'),
      element.querySelector('section[aria-labelledby="story-title"]'),
      element.querySelector('#join-club'),
      element.querySelector('section[aria-labelledby="demo-title"]'),
      element.querySelector('section[aria-labelledby="faq-title"]'),
    ];
    return sections.every(
      (section, index, all) =>
        section &&
        (index === 0 ||
          Boolean((all[index - 1]?.compareDocumentPosition(section) ?? 0) & Node.DOCUMENT_POSITION_FOLLOWING)),
    );
  });
  expect(ordered).toBe(true);
  await expect(demo.getByRole('button', { name: 'Try a demo purchase' })).toBeEnabled();
  const membership = main.getByRole('region', { name: 'Preview your Coffee Club card' });
  await membership.getByLabel('Full name').fill('Sample Member');
  await membership.getByRole('button', { name: 'Preview my card' }).click();
  await expect(membership.getByText('Sample Member', { exact: true })).toBeVisible();
  await expect(membership.getByRole('img', { name: 'Sample Coffee Club barcode' })).toBeVisible();

  const questions = [
    ['How do I earn stamps?', 'approved way to confirm purchases'],
    ['How many stamps do I need?', 'You need 8 stamps'],
    ['What would the reward be?', 'one standard coffee'],
    ['Do I need an account?', 'without an account'],
    ['Can I redeem a reward now?', 'for demonstration only'],
  ] as const;
  for (const [question, answer] of questions) {
    const summary = main.locator('summary').filter({ hasText: question });
    const details = summary.locator('..');
    await expect(details.locator('p')).toBeHidden();
    await summary.focus();
    await page.keyboard.press('Space');
    await expect(details.locator('p')).toContainText(answer);
    await expect(details.locator('p')).toBeVisible();
    await summary.press('Enter');
    await expect(details.locator('p')).toBeHidden();
  }
  await expect(main.getByText('A proposed programme. Terms to be confirmed with Lumi Lane.')).toBeVisible();
});

test('one purchase stamps automatically, guards rapid clicks and persists progress', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/loyalty/');
  const progress = page.getByRole('progressbar', { name: 'Demo stamp progress' });
  const purchase = page.getByRole('button', { name: 'Try a demo purchase' });
  await expect(progress).toHaveAttribute('aria-valuenow', '0');
  await expect(page.getByRole('button', { name: 'Press stamp' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Undo last stamp' })).toBeDisabled();
  // The card restores from storage after hydration; only then is the purchase button live.
  await expect(purchase).toBeEnabled();

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
  await expect(page.locator('[data-stamp-slot][data-filled=true]')).toHaveCount(2);
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
  const reset = page.getByRole('button', { name: 'Reset', exact: true });
  await reset.click();
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(progress).toHaveAttribute('aria-valuenow', '1');
  await expect(reset).toBeFocused();
  await reset.click();
  await page.getByRole('button', { name: 'Reset demo card' }).click();
  await expect(progress).toHaveAttribute('aria-valuenow', '0');
  expect(errors).toEqual([]);
});

test('loads 7/8, unlocks, flips, replays and redeems a repeatable demo with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/loyalty/');
  const progress = page.getByRole('progressbar', { name: 'Demo stamp progress' });
  const purchase = page.getByRole('button', { name: 'Try a demo purchase' });
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
  await expect(ticket.getByRole('heading', { name: 'One standard coffee.' })).toBeVisible();
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
  const progress = page.getByRole('progressbar', { name: 'Demo stamp progress' });
  const purchase = page.getByRole('button', { name: 'Try a demo purchase' });
  const undo = page.getByRole('button', { name: 'Undo last stamp' });
  const pressing = page.locator('[data-stamp-slot][data-active=true]');
  const reward = page.getByRole('region', { name: 'Demo reward ticket' });

  await page.getByRole('button', { name: 'Load 7/8 example' }).click();
  await purchase.click();
  await expect(pressing).toBeVisible();
  await undo.click();
  await expect(pressing).toHaveCount(0);
  await expect(progress).toHaveAttribute('aria-valuenow', '7');
  await expect(page.locator('[data-stamp-slot][data-filled=true]')).toHaveCount(7);

  await purchase.click();
  await expect(reward).toHaveAttribute('aria-busy', 'true');
  await page.getByRole('button', { name: 'Reset', exact: true }).click();
  await page.getByRole('button', { name: 'Reset demo card' }).click();
  await expect(progress).toHaveAttribute('aria-valuenow', '0');
  await expect(reward).toHaveCount(0);

  await purchase.click();
  await expect(progress).toHaveAttribute('aria-valuenow', '1');
  await expect(page.locator('[data-stamp-slot][data-filled=true]')).toHaveCount(1);
  await expect(reward).toHaveCount(0);
});
