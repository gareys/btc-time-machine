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
    <main
      className="mx-auto flex h-[100svh] max-w-xl flex-col gap-2 px-3 pt-2"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 76px)' }}
    >
      <header className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h1 className="truncate text-base font-semibold tracking-tight">BTC Time Machine</h1>
          <p className="truncate text-[11px] btm-muted">
            What would your DCA be worth today?
          </p>
        </div>
        <ConnectButton />
      </header>

      <section className="btm-card p-3">
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

      <section className="btm-card flex min-h-0 flex-1 flex-col gap-2 p-3">
        <div className="grid grid-cols-3 gap-1 text-center">
          <Stat label="Invested" value={formatUsd(result.totalInvested)} />
          <Stat
            label="Today"
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
        <div className="min-h-0 flex-1">
          <PriceChart
            result={result}
            scheme={scheme}
            startDate={startDate}
            onPickDate={setStartDate}
          />
        </div>
        <p className="text-center text-[10px] btm-muted">
          Tap chart to set start · {isLive ? 'Live BTC price' : 'Cached BTC price'}
        </p>
      </section>

      <div
        className="fixed inset-x-0 bottom-0 z-10 px-3 pt-3 btm-cta-bar"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)' }}
      >
        <div className="mx-auto max-w-xl">
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
    highlight === 'positive' ? 'btm-positive' : highlight === 'negative' ? 'btm-negative' : '';
  return (
    <div className="flex flex-col items-center gap-0">
      <span className="text-[10px] font-medium uppercase tracking-wide btm-muted">{label}</span>
      <span className={`text-sm font-semibold tabular-nums ${tone}`}>{value}</span>
      {sub ? <span className={`text-[11px] tabular-nums ${tone}`}>{sub}</span> : null}
    </div>
  );
}
