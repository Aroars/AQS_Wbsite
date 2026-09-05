/**
 * Sheet Metal Gauge Data
 * Contains thickness data for common sheet metal materials by gauge number
 * Includes plate thicknesses and standard tolerances
 * @module data/sheetMetalGaugeData
 *
 * Data sources: Metal Supermarkets, ASTM standards
 * Note: Gauge numbers are NOT standardized across materials - the same gauge
 * number represents different thicknesses for different materials.
 */

/**
 * Mild Steel (Carbon Steel) gauge thicknesses
 * Based on Manufacturer's Standard Gauge (MSG) for steel
 */
export const mildSteelGauges = {
    3:  { inches: 0.2391, mm: 6.073, toleranceIn: 0.008, toleranceMm: 0.20 },
    4:  { inches: 0.2242, mm: 5.695, toleranceIn: 0.008, toleranceMm: 0.20 },
    5:  { inches: 0.2092, mm: 5.314, toleranceIn: 0.007, toleranceMm: 0.18 },
    6:  { inches: 0.1943, mm: 4.935, toleranceIn: 0.007, toleranceMm: 0.18 },
    7:  { inches: 0.1793, mm: 4.554, toleranceIn: 0.006, toleranceMm: 0.15 },
    8:  { inches: 0.1644, mm: 4.175, toleranceIn: 0.006, toleranceMm: 0.15 },
    9:  { inches: 0.1495, mm: 3.797, toleranceIn: 0.005, toleranceMm: 0.13 },
    10: { inches: 0.1345, mm: 3.416, toleranceIn: 0.005, toleranceMm: 0.13 },
    11: { inches: 0.1196, mm: 3.038, toleranceIn: 0.004, toleranceMm: 0.10 },
    12: { inches: 0.1046, mm: 2.657, toleranceIn: 0.004, toleranceMm: 0.10 },
    13: { inches: 0.0897, mm: 2.278, toleranceIn: 0.004, toleranceMm: 0.10 },
    14: { inches: 0.0747, mm: 1.897, toleranceIn: 0.003, toleranceMm: 0.08 },
    15: { inches: 0.0673, mm: 1.709, toleranceIn: 0.003, toleranceMm: 0.08 },
    16: { inches: 0.0598, mm: 1.519, toleranceIn: 0.003, toleranceMm: 0.08 },
    17: { inches: 0.0538, mm: 1.367, toleranceIn: 0.003, toleranceMm: 0.08 },
    18: { inches: 0.0478, mm: 1.214, toleranceIn: 0.002, toleranceMm: 0.05 },
    19: { inches: 0.0418, mm: 1.062, toleranceIn: 0.002, toleranceMm: 0.05 },
    20: { inches: 0.0359, mm: 0.912, toleranceIn: 0.002, toleranceMm: 0.05 },
    21: { inches: 0.0329, mm: 0.836, toleranceIn: 0.002, toleranceMm: 0.05 },
    22: { inches: 0.0299, mm: 0.759, toleranceIn: 0.002, toleranceMm: 0.05 },
    23: { inches: 0.0269, mm: 0.683, toleranceIn: 0.002, toleranceMm: 0.05 },
    24: { inches: 0.0239, mm: 0.607, toleranceIn: 0.002, toleranceMm: 0.05 },
    25: { inches: 0.0209, mm: 0.531, toleranceIn: 0.002, toleranceMm: 0.05 },
    26: { inches: 0.0179, mm: 0.455, toleranceIn: 0.002, toleranceMm: 0.05 },
    27: { inches: 0.0164, mm: 0.417, toleranceIn: 0.002, toleranceMm: 0.05 },
    28: { inches: 0.0149, mm: 0.378, toleranceIn: 0.002, toleranceMm: 0.05 },
    29: { inches: 0.0135, mm: 0.343, toleranceIn: 0.001, toleranceMm: 0.03 },
    30: { inches: 0.0120, mm: 0.305, toleranceIn: 0.001, toleranceMm: 0.03 }
}

/**
 * Stainless Steel gauge thicknesses
 * Based on standard stainless steel gauge system
 */
export const stainlessSteelGauges = {
    3:  { inches: 0.2500, mm: 6.350, toleranceIn: 0.012, toleranceMm: 0.30 },
    4:  { inches: 0.2344, mm: 5.954, toleranceIn: 0.010, toleranceMm: 0.25 },
    5:  { inches: 0.2188, mm: 5.558, toleranceIn: 0.010, toleranceMm: 0.25 },
    6:  { inches: 0.2031, mm: 5.159, toleranceIn: 0.008, toleranceMm: 0.20 },
    7:  { inches: 0.1875, mm: 4.763, toleranceIn: 0.008, toleranceMm: 0.20 },
    8:  { inches: 0.1719, mm: 4.366, toleranceIn: 0.006, toleranceMm: 0.15 },
    9:  { inches: 0.1563, mm: 3.970, toleranceIn: 0.006, toleranceMm: 0.15 },
    10: { inches: 0.1406, mm: 3.571, toleranceIn: 0.005, toleranceMm: 0.13 },
    11: { inches: 0.1250, mm: 3.175, toleranceIn: 0.005, toleranceMm: 0.13 },
    12: { inches: 0.1094, mm: 2.779, toleranceIn: 0.004, toleranceMm: 0.10 },
    13: { inches: 0.0938, mm: 2.382, toleranceIn: 0.004, toleranceMm: 0.10 },
    14: { inches: 0.0781, mm: 1.984, toleranceIn: 0.003, toleranceMm: 0.08 },
    15: { inches: 0.0703, mm: 1.786, toleranceIn: 0.003, toleranceMm: 0.08 },
    16: { inches: 0.0625, mm: 1.588, toleranceIn: 0.003, toleranceMm: 0.08 },
    17: { inches: 0.0563, mm: 1.430, toleranceIn: 0.002, toleranceMm: 0.05 },
    18: { inches: 0.0500, mm: 1.270, toleranceIn: 0.002, toleranceMm: 0.05 },
    19: { inches: 0.0438, mm: 1.113, toleranceIn: 0.002, toleranceMm: 0.05 },
    20: { inches: 0.0375, mm: 0.953, toleranceIn: 0.002, toleranceMm: 0.05 },
    21: { inches: 0.0344, mm: 0.874, toleranceIn: 0.002, toleranceMm: 0.05 },
    22: { inches: 0.0313, mm: 0.795, toleranceIn: 0.002, toleranceMm: 0.05 },
    23: { inches: 0.0281, mm: 0.714, toleranceIn: 0.002, toleranceMm: 0.05 },
    24: { inches: 0.0250, mm: 0.635, toleranceIn: 0.002, toleranceMm: 0.05 },
    25: { inches: 0.0219, mm: 0.556, toleranceIn: 0.002, toleranceMm: 0.05 },
    26: { inches: 0.0188, mm: 0.478, toleranceIn: 0.001, toleranceMm: 0.03 },
    27: { inches: 0.0172, mm: 0.437, toleranceIn: 0.001, toleranceMm: 0.03 },
    28: { inches: 0.0156, mm: 0.396, toleranceIn: 0.001, toleranceMm: 0.03 },
    29: { inches: 0.0141, mm: 0.358, toleranceIn: 0.001, toleranceMm: 0.03 },
    30: { inches: 0.0125, mm: 0.318, toleranceIn: 0.001, toleranceMm: 0.03 }
}

/**
 * Aluminum gauge thicknesses
 * Based on Brown & Sharpe (B&S) / American Wire Gauge (AWG) for aluminum
 */
export const aluminumGauges = {
    3:  { inches: 0.2294, mm: 5.827, toleranceIn: 0.009, toleranceMm: 0.23 },
    4:  { inches: 0.2043, mm: 5.189, toleranceIn: 0.008, toleranceMm: 0.20 },
    5:  { inches: 0.1819, mm: 4.620, toleranceIn: 0.007, toleranceMm: 0.18 },
    6:  { inches: 0.1620, mm: 4.115, toleranceIn: 0.006, toleranceMm: 0.15 },
    7:  { inches: 0.1443, mm: 3.665, toleranceIn: 0.006, toleranceMm: 0.15 },
    8:  { inches: 0.1285, mm: 3.264, toleranceIn: 0.005, toleranceMm: 0.13 },
    9:  { inches: 0.1144, mm: 2.906, toleranceIn: 0.005, toleranceMm: 0.13 },
    10: { inches: 0.1019, mm: 2.588, toleranceIn: 0.004, toleranceMm: 0.10 },
    11: { inches: 0.0907, mm: 2.304, toleranceIn: 0.004, toleranceMm: 0.10 },
    12: { inches: 0.0808, mm: 2.052, toleranceIn: 0.003, toleranceMm: 0.08 },
    13: { inches: 0.0720, mm: 1.829, toleranceIn: 0.003, toleranceMm: 0.08 },
    14: { inches: 0.0641, mm: 1.628, toleranceIn: 0.003, toleranceMm: 0.08 },
    15: { inches: 0.0571, mm: 1.450, toleranceIn: 0.002, toleranceMm: 0.05 },
    16: { inches: 0.0508, mm: 1.290, toleranceIn: 0.002, toleranceMm: 0.05 },
    17: { inches: 0.0453, mm: 1.151, toleranceIn: 0.002, toleranceMm: 0.05 },
    18: { inches: 0.0403, mm: 1.024, toleranceIn: 0.002, toleranceMm: 0.05 },
    19: { inches: 0.0359, mm: 0.912, toleranceIn: 0.002, toleranceMm: 0.05 },
    20: { inches: 0.0320, mm: 0.813, toleranceIn: 0.002, toleranceMm: 0.05 },
    21: { inches: 0.0285, mm: 0.724, toleranceIn: 0.002, toleranceMm: 0.05 },
    22: { inches: 0.0253, mm: 0.643, toleranceIn: 0.001, toleranceMm: 0.03 },
    23: { inches: 0.0226, mm: 0.574, toleranceIn: 0.001, toleranceMm: 0.03 },
    24: { inches: 0.0201, mm: 0.511, toleranceIn: 0.001, toleranceMm: 0.03 },
    25: { inches: 0.0179, mm: 0.455, toleranceIn: 0.001, toleranceMm: 0.03 },
    26: { inches: 0.0159, mm: 0.404, toleranceIn: 0.001, toleranceMm: 0.03 },
    27: { inches: 0.0142, mm: 0.361, toleranceIn: 0.001, toleranceMm: 0.03 },
    28: { inches: 0.0126, mm: 0.320, toleranceIn: 0.001, toleranceMm: 0.03 },
    29: { inches: 0.0113, mm: 0.287, toleranceIn: 0.001, toleranceMm: 0.03 },
    30: { inches: 0.0100, mm: 0.254, toleranceIn: 0.001, toleranceMm: 0.03 }
}

/**
 * Galvanized Steel gauge thicknesses
 * Slightly thicker than mild steel due to zinc coating
 */
export const galvanizedSteelGauges = {
    8:  { inches: 0.1681, mm: 4.269, toleranceIn: 0.008, toleranceMm: 0.20 },
    9:  { inches: 0.1532, mm: 3.891, toleranceIn: 0.006, toleranceMm: 0.15 },
    10: { inches: 0.1382, mm: 3.510, toleranceIn: 0.006, toleranceMm: 0.15 },
    11: { inches: 0.1233, mm: 3.132, toleranceIn: 0.005, toleranceMm: 0.13 },
    12: { inches: 0.1084, mm: 2.753, toleranceIn: 0.005, toleranceMm: 0.13 },
    13: { inches: 0.0934, mm: 2.372, toleranceIn: 0.004, toleranceMm: 0.10 },
    14: { inches: 0.0785, mm: 1.994, toleranceIn: 0.004, toleranceMm: 0.10 },
    15: { inches: 0.0710, mm: 1.803, toleranceIn: 0.003, toleranceMm: 0.08 },
    16: { inches: 0.0635, mm: 1.613, toleranceIn: 0.003, toleranceMm: 0.08 },
    17: { inches: 0.0575, mm: 1.461, toleranceIn: 0.003, toleranceMm: 0.08 },
    18: { inches: 0.0516, mm: 1.311, toleranceIn: 0.002, toleranceMm: 0.05 },
    19: { inches: 0.0456, mm: 1.158, toleranceIn: 0.002, toleranceMm: 0.05 },
    20: { inches: 0.0396, mm: 1.006, toleranceIn: 0.002, toleranceMm: 0.05 },
    21: { inches: 0.0366, mm: 0.930, toleranceIn: 0.002, toleranceMm: 0.05 },
    22: { inches: 0.0336, mm: 0.853, toleranceIn: 0.002, toleranceMm: 0.05 },
    23: { inches: 0.0306, mm: 0.777, toleranceIn: 0.002, toleranceMm: 0.05 },
    24: { inches: 0.0276, mm: 0.701, toleranceIn: 0.002, toleranceMm: 0.05 },
    25: { inches: 0.0247, mm: 0.627, toleranceIn: 0.002, toleranceMm: 0.05 },
    26: { inches: 0.0217, mm: 0.551, toleranceIn: 0.002, toleranceMm: 0.05 },
    27: { inches: 0.0202, mm: 0.513, toleranceIn: 0.001, toleranceMm: 0.03 },
    28: { inches: 0.0187, mm: 0.475, toleranceIn: 0.001, toleranceMm: 0.03 },
    29: { inches: 0.0172, mm: 0.437, toleranceIn: 0.001, toleranceMm: 0.03 },
    30: { inches: 0.0157, mm: 0.399, toleranceIn: 0.001, toleranceMm: 0.03 }
}

/**
 * Standard plate thicknesses (for reference, not gauge-based)
 * These are common stock thicknesses for plate material
 */
export const plateThicknesses = {
    imperial: [
        { fraction: '1/4"', decimal: 0.250, mm: 6.35 },
        { fraction: '5/16"', decimal: 0.3125, mm: 7.94 },
        { fraction: '3/8"', decimal: 0.375, mm: 9.53 },
        { fraction: '1/2"', decimal: 0.500, mm: 12.70 },
        { fraction: '5/8"', decimal: 0.625, mm: 15.88 },
        { fraction: '3/4"', decimal: 0.750, mm: 19.05 },
        { fraction: '7/8"', decimal: 0.875, mm: 22.23 },
        { fraction: '1"', decimal: 1.000, mm: 25.40 },
        { fraction: '1-1/4"', decimal: 1.250, mm: 31.75 },
        { fraction: '1-1/2"', decimal: 1.500, mm: 38.10 },
        { fraction: '2"', decimal: 2.000, mm: 50.80 }
    ],
    metric: [
        { mm: 6, inches: 0.236 },
        { mm: 8, inches: 0.315 },
        { mm: 10, inches: 0.394 },
        { mm: 12, inches: 0.472 },
        { mm: 15, inches: 0.591 },
        { mm: 20, inches: 0.787 },
        { mm: 25, inches: 0.984 },
        { mm: 30, inches: 1.181 },
        { mm: 40, inches: 1.575 },
        { mm: 50, inches: 1.969 }
    ]
}

/**
 * Material metadata for display
 */
export const materialInfo: Record<string, any> = {
    'Mild Steel': {
        data: mildSteelGauges,
        standard: "Manufacturer's Standard Gauge (MSG)",
        description: 'Carbon steel, hot-rolled or cold-rolled',
        notes: 'Most common gauge system for steel sheet'
    },
    'Stainless Steel': {
        data: stainlessSteelGauges,
        standard: 'Stainless Steel Gauge',
        description: 'Austenitic stainless (304, 316, etc.)',
        notes: 'Thicker than mild steel at same gauge number'
    },
    'Aluminum': {
        data: aluminumGauges,
        standard: 'Brown & Sharpe (B&S) / AWG',
        description: 'Common alloys: 3003, 5052, 6061',
        notes: 'Thinner than steel at same gauge number'
    },
    'Galvanized Steel': {
        data: galvanizedSteelGauges,
        standard: 'Galvanized Sheet Gauge',
        description: 'Hot-dip galvanized coating',
        notes: 'Includes zinc coating thickness'
    }
}

/**
 * Get list of available materials
 * @returns {Array<string>} Material names
 */
export function getMaterials() {
    return Object.keys(materialInfo)
}

/**
 * Get available gauges for a material
 * @param {string} material - Material name
 * @returns {Array<number>} Sorted array of gauge numbers (thin to thick)
 */
export function getGauges(material: any) {
    const info = materialInfo[material]
    if (!info) return []
    return Object.keys(info.data).map(Number).sort((a, b) => b - a)
}

/**
 * Get thickness data for a specific material and gauge
 * @param {string} material - Material name
 * @param {number} gauge - Gauge number
 * @returns {Object|null} Thickness data or null if not found
 */
export function getGaugeData(material: any, gauge: any) {
    const info = materialInfo[material]
    if (!info) return null
    return info.data[gauge] || null
}

/**
 * Get material info
 * @param {string} material - Material name
 * @returns {Object|null} Material metadata
 */
export function getMaterialInfo(material: any) {
    return materialInfo[material] || null
}

/**
 * Compare thicknesses across all materials for a given gauge
 * @param {number} gauge - Gauge number
 * @returns {Array<Object>} Array of {material, inches, mm} sorted by thickness
 */
export function compareGauge(gauge: any) {
    const results: any[] = []

    Object.entries(materialInfo).forEach(([material, info]) => {
        const data = info.data[gauge]
        if (data) {
            results.push({
                material,
                inches: data.inches,
                mm: data.mm,
                toleranceIn: data.toleranceIn,
                toleranceMm: data.toleranceMm
            })
        }
    })

    return results.sort((a, b) => b.inches - a.inches)
}

/**
 * Find closest gauge for a target thickness
 * @param {string} material - Material name
 * @param {number} thickness - Target thickness in inches
 * @returns {Object|null} Closest gauge data with gauge number
 */
export function findClosestGauge(material: any, thickness: any) {
    const info = materialInfo[material]
    if (!info) return null

    let closest = null
    let minDiff = Infinity

    Object.entries(info.data).forEach(([gauge, data]: [string, any]) => {
        const diff = Math.abs(data.inches - thickness)
        if (diff < minDiff) {
            minDiff = diff
            closest = { gauge: Number(gauge), ...data }
        }
    })

    return closest
}
