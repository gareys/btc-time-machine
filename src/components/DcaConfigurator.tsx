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
    <div className="grid grid-cols-3 gap-2">
      <label className="btm-label">
        <span className="px-1">Amount</span>
        <div className="relative">
          <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 btm-muted">
            $
          </span>
          <input
            type="number"
            inputMode="decimal"
            min={1}
            step={1}
            value={amount}
            onChange={(e) => onAmount(Math.max(1, Number(e.target.value) || 0))}
            className="btm-input pl-5"
          />
        </div>
      </label>

      <label className="btm-label">
        <span className="px-1">Frequency</span>
        <select
          value={frequency}
          onChange={(e) => onFrequency(e.target.value as Frequency)}
          className="btm-input pr-7 appearance-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 12 12'><path fill='none' stroke='%23a1a1aa' stroke-width='1.5' d='M2 4l4 4 4-4'/></svg>\")",
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 8px center',
          }}
        >
          {(Object.keys(FREQUENCY_LABELS) as Frequency[]).map((f) => (
            <option key={f} value={f}>
              {FREQUENCY_LABELS[f]}
            </option>
          ))}
        </select>
      </label>

      <label className="btm-label">
        <span className="px-1">Start</span>
        <input
          type="date"
          value={startDate}
          min={minDate}
          max={maxDate}
          onChange={(e) => onStartDate(e.target.value)}
          className="btm-input"
        />
      </label>
    </div>
  );
}
