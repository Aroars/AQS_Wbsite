import { useState, useMemo } from 'react'
import { Trash2, Plus, Pencil, X } from 'lucide-react'
import { CalcPinButton } from '@/toolbox/components/ui/CalcPinButton'
import { useInstanceState, MAIN } from '@/toolbox/hooks/useToolState'
import { generateId } from '@/toolbox/lib/utils'
import type { PowerEquipment } from '@/toolbox/lib/types'
import {
    acVoltages, dcVoltages, supplyVoltages, converterEfficiency, continuousLoadFactor,
    defaultPowerFactor, getNextBreakerSize, getWireRecommendation, calculateSupplyAmps,
    calculateDcConverterPower
} from '@/toolbox/data/powerCalcData'

export function PowerCalculator({ instanceId = MAIN }: { instanceId?: string } = {}) {
    const [ps, setPs] = useInstanceState<{ equipment: PowerEquipment[] }>('power', instanceId, { equipment: [] })
    const powerEquipment = ps.equipment
    const addPowerEquipment = (eq: Omit<PowerEquipment, 'id'>) => setPs((c) => ({ equipment: [...c.equipment, { ...eq, id: generateId() }] }))
    const removePowerEquipment = (id: string) => setPs((c) => ({ equipment: c.equipment.filter((e) => e.id !== id) }))
    const updatePowerEquipment = (id: string, updates: Partial<PowerEquipment>) => setPs((c) => ({ equipment: c.equipment.map((e) => (e.id === id ? { ...e, ...updates } : e)) }))
    const clearPowerEquipment = () => setPs({ equipment: [] })

    // Form state
    const [label, setLabel] = useState('')
    const [watts, setWatts] = useState('')
    const [quantity, setQuantity] = useState('1')
    const [eqType, setEqType] = useState<'ac' | 'dc'>('ac')
    const [eqVoltage, setEqVoltage] = useState(240)
    const [eqPhase, setEqPhase] = useState(1)
    const [dcVoltage, setDcVoltage] = useState(24)

    // Supply config
    const [supplyVoltage, setSupplyVoltage] = useState(480)
    const [supplyPhase, setSupplyPhase] = useState(3)
    const [standard, setStandard] = useState<'nec' | 'iec'>('nec')

    // Edit modal
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editLabel, setEditLabel] = useState('')
    const [editWatts, setEditWatts] = useState('')
    const [editQty, setEditQty] = useState('1')

    const handleAdd = () => {
        const w = parseFloat(watts)
        const q = parseInt(quantity)
        if (isNaN(w) || w <= 0 || isNaN(q) || q <= 0) return
        addPowerEquipment({
            label: label.trim() || `Equipment ${powerEquipment.length + 1}`,
            watts: w,
            quantity: q,
            type: eqType,
            voltage: eqType === 'ac' ? eqVoltage : dcVoltage,
            phase: eqType === 'ac' ? eqPhase : undefined,
        })
        setLabel('')
        setWatts('')
        setQuantity('1')
    }

    const openEdit = (eq: typeof powerEquipment[0]) => {
        setEditingId(eq.id)
        setEditLabel(eq.label)
        setEditWatts(String(eq.watts))
        setEditQty(String(eq.quantity))
    }

    const saveEdit = () => {
        if (!editingId) return
        const w = parseFloat(editWatts)
        const q = parseInt(editQty)
        if (isNaN(w) || w < 0 || isNaN(q) || q < 1) return
        updatePowerEquipment(editingId, { label: editLabel.trim(), watts: w, quantity: q })
        setEditingId(null)
    }

    const results = useMemo(() => {
        if (powerEquipment.length === 0) return null

        let totalAcWatts = 0
        let totalDcWatts = 0
        powerEquipment.forEach((eq) => {
            const itemTotal = eq.watts * eq.quantity
            if (eq.type === 'ac') totalAcWatts += itemTotal
            else totalDcWatts += itemTotal
        })

        // DC converter overhead (~15% loss)
        const dcResult = calculateDcConverterPower(totalDcWatts, converterEfficiency.typical)
        const converterOverhead = dcResult.converterLoss

        // Combined total = AC + DC (with converter overhead applied)
        const combinedTotal = totalAcWatts + dcResult.acPowerDraw

        // Calculate supply amps using power factor
        const supplyAmps = calculateSupplyAmps(combinedTotal, supplyVoltage, supplyPhase, defaultPowerFactor)

        // Design amps at 125% continuous load factor
        const designAmps = supplyAmps * continuousLoadFactor

        // Breaker and wire
        const breakerSize = combinedTotal > 0 ? getNextBreakerSize(designAmps, standard === 'nec' ? 'NEC' : 'IEC') : null
        const wireRec = breakerSize ? getWireRecommendation(breakerSize) : null

        return { totalAcWatts, totalDcWatts, converterOverhead, combinedTotal, supplyAmps, breakerSize, wireRec }
    }, [powerEquipment, supplyVoltage, supplyPhase, standard])

    return (
        <div className="bg-dark-800 border border-border rounded-xl">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text-primary">Power Requirements</h3>
                <div className="flex items-center gap-2">
                    <CalcPinButton toolId="power" instanceId={instanceId} />
                    {powerEquipment.length > 0 && (
                        <button onClick={clearPowerEquipment} className="text-xs text-text-muted hover:text-error transition-colors">Clear All</button>
                    )}
                </div>
            </div>

            <div className="p-4 space-y-4">
                {/* Add equipment form */}
                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2">
                            <label className="block text-xs text-text-secondary uppercase mb-1 tracking-wider">Equipment Label</label>
                            <input type="text" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Motor, PLC, HMI"
                                className="w-full px-3 py-2 bg-dark-900 border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-primary" />
                        </div>
                        <div>
                            <label className="block text-xs text-text-secondary uppercase mb-1 tracking-wider">Power Draw (W)</label>
                            <input type="number" value={watts} onChange={(e) => setWatts(e.target.value)} placeholder="0" min="0" step="any"
                                className="w-full px-3 py-2 bg-dark-900 border border-border rounded-lg text-text-primary font-mono text-sm focus:outline-none focus:border-primary" />
                        </div>
                        <div>
                            <label className="block text-xs text-text-secondary uppercase mb-1 tracking-wider">Qty</label>
                            <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="1" min="1" step="1"
                                className="w-full px-3 py-2 bg-dark-900 border border-border rounded-lg text-text-primary font-mono text-sm focus:outline-none focus:border-primary" />
                        </div>
                    </div>

                    {/* AC/DC toggle */}
                    <div className="flex gap-2">
                        {(['ac', 'dc'] as const).map((t) => (
                            <button key={t} onClick={() => setEqType(t)}
                                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                                    eqType === t ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-dark-900 text-text-secondary hover:border-text-muted'
                                }`}>
                                {t.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    {/* AC options */}
                    {eqType === 'ac' && (
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs text-text-muted mb-1">AC Voltage</label>
                                <select value={eqVoltage} onChange={(e) => setEqVoltage(Number(e.target.value))}
                                    className="w-full px-2 py-2 bg-dark-900 border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-primary">
                                    {acVoltages.map((v: any) => <option key={v.value} value={v.value}>{v.label}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-text-muted mb-1">Phase</label>
                                <div className="flex gap-2">
                                    {[1, 3].map((p) => (
                                        <button key={p} onClick={() => setEqPhase(p)}
                                            className={`flex-1 px-2 py-2 rounded-lg text-xs font-medium border transition-colors ${
                                                eqPhase === p ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-dark-900 text-text-secondary'
                                            }`}>
                                            {p === 1 ? '1\u03A6' : '3\u03A6'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* DC options */}
                    {eqType === 'dc' && (
                        <div className="space-y-2">
                            <div>
                                <label className="block text-xs text-text-muted mb-1">DC Voltage</label>
                                <select value={dcVoltage} onChange={(e) => setDcVoltage(Number(e.target.value))}
                                    className="w-full px-2 py-2 bg-dark-900 border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-primary">
                                    {dcVoltages.map((v: any) => <option key={v.value} value={v.value}>{v.label}</option>)}
                                </select>
                            </div>
                            <div className="text-xs text-text-muted bg-warning/5 border border-warning/20 rounded px-3 py-2">
                                DC loads require AC-DC power supply. ~15% efficiency loss is added automatically.
                            </div>
                        </div>
                    )}

                    <button onClick={handleAdd}
                        className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-primary/10 border border-primary/30 rounded-lg text-primary text-sm hover:bg-primary/20 transition-colors">
                        <Plus className="w-3.5 h-3.5" /> Add Equipment
                    </button>
                </div>

                {/* Equipment list */}
                {powerEquipment.length > 0 && (
                    <div className="border-t border-border pt-4 space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-text-secondary uppercase tracking-wider">Equipment List</span>
                            <span className="text-xs text-text-muted">{powerEquipment.length} items</span>
                        </div>
                        {powerEquipment.map((eq) => {
                            const voltDisplay = eq.type === 'ac'
                                ? `${eq.voltage}V ${eq.phase === 3 ? '3\u03A6' : '1\u03A6'} AC`
                                : `${eq.voltage}V DC`
                            const total = eq.watts * eq.quantity
                            return (
                                <div key={eq.id} className="flex items-center justify-between bg-dark-900 rounded-lg px-3 py-2">
                                    <div className="flex-1 min-w-0 cursor-pointer" onClick={() => openEdit(eq)}>
                                        <div className="text-sm text-text-primary">{eq.label}</div>
                                        <div className="text-xs text-text-muted font-mono">
                                            {eq.quantity > 1 ? `${eq.quantity}x ` : ''}{eq.watts.toLocaleString()}W{eq.quantity > 1 ? ` = ${total.toLocaleString()}W` : ''} @ {voltDisplay}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 ml-2">
                                        <button onClick={() => openEdit(eq)} className="p-1 text-text-muted hover:text-primary transition-colors">
                                            <Pencil className="w-3 h-3" />
                                        </button>
                                        <button onClick={() => removePowerEquipment(eq.id)} className="p-1 text-text-muted hover:text-error transition-colors">
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                        {/* Subtotals */}
                        {results && (
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="flex justify-between px-2 py-1">
                                    <span className="text-text-muted">AC Subtotal:</span>
                                    <span className="font-mono text-text-secondary">{results.totalAcWatts.toLocaleString()} W</span>
                                </div>
                                <div className="flex justify-between px-2 py-1">
                                    <span className="text-text-muted">DC Subtotal:</span>
                                    <span className="font-mono text-text-secondary">{results.totalDcWatts.toLocaleString()} W</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Supply config */}
                {powerEquipment.length > 0 && (
                    <div className="border-t border-border pt-4 space-y-3">
                        <span className="text-xs text-text-secondary uppercase tracking-wider">Supply Configuration</span>
                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className="block text-xs text-text-muted mb-1">Supply Voltage</label>
                                <select value={supplyVoltage} onChange={(e) => setSupplyVoltage(Number(e.target.value))}
                                    className="w-full px-2 py-2 bg-dark-900 border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-primary">
                                    {supplyVoltages.map((v: any) => <option key={v.value} value={v.value}>{v.label}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-text-muted mb-1">Phase</label>
                                <div className="flex gap-1">
                                    {[1, 3].map((p) => (
                                        <button key={p} onClick={() => setSupplyPhase(p)}
                                            className={`flex-1 px-2 py-2 rounded-lg text-xs font-medium border transition-colors ${
                                                supplyPhase === p ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-dark-900 text-text-secondary'
                                            }`}>
                                            {p === 1 ? '1\u03A6' : '3\u03A6'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs text-text-muted mb-1">Standard</label>
                                <div className="flex gap-1">
                                    {(['nec', 'iec'] as const).map((s) => (
                                        <button key={s} onClick={() => setStandard(s)}
                                            className={`flex-1 px-2 py-2 rounded-lg text-xs font-medium border transition-colors ${
                                                standard === s ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-dark-900 text-text-secondary'
                                            }`}>
                                            {s.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Results */}
                {results && (
                    <div className="border-t border-border pt-4 space-y-3">
                        <span className="text-xs text-text-secondary uppercase tracking-wider">Calculated Results</span>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-dark-700 rounded-lg px-3 py-2">
                                <div className="text-xs text-text-muted uppercase">Total AC Power</div>
                                <div className="font-mono font-semibold text-text-primary">{results.totalAcWatts.toLocaleString()} W</div>
                            </div>
                            <div className="bg-dark-700 rounded-lg px-3 py-2">
                                <div className="text-xs text-text-muted uppercase">Total DC Power</div>
                                <div className="font-mono font-semibold text-text-primary">{results.totalDcWatts.toLocaleString()} W</div>
                            </div>
                            <div className="bg-dark-700 rounded-lg px-3 py-2">
                                <div className="text-xs text-text-muted uppercase">Converter Overhead</div>
                                <div className="font-mono font-semibold text-text-secondary">
                                    {results.converterOverhead > 0 ? `+${Math.round(results.converterOverhead).toLocaleString()}` : '0'} W
                                </div>
                            </div>
                            <div className="bg-primary/5 border border-primary/20 rounded-lg px-3 py-2">
                                <div className="text-xs text-text-muted uppercase">Combined Total</div>
                                <div className="font-mono font-semibold text-primary">{Math.round(results.combinedTotal).toLocaleString()} W</div>
                            </div>
                            <div className="bg-dark-700 rounded-lg px-3 py-2">
                                <div className="text-xs text-text-muted uppercase">Supply Amps</div>
                                <div className="font-mono font-semibold text-text-primary">{results.supplyAmps.toFixed(1)} A</div>
                            </div>
                            <div className="bg-dark-700 rounded-lg px-3 py-2">
                                <div className="text-xs text-text-muted uppercase">Breaker Size</div>
                                <div className="font-mono font-semibold text-primary">{results.breakerSize ? `${results.breakerSize} A` : '-'}</div>
                            </div>
                            <div className="col-span-2 bg-dark-700 rounded-lg px-3 py-2">
                                <div className="text-xs text-text-muted uppercase">Recommended Wire</div>
                                <div className="font-mono font-semibold text-primary">
                                    {results.wireRec ? `${results.wireRec.description} (${results.wireRec.insulation})` : '-'}
                                </div>
                            </div>
                        </div>
                        <div className="text-xs text-text-muted bg-dark-700 rounded px-3 py-2">
                            Breaker sized at 125% continuous load per NEC/IEC. Wire gauge based on THHN/THWN-2 at 75°C. Always verify with a licensed electrician.
                        </div>
                    </div>
                )}
            </div>

            {/* Edit modal */}
            {editingId && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setEditingId(null)}>
                    <div className="bg-dark-800 border border-border rounded-xl p-4 w-80 space-y-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-semibold text-text-primary">Edit Equipment</h4>
                            <button onClick={() => setEditingId(null)} className="text-text-muted hover:text-text-primary">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div>
                            <label className="block text-xs text-text-muted mb-1">Label</label>
                            <input type="text" value={editLabel} onChange={(e) => setEditLabel(e.target.value)}
                                className="w-full px-3 py-2 bg-dark-900 border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-primary"
                                onKeyDown={(e) => e.key === 'Enter' && saveEdit()} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs text-text-muted mb-1">Power (W)</label>
                                <input type="number" value={editWatts} onChange={(e) => setEditWatts(e.target.value)} min="0" step="any"
                                    className="w-full px-3 py-2 bg-dark-900 border border-border rounded-lg text-text-primary font-mono text-sm focus:outline-none focus:border-primary"
                                    onKeyDown={(e) => e.key === 'Enter' && saveEdit()} />
                            </div>
                            <div>
                                <label className="block text-xs text-text-muted mb-1">Quantity</label>
                                <input type="number" value={editQty} onChange={(e) => setEditQty(e.target.value)} min="1" step="1"
                                    className="w-full px-3 py-2 bg-dark-900 border border-border rounded-lg text-text-primary font-mono text-sm focus:outline-none focus:border-primary"
                                    onKeyDown={(e) => e.key === 'Enter' && saveEdit()} />
                            </div>
                        </div>
                        <div className="flex gap-2 pt-1">
                            <button onClick={() => setEditingId(null)} className="flex-1 px-3 py-2 border border-border rounded-lg text-text-secondary text-sm hover:border-text-muted transition-colors">
                                Cancel
                            </button>
                            <button onClick={saveEdit} className="flex-1 px-3 py-2 bg-primary/10 border border-primary/30 rounded-lg text-primary text-sm hover:bg-primary/20 transition-colors">
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
