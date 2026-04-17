'use client';

import { useCallback } from 'react';

import { CBBTC_SWAP_SCHEME, CBBTC_SWAP_UNIVERSAL } from '@/lib/cbbtc';

export function SwapCta() {
  // Try the cbwallet:// scheme first (instant inside TBA's webview / any
  // device with the app installed). If the page is still visible after a
  // short delay, fall back to the universal link.
  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const start = Date.now();
    window.location.href = CBBTC_SWAP_SCHEME;
    setTimeout(() => {
      if (document.visibilityState === 'visible' && Date.now() - start < 1500) {
        window.location.href = CBBTC_SWAP_UNIVERSAL;
      }
    }, 600);
  }, []);

  return (
    <a
      href={CBBTC_SWAP_UNIVERSAL}
      onClick={handleClick}
      className="flex h-12 w-full items-center justify-center rounded-xl bg-blue-600 text-base font-semibold text-white shadow-sm transition active:scale-[0.99] active:bg-blue-700 dark:bg-blue-500 dark:active:bg-blue-600"
    >
      Buy cbBTC →
    </a>
  );
}
