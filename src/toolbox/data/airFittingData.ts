/**
 * Air Fitting Data
 * Thread specifications, compatibility, and push-in tube sizes
 * @module data/airFittingData
 */

// Thread type specifications
export const threadTypes: Record<string, any> = {
    'NPT': {
        name: 'NPT',
        fullName: 'National Pipe Taper',
        origin: 'USA',
        type: 'Tapered',
        sealMethod: 'Thread interference + sealant/tape',
        angle: '60°',
        description: 'American tapered pipe thread. Seals on thread interference, requires PTFE tape or sealant.',
        notes: 'Most common in North America. Not compatible with parallel threads without adapter.'
    },
    'NPTF': {
        name: 'NPTF',
        fullName: 'National Pipe Taper Fuel (Dryseal)',
        origin: 'USA',
        type: 'Tapered',
        sealMethod: 'Thread interference (dryseal)',
        angle: '60°',
        description: 'Dryseal version of NPT. Designed to seal without tape or sealant.',
        notes: 'Tighter tolerances than NPT. Can be used where sealant is undesirable.'
    },
    'BSPT': {
        name: 'BSPT',
        fullName: 'British Standard Pipe Taper',
        origin: 'UK',
        type: 'Tapered',
        sealMethod: 'Thread interference + sealant/tape',
        angle: '55°',
        description: 'British tapered pipe thread. Similar function to NPT but different angle.',
        notes: 'Also known as R thread (ISO 7). Compatible with BSPP female ports.'
    },
    'BSPP': {
        name: 'BSPP',
        fullName: 'British Standard Pipe Parallel',
        origin: 'UK',
        type: 'Parallel',
        sealMethod: 'Bonded seal or O-ring',
        angle: '55°',
        description: 'British parallel pipe thread. Requires seal at face or O-ring.',
        notes: 'Also known as G thread (ISO 228). Very common in pneumatics worldwide.'
    },
    'G': {
        name: 'G Thread',
        fullName: 'ISO 228 Parallel Thread',
        origin: 'International (ISO)',
        type: 'Parallel',
        sealMethod: 'Bonded seal or O-ring',
        angle: '55°',
        description: 'ISO standard parallel thread. Mechanically identical to BSPP.',
        notes: 'G thread IS BSPP. The terms are interchangeable. Most common in metric pneumatics.'
    },
    'R': {
        name: 'R Thread',
        fullName: 'ISO 7 Tapered Thread',
        origin: 'International (ISO)',
        type: 'Tapered',
        sealMethod: 'Thread interference + sealant/tape',
        angle: '55°',
        description: 'ISO standard tapered thread. Mechanically identical to BSPT.',
        notes: 'R thread IS BSPT. The terms are interchangeable.'
    },
    'Metric': {
        name: 'Metric',
        fullName: 'ISO Metric Thread',
        origin: 'International (ISO)',
        type: 'Parallel',
        sealMethod: 'O-ring or bonded seal',
        angle: '60°',
        description: 'Standard metric threads (M5, M6, etc.) used with O-ring boss fittings.',
        notes: 'Common in European pneumatic systems. Requires sealing washer or O-ring.'
    },
    'UNF': {
        name: 'UNF',
        fullName: 'Unified National Fine',
        origin: 'USA',
        type: 'Parallel',
        sealMethod: 'O-ring or gasket',
        angle: '60°',
        description: 'American fine thread series. Used for fittings with O-ring seal.',
        notes: 'Often used with SAE O-ring boss (ORB) fittings.'
    }
}

// Thread compatibility matrix
// Key: thread type that can connect INTO the value array thread types
export const threadCompatibility: Record<string, any> = {
    'BSPT': {
        canSealInto: ['BSPP', 'G', 'BSPT', 'R'],
        note: 'BSPT (tapered) seals into tapered BSPT/Rc female ports (the standard ISO 7 joint) and can also seal into BSPP/G (parallel) female ports via thread interference.'
    },
    'BSPP': {
        canSealInto: ['BSPP', 'G'],
        note: 'BSPP to BSPP requires bonded seal washer or O-ring. Direct thread-to-thread does not seal.'
    },
    'G': {
        canSealInto: ['BSPP', 'G'],
        note: 'G thread is identical to BSPP. Same compatibility rules apply.'
    },
    'R': {
        canSealInto: ['BSPP', 'G', 'R', 'BSPT'],
        note: 'R thread is identical to BSPT. Tapered male into parallel female creates seal.'
    },
    'NPT': {
        canSealInto: ['NPT', 'NPTF'],
        note: 'NPT threads are NOT compatible with BSP threads. Different thread angle (60° vs 55°).'
    },
    'NPTF': {
        canSealInto: ['NPT', 'NPTF'],
        note: 'NPTF can seal with NPT but provides better dryseal capability.'
    },
    'Metric': {
        canSealInto: ['Metric'],
        note: 'Metric threads only mate with same metric size. Require O-ring or bonded seal.'
    },
    'UNF': {
        canSealInto: ['UNF'],
        note: 'UNF threads only mate with same UNF size. Typically used with O-ring boss.'
    }
}

// Thread sizes with specifications
// tubeSizesMetric: designed for metric tubing (mm OD)
// tubeSizesImperial: designed for imperial tubing (fractional inch OD)
export const threadSizes: Record<string, any> = {
    // NPT sizes - American threads designed for imperial tubing
    'NPT': {
        '1/16': { od: 7.94, tpi: 27, tubeSizesMetric: [], tubeSizesImperial: ['5/32'] },
        '1/8': { od: 10.29, tpi: 27, tubeSizesMetric: [], tubeSizesImperial: ['5/32', '1/4'] },
        '1/4': { od: 13.72, tpi: 18, tubeSizesMetric: [], tubeSizesImperial: ['1/4', '5/16', '3/8'] },
        '3/8': { od: 17.14, tpi: 18, tubeSizesMetric: [], tubeSizesImperial: ['1/4', '5/16', '3/8'] },
        '1/2': { od: 21.34, tpi: 14, tubeSizesMetric: [], tubeSizesImperial: ['3/8', '1/2', '5/8'] },
        '3/4': { od: 26.67, tpi: 14, tubeSizesMetric: [], tubeSizesImperial: ['1/2', '5/8', '3/4'] },
        '1': { od: 33.40, tpi: 11.5, tubeSizesMetric: [], tubeSizesImperial: ['5/8', '3/4', '1'] }
    },
    // BSPP/G sizes - International threads designed for metric tubing
    'BSPP': {
        'G1/8': { od: 9.73, tpi: 28, tubeSizesMetric: [4, 6, 8], tubeSizesImperial: [] },
        'G1/4': { od: 13.16, tpi: 19, tubeSizesMetric: [4, 6, 8, 10], tubeSizesImperial: [] },
        'G3/8': { od: 16.66, tpi: 19, tubeSizesMetric: [6, 8, 10, 12], tubeSizesImperial: [] },
        'G1/2': { od: 20.95, tpi: 14, tubeSizesMetric: [8, 10, 12, 16], tubeSizesImperial: [] },
        'G3/4': { od: 26.44, tpi: 14, tubeSizesMetric: [10, 12, 16], tubeSizesImperial: [] },
        'G1': { od: 33.25, tpi: 11, tubeSizesMetric: [12, 16], tubeSizesImperial: [] }
    },
    // BSPT/R sizes - International threads designed for metric tubing
    'BSPT': {
        'R1/8': { od: 9.73, tpi: 28, tubeSizesMetric: [4, 6, 8], tubeSizesImperial: [] },
        'R1/4': { od: 13.16, tpi: 19, tubeSizesMetric: [4, 6, 8, 10], tubeSizesImperial: [] },
        'R3/8': { od: 16.66, tpi: 19, tubeSizesMetric: [6, 8, 10, 12], tubeSizesImperial: [] },
        'R1/2': { od: 20.95, tpi: 14, tubeSizesMetric: [8, 10, 12, 16], tubeSizesImperial: [] },
        'R3/4': { od: 26.44, tpi: 14, tubeSizesMetric: [10, 12, 16], tubeSizesImperial: [] },
        'R1': { od: 33.25, tpi: 11, tubeSizesMetric: [12, 16], tubeSizesImperial: [] }
    },
    // Metric thread sizes - designed for metric tubing
    'Metric': {
        'M5': { od: 5.0, pitch: 0.8, tubeSizesMetric: [4], tubeSizesImperial: [] },
        'M6': { od: 6.0, pitch: 1.0, tubeSizesMetric: [4, 6], tubeSizesImperial: [] },
        'M8': { od: 8.0, pitch: 1.25, tubeSizesMetric: [4, 6], tubeSizesImperial: [] },
        'M10': { od: 10.0, pitch: 1.5, tubeSizesMetric: [6, 8], tubeSizesImperial: [] },
        'M12': { od: 12.0, pitch: 1.75, tubeSizesMetric: [6, 8, 10], tubeSizesImperial: [] },
        'M14': { od: 14.0, pitch: 2.0, tubeSizesMetric: [8, 10], tubeSizesImperial: [] },
        'M16': { od: 16.0, pitch: 2.0, tubeSizesMetric: [8, 10, 12], tubeSizesImperial: [] },
        'M20': { od: 20.0, pitch: 2.5, tubeSizesMetric: [10, 12], tubeSizesImperial: [] },
        'M22': { od: 22.0, pitch: 2.5, tubeSizesMetric: [12, 16], tubeSizesImperial: [] }
    }
}

// Copy G thread sizes from BSPP (they're identical)
threadSizes['G'] = { ...threadSizes['BSPP'] }
threadSizes['R'] = { ...threadSizes['BSPT'] }

// Standard push-in tube sizes (metric mm)
// maxSCFM values are approximate at 100 PSI (7 bar) for short runs (<3m)
export const tubeSizes: Record<string, any> = {
    4: { od: 4, id: 2.5, maxPressure: 10, maxSCFM: 3, notes: 'Smallest common size. Sensors, pilots.' },
    6: { od: 6, id: 4, maxPressure: 10, maxSCFM: 8, notes: 'Very common. Small cylinders, valves.' },
    8: { od: 8, id: 5.5, maxPressure: 10, maxSCFM: 15, notes: 'Medium flow. Most common general use.' },
    10: { od: 10, id: 7.5, maxPressure: 10, maxSCFM: 28, notes: 'Higher flow. Medium cylinders.' },
    12: { od: 12, id: 9, maxPressure: 10, maxSCFM: 42, notes: 'Large bore cylinders.' },
    16: { od: 16, id: 13, maxPressure: 8, maxSCFM: 75, notes: 'Very high flow applications.' }
}

// Imperial tube sizes (for NPT and other American fittings)
// maxSCFM values are approximate at 100 PSI for short runs (<10ft)
export const imperialTubeSizes: Record<string, any> = {
    '5/32': { od: 3.97, odIn: 0.156, id: 2.38, idIn: 0.094, maxPressure: 10, maxSCFM: 2, notes: 'Smallest. Pilots, sensors.' },
    '1/4': { od: 6.35, odIn: 0.250, id: 4.32, idIn: 0.170, maxPressure: 10, maxSCFM: 9, notes: 'Very common. Small cylinders.' },
    '5/16': { od: 7.94, odIn: 0.313, id: 5.56, idIn: 0.219, maxPressure: 10, maxSCFM: 16, notes: 'Medium flow applications.' },
    '3/8': { od: 9.53, odIn: 0.375, id: 6.35, idIn: 0.250, maxPressure: 10, maxSCFM: 22, notes: 'Common general purpose.' },
    '1/2': { od: 12.7, odIn: 0.500, id: 9.53, idIn: 0.375, maxPressure: 10, maxSCFM: 45, notes: 'Higher flow. Medium cylinders.' },
    '5/8': { od: 15.88, odIn: 0.625, id: 12.7, idIn: 0.500, maxPressure: 8, maxSCFM: 80, notes: 'Large bore cylinders.' },
    '3/4': { od: 19.05, odIn: 0.750, id: 15.88, idIn: 0.625, maxPressure: 8, maxSCFM: 125, notes: 'High flow applications.' },
    '1': { od: 25.4, odIn: 1.000, id: 22.23, idIn: 0.875, maxPressure: 6, maxSCFM: 200, notes: 'Very high flow, main lines.' }
}

// Thread crossover guide - what can physically thread together
export const threadCrossover = [
    {
        group: 'BSPP / G / BSPT / R Family',
        threads: ['BSPP', 'G', 'BSPT', 'R'],
        explanation: 'All 55° Whitworth thread angle. BSPP and G are identical parallel threads. BSPT and R are identical tapered threads.',
        compatibility: [
            { male: 'BSPT', female: 'BSPP', seals: true, note: 'Tapered male into parallel female = seal on thread interference' },
            { male: 'BSPT', female: 'G', seals: true, note: 'Same as BSPT into BSPP' },
            { male: 'R', female: 'BSPP', seals: true, note: 'R is identical to BSPT' },
            { male: 'R', female: 'G', seals: true, note: 'R is identical to BSPT' },
            { male: 'BSPP', female: 'BSPP', seals: false, note: 'Parallel to parallel - needs bonded seal or O-ring' },
            { male: 'BSPP', female: 'G', seals: false, note: 'Same thread - needs seal washer' },
            { male: 'G', female: 'BSPP', seals: false, note: 'Same thread - needs seal washer' },
            { male: 'G', female: 'G', seals: false, note: 'Same thread - needs seal washer' }
        ]
    },
    {
        group: 'NPT / NPTF Family',
        threads: ['NPT', 'NPTF'],
        explanation: 'American 60° thread angle. Tapered threads that seal on interference.',
        compatibility: [
            { male: 'NPT', female: 'NPT', seals: true, note: 'With PTFE tape or pipe dope' },
            { male: 'NPT', female: 'NPTF', seals: true, note: 'NPT can mate with NPTF' },
            { male: 'NPTF', female: 'NPT', seals: true, note: 'NPTF provides better dryseal' },
            { male: 'NPTF', female: 'NPTF', seals: true, note: 'Dryseal - no sealant needed' }
        ]
    },
    {
        group: 'NOT Compatible',
        threads: ['NPT', 'NPTF', 'BSPP', 'G', 'BSPT', 'R'],
        explanation: 'NPT (60°) and BSP (55°) flank angles never match. Beware: 1/2" and 3/4" share the same 14 TPI pitch, so those sizes thread together snugly and feel right — then slow-leak under pressure. Other sizes differ in pitch as well (e.g. 1/8": 27 vs 28 TPI).',
        compatibility: [
            { male: 'NPT', female: 'BSPP', compatible: false, seals: false, note: '⚠️ DO NOT USE - 60° male in 55° female, will leak and damage threads' },
            { male: 'NPT', female: 'G', compatible: false, seals: false, note: '⚠️ DO NOT USE - G is BSPP; same angle mismatch' },
            { male: 'NPT', female: 'BSPT', compatible: false, seals: false, note: '⚠️ DO NOT USE - Different thread angle' },
            { male: 'BSPT', female: 'NPT', compatible: false, seals: false, note: '⚠️ DO NOT USE - Different thread angle' },
            { male: 'BSPP', female: 'NPT', compatible: false, seals: false, note: '⚠️ DO NOT USE - Different thread angle' },
            { male: 'G', female: 'NPT', compatible: false, seals: false, note: '⚠️ DO NOT USE - Different thread angle' }
        ]
    }
]

// Helper functions
export function getThreadTypes() {
    return Object.keys(threadTypes)
}

export function getThreadInfo(type: any) {
    return threadTypes[type] || null
}

export function getThreadSizes(type: any) {
    // Normalize type names
    const normalizedType = type === 'G' ? 'BSPP' : (type === 'R' ? 'BSPT' : type)
    return threadSizes[normalizedType] || threadSizes[type] || null
}

export function getSizeList(type: any) {
    const sizes = getThreadSizes(type)
    return sizes ? Object.keys(sizes) : []
}

export function getThreadSizeInfo(type: any, size: any) {
    const sizes = getThreadSizes(type)
    return sizes ? sizes[size] : null
}

export function getTubeSizesForThread(type: any, size: any) {
    const sizeInfo = getThreadSizeInfo(type, size)
    if (!sizeInfo) return { metric: [], imperial: [] }
    return {
        metric: sizeInfo.tubeSizesMetric || [],
        imperial: sizeInfo.tubeSizesImperial || []
    }
}

export function getTubeInfo(tubeSize: any, isImperial: boolean = false) {
    if (isImperial) {
        return imperialTubeSizes[tubeSize] || null
    }
    return tubeSizes[tubeSize] || null
}

export function getImperialTubeInfo(tubeSize: any) {
    return imperialTubeSizes[tubeSize] || null
}

export function getCompatibleThreads(type: any) {
    return threadCompatibility[type] || null
}

export function canThreadsConnect(maleType: any, femaleType: any) {
    const compat = threadCompatibility[maleType]
    if (!compat) return { compatible: false, note: 'Unknown thread type' }

    const canConnect = compat.canSealInto.includes(femaleType)
    return {
        compatible: canConnect,
        seals: canConnect,
        note: compat.note
    }
}

// Get all crossover information
export function getThreadCrossover() {
    return threadCrossover
}

// Common adapter configurations between thread systems
// Maps thread sizes to available adapter conversions
export const adapterData: Record<string, any> = {
    // NPT to metric/BSP adapters
    'NPT': {
        '1/8': [
            { to: 'G1/8', toType: 'BSPP', common: true, note: 'Very common adapter' },
            { to: 'M5', toType: 'Metric', common: false, note: 'Less common' }
        ],
        '1/4': [
            { to: 'G1/4', toType: 'BSPP', common: true, note: 'Very common adapter' },
            { to: 'G1/8', toType: 'BSPP', common: true, note: 'Step-down adapter' },
            { to: 'M10', toType: 'Metric', common: false, note: 'Specialty adapter' }
        ],
        '3/8': [
            { to: 'G3/8', toType: 'BSPP', common: true, note: 'Very common adapter' },
            { to: 'G1/4', toType: 'BSPP', common: true, note: 'Step-down adapter' }
        ],
        '1/2': [
            { to: 'G1/2', toType: 'BSPP', common: true, note: 'Very common adapter' },
            { to: 'G3/8', toType: 'BSPP', common: true, note: 'Step-down adapter' }
        ],
        '3/4': [
            { to: 'G3/4', toType: 'BSPP', common: true, note: 'Common adapter' },
            { to: 'G1/2', toType: 'BSPP', common: true, note: 'Step-down adapter' }
        ],
        '1': [
            { to: 'G1', toType: 'BSPP', common: true, note: 'Common adapter' }
        ]
    },
    // BSPP/G to NPT adapters
    'BSPP': {
        'G1/8': [
            { to: '1/8', toType: 'NPT', common: true, note: 'Very common adapter' },
            { to: '1/4', toType: 'NPT', common: true, note: 'Step-up adapter' }
        ],
        'G1/4': [
            { to: '1/4', toType: 'NPT', common: true, note: 'Very common adapter' },
            { to: '1/8', toType: 'NPT', common: true, note: 'Step-down adapter' },
            { to: '3/8', toType: 'NPT', common: true, note: 'Step-up adapter' }
        ],
        'G3/8': [
            { to: '3/8', toType: 'NPT', common: true, note: 'Very common adapter' },
            { to: '1/4', toType: 'NPT', common: true, note: 'Step-down adapter' }
        ],
        'G1/2': [
            { to: '1/2', toType: 'NPT', common: true, note: 'Very common adapter' },
            { to: '3/8', toType: 'NPT', common: true, note: 'Step-down adapter' }
        ],
        'G3/4': [
            { to: '3/4', toType: 'NPT', common: true, note: 'Common adapter' }
        ],
        'G1': [
            { to: '1', toType: 'NPT', common: true, note: 'Common adapter' }
        ]
    },
    // Metric to NPT/BSPP adapters
    'Metric': {
        'M5': [
            { to: 'G1/8', toType: 'BSPP', common: true, note: 'Common adapter' },
            { to: '1/8', toType: 'NPT', common: false, note: 'Less common' }
        ],
        'M6': [
            { to: 'G1/8', toType: 'BSPP', common: true, note: 'Common adapter' }
        ],
        'M10': [
            { to: 'G1/8', toType: 'BSPP', common: true, note: 'Common adapter' },
            { to: 'G1/4', toType: 'BSPP', common: true, note: 'Step-up adapter' }
        ],
        'M12': [
            { to: 'G1/4', toType: 'BSPP', common: true, note: 'Common adapter' }
        ],
        'M16': [
            { to: 'G3/8', toType: 'BSPP', common: true, note: 'Common adapter' }
        ],
        'M22': [
            { to: 'G1/2', toType: 'BSPP', common: true, note: 'Common adapter' }
        ]
    }
}

// Copy adapters for equivalent thread types
adapterData['G'] = adapterData['BSPP']
adapterData['NPTF'] = adapterData['NPT']
adapterData['BSPT'] = {} // BSPT typically connects directly to BSPP, no adapter needed
adapterData['R'] = {}

// Get available adapters for a specific thread size
export function getAdaptersForSize(type: any, size: any) {
    // Normalize type
    const normalizedType = type === 'G' ? 'BSPP' : (type === 'R' ? 'BSPT' : type)

    const typeAdapters = adapterData[normalizedType]
    if (!typeAdapters) return []

    return typeAdapters[size] || []
}
