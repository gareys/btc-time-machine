'use client';

import { useEffect, useState } from 'react';

export type ColorScheme = 'light' | 'dark';

function readUrlTheme(): ColorScheme | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  const t = params.get('theme');
  return t === 'dark' || t === 'light' ? t : null;
}

/**
 * Resolves the active color scheme. Priority:
 *   1. `?theme=light|dark` URL param (used by host webviews like TBA's
 *      Experiments browser to force a theme matching the app shell).
 *   2. OS-level `prefers-color-scheme` media query.
 *
 * Also toggles the `dark` class on <html> so Tailwind's `dark:` variants apply.
 */
export function usePrefersColorScheme(): ColorScheme {
  const [scheme, setScheme] = useState<ColorScheme>('light');

  useEffect(() => {
    const urlTheme = readUrlTheme();
    if (urlTheme) {
      setScheme(urlTheme);
      return;
    }
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setScheme(mq.matches ? 'dark' : 'light');
    const handler = (e: MediaQueryListEvent) => setScheme(e.matches ? 'dark' : 'light');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (scheme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    root.style.colorScheme = scheme;
  }, [scheme]);

  return scheme;
}
