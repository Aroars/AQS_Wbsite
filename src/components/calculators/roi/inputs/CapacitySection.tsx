"use client";
import type { RoiInputs, ModifiedFields } from '../types';
import { DEFAULT_INPUTS } from '../types';
import { NumberInput } from './NumberInput';
import { formatCurrency } from '../format';
import { calculateCapacityBenefit } from '../engine';

interface CapacitySectionProps {
  inputs: RoiInputs;
  onInputChange: <K extends keyof RoiInputs>(key: K, value: RoiInputs[K]) => void;
  modifiedFields: ModifiedFields;
}

export function CapacitySection({ inputs, onInputChange, modifiedFields }: CapacitySectionProps) {
  const capacityBenefit = calculateCapacityBenefit(inputs);
  const showWarning = inputs.proposedUnitsPerHour < inputs.baselineUnitsPerHour;

  return (
    <div className="roi-card p-4 space-y-4">
      <h3 className="roi-section-header">Capacity Benefit</h3>
      <div className="space-y-3">
        <NumberInput label="Baseline Units/hr (Current)" value={inputs.baselineUnitsPerHour} onChange={(v) => onInputChange('baselineUnitsPerHour', v)} min={0} isDefault={!modifiedFields.has('baselineUnitsPerHour') && inputs.baselineUnitsPerHour === DEFAULT_INPUTS.baselineUnitsPerHour} />
        <NumberInput label="Proposed Units/hr (New)" value={inputs.proposedUnitsPerHour} onChange={(v) => onInputChange('proposedUnitsPerHour', v)} min={0} isDefault={!modifiedFields.has('proposedUnitsPerHour') && inputs.proposedUnitsPerHour === DEFAULT_INPUTS.proposedUnitsPerHour} />
        <NumberInput label="Contribution Margin ($/unit)" value={inputs.contributionMarginPerUnit} onChange={(v) => onInputChange('contributionMarginPerUnit', v)} type="currency" decimals={2} min={0} isDefault={!modifiedFields.has('contributionMarginPerUnit') && inputs.contributionMarginPerUnit === DEFAULT_INPUTS.contributionMarginPerUnit} />
      </div>
      {showWarning && (
        <div className="text-sm text-[var(--roi-warning)] flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          <span>Proposed rate is lower than baseline</span>
        </div>
      )}
      <div className="text-sm text-[var(--roi-text-muted)] italic">&rarr; {formatCurrency(capacityBenefit.monthlyBenefit)}/month benefit</div>
    </div>
  );
}
