import { describe, it, expect } from 'vitest'
import { accumulatedPitchIn, lengthForTime, timeForLength, zonesForLength, fillTimeSeconds } from './accumulation'

describe('accumulation buffer sizing', () => {
    it('40 ppm, 12 in product closed up, 30 s → 20 products, 20 ft (the page example)', () => {
        const r = lengthForTime(40, accumulatedPitchIn(12, 0), 30)!
        expect(r.products).toBe(20)
        expect(r.lengthFt).toBeCloseTo(20, 9)
    })
    it('rounds products up so the buffer is never short', () => {
        expect(lengthForTime(33, 12, 30)!.products).toBe(17)   // 16.5 → 17
    })
    it('time for a length rounds products down', () => {
        const r = timeForLength(240, 12, 40)!
        expect(r.products).toBe(20)
        expect(r.seconds).toBeCloseTo(30, 9)
        expect(timeForLength(250, 12, 40)!.products).toBe(20)
    })
    it('minimum gap adds to the accumulated pitch', () => {
        expect(accumulatedPitchIn(12, 2)).toBe(14)
        expect(lengthForTime(40, 14, 30)!.lengthFt).toBeCloseTo(280 / 12, 9)
    })
    it('zones and fill time', () => {
        expect(zonesForLength(240, 24)).toBe(10)
        expect(zonesForLength(250, 24)).toBe(11)
        expect(fillTimeSeconds(240, 60)).toBeCloseTo(20, 9)
    })
    it('returns null on missing inputs', () => {
        expect(lengthForTime(0, 12, 30)).toBeNull()
        expect(timeForLength(240, 0, 40)).toBeNull()
        expect(zonesForLength(0, 24)).toBeNull()
    })
})
