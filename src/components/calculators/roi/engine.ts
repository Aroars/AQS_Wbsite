// ROI Calculation Engine
// Main orchestrator that mirrors the complete Excel model

import type { RoiInputs, RoiOutputs, ChartDataPoint } from './types';
import { calculateLaborSavings } from './laborSavings';
import { calculateCapacityBenefit } from './capacityBenefit';
import { generateMonthlyCashflows } from './cashflow';

export function calculateRoi(inputs: RoiInputs): RoiOutputs {
  const laborSavingsResult = calculateLaborSavings(inputs);
  const capacityBenefitResult = calculateCapacityBenefit(inputs);
  const cashflows = generateMonthlyCashflows(inputs, laborSavingsResult, capacityBenefitResult);

  let breakEvenProjectMonth: number | null = null;
  for (const cf of cashflows) {
    if (cf.cumulativeNet >= 0) {
      breakEvenProjectMonth = cf.month;
      break;
    }
  }

  const breakEvenAfterCommissioning =
    breakEvenProjectMonth !== null
      ? breakEvenProjectMonth - inputs.commissioningMonth
      : null;

  let paybackWithin24Months: 'Yes' | 'No' | 'N/A';
  if (breakEvenAfterCommissioning === null) {
    paybackWithin24Months = 'N/A';
  } else if (breakEvenAfterCommissioning <= 24) {
    paybackWithin24Months = 'Yes';
  } else {
    paybackWithin24Months = 'No';
  }

  const monthlyLaborSavings = laborSavingsResult.monthlySavings;
  const monthlyCapacityBenefit = capacityBenefitResult.monthlyBenefit;
  const monthlyOperatingMargin = monthlyLaborSavings + monthlyCapacityBenefit;
  const totalInstalledCost = inputs.equipmentCost + inputs.installationCost;
  const operatingHoursPerYear = capacityBenefitResult.operatingHoursPerYear;
  const npvAt60Months = cashflows[60]?.cumulativeDiscountedCashFlow ?? 0;

  const chartData: ChartDataPoint[] = cashflows.map((cf) => ({
    month: cf.month,
    cumulativeCosts: cf.cumulativeCosts,
    cumulativeBenefits: cf.cumulativeBenefits,
    cumulativeNet: cf.cumulativeNet,
  }));

  return {
    breakEvenProjectMonth,
    breakEvenAfterCommissioning,
    paybackWithin24Months,
    monthlyLaborSavings,
    monthlyCapacityBenefit,
    monthlyOperatingMargin,
    totalInstalledCost,
    operatingHoursPerYear,
    npvAt60Months,
    chartData,
    cashflows,
  };
}

export { calculateLaborSavings } from './laborSavings';
export { calculateCapacityBenefit } from './capacityBenefit';
export { generateMonthlyCashflows } from './cashflow';
