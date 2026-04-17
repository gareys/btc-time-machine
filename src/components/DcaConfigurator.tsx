'use client';

import { type Frequency, FREQUENCY_LABELS } from '@/lib/dca';

type Props = {
  amount: number;
  onAmount: (n: number) => void;
  frequency: Frequency;
  onFrequency: (f: Frequency) => void;
  startDate: string;
  onStartDate: (d: string) => void;
  minDate: string;
  maxDate: string;
};

export function DcaConfigurator({
  amount,
  onAmount,
  frequency,
  onFrequency,
  startDate,
  onStartDate,
  minDate,
  maxDate,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium opacity-70">Amount (USD)</span>
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 opacity-50">
            $
          </span>
          <input
            type="number"
            inputMode="decimal"
            min={1}
            step={1}
            value={amount}
            onChange={(e) => onAmount(Math.max(1, Number(e.target.value) || 0))}
            className="h-12 w-full rounded-xl border border-current/15 bg-current/5 pl-7 pr-3 text-base outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium opacity-70">Frequency</span>
        <select
          value={frequency}
          onChange={(e) => onFrequency(e.target.value as Frequency)}
          className="h-12 w-full appearance-none rounded-xl border border-current/15 bg-current/5 px-3 text-base outline-none focus:ring-2 focus:ring-blue-500"
        >
          {(Object.keys(FREQUENCY_LABELS) as Frequency[]).map((f) => (
            <option key={f} value={f}>
              {FREQUENCY_LABELS[f]}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium opacity-70">Start date</span>
        <input
          type="date"
          value={startDate}
          min={minDate}
          max={maxDate}
          onChange={(e) => onStartDate(e.target.value)}
          className="h-12 w-full rounded-xl border border-current/15 bg-current/5 px-3 text-base outline-none focus:ring-2 focus:ring-blue-500"
        />
      </label>
    </div>
  );
}
