import { useCallback } from 'react'
import { ArrowUpDown, Copy, Trash2, ChevronUp, ChevronDown } from 'lucide-react'
import { unitCategories } from '@/toolbox/data/unitCategories'
import { categoryIcons } from '@/toolbox/data/categoryIcons'
import { convertUnits, formatNumber } from '@/toolbox/lib/converter'
import { useAppStore } from '@/toolbox/stores/appStore'
import { cn } from '@/toolbox/lib/utils'
import { showToast } from '@/toolbox/components/ui/Toast'
import type { SavedConverter } from '@/toolbox/lib/types'

interface ConverterCardProps {
    converter: SavedConverter
    compact?: boolean
}

export function ConverterCard({ converter, compact }: ConverterCardProps) {
    const updateConverter = useAppStore((s) => s.updateConverter)
    const removeConverter = useAppStore((s) => s.removeConverter)
    const duplicateConverter = useAppStore((s) => s.duplicateConverter)
    const rememberConverterUnits = useAppStore((s) => s.rememberConverterUnits)
    const reorderConverters = useAppStore((s) => s.reorderConverters)
    const position = useAppStore((s) => s.savedConverters.findIndex((c) => c.id === converter.id))
    const count = useAppStore((s) => s.savedConverters.length)

    const handleFromChange = useCallback(
        (value: string) => {
            const numValue = parseFloat(value)
            const toValue =
                value === '' || isNaN(numValue)
                    ? ''
                    : formatNumber(
                          convertUnits(numValue, converter.fromUnit, converter.toUnit, converter.category)
                      )
            updateConverter(converter.id, { fromValue: value, toValue })
        },
        [converter.fromUnit, converter.toUnit, converter.category, converter.id, updateConverter]
    )

    const handleToChange = useCallback(
        (value: string) => {
            const numValue = parseFloat(value)
            const fromValue =
                value === '' || isNaN(numValue)
                    ? ''
                    : formatNumber(
                          convertUnits(numValue, converter.toUnit, converter.fromUnit, converter.category)
                      )
            updateConverter(converter.id, { fromValue, toValue: value })
        },
        [converter.fromUnit, converter.toUnit, converter.category, converter.id, updateConverter]
    )

    const handleUnitChange = useCallback(
        (side: 'from' | 'to', unitName: string) => {
            const updates: Partial<SavedConverter> =
                side === 'from' ? { fromUnit: unitName } : { toUnit: unitName }

            const newFrom = side === 'from' ? unitName : converter.fromUnit
            const newTo = side === 'to' ? unitName : converter.toUnit

            // Recalculate with new unit
            if (converter.fromValue) {
                const numValue = parseFloat(converter.fromValue)
                if (!isNaN(numValue)) {
                    updates.toValue = formatNumber(
                        convertUnits(numValue, newFrom, newTo, converter.category)
                    )
                }
            }
            updateConverter(converter.id, updates)
            rememberConverterUnits(converter.category, newFrom, newTo)
        },
        [converter, updateConverter, rememberConverterUnits]
    )

    const handleSwapUnits = useCallback(() => {
        const updates: Partial<SavedConverter> = {
            fromUnit: converter.toUnit,
            toUnit: converter.fromUnit,
            fromValue: converter.toValue,
            toValue: converter.fromValue,
        }
        updateConverter(converter.id, updates)
        rememberConverterUnits(converter.category, converter.toUnit, converter.fromUnit)
    }, [converter, updateConverter, rememberConverterUnits])

    const handleDelete = useCallback(() => {
        removeConverter(converter.id)
        showToast('Converter removed')
    }, [converter.id, removeConverter])

    const handleDuplicate = useCallback(() => {
        duplicateConverter(converter.id)
        showToast('Converter duplicated')
    }, [converter.id, duplicateConverter])

    // After all hooks (rules of hooks): a persisted converter whose category no
    // longer exists renders a removable stub instead of vanishing silently
    const category = unitCategories[converter.category]
    if (!category) {
        return (
            <div className="bg-dark-800 border border-error/30 rounded-xl px-4 py-3 flex items-center justify-between">
                <span className="text-xs text-text-secondary">
                    Unknown category "{converter.category}" — this converter is from an older version.
                </span>
                <button onClick={handleDelete} className="p-1.5 rounded-md text-text-muted hover:text-error hover:bg-error/10 transition-colors" title="Delete">
                    <Trash2 className="w-3.5 h-3.5" />
                </button>
            </div>
        )
    }

    const unitNames = Object.keys(category.units)
    const IconRenderer = categoryIcons[converter.category]

    // Symbol leads so the closed (truncated) select still reads "mm — …";
    // the label never changes on focus, so nothing shifts under the cursor
    const getUnitDisplay = (unitName: string) => {
        const unit = category.units[unitName]
        return unit ? `${unit.symbol} — ${unitName}` : unitName
    }

    return (
        <div className={cn('bg-dark-800 border border-border rounded-xl', compact && 'text-sm')}>
            {/* Header */}
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {IconRenderer && (
                        <span className="text-primary">
                            {IconRenderer({ className: 'w-4 h-4' })}
                        </span>
                    )}
                    <span className="text-sm font-medium text-text-primary">
                        {converter.category}
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => reorderConverters(position, position - 1)}
                        disabled={position <= 0}
                        className="p-1.5 rounded-md text-text-muted hover:text-text-secondary hover:bg-dark-700 transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-text-muted"
                        title="Move up"
                    >
                        <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={() => reorderConverters(position, position + 1)}
                        disabled={position >= count - 1}
                        className="p-1.5 rounded-md text-text-muted hover:text-text-secondary hover:bg-dark-700 transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-text-muted"
                        title="Move down"
                    >
                        <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={handleDuplicate}
                        className="p-1.5 rounded-md text-text-muted hover:text-text-secondary hover:bg-dark-700 transition-colors"
                        title="Duplicate"
                    >
                        <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={handleDelete}
                        className="p-1.5 rounded-md text-text-muted hover:text-error hover:bg-error/10 transition-colors"
                        title="Delete"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Conversion inputs */}
            <div className="p-4 space-y-4">
                {/* From */}
                <div className="flex gap-2">
                    <div className="flex-1">
                        <input
                            type="number"
                            value={converter.fromValue}
                            onChange={(e) => handleFromChange(e.target.value)}
                            placeholder="Enter value"
                            className="w-full px-3 py-2.5 bg-dark-900 border border-border rounded-lg text-text-primary font-mono focus:outline-none focus:border-primary transition-colors"
                            step="any"
                        />
                    </div>
                    <select
                        value={converter.fromUnit}
                        onChange={(e) => handleUnitChange('from', e.target.value)}
                        className="min-w-[90px] max-w-[150px] px-2 py-2.5 bg-dark-900 border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-primary transition-colors"
                    >
                        {unitNames.map((name) => (
                            <option key={name} value={name}>
                                {getUnitDisplay(name)}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Swap button */}
                <div className="flex justify-center">
                    <button
                        onClick={handleSwapUnits}
                        className="p-2 rounded-full bg-dark-700 border border-border hover:border-primary hover:text-primary text-text-muted transition-colors"
                        title="Swap units"
                    >
                        <ArrowUpDown className="w-4 h-4" />
                    </button>
                </div>

                {/* To */}
                <div className="flex gap-2">
                    <div className="flex-1">
                        <input
                            type="number"
                            value={converter.toValue}
                            onChange={(e) => handleToChange(e.target.value)}
                            placeholder="Result"
                            className="w-full px-3 py-2.5 bg-dark-900 border border-border rounded-lg text-text-primary font-mono focus:outline-none focus:border-primary transition-colors"
                            step="any"
                        />
                    </div>
                    <select
                        value={converter.toUnit}
                        onChange={(e) => handleUnitChange('to', e.target.value)}
                        className="min-w-[90px] max-w-[150px] px-2 py-2.5 bg-dark-900 border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-primary transition-colors"
                    >
                        {unitNames.map((name) => (
                            <option key={name} value={name}>
                                {getUnitDisplay(name)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    )
}
