import { describe, it, expect } from 'vitest'
import {
    calculateWearstrip, optimizeWearstrip, solveCantileverAllowance, tempFactor,
    defaultWearstripConfig, wearstripStandards, wearstripExamples,
} from './wearstrip'

// 1.5×2 UHMW @ 18", 3 strips, 12" belt — pinned to the ORIGINAL criterion
// (50 lbf, full load on 1 cantilever strip) so the hand checks stay stable
const base = { ...defaultWearstripConfig, pointLoadLbf: 50, cantileverStrips: 1 }

describe('wearstrip beam math — hand-checked (continuous over supports)', () => {
    it('section properties: 1.5×2 gives I = 1.0 in⁴, S = 1.0 in³', () => {
        const r = calculateWearstrip(base)
        expect(r.momentOfInertiaIn4).toBeCloseTo(1.0, 9)
        expect(r.sectionModulusIn3).toBeCloseTo(1.0, 9)
    })

    it('point deflection: 25 lbf/strip @ 18" continuous = PL³/110EI = 0.01205"', () => {
        const r = calculateWearstrip(base)
        expect(r.pointPerStripLbf).toBeCloseTo(25, 9)
        expect(r.pointDeflIn).toBeCloseTo((25 * 18 ** 3) / (110 * 110000 * 1.0), 9)
        expect(r.pointCheck.pass).toBe(true)
    })

    it('distributed deflection is negligible — the review’s core insight', () => {
        const r = calculateWearstrip(base)
        expect(r.udlDeflIn).toBeLessThan(0.001)
        expect(r.udlCheck.utilizationPct).toBeLessThan(2)
        expect(r.governing).toBe('interior point-load deflection (feel)')
    })

    it('temperature knockdown scales deflection by 1/factor (140°F → 0.55)', () => {
        const cold = calculateWearstrip(base)
        const hot = calculateWearstrip({ ...base, tempF: 140 })
        expect(tempFactor(140)).toBeCloseTo(0.55, 9)
        expect(hot.pointDeflIn).toBeCloseTo(cold.pointDeflIn / 0.55, 9)
    })
})

describe('derived cantilever allowance (one solve, elastic backspan)', () => {
    it('solves the cubic exactly: tip deflection at Lc equals the class limit', () => {
        const eI = 110000 * 1.0
        const lc = solveCantileverAllowance(50, eI, 18, 0.020)
        const tip = (50 * lc ** 3) / (3 * eI) + (50 * lc ** 2 * 18) / (3 * eI)
        expect(tip).toBeCloseTo(0.020, 6)
        expect(lc).toBeGreaterThan(2.4)
        expect(lc).toBeLessThan(2.7)
    })

    it('deflection governs the overhang for the baseline (stress cap is far away)', () => {
        const r = calculateWearstrip(base)
        expect(r.overhangGovernedBy).toBe('deflection')
        expect(r.maxOverhangIn).toBeCloseTo(2.54, 1)
    })

    it('hot strips afford less overhang', () => {
        const cold = calculateWearstrip(base)
        const hot = calculateWearstrip({ ...base, tempF: 140 })
        expect(hot.maxOverhangIn).toBeLessThan(cold.maxOverhangIn)
    })

    it('required overhang beyond the allowance fails the config and flags governing', () => {
        const r = calculateWearstrip({ ...base, requiredOverhangIn: 6 })
        expect(r.overhangCheck!.pass).toBe(false)
        expect(r.passAll).toBe(false)
        expect(r.governing).toBe('end overhang (nose geometry)')
    })
})

describe('optimizer and standards', () => {
    it('returns passing configs sorted by total cost', () => {
        const out = optimizeWearstrip(base, 10)
        expect(out.length).toBeGreaterThan(0)
        for (const o of out) expect(o.result.passAll).toBe(true)
        for (let i = 1; i < out.length; i++) {
            expect(out[i].result.totalCost).toBeGreaterThanOrEqual(out[i - 1].result.totalCost)
        }
    })

    it('required overhang thins the passing set', () => {
        const loose = optimizeWearstrip(base, 50).length
        const tight = optimizeWearstrip({ ...base, requiredOverhangIn: 3 }, 50).length
        expect(tight).toBeLessThanOrEqual(loose)
    })

    it('strip count comes from the lateral belt-span rule', () => {
        const out = optimizeWearstrip({ ...base, beltWidthIn: 24 }, 5)
        expect(out[0].stripCount).toBe(Math.ceil(24 / 6) + 1) // 5
    })

    it('AQS-Heavy passes the default criteria; acetal warns', () => {
        const heavy = wearstripStandards.find((s) => s.id === 'aqs-heavy')!
        const r = calculateWearstrip({
            ...base,
            stripWidthIn: heavy.stripWidthIn, stripHeightIn: heavy.stripHeightIn,
            edgeStripWidthIn: heavy.edgeStripWidthIn, edgeStripHeightIn: heavy.edgeStripHeightIn,
            spanIn: heavy.spanMaxIn,
        })
        expect(r.passAll).toBe(true)
        const acetal = calculateWearstrip({ ...base, materialId: 'acetal' })
        expect(acetal.warnings.some((w) => w.includes('galling'))).toBe(true)
    })

    it('example fixtures all compute without failure flags on structure', () => {
        for (const ex of wearstripExamples) {
            const r = calculateWearstrip(ex.config)
            expect(Number.isFinite(r.totalCost)).toBe(true)
            expect(Number.isFinite(r.maxOverhangIn)).toBe(true)
        }
    })
})

import { solveSupportLayout } from './wearstrip'

describe('shop standard: mixed profiles + uniform 16–18" layout with ≤3" overhangs', () => {
    it('layout solver: 10 ft → 7 uniform spans, 3" overhangs, 8 supports', () => {
        const l = solveSupportLayout(120, 16, 18, 3)!
        expect(l.segments).toBe(7)
        expect(l.spanIn).toBeCloseTo((120 - 6) / 7, 6)   // 16.29" — in range
        expect(l.overhangIn).toBeCloseTo(3, 6)
        expect(l.supports).toBe(8)
        // Uniform reconstruction: overhang + n×span + overhang = length
        expect(2 * l.overhangIn + l.segments * l.spanIn).toBeCloseTo(120, 6)
    })

    it('layout spans always land in [16,18] with overhang ≤ 3 across lengths', () => {
        for (const ft of [4, 6, 8, 10, 12.5, 15, 20, 33, 50]) {
            const l = solveSupportLayout(ft * 12, 16, 18, 3)
            if (!l) continue
            expect(l.spanIn).toBeGreaterThanOrEqual(16 - 1e-9)
            expect(l.spanIn).toBeLessThanOrEqual(18 + 1e-9)
            expect(l.overhangIn).toBeGreaterThanOrEqual(-1e-9)
            expect(l.overhangIn).toBeLessThanOrEqual(3 + 1e-9)
            expect(2 * l.overhangIn + l.segments * l.spanIn).toBeCloseTo(ft * 12, 6)
        }
    })

    it('mixed-profile cost: two 1.5×2 edges + one 1×2 interior on a 3-strip bed', () => {
        const mixed = calculateWearstrip({
            ...base, stripWidthIn: 1, stripHeightIn: 2, edgeStripWidthIn: 1.5, edgeStripHeightIn: 2,
        })
        // 120" long: interior 1×2×120 = 240 in³, edges 2×(1.5×2×120) = 720 in³
        expect(mixed.plasticVolumeIn3).toBeCloseTo(240 + 720, 6)
        // Structural checks run on the INTERIOR (weaker) profile: I = 1·8/12
        expect(mixed.momentOfInertiaIn4).toBeCloseTo(8 / 12, 9)
    })

    it('structural checks use the interior profile, not the stiffer edges', () => {
        const mixed = calculateWearstrip({
            ...base, stripWidthIn: 1, stripHeightIn: 2, edgeStripWidthIn: 1.5, edgeStripHeightIn: 2,
        })
        const pureInterior = calculateWearstrip({
            ...base, stripWidthIn: 1, stripHeightIn: 2, edgeStripWidthIn: 1, edgeStripHeightIn: 2,
        })
        expect(mixed.pointDeflIn).toBeCloseTo(pureInterior.pointDeflIn, 12)
        expect(mixed.maxOverhangIn).toBeCloseTo(pureInterior.maxOverhangIn, 12)
    })

    it("at the ORIGINAL 50 lbf criterion, 3\" overhang exceeds the 1×2 allowance", () => {
        const std = calculateWearstrip({
            ...base, stripWidthIn: 1, stripHeightIn: 2, edgeStripWidthIn: 1.5, edgeStripHeightIn: 2,
            spanIn: (120 - 6) / 7, requiredOverhangIn: 3,
        })
        expect(std.maxOverhangIn).toBeLessThan(3)       // allowance ≈ 2.1–2.2"
        expect(std.overhangCheck!.pass).toBe(false)     // 3" demand > allowance at 0.020"
        // Relaxing to Economy (0.040") or sharing the press across 2 strips changes the verdict
        const shared = calculateWearstrip({
            ...base, stripWidthIn: 1, stripHeightIn: 2, edgeStripWidthIn: 1.5, edgeStripHeightIn: 2,
            spanIn: (120 - 6) / 7, requiredOverhangIn: 3, cantileverStrips: 2,
        })
        expect(shared.maxOverhangIn).toBeGreaterThan(std.maxOverhangIn)
    })
})

describe('two-tier criterion: feel (deflection) vs body (strength)', () => {
    const int1x2 = { ...defaultWearstripConfig, stripWidthIn: 1, stripHeightIn: 2, edgeStripWidthIn: 1.5, edgeStripHeightIn: 2 }

    it('inverse readout matches the hand table: 40 lbf @ 20", 30 lbf @ 22" for 0.020"', () => {
        const at20 = calculateWearstrip({ ...int1x2, spanIn: 20 })
        const at22 = calculateWearstrip({ ...int1x2, spanIn: 22 })
        expect(at20.allowablePointLbf).toBeCloseTo(2 * 0.020 * 110 * 110000 * (8 / 12) / 20 ** 3, 6) // ≈ 40.3
        expect(at20.allowablePointLbf).toBeCloseTo(40.3, 1)
        expect(at22.allowablePointLbf).toBeCloseTo(30.3, 1)
    })

    it('"no flex at all" (0.002") allows only a few pounds — physically off the table', () => {
        const r = calculateWearstrip({ ...int1x2, spanIn: 20, deflectionLimitIn: 0.002 })
        expect(r.allowablePointLbf).toBeLessThan(4.5)
        expect(r.allowablePointLbf).toBeGreaterThan(3.5)
    })

    it('a 250 lb person is a strength non-event: ~500 psi of 2000 allowed, springs and recovers', () => {
        const r = calculateWearstrip({ ...int1x2, spanIn: 22 })
        expect(r.bodyStressPsi).toBeCloseTo((125 * 22) / 8 / (4 / 6), 3) // ≈ 516 psi
        expect(r.bodyCheck.utilizationPct).toBeLessThan(30)
        expect(r.bodyCheck.pass).toBe(true)
        expect(r.bodyDeflIn).toBeGreaterThan(0.1) // visibly springy — and harmless
    })

    it('25 lbf feel criterion: one-strip nose press affords 2.78" (<3"); shared over 2 strips affords 3.85" (>3")', () => {
        const oneStrip = calculateWearstrip({ ...int1x2, spanIn: 20, pointLoadLbf: 25, requiredOverhangIn: 3, cantileverStrips: 1 })
        expect(oneStrip.maxOverhangIn).toBeCloseTo(2.78, 1)
        expect(oneStrip.overhangCheck!.pass).toBe(false)
        const shared = calculateWearstrip({ ...int1x2, spanIn: 20, pointLoadLbf: 25, requiredOverhangIn: 3, cantileverStrips: 2 })
        expect(shared.maxOverhangIn).toBeCloseTo(3.85, 1)
        expect(shared.overhangCheck!.pass).toBe(true)
    })

    it('the 1.5×2 EDGE strip (where nose-corner presses land) affords ≥3" at 25 lbf', () => {
        // Model the edge strip by making it the checked (interior) profile
        const edgeAsChecked = calculateWearstrip({ ...base, stripWidthIn: 1.5, stripHeightIn: 2, spanIn: 20, pointLoadLbf: 25 })
        expect(edgeAsChecked.maxOverhangIn).toBeGreaterThan(3.3)
    })
})

describe('the locked 2026 shop standard, end to end', () => {
    it('AQS-Standard passes fully at defaults: 10 ft, 1×2/1.5×2, uniform layout, 3" overhangs', () => {
        // Strips run 5–7" apart -> a nose press bridges two (cantileverStrips
        // default 2); feel press 25 lbf; layout 7 × 16.29" + 3" overhangs
        const layout = solveSupportLayout(120, 16, 18, 3)!
        const r = calculateWearstrip({
            ...defaultWearstripConfig,
            stripWidthIn: 1, stripHeightIn: 2,
            edgeStripWidthIn: 1.5, edgeStripHeightIn: 2,
            spanIn: layout.spanIn,
            requiredOverhangIn: layout.overhangIn,
        })
        expect(r.passAll).toBe(true)
        expect(r.maxOverhangIn).toBeGreaterThan(3)          // ≈ 4.1" affordance
        expect(r.pointCheck.utilizationPct).toBeLessThan(50) // firm hand barely registers
        expect(r.bodyCheck.pass).toBe(true)                  // a person can't hurt it
    })
})
