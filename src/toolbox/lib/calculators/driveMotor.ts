/**
 * Torque & Motor — pure calculation module
 * @module lib/calculators/driveMotor
 *
 * Turns a belt pull into what the drive has to deliver: torque at the sprocket
 * or drum, shaft RPM, power at the belt, a standard motor size, and the gear
 * ratio for a chosen motor speed. The OneMotion auto-pick and the manual drive
 * capability checks were moved here from the Belt Pull card so both cards use
 * one implementation.
 *
 *   power at belt (hp) = pull (lbf) × speed (ft/min) / 33,000
 *   torque (lb·in)     = pull × pitch radius;  N·m = lb·in × 0.112985
 *   shaft rpm          = speed × 12 / (π × pitch diameter)
 *   gear ratio         = motor rpm / shaft rpm
 */

import { hubMotorData, interpolateMotorSpecs } from '@/toolbox/data/hubMotorData'
import { LBF_TO_N, chordalPdMm, sprocketScreens } from './beltPull'

export const STANDARD_MOTOR_HP: readonly number[] = [0.25, 0.33, 0.5, 0.75, 1, 1.5, 2, 3, 5, 7.5, 10, 15, 20, 25, 30]
export const LB_IN_TO_NM = 0.1129848

export function beltPowerHp(pullLbf: number, speedFpm: number): number {
    return (pullLbf * speedFpm) / 33000
}

export function hpToKw(hp: number): number {
    return hp * 0.7457
}

/** Smallest catalog motor at or above the requirement (null past the table) */
export function standardMotorHp(requiredHp: number): number | null {
    if (!(requiredHp > 0)) return null
    return STANDARD_MOTOR_HP.find((hp) => hp >= requiredHp) ?? null
}

export function shaftRpm(speedFpm: number, pitchDiameterIn: number): number | null {
    return pitchDiameterIn > 0 ? (speedFpm * 12) / (Math.PI * pitchDiameterIn) : null
}

export function gearRatio(motorRpm: number, shaftRpmValue: number): number | null {
    return shaftRpmValue > 0 && motorRpm > 0 ? motorRpm / shaftRpmValue : null
}

export function torqueLbIn(pullLbf: number, pitchRadiusIn: number): number {
    return pullLbf * pitchRadiusIn
}

export interface MotorSizingInput {
    /** Running (central) belt pull, lbf */
    runningPullLbf: number
    /** Startup pull, lbf */
    startupPullLbf: number
    /** Sizing floors: central × scenario × service factor (Belt Pull's continuousFloorLbf / peakFloorLbf) */
    contFloorLbf: number
    peakFloorLbf: number
    speedFpm: number
    /** Sprocket or drum pitch diameter, in (null = torque and ratio unavailable) */
    pitchDiameterIn: number | null
    /** Gearmotor + drive train efficiency, 0–1 (default 0.85) */
    driveEfficiency?: number
    /** Motor synchronous speed for the ratio, rpm (default 1750) */
    motorRpm?: number
}

export interface MotorSizing {
    runningHp: number
    startupHp: number
    /** Power at the belt for the sizing floor (what the drive must sustain) */
    sizingHp: number
    peakHp: number
    /** Sizing power divided by drive efficiency — the motor nameplate requirement */
    motorHpRequired: number
    motorKwRequired: number
    standardHp: number | null
    shaftRpm: number | null
    gearRatio: number | null
    torque: {
        runningLbIn: number | null
        contFloorLbIn: number | null
        peakFloorLbIn: number | null
        contFloorNm: number | null
        peakFloorNm: number | null
    }
}

export function motorSizing(i: MotorSizingInput): MotorSizing {
    const eff = i.driveEfficiency && i.driveEfficiency > 0 && i.driveEfficiency <= 1 ? i.driveEfficiency : 0.85
    const motorRpm = i.motorRpm && i.motorRpm > 0 ? i.motorRpm : 1750
    const sizingHp = beltPowerHp(i.contFloorLbf, i.speedFpm)
    const motorHpRequired = sizingHp / eff
    const rpm = i.pitchDiameterIn !== null ? shaftRpm(i.speedFpm, i.pitchDiameterIn) : null
    const r = i.pitchDiameterIn !== null ? i.pitchDiameterIn / 2 : null
    const t = (lbf: number) => (r !== null ? torqueLbIn(lbf, r) : null)
    const contLbIn = t(i.contFloorLbf)
    const peakLbIn = t(i.peakFloorLbf)
    return {
        runningHp: beltPowerHp(i.runningPullLbf, i.speedFpm),
        startupHp: beltPowerHp(i.startupPullLbf, i.speedFpm),
        sizingHp,
        peakHp: beltPowerHp(i.peakFloorLbf, i.speedFpm),
        motorHpRequired,
        motorKwRequired: hpToKw(motorHpRequired),
        standardHp: standardMotorHp(motorHpRequired),
        shaftRpm: rpm,
        gearRatio: rpm !== null ? gearRatio(motorRpm, rpm) : null,
        torque: {
            runningLbIn: t(i.runningPullLbf),
            contFloorLbIn: contLbIn,
            peakFloorLbIn: peakLbIn,
            contFloorNm: contLbIn !== null ? contLbIn * LB_IN_TO_NM : null,
            peakFloorNm: peakLbIn !== null ? peakLbIn * LB_IN_TO_NM : null,
        },
    }
}

// ── OneMotion auto-pick (moved verbatim from the Belt Pull card) ──

export interface MotorPickRow {
    series: string
    diameter: number
    fits: boolean
    pullN: number
    contUtil: number
    peakUtil: number
    rpm: number
    minRpm: number
    maxRpm: number
    rpmOk: boolean
    passes: boolean
}

export interface MotorPicks {
    rows: MotorPickRow[]
    recommended: MotorPickRow | null
    contN: number
    peakN: number
}

/** Every OneMotion series at this belt width against the sizing floors; smallest passing series is recommended */
export function oneMotionPicks(contFloorLbf: number, peakFloorLbf: number, widthMm: number, speedFpm: number): MotorPicks {
    const contN = contFloorLbf * LBF_TO_N
    const peakN = peakFloorLbf * LBF_TO_N
    const rows = hubMotorData.map((m) => {
        const specs = interpolateMotorSpecs(m, widthMm)
        const fits = widthMm >= m.minLength && widthMm <= m.maxLength
        // Peak capability: vendor peak torque over continuous torque, applied to the pull rating
        const peakRatio = specs.torque > 0 ? specs.peakTorque / specs.torque : 2
        const contUtil = specs.beltPull > 0 ? (contN / specs.beltPull) * 100 : Infinity
        const peakUtil = specs.beltPull > 0 ? (peakN / (specs.beltPull * peakRatio)) * 100 : Infinity
        const rpm = (speedFpm * 304.8) / (Math.PI * m.withSprocket)
        const rpmOk = rpm >= m.minRpm && rpm <= m.rpm60Hz
        const passes = fits && contUtil <= 100 && peakUtil <= 100 && rpmOk
        return { series: m.series, diameter: m.diameter, fits, pullN: specs.beltPull, contUtil, peakUtil, rpm, minRpm: m.minRpm, maxRpm: m.rpm60Hz, rpmOk, passes }
    })
    return { rows, recommended: rows.find((r) => r.passes) ?? null, contN, peakN }
}

/** Powered-pulley presets: the hub motor data interpolated at this belt width */
export function pulleyPresetsAt(widthMm: number) {
    return hubMotorData.map((m) => {
        const specs = interpolateMotorSpecs(m, widthMm)
        const fits = widthMm >= m.minLength && widthMm <= m.maxLength
        return { series: m.series, diameter: m.diameter, pullN: specs.beltPull, rpm60Hz: m.rpm60Hz, fits }
    })
}

export interface DriveCapability {
    availableN: number
    peakN: number
    rpm: number | null
    maxRpm: number | null
    screens: string[]
    pdMm: number | null
}

/** Available pull for a drum (vendor pull rating) or a sprocket-driven shaft (torque ÷ pitch radius) */
export function drumCapability(ratedPullN: number, drumDiaMm: number, speedFpm: number, maxRpm: number | null): DriveCapability | null {
    if (!(ratedPullN > 0)) return null
    const rpm = drumDiaMm > 0 ? (speedFpm * 304.8) / (Math.PI * drumDiaMm) : null
    return { availableN: ratedPullN, peakN: ratedPullN, rpm, maxRpm, screens: [], pdMm: null }
}

export function sprocketCapability(opts: {
    teeth: number; pitchMm: number; pdOverrideIn: number; contNm: number; peakNm: number; maxRpm: number
    boreMm: number | null; shellMm: number | null; speedFpm: number
}): DriveCapability | null {
    const pdMm = opts.pdOverrideIn > 0 ? opts.pdOverrideIn * 25.4 : chordalPdMm(opts.pitchMm, opts.teeth)
    if (!(pdMm > 0) || !(opts.contNm > 0)) return null
    const radiusM = pdMm / 2000
    const pdIn = pdMm / 25.4
    const rpm = (opts.speedFpm * 12) / (Math.PI * pdIn)
    const screens = sprocketScreens(pdMm, opts.teeth, opts.pitchMm, opts.boreMm, opts.shellMm)
    return {
        availableN: opts.contNm / radiusM,
        peakN: (opts.peakNm || opts.contNm) / radiusM,
        rpm,
        maxRpm: opts.maxRpm > 0 ? opts.maxRpm : null,
        screens,
        pdMm,
    }
}
