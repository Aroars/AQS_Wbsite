/**
 * Friction Coefficient Data
 * Contains static and kinetic friction coefficients for various material combinations
 * @module data/frictionData
 */

export const frictionData: Record<string, any> = {
    // Metal on Metal combinations
    'Steel-Steel': {
        dry: { static: 0.74, kinetic: 0.57 },
        greased: { static: 0.16, kinetic: 0.09 },
        lubricated: { static: 0.15, kinetic: 0.06 }
    },
    'Steel-Aluminum': {
        dry: { static: 0.61, kinetic: 0.47 },
        greased: { static: 0.19, kinetic: 0.11 },
        lubricated: { static: 0.14, kinetic: 0.08 }
    },
    'Steel-Brass': {
        dry: { static: 0.51, kinetic: 0.44 },
        greased: { static: 0.19, kinetic: 0.15 },
        lubricated: { static: 0.13, kinetic: 0.10 }
    },
    'Steel-Copper': {
        dry: { static: 0.53, kinetic: 0.36 },
        greased: { static: 0.18, kinetic: 0.12 },
        lubricated: { static: 0.12, kinetic: 0.08 }
    },
    'Steel-Cast Iron': {
        dry: { static: 0.40, kinetic: 0.21 },
        greased: { static: 0.21, kinetic: 0.15 },
        lubricated: { static: 0.16, kinetic: 0.11 }
    },
    'Aluminum-Aluminum': {
        dry: { static: 1.05, kinetic: 1.40 },
        greased: { static: 0.30, kinetic: 0.23 },
        lubricated: { static: 0.25, kinetic: 0.18 }
    },
    'Aluminum-Steel': {
        dry: { static: 0.61, kinetic: 0.47 },
        greased: { static: 0.19, kinetic: 0.11 },
        lubricated: { static: 0.14, kinetic: 0.08 }
    },
    'Copper-Copper': {
        dry: { static: 1.00, kinetic: 0.74 },
        greased: { static: 0.22, kinetic: 0.16 },
        lubricated: { static: 0.18, kinetic: 0.12 }
    },
    'Copper-Steel': {
        dry: { static: 0.53, kinetic: 0.36 },
        greased: { static: 0.18, kinetic: 0.12 },
        lubricated: { static: 0.12, kinetic: 0.08 }
    },
    'Brass-Steel': {
        dry: { static: 0.51, kinetic: 0.44 },
        greased: { static: 0.19, kinetic: 0.15 },
        lubricated: { static: 0.13, kinetic: 0.10 }
    },
    'Brass-Cast Iron': {
        dry: { static: 0.35, kinetic: 0.30 },
        greased: { static: 0.15, kinetic: 0.12 },
        lubricated: { static: 0.10, kinetic: 0.08 }
    },
    'Cast Iron-Cast Iron': {
        dry: { static: 1.10, kinetic: 0.15 },
        greased: { static: 0.15, kinetic: 0.07 },
        lubricated: { static: 0.12, kinetic: 0.05 }
    },
    'Cast Iron-Steel': {
        dry: { static: 0.40, kinetic: 0.21 },
        greased: { static: 0.21, kinetic: 0.15 },
        lubricated: { static: 0.16, kinetic: 0.11 }
    },

    // Metal on Non-Metal
    'Steel-Teflon': {
        dry: { static: 0.04, kinetic: 0.04 },
        greased: { static: 0.04, kinetic: 0.04 },
        lubricated: { static: 0.04, kinetic: 0.04 }
    },
    'Steel-Ice': {
        dry: { static: 0.03, kinetic: 0.02 },
        wet: { static: 0.02, kinetic: 0.01 }
    },
    'Steel-Rubber': {
        dry: { static: 0.70, kinetic: 0.50 },
        wet: { static: 0.55, kinetic: 0.40 }
    },
    'Steel-Wood': {
        dry: { static: 0.50, kinetic: 0.40 },
        wet: { static: 0.40, kinetic: 0.30 },
        greased: { static: 0.25, kinetic: 0.20 }
    },
    'Aluminum-Teflon': {
        dry: { static: 0.04, kinetic: 0.04 },
        greased: { static: 0.04, kinetic: 0.04 },
        lubricated: { static: 0.04, kinetic: 0.04 }
    },

    // Non-Metal on Non-Metal
    'Wood-Wood': {
        dry: { static: 0.40, kinetic: 0.30 },
        wet: { static: 0.30, kinetic: 0.25 },
        greased: { static: 0.20, kinetic: 0.15 }
    },
    'Wood-Brick': {
        dry: { static: 0.60, kinetic: 0.50 }
    },
    'Wood-Concrete': {
        dry: { static: 0.62, kinetic: 0.48 }
    },
    'Rubber-Concrete': {
        dry: { static: 1.00, kinetic: 0.80 },
        wet: { static: 0.70, kinetic: 0.50 }
    },
    'Rubber-Asphalt': {
        dry: { static: 0.90, kinetic: 0.70 },
        wet: { static: 0.60, kinetic: 0.40 }
    },
    'Rubber-Ice': {
        dry: { static: 0.15, kinetic: 0.10 },
        wet: { static: 0.10, kinetic: 0.05 }
    },
    'Glass-Glass': {
        dry: { static: 0.94, kinetic: 0.40 },
        wet: { static: 0.40, kinetic: 0.20 }
    },
    'Glass-Metal': {
        dry: { static: 0.50, kinetic: 0.40 },
        wet: { static: 0.35, kinetic: 0.25 }
    },
    'Teflon-Teflon': {
        dry: { static: 0.04, kinetic: 0.04 },
        greased: { static: 0.04, kinetic: 0.04 },
        lubricated: { static: 0.04, kinetic: 0.04 }
    },
    'Plastic-Plastic': {
        dry: { static: 0.35, kinetic: 0.25 },
        lubricated: { static: 0.15, kinetic: 0.10 }
    },
    'Plastic-Steel': {
        dry: { static: 0.40, kinetic: 0.30 },
        lubricated: { static: 0.20, kinetic: 0.15 }
    },

    // Specialized Materials
    'Diamond-Diamond': {
        dry: { static: 0.10, kinetic: 0.05 }
    },
    'Diamond-Metal': {
        dry: { static: 0.15, kinetic: 0.10 }
    },
    'Graphite-Graphite': {
        dry: { static: 0.10, kinetic: 0.10 }
    },
    'Graphite-Steel': {
        dry: { static: 0.10, kinetic: 0.10 }
    },

    // Stone and Masonry
    'Stone-Stone': {
        dry: { static: 0.65, kinetic: 0.55 }
    },
    'Stone-Wood': {
        dry: { static: 0.50, kinetic: 0.40 }
    },
    'Concrete-Concrete': {
        dry: { static: 0.60, kinetic: 0.50 },
        wet: { static: 0.45, kinetic: 0.35 }
    },
    'Concrete-Rubber': {
        dry: { static: 1.00, kinetic: 0.80 },
        wet: { static: 0.70, kinetic: 0.50 }
    },
    'Concrete-Steel': {
        dry: { static: 0.55, kinetic: 0.45 },
        wet: { static: 0.40, kinetic: 0.30 }
    },

    // Textiles and Soft Materials
    'Leather-Wood': {
        dry: { static: 0.40, kinetic: 0.30 }
    },
    'Leather-Metal': {
        dry: { static: 0.60, kinetic: 0.50 },
        greased: { static: 0.30, kinetic: 0.25 }
    },
    'Leather-Oak': {
        dry: { static: 0.61, kinetic: 0.52 }
    },
    'Hemp Rope-Wood': {
        dry: { static: 0.50, kinetic: 0.40 }
    },

    // Brake and Clutch Materials
    'Brake Material-Cast Iron': {
        dry: { static: 0.40, kinetic: 0.30 }
    },
    'Clutch Material-Steel': {
        dry: { static: 0.30, kinetic: 0.25 }
    },

    // Tire Materials
    'Tire-Dry Road': {
        dry: { static: 0.90, kinetic: 0.70 }
    },
    'Tire-Wet Road': {
        wet: { static: 0.60, kinetic: 0.40 }
    },
    'Tire-Snow': {
        dry: { static: 0.30, kinetic: 0.20 }
    },
    'Tire-Ice': {
        dry: { static: 0.15, kinetic: 0.10 }
    }
}

/**
 * Get unique list of all materials from the friction data
 * @returns {Array<string>} Sorted array of unique material names
 */
export function getAllMaterials() {
    const materials = new Set()

    Object.keys(frictionData).forEach(key => {
        const [material1, material2] = key.split('-')
        materials.add(material1)
        materials.add(material2)
    })

    return Array.from(materials).sort()
}

/**
 * Get materials that have friction data with the specified material
 * @param {string} material - The material to find compatible pairs for
 * @returns {Array<string>} Array of material names that have data with the specified material
 */
export function getCompatibleMaterials(material: any) {
    if (!material) return getAllMaterials()

    const compatible = new Set()

    Object.keys(frictionData).forEach(key => {
        const [mat1, mat2] = key.split('-')
        if (mat1 === material) {
            compatible.add(mat2)
        } else if (mat2 === material) {
            compatible.add(mat1)
        }
    })

    return Array.from(compatible).sort()
}

/**
 * Get available surface conditions for a material pair
 * @param {string} material1 - First material
 * @param {string} material2 - Second material
 * @returns {Array<string>} Array of available conditions (dry, wet, greased, lubricated)
 */
export function getAvailableConditions(material1: any, material2: any) {
    const key1 = `${material1}-${material2}`
    const key2 = `${material2}-${material1}`

    const data = frictionData[key1] || frictionData[key2]

    if (!data) return []

    return Object.keys(data)
}

/**
 * Get friction coefficients for a material pair and condition
 * @param {string} material1 - First material
 * @param {string} material2 - Second material
 * @param {string} condition - Surface condition
 * @returns {Object|null} Object with static and kinetic coefficients, or null if not found
 */
export function getFrictionCoefficient(material1: any, material2: any, condition: any) {
    const key1 = `${material1}-${material2}`
    const key2 = `${material2}-${material1}`

    const data = frictionData[key1] || frictionData[key2]

    if (!data || !data[condition]) return null

    return data[condition]
}
