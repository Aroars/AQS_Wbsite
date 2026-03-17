"use client";
import type { RoiInputs, ModifiedFields } from '../types';
import { DEFAULT_INPUTS } from '../types';
import { NumberInput } from './NumberInput';

interface TimingSectionProps {
  inputs: RoiInputs;
  onInputChange: <K extends keyof RoiInputs>(key: K, value: RoiInputs[K]) => void;
  modifiedFields: ModifiedFields;
}

export function TimingSection({ inputs, onInputChange, modifiedFields }: TimingSectionProps) {
  return (
    <div className="roi-card p-4 space-y-4">
      <h3 className="roi-section-header">Timing & One-Time Impacts</h3>
      <div className="space-y-3">
        <NumberInput label="Commissioning Month" value={inputs.commissioningMonth} onChange={(v) => onInputChange('commissioningMonth', v)} min={0} max={60} isDefault={!modifiedFields.has('commissioningMonth') && inputs.commissioningMonth === DEFAULT_INPUTS.commissioningMonth} />
        <NumberInput label="Lost Production Cost ($)" value={inputs.lostProductionCost} onChange={(v) => onInputChange('lostProductionCost', v)} type="currency" min={0} isDefault={!modifiedFields.has('lostProductionCost') && inputs.lostProductionCost === DEFAULT_INPUTS.lostProductionCost} />
        <NumberInput label="Lost Production Month" value={inputs.lostProductionMonth} onChange={(v) => onInputChange('lostProductionMonth', v)} min={0} max={60} isDefault={!modifiedFields.has('lostProductionMonth') && inputs.lostProductionMonth === DEFAULT_INPUTS.lostProductionMonth} />
      </div>
    </div>
  );
}
