"use client";
import type { RoiInputs, PaymentSchedule, OptionalMilestone, FinalPaymentTerms, ModifiedFields } from '../types';
import { generateMilestoneId, DEFAULT_INPUTS } from '../types';
import { NumberInput } from './NumberInput';
import { formatPercent } from '../format';

interface CapexSectionProps {
  inputs: RoiInputs;
  onInputChange: <K extends keyof RoiInputs>(key: K, value: RoiInputs[K]) => void;
  modifiedFields: ModifiedFields;
}

export function CapexSection({ inputs, onInputChange, modifiedFields }: CapexSectionProps) {
  const { paymentSchedule } = inputs;
  const updateSchedule = (updates: Partial<PaymentSchedule>) => {
    onInputChange('paymentSchedule', { ...paymentSchedule, ...updates });
  };
  const handleOptionalMilestoneChange = (id: string, field: 'name' | 'percentage' | 'month', value: string | number) => {
    const newMilestones = paymentSchedule.optionalMilestones.map((m) => m.id === id ? { ...m, [field]: value } : m);
    updateSchedule({ optionalMilestones: newMilestones });
  };
  const addOptionalMilestone = () => {
    if (paymentSchedule.optionalMilestones.length >= 4) return;
    const newMilestone: OptionalMilestone = { id: generateMilestoneId(), name: 'New Milestone', percentage: 0.10, month: 3 };
    updateSchedule({ optionalMilestones: [...paymentSchedule.optionalMilestones, newMilestone] });
  };
  const removeOptionalMilestone = (id: string) => {
    updateSchedule({ optionalMilestones: paymentSchedule.optionalMilestones.filter((m) => m.id !== id) });
  };
  const finalPaymentMonth = inputs.commissioningMonth + (paymentSchedule.finalPaymentTerms / 30);
  const totalPercent = paymentSchedule.downpaymentPercent + paymentSchedule.optionalMilestones.reduce((sum, m) => sum + m.percentage, 0) + paymentSchedule.preShipmentPercent + paymentSchedule.finalPaymentPercent;
  const isValid = Math.abs(totalPercent - 1) < 0.001;

  return (
    <div className="roi-card p-4 space-y-4">
      <h3 className="roi-section-header">CAPEX & Payment Schedule</h3>
      <div className="grid grid-cols-2 gap-3">
        <NumberInput label="Equipment Cost" value={inputs.equipmentCost} onChange={(v) => onInputChange('equipmentCost', v)} type="currency" isDefault={!modifiedFields.has('equipmentCost') && inputs.equipmentCost === DEFAULT_INPUTS.equipmentCost} />
        <NumberInput label="Installation Cost" value={inputs.installationCost} onChange={(v) => onInputChange('installationCost', v)} type="currency" isDefault={!modifiedFields.has('installationCost') && inputs.installationCost === DEFAULT_INPUTS.installationCost} />
      </div>
      <div className="pt-2 space-y-3">
        <div className="text-sm text-[var(--roi-text-secondary)] font-medium">Payment Schedule</div>
        <div className="p-3 rounded-md bg-[var(--roi-bg-tertiary)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-[var(--roi-text-primary)]">Downpayment at Order</span>
              <span className="text-xs text-[var(--roi-text-muted)]">(Month 0)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-20">
                <NumberInput label="" value={paymentSchedule.downpaymentPercent} onChange={(v) => updateSchedule({ downpaymentPercent: v })} type="percent" min={0} max={1} className="[&>div:first-child]:hidden" />
              </div>
              <span className="text-sm text-[var(--roi-text-muted)]">%</span>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--roi-text-muted)] uppercase tracking-wide">Progress Milestones (Optional)</span>
            {paymentSchedule.optionalMilestones.length < 4 && (
              <button onClick={addOptionalMilestone} className="text-xs text-[var(--roi-accent)] hover:underline flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                Add Milestone
              </button>
            )}
          </div>
          {paymentSchedule.optionalMilestones.length === 0 ? (
            <div className="text-xs text-[var(--roi-text-muted)] italic py-2">No progress milestones. Click &quot;Add Milestone&quot; to add one.</div>
          ) : (
            paymentSchedule.optionalMilestones.map((milestone) => (
              <OptionalMilestoneRow key={milestone.id} milestone={milestone}
                onNameChange={(v) => handleOptionalMilestoneChange(milestone.id, 'name', v)}
                onPercentageChange={(v) => handleOptionalMilestoneChange(milestone.id, 'percentage', v)}
                onMonthChange={(v) => handleOptionalMilestoneChange(milestone.id, 'month', v)}
                onRemove={() => removeOptionalMilestone(milestone.id)} />
            ))
          )}
        </div>
        <div className="p-3 rounded-md bg-[var(--roi-bg-tertiary)]">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-[var(--roi-text-primary)] flex-shrink-0">Pre-Shipment</span>
            <div className="flex items-center gap-1">
              <div className="w-20"><NumberInput label="" value={paymentSchedule.preShipmentPercent} onChange={(v) => updateSchedule({ preShipmentPercent: v })} type="percent" min={0} max={1} className="[&>div:first-child]:hidden" /></div>
              <span className="text-sm text-[var(--roi-text-muted)]">%</span>
            </div>
            <span className="text-xs text-[var(--roi-text-muted)]">Mo:</span>
            <div className="w-20"><NumberInput label="" value={paymentSchedule.preShipmentMonth} onChange={(v) => updateSchedule({ preShipmentMonth: v })} decimals={1} min={0} max={60} className="[&>div:first-child]:hidden" /></div>
          </div>
        </div>
        <div className="p-3 rounded-md bg-[var(--roi-bg-tertiary)]">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-[var(--roi-text-primary)] flex-shrink-0">Final Payment</span>
            <div className="flex items-center gap-1">
              <div className="w-20"><NumberInput label="" value={paymentSchedule.finalPaymentPercent} onChange={(v) => updateSchedule({ finalPaymentPercent: v })} type="percent" min={0} max={1} className="[&>div:first-child]:hidden" /></div>
              <span className="text-sm text-[var(--roi-text-muted)]">%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--roi-text-muted)]">Net</span>
              <select value={paymentSchedule.finalPaymentTerms} onChange={(e) => updateSchedule({ finalPaymentTerms: Number(e.target.value) as FinalPaymentTerms })} className="h-8 px-2 text-sm rounded-md bg-[var(--roi-bg-primary)] border border-[var(--roi-border)] text-[var(--roi-text-primary)]">
                <option value={30}>30 days</option>
                <option value={60}>60 days</option>
              </select>
              <span className="text-xs text-[var(--roi-text-muted)]">(Mo. {finalPaymentMonth.toFixed(1)})</span>
            </div>
          </div>
        </div>
        <div className={`flex items-center gap-2 text-sm ${isValid ? 'text-[var(--roi-benefit)]' : 'text-[var(--roi-warning)]'}`}>
          <span>Total: {formatPercent(totalPercent)}</span>
          {isValid ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          ) : (
            <span className="text-xs">(should equal 100%)</span>
          )}
        </div>
      </div>
    </div>
  );
}

function OptionalMilestoneRow({ milestone, onNameChange, onPercentageChange, onMonthChange, onRemove }: { milestone: OptionalMilestone; onNameChange: (v: string) => void; onPercentageChange: (v: number) => void; onMonthChange: (v: number) => void; onRemove: () => void; }) {
  return (
    <div className="flex items-center gap-2 p-2 rounded-md border border-[var(--roi-border)] bg-[var(--roi-bg-secondary)]">
      <input type="text" value={milestone.name} onChange={(e) => onNameChange(e.target.value)} className="roi-input flex-1 h-8 px-2 text-sm rounded-md min-w-0" placeholder="Milestone name" />
      <div className="flex items-center gap-1">
        <div className="w-16"><NumberInput label="" value={milestone.percentage} onChange={onPercentageChange} type="percent" min={0} max={1} className="[&>div:first-child]:hidden" /></div>
        <span className="text-sm text-[var(--roi-text-muted)]">%</span>
      </div>
      <span className="text-xs text-[var(--roi-text-muted)]">Mo:</span>
      <div className="w-16"><NumberInput label="" value={milestone.month} onChange={onMonthChange} decimals={1} min={0} max={60} className="[&>div:first-child]:hidden" /></div>
      <button onClick={onRemove} className="p-1 text-[var(--roi-text-muted)] hover:text-[var(--roi-cost)] transition-colors" title="Remove milestone">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    </div>
  );
}
