import type { PinnedCalc } from '@/toolbox/lib/types'
import type { FlowCard } from '@/toolbox/lib/calculators/infeedCard'

/** Store key for one card instance's persisted state */
export const instanceKey = (toolId: string, instanceId: string) => `${toolId}#${instanceId}`

export const MAIN = 'main'

export interface InstancedSlice {
    instanceStates: Record<string, string>
    chains: Record<string, FlowCard[]>
    pinnedCalculators: PinnedCalc[]
}

/** Persisted shape before v3: one slice per tool, pins by tool id (mirrors) */
interface LegacyPersisted {
    toolStates?: Record<string, string>
    beltLoadState?: string | null
    beltPullConfig?: string | null
    wearstripConfig?: string | null
    conveyorCards?: FlowCard[]
    powerEquipment?: unknown[]
    areaMemory?: unknown[]
    calculatorMode?: 'flow' | 'formula'
    flowHistory?: unknown[]
    flowLastAnswer?: number
    formulaHistory?: unknown[]
    formulaLastAnswer?: number
    pinnedCalculators?: unknown
}

/**
 * v3: every calculator card is an instance keyed by tool + instance id. Old per-tool
 * slices become the "main" instance; old pins (which mirrored the tab card) become
 * independent copies seeded with the same values, so nothing visibly changes.
 */
export function migrateToInstances(persisted: LegacyPersisted): InstancedSlice {
    const instanceStates: Record<string, string> = {}
    for (const [toolId, json] of Object.entries(persisted.toolStates ?? {})) instanceStates[instanceKey(toolId, MAIN)] = json
    if (persisted.beltLoadState) instanceStates[instanceKey('beltLoad', MAIN)] = persisted.beltLoadState
    if (persisted.beltPullConfig) instanceStates[instanceKey('beltPull', MAIN)] = persisted.beltPullConfig
    if (persisted.wearstripConfig) instanceStates[instanceKey('wearstrip', MAIN)] = persisted.wearstripConfig
    if (persisted.powerEquipment && persisted.powerEquipment.length > 0) instanceStates[instanceKey('power', MAIN)] = JSON.stringify({ equipment: persisted.powerEquipment })
    if (persisted.areaMemory && persisted.areaMemory.length > 0) instanceStates[instanceKey('area', MAIN)] = JSON.stringify({ memory: persisted.areaMemory })
    if ((persisted.flowHistory && persisted.flowHistory.length > 0) || (persisted.formulaHistory && persisted.formulaHistory.length > 0) || persisted.calculatorMode) {
        instanceStates[instanceKey('expression', MAIN)] = JSON.stringify({
            mode: persisted.calculatorMode ?? 'flow',
            flowHistory: persisted.flowHistory ?? [], flowLastAnswer: persisted.flowLastAnswer ?? 0,
            formulaHistory: persisted.formulaHistory ?? [], formulaLastAnswer: persisted.formulaLastAnswer ?? 0,
        })
    }
    const chains: Record<string, FlowCard[]> = { [MAIN]: Array.isArray(persisted.conveyorCards) ? persisted.conveyorCards : [] }

    const pinnedCalculators: PinnedCalc[] = []
    const oldPins = Array.isArray(persisted.pinnedCalculators) ? persisted.pinnedCalculators : []
    oldPins.forEach((pin, i) => {
        if (typeof pin === 'string') {
            const instanceId = `pin-${i + 1}`
            const src = instanceStates[instanceKey(pin, MAIN)]
            if (src) instanceStates[instanceKey(pin, instanceId)] = src
            if (pin === 'conveyorFlow' || pin === 'lineFlow') chains[instanceId] = JSON.parse(JSON.stringify(chains[MAIN]))
            pinnedCalculators.push({ toolId: pin, instanceId })
        } else if (pin && typeof pin === 'object' && 'toolId' in pin && 'instanceId' in pin) {
            pinnedCalculators.push(pin as PinnedCalc)
        }
    })
    return { instanceStates, chains, pinnedCalculators }
}
