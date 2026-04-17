'use client';

import { useMemo, useState } from 'react';

import { ConnectButton } from '@/components/ConnectButton';
import { DcaConfigurator } from '@/components/DcaConfigurator';
import { PriceChart } from '@/components/PriceChart';
import { SwapCta } from '@/components/SwapCta';
import { BTC_MONTHLY_PRICES } from '@/data/btcPrices';
import { computeDca, formatUsd, type Frequency } from '@/lib/dca';
import { useBtcSpotPrice } from '@/lib/useBtcSpotPrice';
import { usePrefersColorScheme } from '@/lib/usePrefersColorScheme';

const MIN_DATE = BTC_MONTHLY_PRICES[0].date;
const MAX_DATE = new Date().toISOString().slice(0, 10);
const DEFAULT_START = '2020-01-01';

export default function Home() {
  const scheme = usePrefersColorScheme();
  const [amount, setAmount] = useState(100);
  const [frequency, setFrequency] = useState<Frequency>('monthly');
  const [startDate, setStartDate] = useState(DEFAULT_START);
  const { price: currentPrice, isLive } = useBtcSpotPrice();

  const result = useMemo(
    () =>
      computeDca({
        amountPerPurchase: amount,
        frequency,
        startDate,
        currentPrice,
      }),
    [amount, frequency, startDate, currentPrice],
  );

  const profit = result.currentValue - result.totalInvested;
  const multiple = result.totalInvested > 0 ? result.currentValue / result.totalInvested : 0;
  const profitPositive = profit >= 0;

  return (
    <main className="mx-auto flex min-h-[100svh] max-w-2xl flex-col gap-5 px-4 pb-28 pt-6 sm:gap-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">BTC Time Machine</h1>
          <p className="text-sm opacity-60">
            What would your Bitcoin DCA be worth today?
          </p>
        </div>
        <ConnectButton />
      </header>

      <section className="flex flex-col gap-3 rounded-2xl border border-current/10 bg-current/[0.03] p-4">
        <DcaConfigurator
          amount={amount}
          onAmount={setAmount}
          frequency={frequency}
          onFrequency={setFrequency}
          startDate={startDate}
          onStartDate={setStartDate}
          minDate={MIN_DATE}
          maxDate={MAX_DATE}
        />
      </section>

      <section className="flex flex-col gap-3 rounded-2xl border border-current/10 bg-current/[0.03] p-4">
        <div className="grid grid-cols-3 gap-2 text-center">
          <Stat label="Invested" value={formatUsd(result.totalInvested)} />
          <Stat
            label="Today's value"
            value={formatUsd(result.currentValue)}
            highlight={profitPositive ? 'positive' : 'negative'}
          />
          <Stat
            label={profitPositive ? 'Profit' : 'Loss'}
            value={`${profitPositive ? '+' : ''}${formatUsd(profit)}`}
            sub={multiple > 0 ? `${multiple.toFixed(2)}×` : undefined}
            highlight={profitPositive ? 'positive' : 'negative'}
          />
        </div>
        <PriceChart
          result={result}
          scheme={scheme}
          startDate={startDate}
          onPickDate={setStartDate}
        />
        <p className="text-center text-xs opacity-50">
          Tap the chart to set your start date. {isLive ? 'Live BTC price.' : 'Using cached BTC price (offline fallback).'}
        </p>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-current/10 bg-[var(--cta-bg,#ffffffee)] px-4 py-3 backdrop-blur dark:bg-[#0b0b0dee]">
        <div className="mx-auto max-w-2xl">
          <SwapCta />
        </div>
      </div>
    </main>
  );
}

function Stat({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: string;
  sub?: string;
  highlight?: 'positive' | 'negative';
}) {
  const tone =
    highlight === 'positive'
      ? 'text-emerald-600 dark:text-emerald-400'
      : highlight === 'negative'
        ? 'text-rose-600 dark:text-rose-400'
        : '';
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs uppercase tracking-wide opacity-60">{label}</span>
      <span className={`text-base font-semibold tabular-nums ${tone}`}>{value}</span>
      {sub ? <span className={`text-xs tabular-nums ${tone}`}>{sub}</span> : null}
    </div>
  );
}
