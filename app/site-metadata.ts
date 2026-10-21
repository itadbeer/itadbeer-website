import type { Metadata } from 'next';
import { content, type Locale } from './content';

// The production origin is shared by all discovery and social metadata.
import { siteUrl } from '../site.config.mjs';
export { siteUrl };

export function metadataFor(locale: Locale): Metadata {
  const t = content[locale];
  const path = locale === 'fa' ? '/fa' : '/';
  return {
    metadataBase: new URL(siteUrl), title: t.seoTitle, description: t.description,
    alternates: { canonical: path, languages: { en: '/', fa: '/fa', 'x-default': '/' } },
    robots: { index: true, follow: true },
    icons: { icon: '/favicon.svg' },
    openGraph: {
      title: t.seoTitle, description: t.description, type: 'website', siteName: 'Itadbeer',
      url: path, locale: locale === 'fa' ? 'fa_IR' : 'en_US', alternateLocale: locale === 'fa' ? 'en_US' : 'fa_IR',
      images: [{ url: '/og.png', width: 1200, height: 630, alt: t.brand }],
    },
    twitter: { card: 'summary_large_image', title: t.seoTitle, description: t.description, images: ['/og.png'] },
  };
}
