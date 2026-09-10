import { ArrowRight, CheckCircle, AlertTriangle, AlertCircle, X } from 'lucide-react'
import { PinButton } from '@/toolbox/components/ui/PinButton'
import { showToast } from '@/toolbox/components/ui/Toast'
import { useAppStore } from '@/toolbox/stores/appStore'
import { unitTypes } from '@/toolbox/data/conveyorCardTypes'
import { fmtNum, tidy } from '@/toolbox/lib/calculators/lineThroughput'
import { changeSolveFor, patchInfeed, rpmToFpm, SOLVE_LABEL } from '@/toolbox/lib/calculators/infeedCard'
import { jumpToTool } from '@/toolbox/lib/jump'
import { InfeedEditor, useInfeed, flowInputCls, flowUnitCls } from './InfeedEditor'

const labelCls = 'block text-xs text-text-muted mb-1'
const inputCls = 'w-full px-2 py-2 bg-dark-900 border border-border rounded-lg text-text-primary font-mono text-sm focus:outline-none focus:border-primary'
const tileCls = 'bg-dark-800 rounded px-2.5 py-2'
const tileLabelCls = 'text-text-muted uppercase text-[10px]'

const asNum = (v: unknown): number | null => (typeof v === 'number' && Number.isFinite(v) ? v : null)

/**
 * Conveyor Speed & Throughput — the public-facing speed calculator. One card:
 * the shared infeed with a solve-for, the answer big and live, and the
 * handoffs. The downstream chain lives in the Line Flow Simulator.
 */
export function ConveyorSpeed() {
    const pinned = useAppStore((s) => s.pinnedCalculators.includes('conveyorFlow'))
    const togglePin = useAppStore((s) => s.togglePinCalculator)
    const banner = useAppStore((s) => s.infeedBanner)
    const setInfeedBanner = useAppStore((s) => s.setInfeedBanner)
    const sendToBeltPull = useAppStore((s) => s.sendToBeltPull)
    const { head, solveFor, reading: r, patch, setUnit, setCards } = useInfeed()
    if (!head) return null

    const targetUnit = solveFor === 'speed' ? (head.units.productSpeed ?? 'ft/min') : solveFor === 'rate' ? (head.units.productRate ?? '/min') : (head.units.productGap ?? 'in')
    const targetValue = r.display(solveFor)

    // Belt speed from a drive
    const rpm = asNum(head.inputs.rpm)
    const dia = asNum(head.inputs.pulleyDiaIn)
    const rpmFpm = rpm !== null && dia !== null && rpm > 0 && dia > 0 ? rpmToFpm(rpm, dia) : null
    const useRpmSpeed = () => {
        if (rpmFpm === null) return
        let cards = useAppStore.getState().conveyorCards
        if (solveFor === 'speed') cards = changeSolveFor(cards, 'rate')
        setCards(patchInfeed(cards, { productSpeed: Number(rpmFpm.toFixed(2)) }, { productSpeed: 'ft/min' }))
    }

    // Send to Belt Pull needs a package weight for lb/ft
    const canSendPull = r.speedFpm !== null && r.ppm !== null && r.weightLb !== null && r.lbPerFt !== null && r.throughputLbHr !== null
    const sendPull = () => {
        if (!canSendPull) return
        sendToBeltPull({
            productType: 'packages', loadMode: 'rate',
            throughputLbHr: tidy(r.throughputLbHr, 1), beltSpeedFpm: tidy(r.speedFpm, 2),
            productLengthIn: tidy(r.lengthIn, 3), productWeightLb: tidy(r.weightLb, 3),
        })
        showToast(`Sent to Belt Pull — ${fmtNum(r.lbPerFt!)} lb/ft @ ${fmtNum(r.speedFpm!)} ft/min`)
        jumpToTool('conveyor', 'beltPull')
    }

    const feas = r.feasibility
    const lenUnit = head.units.conveyorLength ?? 'ft'

    return (
        <div className="bg-dark-800 border border-border rounded-xl">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text-primary">Conveyor Speed &amp; Throughput</h3>
                <div className="flex items-center gap-2">
                    <PinButton pinned={pinned} onToggle={() => togglePin('conveyorFlow')} />
                    {!r.pristine && (
                        <span className={`flex items-center gap-1 text-xs ${feas === 'ok' ? 'text-success' : feas === 'warning' ? 'text-warning' : 'text-error'}`}>
                            {feas === 'ok' ? <CheckCircle className="w-3.5 h-3.5" /> : feas === 'warning' ? <AlertTriangle className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                            {feas === 'ok' ? 'Feasible' : feas === 'warning' ? 'Warning' : 'Error'}
                        </span>
                    )}
                </div>
            </div>
            <div className="p-4 space-y-4">
                {banner && (
                    <div className="flex items-start gap-2 px-3 py-2 rounded-lg border border-primary/30 bg-primary/10 text-xs text-primary">
                        <span className="flex-1">{banner}</span>
                        <button type="button" onClick={() => setInfeedBanner(null)} className="text-primary/70 hover:text-primary" aria-label="Dismiss">
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>
                )}

                <InfeedEditor />

                {/* The answer, big and live */}
                <div className="rounded-lg border border-primary/20 bg-dark-700 px-3 py-3 space-y-2">
                    <div>
                        <div className={tileLabelCls}>{SOLVE_LABEL[solveFor]}</div>
                        {targetValue !== null ? (
                            <div className="font-mono text-2xl text-primary font-semibold leading-tight">
                                {fmtNum(targetValue)} <span className="text-sm text-text-secondary">{targetUnit}</span>
                            </div>
                        ) : (
                            <div className="text-xs text-text-muted mt-1">
                                {solveFor === 'speed' ? 'Enter the rate and product length (gap is 0 if blank) to get the belt speed.'
                                    : solveFor === 'rate' ? 'Enter belt speed and product length (gap is 0 if blank) to get the rate.'
                                    : 'Enter belt speed, rate, and product length to get the gap that speed leaves.'}
                            </div>
                        )}
                    </div>
                    {!r.pristine && r.ppm !== null && (
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className={tileCls}>
                                <div className={tileLabelCls}>Pitch</div>
                                <div className="font-mono text-sm text-text-primary">{fmtNum(r.pitchIn!)} in <span className="text-text-muted">·</span> {r.productsPerFt !== null ? fmtNum(r.productsPerFt) : '—'}/ft</div>
                            </div>
                            <div className={tileCls}>
                                <div className={tileLabelCls}>Packages</div>
                                <div className="font-mono text-sm text-text-primary">{fmtNum(r.ppm)}/min <span className="text-text-muted">·</span> {fmtNum(r.ppm * 60)}/hr</div>
                            </div>
                            <div className={tileCls}>
                                <div className={tileLabelCls}>Belt speed</div>
                                <div className="font-mono text-sm text-text-primary">{fmtNum(r.speedFpm!)} ft/min</div>
                            </div>
                            <div className={tileCls}>
                                <div className={tileLabelCls}>Gap time</div>
                                <div className="font-mono text-sm text-text-primary">{r.gapTimeS !== null ? `${fmtNum(r.gapTimeS * 1000, 3)} ms` : '—'}</div>
                            </div>
                            {r.transitS !== null && (
                                <div className={tileCls}>
                                    <div className={tileLabelCls}>Transit time</div>
                                    <div className="font-mono text-sm text-text-primary">{fmtNum(r.transitS, 3)} s</div>
                                </div>
                            )}
                            {r.lbPerFt !== null && (
                                <div className={tileCls}>
                                    <div className={tileLabelCls}>Belt load</div>
                                    <div className="font-mono text-sm text-text-primary">{fmtNum(r.lbPerFt)} lb/ft</div>
                                </div>
                            )}
                        </div>
                    )}
                    {r.issues.length > 0 && (
                        <div className="space-y-1">
                            {r.issues.map((issue, i) => (
                                <div key={i} className={`text-xs ${feas === 'error' ? 'text-error' : 'text-warning'}`}>{feas === 'error' ? '✗' : '⚠'} {issue}</div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Optional: transit time */}
                <div>
                    <label className={labelCls}>Conveyor length <span className="text-text-muted">(optional — for transit time)</span></label>
                    <div className="flex">
                        <input type="number" min="0" step="any" value={asNum(head.inputs.conveyorLength) ?? ''} placeholder="e.g. 40"
                            onChange={(e) => patch({ conveyorLength: e.target.value === '' ? null : parseFloat(e.target.value) })} className={flowInputCls} />
                        <select value={lenUnit} onChange={(e) => setUnit('conveyorLength', 'length', e.target.value, 'ft')} className={flowUnitCls} aria-label="Conveyor length unit">
                            {unitTypes.length.units.map((u: string) => <option key={u} value={u}>{u}</option>)}
                        </select>
                    </div>
                </div>

                {/* Belt speed from the drive */}
                <details open={rpm !== null || dia !== null}>
                    <summary className="text-xs text-text-secondary hover:text-text-primary cursor-pointer select-none">Belt speed from drive RPM</summary>
                    <div className="mt-2 grid grid-cols-3 gap-2 items-end">
                        <div>
                            <label className={labelCls}>Drive RPM</label>
                            <input type="number" min="0" step="any" value={rpm ?? ''} placeholder="e.g. 60" className={inputCls}
                                onChange={(e) => patch({ rpm: e.target.value === '' ? null : parseFloat(e.target.value) })} />
                        </div>
                        <div>
                            <label className={labelCls}>Pulley / sprocket PD <span className="text-text-muted">(in)</span></label>
                            <input type="number" min="0" step="any" value={dia ?? ''} placeholder="e.g. 6" className={inputCls}
                                onChange={(e) => patch({ pulleyDiaIn: e.target.value === '' ? null : parseFloat(e.target.value) })} />
                        </div>
                        <button type="button" onClick={useRpmSpeed} disabled={rpmFpm === null}
                            className="px-2 py-2 rounded-lg text-xs border border-border bg-dark-900 text-text-secondary hover:border-primary/40 hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed">
                            {rpmFpm !== null ? `${fmtNum(rpmFpm)} ft/min — use` : 'Use as belt speed'}
                        </button>
                    </div>
                    <div className="text-[10px] text-text-muted mt-1">ft/min = π × pitch diameter × RPM ÷ 12. Using it makes belt speed an input and solves the rate.</div>
                </details>

                {/* Handoff: Belt Pull needs a package weight for lb/ft */}
                <div className="grid grid-cols-[1fr_auto] gap-2 items-end">
                    <div>
                        <label className={labelCls}>Package weight <span className="text-text-muted">(lb — for Belt Pull)</span></label>
                        <div className="flex">
                            <input type="number" min="0" step="any" value={asNum(head.inputs.productWeight) ?? ''} placeholder="per package"
                                onChange={(e) => patch({ productWeight: e.target.value === '' ? null : parseFloat(e.target.value) })} className={flowInputCls} />
                            <select value={head.units.productWeight ?? 'lb'} onChange={(e) => setUnit('productWeight', 'weight', e.target.value)} className={flowUnitCls} aria-label="Package weight unit">
                                {unitTypes.weight.units.map((u: string) => <option key={u} value={u}>{u}</option>)}
                            </select>
                        </div>
                    </div>
                    <button onClick={sendPull} disabled={!canSendPull}
                        className="px-3 py-2 rounded-lg text-xs border transition-colors flex items-center justify-center gap-1.5 border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-primary/10 whitespace-nowrap">
                        Send to Belt Pull <ArrowRight className="w-3.5 h-3.5" />
                        {canSendPull && <span className="font-mono">{fmtNum(r.lbPerFt!)} lb/ft @ {fmtNum(r.speedFpm!)} ft/min</span>}
                    </button>
                </div>

                <a href="#tool-lineFlow" className="block text-xs text-text-secondary hover:text-primary transition-colors">
                    Model a full line with splits, merges, and accumulation →
                </a>
            </div>
        </div>
    )
}
