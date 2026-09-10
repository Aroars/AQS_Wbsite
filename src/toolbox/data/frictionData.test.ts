import { describe, it, expect } from 'vitest'
import { getAllMaterials, getCompatibleMaterials, getAvailableConditions, getFrictionCoefficient } from './frictionData'

describe('friction chart: modular belt on wearstrip rows', () => {
    it('lists Modular Belt as a material with the five toolbox rails as partners', () => {
        expect(getAllMaterials()).toContain('Modular Belt')
        expect(getCompatibleMaterials('Modular Belt')).toEqual(['Acetal / POM', 'HDPE (food grade)', 'PET P (Ertalyte TX)', 'UHMW (virgin)', 'UHMW UltraLube #321'])
    })
    it('carries the dynamic μ the belt pull and wearstrip calculators use, with no static value', () => {
        expect(getAvailableConditions('Modular Belt', 'UHMW (virgin)')).toEqual(['dry'])
        expect(getFrictionCoefficient('Modular Belt', 'UHMW (virgin)', 'dry')).toEqual({ static: null, kinetic: 0.18 })
        expect(getFrictionCoefficient('UHMW UltraLube #321', 'Modular Belt', 'dry').kinetic).toBe(0.10)
        expect(getFrictionCoefficient('Modular Belt', 'HDPE (food grade)', 'dry').kinetic).toBe(0.25)
    })
})
