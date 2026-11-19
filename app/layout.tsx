import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  ),
  title: 'AyojanSetu – Customer Homepage | Every Event. Every Occasion. One Platform.',
  description:
    'Discover verified event professionals for grand weddings, intimate family poojas, milestone birthdays, and prestigious corporate summits across Hyderabad.',
  keywords: [
    'AyojanSetu',
    'Hyderabad event management',
    'Hyderabad wedding decorators',
    'Telugu wedding mandap',
    'Banjara Hills event vendors',
    'Jubilee Hills wedding planners',
  ],
  openGraph: {
    title: 'AyojanSetu – Every Event. Every Occasion. One Platform.',
    description:
      'A refined event marketplace uniting host families, curated venues, and verified service artisans across Hyderabad.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'AyojanSetu',
    images: [
      {
        url: '/images/luxury_wedding_decor.png',
        width: 1200,
        height: 900,
        alt: 'AyojanSetu – Luxury South Indian Wedding Reception in Hyderabad',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
