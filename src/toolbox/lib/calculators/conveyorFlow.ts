/**
 * Conveyor Flow Calculator - Pure Calculation Functions
 * No UI dependencies - all calculations are pure functions
 * @module calculators/conveyorFlow
 */

import { toBase, defaultFlowState } from '@/toolbox/data/conveyorCardTypes'

/**
 * Create a fresh flow state with default values
 * @returns {object} Empty flow state
 */
export function createEmptyFlowState() {
    return { ...defaultFlowState, issues: [] as string[] }
}

/**
 * Clone a flow state (deep copy issues array)
 * @param {object} state - Flow state to clone
 * @returns {object} Cloned flow state
 */
function cloneFlowState(state: any) {
    return {
        ...state,
        issues: [...(state.issues || [])]
    }
}

/**
 * Calculate Infeed card output
 * Sets initial flow variables based on user inputs
 * Solves for missing variables when possible
 *
 * @param {object} inputs - Card input values
 * @param {object} units - Unit selections for each input
 * @param {object} inputFlowState - Flow state from previous card (ignored for infeed)
 * @returns {object} Calculated flow state
 */
export function calculateInfeed(inputs: any, units: any, _inputFlowState: any) {
    const state: any = createEmptyFlowState()

    // Convert inputs to base units
    let speed = inputs.productSpeed ? toBase(inputs.productSpeed, units.productSpeed, 'speed') : null
    let rate = inputs.productRate ? toBase(inputs.productRate, units.productRate, 'rate') : null
    const length = inputs.productLength ? toBase(inputs.productLength, units.productLength, 'length') : null
    let gap = inputs.productGap ? toBase(inputs.productGap, units.productGap, 'length') : 0
    const weight = inputs.productWeight ? toBase(inputs.productWeight, units.productWeight, 'weight') : null

    // Check if card is in pristine/empty state (no required inputs filled)
    const hasAnyInput = inputs.productSpeed || inputs.productRate || inputs.productLength
    if (!hasAnyInput) {
        // Return neutral state - no errors shown until user starts entering data
        state.feasibility = 'ok'
        state.pristine = true
        return state
    }

    // Validation: need at least length
    if (!length || length <= 0) {
        state.issues.push('Product length is required')
        state.feasibility = 'error'
        return state
    }

    // Calculate pitch
    const pitch = length + gap

    // Solve for missing variables
    if (speed && !rate) {
        // Have speed, calculate rate
        rate = (speed / pitch) * 60  // products per minute
    } else if (rate && !speed) {
        // Have rate, calculate speed
        speed = (rate * pitch) / 60  // m/s
    } else if (!speed && !rate) {
        // Neither provided
        state.issues.push('Need either product speed or product rate')
        state.feasibility = 'error'
        return state
    }

    // If both provided but gap not specified, we can calculate gap
    if (inputs.productSpeed && inputs.productRate && !inputs.productGap) {
        // Given speed and rate, calculate actual gap
        const actualPitch = (speed * 60) / rate
        gap = actualPitch - length
        if (gap < 0) {
            state.issues.push('Speed too slow for target rate (negative gap)')
            state.feasibility = 'error'
        }
    }

    // Check feasibility
    if (speed > 3.0) {
        state.issues.push('Speed exceeds typical maximum (3 m/s)')
        state.feasibility = state.feasibility === 'error' ? 'error' : 'warning'
    }
    if (speed < 0.05 && speed > 0) {
        state.issues.push('Speed below typical minimum')
        state.feasibility = state.feasibility === 'error' ? 'error' : 'warning'
    }
    if (gap < 0) {
        state.issues.push('Negative gap - configuration not feasible')
        state.feasibility = 'error'
    }

    // Build output state
    state.productSpeed = speed || 0
    state.productRate = rate || 0
    state.productLength = length
    state.productGap = Math.max(0, gap)
    state.productWeight = weight
    state.ppm = rate || 0
    state.pph = (rate || 0) * 60
    state.pitch = pitch
    state.gapTimeAvailable = speed > 0 ? gap / speed : 0

    if (state.issues.length === 0) {
        state.feasibility = 'ok'
    }

    return state
}

/**
 * Calculate Split card output
 * Removes percentage of products from flow
 *
 * @param {object} inputs - Card input values
 * @param {object} units - Unit selections
 * @param {object} inputFlowState - Flow state from previous card
 * @returns {object} Calculated flow state
 */
export function calculateSplit(inputs: any, units: any, inputFlowState: any) {
    const state = cloneFlowState(inputFlowState)

    const splitPercent = parseFloat(inputs.splitPercent) || 0
    const adjustMode = inputs.adjustMode || 'Keep Speed'

    if (splitPercent < 0 || splitPercent > 100) {
        state.issues.push('Split percentage must be 0-100')
        state.feasibility = 'error'
        return state
    }

    // Calculate new rate after split
    const splitRatio = 1 - (splitPercent / 100)
    const newRate = state.productRate * splitRatio
    const removedPPM = state.productRate - newRate

    // Update rate
    state.productRate = newRate
    state.ppm = newRate
    state.pph = newRate * 60

    // Handle speed/gap adjustment based on mode
    if (adjustMode === 'Keep Speed') {
        // Speed stays same, gap increases proportionally
        // pitch = speed * 60 / rate
        if (newRate > 0) {
            const newPitch = (state.productSpeed * 60) / newRate
            state.productGap = newPitch - state.productLength
            state.pitch = newPitch
        }
    } else if (adjustMode === 'Keep Gap') {
        // Gap stays same, speed decreases
        const pitch = state.productLength + state.productGap
        state.productSpeed = (newRate * pitch) / 60
    } else if (adjustMode === 'Specify Speed' && inputs.newSpeed) {
        const newSpeed = toBase(inputs.newSpeed, units.newSpeed, 'speed')
        state.productSpeed = newSpeed
        // Recalculate gap
        if (newRate > 0) {
            const newPitch = (newSpeed * 60) / newRate
            state.productGap = newPitch - state.productLength
            state.pitch = newPitch
        }
    } else if (adjustMode === 'Specify Gap' && inputs.newGap) {
        const newGap = toBase(inputs.newGap, units.newGap, 'length')
        state.productGap = newGap
        const pitch = state.productLength + newGap
        state.pitch = pitch
        state.productSpeed = (newRate * pitch) / 60
    }

    // Update gap time
    state.gapTimeAvailable = state.productSpeed > 0 ? state.productGap / state.productSpeed : 0

    // Add info about what was split
    state.splitInfo = {
        percent: splitPercent,
        removedPPM: removedPPM
    }

    // Check feasibility
    if (state.productGap < 0) {
        state.issues.push('Configuration results in negative gap')
        state.feasibility = 'error'
    }

    return state
}

/**
 * Calculate Merge card output
 * Adds products to flow from another line
 *
 * @param {object} inputs - Card input values
 * @param {object} units - Unit selections
 * @param {object} inputFlowState - Flow state from previous card
 * @returns {object} Calculated flow state
 */
export function calculateMerge(inputs: any, units: any, inputFlowState: any) {
    const state = cloneFlowState(inputFlowState)

    const mergeMode = inputs.mergeMode || 'Percent'
    const adjustMode = inputs.adjustMode || 'Increase Speed'

    let addedRate = 0

    if (mergeMode === 'Percent') {
        const mergePercent = parseFloat(inputs.mergePercent) || 0
        addedRate = state.productRate * (mergePercent / 100)
    } else {
        addedRate = parseFloat(inputs.mergePPM) || 0
    }

    const newRate = state.productRate + addedRate

    // Update rate
    state.productRate = newRate
    state.ppm = newRate
    state.pph = newRate * 60

    // Handle adjustment mode
    if (adjustMode === 'Increase Speed') {
        // Gap stays same, speed increases
        const pitch = state.productLength + state.productGap
        state.productSpeed = (newRate * pitch) / 60
    } else if (adjustMode === 'Reduce Gap') {
        // Speed stays same, gap decreases
        if (state.productSpeed > 0 && newRate > 0) {
            const newPitch = (state.productSpeed * 60) / newRate
            state.productGap = newPitch - state.productLength
            state.pitch = newPitch
        }
    } else if (adjustMode === 'Specify Speed' && inputs.newSpeed) {
        const newSpeed = toBase(inputs.newSpeed, units.newSpeed, 'speed')
        state.productSpeed = newSpeed
        if (newRate > 0) {
            const newPitch = (newSpeed * 60) / newRate
            state.productGap = newPitch - state.productLength
            state.pitch = newPitch
        }
    } else if (adjustMode === 'Specify Gap' && inputs.newGap) {
        const newGap = toBase(inputs.newGap, units.newGap, 'length')
        state.productGap = newGap
        const pitch = state.productLength + newGap
        state.pitch = pitch
        state.productSpeed = (newRate * pitch) / 60
    }

    // Update gap time
    state.gapTimeAvailable = state.productSpeed > 0 ? state.productGap / state.productSpeed : 0

    // Add merge info
    state.mergeInfo = {
        addedPPM: addedRate
    }

    // Check feasibility
    if (state.productGap < 0) {
        state.issues.push('Gap insufficient after merge - increase speed or specify larger gap')
        state.feasibility = 'error'
    } else if (state.productGap < state.productLength * 0.1) {
        state.issues.push('Gap very tight after merge')
        state.feasibility = state.feasibility === 'error' ? 'error' : 'warning'
    }

    if (state.productSpeed > 3.0) {
        state.issues.push('Speed exceeds typical maximum (3 m/s)')
        state.feasibility = state.feasibility === 'error' ? 'error' : 'warning'
    }

    return state
}

/**
 * Calculate Process card output
 * Applies dwell time that consumes gap
 *
 * @param {object} inputs - Card input values
 * @param {object} units - Unit selections
 * @param {object} inputFlowState - Flow state from previous card
 * @returns {object} Calculated flow state
 */
export function calculateProcess(inputs: any, units: any, inputFlowState: any) {
    const state = cloneFlowState(inputFlowState)

    const dwellTime = inputs.dwellTime ? toBase(inputs.dwellTime, units.dwellTime, 'time') : 0
    const frequency = parseInt(inputs.frequency) || 1
    const speedAdjust = inputs.speedAdjust || 'Keep'
    const processName = inputs.processName || 'Process'

    if (dwellTime <= 0) {
        // No dwell, just pass through
        state.processInfo = { name: processName, dwellTime: 0, gapLost: 0 }
        return state
    }

    // Calculate gap lost per product (averaged over frequency)
    const effectiveDwellPerProduct = dwellTime / frequency
    const gapLost = state.productSpeed * effectiveDwellPerProduct

    const previousGap = state.productGap

    if (speedAdjust === 'Keep') {
        // Gap is reduced
        state.productGap = previousGap - gapLost
    } else if (speedAdjust === 'Specify' && inputs.newSpeed) {
        // User specifies new speed
        const newSpeed = toBase(inputs.newSpeed, units.newSpeed, 'speed')
        const newGapLost = newSpeed * effectiveDwellPerProduct

        // With new speed, rate changes
        const newPitch = state.productLength + previousGap - newGapLost
        if (newPitch > 0) {
            state.productSpeed = newSpeed
            state.productGap = previousGap - newGapLost
            // Rate stays same but we need new pitch
            const actualPitch = (newSpeed * 60) / state.productRate
            state.productGap = actualPitch - state.productLength
        }
    }

    // Update pitch and gap time
    state.pitch = state.productLength + state.productGap
    state.gapTimeAvailable = state.productSpeed > 0 ? state.productGap / state.productSpeed : 0

    // Process info for display
    state.processInfo = {
        name: processName,
        dwellTime: dwellTime,
        frequency: frequency,
        gapLost: gapLost,
        previousGap: previousGap
    }

    // Check feasibility
    if (state.productGap < 0) {
        state.issues.push(`Process "${processName}" requires more gap than available`)
        state.feasibility = 'error'
    } else if (state.productGap < state.productLength * 0.1) {
        state.issues.push(`Tight gap after "${processName}"`)
        state.feasibility = state.feasibility === 'error' ? 'error' : 'warning'
    }

    return state
}

/**
 * Calculate Accumulation card output
 * Calculates buffer capacity or required length
 *
 * @param {object} inputs - Card input values
 * @param {object} units - Unit selections
 * @param {object} inputFlowState - Flow state from previous card
 * @returns {object} Calculated flow state
 */
export function calculateAccumulation(inputs: any, units: any, inputFlowState: any) {
    const state = cloneFlowState(inputFlowState)

    const calcMode = inputs.calcMode || 'Time'
    const minAccumGap = inputs.minAccumGap ? toBase(inputs.minAccumGap, units.minAccumGap, 'length') : 0
    const conveyorLength = inputs.conveyorLength ? toBase(inputs.conveyorLength, units.conveyorLength, 'length') : 0

    // Pitch when accumulated (with minimum gap)
    const accumPitch = state.productLength + minAccumGap

    if (calcMode === 'Time') {
        // Given conveyor length, calculate buffer time
        if (conveyorLength > 0 && accumPitch > 0) {
            const productsInBuffer = Math.floor(conveyorLength / accumPitch)
            const bufferTimeSeconds = state.ppm > 0 ? (productsInBuffer / state.ppm) * 60 : 0

            state.accumulationInfo = {
                conveyorLength: conveyorLength,
                productsInBuffer: productsInBuffer,
                bufferTimeSeconds: bufferTimeSeconds,
                bufferTimeMinutes: bufferTimeSeconds / 60,
                minGap: minAccumGap,
                mode: 'fromLength'
            }
        } else {
            state.accumulationInfo = {
                error: 'Need valid conveyor length',
                mode: 'fromLength'
            }
        }
    } else {
        // Calculate required length from target buffer time
        const targetBufferTime = parseFloat(inputs.targetBufferTime) || 0

        if (targetBufferTime > 0 && state.ppm > 0) {
            const productsNeeded = Math.ceil((targetBufferTime / 60) * state.ppm)
            const requiredLength = productsNeeded * accumPitch

            state.accumulationInfo = {
                targetBufferTime: targetBufferTime,
                productsNeeded: productsNeeded,
                requiredLength: requiredLength,
                minGap: minAccumGap,
                mode: 'fromTime'
            }
        } else {
            state.accumulationInfo = {
                error: 'Need valid target buffer time and product rate',
                mode: 'fromTime'
            }
        }
    }

    return state
}

/**
 * Calculate Reject card output
 * Removes a percentage of products from the flow (kicked off line)
 *
 * @param {object} inputs - Card input values
 * @param {object} units - Unit selections
 * @param {object} inputFlowState - Flow state from previous card
 * @returns {object} Calculated flow state
 */
export function calculateReject(inputs: any, _units: any, inputFlowState: any) {
    const state = cloneFlowState(inputFlowState)

    const rejectPercent = parseFloat(inputs.rejectPercent) || 0
    const adjustMode = inputs.adjustMode || 'Keep Speed'

    if (rejectPercent < 0 || rejectPercent > 100) {
        state.issues.push('Reject percentage must be 0-100')
        state.feasibility = 'error'
        return state
    }

    // Calculate new rate after reject
    const keepRatio = 1 - (rejectPercent / 100)
    const newRate = state.productRate * keepRatio
    const rejectedPPM = state.productRate - newRate

    // Update rate
    state.productRate = newRate
    state.ppm = newRate
    state.pph = newRate * 60

    // Handle speed/gap adjustment
    if (adjustMode === 'Keep Speed') {
        // Speed stays same, gap increases
        if (newRate > 0) {
            const newPitch = (state.productSpeed * 60) / newRate
            state.productGap = newPitch - state.productLength
            state.pitch = newPitch
        }
    } else if (adjustMode === 'Keep Gap') {
        // Gap stays same, speed decreases
        const pitch = state.productLength + state.productGap
        state.productSpeed = (newRate * pitch) / 60
    }

    // Update gap time
    state.gapTimeAvailable = state.productSpeed > 0 ? state.productGap / state.productSpeed : 0

    // Reject info for display
    state.rejectInfo = {
        percent: rejectPercent,
        rejectedPPM: rejectedPPM
    }

    return state
}

/**
 * Calculate Stacking card output
 * Stacks multiple products on top of each other, reducing rate
 *
 * @param {object} inputs - Card input values
 * @param {object} units - Unit selections
 * @param {object} inputFlowState - Flow state from previous card
 * @returns {object} Calculated flow state
 */
export function calculateStacking(inputs: any, units: any, inputFlowState: any) {
    const state = cloneFlowState(inputFlowState)

    const stackCount = parseInt(inputs.stackCount) || 2
    const dwellTime = inputs.dwellTime ? toBase(inputs.dwellTime, units.dwellTime, 'time') : 0
    const adjustMode = inputs.adjustMode || 'Keep Speed'

    if (stackCount < 2) {
        state.issues.push('Stack count must be at least 2')
        state.feasibility = 'error'
        return state
    }

    // Calculate time needed to collect products for stacking
    const timeToCollect = state.ppm > 0 ? (stackCount / state.ppm) * 60 : 0  // seconds
    const totalCycleTime = timeToCollect + dwellTime

    // New rate = 1 stack per cycle time
    const newRate = totalCycleTime > 0 ? 60 / totalCycleTime : 0

    // Update rate
    const previousRate = state.productRate
    state.productRate = newRate
    state.ppm = newRate
    state.pph = newRate * 60

    // Product weight multiplies by stack count (if tracked)
    if (state.productWeight) {
        state.productWeight = state.productWeight * stackCount
    }

    // Handle speed adjustment
    if (adjustMode === 'Keep Speed') {
        // Speed stays same, recalculate gap
        if (newRate > 0) {
            const newPitch = (state.productSpeed * 60) / newRate
            state.productGap = newPitch - state.productLength
            state.pitch = newPitch
        }
    } else if (adjustMode === 'Specify Speed' && inputs.newSpeed) {
        const newSpeed = toBase(inputs.newSpeed, units.newSpeed, 'speed')
        state.productSpeed = newSpeed
        if (newRate > 0) {
            const newPitch = (newSpeed * 60) / newRate
            state.productGap = newPitch - state.productLength
            state.pitch = newPitch
        }
    }

    // Update gap time
    state.gapTimeAvailable = state.productSpeed > 0 ? state.productGap / state.productSpeed : 0

    // Stacking info for display
    state.stackingInfo = {
        stackCount: stackCount,
        dwellTime: dwellTime,
        cycleTime: totalCycleTime,
        inputRate: previousRate,
        outputRate: newRate
    }

    // Check feasibility
    if (state.productGap < 0) {
        state.issues.push('Stacking results in negative gap - reduce speed')
        state.feasibility = 'error'
    }

    return state
}

/**
 * Calculate Batching card output
 * Groups products together side-by-side, changing product length
 *
 * @param {object} inputs - Card input values
 * @param {object} units - Unit selections
 * @param {object} inputFlowState - Flow state from previous card
 * @returns {object} Calculated flow state
 */
export function calculateBatching(inputs: any, units: any, inputFlowState: any) {
    const state = cloneFlowState(inputFlowState)

    const batchCount = parseInt(inputs.batchCount) || 2
    const dwellTime = inputs.dwellTime ? toBase(inputs.dwellTime, units.dwellTime, 'time') : 0
    const adjustMode = inputs.adjustMode || 'Keep Speed'

    if (batchCount < 2) {
        state.issues.push('Batch count must be at least 2')
        state.feasibility = 'error'
        return state
    }

    // Calculate time needed to collect products for batching
    const timeToCollect = state.ppm > 0 ? (batchCount / state.ppm) * 60 : 0  // seconds
    const totalCycleTime = timeToCollect + dwellTime

    // New rate = 1 batch per cycle time
    const newRate = totalCycleTime > 0 ? 60 / totalCycleTime : 0

    // New product length = original length × batch count (products touch)
    const previousLength = state.productLength
    const newLength = previousLength * batchCount

    // Update state
    const previousRate = state.productRate
    state.productRate = newRate
    state.ppm = newRate
    state.pph = newRate * 60
    state.productLength = newLength

    // Product weight multiplies by batch count (if tracked)
    if (state.productWeight) {
        state.productWeight = state.productWeight * batchCount
    }

    // Handle speed adjustment
    if (adjustMode === 'Keep Speed') {
        // Speed stays same, recalculate gap
        if (newRate > 0) {
            const newPitch = (state.productSpeed * 60) / newRate
            state.productGap = newPitch - newLength
            state.pitch = newPitch
        }
    } else if (adjustMode === 'Specify Speed' && inputs.newSpeed) {
        const newSpeed = toBase(inputs.newSpeed, units.newSpeed, 'speed')
        state.productSpeed = newSpeed
        if (newRate > 0) {
            const newPitch = (newSpeed * 60) / newRate
            state.productGap = newPitch - newLength
            state.pitch = newPitch
        }
    }

    // Update pitch
    state.pitch = state.productLength + state.productGap

    // Update gap time
    state.gapTimeAvailable = state.productSpeed > 0 ? state.productGap / state.productSpeed : 0

    // Batching info for display
    state.batchingInfo = {
        batchCount: batchCount,
        dwellTime: dwellTime,
        cycleTime: totalCycleTime,
        inputRate: previousRate,
        outputRate: newRate,
        previousLength: previousLength,
        newLength: newLength
    }

    // Check feasibility
    if (state.productGap < 0) {
        state.issues.push('Batching results in negative gap - reduce speed')
        state.feasibility = 'error'
    }

    return state
}

/**
 * Map of calculation functions by card type
 */
export const calculationFunctions: Record<string, any> = {
    infeed: calculateInfeed,
    split: calculateSplit,
    merge: calculateMerge,
    process: calculateProcess,
    accumulation: calculateAccumulation,
    reject: calculateReject,
    stacking: calculateStacking,
    batching: calculateBatching
}

/**
 * Recalculate entire card chain from a starting index
 * @param {Array} cards - Array of card objects
 * @param {number} startIndex - Index to start recalculation from
 * @returns {Array} Updated cards array
 */
export function recalculateFromCard(cards: any, startIndex: number = 0) {
    if (!cards || cards.length === 0) return cards

    // Get input state from previous card, or empty if first
    let flowState = startIndex === 0
        ? createEmptyFlowState()
        : cards[startIndex - 1].outputs

    // Recalculate each card from startIndex onward
    for (let i = startIndex; i < cards.length; i++) {
        const card = cards[i]
        const calcFn = calculationFunctions[card.type]

        if (calcFn) {
            card.outputs = calcFn(card.inputs, card.units, flowState)
        } else {
            // Unknown card type, just pass through
            card.outputs = cloneFlowState(flowState)
        }

        // This card's output becomes next card's input
        flowState = card.outputs
    }

    return cards
}

/**
 * Get the worst feasibility status from a chain of cards
 * @param {Array} cards - Array of card objects
 * @returns {string} Worst feasibility: 'ok' | 'warning' | 'error'
 */
export function getChainFeasibility(cards: any) {
    if (!cards || cards.length === 0) return 'ok'

    let worst = 'ok'
    for (const card of cards) {
        if (card.outputs?.feasibility === 'error') return 'error'
        if (card.outputs?.feasibility === 'warning') worst = 'warning'
    }
    return worst
}
