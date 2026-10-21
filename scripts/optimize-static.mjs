import assert from 'node:assert/strict';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { siteUrl } from '../site.config.mjs';

const root = process.cwd();
const output = path.join(root, 'dist/client');
function files(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? files(file) : [file];
  });
}

// This site has no client state, forms, or event handlers. Refuse to silently
// disable future interactive components if that changes.
for (const file of files(path.join(root, 'app')).filter(file => /\.[jt]sx?$/.test(file))) {
  assert.ok(!/^\s*['"]use client['"]/m.test(readFileSync(file, 'utf8')), 'Client components need browser JavaScript. Update the static optimization strategy before adding them.');
}

for (const file of files(output).filter(file => file.endsWith('.html'))) {
  let html = readFileSync(file, 'utf8');
  html = html.replace(/<script\b([^>]*)>[\s\S]*?<\/script>/gi, (script, attributes) => /type=["']application\/ld\+json["']/i.test(attributes) ? script : '');
  html = html.replace(/<link\b[^>]*rel=["']modulepreload["'][^>]*\/?\s*>/gi, '');
  // Inline the small shared stylesheet to avoid a render-blocking round trip.
  html = html.replace(/<link\b(?=[^>]*rel=["']stylesheet["'])[^>]*href=["']([^"']+)["'][^>]*\/?\s*>/gi, (_link, href) => {
    assert.ok(href.startsWith('/_next/static/'), `Unexpected stylesheet URL: ${href}`);
    const css = readFileSync(path.join(output, href), 'utf8');
    return `<style>${css.replace(/<\/style/gi, '<\\/style')}</style>`;
  });
  assert.ok(!/<script\b(?![^>]*application\/ld\+json)/i.test(html), `Unexpected browser script in ${file}`);
  writeFileSync(file, html);
  console.log(`Optimized ${path.relative(output, file)}: static HTML, inline CSS, no hydration.`);
}

for (const [file, language, direction] of [['index.html', 'en', 'ltr'], ['fa.html', 'fa', 'rtl']]) {
  const html = readFileSync(path.join(output, file), 'utf8');
  assert.ok(html.includes(`lang="${language}"`) && html.includes(`dir="${direction}"`), `Invalid language document: ${file}`);
  assert.ok(html.includes('application/ld+json') && html.includes('rel="canonical"'), `Missing SEO metadata: ${file}`);
}

writeFileSync(path.join(output, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);
const languages = [['en', `${siteUrl}/`], ['fa', `${siteUrl}/fa`], ['x-default', `${siteUrl}/`]];
const alternates = languages.map(([language, url]) => `<xhtml:link rel="alternate" hreflang="${language}" href="${url}"/>`).join('');
writeFileSync(path.join(output, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${['/', '/fa'].map(route => `<url><loc>${siteUrl}${route}</loc>${alternates}</url>`).join('')}</urlset>\n`);
console.log('Generated robots.txt and bilingual sitemap.xml.');
