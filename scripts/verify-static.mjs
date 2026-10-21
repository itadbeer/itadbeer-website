import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { siteUrl } from '../site.config.mjs';

const root = path.resolve('dist/client');
for (const [file, language, direction, route] of [['index.html', 'en', 'ltr', '/'], ['fa.html', 'fa', 'rtl', '/fa']]) {
  const html = readFileSync(path.join(root, file), 'utf8');
  assert.ok(html.includes(`<html lang="${language}" dir="${direction}"`), `${file}: language and direction`);
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, `${file}: one primary heading`);
  const canonical = html.match(/<link\b(?=[^>]*rel="canonical")[^>]*href="([^"]+)"/)?.[1];
  assert.ok(canonical, `${file}: canonical exists`);
  assert.equal(new URL(canonical).href, new URL(route, siteUrl).href, `${file}: production canonical`);
  for (const marker of ['hrefLang="en"', 'hrefLang="fa"', 'name="description"', 'application/ld+json', 'https://t.me/edicodes_pv', 'mailto:edris.qeshm2@gmail.com']) assert.ok(html.includes(marker), `${file}: ${marker}`);
  assert.ok(!/<script\b(?![^>]*application\/ld\+json)/i.test(html), `${file}: no hydration scripts`);
  assert.ok(!/<link\b[^>]*rel="stylesheet"/i.test(html), `${file}: inlined stylesheet`);
  for (const match of html.matchAll(/(?:src|href)="(\/[^"#?]*)"/g)) {
    const target = match[1];
    assert.ok([target, `${target}.html`, `${target}/index.html`].some(target => existsSync(path.join(root, target))), `${file}: missing local link ${target}`);
  }
  for (const match of html.matchAll(/url\(['"]?(\/[^)'"\s]+)['"]?\)/g)) assert.ok(existsSync(path.join(root, match[1])), `${file}: missing CSS asset ${match[1]}`);
  console.log(`${file}: language, metadata, static rendering and linked assets verified.`);
}
const robots = readFileSync(path.join(root, 'robots.txt'), 'utf8');
const sitemap = readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
assert.ok(robots.includes(`${siteUrl}/sitemap.xml`));
for (const route of ['/', '/fa']) assert.ok(sitemap.includes(`<loc>${siteUrl}${route}</loc>`));
assert.equal((sitemap.match(/hreflang="fa"/g) || []).length, 2);
assert.ok(existsSync(path.join(root, '404.html')));
console.log('robots.txt, bilingual sitemap.xml and 404 document verified.');
