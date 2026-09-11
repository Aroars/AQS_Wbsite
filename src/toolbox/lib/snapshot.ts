/**
 * Snapshots — one portable string for a card or the whole toolbox page.
 * @module lib/snapshot
 *
 * Format: `aqs1.` + base64url(JSON). The JSON carries a version, the kind
 * (card or page), a timestamp, and the data. Cards, links, pulls, the saved
 * list, and the copyable string all move this one shape around.
 */

import type { PinnedCalc, SavedConverter } from './types'
import type { FlowCard } from './calculators/infeedCard'

export const SNAPSHOT_PREFIX = 'aqs1.'
export const SNAPSHOT_VERSION = 1

export interface CardSnapshot {
    v: number
    kind: 'card'
    at: string
    tool: string
    /** The card's serialized state (as stored in instanceStates) */
    state: string | null
    /** Conveyor chain for the flow cards */
    chain?: FlowCard[]
}

export interface PageSnapshot {
    v: number
    kind: 'page'
    at: string
    instanceStates: Record<string, string>
    chains: Record<string, FlowCard[]>
    pinnedCalculators: PinnedCalc[]
    pinnedCharts: string[]
    savedConverters: SavedConverter[]
    converterStates: Record<string, { fromUnit: string; toUnit: string }>
    loadDefinition: string | null
}

export type Snapshot = CardSnapshot | PageSnapshot

function toBase64Url(s: string): string {
    const bytes = new TextEncoder().encode(s)
    let bin = ''
    bytes.forEach((b) => { bin += String.fromCharCode(b) })
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromBase64Url(s: string): string {
    const b64 = s.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (s.length % 4)) % 4)
    const bin = atob(b64)
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0))
    return new TextDecoder().decode(bytes)
}

export function encodeSnapshot(snap: Snapshot): string {
    return SNAPSHOT_PREFIX + toBase64Url(JSON.stringify(snap))
}

/** Parse a pasted code; null when it is not a snapshot we understand */
export function decodeSnapshot(code: string): Snapshot | null {
    const trimmed = code.trim()
    if (!trimmed.startsWith(SNAPSHOT_PREFIX)) return null
    try {
        const obj = JSON.parse(fromBase64Url(trimmed.slice(SNAPSHOT_PREFIX.length)))
        if (!obj || typeof obj !== 'object' || typeof obj.v !== 'number') return null
        if (obj.kind === 'card' && typeof obj.tool === 'string') return obj as CardSnapshot
        if (obj.kind === 'page' && obj.instanceStates && typeof obj.instanceStates === 'object') return obj as PageSnapshot
        return null
    } catch {
        return null
    }
}

export function cardSnapshot(tool: string, state: string | null, chain?: FlowCard[]): CardSnapshot {
    return { v: SNAPSHOT_VERSION, kind: 'card', at: new Date().toISOString(), tool, state, ...(chain ? { chain } : {}) }
}

/** Short label for a saved snapshot row */
export function describeSnapshot(snap: Snapshot): string {
    const when = new Date(snap.at)
    const stamp = Number.isNaN(when.getTime()) ? '' : when.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
    return snap.kind === 'page' ? `Page · ${stamp}` : `${snap.tool} · ${stamp}`
}
