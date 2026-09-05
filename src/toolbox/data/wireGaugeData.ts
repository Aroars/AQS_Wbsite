/**
 * Wire Gauge & Ampacity Data
 * @module data/wireGaugeData
 *
 * Reference data for AWG wire sizes, metric equivalents,
 * ampacity ratings by insulation type, and voltage drop calculations.
 *
 * Ampacity values based on NEC Table 310.16 (copper conductors, 30°C ambient)
 */

// AWG wire data - physical properties
// Resistance values are for copper at 75°C
export const awgData: Record<string, any> = {
    '0000': {
        label: '0000 (4/0)',
        diameter_mm: 11.684,
        diameter_in: 0.4600,
        area_mm2: 107.2,
        area_kcmil: 211.6,
        resistance_ohm_per_1000ft: 0.0490,
        resistance_ohm_per_km: 0.1608
    },
    '000': {
        label: '000 (3/0)',
        diameter_mm: 10.404,
        diameter_in: 0.4096,
        area_mm2: 85.0,
        area_kcmil: 167.8,
        resistance_ohm_per_1000ft: 0.0618,
        resistance_ohm_per_km: 0.2028
    },
    '00': {
        label: '00 (2/0)',
        diameter_mm: 9.266,
        diameter_in: 0.3648,
        area_mm2: 67.4,
        area_kcmil: 133.1,
        resistance_ohm_per_1000ft: 0.0779,
        resistance_ohm_per_km: 0.2557
    },
    '0': {
        label: '0 (1/0)',
        diameter_mm: 8.251,
        diameter_in: 0.3249,
        area_mm2: 53.5,
        area_kcmil: 105.5,
        resistance_ohm_per_1000ft: 0.0983,
        resistance_ohm_per_km: 0.3224
    },
    '1': {
        label: '1 AWG',
        diameter_mm: 7.348,
        diameter_in: 0.2893,
        area_mm2: 42.4,
        area_kcmil: 83.69,
        resistance_ohm_per_1000ft: 0.1239,
        resistance_ohm_per_km: 0.4066
    },
    '2': {
        label: '2 AWG',
        diameter_mm: 6.544,
        diameter_in: 0.2576,
        area_mm2: 33.6,
        area_kcmil: 66.37,
        resistance_ohm_per_1000ft: 0.1563,
        resistance_ohm_per_km: 0.5127
    },
    '3': {
        label: '3 AWG',
        diameter_mm: 5.827,
        diameter_in: 0.2294,
        area_mm2: 26.7,
        area_kcmil: 52.63,
        resistance_ohm_per_1000ft: 0.1970,
        resistance_ohm_per_km: 0.6464
    },
    '4': {
        label: '4 AWG',
        diameter_mm: 5.189,
        diameter_in: 0.2043,
        area_mm2: 21.2,
        area_kcmil: 41.74,
        resistance_ohm_per_1000ft: 0.2485,
        resistance_ohm_per_km: 0.8152
    },
    '5': {
        label: '5 AWG',
        diameter_mm: 4.621,
        diameter_in: 0.1819,
        area_mm2: 16.8,
        area_kcmil: 33.10,
        resistance_ohm_per_1000ft: 0.3133,
        resistance_ohm_per_km: 1.028
    },
    '6': {
        label: '6 AWG',
        diameter_mm: 4.115,
        diameter_in: 0.1620,
        area_mm2: 13.3,
        area_kcmil: 26.25,
        resistance_ohm_per_1000ft: 0.3951,
        resistance_ohm_per_km: 1.296
    },
    '7': {
        label: '7 AWG',
        diameter_mm: 3.665,
        diameter_in: 0.1443,
        area_mm2: 10.5,
        area_kcmil: 20.82,
        resistance_ohm_per_1000ft: 0.4982,
        resistance_ohm_per_km: 1.634
    },
    '8': {
        label: '8 AWG',
        diameter_mm: 3.264,
        diameter_in: 0.1285,
        area_mm2: 8.37,
        area_kcmil: 16.51,
        resistance_ohm_per_1000ft: 0.6282,
        resistance_ohm_per_km: 2.061
    },
    '9': {
        label: '9 AWG',
        diameter_mm: 2.906,
        diameter_in: 0.1144,
        area_mm2: 6.63,
        area_kcmil: 13.09,
        resistance_ohm_per_1000ft: 0.7921,
        resistance_ohm_per_km: 2.599
    },
    '10': {
        label: '10 AWG',
        diameter_mm: 2.588,
        diameter_in: 0.1019,
        area_mm2: 5.26,
        area_kcmil: 10.38,
        resistance_ohm_per_1000ft: 0.9989,
        resistance_ohm_per_km: 3.277
    },
    '11': {
        label: '11 AWG',
        diameter_mm: 2.305,
        diameter_in: 0.0907,
        area_mm2: 4.17,
        area_kcmil: 8.234,
        resistance_ohm_per_1000ft: 1.260,
        resistance_ohm_per_km: 4.132
    },
    '12': {
        label: '12 AWG',
        diameter_mm: 2.053,
        diameter_in: 0.0808,
        area_mm2: 3.31,
        area_kcmil: 6.530,
        resistance_ohm_per_1000ft: 1.588,
        resistance_ohm_per_km: 5.211
    },
    '13': {
        label: '13 AWG',
        diameter_mm: 1.828,
        diameter_in: 0.0720,
        area_mm2: 2.62,
        area_kcmil: 5.178,
        resistance_ohm_per_1000ft: 2.003,
        resistance_ohm_per_km: 6.571
    },
    '14': {
        label: '14 AWG',
        diameter_mm: 1.628,
        diameter_in: 0.0641,
        area_mm2: 2.08,
        area_kcmil: 4.107,
        resistance_ohm_per_1000ft: 2.525,
        resistance_ohm_per_km: 8.286
    },
    '15': {
        label: '15 AWG',
        diameter_mm: 1.450,
        diameter_in: 0.0571,
        area_mm2: 1.65,
        area_kcmil: 3.257,
        resistance_ohm_per_1000ft: 3.184,
        resistance_ohm_per_km: 10.45
    },
    '16': {
        label: '16 AWG',
        diameter_mm: 1.291,
        diameter_in: 0.0508,
        area_mm2: 1.31,
        area_kcmil: 2.583,
        resistance_ohm_per_1000ft: 4.016,
        resistance_ohm_per_km: 13.17
    },
    '17': {
        label: '17 AWG',
        diameter_mm: 1.150,
        diameter_in: 0.0453,
        area_mm2: 1.04,
        area_kcmil: 2.048,
        resistance_ohm_per_1000ft: 5.064,
        resistance_ohm_per_km: 16.61
    },
    '18': {
        label: '18 AWG',
        diameter_mm: 1.024,
        diameter_in: 0.0403,
        area_mm2: 0.823,
        area_kcmil: 1.624,
        resistance_ohm_per_1000ft: 6.385,
        resistance_ohm_per_km: 20.95
    },
    '19': {
        label: '19 AWG',
        diameter_mm: 0.912,
        diameter_in: 0.0359,
        area_mm2: 0.653,
        area_kcmil: 1.288,
        resistance_ohm_per_1000ft: 8.051,
        resistance_ohm_per_km: 26.42
    },
    '20': {
        label: '20 AWG',
        diameter_mm: 0.812,
        diameter_in: 0.0320,
        area_mm2: 0.518,
        area_kcmil: 1.022,
        resistance_ohm_per_1000ft: 10.15,
        resistance_ohm_per_km: 33.31
    },
    '21': {
        label: '21 AWG',
        diameter_mm: 0.723,
        diameter_in: 0.0285,
        area_mm2: 0.410,
        area_kcmil: 0.8101,
        resistance_ohm_per_1000ft: 12.80,
        resistance_ohm_per_km: 42.00
    },
    '22': {
        label: '22 AWG',
        diameter_mm: 0.644,
        diameter_in: 0.0253,
        area_mm2: 0.326,
        area_kcmil: 0.6424,
        resistance_ohm_per_1000ft: 16.14,
        resistance_ohm_per_km: 52.96
    },
    '23': {
        label: '23 AWG',
        diameter_mm: 0.573,
        diameter_in: 0.0226,
        area_mm2: 0.258,
        area_kcmil: 0.5095,
        resistance_ohm_per_1000ft: 20.36,
        resistance_ohm_per_km: 66.79
    },
    '24': {
        label: '24 AWG',
        diameter_mm: 0.511,
        diameter_in: 0.0201,
        area_mm2: 0.205,
        area_kcmil: 0.4040,
        resistance_ohm_per_1000ft: 25.67,
        resistance_ohm_per_km: 84.22
    },
    '25': {
        label: '25 AWG',
        diameter_mm: 0.455,
        diameter_in: 0.0179,
        area_mm2: 0.162,
        area_kcmil: 0.3204,
        resistance_ohm_per_1000ft: 32.37,
        resistance_ohm_per_km: 106.2
    },
    '26': {
        label: '26 AWG',
        diameter_mm: 0.405,
        diameter_in: 0.0159,
        area_mm2: 0.129,
        area_kcmil: 0.2541,
        resistance_ohm_per_1000ft: 40.81,
        resistance_ohm_per_km: 133.9
    }
}

// Metric wire sizes with AWG cross-reference
export const metricData: Record<string, any> = {
    '0.5': {
        label: '0.5 mm²',
        area_mm2: 0.5,
        awg_equivalent: '20',
        exact_match: false,
        diameter_mm: 0.798,
        resistance_ohm_per_km: 36.0
    },
    '0.75': {
        label: '0.75 mm²',
        area_mm2: 0.75,
        awg_equivalent: '18',
        exact_match: false,
        diameter_mm: 0.977,
        resistance_ohm_per_km: 24.0
    },
    '1.0': {
        label: '1.0 mm²',
        area_mm2: 1.0,
        awg_equivalent: '17',
        exact_match: false,
        diameter_mm: 1.128,
        resistance_ohm_per_km: 18.1
    },
    '1.5': {
        label: '1.5 mm²',
        area_mm2: 1.5,
        awg_equivalent: '15',
        exact_match: false,
        diameter_mm: 1.382,
        resistance_ohm_per_km: 12.1
    },
    '2.5': {
        label: '2.5 mm²',
        area_mm2: 2.5,
        awg_equivalent: '13',
        exact_match: false,
        diameter_mm: 1.784,
        resistance_ohm_per_km: 7.41
    },
    '4': {
        label: '4 mm²',
        area_mm2: 4.0,
        awg_equivalent: '11',
        exact_match: false,
        diameter_mm: 2.257,
        resistance_ohm_per_km: 4.61
    },
    '6': {
        label: '6 mm²',
        area_mm2: 6.0,
        awg_equivalent: '9',
        exact_match: false,
        diameter_mm: 2.764,
        resistance_ohm_per_km: 3.08
    },
    '10': {
        label: '10 mm²',
        area_mm2: 10.0,
        awg_equivalent: '7',
        exact_match: false,
        diameter_mm: 3.568,
        resistance_ohm_per_km: 1.83
    },
    '16': {
        label: '16 mm²',
        area_mm2: 16.0,
        awg_equivalent: '5',
        exact_match: false,
        diameter_mm: 4.514,
        resistance_ohm_per_km: 1.15
    },
    '25': {
        label: '25 mm²',
        area_mm2: 25.0,
        awg_equivalent: '3',
        exact_match: false,
        diameter_mm: 5.642,
        resistance_ohm_per_km: 0.727
    },
    '35': {
        label: '35 mm²',
        area_mm2: 35.0,
        awg_equivalent: '2',
        exact_match: false,
        diameter_mm: 6.680,
        resistance_ohm_per_km: 0.524
    },
    '50': {
        label: '50 mm²',
        area_mm2: 50.0,
        awg_equivalent: '0',
        exact_match: false,
        diameter_mm: 7.979,
        resistance_ohm_per_km: 0.387
    },
    '70': {
        label: '70 mm²',
        area_mm2: 70.0,
        awg_equivalent: '00',
        exact_match: false,
        diameter_mm: 9.440,
        resistance_ohm_per_km: 0.268
    },
    '95': {
        label: '95 mm²',
        area_mm2: 95.0,
        awg_equivalent: '000',
        exact_match: false,
        diameter_mm: 11.00,
        resistance_ohm_per_km: 0.193
    },
    '120': {
        label: '120 mm²',
        area_mm2: 120.0,
        awg_equivalent: '0000',
        exact_match: false,
        diameter_mm: 12.36,
        resistance_ohm_per_km: 0.153
    }
}

// Ampacity data - copper conductors at 30°C ambient
// Based on NEC Table 310.16
export const ampacityData: Record<string, any> = {
    // AWG sizes with ampacity by insulation type
    '0000': { TW: 195, THW: 230, THHN: 260, THWN: 230, XHHW: 260, 'NM-B': null, 'UF-B': null, USE: 260 },
    '000': { TW: 165, THW: 200, THHN: 225, THWN: 200, XHHW: 225, 'NM-B': null, 'UF-B': null, USE: 225 },
    '00': { TW: 145, THW: 175, THHN: 195, THWN: 175, XHHW: 195, 'NM-B': null, 'UF-B': null, USE: 195 },
    '0': { TW: 125, THW: 150, THHN: 170, THWN: 150, XHHW: 170, 'NM-B': null, 'UF-B': null, USE: 170 },
    '1': { TW: 110, THW: 130, THHN: 145, THWN: 130, XHHW: 145, 'NM-B': null, 'UF-B': null, USE: 145 },
    '2': { TW: 95, THW: 115, THHN: 130, THWN: 115, XHHW: 130, 'NM-B': null, 'UF-B': null, USE: 130 },
    '3': { TW: 85, THW: 100, THHN: 115, THWN: 100, XHHW: 115, 'NM-B': null, 'UF-B': null, USE: 115 },
    '4': { TW: 70, THW: 85, THHN: 95, THWN: 85, XHHW: 95, 'NM-B': null, 'UF-B': null, USE: 95 },
    '6': { TW: 55, THW: 65, THHN: 75, THWN: 65, XHHW: 75, 'NM-B': 55, 'UF-B': 55, USE: 75 },
    '8': { TW: 40, THW: 50, THHN: 55, THWN: 50, XHHW: 55, 'NM-B': 40, 'UF-B': 40, USE: 55 },
    '10': { TW: 30, THW: 35, THHN: 40, THWN: 35, XHHW: 40, 'NM-B': 30, 'UF-B': 30, USE: 40 },
    '12': { TW: 20, THW: 25, THHN: 30, THWN: 25, XHHW: 30, 'NM-B': 20, 'UF-B': 20, USE: 30 },
    '14': { TW: 15, THW: 20, THHN: 25, THWN: 20, XHHW: 25, 'NM-B': 15, 'UF-B': 15, USE: 25 }
}

// Metric ampacity data (IEC standards, approximate)
export const metricAmpacityData: Record<string, any> = {
    '0.5': { PVC: 3, XLPE: 4 },
    '0.75': { PVC: 6, XLPE: 9 },
    '1.0': { PVC: 10, XLPE: 13 },
    '1.5': { PVC: 14, XLPE: 18 },
    '2.5': { PVC: 20, XLPE: 25 },
    '4': { PVC: 26, XLPE: 34 },
    '6': { PVC: 34, XLPE: 44 },
    '10': { PVC: 46, XLPE: 61 },
    '16': { PVC: 61, XLPE: 82 },
    '25': { PVC: 80, XLPE: 108 },
    '35': { PVC: 99, XLPE: 135 },
    '50': { PVC: 119, XLPE: 168 },
    '70': { PVC: 151, XLPE: 213 },
    '95': { PVC: 182, XLPE: 258 },
    '120': { PVC: 210, XLPE: 299 }
}

// Insulation type information
export const insulationInfo = {
    'TW': {
        temp: 60,
        shortDesc: 'Wet/Dry',
        description: 'Thermoplastic, moisture resistant',
        application: 'Dry and wet locations',
        jacket: 'PVC'
    },
    'THW': {
        temp: 75,
        shortDesc: 'Wet/Dry, Heat',
        description: 'Thermoplastic, heat and moisture resistant',
        application: 'Dry and wet locations',
        jacket: 'PVC'
    },
    'THHN': {
        temp: 90,
        shortDesc: 'Dry Only, Conduit',
        description: 'Thermoplastic, heat resistant, nylon jacket',
        application: 'Dry locations only, in conduit',
        jacket: 'Nylon over PVC'
    },
    'THWN': {
        temp: 75,
        shortDesc: 'Wet/Dry, Conduit',
        description: 'Thermoplastic, heat and moisture resistant, nylon',
        application: 'Dry and wet locations, in conduit',
        jacket: 'Nylon over PVC'
    },
    'XHHW': {
        temp: 90,
        shortDesc: 'Wet/Dry, Industrial',
        description: 'Cross-linked polyethylene, heat resistant',
        application: 'Dry and wet locations (75°C wet rating)',
        jacket: 'XLPE'
    },
    'NM-B': {
        temp: 90,
        shortDesc: 'Residential, Dry',
        description: 'Non-metallic sheathed cable (Romex)',
        application: 'Dry locations, residential wiring',
        jacket: 'PVC sheath'
    },
    'UF-B': {
        temp: 90,
        shortDesc: 'Direct Burial',
        description: 'Underground feeder cable',
        application: 'Direct burial, wet locations',
        jacket: 'Moisture-resistant PVC'
    },
    'USE': {
        temp: 90,
        shortDesc: 'Underground Service',
        description: 'Underground service entrance',
        application: 'Underground, direct burial',
        jacket: 'XLPE or rubber'
    },
    // Metric insulation types
    'PVC': {
        temp: 70,
        shortDesc: 'General Purpose',
        description: 'Polyvinyl chloride insulation',
        application: 'General purpose wiring',
        jacket: 'PVC'
    },
    'XLPE': {
        temp: 90,
        shortDesc: 'High Temp, Industrial',
        description: 'Cross-linked polyethylene',
        application: 'Higher temperature applications',
        jacket: 'XLPE'
    }
}

// Common voltage options
export const voltageOptions = {
    imperial: [
        { value: 120, label: '120V (Residential)' },
        { value: 208, label: '208V (Commercial 3-phase)' },
        { value: 240, label: '240V (Residential/Commercial)' },
        { value: 277, label: '277V (Commercial lighting)' },
        { value: 480, label: '480V (Industrial)' }
    ],
    metric: [
        { value: 230, label: '230V (Single phase)' },
        { value: 400, label: '400V (Three phase)' },
        { value: 415, label: '415V (Three phase AU/UK)' }
    ]
}

// Helper functions

/**
 * Get all AWG sizes in order (largest to smallest)
 */
export function getAwgSizes() {
    return ['0000', '000', '00', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26']
}

/**
 * Get common AWG sizes for power wiring (those with ampacity data)
 */
export function getCommonAwgSizes() {
    return ['0000', '000', '00', '0', '1', '2', '3', '4', '6', '8', '10', '12', '14']
}

/**
 * Get all metric sizes in order
 */
export function getMetricSizes() {
    return ['0.5', '0.75', '1.0', '1.5', '2.5', '4', '6', '10', '16', '25', '35', '50', '70', '95', '120']
}

/**
 * Get insulation types for AWG
 */
export function getAwgInsulationTypes() {
    return ['TW', 'THW', 'THHN', 'THWN', 'XHHW', 'NM-B', 'UF-B', 'USE']
}

/**
 * Get insulation types for metric
 */
export function getMetricInsulationTypes() {
    return ['PVC', 'XLPE']
}

/**
 * Get ampacity for a given AWG size and insulation type
 */
export function getAmpacity(awgSize: any, insulationType: any) {
    const sizeData = ampacityData[awgSize]
    if (!sizeData) return null
    return sizeData[insulationType] || null
}

/**
 * Get metric ampacity for a given size and insulation
 */
export function getMetricAmpacity(metricSize: any, insulationType: any) {
    const sizeData = metricAmpacityData[metricSize]
    if (!sizeData) return null
    return sizeData[insulationType] || null
}

/**
 * Calculate voltage drop
 * @param {string} wireSize - AWG size or metric size
 * @param {number} length - One-way length in feet (imperial) or meters (metric)
 * @param {number} current - Load current in amps
 * @param {number} voltage - System voltage
 * @param {boolean} threePhase - True for 3-phase, false for single phase
 * @param {boolean} isMetric - True for metric units
 * @returns {object} - Voltage drop results
 */
export function calculateVoltageDrop(wireSize: any, length: any, current: any, voltage: any, threePhase: boolean = false, isMetric: boolean = false) {
    let resistance

    if (isMetric) {
        const wire = metricData[wireSize]
        if (!wire) return null
        // Resistance is per km, convert length from meters
        resistance = wire.resistance_ohm_per_km * (length / 1000)
    } else {
        const wire = awgData[wireSize]
        if (!wire) return null
        // Resistance is per 1000ft
        resistance = wire.resistance_ohm_per_1000ft * (length / 1000)
    }

    // Calculate voltage drop
    // Single phase: VD = 2 × I × R (round trip)
    // Three phase: VD = √3 × I × R
    let voltageDrop
    if (threePhase) {
        voltageDrop = Math.sqrt(3) * current * resistance
    } else {
        voltageDrop = 2 * current * resistance
    }

    const voltageDropPercent = (voltageDrop / voltage) * 100
    const voltageAtLoad = voltage - voltageDrop

    // Determine status based on NEC recommendations
    let status, statusClass
    if (voltageDropPercent <= 3) {
        status = 'OK'
        statusClass = 'ok'
    } else if (voltageDropPercent <= 5) {
        status = 'Acceptable'
        statusClass = 'warning'
    } else {
        status = 'Too High'
        statusClass = 'high'
    }

    return {
        voltageDrop: voltageDrop,
        voltageDropPercent: voltageDropPercent,
        voltageAtLoad: voltageAtLoad,
        status: status,
        statusClass: statusClass
    }
}

/**
 * Get wire specifications for display
 */
export function getWireSpecs(wireSize: any, isMetric: boolean = false) {
    if (isMetric) {
        const wire = metricData[wireSize]
        if (!wire) return null
        return {
            label: wire.label,
            diameter_mm: wire.diameter_mm,
            area_mm2: wire.area_mm2,
            awg_equivalent: wire.awg_equivalent,
            resistance_metric: wire.resistance_ohm_per_km,
            resistance_imperial: wire.resistance_ohm_per_km * 0.3048 // Convert to per 1000ft
        }
    } else {
        const wire = awgData[wireSize]
        if (!wire) return null
        return {
            label: wire.label,
            diameter_mm: wire.diameter_mm,
            diameter_in: wire.diameter_in,
            area_mm2: wire.area_mm2,
            area_kcmil: wire.area_kcmil,
            resistance_imperial: wire.resistance_ohm_per_1000ft,
            resistance_metric: wire.resistance_ohm_per_km
        }
    }
}
