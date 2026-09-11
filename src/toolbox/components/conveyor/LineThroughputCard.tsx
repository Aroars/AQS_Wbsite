import { useState, useMemo, useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import { CalcPinButton } from '@/toolbox/components/ui/CalcPinButton'
import { useInstanceState, MAIN } from '@/toolbox/hooks/useToolState'
import { showToast } from '@/toolbox/components/ui/Toast'
import { useAppStore } from '@/toolbox/stores/appStore'
import { jumpToTool } from '@/toolbox/lib/jump'
import {
    solveThroughput, toLbPerMin, fromLbPerMin, unitNeedsHours, packageFillWeightLb, packagerHeadroom, fmtNum, fmtInput, tidy,
    RATE_UNITS, PACKAGE_FIELDS, BULK_FIELDS,
    type Field, type Entries, type RateUnit, type SolveOutput,
} from '@/toolbox/lib/calculators/lineThroughput'
import type { LoadDefinition, LoadProductType } from '@/toolbox/lib/calculators/loadDefinition'

/*
 * Line Throughput → Belt Load
 *
 * An auto-solving intake form. The user enters whatever the plant said; every
 * field the network can derive fills in (cyan, "auto"), fields that would
 * unlock a result are flagged (amber), and a solved value that changes flashes.
 * Entry order is tracked so that overwriting a solved field releases the
 * oldest entry it depends on instead of clearing anything. The solver itself
 * is lib/calculators/lineThroughput.
 */

const inputCls = 'w-full px-2 py-2 bg-dark-900 border border-border rounded-lg text-text-primary font-mono text-sm focus:outline-none focus:border-primary'
const labelCls = 'block text-xs text-text-muted mb-1'
const unitSelectCls = 'px-1.5 py-2 bg-dark-900 border border-border rounded-lg text-text-secondary text-xs focus:outline-none shrink-0'
const tileCls = 'bg-dark-800 rounded px-2.5 py-2'
const tileLabelCls = 'text-text-muted uppercase text-[10px]'

interface CardState {
    mode: LoadProductType
    /** What the user typed, per entered field (throughput in rateUnit) */
    raw: Partial<Record<Field, string>>
    /** Entry order per entered field: higher = more recent */
    seq: Partial<Record<Field, number>>
    nextSeq: number
    rateUnit: RateUnit
    /** Production hours per day (or per shift) for per-day / per-shift rates */
    hours: string
    /** Packager nameplate rate, pkg/min (headroom check) */
    nameplate: string
    /** Package Fill: bulk product settled into a fixed box → package weight */
    fill: { density: string; l: string; w: string; h: string; fillPct: string }
    /** raw.weight was written by the Package Fill box, not typed */
    weightFromBox: boolean
    /** The user has entered a line throughput at some point (survives a release) — shows the headroom check */
    throughputEntered: boolean
    /** Bulk extras that ride along to Belt Pull */
    repose: string
    edgeMargin: string
}

const emptyState: CardState = {
    mode: 'packages', raw: {}, seq: {}, nextSeq: 1, rateUnit: 'lb/hr', hours: '16', nameplate: '',
    fill: { density: '', l: '', w: '', h: '', fillPct: '100' }, weightFromBox: false, throughputEntered: false, repose: '35', edgeMargin: '1',
}

const num = (s: string | number | null | undefined): number | null => {
    if (s === null || s === undefined) return null
    const n = typeof s === 'number' ? s : parseFloat(s)
    return Number.isFinite(n) ? n : null
}

const defaultHours = (unit: RateUnit) => (unit === 'lb/shift' ? '8' : '16')
const modeFields = (mode: LoadProductType): readonly Field[] => (mode === 'bulk' ? BULK_FIELDS : PACKAGE_FIELDS)

/** Restore the persisted card, including the pre-rebuild "Belt Load / Throughput" shape */
function restore(json: string | null): CardState {
    if (!json) return emptyState
    try {
        const v = JSON.parse(json)
        if (!v || typeof v !== 'object') return emptyState
        if (v.raw && typeof v.raw === 'object') {
            return {
                ...emptyState, ...v,
                raw: { ...v.raw }, seq: { ...v.seq },
                fill: { ...emptyState.fill, ...(v.fill ?? {}) },
                rateUnit: (RATE_UNITS as readonly string[]).includes(v.rateUnit) ? v.rateUnit : 'lb/hr',
            }
        }
        const s: CardState = { ...emptyState, raw: {}, seq: {}, fill: { ...emptyState.fill } }
        s.mode = v.productType === 'bulk' ? 'bulk' : 'packages'
        s.rateUnit = v.rateUnit === 'day' ? 'lb/day' : 'lb/hr'
        s.hours = String(v.hrsPerDay || '16')
        s.nameplate = String(v.ratedPpm ?? '')
        s.fill = { density: String(v.density ?? ''), l: String(v.pkgL ?? ''), w: String(v.pkgW ?? ''), h: String(v.pkgH ?? ''), fillPct: String(v.fillPct ?? '100') }
        s.repose = String(v.repose ?? '35')
        s.edgeMargin = String(v.edgeMargin ?? '1')
        const legacy: [Field, unknown][] = [
            ['throughput', v.rateUnit === 'ft3hr' ? '' : v.throughput], ['weight', v.pieceWeight], ['ppm', v.ppm],
            ['speed', v.speed], ['density', v.looseDensity], ['width', v.beltWidth], ['depth', v.bedDepth],
        ]
        let seq = 1
        for (const [f, val] of legacy) if (val !== undefined && val !== null && String(val).trim() !== '') { s.raw[f] = String(val); s.seq[f] = seq++ }
        s.nextSeq = seq
        s.throughputEntered = s.raw.throughput !== undefined
        return s
    } catch {
        return emptyState
    }
}

function buildEntries(s: CardState): { entries: Entries; hoursMissing: boolean } {
    const entries: Entries = {}
    const hours = num(s.hours)
    let hoursMissing = false
    for (const f of modeFields(s.mode)) {
        const v = num(s.raw[f])
        if (v === null) continue
        if (f === 'throughput') {
            const lbMin = toLbPerMin(v, s.rateUnit, hours)
            if (lbMin === null) { hoursMissing = true; continue }
            entries.throughput = { value: lbMin, seq: s.seq.throughput ?? 0 }
        } else {
            entries[f] = { value: v, seq: s.seq[f] ?? 0, source: f === 'weight' && s.weightFromBox ? 'fill' : 'entered' }
        }
    }
    return { entries, hoursMissing }
}

function runSolve(s: CardState, justEdited: Field | null): SolveOutput {
    return solveThroughput(s.mode, buildEntries(s).entries, { edgeMarginIn: num(s.edgeMargin) ?? 1, justEdited })
}

function dropEntered(s: CardState, fields: Field[]): CardState {
    const raw = { ...s.raw }
    const seq = { ...s.seq }
    let weightFromBox = s.weightFromBox
    for (const f of fields) {
        delete raw[f]
        delete seq[f]
        if (f === 'weight') weightFromBox = false
    }
    return { ...s, raw, seq, weightFromBox }
}

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
}

/** One solver field: entered (white), solved (cyan + auto), needed (amber edge + hint), or empty */
function NumField({ label, unit, value, status, hint, flashKey, placeholder, min, onChange, onBlur, trailing }: NumFieldProps) {
    const solved = status === 'solved' || status === 'fill'
    const cls = [
        inputCls,
        solved ? 'text-primary border-primary/30 pr-14' : '',
        status === 'needed' ? 'border-l-2 border-l-warning' : '',
        flashKey ? 'tb-flash' : '',
    ].join(' ')
    return (
        <div>
            <label className={labelCls}>{label}{unit ? <span className="text-text-muted"> ({unit})</span> : null}</label>
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
    const sendToBeltPull = useAppStore((s) => s.sendToBeltPull)
    const receiveInfeed = useAppStore((s) => s.receiveInfeed)

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

    // Publish the product definition for the Conveyor Spec and Belt Pull cards (tab card only)
    useEffect(() => {
        if (instanceId !== MAIN) return
        if (derived.lbPerHr === null) { setLoadDefinition(null); return }
        const def: LoadDefinition = {
            productType: state.mode,
            throughputLbHr: derived.lbPerHr,
            beltSpeedFpm: val('speed'),
            lbPerFt: derived.lbPerFt,
            pieceWeightLb: isBulk ? null : val('weight'),
            ppm: isBulk ? null : val('ppm'),
            looseDensityLbFt3: isBulk ? val('density') : null,
            reposeDeg: isBulk ? num(state.repose) : null,
            beltWidthIn: isBulk ? val('width') : null,
            bedDepthIn: isBulk ? val('depth') : null,
            edgeMarginIn: isBulk ? (num(state.edgeMargin) ?? 1) : null,
        }
        setLoadDefinition(JSON.stringify(def))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [solved, state.repose, state.edgeMargin, setLoadDefinition, instanceId])

    // ── Handoffs ──
    const speed = val('speed')
    const canSendPull = derived.lbPerFt !== null && speed !== null && derived.lbPerHr !== null
    const sendPull = () => {
        if (!canSendPull) return
        const patch: Record<string, unknown> = { productType: state.mode, loadMode: 'rate', throughputLbHr: tidy(derived.lbPerHr, 1), beltSpeedFpm: tidy(speed, 2) }
        if (isBulk) {
            const dens = tidy(val('density'), 3); const repose = num(state.repose); const width = tidy(val('width'), 3); const depth = tidy(val('depth'), 3)
            if (dens) patch.bulkDensityLbFt3 = dens
            if (repose) patch.reposeDeg = repose
            if (width) patch.beltWidthIn = width
            if (depth) patch.bedDepthIn = depth
            patch.edgeMarginIn = num(state.edgeMargin) ?? 1
        } else {
            const w = tidy(val('weight'), 4); const len = tidy(val('length'), 3)
            if (w) patch.productWeightLb = w
            if (len) patch.productLengthIn = len
        }
        sendToBeltPull(patch)
        showToast(`Sent to Belt Pull — ${fmtNum(derived.lbPerFt!)} lb/ft @ ${fmtNum(speed!)} ft/min`)
        jumpToTool('conveyor', 'beltPull')
    }

    const ppm = val('ppm')
    const canSendSpeed = !isBulk && ppm !== null
    const sendSpeed = () => {
        if (!canSendSpeed) return
        receiveInfeed({ ppm: tidy(ppm, 4)!, weightLb: tidy(val('weight'), 4), lengthIn: tidy(val('length'), 3), gapIn: tidy(val('gap'), 3), speedFpm: tidy(speed, 2) })
        showToast('Sent to Conveyor Speed — adjust speed or spacing there')
        jumpToTool('conveyor', 'conveyorFlow')
    }
    const pitchLabel = derived.pitchIn !== null && val('length') !== null && val('gap') !== null
        ? `, ${fmtNum(val('length')!)}″ + ${fmtNum(val('gap')!)}″ pitch` : ''

    // Headroom: only once the user has entered a line throughput (kept if the solver later re-derives it)
    const showHeadroom = !isBulk && state.throughputEntered
    const headroom = showHeadroom
        ? packagerHeadroom(ppm ?? 0, num(state.nameplate) ?? 0)
        : null

    const throughputField = fieldView('throughput')

    return (
        <div className="bg-dark-800 border border-border rounded-xl">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text-primary">Line Throughput <span className="text-text-muted font-normal">→</span> Belt Load</h3>
                <CalcPinButton toolId="beltLoad" instanceId={instanceId} />
            </div>
            <div className="p-4 space-y-4">
                {/* 1. What the plant said */}
                <div className="grid grid-cols-2 gap-2">
                    <div className={unitNeedsHours(state.rateUnit) ? '' : 'col-span-2'}>
                        <NumField label="Line throughput" unit="optional" value={throughputField.display} status={throughputField.status}
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

                {/* 2. Packages | Bulk */}
                <div className="flex gap-2">
                    {([
                        { id: 'packages' as const, label: 'Packages', hint: 'cartons, bags, trays — discrete pieces' },
                        { id: 'bulk' as const, label: 'Bulk', hint: 'loose product — curds, nuts, granules, pieces in a bed' },
                    ]).map((t) => (
                        <button key={t.id} title={t.hint} onClick={() => setMode(t.id)}
                            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                                state.mode === t.id ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-dark-900 text-text-secondary hover:border-text-muted'
                            }`}>
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* 3. Mode fields — every one solves from the others */}
                {isBulk ? (
                    <div className="grid grid-cols-2 gap-2">
                        {(['density', 'depth', 'width', 'speed'] as Field[]).map((f) => {
                            const fv = fieldView(f)
                            const meta: Record<string, { label: string; unit: string; placeholder: string }> = {
                                density: { label: 'Bulk density', unit: 'lb/ft³', placeholder: 'loose, as conveyed' },
                                depth: { label: 'Bed depth', unit: 'in', placeholder: 'product depth on the belt' },
                                width: { label: 'Belt width', unit: 'in', placeholder: 'e.g. 14' },
                                speed: { label: 'Belt speed', unit: 'ft/min', placeholder: 'ft/min' },
                            }
                            return <NumField key={f} label={meta[f].label} unit={meta[f].unit} value={fv.display} status={fv.status} hint={fv.hint}
                                flashKey={fv.flashKey} placeholder={meta[f].placeholder} onChange={(v) => edit(f, v)} onBlur={() => finishEdit(f)} />
                        })}
                        <div>
                            <label className={labelCls}>Angle of repose <span className="text-text-muted">(°)</span></label>
                            <input type="number" min="0" max="89" step="any" value={state.repose} className={inputCls} onChange={(e) => setState({ ...state, repose: e.target.value })} />
                            <div className="text-[10px] text-text-muted mt-0.5">Pile angle. Shapes the flight pockets on a Belt Pull incline.</div>
                        </div>
                        <div>
                            <label className={labelCls}>Edge margin <span className="text-text-muted">(in per side)</span></label>
                            <input type="number" min="0" step="any" value={state.edgeMargin} className={inputCls} onChange={(e) => commit({ ...state, edgeMargin: e.target.value }, null)} />
                            <div className="text-[10px] text-text-muted mt-0.5">Belt edge the product cannot use. Bed width = belt width − 2 × margin.</div>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-2">
                        {(['weight', 'ppm', 'length', 'gap', 'speed'] as Field[]).map((f) => {
                            const fv = fieldView(f)
                            const meta: Record<string, { label: string; unit: string; placeholder: string; min?: string }> = {
                                weight: { label: 'Package weight', unit: 'lb', placeholder: 'per package' },
                                ppm: { label: 'Packages / min', unit: 'pkg/min', placeholder: 'rate' },
                                length: { label: 'Product length', unit: 'in', placeholder: 'along the belt' },
                                gap: { label: 'Gap', unit: 'in', placeholder: 'between products', min: '0' },
                                speed: { label: 'Belt speed', unit: 'ft/min', placeholder: 'ft/min' },
                            }
                            return <NumField key={f} label={meta[f].label} unit={meta[f].unit} value={fv.display} status={fv.status} hint={fv.hint}
                                flashKey={fv.flashKey} placeholder={meta[f].placeholder} min={meta[f].min} onChange={(v) => edit(f, v)} onBlur={() => finishEdit(f)} />
                        })}
                    </div>
                )}

                {/* 4. Package Fill (packages): bulk product in a fixed box → package weight */}
                {!isBulk && (
                    <details open={!!state.fill.density}>
                        <summary className="text-xs text-text-secondary hover:text-text-primary cursor-pointer select-none">
                            Package Fill (bulk product in a fixed box)
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
                                A box is a fixed volume: settled density × inside volume × fill → weight per package, written into Package weight
                                above. Type a weight to override it. Real fills run 85–95%. Conveying the product loose instead? Switch to Bulk.
                            </div>
                        </div>
                    </details>
                )}

                {/* 5. Results */}
                <div className="rounded-lg border border-primary/20 bg-dark-700 px-3 py-3 space-y-2">
                    <div className="flex items-end justify-between gap-3">
                        <div>
                            <div className={tileLabelCls}>Belt load</div>
                            {derived.lbPerFt !== null ? (
                                <div className="font-mono text-2xl text-primary font-semibold leading-tight">{fmtNum(derived.lbPerFt)} <span className="text-sm text-text-secondary">lb/ft</span></div>
                            ) : (
                                <div className="text-xs text-text-muted mt-1">
                                    {isBulk ? 'Enter throughput and belt speed, or the bed (density, depth, width), to get lb/ft.' : 'Enter belt speed — or product length and gap — to get lb/ft.'}
                                </div>
                            )}
                        </div>
                        {speed !== null && (
                            <div className="text-right">
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
                        {!isBulk && ppm !== null && (
                            <div className={tileCls}>
                                <div className={tileLabelCls}>Packages</div>
                                <div className="font-mono text-sm text-text-primary">{fmtNum(ppm)}/min <span className="text-text-muted">·</span> {fmtNum(ppm * 60)}/hr</div>
                            </div>
                        )}
                        {!isBulk && val('weight') !== null && (
                            <div className={tileCls}>
                                <div className={tileLabelCls}>Package weight</div>
                                <div className="font-mono text-sm text-text-primary">{fmtNum(val('weight')!)} lb</div>
                            </div>
                        )}
                        {!isBulk && derived.pitchIn !== null && (
                            <div className={tileCls}>
                                <div className={tileLabelCls}>Pitch</div>
                                <div className="font-mono text-sm text-text-primary">{fmtNum(derived.pitchIn)} in <span className="text-text-muted">·</span> {derived.productsPerFt !== null ? fmtNum(derived.productsPerFt) : '—'}/ft</div>
                            </div>
                        )}
                        {isBulk && derived.bedLbPerFt !== null && (
                            <div className={tileCls}>
                                <div className={tileLabelCls}>Bed carries</div>
                                <div className="font-mono text-sm text-text-primary">{fmtNum(derived.bedLbPerFt)} lb/ft{speed !== null ? ` · ${fmtNum(derived.bedLbPerFt * speed * 60)} lb/hr` : ''}</div>
                            </div>
                        )}
                        {isBulk && values.depth?.source === 'solved' && (
                            <div className={tileCls}>
                                <div className={tileLabelCls}>Bed depth needed</div>
                                <div className="font-mono text-sm text-primary font-semibold">{fmtNum(values.depth.value)} in at speed</div>
                            </div>
                        )}
                    </div>
                    {isBulk && derived.bedUtilizationPct !== null && (
                        <div className={`px-2.5 py-2 border-l-2 rounded text-xs ${utilCls(derived.bedUtilizationPct)}`}>
                            Demand is <span className="font-mono font-semibold">{fmtNum(derived.bedUtilizationPct, 3)}%</span> of what the bed carries at {fmtNum(speed!)} ft/min.{' '}
                            {derived.bedUtilizationPct > 100
                                ? 'The bed cannot keep up — deepen it, widen the belt, or run faster.'
                                : derived.bedUtilizationPct >= 80
                                ? 'Tight — surges and uneven feed will overflow the edges.'
                                : 'Comfortable headroom.'}
                        </div>
                    )}
                    {warnings.map((w, i) => (
                        <div key={i} className="px-2.5 py-2 bg-warning/10 border-l-2 border-warning rounded text-xs text-warning">{w}</div>
                    ))}
                </div>

                {/* 6. Handoffs — always visible, enabled when the payload exists */}
                <div className="grid grid-cols-1 gap-2">
                    <button onClick={sendPull} disabled={!canSendPull}
                        className="w-full px-3 py-2 rounded-lg text-xs border transition-colors flex items-center justify-center gap-1.5 border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-primary/10">
                        Send to Belt Pull <ArrowRight className="w-3.5 h-3.5" />
                        {canSendPull && <span className="font-mono">{fmtNum(derived.lbPerFt!)} lb/ft @ {fmtNum(speed!)} ft/min</span>}
                    </button>
                    {!isBulk && (
                        <button onClick={sendSpeed} disabled={!canSendSpeed}
                            className="w-full px-3 py-2 rounded-lg text-xs border transition-colors flex items-center justify-center gap-1.5 border-border bg-dark-900 text-text-secondary hover:border-primary/40 hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed">
                            Send to Conveyor Speed <ArrowRight className="w-3.5 h-3.5" />
                            {canSendSpeed && <span className="font-mono">{fmtNum(ppm!)} pkg/min{pitchLabel}</span>}
                        </button>
                    )}
                </div>

                {/* 7. Packager headroom — once a line throughput has been entered */}
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
                                <div className="font-mono text-sm text-text-primary py-2">{ppm !== null ? `${fmtNum(ppm)} pkg/min` : 'needs packages/min'}</div>
                            </div>
                        </div>
                        {headroom && (
                            <div className={`px-2.5 py-2 border-l-2 rounded text-xs ${utilCls(headroom.utilizationPct)}`}>
                                Packager runs at <span className="font-mono font-semibold">{fmtNum(headroom.utilizationPct, 3)}%</span> of nameplate
                                ({fmtNum(ppm!)} of {fmtNum(num(state.nameplate)!)}/min). {headroom.message}
                            </div>
                        )}
                    </div>
                )}

                <div className="text-[10px] text-text-muted">
                    This product definition is live on the Conveyor Spec card and rides along when either card sends to Belt Pull.
                </div>
            </div>
        </div>
    )
}
