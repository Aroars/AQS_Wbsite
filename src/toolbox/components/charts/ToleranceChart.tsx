import { useState, useMemo } from 'react'
import { commonFits, holeClasses, shaftClasses, calculateFit } from '@/toolbox/data/toleranceData'
import { PinButton } from '@/toolbox/components/ui/PinButton'
import { useAppStore } from '@/toolbox/stores/appStore'

const fitTypeLabels: Record<string, { color: string; bg: string; border: string; label: string; svgFill: string; svgStroke: string }> = {
    clearance: { color: 'text-success', bg: 'bg-success/10', border: 'border-success/30', label: 'Clearance Fit', svgFill: '#10b981', svgStroke: '#059669' },
    transition: { color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/30', label: 'Transition Fit', svgFill: '#eab308', svgStroke: '#ca8a04' },
    interference: { color: 'text-error', bg: 'bg-error/10', border: 'border-error/30', label: 'Interference Fit', svgFill: '#ef4444', svgStroke: '#dc2626' },
}

const fitTypeDescriptions: Record<string, string> = {
    clearance: 'The shaft is always smaller than the hole. Parts assemble freely by hand — no force needed.',
    transition: 'The shaft may be slightly larger or smaller than the hole. Light tapping or pressing may be needed for assembly.',
    interference: 'The shaft is always larger than the hole. Parts must be pressed or thermally fitted together — permanent assembly.',
}

const fitApplications: Record<string, string> = {
    'Loose Running': 'Pulleys on shafts, caster wheels, pivot pins that need to rotate freely with wide clearance.',
    'Free Running': 'Bearing journals, conveyor rollers, machine tool spindles — needs oil film clearance.',
    'Close Running': 'Precision sliding parts like piston/cylinder assemblies, accurate locating with thin oil film.',
    'Sliding Fit': 'Linear guide bearings, spigot fits, instrument shafts — close sliding contact with light lubrication.',
    'Locational Clearance': 'Stationary locating fits — dowel pins in jigs, bearing housings — snug but removable by hand.',
    'Locational Transition': 'Accurate location where slight interference is acceptable — gear hubs, coupling halves.',
    'Light Press': 'Semi-permanent assemblies — bearing races in housings, bushings — needs an arbor press.',
    'Medium Press': 'Permanent assembly — gear on shaft, bearing inner race — requires hydraulic press.',
    'Heavy Press': 'Permanent high-torque connections — heavy gear blanks, large bearing fits.',
    'Force Fit': 'Maximum grip — shrink fits for turbine discs, heavy-duty press fits that will never be disassembled.',
    'Locational Interference': 'Light press fit for accurate location — pins in fixtures, light-duty gear mounting.',
}

const categoryDot: Record<string, string> = {
    clearance: 'bg-success',
    transition: 'bg-warning',
    interference: 'bg-error',
}

/** Inline SVG tolerance zone diagram */
function ToleranceZoneDiagram({ result, fitStyle, holeClass, shaftClass }: {
    result: { holeUpper: number; holeLower: number; shaftUpper: number; shaftLower: number; fitType: string; maxClearance: number; minClearance: number }
    fitStyle: { svgFill: string; svgStroke: string }
    holeClass: string
    shaftClass: string
}) {
    // All values in mm. We need to scale them for visual display.
    const { holeUpper, holeLower, shaftUpper, shaftLower } = result

    // Find the extent of all deviations for scaling
    const allVals = [holeUpper, holeLower, shaftUpper, shaftLower]
    const maxDev = Math.max(...allVals.map(Math.abs), 0.001)

    // SVG dimensions
    const w = 280
    const h = 120
    const zeroY = h / 2
    const scale = (h * 0.35) / maxDev // scale deviations to fit
    const holeX = w * 0.3
    const shaftX = w * 0.7
    const barW = 40

    const toY = (dev: number) => zeroY - dev * scale // positive = up

    const holeTopY = toY(holeUpper)
    const holeBotY = toY(holeLower)
    const shaftTopY = toY(shaftUpper)
    const shaftBotY = toY(shaftLower)

    return (
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ maxHeight: '140px' }}>
            {/* Zero line */}
            <line x1="10" y1={zeroY} x2={w - 10} y2={zeroY} stroke="#4a5568" strokeWidth="1" strokeDasharray="4,3" />
            <text x="8" y={zeroY - 4} fill="#718096" fontSize="9" textAnchor="end">0</text>

            {/* Hole tolerance zone */}
            <rect x={holeX - barW / 2} y={holeTopY} width={barW} height={holeBotY - holeTopY}
                fill="rgba(59, 130, 246, 0.2)" stroke="#3b82f6" strokeWidth="1.5" rx="2" />
            <text x={holeX} y={h - 4} fill="#93a3b8" fontSize="10" textAnchor="middle" fontFamily="monospace">{holeClass}</text>
            <text x={holeX} y={12} fill="#93a3b8" fontSize="8" textAnchor="middle">HOLE</text>
            {/* Deviation labels */}
            <text x={holeX - barW / 2 - 3} y={holeTopY + 4} fill="#60a5fa" fontSize="8" textAnchor="end" fontFamily="monospace">
                {holeUpper >= 0 ? '+' : ''}{(holeUpper * 1000).toFixed(0)}μm
            </text>
            <text x={holeX - barW / 2 - 3} y={holeBotY + 4} fill="#60a5fa" fontSize="8" textAnchor="end" fontFamily="monospace">
                {holeLower >= 0 ? '+' : ''}{(holeLower * 1000).toFixed(0)}μm
            </text>

            {/* Shaft tolerance zone */}
            <rect x={shaftX - barW / 2} y={shaftTopY} width={barW} height={shaftBotY - shaftTopY}
                fill={`${fitStyle.svgFill}33`} stroke={fitStyle.svgStroke} strokeWidth="1.5" rx="2" />
            <text x={shaftX} y={h - 4} fill="#93a3b8" fontSize="10" textAnchor="middle" fontFamily="monospace">{shaftClass}</text>
            <text x={shaftX} y={12} fill="#93a3b8" fontSize="8" textAnchor="middle">SHAFT</text>
            {/* Deviation labels */}
            <text x={shaftX + barW / 2 + 3} y={shaftTopY + 4} fill={fitStyle.svgFill} fontSize="8" textAnchor="start" fontFamily="monospace">
                {shaftUpper >= 0 ? '+' : ''}{(shaftUpper * 1000).toFixed(0)}μm
            </text>
            <text x={shaftX + barW / 2 + 3} y={shaftBotY + 4} fill={fitStyle.svgFill} fontSize="8" textAnchor="start" fontFamily="monospace">
                {shaftLower >= 0 ? '+' : ''}{(shaftLower * 1000).toFixed(0)}μm
            </text>
        </svg>
    )
}

export function ToleranceChart() {
    const pinned = useAppStore((s) => s.pinnedCharts.includes('tolerance'))
    const togglePin = useAppStore((s) => s.togglePinChart)
    const [isMetric, setIsMetric] = useState(true)
    const [diameter, setDiameter] = useState('25')
    const [holeClass, setHoleClass] = useState('H7')
    const [shaftClass, setShaftClass] = useState('g6')

    const result = useMemo(() => {
        const d = parseFloat(diameter)
        if (isNaN(d) || d <= 0) return null
        const nominalMm = isMetric ? d : d * 25.4
        if (nominalMm > 500) return null
        try {
            const fit = calculateFit(nominalMm, holeClass, shaftClass)
            if (!fit) return null
            return {
                nominalMm,
                holeUpper: fit.hole.upper / 1000,
                holeLower: fit.hole.lower / 1000,
                shaftUpper: fit.shaft.upper / 1000,
                shaftLower: fit.shaft.lower / 1000,
                maxClearance: fit.maxClearance / 1000,
                minClearance: fit.minClearance / 1000,
                fitType: fit.fitType,
            }
        } catch { return null }
    }, [diameter, isMetric, holeClass, shaftClass])

    const activeFit = useMemo(() => {
        for (const fits of Object.values(commonFits)) {
            const match = (fits as any[]).find((f: any) => f.hole === holeClass && f.shaft === shaftClass)
            if (match) return match
        }
        return null
    }, [holeClass, shaftClass])

    const fitStyle = result ? fitTypeLabels[result.fitType] : null

    // Internal values are always mm; convert for display in imperial mode (legacy parity: in = mm / 25.4)
    const fmtNum = (mm: number) => (isMetric ? mm : mm / 25.4).toFixed(isMetric ? 3 : 4)
    const fmtDev = (mm: number) => `${mm >= 0 ? '+' : ''}${fmtNum(mm)}`
    const fmtUm = (mm: number) => {
        const um = Math.round(mm * 10000) / 10
        return `${um >= 0 ? '+' : ''}${Number.isInteger(um) ? um.toFixed(0) : um.toFixed(1)}`
    }
    const unitLabel = isMetric ? 'mm' : 'in'

    // Label each primary value by its own sign: a negative "clearance" IS an interference,
    // shown as a positive magnitude (fixes swapped Max/Min Interference on press fits)
    const primaryCards = result ? [
        result.maxClearance >= 0
            ? { label: 'Max Clearance', text: `+${fmtNum(result.maxClearance)}` }
            : { label: 'Min Interference', text: fmtNum(-result.maxClearance) },
        result.minClearance >= 0
            ? { label: 'Min Clearance', text: `+${fmtNum(result.minClearance)}` }
            : { label: 'Max Interference', text: fmtNum(-result.minClearance) },
    ] : []

    return (
        <div className="bg-dark-800 border border-border rounded-xl">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text-primary">Hole/Shaft Tolerance (ISO 286)</h3>
                <PinButton pinned={pinned} onToggle={() => togglePin('tolerance')} />
            </div>
            <div className="p-4 space-y-4">
                {/* Input zone */}
                <div className="flex gap-2">
                    {[true, false].map((metric) => (
                        <button key={String(metric)} onClick={() => {
                            if (metric === isMetric) return
                            // Convert the entered diameter (25 mm <-> 0.9843 in) instead of wiping it
                            setDiameter((v) => {
                                const n = parseFloat(v)
                                if (isNaN(n)) return v
                                return String(parseFloat((metric ? n * 25.4 : n / 25.4).toFixed(4)))
                            })
                            setIsMetric(metric)
                        }}
                            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                                isMetric === metric ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-dark-900 text-text-secondary hover:border-text-muted'
                            }`}>
                            {metric ? 'Metric (mm)' : 'Imperial (in)'}
                        </button>
                    ))}
                </div>

                <div>
                    <label className="block text-xs text-text-secondary uppercase mb-1 tracking-wider">Nominal Diameter</label>
                    <div className="flex gap-2">
                        <input type="number" value={diameter} onChange={(e) => setDiameter(e.target.value)}
                            placeholder={isMetric ? 'e.g. 25' : 'e.g. 1.000'} min="0" step="any"
                            className="flex-1 px-3 py-2.5 bg-dark-900 border border-border rounded-lg text-text-primary font-mono text-sm focus:outline-none focus:border-primary" />
                        <span className="flex items-center px-3 bg-dark-700 border border-border rounded-lg text-text-muted text-sm">
                            {isMetric ? 'mm' : 'in'}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs text-text-secondary uppercase mb-1 tracking-wider">Hole Class</label>
                        <select value={holeClass} onChange={(e) => setHoleClass(e.target.value)}
                            className="w-full px-3 py-2.5 bg-dark-900 border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-primary">
                            {(holeClasses as any[]).map((c: string) => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs text-text-secondary uppercase mb-1 tracking-wider">Shaft Class</label>
                        <select value={shaftClass} onChange={(e) => setShaftClass(e.target.value)}
                            className="w-full px-3 py-2.5 bg-dark-900 border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-primary">
                            {(shaftClasses as any[]).map((c: string) => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>

                {/* Quick-select fits — always visible, one click sets both classes */}
                <div className="flex flex-wrap gap-1.5">
                    {Object.entries(commonFits).flatMap(([type, fits]) =>
                        (fits as any[]).map((f: any) => {
                            const isActive = holeClass === f.hole && shaftClass === f.shaft
                            return (
                                <button key={`${f.hole}/${f.shaft}`} title={`${f.name} — ${f.description}`}
                                    onClick={() => { setHoleClass(f.hole); setShaftClass(f.shaft) }}
                                    className={`px-2 py-1 rounded text-xs font-mono border transition-colors flex items-center gap-1.5 ${
                                        isActive
                                            ? 'border-primary bg-primary/10 text-primary'
                                            : 'border-border bg-dark-900 text-text-secondary hover:border-text-muted'
                                    }`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${categoryDot[type]}`} />
                                    {f.hole}/{f.shaft}
                                </button>
                            )
                        })
                    )}
                </div>

                {/* Active fit description */}
                {activeFit && (
                    <div className="px-3 py-2 bg-primary/5 border-l-2 border-primary rounded text-xs text-text-secondary">
                        <strong className="text-text-primary">{activeFit.name}</strong> ({activeFit.hole}/{activeFit.shaft}) — {activeFit.description}
                        {fitApplications[activeFit.name] && (
                            <div className="mt-1 text-text-muted">{fitApplications[activeFit.name]}</div>
                        )}
                    </div>
                )}

                {/* ── RESULT ZONE ── */}
                {result && fitStyle && (
                    <div className="rounded-lg border border-primary/20 bg-dark-700 overflow-hidden">
                        {/* Result header with fit badge */}
                        <div className={`px-4 py-3 ${fitStyle.bg} border-b ${fitStyle.border} flex items-center justify-between`}>
                            <div>
                                <span className={`text-sm font-semibold ${fitStyle.color}`}>{fitStyle.label}</span>
                                <span className="ml-2 font-mono text-sm text-text-primary">{holeClass}/{shaftClass}</span>
                                {activeFit && <span className="ml-2 text-xs text-text-muted">— {activeFit.name}</span>}
                            </div>
                            {diameter && (
                                <span className="text-xs font-mono text-text-muted">
                                    Ø{parseFloat(diameter).toFixed(isMetric ? 1 : 3)} {isMetric ? 'mm' : 'in'}
                                </span>
                            )}
                        </div>

                        <div className="p-4 space-y-4">
                            {/* Natural language description */}
                            <div className="text-xs text-text-secondary">
                                {fitTypeDescriptions[result.fitType]}
                            </div>

                            {/* Primary result: Max/Min clearance — large and prominent */}
                            <div className="grid grid-cols-2 gap-3">
                                {primaryCards.map((card) => (
                                    <div key={card.label} className="bg-dark-800 rounded-lg px-4 py-3 text-center">
                                        <div className="text-xs text-text-muted uppercase mb-1">{card.label}</div>
                                        <div className={`font-mono text-xl font-semibold ${fitStyle.color}`}>{card.text}</div>
                                        <div className="text-xs text-text-muted font-mono">{unitLabel}</div>
                                    </div>
                                ))}
                            </div>

                            {/* SVG Tolerance Zone Diagram */}
                            <div className="bg-dark-800 rounded-lg px-3 py-3">
                                <div className="text-xs text-text-muted uppercase mb-2 tracking-wider">Tolerance Zone Diagram</div>
                                <ToleranceZoneDiagram
                                    result={result}
                                    fitStyle={fitStyle}
                                    holeClass={holeClass}
                                    shaftClass={shaftClass}
                                />
                            </div>

                            {/* Limit dimensions — always visible; the headline is what goes on the drawing */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-dark-800 rounded-lg px-3 py-3">
                                    <div className="text-xs text-text-muted uppercase mb-1">Hole ({holeClass})</div>
                                    <div className="font-mono text-sm text-text-primary">
                                        Ø{fmtNum(result.nominalMm + result.holeUpper)} / Ø{fmtNum(result.nominalMm + result.holeLower)} {unitLabel}
                                    </div>
                                    <div className="text-xs text-text-muted mt-1 font-mono">
                                        {fmtDev(result.holeUpper)} / {fmtDev(result.holeLower)} {unitLabel} ({fmtUm(result.holeUpper)} / {fmtUm(result.holeLower)} μm)
                                    </div>
                                </div>
                                <div className="bg-dark-800 rounded-lg px-3 py-3">
                                    <div className="text-xs text-text-muted uppercase mb-1">Shaft ({shaftClass})</div>
                                    <div className="font-mono text-sm text-text-primary">
                                        Ø{fmtNum(result.nominalMm + result.shaftUpper)} / Ø{fmtNum(result.nominalMm + result.shaftLower)} {unitLabel}
                                    </div>
                                    <div className="text-xs text-text-muted mt-1 font-mono">
                                        {fmtDev(result.shaftUpper)} / {fmtDev(result.shaftLower)} {unitLabel} ({fmtUm(result.shaftUpper)} / {fmtUm(result.shaftLower)} μm)
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}
