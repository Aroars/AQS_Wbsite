import { useState, useMemo } from 'react'
import { pressures, tubingSizes, getMetricBoreSizes, getImperialBoreSizes, getRodSizes, calculateExtendForce, calculateRetractForce, calculateCylinderSpeed, calculateStrokeTime, calculateAirConsumption, calculateLineFlow, formatBoreSize, formatRodSize } from '@/toolbox/data/pneumaticCylinderData'
import { PinButton } from '@/toolbox/components/ui/PinButton'
import { useAppStore } from '@/toolbox/stores/appStore'

export function PneumaticChart() {
    const pinned = useAppStore((s) => s.pinnedCharts.includes('pneumatic'))
    const togglePin = useAppStore((s) => s.togglePinChart)
    const [isMetric, setIsMetric] = useState(true)
    // Default to a common workhorse: 32mm bore, 12mm rod, 6 bar, 6mm tubing
    const [bore, setBore] = useState('32')
    const [rod, setRod] = useState('12')
    const [pressure, setPressure] = useState('6')
    const [stroke, setStroke] = useState('')
    const [tubingIdx, setTubingIdx] = useState('1')
    const [lineOutlet, setLineOutlet] = useState('')
    const [lineLength, setLineLength] = useState('')

    const bores = useMemo(() => isMetric ? getMetricBoreSizes() : getImperialBoreSizes(), [isMetric])
    const rods = useMemo(() => bore ? getRodSizes(bore, isMetric).map(String) : [], [bore, isMetric])
    const pressureOptions = isMetric ? pressures.metric : pressures.imperial
    const tubingOptions = isMetric ? tubingSizes.metric : tubingSizes.imperial

    const results = useMemo(() => {
        if (!bore || !rod || !pressure) return null
        const boreNum = parseFloat(bore)
        const rodNum = parseFloat(rod)
        const pressNum = parseFloat(pressure)
        if (isNaN(boreNum) || isNaN(rodNum) || isNaN(pressNum)) return null
        const extend = calculateExtendForce(boreNum, pressNum, isMetric)
        const retract = calculateRetractForce(boreNum, rodNum, pressNum, isMetric)
        return {
            extendForce: isMetric ? extend.newtons : extend.lbf,
            retractForce: isMetric ? retract.newtons : retract.lbf,
        }
    }, [bore, rod, pressure, isMetric])

    // Gauge vs absolute: pneumatic dials read gauge; free-air flow and consumption
    // are referenced to atmosphere (absolute) — the two are never the same number
    const pressureInfo = useMemo(() => {
        const p = parseFloat(pressure)
        if (isNaN(p)) return null
        const barG = isMetric ? p : p / 14.5038
        const barA = barG + 1.013
        return { barG, barA, psiG: barG * 14.5038, psiA: barA * 14.5038, cr: barA / 1.013 }
    }, [pressure, isMetric])

    // Line flow: what the tube can actually deliver from supply to the required
    // outlet pressure (Festo-style line sizing)
    const lineFlow = useMemo(() => {
        const pressNum = parseFloat(pressure)
        const out = parseFloat(lineOutlet)
        const len = parseFloat(lineLength)
        const tube = tubingOptions[parseInt(tubingIdx)]
        if (!tube || isNaN(pressNum) || isNaN(out) || isNaN(len) || len <= 0) return null
        const supplyBar = isMetric ? pressNum : pressNum / 14.5038
        const outBar = isMetric ? out : out / 14.5038
        const lenM = isMetric ? len : len * 0.3048
        const idMm = isMetric ? tube.id : tube.id * 25.4
        const r = calculateLineFlow(supplyBar, outBar, lenM, idMm)
        return r ? { ...r, idMm, outletModeUnits: out } : null
    }, [pressure, lineOutlet, lineLength, tubingIdx, tubingOptions, isMetric])

    // Real flow-based speeds: line-limited flow when the line section is filled in,
    // else the tubing's rated flow; cylinder sees outlet pressure after line drop
    const speedResults = useMemo(() => {
        if (!results || !stroke) return null
        const strokeNum = parseFloat(stroke)
        const tube = tubingOptions[parseInt(tubingIdx)]
        if (isNaN(strokeNum) || strokeNum <= 0 || !tube) return null
        const boreNum = parseFloat(bore)
        const rodNum = parseFloat(rod)
        const pressNum = lineFlow ? lineFlow.outletModeUnits : parseFloat(pressure)
        const flowScfm = lineFlow ? lineFlow.scfm : tube.maxFlow
        const ext = calculateCylinderSpeed(boreNum, rodNum, flowScfm, pressNum, isMetric, true)
        const ret = calculateCylinderSpeed(boreNum, rodNum, flowScfm, pressNum, isMetric, false)
        const extSpeed = isMetric ? ext.mmPerSec : ext.inPerSec
        const retSpeed = isMetric ? ret.mmPerSec : ret.inPerSec
        const air = calculateAirConsumption(boreNum, strokeNum, pressNum, isMetric)
        const extMmS = ext.mmPerSec
        // Simple guidance band: <50 mm/s reads tubing-starved, >800 mm/s needs flow control
        const speedNote = extMmS < 50
            ? { text: 'Slow — tubing is the bottleneck. Step up a tube ID for more speed.', cls: 'border-warning text-warning' }
            : extMmS > 800
            ? { text: 'Very fast — fit flow controls to avoid end-of-stroke slamming.', cls: 'border-warning text-warning' }
            : { text: 'Typical working speed range for this tubing and bore.', cls: 'border-success text-success' }
        return {
            extendSpeed: extSpeed,
            retractSpeed: retSpeed,
            extendTime: calculateStrokeTime(strokeNum, extSpeed),
            retractTime: calculateStrokeTime(strokeNum, retSpeed),
            airPerExtend: isMetric ? air.liters : air.cubicInches,
            speedNote,
            flowSource: lineFlow ? 'line' as const : 'rating' as const,
            flowScfm,
        }
    }, [results, stroke, tubingIdx, tubingOptions, bore, rod, pressure, isMetric, lineFlow])

    return (
        <div className="bg-dark-800 border border-border rounded-xl">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text-primary">Pneumatic Cylinder Sizing</h3>
                <PinButton pinned={pinned} onToggle={() => togglePin('pneumatic')} />
            </div>
            <div className="p-4 space-y-4">
                <div className="flex gap-2">
                    {[true, false].map((metric) => (
                        <button key={String(metric)} onClick={() => { setIsMetric(metric); setBore(''); setRod(''); setPressure('') }}
                            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                                isMetric === metric ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-dark-900 text-text-secondary hover:border-text-muted'
                            }`}>
                            {metric ? 'Metric' : 'Imperial'}
                        </button>
                    ))}
                </div>
                <div>
                    <label className="block text-xs text-text-secondary uppercase mb-1 tracking-wider">Bore Size</label>
                    <select value={bore} onChange={(e) => { setBore(e.target.value); setRod('') }}
                        className="w-full px-3 py-2.5 bg-dark-900 border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-primary">
                        <option value="">Select bore...</option>
                        {bores.map((b: string) => <option key={b} value={b}>{formatBoreSize(b, isMetric)}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-xs text-text-secondary uppercase mb-1 tracking-wider">Rod Size</label>
                    <select value={rod} onChange={(e) => setRod(e.target.value)} disabled={rods.length === 0}
                        className="w-full px-3 py-2.5 bg-dark-900 border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-primary disabled:opacity-50">
                        <option value="">Select rod...</option>
                        {rods.map((r: string) => <option key={r} value={r}>{formatRodSize(r, isMetric)}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-xs text-text-secondary uppercase mb-1 tracking-wider">Pressure (gauge)</label>
                    <select value={pressure} onChange={(e) => setPressure(e.target.value)}
                        className="w-full px-3 py-2.5 bg-dark-900 border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-primary">
                        <option value="">Select pressure...</option>
                        {pressureOptions.map((p: any) => <option key={p.value} value={p.value}>{p.label}</option>)}
                    </select>
                    {pressureInfo && (
                        <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                            <div className="bg-dark-900 rounded-lg px-2.5 py-2 border-l-2 border-primary">
                                <div className="text-text-muted uppercase text-[10px]">Gauge</div>
                                <div className="font-mono text-text-primary">{pressureInfo.barG.toFixed(1)} bar(g) · {pressureInfo.psiG.toFixed(1)} psig</div>
                            </div>
                            <div className="bg-dark-900 rounded-lg px-2.5 py-2 border-l-2 border-text-muted">
                                <div className="text-text-muted uppercase text-[10px]">Absolute (+1 atm)</div>
                                <div className="font-mono text-text-primary">{pressureInfo.barA.toFixed(2)} bar(a) · {pressureInfo.psiA.toFixed(1)} psia</div>
                            </div>
                            <div className="col-span-2 text-[10px] text-text-muted">
                                Force uses gauge pressure; free-air flow and consumption use absolute (×{pressureInfo.cr.toFixed(1)} compression).
                            </div>
                        </div>
                    )}
                </div>
                {results && (
                    <div className="grid grid-cols-2 gap-3 mt-2">
                        <div className="bg-dark-700 rounded-lg px-3 py-3 text-center">
                            <div className="text-xs text-text-muted uppercase">Extend Force</div>
                            <div className="font-mono text-lg font-semibold text-primary">{results.extendForce?.toFixed(1)} {isMetric ? 'N' : 'lbf'}</div>
                        </div>
                        <div className="bg-dark-700 rounded-lg px-3 py-3 text-center">
                            <div className="text-xs text-text-muted uppercase">Retract Force</div>
                            <div className="font-mono text-lg font-semibold text-primary">{results.retractForce?.toFixed(1)} {isMetric ? 'N' : 'lbf'}</div>
                        </div>
                    </div>
                )}
                {results && (
                    <div className="border-t border-border pt-3 grid grid-cols-1 @md:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs text-text-secondary uppercase mb-1 tracking-wider">Stroke Length ({isMetric ? 'mm' : 'in'})</label>
                            <input type="number" value={stroke} onChange={(e) => setStroke(e.target.value)} placeholder="Enter stroke" min="0" step="any"
                                className="w-full px-3 py-2.5 bg-dark-900 border border-border rounded-lg text-text-primary font-mono text-sm focus:outline-none focus:border-primary" />
                        </div>
                        <div>
                            <label className="block text-xs text-text-secondary uppercase mb-1 tracking-wider">Supply Tubing</label>
                            <select value={tubingIdx} onChange={(e) => setTubingIdx(e.target.value)}
                                className="w-full px-3 py-2.5 bg-dark-900 border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-primary">
                                {tubingOptions.map((t: any, i: number) => <option key={t.label} value={i}>{t.label}</option>)}
                            </select>
                        </div>
                    </div>
                )}
                {/* Line flow & pressure drop — Festo-style: what can this tube actually deliver? */}
                {results && (
                    <div className="border-t border-border pt-3 space-y-2">
                        <div className="text-xs text-text-secondary uppercase tracking-wider">Line Flow & Pressure Drop</div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs text-text-muted mb-1">Required at Cylinder ({isMetric ? 'bar g' : 'psig'})</label>
                                <input type="number" value={lineOutlet} onChange={(e) => setLineOutlet(e.target.value)}
                                    placeholder={isMetric ? 'e.g. 4' : 'e.g. 60'} min="0" step="any"
                                    className="w-full px-3 py-2 bg-dark-900 border border-border rounded-lg text-text-primary font-mono text-sm focus:outline-none focus:border-primary" />
                            </div>
                            <div>
                                <label className="block text-xs text-text-muted mb-1">Line Length ({isMetric ? 'm' : 'ft'})</label>
                                <input type="number" value={lineLength} onChange={(e) => setLineLength(e.target.value)}
                                    placeholder={isMetric ? 'e.g. 2' : 'e.g. 6'} min="0" step="any"
                                    className="w-full px-3 py-2 bg-dark-900 border border-border rounded-lg text-text-primary font-mono text-sm focus:outline-none focus:border-primary" />
                            </div>
                        </div>
                        {lineFlow && (
                            <div className="rounded-lg border border-primary/20 bg-dark-700 px-3 py-2.5 space-y-1.5">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-xs text-text-muted uppercase">Deliverable Flow</span>
                                    <span className="font-mono text-lg font-semibold text-primary">
                                        {isMetric ? `${lineFlow.lpm.toFixed(0)} l/min` : `${lineFlow.scfm.toFixed(1)} SCFM`}
                                    </span>
                                    <span className="font-mono text-xs text-text-muted">
                                        free air ({isMetric ? `${lineFlow.scfm.toFixed(1)} SCFM` : `${lineFlow.lpm.toFixed(0)} l/min`})
                                    </span>
                                </div>
                                <div className="text-xs font-mono text-text-secondary">
                                    {(lineFlow.supplyAbsBar - 1.013).toFixed(1)} bar(g)/{lineFlow.supplyAbsBar.toFixed(2)} bar(a)
                                    {' → '}
                                    {(lineFlow.outletAbsBar - 1.013).toFixed(1)} bar(g)/{lineFlow.outletAbsBar.toFixed(2)} bar(a)
                                </div>
                                <div className="text-xs font-mono text-text-muted">
                                    Δp {isMetric ? `${lineFlow.dropBar.toFixed(2)} bar` : `${(lineFlow.dropBar * 14.5038).toFixed(1)} psi`} (same in gauge or absolute) · {lineFlow.idMm.toFixed(1)} mm ID · {lineFlow.velocity.toFixed(0)} m/s
                                </div>
                                {lineFlow.choked && (
                                    <div className="text-xs text-error">
                                        Outlet is below the critical pressure ratio (0.528×supply) — flow is sonic-limited; treat this as an upper-bound estimate.
                                    </div>
                                )}
                                {!lineFlow.choked && lineFlow.velocity > 100 && (
                                    <div className="text-xs text-warning">
                                        Very high line velocity — expect extra losses from every fitting and elbow.
                                    </div>
                                )}
                                <div className="text-[10px] text-text-muted">
                                    Isothermal pipe-flow estimate incl. fitting allowance (±10% vs manufacturer data). Speeds below now use this flow and the outlet pressure.
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {speedResults && (
                    <>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-dark-700 rounded-lg px-3 py-3 text-center">
                                <div className="text-xs text-text-muted uppercase">Extend</div>
                                <div className="font-mono font-semibold text-text-primary">{speedResults.extendTime?.toFixed(2)}s</div>
                                <div className="text-xs text-text-muted font-mono">{speedResults.extendSpeed?.toFixed(0)} {isMetric ? 'mm/s' : 'in/s'}</div>
                            </div>
                            <div className="bg-dark-700 rounded-lg px-3 py-3 text-center">
                                <div className="text-xs text-text-muted uppercase">Retract</div>
                                <div className="font-mono font-semibold text-text-primary">{speedResults.retractTime?.toFixed(2)}s</div>
                                <div className="text-xs text-text-muted font-mono">{speedResults.retractSpeed?.toFixed(0)} {isMetric ? 'mm/s' : 'in/s'}</div>
                            </div>
                        </div>
                        <div className={`px-3 py-2 bg-dark-900/50 border-l-2 rounded text-xs ${speedResults.speedNote.cls}`}>
                            {speedResults.speedNote.text}
                        </div>
                        <div className="text-xs text-text-muted">
                            Air per extend stroke: <span className="font-mono text-text-secondary">{speedResults.airPerExtend?.toFixed(2)} {isMetric ? 'L' : 'in³'}</span> free air.
                            Flow basis: <span className="font-mono text-text-secondary">{speedResults.flowScfm.toFixed(1)} SCFM</span>{' '}
                            {speedResults.flowSource === 'line'
                                ? 'from the line calc above (at outlet pressure).'
                                : 'from the tubing rating — fill in the line calc for the run-specific number.'}
                            {' '}Speeds are no-load — allow 20–30% margin under load.
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
