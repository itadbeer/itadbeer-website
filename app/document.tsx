import type { Locale } from './content';
import './globals.css';

// Separate root layouts give each language correct HTML attributes before paint.
export default function Document({ children, locale }: { children: React.ReactNode; locale: Locale }) {
  return (
    <html lang={locale} dir={locale === 'fa' ? 'rtl' : 'ltr'}>
      <head>
        <link rel="preload" href={locale === 'fa' ? '/fonts/vazirmatn-arabic.woff2' : '/fonts/geist-latin.woff2'} as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
