/**
 * Infeed card helpers — the head of the flow chain, shared by the Conveyor
 * Speed calculator and the Line Flow Simulator.
 * @module lib/calculators/infeedCard
 *
 * The infeed is card 0 of the persisted `conveyorCards` chain. Both tools edit
 * that one card, so numbers entered in either place show up in the other.
 * `solveFor` names the variable the engine derives (belt speed by default);
 * its input is held at null so calculateInfeed solves it from the rest.
 */

import { createCard, fromBase, toBase, unitTypes } from '@/toolbox/data/conveyorCardTypes'
import { recalculateFromCard } from './conveyorFlow'

export type SolveFor = 'speed' | 'rate' | 'gap'
export const SOLVE_KEY: Record<SolveFor, string> = { speed: 'productSpeed', rate: 'productRate', gap: 'productGap' }
export const SOLVE_LABEL: Record<SolveFor, string> = { speed: 'Belt speed', rate: 'Rate', gap: 'Gap' }

/** Runtime shape produced by createCard() / recalculateFromCard() */
export interface FlowCard {
    id: string
    type: string
    inputs: Record<string, number | string | null>
    units: Record<string, string>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    outputs?: Record<string, any>
    order?: number
}

type InputPatch = Record<string, number | string | null>

/** Recalculate the chain from the infeed with a patch applied to its inputs and/or units */
export function patchInfeed(cards: FlowCard[], inputs: InputPatch = {}, units: Record<string, string> = {}): FlowCard[] {
    const base = cards.length > 0 && cards[0].type === 'infeed'
        ? cards
        : [createCard('infeed', 0) as FlowCard, ...cards.filter((c) => c.type !== 'infeed')]
    const list = base.map((c) => ({ ...c }))
    list[0] = { ...list[0], inputs: { ...list[0].inputs, ...inputs }, units: { ...list[0].units, ...units } }
    return [...recalculateFromCard(list, 0)]
}

/**
 * Cards with an infeed at index 0 and a solve-for target. Returns the same array
 * when nothing needs doing. A pre-solve-for card infers its target from what is
 * empty (speed, then rate, then gap) and pins it.
 */
export function ensureInfeed(cards: FlowCard[]): FlowCard[] {
    if (cards.length === 0 || cards[0].type !== 'infeed') return patchInfeed(cards, { solveFor: 'speed' })
    const head = cards[0]
    if (head.inputs.solveFor === 'speed' || head.inputs.solveFor === 'rate' || head.inputs.solveFor === 'gap') return cards
    const inferred: SolveFor = head.inputs.productSpeed == null ? 'speed' : head.inputs.productRate == null ? 'rate' : 'gap'
    return patchInfeed(cards, { solveFor: inferred, [SOLVE_KEY[inferred]]: null })
}

export interface InfeedReading {
    pristine: boolean
    feasibility: 'ok' | 'warning' | 'error'
    issues: string[]
    speedFpm: number | null
    ppm: number | null
    lengthIn: number | null
    /** Unclamped: negative when the speed cannot carry the rate at this length */
    gapIn: number | null
    weightLb: number | null
    pitchIn: number | null
    productsPerFt: number | null
    gapTimeS: number | null
    /** Package weight × products per foot — the Belt Pull input */
    lbPerFt: number | null
    throughputLbHr: number | null
    /** Conveyor length ÷ belt speed, s (needs the optional conveyor length) */
    transitS: number | null
    /** A solve-for target's value in the card's own unit for that field */
    display: (target: SolveFor) => number | null
}

const empty: InfeedReading = {
    pristine: true, feasibility: 'ok', issues: [],
    speedFpm: null, ppm: null, lengthIn: null, gapIn: null, weightLb: null, pitchIn: null, productsPerFt: null,
    gapTimeS: null, lbPerFt: null, throughputLbHr: null, transitS: null, display: () => null,
}

const asNum = (v: unknown): number | null => (typeof v === 'number' && Number.isFinite(v) ? v : null)

/** Everything the two tools show, read from the engine's base-unit outputs */
export function readInfeed(card: FlowCard | null | undefined): InfeedReading {
    if (!card || !card.outputs) return empty
    const o = card.outputs
    const issues: string[] = Array.isArray(o.issues) ? o.issues : []
    const feasibility = (o.feasibility === 'error' || o.feasibility === 'warning' ? o.feasibility : 'ok') as InfeedReading['feasibility']
    if (o.pristine) return { ...empty, issues, feasibility }
    const speedMs = asNum(o.productSpeed)
    const ppm = asNum(o.ppm)
    if (speedMs === null || speedMs <= 0 || ppm === null || ppm <= 0) return { ...empty, pristine: false, issues, feasibility }

    const speedFpm = fromBase(speedMs, 'ft/min', 'speed') as number
    const lengthIn = fromBase(asNum(o.productLength) ?? 0, 'in', 'length') as number
    const solveFor = (card.inputs.solveFor as SolveFor) || 'speed'
    // Solving for gap: the engine clamps its output at zero; show the real number
    const gapIn = solveFor === 'gap'
        ? (speedFpm * 12) / ppm - lengthIn
        : (fromBase(asNum(o.productGap) ?? 0, 'in', 'length') as number)
    const pitchIn = lengthIn + gapIn
    const productsPerFt = pitchIn > 0 ? 12 / pitchIn : null
    const weightKg = asNum(o.productWeight)
    const weightLb = weightKg !== null && weightKg > 0 ? (fromBase(weightKg, 'lb', 'weight') as number) : null
    const lbPerFt = weightLb !== null && productsPerFt !== null ? weightLb * productsPerFt : null
    const throughputLbHr = weightLb !== null ? ppm * weightLb * 60 : null
    const lenVal = asNum(card.inputs.conveyorLength)
    const lenM = lenVal !== null && lenVal > 0 ? (toBase(lenVal, card.units.conveyorLength ?? 'ft', 'length') as number) : null
    const transitS = lenM !== null ? lenM / speedMs : null

    const display = (target: SolveFor): number | null => {
        if (target === 'speed') return fromBase(speedMs, card.units.productSpeed ?? unitTypes.speed.default, 'speed') as number
        if (target === 'rate') return fromBase(ppm, card.units.productRate ?? unitTypes.rate.default, 'rate') as number
        const gapM = toBase(gapIn, 'in', 'length') as number
        return fromBase(gapM, card.units.productGap ?? unitTypes.length.default, 'length') as number
    }

    return {
        pristine: false, feasibility, issues,
        speedFpm, ppm, lengthIn, gapIn, weightLb, pitchIn, productsPerFt,
        gapTimeS: asNum(o.gapTimeAvailable), lbPerFt, throughputLbHr, transitS, display,
    }
}

/**
 * Switch the solved variable. The old target keeps its computed value as an
 * entry (in its own unit) so nothing vanishes; the new target is released to
 * the engine.
 */
export function changeSolveFor(cards: FlowCard[], next: SolveFor): FlowCard[] {
    const head = cards[0]
    if (!head || head.type !== 'infeed') return patchInfeed(cards, { solveFor: next })
    const prev = ((head.inputs.solveFor as SolveFor) || 'speed')
    if (prev === next) return cards
    const patch: InputPatch = { solveFor: next, [SOLVE_KEY[next]]: null }
    const prevValue = readInfeed(head).display(prev)
    if (prevValue !== null && Number.isFinite(prevValue)) patch[SOLVE_KEY[prev]] = Number(prevValue.toPrecision(6))
    return patchInfeed(cards, patch)
}

/**
 * Change one input's unit and convert its value so the quantity is unchanged
 * (100 ft/min becomes 1.667 ft/s, never 100 ft/s). Toolbox rule: unit toggles
 * convert, never clear, never reinterpret.
 */
export function changeInfeedUnit(cards: FlowCard[], inputKey: string, unitType: string, nextUnit: string, displayedDefault?: string): FlowCard[] {
    const head = cards[0]
    const prevUnit = head?.units[inputKey] ?? displayedDefault ?? unitTypes[unitType].default
    const raw = head?.inputs[inputKey]
    const inputs: InputPatch = {}
    if (typeof raw === 'number' && Number.isFinite(raw) && prevUnit !== nextUnit) {
        const base = toBase(raw, prevUnit, unitType) as number
        inputs[inputKey] = Number((fromBase(base, nextUnit, unitType) as number).toPrecision(6))
    }
    return patchInfeed(cards, inputs, { [inputKey]: nextUnit })
}

/** Convert a value between two units of one type, for cards that hold their own inputs */
export function convertUnit(value: number, unitType: string, fromUnit: string, toUnit: string): number {
    if (fromUnit === toUnit) return value
    return Number((fromBase(toBase(value, fromUnit, unitType) as number, toUnit, unitType) as number).toPrecision(6))
}

/** Belt speed from a drive: ft/min = π × pulley diameter (in) × RPM / 12 */
export function rpmToFpm(rpm: number, pulleyDiaIn: number): number {
    return (Math.PI * pulleyDiaIn * rpm) / 12
}
