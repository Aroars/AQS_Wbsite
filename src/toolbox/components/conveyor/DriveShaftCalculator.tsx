import { useMemo } from 'react'
import { X } from 'lucide-react'
import { CalcPinButton } from '@/toolbox/components/ui/CalcPinButton'
import { useAppStore } from '@/toolbox/stores/appStore'
import { useInstanceState, useInstanceInbox, asNumber, MAIN } from '@/toolbox/hooks/useToolState'
import { shaftCheck, shaftMaterials, SQUARE_SHAFT_SIZES_IN, type ShaftShape } from '@/toolbox/lib/calculators/driveShaft'
import { fmtNum } from '@/toolbox/lib/calculators/lineThroughput'
import { BigResult, Tile, Field, UtilBar, panelCls, inputCls, selectCls } from '@/toolbox/components/ui/Results'

interface S { shape: ShaftShape; size: string; material: string; span: string; width: string; load: string; torque: string; pd: string; torqueLength: string; deflLimit: string; twistLimit: string; source: string | null }
const initial: S = { shape: 'square', size: '1.5', material: 'ss304', span: '', width: '', load: '', torque: '', pd: '', torqueLength: '', deflLimit: '0.1', twistLimit: '1', source: null }
const num = (v: string): number => { const n = parseFloat(v); return Number.isFinite(n) ? n : 0 }

/** Modular belt drive shaft: deflection between bearings and twist along the width against limits */
export function DriveShaftCalculator({ instanceId = MAIN }: { instanceId?: string } = {}) {
    const [s, setS] = useInstanceState<S>('driveShaft', instanceId, initial)
    const upd = (patch: Partial<S>) => setS((prev) => ({ ...prev, ...patch }))

    useInstanceInbox('driveShaft', instanceId, (p) => {
        const str = (v: unknown) => (asNumber(v) !== null ? String(Number(asNumber(v)!.toPrecision(5))) : '')
        upd({ load: str(p.loadLbf) || s.load, torque: str(p.torqueLbIn) || s.torque, width: str(p.beltWidthIn) || s.width, pd: str(p.pdIn) || s.pd, source: typeof p.source === 'string' ? p.source : 'Loaded from Torque & Motor' })
    })

    // Torque from pull × PD/2 when a pitch diameter is given and no torque typed
    const torque = num(s.torque) > 0 ? num(s.torque) : (num(s.pd) > 0 ? num(s.load) * num(s.pd) / 2 : 0)
    const r = useMemo(() => shaftCheck({
        shape: s.shape, sizeIn: num(s.size), materialId: s.material, spanIn: num(s.span), loadedWidthIn: num(s.width),
        loadLbf: num(s.load), torqueLbIn: torque, torqueLengthIn: num(s.torqueLength) || null,
        deflectionLimitIn: num(s.deflLimit), twistLimitDeg: num(s.twistLimit),
    }), [s, torque])
    const ok = r && r.warnings.length === 0

    return (
        <div className="bg-dark-800 border border-border rounded-xl">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text-primary">Drive Shaft Deflection &amp; Twist</h3>
                <div className="flex items-center gap-2">
                    {r && <span className={`text-xs font-medium ${ok ? 'text-success' : 'text-error'}`}>{ok ? 'Within limits' : `${r.warnings.length} limit${r.warnings.length > 1 ? 's' : ''} exceeded`}</span>}
                    <CalcPinButton toolId="driveShaft" instanceId={instanceId} />
                </div>
            </div>
            <div className="p-4 space-y-4">
                {s.source && (
                    <div className="flex items-start gap-2 px-3 py-2 rounded-lg border border-primary/30 bg-primary/10 text-xs text-primary">
                        <span className="flex-1">{s.source} — check the shaft, then go up a size or shorten the bearing span if a limit is exceeded.</span>
                        <button type="button" onClick={() => upd({ source: null })} className="text-primary/70 hover:text-primary" aria-label="Dismiss"><X className="w-3.5 h-3.5" /></button>
                    </div>
                )}
                <div className="grid grid-cols-2 @md:grid-cols-3 gap-2">
                    <Field label="Shaft">
                        <div className="flex gap-1">
                            <select value={s.shape} className={selectCls} onChange={(e) => upd({ shape: e.target.value as ShaftShape })}><option value="square">Square</option><option value="round">Round</option></select>
                        </div>
                    </Field>
                    <Field label={s.shape === 'square' ? 'Size across flats' : 'Diameter'} unit="in">
                        <div className="flex gap-1">
                            <input type="number" min="0" step="any" value={s.size} className={inputCls} onChange={(e) => upd({ size: e.target.value })} />
                            {s.shape === 'square' && (
                                <select value="" className="px-1.5 py-2 bg-dark-900 border border-border rounded-lg text-text-secondary text-xs focus:outline-none shrink-0" onChange={(e) => e.target.value && upd({ size: e.target.value })} aria-label="Common sizes">
                                    <option value="">common</option>
                                    {SQUARE_SHAFT_SIZES_IN.map((v) => <option key={v} value={String(Number(v.toFixed(4)))}>{v >= 1.57 && v <= 1.58 ? '40 mm' : v >= 2.36 && v <= 2.37 ? '60 mm' : `${v}"`}</option>)}
                                </select>
                            )}
                        </div>
                    </Field>
                    <Field label="Material"><select value={s.material} className={selectCls} onChange={(e) => upd({ material: e.target.value })}>{shaftMaterials.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}</select></Field>
                    <Field label="Bearing span" unit="in"><input type="number" min="0" step="any" value={s.span} placeholder="bearing to bearing" className={inputCls} onChange={(e) => upd({ span: e.target.value })} /></Field>
                    <Field label="Belt width" unit="in" hint="the pull acts over this width, centered"><input type="number" min="0" step="any" value={s.width} className={inputCls} onChange={(e) => upd({ width: e.target.value })} /></Field>
                    <Field label="Belt pull on the shaft" unit="lbf" hint="tight + slack side; running pull with a catenary take-up"><input type="number" min="0" step="any" value={s.load} className={inputCls} onChange={(e) => upd({ load: e.target.value })} /></Field>
                    <Field label="Drive torque" unit="lb·in" hint={num(s.torque) > 0 ? undefined : (num(s.pd) > 0 ? `= pull × PD ÷ 2 = ${fmtNum(torque)}` : 'or enter a pitch diameter')}><input type="number" min="0" step="any" value={s.torque} placeholder={num(s.pd) > 0 ? fmtNum(torque) : 'lb·in'} className={inputCls} onChange={(e) => upd({ torque: e.target.value })} /></Field>
                    <Field label="Sprocket PD" unit="in, optional"><input type="number" min="0" step="any" value={s.pd} className={inputCls} onChange={(e) => upd({ pd: e.target.value })} /></Field>
                    <Field label="Torqued length" unit="in, optional" hint="driven end to far sprocket; belt width if blank"><input type="number" min="0" step="any" value={s.torqueLength} className={inputCls} onChange={(e) => upd({ torqueLength: e.target.value })} /></Field>
                    <Field label="Deflection limit" unit="in" hint="0.10 in is the usual belt-maker guidance"><input type="number" min="0" step="any" value={s.deflLimit} className={inputCls} onChange={(e) => upd({ deflLimit: e.target.value })} /></Field>
                    <Field label="Twist limit" unit="°" hint="verify against the belt design guide"><input type="number" min="0" step="any" value={s.twistLimit} className={inputCls} onChange={(e) => upd({ twistLimit: e.target.value })} /></Field>
                </div>
                <div className={panelCls}>
                    <div className="grid grid-cols-2 gap-3">
                        <BigResult label="Deflection" value={r ? fmtNum(r.deflectionIn, 3) : null} unit="in" hint="Enter the shaft, bearing span, belt width, and belt pull." />
                        <BigResult label="Twist" value={r ? fmtNum(r.twistDeg, 3) : null} unit="°" hint="Add the drive torque, or a pitch diameter to derive it." />
                    </div>
                    {r && (
                        <>
                            <UtilBar label="Deflection vs limit" pct={r.deflectionUtilPct} detail={`${fmtNum(r.deflectionIn, 3)} / ${r.deflectionLimitIn} in`} />
                            <UtilBar label="Twist vs limit" pct={r.twistUtilPct} detail={`${fmtNum(r.twistDeg, 3)} / ${r.twistLimitDeg}°`} />
                            <UtilBar label="Combined stress vs yield ÷ 2" pct={r.stressUtilPct} detail={`${fmtNum(r.stressUtilPct, 3)}%`} />
                            <div className="grid grid-cols-2 @md:grid-cols-3 gap-2 text-xs">
                                <Tile label="Section">I = {fmtNum(r.section.i, 4)} in⁴ · J = {fmtNum(r.section.jt, 4)} in⁴</Tile>
                                <Tile label="Bending">{fmtNum(r.bendingMomentLbIn)} lb·in · {fmtNum(r.bendingStressPsi / 1000, 3)} ksi</Tile>
                                <Tile label="Torsional shear">{fmtNum(r.torsionalShearPsi / 1000, 3)} ksi at {fmtNum(torque)} lb·in</Tile>
                            </div>
                            {r.warnings.map((w, i) => <div key={i} className="px-2.5 py-2 bg-error/10 border-l-2 border-error rounded text-xs text-error">{w}</div>)}
                        </>
                    )}
                    <div className="text-[10px] text-text-muted">
                        δ = W(8L³ − 4Lw² + w³) ÷ (384EI) for the pull spread over the belt width w on a span L; θ = T·L_t ÷ (G·J). Square: I = a⁴/12, J = 0.1406a⁴. Limits are editable defaults — the belt manufacturer&apos;s design guide governs.
                    </div>
                </div>
            </div>
        </div>
    )
}
