export interface UnitDefinition {
    symbol: string
    toBase: number | null
}

export interface UnitCategory {
    baseUnit: string
    units: Record<string, UnitDefinition>
    convert?: (value: number, fromUnit: string, toUnit: string) => number
}

export interface SavedConverter {
    id: string
    category: string
    fromUnit: string
    toUnit: string
    fromValue: string
    toValue: string
}

export type TabId = 'home' | 'convert' | 'calculators' | 'conveyor' | 'charts'
