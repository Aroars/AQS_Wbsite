import { useState, useMemo, useCallback } from 'react'
import { Plus, Trash2, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react'
import { CalcPinButton } from '@/toolbox/components/ui/CalcPinButton'
import { MAIN } from '@/toolbox/stores/migrate'
import { useAppStore } from '@/toolbox/stores/appStore'
import { cardTypes, unitTypes, createCard, formatValue, fromBase, toBase } from '@/toolbox/data/conveyorCardTypes'
import { recalculateFromCard, getChainFeasibility } from '@/toolbox/lib/calculators/conveyorFlow'
import type { FlowCard } from '@/toolbox/lib/calculators/infeedCard'
import { InfeedEditor, useInfeed } from './InfeedEditor'

/**
 * Line Flow Simulator — the infeed (shared with the Conveyor Speed card) plus
 * any chain of split, merge, process, accumulation, reject, stacking, and
 * batching cards. Every card recalculates the whole chain downstream.
 */
export function LineFlowSimulator({ instanceId = MAIN }: { instanceId?: string } = {}) {
    // The chain lives in the persisted store, keyed by this instance; card objects are the
    // untyped legacy shape from createCard/recalculateFromCard, so downstream cards are read loosely.
    const [showAddMenu, setShowAddMenu] = useState(false)
    const infeed = useInfeed(instanceId) // seeds and normalizes the infeed at index 0
    const cards = useAppStore((s) => s.chains[instanceId]) ?? []
    const setCards = infeed.setCards
    const currentCards = infeed.current

    const handleInputChange = useCallback((cardIndex: number, key: string, value: string) => {
        const updated = [...currentCards()]
        updated[cardIndex] = {
            ...updated[cardIndex],
            inputs: { ...updated[cardIndex].inputs, [key]: value === '' ? null : parseFloat(value) || value },
        }
        setCards([...recalculateFromCard(updated, cardIndex)])
    }, [setCards])

    // A unit change converts the number so the quantity is unchanged (never reinterprets it)
    const handleUnitChange = useCallback((cardIndex: number, key: string, unit: string) => {
        const updated = [...currentCards()]
        const card = updated[cardIndex]
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const def = (cardTypes[card.type]?.inputs as any[])?.find((inp) => inp.key === key)
        const prevUnit = card.units[key] ?? (def?.unitType ? unitTypes[def.unitType].default : undefined)
        const raw = card.inputs[key]
        const inputs = { ...card.inputs }
        if (def?.unitType && typeof raw === 'number' && Number.isFinite(raw) && prevUnit && prevUnit !== unit) {
            inputs[key] = Number((fromBase(toBase(raw, prevUnit, def.unitType), unit, def.unitType) as number).toPrecision(6))
        }
        updated[cardIndex] = { ...card, inputs, units: { ...card.units, [key]: unit } }
        setCards([...recalculateFromCard(updated, cardIndex)])
    }, [setCards])

    const handleSelectChange = useCallback((cardIndex: number, key: string, value: string) => {
        const updated = [...currentCards()]
        updated[cardIndex] = { ...updated[cardIndex], inputs: { ...updated[cardIndex].inputs, [key]: value } }
        setCards([...recalculateFromCard(updated, cardIndex)])
    }, [setCards])

    const addCard = useCallback((cardType: string) => {
        const prev = currentCards()
        const newCard = createCard(cardType, prev.length) as FlowCard | null
        if (!newCard) return
        setCards([...recalculateFromCard([...prev, newCard], prev.length)])
        setShowAddMenu(false)
    }, [setCards])

    const removeCard = useCallback((cardIndex: number) => {
        const updated = currentCards().filter((_, i) => i !== cardIndex)
        setCards(updated.length > 0 ? [...recalculateFromCard(updated, Math.max(0, cardIndex - 1))] : updated)
    }, [setCards])

    const chainFeasibility = useMemo(() => getChainFeasibility(cards), [cards])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const addableTypes = Object.entries(cardTypes).filter(([key, type]: [string, any]) => {
        if (type.unique) return !cards.some((c) => c.type === key)
        return key !== 'infeed'
    })

    return (
        <div className="bg-dark-800 border border-border rounded-xl">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text-primary">Line Flow Simulator</h3>
                <div className="flex items-center gap-2">
                    <CalcPinButton toolId="lineFlow" instanceId={instanceId} />
                    {cards.length > 0 && (
                        <span className={`flex items-center gap-1 text-xs ${
                            chainFeasibility === 'ok' ? 'text-success' : chainFeasibility === 'warning' ? 'text-warning' : 'text-error'
                        }`}>
                            {chainFeasibility === 'ok' ? <CheckCircle className="w-3.5 h-3.5" /> : chainFeasibility === 'warning' ? <AlertTriangle className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                            {chainFeasibility === 'ok' ? 'Feasible' : chainFeasibility === 'warning' ? 'Warning' : 'Error'}
                        </span>
                    )}
                </div>
            </div>
            <div className="p-4 space-y-4">
                <div className="text-[10px] text-text-muted">
                    Starts from the <a href="#tool-conveyorFlow" className="text-primary hover:underline">Conveyor Speed</a> infeed — the same card, edited in either place. Add cards to follow the product downstream.
                </div>
                {cards.map((card, cardIndex) => {
                    const typeDef = cardTypes[card.type]
                    if (!typeDef) return null
                    const outputs = card.outputs || {}
                    const feasibility = outputs.feasibility || 'ok'

                    return (
                        <div key={card.id} className="border rounded-lg overflow-hidden" style={{ borderColor: typeDef.color + '40' }}>
                            <div className="flex items-center justify-between px-3 py-2" style={{ background: typeDef.color + '15' }}>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm" style={{ color: typeDef.color }}>{typeDef.icon}</span>
                                    <span className="text-sm font-medium text-text-primary">{typeDef.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {feasibility !== 'ok' && !outputs.pristine && (
                                        <span className={`text-xs ${feasibility === 'warning' ? 'text-warning' : 'text-error'}`}>{feasibility === 'warning' ? '⚠' : '✗'}</span>
                                    )}
                                    {typeDef.deletable && (
                                        <button onClick={() => removeCard(cardIndex)} className="p-1 text-text-muted hover:text-error transition-colors">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="px-3 py-2 space-y-2">
                                {card.type === 'infeed' ? (
                                    <InfeedEditor showWeight chainId={instanceId} />
                                ) : (
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    typeDef.inputs.map((input: any) => {
                                        if (input.conditional) {
                                            const [condKey, condVal] = input.conditional.split('=')
                                            if (String(card.inputs[condKey]) !== condVal) return null
                                        }
                                        if (input.type === 'select') {
                                            return (
                                                <div key={input.key}>
                                                    <label className="block text-xs text-text-muted mb-1">{input.label}</label>
                                                    <select value={String(card.inputs[input.key] ?? input.options[0])}
                                                        onChange={(e) => handleSelectChange(cardIndex, input.key, e.target.value)}
                                                        className="w-full px-2 py-1.5 bg-dark-900 border border-border rounded-lg text-text-primary text-xs focus:outline-none focus:border-primary">
                                                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                                        {input.options.map((opt: any) => (
                                                            <option key={opt} value={opt}>{input.optionsFull ? input.optionsFull[input.options.indexOf(opt)] : opt}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )
                                        }
                                        if (input.type === 'text') {
                                            return (
                                                <div key={input.key}>
                                                    <label className="block text-xs text-text-muted mb-1">{input.label}</label>
                                                    <input type="text" value={String(card.inputs[input.key] ?? '')}
                                                        onChange={(e) => handleInputChange(cardIndex, input.key, e.target.value)} placeholder={input.placeholder}
                                                        className="w-full px-2 py-1.5 bg-dark-900 border border-border rounded-lg text-text-primary text-xs font-mono focus:outline-none focus:border-primary" />
                                                </div>
                                            )
                                        }
                                        return (
                                            <div key={input.key}>
                                                <label className="block text-xs text-text-muted mb-1">{input.label}</label>
                                                <div className="flex">
                                                    <input type="number" value={card.inputs[input.key] === null || card.inputs[input.key] === undefined ? '' : String(card.inputs[input.key])}
                                                        onChange={(e) => handleInputChange(cardIndex, input.key, e.target.value)} placeholder={input.placeholder}
                                                        min={input.min} max={input.max} step="any"
                                                        className="flex-1 px-2 py-1.5 bg-dark-900 border border-border rounded-l-lg text-text-primary text-xs font-mono focus:outline-none focus:border-primary" />
                                                    {input.unitType && unitTypes[input.unitType] && (
                                                        <select value={card.units[input.key] ?? unitTypes[input.unitType].default}
                                                            onChange={(e) => handleUnitChange(cardIndex, input.key, e.target.value)}
                                                            className="px-1.5 bg-dark-700 border border-l-0 border-border rounded-r-lg text-text-secondary text-xs focus:outline-none">
                                                            {unitTypes[input.unitType].units.map((u: string) => <option key={u} value={u}>{u}</option>)}
                                                        </select>
                                                    )}
                                                    {input.suffix && !input.unitType && (
                                                        <span className="flex items-center px-2 bg-dark-700 border border-l-0 border-border rounded-r-lg text-text-muted text-xs">{input.suffix}</span>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })
                                )}
                            </div>

                            {!outputs.pristine && outputs.productSpeed > 0 && (
                                <div className="px-3 py-2 border-t border-border/50 bg-dark-900/50">
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                                        <div className="flex justify-between">
                                            <span className="text-text-muted">Speed:</span>
                                            <span className="font-mono text-text-primary">{formatValue(fromBase(outputs.productSpeed, card.units.productSpeed || 'ft/min', 'speed'))} {card.units.productSpeed || 'ft/min'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-text-muted">Rate:</span>
                                            <span className="font-mono text-text-primary">{formatValue(outputs.ppm, 1)} PPM</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-text-muted">Gap:</span>
                                            <span className="font-mono text-text-primary">{formatValue(fromBase(outputs.productGap, card.units.productGap || 'in', 'length'))} {card.units.productGap || 'in'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-text-muted">Gap Time:</span>
                                            <span className="font-mono text-text-primary">{formatValue(outputs.gapTimeAvailable * 1000, 0)} ms</span>
                                        </div>
                                    </div>
                                    {outputs.issues?.length > 0 && (
                                        <div className="mt-2 space-y-1">
                                            {outputs.issues.map((issue: string, i: number) => (
                                                <div key={i} className={`text-xs ${feasibility === 'error' ? 'text-error' : 'text-warning'}`}>{feasibility === 'error' ? '✗' : '⚠'} {issue}</div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )
                })}

                <div className="relative">
                    <button onClick={() => setShowAddMenu(!showAddMenu)}
                        className="w-full px-3 py-2 border border-dashed border-border rounded-lg text-text-muted text-sm hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-1.5">
                        <Plus className="w-4 h-4" /> Add Card
                    </button>
                    {showAddMenu && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-dark-700 border border-border rounded-lg shadow-lg z-10 overflow-hidden">
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {addableTypes.map(([key, type]: [string, any]) => (
                                <button key={key} onClick={() => addCard(key)}
                                    className="w-full px-3 py-2 text-left text-sm hover:bg-dark-600 transition-colors flex items-center gap-2">
                                    <span style={{ color: type.color }}>{type.icon}</span>
                                    <span className="text-text-primary">{type.name}</span>
                                    <span className="text-text-muted text-xs ml-auto">{type.description || ''}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
