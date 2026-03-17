"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ResponsiveContainer } from 'recharts';
import type { ChartDataPoint } from '../types';
import { formatCurrency } from '../format';

interface RoiChartProps {
  data: ChartDataPoint[];
  breakEvenMonth: number | null;
}

export function RoiChart({ data, breakEvenMonth }: RoiChartProps) {
  const xTicks = [0, 6, 12, 18, 24, 30, 36, 42, 48, 54, 60];

  return (
    <div className="roi-card p-3">
      <h3 className="roi-section-header mb-2">ROI Projection</h3>
      <div className="h-[250px] md:h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--roi-chart-grid)" vertical={false} />
            <XAxis dataKey="month" ticks={xTicks} tick={{ fill: 'var(--roi-text-secondary)', fontSize: 12 }} axisLine={{ stroke: 'var(--roi-border)' }} tickLine={{ stroke: 'var(--roi-border)' }}
              label={{ value: 'Month', position: 'insideBottom', offset: -5, fill: 'var(--roi-text-muted)', fontSize: 12 }} />
            <YAxis tickFormatter={(value) => { if (value >= 1000000 || value <= -1000000) return `$${(value / 1000000).toFixed(1)}M`; if (value >= 1000 || value <= -1000) return `$${(value / 1000).toFixed(0)}K`; return `$${value}`; }}
              tick={{ fill: 'var(--roi-text-secondary)', fontSize: 12 }} axisLine={{ stroke: 'var(--roi-border)' }} tickLine={{ stroke: 'var(--roi-border)' }} width={70} />
            <Tooltip formatter={(value) => formatCurrency(value as number)} labelFormatter={(label) => `Month ${label}`}
              contentStyle={{ backgroundColor: 'var(--roi-bg-secondary)', border: '1px solid var(--roi-border)', borderRadius: '0.375rem', color: 'var(--roi-text-primary)' }} />
            <Legend verticalAlign="bottom" height={36} iconType="line" wrapperStyle={{ paddingTop: '10px' }} />
            <ReferenceLine y={0} stroke="var(--roi-chart-zero)" strokeDasharray="5 5" strokeWidth={1} />
            {breakEvenMonth !== null && (
              <ReferenceLine x={breakEvenMonth} stroke="var(--roi-chart-net)" strokeDasharray="5 5" strokeWidth={1}
                label={{ value: `Break-even: Mo. ${breakEvenMonth}`, position: 'top', fill: 'var(--roi-chart-net)', fontSize: 11 }} />
            )}
            <Line type="monotone" dataKey="cumulativeBenefits" name="Cumulative Benefits" stroke="var(--roi-chart-benefit)" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            <Line type="monotone" dataKey="cumulativeCosts" name="Cumulative Costs" stroke="var(--roi-chart-cost)" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            <Line type="monotone" dataKey="cumulativeNet" name="Cumulative Net" stroke="var(--roi-chart-net)" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
