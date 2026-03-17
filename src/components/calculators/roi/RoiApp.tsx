"use client";
import { useCallback, useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import type { RoiInputs, ChartDataPoint, ModifiedFields } from './types';
import { DEFAULT_INPUTS } from './types';
import { calculateRoi } from './engine';
import { formatCurrency, formatNumber } from './format';
import { InputPanel } from './inputs/InputPanel';
import { OutputPanel } from './outputs/OutputPanel';
import { RoiChart } from './chart/RoiChart';
import { DataSources } from './DataSources';

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

  // Email gate bypassed — re-enable when HubSpot is configured
  const hasAccess = true;

  // Project info for print header
  const [projectName, setProjectName] = useLocalStorage('roi-project-name', '');
  const [customerName, setCustomerName] = useLocalStorage('roi-customer-name', '');

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
  const [delayMonths, setDelayMonths] = useState(6);

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

  if (!inputs.paymentSchedule) return <div className="flex items-center justify-center h-64"><p className="text-[var(--roi-text-secondary)]">Loading...</p></div>;

  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <>
      {/* Print Header — only visible when printing */}
      <div className="roi-print-header">
        <div className="roi-print-header-row">
          <div className="roi-print-logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logos/aqs-logo-horizontal.png" alt="Automated Quality Solutions" style={{ height: 36 }} />
          </div>
          <div className="roi-print-title">
            <div style={{ fontSize: 18, fontWeight: 700 }}>ROI Projection</div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>{today}</div>
          </div>
        </div>
        {(projectName || customerName) && (
          <div className="roi-print-project-info">
            {projectName && <div><span style={{ color: '#94a3b8', fontSize: 11 }}>Project:</span> {projectName}</div>}
            {customerName && <div><span style={{ color: '#94a3b8', fontSize: 11 }}>Customer:</span> {customerName}</div>}
          </div>
        )}
      </div>

      {/* Project Info + Print Button — only visible on screen */}
      <div className="roi-no-print mb-4">
        <div className="roi-card p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[var(--roi-text-muted)] uppercase tracking-wide">Project Name</label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g. Line 4 Palletizer"
                  className="roi-input h-9 px-3 rounded-md text-sm"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[var(--roi-text-muted)] uppercase tracking-wide">Customer</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Acme Foods"
                  className="roi-input h-9 px-3 rounded-md text-sm"
                />
              </div>
            </div>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white bg-[var(--roi-accent)] hover:opacity-90 transition-opacity shrink-0"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print / Save PDF
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6">
        <div className="lg:max-h-[calc(100vh-200px)] lg:overflow-y-auto lg:pr-2 roi-print-inputs">
          <InputPanel inputs={inputs} onInputChange={handleInputChange} modifiedFields={modifiedFields} />
        </div>
        <div className="space-y-4 roi-print-outputs">
          <OutputPanel outputs={outputs} commissioningMonth={inputs.commissioningMonth} delayMonths={delayMonths} onDelayChange={setDelayMonths} />
          <RoiChart data={shiftedChartData} breakEvenMonth={shiftedBreakEvenMonth} />
          <DataSources />
        </div>
      </div>

      {/* Print Summary Table — only visible when printing, replaces the interactive inputs */}
      <div className="roi-print-summary">
        <div style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', marginBottom: 8 }}>Input Summary</div>
        <table className="roi-print-table">
          <tbody>
            <tr><td>Equipment Cost</td><td>{formatCurrency(inputs.equipmentCost)}</td><td>Shifts / Day</td><td>{inputs.shiftsPerDay}</td></tr>
            <tr><td>Installation Cost</td><td>{formatCurrency(inputs.installationCost)}</td><td>Hours / Shift</td><td>{inputs.hoursPerShift}</td></tr>
            <tr><td>Total Installed Cost</td><td>{formatCurrency(inputs.equipmentCost + inputs.installationCost)}</td><td>Operating Days / Year</td><td>{inputs.operatingDaysPerYear}</td></tr>
            <tr><td>Base Wage</td><td>{formatCurrency(inputs.baseWage, 2)}/hr</td><td>Baseline Units/hr</td><td>{formatNumber(inputs.baselineUnitsPerHour)}</td></tr>
            <tr><td>Burden Multiplier</td><td>{inputs.burdenMultiplier}x</td><td>Proposed Units/hr</td><td>{formatNumber(inputs.proposedUnitsPerHour)}</td></tr>
            <tr><td>Labor Units Reduced</td><td>{inputs.laborUnitsReduced}</td><td>Contribution Margin</td><td>{formatCurrency(inputs.contributionMarginPerUnit, 2)}/unit</td></tr>
            <tr><td>Commissioning Month</td><td>{inputs.commissioningMonth}</td><td>Discount Rate</td><td>{(inputs.annualDiscountRate * 100).toFixed(0)}%</td></tr>
          </tbody>
        </table>
      </div>

      {/* Print Footer — only visible when printing */}
      <div className="roi-print-footer">
        <div>Automated Quality Solutions &mdash; automatedqs.com</div>
        <div>This projection is for estimation purposes only and does not constitute financial advice.</div>
      </div>
    </>
  );
}
