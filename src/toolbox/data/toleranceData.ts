/**
 * ISO 286 Hole/Shaft Tolerance Data
 * @module data/toleranceData
 *
 * Complete tolerance tables based on ISO 286-1:2010 and ISO 286-2:2010
 * Covers nominal sizes from 0 to 500mm
 * Includes common hole and shaft tolerance classes
 */

// Nominal diameter ranges (mm) per ISO 286
// Format: [min, max] - "over min, up to and including max"
export const nominalRanges = [
    { id: '0-3', min: 0, max: 3, label: '0 - 3 mm' },
    { id: '3-6', min: 3, max: 6, label: '3 - 6 mm' },
    { id: '6-10', min: 6, max: 10, label: '6 - 10 mm' },
    { id: '10-18', min: 10, max: 18, label: '10 - 18 mm' },
    { id: '18-30', min: 18, max: 30, label: '18 - 30 mm' },
    { id: '30-50', min: 30, max: 50, label: '30 - 50 mm' },
    { id: '50-80', min: 50, max: 80, label: '50 - 80 mm' },
    { id: '80-120', min: 80, max: 120, label: '80 - 120 mm' },
    { id: '120-180', min: 120, max: 180, label: '120 - 180 mm' },
    { id: '180-250', min: 180, max: 250, label: '180 - 250 mm' },
    { id: '250-315', min: 250, max: 315, label: '250 - 315 mm' },
    { id: '315-400', min: 315, max: 400, label: '315 - 400 mm' },
    { id: '400-500', min: 400, max: 500, label: '400 - 500 mm' }
]

// Standard tolerance grades (IT) in microns per ISO 286-1
// Values for each nominal range
export const itGrades: Record<string, any> = {
    // IT Grade: [values for each nominal range from 0-3 to 400-500]
    'IT01': [0.3, 0.4, 0.4, 0.5, 0.6, 0.6, 0.8, 1, 1.2, 2, 2.5, 3, 4],
    'IT0': [0.5, 0.6, 0.6, 0.8, 1, 1, 1.2, 1.5, 2, 3, 4, 5, 6],
    'IT1': [0.8, 1, 1, 1.2, 1.5, 1.5, 2, 2.5, 3.5, 4.5, 6, 7, 8],
    'IT2': [1.2, 1.5, 1.5, 2, 2.5, 2.5, 3, 4, 5, 7, 8, 9, 10],
    'IT3': [2, 2.5, 2.5, 3, 4, 4, 5, 6, 8, 10, 12, 13, 15],
    'IT4': [3, 4, 4, 5, 6, 7, 8, 10, 12, 14, 16, 18, 20],
    'IT5': [4, 5, 6, 8, 9, 11, 13, 15, 18, 20, 23, 25, 27],
    'IT6': [6, 8, 9, 11, 13, 16, 19, 22, 25, 29, 32, 36, 40],
    'IT7': [10, 12, 15, 18, 21, 25, 30, 35, 40, 46, 52, 57, 63],
    'IT8': [14, 18, 22, 27, 33, 39, 46, 54, 63, 72, 81, 89, 97],
    'IT9': [25, 30, 36, 43, 52, 62, 74, 87, 100, 115, 130, 140, 155],
    'IT10': [40, 48, 58, 70, 84, 100, 120, 140, 160, 185, 210, 230, 250],
    'IT11': [60, 75, 90, 110, 130, 160, 190, 220, 250, 290, 320, 360, 400],
    'IT12': [100, 120, 150, 180, 210, 250, 300, 350, 400, 460, 520, 570, 630],
    'IT13': [140, 180, 220, 270, 330, 390, 460, 540, 630, 720, 810, 890, 970],
    'IT14': [250, 300, 360, 430, 520, 620, 740, 870, 1000, 1150, 1300, 1400, 1550],
    'IT15': [400, 480, 580, 700, 840, 1000, 1200, 1400, 1600, 1850, 2100, 2300, 2500],
    'IT16': [600, 750, 900, 1100, 1300, 1600, 1900, 2200, 2500, 2900, 3200, 3600, 4000],
    'IT17': [1000, 1200, 1500, 1800, 2100, 2500, 3000, 3500, 4000, 4600, 5200, 5700, 6300],
    'IT18': [1400, 1800, 2200, 2700, 3300, 3900, 4600, 5400, 6300, 7200, 8100, 8900, 9700]
}

// Fundamental deviations for HOLES (uppercase) in microns
// Positive values = material added (smaller hole), Negative = material removed (larger hole)
// Format: upper deviation (ES) for each nominal range
export const holeDeviations: Record<string, any> = {
    // Clearance fits (negative deviation = larger hole)
    'A': [270, 270, 280, 290, 300, 310, 320, 340, 360, 380, 410, 440, 480],
    'B': [140, 140, 150, 150, 160, 170, 180, 190, 200, 210, 230, 240, 260],
    'C': [60, 70, 80, 95, 110, 120, 130, 140, 150, 170, 180, 200, 210],
    'D': [20, 30, 40, 50, 65, 80, 100, 120, 145, 170, 190, 210, 230],
    'E': [14, 20, 25, 32, 40, 50, 60, 72, 85, 100, 110, 125, 135],
    'F': [6, 10, 13, 16, 20, 25, 30, 36, 43, 50, 56, 62, 68],
    'G': [2, 4, 5, 6, 7, 9, 10, 12, 14, 15, 17, 18, 20],
    // H = zero line (reference)
    'H': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    // Transition and interference fits (positive deviation = smaller hole)
    'JS': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Symmetric around zero
    'J': [2, 3, 4, 5, 5, 6, 6, 6, 6, 8, 8, 10, 10], // Values depend on IT grade
    'K': [0, 1, 1, 1, 2, 2, 2, 3, 3, 4, 4, 4, 5],
    'M': [2, 4, 6, 7, 8, 9, 11, 13, 15, 17, 20, 21, 23],
    'N': [4, 8, 10, 12, 15, 17, 20, 23, 27, 31, 34, 37, 40],
    'P': [6, 12, 15, 18, 22, 26, 32, 37, 43, 50, 56, 62, 68],
    'R': [10, 15, 19, 23, 28, 34, 41, 48, 55, 63, 72, 78, 86],
    'S': [14, 19, 23, 28, 35, 43, 53, 59, 68, 79, 88, 98, 108],
    'T': [18, 23, 28, 34, 41, 54, 66, 75, 88, 100, 114, 126, 140],
    'U': [22, 28, 34, 40, 49, 64, 78, 91, 106, 122, 137, 151, 165],
    'V': [26, 34, 42, 50, 60, 76, 94, 110, 130, 150, 170, 190, 210],
    'X': [32, 42, 52, 64, 77, 97, 122, 146, 174, 204, 232, 264, 296],
    'Y': [40, 52, 64, 80, 97, 122, 152, 180, 214, 252, 290, 328, 366],
    'Z': [50, 64, 80, 97, 119, 149, 185, 218, 258, 302, 346, 390, 434],
    'ZA': [60, 77, 97, 117, 143, 179, 221, 261, 307, 358, 410, 460, 510],
    'ZB': [74, 95, 119, 143, 175, 219, 271, 320, 376, 438, 500, 562, 624],
    'ZC': [90, 116, 145, 175, 213, 267, 331, 390, 458, 532, 608, 684, 760]
}

// Fundamental deviations for SHAFTS (lowercase) in microns
// For shafts, fundamental deviation is typically the UPPER deviation (es)
// Negative values = smaller shaft (clearance), Positive = larger shaft (interference)
export const shaftDeviations: Record<string, any> = {
    // Clearance fits (negative deviation = smaller shaft)
    'a': [-270, -270, -280, -290, -300, -310, -320, -340, -360, -380, -410, -440, -480],
    'b': [-140, -140, -150, -150, -160, -170, -180, -190, -200, -210, -230, -240, -260],
    'c': [-60, -70, -80, -95, -110, -120, -130, -140, -150, -170, -180, -200, -210],
    'd': [-20, -30, -40, -50, -65, -80, -100, -120, -145, -170, -190, -210, -230],
    'e': [-14, -20, -25, -32, -40, -50, -60, -72, -85, -100, -110, -125, -135],
    'f': [-6, -10, -13, -16, -20, -25, -30, -36, -43, -50, -56, -62, -68],
    'g': [-2, -4, -5, -6, -7, -9, -10, -12, -14, -15, -17, -18, -20],
    // h = zero line (reference)
    'h': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    // Transition and interference fits (positive deviation = larger shaft)
    'js': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Symmetric around zero
    'j': [2, 3, 4, 5, 5, 6, 6, 6, 6, 8, 8, 10, 10],
    'k': [0, 1, 1, 1, 2, 2, 2, 3, 3, 4, 4, 4, 5],
    'm': [2, 4, 6, 7, 8, 9, 11, 13, 15, 17, 20, 21, 23],
    'n': [4, 8, 10, 12, 15, 17, 20, 23, 27, 31, 34, 37, 40],
    'p': [6, 12, 15, 18, 22, 26, 32, 37, 43, 50, 56, 62, 68],
    'r': [10, 15, 19, 23, 28, 34, 41, 48, 55, 63, 72, 78, 86],
    's': [14, 19, 23, 28, 35, 43, 53, 59, 68, 79, 88, 98, 108],
    't': [18, 23, 28, 34, 41, 54, 66, 75, 88, 100, 114, 126, 140],
    'u': [22, 28, 34, 40, 49, 64, 78, 91, 106, 122, 137, 151, 165],
    'v': [26, 34, 42, 50, 60, 76, 94, 110, 130, 150, 170, 190, 210],
    'x': [32, 42, 52, 64, 77, 97, 122, 146, 174, 204, 232, 264, 296],
    'y': [40, 52, 64, 80, 97, 122, 152, 180, 214, 252, 290, 328, 366],
    'z': [50, 64, 80, 97, 119, 149, 185, 218, 258, 302, 346, 390, 434],
    'za': [60, 77, 97, 117, 143, 179, 221, 261, 307, 358, 410, 460, 510],
    'zb': [74, 95, 119, 143, 175, 219, 271, 320, 376, 438, 500, 562, 624],
    'zc': [90, 116, 145, 175, 213, 267, 331, 390, 458, 532, 608, 684, 760]
}

// Common fit combinations with descriptions
export const commonFits = {
    clearance: [
        { hole: 'H11', shaft: 'c11', name: 'Loose Running', description: 'For wide clearances, easy assembly, running fits with large clearance' },
        { hole: 'H9', shaft: 'd9', name: 'Free Running', description: 'For accurate location with easy assembly, not for running fits' },
        { hole: 'H8', shaft: 'f7', name: 'Close Running', description: 'For accurate location and running fits where slight clearance is needed' },
        { hole: 'H7', shaft: 'g6', name: 'Sliding Fit', description: 'For precision sliding parts, close clearance, precision locating' },
        { hole: 'H7', shaft: 'h6', name: 'Locational Clearance', description: 'Snug fit for stationary parts, easy assembly/disassembly' }
    ],
    transition: [
        { hole: 'H7', shaft: 'js6', name: 'Locational Transition', description: 'For accurate location, light assembly pressure' },
        { hole: 'H7', shaft: 'k6', name: 'Locational Transition', description: 'For accurate location, may require light pressing' },
        { hole: 'H7', shaft: 'm6', name: 'Locational Transition', description: 'For more accurate location, pressing required' }
    ],
    interference: [
        { hole: 'H7', shaft: 'n6', name: 'Locational Interference', description: 'Light press fit for accurate location with pressing' },
        { hole: 'H7', shaft: 'p6', name: 'Light Press', description: 'Press fit for semi-permanent assembly' },
        { hole: 'H7', shaft: 'r6', name: 'Medium Press', description: 'Medium drive fit requiring press' },
        { hole: 'H7', shaft: 's6', name: 'Heavy Press', description: 'Heavy force fit for permanent assembly' },
        { hole: 'H7', shaft: 'u6', name: 'Force Fit', description: 'Heavy shrink or force fit' }
    ]
}

// Hole tolerance classes (sorted by common usage)
export const holeClasses = ['H6', 'H7', 'H8', 'H9', 'H10', 'H11', 'G6', 'G7', 'F7', 'F8', 'E8', 'E9', 'D9', 'D10', 'C11', 'JS6', 'JS7', 'K6', 'K7', 'M6', 'M7', 'N6', 'N7', 'P6', 'P7']

// Shaft tolerance classes (sorted by common usage)
export const shaftClasses = ['h5', 'h6', 'h7', 'h8', 'h9', 'h11', 'g5', 'g6', 'f6', 'f7', 'f8', 'e7', 'e8', 'e9', 'd8', 'd9', 'd10', 'c11', 'js5', 'js6', 'k5', 'k6', 'm5', 'm6', 'n5', 'n6', 'p5', 'p6', 'r6', 's6', 's7', 't6', 'u6', 'u7', 'x6']

// Helper functions

/**
 * Get the nominal range index for a given diameter
 */
export function getRangeIndex(diameter: any) {
    for (let i = 0; i < nominalRanges.length; i++) {
        const range = nominalRanges[i]
        if (diameter > range.min && diameter <= range.max) {
            return i
        }
    }
    // Handle edge case for exactly 0
    if (diameter === 0) return 0
    return -1
}

/**
 * Get the nominal range object for a given diameter
 */
export function getNominalRange(diameter: any) {
    const index = getRangeIndex(diameter)
    return index >= 0 ? nominalRanges[index] : null
}

/**
 * Get IT grade tolerance value in microns for a given diameter and grade
 */
export function getITGrade(diameter: any, grade: any) {
    const index = getRangeIndex(diameter)
    if (index < 0) return null

    const gradeKey = `IT${grade}`
    const values = itGrades[gradeKey]
    if (!values) return null

    return values[index]
}

/**
 * Parse a tolerance class like "H7" or "g6" into deviation letter and IT grade
 */
export function parseToleranceClass(toleranceClass: any) {
    const match = toleranceClass.match(/^([A-Za-z]+)(\d+)$/)
    if (!match) return null

    return {
        letter: match[1],
        grade: parseInt(match[2]),
        isHole: match[1] === match[1].toUpperCase()
    }
}

/**
 * Calculate tolerance limits for a hole
 * Returns: { upper: ES (microns), lower: EI (microns), tolerance: IT (microns) }
 */
export function getHoleTolerance(diameter: any, toleranceClass: any) {
    const parsed = parseToleranceClass(toleranceClass)
    if (!parsed || !parsed.isHole) return null

    const rangeIndex = getRangeIndex(diameter)
    if (rangeIndex < 0) return null

    const letterKey = parsed.letter
    const itValue = getITGrade(diameter, parsed.grade)
    if (itValue === null) return null

    // Get fundamental deviation (for H, this is the lower limit EI)
    const deviations = holeDeviations[letterKey]
    if (!deviations) return null

    const fundamentalDev = deviations[rangeIndex]

    // For holes: EI = fundamental deviation, ES = EI + IT
    // H holes: EI = 0, ES = IT (positive)
    // For most holes, the fundamental deviation is the lower limit
    let lower, upper

    if (letterKey === 'JS') {
        // JS is symmetric around zero (exact halves per ISO 286 — do not round, e.g. JS7 at Ø25 is ±10.5)
        lower = -itValue / 2
        upper = itValue / 2
    } else if (['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].includes(letterKey)) {
        // Clearance holes: fundamental deviation is lower limit (EI)
        lower = fundamentalDev
        upper = fundamentalDev + itValue
    } else if (letterKey === 'J') {
        // J holes are individually tabulated in ISO 286; approximate values stored as ES
        upper = fundamentalDev
        lower = fundamentalDev - itValue
    } else {
        // Transition/interference holes (K, M, N, P...ZC): the table stores the shaft-side
        // magnitude; ISO 286 defines ES = -deviation + Δ, where Δ = ITn − IT(n−1) applies
        // to K/M/N up to grade 8 and P...ZC up to grade 7 (Δ = 0 for coarser grades).
        // e.g. Ø25 P7: ES = -22 + (21−13) = -14, EI = -35 (published values).
        const needsDelta = ['K', 'M', 'N'].includes(letterKey) ? parsed.grade <= 8 : parsed.grade <= 7
        let delta = 0
        if (needsDelta) {
            const itPrev = getITGrade(diameter, parsed.grade - 1)
            if (itPrev !== null) delta = itValue - itPrev
        }
        upper = -fundamentalDev + delta
        lower = upper - itValue
    }

    return {
        class: toleranceClass,
        lower: lower,
        upper: upper,
        tolerance: itValue,
        diameter: diameter
    }
}

/**
 * Calculate tolerance limits for a shaft
 * Returns: { upper: es (microns), lower: ei (microns), tolerance: IT (microns) }
 */
export function getShaftTolerance(diameter: any, toleranceClass: any) {
    const parsed = parseToleranceClass(toleranceClass)
    if (!parsed || parsed.isHole) return null

    const rangeIndex = getRangeIndex(diameter)
    if (rangeIndex < 0) return null

    const letterKey = parsed.letter
    const itValue = getITGrade(diameter, parsed.grade)
    if (itValue === null) return null

    const deviations = shaftDeviations[letterKey]
    if (!deviations) return null

    const fundamentalDev = deviations[rangeIndex]

    let lower, upper

    if (letterKey === 'js') {
        // js is symmetric around zero (exact halves per ISO 286 — do not round)
        lower = -itValue / 2
        upper = itValue / 2
    } else if (['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].includes(letterKey)) {
        // Clearance shafts: fundamental deviation is upper limit (es)
        upper = fundamentalDev
        lower = fundamentalDev - itValue
    } else {
        // Transition/interference shafts: fundamental deviation is lower limit (ei)
        lower = fundamentalDev
        upper = fundamentalDev + itValue
    }

    return {
        class: toleranceClass,
        lower: lower,
        upper: upper,
        tolerance: itValue,
        diameter: diameter
    }
}

/**
 * Calculate fit between hole and shaft
 * Returns clearance (positive) or interference (negative) in microns
 */
export function calculateFit(diameter: any, holeClass: any, shaftClass: any) {
    const hole = getHoleTolerance(diameter, holeClass)
    const shaft = getShaftTolerance(diameter, shaftClass)

    if (!hole || !shaft) return null

    // Max clearance = Hole max - Shaft min
    const maxClearance = hole.upper - shaft.lower

    // Min clearance = Hole min - Shaft max (negative = interference)
    const minClearance = hole.lower - shaft.upper

    // Determine fit type (min clearance of exactly 0 is still a clearance fit per ISO
    // convention — the shaft is never larger than the hole, e.g. H7/h6 locational clearance)
    let fitType
    if (minClearance >= 0) {
        fitType = 'clearance'
    } else if (maxClearance < 0) {
        fitType = 'interference'
    } else {
        fitType = 'transition'
    }

    return {
        hole: hole,
        shaft: shaft,
        maxClearance: maxClearance,
        minClearance: minClearance,
        fitType: fitType,
        diameter: diameter
    }
}

/**
 * Format a tolerance value for display
 * Converts microns to mm with appropriate precision
 */
export function formatTolerance(microns: any) {
    if (microns === 0) return '0'
    const mm = microns / 1000
    const sign = microns > 0 ? '+' : ''
    return `${sign}${mm.toFixed(3)}`
}

/**
 * Format a tolerance value in microns for display
 */
export function formatMicrons(microns: any) {
    if (microns === 0) return '0'
    const sign = microns > 0 ? '+' : ''
    return `${sign}${microns}`
}

/**
 * Get all available hole tolerance classes
 */
export function getHoleClasses() {
    return holeClasses
}

/**
 * Get all available shaft tolerance classes
 */
export function getShaftClasses() {
    return shaftClasses
}

/**
 * Get common fits by category
 */
export function getCommonFits() {
    return commonFits
}

/**
 * Get all nominal ranges
 */
export function getNominalRanges() {
    return nominalRanges
}
