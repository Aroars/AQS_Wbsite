/**
 * Accumulation buffer — pure calculation module
 * @module lib/calculators/accumulation
 *
 * Zero-pressure accumulation sizing, the same math as the Line Flow
 * Simulator's Accumulation card, as a standalone tool.
 *
 *   accumulated pitch = product length + minimum gap when closed up
 *   length for a buffer time = ceil(rate × seconds / 60) products × pitch
 *   time for a length        = floor(length / pitch) products ÷ rate × 60
 */

export function accumulatedPitchIn(productLengthIn: number, minGapIn: number): number {
    return Math.max(productLengthIn, 0) + Math.max(minGapIn, 0)
}

export interface LengthForTime {
    products: number
    lengthIn: number
    lengthFt: number
}

/** Conveyor length that holds `seconds` of stoppage at `ppm` */
export function lengthForTime(ppm: number, pitchIn: number, seconds: number): LengthForTime | null {
    if (!(ppm > 0) || !(pitchIn > 0) || !(seconds > 0)) return null
    const products = Math.ceil((seconds / 60) * ppm)
    const lengthIn = products * pitchIn
    return { products, lengthIn, lengthFt: lengthIn / 12 }
}

export interface TimeForLength {
    products: number
    seconds: number
}

/** Seconds of stoppage a conveyor of `lengthIn` absorbs at `ppm` */
export function timeForLength(lengthIn: number, pitchIn: number, ppm: number): TimeForLength | null {
    if (!(lengthIn > 0) || !(pitchIn > 0) || !(ppm > 0)) return null
    const products = Math.floor(lengthIn / pitchIn)
    return { products, seconds: (products / ppm) * 60 }
}

/** Zero-pressure zones needed when each zone holds one product (zone length ≥ pitch) */
export function zonesForLength(lengthIn: number, zoneLengthIn: number): number | null {
    if (!(lengthIn > 0) || !(zoneLengthIn > 0)) return null
    return Math.ceil(lengthIn / zoneLengthIn)
}

/** Time for the belt to close the buffer up from empty: length ÷ belt speed */
export function fillTimeSeconds(lengthIn: number, beltSpeedFpm: number): number | null {
    if (!(lengthIn > 0) || !(beltSpeedFpm > 0)) return null
    return (lengthIn / 12 / beltSpeedFpm) * 60
}
