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

const inputClass =
  'h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-[15px] tabular-nums outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:placeholder:text-zinc-500';

const labelClass = 'flex flex-col gap-1 text-xs font-medium text-zinc-500 dark:text-zinc-400';

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
    <div className="grid grid-cols-2 gap-2">
      <label className={labelClass}>
        <span className="px-1">Amount</span>
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
            $
          </span>
          <input
            type="number"
            inputMode="decimal"
            min={1}
            step={1}
            value={amount}
            onChange={(e) => onAmount(Math.max(1, Number(e.target.value) || 0))}
            className={`${inputClass} pl-6`}
          />
        </div>
      </label>

      <label className={labelClass}>
        <span className="px-1">Frequency</span>
        <select
          value={frequency}
          onChange={(e) => onFrequency(e.target.value as Frequency)}
          className={`${inputClass} appearance-none pr-7`}
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'><path fill='none' stroke='%23a1a1aa' stroke-width='1.5' d='M2 4l4 4 4-4'/></svg>\")",
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 10px center',
          }}
        >
          {(Object.keys(FREQUENCY_LABELS) as Frequency[]).map((f) => (
            <option key={f} value={f}>
              {FREQUENCY_LABELS[f]}
            </option>
          ))}
        </select>
      </label>

      <label className={`${labelClass} col-span-2`}>
        <span className="px-1">Start date</span>
        <input
          type="date"
          value={startDate}
          min={minDate}
          max={maxDate}
          onChange={(e) => onStartDate(e.target.value)}
          className={inputClass}
        />
      </label>
    </div>
  );
}
