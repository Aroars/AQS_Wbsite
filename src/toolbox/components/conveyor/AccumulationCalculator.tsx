import { useMemo } from 'react'
import { CalcPinButton } from '@/toolbox/components/ui/CalcPinButton'
import { useInstanceState, MAIN } from '@/toolbox/hooks/useToolState'
import { accumulatedPitchIn, lengthForTime, timeForLength, zonesForLength, fillTimeSeconds } from '@/toolbox/lib/calculators/accumulation'
import { fmtNum } from '@/toolbox/lib/calculators/lineThroughput'
import { BigResult, Tile, Field, panelCls, inputCls } from '@/toolbox/components/ui/Results'
import { useHandoff } from '@/toolbox/hooks/useHandoff'
import { SourceBar } from '@/toolbox/components/ui/SourceBar'

interface S { rate: string; length: string; gap: string; mode: 'length' | 'time'; seconds: string; conveyorFt: string; zoneIn: string; speed: string }
const initial: S = { rate: '', length: '', gap: '0', mode: 'length', seconds: '30', conveyorFt: '', zoneIn: '', speed: '' }
const num = (v: string) => { const n = parseFloat(v); return Number.isFinite(n) ? n : 0 }

/** Accumulation buffer: length for a stoppage time, or time for a length — the simulator's accumulation card on its own */
export function AccumulationCalculator({ instanceId = MAIN }: { instanceId?: string } = {}) {
    const [s, setS] = useInstanceState<S>('accumulation', instanceId, initial)
    const applyPatch = (patch: Partial<S>) => setS((prev) => ({ ...prev, ...patch }))
    const upd = (patch: Partial<S>) => { handoff.touch(Object.keys(patch)); applyPatch(patch) }
    // Pull or link the Conveyor Speed infeed (rate, product length, belt speed)
    const handoff = useHandoff('accumulation', instanceId, (p) => applyPatch({ rate: String(p.rate ?? ''), ...(p.length ? { length: String(p.length) } : {}), ...(p.speed ? { speed: String(p.speed) } : {}) }))

    const pitch = accumulatedPitchIn(num(s.length), num(s.gap))
    const r = useMemo(() => {
        if (s.mode === 'length') {
            const x = lengthForTime(num(s.rate), pitch, num(s.seconds))
            return x ? { lengthIn: x.lengthIn, lengthFt: x.lengthFt, products: x.products, seconds: num(s.seconds) } : null
        }
        const x = timeForLength(num(s.conveyorFt) * 12, pitch, num(s.rate))
        return x ? { lengthIn: num(s.conveyorFt) * 12, lengthFt: num(s.conveyorFt), products: x.products, seconds: x.seconds } : null
    }, [s.mode, s.rate, s.seconds, s.conveyorFt, pitch])
    const zones = r ? zonesForLength(r.lengthIn, num(s.zoneIn)) : null
    const fill = r ? fillTimeSeconds(r.lengthIn, num(s.speed)) : null

    return (
        <div className="bg-dark-800 border border-border rounded-xl">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text-primary">Accumulation Buffer</h3>
                <CalcPinButton toolId="accumulation" instanceId={instanceId} />
            </div>
            <div className="p-4 space-y-4">
                <SourceBar handoff={handoff} />
                <div className="grid grid-cols-3 gap-2">
                    <Field label="Rate" unit="pkg/min"><input type="number" min="0" step="any" value={s.rate} placeholder="incoming" className={inputCls} onChange={(e) => upd({ rate: e.target.value })} /></Field>
                    <Field label="Product length" unit="in"><input type="number" min="0" step="any" value={s.length} className={inputCls} onChange={(e) => upd({ length: e.target.value })} /></Field>
                    <Field label="Gap when accumulated" unit="in" hint="0 for product touching"><input type="number" min="0" step="any" value={s.gap} className={inputCls} onChange={(e) => upd({ gap: e.target.value })} /></Field>
                </div>
                <div className="flex gap-1.5">
                    {([['length', 'Length from time'], ['time', 'Time from length']] as const).map(([id, label]) => (
                        <button key={id} onClick={() => upd({ mode: id })}
                            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${s.mode === id ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-dark-900 text-text-secondary hover:border-text-muted'}`}>{label}</button>
                    ))}
                </div>
                <div className="grid grid-cols-3 gap-2">
                    {s.mode === 'length'
                        ? <Field label="Downstream stoppage to absorb" unit="s"><input type="number" min="0" step="any" value={s.seconds} className={inputCls} onChange={(e) => upd({ seconds: e.target.value })} /></Field>
                        : <Field label="Conveyor length" unit="ft"><input type="number" min="0" step="any" value={s.conveyorFt} className={inputCls} onChange={(e) => upd({ conveyorFt: e.target.value })} /></Field>}
                    <Field label="Zone length" unit="in, optional" hint="MDR zero-pressure zones"><input type="number" min="0" step="any" value={s.zoneIn} placeholder="e.g. 24" className={inputCls} onChange={(e) => upd({ zoneIn: e.target.value })} /></Field>
                    <Field label="Belt speed" unit="ft/min, optional" hint="for the time to fill"><input type="number" min="0" step="any" value={s.speed} className={inputCls} onChange={(e) => upd({ speed: e.target.value })} /></Field>
                </div>
                <div className={panelCls}>
                    {s.mode === 'length'
                        ? <BigResult label="Accumulation length" value={r ? fmtNum(r.lengthFt) : null} unit="ft" hint="Enter the rate, product length, and the seconds of stoppage to absorb." />
                        : <BigResult label="Buffer time" value={r ? fmtNum(r.seconds) : null} unit="s" hint="Enter the rate, product length, and the conveyor length." />}
                    {r && (
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <Tile label="Products in buffer">{r.products} at {fmtNum(pitch)} in pitch</Tile>
                            <Tile label={s.mode === 'length' ? 'Length' : 'Absorbs'}>{s.mode === 'length' ? `${fmtNum(r.lengthIn)} in for ${fmtNum(r.seconds)} s` : `${fmtNum(r.seconds)} s in ${fmtNum(r.lengthFt)} ft`}</Tile>
                            {zones !== null && <Tile label="Zero-pressure zones">{zones} × {s.zoneIn} in</Tile>}
                            {fill !== null && <Tile label="Time to fill from empty">{fmtNum(fill)} s at {s.speed} ft/min</Tile>}
                        </div>
                    )}
                    <div className="text-[10px] text-text-muted">length = ⌈rate × s ÷ 60⌉ products × (product length + gap); time = ⌊length ÷ pitch⌋ ÷ rate × 60. Products round up for length and down for time so the buffer is never short.</div>
                </div>
            </div>
        </div>
    )
}
