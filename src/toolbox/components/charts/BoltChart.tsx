import { useState, useMemo } from 'react'
import { metricBolts, imperialBolts, getMetricBoltSizes, getImperialBoltSizes, getBoltData, isMetricBolt } from '@/toolbox/data/boltData'
import { getEquivalents } from '@/toolbox/data/drillSizeData'
import { PinButton } from '@/toolbox/components/ui/PinButton'
import { useAppStore } from '@/toolbox/stores/appStore'

/**
 * Thread engagement % for a candidate tap drill, all in mm.
 * From drill = major − (%E × pitch)/76.98  =>  %E = (major − drill)/(1.29904 × pitch) × 100.
 * Sanity: M6×1.0 with 5.0 mm drill → 77%; 1/4-20 with #7 (5.105 mm) → 75%.
 */
function engagementPct(majorMm: number, pitchMm: number, drillMm: number): number {
    return ((majorMm - drillMm) / (1.29904 * pitchMm)) * 100
}

function engagementStatus(pct: number): { label: string; cls: string } {
    const p = Math.round(pct)
    if (pct >= 60 && pct <= 85) return { label: `✓ ${p}%`, cls: 'text-success bg-success/10 border-success/30' }
    if (pct >= 50 && pct < 60) return { label: `${p}% loose`, cls: 'text-warning bg-warning/10 border-warning/30' }
    if (pct > 85 && pct <= 95) return { label: `${p}% tight`, cls: 'text-warning bg-warning/10 border-warning/30' }
    if (pct > 95) return { label: `${p}% no-go`, cls: 'text-error bg-error/10 border-error/30' }
    return { label: `${p}% weak`, cls: 'text-error bg-error/10 border-error/30' }
}

/**
 * Closest drill in each index system (metric / number / letter / fractional)
 * for this bolt's tap drill — the imperial-drills-for-metric-taps overlap.
 */
function drillSubstitutions(boltInfo: any, metric: boolean) {
    const tapMm = boltInfo?.tapDrill?.mm
    if (!tapMm) return []
    const majorMm = metric ? boltInfo.majorDia : (boltInfo.majorDiaMM ?? boltInfo.majorDia * 25.4)
    const pitchMm = metric ? boltInfo.pitch : 25.4 / boltInfo.pitch
    const eq: any = getEquivalents(tapMm)
    return [
        { system: 'Metric', e: eq.metric },
        { system: 'Number', e: eq.number },
        { system: 'Letter', e: eq.letter },
        { system: 'Fraction', e: eq.fractional },
    ]
        .filter(({ e }) => e && e.size != null && Math.abs(e.size - tapMm) > 0.001)
        .map(({ system, e }) => ({
            system,
            label: e.label,
            sizeMm: e.size,
            delta: e.size - tapMm,
            engagement: engagementPct(majorMm, pitchMm, e.size),
        }))
}

/** Practical annotations for common bolt sizes */
const boltAnnotations: Record<string, string> = {
    'M3': 'Common for electronics enclosures, small appliance assembly, and PCB mounting.',
    'M4': 'Standard for electrical panel components, DIN rail mounting, and light machine covers.',
    'M5': 'Widely used for machine guards, aluminum extrusion T-slot assemblies, and bracket mounting.',
    'M6': 'One of the most common metric fasteners — motor mounts, structural brackets, and general machine assembly.',
    'M8': 'Heavy-duty brackets, flange connections, bearing housings, and conveyor frame assembly.',
    'M10': 'Structural steel connections, heavy equipment mounting, and base plate anchoring.',
    'M12': 'Structural joints, large motor mounts, and heavy frame connections.',
    'M16': 'Heavy structural connections, anchor bolts, and large equipment foundations.',
    'M20': 'Major structural work, foundation bolts, and heavy industrial anchoring.',
    '#4': 'Light switch plates, outlet covers, and small electronics.',
    '#6': 'Electrical box covers, light fixture mounting, and wood screws for trim work.',
    '#8': 'General wood construction, drywall anchors, and light-duty brackets.',
    '#10': 'Heavier wood connections, cabinet hardware, and medium-duty brackets.',
    '1/4"': 'The workhorse of imperial fasteners — machine assembly, brackets, and structural connections.',
    '5/16"': 'Medium-duty equipment mounting, automotive applications, and conveyor components.',
    '3/8"': 'Heavy equipment, structural connections, motor mounts, and conveyor frame bolts.',
    '1/2"': 'Structural steel connections, heavy equipment, and anchor bolts.',
    '5/8"': 'Heavy structural work, large flange bolts, and industrial equipment.',
    '3/4"': 'Major structural connections, heavy anchor bolts, and large equipment foundations.',
    '1"': 'Heavy structural and industrial applications — bridge connections, large anchors.',
}

/** Find closest cross-reference between metric and imperial */
function findCrossReference(size: string, isMetric: boolean) {
    const data = getBoltData(size)
    if (!data) return null

    const majorMm = isMetric ? data.majorDia : (data.majorDiaMM ?? data.majorDia * 25.4)
    const searchPool = isMetric ? imperialBolts : metricBolts

    let closest: { key: string; dia: number; diff: number } | null = null
    for (const [key, bolt] of Object.entries(searchPool)) {
        const boltMm = isMetric ? (bolt.majorDiaMM ?? bolt.majorDia * 25.4) : bolt.majorDia
        const diff = Math.abs(boltMm - majorMm)
        if (!closest || diff < closest.diff) {
            closest = { key, dia: boltMm, diff }
        }
    }
    return closest
}

/** Get adjacent sizes in the same system */
function getRelatedSizes(size: string, isMetric: boolean): string[] {
    const allSizes = isMetric ? getMetricBoltSizes() : getImperialBoltSizes()
    const idx = allSizes.indexOf(size)
    if (idx === -1) return []
    const related: string[] = []
    if (idx > 0) related.push(allSizes[idx - 1])
    if (idx < allSizes.length - 1) related.push(allSizes[idx + 1])
    return related
}

export function BoltChart() {
    const pinned = useAppStore((s) => s.pinnedCharts.includes('bolt'))
    const togglePin = useAppStore((s) => s.togglePinChart)
    const [isMetric, setIsMetric] = useState(true)
    const [selectedSize, setSelectedSize] = useState('')
    const [search, setSearch] = useState('')
    const [showAllSizes, setShowAllSizes] = useState(false)

    const allSizes = useMemo(() => isMetric ? getMetricBoltSizes() : getImperialBoltSizes(), [isMetric])

    const filteredSizes = useMemo(() => {
        if (!search.trim()) return allSizes
        const q = search.toLowerCase().replace(/\s/g, '')
        return allSizes.filter(s => s.toLowerCase().replace(/\s/g, '').includes(q))
    }, [allSizes, search])

    const boltInfo = useMemo(() => selectedSize ? getBoltData(selectedSize) : null, [selectedSize])
    const crossRef = useMemo(() => selectedSize ? findCrossReference(selectedSize, isMetric) : null, [selectedSize, isMetric])
    const related = useMemo(() => selectedSize ? getRelatedSizes(selectedSize, isMetric) : [], [selectedSize, isMetric])
    const annotation = selectedSize ? boltAnnotations[selectedSize] : null
    const substitutions = useMemo(
        () => (boltInfo && selectedSize) ? drillSubstitutions(boltInfo, isMetricBolt(selectedSize)) : [],
        [boltInfo, selectedSize]
    )

    // Reset happens in the toggle's onClick, NOT in an effect on isMetric — the
    // cross-reference link must be able to flip the system and select a size together.
    return (
        <div className="bg-dark-800 border border-border rounded-xl">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text-primary">Bolt, Tap & Drill Sizes</h3>
                <PinButton pinned={pinned} onToggle={() => togglePin('bolt')} />
            </div>
            <div className="p-4 space-y-4">
                {/* Unit toggle */}
                <div className="flex gap-2">
                    {[true, false].map((metric) => (
                        <button key={String(metric)}
                            onClick={() => {
                                if (isMetric === metric) return
                                setIsMetric(metric)
                                setSelectedSize('')
                                setSearch('')
                            }}
                            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                                isMetric === metric ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-dark-900 text-text-secondary hover:border-text-muted'
                            }`}>
                            {metric ? 'Metric' : 'Imperial'}
                        </button>
                    ))}
                </div>

                {/* Search input */}
                <div>
                    <label className="block text-xs text-text-secondary uppercase mb-1 tracking-wider">Search Bolt Size</label>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={isMetric ? 'e.g. M8, M10...' : 'e.g. 1/4, #10...'}
                        className="w-full px-3 py-2.5 bg-dark-900 border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-primary placeholder:text-text-muted"
                    />
                </div>

                {/* Size buttons */}
                <div className="flex flex-wrap gap-1.5">
                    {filteredSizes.map((s) => (
                        <button key={s} onClick={() => setSelectedSize(s)}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono border transition-colors ${
                                selectedSize === s
                                    ? 'border-primary bg-primary/10 text-primary'
                                    : 'border-border bg-dark-900 text-text-secondary hover:border-text-muted'
                            }`}>
                            {s}
                        </button>
                    ))}
                    {filteredSizes.length === 0 && (
                        <div className="text-xs text-text-muted py-2">No sizes match "{search}"</div>
                    )}
                </div>

                {/* Result card */}
                {boltInfo && (
                    <div className="rounded-lg border border-primary/20 bg-dark-700 overflow-hidden">
                        {/* Header */}
                        <div className="px-4 py-3 bg-primary/5 border-b border-primary/20 flex items-center justify-between">
                            <div>
                                <span className="font-mono text-lg text-text-primary font-semibold">{selectedSize}</span>
                                <span className="ml-2 text-sm text-text-secondary">{boltInfo.thread}</span>
                            </div>
                            <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary font-medium">
                                {isMetric ? 'Metric' : 'Imperial'}
                            </span>
                        </div>

                        <div className="p-4 space-y-3">
                            {/* Annotation */}
                            {annotation && (
                                <div className="px-3 py-2 bg-primary/5 border-l-2 border-primary rounded text-xs text-text-secondary">
                                    {annotation}
                                </div>
                            )}

                            {/* Specs */}
                            <div>
                                <div className="text-xs text-text-muted uppercase mb-2 tracking-wider">Specifications</div>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="flex justify-between bg-dark-800 rounded px-3 py-1.5">
                                        <span className="text-text-secondary">Pitch</span>
                                        <span className="font-mono text-text-primary">{boltInfo.pitch}{isMetric ? ' mm' : ' TPI'}</span>
                                    </div>
                                    <div className="flex justify-between bg-dark-800 rounded px-3 py-1.5">
                                        <span className="text-text-secondary">Major Ø</span>
                                        <span className="font-mono text-text-primary">
                                            {isMetric
                                                ? `${boltInfo.majorDia} mm`
                                                : `${boltInfo.majorDia.toFixed(3)}"`
                                            }
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Tap Drill — highlighted as primary result */}
                            {boltInfo.tapDrill && (
                                <div>
                                    <div className="text-xs text-text-muted uppercase mb-2 tracking-wider">Tap Drill</div>
                                    <div className="bg-dark-800 rounded-lg px-4 py-3 border border-success/20">
                                        <div className="flex items-baseline gap-3 mb-1">
                                            <span className="font-mono text-xl text-success font-semibold">
                                                {boltInfo.tapDrill.mm} mm
                                            </span>
                                            <span className="text-text-muted">|</span>
                                            <span className="font-mono text-sm text-text-secondary">
                                                {boltInfo.tapDrill.inch}
                                                {boltInfo.tapDrill.numberDrill && boltInfo.tapDrill.numberDrill !== '—' && boltInfo.tapDrill.inch === '—'
                                                    ? ` (${boltInfo.tapDrill.numberDrill} drill)`
                                                    : ''
                                                }
                                            </span>
                                        </div>
                                        <div className="text-xs text-text-muted">
                                            Decimal: {boltInfo.tapDrill.decimal.toFixed(4)}"
                                            {boltInfo.tapDrill.numberDrill && boltInfo.tapDrill.numberDrill !== '—' && boltInfo.tapDrill.inch !== '—'
                                                ? ` — Number drill: ${boltInfo.tapDrill.numberDrill}`
                                                : ''
                                            }
                                            {boltInfo.tapDrill.letterDrill && boltInfo.tapDrill.letterDrill !== '—'
                                                ? ` — Letter drill: ${boltInfo.tapDrill.letterDrill}`
                                                : ''
                                            }
                                        </div>

                                        {/* Drill index substitutions — closest drill in every system,
                                            with % thread engagement so you know what the substitution costs */}
                                        {substitutions.length > 0 && (
                                            <div className="mt-3 pt-3 border-t border-border/50">
                                                <div className="text-xs text-text-muted uppercase tracking-wider mb-1.5">
                                                    Drill Index Substitutions
                                                </div>
                                                <div className="space-y-1">
                                                    {substitutions.map((sub) => {
                                                        const st = engagementStatus(sub.engagement)
                                                        return (
                                                            <div key={sub.system} className="flex items-center gap-2 text-xs">
                                                                <span className="text-text-muted w-14">{sub.system}</span>
                                                                <span className="font-mono text-text-primary w-16">{sub.label}</span>
                                                                <span className="font-mono text-text-secondary w-20">{sub.sizeMm.toFixed(3)} mm</span>
                                                                <span className="font-mono text-text-muted w-16">
                                                                    {sub.delta >= 0 ? '+' : ''}{sub.delta.toFixed(3)}
                                                                </span>
                                                                <span className={`px-1.5 py-0.5 rounded border font-mono text-[10px] ${st.cls}`}>
                                                                    {st.label}
                                                                </span>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                                <div className="text-[10px] text-text-muted mt-1.5">
                                                    % = thread engagement. 60–85% good (75% standard) · &lt;50% weak threads · &gt;95% tap breakage risk
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Clearance Holes */}
                            {boltInfo.clearance && (
                                <div>
                                    <div className="text-xs text-text-muted uppercase mb-2 tracking-wider">Clearance Holes</div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="bg-dark-800 rounded-lg px-3 py-2">
                                            <div className="text-xs text-text-muted mb-1">Close Fit</div>
                                            <div className="font-mono text-sm text-text-primary">{boltInfo.clearance.close.mm} mm</div>
                                            <div className="font-mono text-xs text-text-muted">{boltInfo.clearance.close.inch}</div>
                                        </div>
                                        <div className="bg-dark-800 rounded-lg px-3 py-2">
                                            <div className="text-xs text-text-muted mb-1">Normal Fit</div>
                                            <div className="font-mono text-sm text-text-primary">{boltInfo.clearance.normal.mm} mm</div>
                                            <div className="font-mono text-xs text-text-muted">{boltInfo.clearance.normal.inch}</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Cross-reference */}
                            {crossRef && (
                                <div className="bg-dark-800 rounded-lg px-3 py-2 border border-border">
                                    <div className="flex items-center gap-2 text-xs flex-wrap">
                                        <span className="text-text-muted">Closest {isMetric ? 'imperial' : 'metric'}:</span>
                                        <button
                                            onClick={() => { setIsMetric(!isMetric); setSelectedSize(crossRef.key); setSearch('') }}
                                            className="font-mono text-primary hover:underline cursor-pointer">
                                            {crossRef.key}
                                        </button>
                                        <span className="text-text-muted">
                                            (Ø{crossRef.dia.toFixed(2)} mm — {crossRef.diff < 0.5 ? 'very close' : crossRef.diff < 1 ? 'close' : 'approximate'} match)
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Related sizes */}
                            {related.length > 0 && (
                                <div className="flex items-center gap-2 text-xs flex-wrap">
                                    <span className="text-text-muted">Adjacent sizes:</span>
                                    {related.map((r) => (
                                        <button key={r} onClick={() => { setSelectedSize(r); setSearch('') }}
                                            className="font-mono text-text-secondary hover:text-primary transition-colors px-2 py-0.5 rounded border border-border hover:border-primary">
                                            {r}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Collapsible full table */}
                <button
                    onClick={() => setShowAllSizes(!showAllSizes)}
                    className="w-full text-left text-xs text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1">
                    <span className="transition-transform inline-block" style={{ transform: showAllSizes ? 'rotate(90deg)' : 'rotate(0deg)' }}>&#9656;</span>
                    {showAllSizes ? 'Hide' : 'Show'} full {isMetric ? 'metric' : 'imperial'} reference table
                </button>

                {showAllSizes && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="text-text-muted border-b border-border">
                                    <th className="py-2 text-left">Size</th>
                                    <th className="py-2 text-left">Thread</th>
                                    <th className="py-2 text-left">Tap Drill</th>
                                    <th className="py-2 text-left">Close</th>
                                    <th className="py-2 text-left">Normal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allSizes.map((s) => {
                                    const d = getBoltData(s)
                                    if (!d) return null
                                    const isActive = s === selectedSize
                                    return (
                                        <tr key={s}
                                            onClick={() => { setSelectedSize(s); setSearch(''); setShowAllSizes(false) }}
                                            className={`border-b border-border/50 cursor-pointer transition-colors ${
                                                isActive ? 'bg-primary/10' : 'hover:bg-dark-700'
                                            }`}>
                                            <td className="py-1.5 font-mono text-text-primary font-medium">{s}</td>
                                            <td className="py-1.5 text-text-secondary">{d.thread}</td>
                                            <td className="py-1.5 font-mono text-text-primary">{d.tapDrill?.mm ?? '—'} mm</td>
                                            <td className="py-1.5 font-mono text-text-secondary">{d.clearance?.close?.mm ?? '—'} mm</td>
                                            <td className="py-1.5 font-mono text-text-secondary">{d.clearance?.normal?.mm ?? '—'} mm</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
