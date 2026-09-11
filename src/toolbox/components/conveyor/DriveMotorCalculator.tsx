import { useMemo, useCallback } from 'react'
import { ArrowRight, X } from 'lucide-react'
import { CalcPinButton } from '@/toolbox/components/ui/CalcPinButton'
import { showToast } from '@/toolbox/components/ui/Toast'
import { useAppStore } from '@/toolbox/stores/appStore'
import { useInstanceState, useInstanceInbox, asNumber, MAIN } from '@/toolbox/hooks/useToolState'
import { jumpToTool } from '@/toolbox/lib/jump'
import { fmtNum } from '@/toolbox/lib/calculators/lineThroughput'
import { LBF_TO_N, chordalPdMm, thermalUpliftFactor } from '@/toolbox/lib/calculators/beltPull'
import { motorSizing, oneMotionPicks, pulleyPresetsAt, drumCapability, sprocketCapability, LB_IN_TO_NM } from '@/toolbox/lib/calculators/driveMotor'
import { BigResult, Tile, Field, panelCls, inputCls, selectCls, labelCls, sendBtnCls } from '@/toolbox/components/ui/Results'

/*
 * Torque & Motor — the drive step of the conveyor chain, on its own card.
 * Takes the belt pull (sent from Belt Pull, or typed), turns it into torque at
 * the sprocket or drum, shaft RPM, power at the belt, a standard motor size and
 * a gear ratio, then checks it against the OneMotion series and any manual
 * drive. The auto-pick, manual capability and scenario utilisation table were
 * moved here from the Belt Pull card unchanged.
 */

interface ScenarioRow { id: string; label: string; cont: number; peak: number }

interface S {
    runningPull: string; startupPull: string; contFloor: string; peakFloor: string; speed: string; width: string
    serviceFactor: string; scenarioLabel: string; breakawayFactor: string
    scenarios: ScenarioRow[]
    driveType: 'drum' | 'sprocket'
    ratedPullN: string; presetSeries: string; drumDiaMm: string
    teeth: string; pitchMm: string; pdOverrideIn: string; boreMm: string; shellMm: string
    contNm: string; peakNm: string; maxRpmIn: string; catalogNm: string; catalogInterp: string; usedCatalog: boolean; ambientC: string
    motorRpm: string; efficiency: string
    source: string | null
}

const initial: S = {
    runningPull: '', startupPull: '', contFloor: '', peakFloor: '', speed: '60', width: '12',
    serviceFactor: '', scenarioLabel: '', breakawayFactor: '1.25', scenarios: [],
    driveType: 'sprocket', ratedPullN: '', presetSeries: '', drumDiaMm: '',
    teeth: '11', pitchMm: '50', pdOverrideIn: '', boreMm: '', shellMm: '',
    contNm: '', peakNm: '', maxRpmIn: '', catalogNm: '', catalogInterp: '3', usedCatalog: false, ambientC: '',
    motorRpm: '1750', efficiency: '85', source: null,
}

const num = (v: string, fallback = 0) => { const n = parseFloat(v); return Number.isFinite(n) ? n : fallback }

/** Green under 60 %, yellow to 85 %, red above (the Belt Pull sizing convention) */
function utilizationCls(pct: number): string {
    if (!Number.isFinite(pct) || pct > 85) return 'text-error'
    if (pct >= 60) return 'text-warning'
    return 'text-success'
}

export function DriveMotorCalculator({ instanceId = MAIN }: { instanceId?: string } = {}) {
    const sendToTool = useAppStore((s) => s.sendToTool)
    const [s, setS] = useInstanceState<S>('driveMotor', instanceId, initial)
    const upd = useCallback((patch: Partial<S>) => setS((prev) => ({ ...prev, ...patch })), [setS])

    // Belt Pull → here: pulls, floors, speed, width and the scenario floors for the utilisation table
    useInstanceInbox('driveMotor', instanceId, (p) => {
        const str = (v: unknown) => (asNumber(v) !== null ? String(Number(asNumber(v)!.toPrecision(5))) : '')
        const rows = Array.isArray(p.scenarios) ? (p.scenarios as ScenarioRow[]).filter((r) => r && typeof r.label === 'string') : []
        upd({
            runningPull: str(p.runningPullLbf), startupPull: str(p.startupPullLbf), contFloor: str(p.contFloorLbf), peakFloor: str(p.peakFloorLbf),
            speed: str(p.speedFpm) || s.speed, width: str(p.beltWidthIn) || s.width,
            serviceFactor: str(p.serviceFactor), scenarioLabel: typeof p.scenarioLabel === 'string' ? p.scenarioLabel : '',
            breakawayFactor: str(p.breakawayFactor) || s.breakawayFactor, scenarios: rows,
            pitchMm: asNumber(p.pitchMm) ? String(p.pitchMm) : s.pitchMm,
            source: typeof p.source === 'string' ? p.source : 'Loaded from Belt Pull',
        })
    })

    const speedFpm = num(s.speed)
    const widthMm = num(s.width) * 25.4
    const runningPull = num(s.runningPull)
    const startupPull = num(s.startupPull) || runningPull
    const contFloor = num(s.contFloor) || runningPull
    const peakFloor = num(s.peakFloor) || contFloor * num(s.breakawayFactor, 1.25)
    const hasPull = runningPull > 0 && speedFpm > 0

    // Pitch diameter for torque, rpm and ratio: sprocket geometry or the drum
    const pdIn = useMemo(() => {
        if (s.driveType === 'drum') return num(s.drumDiaMm) > 0 ? num(s.drumDiaMm) / 25.4 : null
        const pdMm = num(s.pdOverrideIn) > 0 ? num(s.pdOverrideIn) * 25.4 : chordalPdMm(num(s.pitchMm), num(s.teeth))
        return pdMm > 0 ? pdMm / 25.4 : null
    }, [s.driveType, s.drumDiaMm, s.pdOverrideIn, s.pitchMm, s.teeth])

    const sizing = useMemo(() => hasPull ? motorSizing({
        runningPullLbf: runningPull, startupPullLbf: startupPull, contFloorLbf: contFloor, peakFloorLbf: peakFloor,
        speedFpm, pitchDiameterIn: pdIn, driveEfficiency: num(s.efficiency, 85) / 100, motorRpm: num(s.motorRpm, 1750),
    }) : null, [hasPull, runningPull, startupPull, contFloor, peakFloor, speedFpm, pdIn, s.efficiency, s.motorRpm])

    const picks = useMemo(() => hasPull ? oneMotionPicks(contFloor, peakFloor, widthMm, speedFpm) : null, [hasPull, contFloor, peakFloor, widthMm, speedFpm])
    const presets = useMemo(() => pulleyPresetsAt(widthMm), [widthMm])
    const thermal = useMemo(() => { const amb = parseFloat(s.ambientC); return Number.isNaN(amb) ? 1 : thermalUpliftFactor(amb) }, [s.ambientC])
    const drive = useMemo(() => s.driveType === 'drum'
        ? drumCapability(num(s.ratedPullN), num(s.drumDiaMm), speedFpm, presets.find((p) => p.series === s.presetSeries)?.rpm60Hz ?? null)
        : sprocketCapability({ teeth: num(s.teeth), pitchMm: num(s.pitchMm), pdOverrideIn: num(s.pdOverrideIn), contNm: num(s.contNm), peakNm: num(s.peakNm), maxRpm: num(s.maxRpmIn), boreMm: num(s.boreMm) || null, shellMm: num(s.shellMm) || null, speedFpm }),
        [s.driveType, s.ratedPullN, s.drumDiaMm, s.presetSeries, presets, s.teeth, s.pitchMm, s.pdOverrideIn, s.contNm, s.peakNm, s.maxRpmIn, s.boreMm, s.shellMm, speedFpm])

    const scenarioRows: ScenarioRow[] = s.scenarios.length > 0 ? s.scenarios : (hasPull ? [{ id: 'entered', label: 'Entered floors', cont: contFloor, peak: peakFloor }] : [])

    const canSendShaft = hasPull && pdIn !== null
    const sendShaft = () => {
        if (!canSendShaft) return
        sendToTool('driveShaft', { loadLbf: runningPull, torqueLbIn: contFloor * (pdIn! / 2), beltWidthIn: num(s.width), pdIn, source: 'Loaded from Torque & Motor' })
        showToast(`Sent to Drive Shaft — ${fmtNum(runningPull)} lbf, ${fmtNum(contFloor * (pdIn! / 2))} lb·in`)
        jumpToTool('conveyor', 'driveShaft')
    }

    return (
        <div className="bg-dark-800 border border-border rounded-xl">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text-primary">Torque &amp; Motor</h3>
                <CalcPinButton toolId="driveMotor" instanceId={instanceId} />
            </div>
            <div className="p-4 space-y-4">
                {s.source && (
                    <div className="flex items-start gap-2 px-3 py-2 rounded-lg border border-primary/30 bg-primary/10 text-xs text-primary">
                        <span className="flex-1">{s.source}{s.scenarioLabel ? ` — ${s.scenarioLabel} × SF ${s.serviceFactor}` : ''}</span>
                        <button type="button" onClick={() => upd({ source: null })} className="text-primary/70 hover:text-primary" aria-label="Dismiss"><X className="w-3.5 h-3.5" /></button>
                    </div>
                )}

                {/* 1. Belt pull in */}
                <div className="grid grid-cols-2 @md:grid-cols-3 gap-2">
                    <Field label="Running belt pull" unit="lbf"><input type="number" min="0" step="any" value={s.runningPull} placeholder="from Belt Pull" className={inputCls} onChange={(e) => upd({ runningPull: e.target.value })} /></Field>
                    <Field label="Startup pull" unit="lbf"><input type="number" min="0" step="any" value={s.startupPull} placeholder="= running" className={inputCls} onChange={(e) => upd({ startupPull: e.target.value })} /></Field>
                    <Field label="Belt speed" unit="ft/min"><input type="number" min="0" step="any" value={s.speed} className={inputCls} onChange={(e) => upd({ speed: e.target.value })} /></Field>
                    <Field label="Sizing floor, continuous" unit="lbf" hint="Central × scenario × service factor"><input type="number" min="0" step="any" value={s.contFloor} placeholder="= running" className={inputCls} onChange={(e) => upd({ contFloor: e.target.value })} /></Field>
                    <Field label="Sizing floor, peak" unit="lbf" hint={`= ${s.breakawayFactor}× continuous when blank`}><input type="number" min="0" step="any" value={s.peakFloor} placeholder="= 1.25× continuous" className={inputCls} onChange={(e) => upd({ peakFloor: e.target.value })} /></Field>
                    <Field label="Belt width" unit="in"><input type="number" min="0" step="any" value={s.width} className={inputCls} onChange={(e) => upd({ width: e.target.value })} /></Field>
                </div>

                {/* 2. Drive geometry */}
                <div className="flex gap-1.5">
                    {(['sprocket', 'drum'] as const).map((d) => (
                        <button key={d} onClick={() => upd({ driveType: d })}
                            className={`px-2.5 py-1.5 rounded-lg text-xs border transition-colors ${s.driveType === d ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-dark-900 text-text-secondary'}`}>
                            {d === 'drum' ? 'Powered Pulley / Drum' : 'Sprocket-Driven Shaft'}
                        </button>
                    ))}
                </div>
                {s.driveType === 'sprocket' ? (
                    <div className="grid grid-cols-3 gap-2">
                        <Field label="Teeth"><input type="number" min="3" step="1" value={s.teeth} className={inputCls} onChange={(e) => upd({ teeth: e.target.value })} /></Field>
                        <Field label="Belt pitch" unit="mm"><input type="number" min="0" step="any" value={s.pitchMm} className={inputCls} onChange={(e) => upd({ pitchMm: e.target.value })} /></Field>
                        <Field label="PD override" unit="in" hint={`chordal ${(chordalPdMm(num(s.pitchMm), num(s.teeth)) / 25.4).toFixed(3)}"`}><input type="number" min="0" step="any" value={s.pdOverrideIn} placeholder={(chordalPdMm(num(s.pitchMm), num(s.teeth)) / 25.4).toFixed(3)} className={inputCls} onChange={(e) => upd({ pdOverrideIn: e.target.value })} /></Field>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-2">
                        <Field label="Drum Ø" unit="mm"><input type="number" min="0" step="any" value={s.drumDiaMm} className={inputCls} onChange={(e) => upd({ drumDiaMm: e.target.value })} /></Field>
                        <Field label={`OneMotion preset (at ${s.width}″ width)`}>
                            <select value={s.presetSeries} className={selectCls} onChange={(e) => {
                                const p = presets.find((x) => x.series === e.target.value)
                                upd({ presetSeries: e.target.value, ...(p ? { ratedPullN: p.pullN.toFixed(0), drumDiaMm: String(p.diameter) } : {}) })
                            }}>
                                <option value="">Manual entry…</option>
                                {presets.map((p) => <option key={p.series} value={p.series}>{p.series} — {p.pullN.toFixed(0)} N{p.fits ? '' : ' (width out of range)'}</option>)}
                            </select>
                        </Field>
                    </div>
                )}

                {/* 3. Torque, power, motor, ratio */}
                <div className={panelCls}>
                    <div className="grid grid-cols-2 gap-3">
                        <BigResult label="Continuous torque at drive" value={sizing?.torque.contFloorNm !== null && sizing?.torque.contFloorNm !== undefined ? fmtNum(sizing.torque.contFloorNm) : null} unit="N·m"
                            hint={!hasPull ? 'Enter a running belt pull and speed — or Send from Belt Pull.' : 'Enter the sprocket teeth and pitch, or the drum diameter, for torque.'} />
                        <BigResult label="Motor" value={sizing?.standardHp !== null && sizing?.standardHp !== undefined ? `${sizing.standardHp}` : (sizing ? '—' : null)} unit="hp standard"
                            hint="Power at the belt ÷ drive efficiency, rounded up to a catalog size." />
                    </div>
                    {sizing && (
                        <div className="grid grid-cols-2 @md:grid-cols-3 gap-2 text-xs">
                            <Tile label="Torque (running · cont · peak)">
                                {sizing.torque.runningLbIn !== null ? `${fmtNum(sizing.torque.runningLbIn)} · ${fmtNum(sizing.torque.contFloorLbIn!)} · ${fmtNum(sizing.torque.peakFloorLbIn!)} lb·in` : '— needs pitch diameter'}
                            </Tile>
                            <Tile label="Power at belt (running · startup · sizing)">{fmtNum(sizing.runningHp, 3)} · {fmtNum(sizing.startupHp, 3)} · {fmtNum(sizing.sizingHp, 3)} hp</Tile>
                            <Tile label="Motor required">{fmtNum(sizing.motorHpRequired, 3)} hp · {fmtNum(sizing.motorKwRequired, 3)} kW</Tile>
                            <Tile label="Shaft RPM">{sizing.shaftRpm !== null ? `${fmtNum(sizing.shaftRpm)} rpm at ${fmtNum(pdIn!)}" PD` : '— needs pitch diameter'}</Tile>
                            <Tile label="Gear ratio">{sizing.gearRatio !== null ? `${fmtNum(sizing.gearRatio, 3)} : 1 from ${s.motorRpm} rpm` : '—'}</Tile>
                            <Tile label="Peak torque floor">{sizing.torque.peakFloorNm !== null ? `${fmtNum(sizing.torque.peakFloorNm)} N·m` : '—'}</Tile>
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-2">
                        <Field label="Motor speed" unit="rpm" hint="1750 for a 4-pole 60 Hz motor"><input type="number" min="0" step="any" value={s.motorRpm} className={inputCls} onChange={(e) => upd({ motorRpm: e.target.value })} /></Field>
                        <Field label="Drive efficiency" unit="%" hint="gearmotor and belt drive losses; 85 typical"><input type="number" min="1" max="100" step="any" value={s.efficiency} className={inputCls} onChange={(e) => upd({ efficiency: e.target.value })} /></Field>
                    </div>
                    <div className="text-[10px] text-text-muted">
                        hp = pull × ft/min ÷ 33,000 · torque = pull × PD ÷ 2 · rpm = ft/min × 12 ÷ (π × PD) · ratio = motor rpm ÷ shaft rpm. Motor sizes are catalog steps at or above the requirement.
                    </div>
                </div>

                {/* 4. OneMotion auto-pick (moved from Belt Pull) */}
                {picks && (
                    <details open={s.driveType === 'drum'} className="rounded-lg border border-border bg-dark-900/50 px-3 py-2.5 space-y-2">
                        <summary className="cursor-pointer select-none flex items-center justify-between flex-wrap gap-2">
                            <span className="text-xs text-text-secondary uppercase tracking-wider">OneMotion Auto-Pick ({s.width}″ belt){picks.recommended ? <span className="normal-case tracking-normal text-success"> — {picks.recommended.series}</span> : <span className="normal-case tracking-normal text-error"> — none passes</span>}</span>
                            <span className="text-[10px] text-text-muted font-mono">needs {picks.contN.toFixed(0)} N cont · {picks.peakN.toFixed(0)} N peak</span>
                        </summary>
                        {picks.recommended ? (
                            <div className="px-2.5 py-2 bg-success/10 border-l-2 border-success rounded text-xs text-success">
                                Smallest passing drive: <span className="font-semibold">{picks.recommended.series}</span>
                                {' '}— {picks.recommended.pullN.toFixed(0)} N rated, {picks.recommended.contUtil.toFixed(0)}% continuous, {picks.recommended.peakUtil.toFixed(0)}% peak, {picks.recommended.rpm.toFixed(0)} rpm.
                                <button onClick={() => {
                                    const p = presets.find((x) => x.series === picks.recommended!.series)
                                    upd({ driveType: 'drum', presetSeries: picks.recommended!.series, ...(p ? { ratedPullN: p.pullN.toFixed(0), drumDiaMm: String(p.diameter) } : {}) })
                                }} className="ml-2 underline hover:text-text-primary">use it</button>
                            </div>
                        ) : (
                            <div className="px-2.5 py-2 bg-error/10 border-l-2 border-error rounded text-xs text-error">
                                No OneMotion series passes at this width, pull, and speed — a sprocket-driven shaft, a wider belt, or a second drive.
                            </div>
                        )}
                        <table className="w-full text-xs">
                            <thead><tr className="text-text-muted border-b border-border">
                                <th className="py-1 text-left">Series</th><th className="py-1 text-right">Width</th><th className="py-1 text-right">Rated (N)</th>
                                <th className="py-1 text-right">Cont</th><th className="py-1 text-right">Peak</th><th className="py-1 text-right">RPM</th>
                            </tr></thead>
                            <tbody>
                                {picks.rows.map((r) => (
                                    <tr key={r.series} className={`border-b border-border/50 font-mono ${r.passes ? '' : 'opacity-60'}`}>
                                        <td className={`py-1 font-sans ${r.passes ? 'text-text-primary' : 'text-text-muted'}`}>{r.passes ? '✓ ' : ''}{r.series}</td>
                                        <td className={`py-1 text-right ${r.fits ? 'text-text-secondary' : 'text-error'}`}>{r.fits ? 'fits' : 'no'}</td>
                                        <td className="py-1 text-right text-text-secondary">{r.pullN.toFixed(0)}</td>
                                        <td className={`py-1 text-right ${utilizationCls(Math.min(r.contUtil, 999))}`}>{Number.isFinite(r.contUtil) ? `${r.contUtil.toFixed(0)}%` : '—'}</td>
                                        <td className={`py-1 text-right ${utilizationCls(Math.min(r.peakUtil, 999))}`}>{Number.isFinite(r.peakUtil) ? `${r.peakUtil.toFixed(0)}%` : '—'}</td>
                                        <td className={`py-1 text-right ${r.rpmOk ? 'text-text-secondary' : 'text-error'}`}>{r.rpm.toFixed(0)}<span className="text-text-muted"> / {r.minRpm}–{r.maxRpm}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="text-[10px] text-text-muted">
                            Verdicts use the vendor belt-pull rating at this width (not torque ÷ radius) and the peak-to-continuous torque ratio for startup. Smallest passing series is recommended; the manual entry below is the sign-off path.
                        </div>
                    </details>
                )}

                {/* 5. Manual drive capability (moved from Belt Pull) */}
                <details>
                    <summary className="text-xs text-text-secondary hover:text-text-primary cursor-pointer select-none uppercase tracking-wider">Manual drive entry &amp; utilisation</summary>
                    <div className="mt-2 space-y-2">
                        {s.driveType === 'drum' ? (
                            <>
                                <div className="text-[10px] text-warning">Use the vendor&apos;s belt pull rating, NOT torque — drum motors are derated below torque ÷ radius.</div>
                                <Field label="Rated continuous pull" unit="N" hint={num(s.ratedPullN) > 0 ? `= ${(num(s.ratedPullN) / LBF_TO_N).toFixed(1)} lbf` : undefined}>
                                    <input type="number" min="0" step="any" value={s.ratedPullN} className={inputCls} onChange={(e) => upd({ ratedPullN: e.target.value, presetSeries: '' })} />
                                </Field>
                            </>
                        ) : (
                            <div className="space-y-2">
                                <div className="grid grid-cols-2 gap-2">
                                    <Field label="Sprocket bore" unit="mm"><input type="number" min="0" step="any" value={s.boreMm} className={inputCls} onChange={(e) => upd({ boreMm: e.target.value })} /></Field>
                                    <Field label="Motor shell" unit="mm"><input type="number" min="0" step="any" value={s.shellMm} className={inputCls} onChange={(e) => upd({ shellMm: e.target.value })} /></Field>
                                </div>
                                <div className="text-[10px] text-text-muted">
                                    Chordal PD = pitch ÷ sin(180°/z). Vendors may dimension non-chordally — override from the sprocket drawing. Fewer teeth = smaller radius = less torque needed (10T vs 11T on S-200 ≈ −9% torque).
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <Field label="Continuous (N·m) — AMO"><input type="number" min="0" step="any" value={s.contNm} className={inputCls} onChange={(e) => upd({ contNm: e.target.value, usedCatalog: false })} /></Field>
                                    <Field label="Peak (N·m) — AMO"><input type="number" min="0" step="any" value={s.peakNm} className={inputCls} onChange={(e) => upd({ peakNm: e.target.value, usedCatalog: false })} /></Field>
                                    <Field label="Max RPM"><input type="number" min="0" step="any" value={s.maxRpmIn} className={inputCls} onChange={(e) => upd({ maxRpmIn: e.target.value })} /></Field>
                                </div>
                                <div className="flex items-end gap-2">
                                    <div className="flex-1"><Field label="From catalog N·m (ambiguous rating)"><input type="number" min="0" step="any" value={s.catalogNm} className={inputCls} onChange={(e) => upd({ catalogNm: e.target.value })} /></Field></div>
                                    <select value={s.catalogInterp} onChange={(e) => upd({ catalogInterp: e.target.value })} className="px-2 py-2 bg-dark-900 border border-border rounded-lg text-text-secondary text-xs focus:outline-none">
                                        <option value="1">catalog = continuous (÷1)</option>
                                        <option value="2">catalog = peak, 2× (÷2)</option>
                                        <option value="3">catalog = peak, 3× (÷3)</option>
                                    </select>
                                    <button onClick={() => { const c = num(s.catalogNm); if (c > 0) upd({ peakNm: String(c), contNm: (c / num(s.catalogInterp, 3)).toFixed(2), usedCatalog: true }) }}
                                        className="px-2.5 py-2 rounded-lg text-xs border border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 transition-colors">Fill</button>
                                </div>
                                {s.usedCatalog && (
                                    <div className="px-2.5 py-2 bg-warning/10 border-l-2 border-warning rounded text-xs text-warning">
                                        Catalog Nm values are UNVERIFIED as continuous vs peak (AMO rows show motors named by peak; the catalog footnote says 2× FLA, the AMO shows 3× — unresolved vendor contradiction). Confirm the AMO row (continuous / peak / FLA) with the vendor before ordering.
                                    </div>
                                )}
                            </div>
                        )}
                        <Field label="Plant ambient (°C) — optional thermal allowance" hint={thermal !== 1 ? `Cool-ambient uplift ×${thermal.toFixed(3)} (√((80+40−T)/80), capped 1.25) — an engineering allowance, NOT a vendor rating. Heat ∝ torque², so typical-duty utilization sets winding temperature.` : undefined}>
                            <input type="number" step="any" value={s.ambientC} className={inputCls} placeholder="rated at 40°C" onChange={(e) => upd({ ambientC: e.target.value })} />
                        </Field>

                        {drive && hasPull && (
                            <div className="rounded-lg border border-border bg-dark-900/50 px-3 py-2.5 space-y-2">
                                {drive.screens.map((sc, i) => <div key={i} className="px-2.5 py-2 bg-error/10 border-l-2 border-error rounded text-xs text-error font-medium">{sc}</div>)}
                                <div className="text-xs text-text-secondary">
                                    Available pull: <span className="font-mono text-text-primary">{drive.availableN.toFixed(0)} N cont ({(drive.availableN / LBF_TO_N).toFixed(1)} lbf)</span>
                                    <span className="font-mono text-text-muted"> · {drive.peakN.toFixed(0)} N peak</span>
                                    {drive.pdMm !== null && <span className="font-mono text-text-muted"> · PD {(drive.pdMm / 25.4).toFixed(2)}&quot;</span>}
                                    {thermal !== 1 && <span className="font-mono text-text-muted"> · cool-adj ×{thermal.toFixed(2)}</span>}
                                    {drive.rpm !== null && (
                                        <span className="ml-2">· RPM: <span className={`font-mono ${drive.maxRpm !== null && drive.rpm > drive.maxRpm ? 'text-error' : 'text-text-primary'}`}>{drive.rpm.toFixed(0)}</span>
                                            {drive.maxRpm !== null && <span className="text-text-muted font-mono"> / {drive.maxRpm} max</span>}</span>
                                    )}
                                </div>
                                {drive.maxRpm !== null && drive.rpm !== null && drive.rpm > drive.maxRpm && <div className="text-xs text-error">Required RPM exceeds the motor&apos;s rating — belt speed unreachable with this drive.</div>}
                                {drive.pdMm !== null && (
                                    <div className="text-xs font-mono text-text-secondary">
                                        Torque floors @ PD radius: continuous ≥ {(contFloor * (drive.pdMm / 25.4 / 2) * LB_IN_TO_NM).toFixed(2)} Nm<span className="text-text-muted"> · </span>peak ≥ {(peakFloor * (drive.pdMm / 25.4 / 2) * LB_IN_TO_NM).toFixed(2)} Nm
                                    </div>
                                )}
                                <table className="w-full text-xs">
                                    <thead><tr className="text-text-muted border-b border-border">
                                        <th className="py-1 text-left">Scenario</th><th className="py-1 text-right">Cont floor (lbf)</th><th className="py-1 text-right">Cont util</th>
                                        {thermal !== 1 && <th className="py-1 text-right">Cool-adj</th>}<th className="py-1 text-right">Peak util</th>
                                    </tr></thead>
                                    <tbody>
                                        {scenarioRows.map((row) => {
                                            const contFloorN = row.cont * LBF_TO_N; const peakFloorN = row.peak * LBF_TO_N
                                            const util = (contFloorN / drive.availableN) * 100; const utilAdj = (contFloorN / (drive.availableN * thermal)) * 100; const peakUtil = (peakFloorN / drive.peakN) * 100
                                            return (
                                                <tr key={row.id} className="border-b border-border/50 font-mono">
                                                    <td className="py-1 text-text-primary font-sans">{row.label}</td>
                                                    <td className="py-1 text-right text-text-secondary">{row.cont.toFixed(1)}</td>
                                                    <td className={`py-1 text-right font-semibold ${utilizationCls(util)}`}>{util.toFixed(0)}%</td>
                                                    {thermal !== 1 && <td className={`py-1 text-right ${utilizationCls(utilAdj)}`}>{utilAdj.toFixed(0)}%</td>}
                                                    <td className={`py-1 text-right ${utilizationCls(peakUtil)}`}>{peakUtil.toFixed(0)}%</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                                <div className="text-[10px] text-text-muted">
                                    Verdicts run on Central × scenario × SF{s.serviceFactor ? ` ${s.serviceFactor}` : ''}; peak floor = {s.breakawayFactor}× continuous. Green &lt;60% · yellow 60–85% · red &gt;85%. Size 3+ turns to Degraded, 1–2 turns to Worn.
                                </div>
                            </div>
                        )}
                    </div>
                </details>

                <button onClick={sendShaft} disabled={!canSendShaft} className={sendBtnCls}>
                    Send to Drive Shaft <ArrowRight className="w-3.5 h-3.5" />
                    {canSendShaft && <span className="font-mono">{fmtNum(runningPull)} lbf · {fmtNum(contFloor * (pdIn! / 2))} lb·in · {s.width}″</span>}
                </button>
            </div>
        </div>
    )
}
