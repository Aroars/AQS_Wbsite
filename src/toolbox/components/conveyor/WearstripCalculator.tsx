import { useState, useMemo, useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import { PinButton } from '@/toolbox/components/ui/PinButton'
import { showToast } from '@/toolbox/components/ui/Toast'
import { useAppStore } from '@/toolbox/stores/appStore'
import {
    calculateWearstrip, optimizeWearstrip, solveSupportLayout,
    stripMaterials, tempFactors, stiffnessClasses, wearstripStandards, wearstripExamples,
    defaultWearstripConfig, getStripMaterial,
    type WearstripConfig,
} from '@/toolbox/lib/calculators/wearstrip'

const inputCls = 'w-full px-2 py-2 bg-dark-900 border border-border rounded-lg text-text-primary font-mono text-sm focus:outline-none focus:border-primary'
const selectCls = 'w-full px-2 py-2 bg-dark-900 border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-primary'
const labelCls = 'block text-xs text-text-muted mb-1'

function num(v: string, fallback = 0): number {
    const n = parseFloat(v)
    return isNaN(n) ? fallback : n
}

function UtilBar({ label, pct, detail }: { label: string; pct: number; detail: string }) {
    const cls = pct < 60 ? 'bg-success' : pct <= 85 ? 'bg-warning' : 'bg-error'
    const txt = pct < 60 ? 'text-success' : pct <= 85 ? 'text-warning' : 'text-error'
    return (
        <div>
            <div className="flex justify-between text-xs mb-0.5">
                <span className="text-text-secondary">{label}</span>
                <span className={`font-mono ${txt}`}>{pct.toFixed(0)}% <span className="text-text-muted">· {detail}</span></span>
            </div>
            <div className="h-1.5 bg-dark-900 rounded overflow-hidden">
                <div className={`h-full rounded ${cls}`} style={{ width: `${Math.min(pct, 100)}%` }} />
            </div>
        </div>
    )
}

function loadInitial(stored: string | null): WearstripConfig {
    try {
        if (stored) return { ...defaultWearstripConfig, ...JSON.parse(stored) }
    } catch { /* fall through */ }
    return { ...defaultWearstripConfig }
}

export function WearstripCalculator() {
    const pinned = useAppStore((s) => s.pinnedCalculators.includes('wearstrip'))
    const togglePin = useAppStore((s) => s.togglePinCalculator)
    const setWearstripConfig = useAppStore((s) => s.setWearstripConfig)
    const sendToBeltPull = useAppStore((s) => s.sendToBeltPull)

    const [cfg, setCfg] = useState<WearstripConfig>(() => loadInitial(useAppStore.getState().wearstripConfig))
    const [mode, setMode] = useState<'check' | 'optimize'>('check')

    useEffect(() => { setWearstripConfig(JSON.stringify(cfg)) }, [cfg, setWearstripConfig])

    const upd = (patch: Partial<WearstripConfig>) => setCfg((c) => ({ ...c, ...patch }))

    const result = useMemo(() => calculateWearstrip(cfg), [cfg])
    const optimized = useMemo(() => mode === 'optimize' ? optimizeWearstrip(cfg, 10) : [], [mode, cfg])
    // Shop layout rule: uniform spans in 16-18" with <=3" end overhangs, fewest supports
    const layout = useMemo(() => solveSupportLayout(cfg.conveyorLengthFt * 12, 16, 18, 3), [cfg.conveyorLengthFt])

    const standardsStatus = useMemo(() => wearstripStandards.map((s) => {
        const stdLayout = solveSupportLayout(cfg.conveyorLengthFt * 12, s.spanMinIn, s.spanMaxIn, 3)
        const spanIn = stdLayout?.spanIn ?? s.spanMaxIn
        return {
            ...s,
            spanIn,
            overhangIn: stdLayout?.overhangIn ?? null,
            result: calculateWearstrip({
                ...cfg,
                stripWidthIn: s.stripWidthIn, stripHeightIn: s.stripHeightIn,
                edgeStripWidthIn: s.edgeStripWidthIn, edgeStripHeightIn: s.edgeStripHeightIn,
                spanIn,
                requiredOverhangIn: stdLayout ? stdLayout.overhangIn : cfg.requiredOverhangIn,
            }),
        }
    }), [cfg])
    const mat = getStripMaterial(cfg.materialId)

    // Stiffest per dollar among optimizer results: max (1/deflection)/cost
    const stiffestPerDollar = useMemo(() => {
        if (optimized.length === 0) return null
        let best = optimized[0]
        for (const o of optimized) {
            if ((1 / o.result.pointDeflIn) / o.result.totalCost > (1 / best.result.pointDeflIn) / best.result.totalCost) best = o
        }
        return best
    }, [optimized])

    const sendMu = () => {
        sendToBeltPull({ carrywayBaseMu: mat.muDynamic })
        showToast(`Sent μ=${mat.muDynamic} to Belt Pull carryway/return`)
    }

    const inMm = (v: number) => `${v.toFixed(3)}" (${(v * 25.4).toFixed(2)} mm)`

    return (
        <div className="bg-dark-800 border border-border rounded-xl">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text-primary">Wearstrip Span Calculator</h3>
                <PinButton pinned={pinned} onToggle={() => togglePin('wearstrip')} />
            </div>
            <div className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                        {(['check', 'optimize'] as const).map((m) => (
                            <button key={m} onClick={() => setMode(m)}
                                className={`px-2.5 py-1.5 rounded-lg text-xs border transition-colors ${
                                    mode === m ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-dark-900 text-text-secondary'
                                }`}>
                                {m === 'check' ? 'Check' : 'Optimize'}
                            </button>
                        ))}
                    </div>
                    <select value="" onChange={(e) => {
                        const ex = wearstripExamples.find((x) => x.id === e.target.value)
                        if (ex) setCfg(structuredClone(ex.config))
                    }} className={selectCls}>
                        <option value="">Load example…</option>
                        {wearstripExamples.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}
                    </select>
                </div>

                {/* Conveyor */}
                <div className="grid grid-cols-2 @md:grid-cols-3 gap-2">
                    <div>
                        <label className={labelCls}>Belt Width (in)</label>
                        <input type="number" min="1" step="any" value={cfg.beltWidthIn || ''} className={inputCls}
                            onChange={(e) => upd({ beltWidthIn: num(e.target.value, 12) })} />
                    </div>
                    <div>
                        <label className={labelCls}>Conveyor Length (ft)</label>
                        <input type="number" min="1" step="any" value={cfg.conveyorLengthFt || ''} className={inputCls}
                            onChange={(e) => upd({ conveyorLengthFt: num(e.target.value, 10) })} />
                    </div>
                    <div>
                        <label className={labelCls}>Operating Temp</label>
                        <select value={cfg.tempF} onChange={(e) => upd({ tempF: num(e.target.value, 73) })} className={selectCls}>
                            {tempFactors.map((t) => <option key={t.tempF} value={t.tempF}>{t.label}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className={labelCls}>Belt Weight (lb/ft²)</label>
                        <input type="number" min="0" step="any" value={cfg.beltWeightLbFt2 || ''} className={inputCls}
                            onChange={(e) => upd({ beltWeightLbFt2: num(e.target.value, 1.64) })} />
                    </div>
                    <div>
                        <label className={labelCls}>Product (lb/ft)</label>
                        <input type="number" min="0" step="any" value={cfg.productLoadLbFt || ''} className={inputCls}
                            onChange={(e) => upd({ productLoadLbFt: num(e.target.value) })} />
                    </div>
                    <div>
                        <label className={labelCls}>Standing Worst (lb/ft)</label>
                        <input type="number" min="0" step="any" value={cfg.standingLoadLbFt || ''} className={inputCls}
                            onChange={(e) => upd({ standingLoadLbFt: num(e.target.value) })} />
                    </div>
                </div>

                {/* Material */}
                <div className="space-y-1.5">
                    <div className="flex gap-2 items-end">
                        <div className="flex-1">
                            <label className={labelCls}>Wearstrip Material</label>
                            <select value={cfg.materialId} onChange={(e) => upd({ materialId: e.target.value })} className={selectCls}>
                                {stripMaterials.map((m) => <option key={m.id} value={m.id}>{m.name} — μ {m.muDynamic}, ${m.costPerIn3}/in³</option>)}
                            </select>
                        </div>
                        <button onClick={sendMu} title="The strip is the carryway — its friction drives belt pull and motor sizing"
                            className="px-2.5 py-2 rounded-lg text-xs border border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center gap-1 whitespace-nowrap">
                            μ {mat.muDynamic} → Belt Pull <ArrowRight className="w-3 h-3" />
                        </button>
                    </div>
                    <div className="text-[10px] text-text-muted">
                        {mat.note ? `${mat.note}. ` : ''}Handbook values — verify E and creep with the supplier before locking a standard.
                    </div>
                    {cfg.materialId === 'acetal' && (
                        <div className="px-2.5 py-2 bg-error/10 border-l-2 border-error rounded text-xs text-error font-medium">
                            Acetal wearstrips must NOT run under acetal (POM) belts — like-on-like polymer galling. Confirm the belt material is not POM.
                        </div>
                    )}
                </div>

                {/* Strip design (check mode drives these; optimize mode solves them) */}
                {mode === 'check' && (
                    <>
                        <div className="grid grid-cols-3 @md:grid-cols-6 gap-2">
                            <div>
                                <label className={labelCls}>Interior W (in)</label>
                                <input type="number" min="0.25" step="0.25" value={cfg.stripWidthIn || ''} className={inputCls}
                                    onChange={(e) => upd({ stripWidthIn: num(e.target.value, 1) })} />
                            </div>
                            <div>
                                <label className={labelCls}>Interior H (in)</label>
                                <input type="number" min="0.25" step="0.25" value={cfg.stripHeightIn || ''} className={inputCls}
                                    onChange={(e) => upd({ stripHeightIn: num(e.target.value, 2) })} />
                            </div>
                            <div>
                                <label className={labelCls}>Edge W (in)</label>
                                <input type="number" min="0.25" step="0.25" value={cfg.edgeStripWidthIn || ''} className={inputCls}
                                    onChange={(e) => upd({ edgeStripWidthIn: num(e.target.value, 1.5) })} />
                            </div>
                            <div>
                                <label className={labelCls}>Edge H (in)</label>
                                <input type="number" min="0.25" step="0.25" value={cfg.edgeStripHeightIn || ''} className={inputCls}
                                    onChange={(e) => upd({ edgeStripHeightIn: num(e.target.value, 2) })} />
                            </div>
                            <div>
                                <label className={labelCls}>Span (in)</label>
                                <input type="number" min="4" step="any" value={cfg.spanIn || ''} className={inputCls}
                                    onChange={(e) => upd({ spanIn: num(e.target.value, 18) })} />
                            </div>
                            <div>
                                <label className={labelCls}>Strips (sugg. {result.suggestedStripCount})</label>
                                <input type="number" min="2" step="1" value={cfg.stripCount || ''} className={inputCls}
                                    onChange={(e) => upd({ stripCount: num(e.target.value, 3) })} />
                            </div>
                        </div>
                        {/* Uniform layout per the shop rule */}
                        {layout && (
                            <div className="px-3 py-2 bg-dark-900 rounded text-xs text-text-secondary flex items-center justify-between gap-2 flex-wrap">
                                <span>
                                    Uniform layout for {cfg.conveyorLengthFt} ft:{' '}
                                    <span className="font-mono text-text-primary">
                                        {layout.segments} × {layout.spanIn.toFixed(1)}" spans · {layout.overhangIn.toFixed(1)}" overhangs · {layout.supports} supports
                                    </span>
                                </span>
                                <button
                                    onClick={() => upd({ spanIn: Math.round(layout.spanIn * 100) / 100, requiredOverhangIn: Math.round(layout.overhangIn * 100) / 100 })}
                                    className="px-2 py-1 rounded text-xs border border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                                    Apply span + overhang
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* Standards — the preferred answer when one passes */}
                <div className="flex flex-wrap gap-1.5">
                    {standardsStatus.map((s) => (
                        <button key={s.id}
                            onClick={() => upd({
                                stripWidthIn: s.stripWidthIn, stripHeightIn: s.stripHeightIn,
                                edgeStripWidthIn: s.edgeStripWidthIn, edgeStripHeightIn: s.edgeStripHeightIn,
                                spanIn: Math.round(s.spanIn * 100) / 100,
                                requiredOverhangIn: s.overhangIn !== null ? Math.round(s.overhangIn * 100) / 100 : cfg.requiredOverhangIn,
                            })}
                            title={`${s.stripWidthIn}×${s.stripHeightIn} interior / ${s.edgeStripWidthIn}×${s.edgeStripHeightIn} edge @ ${s.spanIn.toFixed(1)}" — click to apply`}
                            className={`px-2.5 py-1.5 rounded-lg text-xs border transition-colors font-mono ${
                                s.result.passAll
                                    ? 'border-success/40 bg-success/10 text-success hover:bg-success/20'
                                    : 'border-border bg-dark-900 text-text-muted hover:border-text-muted'
                            }`}>
                            {s.result.passAll ? '✓' : '✗'} {s.name}
                        </button>
                    ))}
                    <span className="text-[10px] text-text-muted self-center">badges = pass under current criteria; click to apply</span>
                </div>

                {/* Criteria */}
                <details>
                    <summary className="text-xs text-text-secondary hover:text-text-primary cursor-pointer select-none">Design Criteria</summary>
                    <div className="mt-2 space-y-2">
                        <div className="flex flex-wrap gap-1.5 items-center">
                            <span className="text-xs text-text-muted">Stiffness class:</span>
                            {stiffnessClasses.map((sc) => (
                                <button key={sc.id} onClick={() => upd({ deflectionLimitIn: sc.limitIn })}
                                    className={`px-2 py-1 rounded text-xs border transition-colors font-mono ${
                                        cfg.deflectionLimitIn === sc.limitIn ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-dark-900 text-text-secondary'
                                    }`}>
                                    {sc.label} {sc.limitIn}"
                                </button>
                            ))}
                        </div>
                        <div className="grid grid-cols-2 @md:grid-cols-4 gap-2">
                            <div>
                                <label className={labelCls}>Feel Press (lbf)</label>
                                <input type="number" min="0" step="any" value={cfg.pointLoadLbf} className={inputCls}
                                    onChange={(e) => upd({ pointLoadLbf: num(e.target.value, 25) })} />
                            </div>
                            <div>
                                <label className={labelCls}>Strips Under Press</label>
                                <input type="number" min="1" step="1" value={cfg.stripsUnderPress} className={inputCls}
                                    onChange={(e) => upd({ stripsUnderPress: num(e.target.value, 2) })} />
                            </div>
                            <div>
                                <label className={labelCls}>Body Load (lbf)</label>
                                <input type="number" min="0" step="any" value={cfg.bodyLoadLbf} className={inputCls}
                                    onChange={(e) => upd({ bodyLoadLbf: num(e.target.value, 250) })} />
                            </div>
                            <div>
                                <label className={labelCls}>Body Strips</label>
                                <input type="number" min="1" step="1" value={cfg.bodyLoadStrips} className={inputCls}
                                    onChange={(e) => upd({ bodyLoadStrips: num(e.target.value, 2) })} />
                            </div>
                            <div>
                                <label className={labelCls}>Creep SF</label>
                                <input type="number" min="1" step="0.1" value={cfg.creepSF} className={inputCls}
                                    onChange={(e) => upd({ creepSF: num(e.target.value, 2) })} />
                            </div>
                            <div>
                                <label className={labelCls}>Max Belt Span (in)</label>
                                <input type="number" min="1" step="any" value={cfg.maxBeltSpanIn} className={inputCls}
                                    onChange={(e) => upd({ maxBeltSpanIn: num(e.target.value, 6) })} />
                            </div>
                            <div>
                                <label className={labelCls}>Cantilever Strips</label>
                                <input type="number" min="1" step="1" value={cfg.cantileverStrips} className={inputCls}
                                    onChange={(e) => upd({ cantileverStrips: num(e.target.value, 1) })} />
                            </div>
                            <div>
                                <label className={labelCls}>Req'd Nose Overhang (in)</label>
                                <input type="number" min="0" step="any" value={cfg.requiredOverhangIn ?? ''} placeholder="optional" className={inputCls}
                                    onChange={(e) => upd({ requiredOverhangIn: e.target.value === '' ? null : num(e.target.value) })} />
                            </div>
                            <div>
                                <label className={labelCls}>Cost / Support ($)</label>
                                <input type="number" min="0" step="any" value={cfg.costPerSupport} className={inputCls}
                                    onChange={(e) => upd({ costPerSupport: num(e.target.value, 18) })} />
                            </div>
                            <div>
                                <label className={labelCls}>UDL Limit (L / N)</label>
                                <input type="number" min="100" step="10" value={cfg.udlDivisor} className={inputCls}
                                    onChange={(e) => upd({ udlDivisor: num(e.target.value, 360) })} />
                            </div>
                        </div>
                    </div>
                </details>

                {/* ── RESULTS ── */}
                {mode === 'check' ? (
                    <div className={`rounded-lg border overflow-hidden ${result.passAll ? 'border-success/30' : 'border-error/30'}`}>
                        <div className={`px-4 py-2.5 border-b flex items-center justify-between ${
                            result.passAll ? 'bg-success/10 border-success/30' : 'bg-error/10 border-error/30'
                        }`}>
                            <span className={`text-sm font-semibold ${result.passAll ? 'text-success' : 'text-error'}`}>
                                {result.passAll ? '✓ PASSES' : '✗ FAILS'} — {cfg.stripWidthIn}×{cfg.stripHeightIn} int / {cfg.edgeStripWidthIn}×{cfg.edgeStripHeightIn} edge {mat.name} @ {cfg.spanIn}" × {cfg.stripCount}
                            </span>
                            <span className="font-mono text-sm text-text-primary">${result.totalCost.toFixed(0)}</span>
                        </div>
                        <div className="p-3 space-y-3 bg-dark-700">
                            <div className="text-xs text-text-secondary">
                                Governing criterion: <span className="text-primary font-medium">{result.governing}</span>
                            </div>
                            <div className="space-y-2">
                                <UtilBar label="Point-load deflection (feel)" pct={result.pointCheck.utilizationPct}
                                    detail={inMm(result.pointDeflIn)} />
                                <UtilBar label="Distributed deflection" pct={result.udlCheck.utilizationPct}
                                    detail={inMm(result.udlDeflIn)} />
                                <UtilBar label="Creep stress (sustained)" pct={result.creepCheck.utilizationPct}
                                    detail={`${result.creepStressPsi.toFixed(0)} / ${result.creepCheck.limit.toFixed(0)} psi`} />
                                <UtilBar label={`Body load strength (${cfg.bodyLoadLbf} lbf on ${cfg.bodyLoadStrips})`} pct={result.bodyCheck.utilizationPct}
                                    detail={`${result.bodyStressPsi.toFixed(0)} / ${result.bodyCheck.limit.toFixed(0)} psi · springs ${result.bodyDeflIn.toFixed(2)}" and recovers`} />
                                {result.overhangCheck && (
                                    <UtilBar label="Nose overhang demand" pct={result.overhangCheck.utilizationPct}
                                        detail={`need ${cfg.requiredOverhangIn}" of ${result.maxOverhangIn.toFixed(1)}"`} />
                                )}
                            </div>

                            {/* Inverse readout: the feel budget in pounds */}
                            <div className="px-3 py-2 bg-dark-800 border-l-2 border-primary rounded text-xs text-text-secondary">
                                Feel budget: this span reaches the {cfg.deflectionLimitIn}" limit at a{' '}
                                <span className="font-mono text-primary font-semibold">{result.allowablePointLbf.toFixed(0)} lbf</span> press
                                ({cfg.stripsUnderPress} strips). A firm hand is ~20–40 lbf; deflection under ~0.010–0.020" is imperceptible through the belt.
                            </div>

                            {/* Derived overhang — the one-solve output */}
                            <div className="px-3 py-2 bg-dark-800 border-l-2 border-primary rounded text-xs text-text-secondary">
                                Max end overhang for this profile: <span className="font-mono text-primary font-semibold">{result.maxOverhangIn.toFixed(1)}"</span>
                                {' '}(limited by {result.overhangGovernedBy === 'deflection' ? 'tip deflection' : 'stress at the last support'};
                                full {(cfg.pointLoadLbf / cfg.cantileverStrips).toFixed(0)} lbf on {cfg.cantileverStrips} strip{cfg.cantileverStrips > 1 ? 's' : ''}).
                                {result.overhangCheck && !result.overhangCheck.pass && (
                                    <span className="text-error font-medium">
                                        {' '}Overhang governs — move the last cross-support closer to the nose rather than upsizing the profile.
                                    </span>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="bg-dark-800 rounded px-2.5 py-2">
                                    <span className="text-text-muted">Cost: </span>
                                    <span className="font-mono text-text-primary">${result.plasticCost.toFixed(0)} plastic + ${result.supportCost.toFixed(0)} steel ({result.supportCount} supports)</span>
                                </div>
                                <div className="bg-dark-800 rounded px-2.5 py-2">
                                    <span className="text-text-muted">vs 1.5×2 @ 18": </span>
                                    <span className="font-mono text-text-primary">
                                        {result.plasticSavedPct >= 0 ? '−' : '+'}{Math.abs(result.plasticSavedPct).toFixed(0)}% plastic, {result.supportsSavedPer10Ft >= 0 ? '−' : '+'}{Math.abs(result.supportsSavedPer10Ft).toFixed(1)} supports/10 ft
                                    </span>
                                </div>
                            </div>

                            <div className="text-[10px] text-text-muted">
                                Thermal: strips grow ≈ <span className="font-mono text-text-secondary">{result.thermalGrowthIn.toFixed(2)}"</span> over
                                {' '}{cfg.conveyorLengthFt} ft on a 73→140°F washdown swing — use slotted mounting.
                                E derated to <span className="font-mono text-text-secondary">{(result.eEffectivePsi / 1000).toFixed(0)} ksi</span> at {cfg.tempF}°F.
                            </div>
                            {result.warnings.map((w, i) => (
                                <div key={i} className="px-2.5 py-2 bg-warning/10 border-l-2 border-warning rounded text-xs text-warning">{w}</div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {optimized.length === 0 ? (
                            <div className="px-3 py-2 bg-error/10 border-l-2 border-error rounded text-xs text-error">
                                Nothing in the design space passes these criteria — relax the stiffness class, raise the temp rating, or reduce the required overhang.
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-xs">
                                        <thead><tr className="text-text-muted border-b border-border">
                                            <th className="py-1.5 text-left">Profile</th>
                                            <th className="py-1.5 text-right">Span</th>
                                            <th className="py-1.5 text-right">Strips</th>
                                            <th className="py-1.5 text-right">Defl (in)</th>
                                            <th className="py-1.5 text-right">Overhang</th>
                                            <th className="py-1.5 text-right">Plastic in³</th>
                                            <th className="py-1.5 text-right">Cost</th>
                                        </tr></thead>
                                        <tbody>
                                            {optimized.map((o, i) => {
                                                const isCheapest = i === 0
                                                const isStiffest = stiffestPerDollar === o && !isCheapest
                                                return (
                                                    <tr key={`${o.stripWidthIn}x${o.stripHeightIn}@${o.spanIn}`}
                                                        onClick={() => { setMode('check'); upd({ stripWidthIn: o.stripWidthIn, stripHeightIn: o.stripHeightIn, spanIn: o.spanIn, stripCount: o.stripCount }) }}
                                                        className={`border-b border-border/50 font-mono cursor-pointer hover:bg-dark-700 ${
                                                            isCheapest ? 'bg-success/5' : isStiffest ? 'bg-primary/5' : ''
                                                        }`}>
                                                        <td className="py-1.5 text-text-primary">
                                                            {o.stripWidthIn}×{o.stripHeightIn}
                                                            {isCheapest && <span className="ml-1 text-success text-[10px]">cheapest</span>}
                                                            {isStiffest && <span className="ml-1 text-primary text-[10px]">stiffest/$</span>}
                                                        </td>
                                                        <td className="py-1.5 text-right text-text-secondary">{o.spanIn}"</td>
                                                        <td className="py-1.5 text-right text-text-secondary">{o.stripCount}</td>
                                                        <td className="py-1.5 text-right text-text-secondary">{o.result.pointDeflIn.toFixed(3)}</td>
                                                        <td className="py-1.5 text-right text-text-secondary">{o.result.maxOverhangIn.toFixed(1)}"</td>
                                                        <td className="py-1.5 text-right text-text-muted">{o.result.plasticVolumeIn3.toFixed(0)}</td>
                                                        <td className="py-1.5 text-right text-text-primary">${o.result.totalCost.toFixed(0)}</td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="text-[10px] text-text-muted">
                                    Enumerates heights × widths × spans at the lateral-rule strip count ({optimized[0]?.stripCount}); passing configs
                                    ranked by plastic + support cost. Click a row to load it in Check mode.
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
