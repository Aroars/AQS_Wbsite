/**
 * Bolt, Tap, Drill & Clearance Data
 * Contains specifications for metric and imperial fasteners
 * @module data/boltData
 */

/**
 * Metric bolt data (ISO standard)
 * Includes clearance holes, tap drills for coarse pitch threads
 */
export const metricBolts: Record<string, any> = {
    'M1.6': {
        thread: 'M1.6 × 0.35',
        pitch: 0.35,
        majorDia: 1.6,
        clearance: {
            close: { mm: 1.7, inch: '1/16"', decimal: 0.0669 },
            normal: { mm: 1.8, inch: '5/64"', decimal: 0.0781 }
        },
        tapDrill: {
            mm: 1.25,
            inch: '3/64"',
            decimal: 0.0492
        }
    },
    'M2': {
        thread: 'M2 × 0.4',
        pitch: 0.4,
        majorDia: 2.0,
        clearance: {
            close: { mm: 2.2, inch: '5/64"', decimal: 0.0866 },
            normal: { mm: 2.4, inch: '3/32"', decimal: 0.0945 }
        },
        tapDrill: {
            mm: 1.6,
            inch: '1/16"',
            decimal: 0.0630
        }
    },
    'M2.5': {
        thread: 'M2.5 × 0.45',
        pitch: 0.45,
        majorDia: 2.5,
        clearance: {
            close: { mm: 2.7, inch: '7/64"', decimal: 0.1063 },
            normal: { mm: 2.9, inch: '7/64"', decimal: 0.1142 }
        },
        tapDrill: {
            mm: 2.05,
            inch: '5/64"',
            decimal: 0.0807
        }
    },
    'M3': {
        thread: 'M3 × 0.5',
        pitch: 0.5,
        majorDia: 3.0,
        clearance: {
            close: { mm: 3.2, inch: '1/8"', decimal: 0.1260 },
            normal: { mm: 3.4, inch: '9/64"', decimal: 0.1339 }
        },
        tapDrill: {
            mm: 2.5,
            inch: '3/32"',
            decimal: 0.0984
        }
    },
    'M4': {
        thread: 'M4 × 0.7',
        pitch: 0.7,
        majorDia: 4.0,
        clearance: {
            close: { mm: 4.3, inch: '11/64"', decimal: 0.1693 },
            normal: { mm: 4.5, inch: '11/64"', decimal: 0.1772 }
        },
        tapDrill: {
            mm: 3.3,
            inch: '1/8"',
            decimal: 0.1299
        }
    },
    'M5': {
        thread: 'M5 × 0.8',
        pitch: 0.8,
        majorDia: 5.0,
        clearance: {
            close: { mm: 5.3, inch: '13/64"', decimal: 0.2087 },
            normal: { mm: 5.5, inch: '7/32"', decimal: 0.2165 }
        },
        tapDrill: {
            mm: 4.2,
            inch: '11/64"',
            decimal: 0.1654
        }
    },
    'M6': {
        thread: 'M6 × 1.0',
        pitch: 1.0,
        majorDia: 6.0,
        clearance: {
            close: { mm: 6.4, inch: '1/4"', decimal: 0.2520 },
            normal: { mm: 6.6, inch: '17/64"', decimal: 0.2598 }
        },
        tapDrill: {
            mm: 5.0,
            inch: '13/64"',
            decimal: 0.1969
        }
    },
    'M8': {
        thread: 'M8 × 1.25',
        pitch: 1.25,
        majorDia: 8.0,
        clearance: {
            close: { mm: 8.4, inch: '21/64"', decimal: 0.3307 },
            normal: { mm: 9.0, inch: '23/64"', decimal: 0.3543 }
        },
        tapDrill: {
            mm: 6.8,
            inch: '17/64"',
            decimal: 0.2677
        }
    },
    'M10': {
        thread: 'M10 × 1.5',
        pitch: 1.5,
        majorDia: 10.0,
        clearance: {
            close: { mm: 10.5, inch: '27/64"', decimal: 0.4134 },
            normal: { mm: 11.0, inch: '7/16"', decimal: 0.4331 }
        },
        tapDrill: {
            mm: 8.5,
            inch: '21/64"',
            decimal: 0.3346
        }
    },
    'M12': {
        thread: 'M12 × 1.75',
        pitch: 1.75,
        majorDia: 12.0,
        clearance: {
            close: { mm: 13.0, inch: '33/64"', decimal: 0.5118 },
            normal: { mm: 14.0, inch: '35/64"', decimal: 0.5512 }
        },
        tapDrill: {
            mm: 10.2,
            inch: '13/32"',
            decimal: 0.4016
        }
    },
    'M14': {
        thread: 'M14 × 2.0',
        pitch: 2.0,
        majorDia: 14.0,
        clearance: {
            close: { mm: 15.0, inch: '19/32"', decimal: 0.5906 },
            normal: { mm: 16.0, inch: '5/8"', decimal: 0.6299 }
        },
        tapDrill: {
            mm: 12.0,
            inch: '15/32"',
            decimal: 0.4724
        }
    },
    'M16': {
        thread: 'M16 × 2.0',
        pitch: 2.0,
        majorDia: 16.0,
        clearance: {
            close: { mm: 17.0, inch: '43/64"', decimal: 0.6693 },
            normal: { mm: 18.0, inch: '45/64"', decimal: 0.7087 }
        },
        tapDrill: {
            mm: 14.0,
            inch: '35/64"',
            decimal: 0.5512
        }
    },
    'M18': {
        thread: 'M18 × 2.5',
        pitch: 2.5,
        majorDia: 18.0,
        clearance: {
            close: { mm: 19.0, inch: '3/4"', decimal: 0.7480 },
            normal: { mm: 20.0, inch: '51/64"', decimal: 0.7874 }
        },
        tapDrill: {
            mm: 15.5,
            inch: '39/64"',
            decimal: 0.6102
        }
    },
    'M20': {
        thread: 'M20 × 2.5',
        pitch: 2.5,
        majorDia: 20.0,
        clearance: {
            close: { mm: 21.0, inch: '53/64"', decimal: 0.8268 },
            normal: { mm: 22.0, inch: '55/64"', decimal: 0.8661 }
        },
        tapDrill: {
            mm: 17.5,
            inch: '11/16"',
            decimal: 0.6890
        }
    },
    'M22': {
        thread: 'M22 × 2.5',
        pitch: 2.5,
        majorDia: 22.0,
        clearance: {
            close: { mm: 23.0, inch: '29/32"', decimal: 0.9055 },
            normal: { mm: 24.0, inch: '15/16"', decimal: 0.9449 }
        },
        tapDrill: {
            mm: 19.5,
            inch: '49/64"',
            decimal: 0.7677
        }
    },
    'M24': {
        thread: 'M24 × 3.0',
        pitch: 3.0,
        majorDia: 24.0,
        clearance: {
            close: { mm: 25.0, inch: '63/64"', decimal: 0.9843 },
            normal: { mm: 26.0, inch: '1-1/32"', decimal: 1.0236 }
        },
        tapDrill: {
            mm: 21.0,
            inch: '53/64"',
            decimal: 0.8268
        }
    },
    'M27': {
        thread: 'M27 × 3.0',
        pitch: 3.0,
        majorDia: 27.0,
        clearance: {
            close: { mm: 28.0, inch: '1-7/64"', decimal: 1.1024 },
            normal: { mm: 30.0, inch: '1-3/16"', decimal: 1.1811 }
        },
        tapDrill: {
            mm: 24.0,
            inch: '15/16"',
            decimal: 0.9449
        }
    },
    'M30': {
        thread: 'M30 × 3.5',
        pitch: 3.5,
        majorDia: 30.0,
        clearance: {
            close: { mm: 31.0, inch: '1-7/32"', decimal: 1.2205 },
            normal: { mm: 33.0, inch: '1-5/16"', decimal: 1.2992 }
        },
        tapDrill: {
            mm: 26.5,
            inch: '1-3/32"',
            decimal: 1.0433
        }
    }
}

/**
 * Imperial (Unified) bolt data - UNC (Coarse) thread series
 * Includes clearance holes and tap drills
 */
export const imperialBolts: Record<string, any> = {
    '#0': {
        thread: '#0-80 UNF',
        pitch: 80,
        majorDia: 0.060,
        majorDiaMM: 1.524,
        clearance: {
            close: { inch: '1/16"', decimal: 0.0625, mm: 1.59 },
            normal: { inch: '5/64"', decimal: 0.0781, mm: 1.98 }
        },
        tapDrill: {
            inch: '3/64"',
            decimal: 0.0469,
            mm: 1.19,
            numberDrill: '#56'
        }
    },
    '#1': {
        thread: '#1-64 UNC',
        pitch: 64,
        majorDia: 0.073,
        majorDiaMM: 1.854,
        clearance: {
            close: { inch: '5/64"', decimal: 0.0781, mm: 1.98 },
            normal: { inch: '3/32"', decimal: 0.0938, mm: 2.38 }
        },
        tapDrill: {
            inch: '—',
            decimal: 0.0550,
            mm: 1.40,
            numberDrill: '#53'
        }
    },
    '#2': {
        thread: '#2-56 UNC',
        pitch: 56,
        majorDia: 0.086,
        majorDiaMM: 2.184,
        clearance: {
            close: { inch: '3/32"', decimal: 0.0938, mm: 2.38 },
            normal: { inch: '7/64"', decimal: 0.1094, mm: 2.78 }
        },
        tapDrill: {
            inch: '—',
            decimal: 0.0700,
            mm: 1.78,
            numberDrill: '#50'
        }
    },
    '#3': {
        thread: '#3-48 UNC',
        pitch: 48,
        majorDia: 0.099,
        majorDiaMM: 2.515,
        clearance: {
            close: { inch: '7/64"', decimal: 0.1094, mm: 2.78 },
            normal: { inch: '1/8"', decimal: 0.1250, mm: 3.18 }
        },
        tapDrill: {
            inch: '—',
            decimal: 0.0785,
            mm: 1.99,
            numberDrill: '#47'
        }
    },
    '#4': {
        thread: '#4-40 UNC',
        pitch: 40,
        majorDia: 0.112,
        majorDiaMM: 2.845,
        clearance: {
            close: { inch: '1/8"', decimal: 0.1250, mm: 3.18 },
            normal: { inch: '9/64"', decimal: 0.1406, mm: 3.57 }
        },
        tapDrill: {
            inch: '—',
            decimal: 0.0890,
            mm: 2.26,
            numberDrill: '#43'
        }
    },
    '#5': {
        thread: '#5-40 UNC',
        pitch: 40,
        majorDia: 0.125,
        majorDiaMM: 3.175,
        clearance: {
            close: { inch: '9/64"', decimal: 0.1406, mm: 3.57 },
            normal: { inch: '5/32"', decimal: 0.1563, mm: 3.97 }
        },
        tapDrill: {
            inch: '—',
            decimal: 0.1015,
            mm: 2.58,
            numberDrill: '#38'
        }
    },
    '#6': {
        thread: '#6-32 UNC',
        pitch: 32,
        majorDia: 0.138,
        majorDiaMM: 3.505,
        clearance: {
            close: { inch: '9/64"', decimal: 0.1406, mm: 3.57 },
            normal: { inch: '5/32"', decimal: 0.1563, mm: 3.97 }
        },
        tapDrill: {
            inch: '—',
            decimal: 0.1065,
            mm: 2.71,
            numberDrill: '#36'
        }
    },
    '#8': {
        thread: '#8-32 UNC',
        pitch: 32,
        majorDia: 0.164,
        majorDiaMM: 4.166,
        clearance: {
            close: { inch: '11/64"', decimal: 0.1719, mm: 4.37 },
            normal: { inch: '3/16"', decimal: 0.1875, mm: 4.76 }
        },
        tapDrill: {
            inch: '—',
            decimal: 0.1360,
            mm: 3.45,
            numberDrill: '#29'
        }
    },
    '#10': {
        thread: '#10-24 UNC',
        pitch: 24,
        majorDia: 0.190,
        majorDiaMM: 4.826,
        clearance: {
            close: { inch: '13/64"', decimal: 0.2031, mm: 5.16 },
            normal: { inch: '7/32"', decimal: 0.2188, mm: 5.56 }
        },
        tapDrill: {
            inch: '—',
            decimal: 0.1495,
            mm: 3.80,
            numberDrill: '#25'
        }
    },
    '#12': {
        thread: '#12-24 UNC',
        pitch: 24,
        majorDia: 0.216,
        majorDiaMM: 5.486,
        clearance: {
            close: { inch: '15/64"', decimal: 0.2344, mm: 5.95 },
            normal: { inch: '1/4"', decimal: 0.2500, mm: 6.35 }
        },
        tapDrill: {
            inch: '—',
            decimal: 0.1770,
            mm: 4.50,
            numberDrill: '#16'
        }
    },
    '1/4"': {
        thread: '1/4"-20 UNC',
        pitch: 20,
        majorDia: 0.250,
        majorDiaMM: 6.350,
        clearance: {
            close: { inch: '17/64"', decimal: 0.2656, mm: 6.75 },
            normal: { inch: '9/32"', decimal: 0.2813, mm: 7.14 }
        },
        tapDrill: {
            inch: '#7',
            decimal: 0.2010,
            mm: 5.11,
            numberDrill: '#7'
        }
    },
    '5/16"': {
        thread: '5/16"-18 UNC',
        pitch: 18,
        majorDia: 0.3125,
        majorDiaMM: 7.938,
        clearance: {
            close: { inch: '21/64"', decimal: 0.3281, mm: 8.33 },
            normal: { inch: '11/32"', decimal: 0.3438, mm: 8.73 }
        },
        tapDrill: {
            inch: 'F',
            decimal: 0.2570,
            mm: 6.53,
            letterDrill: 'F'
        }
    },
    '3/8"': {
        thread: '3/8"-16 UNC',
        pitch: 16,
        majorDia: 0.375,
        majorDiaMM: 9.525,
        clearance: {
            close: { inch: '25/64"', decimal: 0.3906, mm: 9.92 },
            normal: { inch: '13/32"', decimal: 0.4063, mm: 10.32 }
        },
        tapDrill: {
            inch: '5/16"',
            decimal: 0.3125,
            mm: 7.94,
            letterDrill: '—'
        }
    },
    '7/16"': {
        thread: '7/16"-14 UNC',
        pitch: 14,
        majorDia: 0.4375,
        majorDiaMM: 11.113,
        clearance: {
            close: { inch: '29/64"', decimal: 0.4531, mm: 11.51 },
            normal: { inch: '15/32"', decimal: 0.4688, mm: 11.91 }
        },
        tapDrill: {
            inch: 'U',
            decimal: 0.3680,
            mm: 9.35,
            letterDrill: 'U'
        }
    },
    '1/2"': {
        thread: '1/2"-13 UNC',
        pitch: 13,
        majorDia: 0.500,
        majorDiaMM: 12.700,
        clearance: {
            close: { inch: '33/64"', decimal: 0.5156, mm: 13.10 },
            normal: { inch: '17/32"', decimal: 0.5313, mm: 13.49 }
        },
        tapDrill: {
            inch: '27/64"',
            decimal: 0.4219,
            mm: 10.72,
            letterDrill: '—'
        }
    },
    '9/16"': {
        thread: '9/16"-12 UNC',
        pitch: 12,
        majorDia: 0.5625,
        majorDiaMM: 14.288,
        clearance: {
            close: { inch: '37/64"', decimal: 0.5781, mm: 14.68 },
            normal: { inch: '19/32"', decimal: 0.5938, mm: 15.08 }
        },
        tapDrill: {
            inch: '31/64"',
            decimal: 0.4844,
            mm: 12.30,
            letterDrill: '—'
        }
    },
    '5/8"': {
        thread: '5/8"-11 UNC',
        pitch: 11,
        majorDia: 0.625,
        majorDiaMM: 15.875,
        clearance: {
            close: { inch: '41/64"', decimal: 0.6406, mm: 16.27 },
            normal: { inch: '21/32"', decimal: 0.6563, mm: 16.67 }
        },
        tapDrill: {
            inch: '17/32"',
            decimal: 0.5313,
            mm: 13.49,
            letterDrill: '—'
        }
    },
    '3/4"': {
        thread: '3/4"-10 UNC',
        pitch: 10,
        majorDia: 0.750,
        majorDiaMM: 19.050,
        clearance: {
            close: { inch: '49/64"', decimal: 0.7656, mm: 19.45 },
            normal: { inch: '25/32"', decimal: 0.7813, mm: 19.84 }
        },
        tapDrill: {
            inch: '21/32"',
            decimal: 0.6563,
            mm: 16.67,
            letterDrill: '—'
        }
    },
    '7/8"': {
        thread: '7/8"-9 UNC',
        pitch: 9,
        majorDia: 0.875,
        majorDiaMM: 22.225,
        clearance: {
            close: { inch: '57/64"', decimal: 0.8906, mm: 22.62 },
            normal: { inch: '29/32"', decimal: 0.9063, mm: 23.02 }
        },
        tapDrill: {
            inch: '49/64"',
            decimal: 0.7656,
            mm: 19.45,
            letterDrill: '—'
        }
    },
    '1"': {
        thread: '1"-8 UNC',
        pitch: 8,
        majorDia: 1.000,
        majorDiaMM: 25.400,
        clearance: {
            close: { inch: '1-1/64"', decimal: 1.0156, mm: 25.80 },
            normal: { inch: '1-1/32"', decimal: 1.0313, mm: 26.19 }
        },
        tapDrill: {
            inch: '7/8"',
            decimal: 0.8750,
            mm: 22.23,
            letterDrill: '—'
        }
    }
}

/**
 * Get all metric bolt sizes
 * @returns {Array<string>} Array of metric bolt size keys
 */
export function getMetricBoltSizes() {
    return Object.keys(metricBolts)
}

/**
 * Get all imperial bolt sizes
 * @returns {Array<string>} Array of imperial bolt size keys
 */
export function getImperialBoltSizes() {
    return Object.keys(imperialBolts)
}

/**
 * Get bolt data by size (searches both metric and imperial)
 * @param {string} size - The bolt size (e.g., 'M6' or '1/4"')
 * @returns {Object|null} Bolt data object or null if not found
 */
export function getBoltData(size: any) {
    return metricBolts[size] || imperialBolts[size] || null
}

/**
 * Determine if a bolt size is metric
 * @param {string} size - The bolt size
 * @returns {boolean} True if metric, false otherwise
 */
export function isMetricBolt(size: any) {
    return size.startsWith('M')
}
