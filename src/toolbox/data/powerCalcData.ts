/**
 * Power Requirement Calculator Data
 * @module data/powerCalcData
 *
 * Reference data for breaker sizing, wire recommendations,
 * and DC converter efficiency calculations.
 *
 * Breaker sizes based on NEC and IEC standards
 * Wire ampacity based on NEC Table 310.16 (copper, 75°C column)
 */

// Standard NEC breaker sizes (Amps)
export const necBreakerSizes = [
    15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100,
    110, 125, 150, 175, 200, 225, 250, 300, 350, 400, 450, 500, 600
]

// Standard IEC breaker sizes (Amps)
export const iecBreakerSizes = [
    6, 10, 16, 20, 25, 32, 40, 50, 63, 80, 100,
    125, 160, 200, 250, 315, 400, 500, 630
]

// AC Voltage options for equipment
export const acVoltages = [
    { value: 120, label: '120V' },
    { value: 208, label: '208V' },
    { value: 240, label: '240V' },
    { value: 380, label: '380V' },
    { value: 480, label: '480V' }
]

// DC Voltage options for equipment
export const dcVoltages = [
    { value: 12, label: '12V DC' },
    { value: 24, label: '24V DC' },
    { value: 48, label: '48V DC' }
]

// Supply voltage options (main panel)
export const supplyVoltages = [
    { value: 208, label: '208V' },
    { value: 240, label: '240V' },
    { value: 380, label: '380V' },
    { value: 480, label: '480V' }
]

// DC-DC/AC-DC converter efficiency
export const converterEfficiency = {
    typical: 0.85,  // 85% typical (15% loss)
    high: 0.90,     // 90% for high-efficiency converters
    low: 0.80       // 80% for basic converters
}

// Continuous load factor (NEC/IEC require 125% for continuous loads)
export const continuousLoadFactor = 1.25

// Default power factor for mixed loads
export const defaultPowerFactor = 0.9

// Wire gauge recommendations based on ampacity
// Using NEC Table 310.16, THHN/THWN-2, 75°C column, copper
export const wireRecommendations = {
    ranges: [
        { maxAmps: 15, awg: '14', description: '14 AWG' },
        { maxAmps: 20, awg: '12', description: '12 AWG' },
        { maxAmps: 30, awg: '10', description: '10 AWG' },
        { maxAmps: 40, awg: '8', description: '8 AWG' },
        { maxAmps: 55, awg: '6', description: '6 AWG' },
        { maxAmps: 70, awg: '4', description: '4 AWG' },
        { maxAmps: 85, awg: '3', description: '3 AWG' },
        { maxAmps: 95, awg: '2', description: '2 AWG' },
        { maxAmps: 110, awg: '1', description: '1 AWG' },
        { maxAmps: 125, awg: '1/0', description: '1/0 AWG' },
        { maxAmps: 145, awg: '2/0', description: '2/0 AWG' },
        { maxAmps: 165, awg: '3/0', description: '3/0 AWG' },
        { maxAmps: 195, awg: '4/0', description: '4/0 AWG' },
        { maxAmps: 260, awg: '250 kcmil', description: '250 kcmil' },
        { maxAmps: 310, awg: '350 kcmil', description: '350 kcmil' },
        { maxAmps: 380, awg: '500 kcmil', description: '500 kcmil' },
        { maxAmps: 475, awg: '750 kcmil', description: '750 kcmil' }
    ],
    insulationType: 'THHN/THWN-2',
    note: 'Based on NEC Table 310.16, copper conductors, 75°C column'
}

// Standard information
export const standardInfo = {
    NEC: {
        name: 'NEC (National Electrical Code)',
        description: 'US electrical standard. Breakers sized at 125% of continuous load.',
        region: 'USA, North America'
    },
    IEC: {
        name: 'IEC (International Electrotechnical Commission)',
        description: 'International electrical standard. Similar sizing principles.',
        region: 'Europe, Asia, International'
    }
}

/**
 * Get next standard breaker size above the calculated amps
 * @param {number} amps - Required amperage (already includes continuous load factor if applicable)
 * @param {string} standard - 'NEC' or 'IEC'
 * @returns {number} - Standard breaker size
 */
export function getNextBreakerSize(amps: any, standard: string = 'NEC') {
    const sizes = standard === 'IEC' ? iecBreakerSizes : necBreakerSizes

    for (const size of sizes) {
        if (size >= amps) {
            return size
        }
    }

    // Return largest if amps exceed all standard sizes
    return sizes[sizes.length - 1]
}

/**
 * Get recommended wire gauge for given amperage
 * @param {number} amps - Required amperage (use breaker size for proper coordination)
 * @returns {object} - Wire recommendation with awg, description, maxAmps
 */
export function getWireRecommendation(amps: any) {
    for (const range of wireRecommendations.ranges) {
        if (amps <= range.maxAmps) {
            return {
                awg: range.awg,
                description: range.description,
                maxAmps: range.maxAmps,
                insulation: wireRecommendations.insulationType
            }
        }
    }

    // Return largest for very high currents with warning
    const largest = wireRecommendations.ranges[wireRecommendations.ranges.length - 1]
    return {
        awg: largest.awg,
        description: largest.description + ' (minimum)',
        maxAmps: largest.maxAmps,
        insulation: wireRecommendations.insulationType,
        warning: 'Current exceeds standard table. Consult electrical engineer.'
    }
}

/**
 * Calculate supply amps from power
 * @param {number} watts - Total power in watts
 * @param {number} voltage - Supply voltage
 * @param {number} phases - 1 or 3
 * @param {number} powerFactor - Power factor (default 0.9)
 * @returns {number} - Calculated amps
 */
export function calculateSupplyAmps(watts: any, voltage: any, phases: any, powerFactor: number = 0.9) {
    if (watts <= 0 || voltage <= 0) return 0

    if (phases === 3) {
        // 3-phase: P = √3 × V × I × PF
        // I = P / (√3 × V × PF)
        return watts / (Math.sqrt(3) * voltage * powerFactor)
    } else {
        // Single-phase: P = V × I × PF
        // I = P / (V × PF)
        return watts / (voltage * powerFactor)
    }
}

/**
 * Calculate AC power draw for DC loads (accounting for converter loss)
 * @param {number} dcWatts - DC power consumption
 * @param {number} efficiency - Converter efficiency (default 0.85)
 * @returns {object} - Object with acPowerDraw, converterLoss, efficiency
 */
export function calculateDcConverterPower(dcWatts: any, efficiency: number = 0.85) {
    if (dcWatts <= 0) {
        return {
            acPowerDraw: 0,
            converterLoss: 0,
            efficiency: efficiency,
            dcPower: 0
        }
    }

    const acPowerDraw = dcWatts / efficiency
    const converterLoss = acPowerDraw - dcWatts

    return {
        acPowerDraw: acPowerDraw,
        converterLoss: converterLoss,
        efficiency: efficiency,
        dcPower: dcWatts
    }
}

/**
 * Create a unique ID for equipment entries
 * @returns {string} - Unique ID
 */
export function createEquipmentId() {
    return 'power-' + Date.now() + '-' + Math.random().toString(36).substring(2, 11)
}
