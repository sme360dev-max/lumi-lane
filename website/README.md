# Lumi Lane — Coffee House & Bar (website)

The Lumi Lane website (Lightsview, Adelaide), converted from the single-file HTML prototype into a
Next.js + React + TypeScript project that builds to a **fully static site**. It is hosted on Cloudflare
Pages and sends table reservation requests to the Django API in `../backend`.

Stack: Next.js 16 (App Router, `output: 'export'`) · React 19 · TypeScript (strict) · Tailwind CSS 3.4
(compiled at build time, same version line the prototype used from the CDN) · GSAP 3 (npm) · ESLint 9 ·
Prettier · Playwright.

## Requirements

Node.js 20.19+ (developed on Node 24). Unit tests use Node's built-in test runner with native
TypeScript type-stripping, which needs **Node 22.18+**.

## Install

```bash
npm ci            # or: npm install
npx playwright install chromium   # only needed for the browser tests
```

## Develop

```bash
npm run dev       # http://localhost:3000
```

## Build and static export

```bash
npm run build     # type-checks, builds, writes the static site to ./out
npm start         # serves ./out on http://localhost:3000 to preview the production build
```

`./out` is plain HTML/CSS/JS. Upload it to any static host (Vercel, Netlify, S3/CloudFront, nginx…).
Routes use trailing slashes (`/menu/` → `out/menu/index.html`).

`npm run build` runs `scripts/flatten-rsc.mjs` afterwards (as `postbuild`). It works around a Next.js 16
static-export quirk: the router prefetches `about/__next.about.__PAGE__.txt` but the build writes
`about/__next.about/__PAGE__.txt`. The script copies those files to the requested names so plain static
hosts don't return 404s for prefetches.

## Quality checks

```bash
npm run typecheck   # tsc --noEmit (strict)
npm run lint        # ESLint (next/core-web-vitals + typescript)
npm run format      # Prettier
npm run test:unit   # menu data vs. original HTML, booking validation (node:test)
npm run test:e2e    # Playwright on the built site at 390 / 768 / 1440 px (run `npm run build` first)
npm run check       # typecheck + lint + unit tests + build
```

`npm run test:e2e` also writes screenshots of every page to `qa/screenshots/<viewport>/`.

## Project structure

```
src/
  app/                 routes: / , /menu/, /about/, /visit/, /book/, not-found, robots.txt, sitemap.xml
    layout.tsx         <html>, metadata, JSON-LD, header, footer, bottom navigation
  components/
    layout/            SiteHeader, SiteFooter, PageShell, SocialIcon
    navigation/        PrimaryNav (bottom pill), MegaMenu (category overview overlay)
    ui/                Button, PageHeader, SectionLabel, ResponsivePicture (AVIF/WebP <picture>)
  features/
    home/              HeroSection (GSAP orbit), heroOrbit.ts (pure geometry), LegacyHashRedirect
    menu/              MenuTabs (accessible tabs + URL hash), MenuColumn, MenuItems
    about/ visit/      page bodies
    booking/           BookingForm, BookingField, validation.ts (pure, unit-tested)
  data/
    menu.ts            all 136 menu entries (single source of truth)
    content.ts         page copy
    business.ts        address, phone, hours, social links
    navigation.ts      nav items, mega-menu columns
  hooks/useMediaQuery.ts
  styles/              tokens.ts (colours, fonts, easing), globals.css, fonts.css (self-hosted)
  types/menu.ts        menu data types
public/
  assets/img/          the six original photos as AVIF + WebP at 480/800/1254 (storefront 1200) px
  fonts/               Playfair Display, Archivo, Pinyon Script (woff2, self-hosted)
assets-src/            original full-size PNG masters from the prototype (not shipped)
reference/             untouched copy of the original index.html, used by the menu data test
scripts/flatten-rsc.mjs
tests/unit/            node:test unit tests
tests/e2e/             Playwright tests
qa/                    screenshots + QA report
```

## Editing content

- Menu: `src/data/menu.ts`. `price` / `glass` / `bottle` are the strings printed on the menu; keep the
  matching `*Cents` value in sync (the unit test checks they agree). If you intentionally change the menu,
  the "matches the original" test will report the difference — update or remove that test then.
- Opening hours, phone, address, social links: `src/data/business.ts`.
- Page text: `src/data/content.ts`.
- Colours and fonts: `src/styles/tokens.ts` (used by `tailwind.config.ts`).
- New photos: export AVIF + WebP at the same widths into `public/assets/img/`.

## Book a Table

The form validates in the browser, then sends a JSON request to `POST /api/bookings/` on the Django
backend. Set `NEXT_PUBLIC_API_BASE_URL` at build time to the backend's public URL. The backend saves
requests to Supabase and sends venue notifications through Brevo. Submitting a request does not itself
confirm the reservation; staff follow up with the guest.
