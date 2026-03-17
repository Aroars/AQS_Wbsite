// Labor Savings Calculation
// Mirrors: Labor_Savings sheet in ROI_Model_R1.xlsx
// Extended to support overtime hours with configurable multiplier

import type { RoiInputs, LaborSavingsResult } from './types';

export function calculateLaborSavings(inputs: RoiInputs): LaborSavingsResult {
  // Regular hours per worker per year
  // Hours per week = shifts × hours per shift / workers (assuming workers rotate shifts)
  // For simplicity, we calculate total labor hours saved across all shifts
  const regularHoursPerWorkerPerYear =
    inputs.shiftsPerDay * inputs.hoursPerShift * inputs.operatingDaysPerYear;

  // Annual Regular Hours Saved = Units Reduced × Regular Hours
  const annualRegularHoursSaved = inputs.laborUnitsReduced * regularHoursPerWorkerPerYear;

  // Overtime hours per worker per year (if applicable)
  // Convert weekly OT hours to annual: weeks = operatingDaysPerYear / (operatingDaysPerYear / 52)
  // Simplified: OT hours per week × 52 weeks (standard year)
  const annualOvertimeHoursPerWorker = inputs.overtimeHoursPerWeek * 52;
  const annualOvertimeHoursSaved = inputs.laborUnitsReduced * annualOvertimeHoursPerWorker;

  // Total hours saved (for reporting)
  const annualHoursSaved = annualRegularHoursSaved + annualOvertimeHoursSaved;

  // Burdened Rate = Base Wage × Burden Multiplier
  const burdenedRate = inputs.baseWage * inputs.burdenMultiplier;

  // Overtime burdened rate = Burdened Rate × Overtime Multiplier
  const overtimeBurdenedRate = burdenedRate * inputs.overtimeMultiplier;

  // Annual Labor Savings = Regular Hours × Regular Rate + Overtime Hours × OT Rate
  const annualRegularSavings = annualRegularHoursSaved * burdenedRate;
  const annualOvertimeSavings = annualOvertimeHoursSaved * overtimeBurdenedRate;
  const annualSavings = annualRegularSavings + annualOvertimeSavings;

  // Monthly Labor Savings = Annual / 12
  const monthlySavings = annualSavings / 12;

  return {
    annualHoursSaved,
    annualSavings,
    monthlySavings,
  };
}
