"use client";
import type { RoiInputs, ModifiedFields } from '../types';
import { DEFAULT_INPUTS } from '../types';
import { NumberInput } from './NumberInput';
import { formatCurrency } from '../format';
import { calculateLaborSavings } from '../engine';

interface LaborSectionProps {
  inputs: RoiInputs;
  onInputChange: <K extends keyof RoiInputs>(key: K, value: RoiInputs[K]) => void;
  modifiedFields: ModifiedFields;
}

export function LaborSection({ inputs, onInputChange, modifiedFields }: LaborSectionProps) {
  const laborSavings = calculateLaborSavings(inputs);
  const burdenedRate = inputs.baseWage * inputs.burdenMultiplier;
  const overtimeBurdenedRate = burdenedRate * inputs.overtimeMultiplier;

  return (
    <div className="roi-card p-4 space-y-4">
      <h3 className="roi-section-header">Labor Savings</h3>
      <div className="space-y-3">
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-3">
            <NumberInput label="Base Wage ($/hr)" value={inputs.baseWage} onChange={(v) => onInputChange('baseWage', v)} type="currency" decimals={2} min={0} isDefault={!modifiedFields.has('baseWage') && inputs.baseWage === DEFAULT_INPUTS.baseWage}
              tooltip={<><strong className="text-[var(--roi-text-primary)]">Default: $22.48/hr</strong><p className="mt-1">Source: U.S. Bureau of Labor Statistics, Food Manufacturing (NAICS 311) average hourly earnings.</p><a href="https://www.bls.gov/iag/tgs/iag311.htm" target="_blank" rel="noopener noreferrer" className="text-[var(--roi-accent)] hover:underline mt-1 inline-block">View BLS Data &rarr;</a></>} />
            <NumberInput label="Burden Multiplier" value={inputs.burdenMultiplier} onChange={(v) => onInputChange('burdenMultiplier', v)} decimals={2} min={1} max={3} isDefault={!modifiedFields.has('burdenMultiplier') && inputs.burdenMultiplier === DEFAULT_INPUTS.burdenMultiplier}
              tooltip={<><strong className="text-[var(--roi-text-primary)]">Default: 1.35&times;</strong><p className="mt-1">Accounts for employer costs beyond wages: payroll taxes, health insurance, retirement contributions, and other benefits.</p><p className="mt-1 text-[var(--roi-text-muted)]">Typical range: 1.25&times; &ndash; 1.40&times;</p></>} />
          </div>
          <div className="text-xs text-[var(--roi-text-muted)] flex items-center justify-between px-1">
            <span>Burdened Rate:</span>
            <span className="font-medium text-[var(--roi-text-secondary)]">{formatCurrency(burdenedRate, 2)}/hr</span>
          </div>
        </div>
        <NumberInput label="Labor Units Reduced per Shift" value={inputs.laborUnitsReduced} onChange={(v) => onInputChange('laborUnitsReduced', v)} decimals={1} min={0} isDefault={!modifiedFields.has('laborUnitsReduced') && inputs.laborUnitsReduced === DEFAULT_INPUTS.laborUnitsReduced}
          tooltip={<><strong className="text-[var(--roi-text-primary)]">Default: 2 units</strong><p className="mt-1">Number of full-time equivalent (FTE) labor positions eliminated per shift due to automation.</p></>} />
        <div className="space-y-2 pt-2 border-t border-[var(--roi-border)]">
          <div className="text-xs text-[var(--roi-text-muted)] uppercase tracking-wide">Overtime</div>
          <div className="grid grid-cols-2 gap-3">
            <NumberInput label="OT Hours/Week" value={inputs.overtimeHoursPerWeek} onChange={(v) => onInputChange('overtimeHoursPerWeek', v)} decimals={1} min={0} max={40} isDefault={!modifiedFields.has('overtimeHoursPerWeek') && inputs.overtimeHoursPerWeek === DEFAULT_INPUTS.overtimeHoursPerWeek}
              tooltip={<><strong className="text-[var(--roi-text-primary)]">Default: 0 hours</strong><p className="mt-1">Weekly overtime hours per worker being replaced.</p></>} />
            <NumberInput label="OT Multiplier" value={inputs.overtimeMultiplier} onChange={(v) => onInputChange('overtimeMultiplier', v)} decimals={2} min={1} max={3} isDefault={!modifiedFields.has('overtimeMultiplier') && inputs.overtimeMultiplier === DEFAULT_INPUTS.overtimeMultiplier}
              tooltip={<><strong className="text-[var(--roi-text-primary)]">Default: 1.5&times;</strong><p className="mt-1">Overtime pay multiplier applied to the burdened rate.</p></>} />
          </div>
          {inputs.overtimeHoursPerWeek > 0 && (
            <div className="text-xs text-[var(--roi-text-muted)] flex items-center justify-between px-1">
              <span>OT Burdened Rate:</span>
              <span className="font-medium text-[var(--roi-text-secondary)]">{formatCurrency(overtimeBurdenedRate, 2)}/hr</span>
            </div>
          )}
        </div>
      </div>
      <div className="text-sm text-[var(--roi-text-muted)] italic">&rarr; {formatCurrency(laborSavings.monthlySavings)}/month saved</div>
    </div>
  );
}
