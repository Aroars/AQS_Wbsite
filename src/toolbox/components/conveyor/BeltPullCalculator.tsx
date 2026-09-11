import { useState, useMemo, useEffect, useRef } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { CalcPinButton } from '@/toolbox/components/ui/CalcPinButton'
import { instanceKey, MAIN } from '@/toolbox/stores/migrate'
import { useInstanceReload } from '@/toolbox/hooks/useToolState'
import { useHandoff } from '@/toolbox/hooks/useHandoff'
import { SourceBar } from '@/toolbox/components/ui/SourceBar'
import { showToast } from '@/toolbox/components/ui/Toast'
import { useAppStore } from '@/toolbox/stores/appStore'
import { oneMotionPicks } from '@/toolbox/lib/calculators/driveMotor'
import { useBeltSpecs, beltChoices, toolboxBuild, type BeltChoice } from '@/toolbox/lib/beltSpecs'
import {
    calculateBeltPull, calculateAllScenarios, pathSummary, isIncline, isStraight, isTurn,
    inclineSlopeDeg, resolveProductType, resolveMaxPlainIncline,
    wearFactors, scenarioFrictions, wearstripMaterials,
    defaultBeltPullConfig, exampleConfigs, solveRailMu, LBF_TO_N, mergeBeltPullConfig,
    type BeltPullConfig, type TurnSection, type InclineSection, type StraightSection, type PathSection, type SurfaceMaterials,
    type ReturnSegment, type ProductType, type PocketSpec,
} from '@/toolbox/lib/calculators/beltPull'

/** Section field patch — the kind discriminant is fixed at creation, never patched */
type SectionPatch = Partial<Omit<TurnSection, 'kind'>> & Partial<Omit<InclineSection, 'kind'>> & Partial<Omit<StraightSection, 'kind'>>

/** Onshape configurator commons for turn angles */
const ANGLE_PRESETS = [30, 60, 90, 120, 150, 180]

const inputCls = 'w-full px-2 py-2 bg-dark-900 border border-border rounded-lg text-text-primary font-mono text-sm focus:outline-none focus:border-primary'
const selectCls = 'w-full px-2 py-2 bg-dark-900 border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-primary'
const labelCls = 'block text-xs text-text-muted mb-1'

function num(v: string, fallback = 0): number {
    const n = parseFloat(v)
    return isNaN(n) ? fallback : n
}

/** For onChange: an emptied box is 0 (renders blank) so the next keystroke replaces rather than appends; junk falls back */
function numEdit(v: string, fallback = 0): number {
    return v.trim() === '' ? 0 : num(v, fallback)
}

/** Utilization color: green < 60%, yellow 60–85%, red > 85% */
function utilizationCls(pct: number): string {
    if (pct < 60) return 'text-success'
    if (pct <= 85) return 'text-warning'
    return 'text-error'
}

/** Incline geometry helpers for the section solver (belt length + rise are canonical) */
function inclineFloorIn(s: InclineSection): number {
    return Math.sqrt(Math.max(s.lengthIn * s.lengthIn - s.riseIn * s.riseIn, 0))
}

function loadInitialConfig(stored: string | null, allowShareLink: boolean): BeltPullConfig {
    // Shared link takes priority (tab card only), then the persisted config, then the S-path example
    try {
        const p = allowShareLink ? new URLSearchParams(window.location.search).get('beltpull') : null
        if (p) return mergeBeltPullConfig(JSON.parse(atob(p)))
    } catch { /* fall through */ }
    try {
        if (stored) return mergeBeltPullConfig(JSON.parse(stored))
    } catch { /* fall through */ }
    return exampleConfigs[0].config
}

export function BeltPullCalculator({ instanceId = MAIN }: { instanceId?: string } = {}) {
    const setInstanceState = useAppStore((s) => s.setInstanceState)

    const [cfg, setCfg] = useState<BeltPullConfig>(() => loadInitialConfig(useAppStore.getState().instanceStates[instanceKey('beltPull', instanceId)] ?? null, instanceId === MAIN))
    const [accumulated, setAccumulated] = useState(() => cfg.loadMode === 'accumulated')

    // Drive selection state
    // Sprocket (AMO-based entry): torque = pull × PITCH radius, not shell radius
    // Catalog belt pitch, carried to the Torque & Motor card with the handoff
    const [pitchMm, setPitchMm] = useState('50')

    // Persist this instance's working config (a Home pin is its own instance)
    const skipPersist = useRef(false)
    useEffect(() => {
        if (skipPersist.current) { skipPersist.current = false; return }
        setInstanceState('beltPull', instanceId, JSON.stringify(cfg))
    }, [cfg, instanceId, setInstanceState])
    // Cleared or loaded from the card menu: re-read the stored config (defaults when cleared)
    useInstanceReload('beltPull', instanceId, () => {
        skipPersist.current = true
        const stored = useAppStore.getState().instanceStates[instanceKey('beltPull', instanceId)] ?? null
        const next = stored ? loadInitialConfig(stored, false) : structuredClone(defaultBeltPullConfig)
        setCfg(next); setAccumulated(next.loadMode === 'accumulated')
    })

    // Apply a load / friction patch from another card (pull, link, or the Spec Solver's send)
    const applyPatch = (patch: Record<string, unknown>) => {
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
    }
    const handoff = useHandoff('beltPull', instanceId, applyPatch)
    // The Spec Solver still pushes a solved path here (its state is not persisted, so it cannot be pulled)
    useEffect(() => instanceId !== MAIN ? undefined : useAppStore.subscribe((state, prev) => {
        const patch = state.beltPullInbox
        if (patch && patch !== prev.beltPullInbox) { applyPatch(patch); useAppStore.getState().clearBeltPullInbox() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }), [instanceId])

    const upd = (patch: Partial<BeltPullConfig>) => { handoff.touch(Object.keys(patch)); setCfg((c) => ({ ...c, ...patch })) }
    const updSection = (i: number, patch: SectionPatch) =>
        setCfg((c) => ({ ...c, sections: c.sections.map((s, j) => (j === i ? { ...s, ...patch } as PathSection : s)) }))
    const removeSection = (i: number) => setCfg((c) => ({ ...c, sections: c.sections.filter((_, j) => j !== i) }))
    const widthMm = cfg.beltWidthIn * 25.4
    // Geometry minimums from the belt: turns start at the minimum inside radius and straights at the
    // vendor minimum; anything typed shorter is flagged (never overwritten); an emptied box refills.
    const minRadiusIn = cfg.collapseFactor > 0 && cfg.beltWidthIn > 0 ? cfg.collapseFactor * cfg.beltWidthIn : 0
    const minStraightIn = cfg.minStraightIn ?? 0
    const belowMin = (value: number, min: number) => min > 0 && value > 0 && value < min - 1e-9
    const MinNote = ({ value, min, what }: { value: number; min: number; what: string }) =>
        belowMin(value, min) ? <div className="mt-1 px-2 py-1 bg-warning/10 border-l-2 border-warning rounded text-[10px] text-warning">Below the {what} of {min.toFixed(1)} in</div> : null

    const result = useMemo(() => calculateBeltPull(cfg), [cfg])
    const scenarios = useMemo(() => calculateAllScenarios(cfg), [cfg])
    // Result severity: red screens stay visible; yellow and informational ones collapse under Details
    const bulkOver = result.bulkCapacityLbHr !== null && cfg.loadMode === 'rate' && cfg.throughputLbHr > result.bulkCapacityLbHr
    const curveOver = result.curveCapacityLbf !== null && (result.curveCapacityUtilPct ?? 0) > 100
    const cornerFail = result.cornerTier === 'beyond-envelope' || (result.cornerTier === 'dg321-required' && cfg.turnRailMaterial !== 'dg321')
    const detailWarnings = result.warnings.length
        + (result.curveCapacityLbf !== null && !curveOver && (result.curveCapacityUtilPct ?? 0) > 85 ? 1 : 0)
        + (result.cornerTier === 'engineering-review' ? 1 : 0)
        + (result.bulkCapacityLbHr !== null && cfg.loadMode === 'rate' && !bulkOver && cfg.throughputLbHr > 0.8 * result.bulkCapacityLbHr ? 1 : 0)

    // One-line drive verdict; the full auto-pick table and manual drive live on the Torque & Motor card
    const quickPick = useMemo(() => oneMotionPicks(result.continuousFloorLbf, result.peakFloorLbf, widthMm, cfg.beltSpeedFpm), [result.continuousFloorLbf, result.peakFloorLbf, widthMm, cfg.beltSpeedFpm])

    // Catalog belts from the quoting tool's spec feed: pick one to fill the belt fields
    const specs = useBeltSpecs()
    const catalog = useMemo(() => beltChoices(specs.feed), [specs.feed])
    const catalogChoice = catalog.find((c) => c.key === cfg.catalogBeltKey) ?? null
    const near = (a: number, b: number | null) => b !== null && Math.abs(a - b) < 1e-6
    const catalogModified = catalogChoice !== null && !(
        near(cfg.beltWeightLbFt2, catalogChoice.build.weightLbFt2 ?? cfg.beltWeightLbFt2)
        && near(cfg.straightRatingKgfM, catalogChoice.build.ratingKgfM ?? cfg.straightRatingKgfM)
        && cfg.beltBuild === toolboxBuild(catalogChoice.build.build)
        && near(cfg.collapseFactor, catalogChoice.belt.collapseFactor ?? cfg.collapseFactor)
    )
    const applyCatalogBelt = (choice: BeltChoice | null) => {
        if (!choice) { upd({ catalogBeltKey: null }); return }
        const { belt, build } = choice
        setCfg((c) => ({
            ...c,
            catalogBeltKey: choice.key,
            beltWeightLbFt2: build.weightLbFt2 ?? c.beltWeightLbFt2,
            beltBuild: toolboxBuild(build.build),
            straightRatingKgfM: build.ratingKgfM ?? c.straightRatingKgfM,
            collapseFactor: belt.collapseFactor ?? c.collapseFactor,
            curveDerate: belt.curveRatingFraction ?? c.curveDerate,
        }))
        if (belt.pitchMm) setPitchMm(String(belt.pitchMm))
    }
    const activeScenario = cfg.wearId
    const productType: ProductType = resolveProductType(cfg)
    const maxPlain = resolveMaxPlainIncline(cfg)
    const setProductType = (t: ProductType) => setCfg((c) => ({
        ...c,
        productType: t,
        // bed mode is a bulk concept; packages fall back to a rate
        loadMode: t === 'packages' && c.loadMode === 'bulk' ? 'rate' : c.loadMode,
    }))

    // Materials are the base (design) dimension; wear scenarios multiply them.
    const setMaterialBase = (key: keyof SurfaceMaterials, value: number) => {
        setCfg((c) => {
            const materials = { ...c.materials, [key]: value }
            const factor = wearFactors.find((f) => f.id === c.wearId) ?? wearFactors[0]
            return { ...c, materials, frictions: scenarioFrictions(materials, factor) }
        })
    }

    const applyExample = (id: string) => {
        const ex = exampleConfigs.find((e) => e.id === id)
        if (ex) {
            setCfg(structuredClone(ex.config))
            setAccumulated(ex.config.loadMode === 'accumulated')
        }
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
                <CalcPinButton toolId="beltPull" instanceId={instanceId}
                    examples={exampleConfigs.map((e) => ({ label: e.label, onSelect: () => applyExample(e.id) }))} />
            </div>
            <div className="p-4 space-y-4">
                <SourceBar handoff={handoff} note="Line Throughput and Conveyor Speed bring the load and speed; Wearstrip brings the rail μ." />

                {/* ── Belt & load ── */}
                <div className="space-y-2">
                    <div className="text-xs text-text-secondary uppercase tracking-wider">Belt & Load</div>
                    <div className="flex flex-wrap items-end gap-2">
                        <div className="flex-1 min-w-[240px]">
                            <label className={labelCls}>Catalog Belt <span className="text-text-muted">({specs.source === 'live' ? 'live' : specs.source === 'cache' ? 'cached' : 'snapshot'} — fills weight, rating, build, collapse factor, pitch)</span></label>
                            <select value={cfg.catalogBeltKey ?? ''} className={selectCls}
                                onChange={(e) => applyCatalogBelt(catalog.find((c) => c.key === e.target.value) ?? null)}>
                                <option value="">Custom — enter belt specs below</option>
                                {catalog.map((c) => <option key={c.key} value={c.key}>{c.label}{c.belt.radiusCapable ? ' (radius)' : ''}</option>)}
                            </select>
                        </div>
                        {catalogChoice && (
                            <span className={`text-[10px] font-mono px-1.5 py-1 rounded border ${catalogModified ? 'border-warning/40 text-warning' : 'border-success/40 text-success'}`}>
                                {catalogModified ? 'modified from catalog' : 'catalog values'}
                            </span>
                        )}
                        {catalog.length === 0 && !specs.loading && (
                            <span className="text-[10px] text-text-muted pb-2">No belts published yet — see the Belt Specs chart.</span>
                        )}
                    </div>
                    <div className="grid grid-cols-2 @md:grid-cols-3 gap-2">
                        <div>
                            <label className={labelCls}>Belt Width (in)</label>
                            <input type="number" min="1" step="any" value={cfg.beltWidthIn || ''} className={inputCls}
                                onChange={(e) => upd({ beltWidthIn: numEdit(e.target.value, 12) })} />
                        </div>
                        <div>
                            <label className={labelCls}>Belt Weight (lb/ft², POM basis)</label>
                            <div className="flex gap-1">
                                <input type="number" min="0" step="any" value={cfg.beltWeightLbFt2 || ''} className={inputCls}
                                    onChange={(e) => upd({ beltWeightLbFt2: numEdit(e.target.value, 1.64) })} />
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
                                onChange={(e) => upd({ beltSpeedFpm: numEdit(e.target.value, 60) })} />
                        </div>
                        <div>
                            <label className={labelCls}>Minimum Straight (in)</label>
                            <input type="number" min="0" step="any" value={cfg.minStraightIn || ''} placeholder="vendor minimum" className={inputCls}
                                onChange={(e) => upd({ minStraightIn: num(e.target.value) })} />
                            <div className="text-[10px] text-text-muted mt-0.5">Vendor minimum straight run before and after turns and inclines. The path builder fills it in and flags anything shorter.</div>
                        </div>
                        <div>
                            <label className={labelCls}>Minimum Inside Radius (in)</label>
                            <div className="px-2 py-2 bg-dark-900/60 border border-border rounded-lg font-mono text-sm text-primary">{minRadiusIn > 0 ? minRadiusIn.toFixed(1) : '—'}</div>
                            <div className="text-[10px] text-text-muted mt-0.5">= collapse factor {cfg.collapseFactor} × belt width. New turns start here; the builder flags a tighter radius.</div>
                        </div>
                    </div>
                    {/* Product type decides the load entries and the screens (slip, pockets, bed capacity) */}
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="flex gap-1">
                            {([
                                { id: 'packages' as const, label: 'Packages', hint: 'discrete pieces — cartons, bags, trays' },
                                { id: 'bulk' as const, label: 'Bulk', hint: 'loose product in a bed or in flight pockets' },
                            ]).map((t) => (
                                <button key={t.id} title={t.hint} onClick={() => setProductType(t.id)}
                                    className={`px-2.5 py-1.5 rounded-lg text-xs border transition-colors ${
                                        productType === t.id ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-dark-900 text-text-secondary'
                                    }`}>
                                    {t.label}
                                </button>
                            ))}
                        </div>
                        <span className="text-[10px] text-text-muted">plain-belt incline limit {maxPlain}°</span>
                        <div className="flex gap-1 ml-auto">
                            {(productType === 'bulk' ? ['rate', 'direct', 'bulk'] as const : ['rate', 'direct'] as const).map((m) => (
                                <button key={m} onClick={() => setLoadMode(m)} disabled={accumulated && m !== 'bulk'}
                                    className={`px-2.5 py-1.5 rounded-lg text-xs border transition-colors disabled:opacity-40 ${
                                        baseLoadMode === m ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-dark-900 text-text-secondary'
                                    }`}>
                                    {m === 'rate' ? 'Rate (lb/hr)' : m === 'direct' ? 'Direct (lbf)' : 'Bed (capacity)'}
                                </button>
                            ))}
                        </div>
                        {productType === 'packages' && (
                            <label className="flex items-center gap-1.5 text-xs cursor-pointer text-text-secondary">
                                <input type="checkbox" checked={accumulated}
                                    onChange={(e) => { setAccumulated(e.target.checked); upd({ loadMode: e.target.checked ? 'accumulated' : 'rate' }) }} />
                                Product backed up / accumulated
                            </label>
                        )}
                    </div>
                    {productType === 'bulk' && (
                        <div className="grid grid-cols-2 @md:grid-cols-4 gap-2">
                            <div>
                                <label className={labelCls}>Loose Density (lb/ft³)</label>
                                <input type="number" min="0" step="any" value={cfg.bulkDensityLbFt3 || ''} className={inputCls}
                                    onChange={(e) => upd({ bulkDensityLbFt3: num(e.target.value) })} />
                            </div>
                            <div>
                                <label className={labelCls}>Angle of Repose (°)</label>
                                <input type="number" min="0" max="89" step="any" value={cfg.reposeDeg ?? 35} className={inputCls}
                                    onChange={(e) => upd({ reposeDeg: numEdit(e.target.value, 35) })} />
                            </div>
                            <div>
                                <label className={labelCls}>Pocket Fill (%)</label>
                                <input type="number" min="1" max="100" step="any" value={Math.round((cfg.pocketFillFraction ?? 0.85) * 100)} className={inputCls}
                                    onChange={(e) => upd({ pocketFillFraction: Math.min(Math.max(numEdit(e.target.value, 85) / 100, 0.01), 1) })} />
                            </div>
                            <div>
                                <label className={labelCls}>Plain-Belt Limit (°)</label>
                                <input type="number" min="0" max="89" step="any" value={cfg.maxPlainInclineDeg ?? ''} placeholder={String(maxPlain)} className={inputCls}
                                    onChange={(e) => upd({ maxPlainInclineDeg: e.target.value === '' ? undefined : num(e.target.value) })} />
                            </div>
                        </div>
                    )}
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
                                    onChange={(e) => upd({ productLengthIn: numEdit(e.target.value, 12) })} />
                            </div>
                            <div>
                                <label className={labelCls}>Weight per Piece (lb)</label>
                                <input type="number" min="0" step="any" value={cfg.productWeightLb || ''} className={inputCls}
                                    onChange={(e) => upd({ productWeightLb: num(e.target.value) })} />
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Path builder ── */}
                <div className="space-y-2">
                    <div className="text-xs text-text-secondary uppercase tracking-wider">Conveyor Path</div>
                    <div className="grid grid-cols-3 gap-2">
                        <div>
                            <label className={labelCls}>Infeed Straight (in)</label>
                            <input type="number" min="0" step="any" value={cfg.infeedStraightIn || ''} placeholder={minStraightIn > 0 ? minStraightIn.toFixed(1) : undefined} className={inputCls}
                                onChange={(e) => upd({ infeedStraightIn: num(e.target.value) })}
                                onBlur={(e) => { if (e.target.value === '' && minStraightIn > 0) upd({ infeedStraightIn: minStraightIn }) }} />
                            <MinNote value={cfg.infeedStraightIn} min={minStraightIn} what="minimum straight" />
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
                        if (isStraight(s)) {
                            return (
                                <div key={i} className="rounded-lg border border-border bg-dark-900/50 px-3 py-2 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-mono text-text-secondary">— Straight {i + 1}</span>
                                        <button onClick={() => removeSection(i)}
                                            className="p-1 text-text-muted hover:text-error transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className={labelCls}>Length (in)</label>
                                            <input type="number" min="0" step="any" value={s.lengthIn || ''} placeholder={minStraightIn > 0 ? minStraightIn.toFixed(1) : undefined} className={inputCls}
                                                onChange={(e) => updSection(i, { lengthIn: num(e.target.value) })}
                                                onBlur={(e) => { if (e.target.value === '' && minStraightIn > 0) updSection(i, { lengthIn: minStraightIn }) }} />
                                            <MinNote value={s.lengthIn} min={minStraightIn} what="minimum straight" />
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                        if (isIncline(s)) {
                            const slope = inclineSlopeDeg(s)
                            const slopeAbs = Math.abs(slope)
                            const floor = inclineFloorIn(s)
                            const loaded = result.sectionLoads.find((r) => r.index === i && r.kind === 'incline')
                            const pocket = result.pockets.find((p) => p.index === i)
                            const steep = slopeAbs > maxPlain + 1e-9 && (loaded?.lbfPerFt ?? 0) > 0
                            const flighted = !!s.pocket
                            const slipping = result.slipSections.includes(i)
                            // Solver: belt length + rise are canonical; angle and floor length re-derive them
                            const setAngle = (deg: number) => {
                                const rad = Math.max(-89.9, Math.min(89.9, deg)) * Math.PI / 180
                                if (s.lengthIn > 0) updSection(i, { riseIn: Math.round(s.lengthIn * Math.sin(rad) * 100) / 100 })
                                else if (floor > 0) updSection(i, { lengthIn: Math.round(floor / Math.cos(rad) * 100) / 100, riseIn: Math.round(floor * Math.tan(rad) * 100) / 100 })
                            }
                            const setFloor = (f: number) => {
                                updSection(i, { lengthIn: Math.round(Math.sqrt(f * f + s.riseIn * s.riseIn) * 100) / 100 })
                            }
                            return (
                                <div key={i} className={`rounded-lg border bg-dark-900/50 px-3 py-2 space-y-2 ${slipping ? 'border-error/50' : 'border-warning/30'}`}>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-mono text-warning">
                                            {s.riseIn >= 0 ? '↗' : '↘'} Incline {i + 1}
                                            <span className="text-text-muted"> · {slopeAbs.toFixed(1)}°{flighted ? ' · flighted' : ''}</span>
                                        </span>
                                        <button onClick={() => removeSection(i)}
                                            className="p-1 text-text-muted hover:text-error transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                                    </div>
                                    <div className="grid grid-cols-2 @md:grid-cols-4 gap-2">
                                        <div>
                                            <label className={labelCls}>Belt Length (in)</label>
                                            <input type="number" min="0" step="any" value={s.lengthIn || ''} className={inputCls}
                                                onChange={(e) => updSection(i, { lengthIn: num(e.target.value) })} />
                                        </div>
                                        <div>
                                            <label className={labelCls}>Rise (in, − down)</label>
                                            <input type="number" step="any" value={s.riseIn || ''} placeholder="0" className={inputCls}
                                                onChange={(e) => updSection(i, { riseIn: num(e.target.value) })} />
                                        </div>
                                        <div>
                                            <label className={labelCls}>Angle (°)</label>
                                            <input type="number" step="any" min="-89" max="89" value={Math.round(slope * 10) / 10 || ''} placeholder="0" className={inputCls}
                                                onChange={(e) => setAngle(num(e.target.value))} />
                                        </div>
                                        <div>
                                            <label className={labelCls}>Floor Run (in)</label>
                                            <input type="number" min="0" step="any" value={Math.round(floor * 100) / 100 || ''} className={inputCls}
                                                onChange={(e) => setFloor(num(e.target.value))} />
                                        </div>
                                    </div>
                                    <div className="text-[10px] text-text-muted">
                                        Any two define the incline: belt length and rise are kept; typing an angle re-solves the rise, a floor run re-solves the belt length.
                                    </div>

                                    {/* Slip flag → flights (bulk) or a retention note (packages), with an engineer override */}
                                    {steep && !flighted && (
                                        <div className={`px-2.5 py-2 border-l-2 rounded text-xs space-y-1.5 ${s.allowPlainIncline ? 'bg-dark-800 border-text-muted text-text-secondary' : 'bg-error/10 border-error text-error'}`}>
                                            <div>
                                                {slopeAbs.toFixed(1)}° is past the {maxPlain}° plain-belt limit for {productType}.{' '}
                                                {productType === 'bulk'
                                                    ? 'Loose product slides back — flights turn the bed into pockets.'
                                                    : 'Packages may slide — cleats or a high-friction surface, or accept it below.'}
                                            </div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                {productType === 'bulk' && (
                                                    <button onClick={() => updSection(i, { pocket: { flightHeightIn: 2, pitchIn: 12 }, allowPlainIncline: false })}
                                                        className="px-2.5 py-1 rounded text-xs border border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center gap-1">
                                                        <Plus className="w-3 h-3" /> Add flights
                                                    </button>
                                                )}
                                                <label className="flex items-center gap-1.5 text-xs cursor-pointer text-text-secondary">
                                                    <input type="checkbox" checked={!!s.allowPlainIncline}
                                                        onChange={(e) => updSection(i, { allowPlainIncline: e.target.checked })} />
                                                    Engineer override — plain belt accepted
                                                </label>
                                            </div>
                                        </div>
                                    )}
                                    {!steep && !flighted && productType === 'bulk' && slopeAbs > 0 && (loaded?.lbfPerFt ?? 0) > 0 && (
                                        <div className="flex items-center justify-between text-[10px] text-text-muted">
                                            <span>Within the {maxPlain}° plain-belt limit — bed carries without flights.</span>
                                            <button onClick={() => updSection(i, { pocket: { flightHeightIn: 2, pitchIn: 12 } })} className="hover:text-primary">add flights anyway</button>
                                        </div>
                                    )}

                                    {/* Flight pockets */}
                                    {flighted && s.pocket && (
                                        <div className="rounded border border-primary/20 bg-dark-800/60 px-2.5 py-2 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] uppercase tracking-wider text-primary">Flight pockets</span>
                                                <button onClick={() => updSection(i, { pocket: null })} className="text-[10px] text-text-muted hover:text-error">remove flights</button>
                                            </div>
                                            <div className="grid grid-cols-3 gap-2">
                                                <div>
                                                    <label className={labelCls}>Flight Height (in)</label>
                                                    <input type="number" min="0" step="any" value={s.pocket.flightHeightIn || ''} className={inputCls}
                                                        onChange={(e) => updSection(i, { pocket: { ...s.pocket!, flightHeightIn: num(e.target.value) } })} />
                                                </div>
                                                <div>
                                                    <label className={labelCls}>Pitch (in)</label>
                                                    <input type="number" min="0" step="any" value={s.pocket.pitchIn || ''} className={inputCls}
                                                        onChange={(e) => updSection(i, { pocket: { ...s.pocket!, pitchIn: num(e.target.value) } })} />
                                                </div>
                                                <div>
                                                    <label className={labelCls}>Measured lb/pocket</label>
                                                    <input type="number" min="0" step="any" value={s.pocket.lbPerPocketOverride ?? ''} placeholder="optional" className={inputCls}
                                                        onChange={(e) => updSection(i, { pocket: { ...s.pocket!, lbPerPocketOverride: e.target.value === '' ? null : num(e.target.value) } })} />
                                                </div>
                                            </div>
                                            {pocket ? (
                                                <div className="text-[10px] font-mono text-text-secondary">
                                                    {pocket.lbPerPocket.toFixed(2)} lb/pocket{pocket.measured ? ' (measured)' : ` (${pocket.areaIn2.toFixed(1)} in² wedge${pocket.fillsPitch ? ', fills the pitch' : ''})`}
                                                    {' · '}{pocket.pocketsOnSection.toFixed(1)} pockets · {pocket.lbfPerFt.toFixed(2)} lb/ft
                                                    {' · '}delivers {pocket.achievedLbHr.toFixed(0)} lb/hr at {cfg.beltSpeedFpm} ft/min
                                                </div>
                                            ) : (
                                                <div className="text-[10px] text-warning">Enter flight height and pitch; loose density and repose come from Belt &amp; Load below.</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )
                        }
                        return (
                            <div key={i} className="rounded-lg border border-border bg-dark-900/50 px-3 py-2 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-mono text-primary">Turn {i + 1} + straight</span>
                                    <button onClick={() => removeSection(i)}
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
                                            onChange={(e) => updSection(i, { angleDeg: numEdit(e.target.value, 90) })} />
                                    </div>
                                    <div>
                                        <label className={labelCls}>Inside R (in)</label>
                                        <input type="number" min="0" step="any" value={s.insideRadiusIn || ''} placeholder={minRadiusIn > 0 ? minRadiusIn.toFixed(1) : undefined} className={inputCls}
                                            onChange={(e) => updSection(i, { insideRadiusIn: num(e.target.value) })}
                                            onBlur={(e) => { if (e.target.value === '' && minRadiusIn > 0) updSection(i, { insideRadiusIn: Math.round(minRadiusIn * 100) / 100 }) }} />
                                        <MinNote value={s.insideRadiusIn} min={minRadiusIn} what="minimum inside radius" />
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
                                        <input type="number" min="0" step="any" value={s.straightAfterIn || ''} placeholder={minStraightIn > 0 ? minStraightIn.toFixed(1) : '0'} className={inputCls}
                                            onChange={(e) => updSection(i, { straightAfterIn: num(e.target.value) })}
                                            onBlur={(e) => { if (e.target.value === '' && minStraightIn > 0) updSection(i, { straightAfterIn: minStraightIn }) }} />
                                        <MinNote value={s.straightAfterIn} min={minStraightIn} what="minimum straight" />
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                    <div className="grid grid-cols-3 gap-2">
                        <button
                            onClick={() => setCfg((c) => ({ ...c, sections: [...c.sections, { angleDeg: 90, insideRadiusIn: minRadiusIn > 0 ? Math.round(minRadiusIn * 100) / 100 : 18.4, direction: c.sections.filter(isTurn).length % 2 ? 'R' : 'L', straightAfterIn: minStraightIn }] }))}
                            className="px-3 py-2 border border-dashed border-border rounded-lg text-text-muted text-sm hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-1.5">
                            <Plus className="w-4 h-4" /> Turn + Straight
                        </button>
                        <button
                            onClick={() => setCfg((c) => ({ ...c, sections: [...c.sections, { kind: 'incline', lengthIn: 48, riseIn: 12 }] }))}
                            className="px-3 py-2 border border-dashed border-warning/40 rounded-lg text-text-muted text-sm hover:border-warning hover:text-warning transition-colors flex items-center justify-center gap-1.5">
                            <Plus className="w-4 h-4" /> Incline
                        </button>
                        <button
                            onClick={() => setCfg((c) => ({ ...c, sections: [...c.sections, { kind: 'straight', lengthIn: Math.max(36, minStraightIn) }] }))}
                            className="px-3 py-2 border border-dashed border-border rounded-lg text-text-muted text-sm hover:border-text-secondary hover:text-text-secondary transition-colors flex items-center justify-center gap-1.5">
                            <Plus className="w-4 h-4" /> Straight
                        </button>
                    </div>
                    <div className="text-[10px] text-text-muted">
                        One chain for every layout: a straight belt is the infeed run alone; L and Z add an incline (and a discharge straight); an S conveyor adds turns. The Spec Solver card can send a solved L / Z path here.
                    </div>
                    <div className="px-3 py-1.5 bg-dark-900 rounded text-xs font-mono text-text-secondary overflow-x-auto whitespace-nowrap">
                        {pathSummary(cfg)}
                    </div>
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

                {/* ── Wear scenario presets live under advanced; Clean/New is the default ── */}
                <div className="space-y-2">
                    <details>
                        <summary className="text-xs text-text-secondary hover:text-text-primary cursor-pointer select-none">
                            Friction & Tension (advanced)
                        </summary>
                        <div className="mt-2 space-y-1">
                            <div className="text-[10px] text-text-muted uppercase tracking-wider">Wear scenario for sizing (default Clean/New)</div>
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
                        </div>

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
                                        onChange={(e) => setMaterialBase(row.key, numEdit(e.target.value, 0.18))}
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
                                    onChange={(e) => upd({ wearId: 'custom', frictions: { ...cfg.frictions, carryway: numEdit(e.target.value, 0.18) } })} />
                            </div>
                            <div>
                                <label className={labelCls}>μ Turn Rail (active)</label>
                                <input type="number" min="0" step="0.01" value={cfg.frictions.rail} className={inputCls}
                                    onChange={(e) => upd({ wearId: 'custom', frictions: { ...cfg.frictions, rail: numEdit(e.target.value, 0.18) } })} />
                            </div>
                            <div>
                                <label className={labelCls}>μ Return (active)</label>
                                <input type="number" min="0" step="0.01" value={cfg.frictions.return} className={inputCls}
                                    onChange={(e) => upd({ wearId: 'custom', frictions: { ...cfg.frictions, return: numEdit(e.target.value, 0.18) } })} />
                            </div>
                            <div>
                                <label className={labelCls}>Back Tension (lbf/ft width)</label>
                                <input type="number" min="0" step="any" value={cfg.backTensionLbfPerFtWidth} className={inputCls}
                                    onChange={(e) => upd({ backTensionLbfPerFtWidth: numEdit(e.target.value, 0) })} />
                                <div className="text-[10px] text-text-muted mt-0.5">
                                    Modular belts with catenary take-up run near-zero slack tension. Enter a value only
                                    if a mechanical tensioner or known slack-side load exists.{result.backTensionLbf > 0 ? ` (= ${result.backTensionLbf.toFixed(1)} lbf)` : ''}
                                </div>
                            </div>
                            <div>
                                <label className={labelCls}>μ Return Rollers (assumed)</label>
                                <input type="number" min="0" step="0.005" value={cfg.muRoller} className={inputCls}
                                    onChange={(e) => upd({ muRoller: numEdit(e.target.value, 0.04) })} />
                                <div className="text-[10px] text-text-muted mt-0.5">Bearinged rollers, 0.03–0.05 plausible.</div>
                            </div>
                            <div>
                                <label className={labelCls}>Static Ratio / Ramp (s) / Breakaway</label>
                                <div className="flex gap-1">
                                    <input type="number" min="1" step="0.01" value={cfg.staticRatio} className={inputCls}
                                        onChange={(e) => upd({ staticRatio: numEdit(e.target.value, 1.11) })} />
                                    <input type="number" min="0.1" step="0.1" value={cfg.rampTimeS} className={inputCls}
                                        onChange={(e) => upd({ rampTimeS: numEdit(e.target.value, 1.0) })} />
                                    <input type="number" min="1" step="0.05" value={cfg.breakawayFactor} className={inputCls}
                                        onChange={(e) => upd({ breakawayFactor: numEdit(e.target.value, 1.25) })} />
                                </div>
                            </div>
                            <div>
                                <label className={labelCls}>Belt Straight Rating (kgf/m) / Curve Derate / Collapse Factor</label>
                                <div className="flex gap-1">
                                    <input type="number" min="0" step="any" value={cfg.straightRatingKgfM} className={inputCls}
                                        onChange={(e) => upd({ straightRatingKgfM: numEdit(e.target.value, 205) })} />
                                    <input type="number" min="0.05" max="1" step="0.01" value={cfg.curveDerate} className={inputCls}
                                        onChange={(e) => upd({ curveDerate: numEdit(e.target.value, 0.23) })} />
                                    <input type="number" min="1" step="0.1" value={cfg.collapseFactor} className={inputCls}
                                        onChange={(e) => upd({ collapseFactor: numEdit(e.target.value, 1.5) })} />
                                </div>
                                <div className="text-[10px] text-text-muted mt-0.5">
                                    Curve capacity ≈ 20–26% of straight rating industry-wide (bounded screen until the vendor
                                    publishes one). Collapse factor = min inside-radius ratio — geometry compliance, never a tension derating.
                                </div>
                            </div>
                            <div>
                                <label className={labelCls}>Corner Contact Band (in)</label>
                                <input type="number" min="0.05" step="0.05" value={cfg.contactBandIn} className={inputCls}
                                    onChange={(e) => upd({ contactBandIn: numEdit(e.target.value, 0.5) })} />
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
                                            onChange={(e) => upd({ turnDragModel: { ...cfg.turnDragModel, exponent: numEdit(e.target.value, 0.5) } })}
                                            className="flex-1 accent-[var(--color-primary,#22d3ee)]" />
                                        <span className="font-mono text-xs text-primary w-10 text-right">{cfg.turnDragModel.exponent.toFixed(2)}</span>
                                        <label className="text-xs text-text-muted whitespace-nowrap ml-2">Ref ratio</label>
                                        <input type="number" min="1" step="0.1" value={cfg.turnDragModel.refRatio}
                                            onChange={(e) => upd({ turnDragModel: { ...cfg.turnDragModel, refRatio: numEdit(e.target.value, 2.2) } })}
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
                                <span className="font-mono text-text-primary">{result.productLoadLbf.toFixed(1)} lbf ({result.productLoadPerFt.toFixed(2)}/ft avg)</span>
                                <span className="font-mono text-text-muted"> · {result.productType}</span>
                            </div>
                        </div>

                        {/* Red screens never hide */}
                        {bulkOver && (
                            <div className="px-3 py-2 border-l-2 rounded text-xs bg-error/10 border-error text-error">
                                Bulk capacity at {cfg.beltSpeedFpm} ft/min: <span className="font-mono">{result.bulkCapacityLbHr!.toFixed(0)} lb/hr</span> vs demand <span className="font-mono">{cfg.throughputLbHr.toFixed(0)} lb/hr</span> = <span className="font-mono font-semibold">{((cfg.throughputLbHr / result.bulkCapacityLbHr!) * 100).toFixed(0)}%</span> — the belt cannot carry the rate.
                            </div>
                        )}
                        {curveOver && (
                            <div className="px-3 py-2 border-l-2 rounded text-xs bg-error/10 border-error text-error">
                                Curve edge capacity exceeded: worst in-curve tension (High) <span className="font-mono">{result.maxInCurveHighLbf!.toFixed(1)} lbf</span> vs <span className="font-mono">{result.curveCapacityLbf!.toFixed(1)} lbf</span> = <span className="font-mono font-semibold">{result.curveCapacityUtilPct!.toFixed(0)}%</span>.
                            </div>
                        )}
                        {cornerFail && (
                            <div className="px-3 py-2 border-l-2 rounded text-xs bg-error/10 border-error text-error font-medium">
                                {result.cornerTier === 'dg321-required' ? '✕ DG-321 rails REQUIRED in turns at this speed and corner pressure.' : '✕ Beyond the sliding-corner envelope — rolling corner hardware, vendor rating, or slower belt.'}
                            </div>
                        )}

                        <details>
                            <summary className="text-xs text-text-secondary hover:text-text-primary cursor-pointer select-none">
                                Details{detailWarnings > 0 ? ` — ${detailWarnings} warning${detailWarnings === 1 ? '' : 's'}` : ''} · turn-by-turn tension, screens, sign-off
                            </summary>
                            <div className="mt-2 space-y-3">
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

                        {/* Where the load sits — only interesting when a section departs from the uniform spread */}
                        {result.sectionLoads.some((r) => r.source !== 'uniform') && (
                            <div>
                                <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Load By Section</div>
                                <table className="w-full text-xs">
                                    <thead><tr className="text-text-muted border-b border-border">
                                        <th className="py-1 text-left">Section</th>
                                        <th className="py-1 text-right">Length (in)</th>
                                        <th className="py-1 text-right">lb/ft</th>
                                        <th className="py-1 text-right">lbf</th>
                                        <th className="py-1 text-right">Source</th>
                                    </tr></thead>
                                    <tbody>
                                        {result.sectionLoads.map((r, k) => (
                                            <tr key={k} className="border-b border-border/50 font-mono">
                                                <td className="py-1 text-text-primary">{r.index === -1 ? 'Infeed straight' : `${r.kind === 'turn' ? 'Turn' : r.kind === 'incline' ? 'Incline' : 'Straight'} ${r.index + 1}`}</td>
                                                <td className="py-1 text-right text-text-secondary">{r.lengthIn.toFixed(0)}</td>
                                                <td className={`py-1 text-right ${r.source === 'uniform' ? 'text-text-secondary' : 'text-primary'}`}>{r.lbfPerFt.toFixed(2)}</td>
                                                <td className="py-1 text-right text-text-primary">{r.lbf.toFixed(1)}</td>
                                                <td className="py-1 text-right text-text-muted">{r.source}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {result.bulkCapacityLbHr !== null && cfg.loadMode === 'rate' && !bulkOver && (
                            <div className={`px-3 py-2 border-l-2 rounded text-xs ${
                                cfg.throughputLbHr > 0.8 * result.bulkCapacityLbHr ? 'bg-warning/10 border-warning text-warning'
                                : 'bg-dark-800 border-success text-text-secondary'
                            }`}>
                                Bulk capacity at {cfg.beltSpeedFpm} ft/min: <span className="font-mono">{result.bulkCapacityLbHr.toFixed(0)} lb/hr</span>
                                {' '}({result.pockets.length > 0 ? 'limiting pocket section' : 'bed'}) vs demand <span className="font-mono">{cfg.throughputLbHr.toFixed(0)} lb/hr</span>
                                {' '}= <span className="font-mono font-semibold">{((cfg.throughputLbHr / result.bulkCapacityLbHr) * 100).toFixed(0)}%</span>.
                            </div>
                        )}
                        {result.warnings.map((w, i) => (
                            <div key={i} className="px-3 py-2 bg-warning/10 border-l-2 border-warning rounded text-xs text-warning">{w}</div>
                        ))}

                        {/* Curve edge-capacity screen (mandatory when turns exist) */}
                        {result.curveCapacityLbf !== null && !curveOver && (
                            <div className={`px-3 py-2 border-l-2 rounded text-xs ${
                                result.curveCapacityUtilPct! > 85 ? 'bg-warning/10 border-warning text-warning'
                                : 'bg-dark-800 border-primary text-text-secondary'
                            }`}>
                                Curve edge capacity: worst in-curve tension (High) <span className="font-mono">{result.maxInCurveHighLbf!.toFixed(1)} lbf</span> vs{' '}
                                <span className="font-mono">{result.curveCapacityLbf.toFixed(1)} lbf</span> (straight rating × {cfg.curveDerate}) ={' '}
                                <span className="font-mono font-semibold">{result.curveCapacityUtilPct!.toFixed(0)}%</span>.
                                {' '}Bounded screen — not manufacturer-certified until a vendor curve rating replaces the derate.
                            </div>
                        )}

                        {/* Corner speed ceiling — parametric thermal model (q = μ·p·V) */}
                        {result.cornerTier !== null && !cornerFail && (
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
                        </details>
                    </div>
                </div>

                {/* ── Drive: sized on its own card ── */}
                <div className="rounded-lg border border-border bg-dark-900/50 px-3 py-2.5 space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="text-xs text-text-secondary uppercase tracking-wider">Drive</span>
                        <span className="text-[10px] text-text-muted font-mono">
                            sizing floors {result.continuousFloorLbf.toFixed(1)} lbf cont · {result.peakFloorLbf.toFixed(1)} lbf peak ({wearFactors.find((f) => f.id === activeScenario)?.label ?? 'custom'} × SF {result.serviceFactor.toFixed(1)})
                        </span>
                    </div>
                    {quickPick.recommended ? (
                        <div className="text-xs text-text-secondary">
                            Smallest passing OneMotion drive at {cfg.beltWidthIn}″: <span className="font-semibold text-success">{quickPick.recommended.series}</span>
                            <span className="font-mono text-text-muted"> — {quickPick.recommended.contUtil.toFixed(0)}% cont · {quickPick.recommended.peakUtil.toFixed(0)}% peak · {quickPick.recommended.rpm.toFixed(0)} rpm</span>
                        </div>
                    ) : (
                        <div className="text-xs text-warning">No OneMotion series passes at this width, pull, and speed — size a sprocket-driven shaft on the Torque &amp; Motor card.</div>
                    )}
                    <div className="text-[10px] text-text-muted">Torque at the sprocket or drum, shaft rpm, power, motor size, gear ratio, the OneMotion auto-pick table and manual drive utilisation live on the Torque &amp; Motor card — open its From bar and pull or link this card. Drive Shaft then pulls from Torque &amp; Motor.</div>
                </div>


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
