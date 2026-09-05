import { useState, useMemo, useEffect } from 'react'
import { Plus, Trash2, Link2 } from 'lucide-react'
import { PinButton } from '@/toolbox/components/ui/PinButton'
import { showToast } from '@/toolbox/components/ui/Toast'
import { useAppStore } from '@/toolbox/stores/appStore'
import { hubMotorData, interpolateMotorSpecs } from '@/toolbox/data/hubMotorData'
import {
    calculateBeltPull, calculateAllScenarios, pathSummary, isIncline,
    wearFactors, scenarioFrictions, wearstripMaterials,
    defaultBeltPullConfig, exampleConfigs, solveRailMu, LBF_TO_N,
    chordalPdMm, torqueNmFromPull, thermalUpliftFactor, sprocketScreens,
    type BeltPullConfig, type TurnSection, type InclineSection, type PathSection, type SurfaceMaterials,
    type ReturnSegment,
} from '@/toolbox/lib/calculators/beltPull'

/** Section field patch — the kind discriminant is fixed at creation, never patched */
type SectionPatch = Partial<Omit<TurnSection, 'kind'>> & Partial<Omit<InclineSection, 'kind'>>

/** Onshape configurator commons for turn angles */
const ANGLE_PRESETS = [30, 60, 90, 120, 150, 180]

const inputCls = 'w-full px-2 py-2 bg-dark-900 border border-border rounded-lg text-text-primary font-mono text-sm focus:outline-none focus:border-primary'
const selectCls = 'w-full px-2 py-2 bg-dark-900 border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-primary'
const labelCls = 'block text-xs text-text-muted mb-1'

function num(v: string, fallback = 0): number {
    const n = parseFloat(v)
    return isNaN(n) ? fallback : n
}

/** Utilization color: green < 60%, yellow 60–85%, red > 85% */
function utilizationCls(pct: number): string {
    if (pct < 60) return 'text-success'
    if (pct <= 85) return 'text-warning'
    return 'text-error'
}

function mergeConfig(parsed: Partial<BeltPullConfig>): BeltPullConfig {
    const merged = { ...defaultBeltPullConfig, ...parsed }
    // Configs saved before the materials/wear split carry resolved frictions only —
    // label them custom rather than falsely claiming a clean wear state
    if (!parsed.wearId && parsed.frictions) merged.wearId = 'custom'
    return merged
}

function loadInitialConfig(stored: string | null): BeltPullConfig {
    // Shared link takes priority, then the persisted config, then the S-path example
    try {
        const p = new URLSearchParams(window.location.search).get('beltpull')
        if (p) return mergeConfig(JSON.parse(atob(p)))
    } catch { /* fall through */ }
    try {
        if (stored) return mergeConfig(JSON.parse(stored))
    } catch { /* fall through */ }
    return exampleConfigs[0].config
}

export function BeltPullCalculator() {
    const pinned = useAppStore((s) => s.pinnedCalculators.includes('beltPull'))
    const togglePin = useAppStore((s) => s.togglePinCalculator)
    const setBeltPullConfig = useAppStore((s) => s.setBeltPullConfig)

    const [cfg, setCfg] = useState<BeltPullConfig>(() => loadInitialConfig(useAppStore.getState().beltPullConfig))
    const [accumulated, setAccumulated] = useState(() => cfg.loadMode === 'accumulated')

    // Drive selection state
    const [driveType, setDriveType] = useState<'drum' | 'sprocket'>('sprocket')
    const [ratedPullN, setRatedPullN] = useState('')
    const [presetSeries, setPresetSeries] = useState('')
    const [drumDiaMm, setDrumDiaMm] = useState('')
    // Sprocket (AMO-based entry): torque = pull × PITCH radius, not shell radius
    const [teeth, setTeeth] = useState('11')
    const [pitchMm, setPitchMm] = useState('50')
    const [pdOverrideIn, setPdOverrideIn] = useState('')
    const [boreMm, setBoreMm] = useState('')
    const [shellMm, setShellMm] = useState('')
    const [contNm, setContNm] = useState('')
    const [peakNm, setPeakNm] = useState('')
    const [maxRpmIn, setMaxRpmIn] = useState('')
    const [catalogNm, setCatalogNm] = useState('')
    const [catalogInterp, setCatalogInterp] = useState('3')
    const [usedCatalog, setUsedCatalog] = useState(false)
    const [ambientC, setAmbientC] = useState('')

    // Persist the working config (survives reloads; pinned copy shares via store on remount)
    useEffect(() => { setBeltPullConfig(JSON.stringify(cfg)) }, [cfg, setBeltPullConfig])

    // Cross-tool inbox: subscribe for one-shot messages from the Belt Load card.
    // (All views stay mounted, so the subscription is always live before a send.)
    useEffect(() => useAppStore.subscribe((state, prev) => {
        const patch = state.beltPullInbox
        if (patch && patch !== prev.beltPullInbox) {
            setCfg((c) => {
                const { carrywayBaseMu, ...rest } = patch as Partial<BeltPullConfig> & { carrywayBaseMu?: number }
                let next = { ...c, ...rest }
                // Wearstrip calculator sends its material's mu: the strip IS the
                // carryway (and usually the return rails) — update those bases
                if (typeof carrywayBaseMu === 'number' && carrywayBaseMu > 0) {
                    const materials = { ...next.materials, carrywayBase: carrywayBaseMu, returnBase: carrywayBaseMu }
                    const factor = wearFactors.find((f) => f.id === next.wearId)
                    next = factor
                        ? { ...next, materials, frictions: scenarioFrictions(materials, factor) }
                        : { ...next, materials, frictions: { ...next.frictions, carryway: carrywayBaseMu, return: carrywayBaseMu } }
                }
                return next
            })
            useAppStore.getState().clearBeltPullInbox()
        }
    }), [])

    const upd = (patch: Partial<BeltPullConfig>) => setCfg((c) => ({ ...c, ...patch }))
    const updSection = (i: number, patch: SectionPatch) =>
        setCfg((c) => ({ ...c, sections: c.sections.map((s, j) => (j === i ? { ...s, ...patch } as PathSection : s)) }))

    const result = useMemo(() => calculateBeltPull(cfg), [cfg])
    const scenarios = useMemo(() => calculateAllScenarios(cfg), [cfg])
    const activeScenario = cfg.wearId

    // Materials are the base (design) dimension; wear scenarios multiply them.
    const setMaterialBase = (key: keyof SurfaceMaterials, value: number) => {
        setCfg((c) => {
            const materials = { ...c.materials, [key]: value }
            const factor = wearFactors.find((f) => f.id === c.wearId) ?? wearFactors[0]
            return { ...c, materials, frictions: scenarioFrictions(materials, factor) }
        })
    }

    // Powered-pulley presets: our hub motor data interpolated at this belt width
    const widthMm = cfg.beltWidthIn * 25.4
    const pulleyPresets = useMemo(() =>
        hubMotorData.map((m) => {
            const specs = interpolateMotorSpecs(m, widthMm)
            const fits = widthMm >= m.minLength && widthMm <= m.maxLength
            return { series: m.series, diameter: m.diameter, pullN: specs.beltPull, rpm60Hz: m.rpm60Hz, fits }
        }), [widthMm])

    // Thermal ambient uplift (engineering allowance, not a vendor rating)
    const thermal = useMemo(() => {
        const amb = parseFloat(ambientC)
        return isNaN(amb) ? 1 : thermalUpliftFactor(amb)
    }, [ambientC])

    // Available pull for the selected drive
    const drive = useMemo(() => {
        if (driveType === 'drum') {
            const pull = num(ratedPullN)
            if (pull <= 0) return null
            const dia = num(drumDiaMm)
            const rpm = dia > 0 ? (cfg.beltSpeedFpm * 304.8) / (Math.PI * dia) : null
            const preset = pulleyPresets.find((p) => p.series === presetSeries)
            return { availableN: pull, peakN: pull, rpm, maxRpm: preset?.rpm60Hz ?? null, screens: [] as string[], pdMm: null as number | null }
        }
        const z = num(teeth)
        const pitch = num(pitchMm)
        const pdMm = num(pdOverrideIn) > 0 ? num(pdOverrideIn) * 25.4 : chordalPdMm(pitch, z)
        const cont = num(contNm)
        if (pdMm <= 0 || cont <= 0) return null
        const radiusM = pdMm / 2000
        const pdIn = pdMm / 25.4
        const rpm = (cfg.beltSpeedFpm * 12) / (Math.PI * pdIn)
        const screens = sprocketScreens(pdMm, z, pitch, num(boreMm) || null, num(shellMm) || null)
        return {
            availableN: cont / radiusM,
            peakN: (num(peakNm) || cont) / radiusM,
            rpm,
            maxRpm: num(maxRpmIn) > 0 ? num(maxRpmIn) : null,
            screens,
            pdMm,
        }
    }, [driveType, ratedPullN, drumDiaMm, presetSeries, pulleyPresets, teeth, pitchMm, pdOverrideIn, boreMm, shellMm, contNm, peakNm, maxRpmIn, cfg.beltSpeedFpm])

    const applyExample = (id: string) => {
        const ex = exampleConfigs.find((e) => e.id === id)
        if (ex) {
            setCfg(structuredClone(ex.config))
            setAccumulated(ex.config.loadMode === 'accumulated')
        }
    }

    const shareLink = () => {
        const url = `${window.location.origin}${window.location.pathname}?beltpull=${encodeURIComponent(btoa(JSON.stringify(cfg)))}`
        navigator.clipboard.writeText(url).then(() => showToast('Share link copied'))
    }

    const setLoadMode = (mode: 'rate' | 'direct' | 'bulk') => {
        if (mode === 'bulk') {
            setAccumulated(false)
            upd({ loadMode: 'bulk' })
            return
        }
        upd({ loadMode: accumulated ? 'accumulated' : mode })
    }
    const baseLoadMode = cfg.loadMode === 'accumulated' ? 'rate' : cfg.loadMode

    return (
        <div className="bg-dark-800 border border-border rounded-xl">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text-primary">Radius/S-Conveyor Belt Pull</h3>
                <div className="flex items-center gap-1.5">
                    <button onClick={shareLink} title="Copy shareable link"
                        className="p-1.5 rounded-md text-text-muted hover:text-primary hover:bg-dark-700 transition-colors">
                        <Link2 className="w-3.5 h-3.5" />
                    </button>
                    <PinButton pinned={pinned} onToggle={() => togglePin('beltPull')} />
                </div>
            </div>
            <div className="p-4 space-y-4">
                {/* Examples */}
                <div className="flex items-center gap-2">
                    <select value="" onChange={(e) => e.target.value && applyExample(e.target.value)} className={selectCls}>
                        <option value="">Load example configuration…</option>
                        {exampleConfigs.map((e) => <option key={e.id} value={e.id}>{e.label}</option>)}
                    </select>
                </div>

                {/* ── Path builder ── */}
                <div className="space-y-2">
                    <div className="text-xs text-text-secondary uppercase tracking-wider">Conveyor Path</div>
                    <div className="grid grid-cols-3 gap-2">
                        <div>
                            <label className={labelCls}>Infeed Straight (in)</label>
                            <input type="number" min="0" step="any" value={cfg.infeedStraightIn || ''} className={inputCls}
                                onChange={(e) => upd({ infeedStraightIn: num(e.target.value) })} />
                        </div>
                        <div>
                            <label className={labelCls}>Infeed Height (in)</label>
                            <input type="number" step="any" value={cfg.infeedHeightIn || ''} placeholder="0" className={inputCls}
                                onChange={(e) => upd({ infeedHeightIn: num(e.target.value) })} />
                        </div>
                        <div>
                            <label className={labelCls}>Outfeed Height (in)</label>
                            <input type="number" step="any" value={cfg.outfeedHeightIn || ''} placeholder="0" className={inputCls}
                                onChange={(e) => upd({ outfeedHeightIn: num(e.target.value) })} />
                        </div>
                    </div>
                    {cfg.sections.map((s, i) => {
                        if (isIncline(s)) {
                            const angle = s.lengthIn > 0 && Math.abs(s.riseIn) <= s.lengthIn
                                ? (Math.asin(s.riseIn / s.lengthIn) * 180 / Math.PI)
                                : null
                            return (
                                <div key={i} className="rounded-lg border border-warning/30 bg-dark-900/50 px-3 py-2 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-mono text-warning">{s.riseIn >= 0 ? '↗' : '↘'} Incline {i + 1}</span>
                                        <button onClick={() => setCfg((c) => ({ ...c, sections: c.sections.filter((_, j) => j !== i) }))}
                                            className="p-1 text-text-muted hover:text-error transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                                    </div>
                                    <div className="grid grid-cols-2 @md:grid-cols-3 gap-2 items-end">
                                        <div>
                                            <label className={labelCls}>Belt Length (in)</label>
                                            <input type="number" min="0" step="any" value={s.lengthIn || ''} className={inputCls}
                                                onChange={(e) => updSection(i, { lengthIn: num(e.target.value) })} />
                                        </div>
                                        <div>
                                            <label className={labelCls}>Rise (in, − for decline)</label>
                                            <input type="number" step="any" value={s.riseIn || ''} placeholder="0" className={inputCls}
                                                onChange={(e) => updSection(i, { riseIn: num(e.target.value) })} />
                                        </div>
                                        <div className="text-xs font-mono text-text-muted pb-2.5">
                                            {angle !== null ? `${angle.toFixed(1)}° slope` : '—'}
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                        return (
                            <div key={i} className="rounded-lg border border-border bg-dark-900/50 px-3 py-2 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-mono text-primary">Turn {i + 1} + straight</span>
                                    <button onClick={() => setCfg((c) => ({ ...c, sections: c.sections.filter((_, j) => j !== i) }))}
                                        className="p-1 text-text-muted hover:text-error transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {ANGLE_PRESETS.map((a) => (
                                        <button key={a} onClick={() => updSection(i, { angleDeg: a })}
                                            className={`px-2 py-1 rounded text-xs font-mono border transition-colors ${
                                                s.angleDeg === a ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-dark-900 text-text-secondary hover:border-text-muted'
                                            }`}>
                                            {a}°
                                        </button>
                                    ))}
                                </div>
                                <div className="grid grid-cols-2 @md:grid-cols-4 gap-2">
                                    <div>
                                        <label className={labelCls}>Angle (°, custom)</label>
                                        <input type="number" min="1" max="180" step="any" value={s.angleDeg || ''} className={inputCls}
                                            onChange={(e) => updSection(i, { angleDeg: num(e.target.value, 90) })} />
                                    </div>
                                    <div>
                                        <label className={labelCls}>Inside R (in)</label>
                                        <input type="number" min="0" step="any" value={s.insideRadiusIn || ''} className={inputCls}
                                            onChange={(e) => updSection(i, { insideRadiusIn: num(e.target.value) })} />
                                    </div>
                                    <div>
                                        <label className={labelCls}>Direction</label>
                                        <select value={s.direction} className={selectCls}
                                            onChange={(e) => updSection(i, { direction: e.target.value as 'L' | 'R' })}>
                                            <option value="L">Left</option>
                                            <option value="R">Right</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className={labelCls}>Straight After (in)</label>
                                        <input type="number" min="0" step="any" value={s.straightAfterIn || ''} placeholder="0" className={inputCls}
                                            onChange={(e) => updSection(i, { straightAfterIn: num(e.target.value) })} />
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={() => setCfg((c) => ({ ...c, sections: [...c.sections, { angleDeg: 90, insideRadiusIn: 18.4, direction: c.sections.length % 2 ? 'R' : 'L', straightAfterIn: 0 }] }))}
                            className="px-3 py-2 border border-dashed border-border rounded-lg text-text-muted text-sm hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-1.5">
                            <Plus className="w-4 h-4" /> Turn + Straight
                        </button>
                        <button
                            onClick={() => setCfg((c) => ({ ...c, sections: [...c.sections, { kind: 'incline', lengthIn: 48, riseIn: 12 }] }))}
                            className="px-3 py-2 border border-dashed border-warning/40 rounded-lg text-text-muted text-sm hover:border-warning hover:text-warning transition-colors flex items-center justify-center gap-1.5">
                            <Plus className="w-4 h-4" /> Incline
                        </button>
                    </div>
                    <div className="px-3 py-1.5 bg-dark-900 rounded text-xs font-mono text-text-secondary overflow-x-auto whitespace-nowrap">
                        {pathSummary(cfg)}
                    </div>
                </div>

                {/* ── Belt & load ── */}
                <div className="space-y-2">
                    <div className="text-xs text-text-secondary uppercase tracking-wider">Belt & Load</div>
                    <div className="grid grid-cols-2 @md:grid-cols-3 gap-2">
                        <div>
                            <label className={labelCls}>Belt Width (in)</label>
                            <input type="number" min="1" step="any" value={cfg.beltWidthIn || ''} className={inputCls}
                                onChange={(e) => upd({ beltWidthIn: num(e.target.value, 12) })} />
                        </div>
                        <div>
                            <label className={labelCls}>Belt Weight (lb/ft², POM basis)</label>
                            <div className="flex gap-1">
                                <input type="number" min="0" step="any" value={cfg.beltWeightLbFt2 || ''} className={inputCls}
                                    onChange={(e) => upd({ beltWeightLbFt2: num(e.target.value, 1.64) })} />
                                <select value={cfg.beltBuild} onChange={(e) => upd({ beltBuild: e.target.value as 'pom' | 'pp' })}
                                    className="px-1.5 py-2 bg-dark-900 border border-border rounded-lg text-text-secondary text-xs focus:outline-none shrink-0">
                                    <option value="pom">POM</option>
                                    <option value="pp">PP</option>
                                </select>
                            </div>
                            {cfg.beltBuild === 'pp' && (
                                <div className="text-[10px] text-text-muted mt-0.5">PP: weight ×0.75, straight capacity ×0.65, relaxes the curve-speed concern. Verify per NGB sheet.</div>
                            )}
                        </div>
                        <div>
                            <label className={labelCls} title="Speed sets RPM and startup acceleration — running pull is friction-driven and speed-independent">
                                Belt Speed (ft/min) ⓘ
                            </label>
                            <input type="number" min="0" step="any" value={cfg.beltSpeedFpm || ''} className={inputCls}
                                onChange={(e) => upd({ beltSpeedFpm: num(e.target.value, 60) })} />
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="flex gap-1">
                            {(['rate', 'direct', 'bulk'] as const).map((m) => (
                                <button key={m} onClick={() => setLoadMode(m)} disabled={accumulated && m !== 'bulk'}
                                    className={`px-2.5 py-1.5 rounded-lg text-xs border transition-colors disabled:opacity-40 ${
                                        baseLoadMode === m ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-dark-900 text-text-secondary'
                                    }`}>
                                    {m === 'rate' ? 'Rate (lb/hr)' : m === 'direct' ? 'Direct (lbf)' : 'Bulk (bed)'}
                                </button>
                            ))}
                        </div>
                        <label className={`flex items-center gap-1.5 text-xs cursor-pointer ${
                            baseLoadMode === 'bulk' ? 'text-text-muted opacity-40 cursor-not-allowed' : 'text-text-secondary'
                        }`}>
                            <input type="checkbox" checked={accumulated} disabled={baseLoadMode === 'bulk'}
                                onChange={(e) => { setAccumulated(e.target.checked); upd({ loadMode: e.target.checked ? 'accumulated' : 'rate' }) }} />
                            Product backed up / accumulated
                        </label>
                    </div>
                    {cfg.loadMode === 'rate' && (
                        <div>
                            <label className={labelCls}>Throughput (lb/hr)</label>
                            <input type="number" min="0" step="any" value={cfg.throughputLbHr || ''} className={inputCls}
                                onChange={(e) => upd({ throughputLbHr: num(e.target.value) })} />
                        </div>
                    )}
                    {cfg.loadMode === 'direct' && (
                        <div>
                            <label className={labelCls}>Total Product on Belt (lbf)</label>
                            <input type="number" min="0" step="any" value={cfg.directLoadLbf || ''} className={inputCls}
                                onChange={(e) => upd({ directLoadLbf: num(e.target.value) })} />
                        </div>
                    )}
                    {cfg.loadMode === 'bulk' && (
                        <div className="space-y-2">
                            <div className="grid grid-cols-3 gap-2">
                                <div>
                                    <label className={labelCls}>Loose Density (lb/ft³)</label>
                                    <input type="number" min="0" step="any" value={cfg.bulkDensityLbFt3 || ''} className={inputCls}
                                        onChange={(e) => upd({ bulkDensityLbFt3: num(e.target.value) })} />
                                </div>
                                <div>
                                    <label className={labelCls}>Bed Depth (in)</label>
                                    <input type="number" min="0" step="any" value={cfg.bedDepthIn || ''} className={inputCls}
                                        onChange={(e) => upd({ bedDepthIn: num(e.target.value) })} />
                                </div>
                                <div>
                                    <label className={labelCls}>Edge Margin (in/side)</label>
                                    <input type="number" min="0" step="any" value={cfg.edgeMarginIn ?? ''} placeholder="1" className={inputCls}
                                        onChange={(e) => upd({ edgeMarginIn: num(e.target.value) })} />
                                </div>
                            </div>
                            {result.bulkAchievedLbHr !== null && (
                                <div className="px-3 py-2 bg-primary/5 border-l-2 border-primary rounded text-xs text-text-secondary">
                                    This bed at {cfg.beltSpeedFpm} ft/min delivers{' '}
                                    <span className="font-mono text-primary">{result.bulkAchievedLbHr.toFixed(0)} lb/hr</span>
                                    {' '}(<span className="font-mono">{result.bulkAchievedFt3Hr!.toFixed(0)} ft³/hr</span>)
                                    {' '}— check this against the plant's demanded rate. Use loose (as-conveyed) density: bulk
                                    material fluffs up off the pile.
                                </div>
                            )}
                        </div>
                    )}
                    {cfg.loadMode === 'accumulated' && (
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className={labelCls}>Product Length (in)</label>
                                <input type="number" min="0.1" step="any" value={cfg.productLengthIn || ''} className={inputCls}
                                    onChange={(e) => upd({ productLengthIn: num(e.target.value, 12) })} />
                            </div>
                            <div>
                                <label className={labelCls}>Weight per Piece (lb)</label>
                                <input type="number" min="0" step="any" value={cfg.productWeightLb || ''} className={inputCls}
                                    onChange={(e) => upd({ productWeightLb: num(e.target.value) })} />
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Return path (segmented) + drive-position ordering ── */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="text-xs text-text-secondary uppercase tracking-wider">Return Path & Ordering</span>
                        <div className="flex gap-1">
                            {(['worst-case', 'actual'] as const).map((o) => (
                                <button key={o} onClick={() => upd({ ordering: o })}
                                    title={o === 'worst-case' ? 'All straight/return friction before the turns — quoting default' : 'March the real section sequence — analysis'}
                                    className={`px-2 py-1 rounded text-xs border transition-colors ${
                                        cfg.ordering === o ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-dark-900 text-text-secondary'
                                    }`}>
                                    {o === 'worst-case' ? 'Worst-case order' : 'Actual order'}
                                </button>
                            ))}
                        </div>
                    </div>
                    {cfg.returnSegments.map((seg, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <input type="number" min="0" step="any"
                                value={seg.lengthIn ?? ''} placeholder="loop remainder"
                                onChange={(e) => {
                                    const v = e.target.value
                                    const segments = cfg.returnSegments.map((r, j): ReturnSegment =>
                                        j === i ? { ...r, lengthIn: v === '' ? null : num(v) } : r)
                                    upd({ returnSegments: segments })
                                }}
                                className="w-32 px-2 py-1.5 bg-dark-900 border border-border rounded text-text-primary font-mono text-xs focus:outline-none focus:border-primary" />
                            <span className="text-[10px] text-text-muted">in</span>
                            <select value={seg.support}
                                onChange={(e) => upd({ returnSegments: cfg.returnSegments.map((r, j): ReturnSegment => j === i ? { ...r, support: e.target.value as 'slider' | 'roller' } : r) })}
                                className="px-1.5 py-1.5 bg-dark-900 border border-border rounded text-text-secondary text-xs focus:outline-none">
                                <option value="slider">Slider bed (μ return)</option>
                                <option value="roller">Bearinged rollers (μ {cfg.muRoller})</option>
                            </select>
                            <span className="font-mono text-[10px] text-text-muted">
                                → {result.returnResolved[i] ? `${result.returnResolved[i].lengthIn.toFixed(0)}" · ${result.returnResolved[i].frictionLbf.toFixed(2)} lbf` : ''}
                            </span>
                            {cfg.returnSegments.length > 1 && (
                                <button onClick={() => upd({ returnSegments: cfg.returnSegments.filter((_, j) => j !== i) })}
                                    className="p-1 text-text-muted hover:text-error transition-colors"><Trash2 className="w-3 h-3" /></button>
                            )}
                        </div>
                    ))}
                    <div className="flex items-center gap-2">
                        <button onClick={() => upd({ returnSegments: [...cfg.returnSegments, { lengthIn: 0, support: 'slider' }] })}
                            className="px-2 py-1 rounded text-xs border border-dashed border-border text-text-muted hover:border-primary hover:text-primary transition-colors">
                            + segment
                        </button>
                        <span className="text-[10px] text-text-muted">
                            Loop invariant: return total = carry total ({result.carrywayIn.toFixed(0)}"). Blank length = remainder.
                            Layout hint: put a long straight between the last curve and the drive.
                        </span>
                    </div>
                </div>

                {/* ── Wear scenario presets (multipliers over the material bases) ── */}
                <div className="space-y-2">
                    <div className="flex flex-wrap gap-1.5">
                        {wearFactors.map((f) => {
                            const resolved = scenarioFrictions(cfg.materials, f)
                            return (
                                <button key={f.id} onClick={() => upd({ wearId: f.id, frictions: resolved })}
                                    className={`px-2.5 py-1.5 rounded-lg text-xs border transition-colors ${
                                        activeScenario === f.id ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-dark-900 text-text-secondary hover:border-text-muted'
                                    }`}>
                                    {f.label} <span className="font-mono text-[10px]">{resolved.carryway.toFixed(2)}/{resolved.rail.toFixed(2)}</span>
                                </button>
                            )
                        })}
                        {activeScenario === 'custom' && (
                            <span className="px-2.5 py-1.5 rounded-lg text-xs border border-warning/40 bg-warning/10 text-warning">custom μ</span>
                        )}
                    </div>
                    <details>
                        <summary className="text-xs text-text-secondary hover:text-text-primary cursor-pointer select-none">
                            Friction & Tension (advanced)
                        </summary>

                        {/* Surface materials — the design dimension, decoupled from wear */}
                        <div className="mt-2 rounded-lg border border-border bg-dark-900/50 px-3 py-2.5 space-y-2">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                                <span className="text-xs text-text-secondary uppercase tracking-wider">Surface Materials (clean base μ)</span>
                                <div className="flex gap-1 items-center">
                                    <span className="text-[10px] text-text-muted">Turn rails:</span>
                                    {([
                                        { id: 'standard' as const, label: 'Std UHMW', mu: 0.18 },
                                        { id: 'dg321' as const, label: 'DG-321 UltraLube', mu: 0.11 },
                                    ]).map((m) => (
                                        <button key={m.id}
                                            onClick={() => {
                                                const materials = { ...cfg.materials, railBase: m.mu }
                                                const factor = wearFactors.find((f) => f.id === cfg.wearId) ?? wearFactors[0]
                                                upd({ turnRailMaterial: m.id, materials, frictions: scenarioFrictions(materials, factor) })
                                            }}
                                            className={`px-2 py-1 rounded text-xs border transition-colors ${
                                                cfg.turnRailMaterial === m.id ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-dark-900 text-text-secondary'
                                            }`}>
                                            {m.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {result.cornerTier === 'dg321-required' && cfg.turnRailMaterial !== 'dg321' && (
                                <div className="px-2.5 py-2 bg-error/10 border-l-2 border-error rounded text-xs text-error font-medium">
                                    DG-321 turn rails REQUIRED: {cfg.beltSpeedFpm} ft/min &gt; virgin-UHMW corner ceiling {result.vCeilVirginFpm!.toFixed(0)} ft/min.
                                </div>
                            )}
                            {([
                                { key: 'carrywayBase' as const, label: 'Carryway wearstrips' },
                                { key: 'railBase' as const, label: 'Turn rails + capture plate' },
                                { key: 'returnBase' as const, label: 'Return / carryback' },
                            ]).map((row) => (
                                <div key={row.key} className="flex items-center gap-2">
                                    <span className="text-xs text-text-muted w-40 shrink-0">{row.label}</span>
                                    <input type="number" min="0" step="0.01" value={cfg.materials[row.key]}
                                        onChange={(e) => setMaterialBase(row.key, num(e.target.value, 0.18))}
                                        className="w-20 px-2 py-1.5 bg-dark-900 border border-border rounded text-text-primary font-mono text-xs focus:outline-none focus:border-primary" />
                                    <select value={wearstripMaterials.find((m) => m.mu === cfg.materials[row.key])?.id ?? ''}
                                        onChange={(e) => {
                                            const m = wearstripMaterials.find((x) => x.id === e.target.value)
                                            if (m) setMaterialBase(row.key, m.mu)
                                        }}
                                        className="flex-1 px-1.5 py-1.5 bg-dark-900 border border-border rounded text-text-secondary text-xs focus:outline-none">
                                        <option value="">Custom…</option>
                                        {wearstripMaterials.map((m) => <option key={m.id} value={m.id}>{m.label} ({m.mu})</option>)}
                                    </select>
                                </div>
                            ))}
                            <div className="text-[10px] text-text-muted">
                                Wear buttons above scale each surface's own base — mixed materials (e.g. lubricated-UHMW rails on
                                standard-UHMW carryway) stay decoupled through every scenario. Datasheet COFs are typically
                                vs. polished steel (ASTM D1894); belt-edge-on-rail runs higher — calibrate below for the real pair.
                            </div>
                        </div>

                        <div className="mt-2 grid grid-cols-2 @md:grid-cols-3 gap-2">
                            <div>
                                <label className={labelCls}>μ Carryway (active)</label>
                                <input type="number" min="0" step="0.01" value={cfg.frictions.carryway} className={inputCls}
                                    onChange={(e) => upd({ wearId: 'custom', frictions: { ...cfg.frictions, carryway: num(e.target.value, 0.18) } })} />
                            </div>
                            <div>
                                <label className={labelCls}>μ Turn Rail (active)</label>
                                <input type="number" min="0" step="0.01" value={cfg.frictions.rail} className={inputCls}
                                    onChange={(e) => upd({ wearId: 'custom', frictions: { ...cfg.frictions, rail: num(e.target.value, 0.18) } })} />
                            </div>
                            <div>
                                <label className={labelCls}>μ Return (active)</label>
                                <input type="number" min="0" step="0.01" value={cfg.frictions.return} className={inputCls}
                                    onChange={(e) => upd({ wearId: 'custom', frictions: { ...cfg.frictions, return: num(e.target.value, 0.18) } })} />
                            </div>
                            <div>
                                <label className={labelCls}>Back Tension (lbf/ft width)</label>
                                <input type="number" min="0" step="any" value={cfg.backTensionLbfPerFtWidth} className={inputCls}
                                    onChange={(e) => upd({ backTensionLbfPerFtWidth: num(e.target.value, 0) })} />
                                <div className="text-[10px] text-text-muted mt-0.5">
                                    Modular belts with catenary take-up run near-zero slack tension. Enter a value only
                                    if a mechanical tensioner or known slack-side load exists.{result.backTensionLbf > 0 ? ` (= ${result.backTensionLbf.toFixed(1)} lbf)` : ''}
                                </div>
                            </div>
                            <div>
                                <label className={labelCls}>μ Return Rollers (assumed)</label>
                                <input type="number" min="0" step="0.005" value={cfg.muRoller} className={inputCls}
                                    onChange={(e) => upd({ muRoller: num(e.target.value, 0.04) })} />
                                <div className="text-[10px] text-text-muted mt-0.5">Bearinged rollers, 0.03–0.05 plausible.</div>
                            </div>
                            <div>
                                <label className={labelCls}>Static Ratio / Ramp (s) / Breakaway</label>
                                <div className="flex gap-1">
                                    <input type="number" min="1" step="0.01" value={cfg.staticRatio} className={inputCls}
                                        onChange={(e) => upd({ staticRatio: num(e.target.value, 1.11) })} />
                                    <input type="number" min="0.1" step="0.1" value={cfg.rampTimeS} className={inputCls}
                                        onChange={(e) => upd({ rampTimeS: num(e.target.value, 1.0) })} />
                                    <input type="number" min="1" step="0.05" value={cfg.breakawayFactor} className={inputCls}
                                        onChange={(e) => upd({ breakawayFactor: num(e.target.value, 1.25) })} />
                                </div>
                            </div>
                            <div>
                                <label className={labelCls}>Belt Straight Rating (kgf/m) / Curve Derate / Collapse Factor</label>
                                <div className="flex gap-1">
                                    <input type="number" min="0" step="any" value={cfg.straightRatingKgfM} className={inputCls}
                                        onChange={(e) => upd({ straightRatingKgfM: num(e.target.value, 205) })} />
                                    <input type="number" min="0.05" max="1" step="0.01" value={cfg.curveDerate} className={inputCls}
                                        onChange={(e) => upd({ curveDerate: num(e.target.value, 0.23) })} />
                                    <input type="number" min="1" step="0.1" value={cfg.collapseFactor} className={inputCls}
                                        onChange={(e) => upd({ collapseFactor: num(e.target.value, 1.5) })} />
                                </div>
                                <div className="text-[10px] text-text-muted mt-0.5">
                                    Curve capacity ≈ 20–26% of straight rating industry-wide (bounded screen until the vendor
                                    publishes one). Collapse factor = min inside-radius ratio — geometry compliance, never a tension derating.
                                </div>
                            </div>
                            <div>
                                <label className={labelCls}>Corner Contact Band (in)</label>
                                <input type="number" min="0.05" step="0.05" value={cfg.contactBandIn} className={inputCls}
                                    onChange={(e) => upd({ contactBandIn: num(e.target.value, 0.5) })} />
                                <div className="text-[10px] text-text-muted mt-0.5">
                                    Belt-edge/rail contact width for corner pressure. Model anchors (V_ref 98 @ μ 0.18 / 2.44 psi,
                                    ×0.75 confidence, 200 ft/min cap) are flagged constants pending the coupon test.
                                </div>
                            </div>
                        </div>

                        {/* Corner drag model: mu_rail is a lumped number — edge friction plus
                            link stacking plus inside-edge concentration, which grow as the
                            turn ratio approaches the belt's collapse limit */}
                        <div className="mt-3 rounded-lg border border-border bg-dark-900/50 px-3 py-2.5 space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-text-secondary uppercase tracking-wider">Corner Drag Model</span>
                                <div className="flex gap-1">
                                    {(['fixed', 'ratio-scaled'] as const).map((m) => (
                                        <button key={m}
                                            onClick={() => upd({ turnDragModel: { ...cfg.turnDragModel, mode: m } })}
                                            className={`px-2 py-1 rounded text-xs border transition-colors ${
                                                cfg.turnDragModel.mode === m ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-dark-900 text-text-secondary'
                                            }`}>
                                            {m === 'fixed' ? 'Fixed μ' : 'Ratio-scaled'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {cfg.turnDragModel.mode === 'ratio-scaled' && (
                                <>
                                    <div className="flex items-center gap-3">
                                        <label className="text-xs text-text-muted whitespace-nowrap">Scaling n</label>
                                        <input type="range" min="0" max="1.5" step="0.05" value={cfg.turnDragModel.exponent}
                                            onChange={(e) => upd({ turnDragModel: { ...cfg.turnDragModel, exponent: num(e.target.value, 0.5) } })}
                                            className="flex-1 accent-[var(--color-primary,#22d3ee)]" />
                                        <span className="font-mono text-xs text-primary w-10 text-right">{cfg.turnDragModel.exponent.toFixed(2)}</span>
                                        <label className="text-xs text-text-muted whitespace-nowrap ml-2">Ref ratio</label>
                                        <input type="number" min="1" step="0.1" value={cfg.turnDragModel.refRatio}
                                            onChange={(e) => upd({ turnDragModel: { ...cfg.turnDragModel, refRatio: num(e.target.value, 2.2) } })}
                                            className="w-16 px-2 py-1 bg-dark-900 border border-border rounded text-text-primary font-mono text-xs focus:outline-none focus:border-primary" />
                                    </div>
                                    <div className="text-[10px] text-text-muted">
                                        μ_eff = μ_rail × (ref ÷ ratio)ⁿ below the reference ratio — tight turns drag harder as the belt
                                        approaches its collapse limit. n is a belt-family property: calibrate it with two known points
                                        (one gentle turn, one tight) from a vendor program or pull test.
                                    </div>
                                </>
                            )}
                            {/* Calibration back-solver — solved value is a material-system
                                property, so it lands in the rail BASE (clean) and the wear
                                scenarios scale from there */}
                            <CalibrationSolver cfg={cfg} onApply={(mu2) => {
                                const materials = { ...cfg.materials, railBase: mu2 }
                                upd({ materials, wearId: 'clean', frictions: scenarioFrictions(materials, wearFactors[0]) })
                            }} />
                        </div>
                    </details>

                    {/* Service factors (Forbo additive) */}
                    <details>
                        <summary className="text-xs text-text-secondary hover:text-text-primary cursor-pointer select-none">
                            Service Factors — SF = {result.serviceFactor.toFixed(1)}
                        </summary>
                        <div className="mt-2 space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className={labelCls}>Nose Bar — Infeed End</label>
                                    <select value={cfg.serviceFactors.noseInfeed}
                                        onChange={(e) => upd({ serviceFactors: { ...cfg.serviceFactors, noseInfeed: e.target.value as 'none' | 'bearinged' | 'static' } })}
                                        className={selectCls}>
                                        <option value="none">None</option>
                                        <option value="bearinged">Bearinged (rolling — no adder)</option>
                                        <option value="static">Static (+0.4)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelCls}>Nose Bar — Discharge End</label>
                                    <select value={cfg.serviceFactors.noseDischarge}
                                        onChange={(e) => upd({ serviceFactors: { ...cfg.serviceFactors, noseDischarge: e.target.value as 'none' | 'bearinged' | 'static' } })}
                                        className={selectCls}>
                                        <option value="none">None</option>
                                        <option value="bearinged">Bearinged (rolling — no adder)</option>
                                        <option value="static">Static (+0.4)</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-4">
                                <label className="flex items-center gap-1.5 text-xs text-text-secondary cursor-pointer">
                                    <input type="checkbox" checked={cfg.serviceFactors.startStop}
                                        onChange={(e) => upd({ serviceFactors: { ...cfg.serviceFactors, startStop: e.target.checked } })} />
                                    Frequent loaded start-stop (+0.2)
                                </label>
                                <label className="flex items-center gap-1.5 text-xs text-text-secondary cursor-pointer">
                                    <input type="checkbox" checked={cfg.serviceFactors.biDirectional}
                                        onChange={(e) => upd({ serviceFactors: { ...cfg.serviceFactors, biDirectional: e.target.checked } })} />
                                    Bi-directional / center drive (+0.2)
                                </label>
                            </div>
                            <div className="space-y-0.5">
                                {result.sfAdders.map((a) => (
                                    <div key={a.label} className={`text-[10px] font-mono ${a.active ? 'text-warning' : 'text-text-muted'}`}>
                                        {a.active ? '●' : '○'} +{a.value.toFixed(1)} {a.label}{a.auto ? ` (${a.auto})` : ''}
                                    </div>
                                ))}
                            </div>
                            <div className="text-[10px] text-text-muted">
                                AQS standard practice is bearinged nose bars — no adder. Floors: continuous ≥ Central × SF;
                                peak ≥ {cfg.breakawayFactor} × Central × SF.
                            </div>
                        </div>
                    </details>
                </div>

                {/* ── RESULTS ── */}
                <div className="rounded-lg border border-primary/20 bg-dark-700 overflow-hidden">
                    <div className="px-4 py-3 bg-primary/5 border-b border-primary/20">
                        <div className="text-xs text-text-muted uppercase">Belt Pull ({wearFactors.find((f) => f.id === activeScenario)?.label ?? 'custom μ'})</div>
                        <div className="font-mono text-2xl font-semibold text-primary">
                            {result.beltPullLbf.toFixed(1)} lbf
                            <span className="text-sm text-text-secondary ml-2">{result.beltPullN.toFixed(0)} N</span>
                        </div>
                        <div className="text-xs font-mono text-text-secondary mt-0.5">
                            Startup: {result.startupPullLbf.toFixed(1)} lbf ({result.startupPullN.toFixed(0)} N)
                        </div>
                        <div className="text-xs font-mono mt-1">
                            <span className="text-text-muted">Band: </span>
                            <span className="text-text-secondary">Low {result.lowLbf.toFixed(1)}</span>
                            <span className="text-text-muted"> / </span>
                            <span className="text-primary font-semibold">Central {result.centralLbf.toFixed(1)}</span>
                            <span className="text-text-muted"> / </span>
                            <span className="text-warning">High {result.highLbf.toFixed(1)} lbf</span>
                            <span className="text-text-muted"> — sized on Central × SF {result.serviceFactor.toFixed(1)}</span>
                        </div>
                        <div className="text-[10px] font-mono text-text-muted mt-0.5">
                            Floors: continuous ≥ {result.continuousFloorLbf.toFixed(1)} lbf · peak ≥ {result.peakFloorLbf.toFixed(1)} lbf
                            <span className="font-sans"> (Low = vendor hand-method floor · High = sensitivity ceiling, no manufacturer basis)</span>
                        </div>
                    </div>
                    <div className="p-3 space-y-3">
                        {/* Scenario comparison — the core deliverable */}
                        <table className="w-full text-xs">
                            <thead><tr className="text-text-muted border-b border-border">
                                <th className="py-1.5 text-left">Scenario</th>
                                <th className="py-1.5 text-right">Running (lbf / N)</th>
                                <th className="py-1.5 text-right">Startup (lbf / N)</th>
                            </tr></thead>
                            <tbody>
                                {scenarios.map((s) => (
                                    <tr key={s.id} className={`border-b border-border/50 ${activeScenario === s.id ? 'bg-primary/5' : ''}`}>
                                        <td className="py-1.5 text-text-primary">{s.label} <span className="text-text-muted font-mono">{s.frictions.carryway.toFixed(2)}/{s.frictions.rail.toFixed(2)}</span></td>
                                        <td className="py-1.5 text-right font-mono text-text-primary">{s.result.beltPullLbf.toFixed(1)} / {s.result.beltPullN.toFixed(0)}</td>
                                        <td className="py-1.5 text-right font-mono text-text-secondary">{s.result.startupPullLbf.toFixed(1)} / {s.result.startupPullN.toFixed(0)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Per-turn tension breakdown — where the tension builds */}
                        {result.perTurn.length > 0 && (
                            <div>
                                <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Tension Through Each Turn</div>
                                <table className="w-full text-xs">
                                    <thead><tr className="text-text-muted border-b border-border">
                                        <th className="py-1 text-left">Turn</th>
                                        <th className="py-1 text-right">Ratio</th>
                                        <th className="py-1 text-right">μ_eff</th>
                                        <th className="py-1 text-right">In (lbf)</th>
                                        <th className="py-1 text-right">×e^μθ</th>
                                        <th className="py-1 text-right">Out (lbf)</th>
                                        <th className="py-1 text-right">High out / cap</th>
                                    </tr></thead>
                                    <tbody>
                                        {result.perTurn.map((t) => (
                                            <tr key={t.turn} className="border-b border-border/50 font-mono">
                                                <td className="py-1 text-text-primary">T{t.turn} ({t.angleDeg}°)</td>
                                                <td className={`py-1 text-right ${t.turnRatio < 2.2 ? 'text-warning' : 'text-text-secondary'}`}>{t.turnRatio.toFixed(2)}</td>
                                                <td className={`py-1 text-right ${t.muEff > cfg.frictions.rail + 1e-9 ? 'text-warning' : 'text-text-muted'}`}>{t.muEff.toFixed(3)}</td>
                                                <td className="py-1 text-right text-text-secondary">{t.tensionIn.toFixed(1)}</td>
                                                <td className="py-1 text-right text-text-muted">{t.multiplier.toFixed(3)}</td>
                                                <td className="py-1 text-right text-text-primary">{t.tensionOut.toFixed(1)}</td>
                                                <td className={`py-1 text-right ${result.curveCapacityLbf !== null && t.tensionOutHigh > result.curveCapacityLbf ? 'text-error' : 'text-text-muted'}`}>
                                                    {t.tensionOutHigh.toFixed(1)}{result.curveCapacityLbf !== null ? ` / ${result.curveCapacityLbf.toFixed(0)}` : ''}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="text-[10px] text-text-muted mt-1">
                                    The last turn before the drive carries peak tension — turn count is the dominant cost driver.
                                </div>
                            </div>
                        )}

                        {/* Sanity echoes */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="bg-dark-800 rounded px-2.5 py-2">
                                <span className="text-text-muted">Carryway: </span>
                                <span className="font-mono text-text-primary">{result.carrywayFt.toFixed(2)} ft ({result.carrywayIn.toFixed(0)} in)</span>
                            </div>
                            <div className="bg-dark-800 rounded px-2.5 py-2">
                                <span className="text-text-muted">Loop: </span>
                                <span className="font-mono text-text-primary">{(result.loopIn / 12).toFixed(1)} ft</span>
                                <span className="font-mono text-text-muted"> · return {result.returnResolved.map((r) => `${r.lengthIn.toFixed(0)}" ${r.support}`).join(' + ')}</span>
                            </div>
                            <div className="bg-dark-800 rounded px-2.5 py-2">
                                <span className="text-text-muted">Turns: </span>
                                <span className="font-mono text-text-primary">{result.turnCount}</span>
                                {result.totalRiseIn !== 0 && (
                                    <span className="font-mono text-text-secondary"> · rise {result.totalRiseIn > 0 ? '+' : ''}{result.totalRiseIn.toFixed(0)} in</span>
                                )}
                                {result.tightestTurnRatio !== null && (
                                    <span className={`ml-1 font-mono ${
                                        result.collapseStatus === 'violation' ? 'text-error'
                                        : result.collapseStatus === 'at-minimum' ? 'text-warning' : 'text-success'
                                    }`}>
                                        · ratio {result.tightestTurnRatio.toFixed(3)} {result.collapseStatus === 'violation' ? 'VIOLATION' : result.collapseStatus === 'at-minimum' ? 'AT MIN' : '✓'} (factor {cfg.collapseFactor})
                                    </span>
                                )}
                            </div>
                            <div className="bg-dark-800 rounded px-2.5 py-2">
                                <span className="text-text-muted">Product: </span>
                                <span className="font-mono text-text-primary">{result.productLoadLbf.toFixed(1)} lbf ({result.productLoadPerFt.toFixed(2)}/ft)</span>
                            </div>
                        </div>
                        {result.warnings.map((w, i) => (
                            <div key={i} className="px-3 py-2 bg-warning/10 border-l-2 border-warning rounded text-xs text-warning">{w}</div>
                        ))}

                        {/* Curve edge-capacity screen (mandatory when turns exist) */}
                        {result.curveCapacityLbf !== null && (
                            <div className={`px-3 py-2 border-l-2 rounded text-xs ${
                                result.curveCapacityUtilPct! > 100 ? 'bg-error/10 border-error text-error'
                                : result.curveCapacityUtilPct! > 85 ? 'bg-warning/10 border-warning text-warning'
                                : 'bg-dark-800 border-primary text-text-secondary'
                            }`}>
                                Curve edge capacity: worst in-curve tension (High) <span className="font-mono">{result.maxInCurveHighLbf!.toFixed(1)} lbf</span> vs{' '}
                                <span className="font-mono">{result.curveCapacityLbf.toFixed(1)} lbf</span> (straight rating × {cfg.curveDerate}) ={' '}
                                <span className="font-mono font-semibold">{result.curveCapacityUtilPct!.toFixed(0)}%</span>.
                                {' '}Bounded screen — not manufacturer-certified until a vendor curve rating replaces the derate.
                            </div>
                        )}

                        {/* Corner speed ceiling — parametric thermal model (q = μ·p·V) */}
                        {result.cornerTier !== null && (
                            <div className={`px-3 py-2 border-l-2 rounded text-xs space-y-1 ${
                                result.cornerTier === 'ok-virgin' ? 'bg-success/10 border-success'
                                : result.cornerTier === 'dg321-required' && cfg.turnRailMaterial === 'dg321' ? 'bg-success/10 border-success'
                                : result.cornerTier === 'dg321-required' ? 'bg-error/10 border-error'
                                : result.cornerTier === 'engineering-review' ? 'bg-warning/10 border-warning'
                                : 'bg-error/10 border-error'
                            }`}>
                                <div className="text-text-secondary">
                                    <span className="font-medium text-text-primary">Corner speed ceiling</span> at{' '}
                                    <span className="font-mono">{result.cornerPressurePsi!.toFixed(2)} psi</span> corner pressure:{' '}
                                    virgin UHMW <span className="font-mono">{result.vCeilVirginFpm!.toFixed(0)}</span> ·{' '}
                                    DG-321 <span className="font-mono">{result.vCeilDg321Fpm!.toFixed(0)}</span> ft/min
                                    <span className="text-text-muted"> · running {cfg.beltSpeedFpm} ft/min · aged (worn μ) ceiling {result.vCeilAgedFpm!.toFixed(0)}</span>
                                </div>
                                <div className={`font-medium ${
                                    result.cornerTier === 'ok-virgin' || (result.cornerTier === 'dg321-required' && cfg.turnRailMaterial === 'dg321')
                                        ? 'text-success'
                                        : result.cornerTier === 'engineering-review' ? 'text-warning' : 'text-error'
                                }`}>
                                    {result.cornerTier === 'ok-virgin' && '✓ PASS — virgin UHMW rails OK at this speed.'}
                                    {result.cornerTier === 'dg321-required' && (cfg.turnRailMaterial === 'dg321'
                                        ? '✓ DG-321 rails specified — requirement satisfied.'
                                        : '✕ DG-321 rails REQUIRED in turns.')}
                                    {result.cornerTier === 'engineering-review' && '⚠ DG-321 + relaxed radius / tension management — engineering review.'}
                                    {result.cornerTier === 'beyond-envelope' && '✕ Beyond the sliding-corner envelope — rolling corner hardware, vendor rating, or coupon-validated exception.'}
                                </div>
                                {result.railHeatWorstW !== null && (
                                    <div className="text-[10px] text-text-muted">
                                        Heat index {result.railHeatWorstW.toFixed(1)} W at the worst belt-edge/rail line. Each lever ≈ one speed
                                        class: lubrication, radius, tension. Ceiling falls as tension rises — more turns, re-added back tension,
                                        or worn carryway pull it down automatically.
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Sign-off: assumptions ride visibly, never silently */}
                        <details>
                            <summary className="text-[10px] text-text-muted hover:text-text-secondary cursor-pointer select-none uppercase tracking-wider">
                                Sign-off summary — {result.assumptions.length} flagged assumption{result.assumptions.length === 1 ? '' : 's'}
                            </summary>
                            <ul className="mt-1 space-y-0.5 text-[10px] text-text-muted list-disc pl-4">
                                {result.assumptions.map((a, i) => <li key={i}>{a}</li>)}
                            </ul>
                        </details>

                        {/* Guardrails */}
                        <div className="text-[10px] text-text-muted leading-relaxed space-y-1">
                            <div>Central = exact curve ODE (reconciled to the OneMotion A1 sign-off, Table 2, to 0.001 lbf). Position the drive so the last curve sees the least practical tension — a long straight between the last curve and the drive.</div>
                            <div>Sizing rule: motor verdicts run on <span className="text-text-secondary">Central × scenario × SF</span>; 3+ turns → size to Degraded, 1–2 turns → Worn. High is a sensitivity ceiling only.</div>
                        </div>
                    </div>
                </div>

                {/* ── Drive selection (second step, never a gate) ── */}
                <details>
                    <summary className="text-xs text-text-secondary hover:text-text-primary cursor-pointer select-none uppercase tracking-wider">
                        Select Drive
                    </summary>
                    <div className="mt-2 space-y-2">
                        <div className="flex gap-1.5">
                            {(['drum', 'sprocket'] as const).map((d) => (
                                <button key={d} onClick={() => setDriveType(d)}
                                    className={`px-2.5 py-1.5 rounded-lg text-xs border transition-colors ${
                                        driveType === d ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-dark-900 text-text-secondary'
                                    }`}>
                                    {d === 'drum' ? 'Powered Pulley / Drum' : 'Sprocket-Driven Shaft'}
                                </button>
                            ))}
                        </div>
                        {driveType === 'drum' ? (
                            <>
                                <div className="text-[10px] text-warning">
                                    Use the vendor's belt pull rating, NOT torque — drum motors are derated below torque ÷ radius.
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className={labelCls}>Rated Continuous Pull (N)</label>
                                        <input type="number" min="0" step="any" value={ratedPullN} className={inputCls}
                                            onChange={(e) => { setRatedPullN(e.target.value); setPresetSeries('') }} />
                                        {num(ratedPullN) > 0 && <div className="text-[10px] text-text-muted mt-0.5 font-mono">= {(num(ratedPullN) / LBF_TO_N).toFixed(1)} lbf</div>}
                                    </div>
                                    <div>
                                        <label className={labelCls}>OneMotion Preset (at {cfg.beltWidthIn}″ width)</label>
                                        <select value={presetSeries} className={selectCls}
                                            onChange={(e) => {
                                                const p = pulleyPresets.find((x) => x.series === e.target.value)
                                                setPresetSeries(e.target.value)
                                                if (p) { setRatedPullN(p.pullN.toFixed(0)); setDrumDiaMm(String(p.diameter)) }
                                            }}>
                                            <option value="">Manual entry…</option>
                                            {pulleyPresets.map((p) => (
                                                <option key={p.series} value={p.series}>
                                                    {p.series} — {p.pullN.toFixed(0)} N{p.fits ? '' : ' (width out of range)'}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className={labelCls}>Drum Ø (mm) — for RPM</label>
                                        <input type="number" min="0" step="any" value={drumDiaMm} className={inputCls}
                                            onChange={(e) => setDrumDiaMm(e.target.value)} />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="space-y-2">
                                <div className="grid grid-cols-3 @md:grid-cols-5 gap-2">
                                    <div>
                                        <label className={labelCls}>Teeth</label>
                                        <input type="number" min="3" step="1" value={teeth} className={inputCls}
                                            onChange={(e) => setTeeth(e.target.value)} />
                                    </div>
                                    <div>
                                        <label className={labelCls}>Belt Pitch (mm)</label>
                                        <input type="number" min="0" step="any" value={pitchMm} className={inputCls}
                                            onChange={(e) => setPitchMm(e.target.value)} />
                                    </div>
                                    <div>
                                        <label className={labelCls}>PD Override (in)</label>
                                        <input type="number" min="0" step="any" value={pdOverrideIn} className={inputCls}
                                            placeholder={(chordalPdMm(num(pitchMm), num(teeth)) / 25.4).toFixed(3)}
                                            onChange={(e) => setPdOverrideIn(e.target.value)} />
                                    </div>
                                    <div>
                                        <label className={labelCls}>Sprocket Bore (mm)</label>
                                        <input type="number" min="0" step="any" value={boreMm} className={inputCls}
                                            onChange={(e) => setBoreMm(e.target.value)} />
                                    </div>
                                    <div>
                                        <label className={labelCls}>Motor Shell (mm)</label>
                                        <input type="number" min="0" step="any" value={shellMm} className={inputCls}
                                            onChange={(e) => setShellMm(e.target.value)} />
                                    </div>
                                </div>
                                <div className="text-[10px] text-text-muted">
                                    Chordal PD = pitch ÷ sin(180°/z) = <span className="font-mono text-text-secondary">{(chordalPdMm(num(pitchMm), num(teeth)) / 25.4).toFixed(3)}"</span>.
                                    Vendors may dimension non-chordally — override from the sprocket drawing. Fewer teeth = smaller radius = less torque needed
                                    (10T vs 11T on S-200 ≈ −9% torque).
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <div>
                                        <label className={labelCls}>Continuous (N·m) — AMO</label>
                                        <input type="number" min="0" step="any" value={contNm} className={inputCls}
                                            onChange={(e) => { setContNm(e.target.value); setUsedCatalog(false) }} />
                                    </div>
                                    <div>
                                        <label className={labelCls}>Peak (N·m) — AMO</label>
                                        <input type="number" min="0" step="any" value={peakNm} className={inputCls}
                                            onChange={(e) => { setPeakNm(e.target.value); setUsedCatalog(false) }} />
                                    </div>
                                    <div>
                                        <label className={labelCls}>Max RPM</label>
                                        <input type="number" min="0" step="any" value={maxRpmIn} className={inputCls}
                                            onChange={(e) => setMaxRpmIn(e.target.value)} />
                                    </div>
                                </div>
                                <div className="flex items-end gap-2">
                                    <div className="flex-1">
                                        <label className={labelCls}>From Catalog Nm (ambiguous rating)</label>
                                        <input type="number" min="0" step="any" value={catalogNm} className={inputCls}
                                            onChange={(e) => setCatalogNm(e.target.value)} />
                                    </div>
                                    <select value={catalogInterp} onChange={(e) => setCatalogInterp(e.target.value)}
                                        className="px-2 py-2 bg-dark-900 border border-border rounded-lg text-text-secondary text-xs focus:outline-none">
                                        <option value="1">catalog = continuous (÷1)</option>
                                        <option value="2">catalog = peak, 2× (÷2)</option>
                                        <option value="3">catalog = peak, 3× (÷3)</option>
                                    </select>
                                    <button onClick={() => {
                                        const c = num(catalogNm)
                                        if (c > 0) {
                                            setPeakNm(String(c))
                                            setContNm((c / num(catalogInterp, 3)).toFixed(2))
                                            setUsedCatalog(true)
                                        }
                                    }}
                                        className="px-2.5 py-2 rounded-lg text-xs border border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                                        Fill
                                    </button>
                                </div>
                                {usedCatalog && (
                                    <div className="px-2.5 py-2 bg-warning/10 border-l-2 border-warning rounded text-xs text-warning">
                                        Catalog Nm values are UNVERIFIED as continuous vs peak (AMO rows show motors named by peak;
                                        the catalog footnote says 2× FLA, the AMO shows 3× — unresolved vendor contradiction).
                                        Confirm the AMO row (continuous / peak / FLA) with the vendor before ordering.
                                    </div>
                                )}
                                <div>
                                    <label className={labelCls}>Plant Ambient (°C) — optional thermal allowance</label>
                                    <input type="number" step="any" value={ambientC} className={inputCls} placeholder="rated at 40°C"
                                        onChange={(e) => setAmbientC(e.target.value)} />
                                    {thermal !== 1 && (
                                        <div className="text-[10px] text-text-muted mt-0.5">
                                            Cool-ambient uplift ×{thermal.toFixed(3)} (√((80+40−T)/80), capped 1.25) — an engineering allowance,
                                            NOT a vendor rating. Heat ∝ torque², so typical-duty utilization sets winding temperature.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {drive && (
                            <div className="rounded-lg border border-border bg-dark-900/50 px-3 py-2.5 space-y-2">
                                {drive.screens.map((sc, i) => (
                                    <div key={i} className="px-2.5 py-2 bg-error/10 border-l-2 border-error rounded text-xs text-error font-medium">{sc}</div>
                                ))}
                                <div className="text-xs text-text-secondary">
                                    Available pull: <span className="font-mono text-text-primary">{drive.availableN.toFixed(0)} N cont ({(drive.availableN / LBF_TO_N).toFixed(1)} lbf)</span>
                                    <span className="font-mono text-text-muted"> · {drive.peakN.toFixed(0)} N peak</span>
                                    {drive.pdMm !== null && <span className="font-mono text-text-muted"> · PD {(drive.pdMm / 25.4).toFixed(2)}"</span>}
                                    {thermal !== 1 && <span className="font-mono text-text-muted"> · cool-adj ×{thermal.toFixed(2)}</span>}
                                    {drive.rpm !== null && (
                                        <span className="ml-2">
                                            · RPM: <span className={`font-mono ${drive.maxRpm !== null && drive.rpm > drive.maxRpm ? 'text-error' : 'text-text-primary'}`}>
                                                {drive.rpm.toFixed(0)}
                                            </span>
                                            {drive.maxRpm !== null && <span className="text-text-muted font-mono"> / {drive.maxRpm} max</span>}
                                        </span>
                                    )}
                                </div>
                                {drive.maxRpm !== null && drive.rpm !== null && drive.rpm > drive.maxRpm && (
                                    <div className="text-xs text-error">Required RPM exceeds the motor's rating — belt speed unreachable with this drive.</div>
                                )}
                                {drive.pdMm !== null && (
                                    <div className="text-xs font-mono text-text-secondary">
                                        Torque floors @ PD radius: continuous ≥ {torqueNmFromPull(result.continuousFloorLbf, drive.pdMm / 25.4 / 2).toFixed(2)} Nm
                                        <span className="text-text-muted"> · </span>peak ≥ {torqueNmFromPull(result.peakFloorLbf, drive.pdMm / 25.4 / 2).toFixed(2)} Nm
                                    </div>
                                )}
                                <table className="w-full text-xs">
                                    <thead><tr className="text-text-muted border-b border-border">
                                        <th className="py-1 text-left">Scenario</th>
                                        <th className="py-1 text-right">Cont floor (lbf)</th>
                                        <th className="py-1 text-right">Cont util</th>
                                        {thermal !== 1 && <th className="py-1 text-right">Cool-adj</th>}
                                        <th className="py-1 text-right">Peak util</th>
                                    </tr></thead>
                                    <tbody>
                                        {scenarios.map((s) => {
                                            const contFloorN = s.result.continuousFloorLbf * LBF_TO_N
                                            const peakFloorN = s.result.peakFloorLbf * LBF_TO_N
                                            const util = (contFloorN / drive.availableN) * 100
                                            const utilAdj = (contFloorN / (drive.availableN * thermal)) * 100
                                            const peakUtil = (peakFloorN / drive.peakN) * 100
                                            return (
                                                <tr key={s.id} className="border-b border-border/50 font-mono">
                                                    <td className="py-1 text-text-primary font-sans">{s.label}</td>
                                                    <td className="py-1 text-right text-text-secondary">{s.result.continuousFloorLbf.toFixed(1)}</td>
                                                    <td className={`py-1 text-right font-semibold ${utilizationCls(util)}`}>{util.toFixed(0)}%</td>
                                                    {thermal !== 1 && <td className={`py-1 text-right ${utilizationCls(utilAdj)}`}>{utilAdj.toFixed(0)}%</td>}
                                                    <td className={`py-1 text-right ${utilizationCls(peakUtil)}`}>{peakUtil.toFixed(0)}%</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                                <div className="text-[10px] text-text-muted">
                                    Verdicts run on <span className="text-text-secondary">Central × scenario × SF {result.serviceFactor.toFixed(1)}</span>;
                                    peak floor = {cfg.breakawayFactor}× continuous. Green &lt;60% · yellow 60–85% · red &gt;85%.
                                    Size 3+ turns to Degraded, 1–2 turns to Worn.
                                </div>
                            </div>
                        )}
                    </div>
                </details>

                {/* ── Calibration log: hand-calc vs vendor vs measured, per conveyor ── */}
                <CalibrationLog currentCentral={result.centralLbf} />
            </div>
        </div>
    )
}

interface CalRow { conveyor: string; date: string; central: string; vendor: string; measured: string }
const SEED_CAL_LOG: CalRow[] = [
    { conveyor: 'A1 infeed (3-turn S)', date: '2026-07-11', central: '26.7', vendor: '30.75 (OneMotion, old duty)', measured: 'pending' },
]

/** Persistent reconciliation log — the record that keeps the model honest. */
function CalibrationLog({ currentCentral }: { currentCentral: number }) {
    const stored = useAppStore((s) => s.beltPullCalLog)
    const setStored = useAppStore((s) => s.setBeltPullCalLog)
    const rows: CalRow[] = useMemo(() => {
        try { if (stored) return JSON.parse(stored) } catch { /* seed */ }
        return SEED_CAL_LOG
    }, [stored])
    const [draft, setDraft] = useState<CalRow>({ conveyor: '', date: '', central: '', vendor: '', measured: '' })

    const save = (next: CalRow[]) => setStored(JSON.stringify(next))

    return (
        <details>
            <summary className="text-xs text-text-secondary hover:text-text-primary cursor-pointer select-none uppercase tracking-wider">
                Calibration Log ({rows.length})
            </summary>
            <div className="mt-2 space-y-2">
                <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                        <thead><tr className="text-text-muted border-b border-border">
                            <th className="py-1 text-left">Conveyor</th>
                            <th className="py-1 text-left">Date</th>
                            <th className="py-1 text-right">Central (lbf)</th>
                            <th className="py-1 text-left">Vendor calc</th>
                            <th className="py-1 text-left">Measured</th>
                            <th className="py-1" />
                        </tr></thead>
                        <tbody>
                            {rows.map((r, i) => (
                                <tr key={i} className="border-b border-border/50">
                                    <td className="py-1 text-text-primary">{r.conveyor}</td>
                                    <td className="py-1 text-text-muted font-mono">{r.date}</td>
                                    <td className="py-1 text-right font-mono text-text-secondary">{r.central}</td>
                                    <td className="py-1 text-text-muted">{r.vendor}</td>
                                    <td className="py-1 text-text-muted">{r.measured}</td>
                                    <td className="py-1 text-right">
                                        <button onClick={() => save(rows.filter((_, j) => j !== i))}
                                            className="p-0.5 text-text-muted hover:text-error transition-colors"><Trash2 className="w-3 h-3" /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex flex-wrap gap-1.5 items-center">
                    {(['conveyor', 'date', 'vendor', 'measured'] as const).map((k) => (
                        <input key={k} type="text" value={draft[k]} placeholder={k}
                            onChange={(e) => setDraft((d) => ({ ...d, [k]: e.target.value }))}
                            className="w-28 px-2 py-1.5 bg-dark-900 border border-border rounded text-text-primary text-xs focus:outline-none focus:border-primary" />
                    ))}
                    <button onClick={() => {
                        if (!draft.conveyor) return
                        save([...rows, { ...draft, central: currentCentral.toFixed(1) }])
                        setDraft({ conveyor: '', date: '', central: '', vendor: '', measured: '' })
                        showToast('Logged with current Central')
                    }}
                        className="px-2.5 py-1.5 rounded text-xs border border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                        + Log current ({currentCentral.toFixed(1)} lbf)
                    </button>
                </div>
            </div>
        </details>
    )
}

/**
 * Back-solve the lumped corner-drag number from a trusted result — an Intralox
 * CalcLab run or a physical pull test on this exact geometry and load. This is
 * how you extract the coefficient the vendors don't publish.
 */
function CalibrationSolver({ cfg, onApply }: { cfg: BeltPullConfig; onApply: (mu: number) => void }) {
    const [target, setTarget] = useState('')
    const [unit, setUnit] = useState<'lbf' | 'N'>('lbf')

    const targetLbf = unit === 'lbf' ? num(target) : num(target) / LBF_TO_N
    const solved = useMemo(
        () => (targetLbf > 0 ? solveRailMu(cfg, targetLbf) : null),
        [cfg, targetLbf]
    )

    return (
        <div className="pt-2 border-t border-border/50 space-y-1.5">
            <div className="text-xs text-text-secondary">Calibrate μ_rail from a known result</div>
            <div className="flex gap-1.5 items-center">
                <input type="number" min="0" step="any" value={target} onChange={(e) => setTarget(e.target.value)}
                    placeholder="Vendor program / pull-test result"
                    className="flex-1 px-2 py-1.5 bg-dark-900 border border-border rounded text-text-primary font-mono text-xs focus:outline-none focus:border-primary" />
                <select value={unit} onChange={(e) => setUnit(e.target.value as 'lbf' | 'N')}
                    className="px-1.5 py-1.5 bg-dark-900 border border-border rounded text-text-primary text-xs focus:outline-none">
                    <option value="lbf">lbf</option>
                    <option value="N">N</option>
                </select>
                {solved !== null && (
                    <button onClick={() => onApply(Math.round(solved * 1000) / 1000)}
                        className="px-2.5 py-1.5 rounded text-xs border border-success/40 bg-success/10 text-success hover:bg-success/20 transition-colors font-mono">
                        Apply μ={solved.toFixed(3)}
                    </button>
                )}
            </div>
            {targetLbf > 0 && solved === null && (
                <div className="text-[10px] text-warning">
                    {cfg.sections.length === 0
                        ? 'No turns in the path — the rail μ has nothing to act on. Add the turns first.'
                        : 'Target is outside what rail μ alone can produce for this geometry — check the load and carryway μ first.'}
                </div>
            )}
            <div className="text-[10px] text-text-muted">
                Run the same geometry and load in the vendor's program (or measure a real pull), enter the result,
                and this inverts the capstan march for the base rail μ. Two calibrations at different turn ratios
                give you the scaling exponent for the ratio-scaled model.
            </div>
        </div>
    )
}
