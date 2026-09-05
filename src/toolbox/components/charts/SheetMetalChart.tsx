import { useState, useMemo } from 'react'
import { materialInfo, getGaugeData, getMaterials, getGauges, compareGauge, findClosestGauge } from '@/toolbox/data/sheetMetalGaugeData'
import { PinButton } from '@/toolbox/components/ui/PinButton'
import { useAppStore } from '@/toolbox/stores/appStore'

export function SheetMetalChart() {
    const pinned = useAppStore((s) => s.pinnedCharts.includes('sheetmetal'))
    const togglePin = useAppStore((s) => s.togglePinChart)
    // Default to the most common lookup: 16 ga mild steel
    const [material, setMaterial] = useState('Mild Steel')
    const [gauge, setGauge] = useState('16')
    const [measured, setMeasured] = useState('')
    const [measuredUnit, setMeasuredUnit] = useState<'mm' | 'in'>('mm')

    const materials = useMemo(() => getMaterials(), [])
    const gauges = useMemo(() => material ? getGauges(material) : [], [material])
    const data = useMemo(() => (material && gauge) ? getGaugeData(material, gauge) : null, [material, gauge])
    const info = material ? (materialInfo as any)[material] : null

    // Same gauge number across all four materials — gauges are NOT standardized between them
    const comparison = useMemo(() => gauge ? compareGauge(gauge) : [], [gauge])

    // Reverse lookup: measured thickness -> closest gauge in the selected material
    const reverse = useMemo(() => {
        if (!material || !measured) return null
        const t = parseFloat(measured)
        if (isNaN(t) || t <= 0) return null
        const inches = measuredUnit === 'mm' ? t / 25.4 : t
        const hit: any = findClosestGauge(material, inches)
        if (!hit) return null
        const deltaMm = (measuredUnit === 'mm' ? t : t * 25.4) - hit.mm
        const withinTol = hit.toleranceMm != null && Math.abs(deltaMm) <= hit.toleranceMm
        return { ...hit, deltaMm, withinTol }
    }, [material, measured, measuredUnit])

    return (
        <div className="bg-dark-800 border border-border rounded-xl">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text-primary">Sheet Metal Gauge</h3>
                <PinButton pinned={pinned} onToggle={() => togglePin('sheetmetal')} />
            </div>
            <div className="p-4 space-y-4">
                <div>
                    <label className="block text-xs text-text-secondary uppercase mb-1 tracking-wider">Material</label>
                    <select value={material} onChange={(e) => { setMaterial(e.target.value); setGauge('') }}
                        className="w-full px-3 py-2.5 bg-dark-900 border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-primary">
                        <option value="">Select material...</option>
                        {materials.map((m: string) => <option key={m} value={m}>{m}</option>)}
                    </select>
                </div>
                {info && (
                    <div className="px-3 py-2 bg-primary/5 border-l-2 border-primary rounded text-xs text-text-secondary">
                        <strong>{info.standard}</strong> — {info.description}
                    </div>
                )}
                <div>
                    <label className="block text-xs text-text-secondary uppercase mb-1 tracking-wider">Gauge</label>
                    <select value={gauge} onChange={(e) => setGauge(e.target.value)} disabled={!material}
                        className="w-full px-3 py-2.5 bg-dark-900 border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-primary disabled:opacity-50">
                        <option value="">Select gauge...</option>
                        {gauges.map((g: number) => <option key={g} value={g}>{g} ga</option>)}
                    </select>
                </div>
                {data && (
                    <div className="grid grid-cols-2 gap-3 mt-2">
                        <div className="bg-dark-700 rounded-lg px-3 py-3 text-center">
                            <div className="text-xs text-text-muted uppercase">Inches</div>
                            <div className="font-mono text-lg font-semibold text-primary">{data.inches}"</div>
                        </div>
                        <div className="bg-dark-700 rounded-lg px-3 py-3 text-center">
                            <div className="text-xs text-text-muted uppercase">Millimeters</div>
                            <div className="font-mono text-lg font-semibold text-primary">{data.mm} mm</div>
                        </div>
                        {data.toleranceIn && (
                            <>
                                <div className="bg-dark-700 rounded-lg px-3 py-3 text-center">
                                    <div className="text-xs text-text-muted uppercase">Tolerance (in)</div>
                                    <div className="font-mono text-sm text-text-primary">±{data.toleranceIn}"</div>
                                </div>
                                <div className="bg-dark-700 rounded-lg px-3 py-3 text-center">
                                    <div className="text-xs text-text-muted uppercase">Tolerance (mm)</div>
                                    <div className="font-mono text-sm text-text-primary">±{data.toleranceMm} mm</div>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* Same gauge across materials — the classic non-standardized-gauge trap */}
                {comparison.length > 1 && (
                    <div>
                        <div className="text-xs text-text-muted uppercase tracking-wider mb-1.5">{gauge} ga Across Materials</div>
                        <div className="space-y-1">
                            {comparison.map((row: any) => (
                                <div key={row.material}
                                    className={`flex items-center justify-between px-3 py-1.5 rounded text-xs border-l-2 ${
                                        row.material === material
                                            ? 'bg-primary/10 border-primary text-primary'
                                            : 'bg-dark-900 border-border text-text-secondary'
                                    }`}>
                                    <span>{row.material}</span>
                                    <span className="font-mono">{row.mm} mm · {row.inches}"</span>
                                </div>
                            ))}
                        </div>
                        <div className="text-[10px] text-text-muted mt-1">
                            Gauge numbers are not standardized across materials — always spec thickness, not gauge, on drawings.
                        </div>
                    </div>
                )}

                {/* Reverse lookup: measured a sheet, which gauge is it? */}
                <div className="border-t border-border pt-3">
                    <div className="text-xs text-text-secondary uppercase tracking-wider mb-1.5">Have a Thickness?</div>
                    <div className="flex gap-2">
                        <input type="number" value={measured} onChange={(e) => setMeasured(e.target.value)}
                            placeholder="Measured thickness" min="0" step="any"
                            className="flex-1 px-3 py-2 bg-dark-900 border border-border rounded-lg text-text-primary font-mono text-sm focus:outline-none focus:border-primary" />
                        <select value={measuredUnit} onChange={(e) => setMeasuredUnit(e.target.value as 'mm' | 'in')}
                            className="px-2 py-2 bg-dark-900 border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-primary">
                            <option value="mm">mm</option>
                            <option value="in">in</option>
                        </select>
                    </div>
                    {reverse && (
                        <div className={`mt-2 px-3 py-2 rounded-lg border text-xs ${
                            reverse.withinTol ? 'bg-success/10 border-success/30' : 'bg-warning/10 border-warning/30'
                        }`}>
                            <span className={`font-mono font-semibold ${reverse.withinTol ? 'text-success' : 'text-warning'}`}>
                                {reverse.gauge} ga {material}
                            </span>
                            <span className="text-text-secondary">
                                {' '}({reverse.mm} mm nominal, Δ{reverse.deltaMm >= 0 ? '+' : ''}{reverse.deltaMm.toFixed(2)} mm{' '}
                                {reverse.withinTol ? '— within mill tolerance' : '— outside tolerance; could be an off-gauge or different material'})
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
