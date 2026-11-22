// Prebuild: copy the live menu from Django (GET /api/menu/) into src/data/menu-snapshot.json,
// so the static /menu/ HTML ships with current prices. If the API cannot be reached, the build
// keeps the existing snapshot (the page still loads the live menu in the browser).
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const target = `${root}src/data/menu-snapshot.json`;
const envFile = `${root}.env.local`;

if (!process.env.NEXT_PUBLIC_API_BASE_URL && existsSync(envFile)) process.loadEnvFile(envFile);
const api = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '');

const valid = (menu) =>
  Array.isArray(menu) &&
  menu.length > 0 &&
  menu.every((c) => typeof c?.id === 'string' && typeof c?.label === 'string' && Array.isArray(c?.columns));

async function pull(attempts = 2) {
  for (let i = 1; i <= attempts; i++) {
    try {
      // A sleeping free Render service can take close to a minute to answer.
      const response = await fetch(`${api}/api/menu/`, { signal: AbortSignal.timeout(75_000) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const { categories } = await response.json();
      if (!valid(categories)) throw new Error('unexpected response shape');
      return categories;
    } catch (error) {
      console.warn(`[menu] attempt ${i}/${attempts} failed: ${error.message}`);
    }
  }
  return null;
}

if (!api) {
  console.warn('[menu] NEXT_PUBLIC_API_BASE_URL is not set; using the existing menu snapshot.');
} else {
  const categories = await pull();
  if (!categories) {
    console.warn(`[menu] could not load ${api}/api/menu/; using the existing menu snapshot.`);
  } else {
    const next = `${JSON.stringify({ categories }, null, 2)}\n`;
    const current = existsSync(target) ? readFileSync(target, 'utf8') : '';
    if (next === current) console.log('[menu] snapshot is up to date.');
    else {
      writeFileSync(target, next);
      console.log(`[menu] snapshot updated from ${api}/api/menu/.`);
    }
  }
}
