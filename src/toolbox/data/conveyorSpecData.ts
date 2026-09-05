/**
 * Conveyor Spec Solver Data
 * @module data/conveyorSpecData
 *
 * Type definitions, unit conversions, and solver functions
 * for conveyor geometry calculations.
 */

// Conveyor type definitions
export const conveyorTypes = {
    straight: {
        id: 'straight',
        name: 'Straight',
        description: 'Horizontal conveyor with no incline',
        hasIncline: false
    },
    incline: {
        id: 'incline',
        name: 'Incline/Decline',
        description: 'Simple angled conveyor',
        hasIncline: true
    },
    lType: {
        id: 'lType',
        name: 'L Type',
        description: 'Horizontal section then incline (or reverse)',
        hasIncline: true,
        hasSections: true
    },
    zType: {
        id: 'zType',
        name: 'Z Type',
        description: 'Horizontal → Incline → Horizontal',
        hasIncline: true,
        hasSections: true
    }
}

// Unit system definitions
export const unitSystems = {
    imperial: {
        id: 'imperial',
        name: 'Imperial',
        length: { unit: 'ft', label: 'ft', factor: 1 },
        smallLength: { unit: 'in', label: 'in', factor: 12 }, // 12 in per ft
        weight: { unit: 'lbs', label: 'lbs', factor: 1 },
        linearWeight: { unit: 'lbs/ft', label: 'lbs/ft' }
    },
    metric: {
        id: 'metric',
        name: 'Metric',
        length: { unit: 'm', label: 'm', factor: 0.3048 }, // ft to m
        smallLength: { unit: 'mm', label: 'mm', factor: 304.8 }, // ft to mm
        weight: { unit: 'kg', label: 'kg', factor: 0.453592 }, // lbs to kg
        linearWeight: { unit: 'kg/m', label: 'kg/m' }
    }
}

// Conversion factors (base unit is feet for length, lbs for weight)
export const conversions = {
    ftToM: 0.3048,
    mToFt: 3.28084,
    inToMm: 25.4,
    mmToIn: 0.0393701,
    lbsToKg: 0.453592,
    kgToLbs: 2.20462
}

/**
 * Convert degrees to radians
 */
export function degToRad(degrees: any) {
    return degrees * (Math.PI / 180)
}

/**
 * Convert radians to degrees
 */
export function radToDeg(radians: any) {
    return radians * (180 / Math.PI)
}

/**
 * Solve for missing incline values given known values
 * Uses trigonometry: tan(angle) = height / floorLength
 *                    actualLength = floorLength / cos(angle)
 *
 * @param {Object} known - Object with known values (floorLength, heightDiff, angle, actualLength)
 * @returns {Object} - Object with all calculated values
 */
export function solveIncline(known: any) {
    const result = {
        floorLength: known.floorLength || null,
        heightDiff: known.heightDiff || null,
        angle: known.angle || null,
        actualLength: known.actualLength || null,
        solved: false,
        error: null as string | null
    }

    // Count how many values we have
    const hasFloor = known.floorLength != null && known.floorLength > 0
    const hasHeight = known.heightDiff != null // Can be 0 for flat
    const hasAngle = known.angle != null
    const hasActual = known.actualLength != null && known.actualLength > 0

    const knownCount = [hasFloor, hasHeight, hasAngle, hasActual].filter(Boolean).length

    if (knownCount < 2) {
        result.error = 'Need at least 2 values to solve'
        return result
    }

    try {
        // Case 1: Have floor length and height diff
        if (hasFloor && hasHeight) {
            const angleRad = Math.atan(Math.abs(known.heightDiff) / known.floorLength)
            result.angle = radToDeg(angleRad)
            result.actualLength = known.floorLength / Math.cos(angleRad)
            result.floorLength = known.floorLength
            result.heightDiff = known.heightDiff
            result.solved = true
        }
        // Case 2: Have floor length and angle
        else if (hasFloor && hasAngle) {
            const angleRad = degToRad(known.angle)
            result.heightDiff = known.floorLength * Math.tan(angleRad)
            result.actualLength = known.floorLength / Math.cos(angleRad)
            result.floorLength = known.floorLength
            result.angle = known.angle
            result.solved = true
        }
        // Case 3: Have floor length and actual length
        else if (hasFloor && hasActual) {
            if (known.actualLength < known.floorLength) {
                result.error = 'Actual length cannot be less than floor length'
                return result
            }
            const angleRad = Math.acos(known.floorLength / known.actualLength)
            result.angle = radToDeg(angleRad)
            result.heightDiff = known.floorLength * Math.tan(angleRad)
            result.floorLength = known.floorLength
            result.actualLength = known.actualLength
            result.solved = true
        }
        // Case 4: Have height diff and angle
        else if (hasHeight && hasAngle) {
            const angleRad = degToRad(known.angle)
            if (Math.tan(angleRad) === 0) {
                result.error = 'Cannot solve with 0 degree angle and height'
                return result
            }
            result.floorLength = Math.abs(known.heightDiff) / Math.tan(angleRad)
            result.actualLength = result.floorLength / Math.cos(angleRad)
            result.heightDiff = known.heightDiff
            result.angle = known.angle
            result.solved = true
        }
        // Case 5: Have height diff and actual length
        else if (hasHeight && hasActual) {
            // actualLength² = floorLength² + heightDiff²
            const floorLengthSq = known.actualLength * known.actualLength - known.heightDiff * known.heightDiff
            if (floorLengthSq < 0) {
                result.error = 'Invalid dimensions: height cannot exceed actual length'
                return result
            }
            result.floorLength = Math.sqrt(floorLengthSq)
            const angleRad = Math.atan(Math.abs(known.heightDiff) / result.floorLength)
            result.angle = radToDeg(angleRad)
            result.heightDiff = known.heightDiff
            result.actualLength = known.actualLength
            result.solved = true
        }
        // Case 6: Have angle and actual length
        else if (hasAngle && hasActual) {
            const angleRad = degToRad(known.angle)
            result.floorLength = known.actualLength * Math.cos(angleRad)
            result.heightDiff = known.actualLength * Math.sin(angleRad)
            result.angle = known.angle
            result.actualLength = known.actualLength
            result.solved = true
        }
    } catch (e: any) {
        result.error = 'Calculation error: ' + e.message
    }

    return result
}

/**
 * Solve L-Type conveyor geometry
 * L-Type has: horizontal section (infeedX) + incline section
 *
 * @param {Object} known - Known values including infeedX and incline params
 * @returns {Object} - Solved geometry
 */
export function solveLType(known: any) {
    const result = {
        infeedX: known.infeedX || 0,
        inclineFloorLength: null,
        inclineActualLength: null,
        heightDiff: known.heightDiff || null,
        angle: known.angle || null,
        totalFloorLength: null,
        totalActualLength: null,
        solved: false,
        error: null as string | null
    }

    // First solve the incline portion
    const inclineKnown = {
        floorLength: known.inclineFloorLength,
        heightDiff: known.heightDiff,
        angle: known.angle,
        actualLength: known.inclineActualLength
    }

    // If we have total floor length and infeedX, derive incline floor length
    if (known.totalFloorLength && known.infeedX) {
        inclineKnown.floorLength = known.totalFloorLength - known.infeedX
    }

    const inclineResult = solveIncline(inclineKnown)

    if (inclineResult.error) {
        result.error = inclineResult.error
        return result
    }

    if (inclineResult.solved) {
        result.inclineFloorLength = inclineResult.floorLength
        result.inclineActualLength = inclineResult.actualLength
        result.heightDiff = inclineResult.heightDiff
        result.angle = inclineResult.angle
        result.totalFloorLength = (known.infeedX || 0) + inclineResult.floorLength
        result.totalActualLength = (known.infeedX || 0) + inclineResult.actualLength
        result.solved = true
    }

    return result
}

/**
 * Solve Z-Type conveyor geometry
 * Z-Type has: horizontal (infeedX) + incline + horizontal (dischargeX)
 *
 * @param {Object} known - Known values including infeedX, dischargeX, and incline params
 * @returns {Object} - Solved geometry
 */
export function solveZType(known: any) {
    const result = {
        infeedX: known.infeedX || 0,
        dischargeX: known.dischargeX || 0,
        inclineFloorLength: null,
        inclineActualLength: null,
        heightDiff: known.heightDiff || null,
        angle: known.angle || null,
        totalFloorLength: null,
        totalActualLength: null,
        solved: false,
        error: null as string | null
    }

    // First solve the incline portion
    const inclineKnown = {
        floorLength: known.inclineFloorLength,
        heightDiff: known.heightDiff,
        angle: known.angle,
        actualLength: known.inclineActualLength
    }

    // If we have total floor length and both horizontal sections, derive incline floor length
    if (known.totalFloorLength && known.infeedX != null && known.dischargeX != null) {
        inclineKnown.floorLength = known.totalFloorLength - known.infeedX - known.dischargeX
    }

    const inclineResult = solveIncline(inclineKnown)

    if (inclineResult.error) {
        result.error = inclineResult.error
        return result
    }

    if (inclineResult.solved) {
        result.inclineFloorLength = inclineResult.floorLength
        result.inclineActualLength = inclineResult.actualLength
        result.heightDiff = inclineResult.heightDiff
        result.angle = inclineResult.angle
        result.totalFloorLength = (known.infeedX || 0) + inclineResult.floorLength + (known.dischargeX || 0)
        result.totalActualLength = (known.infeedX || 0) + inclineResult.actualLength + (known.dischargeX || 0)
        result.solved = true
    }

    return result
}

/**
 * Calculate conveyor loading for unit products
 *
 * @param {Object} params - Calculation parameters
 * @returns {Object} - Loading results
 */
export function calculateLoading(params: any) {
    const {
        actualLength,      // Total belt/chain length (ft)
        productWeight,     // Weight per product (lbs)
        productLength,     // Product length in travel direction (ft)
        productSpacing     // Gap between products (ft)
    } = params

    if (!actualLength || actualLength <= 0) {
        return { error: 'Need actual conveyor length' }
    }

    if (!productLength || productLength <= 0) {
        return { error: 'Need product length' }
    }

    const pitch = productLength + (productSpacing || 0)
    const productsOnConveyor = Math.floor(actualLength / pitch)
    const totalProductWeight = productsOnConveyor * (productWeight || 0)
    const beltLoading = actualLength > 0 ? totalProductWeight / actualLength : 0

    return {
        productsOnConveyor,
        totalProductWeight,
        beltLoading,
        pitch
    }
}

/**
 * Convert length value between unit systems
 *
 * @param {number} value - Value to convert
 * @param {string} fromUnit - Source unit (ft, in, m, mm)
 * @param {string} toUnit - Target unit (ft, in, m, mm)
 * @returns {number} - Converted value
 */
export function convertLength(value: any, fromUnit: any, toUnit: any) {
    if (fromUnit === toUnit) return value

    // Convert to feet first (base unit)
    let inFeet
    switch (fromUnit) {
        case 'ft': inFeet = value; break
        case 'in': inFeet = value / 12; break
        case 'm': inFeet = value * conversions.mToFt; break
        case 'mm': inFeet = value * conversions.mToFt / 1000; break
        default: inFeet = value
    }

    // Convert from feet to target unit
    switch (toUnit) {
        case 'ft': return inFeet
        case 'in': return inFeet * 12
        case 'm': return inFeet * conversions.ftToM
        case 'mm': return inFeet * conversions.ftToM * 1000
        default: return inFeet
    }
}

/**
 * Convert weight value between unit systems
 *
 * @param {number} value - Value to convert
 * @param {string} fromUnit - Source unit (lbs, kg)
 * @param {string} toUnit - Target unit (lbs, kg)
 * @returns {number} - Converted value
 */
export function convertWeight(value: any, fromUnit: any, toUnit: any) {
    if (fromUnit === toUnit) return value

    if (fromUnit === 'lbs' && toUnit === 'kg') {
        return value * conversions.lbsToKg
    } else if (fromUnit === 'kg' && toUnit === 'lbs') {
        return value * conversions.kgToLbs
    }

    return value
}

/**
 * Format a number for display
 *
 * @param {number} value - Value to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} - Formatted string
 */
export function formatNumber(value: any, decimals: number = 2) {
    if (value == null || isNaN(value)) return '-'
    return value.toFixed(decimals)
}
