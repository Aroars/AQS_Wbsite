/**
 * Product giveaway — pure calculation module
 * @module lib/calculators/giveaway
 *
 * What overfill costs. Every package filled above its declared weight gives
 * product away; at line rates that is tonnes and dollars a year, which is the
 * case for a checkweigher feeding back to the filler.
 *
 *   giveaway per package = actual fill − target fill
 *   packages per year    = packages/min × 60 × hours/day × days/year
 *   giveaway per year    = per package × packages per year
 *   cost per year        = giveaway (lb) × product cost per lb
 */

export type WeightUnit = 'g' | 'oz' | 'lb' | 'kg'
export const WEIGHT_UNITS: readonly WeightUnit[] = ['g', 'oz', 'lb', 'kg']
const TO_LB: Record<WeightUnit, number> = { g: 1 / 453.59237, oz: 1 / 16, lb: 1, kg: 2.20462262 }

export function toLb(value: number, unit: WeightUnit): number {
    return value * TO_LB[unit]
}
export function fromLb(lb: number, unit: WeightUnit): number {
    return lb / TO_LB[unit]
}

export interface GiveawayInput {
    targetWeight: number
    actualWeight: number
    unit: WeightUnit
    packagesPerMinute: number
    hoursPerDay: number
    daysPerYear: number
    /** Product cost per pound (null = weight only) */
    costPerLb: number | null
    /** Overfill a checkweigher-controlled filler holds, in `unit` (null = no comparison) */
    improvedOverfill?: number | null
    /** Installed cost of the checkweigher or feedback system, for payback (null = skip) */
    systemCost?: number | null
}

export interface GiveawayResult {
    overfillPerPkg: number
    overfillPct: number
    packagesPerYear: number
    perHourLb: number
    perDayLb: number
    perYearLb: number
    perYearCost: number | null
    improved: {
        overfillPerPkg: number
        perYearLb: number
        perYearCost: number | null
        savingsLb: number
        savingsCost: number | null
        paybackMonths: number | null
    } | null
}

export function giveaway(i: GiveawayInput): GiveawayResult | null {
    if (!(i.targetWeight > 0) || !(i.actualWeight >= 0) || !(i.packagesPerMinute > 0) || !(i.hoursPerDay > 0) || !(i.daysPerYear > 0)) return null
    const overfillPerPkg = i.actualWeight - i.targetWeight
    const perPkgLb = toLb(overfillPerPkg, i.unit)
    const packagesPerHour = i.packagesPerMinute * 60
    const packagesPerYear = packagesPerHour * i.hoursPerDay * i.daysPerYear
    const perYearLb = perPkgLb * packagesPerYear
    const cost = (lb: number) => (i.costPerLb !== null && i.costPerLb >= 0 ? lb * i.costPerLb : null)
    let improved: GiveawayResult['improved'] = null
    if (i.improvedOverfill !== null && i.improvedOverfill !== undefined && i.improvedOverfill >= 0) {
        const impLb = toLb(i.improvedOverfill, i.unit) * packagesPerYear
        const savingsLb = perYearLb - impLb
        const savingsCost = cost(savingsLb)
        const paybackMonths = savingsCost !== null && savingsCost > 0 && i.systemCost !== null && i.systemCost !== undefined && i.systemCost > 0
            ? (i.systemCost / savingsCost) * 12
            : null
        improved = { overfillPerPkg: i.improvedOverfill, perYearLb: impLb, perYearCost: cost(impLb), savingsLb, savingsCost, paybackMonths }
    }
    return {
        overfillPerPkg,
        overfillPct: (overfillPerPkg / i.targetWeight) * 100,
        packagesPerYear,
        perHourLb: perPkgLb * packagesPerHour,
        perDayLb: perPkgLb * packagesPerHour * i.hoursPerDay,
        perYearLb,
        perYearCost: cost(perYearLb),
        improved,
    }
}
