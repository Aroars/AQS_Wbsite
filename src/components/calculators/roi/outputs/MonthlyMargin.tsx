"use client";
import { formatCurrency } from '../format';

interface MonthlyMarginProps {
  laborSavings: number;
  capacityBenefit: number;
  totalMargin: number;
}

export function MonthlyMargin({ laborSavings, capacityBenefit, totalMargin }: MonthlyMarginProps) {
  return (
    <div className="bg-surface-card rounded-lg p-3 border-l-4 border-l-success">
      {/* On narrow viewports the label and the sum drop onto separate lines and
          the sum itself wraps at its operators; overflow-x-auto is only a guard
          so nothing can push the page sideways */}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <span className="text-xs text-text-body uppercase tracking-wide flex-shrink-0">Monthly Operating Margin</span>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm whitespace-nowrap overflow-x-auto max-w-full">
          <div className="flex items-center gap-1.5">
            <span className="text-text-dim">Labor:</span>
            <span className="roi-result-value text-text-strong">{formatCurrency(laborSavings)}</span>
          </div>
          <span className="text-text-dim">+</span>
          <div className="flex items-center gap-1.5">
            <span className="text-text-dim">Capacity:</span>
            <span className="roi-result-value text-text-strong">{formatCurrency(capacityBenefit)}</span>
          </div>
          <span className="text-text-dim">=</span>
          <span className="roi-result-value text-success font-semibold">{formatCurrency(totalMargin)}/mo</span>
        </div>
      </div>
    </div>
  );
}
