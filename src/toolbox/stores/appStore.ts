import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SavedConverter, TabId, PinnedCalc, SavedSnapshot, CardLink } from '@/toolbox/lib/types'
import { instanceKey, MAIN, migrateToInstances } from './migrate'
import { cardSnapshot, encodeSnapshot, type CardSnapshot, type PageSnapshot, type Snapshot } from '@/toolbox/lib/snapshot'
import { generateId } from '@/toolbox/lib/utils'
import { unitCategories } from '@/toolbox/data/unitCategories'
import { patchInfeed, type FlowCard, type SolveFor } from '@/toolbox/lib/calculators/infeedCard'


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

    // Card instances: every calculator's persisted state, keyed by tool + instance ('main' on the
    // tab, 'pin-…' on Home). Serialized JSON per card, owned by the card component.
    instanceStates: Record<string, string>
    setInstanceState: (toolId: string, instanceId: string, json: string) => void
    clearInstanceState: (toolId: string, instanceId: string) => void
    /** Bumped when an instance's stored state was replaced from outside the card (clear, load, pull): the card re-reads it */
    epochs: Record<string, number>
    /** Bumped when the whole page was replaced (page snapshot load, clear all) */
    pageEpoch: number
    /** Clear one card back to its defaults (Home pins keep their slot) */
    resetInstance: (toolId: string, instanceId: string) => void
    /** Clear every card on the page (pins, converters and charts stay) */
    resetAllCards: () => void
    /** Snapshots: the saved list, and building / applying codes */
    snapshots: SavedSnapshot[]
    saveSnapshot: (name: string, snap: Snapshot) => void
    deleteSnapshot: (id: string) => void
    cardSnapshotOf: (toolId: string, instanceId: string) => CardSnapshot
    pageSnapshot: () => PageSnapshot
    applyCardSnapshot: (toolId: string, instanceId: string, snap: CardSnapshot) => boolean
    applyPageSnapshot: (snap: PageSnapshot) => void
    // Conveyor flow chains: card 0 is the infeed shared by Conveyor Speed and the Line Flow
    // Simulator; keyed by chain instance ('main' on the tab, a pin id on Home)
    chains: Record<string, FlowCard[]>
    setChain: (chainId: string, cards: FlowCard[]) => void
    /** Context line shown on the Conveyor Speed card after a handoff (not persisted) */
    infeedBanner: string | null
    setInfeedBanner: (msg: string | null) => void
    /** Fill an infeed chain from the throughput card's numbers (Conveyor Speed pull / link) */
    receiveInfeed: (payload: InfeedPayload, chainId?: string) => void
    /** Live links: target instance key → the source card it mirrors (persisted) */
    links: Record<string, CardLink>
    setLink: (toolId: string, instanceId: string, link: CardLink) => void
    clearLink: (toolId: string, instanceId: string) => void

    // Belt Pull calculator
    /** Section a deep link asked a tool to open (charts mount after the jump event fires; not persisted) */
    pendingSection: Record<string, string>
    setPendingSection: (toolId: string, section: string | null) => void
    /** One-shot cross-tool message: Belt Load card -> Belt Pull calculator, main instance (not persisted) */
    beltPullInbox: Record<string, unknown> | null
    sendToBeltPull: (patch: Record<string, unknown>) => void
    clearBeltPullInbox: () => void

    /**
     * The product as defined on the Belt Load card, published for the Conveyor Spec (incline /
     * flight solver) and Belt Pull cards to read. Serialized LoadDefinition (lib/calculators/loadDefinition).
     */
    loadDefinition: string | null
    setLoadDefinition: (json: string | null) => void

    /** One-shot cross-tool messages keyed by destination instance (not persisted); sends go to the tab instance */
    toolInbox: Record<string, Record<string, unknown> | null>
    sendToTool: (toolId: string, payload: Record<string, unknown>, instanceId?: string) => void
    clearToolInbox: (toolId: string, instanceId?: string) => void

    // Belt pull calibration log (serialized rows: conveyor/date/central/vendor/measured)
    beltPullCalLog: string | null
    setBeltPullCalLog: (json: string) => void

    // Pinning. Charts pin by id; calculators pin as independent instances (a copy of the source card).
    pinnedCharts: string[]
    pinnedCalculators: PinnedCalc[]
    /** User-given name per card instance key ('beltLoad#pin-…' → 'Line 3'), shown in the header and the From bar */
    cardTags: Record<string, string>
    setCardTag: (toolId: string, instanceId: string, tag: string) => void
    togglePinChart: (chartId: string) => void
    pinCalculator: (toolId: string, fromInstanceId?: string) => void
    unpinCalculator: (instanceId: string) => void
    /** id = chart id, or the pinned calculator's instance id */
    movePinned: (kind: 'chart' | 'calculator', id: string, dir: -1 | 1) => void
}

const defaultConverters: SavedConverter[] = [
    { id: generateId(), category: 'Length', fromUnit: 'Inch', toUnit: 'Millimeter', fromValue: '', toValue: '' },
    { id: generateId(), category: 'Weight', fromUnit: 'Pound', toUnit: 'Kilogram', fromValue: '', toValue: '' },
    { id: generateId(), category: 'Temperature', fromUnit: 'Fahrenheit', toUnit: 'Celsius', fromValue: '', toValue: '' },
]

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
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

            // Card instances
            instanceStates: {},
            setInstanceState: (toolId, instanceId, json) =>
                set((state) => {
                    const key = instanceKey(toolId, instanceId)
                    return state.instanceStates[key] === json ? state : { instanceStates: { ...state.instanceStates, [key]: json } }
                }),
            clearInstanceState: (toolId, instanceId) =>
                set((state) => {
                    const next = { ...state.instanceStates }
                    delete next[instanceKey(toolId, instanceId)]
                    return { instanceStates: next }
                }),
            chains: { [MAIN]: [] },
            setChain: (chainId, cards) => set((state) => ({ chains: { ...state.chains, [chainId]: cards } })),
            epochs: {},
            pageEpoch: 0,
            resetInstance: (toolId, instanceId) =>
                set((state) => {
                    const key = instanceKey(toolId, instanceId)
                    const instanceStates = { ...state.instanceStates }
                    delete instanceStates[key]
                    const chains = { ...state.chains }
                    if (toolId === 'conveyorFlow' || toolId === 'lineFlow') chains[instanceId] = []
                    return { instanceStates, chains, epochs: { ...state.epochs, [key]: (state.epochs[key] ?? 0) + 1 } }
                }),
            resetAllCards: () =>
                set((state) => ({ instanceStates: {}, chains: { [MAIN]: [] }, loadDefinition: null, toolInbox: {}, beltPullInbox: null, infeedBanner: null, links: {}, cardTags: {}, pageEpoch: state.pageEpoch + 1 })),
            snapshots: [],
            saveSnapshot: (name, snap) =>
                set((state) => ({ snapshots: [{ id: generateId(), name: name.trim() || (snap.kind === 'page' ? 'Page' : snap.tool), kind: snap.kind, tool: snap.kind === 'card' ? snap.tool : undefined, at: snap.at, code: encodeSnapshot(snap) }, ...state.snapshots].slice(0, 50) })),
            deleteSnapshot: (id) => set((state) => ({ snapshots: state.snapshots.filter((x) => x.id !== id) })),
            cardSnapshotOf: (toolId, instanceId) => {
                const state = get()
                const chain = toolId === 'conveyorFlow' || toolId === 'lineFlow' ? state.chains[instanceId] : undefined
                return cardSnapshot(toolId, state.instanceStates[instanceKey(toolId, instanceId)] ?? null, chain)
            },
            pageSnapshot: () => {
                const state = get()
                return {
                    v: 1, kind: 'page', at: new Date().toISOString(),
                    instanceStates: state.instanceStates, chains: state.chains,
                    pinnedCalculators: state.pinnedCalculators, pinnedCharts: state.pinnedCharts, cardTags: state.cardTags,
                    savedConverters: state.savedConverters, converterStates: state.converterStates, loadDefinition: state.loadDefinition,
                }
            },
            applyCardSnapshot: (toolId, instanceId, snap) => {
                if (snap.tool !== toolId) return false
                set((state) => {
                    const key = instanceKey(toolId, instanceId)
                    const instanceStates = { ...state.instanceStates }
                    if (snap.state) instanceStates[key] = snap.state
                    else delete instanceStates[key]
                    const chains = { ...state.chains }
                    if (snap.chain) chains[instanceId] = JSON.parse(JSON.stringify(snap.chain))
                    return { instanceStates, chains, epochs: { ...state.epochs, [key]: (state.epochs[key] ?? 0) + 1 } }
                })
                return true
            },
            applyPageSnapshot: (snap) =>
                set((state) => ({
                    instanceStates: { ...snap.instanceStates }, chains: { [MAIN]: [], ...snap.chains },
                    pinnedCalculators: snap.pinnedCalculators ?? [], pinnedCharts: snap.pinnedCharts ?? state.pinnedCharts, cardTags: snap.cardTags ?? {},
                    savedConverters: snap.savedConverters ?? state.savedConverters, converterStates: snap.converterStates ?? state.converterStates,
                    loadDefinition: snap.loadDefinition ?? null, toolInbox: {}, beltPullInbox: null, infeedBanner: null,
                    pageEpoch: state.pageEpoch + 1,
                })),
            infeedBanner: null,
            setInfeedBanner: (msg) => set({ infeedBanner: msg }),
            links: {},
            setLink: (toolId, instanceId, link) => set((state) => ({ links: { ...state.links, [instanceKey(toolId, instanceId)]: link } })),
            clearLink: (toolId, instanceId) =>
                set((state) => {
                    const links = { ...state.links }
                    delete links[instanceKey(toolId, instanceId)]
                    return { links }
                }),
            receiveInfeed: (p, chainId = MAIN) =>
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
                        chains: { ...state.chains, [chainId]: patchInfeed(state.chains[chainId] ?? [], inputs, units) },
                        ...(chainId === MAIN ? { infeedBanner: 'Loaded from Line Throughput — adjust speed or spacing here; Belt Pull pulls from this card.' } : {}),
                    }
                }),

            // Belt Pull calculator
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

            // Product definition published by the main Line Throughput card
            loadDefinition: null,
            setLoadDefinition: (json) => set({ loadDefinition: json }),

            // One-shot inboxes, keyed by instance
            toolInbox: {},
            sendToTool: (toolId, payload, instanceId = MAIN) => set((state) => ({ toolInbox: { ...state.toolInbox, [instanceKey(toolId, instanceId)]: payload } })),
            clearToolInbox: (toolId, instanceId = MAIN) => set((state) => ({ toolInbox: { ...state.toolInbox, [instanceKey(toolId, instanceId)]: null } })),

            // Belt pull calibration log
            beltPullCalLog: null,
            setBeltPullCalLog: (json) => set({ beltPullCalLog: json }),

            // Pinning
            pinnedCharts: [],
            pinnedCalculators: [],
            cardTags: {},
            setCardTag: (toolId, instanceId, tag) =>
                set((state) => {
                    const cardTags = { ...state.cardTags }
                    const key = instanceKey(toolId, instanceId)
                    const t = tag.trim()
                    if (t) cardTags[key] = t
                    else delete cardTags[key]
                    return { cardTags }
                }),
            togglePinChart: (chartId) =>
                set((state) => ({
                    pinnedCharts: state.pinnedCharts.includes(chartId)
                        ? state.pinnedCharts.filter((id) => id !== chartId)
                        : [...state.pinnedCharts, chartId],
                })),
            pinCalculator: (toolId, fromInstanceId = MAIN) =>
                set((state) => {
                    const instanceId = `pin-${generateId()}`
                    const instanceStates = { ...state.instanceStates }
                    const src = instanceStates[instanceKey(toolId, fromInstanceId)]
                    if (src) instanceStates[instanceKey(toolId, instanceId)] = src
                    const chains = { ...state.chains }
                    if (toolId === 'conveyorFlow' || toolId === 'lineFlow') chains[instanceId] = JSON.parse(JSON.stringify(state.chains[fromInstanceId] ?? state.chains[MAIN] ?? []))
                    return { instanceStates, chains, pinnedCalculators: [...state.pinnedCalculators, { toolId, instanceId }] }
                }),
            unpinCalculator: (instanceId) =>
                set((state) => {
                    const pin = state.pinnedCalculators.find((p) => p.instanceId === instanceId)
                    if (!pin) return state
                    const instanceStates = { ...state.instanceStates }
                    delete instanceStates[instanceKey(pin.toolId, instanceId)]
                    const chains = { ...state.chains }
                    delete chains[instanceId]
                    const cardTags = { ...state.cardTags }
                    delete cardTags[instanceKey(pin.toolId, instanceId)]
                    return { instanceStates, chains, cardTags, pinnedCalculators: state.pinnedCalculators.filter((p) => p.instanceId !== instanceId) }
                }),
            movePinned: (kind, id, dir) =>
                set((state) => {
                    if (kind === 'chart') {
                        const arr = [...state.pinnedCharts]
                        const from = arr.indexOf(id); const to = from + dir
                        if (from === -1 || to < 0 || to >= arr.length) return state
                        arr.splice(to, 0, arr.splice(from, 1)[0])
                        return { pinnedCharts: arr }
                    }
                    const arr = [...state.pinnedCalculators]
                    const from = arr.findIndex((p) => p.instanceId === id); const to = from + dir
                    if (from === -1 || to < 0 || to >= arr.length) return state
                    arr.splice(to, 0, arr.splice(from, 1)[0])
                    return { pinnedCalculators: arr }
                }),
        }),
        {
            name: 'engineering-toolbox',
            // Versioned so future shape changes can migrate instead of silently
            // misreading (or discarding) a user's persisted work
            version: 3,
            migrate: (persisted, version) => {
                const state = persisted as AppState & Record<string, unknown>
                // v3: every calculator is an instance; old per-tool slices and mirror pins are converted
                if (version < 3) return { ...state, ...migrateToInstances(state as Parameters<typeof migrateToInstances>[0]) }
                return state
            },
            partialize: (state) => ({
                activeTab: state.activeTab,
                savedConverters: state.savedConverters,
                converterStates: state.converterStates,
                instanceStates: state.instanceStates,
                chains: state.chains,
                loadDefinition: state.loadDefinition,
                beltPullCalLog: state.beltPullCalLog,
                pinnedCharts: state.pinnedCharts,
                cardTags: state.cardTags,
                pinnedCalculators: state.pinnedCalculators,
                snapshots: state.snapshots,
                links: state.links,
            }),
        }
    )
)
