"use client";
import type { RoiOutputs } from '../types';
import { ResultCard } from './ResultCard';
import { MonthlyMargin } from './MonthlyMargin';
import { OpportunityCostSection } from './OpportunityCostSection';

interface OutputPanelProps {
  outputs: RoiOutputs;
  commissioningMonth: number;
  delayMonths: number;
  onDelayChange: (months: number) => void;
}

export function OutputPanel({ outputs, commissioningMonth, delayMonths, onDelayChange }: OutputPanelProps) {
  const breakEvenDisplay = outputs.breakEvenProjectMonth !== null ? outputs.breakEvenProjectMonth.toString() : '\u2014';
  const afterCommDisplay = outputs.breakEvenAfterCommissioning !== null ? outputs.breakEvenAfterCommissioning.toString() : '\u2014';
  const paybackVariant = outputs.paybackWithin24Months === 'Yes' ? 'success' : outputs.paybackWithin24Months === 'No' ? 'warning' : 'neutral';

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        <ResultCard label="From Initial Investment" value={breakEvenDisplay} sublabel="Break-even Month" size="large" />
        <ResultCard label="From Installation" value={afterCommDisplay} sublabel={`Months after Mo. ${commissioningMonth}`} size="large" />
        <ResultCard label="Payback \u2264 24 Mo?" value={outputs.paybackWithin24Months} variant={paybackVariant} size="large" />
      </div>
      <OpportunityCostSection monthlyOperatingMargin={outputs.monthlyOperatingMargin} delayMonths={delayMonths} onDelayChange={onDelayChange} />
      <MonthlyMargin laborSavings={outputs.monthlyLaborSavings} capacityBenefit={outputs.monthlyCapacityBenefit} totalMargin={outputs.monthlyOperatingMargin} />
    </div>
  );
}
