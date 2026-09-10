import { describe, it, expect } from 'vitest'
import { beltPowerHp, hpToKw, standardMotorHp, shaftRpm, gearRatio, motorSizing, oneMotionPicks, drumCapability, sprocketCapability } from './driveMotor'
import { hubMotorData } from '@/toolbox/data/hubMotorData'
import { chordalPdMm } from './beltPull'

describe('power, torque, rpm, ratio', () => {
    it('hp at the belt = pull × fpm / 33,000', () => {
        expect(beltPowerHp(500, 100)).toBeCloseTo(1.515, 3)
        expect(beltPowerHp(58, 60)).toBeCloseTo(0.1055, 4)   // the belt pull page's worked example
        expect(hpToKw(1)).toBeCloseTo(0.7457, 4)
    })
    it('standard motor is the smallest catalog size at or above the requirement', () => {
        expect(standardMotorHp(1.6)).toBe(2)
        expect(standardMotorHp(0.1)).toBe(0.25)
        expect(standardMotorHp(3)).toBe(3)
        expect(standardMotorHp(0)).toBeNull()
        expect(standardMotorHp(99)).toBeNull()
    })
    it('shaft rpm and gear ratio', () => {
        expect(shaftRpm(60, 6)).toBeCloseTo(38.197, 3)
        expect(gearRatio(1750, 35)).toBeCloseTo(50, 9)
        expect(shaftRpm(60, 0)).toBeNull()
    })
    it('motorSizing ties the pieces together at a 6 in pitch diameter', () => {
        const m = motorSizing({ runningPullLbf: 400, startupPullLbf: 600, contFloorLbf: 500, peakFloorLbf: 750, speedFpm: 100, pitchDiameterIn: 6 })
        expect(m.sizingHp).toBeCloseTo(1.515, 3)
        expect(m.motorHpRequired).toBeCloseTo(1.515 / 0.85, 3)
        expect(m.standardHp).toBe(2)
        expect(m.shaftRpm).toBeCloseTo(63.66, 2)
        expect(m.gearRatio).toBeCloseTo(1750 / 63.66, 1)
        expect(m.torque.contFloorLbIn).toBeCloseTo(1500, 9)
        expect(m.torque.contFloorNm).toBeCloseTo(169.5, 1)
        expect(m.torque.runningLbIn).toBeCloseTo(1200, 9)
    })
    it('without a pitch diameter the torque and ratio are unavailable but power still resolves', () => {
        const m = motorSizing({ runningPullLbf: 100, startupPullLbf: 150, contFloorLbf: 120, peakFloorLbf: 180, speedFpm: 60, pitchDiameterIn: null })
        expect(m.shaftRpm).toBeNull(); expect(m.gearRatio).toBeNull(); expect(m.torque.contFloorNm).toBeNull()
        expect(m.runningHp).toBeGreaterThan(0)
    })
})

describe('OneMotion auto-pick and drive capability (moved from the Belt Pull card)', () => {
    it('lists every series and recommends the smallest passing one', () => {
        const picks = oneMotionPicks(50, 75, 12 * 25.4, 60)
        expect(picks.rows.length).toBe(hubMotorData.length)
        expect(picks.contN).toBeCloseTo(50 * 4.44822, 3)
        if (picks.recommended) {
            expect(picks.recommended.passes).toBe(true)
            const idx = picks.rows.findIndex((r) => r.series === picks.recommended!.series)
            expect(picks.rows.slice(0, idx).every((r) => !r.passes)).toBe(true)
        }
    })
    it('drum capability is the vendor pull rating with rpm from the drum diameter', () => {
        const d = drumCapability(1200, 113, 60, 100)!
        expect(d.availableN).toBe(1200)
        expect(d.rpm).toBeCloseTo((60 * 304.8) / (Math.PI * 113), 6)
        expect(drumCapability(0, 113, 60, null)).toBeNull()
    })
    it('sprocket capability converts continuous torque at the chordal pitch radius', () => {
        const pdMm = chordalPdMm(50, 11)
        const c = sprocketCapability({ teeth: 11, pitchMm: 50, pdOverrideIn: 0, contNm: 10, peakNm: 20, maxRpm: 0, boreMm: null, shellMm: null, speedFpm: 60 })!
        expect(c.pdMm).toBeCloseTo(pdMm, 9)
        expect(c.availableN).toBeCloseTo(10 / (pdMm / 2000), 6)
        expect(c.peakN).toBeCloseTo(20 / (pdMm / 2000), 6)
        expect(c.maxRpm).toBeNull()
    })
})
