/**
 * Conveyor Bed Wearstrip Span Calculator — pure calculation module
 * @module lib/calculators/wearstrip
 *
 * Beam solver for slider-bed wearstrips (rectangular plastic rails under a
 * modular belt, on steel cross-supports). Key physics, per design review:
 *
 * - Point load governs, not product: distributed belt+product deflection is
 *   negligible; the sizing case is an operator pressing on the belt.
 * - Continuous-over-supports boundary condition (realistic):
 *     δ_point = P·L³/(110·E·I)      δ_UDL = w·L⁴/(185·E·I)
 * - The end overhang is DERIVED, not entered: for each configuration we solve
 *   the max cantilever length whose tip deflection (with elastic-backspan
 *   rotation) equals the stiffness class limit:
 *     P·Lc³/(3EI) + P·Lc²·L_back/(3EI) = δ_target
 *   then cap it by bending stress at the last support (M = P·Lc).
 * - UHMW loses stiffness hot (washdown) and creeps under sustained load —
 *   temp knockdown on E, creep stress check on sustained UDL.
 */

export interface StripMaterial {
    id: string
    name: string
    eFlexPsi: number
    /** Short-term bending allowable (body loads, impacts) — typical, verify */
    shortTermAllowPsi: number
    creepAllowPsi: number
    maxTempF: number
    muDynamic: number
    costPerIn3: number
    note?: string
}

/** Typical handbook values — verify with the supplier datasheet before locking */
export const stripMaterials: StripMaterial[] = [
    { id: 'uhmw_virgin', name: 'Virgin UHMW', eFlexPsi: 110000, shortTermAllowPsi: 2000, creepAllowPsi: 1450, maxTempF: 176, muDynamic: 0.18, costPerIn3: 0.06, note: 'Baseline' },
    { id: 'uhmw_ultralube', name: 'UHMW UltraLube #321', eFlexPsi: 110000, shortTermAllowPsi: 2000, creepAllowPsi: 1450, maxTempF: 176, muDynamic: 0.10, costPerIn3: 0.08, note: 'Same stiffness, ~45% lower friction — feeds belt pull' },
    { id: 'hdpe', name: 'HDPE (food grade)', eFlexPsi: 130000, shortTermAllowPsi: 1200, creepAllowPsi: 900, maxTempF: 160, muDynamic: 0.25, costPerIn3: 0.04, note: 'Cheap, worse wear' },
    { id: 'acetal', name: 'Acetal / POM', eFlexPsi: 400000, shortTermAllowPsi: 3500, creepAllowPsi: 2000, maxTempF: 180, muDynamic: 0.20, costPerIn3: 0.15, note: 'NEVER under acetal belts — like-on-like galling' },
    { id: 'pet_p', name: 'PET-P (Ertalyte TX)', eFlexPsi: 450000, shortTermAllowPsi: 4000, creepAllowPsi: 2500, maxTempF: 210, muDynamic: 0.12, costPerIn3: 0.20, note: 'Stiff + slick, premium' },
]

/** Modulus knockdown vs temperature (washdown reality) */
export const tempFactors = [
    { tempF: 73, factor: 1.0, label: '73°F ambient' },
    { tempF: 100, factor: 0.85, label: '100°F' },
    { tempF: 120, factor: 0.70, label: '120°F' },
    { tempF: 140, factor: 0.55, label: '140°F washdown' },
]

export const stiffnessClasses = [
    { id: 'rigid', label: 'Rigid', limitIn: 0.010 },
    { id: 'standard', label: 'Standard', limitIn: 0.020 },
    { id: 'economy', label: 'Economy', limitIn: 0.040 },
]

export interface WearstripConfig {
    beltWidthIn: number
    conveyorLengthFt: number
    beltWeightLbFt2: number
    /** Running product load, lb per ft of conveyor */
    productLoadLbFt: number
    /** Worst-case standing/accumulated product, lb/ft (sustained — creep case) */
    standingLoadLbFt: number
    tempF: number
    materialId: string
    /** Interior strip profile — drives ALL structural checks (weakest strip) */
    stripWidthIn: number
    stripHeightIn: number
    /** Edge strip profile — extra wear material on the sides; affects cost only */
    edgeStripWidthIn: number
    edgeStripHeightIn: number
    spanIn: number
    stripCount: number
    /** Max unsupported belt width between strips (vendor limit) */
    maxBeltSpanIn: number
    // Criteria — two-tier: a light "feel" load checked on deflection, and a
    // heavy "body" load (person sitting/leaning) checked on STRENGTH. UHMW is
    // never damaged by a person; it just springs — so the body case is stress.
    pointLoadLbf: number
    stripsUnderPress: number
    /** Person-on-bed load, lbf (strength check, short-term allowable) */
    bodyLoadLbf: number
    bodyLoadStrips: number
    deflectionLimitIn: number
    /** UDL limit divisor: span / N (default 360) */
    udlDivisor: number
    creepSF: number
    /** Strips sharing the cantilever tip load (default 1 — nose presses are local) */
    cantileverStrips: number
    /** Optional nose-geometry requirement; null = just report the allowance */
    requiredOverhangIn: number | null
    costPerSupport: number
}

export const defaultWearstripConfig: WearstripConfig = {
    beltWidthIn: 12,
    conveyorLengthFt: 10,
    beltWeightLbFt2: 1.64,
    productLoadLbFt: 1.0,
    standingLoadLbFt: 2.0,
    tempF: 73,
    materialId: 'uhmw_virgin',
    stripWidthIn: 1.5,
    stripHeightIn: 2,
    edgeStripWidthIn: 1.5,
    edgeStripHeightIn: 2,
    spanIn: 18,
    stripCount: 3,
    maxBeltSpanIn: 6,
    pointLoadLbf: 25,
    stripsUnderPress: 2,
    bodyLoadLbf: 250,
    bodyLoadStrips: 2,
    deflectionLimitIn: 0.020,
    udlDivisor: 360,
    creepSF: 2.0,
    // Strips run 5-7" apart, so a nose press bridges two — shop default
    cantileverStrips: 2,
    requiredOverhangIn: null,
    costPerSupport: 18,
}

export interface CriterionCheck {
    value: number
    limit: number
    utilizationPct: number
    pass: boolean
}

export interface WearstripResult {
    material: StripMaterial
    momentOfInertiaIn4: number
    sectionModulusIn3: number
    eEffectivePsi: number
    udlPerStripLbIn: number
    sustainedUdlLbIn: number
    pointPerStripLbf: number
    /** Interior mid-span point-load deflection (the "feel" number) */
    pointDeflIn: number
    pointCheck: CriterionCheck
    udlDeflIn: number
    udlCheck: CriterionCheck
    /** Creep stress under sustained UDL at the support (continuous: wL²/12) */
    creepStressPsi: number
    creepCheck: CriterionCheck
    /** Person-on-bed: bending stress under the body load (short-term strength) */
    bodyStressPsi: number
    bodyCheck: CriterionCheck
    /** Body-load deflection — informational (springy but harmless) */
    bodyDeflIn: number
    /** Inverse readout: total press load that reaches the deflection limit */
    allowablePointLbf: number
    tempPass: boolean
    /** Derived max end overhang preserving the stiffness-class feel */
    maxOverhangIn: number
    overhangGovernedBy: 'deflection' | 'stress'
    overhangCheck: CriterionCheck | null
    suggestedStripCount: number
    governing: string
    passAll: boolean
    // Cost
    plasticVolumeIn3: number
    plasticCost: number
    supportCount: number
    supportCost: number
    totalCost: number
    /** vs the 1.5×2 @ 18" baseline, same strip count */
    plasticSavedPct: number
    supportsSavedPer10Ft: number
    /** 73→140°F growth over the conveyor length (α = 1.1e-4/°F) */
    thermalGrowthIn: number
    warnings: string[]
}

export function getStripMaterial(id: string): StripMaterial {
    return stripMaterials.find((m) => m.id === id) ?? stripMaterials[0]
}

export function tempFactor(tempF: number): number {
    // Interpolate between the defined knockdown points
    const pts = tempFactors
    if (tempF <= pts[0].tempF) return pts[0].factor
    for (let i = 1; i < pts.length; i++) {
        if (tempF <= pts[i].tempF) {
            const a = pts[i - 1], b = pts[i]
            return a.factor + (b.factor - a.factor) * (tempF - a.tempF) / (b.tempF - a.tempF)
        }
    }
    return pts[pts.length - 1].factor
}

function check(value: number, limit: number): CriterionCheck {
    const utilizationPct = limit > 0 ? (value / limit) * 100 : Infinity
    return { value, limit, utilizationPct, pass: value <= limit }
}

/**
 * Max cantilever length whose tip deflection (incl. backspan rotation) hits
 * deflLimit:  P·Lc³/(3EI) + P·Lc²·Lback/(3EI) = δ  =>  Lc³ + Lback·Lc² − 3EIδ/P = 0
 * Newton's method, seeded at 0.25 × backspan. Single positive real root.
 */
export function solveCantileverAllowance(pLbf: number, eI: number, backspanIn: number, deflLimitIn: number): number {
    if (pLbf <= 0 || eI <= 0) return 0
    const k = (3 * eI * deflLimitIn) / pLbf
    let lc = Math.max(0.25 * backspanIn, 0.1)
    for (let i = 0; i < 60; i++) {
        const f = lc ** 3 + backspanIn * lc ** 2 - k
        const df = 3 * lc ** 2 + 2 * backspanIn * lc
        const next = lc - f / df
        if (!isFinite(next) || next <= 0) break
        if (Math.abs(next - lc) < 1e-9) { lc = next; break }
        lc = next
    }
    return Math.max(lc, 0)
}

export function calculateWearstrip(cfg: WearstripConfig): WearstripResult {
    const mat = getStripMaterial(cfg.materialId)
    const warnings: string[] = []

    const b = cfg.stripWidthIn
    const h = cfg.stripHeightIn
    const I = (b * h ** 3) / 12
    const S = (b * h ** 2) / 6
    const eEff = mat.eFlexPsi * tempFactor(cfg.tempF)
    const eI = eEff * I
    const L = cfg.spanIn

    // Loads per strip, per inch of strip
    const beltLbFt = cfg.beltWeightLbFt2 * (cfg.beltWidthIn / 12)
    const runningLbFt = (beltLbFt + (cfg.productLoadLbFt || 0)) / Math.max(cfg.stripCount, 1)
    const sustainedLbFt = (beltLbFt + Math.max(cfg.standingLoadLbFt || 0, cfg.productLoadLbFt || 0)) / Math.max(cfg.stripCount, 1)
    const w = runningLbFt / 12          // lb/in running
    const wSust = sustainedLbFt / 12    // lb/in sustained (creep case)
    const pPerStrip = cfg.pointLoadLbf / Math.max(cfg.stripsUnderPress, 1)

    // Continuous-over-supports interior span
    const pointDeflIn = (pPerStrip * L ** 3) / (110 * eI)
    const udlDeflIn = (w * L ** 4) / (185 * eI)
    const pointCheck = check(pointDeflIn, cfg.deflectionLimitIn)
    const udlCheck = check(udlDeflIn, L / cfg.udlDivisor)

    // Creep: sustained UDL support moment, continuous ≈ wL²/12
    const creepStressPsi = (wSust * L ** 2) / 12 / S
    const creepAllow = mat.creepAllowPsi / cfg.creepSF
    const creepCheck = check(creepStressPsi, creepAllow)

    // Body load: strength governs (deflection is informational — it recovers)
    const pBody = cfg.bodyLoadLbf / Math.max(cfg.bodyLoadStrips, 1)
    const bodyStressPsi = (pBody * L) / 8 / S   // continuous point support moment PL/8
    const bodyCheck = check(bodyStressPsi, mat.shortTermAllowPsi)
    const bodyDeflIn = (pBody * L ** 3) / (110 * eI)

    // Inverse: what TOTAL press load reaches the deflection limit on this span?
    const allowablePointLbf = (cfg.deflectionLimitIn * 110 * eI / L ** 3) * Math.max(cfg.stripsUnderPress, 1)

    const tempPass = cfg.tempF <= mat.maxTempF
    if (!tempPass) warnings.push(`${cfg.tempF}°F exceeds ${mat.name}'s ${mat.maxTempF}°F continuous rating.`)

    // Derived end overhang: full point load on cantileverStrips strips
    const pCant = cfg.pointLoadLbf / Math.max(cfg.cantileverStrips, 1)
    const lcDefl = solveCantileverAllowance(pCant, eI, L, cfg.deflectionLimitIn)
    // Stress cap at the last support: M = P·Lc ≤ creepAllow/SF × S
    const lcStress = pCant > 0 ? (creepAllow * S) / pCant : Infinity
    const maxOverhangIn = Math.min(lcDefl, lcStress)
    const overhangGovernedBy: 'deflection' | 'stress' = lcDefl <= lcStress ? 'deflection' : 'stress'
    const overhangCheck = cfg.requiredOverhangIn !== null && cfg.requiredOverhangIn > 0
        ? check(cfg.requiredOverhangIn, maxOverhangIn) // "value" is the demand, limit is the allowance
        : null

    const suggestedStripCount = Math.ceil(cfg.beltWidthIn / Math.max(cfg.maxBeltSpanIn, 1)) + 1
    if (cfg.stripCount < suggestedStripCount) {
        warnings.push(
            `${cfg.stripCount} strips leaves >${cfg.maxBeltSpanIn}" of unsupported belt — lateral rule suggests ${suggestedStripCount}.`
        )
    }
    if (mat.id === 'acetal') {
        warnings.push('Acetal wearstrips must not run under acetal (POM) belts — like-on-like polymer galling. Confirm the belt material first.')
    }

    // Cost: two edge strips at the edge profile, the rest interior
    const lengthIn = cfg.conveyorLengthFt * 12
    const edgeCount = Math.min(2, cfg.stripCount)
    const interiorCount = Math.max(cfg.stripCount - 2, 0)
    const eb = cfg.edgeStripWidthIn || b
    const eh = cfg.edgeStripHeightIn || h
    const plasticVolumeIn3 = (b * h * interiorCount + eb * eh * edgeCount) * lengthIn
    const plasticCost = plasticVolumeIn3 * mat.costPerIn3
    const supportCount = Math.max(Math.ceil(lengthIn / L) + 1, 2)
    const supportCost = supportCount * cfg.costPerSupport
    const totalCost = plasticCost + supportCost

    // Baseline comparison: 1.5×2 @ 18", same strip count and material
    const baseVolume = 1.5 * 2 * lengthIn * cfg.stripCount
    const plasticSavedPct = baseVolume > 0 ? (1 - plasticVolumeIn3 / baseVolume) * 100 : 0
    const supportsSavedPer10Ft = 120 / 18 - 120 / L

    const thermalGrowthIn = 1.1e-4 * (140 - 73) * lengthIn

    // Governing criterion = highest utilization (temp is binary, listed if failed)
    const candidates: [string, number][] = [
        ['interior point-load deflection (feel)', pointCheck.utilizationPct],
        ['distributed-load deflection', udlCheck.utilizationPct],
        ['creep stress at supports', creepCheck.utilizationPct],
        ['body-load strength', bodyCheck.utilizationPct],
    ]
    if (overhangCheck) candidates.push(['end overhang (nose geometry)', overhangCheck.utilizationPct])
    if (!tempPass) candidates.push(['temperature rating', 999])
    candidates.sort((x, y) => y[1] - x[1])
    const governing = candidates[0][0]

    const passAll = pointCheck.pass && udlCheck.pass && creepCheck.pass && bodyCheck.pass && tempPass
        && (overhangCheck === null || overhangCheck.pass)

    return {
        material: mat,
        momentOfInertiaIn4: I,
        sectionModulusIn3: S,
        eEffectivePsi: eEff,
        udlPerStripLbIn: w,
        sustainedUdlLbIn: wSust,
        pointPerStripLbf: pPerStrip,
        pointDeflIn, pointCheck,
        udlDeflIn, udlCheck,
        creepStressPsi, creepCheck,
        bodyStressPsi, bodyCheck, bodyDeflIn,
        allowablePointLbf,
        tempPass,
        maxOverhangIn, overhangGovernedBy, overhangCheck,
        suggestedStripCount,
        governing,
        passAll,
        plasticVolumeIn3, plasticCost, supportCount, supportCost, totalCost,
        plasticSavedPct, supportsSavedPer10Ft,
        thermalGrowthIn,
        warnings,
    }
}

/** Discrete design space for the optimizer */
export const optimizerSpace = {
    heights: [0.75, 1, 1.25, 1.5, 2],
    widths: [0.75, 1, 1.5],
    spans: [12, 16, 18, 20, 22, 24, 30, 36],
}

export interface OptimizedConfig {
    stripWidthIn: number
    stripHeightIn: number
    spanIn: number
    stripCount: number
    result: WearstripResult
}

/**
 * Enumerate the discrete space, keep configurations passing every check
 * (including required overhang when set), rank by total cost.
 */
export function optimizeWearstrip(cfg: WearstripConfig, topN = 10): OptimizedConfig[] {
    const stripCount = Math.ceil(cfg.beltWidthIn / Math.max(cfg.maxBeltSpanIn, 1)) + 1
    const out: OptimizedConfig[] = []
    for (const h of optimizerSpace.heights) {
        for (const b of optimizerSpace.widths) {
            for (const span of optimizerSpace.spans) {
                const candidate: WearstripConfig = { ...cfg, stripWidthIn: b, stripHeightIn: h, spanIn: span, stripCount }
                const result = calculateWearstrip(candidate)
                if (result.passAll) out.push({ stripWidthIn: b, stripHeightIn: h, spanIn: span, stripCount, result })
            }
        }
    }
    out.sort((x, y) => x.result.totalCost - y.result.totalCost)
    return out.slice(0, topN)
}

/**
 * Named shop standards — the preferred answer when one passes.
 * AQS-Standard (2026): 1×2 interior strips, 1.5×2 edge strips (extra side
 * material), spans uniform in 16–18" with ≤3" end overhangs (see
 * solveSupportLayout). AQS-Heavy is the legacy all-1.5×2 fallback.
 */
export const wearstripStandards = [
    {
        id: 'aqs-standard', name: 'AQS-Standard',
        stripWidthIn: 1, stripHeightIn: 2,
        edgeStripWidthIn: 1.5, edgeStripHeightIn: 2,
        spanMinIn: 16, spanMaxIn: 18,
    },
    {
        id: 'aqs-heavy', name: 'AQS-Heavy',
        stripWidthIn: 1.5, stripHeightIn: 2,
        edgeStripWidthIn: 1.5, edgeStripHeightIn: 2,
        spanMinIn: 18, spanMaxIn: 18,
    },
]

export interface SupportLayout {
    /** Number of interior spans (supports = segments + 1) */
    segments: number
    spanIn: number
    overhangIn: number
    supports: number
}

/**
 * Uniform support layout per the shop rule: spans uniform within
 * [spanMin, spanMax], end overhangs equal and ≤ maxOverhang, fewest
 * supports first. Targets the full overhang allowance (nose hardware
 * needs the room), backing off only if the span range forces it.
 */
export function solveSupportLayout(
    lengthIn: number, spanMinIn = 16, spanMaxIn = 18, maxOverhangIn = 3
): SupportLayout | null {
    if (lengthIn <= 2 * maxOverhangIn) return null
    const nStart = Math.max(1, Math.ceil((lengthIn - 2 * maxOverhangIn) / spanMaxIn))
    for (let n = nStart; n <= 400; n++) {
        const spanHi = Math.min(spanMaxIn, lengthIn / n)
        const spanLo = Math.max(spanMinIn, (lengthIn - 2 * maxOverhangIn) / n)
        if (spanLo <= spanHi) {
            const spanIn = spanLo // prefer max overhang (room for the nose), shortest feasible span
            const overhangIn = (lengthIn - n * spanIn) / 2
            return { segments: n, spanIn, overhangIn, supports: n + 1 }
        }
        if (lengthIn / n < spanMinIn) break
    }
    return null
}

/** Example configurations — also the unit-test fixtures */
export const wearstripExamples: { id: string; label: string; config: WearstripConfig }[] = [
    { id: 'belt12', label: '12" belt, 3 strips', config: { ...defaultWearstripConfig } },
    { id: 'belt24', label: '24" belt, 5 strips', config: { ...defaultWearstripConfig, beltWidthIn: 24, stripCount: 5, conveyorLengthFt: 20 } },
    { id: 'belt45', label: '45" belt, 7 strips', config: { ...defaultWearstripConfig, beltWidthIn: 45, stripCount: 8, conveyorLengthFt: 30, productLoadLbFt: 4, standingLoadLbFt: 8 } },
]
