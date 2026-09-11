import { useMemo } from 'react'
import { CalcPinButton } from '@/toolbox/components/ui/CalcPinButton'
import { useAppStore } from '@/toolbox/stores/appStore'
import { useInstanceState, MAIN } from '@/toolbox/hooks/useToolState'
import { downtimeCost } from '@/toolbox/lib/calculators/downtime'
import { fmtNum } from '@/toolbox/lib/calculators/lineThroughput'
import { BigResult, Tile, Field, panelCls, inputCls } from '@/toolbox/components/ui/Results'

interface S { units: string; margin: string; crew: string; rate: string; overhead: string; minutes: string; shifts: string; days: string; reduction: string }
const initial: S = { units: '', margin: '', crew: '', rate: '', overhead: '', minutes: '', shifts: '2', days: '250', reduction: '25' }
const num = (v: string): number | null => { const n = parseFloat(v); return Number.isFinite(n) ? n : null }
const money = (v: number, digits = 0) => v.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: digits })

/** What a stopped packaging line costs per minute, shift and year, and what a reduction is worth */
export function DowntimeCalculator({ instanceId = MAIN }: { instanceId?: string } = {}) {
    const [s, setS] = useInstanceState<S>('downtime', instanceId, initial)
    const upd = (patch: Partial<S>) => setS((prev) => ({ ...prev, ...patch }))
    const r = useMemo(() => downtimeCost({
        unitsPerMinute: num(s.units) ?? 0, marginPerUnit: num(s.margin) ?? 0, crewSize: num(s.crew) ?? 0, laborRatePerHour: num(s.rate) ?? 0,
        overheadPerHour: num(s.overhead), downtimeMinutesPerShift: num(s.minutes) ?? 0, shiftsPerDay: num(s.shifts) ?? 0, daysPerYear: num(s.days) ?? 0,
        reductionPct: num(s.reduction) ?? 25,
    }), [s])
    const ready = r !== null && (num(s.units) ?? 0) + (num(s.crew) ?? 0) > 0

    return (
        <div className="bg-dark-800 border border-border rounded-xl">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text-primary">Line Downtime Cost</h3>
                <CalcPinButton toolId="downtime" instanceId={instanceId} />
            </div>
            <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 @md:grid-cols-3 gap-2">
                    <Field label="Line output" unit="units/min"><input type="number" min="0" step="any" value={s.units} className={inputCls} onChange={(e) => upd({ units: e.target.value })} /></Field>
                    <Field label="Margin per unit" unit="$" hint="contribution margin, not price"><input type="number" min="0" step="any" value={s.margin} className={inputCls} onChange={(e) => upd({ margin: e.target.value })} /></Field>
                    <Field label="Crew on the line"><input type="number" min="0" step="1" value={s.crew} className={inputCls} onChange={(e) => upd({ crew: e.target.value })} /></Field>
                    <Field label="Loaded labor rate" unit="$/h"><input type="number" min="0" step="any" value={s.rate} className={inputCls} onChange={(e) => upd({ rate: e.target.value })} /></Field>
                    <Field label="Line overhead" unit="$/h, optional"><input type="number" min="0" step="any" value={s.overhead} className={inputCls} onChange={(e) => upd({ overhead: e.target.value })} /></Field>
                    <Field label="Downtime per shift" unit="min"><input type="number" min="0" step="any" value={s.minutes} className={inputCls} onChange={(e) => upd({ minutes: e.target.value })} /></Field>
                    <Field label="Shifts per day"><input type="number" min="0" step="any" value={s.shifts} className={inputCls} onChange={(e) => upd({ shifts: e.target.value })} /></Field>
                    <Field label="Days per year"><input type="number" min="0" step="any" value={s.days} className={inputCls} onChange={(e) => upd({ days: e.target.value })} /></Field>
                    <Field label="Reduction to value" unit="%"><input type="number" min="0" max="100" step="any" value={s.reduction} className={inputCls} onChange={(e) => upd({ reduction: e.target.value })} /></Field>
                </div>
                <div className={panelCls}>
                    <div className="grid grid-cols-2 gap-3">
                        <BigResult label="Cost per minute down" value={ready ? money(r!.costPerMinute, 2) : null} hint="Enter the line output and margin, or the crew and rate." />
                        <BigResult label="Cost per year" value={ready ? money(r!.perYear) : null} hint="Add the downtime minutes per shift." />
                    </div>
                    {ready && (
                        <div className="grid grid-cols-2 @md:grid-cols-3 gap-2 text-xs">
                            <Tile label="Lost margin · labor · overhead">{money(r!.lostMarginPerMin, 2)} · {money(r!.laborPerMin, 2)} · {money(r!.overheadPerMin, 2)} /min</Tile>
                            <Tile label="Per shift · per day">{money(r!.perShift)} · {money(r!.perDay)}</Tile>
                            <Tile label="Hours down per year">{fmtNum(r!.hoursPerYear)} h ({r!.minutesPerYear.toLocaleString('en-US')} min)</Tile>
                            <Tile label={`Cut downtime ${s.reduction}%`}>{money(r!.savingsPerYear)} / year</Tile>
                            {r!.perAvailabilityPoint !== null && <Tile label="One availability point">{money(r!.perAvailabilityPoint)} / year</Tile>}
                        </div>
                    )}
                    <div className="text-[10px] text-text-muted">cost/min = units/min × margin + crew × rate ÷ 60 + overhead ÷ 60; per year = cost/min × minutes/shift × shifts × days. One availability point = 1% of scheduled 8-hour shifts.</div>
                </div>
            </div>
        </div>
    )
}
