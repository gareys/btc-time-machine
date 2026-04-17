'use client';

import { useEffect, useState } from 'react';

import { BTC_MONTHLY_PRICES } from '@/data/btcPrices';

const FALLBACK_PRICE = BTC_MONTHLY_PRICES[BTC_MONTHLY_PRICES.length - 1].price;

type Result = { price: number; isLive: boolean; error?: string };

/**
 * Fetch the current BTC/USD spot price. Tries Coinbase's public price API
 * first (no auth, generous rate limits), falls back to the most recent bundled
 * monthly close if the network call fails so the UI always renders.
 */
export function useBtcSpotPrice(): Result {
  const [state, setState] = useState<Result>({ price: FALLBACK_PRICE, isLive: false });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch('https://api.coinbase.com/v2/prices/BTC-USD/spot', {
          cache: 'no-store',
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as { data?: { amount?: string } };
        const amount = Number(json.data?.amount);
        if (!Number.isFinite(amount) || amount <= 0) throw new Error('bad payload');
        if (!cancelled) setState({ price: amount, isLive: true });
      } catch (e) {
        if (!cancelled) {
          setState({
            price: FALLBACK_PRICE,
            isLive: false,
            error: e instanceof Error ? e.message : 'fetch failed',
          });
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
