/**
 * Area Calculator - Pure Calculation Functions
 * No UI dependencies - all calculations are pure functions
 * @module calculators/areaCalculator
 */

import { unitCategories } from '@/toolbox/data/unitCategories'
import { shapeCalculations, shapeIcons } from '@/toolbox/data/shapeCalculations'

/**
 * Get available shapes for calculation
 * @returns {Array<string>} Array of shape names
 */
export function getShapes() {
    return Object.keys(shapeCalculations)
}

/**
 * Get shape data (inputs and formula)
 * @param {string} shapeName - Name of the shape
 * @returns {object|null} Shape data or null if not found
 */
export function getShapeData(shapeName: any) {
    return shapeCalculations[shapeName] || null
}

/**
 * Get shape icon SVG
 * @param {string} shapeName - Name of the shape
 * @returns {string} SVG string or empty string
 */
export function getShapeIcon(shapeName: any) {
    return shapeIcons[shapeName] || ''
}

/**
 * Get length units for dimension inputs
 * @returns {object} Length units configuration
 */
export function getLengthUnits() {
    return unitCategories['Length'].units
}

/**
 * Get area units for output
 * @returns {object} Area units configuration
 */
export function getAreaUnits() {
    return unitCategories['Area'].units
}

/**
 * Convert a length value to base unit (meters)
 * @param {number} value - Value to convert
 * @param {string} unit - Unit name
 * @returns {number} Value in meters
 */
export function lengthToBase(value: any, unit: any) {
    const units: any = getLengthUnits()
    if (!units[unit]) return value
    return value * units[unit].toBase
}

/**
 * Convert area from base unit (square meters) to target unit
 * @param {number} value - Value in square meters
 * @param {string} unit - Target unit name
 * @returns {number} Converted value
 */
export function areaFromBase(value: any, unit: any) {
    const units: any = getAreaUnits()
    if (!units[unit]) return value
    return value / units[unit].toBase
}

/**
 * Calculate area for a given shape
 * @param {string} shapeName - Name of the shape
 * @param {Array<{value: number, unit: string}>} dimensions - Array of dimension objects
 * @param {string} outputUnit - Target output unit
 * @returns {{value: number, unit: string, symbol: string}|null} Calculated area or null if invalid
 */
export function calculateArea(shapeName: any, dimensions: any, outputUnit: any) {
    const shapeData = getShapeData(shapeName)
    if (!shapeData) return null

    // Check if all dimensions are valid
    const values = dimensions.map((d: any) => {
        if (isNaN(d.value) || d.value <= 0) return null
        return lengthToBase(d.value, d.unit)
    })

    if (values.some((v: any) => v === null)) return null

    // Calculate area in square meters
    const areaInBase = shapeData.calculate(...values)

    // Convert to output unit
    const areaUnits = getAreaUnits()
    const finalArea = areaFromBase(areaInBase, outputUnit)
    const symbol = areaUnits[outputUnit]?.symbol || ''

    return {
        value: finalArea,
        unit: outputUnit,
        symbol: symbol
    }
}

/**
 * Convert an area value between units
 * @param {number} value - Value to convert
 * @param {string} fromUnit - Source unit
 * @param {string} toUnit - Target unit
 * @returns {number} Converted value
 */
export function convertArea(value: any, fromUnit: any, toUnit: any) {
    const areaUnits: any = getAreaUnits()
    if (!areaUnits[fromUnit] || !areaUnits[toUnit]) return value

    // Convert to base (square meters) then to target
    const inBase = value * areaUnits[fromUnit].toBase
    return inBase / areaUnits[toUnit].toBase
}

/**
 * Calculate total area from memory entries
 * @param {Array<{value: number, unit: string}>} entries - Memory entries
 * @param {string} outputUnit - Target output unit
 * @returns {{value: number, unit: string, symbol: string}} Total area
 */
export function calculateTotal(entries: any, outputUnit: any) {
    const areaUnits = getAreaUnits()

    // Sum all entries in base unit (square meters)
    let totalInBase = 0
    entries.forEach((entry: any) => {
        totalInBase += convertArea(entry.value, entry.unit, 'Square Meter')
    })

    // Convert to output unit
    const totalInOutput = convertArea(totalInBase, 'Square Meter', outputUnit)
    const symbol = areaUnits[outputUnit]?.symbol || ''

    return {
        value: totalInOutput,
        unit: outputUnit,
        symbol: symbol
    }
}

/**
 * Format a number for display
 * @param {number} value - Value to format
 * @param {number} maxDecimals - Maximum decimal places (default 6)
 * @returns {string} Formatted number string
 */
export function formatValue(value: any, maxDecimals: number = 6) {
    if (value === 0) return '0'
    if (Math.abs(value) < 0.000001 || Math.abs(value) >= 1000000) {
        return value.toExponential(4)
    }
    return parseFloat(value.toFixed(maxDecimals)).toString()
}

/**
 * Create a new memory entry
 * @param {number} value - Area value
 * @param {string} unit - Unit name
 * @param {string} shape - Shape name
 * @param {number} index - Entry index for labeling
 * @returns {object} Memory entry object
 */
export function createMemoryEntry(value: any, unit: any, shape: any, index: any) {
    return {
        id: Date.now().toString() + Math.random().toString(36).substring(2, 11),
        value: value,
        unit: unit,
        shape: shape,
        label: `${shape} ${index + 1}`
    }
}
