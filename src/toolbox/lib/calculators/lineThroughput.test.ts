import { describe, it, expect } from 'vitest'
import {
    solveThroughput, toLbPerMin, fromLbPerMin, packagerHeadroom, packageFillWeightLb, bedLbPerFt, fmtNum, fmtInput,
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

    it('disagreement reached through a solved variable releases the oldest entry behind it', () => {
        // ppm solves from throughput + weight (30); speed + geometry imply 20 → the speed relation
        // disagrees, and it rests on throughput, weight, speed, length (gap is being edited):
        // throughput is the oldest, so it is re-derived — one release, everything else stands
        const entries: Entries = { throughput: e(60, 1), weight: e(2, 2), speed: e(30, 3), length: e(12, 4), gap: e(6, 5) }
        const r = solveThroughput('packages', entries, { justEdited: 'gap' })
        expect(r.released).toEqual(['throughput'])
        expect(r.values.ppm?.value).toBeCloseTo(20, 9)            // 30 ft/min × 12 / 18 in
        expect(r.values.throughput?.value).toBeCloseTo(40, 9)     // 20 × 2 lb
        expect(r.values.speed?.source).toBe('entered')
    })

    it('a typed belt load on a fully determined card releases exactly one entry', () => {
        // weight, length, gap, throughput fix everything; typing lb/ft = 2 (was 1) must not cascade
        const entries: Entries = { weight: e(2, 1), length: e(12, 2), gap: e(12, 3), throughput: e(60, 4), lbft: e(2, 5) }
        const r = solveThroughput('packages', entries, { justEdited: 'lbft' })
        expect(r.released).toEqual(['weight'])
        expect(r.values.speed?.value).toBeCloseTo(30, 9)          // 60 lb/min ÷ 2 lb/ft
        expect(r.values.ppm?.value).toBeCloseTo(15, 9)            // 30 × 12 / 24
        expect(r.values.weight?.value).toBeCloseTo(4, 9)          // 60 ÷ 15
        expect(r.conflict).toBeNull()
    })

    it('the fill-derived package weight yields before any typed value', () => {
        const r = solveThroughput('packages', { weight: { value: 5, seq: -1, source: 'fill' }, throughput: e(60, 1), ppm: e(30, 2) }, { justEdited: 'ppm' })
        expect(r.released).toEqual(['weight'])
        expect(r.values.weight).toMatchObject({ value: 2, source: 'solved' })
    })

    it('a locked field is never released — the next-oldest unlocked entry gives way instead', () => {
        const r = solveThroughput('packages', { throughput: { value: 60, seq: 1, locked: true }, weight: e(2, 2), ppm: e(40, 3) }, { justEdited: 'ppm' })
        expect(r.released).toEqual(['weight'])
        expect(r.values.weight?.value).toBeCloseTo(1.5, 9)
        expect(r.values.throughput?.source).toBe('entered')
    })

    it('locks reach through solved values: a locked throughput survives a geometry edit', () => {
        const entries: Entries = { throughput: { value: 60, seq: 1, locked: true }, weight: e(2, 2), speed: e(30, 3), length: e(12, 4), gap: e(6, 5) }
        const r = solveThroughput('packages', entries, { justEdited: 'gap' })
        expect(r.released).toEqual(['weight'])
        expect(r.values.throughput?.value).toBe(60)
    })

    it('everything locked and disagreeing is a conflict that names the locks', () => {
        const r = solveThroughput('packages', { throughput: { value: 60, seq: 1, locked: true }, weight: { value: 2, seq: 2, locked: true }, ppm: e(40, 3) }, { justEdited: 'ppm' })
        expect(r.conflict).toBe('rate')
        expect(r.warnings.some((w) => /Unlock/.test(w))).toBe(true)
    })

    it('never clears: a released field is re-derived, not dropped', () => {
        const r = solveThroughput('packages', { throughput: e(60, 1), weight: e(2, 2), ppm: e(40, 3) }, { justEdited: 'ppm' })
        expect(Object.keys(r.values).sort()).toEqual(['ppm', 'throughput', 'weight'])
    })
})

describe('needed-state hints', () => {
    it('throughput only → weight and packages/min ask for each other; speed and belt load too', () => {
        const h = solveThroughput('packages', { throughput: e(60, 1) }).hints
        expect(h.weight).toBe('Enter this to get packages/min')
        expect(h.ppm).toBe('Enter this to get package weight')
        expect(h.speed).toBe('Enter this to get belt load')
        expect(h.lbft).toBe('Enter this to get belt speed')
        expect(h.length).toBeUndefined()
    })

    it('throughput + weight → geometry is two entries from a speed; speed itself unlocks belt load', () => {
        const h = solveThroughput('packages', { throughput: e(60, 1), weight: e(2, 2) }).hints
        expect(h.length).toBe('Enter two of these to get the third')
        expect(h.gap).toBe('Enter two of these to get the third')
        expect(h.speed).toBe('Enter this to get belt load')
    })

    it('speed entered directly clears the speed and load hints', () => {
        const h = solveThroughput('packages', { throughput: e(60, 1), weight: e(2, 2), speed: e(60, 3) }).hints
        expect(h.speed).toBeUndefined()
        expect(h.lbft).toBeUndefined()
        expect(h.length).toBe('Enter this to get gap')
    })

    it('nothing entered → no hints', () => {
        expect(solveThroughput('packages', {}).hints).toEqual({})
    })
})

describe('belt load as a field', () => {
    it('packages: lb/ft solves from throughput ÷ speed and from weight ÷ pitch, and both agree', () => {
        const a = solveThroughput('packages', { throughput: e(60, 1), speed: e(60, 2) })
        expect(a.values.lbft).toMatchObject({ value: 1, source: 'solved' })
        const b = solveThroughput('packages', { weight: e(2, 1), length: e(12, 2), gap: e(12, 3) })
        expect(b.values.lbft?.value).toBeCloseTo(1, 9)             // no rate needed: one 2 lb package every 24 in
        expect(b.values.ppm).toBeUndefined()                        // the rate stays free
        expect(b.derived.lbPerFt).toBeCloseTo(1, 9)
    })

    it('a typed belt load back-solves the belt speed from throughput', () => {
        const r = solveThroughput('packages', { throughput: e(250, 1), lbft: e(25, 2) })
        expect(r.values.speed).toMatchObject({ value: 10, source: 'solved' })
    })

    it('a typed belt load with weight and length gives the gap', () => {
        const r = solveThroughput('packages', { weight: e(2, 1), length: e(12, 2), lbft: e(1, 3) })
        expect(r.values.gap?.value).toBeCloseTo(12, 9)
    })
})

describe('bulk: lb/ft = density × depth/12 × usable width/12; throughput = lb/ft × speed', () => {
    it('bed lb/ft uses the usable width (edge margin per side)', () => {
        expect(bedLbPerFt(45, 2, 14, 1)).toBeCloseTo((45 * 2 * 12) / 144, 9)
    })

    it('density, width, and product height give lb/ft, then lb/hr at speed', () => {
        const r = solveThroughput('bulk', { density: e(45, 1), depth: e(2, 2), width: e(14, 3), speed: e(60, 4) })
        expect(r.values.lbft?.value).toBeCloseTo(7.5, 9)
        expect(r.values.throughput?.value).toBeCloseTo(7.5 * 60, 9)
        expect(r.derived.lbPerHr).toBeCloseTo(27000, 6)
    })

    it('the opposite: throughput and speed with the bed give the depth the demand needs', () => {
        const r = solveThroughput('bulk', { throughput: e(300, 1), speed: e(60, 2), density: e(45, 3), width: e(14, 4) })
        expect(r.values.depth).toMatchObject({ source: 'solved' })
        expect(r.values.depth!.value).toBeCloseTo((5 * 144) / (45 * 12), 9)
    })

    it('or the belt speed a bed needs to carry the demand', () => {
        const r = solveThroughput('bulk', { throughput: e(450, 1), density: e(45, 2), depth: e(2, 3), width: e(14, 4) })
        expect(r.values.speed?.value).toBeCloseTo(60, 9)
    })

    it('every field entered releases the oldest entry, like packages — the numbers always agree', () => {
        // throughput ÷ speed = 10 lb/ft, but the bed says 7.5: the bed relation rests on throughput,
        // speed, density, depth (width is being edited); throughput is the oldest and is re-derived
        const r = solveThroughput('bulk', { throughput: e(600, 1), speed: e(60, 2), density: e(45, 3), depth: e(2, 4), width: e(14, 5) }, { justEdited: 'width' })
        expect(r.released).toEqual(['throughput'])
        expect(r.values.throughput).toMatchObject({ source: 'solved' })
        expect(r.values.throughput!.value).toBeCloseTo(450, 9)
    })

    it('max bed depth turns the solved depth into a utilization check and warns past 100%', () => {
        const ok = solveThroughput('bulk', { throughput: e(300, 1), speed: e(60, 2), density: e(45, 3), width: e(14, 4) }, { maxBedDepthIn: 2 })
        expect(ok.derived.bedUtilizationPct).toBeCloseTo((4 / 3 / 2) * 100, 6)
        expect(ok.derived.bedLbPerFt).toBeCloseTo(7.5, 9)
        expect(ok.warnings).toEqual([])
        const over = solveThroughput('bulk', { throughput: e(900, 1), speed: e(60, 2), density: e(45, 3), width: e(14, 4) }, { maxBedDepthIn: 2 })
        expect(over.derived.bedUtilizationPct).toBeGreaterThan(100)
        expect(over.warnings.some((w) => /widen the belt/.test(w))).toBe(true)
    })
})

describe('bulk feeding a bagger: the rate relation backs lb/hr out of bags/min × bag weight', () => {
    it('20 bags/min at 2.5 lb → 50 lb/min = 3,000 lb/hr, then the bed depth at speed', () => {
        const r = solveThroughput('bulk', { ppm: e(20, 1), weight: e(2.5, 2), density: e(30, 3), width: e(12, 4), speed: e(60, 5) })
        expect(r.values.throughput?.value).toBeCloseTo(50, 9)
        expect(r.derived.lbPerHr).toBeCloseTo(3000, 6)
        expect(r.values.lbft?.value).toBeCloseTo(50 / 60, 9)
        expect(r.values.depth?.value).toBeCloseTo(((50 / 60) * 144) / (30 * 10), 9)
    })

    it('a bag weight from the fill box with a quoted lb/hr gives the bagger rate', () => {
        const bag = packageFillWeightLb(45, 6, 4, 10, 0.9)!                       // 45 × 240/1728 × 0.9 = 5.625 lb
        const r = solveThroughput('bulk', { throughput: e(toLbPerMin(15000, 'lb/hr', null)!, 1), weight: { value: bag, seq: 2, source: 'fill' } })
        expect(r.values.ppm?.value).toBeCloseTo(250 / 5.625, 9)
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

    it('fmtInput snaps a solved value that is a rounding hair off (29.9999 → 30) but keeps real precision', () => {
        expect(fmtInput(29.99994)).toBe('30')
        expect(fmtInput(29.995)).toBe('29.995')
        expect(fmtInput(3.5714285)).toBe('3.57143')
    })

    it('packager headroom levels', () => {
        expect(packagerHeadroom(30, 100)?.level).toBe('ok')
        expect(packagerHeadroom(85, 100)?.level).toBe('tight')
        expect(packagerHeadroom(120, 100)?.level).toBe('over')
        expect(packagerHeadroom(0, 100)).toBeNull()
    })
})
