/**
 * Line Throughput card state — the persisted shape, its migration from the
 * pre-rebuild card, and the solve over it. Shared by the card and by the
 * pull adapters (lib/handoffs) that read another card's stored state.
 * @module lib/calculators/lineThroughputState
 */
import {
    solveThroughput, toLbPerMin,
    RATE_UNITS, PACKAGE_FIELDS, BULK_FIELDS,
    type Field, type Entries, type RateUnit, type SolveOutput,
} from './lineThroughput'
import type { LoadProductType } from './loadDefinition'

export interface CardState {
    mode: LoadProductType
    /** What the user typed, per entered field (throughput in rateUnit) */
    raw: Partial<Record<Field, string>>
    /** Entry order per entered field: higher = more recent */
    seq: Partial<Record<Field, number>>
    /** Fields the user locked: the solver never releases them */
    locked: Partial<Record<Field, boolean>>
    nextSeq: number
    rateUnit: RateUnit
    /** Production hours per day (or per shift) for per-day / per-shift rates */
    hours: string
    /** Packager nameplate rate, pkg/min (headroom check) */
    nameplate: string
    /** Package Fill: bulk product settled into a fixed box → package weight */
    fill: { density: string; l: string; w: string; h: string; fillPct: string }
    /** raw.weight was written by the Package Fill box, not typed */
    weightFromBox: boolean
    /** The user has entered a line throughput at some point (survives a release) — shows the headroom check */
    throughputEntered: boolean
    /** Bulk extras that ride along to Belt Pull */
    repose: string
    edgeMargin: string
    /** Bulk: deepest bed the belt can carry (side guard / flight height), in — optional utilization check */
    maxDepth: string
}

export const emptyState: CardState = {
    mode: 'packages', raw: {}, seq: {}, locked: {}, nextSeq: 1, rateUnit: 'lb/hr', hours: '16', nameplate: '',
    fill: { density: '', l: '', w: '', h: '', fillPct: '100' }, weightFromBox: false, throughputEntered: false, repose: '35', edgeMargin: '1', maxDepth: '',
}

export const num = (s: string | number | null | undefined): number | null => {
    if (s === null || s === undefined) return null
    const n = typeof s === 'number' ? s : parseFloat(s)
    return Number.isFinite(n) ? n : null
}

export const defaultHours = (unit: RateUnit) => (unit === 'lb/shift' ? '8' : '16')
export const modeFields = (mode: LoadProductType): readonly Field[] => (mode === 'bulk' ? BULK_FIELDS : PACKAGE_FIELDS)

/** Restore the persisted card, including the pre-rebuild "Belt Load / Throughput" shape */
export function restore(json: string | null): CardState {
    if (!json) return emptyState
    try {
        const v = JSON.parse(json)
        if (!v || typeof v !== 'object') return emptyState
        if (v.raw && typeof v.raw === 'object') {
            return {
                ...emptyState, ...v,
                raw: { ...v.raw }, seq: { ...v.seq }, locked: { ...(v.locked ?? {}) },
                fill: { ...emptyState.fill, ...(v.fill ?? {}) },
                rateUnit: (RATE_UNITS as readonly string[]).includes(v.rateUnit) ? v.rateUnit : 'lb/hr',
            }
        }
        const s: CardState = { ...emptyState, raw: {}, seq: {}, locked: {}, fill: { ...emptyState.fill } }
        s.mode = v.productType === 'bulk' ? 'bulk' : 'packages'
        s.rateUnit = v.rateUnit === 'day' ? 'lb/day' : 'lb/hr'
        s.hours = String(v.hrsPerDay || '16')
        s.nameplate = String(v.ratedPpm ?? '')
        s.fill = { density: String(v.density ?? ''), l: String(v.pkgL ?? ''), w: String(v.pkgW ?? ''), h: String(v.pkgH ?? ''), fillPct: String(v.fillPct ?? '100') }
        s.repose = String(v.repose ?? '35')
        s.edgeMargin = String(v.edgeMargin ?? '1')
        const legacy: [Field, unknown][] = [
            ['throughput', v.rateUnit === 'ft3hr' ? '' : v.throughput], ['weight', v.pieceWeight], ['ppm', v.ppm],
            ['speed', v.speed], ['density', v.looseDensity], ['width', v.beltWidth], ['depth', v.bedDepth],
        ]
        let seq = 1
        for (const [f, val] of legacy) if (val !== undefined && val !== null && String(val).trim() !== '') { s.raw[f] = String(val); s.seq[f] = seq++ }
        s.nextSeq = seq
        s.throughputEntered = s.raw.throughput !== undefined
        return s
    } catch {
        return emptyState
    }
}

export function buildEntries(s: CardState): { entries: Entries; hoursMissing: boolean } {
    const entries: Entries = {}
    const hours = num(s.hours)
    let hoursMissing = false
    for (const f of modeFields(s.mode)) {
        const v = num(s.raw[f])
        if (v === null) continue
        if (f === 'throughput') {
            const lbMin = toLbPerMin(v, s.rateUnit, hours)
            if (lbMin === null) { hoursMissing = true; continue }
            entries.throughput = { value: lbMin, seq: s.seq.throughput ?? 0, locked: !!s.locked.throughput }
        } else {
            entries[f] = { value: v, seq: s.seq[f] ?? 0, source: f === 'weight' && s.weightFromBox ? 'fill' : 'entered', locked: !!s.locked[f] }
        }
    }
    return { entries, hoursMissing }
}

export function runSolve(s: CardState, justEdited: Field | null): SolveOutput {
    return solveThroughput(s.mode, buildEntries(s).entries, { edgeMarginIn: num(s.edgeMargin) ?? 1, justEdited, maxBedDepthIn: num(s.maxDepth) })
}

export function dropEntered(s: CardState, fields: Field[]): CardState {
    const raw = { ...s.raw }
    const seq = { ...s.seq }
    const locked = { ...s.locked }
    let weightFromBox = s.weightFromBox
    for (const f of fields) {
        delete raw[f]
        delete seq[f]
        delete locked[f]
        if (f === 'weight') weightFromBox = false
    }
    return { ...s, raw, seq, locked, weightFromBox }
}

