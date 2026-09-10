import { useMemo, useState } from 'react'
import { PinButton } from '@/toolbox/components/ui/PinButton'
import { useAppStore } from '@/toolbox/stores/appStore'
import { useToolState } from '@/toolbox/hooks/useToolState'
import { giveaway, fromLb, toLb, WEIGHT_UNITS, type WeightUnit } from '@/toolbox/lib/calculators/giveaway'
import { fmtNum } from '@/toolbox/lib/calculators/lineThroughput'
import { BigResult, Tile, Field, panelCls, inputCls, selectCls } from '@/toolbox/components/ui/Results'

export interface GiveawayState {
    target: string; actual: string; unit: WeightUnit; ppm: string; hours: string; days: string
    cost: string; costUnit: 'lb' | 'kg'; improved: string; systemCost: string
}
export const giveawayInitial: GiveawayState = { target: '', actual: '', unit: 'g', ppm: '', hours: '16', days: '250', cost: '', costUnit: 'lb', improved: '', systemCost: '' }
const num = (v: string): number | null => { const n = parseFloat(v); return Number.isFinite(n) ? n : null }
const money = (v: number) => v.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

/**
 * Product giveaway core: what overfill costs, and what a checkweigher holding a
 * tighter target saves. Stateless so the VeriPak page can embed it; the
 * toolbox wrapper below adds persistence and a pin.
 */
export function GiveawayCalculatorCore({ s, setS, compact = false }: { s: GiveawayState; setS: (next: GiveawayState) => void; compact?: boolean }) {
    const upd = (patch: Partial<GiveawayState>) => setS({ ...s, ...patch })
    const costPerLb = useMemo(() => { const c = num(s.cost); if (c === null) return null; return s.costUnit === 'kg' ? c / 2.20462262 : c }, [s.cost, s.costUnit])
    const r = useMemo(() => giveaway({
        targetWeight: num(s.target) ?? 0, actualWeight: num(s.actual) ?? -1, unit: s.unit,
        packagesPerMinute: num(s.ppm) ?? 0, hoursPerDay: num(s.hours) ?? 0, daysPerYear: num(s.days) ?? 0,
        costPerLb, improvedOverfill: num(s.improved), systemCost: num(s.systemCost),
    }), [s, costPerLb])
    const showUnit = s.unit === 'g' || s.unit === 'kg' ? 'kg' : 'lb'
    const show = (lb: number) => `${fmtNum(fromLb(lb, showUnit))} ${showUnit}`

    return (
        <div className="space-y-4">
            <div className={`grid gap-2 ${compact ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-2 @md:grid-cols-3'}`}>
                <Field label="Declared / target weight"><input type="number" min="0" step="any" value={s.target} placeholder="on the label" className={inputCls} onChange={(e) => upd({ target: e.target.value })} /></Field>
                <Field label="Average actual fill"><input type="number" min="0" step="any" value={s.actual} placeholder="from the checkweigher" className={inputCls} onChange={(e) => upd({ actual: e.target.value })} /></Field>
                <Field label="Weight unit"><select value={s.unit} className={selectCls} onChange={(e) => {
                    // Convert the typed weights so the quantities are unchanged
                    const next = e.target.value as WeightUnit
                    const conv = (v: string) => { const n = num(v); return n === null ? v : String(Number(fromLb(toLb(n, s.unit), next).toPrecision(6))) }
                    upd({ unit: next, target: conv(s.target), actual: conv(s.actual), improved: conv(s.improved) })
                }}>{WEIGHT_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}</select></Field>
                <Field label="Packages per minute"><input type="number" min="0" step="any" value={s.ppm} className={inputCls} onChange={(e) => upd({ ppm: e.target.value })} /></Field>
                <Field label="Production hours per day"><input type="number" min="0" max="24" step="any" value={s.hours} className={inputCls} onChange={(e) => upd({ hours: e.target.value })} /></Field>
                <Field label="Production days per year"><input type="number" min="0" max="366" step="any" value={s.days} className={inputCls} onChange={(e) => upd({ days: e.target.value })} /></Field>
                <Field label="Product cost" unit="optional">
                    <div className="flex gap-1">
                        <input type="number" min="0" step="any" value={s.cost} placeholder="ingredient cost" className={inputCls} onChange={(e) => upd({ cost: e.target.value })} />
                        <select value={s.costUnit} className="px-1.5 py-2 bg-dark-900 border border-border rounded-lg text-text-secondary text-xs focus:outline-none shrink-0" onChange={(e) => upd({ costUnit: e.target.value as 'lb' | 'kg' })}><option value="lb">$/lb</option><option value="kg">$/kg</option></select>
                    </div>
                </Field>
                <Field label={`Overfill with feedback control (${s.unit})`} unit="optional" hint="what a checkweigher-to-filler loop holds; 1–2 g is typical"><input type="number" min="0" step="any" value={s.improved} className={inputCls} onChange={(e) => upd({ improved: e.target.value })} /></Field>
                <Field label="Installed system cost" unit="$, optional"><input type="number" min="0" step="any" value={s.systemCost} className={inputCls} onChange={(e) => upd({ systemCost: e.target.value })} /></Field>
            </div>
            <div className={panelCls}>
                <div className="grid grid-cols-2 gap-3">
                    <BigResult label="Giveaway per year" value={r ? show(r.perYearLb) : null} hint="Enter the target and actual weights, the rate, and the hours and days the line runs." />
                    <BigResult label="Cost per year" value={r && r.perYearCost !== null ? money(r.perYearCost) : (r ? '—' : null)} hint="Add a product cost for dollars." />
                </div>
                {r && (
                    <div className="grid grid-cols-2 @md:grid-cols-3 gap-2 text-xs">
                        <Tile label="Per package">{fmtNum(r.overfillPerPkg)} {s.unit} · {fmtNum(r.overfillPct, 3)}%</Tile>
                        <Tile label="Per hour · per day">{show(r.perHourLb)} · {show(r.perDayLb)}</Tile>
                        <Tile label="Packages per year">{r.packagesPerYear.toLocaleString('en-US')}</Tile>
                        {r.improved && (
                            <>
                                <Tile label={`At ${fmtNum(r.improved.overfillPerPkg)} ${s.unit} overfill`}>{show(r.improved.perYearLb)}{r.improved.perYearCost !== null ? ` · ${money(r.improved.perYearCost)}` : ''}</Tile>
                                <Tile label="Saved per year">{show(r.improved.savingsLb)}{r.improved.savingsCost !== null ? ` · ${money(r.improved.savingsCost)}` : ''}</Tile>
                                {r.improved.paybackMonths !== null && <Tile label="Payback">{fmtNum(r.improved.paybackMonths, 3)} months</Tile>}
                            </>
                        )}
                    </div>
                )}
                {r && r.overfillPerPkg < 0 && <div className="px-2.5 py-2 bg-warning/10 border-l-2 border-warning rounded text-xs text-warning">The average fill is below the declared weight — that is underfill, a compliance problem rather than giveaway.</div>}
                <div className="text-[10px] text-text-muted">giveaway = (actual − target) × packages/min × 60 × hours/day × days/year; cost = giveaway × product cost. Savings compare against the overfill a feedback loop holds.</div>
            </div>
        </div>
    )
}

/** Toolbox card: persisted state and a pin around the core */
export function GiveawayCalculator() {
    const pinned = useAppStore((s) => s.pinnedCalculators.includes('giveaway'))
    const togglePin = useAppStore((s) => s.togglePinCalculator)
    const [s, setS] = useToolState<GiveawayState>('giveaway', giveawayInitial)
    return (
        <div className="bg-dark-800 border border-border rounded-xl">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text-primary">Product Giveaway</h3>
                <PinButton pinned={pinned} onToggle={() => togglePin('giveaway')} />
            </div>
            <div className="p-4"><GiveawayCalculatorCore s={s} setS={setS} /></div>
        </div>
    )
}

/** Standalone (no store) — for embedding on a product page */
export function GiveawayCalculatorStandalone() {
    const [s, setS] = useState<GiveawayState>(giveawayInitial)
    return <GiveawayCalculatorCore s={s} setS={setS} compact />
}
