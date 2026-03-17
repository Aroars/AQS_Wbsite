"use client";
import { useState } from 'react';

export function DataSources() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="roi-card p-3 mt-6">
      <button onClick={() => setIsExpanded(!isExpanded)} className="flex items-center justify-between w-full text-left">
        <span className="text-xs text-[var(--roi-text-muted)] uppercase tracking-wide">Data Sources & Assumptions</span>
        <svg className={`w-4 h-4 text-[var(--roi-text-muted)] transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-[var(--roi-border)] space-y-3 text-xs text-[var(--roi-text-muted)]">
          <div>
            <div className="font-medium text-[var(--roi-text-secondary)] mb-1">Base Wage Default</div>
            <p>$22.48/hr &mdash; U.S. Bureau of Labor Statistics, Food Manufacturing (NAICS 311) average hourly earnings. Source: <a href="https://www.bls.gov/iag/tgs/iag311.htm" target="_blank" rel="noopener noreferrer" className="text-[var(--roi-accent)] hover:underline">BLS Food Manufacturing Industry</a></p>
          </div>
          <div>
            <div className="font-medium text-[var(--roi-text-secondary)] mb-1">Burden Multiplier Default</div>
            <p>1.35&times; &mdash; Standard industry assumption accounting for employer costs beyond wages including payroll taxes, health insurance, retirement contributions, and other benefits. Typical range is 1.25&ndash;1.40&times;.</p>
          </div>
          <div>
            <div className="font-medium text-[var(--roi-text-secondary)] mb-1">Discount Rate Default</div>
            <p>12% &mdash; Common hurdle rate for industrial capital investments. Reflects weighted average cost of capital (WACC) plus risk premium.</p>
          </div>
          <div className="pt-2 border-t border-[var(--roi-border)] text-[10px] italic">
            Default values are provided as starting points and should be adjusted to reflect your organization&apos;s specific circumstances. All calculations are for estimation purposes only and do not constitute financial advice.
          </div>
        </div>
      )}
    </div>
  );
}
