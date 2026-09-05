/**
 * Conveyor Flow Calculator - Card Type Definitions
 * Extensible registry pattern for card types and unit configurations
 * @module data/conveyorCardTypes
 */

/**
 * Unit type configurations with conversion to base units
 * Base units: m/s (speed), m (length), s (time), kg (weight), /min (rate)
 */
export const unitTypes: Record<string, any> = {
    speed: {
        units: ['ft/min', 'm/min', 'ft/s', 'm/s'],
        default: 'ft/min',
        toBase: {
            'ft/min': 0.00508,      // ft/min to m/s
            'm/min': 1/60,          // m/min to m/s
            'ft/s': 0.3048,         // ft/s to m/s
            'm/s': 1                // base unit
        },
        fromBase: {
            'ft/min': 196.85,       // m/s to ft/min
            'm/min': 60,            // m/s to m/min
            'ft/s': 3.28084,        // m/s to ft/s
            'm/s': 1
        }
    },
    length: {
        units: ['in', 'ft', 'mm', 'cm', 'm'],
        default: 'in',
        toBase: {
            'in': 0.0254,
            'ft': 0.3048,
            'mm': 0.001,
            'cm': 0.01,
            'm': 1
        },
        fromBase: {
            'in': 39.3701,
            'ft': 3.28084,
            'mm': 1000,
            'cm': 100,
            'm': 1
        }
    },
    time: {
        units: ['ms', 's', 'min'],
        default: 'ms',
        toBase: {
            'ms': 0.001,
            's': 1,
            'min': 60
        },
        fromBase: {
            'ms': 1000,
            's': 1,
            'min': 1/60
        }
    },
    weight: {
        units: ['lb', 'kg', 'oz', 'g'],
        default: 'lb',
        toBase: {
            'lb': 0.453592,
            'kg': 1,
            'oz': 0.0283495,
            'g': 0.001
        },
        fromBase: {
            'lb': 2.20462,
            'kg': 1,
            'oz': 35.274,
            'g': 1000
        }
    },
    rate: {
        units: ['/min', '/hr', '/sec'],
        default: '/min',
        toBase: {
            '/min': 1,              // base unit (products per minute)
            '/hr': 1/60,            // /hr to /min
            '/sec': 60              // /sec to /min
        },
        fromBase: {
            '/min': 1,
            '/hr': 60,
            '/sec': 1/60
        }
    }
}

/**
 * Card type definitions
 * Each card type defines its inputs, color, and calculation function reference
 */
export const cardTypes: Record<string, any> = {
    infeed: {
        name: 'Infeed',
        color: '#e03131',           // red
        colorLight: '#ffe3e3',      // light red for backgrounds
        icon: '→',
        required: true,
        unique: true,
        deletable: false,
        inputs: [
            { key: 'productSpeed', label: 'Product Speed', type: 'number', unitType: 'speed', placeholder: '100' },
            { key: 'productRate', label: 'Product Rate', type: 'number', unitType: 'rate', placeholder: '20' },
            { key: 'productLength', label: 'Product Length', type: 'number', unitType: 'length', placeholder: '12', required: true },
            { key: 'productGap', label: 'Product Gap', type: 'number', unitType: 'length', placeholder: '6' },
            { key: 'productWeight', label: 'Product Weight', type: 'number', unitType: 'weight', optional: true, placeholder: '' }
        ],
        calculate: 'calculateInfeed'
    },
    split: {
        name: 'Split',
        color: '#1971c2',           // blue
        colorLight: '#d0ebff',
        icon: '⑂',
        required: false,
        unique: false,
        deletable: true,
        inputs: [
            { key: 'splitPercent', label: 'Split', type: 'number', suffix: '%', placeholder: '50', min: 0, max: 100 },
            { key: 'adjustMode', label: 'After Split', type: 'select', options: ['Keep Speed', 'Keep Gap', 'Specify Speed', 'Specify Gap'] },
            { key: 'newSpeed', label: 'New Speed', type: 'number', unitType: 'speed', conditional: 'adjustMode=Specify Speed' },
            { key: 'newGap', label: 'New Gap', type: 'number', unitType: 'length', conditional: 'adjustMode=Specify Gap' }
        ],
        calculate: 'calculateSplit'
    },
    merge: {
        name: 'Merge',
        color: '#1971c2',           // blue
        colorLight: '#d0ebff',
        icon: '⊕',
        required: false,
        unique: false,
        deletable: true,
        inputs: [
            { key: 'mergeMode', label: 'Merge Amount', type: 'select', options: ['Percent', 'PPM'] },
            { key: 'mergePercent', label: 'Increase', type: 'number', suffix: '%', placeholder: '50', conditional: 'mergeMode=Percent' },
            { key: 'mergePPM', label: 'Add', type: 'number', suffix: 'PPM', placeholder: '10', conditional: 'mergeMode=PPM' },
            { key: 'adjustMode', label: 'After Merge', type: 'select', options: ['Increase Speed', 'Reduce Gap', 'Specify Speed', 'Specify Gap'] },
            { key: 'newSpeed', label: 'New Speed', type: 'number', unitType: 'speed', conditional: 'adjustMode=Specify Speed' },
            { key: 'newGap', label: 'New Gap', type: 'number', unitType: 'length', conditional: 'adjustMode=Specify Gap' }
        ],
        calculate: 'calculateMerge'
    },
    process: {
        name: 'Process',
        color: '#f08c00',           // orange
        colorLight: '#fff3bf',
        icon: '⏱',
        required: false,
        unique: false,
        deletable: true,
        inputs: [
            { key: 'processName', label: 'Name', type: 'text', optional: true, placeholder: 'e.g., Robot Pick' },
            { key: 'dwellTime', label: 'Dwell Time', type: 'number', unitType: 'time', placeholder: '500' },
            { key: 'frequency', label: 'Every', type: 'select', options: [1, 2, 3, 4, 5, 10], suffix: 'product(s)', default: 1 },
            { key: 'speedAdjust', label: 'Speed', type: 'select', options: ['Keep', 'Specify'] },
            { key: 'newSpeed', label: 'New Speed', type: 'number', unitType: 'speed', conditional: 'speedAdjust=Specify' }
        ],
        calculate: 'calculateProcess'
    },
    accumulation: {
        name: 'Accumulation',
        color: '#2f9e44',           // green
        colorLight: '#d3f9d8',
        icon: '▮▮▮',
        required: false,
        unique: false,
        deletable: true,
        inputs: [
            { key: 'conveyorLength', label: 'Conveyor Length', type: 'number', unitType: 'length', placeholder: '50' },
            { key: 'minAccumGap', label: 'Min Gap (accumulated)', type: 'number', unitType: 'length', placeholder: '0', default: 0 },
            { key: 'calcMode', label: 'Calculate', type: 'select', options: ['Time', 'Length'], optionsFull: ['Time from Length', 'Length from Time'] },
            { key: 'targetBufferTime', label: 'Target Buffer Time', type: 'number', suffix: 'sec', conditional: 'calcMode=Length' }
        ],
        calculate: 'calculateAccumulation'
    },
    reject: {
        name: 'Reject',
        color: '#c92a2a',           // dark red
        colorLight: '#ffe3e3',
        icon: '✗',
        required: false,
        unique: false,
        deletable: true,
        inputs: [
            { key: 'rejectPercent', label: 'Reject Rate', type: 'number', suffix: '%', placeholder: '5', min: 0, max: 100 },
            { key: 'adjustMode', label: 'After Reject', type: 'select', options: ['Keep Speed', 'Keep Gap'] }
        ],
        calculate: 'calculateReject'
    },
    stacking: {
        name: 'Stacking',
        color: '#7950f2',           // purple
        colorLight: '#e5dbff',
        icon: '⊞',
        required: false,
        unique: false,
        deletable: true,
        inputs: [
            { key: 'stackCount', label: 'Stack Count', type: 'number', suffix: 'products', placeholder: '2', min: 2, default: 2 },
            { key: 'dwellTime', label: 'Stacking Time', type: 'number', unitType: 'time', placeholder: '500' },
            { key: 'adjustMode', label: 'After Stack', type: 'select', options: ['Keep Speed', 'Specify Speed'] },
            { key: 'newSpeed', label: 'New Speed', type: 'number', unitType: 'speed', conditional: 'adjustMode=Specify Speed' }
        ],
        calculate: 'calculateStacking'
    },
    batching: {
        name: 'Batching',
        color: '#1098ad',           // teal
        colorLight: '#c5f6fa',
        icon: '⧉',
        required: false,
        unique: false,
        deletable: true,
        inputs: [
            { key: 'batchCount', label: 'Batch Size', type: 'number', suffix: 'products', placeholder: '3', min: 2, default: 2 },
            { key: 'dwellTime', label: 'Batching Time', type: 'number', unitType: 'time', placeholder: '1000' },
            { key: 'adjustMode', label: 'After Batch', type: 'select', options: ['Keep Speed', 'Specify Speed'] },
            { key: 'newSpeed', label: 'New Speed', type: 'number', unitType: 'speed', conditional: 'adjustMode=Specify Speed' }
        ],
        calculate: 'calculateBatching'
    }
}

/**
 * Default flow state - initial values before any calculation
 */
export const defaultFlowState = {
    // Core flow variables (in base units)
    productSpeed: 0,            // m/s
    productRate: 0,             // products per minute
    productLength: 0,           // m
    productGap: 0,              // m
    productWeight: null,        // kg (optional)

    // Derived values
    ppm: 0,                     // products per minute
    pph: 0,                     // products per hour
    pitch: 0,                   // length + gap in meters
    gapTimeAvailable: 0,        // seconds

    // Feasibility tracking
    issues: [] as string[],
    feasibility: 'ok'           // 'ok' | 'warning' | 'error'
}

/**
 * Convert value to base unit
 * @param {number} value - The value to convert
 * @param {string} fromUnit - The unit to convert from
 * @param {string} unitType - The type of unit (speed, length, time, weight, rate)
 * @returns {number} Value in base units
 */
export function toBase(value: any, fromUnit: any, unitType: any) {
    if (value === null || value === undefined || isNaN(value)) return 0
    const config = unitTypes[unitType]
    if (!config || !config.toBase[fromUnit]) return value
    return value * config.toBase[fromUnit]
}

/**
 * Convert value from base unit
 * @param {number} value - The value in base units
 * @param {string} toUnit - The unit to convert to
 * @param {string} unitType - The type of unit (speed, length, time, weight, rate)
 * @returns {number} Value in target units
 */
export function fromBase(value: any, toUnit: any, unitType: any) {
    if (value === null || value === undefined || isNaN(value)) return 0
    const config = unitTypes[unitType]
    if (!config || !config.fromBase[toUnit]) return value
    return value * config.fromBase[toUnit]
}

/**
 * Format a number for display (max 4 decimal places, trim trailing zeros)
 * @param {number} value - The value to format
 * @param {number} maxDecimals - Maximum decimal places
 * @returns {string} Formatted number string
 */
export function formatValue(value: any, maxDecimals: number = 4) {
    if (value === null || value === undefined || isNaN(value)) return '—'
    if (value === 0) return '0'

    // For very small numbers, use exponential notation
    if (Math.abs(value) < 0.0001 && value !== 0) {
        return value.toExponential(2)
    }

    // Round to max decimals and remove trailing zeros
    const rounded = Number(value.toFixed(maxDecimals))
    return rounded.toString()
}

/**
 * Generate unique card ID
 * @param {string} cardType - The type of card
 * @returns {string} Unique ID
 */
export function generateCardId(cardType: any) {
    return `${cardType}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

/**
 * Create a new card with default values
 * @param {string} cardType - The type of card to create
 * @param {number} order - The order position in the chain
 * @returns {object} New card object
 */
export function createCard(cardType: any, order: number = 0) {
    const type = cardTypes[cardType]
    if (!type) return null

    const inputs: Record<string, any> = {}
    const units: Record<string, any> = {}

    // Initialize inputs with defaults
    type.inputs.forEach((input: any) => {
        if (input.type === 'select' && input.options) {
            inputs[input.key] = input.default !== undefined ? input.default : input.options[0]
        } else if (input.default !== undefined) {
            inputs[input.key] = input.default
        } else {
            inputs[input.key] = input.type === 'number' ? null : ''
        }

        // Set default unit if applicable
        if (input.unitType) {
            units[input.key] = unitTypes[input.unitType].default
        }
    })

    return {
        id: generateCardId(cardType),
        type: cardType,
        order: order,
        inputs: inputs,
        units: units,
        outputs: { ...defaultFlowState }
    }
}
