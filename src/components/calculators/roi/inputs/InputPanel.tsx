"use client";
import type { RoiInputs, ModifiedFields } from '../types';
import { CapexSection } from './CapexSection';
import { OperatingSection } from './OperatingSection';
import { LaborSection } from './LaborSection';
import { CapacitySection } from './CapacitySection';
import { TimingSection } from './TimingSection';

interface InputPanelProps {
  inputs: RoiInputs;
  onInputChange: <K extends keyof RoiInputs>(key: K, value: RoiInputs[K]) => void;
  modifiedFields: ModifiedFields;
}

export function InputPanel({ inputs, onInputChange, modifiedFields }: InputPanelProps) {
  return (
    <div className="space-y-4">
      <CapexSection inputs={inputs} onInputChange={onInputChange} modifiedFields={modifiedFields} />
      <OperatingSection inputs={inputs} onInputChange={onInputChange} modifiedFields={modifiedFields} />
      <LaborSection inputs={inputs} onInputChange={onInputChange} modifiedFields={modifiedFields} />
      <CapacitySection inputs={inputs} onInputChange={onInputChange} modifiedFields={modifiedFields} />
      <TimingSection inputs={inputs} onInputChange={onInputChange} modifiedFields={modifiedFields} />
    </div>
  );
}
