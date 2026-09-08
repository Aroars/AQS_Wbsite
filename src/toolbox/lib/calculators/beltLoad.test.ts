import { describe, it, expect } from 'vitest'
import { calculateBeltLoad } from './beltLoad'

describe('calculateBeltLoad — throughput conversions', () => {
    it('lb/hr to lb/min and lb/ft (the belt pull input)', () => {
        const r = calculateBeltLoad({ throughputLbHr: 3600, beltSpeedFpm: 60, pieceWeightLb: null, ppm: null })!
        expect(r.lbPerMin).toBeCloseTo(60, 9)
        expect(r.lbPerFt).toBeCloseTo(1, 9)       // 3600 / (60·60)
        expect(r.throughputDerived).toBe(false)
    })

    it('derives PPM from package weight and vice versa', () => {
        const fromWeight = calculateBeltLoad({ throughputLbHr: 3600, beltSpeedFpm: null, pieceWeightLb: 2, ppm: null })!
        expect(fromWeight.ppm).toBeCloseTo(30, 9)  // 60 lb/min ÷ 2 lb
        const fromPpm = calculateBeltLoad({ throughputLbHr: 3600, beltSpeedFpm: null, pieceWeightLb: null, ppm: 30 })!
        expect(fromPpm.pieceWeightLb).toBeCloseTo(2, 9)
    })

    it('derives throughput from the piece pair when not entered', () => {
        const r = calculateBeltLoad({ throughputLbHr: null, beltSpeedFpm: 60, pieceWeightLb: 2, ppm: 30 })!
        expect(r.throughputLbHr).toBeCloseTo(3600, 9)
        expect(r.throughputDerived).toBe(true)
        expect(r.lbPerFt).toBeCloseTo(1, 9)
    })

    it('computes package pitch and pieces per foot from speed + ppm', () => {
        const r = calculateBeltLoad({ throughputLbHr: 3600, beltSpeedFpm: 60, pieceWeightLb: 2, ppm: null })!
        expect(r.pitchIn).toBeCloseTo(24, 9)       // 60 ft/min × 12 ÷ 30 ppm
        expect(r.piecesPerFt).toBeCloseTo(0.5, 9)
    })

    it('returns null when nothing is derivable, partials otherwise', () => {
        expect(calculateBeltLoad({ throughputLbHr: null, beltSpeedFpm: 60, pieceWeightLb: 2, ppm: null })).toBeNull()
        const noSpeed = calculateBeltLoad({ throughputLbHr: 1200, beltSpeedFpm: null, pieceWeightLb: null, ppm: null })!
        expect(noSpeed.lbPerMin).toBeCloseTo(20, 9)
        expect(noSpeed.lbPerFt).toBeNull()
        expect(noSpeed.pitchIn).toBeNull()
    })

    it('consistency with the belt pull rate mode: 3600 lb/hr @ 60 fpm = 1 lb/ft', () => {
        // beltPull.ts computes productPerFt = thr/(speed·60); this card must agree
        const r = calculateBeltLoad({ throughputLbHr: 3600, beltSpeedFpm: 60, pieceWeightLb: null, ppm: null })!
        expect(r.lbPerFt).toBeCloseTo(3600 / (60 * 60), 12)
    })
})

describe('package fill path (fixed box volume × settled density)', () => {
    it('package dims × settled density × fill derive weight per package and packages/hr + /min', () => {
        // 12×8×6 in = 576 in³ = 1/3 ft³; × 45 lb/ft³ × 0.9 fill = 13.5 lb per package
        const r = calculateBeltLoad({
            throughputLbHr: 5400, beltSpeedFpm: null, pieceWeightLb: null, ppm: null,
            settledDensityLbFt3: 45,
            pkgLengthIn: 12, pkgWidthIn: 8, pkgHeightIn: 6, fillFraction: 0.9,
        })!
        expect(r.pkgCapacityLb).toBeCloseTo(13.5, 9)
        expect(r.pieceWeightSource).toBe('dims')
        // 5400 lb/hr = 90 lb/min ÷ 13.5 lb = 6.667 ppm = 400/hr
        expect(r.ppm).toBeCloseTo(90 / 13.5, 9)
        expect(r.packagesPerHour).toBeCloseTo(400, 6)
    })

    it('dims-derived weight + PPM can derive throughput (no rate quote)', () => {
        const r = calculateBeltLoad({
            throughputLbHr: null, beltSpeedFpm: null, pieceWeightLb: null, ppm: 10,
            settledDensityLbFt3: 45, pkgLengthIn: 12, pkgWidthIn: 8, pkgHeightIn: 6, fillFraction: 0.9,
        })!
        expect(r.throughputLbHr).toBeCloseTo(13.5 * 10 * 60, 9)
        expect(r.throughputSource).toBe('pieces')
    })

    it('entered package weight outranks dims-derived', () => {
        const r = calculateBeltLoad({
            throughputLbHr: 3600, beltSpeedFpm: null, pieceWeightLb: 2, ppm: null,
            settledDensityLbFt3: 50,
            pkgLengthIn: 12, pkgWidthIn: 8, pkgHeightIn: 6, fillFraction: 1,
        })!
        expect(r.pieceWeightLb).toBe(2)
        expect(r.pieceWeightSource).toBe('entered')
        expect(r.pkgCapacityLb).toBeCloseTo(50 * 576 / 1728, 9) // still reported for reference
    })

    it('flags over-determined inputs that disagree by >5%, quiet when they agree', () => {
        const bad = calculateBeltLoad({ throughputLbHr: 3600, beltSpeedFpm: null, pieceWeightLb: 2, ppm: 20 })!
        expect(bad.consistencyWarning).toContain('2400')
        const good = calculateBeltLoad({ throughputLbHr: 3600, beltSpeedFpm: null, pieceWeightLb: 2, ppm: 30 })!
        expect(good.consistencyWarning).toBeNull()
    })

    it('packagesPerHour is always ppm × 60', () => {
        const r = calculateBeltLoad({ throughputLbHr: 3600, beltSpeedFpm: null, pieceWeightLb: 2, ppm: null })!
        expect(r.packagesPerHour).toBeCloseTo(r.ppm! * 60, 9)
    })
})

describe('plant-intake reality: lb/day rates and packager utilization', () => {
    it('lb/day converts through OPERATING hours, not clock hours', () => {
        // 100,000 lb/day on a two-shift (16 h) operation = 6,250 lb/hr
        const r = calculateBeltLoad({
            throughputLbHr: null, throughputLbPerDay: 100000, operatingHrsPerDay: 16,
            beltSpeedFpm: null, pieceWeightLb: null, ppm: null,
        })!
        expect(r.throughputLbHr).toBeCloseTo(6250, 9)
        expect(r.throughputSource).toBe('per-day')
    })

    it('defaults to 24 h when operating hours not given; entered lb/hr outranks lb/day', () => {
        const daily = calculateBeltLoad({
            throughputLbHr: null, throughputLbPerDay: 24000,
            beltSpeedFpm: null, pieceWeightLb: null, ppm: null,
        })!
        expect(daily.throughputLbHr).toBeCloseTo(1000, 9)
        const both = calculateBeltLoad({
            throughputLbHr: 5000, throughputLbPerDay: 24000,
            beltSpeedFpm: null, pieceWeightLb: null, ppm: null,
        })!
        expect(both.throughputLbHr).toBe(5000)
        expect(both.throughputSource).toBe('entered')
    })

    it('solves the intake question: required packager speed vs rated max', () => {
        // 6,000 lb/hr of 2.5 lb bags = 40 bags/min; bagger rated 60/min -> 66.7%
        const r = calculateBeltLoad({
            throughputLbHr: 6000, beltSpeedFpm: null, pieceWeightLb: 2.5, ppm: null,
            ratedPackagerPpm: 60,
        })!
        expect(r.ppm).toBeCloseTo(40, 9)
        expect(r.packagerUtilizationPct).toBeCloseTo(66.667, 2)
    })

    it('flags an overrun: process outruns the packager (>100%)', () => {
        const r = calculateBeltLoad({
            throughputLbHr: 12000, beltSpeedFpm: null, pieceWeightLb: 2.5, ppm: null,
            ratedPackagerPpm: 60,
        })!
        expect(r.packagerUtilizationPct).toBeCloseTo(133.33, 1)
    })

    it('no rated speed -> no utilization, everything else unaffected', () => {
        const r = calculateBeltLoad({ throughputLbHr: 6000, beltSpeedFpm: null, pieceWeightLb: 2.5, ppm: null })!
        expect(r.packagerUtilizationPct).toBeNull()
        expect(r.ppm).toBeCloseTo(40, 9)
    })
})

describe('bulk (loose product) path', () => {
    it('lb/hr with loose density gives lb/min, lb/ft, and ft³/hr; package fields are null', () => {
        const r = calculateBeltLoad({ productType: 'bulk', throughputLbHr: 4500, beltSpeedFpm: 60, pieceWeightLb: null, ppm: null, looseDensityLbFt3: 45 })!
        expect(r.productType).toBe('bulk')
        expect(r.lbPerMin).toBeCloseTo(75, 9)
        expect(r.lbPerFt).toBeCloseTo(1.25, 9)
        expect(r.ft3PerHr).toBeCloseTo(100, 9)
        expect(r.ppm).toBeNull()
        expect(r.pieceWeightLb).toBeNull()
        expect(r.pitchIn).toBeNull()
    })

    it('a volumetric rate converts through loose density; entered lb/hr outranks it', () => {
        const vol = calculateBeltLoad({ productType: 'bulk', throughputLbHr: null, throughputFt3Hr: 100, looseDensityLbFt3: 45, beltSpeedFpm: null, pieceWeightLb: null, ppm: null })!
        expect(vol.throughputLbHr).toBeCloseTo(4500, 9)
        expect(vol.throughputSource).toBe('volume')
        const both = calculateBeltLoad({ productType: 'bulk', throughputLbHr: 3000, throughputFt3Hr: 100, looseDensityLbFt3: 45, beltSpeedFpm: null, pieceWeightLb: null, ppm: null })!
        expect(both.throughputLbHr).toBe(3000)
        expect(both.throughputSource).toBe('entered')
        // no density → volume cannot convert → falls to lb/day, then null
        expect(calculateBeltLoad({ productType: 'bulk', throughputLbHr: null, throughputFt3Hr: 100, beltSpeedFpm: null, pieceWeightLb: null, ppm: null })).toBeNull()
    })

    it('bed capacity: (width − 2·margin) × depth × density × speed; utilization and depth needed', () => {
        // 14" belt, 1" margins → 12" usable × 2" deep = 24 in² = 1/6 ft² × 45 lb/ft³ = 7.5 lb/ft × 60 fpm × 60 = 27,000 lb/hr
        const r = calculateBeltLoad({
            productType: 'bulk', throughputLbHr: 13500, beltSpeedFpm: 60, pieceWeightLb: null, ppm: null,
            looseDensityLbFt3: 45, beltWidthIn: 14, bedDepthIn: 2, edgeMarginIn: 1,
        })!
        expect(r.bedCapacityLbHr).toBeCloseTo(27000, 6)
        expect(r.bedUtilizationPct).toBeCloseTo(50, 6)
        expect(r.bedDepthNeededIn).toBeCloseTo(1, 6)   // half the rate needs half the depth
    })

    it('agrees with the belt pull bed mode on capacity at speed', () => {
        // beltPull.ts bulk mode: bedAreaFt2 = usable × depth / 144; perFt = density × area; achieved = perFt × speed × 60
        const r = calculateBeltLoad({
            productType: 'bulk', throughputLbHr: 1000, beltSpeedFpm: 80, pieceWeightLb: null, ppm: null,
            looseDensityLbFt3: 40, beltWidthIn: 24, bedDepthIn: 3, edgeMarginIn: 1.5,
        })!
        const usable = 24 - 3
        const expected = 40 * (usable * 3 / 144) * 80 * 60
        expect(r.bedCapacityLbHr).toBeCloseTo(expected, 6)
    })

    it('packages path is unchanged and reports its type', () => {
        const r = calculateBeltLoad({ throughputLbHr: 3600, beltSpeedFpm: 60, pieceWeightLb: 2, ppm: null })!
        expect(r.productType).toBe('packages')
        expect(r.bedCapacityLbHr).toBeNull()
        expect(r.ppm).toBeCloseTo(30, 9)
    })
})
