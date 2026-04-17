'use client';

import { useCallback } from 'react';

import { CBBTC_SWAP_SCHEME, CBBTC_SWAP_UNIVERSAL } from '@/lib/cbbtc';

export function SwapCta() {
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
    <a href={CBBTC_SWAP_UNIVERSAL} onClick={handleClick} className="btm-cta">
      Buy cbBTC →
    </a>
  );
}
