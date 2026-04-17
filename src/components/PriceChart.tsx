'use client';

import { useMemo } from 'react';
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { type DcaResult, formatUsd } from '@/lib/dca';
import { type ColorScheme } from '@/lib/usePrefersColorScheme';

type Props = {
  result: DcaResult;
  scheme: ColorScheme;
  startDate: string;
  onPickDate?: (date: string) => void;
};

function formatDateLabel(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
}

export function PriceChart({ result, scheme, startDate, onPickDate }: Props) {
  const isDark = scheme === 'dark';
  const colors = useMemo(
    () => ({
      grid: isDark ? '#2a2a2e' : '#e7e7ea',
      axis: isDark ? '#8a8a91' : '#5a5a63',
      portfolio: '#0052ff',
      portfolioFill: isDark ? 'rgba(0,82,255,0.18)' : 'rgba(0,82,255,0.14)',
      invested: isDark ? '#9a9aa1' : '#9a9aa1',
      ref: isDark ? '#f7c948' : '#d97706',
      tooltipBg: isDark ? '#18181b' : '#ffffff',
      tooltipBorder: isDark ? '#3a3a3f' : '#e7e7ea',
      tooltipText: isDark ? '#f4f4f5' : '#18181b',
    }),
    [isDark],
  );

  return (
    <div className="h-[320px] w-full select-none touch-pan-y">
      <ResponsiveContainer>
        <ComposedChart
          data={result.series}
          margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          onClick={(e) => {
            const label = (e as { activeLabel?: string } | null)?.activeLabel;
            if (label && onPickDate) onPickDate(label);
          }}
        >
          <defs>
            <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors.portfolio} stopOpacity={0.3} />
              <stop offset="100%" stopColor={colors.portfolio} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={colors.grid} vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={formatDateLabel}
            stroke={colors.axis}
            tickLine={false}
            tick={{ fontSize: 11 }}
            minTickGap={30}
          />
          <YAxis
            stroke={colors.axis}
            tickLine={false}
            tick={{ fontSize: 11 }}
            tickFormatter={(v: number) =>
              v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v.toFixed(0)}`
            }
            width={50}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: colors.tooltipBg,
              border: `1px solid ${colors.tooltipBorder}`,
              borderRadius: 12,
              color: colors.tooltipText,
              fontSize: 12,
            }}
            labelFormatter={(label) =>
              typeof label === 'string'
                ? new Date(label).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : ''
            }
            formatter={(value, name) => [
              typeof value === 'number' ? formatUsd(value) : String(value),
              name,
            ]}
          />
          <ReferenceLine
            x={startDate}
            stroke={colors.ref}
            strokeWidth={2}
            strokeDasharray="4 3"
            ifOverflow="extendDomain"
            label={{ value: 'Start', position: 'insideTopLeft', fill: colors.ref, fontSize: 11 }}
          />
          <Area
            type="monotone"
            dataKey="portfolioValue"
            name="Portfolio value"
            stroke={colors.portfolio}
            strokeWidth={2}
            fill="url(#portfolioGradient)"
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="invested"
            name="Invested"
            stroke={colors.invested}
            strokeWidth={1.5}
            strokeDasharray="3 3"
            dot={false}
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
