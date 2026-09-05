import { unitCategories } from '@/toolbox/data/unitCategories'

export function convertUnits(
    value: number,
    fromUnit: string,
    toUnit: string,
    category: string
): number {
    const categoryData = unitCategories[category]
    if (!categoryData) return 0

    // Special handling for temperature (non-linear conversion)
    if (category === 'Temperature' && categoryData.convert) {
        return categoryData.convert(value, fromUnit, toUnit)
    }

    const fromData = categoryData.units[fromUnit]
    const toData = categoryData.units[toUnit]

    if (!fromData?.toBase || !toData?.toBase) return 0

    // Two-step: value → base unit → target unit
    const baseValue = value * fromData.toBase
    return baseValue / toData.toBase
}

export function formatNumber(value: number, precision = 6): string {
    return value.toFixed(precision).replace(/\.?0+$/, '')
}
