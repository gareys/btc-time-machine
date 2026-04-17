import type { Metadata, Viewport } from 'next';

import { Providers } from '@/components/Providers';

import './globals.css';

export const metadata: Metadata = {
  title: 'BTC Time Machine',
  description: 'See what your Bitcoin DCA would be worth today.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0b0b0d' },
  ],
};

// Pre-paint script: set the `dark` class before React hydrates so the very
// first frame matches the resolved scheme (no white flash).
const themeBoot = `
(function(){try{
  var p = new URLSearchParams(window.location.search);
  var t = p.get('theme');
  if (t !== 'light' && t !== 'dark') {
    t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  document.documentElement.classList.toggle('dark', t === 'dark');
  document.documentElement.style.colorScheme = t;
}catch(e){}})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="color-scheme" content="light dark" />
        <script dangerouslySetInnerHTML={{ __html: themeBoot }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
