import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SavedConverter, TabId } from '@/toolbox/lib/types'
import { generateId } from '@/toolbox/lib/utils'
import { unitCategories } from '@/toolbox/data/unitCategories'
import { patchInfeed, type FlowCard, type SolveFor } from '@/toolbox/lib/calculators/infeedCard'

interface AreaMemoryEntry {
    id: string
    shape: string
    dimensions: number[]
    area: number
    unit: string
}

interface FlowHistoryEntry {
    id: string
    expression: string
    result: number
    label?: string
}

interface FormulaHistoryEntry {
    id: string
    expression: string
    result: number
    variable?: string
    label?: string
}

interface PowerEquipment {
    id: string
    label: string
    watts: number
    quantity: number
    type: 'ac' | 'dc'
    voltage?: number
    phase?: number
}


export interface InfeedPayload {
    ppm: number
    weightLb: number | null
    lengthIn: number | null
    gapIn: number | null
    speedFpm: number | null
}

interface AppState {
    // Navigation
    activeTab: TabId
    setActiveTab: (tab: TabId) => void

    // Converters
    savedConverters: SavedConverter[]
    converterStates: Record<string, { fromUnit: string; toUnit: string }>
    addConverter: (category: string) => void
    rememberConverterUnits: (category: string, fromUnit: string, toUnit: string) => void
    removeConverter: (id: string) => void
    duplicateConverter: (id: string) => void
    updateConverter: (id: string, updates: Partial<SavedConverter>) => void
    reorderConverters: (fromIndex: number, toIndex: number) => void

    // Area Calculator
    areaMemory: AreaMemoryEntry[]
    addAreaMemory: (entry: Omit<AreaMemoryEntry, 'id'>) => void
    removeAreaMemory: (id: string) => void
    clearAreaMemory: () => void

    // Expression Calculator
    calculatorMode: 'flow' | 'formula'
    setCalculatorMode: (mode: 'flow' | 'formula') => void
    flowHistory: FlowHistoryEntry[]
    flowLastAnswer: number
    addFlowEntry: (entry: Omit<FlowHistoryEntry, 'id'>) => void
    removeFlowEntry: (id: string) => void
    clearFlowHistory: () => void
    setFlowLastAnswer: (val: number) => void
    formulaHistory: FormulaHistoryEntry[]
    formulaLastAnswer: number
    addFormulaEntry: (entry: Omit<FormulaHistoryEntry, 'id'>) => void
    removeFormulaEntry: (id: string) => void
    clearFormulaHistory: () => void
    setFormulaLastAnswer: (val: number) => void

    // Power Calculator
    powerEquipment: PowerEquipment[]
    addPowerEquipment: (eq: Omit<PowerEquipment, 'id'>) => void
    removePowerEquipment: (id: string) => void
    updatePowerEquipment: (id: string, updates: Partial<PowerEquipment>) => void
    clearPowerEquipment: () => void

    // Conveyor flow chain: card 0 is the infeed shared by Conveyor Speed and the Line Flow
    // Simulator (cards are always written as a whole recalculated chain)
    conveyorCards: FlowCard[]
    setConveyorCards: (cards: FlowCard[]) => void
    clearConveyorCards: () => void
    /** Context line shown on the Conveyor Speed card after a handoff (not persisted) */
    infeedBanner: string | null
    setInfeedBanner: (msg: string | null) => void
    /** Line Throughput → Conveyor Speed: fill the infeed from the throughput card's numbers */
    receiveInfeed: (payload: InfeedPayload) => void

    // Belt Pull calculator (serialized BeltPullConfig — owned by lib/calculators/beltPull)
    beltPullConfig: string | null
    setBeltPullConfig: (json: string) => void
    /** Section a deep link asked a tool to open (charts mount after the jump event fires; not persisted) */
    pendingSection: Record<string, string>
    setPendingSection: (toolId: string, section: string | null) => void
    /** One-shot cross-tool message: Belt Load card -> Belt Pull calculator (not persisted) */
    beltPullInbox: Record<string, unknown> | null
    sendToBeltPull: (patch: Record<string, unknown>) => void
    clearBeltPullInbox: () => void

    // Belt Load converter (serialized inputs)
    beltLoadState: string | null
    setBeltLoadState: (json: string) => void
    /**
     * The product as defined on the Belt Load card, published for the Conveyor Spec (incline /
     * flight solver) and Belt Pull cards to read. Serialized LoadDefinition (lib/calculators/loadDefinition).
     */
    loadDefinition: string | null
    setLoadDefinition: (json: string | null) => void

    /** Per-tool persisted state for the newer cards (serialized JSON), keyed by tool id */
    toolStates: Record<string, string>
    setToolState: (toolId: string, json: string) => void
    /** One-shot cross-tool messages keyed by destination tool id (not persisted) */
    toolInbox: Record<string, Record<string, unknown> | null>
    sendToTool: (toolId: string, payload: Record<string, unknown>) => void
    clearToolInbox: (toolId: string) => void

    // Wearstrip span calculator (serialized WearstripConfig)
    wearstripConfig: string | null
    setWearstripConfig: (json: string) => void

    // Belt pull calibration log (serialized rows: conveyor/date/central/vendor/measured)
    beltPullCalLog: string | null
    setBeltPullCalLog: (json: string) => void

    // Pinning
    pinnedCharts: string[]
    pinnedCalculators: string[]
    togglePinChart: (chartId: string) => void
    togglePinCalculator: (calcId: string) => void
    movePinned: (kind: 'chart' | 'calculator', id: string, dir: -1 | 1) => void
}

const defaultConverters: SavedConverter[] = [
    { id: generateId(), category: 'Length', fromUnit: 'Inch', toUnit: 'Millimeter', fromValue: '', toValue: '' },
    { id: generateId(), category: 'Weight', fromUnit: 'Pound', toUnit: 'Kilogram', fromValue: '', toValue: '' },
    { id: generateId(), category: 'Temperature', fromUnit: 'Fahrenheit', toUnit: 'Celsius', fromValue: '', toValue: '' },
]

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            // Navigation
            activeTab: 'home',
            setActiveTab: (tab) => set({ activeTab: tab }),

            // Converters
            savedConverters: defaultConverters,
            converterStates: {},
            addConverter: (category) =>
                set((state) => {
                    // Prefer the user's last-used units for this category, else first two units
                    const unitNames = Object.keys(unitCategories[category]?.units ?? {})
                    const remembered = state.converterStates[category]
                    return {
                        savedConverters: [...state.savedConverters, {
                            id: generateId(), category,
                            fromUnit: remembered?.fromUnit ?? unitNames[0] ?? '',
                            toUnit: remembered?.toUnit ?? unitNames[1] ?? unitNames[0] ?? '',
                            fromValue: '', toValue: '',
                        }],
                    }
                }),
            rememberConverterUnits: (category, fromUnit, toUnit) =>
                set((state) => ({ converterStates: { ...state.converterStates, [category]: { fromUnit, toUnit } } })),
            removeConverter: (id) => set((state) => ({ savedConverters: state.savedConverters.filter((c) => c.id !== id) })),
            duplicateConverter: (id) =>
                set((state) => {
                    const orig = state.savedConverters.find((c) => c.id === id)
                    if (!orig) return state
                    const idx = state.savedConverters.findIndex((c) => c.id === id)
                    const arr = [...state.savedConverters]
                    arr.splice(idx + 1, 0, { ...orig, id: generateId() })
                    return { savedConverters: arr }
                }),
            updateConverter: (id, updates) =>
                set((state) => ({ savedConverters: state.savedConverters.map((c) => c.id === id ? { ...c, ...updates } : c) })),
            reorderConverters: (fromIndex, toIndex) =>
                set((state) => {
                    const arr = [...state.savedConverters]
                    const [moved] = arr.splice(fromIndex, 1)
                    arr.splice(toIndex, 0, moved)
                    return { savedConverters: arr }
                }),

            // Area Calculator
            areaMemory: [],
            addAreaMemory: (entry) => set((state) => ({ areaMemory: [...state.areaMemory, { ...entry, id: generateId() }] })),
            removeAreaMemory: (id) => set((state) => ({ areaMemory: state.areaMemory.filter((e) => e.id !== id) })),
            clearAreaMemory: () => set({ areaMemory: [] }),

            // Expression Calculator
            calculatorMode: 'flow',
            setCalculatorMode: (mode) => set({ calculatorMode: mode }),
            flowHistory: [],
            flowLastAnswer: 0,
            addFlowEntry: (entry) => set((state) => ({ flowHistory: [...state.flowHistory, { ...entry, id: generateId() }] })),
            removeFlowEntry: (id) => set((state) => ({ flowHistory: state.flowHistory.filter((e) => e.id !== id) })),
            clearFlowHistory: () => set({ flowHistory: [], flowLastAnswer: 0 }),
            setFlowLastAnswer: (val) => set({ flowLastAnswer: val }),
            formulaHistory: [],
            formulaLastAnswer: 0,
            addFormulaEntry: (entry) => set((state) => ({ formulaHistory: [...state.formulaHistory, { ...entry, id: generateId() }] })),
            removeFormulaEntry: (id) => set((state) => ({ formulaHistory: state.formulaHistory.filter((e) => e.id !== id) })),
            clearFormulaHistory: () => set({ formulaHistory: [], formulaLastAnswer: 0 }),
            setFormulaLastAnswer: (val) => set({ formulaLastAnswer: val }),

            // Power Calculator
            powerEquipment: [],
            addPowerEquipment: (eq) => set((state) => ({ powerEquipment: [...state.powerEquipment, { ...eq, id: generateId() }] })),
            removePowerEquipment: (id) => set((state) => ({ powerEquipment: state.powerEquipment.filter((e) => e.id !== id) })),
            updatePowerEquipment: (id, updates) =>
                set((state) => ({ powerEquipment: state.powerEquipment.map((e) => e.id === id ? { ...e, ...updates } : e) })),
            clearPowerEquipment: () => set({ powerEquipment: [] }),

            // Conveyor flow chain
            conveyorCards: [],
            setConveyorCards: (cards) => set({ conveyorCards: cards }),
            clearConveyorCards: () => set({ conveyorCards: [] }),
            infeedBanner: null,
            setInfeedBanner: (msg) => set({ infeedBanner: msg }),
            receiveInfeed: (p) =>
                set((state) => {
                    // Belt speed becomes the solved target unless it was sent without the geometry
                    // that would re-derive it — then keep the speed and solve the gap instead.
                    const geometry = p.lengthIn !== null && p.gapIn !== null
                    const solveFor: SolveFor = p.speedFpm !== null && !geometry ? 'gap' : 'speed'
                    const inputs: Record<string, number | string | null> = { solveFor, productRate: p.ppm }
                    if (p.weightLb !== null) inputs.productWeight = p.weightLb
                    if (p.lengthIn !== null) inputs.productLength = p.lengthIn
                    if (solveFor === 'gap') {
                        inputs.productGap = null
                        inputs.productSpeed = p.speedFpm
                    } else {
                        inputs.productSpeed = null
                        if (p.gapIn !== null) inputs.productGap = p.gapIn
                    }
                    const units = { productRate: '/min', productLength: 'in', productGap: 'in', productWeight: 'lb', productSpeed: 'ft/min' }
                    return {
                        conveyorCards: patchInfeed(state.conveyorCards, inputs, units),
                        infeedBanner: 'Loaded from Line Throughput — adjust speed or spacing, then send to Belt Pull.',
                    }
                }),

            // Belt Pull calculator
            beltPullConfig: null,
            setBeltPullConfig: (json) => set({ beltPullConfig: json }),
            pendingSection: {},
            setPendingSection: (toolId, section) =>
                set((state) => {
                    const next = { ...state.pendingSection }
                    if (section) next[toolId] = section
                    else delete next[toolId]
                    return { pendingSection: next }
                }),
            beltPullInbox: null,
            sendToBeltPull: (patch) => set({ beltPullInbox: patch }),
            clearBeltPullInbox: () => set({ beltPullInbox: null }),

            // Belt Load converter
            beltLoadState: null,
            setBeltLoadState: (json) => set({ beltLoadState: json }),
            loadDefinition: null,
            setLoadDefinition: (json) => set({ loadDefinition: json }),

            // Newer cards: per-tool state and one-shot inboxes
            toolStates: {},
            setToolState: (toolId, json) => set((state) => (state.toolStates[toolId] === json ? state : { toolStates: { ...state.toolStates, [toolId]: json } })),
            toolInbox: {},
            sendToTool: (toolId, payload) => set((state) => ({ toolInbox: { ...state.toolInbox, [toolId]: payload } })),
            clearToolInbox: (toolId) => set((state) => ({ toolInbox: { ...state.toolInbox, [toolId]: null } })),

            // Wearstrip span calculator
            wearstripConfig: null,
            setWearstripConfig: (json) => set({ wearstripConfig: json }),

            // Belt pull calibration log
            beltPullCalLog: null,
            setBeltPullCalLog: (json) => set({ beltPullCalLog: json }),

            // Pinning
            pinnedCharts: [],
            pinnedCalculators: [],
            togglePinChart: (chartId) =>
                set((state) => ({
                    pinnedCharts: state.pinnedCharts.includes(chartId)
                        ? state.pinnedCharts.filter((id) => id !== chartId)
                        : [...state.pinnedCharts, chartId],
                })),
            togglePinCalculator: (calcId) =>
                set((state) => ({
                    pinnedCalculators: state.pinnedCalculators.includes(calcId)
                        ? state.pinnedCalculators.filter((id) => id !== calcId)
                        : [...state.pinnedCalculators, calcId],
                })),
            movePinned: (kind, id, dir) =>
                set((state) => {
                    const key = kind === 'chart' ? 'pinnedCharts' : 'pinnedCalculators'
                    const arr = [...state[key]]
                    const from = arr.indexOf(id)
                    const to = from + dir
                    if (from === -1 || to < 0 || to >= arr.length) return state
                    arr.splice(to, 0, arr.splice(from, 1)[0])
                    return { [key]: arr }
                }),
        }),
        {
            name: 'engineering-toolbox',
            // Versioned so future shape changes can migrate instead of silently
            // misreading (or discarding) a user's persisted work
            version: 2,
            migrate: (persisted, version) => {
                const state = persisted as AppState
                // v2: per-tool state map for the cards added in September 2026
                if (version < 2) return { ...state, toolStates: state.toolStates ?? {} }
                return state
            },
            partialize: (state) => ({
                activeTab: state.activeTab,
                savedConverters: state.savedConverters,
                converterStates: state.converterStates,
                areaMemory: state.areaMemory,
                calculatorMode: state.calculatorMode,
                flowHistory: state.flowHistory,
                flowLastAnswer: state.flowLastAnswer,
                formulaHistory: state.formulaHistory,
                formulaLastAnswer: state.formulaLastAnswer,
                powerEquipment: state.powerEquipment,
                conveyorCards: state.conveyorCards,
                beltPullConfig: state.beltPullConfig,
                beltLoadState: state.beltLoadState,
                loadDefinition: state.loadDefinition,
                toolStates: state.toolStates,
                wearstripConfig: state.wearstripConfig,
                beltPullCalLog: state.beltPullCalLog,
                pinnedCharts: state.pinnedCharts,
                pinnedCalculators: state.pinnedCalculators,
            }),
        }
    )
)
