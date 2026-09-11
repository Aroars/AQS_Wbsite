/**
 * Line Throughput solver — pure calculation module
 * @module lib/calculators/lineThroughput
 *
 * The constraint network behind the "Line Throughput → Belt Load" card. The
 * user enters whatever the plant told them; every relation left with exactly
 * one unknown solves it, continuously, and the solved values feed the next
 * relation until nothing more can be derived.
 *
 * Entry order decides what gives way. When a relation is over-determined and
 * its values disagree, the OLDEST user-entered field among everything that
 * relation rests on — its entered values and the entries behind its solved
 * ones — is released and re-derived from the others. One entry per
 * disagreement. The field being edited is never released, and nothing is ever
 * cleared.
 *
 * Relations (belt load lb/ft is a field of its own, so it can be typed or solved)
 *   rate   throughput (lb/min) = packages/min × package weight (lb)        both modes
 *   load   throughput (lb/min) = belt load (lb/ft) × belt speed (ft/min)   both modes
 *   speed  belt speed (ft/min) = packages/min × pitch (in) / 12            packages
 *   pitch  belt load (lb/ft)   = 12 × package weight ÷ pitch               packages
 *   bed    belt load (lb/ft)   = density × (depth / 12) × (usable width / 12)   bulk
 *          usable width = belt width − 2 × edge margin; products per foot = 12 / pitch
 * In Bulk the rate relation is the downstream packager: bags per minute at a
 * bag weight back into lb/hr, or lb/hr and a bag weight give the bagger rate.
 * An optional maximum bed depth (side guard, flight height) turns the solved
 * depth into a utilization check.
 *
 * Solver units: lb/min, lb, pkg/min, inches, ft/min, lb/ft³. The card converts
 * the plant's quoted units (lb/hr, lb/day, kg/hr …) with the helpers below.
 */

import type { LoadProductType } from './loadDefinition'

export type Field = 'throughput' | 'weight' | 'ppm' | 'length' | 'gap' | 'speed' | 'density' | 'depth' | 'width' | 'lbft'

export const PACKAGE_FIELDS: readonly Field[] = ['throughput', 'weight', 'ppm', 'length', 'gap', 'speed', 'lbft']
export const BULK_FIELDS: readonly Field[] = ['throughput', 'density', 'depth', 'width', 'speed', 'lbft', 'ppm', 'weight']

export const FIELD_LABEL: Record<Field, string> = {
    throughput: 'line throughput',
    weight: 'package weight',
    ppm: 'packages/min',
    length: 'product length',
    gap: 'gap',
    speed: 'belt speed',
    density: 'bulk density',
    depth: 'bed depth',
    width: 'belt width',
    lbft: 'belt load',
}

/** 'fill' = package weight derived from the Package Fill box; it yields before any typed value */
export type EntrySource = 'entered' | 'fill'
export interface Entry {
    value: number
    /** Entry order: higher = more recent. The fill-derived weight uses -1 so it is released first. */
    seq: number
    source?: EntrySource
}
export type Entries = Partial<Record<Field, Entry>>

export type ValueSource = 'entered' | 'fill' | 'solved'
export interface FieldValue {
    value: number
    source: ValueSource
}

export type RelationId = 'rate' | 'load' | 'speed' | 'pitch' | 'bed'

export interface SolveOptions {
    /** Unusable belt edge per side, in (bulk); default 1 */
    edgeMarginIn?: number
    /** The field the user is typing in — never released by the consistency rule */
    justEdited?: Field | null
    /** Bulk: the deepest bed the belt can carry (side guard or flight height), in — enables the utilization check */
    maxBedDepthIn?: number | null
}

export interface DerivedValues {
    lbPerMin: number | null
    lbPerHr: number | null
    /** Package pitch, in (packages) */
    pitchIn: number | null
    productsPerFt: number | null
    /** Product weight per foot of belt — the Belt Pull input */
    lbPerFt: number | null
    /** Bulk: lb/ft the bed carries at the maximum bed depth (needs density, width, and a max depth) */
    bedLbPerFt: number | null
    /** Bulk: solved or entered bed depth as % of the maximum bed depth */
    bedUtilizationPct: number | null
}

export interface SolveOutput {
    mode: LoadProductType
    values: Partial<Record<Field, FieldValue>>
    /** Fields released from entered to solved by the consistency rule during this solve */
    released: Field[]
    /** A relation disagreed and had no entered field to release */
    conflict: RelationId | null
    /** Needed-state helper text per empty field */
    hints: Partial<Record<Field, string>>
    warnings: string[]
    derived: DerivedValues
}

type Known = Partial<Record<Field, number>>

interface Relation {
    id: RelationId
    vars: readonly Field[]
    solve: (unknown: Field, v: Known) => number
    /** Relative disagreement of the entered values (0 = exact) */
    residual: (v: Known) => number
}

/** Entered values that disagree by less than this are treated as consistent (rounded re-entry of a solved value) */
export const CONSISTENCY_TOL = 0.005

const relErr = (a: number, b: number) => Math.abs(a - b) / Math.max(Math.abs(b), 1e-9)
const finite = (n: number) => Number.isFinite(n)

const rateRelation: Relation = {
    id: 'rate',
    vars: ['throughput', 'ppm', 'weight'],
    solve: (u, v) => {
        if (u === 'throughput') return v.ppm! * v.weight!
        if (u === 'ppm') return v.throughput! / v.weight!
        return v.throughput! / v.ppm!
    },
    residual: (v) => relErr(v.ppm! * v.weight!, v.throughput!),
}

const loadRelation: Relation = {
    id: 'load',
    vars: ['throughput', 'lbft', 'speed'],
    solve: (u, v) => {
        if (u === 'throughput') return v.lbft! * v.speed!
        if (u === 'lbft') return v.throughput! / v.speed!
        return v.throughput! / v.lbft!
    },
    residual: (v) => relErr(v.lbft! * v.speed!, v.throughput!),
}

const speedRelation: Relation = {
    id: 'speed',
    vars: ['speed', 'ppm', 'length', 'gap'],
    solve: (u, v) => {
        if (u === 'speed') return (v.ppm! * (v.length! + v.gap!)) / 12
        if (u === 'ppm') return (v.speed! * 12) / (v.length! + v.gap!)
        if (u === 'length') return (v.speed! * 12) / v.ppm! - v.gap!
        return (v.speed! * 12) / v.ppm! - v.length!
    },
    residual: (v) => relErr((v.ppm! * (v.length! + v.gap!)) / 12, v.speed!),
}

/** lb/ft from the package alone: one package weight every pitch — no rate needed */
const pitchRelation: Relation = {
    id: 'pitch',
    vars: ['lbft', 'weight', 'length', 'gap'],
    solve: (u, v) => {
        if (u === 'lbft') return (12 * v.weight!) / (v.length! + v.gap!)
        if (u === 'weight') return (v.lbft! * (v.length! + v.gap!)) / 12
        if (u === 'length') return (12 * v.weight!) / v.lbft! - v.gap!
        return (12 * v.weight!) / v.lbft! - v.length!
    },
    residual: (v) => relErr((12 * v.weight!) / (v.length! + v.gap!), v.lbft!),
}

/** Bed cross-section the belt presents to the flow, lb per foot of belt */
export function bedLbPerFt(densityLbFt3: number, depthIn: number, widthIn: number, edgeMarginIn: number): number {
    const usable = Math.max(widthIn - 2 * Math.max(edgeMarginIn, 0), 0)
    return (densityLbFt3 * depthIn * usable) / 144
}

function bedRelation(marginIn: number): Relation {
    const usable = (w: number) => Math.max(w - 2 * Math.max(marginIn, 0), 0)
    return {
        id: 'bed',
        vars: ['lbft', 'density', 'depth', 'width'],
        solve: (u, v) => {
            if (u === 'lbft') return bedLbPerFt(v.density!, v.depth!, v.width!, marginIn)
            if (u === 'density') return (v.lbft! * 144) / (v.depth! * usable(v.width!))
            if (u === 'depth') return (v.lbft! * 144) / (v.density! * usable(v.width!))
            return (v.lbft! * 144) / (v.density! * v.depth!) + 2 * Math.max(marginIn, 0)
        },
        residual: (v) => relErr(bedLbPerFt(v.density!, v.depth!, v.width!, marginIn), v.lbft!),
    }
}

function numeric(values: Partial<Record<Field, FieldValue>>): Known {
    const out: Known = {}
    for (const [k, v] of Object.entries(values)) if (v) out[k as Field] = v.value
    return out
}

/**
 * Solve the network for one mode. Runs the fixed-point pass; if a 'release'
 * relation is over-determined and inconsistent, drops its oldest entered field
 * and starts over, so the returned values are always mutually consistent.
 */
export function solveThroughput(mode: LoadProductType, entries: Entries, opts: SolveOptions = {}): SolveOutput {
    const fields = mode === 'bulk' ? BULK_FIELDS : PACKAGE_FIELDS
    const relations = mode === 'bulk' ? [rateRelation, loadRelation, bedRelation(opts.edgeMarginIn ?? 1)] : [rateRelation, speedRelation, loadRelation, pitchRelation]
    const entered: Entries = {}
    for (const f of fields) {
        const e = entries[f]
        if (e && Number.isFinite(e.value) && (e.value > 0 || (f === 'gap' && e.value >= 0))) entered[f] = e
    }

    const released: Field[] = []
    let conflict: RelationId | null = null
    let values: Partial<Record<Field, FieldValue>> = {}

    for (let guard = 0; guard <= fields.length; guard++) {
        values = {}
        conflict = null
        // Provenance: the entered fields each value rests on (an entered field rests on itself)
        const deps: Partial<Record<Field, Set<Field>>> = {}
        for (const [f, e] of Object.entries(entered) as [Field, Entry][]) {
            values[f] = { value: e.value, source: e.source ?? 'entered' }
            deps[f] = new Set([f])
        }

        let releaseTarget: Field | null = null
        let progress = true
        while (progress && !releaseTarget) {
            progress = false
            for (const rel of relations) {
                const unknown = rel.vars.filter((v) => values[v] === undefined)
                if (unknown.length === 1) {
                    const val = rel.solve(unknown[0], numeric(values))
                    if (finite(val)) {
                        values[unknown[0]] = { value: val, source: 'solved' }
                        const d = new Set<Field>()
                        for (const v of rel.vars) if (v !== unknown[0]) for (const x of deps[v] ?? []) d.add(x)
                        deps[unknown[0]] = d
                        progress = true
                    }
                } else if (unknown.length === 0 && rel.residual(numeric(values)) > CONSISTENCY_TOL) {
                    // Everything this relation rests on is a candidate — including the entries
                    // behind its solved values — so exactly one entry, the oldest, gives way.
                    const pool = new Set<Field>()
                    for (const v of rel.vars) for (const x of deps[v] ?? []) pool.add(x)
                    const candidates = [...pool].filter((v) => entered[v] && v !== opts.justEdited)
                    if (candidates.length === 0) {
                        conflict = rel.id
                    } else {
                        releaseTarget = candidates.sort((a, b) => entered[a]!.seq - entered[b]!.seq)[0]
                        break
                    }
                }
            }
        }
        if (!releaseTarget) break
        delete entered[releaseTarget]
        released.push(releaseTarget)
    }

    const known = new Set<Field>(Object.keys(values) as Field[])
    const hasAny = Object.keys(entered).length > 0
    const hints = hasAny ? relationHints(relations, known) : {}
    const derived = deriveValues(mode, numeric(values), opts.edgeMarginIn ?? 1, opts.maxBedDepthIn ?? null)
    const warnings: string[] = []
    if (mode === 'packages') {
        const gap = values.gap
        if (gap && gap.source === 'solved' && gap.value < 0) {
            warnings.push(`Belt speed is too slow for that rate at this product length — the gap comes out ${fmtNum(gap.value)} in. Raise the speed, cut the rate, or shorten the product.`)
        }
        const len = values.length
        if (len && len.source === 'solved' && len.value <= 0) {
            warnings.push('Speed, rate, and gap leave no room for the product itself — the solved product length is zero or negative.')
        }
    } else {
        const depth = values.depth
        const maxDepth = opts.maxBedDepthIn ?? null
        if (depth && maxDepth !== null && maxDepth > 0 && depth.value > maxDepth) {
            warnings.push(`The bed needs ${fmtNum(depth.value)} in of depth but the belt can carry ${fmtNum(maxDepth)} in — widen the belt, run faster, or cut the rate.`)
        }
    }
    if (conflict) warnings.push('The entered values disagree and none of them can be released. Clear one to let the solver re-derive it.')

    return { mode, values, released, conflict, hints, warnings, derived }
}

function deriveValues(mode: LoadProductType, v: Known, marginIn: number, maxDepthIn: number | null): DerivedValues {
    const lbPerMin = v.throughput ?? null
    const lbPerHr = lbPerMin !== null ? lbPerMin * 60 : null
    const lbPerFt = v.lbft ?? null
    if (mode === 'bulk') {
        const bed = v.density !== undefined && v.width !== undefined && maxDepthIn !== null && maxDepthIn > 0
            ? bedLbPerFt(v.density, maxDepthIn, v.width, marginIn)
            : null
        return {
            lbPerMin, lbPerHr,
            pitchIn: null, productsPerFt: null,
            lbPerFt,
            bedLbPerFt: bed,
            bedUtilizationPct: v.depth !== undefined && maxDepthIn !== null && maxDepthIn > 0 ? (v.depth / maxDepthIn) * 100 : null,
        }
    }
    const pitchIn = v.length !== undefined && v.gap !== undefined ? v.length + v.gap : null
    const productsPerFt = pitchIn !== null && pitchIn > 0 ? 12 / pitchIn : null
    return { lbPerMin, lbPerHr, pitchIn, productsPerFt, lbPerFt, bedLbPerFt: null, bedUtilizationPct: null }
}

const ORDINAL = ['', 'one', 'two', 'three', 'four']

/**
 * Needed-state hints: for every relation that already has a known value, each
 * empty field says how many more entries unlock it. A field in several
 * relations keeps the hint that needs the fewest entries.
 */
function relationHints(relations: Relation[], known: Set<Field>): Partial<Record<Field, string>> {
    const best: Partial<Record<Field, { need: number; text: string }>> = {}
    for (const rel of relations) {
        const unknown = rel.vars.filter((f) => !known.has(f))
        if (unknown.length < 2 || unknown.length === rel.vars.length) continue
        const need = unknown.length - 1
        for (const f of unknown) {
            const text = need === 1
                ? `Enter this to get ${unknown.filter((o) => o !== f).map((o) => FIELD_LABEL[o]).join(' and ')}`
                : `Enter ${ORDINAL[need]} of these to get the ${ORDINAL[unknown.length] === 'three' ? 'third' : 'fourth'}`
            const cur = best[f]
            if (!cur || need < cur.need) best[f] = { need, text }
        }
    }
    const h: Partial<Record<Field, string>> = {}
    for (const [f, b] of Object.entries(best)) if (b) h[f as Field] = b.text
    return h
}

// ── Quoted-rate units ──────────────────────────────────────────────────────

export type RateUnit = 'lb/hr' | 'lb/day' | 'lb/shift' | 'kg/hr' | 'kg/day'
export const RATE_UNITS: readonly RateUnit[] = ['lb/hr', 'lb/day', 'lb/shift', 'kg/hr', 'kg/day']
const LB_PER_KG = 2.20462

/** lb/day, lb/shift, and kg/day need the hours the line actually runs */
export function unitNeedsHours(unit: RateUnit): boolean {
    return unit === 'lb/day' || unit === 'lb/shift' || unit === 'kg/day'
}

export function toLbPerMin(value: number, unit: RateUnit, hours: number | null): number | null {
    const lb = unit.startsWith('kg') ? value * LB_PER_KG : value
    if (!unitNeedsHours(unit)) return lb / 60
    if (hours === null || !(hours > 0)) return null
    return lb / (hours * 60)
}

export function fromLbPerMin(lbPerMin: number, unit: RateUnit, hours: number | null): number | null {
    const factor = unit.startsWith('kg') ? 1 / LB_PER_KG : 1
    if (!unitNeedsHours(unit)) return lbPerMin * 60 * factor
    if (hours === null || !(hours > 0)) return null
    return lbPerMin * 60 * hours * factor
}

// ── Package fill: bulk product settled into a fixed box ────────────────────

/** Settled density × inside volume × fill fraction → weight per package, lb */
export function packageFillWeightLb(densityLbFt3: number | null, lengthIn: number | null, widthIn: number | null, heightIn: number | null, fillFraction: number | null): number | null {
    if (!densityLbFt3 || !lengthIn || !widthIn || !heightIn) return null
    if (densityLbFt3 <= 0 || lengthIn <= 0 || widthIn <= 0 || heightIn <= 0) return null
    const fill = fillFraction && fillFraction > 0 ? Math.min(fillFraction, 1) : 1
    return densityLbFt3 * ((lengthIn * widthIn * heightIn) / 1728) * fill
}

// ── Packager headroom ──────────────────────────────────────────────────────

export type HeadroomLevel = 'ok' | 'tight' | 'over'
export interface Headroom {
    utilizationPct: number
    level: HeadroomLevel
    message: string
}

/** Required packages/min as a share of the packager's nameplate rate */
export function packagerHeadroom(requiredPpm: number, nameplatePpm: number): Headroom | null {
    if (!(requiredPpm > 0) || !(nameplatePpm > 0)) return null
    const pct = (requiredPpm / nameplatePpm) * 100
    const level: HeadroomLevel = pct > 100 ? 'over' : pct >= 80 ? 'tight' : 'ok'
    const message = level === 'over'
        ? 'It cannot keep up — the line outruns the packager; it needs a faster machine or a second line.'
        : level === 'tight'
        ? 'Tight — nameplate leaves no allowance for changeover, jams, or downtime.'
        : 'Comfortable headroom.'
    return { utilizationPct: pct, level, message }
}

/** Round a handoff value so unit round-trips do not leak 14.99997-style noise into the next card */
export function tidy(v: number | null, decimals = 2): number | null {
    if (v === null || !Number.isFinite(v)) return null
    const f = 10 ** decimals
    return Math.round(v * f) / f
}

/** Value for an <input type="number">: six significant figures, no separators */
export function fmtInput(v: number): string {
    if (!Number.isFinite(v)) return ''
    if (v === 0) return '0'
    const short = Number(v.toPrecision(4))
    if (Math.abs(v - short) <= 1e-5 * Math.abs(v)) return String(short)
    return String(Number(v.toPrecision(6)))
}

/** Display formatting: four significant figures, trailing zeros trimmed */
export function fmtNum(v: number, sig = 4): string {
    if (!Number.isFinite(v)) return '—'
    if (v === 0) return '0'
    const abs = Math.abs(v)
    if (abs >= 1000) return Math.round(v).toLocaleString('en-US')
    return String(Number(v.toPrecision(sig)))
}
