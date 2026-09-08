/**
 * Load Definition — what the Belt Load card publishes for the cards downstream.
 * @module lib/calculators/loadDefinition
 *
 * One product, described once: type, rate, speed, and (for bulk) the density,
 * repose angle, and bed the Conveyor Spec flight solver and the Belt Pull march
 * need. Kept deliberately flat so it serializes into the store and a share link.
 */

import type { LoadProductType } from './beltLoad'

export interface LoadDefinition {
    productType: LoadProductType
    throughputLbHr: number
    beltSpeedFpm: number | null
    /** Product weight per foot of belt at speed (null without a speed) */
    lbPerFt: number | null
    // packages
    pieceWeightLb: number | null
    ppm: number | null
    // bulk
    looseDensityLbFt3: number | null
    reposeDeg: number | null
    beltWidthIn: number | null
    bedDepthIn: number | null
    edgeMarginIn: number | null
}

export function parseLoadDefinition(json: string | null | undefined): LoadDefinition | null {
    if (!json) return null
    try {
        const v = JSON.parse(json) as Partial<LoadDefinition>
        if (!v || (v.productType !== 'bulk' && v.productType !== 'packages')) return null
        if (typeof v.throughputLbHr !== 'number' || !(v.throughputLbHr > 0)) return null
        return {
            productType: v.productType,
            throughputLbHr: v.throughputLbHr,
            beltSpeedFpm: typeof v.beltSpeedFpm === 'number' && v.beltSpeedFpm > 0 ? v.beltSpeedFpm : null,
            lbPerFt: typeof v.lbPerFt === 'number' ? v.lbPerFt : null,
            pieceWeightLb: typeof v.pieceWeightLb === 'number' ? v.pieceWeightLb : null,
            ppm: typeof v.ppm === 'number' ? v.ppm : null,
            looseDensityLbFt3: typeof v.looseDensityLbFt3 === 'number' && v.looseDensityLbFt3 > 0 ? v.looseDensityLbFt3 : null,
            reposeDeg: typeof v.reposeDeg === 'number' && v.reposeDeg > 0 ? v.reposeDeg : null,
            beltWidthIn: typeof v.beltWidthIn === 'number' && v.beltWidthIn > 0 ? v.beltWidthIn : null,
            bedDepthIn: typeof v.bedDepthIn === 'number' && v.bedDepthIn > 0 ? v.bedDepthIn : null,
            edgeMarginIn: typeof v.edgeMarginIn === 'number' && v.edgeMarginIn >= 0 ? v.edgeMarginIn : null,
        }
    } catch {
        return null
    }
}

/** One-line description for the "using load from …" banners */
export function describeLoad(d: LoadDefinition): string {
    const rate = `${d.throughputLbHr.toFixed(0)} lb/hr`
    const speed = d.beltSpeedFpm ? ` @ ${d.beltSpeedFpm} ft/min` : ''
    if (d.productType === 'bulk') {
        const dens = d.looseDensityLbFt3 ? `, ${d.looseDensityLbFt3} lb/ft³` : ''
        const repose = d.reposeDeg ? `, ${d.reposeDeg}° repose` : ''
        return `Bulk — ${rate}${speed}${dens}${repose}`
    }
    const piece = d.pieceWeightLb ? `, ${d.pieceWeightLb.toFixed(2)} lb/pkg` : ''
    const ppm = d.ppm ? `, ${d.ppm.toFixed(1)} pkg/min` : ''
    return `Packages — ${rate}${speed}${piece}${ppm}`
}
