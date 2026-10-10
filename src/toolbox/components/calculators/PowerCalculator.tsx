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
        <div className="bg-surface-card border border-border rounded-xl">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text-strong">Power Requirements</h3>
                <div className="flex items-center gap-2">
                    <CalcPinButton toolId="power" instanceId={instanceId} />
                    {powerEquipment.length > 0 && (
                        <button onClick={clearPowerEquipment} className="text-xs text-text-dim hover:text-text-strong transition-colors">Clear All</button>
                    )}
                </div>
            </div>

            <div className="p-4 space-y-4">
                {/* Add equipment form */}
                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2">
                            <label className="block text-xs text-text-body uppercase mb-1 tracking-wider">Equipment Label</label>
                            <input type="text" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Motor, PLC, HMI"
                                className="w-full px-3 py-2 bg-surface-page border border-border rounded-lg text-text-strong text-sm focus:outline-none focus:border-accent-text" />
                        </div>
                        <div>
                            <label className="block text-xs text-text-body uppercase mb-1 tracking-wider">Power Draw (W)</label>
                            <input type="number" value={watts} onChange={(e) => setWatts(e.target.value)} placeholder="0" min="0" step="any"
                                className="w-full px-3 py-2 bg-surface-page border border-border rounded-lg text-text-strong font-mono text-sm focus:outline-none focus:border-accent-text" />
                        </div>
                        <div>
                            <label className="block text-xs text-text-body uppercase mb-1 tracking-wider">Qty</label>
                            <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="1" min="1" step="1"
                                className="w-full px-3 py-2 bg-surface-page border border-border rounded-lg text-text-strong font-mono text-sm focus:outline-none focus:border-accent-text" />
                        </div>
                    </div>

                    {/* AC/DC toggle */}
                    <div className="flex gap-2">
                        {(['ac', 'dc'] as const).map((t) => (
                            <button key={t} onClick={() => setEqType(t)}
                                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                                    eqType === t ? 'border-accent-text bg-accent-text/10 text-accent-text' : 'border-border bg-surface-page text-text-body hover:border-accent-text/40'
                                }`}>
                                {t.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    {/* AC options */}
                    {eqType === 'ac' && (
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs text-text-dim mb-1">AC Voltage</label>
                                <select value={eqVoltage} onChange={(e) => setEqVoltage(Number(e.target.value))}
                                    className="w-full px-2 py-2 bg-surface-page border border-border rounded-lg text-text-strong text-sm focus:outline-none focus:border-accent-text">
                                    {acVoltages.map((v: any) => <option key={v.value} value={v.value}>{v.label}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-text-dim mb-1">Phase</label>
                                <div className="flex gap-2">
                                    {[1, 3].map((p) => (
                                        <button key={p} onClick={() => setEqPhase(p)}
                                            className={`flex-1 px-2 py-2 rounded-lg text-xs font-medium border transition-colors ${
                                                eqPhase === p ? 'border-accent-text bg-accent-text/10 text-accent-text' : 'border-border bg-surface-page text-text-body'
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
                                <label className="block text-xs text-text-dim mb-1">DC Voltage</label>
                                <select value={dcVoltage} onChange={(e) => setDcVoltage(Number(e.target.value))}
                                    className="w-full px-2 py-2 bg-surface-page border border-border rounded-lg text-text-strong text-sm focus:outline-none focus:border-accent-text">
                                    {dcVoltages.map((v: any) => <option key={v.value} value={v.value}>{v.label}</option>)}
                                </select>
                            </div>
                            <div className="text-xs text-text-body bg-warning/10 border-l-2 border-warning rounded px-3 py-2">
                                DC loads require AC-DC power supply. ~15% efficiency loss is added automatically.
                            </div>
                        </div>
                    )}

                    <button onClick={handleAdd}
                        className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-accent-text/10 border border-accent-text/30 rounded-lg text-accent-text text-sm hover:bg-accent-text/20 transition-colors">
                        <Plus className="w-3.5 h-3.5" /> Add Equipment
                    </button>
                </div>

                {/* Equipment list */}
                {powerEquipment.length > 0 && (
                    <div className="border-t border-border pt-4 space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-text-body uppercase tracking-wider">Equipment List</span>
                            <span className="text-xs text-text-dim">{powerEquipment.length} items</span>
                        </div>
                        {powerEquipment.map((eq) => {
                            const voltDisplay = eq.type === 'ac'
                                ? `${eq.voltage}V ${eq.phase === 3 ? '3\u03A6' : '1\u03A6'} AC`
                                : `${eq.voltage}V DC`
                            const total = eq.watts * eq.quantity
                            return (
                                <div key={eq.id} className="flex items-center justify-between bg-surface-page rounded-lg px-3 py-2">
                                    <div className="flex-1 min-w-0 cursor-pointer" onClick={() => openEdit(eq)}>
                                        <div className="text-sm text-text-strong">{eq.label}</div>
                                        <div className="text-xs text-text-dim font-mono">
                                            {eq.quantity > 1 ? `${eq.quantity}x ` : ''}{eq.watts.toLocaleString()}W{eq.quantity > 1 ? ` = ${total.toLocaleString()}W` : ''} @ {voltDisplay}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 ml-2">
                                        <button onClick={() => openEdit(eq)} className="p-1 text-text-dim hover:text-accent-text transition-colors">
                                            <Pencil className="w-3 h-3" />
                                        </button>
                                        <button onClick={() => removePowerEquipment(eq.id)} className="p-1 text-text-dim hover:text-error transition-colors">
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
                                    <span className="text-text-dim">AC Subtotal:</span>
                                    <span className="font-mono text-text-body">{results.totalAcWatts.toLocaleString()} W</span>
                                </div>
                                <div className="flex justify-between px-2 py-1">
                                    <span className="text-text-dim">DC Subtotal:</span>
                                    <span className="font-mono text-text-body">{results.totalDcWatts.toLocaleString()} W</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Supply config */}
                {powerEquipment.length > 0 && (
                    <div className="border-t border-border pt-4 space-y-3">
                        <span className="text-xs text-text-body uppercase tracking-wider">Supply Configuration</span>
                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className="block text-xs text-text-dim mb-1">Supply Voltage</label>
                                <select value={supplyVoltage} onChange={(e) => setSupplyVoltage(Number(e.target.value))}
                                    className="w-full px-2 py-2 bg-surface-page border border-border rounded-lg text-text-strong text-sm focus:outline-none focus:border-accent-text">
                                    {supplyVoltages.map((v: any) => <option key={v.value} value={v.value}>{v.label}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-text-dim mb-1">Phase</label>
                                <div className="flex gap-1">
                                    {[1, 3].map((p) => (
                                        <button key={p} onClick={() => setSupplyPhase(p)}
                                            className={`flex-1 px-2 py-2 rounded-lg text-xs font-medium border transition-colors ${
                                                supplyPhase === p ? 'border-accent-text bg-accent-text/10 text-accent-text' : 'border-border bg-surface-page text-text-body'
                                            }`}>
                                            {p === 1 ? '1\u03A6' : '3\u03A6'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs text-text-dim mb-1">Standard</label>
                                <div className="flex gap-1">
                                    {(['nec', 'iec'] as const).map((s) => (
                                        <button key={s} onClick={() => setStandard(s)}
                                            className={`flex-1 px-2 py-2 rounded-lg text-xs font-medium border transition-colors ${
                                                standard === s ? 'border-accent-text bg-accent-text/10 text-accent-text' : 'border-border bg-surface-page text-text-body'
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
                    <div className="border-t border-border pt-4">
                        {/* Totals are a readout: navy deep in both themes, tiles on it */}
                        <div className="readout rounded-lg border border-border px-3 py-3 space-y-3">
                            <span className="text-xs text-text-body uppercase tracking-wider">Calculated Results</span>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-surface-card rounded-lg px-3 py-2">
                                    <div className="text-xs text-text-dim uppercase">Total AC Power</div>
                                    <div className="font-mono font-semibold text-text-strong">{results.totalAcWatts.toLocaleString()} W</div>
                                </div>
                                <div className="bg-surface-card rounded-lg px-3 py-2">
                                    <div className="text-xs text-text-dim uppercase">Total DC Power</div>
                                    <div className="font-mono font-semibold text-text-strong">{results.totalDcWatts.toLocaleString()} W</div>
                                </div>
                                <div className="bg-surface-card rounded-lg px-3 py-2">
                                    <div className="text-xs text-text-dim uppercase">Converter Overhead</div>
                                    <div className="font-mono font-semibold text-text-body">
                                        {results.converterOverhead > 0 ? `+${Math.round(results.converterOverhead).toLocaleString()}` : '0'} W
                                    </div>
                                </div>
                                <div className="bg-accent-text/5 border border-accent-text/20 rounded-lg px-3 py-2">
                                    <div className="text-xs text-text-dim uppercase">Combined Total</div>
                                    <div className="font-mono font-semibold text-accent-text">{Math.round(results.combinedTotal).toLocaleString()} W</div>
                                </div>
                                <div className="bg-surface-card rounded-lg px-3 py-2">
                                    <div className="text-xs text-text-dim uppercase">Supply Amps</div>
                                    <div className="font-mono font-semibold text-text-strong">{results.supplyAmps.toFixed(1)} A</div>
                                </div>
                                <div className="bg-surface-card rounded-lg px-3 py-2">
                                    <div className="text-xs text-text-dim uppercase">Breaker Size</div>
                                    <div className="font-mono font-semibold text-accent-text">{results.breakerSize ? `${results.breakerSize} A` : '-'}</div>
                                </div>
                                <div className="col-span-2 bg-surface-card rounded-lg px-3 py-2">
                                    <div className="text-xs text-text-dim uppercase">Recommended Wire</div>
                                    <div className="font-mono font-semibold text-accent-text">
                                        {results.wireRec ? `${results.wireRec.description} (${results.wireRec.insulation})` : '-'}
                                    </div>
                                </div>
                            </div>
                            <div className="text-xs text-text-dim bg-surface-card rounded px-3 py-2">
                                Breaker sized at 125% continuous load per NEC/IEC. Wire gauge based on THHN/THWN-2 at 75°C. Always verify with a licensed electrician.
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Edit modal */}
            {editingId && (
                <div className="fixed inset-0 bg-brand-navy-band/70 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setEditingId(null)}>
                    <div className="bg-surface-card border border-border rounded-xl p-4 w-80 space-y-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-semibold text-text-strong">Edit Equipment</h4>
                            <button onClick={() => setEditingId(null)} className="text-text-dim hover:text-text-strong">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div>
                            <label className="block text-xs text-text-dim mb-1">Label</label>
                            <input type="text" value={editLabel} onChange={(e) => setEditLabel(e.target.value)}
                                className="w-full px-3 py-2 bg-surface-page border border-border rounded-lg text-text-strong text-sm focus:outline-none focus:border-accent-text"
                                onKeyDown={(e) => e.key === 'Enter' && saveEdit()} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs text-text-dim mb-1">Power (W)</label>
                                <input type="number" value={editWatts} onChange={(e) => setEditWatts(e.target.value)} min="0" step="any"
                                    className="w-full px-3 py-2 bg-surface-page border border-border rounded-lg text-text-strong font-mono text-sm focus:outline-none focus:border-accent-text"
                                    onKeyDown={(e) => e.key === 'Enter' && saveEdit()} />
                            </div>
                            <div>
                                <label className="block text-xs text-text-dim mb-1">Quantity</label>
                                <input type="number" value={editQty} onChange={(e) => setEditQty(e.target.value)} min="1" step="1"
                                    className="w-full px-3 py-2 bg-surface-page border border-border rounded-lg text-text-strong font-mono text-sm focus:outline-none focus:border-accent-text"
                                    onKeyDown={(e) => e.key === 'Enter' && saveEdit()} />
                            </div>
                        </div>
                        <div className="flex gap-2 pt-1">
                            <button onClick={() => setEditingId(null)} className="flex-1 px-3 py-2 border border-border rounded-lg text-text-body text-sm hover:border-accent-text/40 transition-colors">
                                Cancel
                            </button>
                            <button onClick={saveEdit} className="flex-1 px-3 py-2 bg-accent-text/10 border border-accent-text/30 rounded-lg text-accent-text text-sm hover:bg-accent-text/20 transition-colors">
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
