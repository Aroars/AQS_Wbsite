"use client";
import type { RoiInputs, ModifiedFields } from '../types';
import { DEFAULT_INPUTS } from '../types';
import { NumberInput } from './NumberInput';
import { formatNumber } from '../format';

interface OperatingSectionProps {
  inputs: RoiInputs;
  onInputChange: <K extends keyof RoiInputs>(key: K, value: RoiInputs[K]) => void;
  modifiedFields: ModifiedFields;
}

export function OperatingSection({ inputs, onInputChange, modifiedFields }: OperatingSectionProps) {
  const operatingHoursPerYear = inputs.shiftsPerDay * inputs.hoursPerShift * inputs.operatingDaysPerYear;

  return (
    <div className="roi-card p-4 space-y-4">
      <h3 className="roi-section-header">Operating Profile</h3>
      <div className="space-y-3">
        <NumberInput label="Shifts per Day" value={inputs.shiftsPerDay} onChange={(v) => onInputChange('shiftsPerDay', v)} min={1} max={4} isDefault={!modifiedFields.has('shiftsPerDay') && inputs.shiftsPerDay === DEFAULT_INPUTS.shiftsPerDay} />
        <NumberInput label="Hours per Shift" value={inputs.hoursPerShift} onChange={(v) => onInputChange('hoursPerShift', v)} min={1} max={12} isDefault={!modifiedFields.has('hoursPerShift') && inputs.hoursPerShift === DEFAULT_INPUTS.hoursPerShift} />
        <NumberInput label="Operating Days per Year" value={inputs.operatingDaysPerYear} onChange={(v) => onInputChange('operatingDaysPerYear', v)} min={1} max={365} isDefault={!modifiedFields.has('operatingDaysPerYear') && inputs.operatingDaysPerYear === DEFAULT_INPUTS.operatingDaysPerYear} />
      </div>
      <div className="text-sm text-[var(--roi-text-muted)] italic">&rarr; {formatNumber(operatingHoursPerYear)} hrs/year</div>
    </div>
  );
}
