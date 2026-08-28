import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://itadbeer.com'),
  title: 'Itadbeer — Software built with purpose',
  description: 'Itadbeer designs and develops reliable websites, mobile apps, and custom software for ambitious businesses.',
  openGraph: {
    title: 'Itadbeer — Software built with purpose',
    description: 'Web products, mobile apps, and custom software for ambitious businesses.',
    type: 'website',
    images: [{ url: '/og.png', width: 1792, height: 923, alt: 'Itadbeer — Software built with purpose' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Itadbeer — Software built with purpose',
    description: 'Web products, mobile apps, and custom software for ambitious businesses.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
