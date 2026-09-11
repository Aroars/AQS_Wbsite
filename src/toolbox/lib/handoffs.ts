/**
 * Handoff adapters — what one card can pull from another.
 * @module lib/handoffs
 *
 * Each target tool lists the source tools it accepts. A source's `build`
 * turns that card's STORED state (and its conveyor chain, for the flow cards)
 * into the payload the target applies — the same payloads the old Send
 * buttons produced, computed on the receiving side so the user chooses when
 * and from which copy. `writes` names the target fields the payload sets, so
 * a live link can detach when the user edits one of them.
 */

import type { FlowCard } from './calculators/infeedCard'
import { readInfeed } from './calculators/infeedCard'
import { calculateBeltPull, calculateAllScenarios, mergeBeltPullConfig, wearFactors, chordalPdMm } from './calculators/beltPull'
import { restore as restoreThroughput, runSolve } from './calculators/lineThroughputState'
import { tidy } from './calculators/lineThroughput'
import { getStripMaterial, defaultWearstripConfig } from './calculators/wearstrip'
import { allTools } from './toolRegistry'

export interface HandoffSource {
    tool: string
    build: (state: string | null, chain: FlowCard[] | undefined) => Record<string, unknown> | null
    writes: string[]
}

const num = (v: unknown): number => { const n = typeof v === 'number' ? v : parseFloat(String(v ?? '')); return Number.isFinite(n) ? n : 0 }
const parse = (state: string | null): Record<string, unknown> | null => { if (!state) return null; try { const o = JSON.parse(state); return o && typeof o === 'object' ? o : null } catch { return null } }

/** Belt Pull → Torque & Motor: pulls, sizing floors, speed, width, and every scenario's floors */
const beltPullToDriveMotor: HandoffSource = {
    tool: 'beltPull',
    writes: ['runningPull', 'startupPull', 'contFloor', 'peakFloor', 'speed', 'width', 'scenarios', 'serviceFactor', 'scenarioLabel', 'breakawayFactor'],
    build: (state) => {
        const parsed = parse(state)
        if (!parsed) return null
        const cfg = mergeBeltPullConfig(parsed)
        if (!(cfg.beltSpeedFpm > 0)) return null
        const r = calculateBeltPull(cfg)
        const scenarios = calculateAllScenarios(cfg)
        return {
            runningPullLbf: r.centralLbf, startupPullLbf: r.startupPullLbf,
            contFloorLbf: r.continuousFloorLbf, peakFloorLbf: r.peakFloorLbf,
            speedFpm: cfg.beltSpeedFpm, beltWidthIn: cfg.beltWidthIn,
            serviceFactor: Number(r.serviceFactor.toFixed(2)), breakawayFactor: cfg.breakawayFactor,
            scenarioLabel: wearFactors.find((f) => f.id === cfg.wearId)?.label ?? 'custom',
            scenarios: scenarios.map((sc) => ({ id: sc.id, label: sc.label, cont: sc.result.continuousFloorLbf, peak: sc.result.peakFloorLbf })),
            source: 'From Belt Pull',
        }
    },
}

/** Torque & Motor → Drive Shaft: pull, torque at the pitch radius, width, PD */
const driveMotorToDriveShaft: HandoffSource = {
    tool: 'driveMotor',
    writes: ['load', 'torque', 'width', 'pd'],
    build: (state) => {
        const s = parse(state)
        if (!s) return null
        const running = num(s.runningPull)
        if (!(running > 0)) return null
        const contFloor = num(s.contFloor) || running
        const pdIn = s.driveType === 'drum'
            ? (num(s.drumDiaMm) > 0 ? num(s.drumDiaMm) / 25.4 : 0)
            : (num(s.pdOverrideIn) > 0 ? num(s.pdOverrideIn) : chordalPdMm(num(s.pitchMm), num(s.teeth)) / 25.4)
        if (!(pdIn > 0)) return null
        return { loadLbf: tidy(running, 2), torqueLbIn: tidy(contFloor * (pdIn / 2), 2), beltWidthIn: tidy(num(s.width), 3), pdIn: tidy(pdIn, 4), source: 'From Torque & Motor' }
    },
}

/** Line Throughput → Conveyor Speed: packages per minute, weight, length, gap, speed */
const beltLoadToInfeed: HandoffSource = {
    tool: 'beltLoad',
    writes: ['productRate', 'productWeight', 'productLength', 'productGap', 'productSpeed'],
    build: (state) => {
        if (!state) return null
        const st = restoreThroughput(state)
        const r = runSolve(st, null)
        const ppm = r.values.ppm?.value ?? null
        if (ppm === null) return null
        // Bulk: the rate is the downstream bagger's — its belt is a package conveyor, so speed and pitch are not the bulk belt's
        if (st.mode === 'bulk') return { ppm: tidy(ppm, 4), weightLb: tidy(r.values.weight?.value ?? null, 4), lengthIn: null, gapIn: null, speedFpm: null }
        return { ppm: tidy(ppm, 4), weightLb: tidy(r.values.weight?.value ?? null, 4), lengthIn: tidy(r.values.length?.value ?? null, 3), gapIn: tidy(r.values.gap?.value ?? null, 3), speedFpm: tidy(r.values.speed?.value ?? null, 2) }
    },
}

/** Line Throughput → Belt Pull: rate mode load (packages or bulk) with speed */
const beltLoadToBeltPull: HandoffSource = {
    tool: 'beltLoad',
    writes: ['throughputLbHr', 'beltSpeedFpm', 'productType', 'loadMode', 'productWeightLb', 'productLengthIn', 'bulkDensityLbFt3', 'reposeDeg', 'beltWidthIn', 'bedDepthIn', 'edgeMarginIn'],
    build: (state) => {
        if (!state) return null
        const st = restoreThroughput(state)
        const r = runSolve(st, null)
        const lbPerHr = r.derived.lbPerHr
        const speed = r.values.speed?.value ?? null
        if (lbPerHr === null || speed === null) return null
        const patch: Record<string, unknown> = { productType: st.mode, loadMode: 'rate', throughputLbHr: tidy(lbPerHr, 1), beltSpeedFpm: tidy(speed, 2) }
        const v = (f: 'density' | 'width' | 'depth' | 'weight' | 'length') => r.values[f]?.value ?? null
        if (st.mode === 'bulk') {
            if (v('density')) patch.bulkDensityLbFt3 = tidy(v('density'), 3)
            const repose = parseFloat(st.repose); if (Number.isFinite(repose) && repose > 0) patch.reposeDeg = repose
            if (v('width')) patch.beltWidthIn = tidy(v('width'), 3)
            if (v('depth')) patch.bedDepthIn = tidy(v('depth'), 3)
            const m = parseFloat(st.edgeMargin); patch.edgeMarginIn = Number.isFinite(m) ? m : 1
        } else {
            if (v('weight')) patch.productWeightLb = tidy(v('weight'), 4)
            if (v('length')) patch.productLengthIn = tidy(v('length'), 3)
        }
        return patch
    },
}

/** Conveyor Speed → Belt Pull: rate mode from packages/min × weight, with speed and length */
const infeedToBeltPull: HandoffSource = {
    tool: 'conveyorFlow',
    writes: ['throughputLbHr', 'beltSpeedFpm', 'productType', 'loadMode', 'productWeightLb', 'productLengthIn'],
    build: (_state, chain) => {
        const r = readInfeed(chain?.[0])
        if (r.speedFpm === null || r.ppm === null || r.throughputLbHr === null) return null
        return { productType: 'packages', loadMode: 'rate', throughputLbHr: tidy(r.throughputLbHr, 1), beltSpeedFpm: tidy(r.speedFpm, 2), productLengthIn: tidy(r.lengthIn, 3), productWeightLb: tidy(r.weightLb, 3) }
    },
}

/** Conveyor Speed → Accumulation: rate, product length, belt speed */
const infeedToAccumulation: HandoffSource = {
    tool: 'conveyorFlow',
    writes: ['rate', 'length', 'speed'],
    build: (_state, chain) => {
        const r = readInfeed(chain?.[0])
        if (r.ppm === null) return null
        const str = (v: number | null) => (v !== null ? String(Number(v.toPrecision(5))) : '')
        return { rate: str(r.ppm), length: str(r.lengthIn), speed: str(r.speedFpm) }
    },
}

/** Wearstrip → Belt Pull: the strip's dynamic μ becomes the carryway and return base friction */
const wearstripToBeltPull: HandoffSource = {
    tool: 'wearstrip',
    writes: ['materials', 'frictions'],
    build: (state) => {
        const parsed = parse(state)
        const cfg = { ...defaultWearstripConfig, ...(parsed ?? {}) }
        const mat = getStripMaterial(String(cfg.materialId))
        return mat ? { carrywayBaseMu: mat.muDynamic } : null
    },
}

/** target tool id → the sources it can pull from */
export const handoffs: Record<string, HandoffSource[]> = {
    driveMotor: [beltPullToDriveMotor],
    driveShaft: [driveMotorToDriveShaft],
    conveyorFlow: [beltLoadToInfeed],
    accumulation: [infeedToAccumulation],
    beltPull: [beltLoadToBeltPull, infeedToBeltPull, wearstripToBeltPull],
}

export function sourceLabel(tool: string): string {
    return allTools.find((t) => t.id === tool)?.label ?? tool
}
