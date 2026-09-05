/**
 * Pneumatic Cylinder Data
 * Contains bore sizes, rod diameters, force calculations, and flow/speed data
 * @module data/pneumaticCylinderData
 */

/**
 * Standard metric cylinder bore sizes (mm) with common rod diameters
 * Rod sizes are typical for each bore size
 */
export const metricCylinders: Record<string, any> = {
    '8': { bore: 8, rods: [4], type: 'compact' },
    '10': { bore: 10, rods: [4, 6], type: 'compact' },
    '12': { bore: 12, rods: [6], type: 'compact' },
    '16': { bore: 16, rods: [6, 8], type: 'compact' },
    '20': { bore: 20, rods: [8, 10], type: 'standard' },
    '25': { bore: 25, rods: [10, 12], type: 'standard' },
    '32': { bore: 32, rods: [12, 14], type: 'standard' },
    '40': { bore: 40, rods: [16, 18], type: 'standard' },
    '50': { bore: 50, rods: [20, 22], type: 'standard' },
    '63': { bore: 63, rods: [20, 25], type: 'standard' },
    '80': { bore: 80, rods: [25, 32], type: 'heavy' },
    '100': { bore: 100, rods: [32, 40], type: 'heavy' },
    '125': { bore: 125, rods: [40, 50], type: 'heavy' },
    '160': { bore: 160, rods: [50, 63], type: 'heavy' },
    '200': { bore: 200, rods: [63, 80], type: 'heavy' },
    '250': { bore: 250, rods: [80, 100], type: 'heavy' }
}

/**
 * Standard imperial cylinder bore sizes (inches) with common rod diameters
 */
export const imperialCylinders: Record<string, any> = {
    '0.5': { bore: 0.5, rods: [0.1875, 0.25], type: 'compact' },
    '0.75': { bore: 0.75, rods: [0.25, 0.3125], type: 'compact' },
    '1': { bore: 1, rods: [0.3125, 0.4375], type: 'standard' },
    '1.0625': { bore: 1.0625, rods: [0.4375], type: 'standard' },
    '1.125': { bore: 1.125, rods: [0.4375, 0.5], type: 'standard' },
    '1.5': { bore: 1.5, rods: [0.5, 0.625], type: 'standard' },
    '2': { bore: 2, rods: [0.625, 0.875], type: 'standard' },
    '2.5': { bore: 2.5, rods: [0.875, 1], type: 'standard' },
    '3': { bore: 3, rods: [1, 1.25], type: 'standard' },
    '3.25': { bore: 3.25, rods: [1, 1.375], type: 'heavy' },
    '4': { bore: 4, rods: [1.375, 1.75], type: 'heavy' },
    '5': { bore: 5, rods: [1.75, 2], type: 'heavy' },
    '6': { bore: 6, rods: [2, 2.5], type: 'heavy' },
    '8': { bore: 8, rods: [2.5, 3], type: 'heavy' }
}

/**
 * Common operating pressures with descriptions
 */
export const pressures = {
    metric: [
        { value: 2, label: '2 bar', description: 'Low pressure' },
        { value: 3, label: '3 bar', description: 'Light duty' },
        { value: 4, label: '4 bar', description: 'Standard low' },
        { value: 5, label: '5 bar', description: 'Standard' },
        { value: 6, label: '6 bar', description: 'Standard high' },
        { value: 7, label: '7 bar', description: 'Industrial' },
        { value: 8, label: '8 bar', description: 'Heavy duty' },
        { value: 10, label: '10 bar', description: 'High pressure' }
    ],
    imperial: [
        { value: 30, label: '30 psi', description: 'Low pressure' },
        { value: 40, label: '40 psi', description: 'Light duty' },
        { value: 60, label: '60 psi', description: 'Standard low' },
        { value: 80, label: '80 psi', description: 'Standard' },
        { value: 90, label: '90 psi', description: 'Standard high' },
        { value: 100, label: '100 psi', description: 'Industrial' },
        { value: 120, label: '120 psi', description: 'Heavy duty' },
        { value: 150, label: '150 psi', description: 'High pressure' }
    ]
}

/**
 * Tubing/hose sizes with flow capacity data
 * Flow rates are in SCFM at various pressure differentials
 * ID = Inside Diameter
 */
export const tubingSizes = {
    metric: [
        { od: 4, id: 2.5, label: '4mm OD (2.5mm ID)', maxFlow: 3.5 },
        { od: 6, id: 4, label: '6mm OD (4mm ID)', maxFlow: 8 },
        { od: 8, id: 5, label: '8mm OD (5mm ID)', maxFlow: 14 },
        { od: 8, id: 6, label: '8mm OD (6mm ID)', maxFlow: 18 },
        { od: 10, id: 6.5, label: '10mm OD (6.5mm ID)', maxFlow: 22 },
        { od: 10, id: 8, label: '10mm OD (8mm ID)', maxFlow: 32 },
        { od: 12, id: 8, label: '12mm OD (8mm ID)', maxFlow: 32 },
        { od: 12, id: 9, label: '12mm OD (9mm ID)', maxFlow: 42 },
        { od: 12, id: 10, label: '12mm OD (10mm ID)', maxFlow: 52 },
        { od: 16, id: 12, label: '16mm OD (12mm ID)', maxFlow: 75 }
    ],
    imperial: [
        { od: 0.125, id: 0.0625, label: '1/8" OD (1/16" ID)', maxFlow: 2 },
        { od: 0.1875, id: 0.125, label: '3/16" OD (1/8" ID)', maxFlow: 5 },
        { od: 0.25, id: 0.156, label: '1/4" OD (5/32" ID)', maxFlow: 10 },
        { od: 0.25, id: 0.1875, label: '1/4" OD (3/16" ID)', maxFlow: 14 },
        { od: 0.3125, id: 0.1875, label: '5/16" OD (3/16" ID)', maxFlow: 14 },
        { od: 0.3125, id: 0.25, label: '5/16" OD (1/4" ID)', maxFlow: 25 },
        { od: 0.375, id: 0.25, label: '3/8" OD (1/4" ID)', maxFlow: 25 },
        { od: 0.375, id: 0.3125, label: '3/8" OD (5/16" ID)', maxFlow: 40 },
        { od: 0.5, id: 0.375, label: '1/2" OD (3/8" ID)', maxFlow: 58 },
        { od: 0.625, id: 0.5, label: '5/8" OD (1/2" ID)', maxFlow: 100 }
    ]
}

/**
 * Calculate piston area (extend stroke)
 * @param {number} bore - Bore diameter
 * @param {boolean} isMetric - Whether dimensions are metric (mm) or imperial (inches)
 * @returns {number} Area in mm² or in²
 */
export function calculatePistonArea(bore: any, _isMetric: boolean = true) {
    const radius = bore / 2
    return Math.PI * radius * radius
}

/**
 * Calculate annular area (retract stroke)
 * @param {number} bore - Bore diameter
 * @param {number} rod - Rod diameter
 * @param {boolean} isMetric - Whether dimensions are metric (mm) or imperial (inches)
 * @returns {number} Area in mm² or in²
 */
export function calculateAnnularArea(bore: any, rod: any, isMetric: boolean = true) {
    const pistonArea = calculatePistonArea(bore, isMetric)
    const rodArea = calculatePistonArea(rod, isMetric)
    return pistonArea - rodArea
}

/**
 * Calculate extend force
 * @param {number} bore - Bore diameter (mm or inches)
 * @param {number} pressure - Pressure (bar or psi)
 * @param {boolean} isMetric - Whether to use metric units
 * @returns {Object} Force in Newtons/kgf (metric) or lbf (imperial)
 */
export function calculateExtendForce(bore: any, pressure: any, isMetric: boolean = true) {
    const area = calculatePistonArea(bore, isMetric)

    if (isMetric) {
        // Area in mm², pressure in bar
        // 1 bar = 0.1 N/mm²
        const forceN = area * pressure * 0.1
        return {
            newtons: forceN,
            kgf: forceN / 9.81,
            lbf: forceN * 0.2248
        }
    } else {
        // Area in in², pressure in psi
        const forceLbf = area * pressure
        return {
            lbf: forceLbf,
            newtons: forceLbf * 4.448,
            kgf: forceLbf * 0.4536
        }
    }
}

/**
 * Calculate retract force
 * @param {number} bore - Bore diameter (mm or inches)
 * @param {number} rod - Rod diameter (mm or inches)
 * @param {number} pressure - Pressure (bar or psi)
 * @param {boolean} isMetric - Whether to use metric units
 * @returns {Object} Force in Newtons/kgf (metric) or lbf (imperial)
 */
export function calculateRetractForce(bore: any, rod: any, pressure: any, isMetric: boolean = true) {
    const area = calculateAnnularArea(bore, rod, isMetric)

    if (isMetric) {
        const forceN = area * pressure * 0.1
        return {
            newtons: forceN,
            kgf: forceN / 9.81,
            lbf: forceN * 0.2248
        }
    } else {
        const forceLbf = area * pressure
        return {
            lbf: forceLbf,
            newtons: forceLbf * 4.448,
            kgf: forceLbf * 0.4536
        }
    }
}

/**
 * Calculate air consumption per stroke
 * @param {number} bore - Bore diameter (mm or inches)
 * @param {number} stroke - Stroke length (mm or inches)
 * @param {number} pressure - Operating pressure (bar or psi)
 * @param {boolean} isMetric - Whether to use metric units
 * @returns {Object} Air consumption in liters (metric) or cubic inches (imperial)
 */
export function calculateAirConsumption(bore: any, stroke: any, pressure: any, isMetric: boolean = true) {
    const area = calculatePistonArea(bore, isMetric)

    if (isMetric) {
        // Volume in mm³, convert to liters
        // Compression ratio: (pressure + 1.013) / 1.013 for absolute pressure
        const compressionRatio = (pressure + 1.013) / 1.013
        const volumeMm3 = area * stroke
        const volumeL = volumeMm3 / 1000000
        const freeAirL = volumeL * compressionRatio
        return {
            liters: freeAirL,
            cubicInches: freeAirL * 61.024
        }
    } else {
        // Volume in cubic inches
        // Compression ratio for PSI: (pressure + 14.7) / 14.7
        const compressionRatio = (pressure + 14.7) / 14.7
        const volumeIn3 = area * stroke
        const freeAirIn3 = volumeIn3 * compressionRatio
        return {
            cubicInches: freeAirIn3,
            liters: freeAirIn3 / 61.024
        }
    }
}

/**
 * Calculate cylinder speed based on flow rate
 * @param {number} bore - Bore diameter (mm or inches)
 * @param {number} rod - Rod diameter (mm or inches) - use 0 for extend
 * @param {number} flowRate - Flow rate in SCFM (Standard Cubic Feet per Minute)
 * @param {number} pressure - Operating pressure (bar or psi)
 * @param {boolean} isMetric - Whether dimensions are metric
 * @param {boolean} isExtend - Whether calculating extend (true) or retract (false)
 * @returns {Object} Speed in mm/s or in/s
 */
export function calculateCylinderSpeed(bore: any, rod: any, flowRate: any, pressure: any, isMetric: boolean = true, isExtend: boolean = true) {
    // Convert SCFM to actual CFM at operating pressure
    // Actual volume = Standard volume / compression ratio

    let compressionRatio
    if (isMetric) {
        compressionRatio = (pressure + 1.013) / 1.013
    } else {
        compressionRatio = (pressure + 14.7) / 14.7
    }

    // Flow rate at operating pressure (CFM)
    const actualCFM = flowRate / compressionRatio

    // Convert CFM to useful units
    // 1 CFM = 28,316,847 mm³/min = 471,947 mm³/s (or 1728 in³/min)
    let flowPerSecond
    if (isMetric) {
        flowPerSecond = actualCFM * 471947 // mm³/s
    } else {
        flowPerSecond = actualCFM * 1728 / 60 // in³/s
    }

    // Calculate effective area
    let area
    if (isExtend) {
        area = calculatePistonArea(bore, isMetric)
    } else {
        area = calculateAnnularArea(bore, rod, isMetric)
    }

    // Speed = Flow / Area
    const speed = flowPerSecond / area

    if (isMetric) {
        return {
            mmPerSec: speed,
            mPerSec: speed / 1000,
            inPerSec: speed / 25.4
        }
    } else {
        return {
            inPerSec: speed,
            mmPerSec: speed * 25.4,
            mPerSec: speed * 25.4 / 1000
        }
    }
}

/**
 * Calculate stroke time
 * @param {number} stroke - Stroke length (mm or inches)
 * @param {number} speed - Speed (mm/s or in/s)
 * @returns {number} Time in seconds
 */
export function calculateStrokeTime(stroke: any, speed: any) {
    if (speed <= 0) return Infinity
    return stroke / speed
}

/**
 * Get all metric bore sizes
 * @returns {Array<string>} Array of bore sizes as strings
 */
export function getMetricBoreSizes() {
    return Object.keys(metricCylinders)
}

/**
 * Get all imperial bore sizes
 * @returns {Array<string>} Array of bore sizes as strings
 */
export function getImperialBoreSizes() {
    return Object.keys(imperialCylinders)
}

/**
 * Get rod sizes for a given bore
 * @param {string} bore - Bore size as string
 * @param {boolean} isMetric - Whether metric or imperial
 * @returns {Array<number>} Array of rod diameters
 */
export function getRodSizes(bore: any, isMetric: boolean = true) {
    const cylinders = isMetric ? metricCylinders : imperialCylinders
    const cylinderData = cylinders[bore]
    return cylinderData ? cylinderData.rods : []
}

/**
 * Get tubing sizes for system
 * @param {boolean} isMetric - Whether metric or imperial
 * @returns {Array<Object>} Array of tubing size objects
 */
export function getTubingSizes(isMetric: boolean = true) {
    return isMetric ? tubingSizes.metric : tubingSizes.imperial
}

/**
 * Get pressure options
 * @param {boolean} isMetric - Whether metric or imperial
 * @returns {Array<Object>} Array of pressure objects
 */
export function getPressureOptions(isMetric: boolean = true) {
    return isMetric ? pressures.metric : pressures.imperial
}

/**
 * Format rod size for display
 * @param {number} rod - Rod diameter
 * @param {boolean} isMetric - Whether metric or imperial
 * @returns {string} Formatted rod size string
 */
export function formatRodSize(rod: any, isMetric: boolean = true) {
    if (isMetric) {
        return `${rod} mm`
    } else {
        // Convert decimal to fraction where appropriate
        const fractions: Record<string, string> = {
            0.0625: '1/16"',
            0.125: '1/8"',
            0.1875: '3/16"',
            0.25: '1/4"',
            0.3125: '5/16"',
            0.375: '3/8"',
            0.4375: '7/16"',
            0.5: '1/2"',
            0.5625: '9/16"',
            0.625: '5/8"',
            0.75: '3/4"',
            0.875: '7/8"',
            1: '1"',
            1.25: '1-1/4"',
            1.375: '1-3/8"',
            1.5: '1-1/2"',
            1.75: '1-3/4"',
            2: '2"',
            2.5: '2-1/2"',
            3: '3"'
        }
        return fractions[rod] || `${rod}"`
    }
}

/**
 * Format bore size for display
 * @param {string} bore - Bore size as string
 * @param {boolean} isMetric - Whether metric or imperial
 * @returns {string} Formatted bore size string
 */
export function formatBoreSize(bore: any, isMetric: boolean = true) {
    if (isMetric) {
        return `${bore} mm`
    } else {
        const fractions: Record<string, string> = {
            '0.5': '1/2"',
            '0.75': '3/4"',
            '1': '1"',
            '1.0625': '1-1/16"',
            '1.125': '1-1/8"',
            '1.5': '1-1/2"',
            '2': '2"',
            '2.5': '2-1/2"',
            '3': '3"',
            '3.25': '3-1/4"',
            '4': '4"',
            '5': '5"',
            '6': '6"',
            '8': '8"'
        }
        return fractions[bore] || `${bore}"`
    }
}

/**
 * Estimate recommended tubing size based on bore and desired speed
 * @param {number} bore - Bore diameter (mm or inches)
 * @param {number} targetSpeed - Target speed (mm/s or in/s)
 * @param {number} pressure - Operating pressure (bar or psi)
 * @param {boolean} isMetric - Whether metric or imperial
 * @returns {Object|null} Recommended tubing or null if none suitable
 */
export function recommendTubing(bore: any, targetSpeed: any, pressure: any, isMetric: boolean = true) {
    const tubing = getTubingSizes(isMetric)
    const area = calculatePistonArea(bore, isMetric)

    // Calculate required flow rate
    let compressionRatio
    if (isMetric) {
        compressionRatio = (pressure + 1.013) / 1.013
    } else {
        compressionRatio = (pressure + 14.7) / 14.7
    }

    // Required actual flow = speed * area
    let requiredActualFlow
    if (isMetric) {
        requiredActualFlow = targetSpeed * area // mm³/s
        requiredActualFlow = requiredActualFlow / 471947 // mm³/s -> CFM
    } else {
        requiredActualFlow = targetSpeed * area * 60 / 1728 // CFM
    }

    // Required SCFM
    const requiredSCFM = requiredActualFlow * compressionRatio

    // Find smallest tubing that can handle the flow
    for (const tube of tubing) {
        if (tube.maxFlow >= requiredSCFM) {
            return {
                tubing: tube,
                requiredSCFM: requiredSCFM,
                margin: ((tube.maxFlow - requiredSCFM) / requiredSCFM * 100).toFixed(0)
            }
        }
    }

    return null
}

/**
 * Deliverable free-air flow through a pneumatic line (Festo-style line sizing).
 * Isothermal compressible pipe flow with Blasius friction, iterated, plus a 0.8
 * installation factor for entrance/exit and fitting losses.
 * Validated against Festo's flow calculator: 6 bar(g) supply -> 4 bar(g) outlet
 * through 2 m of 4 mm ID tube ≈ 285 Nl/min.
 *
 * @param supplyBarG  Supply pressure, bar gauge
 * @param outletBarG  Pressure required at the outlet, bar gauge
 * @param lengthM     Tube length, metres
 * @param idMm        Tube internal diameter, mm
 */
export function calculateLineFlow(supplyBarG: number, outletBarG: number, lengthM: number, idMm: number) {
    const PATM = 1.013
    if (!(idMm > 0) || !(lengthM > 0)) return null
    if (outletBarG < 0 || outletBarG >= supplyBarG) return null

    const p1 = (supplyBarG + PATM) * 1e5   // Pa absolute
    let p2 = (outletBarG + PATM) * 1e5
    // Below the critical ratio the line chokes; clamp for a sonic-limited estimate
    const choked = p2 < 0.528 * p1
    if (choked) p2 = 0.528 * p1

    const d = idMm / 1000
    const A = (Math.PI / 4) * d * d
    const RT = 287 * 293                    // air, 20 °C
    const rhoN = 101325 / RT                // normal density
    const mu = 1.82e-5
    const dp2 = p1 * p1 - p2 * p2

    // Iterate friction factor: mdot -> Re -> lambda -> mdot
    let lambda = 0.02
    let mdot = 0
    for (let i = 0; i < 25; i++) {
        mdot = A * Math.sqrt((dp2 * d) / (lambda * lengthM * RT))
        const re = (4 * mdot) / (Math.PI * d * mu)
        lambda = re < 2300 ? 64 / Math.max(re, 1) : 0.3164 / Math.pow(re, 0.25)
    }

    const INSTALL = 0.8                     // entrance/exit + fitting allowance
    const qNm3s = (INSTALL * mdot) / rhoN   // normal (free air) m³/s
    const lpm = qNm3s * 60000
    const pm = (p1 + p2) / 2
    const velocity = (qNm3s * 101325 / pm) / A  // mean air velocity in the tube

    return {
        lpm,
        scfm: lpm / 28.3168,
        dropBar: supplyBarG - outletBarG,
        supplyAbsBar: supplyBarG + PATM,
        outletAbsBar: outletBarG + PATM,
        velocity,
        choked,
    }
}
