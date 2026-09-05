/**
 * Hub Motor Data - OneMotion Index
 * Data for hub motor (motorized roller) selection
 *
 * Length = conveyor width (between frame rails)
 * Torque/belt pull interpolated linearly between min and max length
 */

export const hubMotorData = [
    {
        series: '45 Series',
        diameter: 45,           // Roller diameter in mm
        withSprocket: 70,       // Diameter with sprocket in mm
        minLength: 197,         // Min conveyor width (mm)
        maxLength: 838.2,       // Max conveyor width (mm)
        minRpm: 9,
        rpm60Hz: 514,
        // At min length
        minTorque: 1.4,         // N-m
        minPeakTorque: 2.8,     // N-m
        minBeltPull: 40,        // N
        // At max length
        maxTorque: 5.6,         // N-m
        maxPeakTorque: 11.2,    // N-m
        maxBeltPull: 160        // N
    },
    {
        series: '58 Series',
        diameter: 58,
        withSprocket: 83,
        minLength: 165,
        maxLength: 1010,
        minRpm: 9,
        rpm60Hz: 514,
        minTorque: 3,
        minPeakTorque: 6,
        minBeltPull: 72.3,
        maxTorque: 10.7,
        maxPeakTorque: 21.4,
        maxBeltPull: 257.8
    },
    {
        series: '81 Series',
        diameter: 81,
        withSprocket: 106,
        minLength: 150,
        maxLength: 1320.88,
        minRpm: 9,
        rpm60Hz: 514,
        minTorque: 3,
        minPeakTorque: 6,
        minBeltPull: 56.6,
        maxTorque: 40,
        maxPeakTorque: 80,
        maxBeltPull: 754.7
    },
    {
        series: '120 Series',
        diameter: 120,
        withSprocket: 145,
        minLength: 165,
        maxLength: 1250,
        minRpm: 9,
        rpm60Hz: 514,
        minTorque: 8,
        minPeakTorque: 16,
        minBeltPull: 110.3,
        maxTorque: 80,
        maxPeakTorque: 160,
        maxBeltPull: 1103.4
    },
    {
        series: '135 Series',
        diameter: 135,
        withSprocket: 160,
        minLength: 158.8,
        maxLength: 1320,
        minRpm: 4,
        rpm60Hz: 257,
        minTorque: 10,
        minPeakTorque: 20,
        minBeltPull: 125,
        maxTorque: 160,
        maxPeakTorque: 320,
        maxBeltPull: 2000
    },
    {
        series: '165 Series',
        diameter: 165,
        withSprocket: 190,
        minLength: 60.3,
        maxLength: 1016,
        minRpm: 4,
        rpm60Hz: 257,
        minTorque: 10,
        minPeakTorque: 20,
        minBeltPull: 105.3,
        maxTorque: 240,
        maxPeakTorque: 480,
        maxBeltPull: 2526.3
    },
    {
        series: '215 Series',
        diameter: 215,
        withSprocket: 240,
        minLength: 135,
        maxLength: 711.2,
        minRpm: 2,
        rpm60Hz: 138,
        minTorque: 30,
        minPeakTorque: 60,
        minBeltPull: 250,
        maxTorque: 480,
        maxPeakTorque: 960,
        maxBeltPull: 4000
    }
]

/**
 * Interpolate motor specs based on conveyor width
 * Linear interpolation between min and max length values
 *
 * @param {Object} motor - Motor series data
 * @param {number} width - Conveyor width in mm
 * @returns {Object} - Interpolated motor specs at given width
 */
export function interpolateMotorSpecs(motor: any, width: any) {
    // Clamp width to motor's range
    const clampedWidth = Math.max(motor.minLength, Math.min(motor.maxLength, width))

    // Calculate interpolation factor (0 = min, 1 = max)
    const range = motor.maxLength - motor.minLength
    const factor = range > 0 ? (clampedWidth - motor.minLength) / range : 0

    return {
        series: motor.series,
        diameter: motor.diameter,
        withSprocket: motor.withSprocket,
        width: clampedWidth,
        minRpm: motor.minRpm,
        rpm60Hz: motor.rpm60Hz,
        torque: motor.minTorque + factor * (motor.maxTorque - motor.minTorque),
        peakTorque: motor.minPeakTorque + factor * (motor.maxPeakTorque - motor.minPeakTorque),
        beltPull: motor.minBeltPull + factor * (motor.maxBeltPull - motor.minBeltPull),
        minLength: motor.minLength,
        maxLength: motor.maxLength
    }
}

/**
 * Check if a motor can physically fit the conveyor width
 *
 * @param {Object} motor - Motor series data
 * @param {number} width - Conveyor width in mm
 * @returns {string} - 'fits', 'too-narrow', or 'too-wide'
 */
export function checkMotorFit(motor: any, width: any) {
    if (width < motor.minLength) return 'too-narrow'
    if (width > motor.maxLength) return 'too-wide'
    return 'fits'
}

/**
 * Find suitable hub motors based on required torque and conveyor width
 * TORQUE FIT IS MANDATORY - width can be a near miss but torque cannot
 * Prioritizes smallest motor that meets torque requirement
 *
 * @param {number} requiredTorque - Required torque in N-m
 * @param {number} conveyorWidth - Conveyor width in mm
 * @param {boolean} usePeakTorque - Match against peak torque (for accumulation) vs continuous
 * @param {number} safetyFactor - Safety factor multiplier (default 1.5 for OneMotion thermal concerns)
 * @returns {Object} - { recommended: motor, alternatives: [], nearMiss: motor|null }
 */
export function selectHubMotor(requiredTorque: any, conveyorWidth: any, usePeakTorque: boolean = false, safetyFactor: number = 1.5) {
    const suitable: any[] = []
    const nearMiss: any[] = []

    // Apply safety factor to required torque
    const torqueWithSafety = requiredTorque * safetyFactor

    hubMotorData.forEach(motor => {
        const fit = checkMotorFit(motor, conveyorWidth)
        const specs = interpolateMotorSpecs(motor, conveyorWidth)
        const availableTorque = usePeakTorque ? specs.peakTorque : specs.torque

        // Calculate safety factor achieved (available / required)
        const actualSafetyFactor = requiredTorque > 0 ? availableTorque / requiredTorque : 999

        const result = {
            ...specs,
            fit: fit,
            meetsTorque: availableTorque >= requiredTorque,
            meetsTorqueWithSafety: availableTorque >= torqueWithSafety,
            torqueMargin: requiredTorque > 0 ? ((availableTorque - requiredTorque) / requiredTorque * 100) : 100,
            safetyFactor: actualSafetyFactor,
            requiredTorque: requiredTorque,
            requiredTorqueWithSafety: torqueWithSafety
        }

        // TORQUE IS MANDATORY - must meet base torque requirement
        // Width fit can be a near miss for motors that meet torque
        if (availableTorque >= requiredTorque) {
            if (fit === 'fits') {
                suitable.push(result)
            } else {
                // Has torque but doesn't fit width - this is a near miss
                nearMiss.push(result)
            }
        } else if (availableTorque >= requiredTorque * 0.8 && fit === 'fits') {
            // Fits width but torque is close (within 80%) - near miss
            nearMiss.push(result)
        }
    })

    // Sort suitable by:
    // 1. Meets safety factor (1.5x) first
    // 2. Then by diameter (smallest first)
    // 3. Then by torque margin
    suitable.sort((a, b) => {
        // Prioritize motors meeting safety factor
        if (a.meetsTorqueWithSafety && !b.meetsTorqueWithSafety) return -1
        if (b.meetsTorqueWithSafety && !a.meetsTorqueWithSafety) return 1
        // Then smallest diameter
        if (a.diameter !== b.diameter) return a.diameter - b.diameter
        // Then lowest margin (closest fit without being too big)
        return a.torqueMargin - b.torqueMargin
    })

    // Sort near miss by:
    // 1. Has torque but wrong width (better than fits but lacks torque)
    // 2. Then by how close to working
    nearMiss.sort((a, b) => {
        // Prioritize ones with torque (wrong width) over ones without torque (fits)
        if (a.meetsTorque && !b.meetsTorque) return -1
        if (b.meetsTorque && !a.meetsTorque) return 1
        // Then by diameter
        return a.diameter - b.diameter
    })

    return {
        recommended: suitable.length > 0 ? suitable[0] : null,
        alternatives: suitable.slice(1),
        nearMiss: nearMiss.length > 0 ? nearMiss[0] : null
    }
}

/**
 * Get all hub motor series with specs at a given width
 *
 * @param {number} conveyorWidth - Conveyor width in mm
 * @returns {Array} - Array of motor specs at the given width
 */
export function getAllMotorsAtWidth(conveyorWidth: any) {
    return hubMotorData.map(motor => {
        const fit = checkMotorFit(motor, conveyorWidth)
        const specs = interpolateMotorSpecs(motor, conveyorWidth)
        return { ...specs, fit }
    })
}
