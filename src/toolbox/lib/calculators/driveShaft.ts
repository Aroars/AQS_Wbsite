/**
 * Drive shaft deflection & twist — pure calculation module
 * @module lib/calculators/driveShaft
 *
 * A modular belt drive shaft is a simply supported beam between its bearings
 * carrying the belt pull spread across the belt width, and a torsion bar
 * carrying the drive torque from the driven end to the far sprocket.
 *
 *   Square a:  I = a⁴/12,  c = a/2,  J_t = 0.1406·a⁴,  τ = T / (0.208·a³)
 *   Round d:   I = πd⁴/64, c = d/2,  J   = πd⁴/32,     τ = T·(d/2) / J
 *   Deflection, load W uniform over the central width w of a span L:
 *       δ = W (8L³ − 4L·w² + w³) / (384·E·I)        (w = L → 5WL³/384EI)
 *       M_max = W (2L − w) / 8,  σ = M·c / I
 *   Twist:  θ = T·L_t / (G·J_t)  radians, over the torqued length L_t
 *
 * Limits default to 0.10 in deflection and 1.0° twist; the belt manufacturer's
 * design guide governs, so both are editable and shown as utilisation.
 */

export type ShaftShape = 'square' | 'round'

export interface ShaftMaterial {
    id: string
    label: string
    /** Young's modulus, psi */
    e: number
    /** Shear modulus, psi */
    g: number
    /** Yield strength, psi (allowable taken as yield / 2) */
    yieldPsi: number
}

export const shaftMaterials: ShaftMaterial[] = [
    { id: 'ss304', label: '304 stainless', e: 28.0e6, g: 11.2e6, yieldPsi: 30000 },
    { id: 'ss316', label: '316 stainless', e: 28.0e6, g: 11.2e6, yieldPsi: 30000 },
    { id: 'cs1018', label: '1018 carbon steel (cold drawn)', e: 29.0e6, g: 11.5e6, yieldPsi: 54000 },
    { id: 'cs1045', label: '1045 carbon steel (cold drawn)', e: 29.0e6, g: 11.5e6, yieldPsi: 77000 },
]

/** Common square drive shaft sizes, inches */
export const SQUARE_SHAFT_SIZES_IN: readonly number[] = [1, 1.25, 1.5, 2, 2.5, 40 / 25.4, 60 / 25.4]

export interface ShaftSection {
    /** Second moment of area, in⁴ */
    i: number
    /** Distance to the extreme fibre, in */
    c: number
    /** Torsion constant, in⁴ */
    jt: number
    /** Torsional shear per unit torque, 1/in³ */
    shearPerTorque: number
}

export function shaftSection(shape: ShaftShape, sizeIn: number): ShaftSection | null {
    if (!(sizeIn > 0)) return null
    if (shape === 'square') {
        const a = sizeIn
        return { i: a ** 4 / 12, c: a / 2, jt: 0.1406 * a ** 4, shearPerTorque: 1 / (0.208 * a ** 3) }
    }
    const d = sizeIn
    const j = (Math.PI * d ** 4) / 32
    return { i: (Math.PI * d ** 4) / 64, c: d / 2, jt: j, shearPerTorque: d / 2 / j }
}

export interface ShaftInput {
    shape: ShaftShape
    sizeIn: number
    materialId: string
    /** Bearing-to-bearing span, in */
    spanIn: number
    /** Width the belt pull acts over (belt width), in */
    loadedWidthIn: number
    /** Total transverse load on the shaft, lbf (belt pull: tight + slack side) */
    loadLbf: number
    /** Drive torque, lb·in */
    torqueLbIn: number
    /** Length under torque, driven end to far sprocket, in (null = loaded width) */
    torqueLengthIn: number | null
    deflectionLimitIn?: number
    twistLimitDeg?: number
}

export interface ShaftResult {
    section: ShaftSection
    material: ShaftMaterial
    deflectionIn: number
    deflectionLimitIn: number
    deflectionUtilPct: number
    bendingMomentLbIn: number
    bendingStressPsi: number
    twistDeg: number
    twistLimitDeg: number
    twistUtilPct: number
    torsionalShearPsi: number
    allowablePsi: number
    stressUtilPct: number
    warnings: string[]
}

export function shaftCheck(i: ShaftInput): ShaftResult | null {
    const section = shaftSection(i.shape, i.sizeIn)
    const material = shaftMaterials.find((m) => m.id === i.materialId) ?? shaftMaterials[0]
    if (!section || !(i.spanIn > 0) || !(i.loadedWidthIn > 0) || !(i.loadLbf >= 0) || !(i.torqueLbIn >= 0)) return null
    const L = i.spanIn
    const w = Math.min(i.loadedWidthIn, L)
    const W = i.loadLbf
    const deflectionIn = (W * (8 * L ** 3 - 4 * L * w ** 2 + w ** 3)) / (384 * material.e * section.i)
    const bendingMomentLbIn = (W * (2 * L - w)) / 8
    const bendingStressPsi = (bendingMomentLbIn * section.c) / section.i
    const lt = i.torqueLengthIn && i.torqueLengthIn > 0 ? i.torqueLengthIn : i.loadedWidthIn
    const twistRad = (i.torqueLbIn * lt) / (material.g * section.jt)
    const twistDeg = (twistRad * 180) / Math.PI
    const torsionalShearPsi = i.torqueLbIn * section.shearPerTorque
    const deflectionLimitIn = i.deflectionLimitIn && i.deflectionLimitIn > 0 ? i.deflectionLimitIn : 0.1
    const twistLimitDeg = i.twistLimitDeg && i.twistLimitDeg > 0 ? i.twistLimitDeg : 1.0
    const allowablePsi = material.yieldPsi / 2
    // von Mises-style combination of bending and torsion against the allowable
    const combined = Math.sqrt(bendingStressPsi ** 2 + 3 * torsionalShearPsi ** 2)
    const warnings: string[] = []
    if (deflectionIn > deflectionLimitIn) warnings.push(`Deflection ${deflectionIn.toFixed(3)} in exceeds the ${deflectionLimitIn} in limit — sprockets will walk and the belt will track off. Go up a shaft size or shorten the span.`)
    if (twistDeg > twistLimitDeg) warnings.push(`Twist ${twistDeg.toFixed(2)}° exceeds the ${twistLimitDeg}° limit — the far sprocket lags the driven end and the belt loads unevenly across its width.`)
    if (combined > allowablePsi) warnings.push(`Combined stress ${(combined / 1000).toFixed(1)} ksi exceeds the ${(allowablePsi / 1000).toFixed(0)} ksi allowable (yield ÷ 2).`)
    return {
        section, material, deflectionIn, deflectionLimitIn,
        deflectionUtilPct: (deflectionIn / deflectionLimitIn) * 100,
        bendingMomentLbIn, bendingStressPsi,
        twistDeg, twistLimitDeg, twistUtilPct: (twistDeg / twistLimitDeg) * 100,
        torsionalShearPsi, allowablePsi,
        stressUtilPct: (combined / allowablePsi) * 100,
        warnings,
    }
}
