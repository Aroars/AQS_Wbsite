import { useMemo, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { PinButton } from '@/toolbox/components/ui/PinButton'
import { useAppStore } from '@/toolbox/stores/appStore'
import { useBeltSpecs, beltChoices, minInsideRadiusIn, BELT_SPECS_URL, type BeltChoice } from '@/toolbox/lib/beltSpecs'
import { chordalPdMm } from '@/toolbox/lib/calculators/beltPull'

const inputCls = 'w-full px-2 py-2 bg-surface-page border border-border rounded-lg text-text-strong font-mono text-sm focus:outline-none focus:border-accent-text'
const selectCls = 'w-full px-2 py-2 bg-surface-page border border-border rounded-lg text-text-strong text-sm focus:outline-none focus:border-accent-text'
const labelCls = 'block text-xs text-text-dim mb-1'

type SortKey = 'brand' | 'belt' | 'build' | 'pitch' | 'thickness' | 'weight' | 'rating' | 'radius' | 'curve' | 'speed' | 'open'

const BUILD_LABEL: Record<string, string> = { pom: 'Acetal (POM)', pp: 'Polypropylene', pe: 'Polyethylene', nylon: 'Nylon', other: 'Other' }

function fmt(v: number | null | undefined, digits = 1): string {
    return v === null || v === undefined ? '—' : v.toFixed(digits)
}

/**
 * Belt Specs — the belts AQS runs, side by side. Read from the quoting tool's
 * public spec feed (engineering data only); the width box turns each radius
 * belt's collapse factor into its minimum inside turn radius.
 */
export function BeltSpecsChart() {
    const pinned = useAppStore((s) => s.pinnedCharts.includes('beltspecs'))
    const togglePin = useAppStore((s) => s.togglePinChart)
    const { feed, source, loading, refresh } = useBeltSpecs()

    const [width, setWidth] = useState('12')
    const [search, setSearch] = useState('')
    const [brand, setBrand] = useState('')
    const [build, setBuild] = useState('')
    const [radiusOnly, setRadiusOnly] = useState(false)
    const [metricRating, setMetricRating] = useState(false)
    const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: 'brand', dir: 1 })
    const [selected, setSelected] = useState<string | null>(null)
    // Sprocket sub-calc: pitch × teeth → chordal pitch diameter and shaft rpm
    const [spPitchMm, setSpPitchMm] = useState('50')
    const [spTeeth, setSpTeeth] = useState('11')
    const [spSpeed, setSpSpeed] = useState('100')
    const spPdMm = chordalPdMm(parseFloat(spPitchMm) || 0, parseFloat(spTeeth) || 0)
    const spPdIn = spPdMm / 25.4
    const spRpm = spPdIn > 0 ? ((parseFloat(spSpeed) || 0) * 12) / (Math.PI * spPdIn) : 0

    const widthIn = Math.max(parseFloat(width) || 0, 0)
    const choices = useMemo(() => beltChoices(feed), [feed])
    const brands = useMemo(() => Array.from(new Set(feed.belts.map((b) => b.brand).filter((b): b is string => !!b))).sort(), [feed])

    const rows = useMemo(() => {
        const q = search.trim().toLowerCase()
        const value = (c: BeltChoice, key: SortKey): number | string => {
            switch (key) {
                case 'brand': return c.belt.brand ?? ''
                case 'belt': return c.belt.name
                case 'build': return c.build.name
                case 'pitch': return c.belt.pitchMm ?? -1
                case 'thickness': return c.belt.thicknessIn ?? -1
                case 'weight': return c.build.weightLbFt2 ?? -1
                case 'rating': return c.build.ratingLbIn ?? -1
                case 'radius': return minInsideRadiusIn(c.belt, widthIn) ?? 1e9
                case 'curve': return c.belt.curveRatingFraction ?? -1
                case 'speed': return c.belt.maxSpeedFpm ?? -1
                case 'open': return c.belt.openAreaPct ?? -1
            }
        }
        return choices
            .filter((c) => !brand || c.belt.brand === brand)
            .filter((c) => !build || c.build.build === build)
            .filter((c) => !radiusOnly || c.belt.radiusCapable)
            .filter((c) => !q || c.label.toLowerCase().includes(q) || c.belt.type.toLowerCase().includes(q))
            .sort((a, b) => {
                const va = value(a, sort.key), vb = value(b, sort.key)
                const cmp = typeof va === 'number' && typeof vb === 'number' ? va - vb : String(va).localeCompare(String(vb))
                return cmp * sort.dir || a.label.localeCompare(b.label)
            })
    }, [choices, search, brand, build, radiusOnly, sort, widthIn])

    const selectedChoice = rows.find((r) => r.key === selected) ?? null
    const header = (key: SortKey, label: string, align: 'left' | 'right' = 'right') => (
        <th className={`px-2 py-1.5 text-${align} cursor-pointer select-none hover:text-text-strong ${sort.key === key ? 'text-accent-text' : ''}`}
            onClick={() => setSort((s) => ({ key, dir: s.key === key ? (s.dir === 1 ? -1 : 1) : 1 }))}>
            {label}{sort.key === key ? (sort.dir === 1 ? ' ↑' : ' ↓') : ''}
        </th>
    )

    return (
        <div className="bg-surface-card border border-border rounded-xl">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text-strong">Belt Comparison Chart</h3>
                <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-mono px-1.5 py-0.5 rounded border ${
                        source === 'live' ? 'bg-success/10 border-success text-text-strong' : source === 'cache' ? 'bg-accent-text/10 border-accent-text/40 text-accent-text' : 'bg-warning/10 border-warning text-text-strong'
                    }`} title={`${BELT_SPECS_URL} · ${feed.generatedAt}`}>
                        {loading ? 'loading…' : source === 'live' ? 'live catalog' : source === 'cache' ? 'catalog (cached)' : 'bundled snapshot'}
                    </span>
                    <button onClick={refresh} title="Reload from the catalog" className="p-1.5 rounded-md text-text-dim hover:text-accent-text hover:bg-surface-card-hover transition-colors">
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <PinButton pinned={pinned} onToggle={() => togglePin('beltspecs')} />
                </div>
            </div>
            <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 @md:grid-cols-5 gap-2">
                    <div>
                        <label className={labelCls}>Belt Width (in) — for min radius</label>
                        <input type="number" min="0" step="any" value={width} className={inputCls} onChange={(e) => setWidth(e.target.value)} />
                    </div>
                    <div>
                        <label className={labelCls}>Search</label>
                        <input type="text" value={search} placeholder="series, brand, type" className={inputCls} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                    <div>
                        <label className={labelCls}>Brand</label>
                        <select value={brand} className={selectCls} onChange={(e) => setBrand(e.target.value)}>
                            <option value="">All brands</option>
                            {brands.map((b) => <option key={b} value={b}>{b}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className={labelCls}>Build</label>
                        <select value={build} className={selectCls} onChange={(e) => setBuild(e.target.value)}>
                            <option value="">All builds</option>
                            {Object.entries(BUILD_LABEL).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
                        </select>
                    </div>
                    <div className="flex flex-col justify-end gap-1 pb-1">
                        <label className="flex items-center gap-1.5 text-xs text-text-body cursor-pointer">
                            <input type="checkbox" checked={radiusOnly} onChange={(e) => setRadiusOnly(e.target.checked)} /> Radius belts only
                        </label>
                        <label className="flex items-center gap-1.5 text-xs text-text-body cursor-pointer">
                            <input type="checkbox" checked={metricRating} onChange={(e) => setMetricRating(e.target.checked)} /> Rating in kgf/m
                        </label>
                    </div>
                </div>

                {rows.length === 0 ? (
                    <div className="px-3 py-4 text-xs text-text-dim bg-surface-page/50 rounded-lg border border-border">
                        {choices.length === 0
                            ? 'No belts published yet. In the quoting tool Database → Components, open a belt, fill its engineering specs, and tick "Show in Engineering Toolbox". Prices never leave the catalog.'
                            : 'No belts match these filters.'}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[760px] text-xs">
                            <thead><tr className="bg-surface-page text-text-dim border-b border-border">
                                {header('brand', 'Brand', 'left')}
                                {header('belt', 'Belt', 'left')}
                                {header('build', 'Build', 'left')}
                                {header('pitch', 'Pitch mm')}
                                {header('thickness', 'Thick in')}
                                {header('weight', 'lb/ft²')}
                                {header('rating', metricRating ? 'kgf/m' : 'lb/ft')}
                                {header('radius', widthIn > 0 ? `Min R @${widthIn}"` : 'Collapse')}
                                {header('curve', 'Curve')}
                                {header('speed', 'Max fpm')}
                                {header('open', 'Open %')}
                            </tr></thead>
                            <tbody>
                                {rows.map((r) => {
                                    const minR = minInsideRadiusIn(r.belt, widthIn)
                                    const sel = selected === r.key
                                    // Selected row reads strong on its accent tint
                                    const body = sel ? 'text-text-strong' : 'text-text-body'
                                    return (
                                        <tr key={r.key} onClick={() => setSelected(sel ? null : r.key)}
                                            className={`border-b border-border-soft font-mono cursor-pointer hover:bg-surface-card-hover ${sel ? 'bg-accent-text/10' : ''}`}>
                                            <td className={`px-2 py-1.5 font-sans ${body}`}>{r.belt.brand ?? '—'}</td>
                                            <td className="px-2 py-1.5 font-sans text-text-strong">{r.belt.name}</td>
                                            <td className={`px-2 py-1.5 font-sans ${body}`}>{r.build.name}{r.build.build ? '' : <span className="ml-1 inline-flex items-center gap-1 text-text-strong" title="material family not set"><span className="inline-block w-1.5 h-1.5 rounded-full bg-warning" aria-hidden />?</span>}</td>
                                            <td className={`px-2 py-1.5 text-right ${body}`}>{fmt(r.belt.pitchMm)}</td>
                                            <td className={`px-2 py-1.5 text-right ${body}`}>{fmt(r.belt.thicknessIn, 3)}</td>
                                            <td className="px-2 py-1.5 text-right text-text-strong">{fmt(r.build.weightLbFt2, 2)}</td>
                                            <td className="px-2 py-1.5 text-right text-text-strong">{metricRating ? fmt(r.build.ratingKgfM, 0) : fmt(r.build.ratingLbIn === null ? null : r.build.ratingLbIn * 12, 0)}</td>
                                            <td className={`px-2 py-1.5 text-right ${body}`}>
                                                {r.belt.radiusCapable
                                                    ? (widthIn > 0 && minR !== null ? `${minR.toFixed(1)}"` : fmt(r.belt.collapseFactor, 2))
                                                    : <span className="text-text-dim">straight</span>}
                                            </td>
                                            <td className={`px-2 py-1.5 text-right ${body}`}>{r.belt.radiusCapable ? (r.belt.curveRatingFraction !== null ? `${(r.belt.curveRatingFraction * 100).toFixed(0)}%` : 'default') : '—'}</td>
                                            <td className={`px-2 py-1.5 text-right ${body}`}>{fmt(r.belt.maxSpeedFpm, 0)}</td>
                                            <td className={`px-2 py-1.5 text-right ${body}`}>{fmt(r.belt.openAreaPct, 0)}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {selectedChoice && (
                    <div className="readout rounded-lg border border-border px-3 py-2.5 text-xs space-y-1">
                        <div className="text-text-strong font-medium">{selectedChoice.label}</div>
                        <div className="text-text-body font-mono">
                            {selectedChoice.belt.type} · pitch {fmt(selectedChoice.belt.pitchMm)} mm · {fmt(selectedChoice.build.weightLbFt2, 2)} lb/ft² ·
                            rating {fmt(selectedChoice.build.ratingLbIn, 1)} lb/in ({fmt(selectedChoice.build.ratingKgfM, 0)} kgf/m)
                            {selectedChoice.belt.radiusCapable && selectedChoice.belt.collapseFactor
                                ? ` · min inside radius ${selectedChoice.belt.collapseFactor} × width${widthIn > 0 ? ` = ${(selectedChoice.belt.collapseFactor * widthIn).toFixed(1)}" at ${widthIn}"` : ''}`
                                : ' · straight-run belt'}
                        </div>
                        {selectedChoice.belt.tempRangeF && (
                            <div className="text-text-dim">Temperature {selectedChoice.belt.tempRangeF.min ?? '?'}–{selectedChoice.belt.tempRangeF.max ?? '?'} °F</div>
                        )}
                        {selectedChoice.belt.sprockets.length > 0 && (
                            <div className="text-text-dim">Sprockets: {selectedChoice.belt.sprockets.map((s) => `${s.name}${s.pitchDiameterIn ? ` (PD ${s.pitchDiameterIn}")` : ''}`).join(', ')}</div>
                        )}
                        <div className="text-[11px] text-text-dim">Rating = vendor allowable working tension at room temperature. Pick this belt in the Belt Pull solver to load these values.</div>
                    </div>
                )}

                <div className="text-[11px] text-text-dim">
                    Source: AQS catalog spec feed (engineering data only; edited in the quoting tool Database tab). Snapshot fallback bundled with the site.
                </div>

                {/* Sprocket pitch diameter: PD = pitch ÷ sin(180°/z) */}
                <div className="rounded-lg border border-border bg-surface-page/50 px-3 py-2.5 space-y-2">
                    <div className="text-xs text-text-body uppercase tracking-wider">Sprocket pitch diameter</div>
                    <div className="grid grid-cols-3 gap-2">
                        <div>
                            <label className={labelCls}>Belt pitch (mm)</label>
                            <input type="number" min="0" step="any" value={spPitchMm} className={inputCls} onChange={(e) => setSpPitchMm(e.target.value)} />
                        </div>
                        <div>
                            <label className={labelCls}>Teeth</label>
                            <input type="number" min="3" step="1" value={spTeeth} className={inputCls} onChange={(e) => setSpTeeth(e.target.value)} />
                        </div>
                        <div>
                            <label className={labelCls}>Belt speed (ft/min) — for rpm</label>
                            <input type="number" min="0" step="any" value={spSpeed} className={inputCls} onChange={(e) => setSpSpeed(e.target.value)} />
                        </div>
                    </div>
                    <div className="text-xs text-text-body">
                        PD = pitch ÷ sin(180°/z) = <span className="font-mono text-accent-text">{spPdMm > 0 ? `${spPdMm.toFixed(1)} mm · ${spPdIn.toFixed(3)} in` : '—'}</span>
                        {spRpm > 0 && <span className="font-mono text-text-dim"> · shaft {spRpm.toFixed(1)} rpm at {spSpeed} ft/min</span>}
                    </div>
                    <div className="text-[11px] text-text-dim">Chordal PD is what the drive math uses; vendors may dimension non-chordally, so take the drawing figure when you have one. Fewer teeth = smaller radius = less torque for the same pull.</div>
                </div>
            </div>
        </div>
    )
}
