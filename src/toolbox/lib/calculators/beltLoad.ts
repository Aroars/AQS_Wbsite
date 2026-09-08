/**
 * Belt Load / Throughput converter — pure calculation module
 * @module lib/calculators/beltLoad
 *
 * Converts between the numbers a plant quotes and the numbers a conveyor
 * engineer needs: throughput (lb/hr) ↔ weight per minute ↔ average package
 * weight ↔ packages per minute, plus the belt-loading figures (lb/ft, package
 * pitch) that feed the belt pull solver.
 *
 * Independent of the belt pull calculator by design — extend or rework this
 * without touching the pull math. Its output feeds Belt Pull via the store.
 */

export type LoadProductType = 'packages' | 'bulk'

export interface BeltLoadInput {
    /** Discrete packages (default) or loose bulk product. Bulk skips the piece math and adds density / bed fields. */
    productType?: LoadProductType
    /** Throughput as quoted, lb/hr (null = derive from lb/day or pieces if possible) */
    throughputLbHr: number | null
    /** Throughput as quoted per day — converted using OPERATING hours, not clock hours */
    throughputLbPerDay?: number | null
    /** Production hours per day the process actually runs (default 24) */
    operatingHrsPerDay?: number | null
    /** Theoretical max speed of the bagger/packager, packages per minute */
    ratedPackagerPpm?: number | null
    /** Belt speed, ft/min (needed for lb/ft and pitch) */
    beltSpeedFpm: number | null
    /** Average package weight, lb/piece — linked pair with ppm */
    pieceWeightLb: number | null
    /** Packages per minute — linked pair with pieceWeightLb */
    ppm: number | null

    // ── Package fill (all optional): bulk product settled into a FIXED box volume.
    // Volumetric conveying rates live in the Belt Pull solver's bulk mode — the
    // conveyor's bed × speed defines them, not a standalone conversion. ──
    /** Settled density of the product in the package, lb/ft³ */
    settledDensityLbFt3?: number | null
    /** Package inside dimensions, inches — with density, derives weight per package */
    pkgLengthIn?: number | null
    pkgWidthIn?: number | null
    pkgHeightIn?: number | null
    /** Fill fraction 0–1 (headspace/voids); default 1.0 = geometric volume */
    fillFraction?: number | null

    // ── Bulk (loose product): rate by weight or volume, and an optional bed-capacity check ──
    /** Loose, as-conveyed density, lb/ft³ (material fluffs up off the pile — not the settled figure) */
    looseDensityLbFt3?: number | null
    /** Rate quoted by volume, ft³/hr — converted through loose density when lb/hr is not given */
    throughputFt3Hr?: number | null
    /** Belt width, in — with bed depth and edge margin, sets what the bed can carry at speed */
    beltWidthIn?: number | null
    bedDepthIn?: number | null
    /** Unusable belt edge per side, in (default 1) */
    edgeMarginIn?: number | null
    /** Angle of repose, degrees — carried through to the incline / pocket solver (no effect here) */
    reposeDeg?: number | null
}

export type ThroughputSource = 'entered' | 'per-day' | 'pieces' | 'volume'
export type PieceWeightSource = 'entered' | 'dims' | 'rate' | null

export interface BeltLoadResult {
    productType: LoadProductType
    /** Throughput, lb/hr (entered, or derived from bulk flow or piece data) */
    throughputLbHr: number
    throughputSource: ThroughputSource
    /** kept for callers/tests that predate throughputSource */
    throughputDerived: boolean
    /** Product weight per minute, lb/min */
    lbPerMin: number
    /** Product weight per foot of belt (needs speed) — the belt pull input */
    lbPerFt: number | null
    /** Average package weight, lb (entered, from dims × density, or from rate ÷ ppm) */
    pieceWeightLb: number | null
    pieceWeightSource: PieceWeightSource
    /** Weight of bulk product one package holds at the given fill, lb (dims × density × fill) */
    pkgCapacityLb: number | null
    /** Packages per minute (entered or derived) */
    ppm: number | null
    /** Packages per hour */
    packagesPerHour: number | null
    /** Center-to-center package pitch on the belt, inches (needs speed + ppm) */
    pitchIn: number | null
    /** Packages per foot of belt */
    piecesPerFt: number | null
    /** Required packager speed as % of its rated/theoretical max (needs ratedPackagerPpm) */
    packagerUtilizationPct: number | null
    /** Set when entered throughput, package weight, and PPM disagree by >5% */
    consistencyWarning: string | null

    // ── Bulk only (null for packages) ──
    /** Volumetric rate at loose density, ft³/hr */
    ft3PerHr: number | null
    /** What the stated bed (width − margins) × depth carries at belt speed, lb/hr */
    bedCapacityLbHr: number | null
    /** Demanded rate as % of bed capacity */
    bedUtilizationPct: number | null
    /** Bed depth that would carry the demanded rate at belt speed, in */
    bedDepthNeededIn: number | null
}

const IN3_PER_FT3 = 1728

/** Loose product: rate by weight or volume, lb/ft at speed, and the bed-capacity check */
function calculateBulkLoad(input: BeltLoadInput): BeltLoadResult | null {
    const speed = input.beltSpeedFpm && input.beltSpeedFpm > 0 ? input.beltSpeedFpm : null
    const density = input.looseDensityLbFt3 && input.looseDensityLbFt3 > 0 ? input.looseDensityLbFt3 : null

    // Throughput priority: entered lb/hr > ft³/hr × loose density > lb/day ÷ operating hours
    let thr = input.throughputLbHr && input.throughputLbHr > 0 ? input.throughputLbHr : null
    let throughputSource: ThroughputSource = 'entered'
    if (thr === null && input.throughputFt3Hr && input.throughputFt3Hr > 0 && density !== null) {
        thr = input.throughputFt3Hr * density
        throughputSource = 'volume'
    }
    if (thr === null && input.throughputLbPerDay && input.throughputLbPerDay > 0) {
        const hrs = input.operatingHrsPerDay && input.operatingHrsPerDay > 0 ? Math.min(input.operatingHrsPerDay, 24) : 24
        thr = input.throughputLbPerDay / hrs
        throughputSource = 'per-day'
    }
    if (thr === null) return null

    const lbPerMin = thr / 60
    const lbPerFt = speed !== null ? thr / (speed * 60) : null
    const ft3PerHr = density !== null ? thr / density : null

    // Bed capacity: usable width × depth is the cross-section the belt can present at speed
    const width = input.beltWidthIn && input.beltWidthIn > 0 ? input.beltWidthIn : null
    const depth = input.bedDepthIn && input.bedDepthIn > 0 ? input.bedDepthIn : null
    const margin = input.edgeMarginIn ?? 1
    const usableWidthIn = width !== null ? Math.max(width - 2 * Math.max(margin, 0), 0) : null
    let bedCapacityLbHr: number | null = null
    let bedUtilizationPct: number | null = null
    let bedDepthNeededIn: number | null = null
    if (density !== null && speed !== null && usableWidthIn !== null && usableWidthIn > 0) {
        const perFtPerInDepth = density * (usableWidthIn / 144)   // lb/ft of belt per inch of bed depth
        bedDepthNeededIn = lbPerFt !== null ? lbPerFt / perFtPerInDepth : null
        if (depth !== null) {
            bedCapacityLbHr = perFtPerInDepth * depth * speed * 60
            bedUtilizationPct = (thr / bedCapacityLbHr) * 100
        }
    }

    return {
        productType: 'bulk',
        throughputLbHr: thr,
        throughputSource,
        throughputDerived: throughputSource !== 'entered',
        lbPerMin,
        lbPerFt,
        pieceWeightLb: null,
        pieceWeightSource: null,
        pkgCapacityLb: null,
        ppm: null,
        packagesPerHour: null,
        pitchIn: null,
        piecesPerFt: null,
        packagerUtilizationPct: null,
        consistencyWarning: null,
        ft3PerHr,
        bedCapacityLbHr,
        bedUtilizationPct,
        bedDepthNeededIn,
    }
}

export function calculateBeltLoad(input: BeltLoadInput): BeltLoadResult | null {
    if (input.productType === 'bulk') return calculateBulkLoad(input)
    const speed = input.beltSpeedFpm && input.beltSpeedFpm > 0 ? input.beltSpeedFpm : null
    const wIn = input.pieceWeightLb && input.pieceWeightLb > 0 ? input.pieceWeightLb : null
    const ppmIn = input.ppm && input.ppm > 0 ? input.ppm : null

    // Package fill: settled density × fixed box volume × fill -> weight per package
    const density = input.settledDensityLbFt3 && input.settledDensityLbFt3 > 0 ? input.settledDensityLbFt3 : null
    const fill = input.fillFraction && input.fillFraction > 0 ? Math.min(input.fillFraction, 1) : 1
    const dimsIn3 = (input.pkgLengthIn && input.pkgWidthIn && input.pkgHeightIn
        && input.pkgLengthIn > 0 && input.pkgWidthIn > 0 && input.pkgHeightIn > 0)
        ? input.pkgLengthIn * input.pkgWidthIn * input.pkgHeightIn
        : null
    const pkgCapacityLb = density !== null && dimsIn3 !== null
        ? density * (dimsIn3 / IN3_PER_FT3) * fill
        : null

    // Throughput priority: entered lb/hr > lb/day ÷ operating hours > piece pair
    let thr = input.throughputLbHr && input.throughputLbHr > 0 ? input.throughputLbHr : null
    let throughputSource: ThroughputSource = 'entered'
    if (thr === null && input.throughputLbPerDay && input.throughputLbPerDay > 0) {
        const hrs = input.operatingHrsPerDay && input.operatingHrsPerDay > 0
            ? Math.min(input.operatingHrsPerDay, 24)
            : 24
        thr = input.throughputLbPerDay / hrs
        throughputSource = 'per-day'
    }
    // Effective piece weight available before the piece-pair fallback
    const wEffective = wIn ?? pkgCapacityLb
    if (thr === null && wEffective !== null && ppmIn !== null) {
        thr = ppmIn * wEffective * 60
        throughputSource = 'pieces'
    }
    if (thr === null) return null

    const lbPerMin = thr / 60

    // Piece weight priority: entered > dims × density > rate ÷ ppm
    let pieceWeightLb: number | null
    let pieceWeightSource: PieceWeightSource
    if (wIn !== null) {
        pieceWeightLb = wIn
        pieceWeightSource = 'entered'
    } else if (pkgCapacityLb !== null) {
        pieceWeightLb = pkgCapacityLb
        pieceWeightSource = 'dims'
    } else if (ppmIn !== null) {
        pieceWeightLb = lbPerMin / ppmIn
        pieceWeightSource = 'rate'
    } else {
        pieceWeightLb = null
        pieceWeightSource = null
    }

    const ppm = ppmIn ?? (pieceWeightLb !== null && pieceWeightLb > 0 ? lbPerMin / pieceWeightLb : null)
    const packagesPerHour = ppm !== null ? ppm * 60 : null

    // The intake question: can the bagger keep up with the process?
    const rated = input.ratedPackagerPpm && input.ratedPackagerPpm > 0 ? input.ratedPackagerPpm : null
    const packagerUtilizationPct = rated !== null && ppm !== null ? (ppm / rated) * 100 : null

    const lbPerFt = speed !== null ? thr / (speed * 60) : null
    const pitchIn = speed !== null && ppm !== null && ppm > 0 ? (speed * 12) / ppm : null
    const piecesPerFt = pitchIn !== null && pitchIn > 0 ? 12 / pitchIn : null

    // Over-determined check: entered rate + weight + PPM must agree
    let consistencyWarning: string | null = null
    if (throughputSource === 'entered' && wEffective !== null && ppmIn !== null) {
        const impliedThr = ppmIn * wEffective * 60
        const err = Math.abs(impliedThr - thr) / thr
        if (err > 0.05) {
            consistencyWarning =
                `${ppmIn.toFixed(1)} pkg/min × ${wEffective.toFixed(2)} lb implies ${impliedThr.toFixed(0)} lb/hr, ` +
                `but throughput is ${thr.toFixed(0)} lb/hr (${(err * 100).toFixed(0)}% off) — one of the three is wrong.`
        }
    }

    return {
        productType: 'packages',
        throughputLbHr: thr,
        throughputSource,
        throughputDerived: throughputSource !== 'entered',
        lbPerMin,
        lbPerFt,
        pieceWeightLb,
        pieceWeightSource,
        pkgCapacityLb,
        ppm,
        packagesPerHour,
        pitchIn,
        piecesPerFt,
        packagerUtilizationPct,
        consistencyWarning,
        ft3PerHr: null,
        bedCapacityLbHr: null,
        bedUtilizationPct: null,
        bedDepthNeededIn: null,
    }
}
