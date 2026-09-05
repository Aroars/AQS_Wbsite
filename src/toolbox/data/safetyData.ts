/**
 * Safety & Compliance Data
 * Reference data for OSHA, ISO, and other safety standards
 * @module data/safetyData
 */

/**
 * Safety Distance Constants (ISO 13855 / OSHA 1910.217)
 */
export const safetyDistanceConstants: Record<string, any> = {
    // Hand/arm approach speeds
    handSpeed: {
        iso: { value: 2000, unit: 'mm/s', label: 'ISO 13855 (hand/arm)' },
        isoWalking: { value: 1600, unit: 'mm/s', label: 'ISO 13855 (walking)' },
        osha: { value: 63, unit: 'in/s', label: 'OSHA 1910.217' }
    },
    // Penetration factors (C) by guard type - in mm
    penetrationFactors: {
        lightCurtain14: { value: 0, label: '14mm resolution (finger)', minHeight: 300 },
        lightCurtain20: { value: 80, label: '20mm resolution', minHeight: 300 },
        lightCurtain30: { value: 130, label: '30mm resolution', minHeight: 300 },
        lightCurtain40: { value: 240, label: '40mm resolution (hand)', minHeight: 300 },
        lightCurtain50: { value: 290, label: '50mm resolution', minHeight: 300 },
        lightCurtain70: { value: 400, label: '70mm resolution', minHeight: 300 },
        safetyMat: { value: 1200, label: 'Safety mat/scanner', minHeight: 0 },
        twoHand: { value: 250, label: 'Two-hand control', minHeight: 0 }
    }
}

/**
 * Guard Opening Reach Distances (ISO 13857)
 * Maximum reach through openings - dimensions in mm
 */
export const guardOpenings = {
    // Reach through regular openings (Table 1 - slot openings)
    slotOpenings: [
        { opening: '≤4', safeDistance: 2, bodyPart: 'Fingertip' },
        { opening: '>4 to ≤6', safeDistance: 10, bodyPart: 'Finger' },
        { opening: '>6 to ≤8', safeDistance: 20, bodyPart: 'Finger' },
        { opening: '>8 to ≤10', safeDistance: 80, bodyPart: 'Finger' },
        { opening: '>10 to ≤12', safeDistance: 100, bodyPart: 'Finger' },
        { opening: '>12 to ≤20', safeDistance: 120, bodyPart: 'Hand to wrist' },
        { opening: '>20 to ≤30', safeDistance: 850, bodyPart: 'Arm to shoulder' },
        { opening: '>30 to ≤40', safeDistance: 850, bodyPart: 'Arm to shoulder' },
        { opening: '>40 to ≤120', safeDistance: 850, bodyPart: 'Arm to shoulder' }
    ],
    // Square/round openings (Table 1)
    squareOpenings: [
        { opening: '≤4', safeDistance: 2, bodyPart: 'Fingertip' },
        { opening: '>4 to ≤6', safeDistance: 5, bodyPart: 'Fingertip' },
        { opening: '>6 to ≤8', safeDistance: 15, bodyPart: 'Finger' },
        { opening: '>8 to ≤10', safeDistance: 25, bodyPart: 'Finger' },
        { opening: '>10 to ≤12', safeDistance: 80, bodyPart: 'Finger' },
        { opening: '>12 to ≤20', safeDistance: 120, bodyPart: 'Finger to knuckle' },
        { opening: '>20 to ≤30', safeDistance: 200, bodyPart: 'Hand' },
        { opening: '>30 to ≤40', safeDistance: 200, bodyPart: 'Hand to wrist' },
        { opening: '>40 to ≤120', safeDistance: 850, bodyPart: 'Arm to shoulder' }
    ],
    // Reach over barriers (Table 2) - barrier height vs horizontal distance
    reachOver: [
        { barrierHeight: 1000, hazardHeight1000: 100, hazardHeight1200: 600, hazardHeight1400: 900, hazardHeight1600: 1100, hazardHeight1800: 1300, hazardHeight2000: 1400, hazardHeight2200: 1500, hazardHeight2400: 1500, hazardHeight2700: 1500 },
        { barrierHeight: 1200, hazardHeight1000: 0, hazardHeight1200: 500, hazardHeight1400: 800, hazardHeight1600: 1000, hazardHeight1800: 1200, hazardHeight2000: 1300, hazardHeight2200: 1400, hazardHeight2400: 1400, hazardHeight2700: 1400 },
        { barrierHeight: 1400, hazardHeight1000: 0, hazardHeight1200: 100, hazardHeight1400: 600, hazardHeight1600: 900, hazardHeight1800: 1000, hazardHeight2000: 1100, hazardHeight2200: 1200, hazardHeight2400: 1200, hazardHeight2700: 1200 },
        { barrierHeight: 1600, hazardHeight1000: 0, hazardHeight1200: 0, hazardHeight1400: 0, hazardHeight1600: 500, hazardHeight1800: 700, hazardHeight2000: 900, hazardHeight2200: 1000, hazardHeight2400: 1000, hazardHeight2700: 1000 },
        { barrierHeight: 1800, hazardHeight1000: 0, hazardHeight1200: 0, hazardHeight1400: 0, hazardHeight1600: 0, hazardHeight1800: 300, hazardHeight2000: 600, hazardHeight2200: 700, hazardHeight2400: 700, hazardHeight2700: 700 },
        { barrierHeight: 2000, hazardHeight1000: 0, hazardHeight1200: 0, hazardHeight1400: 0, hazardHeight1600: 0, hazardHeight1800: 0, hazardHeight2000: 200, hazardHeight2200: 400, hazardHeight2400: 400, hazardHeight2700: 400 },
        { barrierHeight: 2200, hazardHeight1000: 0, hazardHeight1200: 0, hazardHeight1400: 0, hazardHeight1600: 0, hazardHeight1800: 0, hazardHeight2000: 0, hazardHeight2200: 100, hazardHeight2400: 100, hazardHeight2700: 100 },
        { barrierHeight: 2400, hazardHeight1000: 0, hazardHeight1200: 0, hazardHeight1400: 0, hazardHeight1600: 0, hazardHeight1800: 0, hazardHeight2000: 0, hazardHeight2200: 0, hazardHeight2400: 0, hazardHeight2700: 0 }
    ]
}

/**
 * Risk Assessment - Performance Level (ISO 13849-1)
 * PLr determination based on severity, frequency, possibility
 */
export const riskAssessment = {
    // S = Severity, F = Frequency, P = Possibility of avoidance
    // Risk graph per ISO 13849-1:2015 Annex A, Figure A.1
    plrMatrix: {
        'S1-F1-P1': 'a',
        'S1-F1-P2': 'b',
        'S1-F2-P1': 'b',
        'S1-F2-P2': 'c',
        'S2-F1-P1': 'c',
        'S2-F1-P2': 'd',
        'S2-F2-P1': 'd',
        'S2-F2-P2': 'e'
    },
    severity: {
        S1: { label: 'S1 - Slight', description: 'Usually reversible injury (bruise, cut)' },
        S2: { label: 'S2 - Serious', description: 'Usually irreversible injury or death' }
    },
    frequency: {
        F1: { label: 'F1 - Seldom', description: 'Less than once per hour or short exposure' },
        F2: { label: 'F2 - Frequent', description: 'More than once per hour or prolonged exposure' }
    },
    possibility: {
        P1: { label: 'P1 - Possible', description: 'Avoidance possible under certain conditions' },
        P2: { label: 'P2 - Scarcely possible', description: 'Avoidance scarcely possible' }
    },
    plDescriptions: {
        a: { label: 'PL a', color: '#22c55e', description: 'Low risk - basic measures', mtbf: '≥100,000 hrs' },
        b: { label: 'PL b', color: '#84cc16', description: 'Moderate risk - single channel', mtbf: '≥30,000 hrs' },
        c: { label: 'PL c', color: '#eab308', description: 'Medium risk - monitored single channel', mtbf: '≥10,000 hrs' },
        d: { label: 'PL d', color: '#f97316', description: 'High risk - dual channel', mtbf: '≥1,000,000 hrs' },
        e: { label: 'PL e', color: '#ef4444', description: 'Very high risk - dual channel with monitoring', mtbf: '≥10,000,000 hrs' }
    }
}

/**
 * Noise Exposure Limits (OSHA 1910.95)
 */
export const noiseExposure = {
    // Permissible exposure times by dB level
    permissibleExposure: [
        { dB: 85, hours: 16 },
        { dB: 87, hours: 12 },
        { dB: 90, hours: 8 },
        { dB: 92, hours: 6 },
        { dB: 95, hours: 4 },
        { dB: 97, hours: 3 },
        { dB: 100, hours: 2 },
        { dB: 102, hours: 1.5 },
        { dB: 105, hours: 1 },
        { dB: 107, hours: 0.75 },
        { dB: 110, hours: 0.5 },
        { dB: 112, hours: 0.375 },
        { dB: 115, hours: 0.25 }
    ],
    actionLevel: 85,  // dB - hearing conservation program required
    pel: 90,          // dB - Permissible Exposure Limit (8-hour TWA)
    exchangeRate: 5,  // dB - OSHA uses 5dB exchange rate
    // NRR derating factor (OSHA method)
    nrrDerating: 0.5  // (NRR - 7) × 0.5
}

/**
 * Lighting Requirements (IES/OSHA)
 * Recommended illuminance levels by task
 */
export const lightingRequirements = {
    areas: [
        { area: 'Warehouses (inactive)', luxMin: 50, luxMax: 100, fcMin: 5, fcMax: 10 },
        { area: 'Warehouses (active)', luxMin: 100, luxMax: 200, fcMin: 10, fcMax: 20 },
        { area: 'Loading docks', luxMin: 100, luxMax: 200, fcMin: 10, fcMax: 20 },
        { area: 'Corridors/Hallways', luxMin: 100, luxMax: 150, fcMin: 10, fcMax: 15 },
        { area: 'General manufacturing', luxMin: 300, luxMax: 500, fcMin: 30, fcMax: 50 },
        { area: 'Assembly - rough', luxMin: 300, luxMax: 500, fcMin: 30, fcMax: 50 },
        { area: 'Assembly - medium', luxMin: 500, luxMax: 750, fcMin: 50, fcMax: 75 },
        { area: 'Assembly - fine', luxMin: 750, luxMax: 1000, fcMin: 75, fcMax: 100 },
        { area: 'Assembly - very fine', luxMin: 1000, luxMax: 1500, fcMin: 100, fcMax: 150 },
        { area: 'Inspection - general', luxMin: 500, luxMax: 1000, fcMin: 50, fcMax: 100 },
        { area: 'Inspection - detailed', luxMin: 1000, luxMax: 2000, fcMin: 100, fcMax: 200 },
        { area: 'Machine shops', luxMin: 300, luxMax: 500, fcMin: 30, fcMax: 50 },
        { area: 'CNC/Precision machining', luxMin: 500, luxMax: 1000, fcMin: 50, fcMax: 100 },
        { area: 'Welding area', luxMin: 300, luxMax: 500, fcMin: 30, fcMax: 50 },
        { area: 'Electrical/Control rooms', luxMin: 300, luxMax: 500, fcMin: 30, fcMax: 50 },
        { area: 'Offices - general', luxMin: 300, luxMax: 500, fcMin: 30, fcMax: 50 },
        { area: 'Offices - detailed work', luxMin: 500, luxMax: 750, fcMin: 50, fcMax: 75 },
        { area: 'Stairs/Exits', luxMin: 100, luxMax: 150, fcMin: 10, fcMax: 15 },
        { area: 'Emergency egress', luxMin: 10, luxMax: 10, fcMin: 1, fcMax: 1 }
    ],
    // Conversion: 1 foot-candle = 10.764 lux
    fcToLux: 10.764
}

/**
 * NIOSH Lifting Equation multipliers
 */
export const liftingEquation: Record<string, any> = {
    // Load Constant (LC)
    loadConstant: { metric: 23, imperial: 51, unit: { metric: 'kg', imperial: 'lb' } },

    // Horizontal Multiplier (HM) = 25/H (metric) or 10/H (imperial)
    // H = horizontal distance from midpoint between ankles to hands
    horizontalMultiplier: {
        min: 25,  // cm - closer than this, HM = 1
        max: 63,  // cm - beyond this, HM = 0
        formula: 'HM = 25/H'
    },

    // Vertical Multiplier (VM) = 1 - (0.003 × |V - 75|) metric
    // V = vertical height of hands at start
    verticalMultiplier: {
        optimal: 75,  // cm (knuckle height)
        coefficient: 0.003
    },

    // Distance Multiplier (DM) = 0.82 + (4.5/D)
    // D = vertical travel distance
    distanceMultiplier: {
        min: 25,  // cm minimum
        formula: 'DM = 0.82 + (4.5/D)'
    },

    // Asymmetry Multiplier (AM) = 1 - (0.0032 × A)
    // A = angle of asymmetry in degrees
    asymmetryMultiplier: {
        coefficient: 0.0032,
        max: 135  // degrees - beyond this AM = 0
    },

    // Frequency Multiplier (FM) - lookup table
    frequencyMultiplier: [
        { freq: 0.2, duration1: 1.00, duration2: 0.95, duration8: 0.85 },
        { freq: 0.5, duration1: 0.97, duration2: 0.92, duration8: 0.81 },
        { freq: 1, duration1: 0.94, duration2: 0.88, duration8: 0.75 },
        { freq: 2, duration1: 0.91, duration2: 0.84, duration8: 0.65 },
        { freq: 3, duration1: 0.88, duration2: 0.79, duration8: 0.55 },
        { freq: 4, duration1: 0.84, duration2: 0.72, duration8: 0.45 },
        { freq: 5, duration1: 0.80, duration2: 0.60, duration8: 0.35 },
        { freq: 6, duration1: 0.75, duration2: 0.50, duration8: 0.27 },
        { freq: 7, duration1: 0.70, duration2: 0.42, duration8: 0.22 },
        { freq: 8, duration1: 0.60, duration2: 0.35, duration8: 0.18 },
        { freq: 9, duration1: 0.52, duration2: 0.30, duration8: 0.00 },
        { freq: 10, duration1: 0.45, duration2: 0.26, duration8: 0.00 },
        { freq: 11, duration1: 0.41, duration2: 0.00, duration8: 0.00 },
        { freq: 12, duration1: 0.37, duration2: 0.00, duration8: 0.00 },
        { freq: 13, duration1: 0.00, duration2: 0.00, duration8: 0.00 }
    ],

    // Coupling Multiplier (CM)
    couplingMultiplier: {
        good: { v_lt_75: 1.00, v_gte_75: 1.00, description: 'Optimal handles, cut-outs, or comfortable grip' },
        fair: { v_lt_75: 1.00, v_gte_75: 0.95, description: 'Sub-optimal handles or hand-hold cut-outs' },
        poor: { v_lt_75: 0.90, v_gte_75: 0.90, description: 'No handles, irregular shape, loose contents' }
    },

    // Lifting Index interpretations
    liftingIndex: {
        acceptable: { max: 1.0, color: '#22c55e', label: 'Acceptable' },
        increased: { max: 3.0, color: '#eab308', label: 'Increased Risk' },
        high: { max: Infinity, color: '#ef4444', label: 'High Risk' }
    }
}

/**
 * Arc Flash Boundaries (NFPA 70E simplified)
 */
export const arcFlash = {
    // Approach boundaries by voltage (simplified - actual requires incident energy calc)
    acBoundaries: [
        { voltage: '50-150V', limited: '1.07m (42")', restricted: '0.30m (12")', prohibited: 'Avoid contact' },
        { voltage: '151-750V', limited: '1.07m (42")', restricted: '0.30m (12")', prohibited: '25mm (1")' },
        { voltage: '751V-15kV', limited: '1.53m (5\')', restricted: '0.66m (26")', prohibited: '0.18m (7")' },
        { voltage: '15.1-36kV', limited: '1.83m (6\')', restricted: '0.79m (31")', prohibited: '0.25m (10")' },
        { voltage: '36.1-46kV', limited: '2.44m (8\')', restricted: '0.84m (33")', prohibited: '0.43m (17")' }
    ],
    ppeCategories: [
        { category: 1, calPerCm2: '4-8', arc: '4 cal/cm²', clothing: 'Arc-rated shirt/pants, safety glasses, hard hat' },
        { category: 2, calPerCm2: '8-25', arc: '8 cal/cm²', clothing: 'Arc-rated shirt/pants, face shield, hard hat, gloves' },
        { category: 3, calPerCm2: '25-40', arc: '25 cal/cm²', clothing: 'Arc flash suit hood, arc-rated gloves, leather footwear' },
        { category: 4, calPerCm2: '>40', arc: '40 cal/cm²', clothing: 'Multi-layer arc flash suit, arc-rated gloves' }
    ]
}

/**
 * E-Stop Requirements (ISO 13850 / IEC 60204-1 / NFPA 79)
 */
export const estopData = {
    // Stop categories per IEC 60204-1
    stopCategories: {
        0: {
            name: 'Category 0',
            description: 'Immediate removal of power to actuators (uncontrolled stop)',
            action: 'Power removed immediately',
            useCase: 'Simple machines, pneumatic systems, hazards requiring instant stop',
            examples: ['Pneumatic presses', 'Simple conveyors', 'Cutting hazards'],
            color: '#ef4444'
        },
        1: {
            name: 'Category 1',
            description: 'Controlled stop with power removal after stop achieved',
            action: 'Controlled deceleration, then power off',
            useCase: 'Servo-driven machines, heavy inertia loads, coordinated motion',
            examples: ['CNC machines', 'Robots', 'Large conveyors', 'Presses with flywheel'],
            color: '#f97316'
        },
        2: {
            name: 'Category 2',
            description: 'Controlled stop with power maintained',
            action: 'Controlled stop, power stays on',
            useCase: 'Rarely used for E-stop (monitoring required)',
            examples: ['Vertical axes requiring holding torque', 'Special applications only'],
            color: '#eab308'
        }
    },

    // E-Stop actuator requirements
    actuatorRequirements: {
        color: { actuator: 'Red', background: 'Yellow' },
        shape: 'Mushroom head (palm-operated)',
        minDiameter: 40,  // mm
        latching: 'Must latch in activated position',
        reset: 'Manual reset required, separate from actuator',
        marking: 'EMERGENCY STOP or EMERGENCY OFF'
    },

    // Placement guidelines
    placementGuidelines: [
        { location: 'Each operator station', requirement: 'Mandatory', note: 'Within arm\'s reach (<1m)' },
        { location: 'Machine entry/exit points', requirement: 'Mandatory', note: 'At each access door or gate' },
        { location: 'Along machine length', requirement: 'Every 10-15m', note: 'For machines >3m long' },
        { location: 'Remote/pendant stations', requirement: 'If applicable', note: 'On all portable control devices' },
        { location: 'Loading/unloading areas', requirement: 'Recommended', note: 'Accessible during material handling' },
        { location: 'Maintenance positions', requirement: 'Recommended', note: 'Where technicians work' }
    ],

    // E-Stop quantity calculator based on machine dimensions
    quantityGuidelines: {
        minPerMachine: 1,
        maxSpacing: 15000,  // mm (15m)
        recommendedSpacing: 10000,  // mm (10m)
        perOperatorStation: 1,
        perAccessPoint: 1
    },

    // Reset requirements
    resetRequirements: [
        'Reset must be manual (no automatic restart)',
        'Reset button must be separate from E-Stop actuator',
        'Reset must not directly restart machine',
        'Operator must verify hazard is cleared before reset',
        'Reset + separate Start required for machine restart'
    ],

    // Wiring requirements
    wiringRequirements: {
        circuit: 'Normally closed (NC) contacts',
        redundancy: 'Dual-channel for PLr c and above',
        monitoring: 'Cross-monitoring for PLr d and above',
        wireColor: 'No specific color required, but consistent marking',
        voltage: 'Typically 24VDC for safety circuits'
    }
}

/**
 * Machine Guarding Requirements (ISO 14120 / ISO 14119)
 */
export const guardingData = {
    // Guard types and when to use
    guardTypes: [
        {
            type: 'Fixed Guard',
            description: 'Permanently attached, requires tool to remove',
            useWhen: 'Access never needed during operation',
            accessFrequency: 'Maintenance only (monthly or less)',
            interlockRequired: false,
            examples: ['Perimeter fencing', 'Drive covers', 'Permanent barriers']
        },
        {
            type: 'Interlocked Guard',
            description: 'Movable guard with safety interlock',
            useWhen: 'Frequent access needed',
            accessFrequency: 'Daily or per-shift',
            interlockRequired: true,
            examples: ['Access doors', 'Hinged panels', 'Sliding guards']
        },
        {
            type: 'Interlocked Guard with Locking',
            description: 'Guard locked until machine safe',
            useWhen: 'Hazard persists after stop command',
            accessFrequency: 'When run-down time >10s or PLr d+',
            interlockRequired: true,
            examples: ['Spindle guards', 'Robot cells', 'Presses']
        },
        {
            type: 'Adjustable Guard',
            description: 'Manually adjusted for workpiece size',
            useWhen: 'Variable workpiece sizes',
            accessFrequency: 'Per job changeover',
            interlockRequired: false,
            examples: ['Table saw guards', 'Drill press guards']
        }
    ],

    // Interlock selection based on PLr
    interlockByPLr: {
        a: { type: 'Basic switch', locking: 'Not required', monitoring: 'Not required' },
        b: { type: 'Basic switch', locking: 'Not required', monitoring: 'Not required' },
        c: { type: 'Coded switch', locking: 'If run-down >10s', monitoring: 'Recommended' },
        d: { type: 'Coded/RFID switch', locking: 'Required', monitoring: 'Required' },
        e: { type: 'High-coded/RFID', locking: 'Required', monitoring: 'Required + diagnostics' }
    },

    // Guard material requirements
    guardMaterials: [
        { material: 'Solid steel/aluminum', minThickness: '1.5mm', impact: 'High', visibility: 'None' },
        { material: 'Polycarbonate', minThickness: '3mm', impact: 'Medium-High', visibility: 'Full' },
        { material: 'Welded wire mesh', opening: '≤20mm square', impact: 'Medium', visibility: 'Good' },
        { material: 'Expanded metal', opening: '≤20mm', impact: 'Medium', visibility: 'Fair' },
        { material: 'Perforated sheet', opening: '≤8mm round', impact: 'High', visibility: 'Limited' }
    ]
}

/**
 * Calculate safety distance (ISO 13855)
 * S = (K × T) + C
 */
export function calculateSafetyDistance(responseTimeMs: any, guardType: any, standard: string = 'iso') {
    const T = responseTimeMs / 1000  // Convert to seconds

    if (standard === 'osha') {
        // OSHA 1910.217: S = 63 in/s × T, no penetration factor
        const K = 63
        return { distance: K * T, unit: 'in', K, T, C: 0 }
    }

    // guardType must be a key of safetyDistanceConstants.penetrationFactors
    const C = safetyDistanceConstants.penetrationFactors[guardType]?.value ?? 0
    // Light curtains use hand/arm approach speed; mats/scanners and two-hand
    // controls use 1600 mm/s per ISO 13855
    const isHandApproach = String(guardType).startsWith('lightCurtain')
    let K = isHandApproach ? 2000 : 1600
    let S = K * T + C
    // ISO 13855: if S at 2000 mm/s exceeds 500 mm, recompute at 1600 mm/s with
    // 500 mm as the minimum; hand-approach results are never below 100 mm
    if (isHandApproach) {
        if (S > 500) {
            K = 1600
            S = Math.max(K * T + C, 500)
        }
        S = Math.max(S, 100)
    }
    return { distance: S, unit: 'mm', K, T, C }
}

/**
 * Calculate TWA from multiple noise exposures
 */
export function calculateNoiseTWA(exposures: any) {
    // exposures = [{ dB: number, hours: number }, ...]
    let dose = 0

    for (const exp of exposures) {
        // Find permissible time for this dB level
        // Using OSHA formula: T = 8 / 2^((L-90)/5)
        const permissibleHours = 8 / Math.pow(2, (exp.dB - 90) / 5)
        dose += (exp.hours / permissibleHours) * 100
    }

    // TWA = 16.61 × log10(D/100) + 90
    const twa = dose > 0 ? 16.61 * Math.log10(dose / 100) + 90 : 0

    return {
        dose: dose,
        twa: Math.round(twa * 10) / 10,
        exceedsActionLevel: twa >= 85,
        exceedsPEL: twa >= 90
    }
}

/**
 * Clearance Requirements (NEC 110.26 / OSHA / Industry Standards)
 */
export const clearanceData = {
    // Electrical Panel Working Space (NEC 110.26)
    electricalPanels: {
        // Width: at least 30" or width of equipment, whichever is greater
        // Height: from floor to 6.5' above or to equipment height
        conditions: {
            1: {
                description: 'Exposed live parts on one side, no live or grounded parts on other',
                voltages: [
                    { range: '0-150V', depth: { in: 36, mm: 914 } },
                    { range: '151-600V', depth: { in: 36, mm: 914 } },
                    { range: '601V-2500V', depth: { in: 36, mm: 914 } }
                ]
            },
            2: {
                description: 'Exposed live parts on one side, grounded parts on other (concrete, brick, tile)',
                voltages: [
                    { range: '0-150V', depth: { in: 36, mm: 914 } },
                    { range: '151-600V', depth: { in: 42, mm: 1067 } },
                    { range: '601V-2500V', depth: { in: 48, mm: 1219 } }
                ]
            },
            3: {
                description: 'Exposed live parts on both sides (walk-in panels)',
                voltages: [
                    { range: '0-150V', depth: { in: 36, mm: 914 } },
                    { range: '151-600V', depth: { in: 48, mm: 1219 } },
                    { range: '601V-2500V', depth: { in: 60, mm: 1524 } }
                ]
            }
        },
        minWidth: { in: 30, mm: 762 },
        minHeight: { in: 78, mm: 1981 },  // 6'6"
        notes: [
            'Minimum 30" wide or width of equipment',
            'No storage permitted in working space',
            'Dedicated space extends floor to ceiling',
            'Adequate illumination required'
        ]
    },

    // Aisle widths by traffic type
    aisles: [
        { type: 'Pedestrian only', minWidth: { in: 28, mm: 711 }, recommended: { in: 36, mm: 914 }, note: 'OSHA 1910.37' },
        { type: 'One-way forklift', minWidth: { in: 96, mm: 2438 }, recommended: { in: 120, mm: 3048 }, note: 'Width + 6" clearance each side' },
        { type: 'Two-way forklift', minWidth: { in: 144, mm: 3658 }, recommended: { in: 156, mm: 3962 }, note: 'Combined width + clearances' },
        { type: 'Pallet jack', minWidth: { in: 60, mm: 1524 }, recommended: { in: 72, mm: 1829 }, note: 'Pallet width + maneuvering' },
        { type: 'Emergency egress', minWidth: { in: 28, mm: 711 }, recommended: { in: 44, mm: 1118 }, note: 'Per occupant load' }
    ],

    // Machine/equipment clearances
    machineEquipment: [
        { area: 'General maintenance access', clearance: { in: 24, mm: 610 }, note: 'Minimum for service' },
        { area: 'Full-body access', clearance: { in: 36, mm: 914 }, note: 'Kneeling/crouching work' },
        { area: 'Between machines', clearance: { in: 36, mm: 914 }, note: 'Operating clearance' },
        { area: 'Behind machines', clearance: { in: 24, mm: 610 }, note: 'Utility access' },
        { area: 'Robot cell perimeter', clearance: { in: 36, mm: 914 }, note: 'Inside safeguarding' },
        { area: 'Conveyor walk-path', clearance: { in: 24, mm: 610 }, note: 'Emergency egress along conveyor' }
    ],

    // Cabinet/enclosure mounting
    cabinetMounting: [
        { type: 'Floor-mounted panel', front: { in: 36, mm: 914 }, rear: { in: 0, mm: 0 }, note: 'NEC 110.26 applies' },
        { type: 'Wall-mounted panel', front: { in: 36, mm: 914 }, rear: { in: 0, mm: 0 }, note: 'Ensure structural support' },
        { type: 'Machine-mounted HMI', front: { in: 24, mm: 610 }, rear: { in: 6, mm: 152 }, note: 'Operator access' },
        { type: 'Junction box', front: { in: 3, mm: 76 }, rear: { in: 0, mm: 0 }, note: 'Wiring space inside' },
        { type: 'Disconnect/breaker', front: { in: 36, mm: 914 }, rear: { in: 0, mm: 0 }, note: 'NEC 110.26 applies' }
    ],

    // Door swing clearances
    doorSwing: {
        standard: { in: 36, mm: 914, note: 'Door swing + 90° opening' },
        emergency: { in: 32, mm: 813, note: 'Minimum clear width' },
        handicapAccess: { in: 36, mm: 914, note: 'ADA requirement' }
    }
}

/**
 * Calculate NIOSH Recommended Weight Limit
 */
export function calculateRWL(params: any) {
    const { H, V, D, A, F, duration, coupling } = params
    const LC = 23  // kg

    // Calculate multipliers
    const HM = Math.min(1, 25 / Math.max(25, H))
    const VM = 1 - (0.003 * Math.abs(V - 75))
    const DM = Math.min(1, 0.82 + (4.5 / Math.max(25, D)))
    const AM = 1 - (0.0032 * Math.min(135, A))

    // Lookup FM from table (simplified - use closest match)
    const fmRow = liftingEquation.frequencyMultiplier.find((r: any) => r.freq >= F) ||
                  liftingEquation.frequencyMultiplier[liftingEquation.frequencyMultiplier.length - 1]
    const FM = duration <= 1 ? fmRow.duration1 : (duration <= 2 ? fmRow.duration2 : fmRow.duration8)

    // Get CM
    const cmData = liftingEquation.couplingMultiplier[coupling] || liftingEquation.couplingMultiplier.fair
    const CM = V < 75 ? cmData.v_lt_75 : cmData.v_gte_75

    const RWL = LC * HM * VM * DM * AM * FM * CM

    return {
        RWL: Math.round(RWL * 10) / 10,
        multipliers: { HM, VM, DM, AM, FM, CM },
        LC
    }
}
