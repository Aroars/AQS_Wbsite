import { useState, useMemo } from 'react'
import { Trash2, Plus } from 'lucide-react'
import { shapeCalculations } from '@/toolbox/data/shapeCalculations'
import { unitCategories } from '@/toolbox/data/unitCategories'
import { useAppStore } from '@/toolbox/stores/appStore'
import { convertUnits, formatNumber } from '@/toolbox/lib/converter'
import { PinButton } from '@/toolbox/components/ui/PinButton'

const shapes = Object.keys(shapeCalculations)
const lengthUnits = Object.keys(unitCategories['Length'].units)
const areaUnits = Object.keys(unitCategories['Area'].units)

export function AreaCalculator() {
    const { areaMemory, addAreaMemory, removeAreaMemory, clearAreaMemory } = useAppStore()
    const pinned = useAppStore((s) => s.pinnedCalculators.includes('area'))
    const togglePin = useAppStore((s) => s.togglePinCalculator)
    const [shape, setShape] = useState(shapes[0])
    const [dimensions, setDimensions] = useState<number[]>([])
    const [inputUnit, setInputUnit] = useState('Inch')
    const [outputUnit, setOutputUnit] = useState('Square Inch')
    const [totalUnit, setTotalUnit] = useState('Square Inch')

    const shapeDef = shapeCalculations[shape]
    const inputs: string[] = shapeDef?.inputs ?? []

    const calculatedArea = useMemo(() => {
        if (!shapeDef || dimensions.length < inputs.length) return null
        const vals = dimensions.slice(0, inputs.length)
        if (vals.some((v) => !v || v <= 0)) return null
        // Convert input dimensions from inputUnit to meters
        const metersVals = vals.map((v) => convertUnits(v, inputUnit, 'Meter', 'Length'))
        const areaSqMeters = shapeDef.calculate(...metersVals)
        // Convert from square meters to output unit
        return convertUnits(areaSqMeters, 'Square Meter', outputUnit, 'Area')
    }, [shapeDef, dimensions, inputs.length, inputUnit, outputUnit])

    const handleDimChange = (index: number, value: string) => {
        const newDims = [...dimensions]
        newDims[index] = parseFloat(value) || 0
        setDimensions(newDims)
    }

    const handleAddToMemory = () => {
        if (calculatedArea === null || calculatedArea <= 0) return
        addAreaMemory({ shape, dimensions: dimensions.slice(0, inputs.length), area: calculatedArea, unit: outputUnit })
    }

    const total = useMemo(() => {
        return areaMemory.reduce((sum, entry) => {
            const converted = convertUnits(entry.area, entry.unit, totalUnit, 'Area')
            return sum + converted
        }, 0)
    }, [areaMemory, totalUnit])

    return (
        <div className="bg-dark-800 border border-border rounded-xl">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text-primary">Area Calculator</h3>
                <div className="flex items-center gap-2">
                    <PinButton pinned={pinned} onToggle={() => togglePin('area')} />
                    {areaMemory.length > 0 && (
                        <button onClick={clearAreaMemory} className="text-xs text-text-muted hover:text-error transition-colors">
                            Clear Memory
                        </button>
                    )}
                </div>
            </div>

            <div className="p-4 space-y-4">
                {/* Shape selector */}
                <div>
                    <label className="block text-xs text-text-secondary uppercase mb-1 tracking-wider">Shape</label>
                    <select
                        value={shape}
                        onChange={(e) => { setShape(e.target.value); setDimensions([]) }}
                        className="w-full px-3 py-2.5 bg-dark-900 border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-primary"
                    >
                        {shapes.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>

                {/* Input unit */}
                <div>
                    <label className="block text-xs text-text-secondary uppercase mb-1 tracking-wider">Input Unit</label>
                    <select
                        value={inputUnit}
                        onChange={(e) => setInputUnit(e.target.value)}
                        className="w-full px-3 py-2.5 bg-dark-900 border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-primary"
                    >
                        {lengthUnits.map((u) => <option key={u} value={u}>{u} ({unitCategories['Length'].units[u].symbol})</option>)}
                    </select>
                </div>

                {/* Dimension inputs */}
                <div className="grid grid-cols-2 gap-3">
                    {inputs.map((label, i) => (
                        <div key={`${shape}-${label}`}>
                            <label className="block text-xs text-text-secondary uppercase mb-1 tracking-wider">{label}</label>
                            <input
                                type="number"
                                value={dimensions[i] || ''}
                                onChange={(e) => handleDimChange(i, e.target.value)}
                                placeholder="0"
                                min="0"
                                step="any"
                                className="w-full px-3 py-2.5 bg-dark-900 border border-border rounded-lg text-text-primary font-mono text-sm focus:outline-none focus:border-primary"
                            />
                        </div>
                    ))}
                </div>

                {/* Output unit + result */}
                <div>
                    <label className="block text-xs text-text-secondary uppercase mb-1 tracking-wider">Output Unit</label>
                    <select
                        value={outputUnit}
                        onChange={(e) => setOutputUnit(e.target.value)}
                        className="w-full px-3 py-2.5 bg-dark-900 border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-primary"
                    >
                        {areaUnits.map((u) => <option key={u} value={u}>{u} ({unitCategories['Area'].units[u].symbol})</option>)}
                    </select>
                </div>

                {calculatedArea !== null && (
                    <div className="flex items-center justify-between bg-dark-700 rounded-lg px-4 py-3">
                        <div>
                            <span className="text-xs text-text-muted uppercase">Area</span>
                            <div className="text-lg font-mono font-semibold text-primary">
                                {formatNumber(calculatedArea)} <span className="text-sm text-text-secondary">{unitCategories['Area'].units[outputUnit]?.symbol}</span>
                            </div>
                        </div>
                        <button
                            onClick={handleAddToMemory}
                            className="flex items-center gap-1.5 px-3 py-2 bg-primary/10 border border-primary/30 rounded-lg text-primary text-sm hover:bg-primary/20 transition-colors"
                        >
                            <Plus className="w-3.5 h-3.5" /> Memory
                        </button>
                    </div>
                )}

                {/* Memory list */}
                {areaMemory.length > 0 && (
                    <div className="border-t border-border pt-4 space-y-2">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-text-secondary uppercase tracking-wider">Memory ({areaMemory.length})</span>
                            <div className="flex items-center gap-2">
                                <select
                                    value={totalUnit}
                                    onChange={(e) => setTotalUnit(e.target.value)}
                                    className="px-2 py-1 bg-dark-900 border border-border rounded text-text-primary text-xs focus:outline-none focus:border-primary"
                                >
                                    {areaUnits.map((u) => <option key={u} value={u}>{unitCategories['Area'].units[u].symbol}</option>)}
                                </select>
                            </div>
                        </div>
                        {areaMemory.map((entry) => (
                            <div key={entry.id} className="flex items-center justify-between bg-dark-900 rounded-lg px-3 py-2">
                                <div>
                                    <span className="text-xs text-text-muted">{entry.shape}</span>
                                    <div className="font-mono text-sm text-text-primary">
                                        {formatNumber(convertUnits(entry.area, entry.unit, totalUnit, 'Area'))} {unitCategories['Area'].units[totalUnit]?.symbol}
                                    </div>
                                </div>
                                <button onClick={() => removeAreaMemory(entry.id)} className="p-1 text-text-muted hover:text-error transition-colors">
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))}
                        <div className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-lg px-3 py-2">
                            <span className="text-xs text-text-secondary uppercase">Total</span>
                            <span className="font-mono font-semibold text-primary">
                                {formatNumber(total)} {unitCategories['Area'].units[totalUnit]?.symbol}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
