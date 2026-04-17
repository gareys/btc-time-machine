'use client';

import { Button } from '@coinbase/cds-web/buttons';

import { buildBuyCbBtcUrl } from '@/lib/cbbtc';

export function SwapCta() {
  const url = buildBuyCbBtcUrl();
  return (
    <a href={url} target="_blank" rel="noreferrer noopener" className="block">
      <Button block compact={false}>
        Buy cbBTC →
      </Button>
    </a>
  );
}
