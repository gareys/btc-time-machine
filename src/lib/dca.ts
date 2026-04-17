import { BTC_MONTHLY_PRICES, type PricePoint } from '@/data/btcPrices';

export type Frequency = 'once' | 'daily' | 'weekly' | 'monthly' | 'annually';

export const FREQUENCY_LABELS: Record<Frequency, string> = {
  once: 'One time',
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
  annually: 'Annually',
};

export type DcaResult = {
  totalInvested: number;
  totalBtc: number;
  currentValue: number;
  /** Cumulative invested over time, sampled at price-history dates. */
  series: { date: string; price: number; portfolioValue: number; invested: number }[];
};

/**
 * Get the BTC price at-or-before a given ISO date by interpolating the bundled
 * monthly history. Returns the closest *prior* monthly close.
 */
export function priceAt(prices: PricePoint[], isoDate: string): number {
  const t = new Date(isoDate).getTime();
  let last = prices[0].price;
  for (const p of prices) {
    if (new Date(p.date).getTime() <= t) {
      last = p.price;
    } else {
      break;
    }
  }
  return last;
}

function nextDate(d: Date, frequency: Frequency): Date {
  const next = new Date(d);
  switch (frequency) {
    case 'daily':
      next.setUTCDate(next.getUTCDate() + 1);
      break;
    case 'weekly':
      next.setUTCDate(next.getUTCDate() + 7);
      break;
    case 'monthly':
      next.setUTCMonth(next.getUTCMonth() + 1);
      break;
    case 'annually':
      next.setUTCFullYear(next.getUTCFullYear() + 1);
      break;
    case 'once':
      next.setUTCFullYear(next.getUTCFullYear() + 1000);
      break;
  }
  return next;
}

/**
 * Compute DCA results given amount per purchase, frequency, start date, and
 * an optional override for current price (live fetch). Series is sampled at
 * the bundled monthly cadence so the chart stays light.
 */
export function computeDca(opts: {
  amountPerPurchase: number;
  frequency: Frequency;
  startDate: string; // ISO YYYY-MM-DD
  currentPrice: number;
  prices?: PricePoint[];
}): DcaResult {
  const prices = opts.prices ?? BTC_MONTHLY_PRICES;
  const start = new Date(opts.startDate);
  const now = new Date();

  // Build set of purchase dates from start to now at frequency.
  let cursor = new Date(start);
  const purchases: Date[] = [];
  while (cursor.getTime() <= now.getTime()) {
    purchases.push(new Date(cursor));
    if (opts.frequency === 'once') break;
    cursor = nextDate(cursor, opts.frequency);
  }

  let totalBtc = 0;
  let totalInvested = 0;
  for (const p of purchases) {
    const price = priceAt(prices, p.toISOString().slice(0, 10));
    totalBtc += opts.amountPerPurchase / price;
    totalInvested += opts.amountPerPurchase;
  }
  const currentValue = totalBtc * opts.currentPrice;

  // Build the series: at every monthly price-point >= start date, record value.
  const series: DcaResult['series'] = [];
  let runningBtc = 0;
  let runningInvested = 0;
  let purchaseIdx = 0;
  const sampleDates = prices.filter((p) => new Date(p.date).getTime() >= start.getTime());
  for (const point of sampleDates) {
    const pointTime = new Date(point.date).getTime();
    while (purchaseIdx < purchases.length && purchases[purchaseIdx].getTime() <= pointTime) {
      const buyPrice = priceAt(prices, purchases[purchaseIdx].toISOString().slice(0, 10));
      runningBtc += opts.amountPerPurchase / buyPrice;
      runningInvested += opts.amountPerPurchase;
      purchaseIdx += 1;
    }
    series.push({
      date: point.date,
      price: point.price,
      portfolioValue: runningBtc * point.price,
      invested: runningInvested,
    });
  }
  // Append a final point at "today" using the live current price.
  if (series.length > 0) {
    series.push({
      date: now.toISOString().slice(0, 10),
      price: opts.currentPrice,
      portfolioValue: totalBtc * opts.currentPrice,
      invested: totalInvested,
    });
  }

  return { totalInvested, totalBtc, currentValue, series };
}

export function formatUsd(n: number): string {
  return n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: n >= 1000 ? 0 : 2,
  });
}
