import { describe, it, expect } from 'vitest'
import {
    calculateBeltPull, calculateAllScenarios, carrywayLengthIn, turnArcIn, turnStep,
    resolveReturnSegments, solveRailMu, effectiveRailMu, pathRiseIn, isIncline,
    chordalPdMm, torqueNmFromPull, thermalUpliftFactor, sprocketScreens,
    exampleConfigs, wearFactors, scenarioFrictions, defaultBeltPullConfig,
    CURVE_SPEED_CEIL_FPM,
    type InclineSection, type BeltPullConfig,
} from './beltPull'

const a1 = exampleConfigs.find((e) => e.id === 'a1-infeed')!.config
const outfeed = exampleConfigs.find((e) => e.id === 'outfeed-2-turn')!.config
const straight = exampleConfigs.find((e) => e.id === 'straight')!.config

// ═════════ Fixture 1: OneMotion sign-off Table 2, exact walk (old duty) ═════════
describe('sign-off Table 2 reproduction (Rev 2 doc, 6000 lb/hr @ 80 ft/min)', () => {
    const oldDuty = { ...a1, throughputLbHr: 6000 }
    const r = calculateBeltPull(oldDuty)

    it('seed tension entering turn 1 = 9.7408 lbf (§2.3)', () => {
        expect(r.perTurn[0].tensionIn).toBeCloseTo(9.7408, 3)
    })

    it('Central walk: 14.8816 → 21.7022 → 30.7515 (§2.5, ±0.001)', () => {
        expect(r.perTurn[0].tensionOut).toBeCloseTo(14.8816, 2)
        expect(r.perTurn[1].tensionOut).toBeCloseTo(21.7022, 2)
        expect(r.perTurn[2].tensionOut).toBeCloseTo(30.7515, 2)
        expect(r.centralLbf).toBeCloseTo(30.7515, 2)
    })

    it('Low 14.823 / High 35.665 (§2.5)', () => {
        expect(r.lowLbf).toBeCloseTo(14.823, 2)
        expect(r.highLbf).toBeCloseTo(35.665, 2)
    })

    it('torque at 3.45" pitch radius = 11.986 Nm (§2.6)', () => {
        expect(torqueNmFromPull(r.centralLbf, 3.45)).toBeCloseTo(11.986, 2)
    })

    it('loop invariant echo: carry 260", loop 520", return = 100 slider + 160 rollers (§2.1)', () => {
        expect(r.carrywayIn).toBeCloseTo(260, 1)
        expect(r.loopIn).toBeCloseTo(520, 1)
        expect(r.returnResolved[0].support).toBe('slider')
        expect(r.returnResolved[0].lengthIn).toBeCloseTo(100, 6)
        expect(r.returnResolved[1].support).toBe('roller')
        expect(r.returnResolved[1].lengthIn).toBeCloseTo(160, 1)
    })
})

// ═════════ Fixtures 2 & 3: corrected duty ═════════
describe('Rev B duty fixtures', () => {
    it('A1 corrected duty (3500 lb/hr @ 80): Central 26.70 lbf', () => {
        expect(calculateBeltPull(a1).centralLbf).toBeCloseTo(26.70, 1)
    })

    it('outfeed 2-turn (3500 lb/hr @ 140): Central ≈14.1, Worn ≈23.7 (±0.4)', () => {
        const clean = calculateBeltPull(outfeed)
        expect(clean.centralLbf).toBeCloseTo(14.1, 0)
        const worn = calculateAllScenarios(outfeed).find((s) => s.id === 'worn')!.result
        expect(Math.abs(worn.centralLbf - 23.7)).toBeLessThan(0.4)
    })
})

// ═════════ The turn models ═════════
describe('turn models (D1 bands)', () => {
    const w = 2.926629, rc = 2.04725, th = Math.PI / 2, mu = 0.18

    it('Central ODE step matches the doc per-turn constants (§2.4)', () => {
        // capstan 1.326765, additive term 1.9578
        const out = turnStep(9.7408, mu, mu, w, rc, th, 'central', 1.25)
        expect(out).toBeCloseTo(9.7408 * 1.326765 + 1.9578, 3)
    })

    it('Low = flat arc only: +1.6941 per turn (§2.4)', () => {
        const out = turnStep(10, mu, mu, w, rc, th, 'low', 1.25)
        expect(out - 10).toBeCloseTo(1.6941, 3)
    })

    it('High = width-ratio amplifier 1.423943 + flat arc (§2.4)', () => {
        const out = turnStep(10, mu, mu, w, rc, th, 'high', 1.25001)
        expect(out).toBeCloseTo(10 * 1.423943 + 1.6941, 3)
    })

    it('Central degenerates to Low as μ_g → 0', () => {
        const central = turnStep(10, mu, 1e-12, w, rc, th, 'central', 1.25)
        const low = turnStep(10, mu, 0, w, rc, th, 'low', 1.25)
        expect(central).toBeCloseTo(low, 6)
    })

    it('band ordering holds on every scenario: Low < Central < High (turns present)', () => {
        for (const s of calculateAllScenarios(a1)) {
            expect(s.result.lowLbf).toBeLessThan(s.result.centralLbf)
            expect(s.result.centralLbf).toBeLessThan(s.result.highLbf)
        }
    })
})

// ═════════ Return segmentation + ordering ═════════
describe('segmented return and ordering toggle', () => {
    it('remainder segment fills to the loop invariant', () => {
        const segs = resolveReturnSegments(a1, 260)
        expect(segs[0].lengthIn).toBe(100)
        expect(segs[1].lengthIn).toBeCloseTo(160, 6)
    })

    it('roller μ beats slider μ: all-roller return pulls less than all-slider', () => {
        const roller = calculateBeltPull({ ...outfeed, returnSegments: [{ lengthIn: null, support: 'roller' }] })
        const slider = calculateBeltPull({ ...outfeed, returnSegments: [{ lengthIn: null, support: 'slider' }] })
        expect(roller.centralLbf).toBeLessThan(slider.centralLbf)
    })

    it('worst-case ordering ≥ actual ordering (straights after turns help in actual)', () => {
        const wc = calculateBeltPull({ ...outfeed, ordering: 'worst-case' })
        const actual = calculateBeltPull({ ...outfeed, ordering: 'actual' })
        expect(wc.centralLbf).toBeGreaterThan(actual.centralLbf)
    })

    it('back tension defaults to 0 for catenary take-up', () => {
        expect(defaultBeltPullConfig.backTensionLbfPerFtWidth).toBe(0)
        expect(calculateBeltPull(a1).backTensionLbf).toBe(0)
    })
})

// ═════════ Service factors ═════════
describe('service factor framework (Forbo additive)', () => {
    it('bearinged noses carry no adder; static noses +0.4 each', () => {
        const base = calculateBeltPull(a1)
        expect(base.serviceFactor).toBeCloseTo(1.0, 9) // 80 fpm, horizontal, bearinged
        const oneStatic = calculateBeltPull({ ...a1, serviceFactors: { ...a1.serviceFactors, noseInfeed: 'static' } })
        expect(oneStatic.serviceFactor).toBeCloseTo(1.4, 9)
    })

    it('speed adder auto-triggers above 30 m/min (98.4 ft/min)', () => {
        expect(CURVE_SPEED_CEIL_FPM).toBeCloseTo(98.43, 1)
        const fast = calculateBeltPull(outfeed) // 140 fpm
        expect(fast.serviceFactor).toBeCloseTo(1.2, 9)
        expect(fast.sfAdders.find((x) => x.label.includes('Speed'))!.active).toBe(true)
    })

    it('elevation adder auto-triggers on net rise', () => {
        const inclined = calculateBeltPull({
            ...a1,
            sections: [...a1.sections, { kind: 'incline', lengthIn: 48, riseIn: 12 } as InclineSection],
        })
        expect(inclined.sfAdders.find((x) => x.label === 'Elevation')!.active).toBe(true)
    })

    it('torque floors: continuous = Central × SF; peak = 1.25 × Central × SF', () => {
        const r = calculateBeltPull(a1)
        expect(r.continuousFloorLbf).toBeCloseTo(r.centralLbf * r.serviceFactor, 9)
        expect(r.peakFloorLbf).toBeCloseTo(1.25 * r.centralLbf * r.serviceFactor, 9)
    })
})

// ═════════ New checks ═════════
describe('curve capacity, speed ceiling, belt build, collapse factor', () => {
    it('curve capacity = straight rating × width × derate; checked at High', () => {
        const r = calculateBeltPull(a1)
        const expected = 205 * (12.283 * 0.0254) * 2.20462 * 0.23
        expect(r.curveCapacityLbf!).toBeCloseTo(expected, 1)
        expect(r.maxInCurveHighLbf!).toBeCloseTo(r.highLbf, 6) // worst = exit of last turn
        expect(r.curveCapacityUtilPct!).toBeGreaterThan(0)
    })

    it('sign-off §4 magnitudes: A1 old duty High 35.66 lbf ≈ 158.6 N in-curve', () => {
        const r = calculateBeltPull({ ...a1, throughputLbHr: 6000 })
        expect(r.maxInCurveHighLbf! * 4.44822).toBeCloseTo(158.6, 0)
    })

    it('PP build: weight ×0.75, straight capacity ×0.65', () => {
        const pom = calculateBeltPull(a1)
        const pp = calculateBeltPull({ ...a1, beltBuild: 'pp' })
        expect(pp.beltWeightPerFt).toBeCloseTo(pom.beltWeightPerFt * 0.75, 9)
        expect(pp.curveCapacityLbf!).toBeCloseTo(pom.curveCapacityLbf! * 0.65, 6)
        expect(pp.centralLbf).toBeLessThan(pom.centralLbf)
    })

    it('parametric ceiling replaces the flat rule: light outfeed corner earns 140 fpm on virgin rails', () => {
        // Outfeed corner pressure ≈ 1.15 psi (14 lbf tension) → virgin ceiling ≈ 157 fpm:
        // the old flat 98-fpm rule would have flagged this; the parametric model passes it
        const of = calculateBeltPull(outfeed) // 140 fpm
        expect(of.cornerTier).toBe('ok-virgin')
        expect(of.curveSpeedExceeded).toBe(false)
        expect(of.vCeilVirginFpm!).toBeGreaterThan(140)
        // The heavily-loaded A1 corner at 100 fpm still requires DG-321
        const heavy = calculateBeltPull({ ...a1, beltSpeedFpm: 100 })
        expect(heavy.curveSpeedExceeded).toBe(true)
        expect(calculateBeltPull({ ...a1, beltSpeedFpm: 100, beltBuild: 'pp' }).curveSpeedExceeded).toBe(false)
    })

    it('collapse factor: A1 ratio 1.500 = at-minimum (tolerance-critical), below = violation', () => {
        expect(calculateBeltPull(a1).collapseStatus).toBe('at-minimum')
        const tight = calculateBeltPull({
            ...a1,
            sections: a1.sections.map((s) => isIncline(s) ? s : { ...s, insideRadiusIn: 15 }),
        })
        expect(tight.collapseStatus).toBe('violation')
        const roomy = calculateBeltPull({
            ...a1,
            sections: a1.sections.map((s) => isIncline(s) ? s : { ...s, insideRadiusIn: 24 }),
        })
        expect(roomy.collapseStatus).toBe('compliant')
    })

    it('arc-length dimension detector (I11): 48.237" ≈ π/2 × 30.7085" outside radius', () => {
        const cfg = {
            ...a1,
            sections: a1.sections.map((s, i) => (i === 0 && !isIncline(s)) ? { ...s, straightAfterIn: 48.237 } : s),
        }
        const r = calculateBeltPull(cfg as BeltPullConfig)
        expect(r.warnings.some((w) => w.includes('ARC LENGTH'))).toBe(true)
    })
})

// ═════════ Drive helpers ═════════
describe('sprocket + thermal helpers', () => {
    it('chordal PD: 50mm pitch — 11T = 177.47mm, 10T = 161.8mm', () => {
        expect(chordalPdMm(50, 11)).toBeCloseTo(177.47, 1)
        expect(chordalPdMm(50, 10)).toBeCloseTo(161.8, 1)
    })

    it('sprocket screens catch the impossible 5.90" PD (doc I3)', () => {
        const fails = sprocketScreens(149.9, 11, 50, 167, 165)
        expect(fails.length).toBe(2) // PD ≤ bore, and back-solved pitch 42.2mm off by >2%
        expect(sprocketScreens(177.47, 11, 50, 167, 165)).toHaveLength(0)
    })

    it('thermal uplift: √((80+40−amb)/80), capped 1.25', () => {
        expect(thermalUpliftFactor(40)).toBeCloseTo(1.0, 9)
        expect(thermalUpliftFactor(20)).toBeCloseTo(Math.sqrt(1.25), 6)
        expect(thermalUpliftFactor(-40)).toBe(1.25)
    })
})

// ═════════ Retained behaviors ═════════
describe('retained: drag model, solver, inclines, bulk', () => {
    it('solveRailMu round-trips on the Central band', () => {
        const known = { ...a1, frictions: { ...a1.frictions, rail: 0.23 } }
        const target = calculateBeltPull(known).centralLbf
        expect(solveRailMu(a1, target)!).toBeCloseTo(0.23, 4)
    })

    it('ratio-scaled drag model raises Central on tight turns', () => {
        const scaled = { ...a1, turnDragModel: { mode: 'ratio-scaled' as const, refRatio: 2.2, exponent: 0.5 } }
        expect(calculateBeltPull(scaled).centralLbf).toBeGreaterThan(calculateBeltPull(a1).centralLbf)
        expect(effectiveRailMu(0.18, 1.5, scaled.turnDragModel)).toBeCloseTo(0.18 * Math.sqrt(2.2 / 1.5), 9)
    })

    it('empty-belt incline nets to friction only over the loop (regain works)', () => {
        // 10 ft along belt, 5 ft rise, no product, all-slider return, T0 = 0:
        // carry: 0.18·1.64·√(10²−5²) + 1.64·5 ; return: 0.18·1.64·10 − 1.64·5
        const cfg: BeltPullConfig = {
            ...straight, infeedStraightIn: 0,
            sections: [{ kind: 'incline', lengthIn: 120, riseIn: 60 }],
            returnSegments: [{ lengthIn: null, support: 'slider' }],
        }
        const expected = 0.18 * 1.64 * Math.sqrt(75) + 1.64 * 5 + 0.18 * 1.64 * 10 - 1.64 * 5
        expect(calculateBeltPull(cfg).centralLbf).toBeCloseTo(expected, 6)
    })

    it('bulk (bed) mode unchanged: 45 lb/ft³ × 10×2in bed = 6.25 lb/ft', () => {
        const r = calculateBeltPull({
            ...straight, infeedStraightIn: 120, loadMode: 'bulk',
            bulkDensityLbFt3: 45, bedDepthIn: 2, edgeMarginIn: 1, beltSpeedFpm: 60,
        })
        expect(r.productLoadPerFt).toBeCloseTo(6.25, 4)
        expect(r.bulkAchievedLbHr!).toBeCloseTo(22500, 1)
    })

    it('geometry helpers unchanged', () => {
        expect(turnArcIn({ angleDeg: 90, insideRadiusIn: 18.425, direction: 'L', straightAfterIn: 0 }, 12.283))
            .toBeCloseTo(24.5665 * Math.PI / 2, 2)
        expect(carrywayLengthIn(straight)).toBeCloseTo(120, 6)
        expect(pathRiseIn(straight)).toBe(0)
    })

    it('wear scenarios still derive from material bases', () => {
        const std = { carrywayBase: 0.18, railBase: 0.18, returnBase: 0.18 }
        const worn = scenarioFrictions(std, wearFactors.find((f) => f.id === 'worn')!)
        expect(worn.carryway).toBeCloseTo(0.25, 9)
    })
})

describe('parametric corner speed ceiling (thermal q = μ·p·V)', () => {
    it('self-check: A1 baseline reproduces the empirical ~80 ft/min shop rule', () => {
        // p = 30.7515 lbf / (24.567" × 0.5") = 2.504 psi at old duty
        // V_virgin = 0.75 × 98.43 × (0.18 × 2.44)/(0.18 × 2.504) ≈ 72 ft/min
        const r = calculateBeltPull({ ...a1, throughputLbHr: 6000 })
        expect(r.cornerPressurePsi!).toBeCloseTo(30.7515 / (24.5665 * 0.5), 2)
        expect(r.vCeilVirginFpm!).toBeGreaterThan(65)
        expect(r.vCeilVirginFpm!).toBeLessThan(80)
    })

    it('DG-321 buys speed in exact μ proportion: ceiling ×(0.18/0.11)', () => {
        const r = calculateBeltPull(a1)
        expect(r.vCeilDg321Fpm! / r.vCeilVirginFpm!).toBeCloseTo(0.18 / 0.11, 6)
    })

    it('tier progression with speed: ok-virgin → dg321-required → engineering-review → beyond-envelope', () => {
        const at = (v: number) => calculateBeltPull({ ...a1, beltSpeedFpm: v }).cornerTier
        expect(at(50)).toBe('ok-virgin')
        expect(at(100)).toBe('dg321-required')
        expect(at(160)).toBe('engineering-review')
        expect(at(250)).toBe('beyond-envelope')
    })

    it('fail-safe: higher tension (throughput) lowers the ceiling; bigger radius raises it', () => {
        const base = calculateBeltPull(a1)
        const heavy = calculateBeltPull({ ...a1, throughputLbHr: 9000 })
        expect(heavy.vCeilVirginFpm!).toBeLessThan(base.vCeilVirginFpm!)
        const roomy = calculateBeltPull({
            ...a1,
            sections: a1.sections.map((s2) => isIncline(s2) ? s2 : { ...s2, insideRadiusIn: 24.6 }),
        })
        expect(roomy.vCeilVirginFpm!).toBeGreaterThan(base.vCeilVirginFpm!)
    })

    it('hard cap at 200 ft/min for tension-managed corners; aged ceiling < clean', () => {
        const light = calculateBeltPull({ ...a1, loadMode: 'direct', directLoadLbf: 0, backTensionLbfPerFtWidth: 0 })
        expect(light.vCeilDg321Fpm!).toBeLessThanOrEqual(200)
        const r = calculateBeltPull(a1)
        expect(r.vCeilAgedFpm!).toBeLessThan(r.vCeilVirginFpm!) // worn tension degrades the ceiling
    })

    it('DG-321 selection satisfies the dg321-required tier (no REQUIRED warning)', () => {
        const std = calculateBeltPull({ ...a1, beltSpeedFpm: 100 })
        expect(std.warnings.some((w) => w.includes('REQUIRED'))).toBe(true)
        const dg = calculateBeltPull({ ...a1, beltSpeedFpm: 100, turnRailMaterial: 'dg321' })
        expect(dg.warnings.some((w) => w.includes('REQUIRED'))).toBe(false)
        expect(dg.curveSpeedExceeded).toBe(false)
    })

    it('no turns → no corner model; straight conveyors are never gated', () => {
        const r = calculateBeltPull({ ...straight, beltSpeedFpm: 300 })
        expect(r.cornerTier).toBeNull()
        expect(r.dg321Required).toBe(false)
        expect(r.railHeatWorstW).toBeNull()
    })

    it('rail heat index scales exactly 2× with speed at fixed tension', () => {
        const base = { ...a1, loadMode: 'direct' as const, directLoadLbf: 30 }
        const slow = calculateBeltPull({ ...base, beltSpeedFpm: 80 })
        const fast = calculateBeltPull({ ...base, beltSpeedFpm: 160 })
        expect(fast.railHeatWorstW!).toBeCloseTo(slow.railHeatWorstW! * 2, 6)
    })
})

// ═════════ Load model: product type, per-section loads, flighted pockets ═════════
import {
    pocketWedge, pocketCapacityLb, resolveProductType, resolveMaxPlainIncline, inclineSlopeDeg, pathSummary,
} from './beltPull'

describe('per-section loads keep the legacy spread unless a section owns its load', () => {
    it('no pockets / overrides → every carry piece carries the uniform lb/ft and the fixtures are untouched', () => {
        const r = calculateBeltPull(a1)
        expect(r.productType).toBe('packages')
        expect(r.sectionLoads.every((s) => s.source === 'uniform')).toBe(true)
        expect(r.sectionLoads.reduce((s, x) => s + x.lbf, 0)).toBeCloseTo(r.productLoadLbf, 9)
        expect(r.centralLbf).toBeCloseTo(26.70, 1)
        expect(r.pockets).toHaveLength(0)
        expect(r.slipSections).toHaveLength(0)
    })

    it('legacy bed-mode config resolves to bulk without the field', () => {
        expect(resolveProductType({ loadMode: 'bulk' })).toBe('bulk')
        expect(resolveProductType({ loadMode: 'rate' })).toBe('packages')
        expect(resolveMaxPlainIncline({ loadMode: 'bulk' })).toBe(20)
        expect(resolveMaxPlainIncline({ loadMode: 'rate', maxPlainInclineDeg: 30 })).toBe(30)
    })

    it('an entered lb/ft on an incline replaces the spread there; direct mode spreads the rest', () => {
        // 120" flat infeed + 120" incline carrying its own 3 lb/ft; 60 lbf direct total goes on the infeed only
        const cfg: BeltPullConfig = {
            ...straight, infeedStraightIn: 120, loadMode: 'direct', directLoadLbf: 60,
            sections: [{ kind: 'incline', lengthIn: 120, riseIn: 24, productLbfPerFt: 3 }],
        }
        const r = calculateBeltPull(cfg)
        const infeed = r.sectionLoads.find((s) => s.index === -1)!
        const incline = r.sectionLoads.find((s) => s.kind === 'incline')!
        expect(infeed.lbfPerFt).toBeCloseTo(6, 9)     // 60 lbf over 10 ft
        expect(incline.lbfPerFt).toBe(3)
        expect(incline.source).toBe('override')
        expect(r.productLoadLbf).toBeCloseTo(60 + 30, 9)
    })

    it('friction and lift are separated: the lift term does not scale with the wear scenario', () => {
        // Empty-belt incline, no product: the worn scenario raises friction only
        const cfg: BeltPullConfig = {
            ...straight, infeedStraightIn: 0, loadMode: 'direct', directLoadLbf: 0,
            sections: [{ kind: 'incline', lengthIn: 120, riseIn: 60 }],
            returnSegments: [{ lengthIn: null, support: 'slider' }],
        }
        const clean = calculateBeltPull(cfg)
        const worn = calculateAllScenarios(cfg).find((s) => s.id === 'worn')!.result
        const wPerFt = clean.beltWeightPerFt
        const frictionClean = 0.18 * wPerFt * (Math.sqrt(75) + 10)
        const frictionWorn = 0.25 * wPerFt * (Math.sqrt(75) + 10)
        expect(clean.centralLbf).toBeCloseTo(frictionClean, 6)   // lift cancels over the loop
        expect(worn.centralLbf).toBeCloseTo(frictionWorn, 6)
    })
})

describe('pocket wedge geometry', () => {
    it('slope at or below repose: full bed h × pitch', () => {
        const w = pocketWedge(2, 12, 30, 35)
        expect(w.areaIn2).toBeCloseTo(24, 9)
        expect(w.fillsPitch).toBe(true)
    })

    it('steep slope, short run: triangle ½·h·run with run = h / tan(slope − repose)', () => {
        // slope 60°, repose 35° → tan 25° = 0.4663; run = 2 / 0.4663 = 4.289 in < 12 in pitch
        const w = pocketWedge(2, 12, 60, 35)
        const run = 2 / Math.tan(25 * Math.PI / 180)
        expect(w.runIn).toBeCloseTo(run, 6)
        expect(w.areaIn2).toBeCloseTo(0.5 * 2 * run, 6)
        expect(w.fillsPitch).toBe(false)
    })

    it('moderate slope, run beyond the pitch: trapezoid p·h − ½·p²·tan(slope − repose)', () => {
        // slope 40°, repose 35° → tan 5° = 0.0875; run = 2 / 0.0875 = 22.9 in > 12 in pitch
        const d = Math.tan(5 * Math.PI / 180)
        const w = pocketWedge(2, 12, 40, 35)
        expect(w.fillsPitch).toBe(true)
        expect(w.areaIn2).toBeCloseTo(12 * 2 - 0.5 * 144 * d, 9)
    })

    it('capacity = wedge × usable width × fill × density; a measured weight overrides it', () => {
        const spec = { flightHeightIn: 2, pitchIn: 12 }
        const geo = pocketCapacityLb(spec, 30, 14, 1, 35, 0.85, 45)
        // full bed 24 in² × (14 − 2) in usable = 288 in³ = 1/6 ft³ × 0.85 × 45 = 6.375 lb
        expect(geo.lb).toBeCloseTo(6.375, 6)
        expect(geo.measured).toBe(false)
        const measured = pocketCapacityLb({ ...spec, lbPerPocketOverride: 4 }, 30, 14, 1, 35, 0.85, 45)
        expect(measured.lb).toBe(4)
        expect(measured.measured).toBe(true)
    })

    it('slope helper', () => {
        expect(inclineSlopeDeg({ kind: 'incline', lengthIn: 120, riseIn: 60 })).toBeCloseTo(30, 6)
        expect(inclineSlopeDeg({ kind: 'incline', lengthIn: 0, riseIn: 60 })).toBe(0)
    })
})

describe('flighted incline: pockets drive the incline load, the infeed keeps the rate', () => {
    // 10 ft flat infeed at 3000 lb/hr @ 60 fpm (0.833 lb/ft), then a 30° flighted incline
    const flighted: BeltPullConfig = {
        ...straight, productType: 'bulk', loadMode: 'rate', throughputLbHr: 3000, beltSpeedFpm: 60,
        infeedStraightIn: 120, beltWidthIn: 14, edgeMarginIn: 1, bulkDensityLbFt3: 45, reposeDeg: 35, pocketFillFraction: 0.85,
        sections: [{ kind: 'incline', lengthIn: 120, riseIn: 60, pocket: { flightHeightIn: 2, pitchIn: 12 } }],
    }

    it('pocket summary: 6.375 lb per pocket, 10 pockets, 6.375 lb/ft, 22,950 lb/hr achievable', () => {
        const r = calculateBeltPull(flighted)
        expect(r.pockets).toHaveLength(1)
        const p = r.pockets[0]
        expect(p.lbPerPocket).toBeCloseTo(6.375, 6)
        expect(p.pocketsOnSection).toBeCloseTo(10, 9)
        expect(p.lbfPerFt).toBeCloseTo(6.375, 6)
        expect(p.achievedLbHr).toBeCloseTo(6.375 * (60 * 12 / 12) * 60, 6)
        expect(r.bulkCapacityLbHr).toBeCloseTo(p.achievedLbHr, 6)
    })

    it('section loads: infeed at the rate spread, incline at pocket capacity; total is their sum', () => {
        const r = calculateBeltPull(flighted)
        const infeed = r.sectionLoads.find((s) => s.index === -1)!
        const incline = r.sectionLoads.find((s) => s.kind === 'incline')!
        expect(infeed.lbfPerFt).toBeCloseTo(3000 / 3600, 9)
        expect(incline.source).toBe('pocket')
        expect(incline.lbfPerFt).toBeCloseTo(6.375, 6)
        expect(r.productLoadLbf).toBeCloseTo(3000 / 3600 * 10 + 6.375 * 10, 6)
    })

    it('pockets lift more than a uniform spread would: pull rises with the heavier incline', () => {
        const plain = calculateBeltPull({ ...flighted, sections: [{ kind: 'incline', lengthIn: 120, riseIn: 60 }], maxPlainInclineDeg: 45 })
        expect(calculateBeltPull(flighted).centralLbf).toBeGreaterThan(plain.centralLbf)
    })

    it('demanded rate above pocket capability warns and names the pockets', () => {
        const r = calculateBeltPull({ ...flighted, throughputLbHr: 40000 })
        expect(r.warnings.some((w) => w.includes('flight pockets'))).toBe(true)
        expect(calculateBeltPull(flighted).warnings.some((w) => w.includes('exceeds what'))).toBe(false)
    })

    it('a bulk rate config reports bed capacity when bed inputs exist, and warns when the bed cannot keep up', () => {
        const bed = calculateBeltPull({ ...flighted, sections: [], bedDepthIn: 2 })
        // 12 in usable × 2 in = 24 in² = 1/6 ft² × 45 = 7.5 lb/ft × 60 fpm × 60 = 27,000 lb/hr
        expect(bed.bulkAchievedLbHr).toBeCloseTo(27000, 6)
        expect(bed.bulkCapacityLbHr).toBeCloseTo(27000, 6)
        const starved = calculateBeltPull({ ...flighted, sections: [], bedDepthIn: 2, throughputLbHr: 30000 })
        expect(starved.warnings.some((w) => w.includes('the bed'))).toBe(true)
    })

    it('path summary marks the pocketed incline', () => {
        expect(pathSummary(flighted)).toContain('⌸2"@12"')
    })
})

describe('plain-belt slip screen', () => {
    it('bulk on an unflighted 30° incline trips the 20° default; pockets clear it', () => {
        const plain = calculateBeltPull({
            ...straight, productType: 'bulk', loadMode: 'rate', throughputLbHr: 3000, beltSpeedFpm: 60,
            sections: [{ kind: 'incline', lengthIn: 120, riseIn: 60 }],
        })
        expect(plain.slipSections).toEqual([0])
        expect(plain.warnings.some((w) => w.includes('Flights'))).toBe(true)
        const pocketed = calculateBeltPull({
            ...straight, productType: 'bulk', loadMode: 'rate', throughputLbHr: 3000, beltSpeedFpm: 60,
            sections: [{ kind: 'incline', lengthIn: 120, riseIn: 60, pocket: { flightHeightIn: 2, pitchIn: 12 } }],
        })
        expect(pocketed.slipSections).toHaveLength(0)
    })

    it('packages use the 25° default and ask for cleats; an empty belt never slips', () => {
        const steep = calculateBeltPull({ ...straight, loadMode: 'rate', throughputLbHr: 3000, sections: [{ kind: 'incline', lengthIn: 120, riseIn: 60 }] })
        expect(steep.slipSections).toEqual([0])
        expect(steep.warnings.some((w) => w.includes('Cleats'))).toBe(true)
        const gentle = calculateBeltPull({ ...straight, loadMode: 'rate', throughputLbHr: 3000, sections: [{ kind: 'incline', lengthIn: 120, riseIn: 40 }] })
        expect(gentle.slipSections).toHaveLength(0) // 19.5°
        const empty = calculateBeltPull({ ...straight, loadMode: 'direct', directLoadLbf: 0, sections: [{ kind: 'incline', lengthIn: 120, riseIn: 60 }] })
        expect(empty.slipSections).toHaveLength(0)
    })
})

describe('engineer override on a steep plain incline', () => {
    it('allowPlainIncline silences the slip warning and records an assumption instead', () => {
        const cfg: BeltPullConfig = {
            ...straight, productType: 'bulk', loadMode: 'rate', throughputLbHr: 3000, beltSpeedFpm: 60,
            sections: [{ kind: 'incline', lengthIn: 120, riseIn: 60, allowPlainIncline: true }],
        }
        const r = calculateBeltPull(cfg)
        expect(r.slipSections).toHaveLength(0)
        expect(r.warnings.some((w) => w.includes('slides back'))).toBe(false)
        expect(r.assumptions.some((a) => a.includes('engineer accepted'))).toBe(true)
    })

    it('a Z path: infeed straight, incline, discharge straight — carry length sums all three', () => {
        const cfg: BeltPullConfig = {
            ...straight, infeedStraightIn: 60,
            sections: [{ kind: 'incline', lengthIn: 120, riseIn: 40 }, { kind: 'straight', lengthIn: 36 }],
        }
        expect(carrywayLengthIn(cfg)).toBeCloseTo(216, 9)
        const r = calculateBeltPull(cfg)
        expect(r.sectionLoads.map((s) => s.kind)).toEqual(['straight', 'incline', 'straight'])
        expect(pathSummary(cfg)).toBe('60in — ↗120in+40in — 36in')
    })
})
