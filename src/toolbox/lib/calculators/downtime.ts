/**
 * Line downtime cost — pure calculation module
 * @module lib/calculators/downtime
 *
 * What a stopped packaging line costs per minute, per shift, and per year,
 * and what a given reduction is worth.
 *
 *   lost margin per minute = units/min × margin per unit
 *   labor per minute       = crew × labor rate / 60
 *   overhead per minute    = overhead per hour / 60
 *   cost per minute        = lost margin + labor + overhead
 *   minutes per year       = minutes per shift × shifts/day × days/year
 */

export interface DowntimeInput {
    unitsPerMinute: number
    marginPerUnit: number
    crewSize: number
    laborRatePerHour: number
    /** Fixed overhead allocated to the line, $/hour (null = 0) */
    overheadPerHour: number | null
    downtimeMinutesPerShift: number
    shiftsPerDay: number
    daysPerYear: number
    /** Downtime reduction to value, % (default 25) */
    reductionPct?: number
}

export interface DowntimeResult {
    lostMarginPerMin: number
    laborPerMin: number
    overheadPerMin: number
    costPerMinute: number
    minutesPerShift: number
    minutesPerYear: number
    hoursPerYear: number
    perShift: number
    perDay: number
    perYear: number
    reductionPct: number
    savingsPerYear: number
    /** Worth of one percentage point of line availability, $/year (minutes/year ÷ downtime % → per point) */
    perAvailabilityPoint: number | null
}

export function downtimeCost(i: DowntimeInput): DowntimeResult | null {
    if (!(i.unitsPerMinute >= 0) || !(i.marginPerUnit >= 0) || !(i.crewSize >= 0) || !(i.laborRatePerHour >= 0)) return null
    if (!(i.downtimeMinutesPerShift >= 0) || !(i.shiftsPerDay > 0) || !(i.daysPerYear > 0)) return null
    const lostMarginPerMin = i.unitsPerMinute * i.marginPerUnit
    const laborPerMin = (i.crewSize * i.laborRatePerHour) / 60
    const overheadPerMin = (i.overheadPerHour ?? 0) / 60
    const costPerMinute = lostMarginPerMin + laborPerMin + overheadPerMin
    const minutesPerYear = i.downtimeMinutesPerShift * i.shiftsPerDay * i.daysPerYear
    const reductionPct = i.reductionPct ?? 25
    const perYear = costPerMinute * minutesPerYear
    // One availability point = 1% of scheduled minutes (8 h shifts assumed for the point value)
    const scheduledMinutesPerYear = 480 * i.shiftsPerDay * i.daysPerYear
    return {
        lostMarginPerMin, laborPerMin, overheadPerMin, costPerMinute,
        minutesPerShift: i.downtimeMinutesPerShift,
        minutesPerYear,
        hoursPerYear: minutesPerYear / 60,
        perShift: costPerMinute * i.downtimeMinutesPerShift,
        perDay: costPerMinute * i.downtimeMinutesPerShift * i.shiftsPerDay,
        perYear,
        reductionPct,
        savingsPerYear: perYear * (reductionPct / 100),
        perAvailabilityPoint: costPerMinute * scheduledMinutesPerYear * 0.01,
    }
}
