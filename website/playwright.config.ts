import { defineConfig, devices } from '@playwright/test';

// Runs against the real static export (./out) served on :4173. `npm run build` first.
export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  reporter: [['list']],
  use: { baseURL: 'http://localhost:4173', trace: 'off' },
  webServer: {
    command: 'npx serve out -l 4173 --no-clipboard',
    url: 'http://localhost:4173',
    reuseExistingServer: true,
    timeout: 60_000,
  },
  projects: [
    { name: 'mobile-390', use: { ...devices['Pixel 7'], viewport: { width: 390, height: 844 } } },
    { name: 'tablet-768', use: { ...devices['Desktop Chrome'], viewport: { width: 768, height: 1024 } } },
    { name: 'laptop-1024', use: { ...devices['Desktop Chrome'], viewport: { width: 1024, height: 900 } } },
    { name: 'desktop-1440', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
  ],
});
