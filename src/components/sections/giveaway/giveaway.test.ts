import { describe, it, expect } from 'vitest'
import { giveaway, toLb, fromLb } from './giveaway'

describe('product giveaway', () => {
    const base = { targetWeight: 500, actualWeight: 508, unit: 'g' as const, packagesPerMinute: 60, hoursPerDay: 16, daysPerYear: 250, costPerLb: 2.5 }
    it('8 g over on 500 g at 60/min, 16 h, 250 d → 14.4M packages, 254,000 lb, $635,000 a year', () => {
        const r = giveaway(base)!
        expect(r.overfillPerPkg).toBe(8)
        expect(r.overfillPct).toBeCloseTo(1.6, 9)
        expect(r.packagesPerYear).toBe(14_400_000)
        expect(r.perYearLb).toBeCloseTo(115_200_000 / 453.59237, 3)   // 253,973 lb
        expect(r.perYearCost).toBeCloseTo((115_200_000 / 453.59237) * 2.5, 3)
    })
    it('a checkweigher holding 2 g saves the difference and pays back', () => {
        const r = giveaway({ ...base, improvedOverfill: 2, systemCost: 30000 })!
        expect(r.improved!.savingsLb).toBeCloseTo(toLb(6, 'g') * 14_400_000, 4)
        expect(r.improved!.savingsCost).toBeCloseTo(toLb(6, 'g') * 14_400_000 * 2.5, 4)
        expect(r.improved!.paybackMonths).toBeCloseTo((30000 / r.improved!.savingsCost!) * 12, 9)
    })
    it('unit round trips and weight-only mode', () => {
        expect(fromLb(toLb(16, 'oz'), 'oz')).toBeCloseTo(16, 9)
        expect(toLb(1, 'kg')).toBeCloseTo(2.20462, 4)
        expect(giveaway({ ...base, costPerLb: null })!.perYearCost).toBeNull()
    })
    it('rejects incomplete input', () => {
        expect(giveaway({ ...base, targetWeight: 0 })).toBeNull()
        expect(giveaway({ ...base, packagesPerMinute: 0 })).toBeNull()
    })
})
