"use client";
import { formatCurrency } from '../format';

interface MonthlyMarginProps {
  laborSavings: number;
  capacityBenefit: number;
  totalMargin: number;
}

export function MonthlyMargin({ laborSavings, capacityBenefit, totalMargin }: MonthlyMarginProps) {
  return (
    <div className="roi-card p-3 border-l-4 border-l-[var(--roi-benefit)]">
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs text-[var(--roi-text-secondary)] uppercase tracking-wide flex-shrink-0">Monthly Operating Margin</span>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <span className="text-[var(--roi-text-muted)]">Labor:</span>
            <span className="roi-result-value">{formatCurrency(laborSavings)}</span>
          </div>
          <span className="text-[var(--roi-text-muted)]">+</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[var(--roi-text-muted)]">Capacity:</span>
            <span className="roi-result-value">{formatCurrency(capacityBenefit)}</span>
          </div>
          <span className="text-[var(--roi-text-muted)]">=</span>
          <span className="roi-result-value text-[var(--roi-benefit)] font-semibold">{formatCurrency(totalMargin)}/mo</span>
        </div>
      </div>
    </div>
  );
}
