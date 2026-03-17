"use client";
import { useCallback, useEffect, useState, useMemo } from 'react';
import type { RoiInputs, ChartDataPoint, ModifiedFields } from './types';
import { DEFAULT_INPUTS } from './types';
import { calculateRoi } from './engine';
import { InputPanel } from './inputs/InputPanel';
import { OutputPanel } from './outputs/OutputPanel';
import { RoiChart } from './chart/RoiChart';
import { DataSources } from './DataSources';
import { EmailGate } from './EmailGate';

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(storedValue)); } catch { /* ignore */ }
  }, [key, storedValue]);
  return [storedValue, setStoredValue];
}

function migrateStoredInputs(stored: unknown): RoiInputs {
  if (!stored || typeof stored !== 'object') return DEFAULT_INPUTS;
  const data = stored as Record<string, unknown>;
  if ('milestones' in data && !('paymentSchedule' in data)) {
    localStorage.removeItem('roi-inputs');
    return DEFAULT_INPUTS;
  }
  if ('paymentSchedule' in data) {
    const schedule = data.paymentSchedule as Record<string, unknown>;
    if (typeof schedule.downpaymentPercent !== 'number' || !Array.isArray(schedule.optionalMilestones) || typeof schedule.preShipmentPercent !== 'number' || typeof schedule.finalPaymentPercent !== 'number') {
      localStorage.removeItem('roi-inputs');
      return DEFAULT_INPUTS;
    }
  }
  if ('burdenedRate' in data && !('baseWage' in data)) {
    const burdenedRate = data.burdenedRate as number;
    const baseWage = burdenedRate / 1.35;
    return { ...DEFAULT_INPUTS, ...data, baseWage: Math.round(baseWage * 100) / 100, burdenMultiplier: 1.35 } as RoiInputs;
  }
  return { ...DEFAULT_INPUTS, ...data } as RoiInputs;
}

export function RoiApp() {
  const [inputs, setInputs] = useLocalStorage<RoiInputs>('roi-inputs', DEFAULT_INPUTS);
  const [modifiedFields, setModifiedFields] = useState<ModifiedFields>(() => {
    try {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('roi-modified-fields') : null;
      if (stored) return new Set(JSON.parse(stored) as (keyof RoiInputs)[]);
    } catch { /* ignore */ }
    return new Set<keyof RoiInputs>();
  });
  useEffect(() => { localStorage.setItem('roi-modified-fields', JSON.stringify([...modifiedFields])); }, [modifiedFields]);

  const [hasAccess, setHasAccess] = useState(() => {
    return typeof window !== 'undefined' && localStorage.getItem('roi-email-submitted') === 'true';
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem('roi-inputs');
      if (stored) {
        const parsed = JSON.parse(stored);
        const migrated = migrateStoredInputs(parsed);
        if (migrated !== parsed) setInputs(migrated);
      }
    } catch {
      localStorage.removeItem('roi-inputs');
      setInputs(DEFAULT_INPUTS);
    }
  }, []);

  const outputs = useMemo(() => calculateRoi(inputs), [inputs]);
  const [delayMonths, setDelayMonths] = useState(0);

  const shiftedChartData = useMemo((): ChartDataPoint[] => {
    if (delayMonths === 0) return outputs.chartData;
    const shifted: ChartDataPoint[] = [];
    for (let i = 0; i < delayMonths; i++) shifted.push({ month: i, cumulativeCosts: 0, cumulativeBenefits: 0, cumulativeNet: 0 });
    for (const point of outputs.chartData) {
      const newMonth = point.month + delayMonths;
      if (newMonth <= 60) shifted.push({ ...point, month: newMonth });
    }
    return shifted;
  }, [outputs.chartData, delayMonths]);

  const shiftedBreakEvenMonth = useMemo(() => {
    if (outputs.breakEvenProjectMonth === null) return null;
    const shifted = outputs.breakEvenProjectMonth + delayMonths;
    return shifted <= 60 ? shifted : null;
  }, [outputs.breakEvenProjectMonth, delayMonths]);

  const handleInputChange = useCallback(<K extends keyof RoiInputs>(key: K, value: RoiInputs[K]) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
    setModifiedFields((prev) => { const next = new Set(prev); next.add(key); return next; });
  }, [setInputs]);

  if (!hasAccess) return <EmailGate onAccessGranted={() => setHasAccess(true)} />;
  if (!inputs.paymentSchedule) return <div className="flex items-center justify-center h-64"><p className="text-[var(--roi-text-secondary)]">Loading...</p></div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6">
      <div className="lg:max-h-[calc(100vh-200px)] lg:overflow-y-auto lg:pr-2">
        <InputPanel inputs={inputs} onInputChange={handleInputChange} modifiedFields={modifiedFields} />
      </div>
      <div className="space-y-4">
        <OutputPanel outputs={outputs} commissioningMonth={inputs.commissioningMonth} delayMonths={delayMonths} onDelayChange={setDelayMonths} />
        <RoiChart data={shiftedChartData} breakEvenMonth={shiftedBreakEvenMonth} />
        <DataSources />
      </div>
    </div>
  );
}
