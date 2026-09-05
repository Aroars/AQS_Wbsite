import { useState, useMemo, useCallback, useEffect } from 'react'
import { Plus, Trash2, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react'
import { PinButton } from '@/toolbox/components/ui/PinButton'
import { useAppStore } from '@/toolbox/stores/appStore'
import { cardTypes, unitTypes, createCard, formatValue } from '@/toolbox/data/conveyorCardTypes'
import { fromBase } from '@/toolbox/data/conveyorCardTypes'
import { recalculateFromCard, getChainFeasibility } from '@/toolbox/lib/calculators/conveyorFlow'

export function ConveyorFlow() {
    const pinned = useAppStore((s) => s.pinnedCalculators.includes('conveyorFlow'))
    const togglePin = useAppStore((s) => s.togglePinCalculator)
    // Cards live in the persisted store: the chain survives tab switches and reloads,
    // and a pinned copy on Home is a live view of the same data. The card objects are
    // the untyped legacy shape from createCard/recalculateFromCard, so read them as any[].
    const cards = useAppStore((s) => s.conveyorCards) as any[]
    const setCards = useAppStore((s) => s.setConveyorCards)
    const currentCards = (): any[] => useAppStore.getState().conveyorCards
    const [showAddMenu, setShowAddMenu] = useState(false)

    // Seed the permanent infeed card on first use (idempotent across instances)
    useEffect(() => {
        if (useAppStore.getState().conveyorCards.length === 0) {
            const infeed = createCard('infeed', 0)
            if (infeed) setCards([infeed])
        }
    }, [setCards])

    const handleInputChange = useCallback((cardIndex: number, key: string, value: string) => {
        const updated = [...currentCards()]
        updated[cardIndex] = {
            ...updated[cardIndex],
            inputs: { ...updated[cardIndex].inputs, [key]: value === '' ? null : parseFloat(value) || value }
        }
        setCards([...recalculateFromCard(updated, cardIndex)])
    }, [setCards])

    const handleUnitChange = useCallback((cardIndex: number, key: string, unit: string) => {
        const updated = [...currentCards()]
        updated[cardIndex] = {
            ...updated[cardIndex],
            units: { ...updated[cardIndex].units, [key]: unit }
        }
        setCards([...recalculateFromCard(updated, cardIndex)])
    }, [setCards])

    const handleSelectChange = useCallback((cardIndex: number, key: string, value: string) => {
        const updated = [...currentCards()]
        updated[cardIndex] = {
            ...updated[cardIndex],
            inputs: { ...updated[cardIndex].inputs, [key]: value }
        }
        setCards([...recalculateFromCard(updated, cardIndex)])
    }, [setCards])

    const addCard = useCallback((cardType: string) => {
        const prev = currentCards()
        const newCard = createCard(cardType, prev.length)
        if (!newCard) return
        setCards([...recalculateFromCard([...prev, newCard], prev.length)])
        setShowAddMenu(false)
    }, [setCards])

    const removeCard = useCallback((cardIndex: number) => {
        const updated = currentCards().filter((_, i) => i !== cardIndex)
        setCards(updated.length > 0 ? [...recalculateFromCard(updated, Math.max(0, cardIndex - 1))] : updated)
    }, [setCards])

    const chainFeasibility = useMemo(() => getChainFeasibility(cards), [cards])

    const addableTypes = Object.entries(cardTypes).filter(([key, type]: any) => {
        if (type.unique) {
            return !cards.some(c => c.type === key)
        }
        return key !== 'infeed'
    })

    return (
        <div className="bg-dark-800 border border-border rounded-xl">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text-primary">Conveyor Flow Calculator</h3>
                <div className="flex items-center gap-2">
                    <PinButton pinned={pinned} onToggle={() => togglePin('conveyorFlow')} />
                {cards.length > 0 && (
                    <span className={`flex items-center gap-1 text-xs ${
                        chainFeasibility === 'ok' ? 'text-success' :
                        chainFeasibility === 'warning' ? 'text-warning' : 'text-error'
                    }`}>
                        {chainFeasibility === 'ok' ? <CheckCircle className="w-3.5 h-3.5" /> :
                         chainFeasibility === 'warning' ? <AlertTriangle className="w-3.5 h-3.5" /> :
                         <AlertCircle className="w-3.5 h-3.5" />}
                        {chainFeasibility === 'ok' ? 'Feasible' : chainFeasibility === 'warning' ? 'Warning' : 'Error'}
                    </span>
                )}
                </div>
            </div>
            <div className="p-4 space-y-4">
                {cards.map((card, cardIndex) => {
                    const typeDef = cardTypes[card.type]
                    if (!typeDef) return null
                    const outputs = card.outputs || {}
                    const feasibility = outputs.feasibility || 'ok'

                    return (
                        <div key={card.id} className="border rounded-lg overflow-hidden" style={{ borderColor: typeDef.color + '40' }}>
                            {/* Card header */}
                            <div className="flex items-center justify-between px-3 py-2" style={{ background: typeDef.color + '15' }}>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm" style={{ color: typeDef.color }}>{typeDef.icon}</span>
                                    <span className="text-sm font-medium text-text-primary">{typeDef.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {feasibility !== 'ok' && !outputs.pristine && (
                                        <span className={`text-xs ${feasibility === 'warning' ? 'text-warning' : 'text-error'}`}>
                                            {feasibility === 'warning' ? '⚠' : '✗'}
                                        </span>
                                    )}
                                    {typeDef.deletable && (
                                        <button onClick={() => removeCard(cardIndex)} className="p-1 text-text-muted hover:text-error transition-colors">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Card inputs */}
                            <div className="px-3 py-2 space-y-2">
                                {typeDef.inputs.map((input: any) => {
                                    // Check conditional visibility
                                    if (input.conditional) {
                                        const [condKey, condVal] = input.conditional.split('=')
                                        if (String(card.inputs[condKey]) !== condVal) return null
                                    }

                                    if (input.type === 'select') {
                                        return (
                                            <div key={input.key}>
                                                <label className="block text-xs text-text-muted mb-1">{input.label}</label>
                                                <select
                                                    value={card.inputs[input.key] ?? input.options[0]}
                                                    onChange={(e) => handleSelectChange(cardIndex, input.key, e.target.value)}
                                                    className="w-full px-2 py-1.5 bg-dark-900 border border-border rounded-lg text-text-primary text-xs focus:outline-none focus:border-primary"
                                                >
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
                                                <input
                                                    type="text"
                                                    value={card.inputs[input.key] ?? ''}
                                                    onChange={(e) => handleInputChange(cardIndex, input.key, e.target.value)}
                                                    placeholder={input.placeholder}
                                                    className="w-full px-2 py-1.5 bg-dark-900 border border-border rounded-lg text-text-primary text-xs font-mono focus:outline-none focus:border-primary"
                                                />
                                            </div>
                                        )
                                    }

                                    // Number input with optional unit selector
                                    return (
                                        <div key={input.key}>
                                            <label className="block text-xs text-text-muted mb-1">{input.label}</label>
                                            <div className="flex">
                                                <input
                                                    type="number"
                                                    value={card.inputs[input.key] ?? ''}
                                                    onChange={(e) => handleInputChange(cardIndex, input.key, e.target.value)}
                                                    placeholder={input.placeholder}
                                                    min={input.min}
                                                    max={input.max}
                                                    step="any"
                                                    className="flex-1 px-2 py-1.5 bg-dark-900 border border-border rounded-l-lg text-text-primary text-xs font-mono focus:outline-none focus:border-primary"
                                                />
                                                {input.unitType && unitTypes[input.unitType] && (
                                                    <select
                                                        value={card.units[input.key] ?? unitTypes[input.unitType].default}
                                                        onChange={(e) => handleUnitChange(cardIndex, input.key, e.target.value)}
                                                        className="px-1.5 bg-dark-700 border border-l-0 border-border rounded-r-lg text-text-secondary text-xs focus:outline-none"
                                                    >
                                                        {unitTypes[input.unitType].units.map((u: string) => (
                                                            <option key={u} value={u}>{u}</option>
                                                        ))}
                                                    </select>
                                                )}
                                                {input.suffix && !input.unitType && (
                                                    <span className="flex items-center px-2 bg-dark-700 border border-l-0 border-border rounded-r-lg text-text-muted text-xs">
                                                        {input.suffix}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Card outputs */}
                            {!outputs.pristine && outputs.productSpeed > 0 && (
                                <div className="px-3 py-2 border-t border-border/50 bg-dark-900/50">
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                                        <div className="flex justify-between">
                                            <span className="text-text-muted">Speed:</span>
                                            <span className="font-mono text-text-primary">
                                                {formatValue(fromBase(outputs.productSpeed, card.units.productSpeed || 'ft/min', 'speed'))} {card.units.productSpeed || 'ft/min'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-text-muted">Rate:</span>
                                            <span className="font-mono text-text-primary">{formatValue(outputs.ppm, 1)} PPM</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-text-muted">Gap:</span>
                                            <span className="font-mono text-text-primary">
                                                {formatValue(fromBase(outputs.productGap, card.units.productGap || 'in', 'length'))} {card.units.productGap || 'in'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-text-muted">Gap Time:</span>
                                            <span className="font-mono text-text-primary">{formatValue(outputs.gapTimeAvailable * 1000, 0)} ms</span>
                                        </div>
                                    </div>
                                    {/* Issues */}
                                    {outputs.issues?.length > 0 && (
                                        <div className="mt-2 space-y-1">
                                            {outputs.issues.map((issue: string, i: number) => (
                                                <div key={i} className={`text-xs ${feasibility === 'error' ? 'text-error' : 'text-warning'}`}>
                                                    {feasibility === 'error' ? '✗' : '⚠'} {issue}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )
                })}

                {/* Add card button */}
                <div className="relative">
                    <button
                        onClick={() => setShowAddMenu(!showAddMenu)}
                        className="w-full px-3 py-2 border border-dashed border-border rounded-lg text-text-muted text-sm hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-1.5"
                    >
                        <Plus className="w-4 h-4" /> Add Card
                    </button>
                    {showAddMenu && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-dark-700 border border-border rounded-lg shadow-lg z-10 overflow-hidden">
                            {addableTypes.map(([key, type]: any) => (
                                <button
                                    key={key}
                                    onClick={() => addCard(key)}
                                    className="w-full px-3 py-2 text-left text-sm hover:bg-dark-600 transition-colors flex items-center gap-2"
                                >
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
