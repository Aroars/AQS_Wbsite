import { useState, useMemo, useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import { PinButton } from '@/toolbox/components/ui/PinButton'
import { showToast } from '@/toolbox/components/ui/Toast'
import { useAppStore } from '@/toolbox/stores/appStore'
import { calculateBeltLoad } from '@/toolbox/lib/calculators/beltLoad'

const inputCls = 'w-full px-2 py-2 bg-dark-900 border border-border rounded-lg text-text-primary font-mono text-sm focus:outline-none focus:border-primary'
const labelCls = 'block text-xs text-text-muted mb-1'

interface LoadInputs {
    throughput: string
    rateUnit: 'hr' | 'day'
    hrsPerDay: string
    ratedPpm: string
    speed: string
    pieceWeight: string
    ppm: string
    density: string
    pkgL: string
    pkgW: string
    pkgH: string
    fillPct: string
}

const emptyInputs: LoadInputs = {
    throughput: '', rateUnit: 'hr', hrsPerDay: '24', ratedPpm: '',
    speed: '', pieceWeight: '', ppm: '',
    density: '', pkgL: '', pkgW: '', pkgH: '', fillPct: '100',
}

function parse(v: string): number | null {
    const n = parseFloat(v)
    return isNaN(n) || n <= 0 ? null : n
}

export function BeltLoadCalculator() {
    const pinned = useAppStore((s) => s.pinnedCalculators.includes('beltLoad'))
    const togglePin = useAppStore((s) => s.togglePinCalculator)
    const setBeltLoadState = useAppStore((s) => s.setBeltLoadState)
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

    const result = useMemo(() => calculateBeltLoad({
        throughputLbHr: inputs.rateUnit === 'hr' ? parse(inputs.throughput) : null,
        throughputLbPerDay: inputs.rateUnit === 'day' ? parse(inputs.throughput) : null,
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
    }), [inputs])

    const send = () => {
        if (!result || result.lbPerFt === null) return
        sendToBeltPull({
            loadMode: 'rate',
            throughputLbHr: result.throughputLbHr,
            beltSpeedFpm: parse(inputs.speed),
        })
        showToast('Sent to Belt Pull — rate mode set')
    }

    return (
        <div className="bg-dark-800 border border-border rounded-xl">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text-primary">Belt Load / Throughput</h3>
                <PinButton pinned={pinned} onToggle={() => togglePin('beltLoad')} />
            </div>
            <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className={labelCls}>Process Rate</label>
                        <div className="flex gap-1">
                            <input type="number" min="0" step="any" value={inputs.throughput} placeholder="from the plant"
                                className={inputCls} onChange={(e) => upd({ throughput: e.target.value })} />
                            <select value={inputs.rateUnit}
                                onChange={(e) => upd({ rateUnit: e.target.value as 'hr' | 'day' })}
                                className="px-1.5 py-2 bg-dark-900 border border-border rounded-lg text-text-secondary text-xs focus:outline-none shrink-0">
                                <option value="hr">lb/hr</option>
                                <option value="day">lb/day</option>
                            </select>
                        </div>
                    </div>
                    {inputs.rateUnit === 'day' ? (
                        <div>
                            <label className={labelCls}>Operating Hrs/Day</label>
                            <input type="number" min="0.5" max="24" step="any" value={inputs.hrsPerDay}
                                className={inputCls} onChange={(e) => upd({ hrsPerDay: e.target.value })} />
                            <div className="text-[10px] text-text-muted mt-0.5">Production hours, not clock hours — two shifts ≈ 16.</div>
                        </div>
                    ) : (
                        <div>
                            <label className={labelCls}>Belt Speed (ft/min)</label>
                            <input type="number" min="0" step="any" value={inputs.speed} placeholder="optional"
                                className={inputCls} onChange={(e) => upd({ speed: e.target.value })} />
                        </div>
                    )}
                    {inputs.rateUnit === 'day' && (
                        <div>
                            <label className={labelCls}>Belt Speed (ft/min)</label>
                            <input type="number" min="0" step="any" value={inputs.speed} placeholder="optional"
                                className={inputCls} onChange={(e) => upd({ speed: e.target.value })} />
                        </div>
                    )}
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
                </div>

                {/* Bulk material: density-based throughput and dims-based package weight */}
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
                            Conveying bulk material loose? That lives in Belt Pull's Bulk (bed) mode — the conveyor's
                            bed × speed defines the rate, and loose density ≠ settled density (material bulks up).
                        </div>
                    </div>
                </details>

                {result ? (
                    <div className="rounded-lg border border-primary/20 bg-dark-700 px-3 py-3 space-y-2">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="bg-dark-800 rounded px-2.5 py-2">
                                <div className="text-text-muted uppercase text-[10px]">Weight / Minute</div>
                                <div className="font-mono text-sm text-primary font-semibold">{result.lbPerMin.toFixed(2)} lb/min</div>
                            </div>
                            <div className="bg-dark-800 rounded px-2.5 py-2">
                                <div className="text-text-muted uppercase text-[10px]">
                                    Throughput{result.throughputSource === 'per-day' ? ' (from lb/day)' : result.throughputSource === 'pieces' ? ' (derived)' : ''}
                                </div>
                                <div className="font-mono text-sm text-text-primary">{result.throughputLbHr.toFixed(0)} lb/hr</div>
                            </div>
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
                        </div>
                        {result.packagerUtilizationPct !== null && (
                            <div className={`px-2.5 py-2 border-l-2 rounded text-xs ${
                                result.packagerUtilizationPct > 100 ? 'bg-error/10 border-error text-error'
                                : result.packagerUtilizationPct >= 80 ? 'bg-warning/10 border-warning text-warning'
                                : 'bg-success/10 border-success text-success'
                            }`}>
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
                        Enter a throughput — or package weight plus packages/minute — to convert.
                    </div>
                )}
            </div>
        </div>
    )
}
