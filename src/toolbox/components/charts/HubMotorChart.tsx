import { useState, useMemo } from 'react'
import { hubMotorData, interpolateMotorSpecs, checkMotorFit, getAllMotorsAtWidth, selectHubMotor } from '@/toolbox/data/hubMotorData'
import { PinButton } from '@/toolbox/components/ui/PinButton'
import { useAppStore } from '@/toolbox/stores/appStore'

export function HubMotorChart() {
    const pinned = useAppStore((s) => s.pinnedCharts.includes('hubmotor'))
    const togglePin = useAppStore((s) => s.togglePinChart)
    const [isMetric, setIsMetric] = useState(true)
    const [width, setWidth] = useState('')
    const [torqueFilter, setTorqueFilter] = useState('')
    const [selectedSeries, setSelectedSeries] = useState('')

    const widthMm = useMemo(() => {
        const w = parseFloat(width)
        if (isNaN(w) || w <= 0) return 0
        return isMetric ? w : w * 25.4
    }, [width, isMetric])

    const motors = useMemo(() => {
        if (!widthMm) return hubMotorData as any[]
        return getAllMotorsAtWidth(widthMm)
    }, [widthMm])

    const filteredMotors = useMemo(() => {
        const tf = parseFloat(torqueFilter)
        if (isNaN(tf) || tf <= 0) return motors
        const torqueNm = isMetric ? tf : tf * 1.3558
        // With a width entered, motors are interpolated specs ({torque} at that width);
        // otherwise raw series data ({maxTorque}). Filter on the capacity that applies.
        return motors.filter((m: any) => (m.torque ?? m.maxTorque) >= torqueNm)
    }, [motors, torqueFilter, isMetric])

    const selectedMotor: any = useMemo(() => {
        if (!selectedSeries) return null
        const motor = (hubMotorData as any[]).find((m) => m.series === selectedSeries)
        if (!motor) return null
        if (widthMm) {
            const specs = interpolateMotorSpecs(motor, widthMm)
            const fit = checkMotorFit(motor, widthMm)
            return { ...motor, ...specs, fit }
        }
        return motor
    }, [selectedSeries, widthMm])

    // Recommendation: width + required torque -> best motor with 1.5x thermal safety factor
    const advice = useMemo(() => {
        const tf = parseFloat(torqueFilter)
        if (!widthMm || isNaN(tf) || tf <= 0) return null
        const torqueNm = isMetric ? tf : tf * 1.3558
        return selectHubMotor(torqueNm, widthMm)
    }, [widthMm, torqueFilter, isMetric])

    const toDisplay = (val: number | null | undefined, isForce?: boolean) => {
        if (val == null || isNaN(val)) return '—'
        if (!isMetric) {
            return isForce ? (val / 4.44822).toFixed(1) : (val / 1.3558).toFixed(2)
        }
        return val.toFixed(isForce ? 1 : 2)
    }

    return (
        <div className="bg-dark-800 border border-border rounded-xl">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text-primary">Hub Motor (MDR) Selection</h3>
                <PinButton pinned={pinned} onToggle={() => togglePin('hubmotor')} />
            </div>
            <div className="p-4 space-y-4">
                <div className="flex gap-2">
                    {[true, false].map((metric) => (
                        <button key={String(metric)} onClick={() => {
                            if (metric === isMetric) return
                            // Convert entered values so 450 mm doesn't silently become 450 in
                            const cvt = (val: string, factor: number) => {
                                const n = parseFloat(val)
                                if (isNaN(n)) return val
                                return String(parseFloat((metric ? n * factor : n / factor).toFixed(3)))
                            }
                            setWidth((v: string) => cvt(v, 25.4))
                            setTorqueFilter((v: string) => cvt(v, 1.3558))
                            setIsMetric(metric)
                        }}
                            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                                isMetric === metric ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-dark-900 text-text-secondary hover:border-text-muted'
                            }`}>
                            {metric ? 'Metric' : 'Imperial'}
                        </button>
                    ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs text-text-secondary uppercase mb-1 tracking-wider">Conveyor Width ({isMetric ? 'mm' : 'in'})</label>
                        <input type="number" value={width} onChange={(e) => setWidth(e.target.value)} placeholder="e.g. 450" min="0" step="any"
                            className="w-full px-3 py-2.5 bg-dark-900 border border-border rounded-lg text-text-primary font-mono text-sm focus:outline-none focus:border-primary" />
                    </div>
                    <div>
                        <label className="block text-xs text-text-secondary uppercase mb-1 tracking-wider">Min Torque ({isMetric ? 'N·m' : 'ft·lb'})</label>
                        <input type="number" value={torqueFilter} onChange={(e) => setTorqueFilter(e.target.value)} placeholder="Optional" min="0" step="any"
                            className="w-full px-3 py-2.5 bg-dark-900 border border-border rounded-lg text-text-primary font-mono text-sm focus:outline-none focus:border-primary" />
                    </div>
                </div>

                {/* Recommendation — requirement-first answer with safety-factor margin */}
                {advice && (
                    advice.recommended ? (
                        <div className={`rounded-lg px-3 py-2.5 border ${advice.recommended.meetsTorqueWithSafety ? 'bg-success/10 border-success/30' : 'bg-warning/10 border-warning/30'}`}>
                            <div className="text-xs text-text-muted uppercase mb-0.5">Recommended</div>
                            <div className={`text-sm font-mono font-semibold ${advice.recommended.meetsTorqueWithSafety ? 'text-success' : 'text-warning'}`}>
                                {advice.recommended.series} — {toDisplay(advice.recommended.torque)} {isMetric ? 'N·m' : 'ft·lb'} at this width ({advice.recommended.safetyFactor.toFixed(1)}× required)
                            </div>
                            <div className="text-xs text-text-secondary mt-0.5">
                                {advice.recommended.meetsTorqueWithSafety
                                    ? 'Meets the 1.5× thermal safety margin.'
                                    : 'Meets required torque but under the 1.5× thermal margin — expect duty-cycle limits.'}
                                {advice.alternatives.length > 0 && ` Alternatives: ${advice.alternatives.map((a: any) => a.series).join(', ')}.`}
                            </div>
                            <button onClick={() => setSelectedSeries(advice.recommended.series)}
                                className="mt-1 text-xs text-primary hover:text-primary-light transition-colors">View details →</button>
                        </div>
                    ) : (
                        <div className="rounded-lg px-3 py-2.5 border bg-error/10 border-error/30 text-xs">
                            <span className="text-error font-medium">No motor meets this torque at this width.</span>
                            {advice.nearMiss && (
                                <span className="text-text-secondary">
                                    {' '}Near miss: <span className="font-mono">{advice.nearMiss.series}</span>{' '}
                                    {advice.nearMiss.meetsTorque
                                        ? `has the torque but needs ${advice.nearMiss.minLength}–${advice.nearMiss.maxLength} mm width.`
                                        : `fits but delivers only ${toDisplay(advice.nearMiss.torque)} ${isMetric ? 'N·m' : 'ft·lb'}.`}
                                </span>
                            )}
                        </div>
                    )
                )}

                {/* Motor comparison table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                        <thead><tr className="text-text-muted border-b border-border">
                            <th className="py-2 text-left">Series</th>
                            <th className="py-2 text-left">Ø {isMetric ? 'mm' : 'in'}</th>
                            <th className="py-2 text-left">Torque {isMetric ? 'N·m' : 'ft·lb'}</th>
                            <th className="py-2 text-left">Belt Pull {isMetric ? 'N' : 'lbf'}</th>
                            {widthMm > 0 && <th className="py-2 text-left">Fit</th>}
                        </tr></thead>
                        <tbody>
                            {filteredMotors.map((m: any) => {
                                const fit = widthMm ? checkMotorFit(m, widthMm) : null
                                return (
                                    <tr key={m.series}
                                        onClick={() => setSelectedSeries(m.series === selectedSeries ? '' : m.series)}
                                        className={`border-b border-border/50 cursor-pointer transition-colors ${
                                            m.series === selectedSeries ? 'bg-primary/5' : 'hover:bg-dark-700'
                                        }`}>
                                        <td className="py-2 font-mono text-text-primary">{m.series}</td>
                                        <td className="py-2 font-mono text-text-secondary">{isMetric ? m.diameter : (m.diameter / 25.4).toFixed(1)}</td>
                                        <td className="py-2 font-mono text-text-secondary">{toDisplay(m.torque ?? m.maxTorque)}</td>
                                        <td className="py-2 font-mono text-text-secondary">{toDisplay(m.beltPull ?? m.maxBeltPull, true)}</td>
                                        {widthMm > 0 && (
                                            <td className="py-2">
                                                <span className={`text-xs ${fit === 'fits' ? 'text-success' : 'text-warning'}`}
                                                    title={fit === 'fits' ? 'Fits this width' : fit === 'too-narrow' ? `Conveyor narrower than motor minimum (${m.minLength} mm)` : `Conveyor wider than motor maximum (${m.maxLength} mm)`}>
                                                    {fit === 'fits' ? '✓' : fit === 'too-narrow' ? '⚠ under min' : '⚠ over max'}
                                                </span>
                                            </td>
                                        )}
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                {filteredMotors.length === 0 && (
                    <p className="text-center text-text-muted text-sm py-4">No motors match the filter criteria</p>
                )}

                {/* Selected motor detail */}
                {selectedMotor && (
                    <div className="bg-dark-700 rounded-lg px-3 py-3 mt-2">
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-sm font-semibold text-primary">{selectedMotor.series}</div>
                            {selectedMotor.fit && (
                                <span className={`text-xs px-2 py-0.5 rounded ${
                                    selectedMotor.fit === 'fits' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                                }`}>
                                    {selectedMotor.fit === 'fits' ? 'Fits' : 'Check Width'}
                                </span>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex justify-between"><span className="text-text-secondary">RPM (60Hz):</span><span className="font-mono text-text-primary">{selectedMotor.rpm60Hz}</span></div>
                            <div className="flex justify-between"><span className="text-text-secondary">Width Range:</span><span className="font-mono text-text-primary">{selectedMotor.minLength}-{selectedMotor.maxLength}mm</span></div>
                            <div className="flex justify-between"><span className="text-text-secondary">Torque:</span><span className="font-mono text-text-primary">{toDisplay(selectedMotor.torque ?? selectedMotor.maxTorque)} {isMetric ? 'N·m' : 'ft·lb'}</span></div>
                            <div className="flex justify-between"><span className="text-text-secondary">Peak Torque:</span><span className="font-mono text-text-primary">{toDisplay(selectedMotor.peakTorque ?? selectedMotor.maxPeakTorque)} {isMetric ? 'N·m' : 'ft·lb'}</span></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
