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

/** Area calculator memory row (per card instance) */
export interface AreaMemoryEntry {
    id: string
    shape: string
    dimensions: number[]
    area: number
    unit: string
}

/** Expression calculator history rows (per card instance) */
export interface FlowHistoryEntry {
    id: string
    expression: string
    result: number
    label?: string
}
export interface FormulaHistoryEntry {
    id: string
    expression: string
    result: number
    variable?: string
    label?: string
}

/** Power calculator equipment row (per card instance) */
export interface PowerEquipment {
    id: string
    label: string
    watts: number
    quantity: number
    type: 'ac' | 'dc'
    voltage?: number
    phase?: number
}

/** A calculator pinned to Home is its own instance, not a mirror of the tab card */
export interface PinnedCalc {
    toolId: string
    instanceId: string
}

/** A saved card or page snapshot (store.snapshots) */
export interface SavedSnapshot {
    id: string
    name: string
    kind: 'card' | 'page'
    tool?: string
    at: string
    /** Encoded snapshot string (lib/snapshot) */
    code: string
}
