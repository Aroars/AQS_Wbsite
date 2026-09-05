import { useState, useMemo } from 'react'
import { guardOpenings, clearanceData, riskAssessment, calculateSafetyDistance, calculateNoiseTWA, safetyDistanceConstants } from '@/toolbox/data/safetyData'
import { PinButton } from '@/toolbox/components/ui/PinButton'
import { useAppStore } from '@/toolbox/stores/appStore'

type Section = 'distance' | 'guard' | 'estop' | 'clearance' | 'risk' | 'noise'

export function SafetyChart() {
    const pinned = useAppStore((s) => s.pinnedCharts.includes('safety'))
    const togglePin = useAppStore((s) => s.togglePinChart)
    const [section, setSection] = useState<Section>('distance')

    // Safety Distance state (guardType keys into safetyDistanceConstants.penetrationFactors)
    const [standard, setStandard] = useState('iso')
    const [guardType, setGuardType] = useState('lightCurtain14')
    const [responseTime, setResponseTime] = useState('50')

    // Risk PLr state
    const [severity, setSeverity] = useState('S1')
    const [frequency, setFrequency] = useState('F1')
    const [possibility, setPossibility] = useState('P1')

    // Noise state
    const [noiseEntries, setNoiseEntries] = useState<{ dba: string; hours: string }[]>([{ dba: '', hours: '' }])

    const safetyDistance = useMemo(() => {
        const t = parseFloat(responseTime)
        if (isNaN(t) || t <= 0) return null
        try { return calculateSafetyDistance(t, guardType, standard) } catch { return null }
    }, [standard, guardType, responseTime])

    const plr = useMemo(() => {
        const key = `${severity}-${frequency}-${possibility}`
        return (riskAssessment as any)?.plrMatrix?.[key] ?? null
    }, [severity, frequency, possibility])

    const noiseTwa = useMemo(() => {
        const entries = noiseEntries
            .filter((e) => e.dba && e.hours)
            .map((e) => ({ dB: parseFloat(e.dba), hours: parseFloat(e.hours) }))
            .filter((e) => !isNaN(e.dB) && !isNaN(e.hours))
        if (entries.length === 0) return null
        try { return calculateNoiseTWA(entries) } catch { return null }
    }, [noiseEntries])

    const sections: { id: Section; label: string }[] = [
        { id: 'distance', label: 'Safety Distance' },
        { id: 'guard', label: 'Guard Openings' },
        { id: 'clearance', label: 'Clearances' },
        { id: 'risk', label: 'Risk (PLr)' },
        { id: 'noise', label: 'Noise' },
    ]

    return (
        <div className="bg-dark-800 border border-border rounded-xl">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text-primary">Safety & Compliance</h3>
                <PinButton pinned={pinned} onToggle={() => togglePin('safety')} />
            </div>
            <div className="p-4 space-y-4">
                {/* Section nav */}
                <div className="flex flex-wrap gap-1.5">
                    {sections.map((s) => (
                        <button key={s.id} onClick={() => setSection(s.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                                section === s.id ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-dark-900 text-text-secondary hover:border-text-muted'
                            }`}>
                            {s.label}
                        </button>
                    ))}
                </div>

                {/* Safety Distance */}
                {section === 'distance' && (
                    <div className="space-y-3">
                        <div className="grid grid-cols-1 @md:grid-cols-3 gap-3">
                            <div>
                                <label className="block text-xs text-text-muted mb-1">Standard</label>
                                <select value={standard} onChange={(e) => setStandard(e.target.value)}
                                    className="w-full px-2 py-2 bg-dark-900 border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-primary">
                                    <option value="iso">ISO 13855</option>
                                    <option value="osha">OSHA</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-text-muted mb-1">Guard Type</label>
                                <select value={guardType} onChange={(e) => setGuardType(e.target.value)}
                                    className="w-full px-2 py-2 bg-dark-900 border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-primary">
                                    {Object.entries(safetyDistanceConstants.penetrationFactors as Record<string, { value: number; label: string }>).map(([key, pf]) => (
                                        <option key={key} value={key}>
                                            {key.startsWith('lightCurtain') ? `Light Curtain — ${pf.label}` : pf.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-text-muted mb-1">Response (ms)</label>
                                <input type="number" value={responseTime} onChange={(e) => setResponseTime(e.target.value)} min="0" step="1"
                                    className="w-full px-2 py-2 bg-dark-900 border border-border rounded-lg text-text-primary font-mono text-sm focus:outline-none focus:border-primary" />
                            </div>
                        </div>
                        {safetyDistance && (
                            <div className="space-y-2">
                                <div className="bg-primary/5 border border-primary/20 rounded-lg px-4 py-3 text-center">
                                    <div className="text-xs text-text-muted uppercase">Minimum Safety Distance</div>
                                    <div className="font-mono text-2xl font-semibold text-primary">{safetyDistance.distance?.toFixed(safetyDistance.unit === 'in' ? 1 : 0)} {safetyDistance.unit}</div>
                                    <div className="text-xs text-text-muted mt-1">S = (K × T) + C = ({safetyDistance.K} × {safetyDistance.T}) + {safetyDistance.C}</div>
                                </div>
                                <div className="px-3 py-2 bg-primary/5 border-l-2 border-primary rounded text-xs text-text-secondary leading-relaxed">
                                    The safeguard must be at least <strong className="text-text-primary">{safetyDistance.distance?.toFixed(safetyDistance.unit === 'in' ? 1 : 0)} {safetyDistance.unit}</strong> from the nearest hazard point.
                                    {standard === 'osha'
                                        ? ` K = ${safetyDistance.K} in/s (hand speed constant per OSHA 1910.217).`
                                        : ` K = ${safetyDistance.K} mm/s (${guardType.startsWith('lightCurtain') ? 'hand/arm approach speed' : 'approach speed'} per ISO 13855), C = ${safetyDistance.C} mm penetration allowance.`}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Guard Openings */}
                {section === 'guard' && (
                    <div className="space-y-3">
                        <div className="text-xs text-text-secondary">Maximum permissible openings based on distance to hazard (ISO 13857 / OSHA 1910.217)</div>
                        {guardOpenings && (
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs">
                                    <thead><tr className="text-text-muted border-b border-border">
                                        <th className="py-2 text-left">Type</th>
                                        <th className="py-2 text-left">Opening (mm)</th>
                                        <th className="py-2 text-left">Min Distance</th>
                                        <th className="py-2 text-left">Reaches</th>
                                    </tr></thead>
                                    <tbody>
                                        {(guardOpenings as any)?.slotOpenings?.map((row: any, i: number) => (
                                            <tr key={i} className="border-b border-border/50">
                                                <td className="py-1.5 text-text-primary">Slot</td>
                                                <td className="py-1.5 font-mono text-text-secondary">{row.opening}</td>
                                                <td className="py-1.5 font-mono text-text-secondary">{row.safeDistance} mm</td>
                                                <td className="py-1.5 text-text-muted">{row.bodyPart}</td>
                                            </tr>
                                        ))}
                                        {(guardOpenings as any)?.squareOpenings?.map((row: any, i: number) => (
                                            <tr key={`sq-${i}`} className="border-b border-border/50">
                                                <td className="py-1.5 text-text-primary">Square</td>
                                                <td className="py-1.5 font-mono text-text-secondary">{row.opening}</td>
                                                <td className="py-1.5 font-mono text-text-secondary">{row.safeDistance} mm</td>
                                                <td className="py-1.5 text-text-muted">{row.bodyPart}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Clearances */}
                {section === 'clearance' && clearanceData && (
                    <div className="space-y-4">
                        {/* Electrical Panel Working Space */}
                        <div>
                            <div className="text-xs text-text-muted uppercase mb-2">Electrical Panel Working Space (NEC 110.26)</div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs">
                                    <thead><tr className="text-text-muted border-b border-border">
                                        <th className="py-2 text-left">Condition</th>
                                        <th className="py-2 text-left">Voltage</th>
                                        <th className="py-2 text-left">Depth</th>
                                    </tr></thead>
                                    <tbody>
                                        {Object.entries(clearanceData.electricalPanels.conditions).map(([cond, data]: any) => (
                                            data.voltages.map((v: any, vi: number) => (
                                                <tr key={`${cond}-${vi}`} className="border-b border-border/50">
                                                    {vi === 0 && <td className="py-1.5 text-text-primary" rowSpan={data.voltages.length}>Cond. {cond}</td>}
                                                    <td className="py-1.5 text-text-secondary">{v.range}</td>
                                                    <td className="py-1.5 font-mono text-text-primary">{v.depth.in}" ({v.depth.mm} mm)</td>
                                                </tr>
                                            ))
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-1.5 text-xs text-text-muted">Min width: {clearanceData.electricalPanels.minWidth.in}" ({clearanceData.electricalPanels.minWidth.mm} mm) &bull; Min height: {clearanceData.electricalPanels.minHeight.in}" ({clearanceData.electricalPanels.minHeight.mm} mm)</div>
                        </div>

                        {/* Aisle Widths */}
                        <div>
                            <div className="text-xs text-text-muted uppercase mb-2">Aisle Widths</div>
                            <div className="space-y-1">
                                {clearanceData.aisles.map((a: any, i: number) => (
                                    <div key={i} className="flex justify-between bg-dark-900 rounded px-3 py-1.5 text-sm">
                                        <span className="text-text-secondary">{a.type}</span>
                                        <span className="font-mono text-text-primary">{a.minWidth.in}" min ({a.recommended.in}" rec.)</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Machine / Equipment */}
                        <div>
                            <div className="text-xs text-text-muted uppercase mb-2">Machine & Equipment Clearances</div>
                            <div className="space-y-1">
                                {clearanceData.machineEquipment.map((m: any, i: number) => (
                                    <div key={i} className="flex justify-between bg-dark-900 rounded px-3 py-1.5 text-sm">
                                        <span className="text-text-secondary">{m.area}</span>
                                        <span className="font-mono text-text-primary">{m.clearance.in}" ({m.clearance.mm} mm)</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Cabinet Mounting */}
                        <div>
                            <div className="text-xs text-text-muted uppercase mb-2">Cabinet / Enclosure Mounting</div>
                            <div className="space-y-1">
                                {clearanceData.cabinetMounting.map((c: any, i: number) => (
                                    <div key={i} className="flex justify-between bg-dark-900 rounded px-3 py-1.5 text-sm">
                                        <span className="text-text-secondary">{c.type}</span>
                                        <span className="font-mono text-text-primary">Front: {c.front.in}" {c.rear.in > 0 ? `/ Rear: ${c.rear.in}"` : ''}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Risk PLr */}
                {section === 'risk' && (
                    <div className="space-y-3">
                        <div className="grid grid-cols-1 @md:grid-cols-3 gap-3">
                            <div>
                                <label className="block text-xs text-text-muted mb-1">Severity</label>
                                <select value={severity} onChange={(e) => setSeverity(e.target.value)}
                                    className="w-full px-2 py-2 bg-dark-900 border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-primary">
                                    <option value="S1">S1 - Slight</option>
                                    <option value="S2">S2 - Serious</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-text-muted mb-1">Frequency</label>
                                <select value={frequency} onChange={(e) => setFrequency(e.target.value)}
                                    className="w-full px-2 py-2 bg-dark-900 border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-primary">
                                    <option value="F1">F1 - Seldom</option>
                                    <option value="F2">F2 - Frequent</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-text-muted mb-1">Possibility</label>
                                <select value={possibility} onChange={(e) => setPossibility(e.target.value)}
                                    className="w-full px-2 py-2 bg-dark-900 border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-primary">
                                    <option value="P1">P1 - Possible</option>
                                    <option value="P2">P2 - Hardly</option>
                                </select>
                            </div>
                        </div>
                        {plr && (
                            <div className="space-y-2">
                                <div className="bg-warning/5 border border-warning/20 rounded-lg px-4 py-3 text-center">
                                    <div className="text-xs text-text-muted uppercase">Required Performance Level</div>
                                    <div className="font-mono text-2xl font-semibold text-warning">{plr}</div>
                                </div>
                                <div className="px-3 py-2 bg-primary/5 border-l-2 border-primary rounded text-xs text-text-secondary leading-relaxed">
                                    {plr === 'a' && 'Low risk — basic safety measures sufficient. Single-channel architecture with monitoring is typical.'}
                                    {plr === 'b' && 'Moderate risk — standard safety relay or basic safety PLC. Single-channel with diagnostics typically meets this level.'}
                                    {plr === 'c' && 'Significant risk — dual-channel safety architecture with cross-monitoring. Safety-rated PLCs or configurable safety relays recommended.'}
                                    {plr === 'd' && 'High risk — dual-channel with diagnostics, tested safety components, and automatic fault detection. Requires safety-rated controllers.'}
                                    {plr === 'e' && 'Highest risk — redundant dual-channel architecture with comprehensive diagnostics and diversity. Requires SIL 3 rated components.'}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Noise */}
                {section === 'noise' && (
                    <div className="space-y-3">
                        <div className="text-xs text-text-secondary">Enter noise exposures to calculate 8-hour TWA</div>
                        {noiseEntries.map((entry, i) => (
                            <div key={i} className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs text-text-muted mb-1">Level (dBA)</label>
                                    <input type="number" value={entry.dba} placeholder="85"
                                        onChange={(e) => {
                                            const arr = [...noiseEntries]
                                            arr[i] = { ...arr[i], dba: e.target.value }
                                            setNoiseEntries(arr)
                                        }}
                                        className="w-full px-2 py-2 bg-dark-900 border border-border rounded-lg text-text-primary font-mono text-sm focus:outline-none focus:border-primary" />
                                </div>
                                <div>
                                    <label className="block text-xs text-text-muted mb-1">Duration (hrs)</label>
                                    <input type="number" value={entry.hours} placeholder="8"
                                        onChange={(e) => {
                                            const arr = [...noiseEntries]
                                            arr[i] = { ...arr[i], hours: e.target.value }
                                            setNoiseEntries(arr)
                                        }}
                                        className="w-full px-2 py-2 bg-dark-900 border border-border rounded-lg text-text-primary font-mono text-sm focus:outline-none focus:border-primary" />
                                </div>
                            </div>
                        ))}
                        <button onClick={() => setNoiseEntries([...noiseEntries, { dba: '', hours: '' }])}
                            className="text-xs text-primary hover:text-primary-light transition-colors">+ Add exposure</button>
                        {noiseTwa !== null && (
                            <div className={`rounded-lg px-4 py-3 ${
                                !noiseTwa.exceedsActionLevel ? 'bg-success/10 border border-success/30' :
                                !noiseTwa.exceedsPEL ? 'bg-warning/10 border border-warning/30' :
                                'bg-error/10 border border-error/30'
                            }`}>
                                <div className="text-center">
                                    <div className="text-xs text-text-muted uppercase">8-Hour TWA</div>
                                    <div className={`font-mono text-2xl font-semibold ${
                                        !noiseTwa.exceedsActionLevel ? 'text-success' : !noiseTwa.exceedsPEL ? 'text-warning' : 'text-error'
                                    }`}>
                                        {noiseTwa.twa?.toFixed(1)} dBA
                                    </div>
                                    <div className="text-xs text-text-muted mt-1">Dose: {noiseTwa.dose?.toFixed(1)}%</div>
                                </div>
                                <div className="text-xs text-text-secondary mt-2 leading-relaxed">
                                    {!noiseTwa.exceedsActionLevel
                                        ? 'Below OSHA action level (85 dBA). Hearing conservation program not required at this exposure.'
                                        : !noiseTwa.exceedsPEL
                                        ? 'At or above OSHA action level (85 dBA) — hearing conservation program required. Provide hearing protection, annual audiometric testing, and employee training.'
                                        : 'At or above OSHA permissible exposure limit (90 dBA). Engineering or administrative controls required to reduce exposure. Hearing protection mandatory.'}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
