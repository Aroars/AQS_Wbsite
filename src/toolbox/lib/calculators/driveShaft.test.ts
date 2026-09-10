import { describe, it, expect } from 'vitest'
import { shaftSection, shaftCheck } from './driveShaft'

describe('drive shaft deflection and twist', () => {
    it('square section properties', () => {
        const s = shaftSection('square', 1.5)!
        expect(s.i).toBeCloseTo(0.421875, 9)
        expect(s.c).toBe(0.75)
        expect(s.jt).toBeCloseTo(0.1406 * 5.0625, 9)
    })
    it('round section properties', () => {
        const s = shaftSection('round', 2)!
        expect(s.i).toBeCloseTo(Math.PI * 16 / 64, 9)
        expect(s.jt).toBeCloseTo(Math.PI * 16 / 32, 9)
    })
    it('1.5 in square 304 shaft, 40 in span, 500 lbf over 30 in, 1500 lb·in: δ = 0.0435 in, θ = 0.32°', () => {
        const r = shaftCheck({ shape: 'square', sizeIn: 1.5, materialId: 'ss304', spanIn: 40, loadedWidthIn: 30, loadLbf: 500, torqueLbIn: 1500, torqueLengthIn: null })!
        expect(r.deflectionIn).toBeCloseTo(197_500_000 / (384 * 28e6 * 0.421875), 6)
        expect(r.deflectionIn).toBeCloseTo(0.04354, 4)
        expect(r.twistDeg).toBeCloseTo((1500 * 30) / (11.2e6 * 0.1406 * 5.0625) * 180 / Math.PI, 4)
        expect(r.twistDeg).toBeCloseTo(0.323, 2)
        expect(r.bendingMomentLbIn).toBeCloseTo(500 * (80 - 30) / 8, 9)
        expect(r.warnings).toEqual([])
    })
    it('full-width load reduces to the classic 5WL³/384EI', () => {
        const r = shaftCheck({ shape: 'square', sizeIn: 1, materialId: 'cs1018', spanIn: 24, loadedWidthIn: 24, loadLbf: 100, torqueLbIn: 0, torqueLengthIn: null })!
        expect(r.deflectionIn).toBeCloseTo((5 * 100 * 24 ** 3) / (384 * 29e6 * (1 / 12)), 9)
    })
    it('flags a shaft that deflects or twists past its limit', () => {
        const r = shaftCheck({ shape: 'square', sizeIn: 1, materialId: 'ss304', spanIn: 48, loadedWidthIn: 40, loadLbf: 800, torqueLbIn: 4000, torqueLengthIn: null })!
        expect(r.deflectionIn).toBeGreaterThan(0.1)
        expect(r.warnings.some((w) => /Deflection/.test(w))).toBe(true)
        expect(r.warnings.some((w) => /Twist/.test(w))).toBe(true)
    })
    it('returns null without a span', () => {
        expect(shaftCheck({ shape: 'square', sizeIn: 1.5, materialId: 'ss304', spanIn: 0, loadedWidthIn: 30, loadLbf: 500, torqueLbIn: 0, torqueLengthIn: null })).toBeNull()
    })
})
