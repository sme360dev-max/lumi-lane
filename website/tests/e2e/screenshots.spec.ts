import { test } from '@playwright/test';

// QA evidence: screenshots of every route at 390 / 768 / 1440 (one per Playwright project).
const PAGES = ['/', '/menu/', '/about/', '/visit/', '/book/'];

for (const path of PAGES) {
  test(`screenshot ${path}`, async ({ page }, info) => {
    await page.emulateMedia({ reducedMotion: 'reduce' }); // hold the hero on its first dish
    await page.goto(path);
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => document.fonts.ready);
    const name = path === '/' ? 'home' : path.replace(/\//g, '');
    await page.screenshot({ path: `qa/screenshots/${info.project.name}/${name}.png`, fullPage: path !== '/' });
  });
}
