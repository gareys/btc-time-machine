'use client';

import { useEffect, useState } from 'react';

export type ColorScheme = 'light' | 'dark';

/**
 * Reads `prefers-color-scheme` and updates when the user (or the host webview,
 * e.g. Coinbase Wallet's experiments browser) toggles theme.
 */
export function usePrefersColorScheme(): ColorScheme {
  const [scheme, setScheme] = useState<ColorScheme>('light');

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setScheme(mq.matches ? 'dark' : 'light');
    const handler = (e: MediaQueryListEvent) => setScheme(e.matches ? 'dark' : 'light');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return scheme;
}
