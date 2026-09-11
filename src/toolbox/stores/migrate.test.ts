import { describe, it, expect } from 'vitest'
import { migrateToInstances, instanceKey } from './migrate'

describe('v3 migration: per-tool slices become main instances, pins become independent copies', () => {
    it('maps every legacy slice to its main instance', () => {
        const r = migrateToInstances({
            toolStates: { driveMotor: '{"a":1}' },
            beltLoadState: '{"mode":"packages"}', beltPullConfig: '{"beltWidthIn":12}', wearstripConfig: '{"x":1}',
            conveyorCards: [{ id: 'infeed-1', type: 'infeed', inputs: {}, units: {} }],
            powerEquipment: [{ id: 'e1', label: 'Motor', watts: 100, quantity: 1, type: 'ac' }],
            areaMemory: [], calculatorMode: 'formula', flowHistory: [], formulaHistory: [{ id: 'f1', expression: '2', result: 2, variable: 'A' }],
            pinnedCalculators: [],
        })
        expect(r.instanceStates[instanceKey('driveMotor', 'main')]).toBe('{"a":1}')
        expect(r.instanceStates[instanceKey('beltLoad', 'main')]).toBe('{"mode":"packages"}')
        expect(r.instanceStates[instanceKey('beltPull', 'main')]).toBe('{"beltWidthIn":12}')
        expect(JSON.parse(r.instanceStates[instanceKey('power', 'main')]).equipment).toHaveLength(1)
        expect(r.instanceStates[instanceKey('area', 'main')]).toBeUndefined()
        expect(JSON.parse(r.instanceStates[instanceKey('expression', 'main')]).mode).toBe('formula')
        expect(r.chains.main).toHaveLength(1)
        expect(r.pinnedCalculators).toEqual([])
    })
    it('turns old string pins into seeded instances, cloning the chain for the flow cards', () => {
        const r = migrateToInstances({
            toolStates: { giveaway: '{"target":"200"}' },
            beltPullConfig: '{"beltWidthIn":24}',
            conveyorCards: [{ id: 'infeed-1', type: 'infeed', inputs: { productRate: 20 }, units: {} }],
            pinnedCalculators: ['beltPull', 'conveyorFlow', 'giveaway'],
        })
        expect(r.pinnedCalculators).toEqual([{ toolId: 'beltPull', instanceId: 'pin-1' }, { toolId: 'conveyorFlow', instanceId: 'pin-2' }, { toolId: 'giveaway', instanceId: 'pin-3' }])
        expect(r.instanceStates[instanceKey('beltPull', 'pin-1')]).toBe('{"beltWidthIn":24}')
        expect(r.instanceStates[instanceKey('giveaway', 'pin-3')]).toBe('{"target":"200"}')
        expect(r.chains['pin-2']).toEqual(r.chains.main)
        expect(r.chains['pin-2']).not.toBe(r.chains.main)
    })
    it('passes v3-shaped pins through and tolerates an empty store', () => {
        const r = migrateToInstances({ pinnedCalculators: [{ toolId: 'area', instanceId: 'pin-9' }] })
        expect(r.pinnedCalculators).toEqual([{ toolId: 'area', instanceId: 'pin-9' }])
        expect(r.chains.main).toEqual([])
        expect(migrateToInstances({}).instanceStates).toEqual({})
    })
})
