# Itadbeer

English (`/`) and Persian (`/fa`) marketing site. The Persian page has its own RTL HTML document, translated content, local Vazirmatn fonts, Persian numbers and a language switcher. English uses local Geist fonts. Edit shared content in `app/content.ts` and layout in `app/studio.tsx`.

## Development and build

```sh
npm ci
npm run dev
npx tsc --noEmit
npm run build
node scripts/preview-static.mjs
```

The production preview serves `http://127.0.0.1:4174`. Vinext exports the language pages, sitemap, robots file, and assets into `dist/client`. The Sites manifest packages that directory as a static site; it retains the existing project ID and unused storage declarations.

The build wrapper lets successful Vinext builds exit naturally on Windows, avoiding the Node 24 shutdown race documented in [nodejs/node#56645](https://github.com/nodejs/node/issues/56645). Exceptions and nonzero exits still fail normally.

`scripts/optimize-static.mjs` removes framework hydration and module preloads, preserves JSON-LD, and inlines the small generated stylesheet. All current interactions are ordinary links, including anchors, the language switcher, Telegram and email. No browser JavaScript is required. The optimizer rejects client components: if a future feature needs event handlers, state, forms or other browser code, adapt this build strategy before adding it. Build output must retain valid language attributes and canonical/structured metadata or optimization fails.

## SEO and assets

`app/site-metadata.ts` defines language-specific metadata, canonical URLs, hreflang, Open Graph and Twitter cards. The static optimizer generates `robots.txt` and `sitemap.xml` with reciprocal language alternates. `site.config.mjs` defaults to `https://itadbeer.com`; an optional `SITE_URL` environment value overrides the origin at build time. Organization data describes the existing studio; it does not invent ratings or reviews.

Responsive WebP wordmarks, explicit image dimensions, lazy footer imagery, self-hosted fonts, and static HTML reduce initial work. The optimized 1200 × 630 social image is separate from page-load assets. Font licenses are in `public/fonts/`. Asset cache rules live in `public/_headers`; the local preview applies equivalent rules.

## Lighthouse CLI

Install Lighthouse outside the application dependencies, then audit the production preview:

```sh
npx --yes lighthouse http://127.0.0.1:4174/ --chrome-flags="--headless" --output=html --output=json --output-path=./work/lighthouse-en
npx --yes lighthouse http://127.0.0.1:4174/fa --chrome-flags="--headless" --output=html --output=json --output-path=./work/lighthouse-fa
```

Local lab scores vary with the machine and do not measure production network latency or search rankings. Re-run against the deployed site when hosting access allows it.

### Verified 2026-10-21

Lighthouse CLI 13.5.0, default mobile simulation, local production builds:

| Page | Performance | Accessibility | Best practices | SEO |
| --- | ---: | ---: | ---: | ---: |
| Original English | 63 | 95 | 96 | 100 |
| Updated English | 98 | 100 | 100 | 100 |
| New Persian | 96 | 100 | 100 | 100 |

One run per reported page, not field measurements or a multi-run median. The original used `vinext start`; the final uses the static preview with compression and asset caching. This reflects the delivery change but does not isolate it from machine variance. English LCP was 3.5s before and 1.7s after; Persian LCP was 2.0s. SEO already scored 100: the changes add correct canonical origin, localized metadata, hreflang, sitemap, robots and organization data beyond that score.

TypeScript and production build passed. Rendered HTTP checks verified both language documents, metadata, discovery files, fonts and unknown-path 404s. Browser checks verified mobile/desktop RTL, no horizontal overflow, both language links and contact anchor navigation. No external messages were sent.

## GitHub and Linux hosting

The public source repository is [itadbeer/itadbeer-website](https://github.com/itadbeer/itadbeer-website). `.github/workflows/deploy.yml` builds and validates `main` and pull requests. The production job uses SSH to upload an immutable static release, switch an atomic symlink, verify the exact production commit and Persian page, and roll back on failure. See [deployment setup and variables](deploy/README.md).

Production setup is in progress. Deployment is disabled until server access and the domain configuration are verified. The earlier Sites host remains separate; its Git source host was unreachable during the previous publishing attempt.
