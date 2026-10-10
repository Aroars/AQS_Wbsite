"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ResponsiveContainer } from 'recharts';
import type { ChartDataPoint } from '../types';
import { formatCurrency } from '../format';

interface RoiChartProps {
  data: ChartDataPoint[];
  breakEvenMonth: number | null;
}

/* The chart sits inside the outputs readout (navy deep in both themes), so
   its series fills are tuned for a dark ground and its grid and text use the
   readout's border and body values directly: SVG attributes are the one place
   the semantic classes cannot reach. */
const CHART = {
  benefit: '#34d399',
  cost: '#f87171',
  net: '#60a5fa',
  grid: '#2F3344',
  axis: '#ADB3BF',
  axisLabel: '#8B94A3',
  zero: '#8B94A3',
} as const;

export function RoiChart({ data, breakEvenMonth }: RoiChartProps) {
  const xTicks = [0, 6, 12, 18, 24, 30, 36, 42, 48, 54, 60];

  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-[0.05em] text-text-body mb-2">ROI Projection</h3>
      <div className="h-[250px] md:h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} vertical={false} />
            <XAxis dataKey="month" ticks={xTicks} tick={{ fill: CHART.axis, fontSize: 12 }} axisLine={{ stroke: CHART.grid }} tickLine={{ stroke: CHART.grid }}
              label={{ value: 'Month', position: 'insideBottom', offset: -5, fill: CHART.axisLabel, fontSize: 12 }} />
            <YAxis tickFormatter={(value) => { if (value >= 1000000 || value <= -1000000) return `$${(value / 1000000).toFixed(1)}M`; if (value >= 1000 || value <= -1000) return `$${(value / 1000).toFixed(0)}K`; return `$${value}`; }}
              tick={{ fill: CHART.axis, fontSize: 12 }} axisLine={{ stroke: CHART.grid }} tickLine={{ stroke: CHART.grid }} width={70} />
            <Tooltip formatter={(value) => formatCurrency(value as number)} labelFormatter={(label) => `Month ${label}`}
              contentStyle={{ backgroundColor: 'var(--surface-card)', border: '1px solid var(--border)', borderRadius: '0.375rem', color: 'var(--text-strong)' }}
              labelStyle={{ color: 'var(--text-body)' }} />
            <Legend verticalAlign="bottom" height={36} iconType="line" wrapperStyle={{ paddingTop: '10px' }}
              formatter={(value) => <span style={{ color: CHART.axis }}>{value}</span>} />
            <ReferenceLine y={0} stroke={CHART.zero} strokeDasharray="5 5" strokeWidth={1} />
            {breakEvenMonth !== null && (
              <ReferenceLine x={breakEvenMonth} stroke={CHART.net} strokeDasharray="5 5" strokeWidth={1}
                label={{ value: `Break-even: Mo. ${breakEvenMonth}`, position: 'top', fill: CHART.net, fontSize: 11 }} />
            )}
            <Line type="monotone" dataKey="cumulativeBenefits" name="Cumulative Benefits" stroke={CHART.benefit} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            <Line type="monotone" dataKey="cumulativeCosts" name="Cumulative Costs" stroke={CHART.cost} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            <Line type="monotone" dataKey="cumulativeNet" name="Cumulative Net" stroke={CHART.net} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
