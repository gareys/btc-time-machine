'use client';

import { CBBTC_SWAP_URL } from '@/lib/cbbtc';

export function SwapCta() {
  return (
    <a href={CBBTC_SWAP_URL} className="btm-cta">
      Buy cbBTC →
    </a>
  );
}
