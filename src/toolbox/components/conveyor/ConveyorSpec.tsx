import { useState, useMemo } from 'react'
import { ArrowRight } from 'lucide-react'
import { conveyorTypes, solveIncline, solveLType, solveZType, calculateLoading, formatNumber } from '@/toolbox/data/conveyorSpecData'
import { PinButton } from '@/toolbox/components/ui/PinButton'
import { showToast } from '@/toolbox/components/ui/Toast'
import { useAppStore } from '@/toolbox/stores/appStore'
import { parseLoadDefinition, describeLoad } from '@/toolbox/lib/calculators/loadDefinition'
import { PLAIN_BELT_MAX_INCLINE_DEG, type PathSection } from '@/toolbox/lib/calculators/beltPull'

type ConveyorType = 'straight' | 'incline' | 'lType' | 'zType'

/** Angle annotations for incline conveyors carrying packages */
function getAngleAnnotation(angleDeg: number): { text: string; status: 'success' | 'warning' | 'error' } {
    if (angleDeg <= 10) return { text: 'Safe for most products — cartons, trays, and packages will convey reliably at this angle.', status: 'success' }
    if (angleDeg <= 18) return { text: 'Moderate incline — smooth or slippery products may slide. Consider cleated belt or textured surface.', status: 'success' }
    if (angleDeg <= 30) return { text: 'Steep incline — cleated belt strongly recommended. Smooth products will slide without retention.', status: 'warning' }
    if (angleDeg <= 45) return { text: 'Very steep — requires cleats, sidewalls, or bucket elevator design. Standard belt will not hold product.', status: 'warning' }
    return { text: 'Extreme angle — consider vertical lift, bucket elevator, or spiral conveyor instead of belt.', status: 'error' }
}

/** Loading annotations */
function getLoadingAnnotation(totalWeightLbs: number, lengthFt: number): string {
    const linearLoad = totalWeightLbs / lengthFt
    if (linearLoad < 5) return 'Very light loading — most standard belt conveyors will handle this easily.'
    if (linearLoad < 20) return 'Light to moderate loading — suitable for standard-duty conveyor frames and motors.'
    if (linearLoad < 50) return 'Moderate loading — verify belt rating and motor sizing. Consider medium-duty frame.'
    if (linearLoad < 100) return 'Heavy loading — heavy-duty frame, oversized motor, and reinforced belt recommended.'
    return 'Very heavy loading — engineering review recommended. May need roller conveyor or heavy-duty slider bed.'
}

/** Inline SVG conveyor profile diagram */
function ConveyorDiagram({ type, geo, isMetric, lengthLabel }: {
    type: ConveyorType
    geo: any
    isMetric: boolean
    lengthLabel: string
}) {
    const w = 280
    const h = 90
    const pad = 20
    const drawW = w - pad * 2
    const drawH = h - pad * 2

    // Calculate scaling based on conveyor geometry
    const totalFloor = geo.totalFloorLength ?? geo.floorLength ?? 1
    const totalHeight = Math.abs(geo.heightDiff ?? 0)
    const maxDim = Math.max(totalFloor, totalHeight || 1)
    const scaleX = drawW / maxDim
    const scaleY = totalHeight > 0 ? drawH / maxDim : drawH

    const baseY = h - pad
    const displayVal = (ftVal: number) => {
        const v = isMetric ? ftVal * 0.3048 : ftVal
        return v.toFixed(1)
    }

    if (type === 'straight') {
        const len = (geo.floorLength ?? 0) * scaleX
        return (
            <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ maxHeight: '100px' }}>
                <line x1={pad} y1={baseY} x2={pad + len} y2={baseY} stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
                <circle cx={pad} cy={baseY} r="3" fill="#3b82f6" />
                <circle cx={pad + len} cy={baseY} r="3" fill="#3b82f6" />
                <text x={pad + len / 2} y={baseY - 8} fill="#93a3b8" fontSize="9" textAnchor="middle">
                    {displayVal(geo.floorLength)} {lengthLabel}
                </text>
            </svg>
        )
    }

    if (type === 'incline') {
        const floorLen = (geo.floorLength ?? 0) * scaleX
        const heightPx = totalHeight * scaleY
        return (
            <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ maxHeight: '100px' }}>
                {/* Floor reference */}
                <line x1={pad} y1={baseY} x2={pad + floorLen} y2={baseY} stroke="#4a5568" strokeWidth="1" strokeDasharray="3,3" />
                {/* Incline */}
                <line x1={pad} y1={baseY} x2={pad + floorLen} y2={baseY - heightPx} stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
                <circle cx={pad} cy={baseY} r="3" fill="#3b82f6" />
                <circle cx={pad + floorLen} cy={baseY - heightPx} r="3" fill="#3b82f6" />
                {/* Height line */}
                <line x1={pad + floorLen} y1={baseY} x2={pad + floorLen} y2={baseY - heightPx} stroke="#eab308" strokeWidth="1" strokeDasharray="3,3" />
                {/* Labels */}
                <text x={pad + floorLen / 2} y={baseY + 12} fill="#93a3b8" fontSize="8" textAnchor="middle">
                    {displayVal(geo.floorLength)} {lengthLabel}
                </text>
                <text x={pad + floorLen + 8} y={baseY - heightPx / 2} fill="#eab308" fontSize="8" textAnchor="start">
                    {displayVal(Math.abs(geo.heightDiff))} {lengthLabel}
                </text>
                <text x={pad + 10} y={baseY - 6} fill="#60a5fa" fontSize="8">
                    {geo.angle?.toFixed(1)}°
                </text>
            </svg>
        )
    }

    if (type === 'lType') {
        const infeed = (geo.infeedX ?? 0) * scaleX
        const incFloor = (geo.inclineFloorLength ?? geo.floorLength ?? 0) * scaleX
        const heightPx = totalHeight * scaleY
        return (
            <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ maxHeight: '100px' }}>
                {/* Infeed horizontal */}
                <line x1={pad} y1={baseY} x2={pad + infeed} y2={baseY} stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
                {/* Incline */}
                <line x1={pad + infeed} y1={baseY} x2={pad + infeed + incFloor} y2={baseY - heightPx} stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
                <circle cx={pad} cy={baseY} r="3" fill="#3b82f6" />
                <circle cx={pad + infeed + incFloor} cy={baseY - heightPx} r="3" fill="#3b82f6" />
                {/* Transition point */}
                <circle cx={pad + infeed} cy={baseY} r="3" fill="#eab308" />
            </svg>
        )
    }

    // zType
    const infeed = (geo.infeedX ?? 0) * scaleX
    const incFloor = (geo.inclineFloorLength ?? geo.floorLength ?? 0) * scaleX
    const discharge = (geo.dischargeX ?? 0) * scaleX
    const heightPx = totalHeight * scaleY
    return (
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ maxHeight: '100px' }}>
            {/* Infeed */}
            <line x1={pad} y1={baseY} x2={pad + infeed} y2={baseY} stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
            {/* Incline */}
            <line x1={pad + infeed} y1={baseY} x2={pad + infeed + incFloor} y2={baseY - heightPx} stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
            {/* Discharge */}
            <line x1={pad + infeed + incFloor} y1={baseY - heightPx} x2={pad + infeed + incFloor + discharge} y2={baseY - heightPx} stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
            <circle cx={pad} cy={baseY} r="3" fill="#3b82f6" />
            <circle cx={pad + infeed + incFloor + discharge} cy={baseY - heightPx} r="3" fill="#3b82f6" />
            <circle cx={pad + infeed} cy={baseY} r="3" fill="#eab308" />
            <circle cx={pad + infeed + incFloor} cy={baseY - heightPx} r="3" fill="#eab308" />
        </svg>
    )
}

/** Step header component */
function StepHeader({ step, label, status }: { step: number; label: string; status: 'pending' | 'active' | 'complete' | 'skipped' }) {
    const styles = {
        pending: 'bg-dark-900 text-text-muted border-border',
        active: 'bg-primary/10 text-primary border-primary/30',
        complete: 'bg-success/10 text-success border-success/30',
        skipped: 'bg-dark-900 text-text-muted border-border opacity-70',
    }
    const icons = { pending: '○', active: '←', complete: '✓', skipped: '–' }

    return (
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium ${styles[status]}`}>
            <span className="font-mono">{icons[status]}</span>
            <span>Step {step}: {label}</span>
        </div>
    )
}

const inputClass = 'w-full px-2 py-2 bg-dark-900 border border-border rounded-lg text-text-primary font-mono text-sm focus:outline-none focus:border-primary'
const labelCls = 'block text-xs text-text-muted mb-1'

export function ConveyorSpec() {
    const pinned = useAppStore((s) => s.pinnedCalculators.includes('conveyorSpec'))
    const togglePin = useAppStore((s) => s.togglePinCalculator)
    const loadJson = useAppStore((s) => s.loadDefinition)
    const sendToBeltPull = useAppStore((s) => s.sendToBeltPull)
    const load = useMemo(() => parseLoadDefinition(loadJson), [loadJson])

    const [isMetric, setIsMetric] = useState(false)
    const [conveyorType, setConveyorType] = useState<ConveyorType>('straight')

    const [floorLength, setFloorLength] = useState('')
    const [heightDiff, setHeightDiff] = useState('')
    const [angle, setAngle] = useState('')
    const [actualLength, setActualLength] = useState('')
    const [infeedX, setInfeedX] = useState('')
    const [dischargeX, setDischargeX] = useState('')

    // Manual package loading (used when no Belt Load definition exists)
    const [productWeight, setProductWeight] = useState('')
    const [productLength, setProductLength] = useState('')
    const [productSpacing, setProductSpacing] = useState('')


    const lengthLabel = isMetric ? 'm' : 'ft'
    const smallLengthLabel = isMetric ? 'mm' : 'in'
    const weightLabel = isMetric ? 'kg' : 'lbs'

    const toFt = (val: string) => { const n = parseFloat(val); if (isNaN(n)) return null; return isMetric ? n / 0.3048 : n }
    const toIn = (val: string) => { const n = parseFloat(val); if (isNaN(n)) return null; return isMetric ? n / 25.4 : n }
    const toLbs = (val: string) => { const n = parseFloat(val); if (isNaN(n)) return null; return isMetric ? n / 0.453592 : n }
    const displayFt = (val: number | null) => { if (val == null) return '-'; return (isMetric ? val * 0.3048 : val).toFixed(2) }
    const displayLbs = (val: number | null | undefined) => { if (val == null) return '-'; return formatNumber(isMetric ? val * 0.453592 : val) }
    // Per-length load: lbs/ft -> kg/m needs both lbs->kg (x0.453592) and /ft -> /m (÷0.3048)
    const displayLoadPerLen = (val: number | null | undefined) => { if (val == null) return '-'; return formatNumber(isMetric ? val * 0.453592 / 0.3048 : val) }

    const geometry = useMemo(() => {
        if (conveyorType === 'straight') {
            const fl = toFt(floorLength)
            if (!fl) return null
            return { floorLength: fl, actualLength: fl, heightDiff: 0, angle: 0, solved: true }
        }
        if (conveyorType === 'incline') {
            return solveIncline({ floorLength: toFt(floorLength), heightDiff: toFt(heightDiff), angle: parseFloat(angle) || null, actualLength: toFt(actualLength) })
        }
        if (conveyorType === 'lType') {
            return solveLType({ infeedX: toFt(infeedX), inclineFloorLength: toFt(floorLength), heightDiff: toFt(heightDiff), angle: parseFloat(angle) || null, inclineActualLength: toFt(actualLength) })
        }
        if (conveyorType === 'zType') {
            return solveZType({ infeedX: toFt(infeedX), dischargeX: toFt(dischargeX), inclineFloorLength: toFt(floorLength), heightDiff: toFt(heightDiff), angle: parseFloat(angle) || null, inclineActualLength: toFt(actualLength) })
        }
        return null
    }, [conveyorType, floorLength, heightDiff, angle, actualLength, infeedX, dischargeX, isMetric])

    const geo = geometry as any
    const geoSolved = geo?.solved === true
    const angleDeg: number = geoSolved && conveyorType !== 'straight' ? Math.abs(geo.angle ?? 0) : 0
    /** Incline belt length (ft) — the run the pockets live on */
    const inclineLengthFt: number | null = geoSolved && conveyorType !== 'straight'
        ? (geo.inclineActualLength ?? geo.actualLength ?? null)
        : null
    const totalActualFt: number | null = geoSolved ? (geo.totalActualLength ?? geo.actualLength ?? null) : null

    // Manual loading (packages, no Belt Load definition)
    const loading = useMemo(() => {
        if (!totalActualFt) return null
        const pw = toLbs(productWeight)
        const pl = toIn(productLength)
        const ps = toIn(productSpacing)
        if (!pl) return null
        return calculateLoading({ actualLength: totalActualFt, productWeight: pw || 0, productLength: pl / 12, productSpacing: (ps || 0) / 12 })
    }, [totalActualFt, productWeight, productLength, productSpacing, isMetric])
    const hasManualLoading = !!(loading && !loading.error)

    // Plain-belt limit for the angle advice (the flight solver itself lives on the Belt Pull incline section)
    const productType = load?.productType ?? 'packages'
    const plainLimit = PLAIN_BELT_MAX_INCLINE_DEG[productType]
    const pastPlainLimit = angleDeg > plainLimit

    // ── Send the solved path (and the product) to Belt Pull ──
    const sendPath = () => {
        if (!geoSolved) return
        const inch = (ft: number | null | undefined) => Math.round(((ft ?? 0) * 12) * 100) / 100
        const sections: PathSection[] = []
        let infeedStraightIn = 0
        if (conveyorType === 'straight') {
            infeedStraightIn = inch(geo.floorLength)
        } else {
            infeedStraightIn = conveyorType === 'incline' ? 0 : inch(geo.infeedX)
            sections.push({
                kind: 'incline',
                lengthIn: inch(inclineLengthFt),
                riseIn: inch(geo.heightDiff),
            })
            if (conveyorType === 'zType') sections.push({ kind: 'straight', lengthIn: inch(geo.dischargeX) })
        }
        const patch: Record<string, unknown> = {
            infeedStraightIn,
            sections,
            infeedHeightIn: 0,
            outfeedHeightIn: conveyorType === 'straight' ? 0 : inch(geo.heightDiff),
        }
        if (load) {
            patch.productType = load.productType
            patch.loadMode = 'rate'
            patch.throughputLbHr = load.throughputLbHr
            if (load.beltSpeedFpm) patch.beltSpeedFpm = load.beltSpeedFpm
            if (load.looseDensityLbFt3) patch.bulkDensityLbFt3 = load.looseDensityLbFt3
            if (load.reposeDeg) patch.reposeDeg = load.reposeDeg
            if (load.bedDepthIn) patch.bedDepthIn = load.bedDepthIn
            if (load.edgeMarginIn !== null) patch.edgeMarginIn = load.edgeMarginIn
            if (load.beltWidthIn) patch.beltWidthIn = load.beltWidthIn
        } else if (hasManualLoading && loading) {
            patch.productType = 'packages'
            patch.loadMode = 'direct'
            patch.directLoadLbf = loading.totalProductWeight
        }
        sendToBeltPull(patch)
        showToast(`Sent to Belt Pull — ${conveyorType === 'straight' ? 'straight' : conveyorType === 'incline' ? 'incline' : conveyorType === 'lType' ? 'L' : 'Z'} path`)
    }

    // Step statuses
    const step1Status = geoSolved ? 'complete' as const : 'active' as const
    const loadReady = !!load || hasManualLoading
    const step2Status = geoSolved ? (loadReady ? 'complete' as const : 'active' as const) : 'pending' as const

    const typeDef = conveyorTypes[conveyorType]

    return (
        <div className="bg-dark-800 border border-border rounded-xl">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text-primary">Incline Conveyor Length &amp; Angle</h3>
                <PinButton pinned={pinned} onToggle={() => togglePin('conveyorSpec')} />
            </div>
            <div className="p-4 space-y-4">
                {/* Unit toggle — converts entered values instead of silently reinterpreting them */}
                <div className="flex gap-2">
                    {[false, true].map((metric) => (
                        <button key={String(metric)} onClick={() => {
                            if (metric === isMetric) return
                            const cvt = (val: string, factor: number) => {
                                const n = parseFloat(val)
                                if (isNaN(n)) return val
                                return String(parseFloat((metric ? n * factor : n / factor).toFixed(4)))
                            }
                            setFloorLength((v) => cvt(v, 0.3048))
                            setHeightDiff((v) => cvt(v, 0.3048))
                            setActualLength((v) => cvt(v, 0.3048))
                            setInfeedX((v) => cvt(v, 0.3048))
                            setDischargeX((v) => cvt(v, 0.3048))
                            setProductLength((v) => cvt(v, 25.4))
                            setProductSpacing((v) => cvt(v, 25.4))
                            setProductWeight((v) => cvt(v, 0.453592))
                            setIsMetric(metric)
                        }}
                            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                                isMetric === metric ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-dark-900 text-text-secondary hover:border-text-muted'
                            }`}>
                            {metric ? 'Metric' : 'Imperial'}
                        </button>
                    ))}
                </div>

                {/* ── STEP 1: GEOMETRY ── */}
                <StepHeader step={1} label="Geometry" status={step1Status} />

                {/* Type selector */}
                <div className="flex flex-wrap gap-1.5">
                    {Object.entries(conveyorTypes).map(([key, ct]: any) => (
                        <button key={key} onClick={() => setConveyorType(key as ConveyorType)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                                conveyorType === key ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-dark-900 text-text-secondary hover:border-text-muted'
                            }`}>
                            {ct.name}
                        </button>
                    ))}
                </div>

                <div className="px-3 py-2 bg-primary/5 border-l-2 border-primary rounded text-xs text-text-secondary">
                    {typeDef.description}
                    {conveyorType !== 'straight' && (
                        <span className="text-text-muted"> — Enter any 2 values to auto-calculate the rest.</span>
                    )}
                </div>

                {/* Geometry inputs */}
                <div className="grid grid-cols-2 gap-3">
                    {(conveyorType === 'lType' || conveyorType === 'zType') && (
                        <div>
                            <label className={labelCls}>Infeed Horizontal ({lengthLabel})</label>
                            <input type="number" value={infeedX} onChange={(e) => setInfeedX(e.target.value)} placeholder="0" min="0" step="any" className={inputClass} />
                        </div>
                    )}
                    {conveyorType !== 'straight' && (
                        <>
                            <div>
                                <label className={labelCls}>
                                    {conveyorType === 'lType' || conveyorType === 'zType' ? 'Incline Floor Length' : 'Floor Length'} ({lengthLabel})
                                </label>
                                <input type="number" value={floorLength} onChange={(e) => setFloorLength(e.target.value)} placeholder="0" min="0" step="any" className={inputClass} />
                            </div>
                            <div>
                                <label className={labelCls}>Height Diff ({lengthLabel})</label>
                                <input type="number" value={heightDiff} onChange={(e) => setHeightDiff(e.target.value)} placeholder="0" step="any" className={inputClass} />
                            </div>
                            <div>
                                <label className={labelCls}>Angle (deg)</label>
                                <input type="number" value={angle} onChange={(e) => setAngle(e.target.value)} placeholder="0" min="0" max="90" step="any" className={inputClass} />
                            </div>
                            <div>
                                <label className={labelCls}>Actual Length ({lengthLabel})</label>
                                <input type="number" value={actualLength} onChange={(e) => setActualLength(e.target.value)} placeholder="0" min="0" step="any" className={inputClass} />
                            </div>
                        </>
                    )}
                    {conveyorType === 'straight' && (
                        <div className="col-span-2">
                            <label className={labelCls}>Conveyor Length ({lengthLabel})</label>
                            <input type="number" value={floorLength} onChange={(e) => setFloorLength(e.target.value)} placeholder="0" min="0" step="any" className={inputClass} />
                        </div>
                    )}
                    {conveyorType === 'zType' && (
                        <div>
                            <label className={labelCls}>Discharge Horizontal ({lengthLabel})</label>
                            <input type="number" value={dischargeX} onChange={(e) => setDischargeX(e.target.value)} placeholder="0" min="0" step="any" className={inputClass} />
                        </div>
                    )}
                </div>

                {/* Geometry error */}
                {geo?.error && (
                    <div className="px-3 py-2 bg-error/10 border border-error/30 rounded-lg text-xs text-error">{geo.error}</div>
                )}

                {/* Geometry results */}
                {geoSolved && (
                    <div className="rounded-lg border border-primary/20 bg-dark-700 overflow-hidden">
                        {/* SVG Diagram */}
                        <div className="px-3 py-2 bg-dark-800">
                            <ConveyorDiagram type={conveyorType} geo={geo} isMetric={isMetric} lengthLabel={lengthLabel} />
                        </div>

                        <div className="p-3">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                {geo.totalFloorLength != null && (
                                    <>
                                        <div className="flex justify-between"><span className="text-text-secondary">Total Floor:</span><span className="font-mono text-text-primary">{displayFt(geo.totalFloorLength)} {lengthLabel}</span></div>
                                        <div className="flex justify-between"><span className="text-text-secondary">Total Actual:</span><span className="font-mono text-text-primary">{displayFt(geo.totalActualLength)} {lengthLabel}</span></div>
                                    </>
                                )}
                                {geo.totalFloorLength == null && (
                                    <>
                                        <div className="flex justify-between"><span className="text-text-secondary">Floor Length:</span><span className="font-mono text-text-primary">{displayFt(geo.floorLength)} {lengthLabel}</span></div>
                                        <div className="flex justify-between"><span className="text-text-secondary">Actual Length:</span><span className="font-mono text-text-primary">{displayFt(geo.actualLength)} {lengthLabel}</span></div>
                                    </>
                                )}
                                <div className="flex justify-between"><span className="text-text-secondary">Height:</span><span className="font-mono text-text-primary">{displayFt(geo.heightDiff)} {lengthLabel}</span></div>
                                <div className="flex justify-between"><span className="text-text-secondary">Angle:</span><span className="font-mono text-text-primary">{geo.angle?.toFixed(1)}°</span></div>
                            </div>

                            {/* Angle annotation: packages get the retention advice; bulk gets the plain-belt limit */}
                            {conveyorType !== 'straight' && angleDeg > 0 && (() => {
                                if (productType === 'bulk') {
                                    const past = pastPlainLimit
                                    return (
                                        <div className={`mt-2 px-3 py-1.5 rounded border-l-2 text-xs bg-dark-800 ${past ? 'text-warning border-warning' : 'text-success border-success'}`}>
                                            {past
                                                ? `${angleDeg.toFixed(1)}° is past the ${plainLimit}° plain-belt limit for loose product — it slides back. Flights turn the bed into pockets — size them on the Belt Pull incline section after sending the path.`
                                                : `${angleDeg.toFixed(1)}° is within the ${plainLimit}° plain-belt limit for loose product — a bed carries without flights. Flights are optional here.`}
                                        </div>
                                    )
                                }
                                const ann = getAngleAnnotation(angleDeg)
                                const colors = { success: 'text-success border-success', warning: 'text-warning border-warning', error: 'text-error border-error' }
                                return (
                                    <div className={`mt-2 px-3 py-1.5 rounded border-l-2 text-xs ${colors[ann.status]} bg-dark-800`}>
                                        {ann.text}
                                    </div>
                                )
                            })()}
                        </div>
                    </div>
                )}

                {/* ── STEP 2: PRODUCT ── */}
                <StepHeader step={2} label="Product Loading" status={step2Status} />

                {!geoSolved ? (
                    <div className="text-xs text-text-muted px-3 py-2">Complete Step 1 geometry to unlock loading.</div>
                ) : load ? (
                    <div className="px-3 py-2 bg-primary/5 border-l-2 border-primary rounded text-xs text-text-secondary">
                        <span className="text-text-muted">From Belt Load: </span>
                        <span className="text-text-primary">{describeLoad(load)}</span>
                        {load.lbPerFt !== null && <span className="font-mono text-primary"> · {load.lbPerFt.toFixed(2)} lb/ft</span>}
                        <div className="text-[10px] text-text-muted mt-0.5">Change it on the Belt Load card; this card and Belt Pull follow.</div>
                    </div>
                ) : (
                    <>
                        <div className="text-[10px] text-text-muted">
                            No product defined on the Belt Load card yet — enter discrete pieces here, or define bulk product there to unlock the flight solver.
                        </div>
                        <div className="grid grid-cols-1 @md:grid-cols-3 gap-3">
                            <div>
                                <label className={labelCls}>Product Length ({smallLengthLabel})</label>
                                <input type="number" value={productLength} onChange={(e) => setProductLength(e.target.value)} placeholder="12" min="0" step="any" className={inputClass} />
                            </div>
                            <div>
                                <label className={labelCls}>Spacing ({smallLengthLabel})</label>
                                <input type="number" value={productSpacing} onChange={(e) => setProductSpacing(e.target.value)} placeholder="6" min="0" step="any" className={inputClass} />
                            </div>
                            <div>
                                <label className={labelCls}>Weight ({weightLabel})</label>
                                <input type="number" value={productWeight} onChange={(e) => setProductWeight(e.target.value)} placeholder="5" min="0" step="any" className={inputClass} />
                            </div>
                        </div>

                        {/* Manual loading results */}
                        {hasManualLoading && loading && (
                            <div className="rounded-lg border border-primary/20 bg-dark-700 p-3 space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-dark-800 rounded-lg px-3 py-3 text-center">
                                        <div className="text-xs text-text-muted">Products on Conveyor</div>
                                        <div className="font-mono text-xl font-semibold text-primary">{loading.productsOnConveyor}</div>
                                    </div>
                                    <div className="bg-dark-800 rounded-lg px-3 py-3 text-center">
                                        <div className="text-xs text-text-muted">Total Load</div>
                                        <div className="font-mono text-xl font-semibold text-primary">{displayLbs(loading.totalProductWeight ?? null)} {weightLabel}</div>
                                    </div>
                                </div>
                                <div className="bg-dark-800 rounded-lg px-3 py-2 text-center">
                                    <div className="text-xs text-text-muted">Belt Loading</div>
                                    <div className="font-mono text-sm text-text-primary">
                                        {displayLoadPerLen(loading.beltLoading ?? null)} {isMetric ? 'kg/m' : 'lbs/ft'}
                                    </div>
                                </div>
                                <div className="px-3 py-1.5 bg-dark-800 rounded border-l-2 border-primary text-xs text-text-secondary">
                                    {getLoadingAnnotation(loading.totalProductWeight ?? 0, totalActualFt ?? 1)}
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* ── STEP 3: HAND OFF ── */}
                {geoSolved && (
                    <button onClick={sendPath}
                        className="w-full px-3 py-2 rounded-lg text-xs border border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center justify-center gap-1.5">
                        Send path {loadReady ? '+ product ' : ''}to Belt Pull <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                )}
            </div>
        </div>
    )
}
