"use client";
import { formatCurrency } from '../format';

interface OpportunityCostSectionProps {
  monthlyOperatingMargin: number;
  delayMonths: number;
  onDelayChange: (months: number) => void;
}

export function OpportunityCostSection({ monthlyOperatingMargin, delayMonths, onDelayChange }: OpportunityCostSectionProps) {
  const lostRevenue = delayMonths * monthlyOperatingMargin;
  const fillPct = (delayMonths / 18) * 100;

  return (
    <div className="bg-surface-card rounded-lg p-3">
      <div className="flex items-center gap-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-text-body uppercase tracking-wide">Opportunity Cost of Delay</span>
            <span className="text-xs font-medium text-text-strong">{delayMonths} {delayMonths === 1 ? 'mo' : 'mos'}</span>
          </div>
          <input type="range" min={0} max={18} step={1} value={delayMonths} onChange={(e) => onDelayChange(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-brand-cyan"
            style={{ background: `linear-gradient(to right, var(--accent-text) 0%, var(--accent-text) ${fillPct}%, var(--border) ${fillPct}%, var(--border) 100%)` }} />
          <div className="flex justify-between text-[11px] text-text-dim mt-0.5">
            <span>0</span><span>6</span><span>12</span><span>18 mo</span>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-[11px] text-text-dim uppercase tracking-wide">Revenue Lost</div>
          <div className={`text-xl font-semibold roi-result-value ${delayMonths > 0 ? 'text-error' : 'text-text-strong'}`}>{formatCurrency(lostRevenue)}</div>
          <div className="text-[11px] text-text-dim">{delayMonths} &times; {formatCurrency(monthlyOperatingMargin)}/mo</div>
        </div>
      </div>
    </div>
  );
}
