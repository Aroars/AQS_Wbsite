import { describe, it, expect } from 'vitest'
import { downtimeCost } from './downtime'

describe('line downtime cost', () => {
    const base = { unitsPerMinute: 60, marginPerUnit: 0.5, crewSize: 4, laborRatePerHour: 25, overheadPerHour: 200, downtimeMinutesPerShift: 30, shiftsPerDay: 2, daysPerYear: 250 }
    it('$30 margin + $1.67 labor + $3.33 overhead = $35 a minute; 15,000 min/yr = $525,000', () => {
        const r = downtimeCost(base)!
        expect(r.lostMarginPerMin).toBeCloseTo(30, 9)
        expect(r.laborPerMin).toBeCloseTo(100 / 60, 9)
        expect(r.overheadPerMin).toBeCloseTo(200 / 60, 9)
        expect(r.costPerMinute).toBeCloseTo(35, 9)
        expect(r.minutesPerYear).toBe(15000)
        expect(r.perYear).toBeCloseTo(525000, 6)
        expect(r.perShift).toBeCloseTo(1050, 9)
        expect(r.savingsPerYear).toBeCloseTo(131250, 6)   // default 25 % reduction
    })
    it('reduction percentage and availability point', () => {
        const r = downtimeCost({ ...base, reductionPct: 40 })!
        expect(r.savingsPerYear).toBeCloseTo(210000, 6)
        expect(r.perAvailabilityPoint).toBeCloseTo(35 * 480 * 2 * 250 * 0.01, 6)
    })
    it('overhead is optional', () => {
        expect(downtimeCost({ ...base, overheadPerHour: null })!.costPerMinute).toBeCloseTo(30 + 100 / 60, 9)
    })
    it('rejects a zero shift count', () => {
        expect(downtimeCost({ ...base, shiftsPerDay: 0 })).toBeNull()
    })
})
