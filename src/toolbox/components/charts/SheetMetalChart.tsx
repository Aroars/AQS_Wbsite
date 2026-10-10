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
        <div className="bg-surface-card border border-border rounded-xl">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text-strong">Sheet Metal Gauge</h3>
                <PinButton pinned={pinned} onToggle={() => togglePin('sheetmetal')} />
            </div>
            <div className="p-4 space-y-4">
                <div>
                    <label className="block text-xs text-text-body uppercase mb-1 tracking-wider">Material</label>
                    <select value={material} onChange={(e) => { setMaterial(e.target.value); setGauge('') }}
                        className="w-full px-3 py-2.5 bg-surface-page border border-border rounded-lg text-text-strong text-sm focus:outline-none focus:border-accent-text">
                        <option value="">Select material...</option>
                        {materials.map((m: string) => <option key={m} value={m}>{m}</option>)}
                    </select>
                </div>
                {info && (
                    <div className="px-3 py-2 bg-accent-text/5 border-l-2 border-accent-text rounded text-xs text-text-body">
                        <strong>{info.standard}</strong> — {info.description}
                    </div>
                )}
                <div>
                    <label className="block text-xs text-text-body uppercase mb-1 tracking-wider">Gauge</label>
                    <select value={gauge} onChange={(e) => setGauge(e.target.value)} disabled={!material}
                        className="w-full px-3 py-2.5 bg-surface-page border border-border rounded-lg text-text-strong text-sm focus:outline-none focus:border-accent-text disabled:opacity-50">
                        <option value="">Select gauge...</option>
                        {gauges.map((g: number) => <option key={g} value={g}>{g} ga</option>)}
                    </select>
                </div>
                {data && (
                    <div className="readout rounded-lg border border-border p-3 grid grid-cols-2 gap-3 mt-2">
                        <div className="bg-surface-card rounded-lg px-3 py-3 text-center">
                            <div className="text-xs text-text-dim uppercase">Inches</div>
                            <div className="font-mono text-lg font-semibold text-accent-text">{data.inches}"</div>
                        </div>
                        <div className="bg-surface-card rounded-lg px-3 py-3 text-center">
                            <div className="text-xs text-text-dim uppercase">Millimeters</div>
                            <div className="font-mono text-lg font-semibold text-accent-text">{data.mm} mm</div>
                        </div>
                        {data.toleranceIn && (
                            <>
                                <div className="bg-surface-card rounded-lg px-3 py-3 text-center">
                                    <div className="text-xs text-text-dim uppercase">Tolerance (in)</div>
                                    <div className="font-mono text-sm text-text-strong">±{data.toleranceIn}"</div>
                                </div>
                                <div className="bg-surface-card rounded-lg px-3 py-3 text-center">
                                    <div className="text-xs text-text-dim uppercase">Tolerance (mm)</div>
                                    <div className="font-mono text-sm text-text-strong">±{data.toleranceMm} mm</div>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* Same gauge across materials — the classic non-standardized-gauge trap */}
                {comparison.length > 1 && (
                    <div>
                        <div className="text-xs text-text-dim uppercase tracking-wider mb-1.5">{gauge} ga Across Materials</div>
                        <div className="space-y-1">
                            {comparison.map((row: any) => (
                                <div key={row.material}
                                    className={`flex items-center justify-between px-3 py-1.5 rounded text-xs border-l-2 ${
                                        row.material === material
                                            ? 'bg-accent-text/10 border-accent-text text-text-strong'
                                            : 'bg-surface-page border-border text-text-body'
                                    }`}>
                                    <span>{row.material}</span>
                                    <span className="font-mono">{row.mm} mm · {row.inches}"</span>
                                </div>
                            ))}
                        </div>
                        <div className="text-[11px] text-text-dim mt-1">
                            Gauge numbers are not standardized across materials — always spec thickness, not gauge, on drawings.
                        </div>
                    </div>
                )}

                {/* Reverse lookup: measured a sheet, which gauge is it? */}
                <div className="border-t border-border pt-3">
                    <div className="text-xs text-text-body uppercase tracking-wider mb-1.5">Have a Thickness?</div>
                    <div className="flex gap-2">
                        <input type="number" value={measured} onChange={(e) => setMeasured(e.target.value)}
                            placeholder="Measured thickness" min="0" step="any"
                            className="flex-1 px-3 py-2 bg-surface-page border border-border rounded-lg text-text-strong font-mono text-sm focus:outline-none focus:border-accent-text" />
                        <select value={measuredUnit} onChange={(e) => setMeasuredUnit(e.target.value as 'mm' | 'in')}
                            className="px-2 py-2 bg-surface-page border border-border rounded-lg text-text-strong text-sm focus:outline-none focus:border-accent-text">
                            <option value="mm">mm</option>
                            <option value="in">in</option>
                        </select>
                    </div>
                    {reverse && (
                        <div className={`mt-2 px-3 py-2 rounded-lg border-l-2 text-xs ${
                            reverse.withinTol ? 'bg-success/10 border-success' : 'bg-warning/10 border-warning'
                        }`}>
                            <span className="font-mono font-semibold text-text-strong">
                                {reverse.gauge} ga {material}
                            </span>
                            <span className="text-text-body">
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
