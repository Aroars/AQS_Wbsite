import { describe, it, expect } from 'vitest'
import {
    solveThroughput, toLbPerMin, fromLbPerMin, packagerHeadroom, packageFillWeightLb, bedLbPerFt, fmtNum,
    type Entries,
} from './lineThroughput'

const e = (value: number, seq: number): { value: number; seq: number } => ({ value, seq })

describe('rate triangle: throughput = packages/min × weight', () => {
    it('solves the third from any two', () => {
        expect(solveThroughput('packages', { throughput: e(60, 1), weight: e(2, 2) }).values.ppm).toMatchObject({ value: 30, source: 'solved' })
        expect(solveThroughput('packages', { throughput: e(60, 1), ppm: e(30, 2) }).values.weight?.value).toBeCloseTo(2, 9)
        expect(solveThroughput('packages', { ppm: e(30, 1), weight: e(2, 2) }).values.throughput?.value).toBeCloseTo(60, 9)
    })

    it('worked example: 15,000 lb/hr at 70 lb/package → 3.57 pkg/min', () => {
        const r = solveThroughput('packages', { throughput: e(toLbPerMin(15000, 'lb/hr', null)!, 1), weight: e(70, 2) })
        expect(r.values.ppm?.value).toBeCloseTo(250 / 70, 6)
        expect(fmtNum(r.values.ppm!.value)).toBe('3.571')
    })
})

describe('speed relation: belt speed = packages/min × pitch / 12', () => {
    it('solves speed, rate, length, or gap', () => {
        expect(solveThroughput('packages', { ppm: e(20, 1), length: e(12, 2), gap: e(6, 3) }).values.speed?.value).toBeCloseTo(30, 9)
        expect(solveThroughput('packages', { speed: e(30, 1), length: e(12, 2), gap: e(6, 3) }).values.ppm?.value).toBeCloseTo(20, 9)
        expect(solveThroughput('packages', { speed: e(30, 1), ppm: e(20, 2), length: e(12, 3) }).values.gap?.value).toBeCloseTo(6, 9)
        expect(solveThroughput('packages', { speed: e(30, 1), ppm: e(20, 2), gap: e(6, 3) }).values.length?.value).toBeCloseTo(12, 9)
    })

    it('a zero gap is a valid entry (products touching)', () => {
        expect(solveThroughput('packages', { ppm: e(20, 1), length: e(12, 2), gap: e(0, 3) }).values.speed?.value).toBeCloseTo(20, 9)
    })

    it('warns when the solved gap is negative', () => {
        const r = solveThroughput('packages', { speed: e(10, 1), ppm: e(20, 2), length: e(12, 3) })
        expect(r.values.gap!.value).toBeLessThan(0)
        expect(r.warnings.some((w) => /too slow/.test(w))).toBe(true)
    })
})

describe('chaining across relations', () => {
    it('throughput + weight + length + gap → packages/min, then belt speed, then lb/ft', () => {
        const r = solveThroughput('packages', { throughput: e(60, 1), weight: e(2, 2), length: e(12, 3), gap: e(12, 4) })
        expect(r.values.ppm?.value).toBeCloseTo(30, 9)
        expect(r.values.speed?.value).toBeCloseTo(60, 9)          // 30 × 24 / 12
        expect(r.derived.pitchIn).toBeCloseTo(24, 9)
        expect(r.derived.productsPerFt).toBeCloseTo(0.5, 9)
        expect(r.derived.lbPerFt).toBeCloseTo(1, 9)               // 60 lb/min ÷ 60 ft/min = 12 × 2 ÷ 24
    })

    it('speed + geometry give packages/min, then weight gives throughput', () => {
        const r = solveThroughput('packages', { speed: e(60, 1), length: e(12, 2), gap: e(12, 3), weight: e(2, 4) })
        expect(r.values.ppm?.value).toBeCloseTo(30, 9)
        expect(r.values.throughput?.value).toBeCloseTo(60, 9)
        expect(r.derived.lbPerHr).toBeCloseTo(3600, 9)
    })

    it('consistency with the belt pull rate mode: 3600 lb/hr @ 60 fpm = 1 lb/ft', () => {
        const r = solveThroughput('packages', { throughput: e(toLbPerMin(3600, 'lb/hr', null)!, 1), speed: e(60, 2) })
        expect(r.derived.lbPerFt).toBeCloseTo(1, 9)
    })
})

describe('release rule: the oldest entered field in an over-determined relation gives way', () => {
    it('overwriting a solved PPM releases throughput (the oldest), never the field being edited', () => {
        const r = solveThroughput('packages', { throughput: e(60, 1), weight: e(2, 2), ppm: e(40, 3) }, { justEdited: 'ppm' })
        expect(r.released).toEqual(['throughput'])
        expect(r.values.throughput).toMatchObject({ value: 80, source: 'solved' })
        expect(r.values.ppm?.source).toBe('entered')
        expect(r.values.weight?.source).toBe('entered')
    })

    it('re-entering a rounded copy of a solved value is consistent — nothing is released', () => {
        const r = solveThroughput('packages', { throughput: e(250, 1), weight: e(70, 2), ppm: e(3.57, 3) }, { justEdited: 'ppm' })
        expect(r.released).toEqual([])
        expect(r.conflict).toBeNull()
    })

    it('disagreement reached through a shared solved variable releases from the other relation', () => {
        // ppm solves from throughput + weight (30); speed + geometry imply 20 → speed relation over-determined
        const entries: Entries = { throughput: e(60, 1), weight: e(2, 2), speed: e(30, 3), length: e(12, 4), gap: e(6, 5) }
        const r = solveThroughput('packages', entries, { justEdited: 'gap' })
        expect(r.released).toEqual(['speed'])                     // oldest of speed / length / gap, gap excluded
        expect(r.values.speed?.value).toBeCloseTo(45, 9)          // 30 ppm × 18 in / 12
        expect(r.values.ppm?.value).toBeCloseTo(30, 9)
    })

    it('the fill-derived package weight yields before any typed value', () => {
        const r = solveThroughput('packages', { weight: { value: 5, seq: -1, source: 'fill' }, throughput: e(60, 1), ppm: e(30, 2) }, { justEdited: 'ppm' })
        expect(r.released).toEqual(['weight'])
        expect(r.values.weight).toMatchObject({ value: 2, source: 'solved' })
    })

    it('never clears: a released field is re-derived, not dropped', () => {
        const r = solveThroughput('packages', { throughput: e(60, 1), weight: e(2, 2), ppm: e(40, 3) }, { justEdited: 'ppm' })
        expect(Object.keys(r.values).sort()).toEqual(['ppm', 'throughput', 'weight'])
    })
})

describe('needed-state hints', () => {
    it('throughput only → weight and packages/min ask for one of them', () => {
        const h = solveThroughput('packages', { throughput: e(60, 1) }).hints
        expect(h.weight).toBe('Enter one of these to get the other')
        expect(h.ppm).toBe('Enter one of these to get the other')
        expect(h.length).toBeUndefined()
    })

    it('throughput + weight → geometry estimates speed, or speed directly', () => {
        const h = solveThroughput('packages', { throughput: e(60, 1), weight: e(2, 2) }).hints
        expect(h.length).toBe('Enter these to estimate belt speed')
        expect(h.gap).toBe('Enter these to estimate belt speed')
        expect(h.speed).toBe('or enter belt speed directly')
    })

    it('speed entered directly clears the geometry hints', () => {
        const h = solveThroughput('packages', { throughput: e(60, 1), weight: e(2, 2), speed: e(60, 3) }).hints
        expect(h.length).toBeUndefined()
        expect(h.gap).toBeUndefined()
        expect(h.speed).toBeUndefined()
    })

    it('nothing entered → no hints', () => {
        expect(solveThroughput('packages', {}).hints).toEqual({})
    })
})

describe('bulk: lb/ft = density × depth/12 × usable width/12; throughput = lb/ft × speed', () => {
    it('bed lb/ft uses the usable width (edge margin per side)', () => {
        expect(bedLbPerFt(45, 2, 14, 1)).toBeCloseTo((45 * 2 * 12) / 144, 9)
    })

    it('solves throughput from the bed at speed', () => {
        const r = solveThroughput('bulk', { density: e(45, 1), depth: e(2, 2), width: e(14, 3), speed: e(60, 4) })
        expect(r.values.throughput?.value).toBeCloseTo(7.5 * 60, 9)
    })

    it('solves the bed depth demand needs (the old "bed depth needed")', () => {
        const r = solveThroughput('bulk', { throughput: e(300, 1), speed: e(60, 2), density: e(45, 3), width: e(14, 4) })
        expect(r.values.depth).toMatchObject({ source: 'solved' })
        expect(r.values.depth!.value).toBeCloseTo((5 * 144) / (45 * 12), 9)
    })

    it('every field known is a capacity check, not a conflict', () => {
        const r = solveThroughput('bulk', { throughput: e(600, 1), speed: e(60, 2), density: e(45, 3), depth: e(2, 4), width: e(14, 5) }, { justEdited: 'width' })
        expect(r.released).toEqual([])
        expect(r.derived.bedLbPerFt).toBeCloseTo(7.5, 9)
        expect(r.derived.bedUtilizationPct).toBeCloseTo((10 / 7.5) * 100, 9)
    })
})

describe('quoted-rate units and helpers', () => {
    it('converts lb/hr, lb/day with production hours, and kg', () => {
        expect(toLbPerMin(15000, 'lb/hr', null)).toBeCloseTo(250, 9)
        expect(toLbPerMin(60000, 'lb/day', 16)).toBeCloseTo(62.5, 9)
        expect(toLbPerMin(60000, 'lb/day', null)).toBeNull()
        expect(toLbPerMin(600, 'kg/hr', null)).toBeCloseTo((600 * 2.20462) / 60, 6)
        expect(fromLbPerMin(62.5, 'lb/day', 16)).toBeCloseTo(60000, 6)
    })

    it('package fill: settled density × box volume × fill', () => {
        expect(packageFillWeightLb(45, 12, 12, 12, 1)).toBeCloseTo(45, 9)
        expect(packageFillWeightLb(45, 12, 12, 12, 0.9)).toBeCloseTo(40.5, 9)
        expect(packageFillWeightLb(null, 12, 12, 12, 1)).toBeNull()
    })

    it('packager headroom levels', () => {
        expect(packagerHeadroom(30, 100)?.level).toBe('ok')
        expect(packagerHeadroom(85, 100)?.level).toBe('tight')
        expect(packagerHeadroom(120, 100)?.level).toBe('over')
        expect(packagerHeadroom(0, 100)).toBeNull()
    })
})
