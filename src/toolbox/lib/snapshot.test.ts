import { describe, it, expect } from 'vitest'
import { encodeSnapshot, decodeSnapshot, cardSnapshot, SNAPSHOT_PREFIX } from './snapshot'

describe('snapshot codes', () => {
    it('round-trips a card snapshot with unicode in the state', () => {
        const snap = cardSnapshot('beltPull', JSON.stringify({ beltWidthIn: 12, note: '24″ belt · μ 0.18' }))
        const code = encodeSnapshot(snap)
        expect(code.startsWith(SNAPSHOT_PREFIX)).toBe(true)
        expect(/^[A-Za-z0-9._-]+$/.test(code)).toBe(true)   // url-safe, no padding
        const back = decodeSnapshot(code)
        expect(back?.kind).toBe('card')
        expect(back && back.kind === 'card' ? JSON.parse(back.state!).note : null).toBe('24″ belt · μ 0.18')
    })
    it('round-trips a page snapshot and tolerates surrounding whitespace', () => {
        const code = encodeSnapshot({ v: 1, kind: 'page', at: '2026-09-10T00:00:00Z', instanceStates: { 'giveaway#main': '{}' }, chains: { main: [] }, pinnedCalculators: [], pinnedCharts: [], savedConverters: [], converterStates: {}, loadDefinition: null })
        const back = decodeSnapshot(`  ${code}\n`)
        expect(back?.kind).toBe('page')
        expect(back && back.kind === 'page' ? Object.keys(back.instanceStates) : []).toEqual(['giveaway#main'])
    })
    it('rejects garbage and foreign strings', () => {
        expect(decodeSnapshot('hello')).toBeNull()
        expect(decodeSnapshot('aqs1.!!!')).toBeNull()
        expect(decodeSnapshot('aqs1.' + btoa('{"v":1,"kind":"other"}'))).toBeNull()
    })
})
