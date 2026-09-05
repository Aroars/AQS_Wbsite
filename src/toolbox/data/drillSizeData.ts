/**
 * Drill Size Cross-Reference Data
 * @module data/drillSizeData
 *
 * Comprehensive drill bit size reference including:
 * - Metric sizes (0.1mm to 25mm)
 * - Fractional inch sizes (1/64" to 1")
 * - Number drills (#1 to #80)
 * - Letter drills (A to Z)
 */

// Number drill sizes (#80 smallest to #1 largest)
// Format: { decimal: inches, mm: millimeters }
export const numberDrills: Record<string, any> = {
    '80': { decimal: 0.0135, mm: 0.343 },
    '79': { decimal: 0.0145, mm: 0.368 },
    '78': { decimal: 0.0160, mm: 0.406 },
    '77': { decimal: 0.0180, mm: 0.457 },
    '76': { decimal: 0.0200, mm: 0.508 },
    '75': { decimal: 0.0210, mm: 0.533 },
    '74': { decimal: 0.0225, mm: 0.572 },
    '73': { decimal: 0.0240, mm: 0.610 },
    '72': { decimal: 0.0250, mm: 0.635 },
    '71': { decimal: 0.0260, mm: 0.660 },
    '70': { decimal: 0.0280, mm: 0.711 },
    '69': { decimal: 0.0292, mm: 0.742 },
    '68': { decimal: 0.0310, mm: 0.787 },
    '67': { decimal: 0.0320, mm: 0.813 },
    '66': { decimal: 0.0330, mm: 0.838 },
    '65': { decimal: 0.0350, mm: 0.889 },
    '64': { decimal: 0.0360, mm: 0.914 },
    '63': { decimal: 0.0370, mm: 0.940 },
    '62': { decimal: 0.0380, mm: 0.965 },
    '61': { decimal: 0.0390, mm: 0.991 },
    '60': { decimal: 0.0400, mm: 1.016 },
    '59': { decimal: 0.0410, mm: 1.041 },
    '58': { decimal: 0.0420, mm: 1.067 },
    '57': { decimal: 0.0430, mm: 1.092 },
    '56': { decimal: 0.0465, mm: 1.181 },
    '55': { decimal: 0.0520, mm: 1.321 },
    '54': { decimal: 0.0550, mm: 1.397 },
    '53': { decimal: 0.0595, mm: 1.511 },
    '52': { decimal: 0.0635, mm: 1.613 },
    '51': { decimal: 0.0670, mm: 1.702 },
    '50': { decimal: 0.0700, mm: 1.778 },
    '49': { decimal: 0.0730, mm: 1.854 },
    '48': { decimal: 0.0760, mm: 1.930 },
    '47': { decimal: 0.0785, mm: 1.994 },
    '46': { decimal: 0.0810, mm: 2.057 },
    '45': { decimal: 0.0820, mm: 2.083 },
    '44': { decimal: 0.0860, mm: 2.184 },
    '43': { decimal: 0.0890, mm: 2.261 },
    '42': { decimal: 0.0935, mm: 2.375 },
    '41': { decimal: 0.0960, mm: 2.438 },
    '40': { decimal: 0.0980, mm: 2.489 },
    '39': { decimal: 0.0995, mm: 2.527 },
    '38': { decimal: 0.1015, mm: 2.578 },
    '37': { decimal: 0.1040, mm: 2.642 },
    '36': { decimal: 0.1065, mm: 2.705 },
    '35': { decimal: 0.1100, mm: 2.794 },
    '34': { decimal: 0.1110, mm: 2.819 },
    '33': { decimal: 0.1130, mm: 2.870 },
    '32': { decimal: 0.1160, mm: 2.946 },
    '31': { decimal: 0.1200, mm: 3.048 },
    '30': { decimal: 0.1285, mm: 3.264 },
    '29': { decimal: 0.1360, mm: 3.454 },
    '28': { decimal: 0.1405, mm: 3.569 },
    '27': { decimal: 0.1440, mm: 3.658 },
    '26': { decimal: 0.1470, mm: 3.734 },
    '25': { decimal: 0.1495, mm: 3.797 },
    '24': { decimal: 0.1520, mm: 3.861 },
    '23': { decimal: 0.1540, mm: 3.912 },
    '22': { decimal: 0.1570, mm: 3.988 },
    '21': { decimal: 0.1590, mm: 4.039 },
    '20': { decimal: 0.1610, mm: 4.089 },
    '19': { decimal: 0.1660, mm: 4.216 },
    '18': { decimal: 0.1695, mm: 4.305 },
    '17': { decimal: 0.1730, mm: 4.394 },
    '16': { decimal: 0.1770, mm: 4.496 },
    '15': { decimal: 0.1800, mm: 4.572 },
    '14': { decimal: 0.1820, mm: 4.623 },
    '13': { decimal: 0.1850, mm: 4.699 },
    '12': { decimal: 0.1890, mm: 4.801 },
    '11': { decimal: 0.1910, mm: 4.851 },
    '10': { decimal: 0.1935, mm: 4.915 },
    '9': { decimal: 0.1960, mm: 4.978 },
    '8': { decimal: 0.1990, mm: 5.055 },
    '7': { decimal: 0.2010, mm: 5.105 },
    '6': { decimal: 0.2040, mm: 5.182 },
    '5': { decimal: 0.2055, mm: 5.220 },
    '4': { decimal: 0.2090, mm: 5.309 },
    '3': { decimal: 0.2130, mm: 5.410 },
    '2': { decimal: 0.2210, mm: 5.613 },
    '1': { decimal: 0.2280, mm: 5.791 }
}

// Letter drill sizes (A smallest to Z largest)
export const letterDrills: Record<string, any> = {
    'A': { decimal: 0.2340, mm: 5.944 },
    'B': { decimal: 0.2380, mm: 6.045 },
    'C': { decimal: 0.2420, mm: 6.147 },
    'D': { decimal: 0.2460, mm: 6.248 },
    'E': { decimal: 0.2500, mm: 6.350 },
    'F': { decimal: 0.2570, mm: 6.528 },
    'G': { decimal: 0.2610, mm: 6.629 },
    'H': { decimal: 0.2660, mm: 6.756 },
    'I': { decimal: 0.2720, mm: 6.909 },
    'J': { decimal: 0.2770, mm: 7.036 },
    'K': { decimal: 0.2810, mm: 7.137 },
    'L': { decimal: 0.2900, mm: 7.366 },
    'M': { decimal: 0.2950, mm: 7.493 },
    'N': { decimal: 0.3020, mm: 7.671 },
    'O': { decimal: 0.3160, mm: 8.026 },
    'P': { decimal: 0.3230, mm: 8.204 },
    'Q': { decimal: 0.3320, mm: 8.433 },
    'R': { decimal: 0.3390, mm: 8.611 },
    'S': { decimal: 0.3480, mm: 8.839 },
    'T': { decimal: 0.3580, mm: 9.093 },
    'U': { decimal: 0.3680, mm: 9.347 },
    'V': { decimal: 0.3770, mm: 9.576 },
    'W': { decimal: 0.3860, mm: 9.804 },
    'X': { decimal: 0.3970, mm: 10.084 },
    'Y': { decimal: 0.4040, mm: 10.262 },
    'Z': { decimal: 0.4130, mm: 10.490 }
}

// Fractional inch drill sizes (1/64" to 1")
export const fractionalDrills: Record<string, any> = {
    '1/64': { decimal: 0.0156, mm: 0.397, numerator: 1, denominator: 64 },
    '1/32': { decimal: 0.0313, mm: 0.794, numerator: 1, denominator: 32 },
    '3/64': { decimal: 0.0469, mm: 1.191, numerator: 3, denominator: 64 },
    '1/16': { decimal: 0.0625, mm: 1.588, numerator: 1, denominator: 16 },
    '5/64': { decimal: 0.0781, mm: 1.984, numerator: 5, denominator: 64 },
    '3/32': { decimal: 0.0938, mm: 2.381, numerator: 3, denominator: 32 },
    '7/64': { decimal: 0.1094, mm: 2.778, numerator: 7, denominator: 64 },
    '1/8': { decimal: 0.1250, mm: 3.175, numerator: 1, denominator: 8 },
    '9/64': { decimal: 0.1406, mm: 3.572, numerator: 9, denominator: 64 },
    '5/32': { decimal: 0.1563, mm: 3.969, numerator: 5, denominator: 32 },
    '11/64': { decimal: 0.1719, mm: 4.366, numerator: 11, denominator: 64 },
    '3/16': { decimal: 0.1875, mm: 4.763, numerator: 3, denominator: 16 },
    '13/64': { decimal: 0.2031, mm: 5.159, numerator: 13, denominator: 64 },
    '7/32': { decimal: 0.2188, mm: 5.556, numerator: 7, denominator: 32 },
    '15/64': { decimal: 0.2344, mm: 5.953, numerator: 15, denominator: 64 },
    '1/4': { decimal: 0.2500, mm: 6.350, numerator: 1, denominator: 4 },
    '17/64': { decimal: 0.2656, mm: 6.747, numerator: 17, denominator: 64 },
    '9/32': { decimal: 0.2813, mm: 7.144, numerator: 9, denominator: 32 },
    '19/64': { decimal: 0.2969, mm: 7.541, numerator: 19, denominator: 64 },
    '5/16': { decimal: 0.3125, mm: 7.938, numerator: 5, denominator: 16 },
    '21/64': { decimal: 0.3281, mm: 8.334, numerator: 21, denominator: 64 },
    '11/32': { decimal: 0.3438, mm: 8.731, numerator: 11, denominator: 32 },
    '23/64': { decimal: 0.3594, mm: 9.128, numerator: 23, denominator: 64 },
    '3/8': { decimal: 0.3750, mm: 9.525, numerator: 3, denominator: 8 },
    '25/64': { decimal: 0.3906, mm: 9.922, numerator: 25, denominator: 64 },
    '13/32': { decimal: 0.4063, mm: 10.319, numerator: 13, denominator: 32 },
    '27/64': { decimal: 0.4219, mm: 10.716, numerator: 27, denominator: 64 },
    '7/16': { decimal: 0.4375, mm: 11.113, numerator: 7, denominator: 16 },
    '29/64': { decimal: 0.4531, mm: 11.509, numerator: 29, denominator: 64 },
    '15/32': { decimal: 0.4688, mm: 11.906, numerator: 15, denominator: 32 },
    '31/64': { decimal: 0.4844, mm: 12.303, numerator: 31, denominator: 64 },
    '1/2': { decimal: 0.5000, mm: 12.700, numerator: 1, denominator: 2 },
    '33/64': { decimal: 0.5156, mm: 13.097, numerator: 33, denominator: 64 },
    '17/32': { decimal: 0.5313, mm: 13.494, numerator: 17, denominator: 32 },
    '35/64': { decimal: 0.5469, mm: 13.891, numerator: 35, denominator: 64 },
    '9/16': { decimal: 0.5625, mm: 14.288, numerator: 9, denominator: 16 },
    '37/64': { decimal: 0.5781, mm: 14.684, numerator: 37, denominator: 64 },
    '19/32': { decimal: 0.5938, mm: 15.081, numerator: 19, denominator: 32 },
    '39/64': { decimal: 0.6094, mm: 15.478, numerator: 39, denominator: 64 },
    '5/8': { decimal: 0.6250, mm: 15.875, numerator: 5, denominator: 8 },
    '41/64': { decimal: 0.6406, mm: 16.272, numerator: 41, denominator: 64 },
    '21/32': { decimal: 0.6563, mm: 16.669, numerator: 21, denominator: 32 },
    '43/64': { decimal: 0.6719, mm: 17.066, numerator: 43, denominator: 64 },
    '11/16': { decimal: 0.6875, mm: 17.463, numerator: 11, denominator: 16 },
    '45/64': { decimal: 0.7031, mm: 17.859, numerator: 45, denominator: 64 },
    '23/32': { decimal: 0.7188, mm: 18.256, numerator: 23, denominator: 32 },
    '47/64': { decimal: 0.7344, mm: 18.653, numerator: 47, denominator: 64 },
    '3/4': { decimal: 0.7500, mm: 19.050, numerator: 3, denominator: 4 },
    '49/64': { decimal: 0.7656, mm: 19.447, numerator: 49, denominator: 64 },
    '25/32': { decimal: 0.7813, mm: 19.844, numerator: 25, denominator: 32 },
    '51/64': { decimal: 0.7969, mm: 20.241, numerator: 51, denominator: 64 },
    '13/16': { decimal: 0.8125, mm: 20.638, numerator: 13, denominator: 16 },
    '53/64': { decimal: 0.8281, mm: 21.034, numerator: 53, denominator: 64 },
    '27/32': { decimal: 0.8438, mm: 21.431, numerator: 27, denominator: 32 },
    '55/64': { decimal: 0.8594, mm: 21.828, numerator: 55, denominator: 64 },
    '7/8': { decimal: 0.8750, mm: 22.225, numerator: 7, denominator: 8 },
    '57/64': { decimal: 0.8906, mm: 22.622, numerator: 57, denominator: 64 },
    '29/32': { decimal: 0.9063, mm: 23.019, numerator: 29, denominator: 32 },
    '59/64': { decimal: 0.9219, mm: 23.416, numerator: 59, denominator: 64 },
    '15/16': { decimal: 0.9375, mm: 23.813, numerator: 15, denominator: 16 },
    '61/64': { decimal: 0.9531, mm: 24.209, numerator: 61, denominator: 64 },
    '31/32': { decimal: 0.9688, mm: 24.606, numerator: 31, denominator: 32 },
    '63/64': { decimal: 0.9844, mm: 25.003, numerator: 63, denominator: 64 },
    '1': { decimal: 1.0000, mm: 25.400, numerator: 1, denominator: 1 }
}

// Common metric drill sizes (0.1mm increments for small, 0.5mm for larger)
export const metricDrills = [
    0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95,
    1.0, 1.05, 1.1, 1.15, 1.2, 1.25, 1.3, 1.35, 1.4, 1.45, 1.5, 1.55, 1.6, 1.65, 1.7, 1.75, 1.8, 1.85, 1.9, 1.95,
    2.0, 2.05, 2.1, 2.15, 2.2, 2.25, 2.3, 2.35, 2.4, 2.45, 2.5, 2.6, 2.7, 2.8, 2.9,
    3.0, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9,
    4.0, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9,
    5.0, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9,
    6.0, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9,
    7.0, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9,
    8.0, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 8.9,
    9.0, 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8, 9.9,
    10.0, 10.2, 10.5, 11.0, 11.5, 12.0, 12.5, 13.0, 13.5, 14.0, 14.5,
    15.0, 15.5, 16.0, 16.5, 17.0, 17.5, 18.0, 18.5, 19.0, 19.5,
    20.0, 20.5, 21.0, 21.5, 22.0, 22.5, 23.0, 23.5, 24.0, 24.5, 25.0, 25.5, 26.0, 26.5
]

// Helper functions

/**
 * Convert mm to inches
 */
export function mmToInch(mm: any) {
    return mm / 25.4
}

/**
 * Convert inches to mm
 */
export function inchToMm(inch: any) {
    return inch * 25.4
}

/**
 * Get all drills sorted by size (smallest to largest)
 * Returns array of { size: mm, type: 'metric'|'fractional'|'number'|'letter', label: string }
 */
export function getAllDrillsSorted() {
    const drills: any[] = []

    // Add metric drills
    metricDrills.forEach(mm => {
        drills.push({
            size: mm,
            type: 'metric',
            label: `${mm}mm`,
            decimal: mmToInch(mm),
            mm: mm
        })
    })

    // Add number drills
    Object.entries(numberDrills).forEach(([num, data]) => {
        drills.push({
            size: data.mm,
            type: 'number',
            label: `#${num}`,
            decimal: data.decimal,
            mm: data.mm
        })
    })

    // Add letter drills
    Object.entries(letterDrills).forEach(([letter, data]) => {
        drills.push({
            size: data.mm,
            type: 'letter',
            label: letter,
            decimal: data.decimal,
            mm: data.mm
        })
    })

    // Add fractional drills
    Object.entries(fractionalDrills).forEach(([fraction, data]) => {
        drills.push({
            size: data.mm,
            type: 'fractional',
            label: `${fraction}"`,
            decimal: data.decimal,
            mm: data.mm
        })
    })

    // Sort by size
    drills.sort((a, b) => a.size - b.size)

    return drills
}

/**
 * Find the closest drill to a given size
 * @param {number} targetMm - Target size in mm
 * @param {string} preferredType - Optional preferred type ('metric', 'fractional', 'number', 'letter')
 * @returns {object} - Closest drill info
 */
export function findClosestDrill(targetMm: any, preferredType: any = null) {
    const allDrills = getAllDrillsSorted()

    let closest = null
    let closestDiff = Infinity

    allDrills.forEach(drill => {
        const diff = Math.abs(drill.size - targetMm)
        if (diff < closestDiff) {
            closestDiff = diff
            closest = drill
        }
    })

    // If preferred type specified, also find closest of that type
    let preferredClosest = null
    if (preferredType) {
        let preferredDiff = Infinity
        allDrills.forEach(drill => {
            if (drill.type === preferredType) {
                const diff = Math.abs(drill.size - targetMm)
                if (diff < preferredDiff) {
                    preferredDiff = diff
                    preferredClosest = drill
                }
            }
        })
    }

    return {
        closest: closest,
        difference: closestDiff,
        preferred: preferredClosest
    }
}

/**
 * Find all drills within a tolerance of a target size
 * @param {number} targetMm - Target size in mm
 * @param {number} toleranceMm - Tolerance in mm (default 0.1mm)
 * @returns {array} - Array of matching drills
 */
export function findDrillsInRange(targetMm: any, toleranceMm: number = 0.1) {
    const allDrills = getAllDrillsSorted()

    return allDrills.filter(drill =>
        Math.abs(drill.size - targetMm) <= toleranceMm
    )
}

/**
 * Get equivalent drills for a given size
 * Returns closest drill in each system
 */
export function getEquivalents(targetMm: any) {
    const result = {
        metric: null,
        fractional: null,
        number: null,
        letter: null
    }

    // Find closest metric
    let closestMetric = null
    let closestMetricDiff = Infinity
    metricDrills.forEach(mm => {
        const diff = Math.abs(mm - targetMm)
        if (diff < closestMetricDiff) {
            closestMetricDiff = diff
            closestMetric = { size: mm, label: `${mm}mm`, diff: diff }
        }
    })
    result.metric = closestMetric

    // Find closest fractional
    let closestFrac = null
    let closestFracDiff = Infinity
    Object.entries(fractionalDrills).forEach(([fraction, data]) => {
        const diff = Math.abs(data.mm - targetMm)
        if (diff < closestFracDiff) {
            closestFracDiff = diff
            closestFrac = { size: data.mm, label: `${fraction}"`, decimal: data.decimal, diff: diff }
        }
    })
    result.fractional = closestFrac

    // Find closest number drill
    let closestNum = null
    let closestNumDiff = Infinity
    Object.entries(numberDrills).forEach(([num, data]) => {
        const diff = Math.abs(data.mm - targetMm)
        if (diff < closestNumDiff) {
            closestNumDiff = diff
            closestNum = { size: data.mm, label: `#${num}`, decimal: data.decimal, diff: diff }
        }
    })
    result.number = closestNum

    // Find closest letter drill
    let closestLetter = null
    let closestLetterDiff = Infinity
    Object.entries(letterDrills).forEach(([letter, data]) => {
        const diff = Math.abs(data.mm - targetMm)
        if (diff < closestLetterDiff) {
            closestLetterDiff = diff
            closestLetter = { size: data.mm, label: letter, decimal: data.decimal, diff: diff }
        }
    })
    result.letter = closestLetter

    return result
}

/**
 * Get number drill by number
 */
export function getNumberDrill(num: any) {
    return numberDrills[String(num)] || null
}

/**
 * Get letter drill by letter
 */
export function getLetterDrill(letter: any) {
    return letterDrills[letter.toUpperCase()] || null
}

/**
 * Get fractional drill by fraction string
 */
export function getFractionalDrill(fraction: any) {
    return fractionalDrills[fraction] || null
}

/**
 * Format decimal inches for display
 */
export function formatDecimal(decimal: any) {
    return decimal.toFixed(4)
}

/**
 * Format mm for display
 */
export function formatMm(mm: any) {
    return mm.toFixed(3)
}

/**
 * Get all number drill numbers in order (80 to 1)
 */
export function getNumberDrillList() {
    return Object.keys(numberDrills).sort((a, b) => parseInt(b) - parseInt(a))
}

/**
 * Get all letter drill letters in order (A to Z)
 */
export function getLetterDrillList() {
    return Object.keys(letterDrills).sort()
}

/**
 * Get all fractional sizes in order
 */
export function getFractionalDrillList() {
    return Object.keys(fractionalDrills).sort((a, b) => {
        return fractionalDrills[a].decimal - fractionalDrills[b].decimal
    })
}
