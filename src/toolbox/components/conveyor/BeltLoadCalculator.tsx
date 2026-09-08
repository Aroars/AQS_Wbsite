import { useState, useMemo, useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import { PinButton } from '@/toolbox/components/ui/PinButton'
import { showToast } from '@/toolbox/components/ui/Toast'
import { useAppStore } from '@/toolbox/stores/appStore'
import { calculateBeltLoad, type LoadProductType } from '@/toolbox/lib/calculators/beltLoad'
import type { LoadDefinition } from '@/toolbox/lib/calculators/loadDefinition'

const inputCls = 'w-full px-2 py-2 bg-dark-900 border border-border rounded-lg text-text-primary font-mono text-sm focus:outline-none focus:border-primary'
const labelCls = 'block text-xs text-text-muted mb-1'
const unitSelectCls = 'px-1.5 py-2 bg-dark-900 border border-border rounded-lg text-text-secondary text-xs focus:outline-none shrink-0'

interface LoadInputs {
    productType: LoadProductType
    throughput: string
    rateUnit: 'hr' | 'day' | 'ft3hr'
    hrsPerDay: string
    ratedPpm: string
    speed: string
    // packages
    pieceWeight: string
    ppm: string
    density: string
    pkgL: string
    pkgW: string
    pkgH: string
    fillPct: string
    // bulk
    looseDensity: string
    repose: string
    beltWidth: string
    bedDepth: string
    edgeMargin: string
}

const emptyInputs: LoadInputs = {
    productType: 'packages',
    throughput: '', rateUnit: 'hr', hrsPerDay: '24', ratedPpm: '',
    speed: '', pieceWeight: '', ppm: '',
    density: '', pkgL: '', pkgW: '', pkgH: '', fillPct: '100',
    looseDensity: '', repose: '35', beltWidth: '', bedDepth: '', edgeMargin: '1',
}

function parse(v: string): number | null {
    const n = parseFloat(v)
    return isNaN(n) || n <= 0 ? null : n
}

function utilCls(pct: number): string {
    if (pct > 100) return 'bg-error/10 border-error text-error'
    if (pct >= 80) return 'bg-warning/10 border-warning text-warning'
    return 'bg-success/10 border-success text-success'
}

export function BeltLoadCalculator() {
    const pinned = useAppStore((s) => s.pinnedCalculators.includes('beltLoad'))
    const togglePin = useAppStore((s) => s.togglePinCalculator)
    const setBeltLoadState = useAppStore((s) => s.setBeltLoadState)
    const setLoadDefinition = useAppStore((s) => s.setLoadDefinition)
    const sendToBeltPull = useAppStore((s) => s.sendToBeltPull)

    const [inputs, setInputs] = useState<LoadInputs>(() => {
        try {
            const stored = useAppStore.getState().beltLoadState
            if (stored) return { ...emptyInputs, ...JSON.parse(stored) }
        } catch { /* fall through */ }
        return emptyInputs
    })

    useEffect(() => { setBeltLoadState(JSON.stringify(inputs)) }, [inputs, setBeltLoadState])

    const upd = (patch: Partial<LoadInputs>) => setInputs((s) => ({ ...s, ...patch }))
    const isBulk = inputs.productType === 'bulk'

    const result = useMemo(() => calculateBeltLoad({
        productType: inputs.productType,
        throughputLbHr: inputs.rateUnit === 'hr' ? parse(inputs.throughput) : null,
        throughputLbPerDay: inputs.rateUnit === 'day' ? parse(inputs.throughput) : null,
        throughputFt3Hr: inputs.rateUnit === 'ft3hr' ? parse(inputs.throughput) : null,
        operatingHrsPerDay: parse(inputs.hrsPerDay),
        ratedPackagerPpm: parse(inputs.ratedPpm),
        beltSpeedFpm: parse(inputs.speed),
        pieceWeightLb: parse(inputs.pieceWeight),
        ppm: parse(inputs.ppm),
        settledDensityLbFt3: parse(inputs.density),
        pkgLengthIn: parse(inputs.pkgL),
        pkgWidthIn: parse(inputs.pkgW),
        pkgHeightIn: parse(inputs.pkgH),
        fillFraction: (parse(inputs.fillPct) ?? 100) / 100,
        looseDensityLbFt3: parse(inputs.looseDensity),
        reposeDeg: parse(inputs.repose),
        beltWidthIn: parse(inputs.beltWidth),
        bedDepthIn: parse(inputs.bedDepth),
        edgeMarginIn: inputs.edgeMargin === '' ? 1 : Math.max(parseFloat(inputs.edgeMargin) || 0, 0),
    }), [inputs])

    // Publish the product definition for the Conveyor Spec (flight solver) and Belt Pull cards
    useEffect(() => {
        if (!result) { setLoadDefinition(null); return }
        const def: LoadDefinition = {
            productType: result.productType,
            throughputLbHr: result.throughputLbHr,
            beltSpeedFpm: parse(inputs.speed),
            lbPerFt: result.lbPerFt,
            pieceWeightLb: result.pieceWeightLb,
            ppm: result.ppm,
            looseDensityLbFt3: isBulk ? parse(inputs.looseDensity) : null,
            reposeDeg: isBulk ? parse(inputs.repose) : null,
            beltWidthIn: isBulk ? parse(inputs.beltWidth) : null,
            bedDepthIn: isBulk ? parse(inputs.bedDepth) : null,
            edgeMarginIn: isBulk ? (inputs.edgeMargin === '' ? 1 : Math.max(parseFloat(inputs.edgeMargin) || 0, 0)) : null,
        }
        setLoadDefinition(JSON.stringify(def))
    }, [result, inputs.speed, inputs.looseDensity, inputs.repose, inputs.beltWidth, inputs.bedDepth, inputs.edgeMargin, isBulk, setLoadDefinition])

    const send = () => {
        if (!result || result.lbPerFt === null) return
        const patch: Record<string, unknown> = {
            productType: result.productType,
            loadMode: 'rate',
            throughputLbHr: result.throughputLbHr,
            beltSpeedFpm: parse(inputs.speed),
        }
        if (isBulk) {
            const dens = parse(inputs.looseDensity)
            const repose = parse(inputs.repose)
            const width = parse(inputs.beltWidth)
            const depth = parse(inputs.bedDepth)
            if (dens) patch.bulkDensityLbFt3 = dens
            if (repose) patch.reposeDeg = repose
            if (width) patch.beltWidthIn = width
            if (depth) patch.bedDepthIn = depth
            patch.edgeMarginIn = inputs.edgeMargin === '' ? 1 : Math.max(parseFloat(inputs.edgeMargin) || 0, 0)
        }
        sendToBeltPull(patch)
        showToast(`Sent to Belt Pull — ${isBulk ? 'bulk' : 'packages'}, rate mode`)
    }

    const rateUnits: Array<{ id: LoadInputs['rateUnit']; label: string }> = isBulk
        ? [{ id: 'hr', label: 'lb/hr' }, { id: 'ft3hr', label: 'ft³/hr' }, { id: 'day', label: 'lb/day' }]
        : [{ id: 'hr', label: 'lb/hr' }, { id: 'day', label: 'lb/day' }]

    return (
        <div className="bg-dark-800 border border-border rounded-xl">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text-primary">Belt Load / Throughput</h3>
                <PinButton pinned={pinned} onToggle={() => togglePin('beltLoad')} />
            </div>
            <div className="p-4 space-y-4">
                {/* Product type — decides the whole card */}
                <div className="flex gap-2">
                    {([
                        { id: 'packages' as const, label: 'Packages', hint: 'cartons, bags, trays — discrete pieces' },
                        { id: 'bulk' as const, label: 'Bulk', hint: 'loose product — curds, nuts, granules, pieces in a bed' },
                    ]).map((t) => (
                        <button key={t.id} title={t.hint}
                            onClick={() => upd({ productType: t.id, rateUnit: inputs.rateUnit === 'ft3hr' && t.id === 'packages' ? 'hr' : inputs.rateUnit })}
                            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                                inputs.productType === t.id ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-dark-900 text-text-secondary hover:border-text-muted'
                            }`}>
                            {t.label}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className={labelCls}>Process Rate</label>
                        <div className="flex gap-1">
                            <input type="number" min="0" step="any" value={inputs.throughput} placeholder="from the plant"
                                className={inputCls} onChange={(e) => upd({ throughput: e.target.value })} />
                            <select value={inputs.rateUnit} onChange={(e) => upd({ rateUnit: e.target.value as LoadInputs['rateUnit'] })} className={unitSelectCls}>
                                {rateUnits.map((u) => <option key={u.id} value={u.id}>{u.label}</option>)}
                            </select>
                        </div>
                    </div>
                    {inputs.rateUnit === 'day' && (
                        <div>
                            <label className={labelCls}>Operating Hrs/Day</label>
                            <input type="number" min="0.5" max="24" step="any" value={inputs.hrsPerDay}
                                className={inputCls} onChange={(e) => upd({ hrsPerDay: e.target.value })} />
                            <div className="text-[10px] text-text-muted mt-0.5">Production hours, not clock hours — two shifts ≈ 16.</div>
                        </div>
                    )}
                    <div>
                        <label className={labelCls}>Belt Speed (ft/min)</label>
                        <input type="number" min="0" step="any" value={inputs.speed} placeholder={isBulk ? 'needed for lb/ft and bed check' : 'optional'}
                            className={inputCls} onChange={(e) => upd({ speed: e.target.value })} />
                    </div>

                    {isBulk ? (
                        <>
                            <div>
                                <label className={labelCls}>Loose Density (lb/ft³)</label>
                                <input type="number" min="0" step="any" value={inputs.looseDensity} placeholder="as conveyed, e.g. 45"
                                    className={inputCls} onChange={(e) => upd({ looseDensity: e.target.value })} />
                            </div>
                            <div>
                                <label className={labelCls}>Angle of Repose (°)</label>
                                <input type="number" min="0" max="89" step="any" value={inputs.repose}
                                    className={inputCls} onChange={(e) => upd({ repose: e.target.value })} />
                                <div className="text-[10px] text-text-muted mt-0.5">Pile angle. Shapes the flight pockets on a Belt Pull incline.</div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div>
                                <label className={labelCls}>Rated Packager Speed (pkg/min)</label>
                                <input type="number" min="0" step="any" value={inputs.ratedPpm} placeholder="bagger's theoretical max"
                                    className={inputCls} onChange={(e) => upd({ ratedPpm: e.target.value })} />
                            </div>
                            {/* Linked pair — entering one derives the other */}
                            <div>
                                <label className={labelCls}>Avg Package Weight (lb)</label>
                                <input type="number" min="0" step="any" value={inputs.pieceWeight} placeholder="or enter PPM →"
                                    className={inputCls} onChange={(e) => upd({ pieceWeight: e.target.value, ppm: '' })} />
                            </div>
                            <div>
                                <label className={labelCls}>Packages / Minute</label>
                                <input type="number" min="0" step="any" value={inputs.ppm} placeholder="← or enter weight"
                                    className={inputCls} onChange={(e) => upd({ ppm: e.target.value, pieceWeight: '' })} />
                            </div>
                        </>
                    )}
                </div>

                {isBulk ? (
                    <details open={!!inputs.bedDepth}>
                        <summary className="text-xs text-text-secondary hover:text-text-primary cursor-pointer select-none">
                            Bed Capacity Check (belt width × bed depth at speed)
                        </summary>
                        <div className="mt-2 space-y-2">
                            <div className="grid grid-cols-3 gap-2">
                                <div>
                                    <label className={labelCls}>Belt Width (in)</label>
                                    <input type="number" min="0" step="any" value={inputs.beltWidth} placeholder="e.g. 14"
                                        className={inputCls} onChange={(e) => upd({ beltWidth: e.target.value })} />
                                </div>
                                <div>
                                    <label className={labelCls}>Bed Depth (in)</label>
                                    <input type="number" min="0" step="any" value={inputs.bedDepth} placeholder="e.g. 2"
                                        className={inputCls} onChange={(e) => upd({ bedDepth: e.target.value })} />
                                </div>
                                <div>
                                    <label className={labelCls}>Edge Margin (in/side)</label>
                                    <input type="number" min="0" step="any" value={inputs.edgeMargin} placeholder="1"
                                        className={inputCls} onChange={(e) => upd({ edgeMargin: e.target.value })} />
                                </div>
                            </div>
                            <div className="text-[10px] text-text-muted">
                                Horizontal bed: the belt presents (width − 2 × margin) × depth of product to the flow. On an incline
                                steeper than the belt can hold, the Belt Pull incline section turns this into flight pockets instead.
                            </div>
                        </div>
                    </details>
                ) : (
                    <details open={!!inputs.density}>
                        <summary className="text-xs text-text-secondary hover:text-text-primary cursor-pointer select-none">
                            Package Fill (bulk product in a fixed box)
                        </summary>
                        <div className="mt-2 space-y-2">
                            <div className="grid grid-cols-4 gap-2">
                                <div>
                                    <label className={labelCls}>Settled ρ (lb/ft³)</label>
                                    <input type="number" min="0" step="any" value={inputs.density} placeholder="e.g. 45"
                                        className={inputCls} onChange={(e) => upd({ density: e.target.value })} />
                                </div>
                                <div>
                                    <label className={labelCls}>Pkg L (in)</label>
                                    <input type="number" min="0" step="any" value={inputs.pkgL}
                                        className={inputCls} onChange={(e) => upd({ pkgL: e.target.value })} />
                                </div>
                                <div>
                                    <label className={labelCls}>W (in)</label>
                                    <input type="number" min="0" step="any" value={inputs.pkgW}
                                        className={inputCls} onChange={(e) => upd({ pkgW: e.target.value })} />
                                </div>
                                <div>
                                    <label className={labelCls}>H (in)</label>
                                    <input type="number" min="0" step="any" value={inputs.pkgH}
                                        className={inputCls} onChange={(e) => upd({ pkgH: e.target.value })} />
                                </div>
                                <div>
                                    <label className={labelCls}>Fill %</label>
                                    <input type="number" min="1" max="100" step="any" value={inputs.fillPct}
                                        className={inputCls} onChange={(e) => upd({ fillPct: e.target.value })} />
                                </div>
                            </div>
                            <div className="text-[10px] text-text-muted">
                                A box is a fixed volume: settled density × inside volume × fill → weight per package →
                                packages/hr. An entered package weight overrides the derived one. Real fills run 85–95%.
                                Conveying the product loose instead? Switch to Bulk above.
                            </div>
                        </div>
                    </details>
                )}

                {result ? (
                    <div className="rounded-lg border border-primary/20 bg-dark-700 px-3 py-3 space-y-2">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="bg-dark-800 rounded px-2.5 py-2">
                                <div className="text-text-muted uppercase text-[10px]">Weight / Minute</div>
                                <div className="font-mono text-sm text-primary font-semibold">{result.lbPerMin.toFixed(2)} lb/min</div>
                            </div>
                            <div className="bg-dark-800 rounded px-2.5 py-2">
                                <div className="text-text-muted uppercase text-[10px]">
                                    Throughput{result.throughputSource === 'per-day' ? ' (from lb/day)' : result.throughputSource === 'pieces' ? ' (derived)' : result.throughputSource === 'volume' ? ' (from ft³/hr)' : ''}
                                </div>
                                <div className="font-mono text-sm text-text-primary">{result.throughputLbHr.toFixed(0)} lb/hr</div>
                            </div>
                            {result.ft3PerHr !== null && (
                                <div className="bg-dark-800 rounded px-2.5 py-2">
                                    <div className="text-text-muted uppercase text-[10px]">Volume Rate</div>
                                    <div className="font-mono text-sm text-text-primary">{result.ft3PerHr.toFixed(1)} ft³/hr</div>
                                </div>
                            )}
                            {result.pieceWeightLb !== null && (
                                <div className="bg-dark-800 rounded px-2.5 py-2">
                                    <div className="text-text-muted uppercase text-[10px]">
                                        Pkg Weight{result.pieceWeightSource === 'dims' ? ' (dims × density)' : result.pieceWeightSource === 'rate' ? ' (derived)' : ''}
                                    </div>
                                    <div className="font-mono text-sm text-text-primary">{result.pieceWeightLb.toFixed(2)} lb</div>
                                </div>
                            )}
                            {result.ppm !== null && (
                                <div className="bg-dark-800 rounded px-2.5 py-2">
                                    <div className="text-text-muted uppercase text-[10px]">
                                        {result.pieceWeightSource && result.pieceWeightSource !== 'rate' ? "Req'd Packager Speed" : 'Packages / Min · Hr'}
                                    </div>
                                    <div className="font-mono text-sm text-primary font-semibold">
                                        {result.ppm.toFixed(1)}/min <span className="text-text-muted">·</span> {result.packagesPerHour!.toFixed(0)}/hr
                                    </div>
                                </div>
                            )}
                            {result.lbPerFt !== null && (
                                <div className="bg-dark-800 rounded px-2.5 py-2">
                                    <div className="text-text-muted uppercase text-[10px]">Belt Loading</div>
                                    <div className="font-mono text-sm text-primary font-semibold">{result.lbPerFt.toFixed(2)} lb/ft</div>
                                </div>
                            )}
                            {result.pitchIn !== null && (
                                <div className="bg-dark-800 rounded px-2.5 py-2">
                                    <div className="text-text-muted uppercase text-[10px]">Package Pitch</div>
                                    <div className="font-mono text-sm text-text-primary">
                                        {result.pitchIn.toFixed(1)} in ({result.piecesPerFt!.toFixed(2)}/ft)
                                    </div>
                                </div>
                            )}
                            {result.bedDepthNeededIn !== null && (
                                <div className="bg-dark-800 rounded px-2.5 py-2">
                                    <div className="text-text-muted uppercase text-[10px]">Bed Depth Needed</div>
                                    <div className="font-mono text-sm text-text-primary">{result.bedDepthNeededIn.toFixed(2)} in at speed</div>
                                </div>
                            )}
                        </div>
                        {result.bedCapacityLbHr !== null && result.bedUtilizationPct !== null && (
                            <div className={`px-2.5 py-2 border-l-2 rounded text-xs ${utilCls(result.bedUtilizationPct)}`}>
                                Bed carries <span className="font-mono font-semibold">{result.bedCapacityLbHr.toFixed(0)} lb/hr</span> at{' '}
                                {parse(inputs.speed)!.toFixed(0)} ft/min — demand is{' '}
                                <span className="font-mono font-semibold">{result.bedUtilizationPct.toFixed(0)}%</span> of that.{' '}
                                {result.bedUtilizationPct > 100
                                    ? 'The bed cannot keep up — deepen it, widen the belt, or run faster.'
                                    : result.bedUtilizationPct >= 80
                                    ? 'Tight — surges and uneven feed will overflow the edges.'
                                    : 'Comfortable headroom.'}
                            </div>
                        )}
                        {result.packagerUtilizationPct !== null && (
                            <div className={`px-2.5 py-2 border-l-2 rounded text-xs ${utilCls(result.packagerUtilizationPct)}`}>
                                Packager runs at <span className="font-mono font-semibold">{result.packagerUtilizationPct.toFixed(0)}%</span> of
                                its theoretical max ({result.ppm!.toFixed(1)} of {parse(inputs.ratedPpm)!.toFixed(1)}/min).{' '}
                                {result.packagerUtilizationPct > 100
                                    ? 'It cannot keep up — the process outruns it; needs a faster packager or a second line.'
                                    : result.packagerUtilizationPct >= 80
                                    ? 'Tight — theoretical max leaves no allowance for changeover, jams, or downtime.'
                                    : 'Comfortable headroom.'}
                            </div>
                        )}
                        {result.consistencyWarning && (
                            <div className="px-2.5 py-2 bg-warning/10 border-l-2 border-warning rounded text-xs text-warning">
                                {result.consistencyWarning}
                            </div>
                        )}
                        <div className="text-[10px] text-text-muted">
                            This product definition is live on the Conveyor Spec card and rides along when either card sends to Belt Pull.
                        </div>
                        {result.lbPerFt !== null ? (
                            <button onClick={send}
                                className="w-full px-3 py-2 rounded-lg text-xs border border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center justify-center gap-1.5">
                                Send to Belt Pull <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                        ) : (
                            <div className="text-[10px] text-text-muted">
                                Enter belt speed to get lb/ft and feed the Belt Pull solver.
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-xs text-text-muted">
                        {isBulk
                            ? 'Enter a rate — lb/hr, ft³/hr with loose density, or lb/day — to convert.'
                            : 'Enter a throughput — or package weight plus packages/minute — to convert.'}
                    </div>
                )}
            </div>
        </div>
    )
}
