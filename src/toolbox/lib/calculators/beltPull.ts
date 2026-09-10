/**
 * Radius/S-Conveyor Belt Pull Calculator — pure calculation module (Rev B)
 * @module lib/calculators/beltPull
 *
 * Sequential march for modular plastic belt conveyors, reconciled against the
 * OneMotion "AQS A1 Belt Pull — Engineering Sign-Off (Rev 2)" (2026-07-11).
 * Reproduces that document's Table 2 walk to 4 decimal places (unit-tested).
 *
 * Rev B model (per sign-off §2, decision D1):
 * - Three-band output per configuration:
 *     Low     = manufacturer hand method (curve pull = straight pull; no capstan)
 *     Central = exact curve ODE, dT/dθ = μ_g·T + μ_bed·w·r_c
 *               → T_out = T_in·e^(μ_g θ) + (μ_bed·w·r_c/μ_g)(e^(μ_g θ) − 1)
 *     High    = legacy width-ratio amplifier e^(μ θ · W_o/W_c) + flat arc —
 *               sensitivity ceiling only, no manufacturer basis
 *   Motors are sized on Central × scenario × SF.
 * - Back tension defaults to 0 (catenary take-up modular belts run near-zero
 *   slack tension).
 * - Return path is segmented: slider portions at μ_return, bearinged-roller
 *   portions at μ_roller (0.04 assumed, flagged). Loop invariant: total return
 *   = total carry.
 * - Ordering toggle: 'worst-case' (all straight/return friction before the
 *   turns — quoting default, ref §2.3) vs 'actual' (march the real sequence;
 *   return runs first — it's the slack side leaving the drive).
 */

export interface TurnSection {
    /** Discriminator; absent (legacy configs) means 'turn' */
    kind?: 'turn'
    angleDeg: number
    insideRadiusIn: number
    /** Cosmetic only — does not affect the math */
    direction: 'L' | 'R'
    straightAfterIn: number
}

/** Loose product (bulk) or discrete packages. Decides which load entries apply and which screens run. */
export type ProductType = 'packages' | 'bulk'

/**
 * Flighted pockets on an incline: bulk product stops being a bed and travels as
 * discrete buckets behind each flight. Capacity is geometric (wedge behind the
 * flight at the product's angle of repose) unless a measured weight is given.
 */
export interface PocketSpec {
    /** Flight height above the belt surface, in */
    flightHeightIn: number
    /** Flight pitch along the belt, in */
    pitchIn: number
    /** Measured weight per pocket, lb — overrides the geometric estimate when > 0 */
    lbPerPocketOverride?: number | null
}

/** Inclined run: length measured ALONG the belt, rise positive up / negative down */
export interface InclineSection {
    kind: 'incline'
    lengthIn: number
    riseIn: number
    /** Flighted pockets (bulk on an incline). Absent = plain belt carrying the uniform load. */
    pocket?: PocketSpec | null
    /** Explicit product load on this section, lb per ft — overrides the uniform spread and the pocket estimate */
    productLbfPerFt?: number | null
    /** Engineer override: accept a plain belt past the slip limit (logged as an assumption, not a warning) */
    allowPlainIncline?: boolean
}

/** Plain horizontal run (e.g. the discharge leg of a Z conveyor) */
export interface StraightSection {
    kind: 'straight'
    lengthIn: number
}

export type PathSection = TurnSection | InclineSection | StraightSection

export function isIncline(s: PathSection): s is InclineSection {
    return (s as InclineSection).kind === 'incline'
}

export function isStraight(s: PathSection): s is StraightSection {
    return (s as StraightSection).kind === 'straight'
}

export function isTurn(s: PathSection): s is TurnSection {
    return !isIncline(s) && !isStraight(s)
}

export interface FrictionSet {
    carryway: number
    rail: number
    return: number
}

export interface SurfaceMaterials {
    carrywayBase: number
    railBase: number
    returnBase: number
}

export type WearId = 'clean' | 'vendor' | 'worn' | 'degraded' | 'custom'

export const wearFactors = [
    { id: 'clean' as const, label: 'Clean/New', carry: 1, rail: 1 },
    { id: 'vendor' as const, label: 'Vendor-Rec', carry: 0.212 / 0.18, rail: 0.20 / 0.18 },
    { id: 'worn' as const, label: 'Worn', carry: 0.25 / 0.18, rail: 0.25 / 0.18 },
    { id: 'degraded' as const, label: 'Degraded', carry: 0.30 / 0.18, rail: 0.30 / 0.18 },
]

export function scenarioFrictions(m: SurfaceMaterials, f: typeof wearFactors[number]): FrictionSet {
    return {
        carryway: m.carrywayBase * f.carry,
        rail: m.railBase * f.rail,
        return: m.returnBase * f.carry,
    }
}

export const wearstripMaterials = [
    { id: 'uhmw', label: 'Standard UHMW', mu: 0.18 },
    { id: 'ultralube', label: 'Lubricated UHMW (Duro-Glide 321 class)', mu: 0.11 },
    { id: 'hdpe', label: 'HDPE / PE 500', mu: 0.22 },
]

export type LoadMode = 'rate' | 'direct' | 'accumulated' | 'bulk'
export type Ordering = 'worst-case' | 'actual'
export type BeltBuild = 'pom' | 'pp'

export interface ReturnSegment {
    /** Length in inches; null = loop remainder (return total = carry total) */
    lengthIn: number | null
    support: 'slider' | 'roller'
}

export interface TurnDragModel {
    mode: 'fixed' | 'ratio-scaled'
    refRatio: number
    exponent: number
}

export interface ServiceFactorInput {
    /** Nose bar per end: bearinged/rolling noses carry NO adder; static = +0.4 */
    noseInfeed: 'none' | 'bearinged' | 'static'
    noseDischarge: 'none' | 'bearinged' | 'static'
    /** +0.2 */
    startStop: boolean
    /** +0.2 */
    biDirectional: boolean
}

export interface BeltPullConfig {
    infeedStraightIn: number
    sections: PathSection[]
    infeedHeightIn: number
    outfeedHeightIn: number
    beltWidthIn: number
    /** POM-basis belt weight lb/ft²; PP build applies ×0.75 in the calc */
    beltWeightLbFt2: number
    beltBuild: BeltBuild
    /** Straight-run max pull rating, kgf per metre of width (POM basis; PP ×0.65) */
    straightRatingKgfM: number
    /** Belt curve capacity as a fraction of straight rating (0.20–0.26 industry; unverified) */
    curveDerate: number
    /** Belt's minimum inside-radius ratio ("collapse factor"): r_min = factor × width */
    collapseFactor: number
    /** Vendor minimum straight run before and after turns and inclines, in (0 = not specified; filled from the belt catalog when it carries it) */
    minStraightIn?: number
    /** Catalog belt (belt:build key from the spec feed) that filled the belt fields; informational only */
    catalogBeltKey?: string | null
    /** Packages (default) or loose bulk. Bulk enables the repose / slip / pocket / bed-capacity screens. */
    productType?: ProductType
    loadMode: LoadMode
    throughputLbHr: number
    directLoadLbf: number
    productLengthIn: number
    productWeightLb: number
    /** Loose (as-conveyed) density, lb/ft³ — bed mode and pocket capacity */
    bulkDensityLbFt3: number
    bedDepthIn: number
    edgeMarginIn: number
    /** Bulk product angle of repose (surcharge), degrees — shapes the pocket wedge behind each flight */
    reposeDeg?: number
    /** Pocket fill fraction 0–1 (spillage, uneven feed); default 0.85 */
    pocketFillFraction?: number
    /**
     * Steepest incline a plain (unflighted) belt carries this product without slip, degrees.
     * Product-on-belt friction, not repose. Defaults: bulk 20°, packages 25°.
     */
    maxPlainInclineDeg?: number
    beltSpeedFpm: number
    frictions: FrictionSet
    materials: SurfaceMaterials
    wearId: WearId
    /** Default 0: catenary take-up modular belts run near-zero slack tension */
    backTensionLbfPerFtWidth: number
    /** Return path segments; a null length = loop remainder */
    returnSegments: ReturnSegment[]
    /** Bearinged-roller return friction (assumption, 0.03–0.05) */
    muRoller: number
    ordering: Ordering
    /** Turn-rail material: DG-321 (oil-embedded UHMW) required per the corner speed model */
    turnRailMaterial: 'standard' | 'dg321'
    /** Belt-edge/rail contact band width, inches (corner pressure denominator) */
    contactBandIn: number
    staticRatio: number
    /** Peak/breakaway torque floor factor (ref §3.1) */
    breakawayFactor: number
    rampTimeS: number
    turnDragModel: TurnDragModel
    serviceFactors: ServiceFactorInput
}

export interface TurnBreakdownRow {
    turn: number
    angleDeg: number
    insideRadiusIn: number
    turnRatio: number
    muEff: number
    tensionIn: number
    tensionOut: number
    multiplier: number
    /** High-band tension exiting this turn (drives the curve-capacity check) */
    tensionOutHigh: number
}

/** Product load on one carry piece, in path order (index −1 = the infeed straight) */
export interface SectionLoadRow {
    index: number
    kind: 'straight' | 'incline' | 'turn'
    lengthIn: number
    lbfPerFt: number
    lbf: number
    /** uniform = spread from the load mode; pocket = flight-pocket capacity; override = entered lb/ft */
    source: 'uniform' | 'pocket' | 'override'
}

/** Flighted-pocket capacity on one incline section */
export interface PocketSummary {
    /** Section index in cfg.sections */
    index: number
    slopeDeg: number
    /** Wedge cross-section behind one flight, in² (before fill fraction) */
    areaIn2: number
    /** Material runs the whole pitch (trapezoid / full bed) rather than a partial wedge */
    fillsPitch: boolean
    lbPerPocket: number
    /** Whether lbPerPocket came from the measured override */
    measured: boolean
    pocketsOnSection: number
    lbfPerFt: number
    /** Rate these pockets deliver at belt speed, lb/hr */
    achievedLbHr: number
}

export interface BeltPullResult {
    productType: ProductType
    /** Product load per carry piece — shows where a pocket or override departs from the uniform spread */
    sectionLoads: SectionLoadRow[]
    pockets: PocketSummary[]
    /** Incline section indexes where loose product on a plain belt is steeper than repose (flights required) */
    slipSections: number[]
    /** Bulk only: the rate the limiting bed or pocket section can deliver at belt speed, lb/hr (null = no capacity inputs) */
    bulkCapacityLbHr: number | null
    /** Central band — THE sizing value (beltPullLbf === centralLbf) */
    beltPullLbf: number
    beltPullN: number
    lowLbf: number
    centralLbf: number
    highLbf: number
    startupPullLbf: number
    startupPullN: number
    /** Service factor breakdown */
    serviceFactor: number
    sfAdders: { label: string; value: number; active: boolean; auto?: string }[]
    /** Torque-floor pulls (multiply by sprocket pitch radius for Nm) */
    continuousFloorLbf: number
    peakFloorLbf: number
    carrywayFt: number
    carrywayIn: number
    /** Loop invariant echo: belt loop = 2 × carry */
    loopIn: number
    returnResolved: { lengthIn: number; support: 'slider' | 'roller'; mu: number; frictionLbf: number }[]
    turnCount: number
    totalRiseIn: number
    tightestTurnRatio: number | null
    /** Collapse-factor screen per config */
    collapseStatus: 'compliant' | 'at-minimum' | 'violation' | null
    productLoadLbf: number
    productLoadPerFt: number
    bulkAchievedLbHr: number | null
    bulkAchievedFt3Hr: number | null
    beltWeightPerFt: number
    backTensionLbf: number
    perTurn: TurnBreakdownRow[]
    /** Curve edge-capacity screen (mandatory when turns > 0) */
    curveCapacityLbf: number | null
    maxInCurveHighLbf: number | null
    curveCapacityUtilPct: number | null
    curveSpeedExceeded: boolean
    /** Worst-turn rail friction power, W (μ_g × capstan normal load × speed) — heat index */
    railHeatWorstW: number | null
    /** Corner speed model (thermal-scaled, parametric) */
    cornerPressurePsi: number | null
    vCeilVirginFpm: number | null
    vCeilDg321Fpm: number | null
    /** Ceiling for the CURRENT rail material at Worn tension — the aging advisory */
    vCeilAgedFpm: number | null
    cornerTier: CornerTier | null
    /** true when the current speed needs better than virgin rails */
    dg321Required: boolean
    warnings: string[]
    /** Flagged assumptions riding this result — for the sign-off block */
    assumptions: string[]
}

export const LBF_TO_N = 4.44822
const G_FTS2 = 32.174
/** POM-on-UHMW curve speed guideline: 30 m/min (Forbo SF adder trigger) */
export const CURVE_SPEED_CEIL_FPM = 30 / 0.3048

/**
 * Thermal-scaled corner speed model. Interface heat q = μ·p·V; the vendor
 * curve ceiling (30 m/min for POM on UHMW at the A1-class reference corner)
 * defines the allowable q*, so V_allow scales inversely with μ·p:
 *   V = min(hardCap, confidence × V_ref × (μ_ref·p_ref)/(μ·p))
 * Anchor: p_ref = 2.44 psi from T ≈ 30 lbf (A1 clean Central) at r_c 24.567",
 * 0.5" band. Self-check: the model reproduces the empirical 80 ft/min shop
 * rule (computes ≈72 at the baseline corner). ALL constants flagged — the
 * coupon test on the arriving NGB belt (measured μ, IR temperature sweep)
 * replaces the Forbo-analog anchor with an AQS-proprietary rating.
 * Wear budget never governs at these tensions (400+ ft/min before 6mm/10yr),
 * so thermal is the single ceiling.
 */
export const CORNER_MODEL = {
    vRefFpm: 30 / 0.3048,   // 98.43 — vendor analog anchor speed
    muRef: 0.18,
    pRefPsi: 2.44,
    confidence: 0.75,
    hardCapFpm: 200,        // deliberate humility: >~2× anchor, linear scaling untrusted
    muVirgin: 0.18,
    muDg321: 0.11,
}

/** Corner speed ceiling for a rail-material μ at a corner pressure */
export function cornerSpeedCeilingFpm(muRail: number, pCornerPsi: number): number {
    const m = CORNER_MODEL
    if (muRail <= 0 || pCornerPsi <= 0) return m.hardCapFpm
    return Math.min(m.hardCapFpm, m.confidence * m.vRefFpm * (m.muRef * m.pRefPsi) / (muRail * pCornerPsi))
}

export type CornerTier = 'ok-virgin' | 'dg321-required' | 'engineering-review' | 'beyond-envelope'

export const frictionScenarios = [
    { id: 'clean', label: 'Clean/New', frictions: { carryway: 0.18, rail: 0.18, return: 0.18 } },
    { id: 'vendor', label: 'Vendor-Rec', frictions: { carryway: 0.212, rail: 0.20, return: 0.212 } },
    { id: 'worn', label: 'Worn', frictions: { carryway: 0.25, rail: 0.25, return: 0.25 } },
    { id: 'degraded', label: 'Degraded', frictions: { carryway: 0.30, rail: 0.30, return: 0.30 } },
] as const

export const defaultBeltPullConfig: BeltPullConfig = {
    infeedStraightIn: 32,
    sections: [],
    infeedHeightIn: 0,
    outfeedHeightIn: 0,
    beltWidthIn: 12,
    beltWeightLbFt2: 1.64,
    beltBuild: 'pom',
    straightRatingKgfM: 205,
    curveDerate: 0.23,
    collapseFactor: 1.5,
    productType: 'packages',
    loadMode: 'rate',
    throughputLbHr: 0,
    directLoadLbf: 0,
    productLengthIn: 12,
    productWeightLb: 1,
    bulkDensityLbFt3: 45,
    bedDepthIn: 2,
    edgeMarginIn: 1,
    reposeDeg: 35,
    pocketFillFraction: 0.85,
    beltSpeedFpm: 60,
    frictions: { ...frictionScenarios[0].frictions },
    materials: { carrywayBase: 0.18, railBase: 0.18, returnBase: 0.18 },
    wearId: 'clean',
    backTensionLbfPerFtWidth: 0,
    returnSegments: [
        { lengthIn: 0, support: 'slider' },
        { lengthIn: null, support: 'roller' },
    ],
    muRoller: 0.04,
    ordering: 'worst-case',
    turnRailMaterial: 'standard',
    contactBandIn: 0.5,
    staticRatio: 1.11,
    breakawayFactor: 1.25,
    rampTimeS: 1.0,
    turnDragModel: { mode: 'fixed', refRatio: 2.2, exponent: 0.5 },
    serviceFactors: { noseInfeed: 'bearinged', noseDischarge: 'bearinged', startStop: false, biDirectional: false },
}

export function effectiveRailMu(baseRailMu: number, turnRatio: number, model: TurnDragModel): number {
    if (model.mode !== 'ratio-scaled' || !(turnRatio > 0) || turnRatio >= model.refRatio) return baseRailMu
    return baseRailMu * Math.pow(model.refRatio / turnRatio, model.exponent)
}

export function turnArcIn(t: TurnSection, beltWidthIn: number): number {
    const centerlineRadius = t.insideRadiusIn + beltWidthIn / 2
    return centerlineRadius * (t.angleDeg * Math.PI / 180)
}

export function carrywayLengthIn(cfg: BeltPullConfig): number {
    return cfg.sections.reduce(
        (sum, s) => isIncline(s) || isStraight(s)
            ? sum + (s.lengthIn || 0)
            : sum + turnArcIn(s, cfg.beltWidthIn) + (s.straightAfterIn || 0),
        cfg.infeedStraightIn || 0
    )
}

export function pathRiseIn(cfg: BeltPullConfig): number {
    return cfg.sections.reduce((sum, s) => sum + (isIncline(s) ? (s.riseIn || 0) : 0), 0)
}

/** Product type with the legacy rule: a saved bed-mode config is bulk even if it predates the field */
export function resolveProductType(cfg: Pick<BeltPullConfig, 'productType' | 'loadMode'>): ProductType {
    return cfg.productType ?? (cfg.loadMode === 'bulk' ? 'bulk' : 'packages')
}

/** Plain-belt incline limit: entered, else the product-type default */
export const PLAIN_BELT_MAX_INCLINE_DEG: Record<ProductType, number> = { bulk: 20, packages: 25 }
export function resolveMaxPlainIncline(cfg: Pick<BeltPullConfig, 'productType' | 'loadMode' | 'maxPlainInclineDeg'>): number {
    return cfg.maxPlainInclineDeg ?? PLAIN_BELT_MAX_INCLINE_DEG[resolveProductType(cfg)]
}

/** Slope of an incline section, degrees (rise over belt length) */
export function inclineSlopeDeg(s: InclineSection): number {
    if (!(s.lengthIn > 0) || Math.abs(s.riseIn) > s.lengthIn) return 0
    return Math.asin(s.riseIn / s.lengthIn) * 180 / Math.PI
}

/**
 * Cross-section of the product wedge behind one flight, in².
 * The belt climbs at `slopeDeg`; the free surface of loose product sits at the
 * angle of repose `reposeDeg` above horizontal. Measured from the flight:
 *   - slope ≤ repose: the product stands as steep as the belt, so the pocket is
 *     bounded only by the next flight — a full bed h × pitch (capacity ceiling).
 *   - otherwise the surface falls back to the belt over run = h / tan(slope − repose):
 *     a triangle ½·h·run when the run fits inside the pitch, else the trapezoid that
 *     reaches the next flight, pitch·h − ½·pitch²·tan(slope − repose).
 */
export function pocketWedge(flightHeightIn: number, pitchIn: number, slopeDeg: number, reposeDeg: number): { areaIn2: number; runIn: number; fillsPitch: boolean } {
    const h = Math.max(flightHeightIn, 0)
    const p = Math.max(pitchIn, 0)
    if (h <= 0 || p <= 0) return { areaIn2: 0, runIn: 0, fillsPitch: false }
    const d = Math.tan(Math.max(slopeDeg - reposeDeg, 0) * Math.PI / 180)
    if (d < 1e-9) return { areaIn2: h * p, runIn: p, fillsPitch: true }
    const run = h / d
    if (run >= p) return { areaIn2: p * h - 0.5 * p * p * d, runIn: p, fillsPitch: true }
    return { areaIn2: 0.5 * h * run, runIn: run, fillsPitch: false }
}

/** Geometric pocket capacity, lb: wedge × usable width × fill × density */
export function pocketCapacityLb(
    spec: PocketSpec, slopeDeg: number, beltWidthIn: number, edgeMarginIn: number,
    reposeDeg: number, fillFraction: number, densityLbFt3: number
): { lb: number; areaIn2: number; fillsPitch: boolean; measured: boolean } {
    const wedge = pocketWedge(spec.flightHeightIn, spec.pitchIn, slopeDeg, reposeDeg)
    if (spec.lbPerPocketOverride && spec.lbPerPocketOverride > 0) {
        return { lb: spec.lbPerPocketOverride, areaIn2: wedge.areaIn2, fillsPitch: wedge.fillsPitch, measured: true }
    }
    const usableWidthIn = Math.max(beltWidthIn - 2 * Math.max(edgeMarginIn, 0), 0)
    const fill = Math.min(Math.max(fillFraction, 0), 1)
    const lb = (wedge.areaIn2 * usableWidthIn / 1728) * fill * Math.max(densityLbFt3, 0)
    return { lb, areaIn2: wedge.areaIn2, fillsPitch: wedge.fillsPitch, measured: false }
}

/**
 * One turn, three models (ref §2 model D1). All tensions lbf, lengths ft.
 * Central is the exact ODE; Low is the hand-method (no capstan); High is the
 * legacy width-ratio amplifier with the flat arc added.
 */
export function turnStep(
    tIn: number, muCarry: number, muRail: number, wCarry: number, rcFt: number,
    thetaRad: number, band: 'low' | 'central' | 'high', widthRatio: number
): number {
    const flatArc = muCarry * wCarry * rcFt * thetaRad
    if (band === 'low' || muRail < 1e-9) return tIn + flatArc
    if (band === 'central') {
        const g = Math.exp(muRail * thetaRad)
        return tIn * g + (muCarry * wCarry * rcFt / muRail) * (g - 1)
    }
    // high: sourceless sensitivity ceiling
    return tIn * Math.exp(muRail * thetaRad * widthRatio) + flatArc
}

/** Resolve return segments against the loop invariant (return total = carry total) */
export function resolveReturnSegments(cfg: BeltPullConfig, carryIn: number) {
    const segs = (cfg.returnSegments?.length ? cfg.returnSegments : defaultBeltPullConfig.returnSegments)
    const fixed = segs.reduce((s, r) => s + (r.lengthIn ?? 0), 0)
    const remainder = Math.max(carryIn - fixed, 0)
    let remainderUsed = false
    return segs.map((r) => {
        let lengthIn = r.lengthIn ?? 0
        if (r.lengthIn === null && !remainderUsed) {
            lengthIn = remainder
            remainderUsed = true
        }
        return { lengthIn, support: r.support }
    })
}

export function calculateBeltPull(cfg: BeltPullConfig, frictionsOverride?: FrictionSet): BeltPullResult {
    const mu = frictionsOverride ?? cfg.frictions
    const warnings: string[] = []
    const assumptions: string[] = []

    const widthFt = cfg.beltWidthIn / 12
    const buildWeightFactor = cfg.beltBuild === 'pp' ? 0.75 : 1
    const beltPerFt = cfg.beltWeightLbFt2 * buildWeightFactor * widthFt

    const carryIn = carrywayLengthIn(cfg)
    const carryFt = carryIn / 12

    // ── Product load: a uniform per-foot spread from the load mode, then any incline section
    //    that carries its own load (flighted pockets, or an entered lb/ft) replaces the spread there ──
    const productType = resolveProductType(cfg)
    const reposeDeg = cfg.reposeDeg ?? defaultBeltPullConfig.reposeDeg!
    const fillFraction = cfg.pocketFillFraction ?? defaultBeltPullConfig.pocketFillFraction!
    const speedFpm = cfg.beltSpeedFpm || 0

    const pockets: PocketSummary[] = []
    const ownLoad = new Map<number, { perFt: number; source: 'pocket' | 'override' }>()
    cfg.sections.forEach((s, i) => {
        if (!isIncline(s)) return
        if (s.productLbfPerFt !== undefined && s.productLbfPerFt !== null && s.productLbfPerFt >= 0) {
            ownLoad.set(i, { perFt: s.productLbfPerFt, source: 'override' })
            return
        }
        if (s.pocket && s.pocket.flightHeightIn > 0 && s.pocket.pitchIn > 0) {
            const slope = inclineSlopeDeg(s)
            const cap = pocketCapacityLb(s.pocket, slope, cfg.beltWidthIn, cfg.edgeMarginIn || 0, reposeDeg, fillFraction, cfg.bulkDensityLbFt3 || 0)
            const perFt = cap.lb * 12 / s.pocket.pitchIn
            pockets.push({
                index: i, slopeDeg: slope, areaIn2: cap.areaIn2, fillsPitch: cap.fillsPitch,
                lbPerPocket: cap.lb, measured: cap.measured,
                pocketsOnSection: (s.lengthIn || 0) / s.pocket.pitchIn,
                lbfPerFt: perFt,
                achievedLbHr: cap.lb * (speedFpm * 12 / s.pocket.pitchIn) * 60,
            })
            ownLoad.set(i, { perFt, source: 'pocket' })
        }
    })
    const ownLoadIn = cfg.sections.reduce((sum, s, i) => sum + (isIncline(s) && ownLoad.has(i) ? (s.lengthIn || 0) : 0), 0)
    const uniformFt = Math.max(carryIn - ownLoadIn, 0) / 12

    let uniformPerFt = 0
    let bulkAchievedLbHr: number | null = null
    let bulkAchievedFt3Hr: number | null = null
    const usableWidthIn = Math.max(cfg.beltWidthIn - 2 * (cfg.edgeMarginIn || 0), 0)
    const bedAreaFt2 = (usableWidthIn * (cfg.bedDepthIn || 0)) / 144
    const bedPerFt = (cfg.bulkDensityLbFt3 || 0) * bedAreaFt2
    if (productType === 'bulk' && bedPerFt > 0) {
        // Bed capacity at speed is reported for every bulk config; it only DRIVES the load in bed mode
        bulkAchievedFt3Hr = bedAreaFt2 * speedFpm * 60
        bulkAchievedLbHr = bedPerFt * speedFpm * 60
    }
    if (cfg.loadMode === 'rate') {
        uniformPerFt = speedFpm > 0 ? cfg.throughputLbHr / (speedFpm * 60) : 0
    } else if (cfg.loadMode === 'direct') {
        // A stated total spreads over the carry that has no load of its own
        uniformPerFt = uniformFt > 0 ? (cfg.directLoadLbf || 0) / uniformFt : 0
    } else if (cfg.loadMode === 'bulk') {
        uniformPerFt = bedPerFt
        if (bulkAchievedLbHr === null) {
            bulkAchievedFt3Hr = bedAreaFt2 * speedFpm * 60
            bulkAchievedLbHr = bedPerFt * speedFpm * 60
        }
    } else {
        uniformPerFt = cfg.productLengthIn > 0 ? (cfg.productWeightLb || 0) * 12 / cfg.productLengthIn : 0
    }

    // Carry pieces in path order, each with its own load. Friction and gravity are kept apart so the
    // wear scenarios can rescale friction without touching the lift term.
    type CarryPiece = {
        kind: 'straight' | 'incline' | 'turn'
        index: number
        lengthIn: number
        perFt: number
        source: SectionLoadRow['source']
        frictionLbf: number
        gravityLbf: number
        turn?: TurnSection
    }
    const runPiece = (kind: 'straight' | 'incline', index: number, lengthIn: number, riseIn: number, perFt: number, source: SectionLoadRow['source']): CarryPiece => {
        const lenFt = (lengthIn || 0) / 12
        const riseFt = (riseIn || 0) / 12
        const horizFt = kind === 'incline' ? Math.sqrt(Math.max(lenFt * lenFt - riseFt * riseFt, 0)) : lenFt
        const w = beltPerFt + perFt
        return { kind, index, lengthIn: lengthIn || 0, perFt, source, frictionLbf: mu.carryway * w * horizFt, gravityLbf: w * riseFt }
    }
    const pieces: CarryPiece[] = [runPiece('straight', -1, cfg.infeedStraightIn, 0, uniformPerFt, 'uniform')]
    cfg.sections.forEach((s, i) => {
        if (isIncline(s)) {
            const own = ownLoad.get(i)
            pieces.push(runPiece('incline', i, s.lengthIn, s.riseIn, own?.perFt ?? uniformPerFt, own?.source ?? 'uniform'))
        } else if (isStraight(s)) {
            pieces.push(runPiece('straight', i, s.lengthIn, 0, uniformPerFt, 'uniform'))
        } else {
            pieces.push({ kind: 'turn', index: i, lengthIn: turnArcIn(s, cfg.beltWidthIn), perFt: uniformPerFt, source: 'uniform', frictionLbf: 0, gravityLbf: 0, turn: s })
            pieces.push(runPiece('straight', i, s.straightAfterIn, 0, uniformPerFt, 'uniform'))
        }
    })
    const sectionLoads: SectionLoadRow[] = pieces
        .filter((p) => p.lengthIn > 0)
        .map((p) => ({ index: p.index, kind: p.kind, lengthIn: p.lengthIn, lbfPerFt: p.perFt, lbf: p.perFt * p.lengthIn / 12, source: p.source }))
    const productLoadLbf = sectionLoads.reduce((s, r) => s + r.lbf, 0)
    const productPerFt = carryFt > 0 ? productLoadLbf / carryFt : 0
    /** Turns always carry the uniform spread (pockets exist only on inclines) */
    const wCarry = beltPerFt + uniformPerFt
    const backTension = (cfg.backTensionLbfPerFtWidth || 0) * widthFt
    if (backTension > 0) assumptions.push(`Back tension ${backTension.toFixed(1)} lbf entered — modular belts with catenary take-up normally run ~0.`)

    // ── Slip screen: product on a plain incline steeper than the belt can hold it ──
    const slipSections: number[] = []
    const maxPlain = resolveMaxPlainIncline(cfg)
    cfg.sections.forEach((s, i) => {
        if (!isIncline(s) || ownLoad.get(i)?.source === 'pocket') return
        const perFt = ownLoad.get(i)?.perFt ?? uniformPerFt
        const slope = Math.abs(inclineSlopeDeg(s))
        if (perFt > 0 && slope > maxPlain + 1e-9) {
            if (s.allowPlainIncline) {
                assumptions.push(`Incline ${i + 1}: engineer accepted a plain belt at ${slope.toFixed(1)}° (past the ${maxPlain}° ${productType} limit) — retention by belt surface, cleats, or product behaviour to be confirmed.`)
                return
            }
            slipSections.push(i)
            warnings.push(productType === 'bulk'
                ? `Incline ${i + 1} climbs ${slope.toFixed(1)}° with loose product on a plain belt — past the ${maxPlain}° plain-belt limit, so the product slides back. Flights (pockets) or a shallower slope required.`
                : `Incline ${i + 1} climbs ${slope.toFixed(1)}° — past the ${maxPlain}° plain-belt limit for packages. Cleats, a high-friction belt surface, or a shallower slope required.`)
        }
    })

    // ── Bulk capacity: can the bed / pockets deliver the demanded rate ──
    let bulkCapacityLbHr: number | null = null
    if (productType === 'bulk') {
        const capacities = [...pockets.map((p) => p.achievedLbHr), ...(cfg.loadMode !== 'bulk' && bulkAchievedLbHr !== null ? [bulkAchievedLbHr] : [])]
        if (capacities.length > 0) {
            bulkCapacityLbHr = Math.min(...capacities)
            if (cfg.loadMode === 'rate' && cfg.throughputLbHr > bulkCapacityLbHr + 1e-9) {
                const limiter = pockets.length > 0 && bulkCapacityLbHr === Math.min(...pockets.map((p) => p.achievedLbHr))
                    ? 'the flight pockets' : 'the bed'
                warnings.push(`Demanded ${cfg.throughputLbHr.toFixed(0)} lb/hr exceeds what ${limiter} can deliver at ${speedFpm} ft/min (${bulkCapacityLbHr.toFixed(0)} lb/hr) — raise speed, flight height, or pitch, or deepen the bed.`)
            }
        }
        if (pockets.length > 0) {
            assumptions.push(`Pocket capacity = wedge behind each flight at ${reposeDeg}° repose × usable width × ${(fillFraction * 100).toFixed(0)}% fill × ${cfg.bulkDensityLbFt3} lb/ft³ loose density — geometric estimate; a measured lb/pocket overrides it.`)
        }
    }

    // ── Return: segmented, belt weight only; regain on net rise ──
    const returnResolved = resolveReturnSegments(cfg, carryIn).map((r) => {
        const segMu = r.support === 'slider' ? mu.return : (cfg.muRoller || 0.04)
        return { ...r, mu: segMu, frictionLbf: beltPerFt * (r.lengthIn / 12) * segMu }
    })
    const totalRiseFt = pathRiseIn(cfg) / 12
    const returnFriction = returnResolved.reduce((s, r) => s + r.frictionLbf, 0)
    const returnTotal = returnFriction - beltPerFt * totalRiseFt
    if (returnResolved.some((r) => r.support === 'roller' && r.lengthIn > 0)) {
        assumptions.push(`Bearinged-roller return μ = ${(cfg.muRoller || 0.04).toFixed(2)} (assumed, plausible 0.03–0.05).`)
    }

    const dragModel = cfg.turnDragModel ?? defaultBeltPullConfig.turnDragModel

    // ── March, three bands ──
    const runBand = (band: 'low' | 'central' | 'high') => {
        const exits: number[] = []
        const entries: number[] = []
        let T = backTension + returnTotal // slack side leaves the drive: return runs first
        if (cfg.ordering === 'worst-case') {
            // all non-turn friction before the turns (conservative, ref §2.3)
            for (const p of pieces) if (p.kind !== 'turn') T += p.frictionLbf + p.gravityLbf
            for (const p of pieces) {
                if (p.kind !== 'turn') continue
                const t = p.turn!
                const rcFt = (t.insideRadiusIn + cfg.beltWidthIn / 2) / 12
                const theta = t.angleDeg * Math.PI / 180
                const ratio = cfg.beltWidthIn > 0 ? t.insideRadiusIn / cfg.beltWidthIn : 0
                const muEff = effectiveRailMu(mu.rail, ratio, dragModel)
                const wr = (t.insideRadiusIn + cfg.beltWidthIn) / (t.insideRadiusIn + cfg.beltWidthIn / 2)
                entries.push(T)
                T = turnStep(T, mu.carryway, muEff, wCarry, rcFt, theta, band, wr)
                exits.push(T)
            }
        } else {
            for (const p of pieces) {
                if (p.kind !== 'turn') { T += p.frictionLbf + p.gravityLbf; continue }
                const t = p.turn!
                const rcFt = (t.insideRadiusIn + cfg.beltWidthIn / 2) / 12
                const theta = t.angleDeg * Math.PI / 180
                const ratio = cfg.beltWidthIn > 0 ? t.insideRadiusIn / cfg.beltWidthIn : 0
                const muEff = effectiveRailMu(mu.rail, ratio, dragModel)
                const wr = (t.insideRadiusIn + cfg.beltWidthIn) / (t.insideRadiusIn + cfg.beltWidthIn / 2)
                entries.push(T)
                T = turnStep(T, mu.carryway, muEff, wCarry, rcFt, theta, band, wr)
                exits.push(T)
            }
        }
        return { pull: T, entries, exits }
    }

    const low = runBand('low')
    const central = runBand('central')
    const high = runBand('high')
    const perTurnEntries = central.entries

    let centralLbf = central.pull
    if (centralLbf < 0) {
        warnings.push('Net decline exceeds all friction — the drive must brake/hold back, not pull. Showing 0 running pull.')
        centralLbf = 0
    }

    // Per-turn table (Central band) + High exits for the curve check
    const turns = cfg.sections.filter(isTurn)
    const perTurn: TurnBreakdownRow[] = turns.map((t, i) => {
        const ratio = cfg.beltWidthIn > 0 ? t.insideRadiusIn / cfg.beltWidthIn : 0
        const muEff = effectiveRailMu(mu.rail, ratio, dragModel)
        return {
            turn: i + 1,
            angleDeg: t.angleDeg,
            insideRadiusIn: t.insideRadiusIn,
            turnRatio: ratio,
            muEff,
            tensionIn: central.entries[i] ?? 0,
            tensionOut: central.exits[i] ?? 0,
            multiplier: Math.exp(muEff * t.angleDeg * Math.PI / 180),
            tensionOutHigh: high.exits[i] ?? 0,
        }
    })

    // ── Startup + accel ──
    const movingMassLb = beltPerFt * carryFt * 2 + productLoadLbf
    const accelFts2 = cfg.rampTimeS > 0 ? (cfg.beltSpeedFpm / 60) / cfg.rampTimeS : 0
    const accelLbf = movingMassLb * accelFts2 / G_FTS2
    const startupPullLbf = centralLbf * Math.max(cfg.staticRatio || 1, 1) + accelLbf

    // ── Service factors (Forbo additive, ref §3.3) ──
    const totalRiseIn = pathRiseIn(cfg)
    const speedTriggered = cfg.beltSpeedFpm > CURVE_SPEED_CEIL_FPM
    const sf = cfg.serviceFactors ?? defaultBeltPullConfig.serviceFactors
    const sfAdders = [
        { label: 'Nose bar, infeed end (static)', value: 0.4, active: sf.noseInfeed === 'static' },
        { label: 'Nose bar, discharge end (static)', value: 0.4, active: sf.noseDischarge === 'static' },
        { label: 'Speed > 30 m/min (98.4 ft/min)', value: 0.2, active: speedTriggered, auto: `auto: ${cfg.beltSpeedFpm} ft/min` },
        { label: 'Frequent loaded start-stop', value: 0.2, active: sf.startStop },
        { label: 'Bi-directional / center drive', value: 0.2, active: sf.biDirectional },
        { label: 'Elevation', value: 0.4, active: totalRiseIn > 0, auto: totalRiseIn > 0 ? `auto: rises ${totalRiseIn.toFixed(0)}"` : 'auto: horizontal' },
    ]
    const serviceFactor = 1 + sfAdders.reduce((s, a) => s + (a.active ? a.value : 0), 0)
    const continuousFloorLbf = centralLbf * serviceFactor
    const peakFloorLbf = Math.max(cfg.breakawayFactor || 1.25, cfg.staticRatio || 1) * centralLbf * serviceFactor

    // ── Curve edge-capacity screen (mandatory when turns exist, ref §4) ──
    const buildRatingFactor = cfg.beltBuild === 'pp' ? 0.65 : 1
    const widthM = cfg.beltWidthIn * 0.0254
    const straightCapacityLbf = (cfg.straightRatingKgfM || 0) * buildRatingFactor * widthM * 2.20462
    let curveCapacityLbf: number | null = null
    let maxInCurveHighLbf: number | null = null
    let curveCapacityUtilPct: number | null = null
    if (turns.length > 0 && straightCapacityLbf > 0) {
        curveCapacityLbf = straightCapacityLbf * (cfg.curveDerate || 0.23)
        maxInCurveHighLbf = Math.max(...high.exits, 0)
        curveCapacityUtilPct = (maxInCurveHighLbf / curveCapacityLbf) * 100
        assumptions.push(`Curve capacity = straight rating × ${(cfg.curveDerate || 0.23).toFixed(2)} — bounded screen, not manufacturer-certified. Request the vendor curve rating.`)
        if (curveCapacityUtilPct > 100) {
            warnings.push(`In-curve tension (High ${maxInCurveHighLbf.toFixed(1)} lbf) exceeds the derated curve capacity ${curveCapacityLbf.toFixed(1)} lbf — get the vendor curve rating before proceeding.`)
        }
    }

    // ── Rail heat index (complementary to the ceiling): P = μ_g × N × v ──
    let railHeatWorstW: number | null = null
    if (turns.length > 0 && perTurnEntries.length > 0) {
        const LBFFTMIN_TO_W = 0.0225970
        railHeatWorstW = Math.max(...turns.map((t, i) => {
            const theta = t.angleDeg * Math.PI / 180
            const ratio = cfg.beltWidthIn > 0 ? t.insideRadiusIn / cfg.beltWidthIn : 0
            const muEff = effectiveRailMu(mu.rail, ratio, dragModel)
            const tAvg = ((central.entries[i] ?? 0) + (central.exits[i] ?? 0)) / 2
            return muEff * tAvg * theta * cfg.beltSpeedFpm * LBFFTMIN_TO_W
        }))
    }

    // ── Thermal-scaled corner speed ceiling (parametric, replaces the fixed 80 rule) ──
    // Corner pressure from the DESIGN basis: worst-turn Central tension at CLEAN
    // friction (consistent with how p_ref = 2.44 was anchored). The aged ceiling
    // at Worn tension rides alongside as the degradation advisory.
    let cornerPressurePsi: number | null = null
    let vCeilVirginFpm: number | null = null
    let vCeilDg321Fpm: number | null = null
    let vCeilAgedFpm: number | null = null
    let cornerTier: CornerTier | null = null
    let dg321Required = false
    if (turns.length > 0) {
        const band = cfg.contactBandIn || 0.5
        const cornerPressureFor = (frs: FrictionSet) => {
            const walk = ((): { t: number; rcIn: number } => {
                // march Central with the given frictions; worst = max in-turn exit
                let T = (cfg.backTensionLbfPerFtWidth || 0) * widthFt
                    + returnResolved.reduce((s2, r) => s2 + beltPerFt * (r.lengthIn / 12) * (r.support === 'slider' ? frs.return : (cfg.muRoller || 0.04)), 0)
                    - beltPerFt * totalRiseFt
                for (const pc of pieces) if (pc.kind !== 'turn') T += pc.frictionLbf * (frs.carryway / mu.carryway || 1) + pc.gravityLbf
                let worst = { t: 0, rcIn: 1 }
                for (const pc of pieces) {
                    if (pc.kind !== 'turn') continue
                    const t = pc.turn!
                    const rcIn = t.insideRadiusIn + cfg.beltWidthIn / 2
                    const theta = t.angleDeg * Math.PI / 180
                    const ratio = cfg.beltWidthIn > 0 ? t.insideRadiusIn / cfg.beltWidthIn : 0
                    const muEff = effectiveRailMu(frs.rail, ratio, dragModel)
                    T = turnStep(T, frs.carryway, muEff, wCarry, rcIn / 12, theta, 'central', 1)
                    if (T > worst.t) worst = { t: T, rcIn }
                }
                return worst
            })()
            return { pPsi: walk.t / (walk.rcIn * band), rcIn: walk.rcIn }
        }
        const m = cfg.materials ?? defaultBeltPullConfig.materials
        const clean = cornerPressureFor(scenarioFrictions(m, wearFactors[0]))
        const worn = cornerPressureFor(scenarioFrictions(m, wearFactors.find((f) => f.id === 'worn')!))
        cornerPressurePsi = clean.pPsi
        vCeilVirginFpm = cornerSpeedCeilingFpm(CORNER_MODEL.muVirgin, clean.pPsi)
        vCeilDg321Fpm = cornerSpeedCeilingFpm(CORNER_MODEL.muDg321, clean.pPsi)
        const muCurrent = cfg.turnRailMaterial === 'dg321' ? CORNER_MODEL.muDg321 : CORNER_MODEL.muVirgin
        vCeilAgedFpm = cornerSpeedCeilingFpm(muCurrent, worn.pPsi)

        const V = cfg.beltSpeedFpm
        cornerTier = V <= vCeilVirginFpm ? 'ok-virgin'
            : V <= vCeilDg321Fpm ? 'dg321-required'
            : V <= CORNER_MODEL.hardCapFpm ? 'engineering-review'
            : 'beyond-envelope'
        dg321Required = cornerTier !== 'ok-virgin'

        if (cornerTier === 'dg321-required' && cfg.turnRailMaterial !== 'dg321') {
            warnings.push(
                `DG-321 (oil-embedded UHMW) turn rails REQUIRED: ${V} ft/min exceeds the virgin-UHMW corner ceiling ` +
                `${vCeilVirginFpm.toFixed(0)} ft/min at ${clean.pPsi.toFixed(2)} psi corner pressure (thermal q = μ·p·V model).`
            )
        } else if (cornerTier === 'engineering-review') {
            warnings.push(
                `${V} ft/min exceeds even the DG-321 corner ceiling ${vCeilDg321Fpm.toFixed(0)} ft/min — DG-321 plus relaxed ` +
                'radius and/or tension management required. Engineering review before quoting.'
            )
        } else if (cornerTier === 'beyond-envelope') {
            warnings.push(
                `${V} ft/min is beyond the ${CORNER_MODEL.hardCapFpm} ft/min sliding-corner envelope — rolling corner hardware, ` +
                'a vendor speed rating, or a coupon-validated exception is required.'
            )
        }
        assumptions.push(
            `Corner speed model: Forbo-analog anchor (V_ref ${CORNER_MODEL.vRefFpm.toFixed(0)} @ μ ${CORNER_MODEL.muRef}, ` +
            `p_ref ${CORNER_MODEL.pRefPsi} psi), confidence ${CORNER_MODEL.confidence}, ${CORNER_MODEL.hardCapFpm} ft/min hard cap, ` +
            `${band}" contact band — ALL flagged; the NGB coupon test replaces the anchor with a measured AQS rating.`
        )
    }
    const curveSpeedExceeded = cornerTier !== null && cornerTier !== 'ok-virgin'
        && cfg.beltBuild === 'pom'
        && !(cornerTier === 'dg321-required' && cfg.turnRailMaterial === 'dg321')
    if (cfg.turnRailMaterial === 'dg321') {
        assumptions.push('DG-321 oil-embedded UHMW turn rails specified — internally lubricated, retains lubricity as it wears; rail μ base ~0.11 (datasheet 0.10–0.12 vs steel; belt-edge pair unverified — calibrate).')
    }

    // ── Collapse-factor screen (geometry compliance, never a tension derating) ──
    const tightestTurnRatio = turns.length > 0
        ? Math.min(...turns.map((t) => t.insideRadiusIn / cfg.beltWidthIn))
        : null
    let collapseStatus: BeltPullResult['collapseStatus'] = null
    if (tightestTurnRatio !== null) {
        const factor = cfg.collapseFactor || 1.5
        if (tightestTurnRatio < factor - 1e-6) {
            collapseStatus = 'violation'
            warnings.push(`Tightest turn ratio ${tightestTurnRatio.toFixed(3)} is BELOW the belt's collapse factor ${factor} (r_min = ${(factor * cfg.beltWidthIn).toFixed(1)}") — geometry violation.`)
        } else if (Math.abs(tightestTurnRatio - factor) < 0.005) {
            collapseStatus = 'at-minimum'
            warnings.push('Inside radius sits exactly at the belt\'s minimum ratio — the recommended design point, but the inside rail is tolerance-critical (zero build margin).')
        } else {
            collapseStatus = 'compliant'
        }
    }

    // ── Drawing sanity screens ──
    const allStraights: number[] = [cfg.infeedStraightIn, ...turns.map((t) => t.straightAfterIn), ...cfg.sections.filter((s) => isIncline(s) || isStraight(s)).map((s) => (s as InclineSection | StraightSection).lengthIn)]
    if (allStraights.some((s) => s > 600 || (s > 0 && s < 3))) {
        warnings.push('A straight length looks unit-suspicious (>600 in or <3 in) — check units: inches expected.')
    }
    // Arc-length detector (ref I11): dim ≈ (π/2) × any radius within ±0.5%
    const radii = turns.flatMap((t) => [t.insideRadiusIn, t.insideRadiusIn + cfg.beltWidthIn / 2, t.insideRadiusIn + cfg.beltWidthIn])
    for (const dim of allStraights) {
        if (dim <= 0) continue
        for (const r of radii) {
            const arc = (Math.PI / 2) * r
            if (arc > 0 && Math.abs(dim - arc) / arc < 0.005) {
                warnings.push(`Dimension ${dim}" ≈ 1.5708 × ${r.toFixed(3)}" — this may be an ARC LENGTH at that radius, not a straight/width. Check the drawing.`)
                break
            }
        }
    }
    if (cfg.sections.filter(isIncline).some((s) => Math.abs(s.riseIn || 0) > (s.lengthIn || 0))) {
        warnings.push('An incline rise exceeds its belt length — rise must be ≤ length.')
    }
    const heightChangeIn = (cfg.outfeedHeightIn || 0) - (cfg.infeedHeightIn || 0)
    if ((cfg.infeedHeightIn || cfg.outfeedHeightIn) && Math.abs(totalRiseIn - heightChangeIn) > 1) {
        warnings.push(`Path rises ${totalRiseIn.toFixed(1)}" but infeed→outfeed height change is ${heightChangeIn.toFixed(1)}" — fix the incline sections.`)
    }
    if (cfg.ordering === 'worst-case') {
        assumptions.push('Worst-case section ordering (all straight/return friction before the turns) — real layout can only be equal or better.')
    }
    if (dragModel.mode === 'ratio-scaled') {
        assumptions.push(`Ratio-scaled corner drag active (n=${dragModel.exponent}) — calibrate against a vendor run or pull test.`)
    }
    assumptions.push('μ_g (belt-edge-to-curve-rail) taken equal to the rail μ setting — measured value collapses the Central↔High band.')

    return {
        productType,
        sectionLoads,
        pockets,
        slipSections,
        bulkCapacityLbHr,
        beltPullLbf: centralLbf,
        beltPullN: centralLbf * LBF_TO_N,
        lowLbf: Math.max(low.pull, 0),
        centralLbf,
        highLbf: Math.max(high.pull, 0),
        startupPullLbf,
        startupPullN: startupPullLbf * LBF_TO_N,
        serviceFactor,
        sfAdders,
        continuousFloorLbf,
        peakFloorLbf,
        carrywayFt: carryFt,
        carrywayIn: carryIn,
        loopIn: 2 * carryIn,
        returnResolved,
        turnCount: turns.length,
        totalRiseIn,
        tightestTurnRatio,
        collapseStatus,
        productLoadLbf,
        productLoadPerFt: productPerFt,
        bulkAchievedLbHr,
        bulkAchievedFt3Hr,
        beltWeightPerFt: beltPerFt,
        backTensionLbf: backTension,
        perTurn,
        curveCapacityLbf,
        maxInCurveHighLbf,
        curveCapacityUtilPct,
        curveSpeedExceeded,
        railHeatWorstW,
        cornerPressurePsi,
        vCeilVirginFpm,
        vCeilDg321Fpm,
        vCeilAgedFpm,
        cornerTier,
        dg321Required,
        warnings,
        assumptions,
    }
}

/**
 * Calibration back-solver: solve base rail μ reproducing a trusted CENTRAL pull.
 */
export function solveRailMu(cfg: BeltPullConfig, targetPullLbf: number): number | null {
    if (!cfg.sections.some(isTurn)) return null
    const pullAt = (railMu: number) =>
        calculateBeltPull(cfg, { ...cfg.frictions, rail: railMu }).centralLbf
    let lo = 0.001, hi = 2.0
    if (targetPullLbf <= pullAt(lo) || targetPullLbf >= pullAt(hi)) return null
    for (let i = 0; i < 80; i++) {
        const mid = (lo + hi) / 2
        if (pullAt(mid) < targetPullLbf) lo = mid
        else hi = mid
    }
    return (lo + hi) / 2
}

export function calculateAllScenarios(cfg: BeltPullConfig) {
    const m = cfg.materials ?? defaultBeltPullConfig.materials
    return wearFactors.map((f) => {
        const frictions = scenarioFrictions(m, f)
        return { id: f.id, label: f.label, frictions, result: calculateBeltPull(cfg, frictions) }
    })
}

// ── Drive-side helpers (sprocket-driven modular belts) ──

/** Chordal pitch diameter, mm: PD = pitch / sin(180°/z) */
export function chordalPdMm(pitchMm: number, teeth: number): number {
    if (teeth < 3) return 0
    return pitchMm / Math.sin(Math.PI / teeth)
}

/** Torque (Nm) to deliver a pull (lbf) at a sprocket pitch radius (in) */
export function torqueNmFromPull(pullLbf: number, pitchRadiusIn: number): number {
    return pullLbf * LBF_TO_N * (pitchRadiusIn * 0.0254)
}

/**
 * Thermal ambient uplift on a drum motor's continuous (thermal) rating:
 * adjusted = rated × √((rise + 40 − ambient)/rise), capped at 1.25×.
 * An engineering allowance, NOT a vendor rating.
 */
export function thermalUpliftFactor(ambientC: number, ratedRiseK = 80): number {
    const f = Math.sqrt(Math.max(ratedRiseK + 40 - ambientC, 0) / ratedRiseK)
    return Math.min(Math.max(f, 0), 1.25)
}

/** Sprocket sanity screens (ref I3) — returns human-readable failures */
export function sprocketScreens(pdMm: number, teeth: number, beltPitchMm: number, boreMm?: number | null, shellMm?: number | null): string[] {
    const out: string[] = []
    if (boreMm && pdMm <= boreMm) out.push(`PD ${pdMm.toFixed(1)} mm does not exceed the sprocket bore ${boreMm.toFixed(1)} mm — physically impossible.`)
    if (boreMm && shellMm && boreMm <= shellMm) out.push(`Sprocket bore ${boreMm.toFixed(1)} mm does not clear the motor shell ${shellMm.toFixed(1)} mm.`)
    if (teeth >= 3 && beltPitchMm > 0) {
        const backSolved = pdMm * Math.sin(Math.PI / teeth)
        const err = Math.abs(backSolved - beltPitchMm) / beltPitchMm
        if (err > 0.02) out.push(`PD back-solves to a ${backSolved.toFixed(1)} mm pitch vs the belt's ${beltPitchMm.toFixed(0)} mm (${(err * 100).toFixed(1)}% off) — wrong PD or wrong tooth count.`)
    }
    return out
}

export function pathSummary(cfg: BeltPullConfig): string {
    const parts: string[] = [`${cfg.infeedStraightIn}in`]
    for (const s of cfg.sections) {
        if (isStraight(s)) {
            parts.push(`${s.lengthIn}in`)
            continue
        }
        if (isIncline(s)) {
            const pocket = s.pocket && s.pocket.flightHeightIn > 0 ? ` ⌸${s.pocket.flightHeightIn}"@${s.pocket.pitchIn}"` : ''
            parts.push(`${s.riseIn >= 0 ? '↗' : '↘'}${s.lengthIn}in${s.riseIn >= 0 ? '+' : ''}${s.riseIn}in${pocket}`)
            continue
        }
        parts.push(`${s.angleDeg}° R${s.insideRadiusIn}${s.direction}`)
        if (s.straightAfterIn > 0) parts.push(`${s.straightAfterIn}in`)
    }
    return parts.join(' — ')
}

/** Built-in examples (fixtures). A1 matches the OneMotion sign-off geometry. */
export const exampleConfigs: { id: string; label: string; config: BeltPullConfig }[] = [
    {
        id: 'a1-infeed',
        label: 'A1 infeed — 3-turn S (sign-off geometry)',
        config: {
            ...defaultBeltPullConfig,
            infeedStraightIn: 144.2307, // carry straights lumped (worst-case ordering)
            sections: [
                { angleDeg: 90, insideRadiusIn: 18.425, direction: 'R', straightAfterIn: 0 },
                { angleDeg: 90, insideRadiusIn: 18.425, direction: 'L', straightAfterIn: 0 },
                { angleDeg: 90, insideRadiusIn: 18.425, direction: 'L', straightAfterIn: 0 },
            ],
            beltWidthIn: 12.283,
            beltWeightLbFt2: 1.638,
            loadMode: 'rate',
            throughputLbHr: 3500,
            beltSpeedFpm: 80,
            returnSegments: [
                { lengthIn: 100, support: 'slider' },
                { lengthIn: null, support: 'roller' },
            ],
        },
    },
    {
        id: 'outfeed-2-turn',
        label: '2-turn outfeed',
        config: {
            ...defaultBeltPullConfig,
            infeedStraightIn: 32,
            sections: [
                { angleDeg: 90, insideRadiusIn: 18.425, direction: 'L', straightAfterIn: 33.6 },
                { angleDeg: 90, insideRadiusIn: 18.425, direction: 'R', straightAfterIn: 36 },
            ],
            beltWidthIn: 12.283,
            beltWeightLbFt2: 1.638,
            loadMode: 'rate',
            throughputLbHr: 3500,
            beltSpeedFpm: 140,
            returnSegments: [
                { lengthIn: 100, support: 'slider' },
                { lengthIn: null, support: 'roller' },
            ],
        },
    },
    {
        id: 'straight',
        label: 'Straight conveyor (0 turns)',
        config: {
            ...defaultBeltPullConfig,
            infeedStraightIn: 120,
            sections: [],
            loadMode: 'direct',
            directLoadLbf: 0,
        },
    },
]
