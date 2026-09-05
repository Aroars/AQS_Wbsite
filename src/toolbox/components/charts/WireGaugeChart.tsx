import { useState, useMemo } from 'react'
import { awgData, metricData, ampacityData, metricAmpacityData, insulationInfo, voltageOptions, getAwgInsulationTypes, getMetricInsulationTypes } from '@/toolbox/data/wireGaugeData'
import { PinButton } from '@/toolbox/components/ui/PinButton'
import { useAppStore } from '@/toolbox/stores/appStore'

export function WireGaugeChart() {
    const pinned = useAppStore((s) => s.pinnedCharts.includes('wiregauge'))
    const togglePin = useAppStore((s) => s.togglePinChart)
    const [isAwg, setIsAwg] = useState(true)
    // Default to the everyday lookup: 12 AWG THHN
    const [wireSize, setWireSize] = useState('12')
    const [insulation, setInsulation] = useState('THHN')
    const [vdLength, setVdLength] = useState('')
    const [vdCurrent, setVdCurrent] = useState('')
    const [vdVoltage, setVdVoltage] = useState('120')
    const [vdPhase, setVdPhase] = useState<'single' | 'three'>('single')

    const data: any = isAwg ? awgData : metricData
    const sizes = Object.keys(data)
    const wireInfo = wireSize ? data[wireSize] : null
    // Only offer insulation types that exist in the active mode's ampacity table
    const insulationTypes = isAwg ? getAwgInsulationTypes() : getMetricInsulationTypes()
    const ampData: any = isAwg ? ampacityData : metricAmpacityData

    const ampacity = useMemo(() => {
        if (!wireSize || !insulation || !ampData?.[wireSize]) return null
        return ampData[wireSize]?.[insulation] ?? null
    }, [wireSize, insulation, ampData])

    const voltageDrop = useMemo(() => {
        if (!wireInfo || !vdLength || !vdCurrent || !vdVoltage) return null
        const len = parseFloat(vdLength)
        const current = parseFloat(vdCurrent)
        const voltage = parseFloat(vdVoltage)
        if (isNaN(len) || isNaN(current) || isNaN(voltage) || voltage === 0) return null
        const resistance = isAwg ? wireInfo.resistance_ohm_per_1000ft : wireInfo.resistance_ohm_per_km
        const factor = isAwg ? len / 1000 : len / 1000
        const k = vdPhase === 'three' ? Math.sqrt(3) : 2
        const drop = k * resistance * factor * current
        const pct = (drop / voltage) * 100
        return { drop: drop.toFixed(2), pct: pct.toFixed(2), status: pct < 3 ? 'ok' : pct < 5 ? 'warning' : 'error' }
    }, [wireInfo, vdLength, vdCurrent, vdVoltage, vdPhase, isAwg])

    // Cross-standard equivalence: closest size in the other system by conductor area
    const crossEquivalent = useMemo(() => {
        if (!wireInfo) return null
        if (!isAwg) {
            return wireInfo.awg_equivalent
                ? `≈ ${wireInfo.awg_equivalent} AWG${wireInfo.exact_match ? ' (exact)' : ''}`
                : null
        }
        let best: any = null
        for (const [key, m] of Object.entries(metricData as Record<string, any>)) {
            const diff = Math.abs(m.area_mm2 - wireInfo.area_mm2)
            if (!best || diff < best.diff) best = { key, m, diff }
        }
        if (!best) return null
        const pctDiff = ((best.m.area_mm2 - wireInfo.area_mm2) / wireInfo.area_mm2) * 100
        return `≈ ${best.m.label} (${pctDiff >= 0 ? '+' : ''}${pctDiff.toFixed(0)}% area)`
    }, [wireInfo, isAwg])

    // Reverse lookup: smallest wire that carries the load AND keeps voltage drop in spec
    const recommendation = useMemo(() => {
        if (!insulation || !vdCurrent || !vdLength || !vdVoltage) return null
        const current = parseFloat(vdCurrent)
        const len = parseFloat(vdLength)
        const voltage = parseFloat(vdVoltage)
        if (isNaN(current) || current <= 0 || isNaN(len) || len <= 0 || isNaN(voltage) || voltage <= 0) return null
        const k = vdPhase === 'three' ? Math.sqrt(3) : 2
        const candidates = sizes
            .map((s) => {
                const info = data[s]
                const amp = ampData?.[s]?.[insulation]
                if (amp == null || !info) return null
                const resistance = isAwg ? info.resistance_ohm_per_1000ft : info.resistance_ohm_per_km
                const pct = (k * resistance * (len / 1000) * current / voltage) * 100
                return { size: s, label: info.label ?? s, amp, pct, area: info.area_mm2 }
            })
            .filter((c): c is NonNullable<typeof c> => c !== null)
            .sort((a, b) => a.area - b.area)
        const ideal = candidates.find((c) => c.amp >= current && c.pct <= 3)
        const loose = candidates.find((c) => c.amp >= current && c.pct <= 5)
        return { pick: ideal ?? loose ?? null, strict: !!ideal, current, len }
    }, [insulation, vdCurrent, vdLength, vdVoltage, vdPhase, sizes, data, ampData, isAwg])

    return (
        <div className="bg-dark-800 border border-border rounded-xl">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text-primary">Wire Gauge & Ampacity</h3>
                <PinButton pinned={pinned} onToggle={() => togglePin('wiregauge')} />
            </div>
            <div className="p-4 space-y-4">
                <div className="flex gap-2">
                    {[true, false].map((awg) => (
                        <button key={String(awg)} onClick={() => {
                            if (awg === isAwg) return
                            setIsAwg(awg)
                            setWireSize('')
                            setInsulation('')
                            // Voltage systems differ (120/480 vs 230/400): reset to the new mode's default
                            setVdVoltage(String(voltageOptions[awg ? 'imperial' : 'metric'][0].value))
                        }}
                            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                                isAwg === awg ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-dark-900 text-text-secondary hover:border-text-muted'
                            }`}>
                            {awg ? 'AWG' : 'Metric'}
                        </button>
                    ))}
                </div>
                <div>
                    <label className="block text-xs text-text-secondary uppercase mb-1 tracking-wider">Wire Size</label>
                    <select value={wireSize} onChange={(e) => setWireSize(e.target.value)}
                        className="w-full px-3 py-2.5 bg-dark-900 border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-primary">
                        <option value="">Select size...</option>
                        {sizes.map((s) => <option key={s} value={s}>{data[s]?.label ?? s}</option>)}
                    </select>
                </div>
                {wireInfo && (
                    <div className="bg-dark-700 rounded-lg px-3 py-3">
                        <div className="text-xs text-text-muted uppercase mb-2">Wire Specifications</div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex justify-between"><span className="text-text-secondary">Diameter:</span><span className="font-mono text-text-primary">{wireInfo.diameter_mm} mm</span></div>
                            <div className="flex justify-between"><span className="text-text-secondary">Area:</span><span className="font-mono text-text-primary">{wireInfo.area_mm2} mm²</span></div>
                            <div className="flex justify-between"><span className="text-text-secondary">Resistance:</span>
                                <span className="font-mono text-text-primary">{isAwg ? `${wireInfo.resistance_ohm_per_1000ft} Ω/kft` : `${wireInfo.resistance_ohm_per_km} Ω/km`}</span>
                            </div>
                            {crossEquivalent && (
                                <div className="flex justify-between"><span className="text-text-secondary">{isAwg ? 'Metric:' : 'AWG:'}</span>
                                    <span className="font-mono text-primary">{crossEquivalent}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                {wireSize && (
                    <div>
                        <label className="block text-xs text-text-secondary uppercase mb-1 tracking-wider">Insulation Type</label>
                        <select value={insulation} onChange={(e) => setInsulation(e.target.value)}
                            className="w-full px-3 py-2.5 bg-dark-900 border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-primary">
                            <option value="">Select insulation...</option>
                            {insulationTypes.map((t) => <option key={t} value={t}>{t} — {(insulationInfo as any)[t]?.temp ?? ''}</option>)}
                        </select>
                    </div>
                )}
                {ampacity !== null && (
                    <div className="bg-primary/5 border border-primary/20 rounded-lg px-3 py-3 text-center">
                        <div className="text-xs text-text-muted uppercase">Ampacity</div>
                        <div className="font-mono text-xl font-semibold text-primary">{ampacity} A</div>
                    </div>
                )}

                {/* Voltage drop calculator */}
                {wireSize && (
                    <div className="border-t border-border pt-3 space-y-3">
                        <div className="text-xs text-text-secondary uppercase tracking-wider">Voltage Drop Calculator</div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs text-text-muted mb-1">Length ({isAwg ? 'ft' : 'm'})</label>
                                <input type="number" value={vdLength} onChange={(e) => setVdLength(e.target.value)} placeholder="0" min="0" step="any"
                                    className="w-full px-3 py-2 bg-dark-900 border border-border rounded-lg text-text-primary font-mono text-sm focus:outline-none focus:border-primary" />
                            </div>
                            <div>
                                <label className="block text-xs text-text-muted mb-1">Current (A)</label>
                                <input type="number" value={vdCurrent} onChange={(e) => setVdCurrent(e.target.value)} placeholder="0" min="0" step="any"
                                    className="w-full px-3 py-2 bg-dark-900 border border-border rounded-lg text-text-primary font-mono text-sm focus:outline-none focus:border-primary" />
                            </div>
                            <div>
                                <label className="block text-xs text-text-muted mb-1">Voltage</label>
                                <select value={vdVoltage} onChange={(e) => setVdVoltage(e.target.value)}
                                    className="w-full px-2 py-2 bg-dark-900 border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-primary">
                                    {((isAwg ? voltageOptions.imperial : voltageOptions.metric) ?? []).map((v: any) => <option key={v.value} value={v.value}>{v.label}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-text-muted mb-1">Phase</label>
                                <select value={vdPhase} onChange={(e) => setVdPhase(e.target.value as any)}
                                    className="w-full px-2 py-2 bg-dark-900 border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-primary">
                                    <option value="single">1φ</option>
                                    <option value="three">3φ</option>
                                </select>
                            </div>
                        </div>
                        {voltageDrop && (
                            <div className={`rounded-lg px-3 py-3 ${
                                voltageDrop.status === 'ok' ? 'bg-success/10 border border-success/30' :
                                voltageDrop.status === 'warning' ? 'bg-warning/10 border border-warning/30' :
                                'bg-error/10 border border-error/30'
                            }`}>
                                <div className="text-center">
                                    <div className="text-xs text-text-muted uppercase">Voltage Drop</div>
                                    <div className={`font-mono text-lg font-semibold ${
                                        voltageDrop.status === 'ok' ? 'text-success' : voltageDrop.status === 'warning' ? 'text-warning' : 'text-error'
                                    }`}>
                                        {voltageDrop.drop}V ({voltageDrop.pct}%)
                                    </div>
                                </div>
                                <div className="text-xs text-text-secondary mt-2 leading-relaxed">
                                    {voltageDrop.status === 'ok'
                                        ? 'Within NEC recommended limits. Voltage drop under 3% is ideal for branch circuits — equipment will operate at full efficiency.'
                                        : voltageDrop.status === 'warning'
                                        ? 'Acceptable but not ideal (3-5%). NEC allows up to 5% total for feeder + branch. Consider upsizing wire for long runs or sensitive equipment.'
                                        : 'Exceeds NEC 5% limit. Equipment may underperform, motors may overheat, and sensitive electronics could malfunction. Use a larger wire gauge or shorter run.'}
                                </div>
                            </div>
                        )}

                        {/* Reverse lookup: requirement-first answer */}
                        {recommendation && (
                            recommendation.pick ? (
                                <div className={`rounded-lg px-3 py-2.5 border ${recommendation.strict ? 'bg-success/10 border-success/30' : 'bg-warning/10 border-warning/30'}`}>
                                    <div className="text-xs text-text-muted uppercase mb-0.5">
                                        Smallest wire for {recommendation.current} A over {recommendation.len} {isAwg ? 'ft' : 'm'}
                                    </div>
                                    <div className={`text-sm font-mono font-semibold ${recommendation.strict ? 'text-success' : 'text-warning'}`}>
                                        {recommendation.pick.label} — {recommendation.pick.amp} A ampacity, {recommendation.pick.pct.toFixed(1)}% drop
                                    </div>
                                    {!recommendation.strict && (
                                        <div className="text-xs text-warning mt-0.5">Drop is in the 3–5% band — fine per NEC total budget, upsize for sensitive loads.</div>
                                    )}
                                    {recommendation.pick.size !== wireSize && (
                                        <button onClick={() => setWireSize(recommendation.pick!.size)}
                                            className="mt-1.5 text-xs text-primary hover:text-primary-light transition-colors">
                                            Select {recommendation.pick.label} →
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="rounded-lg px-3 py-2.5 border bg-error/10 border-error/30 text-xs text-error">
                                    No {isAwg ? 'AWG' : 'metric'} size with {insulation} passes {recommendation.current} A at this length — shorten the run, raise voltage, or parallel conductors.
                                </div>
                            )
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
