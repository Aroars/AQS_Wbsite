import { useState, useMemo, useEffect } from 'react'
import { CalcPinButton } from '@/toolbox/components/ui/CalcPinButton'
import { useInstanceState, MAIN } from '@/toolbox/hooks/useToolState'
import { useAppStore } from '@/toolbox/stores/appStore'
import {
    toLbPerMin, fromLbPerMin, unitNeedsHours, packageFillWeightLb, packagerHeadroom, fmtNum, fmtInput,
    RATE_UNITS, type Field, type RateUnit,
} from '@/toolbox/lib/calculators/lineThroughput'
import type { LoadDefinition, LoadProductType } from '@/toolbox/lib/calculators/loadDefinition'
import { emptyState, num, defaultHours, modeFields, restore, buildEntries, runSolve, dropEntered, type CardState } from '@/toolbox/lib/calculators/lineThroughputState'

/*
 * Belt Load (lb/ft) — line throughput → belt load
 *
 * An auto-solving intake form. Pick Packages or Bulk, then enter whatever the
 * plant said; every field the network can derive fills in (cyan, "auto"),
 * fields that would unlock a result are flagged (amber), and a solved value
 * that changes flashes. Entry order is tracked so that overwriting a solved
 * field releases the oldest entry it depends on instead of clearing anything.
 * Belt load itself is a field: type it when you know it, or read it solved.
 * The solver is lib/calculators/lineThroughput.
 */

const inputCls = 'w-full px-2 py-2 bg-dark-900 border border-border rounded-lg text-text-primary font-mono text-sm focus:outline-none focus:border-primary'
const labelCls = 'block text-xs text-text-muted mb-1'
const unitSelectCls = 'px-1.5 py-2 bg-dark-900 border border-border rounded-lg text-text-secondary text-xs focus:outline-none shrink-0'
const tileCls = 'bg-dark-800 rounded px-2.5 py-2'
const tileLabelCls = 'text-text-muted uppercase text-[10px]'

type FieldStatus = 'entered' | 'solved' | 'fill' | 'needed' | 'empty'

function utilCls(pct: number): string {
    if (pct > 100) return 'bg-error/10 border-error text-error'
    if (pct >= 80) return 'bg-warning/10 border-warning text-warning'
    return 'bg-success/10 border-success text-success'
}

interface NumFieldProps {
    label: string
    unit?: string
    value: string
    status: FieldStatus
    hint?: string
    flashKey: number
    placeholder?: string
    min?: string
    onChange: (v: string) => void
    onBlur?: () => void
    trailing?: React.ReactNode
    /** Result-sized input (the belt load field) */
    big?: boolean
}

/** One solver field: entered (white), solved (cyan + auto), needed (amber edge + hint), or empty */
function NumField({ label, unit, value, status, hint, flashKey, placeholder, min, onChange, onBlur, trailing, big }: NumFieldProps) {
    const solved = status === 'solved' || status === 'fill'
    const cls = [
        inputCls,
        big ? 'text-2xl font-semibold py-1.5' : '',
        solved ? 'text-primary border-primary/30 pr-14' : '',
        status === 'needed' ? 'border-l-2 border-l-warning' : '',
        flashKey ? 'tb-flash' : '',
    ].join(' ')
    return (
        <div>
            <label className={big ? tileLabelCls : labelCls}>{label}{unit ? <span className="text-text-muted"> ({unit})</span> : null}</label>
            <div className="flex gap-1">
                <div className="relative flex-1" key={flashKey}>
                    <input type="number" step="any" min={min ?? '0'} value={value} placeholder={placeholder}
                        onChange={(e) => onChange(e.target.value)} onBlur={onBlur} className={cls}
                        aria-description={solved ? 'solved automatically; type to override' : undefined} />
                    {solved && (
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-mono uppercase tracking-wider text-primary/70 pointer-events-none">
                            {status === 'fill' ? 'auto · box' : 'auto'}
                        </span>
                    )}
                </div>
                {trailing}
            </div>
            {hint && <div className="text-[10px] text-warning mt-0.5">{hint}</div>}
        </div>
    )
}

export function LineThroughputCard({ instanceId = MAIN }: { instanceId?: string } = {}) {
    const setLoadDefinition = useAppStore((s) => s.setLoadDefinition)

    const [state, setState] = useInstanceState<CardState>('beltLoad', instanceId, emptyState, restore)
    const [flash, setFlash] = useState<Partial<Record<Field, number>>>({})

    const solved = useMemo(() => runSolve(state, null), [state])
    const { hoursMissing } = useMemo(() => buildEntries(state), [state])

    // A restored state can be over-determined (legacy card): commit the solver's release once
    useEffect(() => {
        const inRaw = solved.released.filter((f) => state.raw[f] !== undefined)
        if (inRaw.length) setState((s) => dropEntered(s, inRaw))
    }, [solved, state.raw])

    /** Apply a state change, let the solver release what it must, and flash what moved */
    const commit = (next: CardState, justEdited: Field | null) => {
        const before = solved
        let after = runSolve(next, justEdited)
        if (after.released.length) {
            next = dropEntered(next, after.released)
            after = runSolve(next, null)
        }
        const bumps: Partial<Record<Field, number>> = {}
        for (const f of modeFields(next.mode)) {
            if (f === justEdited) continue
            const a = after.values[f]
            const b = before.values[f]
            if (!a || a.source === 'entered') continue
            const changed = !b || b.source === 'entered' || Math.abs(a.value - b.value) > 1e-9 * Math.max(1, Math.abs(b.value))
            if (changed) bumps[f] = Date.now()
        }
        if (Object.keys(bumps).length) setFlash((fl) => ({ ...fl, ...bumps }))
        setState(next)
    }

    const edit = (f: Field, str: string) => {
        const next: CardState = { ...state, raw: { ...state.raw }, seq: { ...state.seq } }
        if (str.trim() === '') {
            // Keep the field open and empty while the user types; finishEdit hands it
            // back to the solver on blur. Snapping the solved value back in mid-edit
            // would make the next keystroke append to it.
            next.raw[f] = ''
            delete next.seq[f]
        } else {
            next.raw[f] = str
            next.seq[f] = state.nextSeq
            next.nextSeq = state.nextSeq + 1
        }
        if (f === 'weight') next.weightFromBox = false
        if (f === 'throughput' && str.trim() !== '') next.throughputEntered = true
        commit(next, f)
    }

    /** A field left empty on blur goes back to the solver */
    const finishEdit = (f: Field) => {
        if (state.raw[f] !== '') return
        const next: CardState = { ...state, raw: { ...state.raw }, seq: { ...state.seq } }
        delete next.raw[f]
        delete next.seq[f]
        if (f === 'throughput') next.throughputEntered = false
        commit(next, null)
    }

    /** Unit change converts the typed throughput so the rate is unchanged (never reinterpreted) */
    const setUnit = (unit: RateUnit) => {
        const next: CardState = { ...state, rateUnit: unit, raw: { ...state.raw } }
        if (!unitNeedsHours(state.rateUnit) || state.hours === defaultHours(state.rateUnit)) next.hours = defaultHours(unit)
        const typed = num(state.raw.throughput)
        if (typed !== null && unit !== state.rateUnit) {
            const lbMin = toLbPerMin(typed, state.rateUnit, num(state.hours))
            const shown = lbMin !== null ? fromLbPerMin(lbMin, unit, num(next.hours)) : null
            if (shown !== null) next.raw.throughput = fmtInput(shown)
        }
        commit(next, 'throughput')
    }

    const setHours = (hours: string) => commit({ ...state, hours }, 'throughput')

    /** Package Fill: the box defines the package weight until the user types one or the solver releases it */
    const editFill = (patch: Partial<CardState['fill']>) => {
        const fill = { ...state.fill, ...patch }
        const w = packageFillWeightLb(num(fill.density), num(fill.l), num(fill.w), num(fill.h), (num(fill.fillPct) ?? 100) / 100)
        const next: CardState = { ...state, fill, raw: { ...state.raw }, seq: { ...state.seq } }
        if (w !== null) {
            next.raw.weight = fmtInput(w)
            next.seq.weight = state.nextSeq
            next.nextSeq = state.nextSeq + 1
            next.weightFromBox = true
            commit(next, 'weight')
        } else {
            if (state.weightFromBox) { delete next.raw.weight; delete next.seq.weight; next.weightFromBox = false }
            commit(next, null)
        }
    }

    const setMode = (mode: LoadProductType) => commit({ ...state, mode }, null)

    const isBulk = state.mode === 'bulk'
    const { values, derived, hints, warnings } = solved
    const val = (f: Field): number | null => values[f]?.value ?? null

    const fieldView = (f: Field) => {
        const v = values[f]
        const rawVal = state.raw[f]
        const entered = rawVal !== undefined && rawVal !== ''
        const open = rawVal === ''
        const hint = f === 'throughput' && hoursMissing ? 'Enter the production hours to use this rate' : hints[f]
        const status: FieldStatus = entered
            ? (f === 'weight' && state.weightFromBox ? 'fill' : 'entered')
            : open ? (hint ? 'needed' : 'empty')
            : v ? 'solved' : hint ? 'needed' : 'empty'
        let display = ''
        if (entered) display = rawVal
        else if (open) display = ''
        else if (v) {
            if (f === 'throughput') {
                const shown = fromLbPerMin(v.value, state.rateUnit, num(state.hours))
                display = shown !== null ? fmtInput(shown) : ''
            } else display = fmtInput(v.value)
        }
        return { status, display, hint, flashKey: flash[f] ?? 0 }
    }

    interface Meta { label: string; unit: string; placeholder: string; min?: string }
    const field = (f: Field, m: Meta) => {
        const fv = fieldView(f)
        return <NumField key={f} label={m.label} unit={m.unit} value={fv.display} status={fv.status} hint={fv.hint}
            flashKey={fv.flashKey} placeholder={m.placeholder} min={m.min} onChange={(v) => edit(f, v)} onBlur={() => finishEdit(f)} />
    }

    // Publish the product definition for the Conveyor Spec and Belt Pull cards (tab card only)
    useEffect(() => {
        if (instanceId !== MAIN) return
        if (derived.lbPerHr === null) { setLoadDefinition(null); return }
        const def: LoadDefinition = {
            productType: state.mode,
            throughputLbHr: derived.lbPerHr,
            beltSpeedFpm: val('speed'),
            lbPerFt: derived.lbPerFt,
            pieceWeightLb: val('weight'),
            ppm: val('ppm'),
            looseDensityLbFt3: isBulk ? val('density') : null,
            reposeDeg: isBulk ? num(state.repose) : null,
            beltWidthIn: isBulk ? val('width') : null,
            bedDepthIn: isBulk ? val('depth') : null,
            edgeMarginIn: isBulk ? (num(state.edgeMargin) ?? 1) : null,
        }
        setLoadDefinition(JSON.stringify(def))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [solved, state.repose, state.edgeMargin, setLoadDefinition, instanceId])

    const speed = val('speed')
    const ppm = val('ppm')
    const weight = val('weight')

    // Headroom: once the user has entered a line throughput (kept if the solver later re-derives it) and a packager rate exists
    const showHeadroom = state.throughputEntered && ppm !== null
    const headroom = showHeadroom ? packagerHeadroom(ppm, num(state.nameplate) ?? 0) : null

    const throughputField = fieldView('throughput')
    const loadField = fieldView('lbft')

    const packageFill = (
        <details open={!!state.fill.density}>
            <summary className="text-xs text-text-secondary hover:text-text-primary cursor-pointer select-none">
                Package Fill ({isBulk ? 'bag or box volume → weight per package' : 'bulk product in a fixed box'})
            </summary>
            <div className="mt-2 space-y-2">
                <div className="grid grid-cols-5 gap-2">
                    {([
                        ['density', 'Settled ρ (lb/ft³)', 'e.g. 45'], ['l', 'Box L (in)', ''], ['w', 'W (in)', ''], ['h', 'H (in)', ''], ['fillPct', 'Fill %', '100'],
                    ] as [keyof CardState['fill'], string, string][]).map(([k, label, ph]) => (
                        <div key={k}>
                            <label className={labelCls}>{label}</label>
                            <input type="number" min="0" step="any" value={state.fill[k]} placeholder={ph} className={inputCls}
                                onChange={(e) => editFill({ [k]: e.target.value })} />
                        </div>
                    ))}
                </div>
                <div className="text-[10px] text-text-muted">
                    A box or bag is a fixed volume: settled density × inside volume × fill → weight per package, written into the package weight
                    field. Type a weight to override it. Real fills run 85–95%.{isBulk ? '' : ' Conveying the product loose instead? Switch to Bulk.'}
                </div>
            </div>
        </details>
    )

    return (
        <div className="bg-dark-800 border border-border rounded-xl">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-semibold text-text-primary">Belt Load <span className="text-text-muted font-normal">(lb/ft)</span></h3>
                    <div className="text-[10px] text-text-muted">Line throughput → belt load. Enter what you know; the rest solves.</div>
                </div>
                <CalcPinButton toolId="beltLoad" instanceId={instanceId} />
            </div>
            <div className="p-4 space-y-4">
                {/* 1. Packages | Bulk */}
                <div className="flex gap-2">
                    {([
                        { id: 'packages' as const, label: 'Packages', hint: 'cartons, bags, trays — discrete pieces on the belt' },
                        { id: 'bulk' as const, label: 'Bulk', hint: 'loose product in a bed — curds, nuts, granules, pieces' },
                    ]).map((t) => (
                        <button key={t.id} title={t.hint} onClick={() => setMode(t.id)}
                            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                                state.mode === t.id ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-dark-900 text-text-secondary hover:border-text-muted'
                            }`}>
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* 2. What the plant said */}
                <div className="grid grid-cols-2 gap-2">
                    <div className={unitNeedsHours(state.rateUnit) ? '' : 'col-span-2'}>
                        <NumField label="Line throughput" value={throughputField.display} status={throughputField.status}
                            hint={throughputField.hint} flashKey={throughputField.flashKey} placeholder="what the plant quoted"
                            onChange={(v) => edit('throughput', v)} onBlur={() => finishEdit('throughput')}
                            trailing={
                                <select value={state.rateUnit} onChange={(e) => setUnit(e.target.value as RateUnit)} className={unitSelectCls} aria-label="Throughput unit">
                                    {RATE_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                                </select>
                            } />
                    </div>
                    {unitNeedsHours(state.rateUnit) && (
                        <div>
                            <label className={labelCls}>{state.rateUnit === 'lb/shift' ? 'Hours per shift' : 'Production hours per day'}</label>
                            <input type="number" min="0.5" max="24" step="any" value={state.hours} className={inputCls} onChange={(e) => setHours(e.target.value)} />
                            <div className="text-[10px] text-text-muted mt-0.5">Hours the line actually runs — two 8-hour shifts is 16, not 24.</div>
                        </div>
                    )}
                </div>

                {/* 3. Mode fields — every one solves from the others */}
                {isBulk ? (
                    <>
                        <div className="grid grid-cols-2 gap-2">
                            {field('density', { label: 'Bulk density', unit: 'lb/ft³', placeholder: 'loose, as conveyed' })}
                            {field('depth', { label: 'Bed depth', unit: 'in', placeholder: 'average product height' })}
                            {field('width', { label: 'Belt width', unit: 'in', placeholder: 'e.g. 14' })}
                            {field('speed', { label: 'Belt speed', unit: 'ft/min', placeholder: 'e.g. 60' })}
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <div>
                                <label className={labelCls}>Edge margin <span className="text-text-muted">(in/side)</span></label>
                                <input type="number" min="0" step="any" value={state.edgeMargin} className={inputCls} onChange={(e) => commit({ ...state, edgeMargin: e.target.value }, null)} />
                                <div className="text-[10px] text-text-muted mt-0.5">Bed width = belt − 2 × margin.</div>
                            </div>
                            <div>
                                <label className={labelCls}>Max bed depth <span className="text-text-muted">(in)</span></label>
                                <input type="number" min="0" step="any" value={state.maxDepth} placeholder="optional" className={inputCls} onChange={(e) => commit({ ...state, maxDepth: e.target.value }, null)} />
                                <div className="text-[10px] text-text-muted mt-0.5">Side guard or flight height — checks the bed.</div>
                            </div>
                            <div>
                                <label className={labelCls}>Angle of repose <span className="text-text-muted">(°)</span></label>
                                <input type="number" min="0" max="89" step="any" value={state.repose} className={inputCls} onChange={(e) => setState({ ...state, repose: e.target.value })} />
                                <div className="text-[10px] text-text-muted mt-0.5">Pile angle, for Belt Pull incline pockets.</div>
                            </div>
                        </div>
                        <div className="rounded-lg border border-border bg-dark-900/50 px-3 py-3 space-y-2">
                            <div className="text-xs text-text-secondary font-medium">Downstream packager <span className="text-text-muted font-normal">(optional)</span></div>
                            <div className="grid grid-cols-2 gap-2">
                                {field('ppm', { label: 'Bags / packages per min', unit: 'pkg/min', placeholder: 'bagger rate' })}
                                {field('weight', { label: 'Weight per bag', unit: 'lb', placeholder: 'fill weight' })}
                            </div>
                            {packageFill}
                            <div className="text-[10px] text-text-muted">
                                Only have the bagger&apos;s rate and fill? Enter them here and the line throughput backs out of them. Or enter throughput and a bag weight to get the bagger rate.
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="grid grid-cols-2 gap-2">
                            {field('weight', { label: 'Package weight', unit: 'lb', placeholder: 'per package' })}
                            {field('ppm', { label: 'Packages / min', unit: 'pkg/min', placeholder: 'rate' })}
                            {field('length', { label: 'Product length', unit: 'in', placeholder: 'along the belt' })}
                            {field('gap', { label: 'Gap', unit: 'in', placeholder: 'between products', min: '0' })}
                            {field('speed', { label: 'Belt speed', unit: 'ft/min', placeholder: 'e.g. 60' })}
                        </div>
                        {packageFill}
                    </>
                )}

                {/* 4. Results — belt load is itself a solver field */}
                <div className="rounded-lg border border-primary/20 bg-dark-700 px-3 py-3 space-y-2">
                    <div className="grid grid-cols-[1fr_auto] gap-3 items-end">
                        <NumField big label="Belt load" unit="lb/ft" value={loadField.display} status={loadField.status}
                            hint={loadField.hint ?? (loadField.status === 'empty' ? (isBulk ? 'Solves from throughput ÷ belt speed, or from density × bed depth × bed width' : 'Solves from throughput ÷ belt speed, or from package weight ÷ pitch') : undefined)}
                            flashKey={loadField.flashKey} placeholder="—" onChange={(v) => edit('lbft', v)} onBlur={() => finishEdit('lbft')} />
                        {speed !== null && (
                            <div className="text-right pb-1">
                                <div className={tileLabelCls}>Belt speed</div>
                                <div className="font-mono text-sm text-text-primary">{fmtNum(speed)} ft/min</div>
                            </div>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        {derived.lbPerMin !== null && (
                            <div className={tileCls}>
                                <div className={tileLabelCls}>Throughput</div>
                                <div className="font-mono text-sm text-text-primary">{fmtNum(derived.lbPerMin)} lb/min <span className="text-text-muted">·</span> {fmtNum(derived.lbPerHr!)} lb/hr</div>
                            </div>
                        )}
                        {ppm !== null && (
                            <div className={tileCls}>
                                <div className={tileLabelCls}>{isBulk ? 'Bags' : 'Packages'}</div>
                                <div className="font-mono text-sm text-text-primary">{fmtNum(ppm)}/min <span className="text-text-muted">·</span> {fmtNum(ppm * 60)}/hr</div>
                            </div>
                        )}
                        {weight !== null && (
                            <div className={tileCls}>
                                <div className={tileLabelCls}>{isBulk ? 'Weight per bag' : 'Package weight'}</div>
                                <div className="font-mono text-sm text-text-primary">{fmtNum(weight)} lb</div>
                            </div>
                        )}
                        {!isBulk && derived.pitchIn !== null && (
                            <div className={tileCls}>
                                <div className={tileLabelCls}>Pitch</div>
                                <div className="font-mono text-sm text-text-primary">{fmtNum(derived.pitchIn)} in <span className="text-text-muted">·</span> {derived.productsPerFt !== null ? fmtNum(derived.productsPerFt) : '—'}/ft</div>
                            </div>
                        )}
                        {isBulk && values.depth?.source === 'solved' && (
                            <div className={tileCls}>
                                <div className={tileLabelCls}>Bed depth needed</div>
                                <div className="font-mono text-sm text-primary font-semibold">{fmtNum(values.depth.value)} in{speed !== null ? ' at speed' : ''}</div>
                            </div>
                        )}
                        {isBulk && derived.bedLbPerFt !== null && (
                            <div className={tileCls}>
                                <div className={tileLabelCls}>Bed at max depth carries</div>
                                <div className="font-mono text-sm text-text-primary">{fmtNum(derived.bedLbPerFt)} lb/ft{speed !== null ? ` · ${fmtNum(derived.bedLbPerFt * speed * 60)} lb/hr` : ''}</div>
                            </div>
                        )}
                    </div>
                    {isBulk && derived.bedUtilizationPct !== null && (
                        <div className={`px-2.5 py-2 border-l-2 rounded text-xs ${utilCls(derived.bedUtilizationPct)}`}>
                            The bed runs at <span className="font-mono font-semibold">{fmtNum(derived.bedUtilizationPct, 3)}%</span> of the maximum depth.{' '}
                            {derived.bedUtilizationPct > 100
                                ? 'It overflows — widen the belt, run faster, or cut the rate.'
                                : derived.bedUtilizationPct >= 80
                                ? 'Tight — surges and uneven feed will spill over the edges.'
                                : 'Comfortable headroom.'}
                        </div>
                    )}
                    {warnings.map((w, i) => (
                        <div key={i} className="px-2.5 py-2 bg-warning/10 border-l-2 border-warning rounded text-xs text-warning">{w}</div>
                    ))}
                </div>

                {/* 5. Packager headroom — once a line throughput has been entered */}
                {showHeadroom && (
                    <div className="rounded-lg border border-border bg-dark-900/50 px-3 py-3 space-y-2">
                        <div className="text-xs text-text-secondary font-medium">Packager headroom check</div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className={labelCls}>Packager nameplate rate <span className="text-text-muted">(pkg/min)</span></label>
                                <input type="number" min="0" step="any" value={state.nameplate} placeholder="machine's rated max" className={inputCls}
                                    onChange={(e) => setState({ ...state, nameplate: e.target.value })} />
                            </div>
                            <div>
                                <label className={labelCls}>Required rate</label>
                                <div className="font-mono text-sm text-text-primary py-2">{fmtNum(ppm)} pkg/min</div>
                            </div>
                        </div>
                        {headroom && (
                            <div className={`px-2.5 py-2 border-l-2 rounded text-xs ${utilCls(headroom.utilizationPct)}`}>
                                Packager runs at <span className="font-mono font-semibold">{fmtNum(headroom.utilizationPct, 3)}%</span> of nameplate
                                ({fmtNum(ppm)} of {fmtNum(num(state.nameplate)!)}/min). {headroom.message}
                            </div>
                        )}
                    </div>
                )}

                <div className="text-[10px] text-text-muted">
                    Amber fields would unlock a result; cyan fields are solved and can be typed over. Conveyor Speed and Belt Pull pull from this card through their From bar, or link to follow it live.
                    {instanceId === MAIN ? ' This product definition is also live on the Conveyor Spec card.' : ''}
                </div>
            </div>
        </div>
    )
}
